import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(r"C:\Burgandy")
PLANS = ROOT / "task-plans"
INBOX = ROOT / "task-inbox"
RESULTS = ROOT / "task-results"
ARCHIVE = ROOT / "task-archive"
WORKER = ROOT / "hermes-worker.py"


def latest_plan_file():
    files = sorted(PLANS.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True)
    return files[0] if files else None


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def result_file_for(task_id: str) -> Path:
    return RESULTS / f"{task_id}.json"


def archive_file_for(task_id: str) -> Path:
    matches = sorted(ARCHIVE.glob(f"{task_id}*.json"))
    return matches[0] if matches else None


def restore_task_to_inbox(task_id: str) -> Path:
    archived = archive_file_for(task_id)
    if archived is None:
        return None
    restored = INBOX / f"{task_id}.json"
    restored.write_text(archived.read_text(encoding="utf-8"), encoding="utf-8")
    return restored


def run_worker_once():
    completed = subprocess.run(
        ["python", str(WORKER)],
        capture_output=True,
        text=True,
        encoding="utf-8",
        cwd=str(ROOT),
    )
    return completed


def execute_plan(plan_path: Path):
    plan = load_json(plan_path)
    plan_id = plan["plan_id"]
    steps = plan.get("steps", [])

    summary = {
        "plan_id": plan_id,
        "status": "success",
        "steps_total": len(steps),
        "steps_completed": 0,
        "stopped_on": None,
        "results": [],
    }

    for step in steps:
        task_id = step["task_id"]
        task_type = step.get("task_type", "")
        target = step.get("target", "")

        result_path = result_file_for(task_id)
        if result_path.exists():
            result_path.unlink()

        restored = restore_task_to_inbox(task_id)
        if restored is None:
            summary["status"] = "failed"
            summary["stopped_on"] = task_id
            summary["results"].append({
                "task_id": task_id,
                "status": "missing_archived_task",
                "task_type": task_type,
                "target": target,
            })
            break

        worker_run = run_worker_once()
        worker_stdout = worker_run.stdout.strip()
        worker_stderr = worker_run.stderr.strip()

        if not result_path.exists():
            summary["status"] = "failed"
            summary["stopped_on"] = task_id
            summary["results"].append({
                "task_id": task_id,
                "status": "missing_result",
                "task_type": task_type,
                "target": target,
                "worker_stdout": worker_stdout,
                "worker_stderr": worker_stderr,
            })
            break

        result = load_json(result_path)
        step_status = result.get("status", "unknown")

        summary["results"].append({
            "task_id": task_id,
            "status": step_status,
            "task_type": result.get("task_type", task_type),
            "target": result.get("target", target),
            "verified": result.get("verified", False),
        })

        if step_status != "success":
            summary["status"] = "failed"
            summary["stopped_on"] = task_id
            break

        summary["steps_completed"] += 1

    if summary["status"] == "success":
        summary["steps_completed"] = len(steps)

    return summary


def main():
    if len(sys.argv) > 1:
        plan_path = Path(sys.argv[1])
    else:
        plan_path = latest_plan_file()

    if plan_path is None or not plan_path.exists():
        print("NO_PLAN")
        return

    try:
        summary = execute_plan(plan_path)
        print(json.dumps(summary, indent=2))
    except Exception as exc:
        print("PLAN_EXECUTOR_FAILED")
        print(str(exc))


if __name__ == "__main__":
    main()
