"""
Find the exact line with setInterval.
"""
html_file = r"C:\Burgandy\burgandy-cognitive-framework\outputs\burgandy_network_3d.html"

with open(html_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'setInterval' in line and '2000' in line:
        print(f"Line {i+1}: {line.strip()}")
        # Show context
        for j in range(max(0, i-2), min(len(lines), i+3)):
            print(f"{j+1:4}: {lines[j].rstrip()}")