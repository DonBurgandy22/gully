"""
Test visualizer with live thought-train.
"""
import json
import datetime

print("[TEST] Testing visualizer with current live state")

live_state_path = r"C:\Burgandy\burgandy-cognitive-framework\outputs\live_state.json"

# First, add a fresh thought-train
with open(live_state_path, 'r') as f:
    state = json.load(f)

# Create fresh thought-train (less than 5 seconds old)
now = datetime.datetime.now()
fresh_thought_train = {
    "id": f"tt_fresh_{int(datetime.datetime.now().timestamp())}",
    "task_id": "visual_test_fresh",
    "timestamp": now.isoformat(),
    "activated_nodes": ["logic", "mathematics", "systems_thinking", "first_principles_reasoning"],
    "traversed_edges": [
        ["logic", "mathematics"],
        ["mathematics", "systems_thinking"],
        ["systems_thinking", "first_principles_reasoning"]
    ],
    "duration_ms": 3200,
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

print(f"[OK] Added fresh thought-train: {fresh_thought_train['id']}")
print(f"  Path: logic -> mathematics -> systems_thinking -> first_principles_reasoning")
print(f"  Age: <1 second")

# Check visualizer HTML for rendering
html_path = r"C:\Burgandy\burgandy-cognitive-framework\outputs\burgandy_network_3d.html"
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

print("\n[VISUALIZER CHECK]")
if 'THOUGHT-TRAIN VISUALIZATION' in html:
    print("[OK] Visualizer has thought-train rendering section")
else:
    print("[MISSING] Visualizer missing thought-train rendering")

if 'isThoughtTrain' in html:
    print("[OK] Visualizer has thought-train properties")
else:
    print("[MISSING] Visualizer missing thought-train properties")

if 'thoughtTrainFade' in html:
    print("[OK] Visualizer has fade property")
else:
    print("[MISSING] Visualizer missing fade property")

# Check for gold/orange colors
if '0xFFAA00' in html or '0xFFD700' in html:
    print("[OK] Visualizer has gold/orange colors for thought-trains")
else:
    print("[MISSING] Visualizer missing gold/orange colors")

print("\n[NEXT STEPS]")
print("1. Refresh: http://localhost:8765/burgandy_network_3d.html")
print("2. Look for:")
print("   - Gold/orange edges along: logic -> mathematics -> systems_thinking -> first_principles_reasoning")
print("   - Gold node labels for those 4 nodes")
print("   - Status text showing the thought-train path")
print("   - Thicker (8px) gold edges compared to adaptive edges")
print("   - Directional pulse along the path")
print("3. Thought-train should fade over 10 seconds")

print("\n[VERIFICATION] Check if thought-train is fresh enough:")
age_ms = (datetime.datetime.now() - now).total_seconds() * 1000
print(f"  Age: {age_ms:.0f}ms")
print(f"  Visible: {'YES (age < 10000ms)' if age_ms < 10000 else 'NO (too old)'}")