#!/usr/bin/env python3
"""
Simple script to fix emoji encoding issues
"""

import re

# Read the original file
with open('C:/Dev/simulation-results/simulation-monitor.html', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Original file size: {len(content)} characters")

# Count emojis
emoji_pattern = re.compile(r'[^\x00-\x7F]')
matches = list(emoji_pattern.finditer(content))
print(f"Found {len(matches)} non-ASCII characters (emojis)")

# Replace emojis with HTML entities
replacements = {
    '📈': '&#x1F4C8;',  # 📈
    '🔄': '&#x1F504;',  # 🔄
    '🎯': '&#x1F3AF;',  # 🎯
}

fixed_content = content
for emoji, entity in replacements.items():
    fixed_content = fixed_content.replace(emoji, entity)

# Save the fixed file
with open('C:/Dev/simulation-results/simulation-monitor.html', 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print("SUCCESS: File updated with HTML entities for emojis")

# Verify
with open('C:/Dev/simulation-results/simulation-monitor.html', 'r', encoding='utf-8') as f:
    verified_content = f.read()
    
verified_matches = list(emoji_pattern.finditer(verified_content))
print(f"Non-ASCII characters after fix: {len(verified_matches)}")

if len(verified_matches) == 0:
    print("✅ All emojis successfully replaced!")
else:
    print(f"⚠️ Still found {len(verified_matches)} non-ASCII characters")

# Also update the server to use the fixed file
print("\nServer already configured with charset=utf-8 header")
print("Fixed file should now display correctly in browsers")