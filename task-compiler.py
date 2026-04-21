import json
import re
from datetime import datetime
from pathlib import Path

ROOT = Path(r"C:\Burgandy")
INBOX = ROOT / "task-inbox"


def now_task_id():
    return datetime.now().strftime("task-%Y%m%d-%H%M%S")


def ensure_inbox():
    INBOX.mkdir(parents=True, exist_ok=True)


def normalize_target(target: str) -> str:
    target = target.strip().strip('"').strip("'")
    if re.match(r"^[A-Za-z]:\\", target):
        return target
    return str((ROOT / target).resolve())


def build_task_from_text(text: str) -> dict:
    raw = text.strip()

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

        if kind == "write":
            target = normalize_target(m.group(1))
            content = m.group(2)
            return {
                "task_id": now_task_id(),
                "task_type": "write",
                "target": target,
                "content": content,
            }

        if kind == "read":
            target = normalize_target(m.group(1))
            return {
                "task_id": now_task_id(),
                "task_type": "read",
                "target": target,
            }

        if kind == "verify_contains":
            target = normalize_target(m.group(1))
            expected_content = m.group(2)
            return {
                "task_id": now_task_id(),
                "task_type": "verify",
                "target": target,
                "expected_content": expected_content,
            }

        if kind == "verify":
            target = normalize_target(m.group(1))
            return {
                "task_id": now_task_id(),
                "task_type": "verify",
                "target": target,
            }

        if kind == "execute":
            target = normalize_target(m.group(1))
            return {
                "task_id": now_task_id(),
                "task_type": "execute",
                "target": target,
                "attempt": 1,
                "max_retries": 0,
            }

    return {
        "task_id": now_task_id(),
        "task_type": "blocked",
        "target": "",
        "source_text": raw,
        "reason": "Unsupported task format",
    }


def save_task(task: dict) -> Path:
    ensure_inbox()
    task_id = task["task_id"]
    path = INBOX / f"{task_id}.json"
    path.write_text(json.dumps(task, indent=2), encoding="utf-8")
    return path


def main():
    text = input("TASK> ").strip()
    if not text:
        print("NO_INPUT")
        return

    task = build_task_from_text(text)
    path = save_task(task)
    print(f"CREATED:{path}")


if __name__ == "__main__":
    main()
