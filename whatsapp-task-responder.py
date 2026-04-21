import json
import sys
from pathlib import Path

ROOT = Path(r"C:\Burgandy")
RESULTS = ROOT / "task-results"


def latest_result_file():
    files = sorted(RESULTS.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True)
    return files[0] if files else None


def load_result(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def format_response(result: dict) -> str:
    status = str(result.get("status", "unknown")).upper()
    task_type = str(result.get("task_type", "unknown"))
    target = str(result.get("target", ""))
    verified = result.get("verified", False)

    lines = []
    lines.append(f"{status}: {task_type} for {target}")

    if "attempt" in result and "max_retries" in result:
        lines.append(f"ATTEMPT: {result['attempt']}/{result['max_retries']}")

    lines.append(f"VERIFIED: {verified}")

    if result.get("is_retry") is True:
        lines.append("RETRY: yes")

    content = result.get("content")
    if isinstance(content, str) and content.strip():
        lines.append("CONTENT:")
        lines.append(content.rstrip())

    stderr = result.get("stderr")
    if isinstance(stderr, str) and stderr.strip():
        lines.append("ERROR:")
        lines.append(stderr.rstrip())

    exit_code = result.get("exit_code")
    if exit_code is not None:
        lines.append(f"EXIT_CODE: {exit_code}")

    error_type = result.get("error_type")
    if isinstance(error_type, str) and error_type.strip():
        lines.append(f"ERROR_TYPE: {error_type}")

    return "\n".join(lines)


def main():
    if len(sys.argv) > 1:
        path = Path(sys.argv[1])
    else:
        path = latest_result_file()

    if path is None or not path.exists():
        print("NO_RESULT")
        return

    try:
        result = load_result(path)
        print(format_response(result))
    except Exception as exc:
        print("RESPONDER_FAILED")
        print(str(exc))


if __name__ == "__main__":
    main()
