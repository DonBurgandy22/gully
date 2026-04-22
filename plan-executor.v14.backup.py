import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(r"C:\Burgandy")
STATE = ROOT / "task-plan-state"
INBOX = ROOT / "task-inbox"
RESULTS = ROOT / "task-results"
WORKER = ROOT / "hermes-worker.py"


def load_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")


def run_worker():
    subprocess.run(
        ["python", str(WORKER)],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        encoding="utf-8",
    )


def get_all_results_for_task(task_id):
    files = list(RESULTS.glob(f"{task_id}*.json"))
    return sorted(files, key=lambda p: p.stat().st_mtime)


def wait_for_final_result(task):
    task_id = task["task_id"]
    max_loops = 30

    for _ in range(max_loops):
        run_worker()

        result_files = get_all_results_for_task(task_id)
        if not result_files:
            continue

        latest = result_files[-1]
        result = load_json(latest)

        # If Hermes says requeued, wait for next
        if result.get("requeued") is True:
            continue

        return result

    return {
        "task_id": task_id,
        "status": "failed",
        "task_type": task.get("task_type"),
        "target": task.get("target"),
        "verified": False,
        "error_type": "retry_timeout"
    }


def execute_plan(plan_path):
    plan = load_json(plan_path)

    state = {
        "plan_id": plan["plan_id"],
        "status": "running",
        "steps_total": len(plan["steps"]),
        "steps_completed": 0,
        "steps": {},
        "resumed": False
    }

    state_path = STATE / f"{plan['plan_id']}.json"

    for step in plan["steps"]:
        task = dict(step)
        task.pop("source_text", None)

        # Retry setup
        if task.get("on_failure") == "retry":
            retry_limit = int(task.get("retry_limit", 1))
            task["attempt"] = 1
            task["max_retries"] = retry_limit + 1

        task_path = INBOX / f"{task['task_id']}.json"
        save_json(task_path, task)

        result = wait_for_final_result(task)

        state["steps"][task["task_id"]] = {
            "task_type": result.get("task_type"),
            "status": result.get("status"),
            "target": result.get("target"),
            "verified": result.get("verified"),
            "attempt": result.get("attempt"),
            "max_retries": result.get("max_retries"),
        }

        if result.get("status") != "success":
            if task.get("on_failure") == "create_if_missing" and task["task_type"] == "read":
                fallback_task = {
                    "task_id": f"{task['task_id']}-fallback-create",
                    "task_type": "write",
                    "target": task["target"],
                    "content": "",
                }

                save_json(INBOX / f"{fallback_task['task_id']}.json", fallback_task)

                fallback_result = wait_for_final_result(fallback_task)

                state["steps"][fallback_task["task_id"]] = {
                    "task_type": fallback_result.get("task_type"),
                    "status": fallback_result.get("status"),
                    "target": fallback_result.get("target"),
                    "verified": fallback_result.get("verified"),
                }

                if fallback_result.get("status") == "success":
                    state["steps_completed"] += 1
                    continue

            if task.get("on_failure") == "stop":
                state["status"] = "failed"
                state["stopped_on"] = task["task_id"]
                save_json(state_path, state)
                return state

            state["status"] = "failed"
            state["stopped_on"] = task["task_id"]
            save_json(state_path, state)
            return state

        state["steps_completed"] += 1

    state["status"] = "success"
    save_json(state_path, state)
    return state


def main():
    if len(sys.argv) < 2:
        print("NO_PLAN_PATH")
        return

    plan_path = Path(sys.argv[1])
    result = execute_plan(plan_path)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
