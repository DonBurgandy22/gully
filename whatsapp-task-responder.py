import json
import sys
from pathlib import Path

ROOT = Path(r"C:\Burgandy")
RESULTS = ROOT / "task-results"
STATE = ROOT / "task-plan-state"


def latest_result_file():
    files = sorted(RESULTS.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True)
    return files[0] if files else None


def latest_state_file():
    files = sorted(STATE.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True)
    return files[0] if files else None


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def format_step_line(index, task_type, status, target):
    return f"{index}. {task_type} -> {status} -> {target}"


def format_plan_response(state: dict) -> str:
    plan_id = str(state.get("plan_id", "unknown"))
    status = str(state.get("status", "unknown")).upper()
    steps_total = int(state.get("steps_total", 0))
    steps_completed = int(state.get("steps_completed", 0))
    stopped_on = state.get("stopped_on")
    current_step = state.get("current_step")

    lines = []
    lines.append(f"PLAN {status}")
    lines.append(f"PLAN_ID: {plan_id}")
    lines.append(f"COMPLETED: {steps_completed}/{steps_total}")

    if stopped_on:
        lines.append(f"STOPPED_ON: {stopped_on}")

    if current_step:
        lines.append(f"CURRENT_STEP: {current_step}")

    lines.append("STEPS:")

    step_items = list(state.get("steps", {}).values())
    step_items.sort(key=lambda s: s.get("task_id", ""))

    for idx, step in enumerate(step_items, start=1):
        lines.append(
            format_step_line(
                idx,
                str(step.get("task_type", "unknown")),
                str(step.get("status", "unknown")),
                str(step.get("target", "")),
            )
        )

    return "\n".join(lines)


def format_result_response(result: dict) -> str:
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
        mode = sys.argv[1].strip().lower()
    else:
        mode = "auto"

    try:
        if mode == "plan":
            state_path = latest_state_file()
            if state_path is None or not state_path.exists():
                print("NO_PLAN_STATE")
                return
            print(format_plan_response(load_json(state_path)))
            return

        if mode == "result":
            result_path = latest_result_file()
            if result_path is None or not result_path.exists():
                print("NO_RESULT")
                return
            print(format_result_response(load_json(result_path)))
            return

        state_path = latest_state_file()
        if state_path is not None and state_path.exists():
            print(format_plan_response(load_json(state_path)))
            return

        result_path = latest_result_file()
        if result_path is not None and result_path.exists():
            print(format_result_response(load_json(result_path)))
            return

        print("NO_RESULT")
    except Exception as exc:
        print("RESPONDER_FAILED")
        print(str(exc))


if __name__ == "__main__":
    main()
