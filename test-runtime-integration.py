"""
Test the complete runtime integration: task start → work → task end.
This simulates a real Burgandy task with cognitive framework visualization.
"""
import sys
import time
from pathlib import Path

# Add hooks to path
sys.path.insert(0, str(Path(__file__).parent))

try:
    from burgandy_runtime_hooks import task_start, task_end, get_framework_status
    print("✓ Runtime hooks loaded")
except ImportError as e:
    print(f"Failed to load runtime hooks: {e}")
    sys.exit(1)

# Check framework status
status = get_framework_status()
if not status.get("available"):
    print(f"Framework unavailable: {status.get('error', 'Unknown')}")
    sys.exit(1)

print("✓ Framework available")
print(f"✓ Current state: {status.get('task', 'No task')}")

# Simulate a structural analysis task
print("\n--- Starting structural analysis task ---")
task_start("Structural analysis: Beam deflection calculation", task_type="structural")

# Simulate work
print("Performing calculations...")
time.sleep(3)
print("✓ Beam deflection: 12.5 mm")
print("✓ Stress analysis: Within limits")
print("✓ Safety factor: 2.3")

# Complete task
print("\n--- Completing task ---")
task_end()

# Verify final state
final_status = get_framework_status()
if final_status.get("available") and not final_status.get("active_nodes"):
    print("✓ Task completed successfully")
    print("✓ Nodes cooled down automatically")
    print("✓ Runtime integration working")
else:
    print("Integration failed - nodes still active")
    print(f"  State: {final_status}")

print("\n✅ Runtime integration test complete")