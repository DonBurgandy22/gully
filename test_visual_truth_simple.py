"""
Direct verification of visual truth - check live state and server status
"""
import json
import time
import urllib.request
import urllib.error
from datetime import datetime

print("=== VISUAL TRUTH VERIFICATION ===\n")

# 1. Check server is running
print("1. Server status check:")
try:
    response = urllib.request.urlopen('http://localhost:8765/', timeout=2)
    print(f"   [OK] Server running on port 8765 (status: {response.status})")
    server_up = True
except urllib.error.URLError as e:
    print(f"   [ERROR] Server not reachable: {e}")
    server_up = False

# 2. Check live state file
print("\n2. Live state file check:")
try:
    with open('burgandy-cognitive-framework/outputs/live_state.json', 'r') as f:
        state = json.load(f)
    
    print(f"   [OK] File exists and is valid JSON")
    
    # Check thought-trains
    thought_trains = state.get('thought_trains', [])
    print(f"   [OK] Thought-trains in file: {len(thought_trains)}")
    
    if thought_trains:
        latest = thought_trains[0]
        timestamp = latest.get('timestamp', '')
        age_seconds = 0
        if timestamp:
            try:
                train_time = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                age_seconds = (datetime.now() - train_time).total_seconds()
            except:
                age_seconds = 999
        
        print(f"   [OK] Latest thought-train: {latest.get('id', 'unknown')}")
        print(f"   [OK] Age: {age_seconds:.1f} seconds")
        print(f"   [OK] Nodes: {latest.get('activated_nodes', [])}")
        print(f"   [OK] Edges: {latest.get('traversed_edges', [])}")
        
        # Check for missing edges
        all_edges = state.get('all_edges', [])
        edge_keys = [f"{e['source']}->{e['target']}" for e in all_edges]
        
        missing_count = 0
        for source, target in latest.get('traversed_edges', []):
            edge_key = f"{source}->{target}"
            if edge_key not in edge_keys:
                missing_count += 1
                print(f"   [OK] Edge {edge_key}: MISSING from base graph (will be temporary overlay)")
        
        if missing_count == 0:
            print(f"   [OK] All edges exist in base graph")
        else:
            print(f"   [OK] {missing_count} edges will be temporary overlays")
            
except Exception as e:
    print(f"   [ERROR] Error reading live state: {e}")

# 3. Check visualizer HTML
print("\n3. Visualizer HTML check:")
try:
    with open('burgandy-cognitive-framework/outputs/burgandy_network_3d.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    checks = {
        "thoughtTrainEdgeMap": "window.thoughtTrainEdgeMap" in html,
        "thoughtTrainSkip": "if(e.isThoughtTrain && e.thoughtTrainFade > 0)" in html,
        "temporaryEdgeCreation": "Edge doesn't exist in base graph" in html,
        "temporaryAnimation": "Animate temporary thought-train edges" in html,
    }
    
    for check_name, present in checks.items():
        status = "[OK]" if present else "[MISSING]"
        print(f"   {status} {check_name}")
        
except Exception as e:
    print(f"   [ERROR] Error reading HTML: {e}")

print("\n=== VERIFICATION SUMMARY ===")
print("To see visual truth:")
if server_up:
    print("1. Open browser to: http://localhost:8765/burgandy_network_3d.html")
    print("2. Look for:")
    print("   - Gold/orange thought-train path")
    print("   - Thicker gold lines with pulsing spheres")
    print("   - Status showing 'Active' during thought-train")
    print("   - Fade-out over ~10 seconds")
else:
    print("Server not running. Start with: python -m http.server 8765")
    print("in burgandy-cognitive-framework/outputs/ directory")