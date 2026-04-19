"""
Test stronger visual effects.
"""
import sys
import time
from pathlib import Path

framework_path = Path(__file__).parent / "burgandy-cognitive-framework" / "src"
sys.path.insert(0, str(framework_path))

import live_network

print("=== STRONG VISUAL TEST ===")
print("Testing enhanced weight-based glow")
print("Open http://localhost:8765/burgandy_network_3d.html")

# Clear state
live_network.deactivate_all()
time.sleep(2)

print("\n1. VERY STRONG adaptive edge (weight=0.90)")
print("   Should be: BRIGHT GREEN, VERY THICK, HIGH GLOW")
live_network.activate(["mathematics", "working_memory"], "Very strong adaptive")
time.sleep(3)

print("\n2. Very weak adaptive edge (weight=0.25)")
print("   Should be: FAINT GREEN, THIN, LOW GLOW")
live_network.activate(["logic", "working_memory"], "Very weak adaptive")
time.sleep(3)

print("\n3. Strong base edge (weight=0.92)")
print("   Should be: BRIGHT BLUE, VERY THICK, HIGH GLOW")
live_network.activate(["language_comprehension", "logic"], "Strong base")
time.sleep(3)

print("\n4. All active - should see clear hierarchy")
live_network.activate([
    "mathematics", "working_memory",
    "logic", "working_memory", 
    "language_comprehension", "logic"
], "Visual hierarchy test")
time.sleep(5)

print("\n5. Creating NEW adaptive edge")
print("   Should appear as NEW GREEN EDGE")
live_network.activate(["systems_thinking", "causal_reasoning"], "New adaptive edge")
time.sleep(3)

live_network.deactivate_all()
print("\n=== TEST COMPLETE ===")
print("\nWhat you should see:")
print("1. Strong adaptive (weight 0.90): BRIGHT GREEN, THICK, HIGH GLOW")
print("2. Weak adaptive (weight 0.25): FAINT GREEN, THIN, LOW GLOW")
print("3. Strong base (weight 0.92): BRIGHT BLUE, THICK, HIGH GLOW")
print("4. Clear visual difference between strong/weak edges")
print("5. New adaptive edges clearly visible when created")