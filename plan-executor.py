import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(r"C:\Burgandy")
STATE = ROOT / "task-plan-state"
INBOX = ROOT / "task-inbox"
RESULTS = ROOT / "task-results"
WORKER = ROOT / "hermes-worker.py"
LEARNING_EVENTS = ROOT / "learning-events.jsonl"
ROUTING_HINTS = ROOT / "routing-hints.json"

MIN_PATTERN_OBSERVATIONS = 2
MIN_SUCCESS_RATE = 0.60
DECAY_FACTOR = 0.85


def now_iso():
    return datetime.now().isoformat(timespec="seconds")


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


def target_suffix(target):
    try:
        return Path(str(target)).suffix.lower()
    except Exception:
        return ""


def load_routing_hints():
    if ROUTING_HINTS.exists():
        try:
            return load_json(ROUTING_HINTS)
        except Exception:
            return {"patterns": {}}
    return {"patterns": {}}


def get_pattern(task_type, strategy, suffix):
    hints = load_routing_hints()
    key = f"{task_type}|{strategy}|{suffix}"
    return hints.get("patterns", {}).get(key, {})


def target_missing(task):
    if task.get("task_type") != "read":
        return False
    target = str(task.get("target", "")).strip()
    if not target:
        return False
    try:
        return not Path(target).exists()
    except Exception:
        return False


def infer_content(target):
    target = str(target).lower()

    if target.endswith(".json"):
        return "{}"

    if target.endswith(".md"):
        name = Path(target).stem.replace("_", " ").title()
        return f"# {name}\n\n"

    if target.endswith(".txt"):
        return ""

    if target.endswith(".py"):
        return "if __name__ == '__main__':\n    pass\n"

    return ""


def decide_strategy(task, result):
    error_type = result.get("error_type")
    status = result.get("status")

    if status == "success":
        return {
            "strategy": "direct-success",
            "reason": "task completed successfully",
            "next_best_action": "continue"
        }

    if task.get("on_failure") == "retry":
        return {
            "strategy": "retry",
            "reason": f"retry policy active with limit {task.get('retry_limit', 1)}",
            "next_best_action": "retry"
        }

    if task.get("on_failure") == "create_if_missing" and task.get("task_type") == "read":
        return {
            "strategy": "fallback-create",
            "reason": "read failed and create_if_missing policy is available",
            "next_best_action": "create_missing_target"
        }

    if error_type == "missing_target" and task.get("task_type") == "read":
        return {
            "strategy": "direct-read",
            "reason": "target file does not exist",
            "next_best_action": "create_missing_target"
        }

    if error_type == "verification":
        return {
            "strategy": "verify-check",
            "reason": "content mismatch during verification",
            "next_best_action": "stop"
        }

    if error_type == "execution":
        return {
            "strategy": "execute-script",
            "reason": "script execution failed",
            "next_best_action": "stop"
        }

    return {
        "strategy": "unknown",
        "reason": "unclassified failure condition",
        "next_best_action": "stop"
    }


def build_decision_entry(task, result, decision, fallback_used=False):
    return {
        "task_id": task.get("task_id"),
        "task_type": task.get("task_type"),
        "target": task.get("target"),
        "strategy": decision.get("strategy"),
        "reason": decision.get("reason"),
        "next_best_action": decision.get("next_best_action"),
        "fallback_used": fallback_used,
        "status": result.get("status"),
        "verified": result.get("verified"),
        "attempt": result.get("attempt"),
        "max_retries": result.get("max_retries"),
        "error_type": result.get("error_type"),
    }


def append_learning_event(plan_id, entry):
    event = {
        "timestamp": now_iso(),
        "plan_id": plan_id,
        "task_id": entry.get("task_id"),
        "task_type": entry.get("task_type"),
        "strategy": entry.get("strategy"),
        "target": entry.get("target"),
        "target_suffix": target_suffix(entry.get("target")),
        "reason": entry.get("reason"),
        "next_best_action": entry.get("next_best_action"),
        "fallback_used": entry.get("fallback_used"),
        "status": entry.get("status"),
        "verified": entry.get("verified"),
        "attempt": entry.get("attempt"),
        "max_retries": entry.get("max_retries"),
        "error_type": entry.get("error_type"),
    }
    with LEARNING_EVENTS.open("a", encoding="utf-8") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")


def decay_value(value):
    return round(float(value) * DECAY_FACTOR, 3)


def update_routing_hints(entry):
    hints = load_routing_hints()
    patterns = hints.setdefault("patterns", {})

    key = f"{entry.get('task_type')}|{entry.get('strategy')}|{target_suffix(entry.get('target'))}"
    item = patterns.setdefault(
        key,
        {
            "task_type": entry.get("task_type"),
            "strategy": entry.get("strategy"),
            "target_suffix": target_suffix(entry.get("target")),
            "weighted_success": 0.0,
            "weighted_failure": 0.0,
            "total_count": 0,
            "success_rate": 0.0,
            "last_reason": "",
            "last_next_best_action": "",
            "last_target": "",
            "last_updated": "",
        },
    )

    item["weighted_success"] = decay_value(item.get("weighted_success", 0.0))
    item["weighted_failure"] = decay_value(item.get("weighted_failure", 0.0))

    if entry.get("status") == "success":
        item["weighted_success"] = round(item["weighted_success"] + 1.0, 3)
    else:
        item["weighted_failure"] = round(item["weighted_failure"] + 1.0, 3)

    item["total_count"] = int(item.get("total_count", 0)) + 1

    total_weight = item["weighted_success"] + item["weighted_failure"]
    if total_weight > 0:
        item["success_rate"] = round(item["weighted_success"] / total_weight, 3)
    else:
        item["success_rate"] = 0.0

    item["last_reason"] = entry.get("reason", "")
    item["last_next_best_action"] = entry.get("next_best_action", "")
    item["last_target"] = entry.get("target", "")
    item["last_updated"] = now_iso()

    save_json(ROUTING_HINTS, hints)


