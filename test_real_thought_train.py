"""
Real test of thought-train recording with edge inference.
"""
import sys
import json
import time

# Add the hooks module to path
sys.path.insert(0, r"C:\Burgandy")

try:
    import importlib.util
    spec = importlib.util.spec_from_file_location("burgandy_runtime_hooks", r"C:\Burgandy\burgandy-runtime-hooks.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    task_start = module.task_start
    task_end = module.task_end
    task_failed = module.task_failed
    
    print("[TEST] Starting real thought-train test")
    
    # First, let's see current live state
    live_state_path = r"C:\Burgandy\burgandy-cognitive-framework\outputs\live_state.json"
    with open(live_state_path, 'r') as f:
        current_state = json.load(f)
    
    initial_count = len(current_state.get("thought_trains", []))
    print(f"Initial thought-trains: {initial_count}")
    
    # Test 1: Success with auto-generated edges
    print("\n[TEST 1] task_end with nodes only (auto-generate edges)")
    task_start("Test structural analysis", ["logic", "mathematics", "systems_thinking"], "structural")
    time.sleep(2)  # Simulate work
    task_end(task_id="auto_edge_test", activated_nodes=["logic", "mathematics", "systems_thinking"])
    
    # Test 2: Success with explicit edges (non-sequential)
    print("\n[TEST 2] task_end with explicit edges")
    task_start("Test coding task", ["logic", "symbolic_reasoning", "error_detection"], "coding")
    time.sleep(1)
    task_end(
        task_id="explicit_edge_test",
        activated_nodes=["logic", "symbolic_reasoning", "error_detection"],
        traversed_edges=[["logic", "error_detection"], ["error_detection", "symbolic_reasoning"]]  # Non-sequential
    )
    
    # Test 3: Failure with auto-generated edges
    print("\n[TEST 3] task_failed with nodes only")
    task_start("Test planning that fails", ["planning", "decision_making"], "planning")
    time.sleep(1)
    task_failed(
        error_message="Planning failed due to constraints",
        task_id="failure_test",
        activated_nodes=["planning", "decision_making", "working_memory"]
    )
    
    # Wait for dwell time
    print("\n[TEST] Waiting for dwell time...")
    time.sleep(12)
    
    # Check results
    with open(live_state_path, 'r') as f:
        new_state = json.load(f)
    
    final_count = len(new_state.get("thought_trains", []))
    print(f"\nFinal thought-trains: {final_count}")
    print(f"Added: {final_count - initial_count} new thought-trains")
    
    if new_state.get("thought_trains"):
        print("\nMost recent thought-trains:")
        for i, tt in enumerate(new_state["thought_trains"][:3]):
            print(f"\n{i+1}. {tt['id']} ({tt['result']})")
            print(f"   Task: {tt['task_id']}")
            print(f"   Nodes: {tt['activated_nodes']}")
            print(f"   Edges: {tt['traversed_edges']}")
            print(f"   Duration: {tt.get('duration_ms', 'N/A')}ms")
    
    print("\n[TEST] Check visualizer:")
    print("1. Refresh: http://localhost:8765/burgandy_network_3d.html")
    print("2. Look for gold thought-train edges")
    print("3. Status should show latest thought-train path")
    
except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()