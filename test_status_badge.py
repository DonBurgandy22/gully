"""
Test the status badge with real multi-node task.
"""
import json
import time
import datetime

print("=== TESTING STATUS BADGE ===\n")

state_file = r"C:\Burgandy\burgandy-cognitive-framework\outputs\live_state.json"

# Test 1: Only edges visible (no active nodes)
print("TEST 1: Edges visible but no active nodes")
test1 = {
    "task": "TEST: Edges should keep badge Active",
    "timestamp": datetime.datetime.now().isoformat(),
    "active_nodes": [],
    "active_edges": [],
    "all_edges": [
        {"source": "mathematics", "target": "working_memory", "weight": 0.95, "relation_type": "adaptive"},
        {"source": "logic", "target": "working_memory", "weight": 0.45, "relation_type": "adaptive"},
    ]
}

with open(state_file, 'w') as f:
    json.dump(test1, f, indent=2)

print("[LOADED] Test 1: 2 visible edges, no active nodes")
print("Expected: Badge should show 'Active (2 edges)'")
print("Check: http://localhost:8765/burgandy_network_3d.html")
print("Wait 3 seconds...")
time.sleep(3)

# Test 2: Active nodes + edges
print("\nTEST 2: Active nodes + edges")
test2 = {
    "task": "TEST: Active nodes should show Active",
    "timestamp": datetime.datetime.now().isoformat(),
    "active_nodes": ["mathematics", "working_memory"],
    "active_edges": [["mathematics", "working_memory"]],
    "all_edges": test1["all_edges"]
}

with open(state_file, 'w') as f:
    json.dump(test2, f, indent=2)

print("[LOADED] Test 2: 2 active nodes, 1 active edge")
print("Expected: Badge should show 'Active (2 nodes)'")
print("Wait 3 seconds...")
time.sleep(3)

# Test 3: Truly idle (no visible edges)
print("\nTEST 3: Truly idle (no visible edges)")
test3 = {
    "task": "TEST: No visible activity = Idle",
    "timestamp": datetime.datetime.now().isoformat(),
    "active_nodes": [],
    "active_edges": [],
    "all_edges": [
        {"source": "mathematics", "target": "working_memory", "weight": 0.05, "relation_type": "adaptive"},  # Too faint
        {"source": "logic", "target": "working_memory", "weight": 0.08, "relation_type": "adaptive"},  # Too faint
    ]
}

with open(state_file, 'w') as f:
    json.dump(test3, f, indent=2)

print("[LOADED] Test 3: 2 very faint edges (weight < 0.2)")
print("Expected: Badge should show 'Idle' (edges too faint)")
print("\n=== STATUS BADGE VERIFICATION ===")
print("1. Does the top-right badge now match what is visibly happening?")
print("2. Does Idle still appear while edges are visibly alive?")
print("3. Is one more patch needed?")