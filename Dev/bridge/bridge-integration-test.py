#!/usr/bin/env python3
"""
Bridge Integration Test - Shows how to use bridge worker from OpenClaw
"""

import sys
import json
from pathlib import Path

# Add bridge directory to path
bridge_dir = Path("C:/Dev/bridge")
sys.path.insert(0, str(bridge_dir))

try:
    # Import directly since we're in the same directory
    import bridge_worker
    from bridge_worker import BridgeWorker
    print("Bridge worker imported successfully")
    
    # Create bridge worker instance
    worker = BridgeWorker()
    
    # Test task: This WhatsApp investigation task
    test_task = "Investigate WhatsApp 499 disconnection issue and implement monitoring"
    
    print(f"\nTesting bridge with task: {test_task}")
    print("=" * 60)
    
    # Process through bridge
    result = worker.process_task(test_task)
    
    print(f"Classification: {result['classification']['primary_path']}")
    print(f"Confidence: {result['classification']['confidence']:.2f}")
    print(f"Final path: {result['final_path']}")
    print(f"Claude status: {result['claude_status']}")
    print(f"Fallback options: {result['fallback_options']}")
    
    # Get execution instructions
    instructions = worker._get_execution_instructions(result)
    print(f"\nExecution instructions:")
    print(f"  Path: {instructions['path']}")
    print(f"  Action: {instructions['instructions'].get('action', 'N/A')}")
    
    if instructions['path'] == 'antigravity':
        print(f"  Workspace: {instructions['instructions'].get('workspace', 'N/A')}")
    elif instructions['path'] == 'claude_code':
        print(f"  Queue file: {instructions['instructions'].get('queue_file', 'N/A')}")
    elif instructions['path'] == 'deepseek':
        print(f"  Model: {instructions['instructions'].get('model', 'N/A')}")
    
    # Show status report
    print(f"\nBridge status report:")
    status = worker.get_status_report()
    print(f"  Claude status: {status['claude_status']}")
    print(f"  Last checked: {status['claude_details'].get('last_checked', 'Never')}")
    print(f"  Error count: {status['claude_details'].get('error_count', 0)}")
    print(f"  Log file: {status['log_file']}")
    
    print(f"\nBridge integration test complete!")
    print(f"This task would be routed to: {result['final_path'].upper()}")
    
except ImportError as e:
    print(f"Failed to import bridge worker: {e}")
    print("Make sure bridge-worker.py is in C:/Dev/bridge/")
except Exception as e:
    print(f"Error during test: {e}")
    import traceback
    traceback.print_exc()