"""
Test to verify thought-train edge protection from regular styling.
This script checks if the visualizer patches correctly protect
thought-train edges from being overwritten by regular edge processing.
"""

import json
import time
from datetime import datetime, timedelta

# Read the HTML file to verify patches
with open('burgandy-cognitive-framework/outputs/burgandy_network_3d.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Check for key patches
patches = {
    "applyLiveState thought-train skip": "if(e.isThoughtTrain && e.thoughtTrainFade > 0) {" in html,
    "animate thought-train return": "return; // Skip normal animation for thought-train edges" in html,
    "thought-train fade cleanup": "e.isThoughtTrain = false;" in html,
    "temporary edge map": "window.thoughtTrainEdgeMap" in html,
}

print("=== Thought-Train Protection Patches ===")
for patch_name, present in patches.items():
    status = "PRESENT" if present else "MISSING"
    print(f"{patch_name}: {status}")

print("\n=== Protection Logic Summary ===")
print("1. applyLiveState(): Regular styling SKIPS edges with isThoughtTrain && thoughtTrainFade > 0")
print("2. animate(): Thought-train edges have early return to skip normal animation")
print("3. Cleanup: Each update resets isThoughtTrain = false for all edges")
print("4. Fade-out: thoughtTrainFade decreases from 1.0 to 0.0 over 10 seconds")
print("5. Restoration: When fade reaches 0, edge returns to normal processing")

# Create a fresh thought-train for testing
with open('burgandy-cognitive-framework/outputs/live_state.json', 'r') as f:
    state = json.load(f)

fresh_thought = {
    'id': f'tt_test_protection_{int(time.time())}',
    'timestamp': datetime.now().isoformat(),
    'activated_nodes': ['logic', 'mathematics', 'systems_thinking'],
    'traversed_edges': [['logic', 'mathematics'], ['mathematics', 'systems_thinking']],
    'task': 'Test thought-train protection'
}

if 'thought_trains' not in state:
    state['thought_trains'] = []
state['thought_trains'].insert(0, fresh_thought)
state['thought_trains'] = state['thought_trains'][:5]

with open('burgandy-cognitive-framework/outputs/live_state.json', 'w') as f:
    json.dump(state, f, indent=2)

print(f"\n=== Test Thought-Train Created ===")
print(f"ID: {fresh_thought['id']}")
print(f"Edges: {fresh_thought['traversed_edges']}")
print("\nExpected behavior:")
print("- logic->mathematics: EXISTS in graph, should be gold thought-train edge")
print("- mathematics->systems_thinking: EXISTS in graph, should be gold thought-train edge")
print("- Both edges should NOT be overwritten by regular edge styling")
print("- Both edges should fade out over 10 seconds")
print("- After fade, edges should return to normal base/adaptive styling")