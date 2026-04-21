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
    return [p.strip() for p in re.split(r"\s+(?:and then|then)\s+", text, flags=re.IGNORECASE) if p.strip()]


def parse_single_step(raw, step_number):
    m = re.fullmatch(r"(?:write|create)\s+(?:file\s+)?(.+?)\s+with\s+(.+)", raw, re.IGNORECASE | re.DOTALL)
    if m:
        return {
            "task_id": f"STEP-{step_number:02d}",
            "task_type": "write",
            "target": normalize_target(m.group(1)),
            "content": m.group(2).strip(),
            "source_text": raw
        }

    m = re.fullmatch(r"(?:read)\s+(?:file\s+)?(.+)", raw, re.IGNORECASE | re.DOTALL)
    if m:
        return {
            "task_id": f"STEP-{step_number:02d}",
            "task_type": "read",
            "target": normalize_target(m.group(1)),
            "source_text": raw
        }

    m = re.fullmatch(r"(?:verify|check)\s+(?:file\s+)?(.+?)\s+contains\s+(.+)", raw, re.IGNORECASE | re.DOTALL)
    if m:
        return {
            "task_id": f"STEP-{step_number:02d}",
            "task_type": "verify",
            "target": normalize_target(m.group(1)),
            "expected_content": m.group(2).strip(),
            "source_text": raw
        }

    m = re.fullmatch(r"(?:verify|check)\s+(?:file\s+)?(.+)", raw, re.IGNORECASE | re.DOTALL)
    if m:
        return {
            "task_id": f"STEP-{step_number:02d}",
            "task_type": "verify",
            "target": normalize_target(m.group(1)),
            "source_text": raw
        }

    m = re.fullmatch(r"(?:run|execute)\s+(.+)", raw, re.IGNORECASE | re.DOTALL)
    if m:
        return {
            "task_id": f"STEP-{step_number:02d}",
            "task_type": "execute",
            "target": normalize_target(m.group(1)),
            "attempt": 1,
            "max_retries": 0,
            "source_text": raw
        }

    return {
        "task_id": f"STEP-{step_number:02d}",
        "task_type": "blocked",
        "target": "",
        "source_text": raw,
        "reason": "Unsupported step format"
    }


def build_plan(text):
    plan_id = f"plan-{now_id()}"
    raw_steps = split_task_text(text)
    steps = []

    for i, raw_step in enumerate(raw_steps, start=1):
        steps.append(parse_single_step(raw_step, i))

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
