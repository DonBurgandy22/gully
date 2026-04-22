import subprocess
import sys
from pathlib import Path

ROOT = Path(r"C:\Burgandy")
BRIDGE = ROOT / "whatsapp-task-bridge.py"
WORKER = ROOT / "hermes-worker.py"


def run_python(script_path: Path, input_text: str):
    completed = subprocess.run(
        ["python", str(script_path)],
        input=input_text,
        capture_output=True,
        text=True,
        encoding="utf-8",
        cwd=str(ROOT),
    )
    return completed


def main():
    if len(sys.argv) > 1:
        incoming = " ".join(sys.argv[1:]).strip()
    else:
        incoming = sys.stdin.read().strip()

    if not incoming:
        print("NO_INPUT")
        return

    bridge_result = run_python(BRIDGE, incoming)
    bridge_output = bridge_result.stdout.strip()
    bridge_error = bridge_result.stderr.strip()

    if bridge_result.returncode != 0:
        print("BRIDGE_FAILED")
        if bridge_error:
            print(bridge_error)
        return

    if bridge_output == "IGNORED":
        print("IGNORED")
        return

    if bridge_output == "EMPTY_TASK":
        print("EMPTY_TASK")
        return

    if bridge_output == "NO_INPUT":
        print("NO_INPUT")
        return

    if not bridge_output.startswith("CREATED:"):
        print("BRIDGE_UNEXPECTED")
        if bridge_output:
            print(bridge_output)
        return

    worker_result = subprocess.run(
        ["python", str(WORKER)],
        capture_output=True,
        text=True,
        encoding="utf-8",
        cwd=str(ROOT),
    )
    worker_output = worker_result.stdout.strip()
    worker_error = worker_result.stderr.strip()

    if worker_result.returncode != 0:
        print("WORKER_FAILED")
        if worker_error:
            print(worker_error)
        return

    print(bridge_output)
    print(worker_output if worker_output else "WORKER_DONE")


if __name__ == "__main__":
    main()
