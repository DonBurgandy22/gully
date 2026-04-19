"""
Test if cognitive framework is available.
"""
import sys
import importlib.util

print("[TEST] Checking cognitive framework availability")

# Import runtime hooks
spec = importlib.util.spec_from_file_location("burgandy_runtime_hooks", r"C:\Burgandy\burgandy-runtime-hooks.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

print(f"FRAMEWORK_AVAILABLE: {module.FRAMEWORK_AVAILABLE}")

# Try to import framework directly
framework_path = r"C:\Burgandy\burgandy-cognitive-framework\src"
if framework_path in sys.path:
    sys.path.remove(framework_path)
sys.path.insert(0, framework_path)

try:
    import burgandy_cognitive_framework
    print("[OK] Framework imports directly")
    
    # Check if we can activate nodes
    from burgandy_cognitive_framework import activate, deactivate_all
    
    print("[OK] Framework functions available")
    
    # Run a real test
    print("\n[TEST] Running real activation...")
    activate(["logic", "mathematics", "systems_thinking"], task="Test thought-train visualization")
    
    import time
    time.sleep(2)
    
    deactivate_all()
    print("[OK] Activation/deactivation successful")
    
except Exception as e:
    print(f"[ERROR] Framework not fully available: {e}")
    import traceback
    traceback.print_exc()