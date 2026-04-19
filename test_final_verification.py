"""
Final verification of runtime hooks.
"""
import sys
import importlib.util

print("[VERIFICATION] Testing burgandy-runtime-hooks.py")

# Import the module
spec = importlib.util.spec_from_file_location("burgandy_runtime_hooks", r"C:\Burgandy\burgandy-runtime-hooks.py")
module = importlib.util.module_from_spec(spec)

try:
    spec.loader.exec_module(module)
    print("[OK] Module imported successfully")
    
    # Check function signatures
    import inspect
    
    print("\n[CHECK] Function signatures:")
    
    # task_end
    sig = inspect.signature(module.task_end)
    print(f"task_end: {sig}")
    params = list(sig.parameters.values())
    for p in params:
        if p.name in ['activated_nodes', 'traversed_edges']:
            print(f"  {p.name}: default={p.default} (type: {type(p.default).__name__})")
            if p.default is not None:
                print(f"  [WARNING] {p.name} should have default=None, not {p.default}")
    
    # task_failed  
    sig = inspect.signature(module.task_failed)
    print(f"\ntask_failed: {sig}")
    params = list(sig.parameters.values())
    for p in params:
        if p.name in ['activated_nodes', 'traversed_edges']:
            print(f"  {p.name}: default={p.default} (type: {type(p.default).__name__})")
            if p.default is not None:
                print(f"  [WARNING] {p.name} should have default=None, not {p.default}")
    
    # record_thought_train
    sig = inspect.signature(module.record_thought_train)
    print(f"\nrecord_thought_train: {sig}")
    
    print("\n[VERIFICATION] All checks passed if no warnings above.")
    
except Exception as e:
    print(f"[FAILED] Error: {e}")
    import traceback
    traceback.print_exc()