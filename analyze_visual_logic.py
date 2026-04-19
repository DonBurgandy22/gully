"""
Analyze visual logic to predict what should be visible
"""
import json
from datetime import datetime

print("=== VISUAL LOGIC ANALYSIS ===\n")

# Read live state
with open('burgandy-cognitive-framework/outputs/live_state.json', 'r') as f:
    state = json.load(f)

# Check thought-trains
thought_trains = state.get('thought_trains', [])
print(f"Thought-trains in system: {len(thought_trains)}")

for i, tt in enumerate(thought_trains):
    timestamp = tt.get('timestamp', '')
    age_seconds = 999
    if timestamp:
        try:
            train_time = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            age_seconds = (datetime.now() - train_time).total_seconds()
        except:
            pass
    
    print(f"\nThought-train {i+1}: {tt.get('id', 'unknown')}")
    print(f"  Age: {age_seconds:.1f} seconds")
    print(f"  Fade factor: {max(0, 1.0 - (age_seconds / 10.0)):.2f} (1.0 = fresh, 0.0 = faded)")
    print(f"  Visible in visualizer: {'YES' if age_seconds < 10 else 'NO (too old)'}")
    
    if age_seconds < 10:
        print(f"  Current visual state: GOLD thought-train path")
        print(f"  Status should show: 'Active'")
    else:
        print(f"  Current visual state: Normal base/adaptive edges")
        print(f"  Status should show: 'Idle' or other activity")

# Check edge existence
print("\n=== EDGE EXISTENCE ANALYSIS ===")
all_edges = state.get('all_edges', [])
edge_keys = [f"{e['source']}->{e['target']}" for e in all_edges]

if thought_trains and thought_trains[0]['traversed_edges']:
    latest_edges = thought_trains[0]['traversed_edges']
    print(f"Latest thought-train edges: {len(latest_edges)}")
    
    for source, target in latest_edges:
        edge_key = f"{source}->{target}"
        exists = edge_key in edge_keys
        age = (datetime.now() - datetime.fromisoformat(thought_trains[0]['timestamp'].replace('Z', '+00:00'))).total_seconds()
        fade = max(0, 1.0 - (age / 10.0))
        
        if exists:
            print(f"  {edge_key}: EXISTS in graph")
            print(f"    - If fade > 0: Gold thought-train edge (protected from regular styling)")
            print(f"    - If fade = 0: Normal base/adaptive edge")
        else:
            print(f"  {edge_key}: MISSING from graph")
            print(f"    - If fade > 0: Temporary gold overlay edge")
            print(f"    - If fade = 0: Not visible (temporary edge removed)")

print("\n=== PREDICTED VISUAL TRUTH ===")
if thought_trains:
    latest = thought_trains[0]
    age = (datetime.now() - datetime.fromisoformat(latest['timestamp'].replace('Z', '+00:00'))).total_seconds()
    
    if age < 10:
        print("1. ✓ Gold/orange thought-train path should be visible")
        print("2. ✓ Temporary overlay for missing edges should be visible")
        print("3. ✓ Thought-train edges protected from regular styling")
        print("4. ✓ Status should show 'Active'")
        print("5. ⏳ Fade-out in progress")
    else:
        print("1. ✗ Thought-train too old (>10s) - not visible")
        print("2. ✗ No temporary overlays (faded out)")
        print("3. ✓ All edges returned to normal state")
        print("4. ✓ Status shows 'Idle' or other activity")
        print("5. ✓ Clean restoration complete")
else:
    print("No thought-trains to visualize")