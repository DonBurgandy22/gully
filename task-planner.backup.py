import json
import re
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(r"C:\Burgandy")
INBOX = ROOT / "task-inbox"
PLANS = ROOT / "task-plans"


def now_id(prefix: str) -> str:
    return datetime.now().strftime(f"{prefix}-%Y%m%d-%H%M%S")


def ensure_dirs():
    INBOX.mkdir(parents=True, exist_ok=True)
    PLANS.mkdir(parents=True, exist_ok=True)


def normalize_target(target: str) -> str:
    target = target.strip().strip('"').strip("'")
    if re.match(r"^[A-Za-z]:\\", target):
        return target
    return str((ROOT / target).resolve())


def extract_task_text(message: str):
    raw = message.strip()
    if not raw.lower().startswith("task:"):
        return None
    return raw[5:].strip()


def split_steps(task_text: str):
    parts = re.split(r"\s+(?:and then|then)\s+", task_text, flags=re.IGNORECASE)
    return [p.strip() for p in parts if p.strip()]


def compile_step(step_text: str, step_index: int, plan_id: str) -> dict:
    raw = step_text.strip()

    patterns = [
        (r"(?:write|create)\s+(?:file\s+)?(.+?)\s+with\s+(.+)", "write"),
        (r"(?:read)\s+(?:file\s+)?(.+)", "read"),
        (r"(?:verify|check)\s+(?:file\s+)?(.+?)\s+contains\s+(.+)", "verify_contains"),
        (r"(?:verify|check)\s+(?:file\s+)?(.+)", "verify"),
        (r"(?:execute|run)\s+(.+)", "execute"),
    ]

    for pattern, kind in patterns:
        m = re.fullmatch(pattern, raw, flags=re.IGNORECASE | re.DOTALL)
        if not m:
            continue

        task_id = f"{plan_id}-step-{step_index:02d}"

        if kind == "write":
            return {
                "task_id": task_id,
                "task_type": "write",
                "target": normalize_target(m.group(1)),
                "content": m.group(2),
                "plan_id": plan_id,
                "step_index": step_index,
                "source_text": raw,
            }

        if kind == "read":
            return {
                "task_id": task_id,
                "task_type": "read",
                "target": normalize_target(m.group(1)),
                "plan_id": plan_id,
                "step_index": step_index,
                "source_text": raw,
            }

        if kind == "verify_contains":
            return {
                "task_id": task_id,
                "task_type": "verify",
                "target": normalize_target(m.group(1)),
                "expected_content": m.group(2),
                "plan_id": plan_id,
                "step_index": step_index,
                "source_text": raw,
            }

        if kind == "verify":
            return {
                "task_id": task_id,
                "task_type": "verify",
                "target": normalize_target(m.group(1)),
                "plan_id": plan_id,
                "step_index": step_index,
                "source_text": raw,
            }

        if kind == "execute":
            return {
                "task_id": task_id,
                "task_type": "execute",
                "target": normalize_target(m.group(1)),
                "attempt": 1,
                "max_retries": 0,
                "plan_id": plan_id,
                "step_index": step_index,
                "source_text": raw,
            }

    return {
        "task_id": f"{plan_id}-step-{step_index:02d}",
        "task_type": "blocked",
        "target": "",
        "reason": "Unsupported step format",
        "plan_id": plan_id,
        "step_index": step_index,
        "source_text": raw,
    }


def save_task(task: dict) -> Path:
    path = INBOX / f"{task['task_id']}.json"
    path.write_text(json.dumps(task, indent=2), encoding="utf-8")
    return path


def save_plan(plan: dict) -> Path:
    path = PLANS / f"{plan['plan_id']}.json"
    path.write_text(json.dumps(plan, indent=2), encoding="utf-8")
    return path


def main():
    if len(sys.argv) > 1:
        incoming = " ".join(sys.argv[1:]).strip()
    else:
        incoming = sys.stdin.read().strip()

    if not incoming:
        print("NO_INPUT")
        return

    task_text = extract_task_text(incoming)
    if task_text is None:
        print("IGNORED")
        return

    if not task_text:
        print("EMPTY_TASK")
        return

    ensure_dirs()

    plan_id = now_id("plan")
    steps = split_steps(task_text)
    compiled_tasks = []

    for index, step_text in enumerate(steps, start=1):
        task = compile_step(step_text, index, plan_id)
        compiled_tasks.append(task)
        save_task(task)

    plan = {
        "plan_id": plan_id,
        "source_message": incoming,
        "step_count": len(compiled_tasks),
        "steps": [
            {
                "task_id": t["task_id"],
                "task_type": t["task_type"],
                "target": t.get("target", ""),
                "source_text": t.get("source_text", ""),
            }
            for t in compiled_tasks
        ],
    }

    plan_path = save_plan(plan)

    print(f"PLAN:{plan_path}")
    print(f"TASKS_CREATED:{len(compiled_tasks)}")


if __name__ == "__main__":
    main()
