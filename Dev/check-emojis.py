#!/usr/bin/env python3
"""
Check what emojis are actually in the simulation monitor file
"""

import sys

# Read file in binary mode
with open('C:/Dev/simulation-results/simulation-monitor.html', 'rb') as f:
    data = f.read()

# Common emoji UTF-8 byte sequences
emoji_map = {
    b'\xf0\x9f\x93\x88': '📈 (U+1F4C8)',
    b'\xe2\x9c\x85': '✅ (U+2705)',
    b'\xf0\x9f\x94\x84': '🔄 (U+1F504)',
    b'\xf0\x9f\x93\x8a': '📊 (U+1F4CA)',
    b'\xf0\x9f\x93\x81': '📁 (U+1F4C1)',
    b'\xf0\x9f\x8e\xaf': '🎯 (U+1F3AF)',
}

print("Searching for emoji byte sequences in file:")
found_emojis = []
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
        
        found_emojis.append((emoji_desc, count, pos))
        print(f"  {emoji_desc}: {count} occurrence(s), first at byte {pos}")

print(f"\nTotal unique emojis found: {len(found_emojis)}")

# Now let's check if the file has BOM (Byte Order Mark)
if data[:3] == b'\xef\xbb\xbf':
    print("\nFile has UTF-8 BOM (Byte Order Mark)")
else:
    print("\nFile does not have UTF-8 BOM")

# Check the actual content around first emoji
if found_emojis:
    first_emoji_desc, count, pos = found_emojis[0]
    print(f"\nFirst emoji context (bytes {pos-20} to {pos+30}):")
    context = data[max(0, pos-20):pos+30]
    # Show as hex
    hex_str = ' '.join(f'{b:02x}' for b in context)
    print(f"  Hex: {hex_str}")
    
    # Try to decode
    try:
        decoded = context.decode('utf-8')
        # Show with emoji codes
        display = ''
        for char in decoded:
            if ord(char) < 128:
                display += char
            else:
                display += f'[U+{ord(char):04X}]'
        print(f"  Decoded: {display}")
    except UnicodeDecodeError as e:
        print(f"  Decode error: {e}")