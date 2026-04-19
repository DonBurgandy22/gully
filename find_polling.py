"""
Find the polling interval in the HTML file.
"""
import re

html_file = r"C:\Burgandy\burgandy-cognitive-framework\outputs\burgandy_network_3d.html"

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Look for setInterval or setTimeout patterns
patterns = [
    r'setInterval\([^,]+,\s*(\d+)',
    r'setTimeout\([^,]+,\s*(\d+)',
    r'interval\s*=\s*(\d+)',
    r'pollInterval\s*=\s*(\d+)',
    r'2000\s*\)',
    r'2000\s*;',
]

print("Searching for polling interval...")
for pattern in patterns:
    matches = re.findall(pattern, content)
    if matches:
        print(f"Pattern '{pattern}': {matches}")

# Also look for fetchLiveState function
if 'fetchLiveState' in content:
    print("\nFound fetchLiveState function")
    # Find where it's called
    fetch_pos = content.find('fetchLiveState')
    context = content[max(0, fetch_pos-100):min(len(content), fetch_pos+200)]
    print("Context around fetchLiveState:")
    print(context)