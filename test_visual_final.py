"""
Final test of thought-train visualization.
"""
import json
import datetime
import time

# Create a fresh thought-train
live_state_path = r"C:\Burgandy\burgandy-cognitive-framework\outputs\live_state.json"

with open(live_state_path, 'r') as f:
    live_state = json.load(f)

# Add fresh thought-train
new_thought_train = {
    "id": f"tt_visual_test_{int(time.time())}",
    "task_id": "visual_test_001",
    "timestamp": datetime.datetime.now().isoformat(),
    "activated_nodes": ["language_comprehension", "logic", "mathematics", "working_memory"],
    "traversed_edges": [
        ["language_comprehension", "logic"],
        ["logic", "mathematics"],
        ["mathematics", "working_memory"]
    ],
    "duration_ms": 1800,
    "result": "success",
    "error_message": None
}

# Initialize thought_trains if needed
if "thought_trains" not in live_state:
    live_state["thought_trains"] = []

# Add and keep only last 10
live_state["thought_trains"].insert(0, new_thought_train)
if len(live_state["thought_trains"]) > 10:
    live_state["thought_trains"] = live_state["thought_trains"][:10]

# Write back
with open(live_state_path, 'w') as f:
    json.dump(live_state, f, indent=2)

print("[TEST] Thought-train visualization ready")
print(f"ID: {new_thought_train['id']}")
print(f"Path: language_comprehension -> logic -> mathematics -> working_memory")
print(f"Timestamp: {new_thought_train['timestamp']}")
print(f"Age: <1 second (fresh)")
print(f"\nRefresh: http://localhost:8765/burgandy_network_3d.html")
print("\nExpected visual changes:")
print("1. Gold/orange edges along the path above")
print("2. Gold node labels for those 4 nodes")
print("3. Status text: 'Thinking: language_comprehension -> logic -> mathematics -> working_memory'")
print("4. Thought-train edges thicker (8px) and brighter than adaptive edges")
print("5. Fades over 10 seconds")