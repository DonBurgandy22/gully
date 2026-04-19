"""
Audit actual screen behavior vs what's visible.
"""
import json
import time
import os
import sys

print("=== SCREEN-TRUTH AUDIT ===\n")

# 1. Check current live state
state_file = r"C:\Burgandy\burgandy-cognitive-framework\outputs\live_state.json"
try:
    with open(state_file, 'r') as f:
        state = json.load(f)
    
    print("1. CURRENT LIVE STATE:")
    print(f"   Task: {state.get('task', 'No task')}")
    print(f"   Active nodes: {len(state.get('active_nodes', []))}")
    print(f"   Active edges: {len(state.get('active_edges', []))}")
    print(f"   Timestamp: {state.get('timestamp', 'No timestamp')}")
    
    # Check if state is idle
    is_idle = len(state.get('active_nodes', [])) == 0
    print(f"   Is idle: {is_idle}")
    
except Exception as e:
    print(f"Error reading state: {e}")

# 2. Check visualizer HTML for actual rendering
print("\n2. VISUALIZER RENDERING CHECK:")
html_file = r"C:\Burgandy\burgandy-cognitive-framework\outputs\burgandy_network_3d.html"
try:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for visual intensity
    checks = {
        'Glow intensity > 1.0': 'emissiveIntensity: weight * 1.5' in content,
        'Width scaling strong': 'width = Math.max(0.2, weight * 6.0)' in content,
        'Opacity scaling strong': 'opacity = Math.max(0.1, weight * 1.2)' in content,
        'Active boost 3x': 'isActive ? 3.0 : 1.0' in content,
        'Pulse visible': 'opacity: weight * 0.3' in content,
    }
    
    for check, result in checks.items():
        print(f"   {check}: {'[YES]' if result else '[NO]'}")
        
except Exception as e:
    print(f"Error reading HTML: {e}")

# 3. Create a test to see what's actually visible
print("\n3. CREATING VISUAL TEST...")

# Create a dramatic test state
test_state = {
    "task": "SCREEN-TRUTH TEST: Weight differences MUST be OBVIOUS",
    "timestamp": time.strftime('%Y-%m-%dT%H:%M:%S'),
    "active_nodes": ["mathematics", "working_memory", "logic", "abstraction"],
    "active_edges": [
        ["mathematics", "working_memory"],  # weight 0.95 - should be BRIGHT
        ["logic", "working_memory"],        # weight 0.45 - should be FAINT
        ["abstraction", "mathematics"],     # weight 0.60 - should be MEDIUM
    ],
    "all_edges": state.get('all_edges', []) if 'state' in locals() else []
}

# Write test state
with open(state_file, 'w') as f:
    json.dump(test_state, f, indent=2)

print("   Test state written with:")
print("   - mathematics->working_memory (weight 0.95): SHOULD GLOW BRIGHTEST")
print("   - logic->working_memory (weight 0.45): SHOULD BE FAINT")
print("   - abstraction->mathematics (weight 0.60): SHOULD BE MEDIUM")
print("\n   REFRESH http://localhost:8765/burgandy_network_3d.html")
print("   Look for:")
print("   1. Can you immediately see which edge is strongest?")
print("   2. Are adaptive edges (green) clearly different from base edges (blue)?")
print("   3. Is there visible pulse/flow along active edges?")
print("   4. Does the graph look alive or mostly static?")

# 4. Check visualizer server
print("\n4. VISUALIZER SERVER STATUS:")
try:
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', 8765))
    if result == 0:
        print("   Server: RUNNING on port 8765")
        print("   URL: http://localhost:8765/burgandy_network_3d.html")
    else:
        print("   Server: NOT RUNNING (port 8765 closed)")
    sock.close()
except Exception as e:
    print(f"   Server check error: {e}")