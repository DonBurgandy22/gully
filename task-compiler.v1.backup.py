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
    lowered = raw.lower()

    m = re.fullmatch(r"write\s+(.+?)\s+with\s+(.+)", raw, flags=re.IGNORECASE | re.DOTALL)
    if m:
        target = normalize_target(m.group(1))
        content = m.group(2)
        return {
            "task_id": now_task_id(),
            "task_type": "write",
            "target": target,
            "content": content,
        }

    m = re.fullmatch(r"read\s+(.+)", raw, flags=re.IGNORECASE | re.DOTALL)
    if m:
        target = normalize_target(m.group(1))
        return {
            "task_id": now_task_id(),
            "task_type": "read",
            "target": target,
        }

    m = re.fullmatch(r"verify\s+(.+?)\s+contains\s+(.+)", raw, flags=re.IGNORECASE | re.DOTALL)
    if m:
        target = normalize_target(m.group(1))
        expected_content = m.group(2)
        return {
            "task_id": now_task_id(),
            "task_type": "verify",
            "target": target,
            "expected_content": expected_content,
        }

    m = re.fullmatch(r"verify\s+(.+)", raw, flags=re.IGNORECASE | re.DOTALL)
    if m:
        target = normalize_target(m.group(1))
        return {
            "task_id": now_task_id(),
            "task_type": "verify",
            "target": target,
        }

    m = re.fullmatch(r"execute\s+(.+)", raw, flags=re.IGNORECASE | re.DOTALL)
    if m:
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
