import json
import time
from datetime import datetime

# Read current live state
with open('burgandy-cognitive-framework/outputs/live_state.json', 'r') as f:
    state = json.load(f)

# Create a fresh thought-train with mixed edges (some exist, some don't)
fresh_thought = {
    'id': f'tt_visual_test_{int(time.time())}',
    'timestamp': datetime.now().isoformat(),
    'activated_nodes': ['logic', 'mathematics', 'systems_thinking', 'first_principles_reasoning'],
    'traversed_edges': [
        ['logic', 'mathematics'],           # EXISTS in graph
        ['mathematics', 'systems_thinking'], # EXISTS in graph  
        ['systems_thinking', 'first_principles_reasoning']  # MISSING from graph
    ],
    'task': 'Visual truth verification test'
}

# Add to thought-trains
if 'thought_trains' not in state:
    state['thought_trains'] = []
state['thought_trains'].insert(0, fresh_thought)

# Keep only last 3 thought-trains
state['thought_trains'] = state['thought_trains'][:3]

# Write back
with open('burgandy-cognitive-framework/outputs/live_state.json', 'w') as f:
    json.dump(state, f, indent=2)

print(f"Created fresh thought-train: {fresh_thought['id']}")
print(f"Age: 0 seconds (fresh)")
print(f"Path: logic -> mathematics -> systems_thinking -> first_principles_reasoning")
print(f"Edge 'systems_thinking->first_principles_reasoning' is MISSING from base graph")
print(f"Visualizer URL: http://localhost:8765/burgandy_network_3d.html")
print("\nExpected visual truth:")
print("1. Gold/orange path connecting all 4 nodes")
print("2. Thicker gold lines with pulsing spheres")
print("3. Temporary overlay for missing edge")
print("4. Status shows 'Active'")
print("5. Fade-out over ~10 seconds")