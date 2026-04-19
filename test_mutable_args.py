"""
Test for mutable default arguments.
"""
import ast
import sys

def check_mutable_defaults(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    tree = ast.parse(content)
    
    issues = []
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            for arg in node.args.defaults:
                # Check for list literals
                if isinstance(arg, ast.List):
                    issues.append(f"Function '{node.name}' has mutable default list: {ast.unparse(arg)}")
                # Check for dict literals  
                elif isinstance(arg, ast.Dict):
                    issues.append(f"Function '{node.name}' has mutable default dict: {ast.unparse(arg)}")
                # Check for set literals
                elif isinstance(arg, ast.Set):
                    issues.append(f"Function '{node.name}' has mutable default set: {ast.unparse(arg)}")
    
    return issues

print("Checking C:\\Burgandy\\burgandy-runtime-hooks.py for mutable defaults...")
issues = check_mutable_defaults(r"C:\Burgandy\burgandy-runtime-hooks.py")

if issues:
    print("ISSUES FOUND:")
    for issue in issues:
        print(f"  - {issue}")
else:
    print("No mutable default arguments found.")

# Also check for =[] directly
print("\nChecking for '=[]' patterns...")
with open(r"C:\Burgandy\burgandy-runtime-hooks.py", 'r') as f:
    lines = f.readlines()
    for i, line in enumerate(lines, 1):
        if '=[]' in line:
            print(f"Line {i}: {line.strip()}")