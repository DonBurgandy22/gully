"""
Test that polling works with new interval.
"""
import json
import datetime

state_file = r"C:\Burgandy\burgandy-cognitive-framework\outputs\live_state.json"

# Create test state with visible edges
test_state = {
    "task": "POLLING TEST: Status should update within 0.5s",
    "timestamp": datetime.datetime.now().isoformat(),
    "active_nodes": [],
    "active_edges": [],
    "all_edges": [
        {"source": "mathematics", "target": "working_memory", "weight": 0.95, "relation_type": "adaptive"},
        {"source": "logic", "target": "working_memory", "weight": 0.45, "relation_type": "adaptive"},
    ]
}

with open(state_file, 'w') as f:
    json.dump(test_state, f, indent=2)

print("[TEST LOADED] Visible edges with weights 0.95 and 0.45")
print("Expected behavior after refresh:")
print("1. Edges render immediately (visible)")
print("2. Status badge updates within 0.5 seconds (not 2 seconds)")
print("3. Badge should show 'Active (2 edges)'")
print("\nRefresh: http://localhost:8765/burgandy_network_3d.html")
print("\nObserve: Does the badge update quickly now?")