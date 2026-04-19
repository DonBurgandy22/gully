"""
Test edge inference logic.
"""
import sys
import importlib.util

print("[TEST] Testing edge inference in burgandy-runtime-hooks.py")

# Import the module
spec = importlib.util.spec_from_file_location("burgandy_runtime_hooks", r"C:\Burgandy\burgandy-runtime-hooks.py")
module = importlib.util.module_from_spec(spec)

try:
    spec.loader.exec_module(module)
    print("[OK] Module imported successfully")
    
    # Test edge inference logic
    print("\n[TEST] Edge inference examples:")
    
    test_cases = [
        (["a", "b", "c", "d"], None, "4 nodes, no edges provided"),
        (["logic", "mathematics", "working_memory"], [], "3 nodes, empty edges list"),
        (["single_node"], None, "Single node, no edges"),
        (["a", "b"], [["a", "b"]], "2 nodes, edges already provided"),
        ([], None, "Empty nodes list"),
    ]
    
    for nodes, edges, description in test_cases:
        print(f"\nTest: {description}")
        print(f"  Nodes: {nodes}")
        print(f"  Provided edges: {edges}")
        
        # Simulate the logic
        if edges is None or (isinstance(edges, list) and len(edges) == 0):
            if len(nodes) >= 2:
                inferred_edges = []
                for i in range(len(nodes) - 1):
                    inferred_edges.append([nodes[i], nodes[i + 1]])
                result = inferred_edges
                print(f"  Result: INFERRED {len(result)} edges: {result}")
            else:
                result = []
                print(f"  Result: NO inference (single/empty): {result}")
        else:
            result = edges
            print(f"  Result: USING provided edges: {result}")
    
    print("\n[TEST] Integration test - simulate task_end call")
    
    # Mock the framework to avoid actual activation
    module.FRAMEWORK_AVAILABLE = False
    
    # Test 1: With nodes only (should auto-generate edges)
    print("\nTest 1: task_end with nodes only")
    try:
        module.task_end(task_id="test_1", activated_nodes=["comprehension", "logic", "mathematics"])
        print("  [OK] Called successfully (edges should be auto-generated)")
    except Exception as e:
        print(f"  [ERROR] {e}")
    
    # Test 2: With explicit edges
    print("\nTest 2: task_end with explicit edges")
    try:
        module.task_end(
            task_id="test_2", 
            activated_nodes=["a", "b", "c"],
            traversed_edges=[["a", "c"], ["c", "b"]]  # Non-sequential edges
        )
        print("  [OK] Called successfully (using explicit edges)")
    except Exception as e:
        print(f"  [ERROR] {e}")
    
    # Test 3: task_failed with nodes only
    print("\nTest 3: task_failed with nodes only")
    try:
        module.task_failed(
            error_message="Test failure",
            task_id="test_3",
            activated_nodes=["planning", "decision_making", "working_memory"]
        )
        print("  [OK] Called successfully (edges should be auto-generated)")
    except Exception as e:
        print(f"  [ERROR] {e}")
    
    print("\n[TEST] All tests completed")
    
except Exception as e:
    print(f"[FAILED] Error: {e}")
    import traceback
    traceback.print_exc()