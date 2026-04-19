#!/usr/bin/env python3
"""
Fix emoji encoding issues in simulation monitor
"""

import re

# Read the original file
with open('C:/Dev/simulation-results/simulation-monitor.html', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Original file size: {len(content)} characters")

# Find all emojis and their positions
emoji_pattern = re.compile(r'[^\x00-\x7F]')
matches = list(emoji_pattern.finditer(content))

print(f"\nFound {len(matches)} non-ASCII characters (emojis):")
for i, match in enumerate(matches):
    char = match.group()
    pos = match.start()
    line_num = content[:pos].count('\n') + 1
    # Get some context
    start = max(0, pos - 30)
    end = min(len(content), pos + 30)
    context = content[start:end].replace('\n', ' ')
    print(f"{i+1}. U+{ord(char):04X} at position {pos} (line {line_num})")
    print(f"   Context: ...{context}...")

# Create fixed version - replace emojis with HTML entities or text
# Emoji to HTML entity mapping
emoji_replacements = {
    '📈': '&#x1F4C8;',  # HTML entity for 📈
    '🔄': '&#x1F504;',  # HTML entity for 🔄
    '🎯': '&#x1F3AF;',  # HTML entity for 🎯
}

# Also create a text-only version
text_replacements = {
    '📈': '[CHART]',
    '🔄': '[REFRESH]',
    '🎯': '[TARGET]',
}

# Create HTML entity version
html_entity_content = content
for emoji, entity in emoji_replacements.items():
    html_entity_content = html_entity_content.replace(emoji, entity)

# Create text-only version
text_only_content = content
for emoji, text in text_replacements.items():
    text_only_content = text_only_content.replace(emoji, text)

# Save both versions
html_entity_file = 'C:/Dev/simulation-results/simulation-monitor-fixed-entities.html'
text_only_file = 'C:/Dev/simulation-results/simulation-monitor-fixed-text.html'

with open(html_entity_file, 'w', encoding='utf-8') as f:
    f.write(html_entity_content)

with open(text_only_file, 'w', encoding='utf-8') as f:
    f.write(text_only_content)

print(f"\nFixed versions created:")
print(f"1. HTML entities version: {html_entity_file}")
print(f"2. Text-only version: {text_only_file}")

# Also update the original file with HTML entities (safer)
with open('C:/Dev/simulation-results/simulation-monitor.html', 'w', encoding='utf-8') as f:
    f.write(html_entity_content)

print(f"\nOriginal file updated with HTML entities for emojis")

# Verify the fix
print("\nVerifying fix...")
with open('C:/Dev/simulation-results/simulation-monitor.html', 'r', encoding='utf-8') as f:
    fixed_content = f.read()
    
fixed_matches = list(emoji_pattern.finditer(fixed_content))
print(f"Non-ASCII characters after fix: {len(fixed_matches)}")

if len(fixed_matches) == 0:
    print("✅ All emojis successfully replaced with HTML entities!")
else:
    print("⚠️ Some emojis might still be present:")
    for match in fixed_matches:
        print(f"  U+{ord(match.group()):04X} at position {match.start()}")