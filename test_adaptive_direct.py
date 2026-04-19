"""
Test adaptive network directly.
"""
import sys
import json
from pathlib import Path

# Add framework to path
framework_path = Path(__file__).parent / "burgandy-cognitive-framework" / "src"
sys.path.insert(0, str(framework_path))

print("=== Testing adaptive_network module directly ===")

try:
    import adaptive_network
    print("[OK] adaptive_network imported successfully")
    
    # Test creating adaptive network
    adaptive_net = adaptive_network.get_adaptive_network()
    print(f"[OK] Adaptive network created: {adaptive_net}")
    
    # Test processing activation
    print("\n=== Test 1: Processing activation ===")
    edges = adaptive_network.update_for_activation(["working_memory", "mathematics"], "Test task")
    print(f"Adaptive edges returned: {edges}")
    
    # Test getting adaptive edges
    print("\n=== Test 2: Getting adaptive edges ===")
    all_edges = adaptive_network.get_adaptive_edges()
    print(f"Total adaptive edges: {len(all_edges)}")
    for edge in all_edges:
        print(f"  {edge['source']} -> {edge['target']}: weight={edge['weight']:.2f}")
    
    # Test merging with base edges
    print("\n=== Test 3: Merging with base edges ===")
    merged = adaptive_network.merge_with_base_edges()
    print(f"Total merged edges: {len(merged)}")
    
    # Check if adaptive edges file was created
    adaptive_path = Path(__file__).parent / "burgandy-cognitive-framework" / "outputs" / "adaptive_edges.json"
    print(f"\n=== Test 4: Checking adaptive_edges.json ===")
    if adaptive_path.exists():
        with open(adaptive_path, 'r') as f:
            data = json.load(f)
        print(f"adaptive_edges.json exists: {len(data.get('adaptive_edges', []))} edges")
        for edge in data.get('adaptive_edges', [])[:3]:
            print(f"  {edge['source']} -> {edge['target']}: {edge['current_weight']:.2f}")
    else:
        print("adaptive_edges.json not created yet")
    
except Exception as e:
    print(f"[ERROR] Error: {e}")
    import traceback
    traceback.print_exc()

print("\n=== Testing live_network integration ===")
try:
    import live_network
    print("[OK] live_network imported successfully")
    
    # Test activation
    print("Activating nodes...")
    live_network.activate(["logic", "mathematics", "systems_thinking"], "Integration test")
    
    # Check live_state.json
    live_state_path = Path(__file__).parent / "burgandy-cognitive-framework" / "outputs" / "live_state.json"
    if live_state_path.exists():
        with open(live_state_path, 'r') as f:
            state = json.load(f)
        print(f"Active nodes: {state.get('active_nodes', [])}")
        print(f"All edges count: {len(state.get('all_edges', []))}")
        
except Exception as e:
    print(f"[ERROR] Error: {e}")
    import traceback
    traceback.print_exc()