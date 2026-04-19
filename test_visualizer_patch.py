import json
import time
from datetime import datetime

# Read current live state
with open('burgandy-cognitive-framework/outputs/live_state.json', 'r') as f:
    state = json.load(f)

# Create a fresh thought-train with edges that don't exist in the graph
# logic->mathematics doesn't exist in EDGES (only mathematics->logic exists)
# systems_thinking->first_principles_reasoning doesn't exist
fresh_thought = {
    'id': f'tt_fresh_{int(time.time())}',
    'timestamp': datetime.now().isoformat(),
    'activated_nodes': ['logic', 'mathematics', 'systems_thinking', 'first_principles_reasoning'],
    'traversed_edges': [['logic', 'mathematics'], ['mathematics', 'systems_thinking'], ['systems_thinking', 'first_principles_reasoning']],
    'task': 'Test missing edge visualization'
}

# Add to thought-trains
if 'thought_trains' not in state:
    state['thought_trains'] = []
state['thought_trains'].insert(0, fresh_thought)

# Keep only last 5 thought-trains
state['thought_trains'] = state['thought_trains'][:5]

# Write back
with open('burgandy-cognitive-framework/outputs/live_state.json', 'w') as f:
    json.dump(state, f, indent=2)

print(f'Created fresh thought-train: {fresh_thought["id"]}')
print(f'Edges: {fresh_thought["traversed_edges"]}')

# Check which edges exist in EDGES
edges_in_graph = []
for edge in state.get('all_edges', []):
    edges_in_graph.append(f"{edge['source']}->{edge['target']}")

print('\nEdge existence check:')
for source, target in fresh_thought['traversed_edges']:
    edge_key = f"{source}->{target}"
    exists = edge_key in edges_in_graph
    print(f'  {edge_key}: {"EXISTS" if exists else "MISSING (will be temporary overlay)"}')