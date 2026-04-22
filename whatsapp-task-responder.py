import json
import sys
from pathlib import Path

ROOT = Path(r"C:\Burgandy")
STATE = ROOT / "task-plan-state"


def latest_state():
    files = sorted(STATE.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True)
    return files[0] if files else None


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def explain_strategy(d):
    strategy = d.get("strategy")
    target = d.get("target")

    if strategy == "pre-create":
        return f'I created "{target}" based on learned behavior from previous successful tasks.'

    if strategy == "auto-create":
        return f'I created "{target}" automatically after detecting it was missing.'

    if strategy == "direct-success":
        return f'I successfully completed the task on "{target}".'

    if strategy == "direct-read":
        return f'The file "{target}" did not exist when I tried to read it.'

    if strategy == "verify-check":
        return f'The verification failed for "{target}" due to a content mismatch.'

    if strategy == "execute-script":
        return f'The script "{target}" failed during execution.'

    return None


def build_suggestions(state):
    decision_log = state.get("decision_log", [])

    # PRIORITY: learned intelligence
    for d in decision_log:
        if d.get("strategy") == "pre-create":
            return [explain_strategy(d)]

    # fallback intelligence
    for d in decision_log:
        if d.get("strategy") == "auto-create":
            return [explain_strategy(d)]

    # success fallback
    if state.get("status") == "success":
        return ["Task completed successfully."]

    return []


def format_response(state):
    lines = []

    lines.append(f"PLAN {state.get('status', '').upper()}")
    lines.append(f"PLAN_ID: {state.get('plan_id')}")

    completed = state.get("steps_completed", 0)
    total = state.get("steps_total", 0)
    lines.append(f"COMPLETED: {completed}/{total}")

    if state.get("stopped_on"):
        lines.append(f"STOPPED_ON: {state['stopped_on']}")

    lines.append("")

    decision_log = state.get("decision_log", [])

    if decision_log:
        lines.append("WHAT HAPPENED:")

        for d in decision_log:
            task_type = d.get("task_type")
            target = d.get("target")
            reason = d.get("reason")
            action = d.get("next_best_action")

            lines.append(f"- Tried to {task_type} {target}")
            lines.append(f"  -> {reason}")
            lines.append(f"  -> Next action: {action}")

    suggestions = build_suggestions(state)

    if suggestions:
        lines.append("")
        lines.append("SUGGESTED NEXT STEPS:")
        for s in suggestions:
            lines.append(f"- {s}")

    return "\n".join(lines)


def main():
    if len(sys.argv) > 1:
        path = Path(sys.argv[1])
    else:
        path = latest_state()

    if not path or not path.exists():
        print("NO_STATE")
        return

    state = load(path)
    print(format_response(state))


if __name__ == "__main__":
    main()