def learn_from_entry(plan_id, entry):
    append_learning_event(plan_id, entry)
    update_routing_hints(entry)


def pattern_confident(stats):
    total = int(stats.get("total_count", 0))
    rate = float(stats.get("success_rate", 0.0))
    return total >= MIN_PATTERN_OBSERVATIONS and rate >= MIN_SUCCESS_RATE


def should_pre_create(task):
    if not target_missing(task):
        return False

    suffix = target_suffix(task.get("target"))
    pre_stats = get_pattern("write", "pre-create", suffix)
    auto_stats = get_pattern("write", "auto-create", suffix)

    learned_confidence = pattern_confident(pre_stats) or pattern_confident(auto_stats)

    if task.get("on_failure") == "create_if_missing":
        return True

    return learned_confidence


def pre_action(task):
    if should_pre_create(task):
        return {
            "task_id": f"{task['task_id']}-pre-create",
            "task_type": "write",
            "target": task["target"],
            "content": infer_content(task["target"])
        }
    return None


def auto_action(task, decision):
    if decision.get("next_best_action") == "create_missing_target":
        return {
            "task_id": f"{task['task_id']}-auto-create",
            "task_type": "write",
            "target": task["target"],
            "content": infer_content(task["target"])
        }
    return None


def execute_plan(plan_path):
    plan = load_json(plan_path)

    state = {
        "plan_id": plan["plan_id"],
        "status": "running",
        "steps_total": len(plan["steps"]),
        "steps_completed": 0,
        "steps": {},
        "decision_log": [],
        "resumed": False
    }

    state_path = STATE / f"{plan['plan_id']}.json"

    for step in plan["steps"]:
        task = dict(step)
        task.pop("source_text", None)

        if task.get("on_failure") == "retry":
            retry_limit = int(task.get("retry_limit", 1))
            task["attempt"] = 1
            task["max_retries"] = retry_limit + 1

        pre_task = pre_action(task)
        if pre_task:
            save_json(INBOX / f"{pre_task['task_id']}.json", pre_task)
            pre_result = wait_for_final_result(pre_task)

            state["steps"][pre_task["task_id"]] = {
                "task_type": pre_result.get("task_type"),
                "status": pre_result.get("status"),
                "target": pre_result.get("target"),
                "verified": pre_result.get("verified"),
            }

            pre_entry = {
                "task_id": pre_task["task_id"],
                "task_type": pre_task["task_type"],
                "target": pre_task["target"],
                "strategy": "pre-create",
                "reason": "system used recency-weighted learned routing hints to create the target before reading",
                "next_best_action": "continue" if pre_result.get("status") == "success" else "stop",
                "fallback_used": True,
                "status": pre_result.get("status"),
                "verified": pre_result.get("verified"),
                "attempt": pre_result.get("attempt"),
                "max_retries": pre_result.get("max_retries"),
                "error_type": pre_result.get("error_type"),
            }
            state["decision_log"].append(pre_entry)
            learn_from_entry(plan["plan_id"], pre_entry)

            if pre_result.get("status") != "success":
                state["status"] = "failed"
                state["stopped_on"] = pre_task["task_id"]
                save_json(state_path, state)
                return state

        save_json(INBOX / f"{task['task_id']}.json", task)
        result = wait_for_final_result(task)

        state["steps"][task["task_id"]] = {
            "task_type": result.get("task_type"),
            "status": result.get("status"),
            "target": result.get("target"),
            "verified": result.get("verified"),
            "attempt": result.get("attempt"),
            "max_retries": result.get("max_retries"),
        }

        decision = decide_strategy(task, result)
        entry = build_decision_entry(task, result, decision, fallback_used=False)
        state["decision_log"].append(entry)
        learn_from_entry(plan["plan_id"], entry)

        if result.get("status") != "success":
            auto_task = auto_action(task, decision)

            if auto_task:
                save_json(INBOX / f"{auto_task['task_id']}.json", auto_task)
                auto_result = wait_for_final_result(auto_task)

                state["steps"][auto_task["task_id"]] = {
                    "task_type": auto_result.get("task_type"),
                    "status": auto_result.get("status"),
                    "target": auto_result.get("target"),
                    "verified": auto_result.get("verified"),
                }

                auto_entry = {
                    "task_id": auto_task["task_id"],
                    "task_type": auto_task["task_type"],
                    "target": auto_task["target"],
                    "strategy": "auto-create",
                    "reason": "system autonomously created missing file after failure",
                    "next_best_action": "continue" if auto_result.get("status") == "success" else "stop",
                    "fallback_used": True,
                    "status": auto_result.get("status"),
                    "verified": auto_result.get("verified"),
                    "attempt": auto_result.get("attempt"),
                    "max_retries": auto_result.get("max_retries"),
                    "error_type": auto_result.get("error_type"),
                }
                state["decision_log"].append(auto_entry)
                learn_from_entry(plan["plan_id"], auto_entry)

                if auto_result.get("status") == "success":
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
