"""
Immediate test to see what's visually working.
"""
import json
import time
import sys
import os

# Check live state
state_file = r"C:\Burgandy\burgandy-cognitive-framework\outputs\live_state.json"
print("Checking live state...")
try:
    with open(state_file, 'r') as f:
        state = json.load(f)
    
    print(f"Timestamp: {state.get('timestamp', 'N/A')}")
    print(f"Active nodes: {len(state.get('active_nodes', []))}")
    print(f"Active edges: {len(state.get('active_edges', []))}")
    print(f"All edges: {len(state.get('all_edges', []))}")
    
    # Check adaptive edges
    adaptive_edges = [e for e in state.get('all_edges', []) if e.get('relation_type') == 'adaptive']
    print(f"\nAdaptive edges: {len(adaptive_edges)}")
    
    # Show weights
    print("\nTop 5 adaptive edges by weight:")
    for edge in sorted(adaptive_edges, key=lambda x: x.get('weight', 0), reverse=True)[:5]:
        print(f"  {edge['source']} -> {edge['target']}: weight={edge.get('weight', 0):.3f}")
    
    # Check if visualizer is running
    print("\nChecking visualizer...")
    try:
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('localhost', 8765))
        if result == 0:
            print("  Visualizer server: RUNNING on port 8765")
        else:
            print("  Visualizer server: NOT RUNNING")
        sock.close()
    except:
        print("  Visualizer server: UNKNOWN")
        
except Exception as e:
    print(f"Error: {e}")

# Check visualizer HTML
print("\nChecking visualizer HTML...")
html_file = r"C:\Burgandy\burgandy-cognitive-framework\outputs\burgandy_network_3d.html"
try:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for key visual features
    checks = {
        'emissiveIntensity': 'emissiveIntensity' in content,
        'glow': 'glow' in content.lower(),
        'adaptive': 'adaptive' in content.lower(),
        'weight-based': 'weight' in content and 'opacity' in content,
        'pulse': 'pulse' in content.lower(),
    }
    
    for check, result in checks.items():
        print(f"  {check}: {'YES' if result else 'NO'}")
        
except Exception as e:
    print(f"Error reading HTML: {e}")