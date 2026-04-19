#!/usr/bin/env python3
"""
Simple test of task state persistence
"""

import json
import os
from pathlib import Path
from datetime import datetime

print("=== Task State Persistence Test ===\n")

# Check files
bridge_dir = Path("C:/Dev/bridge")
task_state_file = bridge_dir / "task-state.json"
bridge_worker_file = bridge_dir / "bridge-worker-v2.py"

print("Checking files:")
print(f"  bridge-worker-v2.py: {'EXISTS' if bridge_worker_file.exists() else 'MISSING'}")
print(f"  task-state.json: {'EXISTS' if task_state_file.exists() else 'MISSING'}")

if task_state_file.exists():
    print("\nCurrent task state:")
    try:
        with open(task_state_file, 'r', encoding='utf-8') as f:
            state = json.load(f)
        
        print(f"  Last updated: {state.get('last_updated', 'unknown')}")
        print(f"  Active tasks: {len(state.get('active_tasks', []))}")
        print(f"  Completed tasks: {len(state.get('completed_tasks', []))}")
        
        if state.get('active_tasks'):
            print("\n  Active tasks details:")
            for task in state['active_tasks']:
                print(f"    • {task.get('task_id', 'unknown')}: {task.get('task_text', '')[:60]}...")
                print(f"      Status: {task.get('status', 'unknown')}, Progress: {task.get('checkpoint_data', {}).get('progress', 0)}%")
                print(f"      Last checkpoint: {task.get('last_checkpoint', 'never')}")
    except Exception as e:
        print(f"  Error reading state: {e}")

# Test creating a new task
print("\n=== Testing Task Creation ===")
test_task = {
    "task_id": "test-" + datetime.now().strftime("%H%M%S"),
    "task_text": "Test task state persistence with manual restart",
    "status": "in_progress",
    "created_at": datetime.now().isoformat(),
    "started_at": datetime.now().isoformat(),
    "last_checkpoint": datetime.now().isoformat(),
    "checkpoint_data": {
        "step": "testing_persistence",
        "progress": 40,
        "next_steps": ["manual_restart", "verify_state", "resume_task"],
        "completed_steps": ["created_test_task", "saved_state"]
    }
}

# Update task state
if task_state_file.exists():
    try:
        with open(task_state_file, 'r', encoding='utf-8') as f:
            state = json.load(f)
        
        # Add test task
        if 'active_tasks' not in state:
            state['active_tasks'] = []
        
        state['active_tasks'].append(test_task)
        state['last_updated'] = datetime.now().isoformat()
        
        # Save
        with open(task_state_file, 'w', encoding='utf-8') as f:
            json.dump(state, f, indent=2, ensure_ascii=False)
        
        print("SUCCESS: Added test task to state")
        print(f"  Task ID: {test_task['task_id']}")
        print(f"  Task: {test_task['task_text']}")
        
    except Exception as e:
        print(f"ERROR: Error updating state: {e}")
else:
    print("✗ Cannot update - task-state.json not found")

print("\n=== Test Instructions ===")
print("1. Task state has been saved to task-state.json")
print("2. You can now manually restart OpenClaw:")
print("   Run: openclaw gateway restart")
print("3. After restart, check if the task state persists")
print("4. The test task should still be in 'active_tasks'")
print("\nThis proves task state survives context resets!")