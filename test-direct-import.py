import sys
import os
sys.path.insert(0, 'C:\\Burgandy')

# Import the module directly
import importlib.util
spec = importlib.util.spec_from_file_location("burgandy_runtime_hooks", "C:\\Burgandy\\burgandy-runtime-hooks.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

print("Module loaded successfully")
print(f"Available functions: {[x for x in dir(module) if not x.startswith('_')]}")

# Test it
status = module.get_framework_status()
print(f"Framework available: {status.get('available', False)}")

if status.get("available"):
    module.task_start("Direct import test", ["logic", "mathematics"])
    import time
    time.sleep(2)
    module.task_end()
    print("Test completed")