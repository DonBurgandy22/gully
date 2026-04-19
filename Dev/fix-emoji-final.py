#!/usr/bin/env python3
"""
Final fix for emoji encoding issues
"""

# Read the original file
with open('C:/Dev/simulation-results/simulation-monitor.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("Fixing emoji encoding issues...")

# Replace emojis with HTML entities
# These are the exact emojis found in the file
replacements = {
    '\U0001f4c8': '&#x1F4C8;',  # 📈
    '\U0001f504': '&#x1F504;',  # 🔄
    '\U0001f3af': '&#x1F3AF;',  # 🎯
}

fixed_content = content
for emoji, entity in replacements.items():
    fixed_content = fixed_content.replace(emoji, entity)

# Save the fixed file
with open('C:/Dev/simulation-results/simulation-monitor.html', 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print("DONE: File updated with HTML entities")
print("Emojis replaced with HTML numeric entities")
print("This should fix the display issues in browsers")