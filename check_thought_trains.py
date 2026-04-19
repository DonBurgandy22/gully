"""
Check current thought-trains.
"""
import json

live_state_path = r"C:\Burgandy\burgandy-cognitive-framework\outputs\live_state.json"

with open(live_state_path, 'r') as f:
    data = json.load(f)

trains = data.get("thought_trains", [])
print(f"Total thought-trains: {len(trains)}")

if trains:
    print("\nMost recent thought-trains:")
    for i, t in enumerate(trains[:5]):
        print(f"\n{i+1}. {t.get('id', 'N/A')}")
        print(f"   Task: {t.get('task_id', 'N/A')}")
        print(f"   Result: {t.get('result', 'N/A')}")
        print(f"   Nodes: {t.get('activated_nodes', [])}")
        print(f"   Edges: {t.get('traversed_edges', [])}")
        
        # Check age
        from datetime import datetime
        timestamp = t.get('timestamp')
        if timestamp:
            try:
                train_time = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                now = datetime.now()
                age_seconds = (now - train_time).total_seconds()
                print(f"   Age: {age_seconds:.1f} seconds")
                print(f"   Visible: {'YES' if age_seconds < 10 else 'NO (too old)'}")
            except:
                print(f"   Age: Unknown")
else:
    print("No thought-trains found")