"""
Find the animate function.
"""
html_file = r"C:\Burgandy\burgandy-cognitive-framework\outputs\burgandy_network_3d.html"

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Look for animate function
lines = content.split('\n')
in_animate = False
animate_lines = []
for i, line in enumerate(lines):
    if 'function animate()' in line:
        in_animate = True
    if in_animate:
        animate_lines.append((i, line))
        if line.strip() == '}' and len(animate_lines) > 10:
            # Check if this is the end of animate function
            next_lines = lines[i+1:i+3]
            if any('animate();' in nl for nl in next_lines):
                break

if animate_lines:
    print(f"Found animate function at lines {animate_lines[0][0]} to {animate_lines[-1][0]}")
    print("\nFunction content:")
    for line_num, line in animate_lines:
        print(f"{line_num:4}: {line}")
else:
    print("animate function not found")
    
# Also look for animation loop comment
print("\n" + "="*50)
print("Searching for 'Animation loop' comment...")
for i, line in enumerate(lines):
    if 'Animation loop' in line:
        print(f"Line {i}: {line}")
        # Show next 20 lines
        for j in range(i, min(i+20, len(lines))):
            print(f"  {j:4}: {lines[j]}")