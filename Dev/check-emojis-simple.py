#!/usr/bin/env python3
"""
Check what emojis are actually in the simulation monitor file - simple version
"""

import sys

# Read file in binary mode
with open('C:/Dev/simulation-results/simulation-monitor.html', 'rb') as f:
    data = f.read()

# Common emoji UTF-8 byte sequences with descriptions
emoji_map = {
    b'\xf0\x9f\x93\x88': 'Chart Increasing (U+1F4C8)',
    b'\xe2\x9c\x85': 'Check Mark (U+2705)',
    b'\xf0\x9f\x94\x84': 'Anticlockwise Arrows (U+1F504)',
    b'\xf0\x9f\x93\x8a': 'Bar Chart (U+1F4CA)',
    b'\xf0\x9f\x93\x81': 'File Folder (U+1F4C1)',
    b'\xf0\x9f\x8e\xaf': 'Direct Hit (U+1F3AF)',
}

print("Searching for emoji byte sequences in file:")
found_count = 0
for byte_seq, emoji_desc in emoji_map.items():
    pos = data.find(byte_seq)
    if pos != -1:
        # Count occurrences
        count = 0
        search_pos = 0
        while True:
            search_pos = data.find(byte_seq, search_pos)
            if search_pos == -1:
                break
            count += 1
            search_pos += len(byte_seq)
        
        found_count += 1
        print(f"  {emoji_desc}: {count} occurrence(s), first at byte {pos}")

print(f"\nTotal unique emojis found: {found_count}")

# Now let's check the actual issue - the file might be double-encoded
# Let's check if there are any encoding issues
print("\nChecking for potential encoding issues:")

# Read the file as text with UTF-8
try:
    with open('C:/Dev/simulation-results/simulation-monitor.html', 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Look for the specific lines mentioned
    lines = text.split('\n')
    for i, line in enumerate(lines):
        if 'Success Rate Over Time' in line or 'Refresh Data' in line:
            print(f"\nLine {i+1}:")
            # Show the line with character codes
            display = ''
            for char in line.strip():
                if ord(char) < 128:
                    display += char
                else:
                    display += f'[U+{ord(char):04X}]'
            print(f"  {display}")
            
except UnicodeDecodeError as e:
    print(f"Error reading file as UTF-8: {e}")
    
# Check file encoding by looking at first few bytes
print(f"\nFirst 100 bytes of file (hex):")
first_100 = data[:100]
hex_str = ' '.join(f'{b:02x}' for b in first_100)
print(hex_str)

# Check for common encoding issues
if b'\xc3\xb0' in data[:500]:  # Common mojibake for UTF-8 misinterpreted as Latin-1
    print("\nWARNING: Found \\xc3\\xb0 pattern which suggests possible double-encoding!")
    
# Save a test version with emojis replaced
print("\nCreating test version with emoji replacements...")
with open('C:/Dev/simulation-results/simulation-monitor.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace emojis with text equivalents
replacements = {
    '📈': '[CHART]',
    '✅': '[CHECK]', 
    '🔄': '[REFRESH]',
    '📊': '[BAR CHART]',
    '📁': '[FOLDER]',
    '🎯': '[TARGET]',
}

modified_text = text
for emoji, replacement in replacements.items():
    modified_text = modified_text.replace(emoji, replacement)

# Save test version
test_file = 'C:/Dev/simulation-results/simulation-monitor-test.html'
with open(test_file, 'w', encoding='utf-8') as f:
    f.write(modified_text)

print(f"Test version saved to: {test_file}")
print("This version has emojis replaced with text to avoid encoding issues.")