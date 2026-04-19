"""
Test thought-train recording.
"""
import sys
sys.path.insert(0, 'C:\\Burgandy')

try:
    # Import the module directly since it has hyphens
    import importlib.util
    spec = importlib.util.spec_from_file_location("burgandy_runtime_hooks", "C:\\Burgandy\\burgandy-runtime-hooks.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    task_start = module.task_start
    task_end = module.task_end
    task_failed = module.task_failed
    print("[TEST] Cognitive framework hooks loaded")
    
    # Test successful task with thought-train
    print("\n[TEST] Running successful task...")
    task_start("Test structural analysis", ["comprehension", "mathematics", "structural_analysis", "engineering_decisions"], "structural")
    
    # Simulate task execution
    import time
    time.sleep(1)
    
    # End with thought-train
    task_end(
        task_id="test_structural_001",
        activated_nodes=["comprehension", "mathematics", "structural_analysis", "engineering_decisions"],
        traversed_edges=[
            ["comprehension", "mathematics"],
            ["mathematics", "structural_analysis"],
            ["structural_analysis", "engineering_decisions"]
        ],
        result="success"
    )
    
    print("\n[TEST] Checking live_state.json...")
    import json
    import os
    live_state_path = r"C:\Burgandy\burgandy-cognitive-framework\outputs\live_state.json"
    if os.path.exists(live_state_path):
        with open(live_state_path, 'r') as f:
            live_state = json.load(f)
        
        if "thought_trains" in live_state and len(live_state["thought_trains"]) > 0:
            print(f"[TEST] SUCCESS: Found {len(live_state['thought_trains'])} thought-train(s)")
            latest = live_state["thought_trains"][0]
            print(f"  ID: {latest.get('id')}")
            print(f"  Task: {latest.get('task_id')}")
            print(f"  Nodes: {latest.get('activated_nodes')}")
            print(f"  Edges: {latest.get('traversed_edges')}")
            print(f"  Result: {latest.get('result')}")
        else:
            print("[TEST] FAILED: No thought_trains found in live_state.json")
    else:
        print("[TEST] FAILED: live_state.json not found")
        
except ImportError as e:
    print(f"[TEST] FAILED: Could not import hooks: {e}")
except Exception as e:
    print(f"[TEST] FAILED: {e}")
    import traceback
    traceback.print_exc()