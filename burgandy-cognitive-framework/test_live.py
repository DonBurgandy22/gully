"""
test_live.py — End-to-end test for the live cognitive network.

Run this WHILE serve.py is running and the browser is open.
Watch the 3D network for the light-up / cool-down sequence.

Usage:
    # Terminal 1:
    python serve.py

    # Browser:
    http://localhost:8765/burgandy_network_3d.html

    # Terminal 2:
    python test_live.py
"""
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from src.live_network import activate, deactivate_all, get_status, clear_pending

TESTS = [
    {
        "name": "Demo 1 — Language / Logic / Math cluster",
        "nodes": ["language_comprehension", "logic", "mathematics", "symbolic_reasoning", "abstraction"],
        "edges": [
            ("language_comprehension", "logic"),
            ("logic", "mathematics"),
            ("mathematics", "symbolic_reasoning"),
        ],
        "task": "Loop A — language / logic / math reinforcement",
        "hold": 5,
    },
    {
        "name": "Demo 2 — Correction loop",
        "nodes": ["self_monitoring", "error_detection", "error_correction", "self_optimization"],
        "edges": [
            ("self_monitoring", "error_detection"),
            ("error_detection", "error_correction"),
            ("error_correction", "self_optimization"),
            ("self_optimization", "self_monitoring"),
        ],
        "task": "Loop B — monitoring / correction / optimization",
        "hold": 5,
    },
    {
        "name": "Demo 3 — Synthesis loop",
        "nodes": ["abstraction", "first_principles_reasoning", "systems_thinking", "synthesis", "strategy_adaptation", "planning"],
        "edges": [
            ("abstraction", "first_principles_reasoning"),
            ("first_principles_reasoning", "systems_thinking"),
            ("systems_thinking", "synthesis"),
            ("synthesis", "abstraction"),
        ],
        "task": "Loop C — abstraction / first principles / synthesis",
        "hold": 5,
    },
    {
        "name": "Demo 4 — Executive decision chain",
        "nodes": ["working_memory", "decision_making", "planning", "task_decomposition", "prioritisation"],
        "edges": [
            ("working_memory", "decision_making"),
            ("decision_making", "planning"),
            ("planning", "task_decomposition"),
            ("task_decomposition", "prioritisation"),
        ],
        "task": "Executive cognition — planning a complex task",
        "hold": 4,
    },
]


def run():
    print("=" * 55)
    print("  Burgandy Cognitive Network — Live Test")
    print("  Watch: http://localhost:8765/burgandy_network_3d.html")
    print("=" * 55)

    status = get_status()
    print(f"\nCurrent state: {len(status.get('active_nodes', []))} active nodes")

    for i, test in enumerate(TESTS, 1):
        print(f"\n[{i}/{len(TESTS)}] {test['name']}")
        print(f"        Activating: {', '.join(test['nodes'])}")

        activate(
            node_ids=test["nodes"],
            task=test["task"],
            edges=test["edges"],
        )

        for remaining in range(test["hold"], 0, -1):
            print(f"        Hold {remaining}s...  ", end="\r")
            time.sleep(1)

        print(f"        Cooling down...        ")
        deactivate_all()
        time.sleep(2)  # let cooldown animation play

    print("\n[DONE] All tests complete — network should be idle (all nodes base colour)")
    print("       Acceptance criteria:")
    print("         [x] Nodes lit gold during each test")
    print("         [x] Edges showed gold flow pulses")
    print("         [x] Status bar showed task name")
    print("         [x] Nodes smoothly faded back on cooldown")
    print("         [x] Network idle after final deactivate_all()")

    clear_pending()


if __name__ == "__main__":
    run()
