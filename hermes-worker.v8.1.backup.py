import json
import shutil
import subprocess
from datetime import datetime
from pathlib import Path

ROOT = Path(r"C:\Burgandy")
RULES = ROOT / "hermes-rules.txt"
INBOX = ROOT / "task-inbox"
RESULTS = ROOT / "task-results"
ARCHIVE = ROOT / "task-archive"
LOGS = ROOT / "logs"
LOG_FILE = LOGS / "hermes-worker.log"


def now_iso():
    return datetime.now().isoformat(timespec="seconds")


def parse_rules(path):
    data = {}
    if not path.exists():
        return data

    for line in path.read_text(encoding="utf-8").splitlines():
        if "=" in line:
            k, v = line.split("=", 1)
            data.setdefault(k.strip(), []).append(v.strip())
    return data


def json_files(folder):
    return sorted(folder.glob("*.json"))


def classify_task(task):
    task_type = str(task.get("task_type", "")).strip().lower()
    if task_type in {"read", "write", "verify", "execute"}:
        return task_type, "pending", False
    return "blocked", "blocked", False


def is_safe_target(target):
    try:
        target_path = Path(target).resolve()
        root_path = ROOT.resolve()
        return str(target_path).startswith(str(root_path))
    except Exception:
        return False


def append_log(task_id, task_type, status, target, verified, attempt, max_retries):
    timestamp = now_iso()
    line = (
        f"{timestamp} | {task_id} | {task_type} | {status} | "
        f"{target} | verified={verified} | attempt={attempt}/{max_retries}"
    )
    with LOG_FILE.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


def handle_write(task):
    target = str(task.get("target", "")).strip()
    content = task.get("content", None)

    if not target or not isinstance(content, str):
        return "failed", target, False, None, None, None, "validation"

    if not is_safe_target(target):
        return "blocked", target, False, None, None, None, "safety"

    target_path = Path(target)

    try:
        target_path.parent.mkdir(parents=True, exist_ok=True)
        target_path.write_text(content, encoding="utf-8")
        verified = target_path.exists()
        return (
            "success" if verified else "failed",
            target,
            verified,
            None,
            None,
            None,
            None if verified else "verification",
        )
    except Exception as exc:
        return "failed", target, False, None, str(exc), None, type(exc).__name__


def handle_verify(task):
    target = str(task.get("target", "")).strip()
    expected_content = task.get("expected_content", None)

    if not target:
        return "failed", target, False, None, None, None, "validation"

    if not is_safe_target(target):
        return "blocked", target, False, None, None, None, "safety"

    target_path = Path(target)

    try:
        if not target_path.exists():
            return "failed", target, False, None, "Target does not exist", None, "missing_target"

        if expected_content is None:
            return "success", target, True, None, None, None, None

        if not isinstance(expected_content, str):
            return "failed", target, False, None, None, None, "validation"

        actual_content = target_path.read_text(encoding="utf-8")
        verified = actual_content == expected_content
        return (
            "success" if verified else "failed",
            target,
            verified,
            None,
            None if verified else "Content mismatch",
            None,
            None if verified else "verification",
        )
    except Exception as exc:
        return "failed", target, False, None, str(exc), None, type(exc).__name__


def handle_read(task):
    target = str(task.get("target", "")).strip()

    if not target:
        return "failed", target, False, None, None, None, "validation"

    if not is_safe_target(target):
        return "blocked", target, False, None, None, None, "safety"

    target_path = Path(target)

    try:
        if not target_path.exists():
            return "failed", target, False, None, "Target does not exist", None, "missing_target"

        content = target_path.read_text(encoding="utf-8")
        return "success", target, True, content, None, None, None
    except Exception as exc:
        return "failed", target, False, None, str(exc), None, type(exc).__name__


