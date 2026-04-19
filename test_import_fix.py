"""
Test import fix for adaptive network.
"""
import sys
from pathlib import Path

# Add framework to path
framework_path = Path(__file__).parent / "burgandy-cognitive-framework" / "src"
sys.path.insert(0, str(framework_path))

print(f"Python path: {sys.path[:3]}")

# Try importing adaptive_network directly
try:
    import adaptive_network
    print("adaptive_network import successful")
    
    # Try importing live_network
    import live_network
    print("live_network import successful")
    
    # Check if ADAPTIVE_AVAILABLE is set
    print(f"ADAPTIVE_AVAILABLE: {getattr(live_network, 'ADAPTIVE_AVAILABLE', 'NOT FOUND')}")
    
except Exception as e:
    print(f"Import error: {e}")
    import traceback
    traceback.print_exc()