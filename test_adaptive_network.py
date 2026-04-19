"""
Test adaptive network implementation.
"""
import sys
import time
from pathlib import Path

# Add framework to path
framework_path = Path(__file__).parent / "burgandy-cognitive-framework" / "src"
sys.path.insert(0, str(framework_path))

from live_network import activate, deactivate_all
from adaptive_network import get_adaptive_network, get_adaptive_edges

print("=== TEST 1: Two Linked Nodes Activating Together Repeatedly ===")
print("Activating: language_comprehension + logic (existing base edge)")
for i in range(3):
    activate(["language_comprehension", "logic"], f"Test repetition {i+1}")
    time.sleep(2)
    deactivate_all()
    time.sleep(1)

adaptive_edges = get_adaptive_edges()
print(f"Adaptive edges after test 1: {len(adaptive_edges)}")
for edge in adaptive_edges:
    print(f"  {edge['source']} → {edge['target']}: weight={edge['weight']:.2f}, uses={edge.get('notes', 'N/A')}")

print("\n=== TEST 2: Two Unlinked Nodes Forming New Adaptive Edge ===")
print("Activating: working_memory + mathematics (no existing edge)")
activate(["working_memory", "mathematics"], "Forming new adaptive edge")
time.sleep(2)
deactivate_all()
time.sleep(1)

adaptive_edges = get_adaptive_edges()
print(f"Adaptive edges after test 2: {len(adaptive_edges)}")
for edge in adaptive_edges:
    print(f"  {edge['source']} → {edge['target']}: weight={edge['weight']:.2f}")

print("\n=== TEST 3: Link Strength Increasing with Repeated Use ===")
print("Repeatedly activating same pair to strengthen edge")
for i in range(5):
    activate(["working_memory", "mathematics"], f"Strengthening edge {i+1}")
    time.sleep(1)
    deactivate_all()
    time.sleep(0.5)

# Check edge weight
adaptive_network = get_adaptive_network()
weight = adaptive_network.get_edge_weight("working_memory", "mathematics")
print(f"Final weight after 5 reinforcements: {weight:.2f}")
print(f"Expected: ~{0.20 + (5 * 0.05):.2f} (baseline + 5 reinforcements)")

print("\n=== TEST 4: Visualizer Integration Check ===")
print("Activating multiple nodes to test edge display")
activate(["logic", "mathematics", "systems_thinking"], "Multi-node activation test")
print("Check live_state.json for 'all_edges' field with adaptive edges")
time.sleep(2)
deactivate_all()

print("\n=== TEST 5: Reading live_state.json ===")
import json
live_state_path = Path(__file__).parent / "burgandy-cognitive-framework" / "outputs" / "live_state.json"
if live_state_path.exists():
    with open(live_state_path, 'r') as f:
        state = json.load(f)
    print(f"Active nodes: {state.get('active_nodes', [])}")
    print(f"Active edges: {state.get('active_edges', [])}")
    print(f"All edges count: {len(state.get('all_edges', []))}")
    if state.get('all_edges'):
        sample = state['all_edges'][0] if len(state['all_edges']) > 0 else {}
        print(f"Sample edge: {sample.get('source', 'N/A')} → {sample.get('target', 'N/A')} weight={sample.get('weight', 0):.2f}")

print("\n=== TEST COMPLETE ===")