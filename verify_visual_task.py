"""
Run a real task to verify thought-train visualization.
"""
import sys
import json
import time
import importlib.util

print("[VERIFICATION] Running real multi-node task")

# Import runtime hooks
spec = importlib.util.spec_from_file_location("burgandy_runtime_hooks", r"C:\Burgandy\burgandy-runtime-hooks.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

# Mock framework to avoid actual network activation
module.FRAMEWORK_AVAILABLE = False

# Clear any existing thought-trains to see fresh one
live_state_path = r"C:\Burgandy\burgandy-cognitive-framework\outputs\live_state.json"
with open(live_state_path, 'r') as f:
    state = json.load(f)

initial_count = len(state.get("thought_trains", []))
print(f"Initial thought-trains: {initial_count}")

# Run a real task with auto-generated edges
print("\n[1] Starting real task: 'Analyze structural design'")
print("    Nodes: ['logic', 'mathematics', 'systems_thinking', 'first_principles_reasoning']")
print("    NO traversed_edges provided (should auto-generate)")

# Start task
module.task_start(
    "Analyze structural design",
    ["logic", "mathematics", "systems_thinking", "first_principles_reasoning"],
    "structural"
)

# Simulate work
time.sleep(3)

# End task - NO traversed_edges provided
print("\n[2] Ending task with only activated_nodes")
module.task_end(
    task_id="visual_verify_001",
    activated_nodes=["logic", "mathematics", "systems_thinking", "first_principles_reasoning"]
    # traversed_edges NOT provided - should auto-generate
)

print("\n[3] Waiting for dwell time...")
time.sleep(11)  # Wait for 10s dwell + buffer

# Check results
with open(live_state_path, 'r') as f:
    new_state = json.load(f)

final_count = len(new_state.get("thought_trains", []))
print(f"\nFinal thought-trains: {final_count}")
print(f"Added: {final_count - initial_count} new thought-train(s)")

if new_state.get("thought_trains"):
    latest = new_state["thought_trains"][0]
    print(f"\n[4] Most recent thought-train:")
    print(f"    ID: {latest['id']}")
    print(f"    Task: {latest['task_id']}")
    print(f"    Result: {latest['result']}")
    print(f"    Nodes: {latest['activated_nodes']}")
    print(f"    Edges: {latest['traversed_edges']}")
    print(f"    Duration: {latest.get('duration_ms', 'N/A')}ms")
    
    # Verify auto-generation
    nodes = latest['activated_nodes']
    edges = latest['traversed_edges']
    
    if len(nodes) >= 2:
        # Check if edges are sequential (auto-generated)
        is_sequential = True
        for i in range(len(nodes) - 1):
            if [nodes[i], nodes[i + 1]] not in edges:
                is_sequential = False
                break
        
        if is_sequential and len(edges) == len(nodes) - 1:
            print(f"\n[OK] Edges auto-generated correctly: {len(edges)} sequential edges")
        else:
            print(f"\n[ISSUE] Edges not sequential: {edges}")
    else:
        print(f"\n[ISSUE] Not enough nodes for edges")

print("\n[5] Verification complete.")
print("Next: Check visualizer at http://localhost:8765/burgandy_network_3d.html")
print("Look for gold thought-train along: logic → mathematics → systems_thinking → first_principles_reasoning")