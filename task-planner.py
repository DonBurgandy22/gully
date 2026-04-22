import json
import re
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(r"C:\Burgandy")
PLANS = ROOT / "task-plans"
INBOX = ROOT / "task-inbox"


def now_id():
    return datetime.now().strftime("%Y%m%d-%H%M%S")


def ensure_dirs():
    PLANS.mkdir(parents=True, exist_ok=True)
    INBOX.mkdir(parents=True, exist_ok=True)


def normalize_target(t):
    t = t.strip().strip('"').strip("'")
    if re.match(r"^[A-Za-z]:\\", t):
        return t
    return str((ROOT / t).resolve())


def split_task_text(text):
    return [p.strip(" .") for p in re.split(r"\s+(?:and then|then|after that|next|and)\s+", text, flags=re.IGNORECASE) if p.strip(" .")]


def extract_condition(raw):
    text = raw.strip()

    m = re.search(r"\s+if it fails retry once$", text, re.IGNORECASE)
    if m:
        return text[:m.start()].strip(), {"on_failure": "retry", "retry_limit": 1}

    m = re.search(r"\s+if it fails retry twice$", text, re.IGNORECASE)
    if m:
        return text[:m.start()].strip(), {"on_failure": "retry", "retry_limit": 2}

    m = re.search(r"\s+if it fails stop$", text, re.IGNORECASE)
    if m:
        return text[:m.start()].strip(), {"on_failure": "stop"}

    m = re.search(r"\s+if it doesn't exist create it$", text, re.IGNORECASE)
    if m:
        return text[:m.start()].strip(), {"on_failure": "create_if_missing"}

    m = re.search(r"\s+if it does not exist create it$", text, re.IGNORECASE)
    if m:
        return text[:m.start()].strip(), {"on_failure": "create_if_missing"}

    return text, {}


def parse_single_step(raw, step_number, context):
    raw = raw.strip()
    raw_core, conditions = extract_condition(raw)

    last_target = context.get("last_target")
    last_write_content = context.get("last_write_content")
    last_execute_target = context.get("last_execute_target")

    if re.fullmatch(r"(?:check if it worked|check if that worked|confirm it worked|confirm that worked|did it work|make sure that worked)", raw_core, re.IGNORECASE):
        if last_target:
            step = {
                "task_id": f"STEP-{step_number:02d}",
                "task_type": "verify",
                "target": last_target,
                "source_text": raw
            }
            if last_write_content is not None:
                step["expected_content"] = last_write_content
            step.update(conditions)
            return step

    if re.fullmatch(r"(?:tell me what happened|what happened|summarize what happened|give me the result|what was the output)", raw_core, re.IGNORECASE):
        if last_execute_target:
            step = {
                "task_id": f"STEP-{step_number:02d}",
                "task_type": "execute",
                "target": last_execute_target,
                "attempt": 1,
                "max_retries": 0,
                "source_text": raw
            }
            step.update(conditions)
            return step
        if last_target:
            step = {
                "task_id": f"STEP-{step_number:02d}",
                "task_type": "read",
                "target": last_target,
                "source_text": raw
            }
            step.update(conditions)
            return step

    if re.fullmatch(r"(?:tell me what's inside it|tell me what is inside it|what's inside it|what is inside it)", raw_core, re.IGNORECASE):
        if last_target:
            step = {
                "task_id": f"STEP-{step_number:02d}",
                "task_type": "read",
                "target": last_target,
                "source_text": raw
            }
            step.update(conditions)
            return step

    patterns = [
        (r"(?:write|create|make|save|store|put|add|update|overwrite)\s+(?:file\s+)?(.+?)\s+with\s+(.+)", "write"),
        (r"(?:read|show|open|display|view|print)\s+(?:file\s+)?(.+)", "read"),
        (r"(?:tell me what's inside|tell me what is inside|what's inside|what is inside)\s+(.+)", "read"),
        (r"(?:verify|check|confirm|ensure)\s+(?:file\s+)?(.+?)\s+contains\s+(.+)", "verify_contains"),
        (r"(?:verify|check|confirm|ensure)\s+(?:file\s+)?(.+)", "verify"),
        (r"(?:run|execute|start|launch)\s+(.+)", "execute"),
    ]

    for pattern, kind in patterns:
        m = re.fullmatch(pattern, raw_core, re.IGNORECASE | re.DOTALL)
        if not m:
            continue

        if kind == "write":
            target = normalize_target(m.group(1))
            content = m.group(2).strip()
            context["last_target"] = target
            context["last_write_content"] = content
            step = {
                "task_id": f"STEP-{step_number:02d}",
                "task_type": "write",
                "target": target,
                "content": content,
                "source_text": raw
            }
            step.update(conditions)
            return step

        if kind == "read":
            target = normalize_target(m.group(1))
            context["last_target"] = target
            step = {
                "task_id": f"STEP-{step_number:02d}",
                "task_type": "read",
                "target": target,
                "source_text": raw
            }
            step.update(conditions)
            return step

        if kind == "verify_contains":
            target = normalize_target(m.group(1))
            expected = m.group(2).strip()
            context["last_target"] = target
            step = {
                "task_id": f"STEP-{step_number:02d}",
                "task_type": "verify",
                "target": target,
                "expected_content": expected,
                "source_text": raw
            }
            step.update(conditions)
            return step

        if kind == "verify":
            target = normalize_target(m.group(1))
            context["last_target"] = target
            step = {
                "task_id": f"STEP-{step_number:02d}",
                "task_type": "verify",
                "target": target,
                "source_text": raw
            }
            step.update(conditions)
            return step

        if kind == "execute":
            target = normalize_target(m.group(1))
            context["last_target"] = target
            context["last_execute_target"] = target
            step = {
                "task_id": f"STEP-{step_number:02d}",
                "task_type": "execute",
                "target": target,
                "attempt": 1,
                "max_retries": 0,
                "source_text": raw
            }
            step.update(conditions)
            return step

    step = {
        "task_id": f"STEP-{step_number:02d}",
        "task_type": "blocked",
        "target": "",
        "source_text": raw,
        "reason": "Unsupported step format"
    }
    step.update(conditions)
    return step


def build_plan(text):
    plan_id = f"plan-{now_id()}"
    raw_steps = split_task_text(text)
    steps = []
    context = {
        "last_target": None,
        "last_write_content": None,
        "last_execute_target": None,
    }

    for i, raw_step in enumerate(raw_steps, start=1):
        steps.append(parse_single_step(raw_step, i, context))

    for i, step in enumerate(steps, start=1):
        step["task_id"] = f"{plan_id}-step-{i:02d}"

    return {
        "plan_id": plan_id,
        "created_at": datetime.now().isoformat(),
        "source_message": f"task: {text}",
        "step_count": len(steps),
        "steps": steps
    }


def save_plan(plan):
    path = PLANS / f"{plan['plan_id']}.json"
    path.write_text(json.dumps(plan, indent=2), encoding="utf-8")
    return path


def main():
    ensure_dirs()

    if len(sys.argv) > 1:
        text = " ".join(sys.argv[1:])
    else:
        text = sys.stdin.read()

    text = text.strip()
    if not text.lower().startswith("task:"):
        print("IGNORED")
        return

    text = text[5:].strip()
    if not text:
        print("EMPTY_TASK")
        return

    plan = build_plan(text)
    path = save_plan(plan)

    print(f"PLAN:{path}")
    print(f"TASKS_CREATED:{len(plan['steps'])}")


if __name__ == "__main__":
    main()
