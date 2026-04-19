#!/usr/bin/env python3
"""
Test script to check emoji encoding in simulation monitor
"""

import sys

# Read the file in binary mode to see actual bytes
with open('C:/Dev/simulation-results/simulation-monitor.html', 'rb') as f:
    data = f.read()

# Look for the <i>📈</i> pattern
search_bytes = b'<i>'
pos = data.find(search_bytes)
count = 0
while pos != -1 and count < 5:
    # Get the next 20 bytes after <i>
    snippet = data[pos:pos+50]
    print(f"Found <i> at byte position {pos}")
    print(f"  Bytes: {snippet}")
    
    # Try to decode as UTF-8
    try:
        decoded = snippet.decode('utf-8')
        # Replace non-printable characters for display
        printable = ''.join(c if ord(c) < 128 else f'[U+{ord(c):04X}]' for c in decoded)
        print(f"  Decoded: {printable}")
    except UnicodeDecodeError:
        print(f"  Cannot decode as UTF-8")
    
    # Find next occurrence
    pos = data.find(search_bytes, pos + 1)
    count += 1

# Also check for specific UTF-8 emoji bytes
# 📈 = F0 9F 93 88
# ✅ = F0 9F 93 97 (actually E2 9C 85)
# Let me check for the actual bytes
emoji_bytes = [
    (b'\xF0\x9F\x93\x88', '📈'),
    (b'\xE2\x9C\x85', '✅'),
    (b'\xF0\x9F\x94\x84', '🔄'),
    (b'\xF0\x9F\x93\x8A', '📊'),
    (b'\xF0\x9F\x93\x81', '📁')
]

print("\nSearching for emoji byte sequences:")
for byte_seq, emoji_name in emoji_bytes:
    pos = data.find(byte_seq)
    if pos != -1:
        print(f"Found {emoji_name.replace(chr(0x1F4C8), '[U+1F4C8]').replace(chr(0x1F3AF), '[U+1F3AF]')} bytes at position {pos}")
        # Show context
        start = max(0, pos - 20)
        end = min(len(data), pos + len(byte_seq) + 30)
        context = data[start:end]
        try:
            decoded = context.decode('utf-8', errors='replace')
            # Replace non-printable characters for display
            printable = ''.join(c if ord(c) < 128 else f'[U+{ord(c):04X}]' for c in decoded)
            print(f"  Context: {printable}")
        except:
            print(f"  Context bytes: {context}")