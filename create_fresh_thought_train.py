"""
Create a fresh thought-train (< 1 second old).
"""
import json
import datetime
import time

live_state_path = r"C:\Burgandy\burgandy-cognitive-framework\outputs\live_state.json"

# Load current state
with open(live_state_path, 'r') as f:
    state = json.load(f)

# Create fresh thought-train
now = datetime.datetime.now()
fresh_thought_train = {
    "id": f"tt_fresh_{int(datetime.datetime.now().timestamp())}",
    "task_id": "visual_truth_test_fresh",
    "timestamp": now.isoformat(),
    "activated_nodes": ["logic", "mathematics", "systems_thinking", "first_principles_reasoning"],
    "traversed_edges": [
        ["logic", "mathematics"],
        ["mathematics", "systems_thinking"],
        ["systems_thinking", "first_principles_reasoning"]
    ],
    "duration_ms": 2500,
    "result": "success",
    "error_message": None
}

# Add to beginning (most recent)
if "thought_trains" not in state:
    state["thought_trains"] = []
state["thought_trains"].insert(0, fresh_thought_train)

# Keep only last 10
if len(state["thought_trains"]) > 10:
    state["thought_trains"] = state["thought_trains"][:10]

# Write back
with open(live_state_path, 'w') as f:
    json.dump(state, f, indent=2)

print(f"[OK] Created fresh thought-train: {fresh_thought_train['id']}")
print(f"  Path: logic -> mathematics -> systems_thinking -> first_principles_reasoning")
print(f"  Timestamp: {fresh_thought_train['timestamp']}")
print(f"  Age: <1 second")

# Wait a moment for visualizer to poll
print("\n[WAIT] Waiting 1 second for visualizer poll...")
time.sleep(1)

# Check age
now2 = datetime.datetime.now()
age_ms = (now2 - now).total_seconds() * 1000
print(f"  Current age: {age_ms:.0f}ms")
print(f"  Visible in visualizer: {'YES (age < 10000ms)' if age_ms < 10000 else 'NO (too old)'}")

print("\n[NEXT] Refresh: http://localhost:8765/burgandy_network_3d.html")
print("Look for gold thought-train edges along the path above.")