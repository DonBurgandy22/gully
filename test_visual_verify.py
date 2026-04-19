"""
Verify visual improvements are in place.
"""
import json
import datetime

# Check the updated HTML
html_file = r"C:\Burgandy\burgandy-cognitive-framework\outputs\burgandy_network_3d.html"
print("Checking visual improvements...\n")

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check for our improvements
improvements = {
    'Strong glow multiplier (2.5x)': 'glowIntensity = weight * 2.5' in content,
    'No weak * 0.3 multiplier': 'emissiveIntensity: glowIntensity * 0.3' not in content,
    'Extreme width scaling (6.0x)': 'width = Math.max(0.2, weight * 6.0)' in content,
    'Low minimum opacity (0.1)': 'opacity = Math.max(0.1, weight * 1.2)' in content,
    'Weight-based pulse opacity': 'opacity: weight * 0.3' in content,
    'Strong pulse glow': 'emissiveIntensity: 0.8 + weight * 0.4' in content,
    '3x active boost': 'targetOpacity = e.baseOpacity * (isActive ? 3.0 : 1.0)' in content,
    '2.5x width boost': 'targetWidth = e.baseWidth * (isActive ? 2.5 : 1.0)' in content,
    'Extreme active glow': 'emissiveIntensity = weight * 1.5 * glowBoost' in content,
    'Pulse scaling': 'pulseScale = 1.0 + weight * 0.5' in content,
}

print("IMPROVEMENTS CHECK:")
for check, result in improvements.items():
    status = "[OK]" if result else "[FAIL]"
    print(f"  {status} {check}")

# Update live state with more dramatic test
state_file = r"C:\Burgandy\burgandy-cognitive-framework\outputs\live_state.json"
with open(state_file, 'r') as f:
    state = json.load(f)

# Create more dramatic activation
new_state = state.copy()
new_state['active_nodes'] = ['mathematics', 'working_memory', 'logic', 'abstraction', 'probabilistic_reasoning']
new_state['active_edges'] = [
    ['mathematics', 'working_memory'],  # weight 0.95
    ['logic', 'working_memory'],        # weight 0.45
    ['abstraction', 'probabilistic_reasoning'],  # weight 0.60
    ['language_comprehension', 'logic'],  # weight 0.92 (base edge)
]
new_state['task'] = "VISUAL TEST: Weight differences should be OBVIOUS"
new_state['timestamp'] = datetime.datetime.now().isoformat()

with open(state_file, 'w') as f:
    json.dump(new_state, f, indent=2)

print("\nACTIVATION SET:")
print("  High weight (0.95): mathematics -> working_memory [ADAPTIVE]")
print("  Medium weight (0.60): abstraction -> probabilistic_reasoning [ADAPTIVE]")
print("  Low weight (0.45): logic -> working_memory [ADAPTIVE]")
print("  Base edge (0.92): language_comprehension -> logic [BASE]")
print("\nVISUAL EXPECTATIONS:")
print("  1. mathematics->working_memory should GLOW BRIGHTEST (thick, bright gold)")
print("  2. abstraction->probabilistic_reasoning should glow medium")
print("  3. logic->working_memory should glow faint")
print("  4. Adaptive edges should be GREEN, base edges BLUE")
print("  5. Pulse spheres should be visible on all active edges")
print("\nRefresh http://localhost:8765/burgandy_network_3d.html")