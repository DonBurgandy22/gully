"""
Test real activation with framework.
"""
import sys
import importlib.util
import time

print("[TEST] Testing real activation with cognitive framework")

# Import runtime hooks
spec = importlib.util.spec_from_file_location("burgandy_runtime_hooks", r"C:\Burgandy\burgandy-runtime-hooks.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

print(f"FRAMEWORK_AVAILABLE: {module.FRAMEWORK_AVAILABLE}")

if module.FRAMEWORK_AVAILABLE:
    print("[OK] Framework is available via runtime hooks")
    
    # Run a real task using the hooks
    print("\n[1] Starting real task with task_start()")
    module.task_start(
        "Verify thought-train visualization",
        ["logic", "mathematics", "systems_thinking", "first_principles_reasoning"],
        "structural"
    )
    
    print("[2] Simulating work...")
    time.sleep(3)
    
    print("[3] Ending task with task_end() - NO traversed_edges provided")
    module.task_end(
        task_id="visual_truth_test",
        activated_nodes=["logic", "mathematics", "systems_thinking", "first_principles_reasoning"]
        # traversed_edges NOT provided - should auto-generate
    )
    
    print("[4] Waiting for dwell time...")
    time.sleep(12)
    
    print("\n[TEST] Task completed.")
    print("Check live_state.json for new thought-train with auto-generated edges.")
    
else:
    print("[SKIP] Framework not available - cannot run real activation")