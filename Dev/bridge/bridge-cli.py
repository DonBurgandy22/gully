#!/usr/bin/env python3
"""
Bridge CLI - Simple command-line interface for the bridge worker
"""

import sys
import json
from pathlib import Path

# Add bridge directory to path
bridge_dir = Path(__file__).parent
sys.path.insert(0, str(bridge_dir))

# Now import after path is set
exec(open(bridge_dir / "bridge-worker.py").read())

def route_task(task_text):
    """Route a single task"""
    # Import locally to avoid test execution
    import sys
    from pathlib import Path
    
    bridge_dir = Path(__file__).parent
    bridge_worker_path = bridge_dir / "bridge-worker.py"
    
    # Read and execute just the BridgeWorker class
    with open(bridge_worker_path, 'r') as f:
        content = f.read()
    
    # Execute in a clean namespace
    local_namespace = {}
    exec(content, local_namespace)
    
    # Create worker and process task
    BridgeWorker = local_namespace['BridgeWorker']
    worker = BridgeWorker()
    result = worker.process_task(task_text)
    
    # Format output
    output = {
        "task": task_text,
        "routing": {
            "path": result["path"],
            "instructions": result["instructions"]
        },
        "classification": result.get("classification", {}),
        "claude_status": result.get("claude_status", "unknown")
    }
    
    return output

def main():
    """Main CLI entry point"""
    if len(sys.argv) < 2:
        print("Usage: bridge-cli.py <task>")
        print("Example: bridge-cli.py 'Build a website with 3D effects'")
        sys.exit(1)
    
    task_text = " ".join(sys.argv[1:])
    
    try:
        result = route_task(task_text)
        
        # Print in a readable format
        print("\n" + "=" * 60)
        print("BRIDGE ROUTING DECISION")
        print("=" * 60)
        print(f"Task: {result['task'][:100]}...")
        print(f"\nClassification: {result['classification']['primary_path']}")
        print(f"Confidence: {result['classification']['confidence']:.2%}")
        print(f"\nRouting: {result['routing']['path']}")
        print(f"Claude Status: {result['claude_status']}")
        print("\nInstructions:")
        for key, value in result['routing']['instructions'].items():
            print(f"  {key}: {value}")
        print("=" * 60)
        
        # Also output JSON for programmatic use
        if "--json" in sys.argv:
            print("\n" + json.dumps(result, indent=2))
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()