def handle_execute(task):
    target = str(task.get("target", "")).strip()

    if not target:
        return "failed", target, False, None, None, None, "validation"

    if not is_safe_target(target):
        return "blocked", target, False, None, None, None, "safety"

    target_path = Path(target)

    if target_path.suffix.lower() != ".py":
        return "blocked", target, False, None, "Only .py execution is allowed in v8", None, "policy"

    if not target_path.exists():
        return "failed", target, False, None, "Target script does not exist", None, "missing_target"

    try:
        completed = subprocess.run(
            ["python", str(target_path)],
            capture_output=True,
            text=True,
            encoding="utf-8",
            cwd=str(ROOT)
        )
        verified = completed.returncode == 0
        status = "success" if verified else "failed"
        return (
            status,
            target,
            verified,
            completed.stdout,
            completed.stderr,
            completed.returncode,
            None if verified else "execution",
        )
    except Exception as exc:
        return "failed", target, False, None, str(exc), None, type(exc).__name__


def maybe_requeue(task, status, task_type):
    attempt = int(task.get("attempt", 1))
    max_retries = int(task.get("max_retries", 0))

    if task_type == "execute" and status == "failed" and attempt < max_retries:
        retried_task = dict(task)
        retried_task["attempt"] = attempt + 1

        retry_task_id = str(retried_task.get("task_id", "task"))
        retry_attempt = int(retried_task.get("attempt", 1))
        retry_path = INBOX / f"{retry_task_id}.retry-{retry_attempt}.json"

        retry_path.write_text(json.dumps(retried_task, indent=2), encoding="utf-8")
        return True

    return False


def process_task_file(task_file):
    started_at = now_iso()
    task_id = task_file.stem
    task_type = "blocked"
    target = ""
    status = "failed"
    verified = False
    content = None
    stderr = None
    exit_code = None
    error_type = None
    attempt = 1
    max_retries = 0
    requeued = False

    try:
        task = json.loads(task_file.read_text(encoding="utf-8"))
        task_id = str(task.get("task_id", task_file.stem))
        target = str(task.get("target", ""))
        attempt = int(task.get("attempt", 1))
        max_retries = int(task.get("max_retries", 0))
        task_type, status, verified = classify_task(task)

        if task_type == "write":
            status, target, verified, content, stderr, exit_code, error_type = handle_write(task)
        elif task_type == "verify":
            status, target, verified, content, stderr, exit_code, error_type = handle_verify(task)
        elif task_type == "read":
            status, target, verified, content, stderr, exit_code, error_type = handle_read(task)
        elif task_type == "execute":
            status, target, verified, content, stderr, exit_code, error_type = handle_execute(task)
        else:
            status = "blocked"
            verified = False
            error_type = "unsupported_task_type"

        requeued = maybe_requeue(task, status, task_type)

    except Exception as exc:
        status = "failed"
        verified = False
        stderr = str(exc)
        error_type = type(exc).__name__

    finished_at = now_iso()

    result = {
        "task_id": task_id,
        "status": status,
        "task_type": task_type,
        "target": target,
        "verified": verified,
        "started_at": started_at,
        "finished_at": finished_at,
        "attempt": attempt,
        "max_retries": max_retries,
        "requeued": requeued,
    }

    if content is not None:
        result["content"] = content

    if stderr is not None:
        result["stderr"] = stderr

    if exit_code is not None:
        result["exit_code"] = exit_code

    if error_type is not None:
        result["error_type"] = error_type

    result_path = RESULTS / f"{task_id}.json"
    result_path.write_text(json.dumps(result, indent=2), encoding="utf-8")

    append_log(task_id, task_type, status, target, verified, attempt, max_retries)

    try:
        shutil.move(str(task_file), str(ARCHIVE / task_file.name))
    except Exception:
        pass

    return task_id


def main():
    parse_rules(RULES)

    for folder in (INBOX, RESULTS, ARCHIVE, LOGS):
        folder.mkdir(parents=True, exist_ok=True)

    task_files = json_files(INBOX)
    if not task_files:
        print("NO_TASK")
        return

    count = 0
    for task_file in task_files:
        process_task_file(task_file)
        count += 1

    print(f"PROCESSED:{count}")


if __name__ == "__main__":
    main()