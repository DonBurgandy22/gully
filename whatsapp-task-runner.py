import subprocess
import sys
from pathlib import Path

ROOT = Path(r"C:\Burgandy")
PLANNER = ROOT / "task-planner.py"
EXECUTOR = ROOT / "plan-executor.py"
RESPONDER = ROOT / "whatsapp-task-responder.py"
PLANS = ROOT / "task-plans"


def run_python(script_path: Path, input_text: str = ""):
    return subprocess.run(
        ["python", str(script_path)],
        input=input_text,
        capture_output=True,
        text=True,
        encoding="utf-8",
        cwd=str(ROOT),
    )


def latest_plan_file():
    files = sorted(PLANS.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True)
    return files[0] if files else None


def main():
    if len(sys.argv) > 1:
        incoming = " ".join(sys.argv[1:]).strip()
    else:
        incoming = sys.stdin.read().strip()

    if not incoming:
        print("NO_INPUT")
        return

    if not incoming.lower().startswith("task:"):
        print("IGNORED")
        return

    planner_result = run_python(PLANNER, incoming)
    planner_output = planner_result.stdout.strip()
    planner_error = planner_result.stderr.strip()

    if planner_result.returncode != 0:
        print("PLANNER_FAILED")
        if planner_error:
            print(planner_error)
        return

    if planner_output in {"IGNORED", "EMPTY_TASK", "NO_INPUT"}:
        print(planner_output)
        return

    latest_plan = latest_plan_file()
    if latest_plan is None:
        print("NO_PLAN")
        return

    executor_result = subprocess.run(
        ["python", str(EXECUTOR), str(latest_plan)],
        capture_output=True,
        text=True,
        encoding="utf-8",
        cwd=str(ROOT),
    )
    executor_output = executor_result.stdout.strip()
    executor_error = executor_result.stderr.strip()

    if executor_result.returncode != 0:
        print("EXECUTOR_FAILED")
        if executor_error:
            print(executor_error)
        return

    responder_result = subprocess.run(
        ["python", str(RESPONDER)],
        capture_output=True,
        text=True,
        encoding="utf-8",
        cwd=str(ROOT),
    )
    responder_output = responder_result.stdout.strip()
    responder_error = responder_result.stderr.strip()

    if responder_result.returncode != 0:
        print("RESPONDER_FAILED")
        if responder_error:
            print(responder_error)
        return

    print("RUNNER_V12_3_OK")
    print(planner_output)
    print(executor_output)
    print("RESPONSE:")
    print(responder_output if responder_output else "NO_RESPONSE")


if __name__ == "__main__":
    main()
