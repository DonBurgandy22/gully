import subprocess
import sys

# Test 1: Simple subprocess
print("Test 1: Running python -c 'print(\"test\")'")
result = subprocess.run([sys.executable, '-c', 'print("test")'], capture_output=True, text=True)
print(f"Return code: {result.returncode}")
print(f"Output: {result.stdout}")
print(f"Error: {result.stderr}")
print(f"Success: {result.returncode == 0}")

# Test 2: Check if local_notebooklm.make_audio is accessible
print("\nTest 2: Checking local_notebooklm.make_audio module")
try:
    import local_notebooklm.make_audio
    print("Module found!")
    print(f"Module location: {local_notebooklm.make_audio.__file__}")
except ImportError as e:
    print(f"Module not found: {e}")