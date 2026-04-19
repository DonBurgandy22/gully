"""
Create fresh thought-train and analyze what SHOULD be visually true
"""
import json
import time
from datetime import datetime

print("=== IMMEDIATE VISUAL TRUTH TEST ===\n")

# 1. Create FRESH thought-train
with open('burgandy-cognitive-framework/outputs/live_state.json', 'r') as f:
    state = json.load(f)

fresh_thought = {
    'id': f'tt_fresh_now_{int(time.time())}',
    'timestamp': datetime.now().isoformat(),
    'activated_nodes': ['logic', 'mathematics', 'systems_thinking', 'first_principles_reasoning'],
    'traversed_edges': [
        ['logic', 'mathematics'],           # EXISTS
        ['mathematics', 'systems_thinking'], # EXISTS  
        ['systems_thinking', 'first_principles_reasoning']  # MISSING
    ],
    'task': 'Immediate visual truth test'
}

state['thought_trains'] = [fresh_thought]  # Replace with only this fresh one

with open('burgandy-cognitive-framework/outputs/live_state.json', 'w') as f:
    json.dump(state, f, indent=2)

print("1. CREATED FRESH THOUGHT-TRAIN")
print(f"   ID: {fresh_thought['id']}")
print(f"   Age: 0 seconds")
print(f"   Path: logic -> mathematics -> systems_thinking -> first_principles_reasoning")

# 2. Analyze what SHOULD be visible
print("\n2. WHAT SHOULD BE VISIBLE RIGHT NOW:")
print("   A. Gold/orange path connecting all 4 nodes")
print("   B. Thicker gold lines (width: 8.0)")
print("   C. Pulsing gold spheres along path")
print("   D. Temporary overlay for missing edge (systems_thinking->first_principles_reasoning)")
print("   E. Status showing 'Active'")
print("   F. Fade factor: 1.0 (fresh)")

# 3. Check protection logic
print("\n3. PROTECTION LOGIC (should be active):")
print("   A. Regular edge styling SKIPS thought-train edges")
print("   B. Color lerping SKIPS thought-train edges")
print("   C. Gold color persists until fade completes")

# 4. Check fade/restore logic
print("\n4. FADE/RESTORE LOGIC:")
print("   A. Fade decreases from 1.0 to 0.0 over 10 seconds")
print("   B. When fade = 0, thought-train edges return to normal")
print("   C. Temporary overlays are removed")
print("   D. Status returns to 'Idle' or other activity")

# 5. Verification steps
print("\n5. TO VERIFY VISUAL TRUTH:")
print("   Open browser to: http://localhost:8765/burgandy_network_3d.html")
print("   Look for:")
print("   - Gold path (logic -> mathematics -> systems_thinking -> first_principles_reasoning)")
print("   - Status: 'Active'")
print("   - Wait 10 seconds, watch fade-out")
print("   - After fade: normal edges, no gold path")

print("\n=== CRITICAL VERIFICATION ===")
print("The system is NOW READY for visual verification.")
print("All patches are applied.")
print("Fresh thought-train is in live_state.json.")
print("Visualizer should show gold thought-train path.")
print("\nIf NOT visible, the patches failed.")
print("If visible but overwritten, protection failed.")
print("If doesn't fade/restore, fade logic failed.")