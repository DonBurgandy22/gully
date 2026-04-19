"""
Test thought-train visualization.
"""
import sys
import json
import os
import time

# First, let's check if the visualizer HTML has our patches
html_path = r"C:\Burgandy\burgandy-cognitive-framework\outputs\burgandy_network_3d.html"
print("[TEST] Checking visualizer patches...")
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()
    
if 'THOUGHT-TRAIN VISUALIZATION' in html_content:
    print("[OK] Thought-train visualization patch found")
else:
    print("[FAIL] Thought-train visualization patch NOT found")
    
if 'isThoughtTrain' in html_content:
    print("[OK] Thought-train properties found")
else:
    print("[FAIL] Thought-train properties NOT found")

# Now create a test thought-train
print("\n[TEST] Creating test thought-train...")
live_state_path = r"C:\Burgandy\burgandy-cognitive-framework\outputs\live_state.json"

# Load existing live state
with open(live_state_path, 'r') as f:
    live_state = json.load(f)

# Add a fresh thought-train (less than 10 seconds old)
import datetime
now = datetime.datetime.now().isoformat()

new_thought_train = {
    "id": f"tt_test_{int(time.time())}",
    "task_id": "test_visual_001",
    "timestamp": now,
    "activated_nodes": ["language_comprehension", "logic", "mathematics", "working_memory"],
    "traversed_edges": [
        ["language_comprehension", "logic"],
        ["logic", "mathematics"],
        ["mathematics", "working_memory"]
    ],
    "duration_ms": 2450,
    "result": "success",
    "error_message": None
}

# Ensure thought_trains array exists
if "thought_trains" not in live_state:
    live_state["thought_trains"] = []

# Add new thought-train (most recent first)
live_state["thought_trains"].insert(0, new_thought_train)

# Keep only last 10
if len(live_state["thought_trains"]) > 10:
    live_state["thought_trains"] = live_state["thought_trains"][:10]

# Write back
with open(live_state_path, 'w') as f:
    json.dump(live_state, f, indent=2)

print(f"[OK] Added fresh thought-train: {new_thought_train['id']}")
print(f"  Path: {' -> '.join(new_thought_train['activated_nodes'])}")
print(f"  Edges: {len(new_thought_train['traversed_edges'])}")

print("\n[TEST] Verification:")
print("1. Refresh: http://localhost:8765/burgandy_network_3d.html")
print("2. Look for:")
print("   - Gold/orange edges along: language_comprehension → logic → mathematics → working_memory")
print("   - Gold node labels for those nodes")
print("   - Status should show: 'Thinking: language_comprehension → logic → mathematics → working_memory'")
print("   - Thought-train edges should be thicker (8px) and brighter than adaptive edges")
print("3. Thought-train should fade over 10 seconds")

print("\n[TEST] Current live_state.json has:")
print(f"  - {len(live_state.get('thought_trains', []))} thought-train(s)")
if live_state.get("thought_trains"):
    latest = live_state["thought_trains"][0]
    age_ms = (datetime.datetime.now() - datetime.datetime.fromisoformat(latest["timestamp"].replace('Z', ''))).total_seconds() * 1000
    print(f"  - Latest: {latest['id']} ({age_ms:.0f}ms ago)")
    print(f"  - Should be visible: {'YES' if age_ms < 10000 else 'NO (too old)'}")