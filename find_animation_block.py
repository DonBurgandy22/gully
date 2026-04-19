"""
Find the animation block in the HTML file.
"""
import re

html_file = r"C:\Burgandy\burgandy-cognitive-framework\outputs\burgandy_network_3d.html"

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Find animation function
match = re.search(r'// Animation loop[\s\S]*?function animate\(\) \{[\s\S]*?\}\s*\n\s*animate\(\);', content)
if match:
    print("Found animation block:")
    print("-" * 50)
    print(match.group(0)[:500])
    print("..." if len(match.group(0)) > 500 else "")
    print("-" * 50)
    print(f"Block length: {len(match.group(0))} characters")
    
    # Show the exact text we need to replace
    lines = match.group(0).split('\n')
    print("\nFirst 10 lines of animation block:")
    for i, line in enumerate(lines[:10]):
        print(f"{i:2}: {line}")
else:
    print("Animation block not found!")