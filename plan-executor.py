import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(r"C:\Burgandy")
PLANS = ROOT / "task-plans"
INBOX = ROOT / "task-inbox"
RESULTS = ROOT / "task-results"
ARCHIVE = ROOT / "task-archive"
STATE = ROOT / "task-plan-state"
WORKER = ROOT / "hermes-worker.py"


def now_iso():
    return datetime.now().isoformat(timespec="seconds")


def latest_plan_file():
    files = sorted(PLANS.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True)
    return files[0] if files else None


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, data: dict):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")


def result_file_for(task_id: str) -> Path:
    return RESULTS / f"{task_id}.json"


def archive_file_for(task_id: str) -> Path:
    matches = sorted(ARCHIVE.glob(f"{task_id}*.json"))
    return matches[0] if matches else None


def state_file_for(plan_id: str) -> Path:
    return STATE / f"{plan_id}.json"


def cleanup_plan_inbox(plan_id: str):
    for path in INBOX.glob(f"{plan_id}-step-*.json"):
        try:
            path.unlink()
        except Exception:
            pass


def ensure_task_in_inbox(step: dict) -> Path:
    task_id = step["task_id"]
    task_path = INBOX / f"{task_id}.json"

    if task_path.exists():
        return task_path

    archived = archive_file_for(task_id)
    if archived:
        task_path.write_text(archived.read_text(encoding="utf-8"), encoding="utf-8")
        return task_path

    task = dict(step)
    task_path.write_text(json.dumps(task, indent=2), encoding="utf-8")
    return task_path


def run_worker_once():
    return subprocess.run(
        ["python", str(WORKER)],
        capture_output=True,
        text=True,
        encoding="utf-8",
        cwd=str(ROOT),
    )


def load_or_create_state(plan: dict, plan_path: Path):
    plan_id = plan["plan_id"]
    state_path = state_file_for(plan_id)

    if state_path.exists():
        state = load_json(state_path)
    else:
        state = {
            "plan_id": plan_id,
            "plan_file": str(plan_path),
            "created_at": now_iso(),
            "updated_at": now_iso(),
            "status": "pending",
            "steps_total": len(plan.get("steps", [])),
            "steps_completed": 0,
            "stopped_on": None,
            "current_step": None,
            "steps": {},
        }

    for step in plan.get("steps", []):
        task_id = step["task_id"]
        if task_id not in state["steps"]:
            state["steps"][task_id] = {
                "task_id": task_id,
                "task_type": step.get("task_type", ""),
                "target": step.get("target", ""),
                "source_text": step.get("source_text", ""),
                "status": "pending",
                "verified": False,
                "last_run_at": None,
                "result_file": str(result_file_for(task_id)),
            }

    save_json(state_path, state)
    return state_path, state


def refresh_progress(state: dict):
    completed = 0
    for step_state in state["steps"].values():
        if step_state.get("status") == "success":
            completed += 1
    state["steps_completed"] = completed
    state["updated_at"] = now_iso()


def execute_plan(plan_path: Path):
    plan = load_json(plan_path)
    plan_id = plan["plan_id"]
    steps = plan.get("steps", [])

    state_path, state = load_or_create_state(plan, plan_path)
    state["status"] = "running"
    state["stopped_on"] = None
    refresh_progress(state)
    save_json(state_path, state)

    summary = {
        "plan_id": plan_id,
        "status": "success",
        "steps_total": len(steps),
        "steps_completed": state.get("steps_completed", 0),
        "stopped_on": None,
        "resumed": any(s.get("status") == "success" for s in state["steps"].values()),
        "state_file": str(state_path),
        "results": [],
    }

    for step in steps:
        task_id = step["task_id"]
        task_type = step.get("task_type", "")
        target = step.get("target", "")
        step_state = state["steps"][task_id]
        result_path = result_file_for(task_id)

        state["current_step"] = task_id
        save_json(state_path, state)

        if step_state.get("status") == "success" and result_path.exists():
            try:
                existing_result = load_json(result_path)
                if existing_result.get("status") == "success":
                    summary["results"].append({
                        "task_id": task_id,
                        "status": "skipped_existing_success",
                        "task_type": step_state.get("task_type", task_type),
                        "target": step_state.get("target", target),
                        "verified": step_state.get("verified", False),
                    })
                    continue
            except Exception:
                pass

        cleanup_plan_inbox(plan_id)

        if result_path.exists():
            result_path.unlink()

        task_file = ensure_task_in_inbox(step)
        if task_file is None:
            step_state["status"] = "missing_task"
            step_state["verified"] = False
            step_state["last_run_at"] = now_iso()
            state["status"] = "failed"
            state["stopped_on"] = task_id
            state["current_step"] = None
            refresh_progress(state)
            save_json(state_path, state)

            summary["status"] = "failed"
            summary["stopped_on"] = task_id
            summary["steps_completed"] = state["steps_completed"]
            summary["results"].append({
                "task_id": task_id,
                "status": "missing_task",
                "task_type": task_type,
                "target": target,
            })
            break

        worker_run = run_worker_once()

        if not result_path.exists():
            step_state["status"] = "missing_result"
            step_state["verified"] = False
            step_state["last_run_at"] = now_iso()
            state["status"] = "failed"
            state["stopped_on"] = task_id
            state["current_step"] = None
            refresh_progress(state)
            save_json(state_path, state)

            summary["status"] = "failed"
            summary["stopped_on"] = task_id
            summary["steps_completed"] = state["steps_completed"]
            summary["results"].append({
                "task_id": task_id,
                "status": "missing_result",
                "task_type": task_type,
                "target": target,
                "stdout": worker_run.stdout.strip(),
                "stderr": worker_run.stderr.strip(),
            })
            break

        result = load_json(result_path)
        step_status = result.get("status", "unknown")
        verified = result.get("verified", False)

        step_state["status"] = step_status
        step_state["verified"] = verified
        step_state["last_run_at"] = now_iso()

        refresh_progress(state)

        summary["results"].append({
            "task_id": task_id,
            "status": step_status,
            "task_type": result.get("task_type", task_type),
            "target": result.get("target", target),
            "verified": verified,
        })

        if step_status != "success":
            state["status"] = "failed"
            state["stopped_on"] = task_id
            state["current_step"] = None
            cleanup_plan_inbox(plan_id)
            save_json(state_path, state)

            summary["status"] = "failed"
            summary["stopped_on"] = task_id
            summary["steps_completed"] = state["steps_completed"]
            break

        save_json(state_path, state)

    if summary["status"] == "success":
        refresh_progress(state)
        state["status"] = "success"
        state["current_step"] = None
        state["stopped_on"] = None
        cleanup_plan_inbox(plan_id)
        save_json(state_path, state)
        summary["steps_completed"] = state["steps_completed"]

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
