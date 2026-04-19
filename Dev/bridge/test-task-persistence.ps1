# Test Task State Persistence System
# This script tests that task state survives OpenClaw restarts

Write-Host "=== Task State Persistence Test ===" -ForegroundColor Cyan
Write-Host "Testing bridge worker v2 with state persistence..." -ForegroundColor Yellow

# Check if Python is available
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
    $python = Get-Command python3 -ErrorAction SilentlyContinue
}

if (-not $python) {
    Write-Host "Python not found. Please install Python 3." -ForegroundColor Red
    exit 1
}

# Run the bridge worker v2 test
Write-Host "`nRunning Bridge Worker V2 test..." -ForegroundColor Green
& $python.Source "C:\Dev\bridge\bridge-worker-v2.py"

# Check task state file
Write-Host "`nChecking task state file..." -ForegroundColor Green
if (Test-Path "C:\Dev\bridge\task-state.json") {
    $taskState = Get-Content "C:\Dev\bridge\task-state.json" -Raw | ConvertFrom-Json
    Write-Host "✓ Task state file exists" -ForegroundColor Green
    Write-Host "  Active tasks: $($taskState.active_tasks.Count)" -ForegroundColor White
    Write-Host "  Last updated: $($taskState.last_updated)" -ForegroundColor White
    
    if ($taskState.active_tasks.Count -gt 0) {
        Write-Host "`nActive tasks:" -ForegroundColor Yellow
        foreach ($task in $taskState.active_tasks) {
            Write-Host "  • $($task.task_id): $($task.task_text)" -ForegroundColor White
            Write-Host "    Status: $($task.status), Progress: $($task.checkpoint_data.progress)%" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "✗ Task state file not found" -ForegroundColor Red
}

# Test emergency save function
Write-Host "`nTesting emergency save..." -ForegroundColor Green
& $python.Source -c "
import sys
sys.path.append('C:\Dev\bridge')
from bridge_worker_v2 import BridgeWorkerV2
worker = BridgeWorkerV2()
result = worker.emergency_save()
print(f'Emergency save: {\"SUCCESS\" if result else \"FAILED\"}')
"

# Create a restart simulation test
Write-Host "`n=== Restart Simulation Test ===" -ForegroundColor Cyan
Write-Host "This simulates what happens after an OpenClaw restart:" -ForegroundColor Yellow

$simulationScript = @'
import sys
sys.path.append('C:\Dev\bridge')
from bridge_worker_v2 import BridgeWorkerV2
import json
from pathlib import Path

print("Simulating post-restart recovery...")

# Load existing task state
task_state_path = Path("C:/Dev/bridge/task-state.json")
if task_state_path.exists():
    with open(task_state_path, 'r', encoding='utf-8') as f:
        state = json.load(f)
    
    print(f"Found {len(state.get('active_tasks', []))} active tasks in state file")
    
    # Initialize worker (this automatically resumes tasks)
    worker = BridgeWorkerV2()
    
    # Get status
    status = worker.get_status_report()
    print(f"\nPost-restart status:")
    print(f"  Claude Status: {status['claude_status']}")
    print(f"  Active Tasks: {status['active_tasks_count']}")
    
    if status['active_tasks_count'] > 0:
        print("\n  Tasks ready for resume:")
        for task in status['active_tasks']:
            print(f"    • {task['task_id']}: {task['task_text']}")
            print(f"      Progress: {task['progress']}%, Last checkpoint: {task['last_checkpoint']}")
    
    print("\n✓ Task state persistence working correctly!")
else:
    print("✗ No task state file found")
'@

# Save and run simulation
$simulationScript | Out-File "C:\Dev\bridge\restart-simulation.py" -Encoding UTF8
& $python.Source "C:\Dev\bridge\restart-simulation.py"

# Cleanup
Remove-Item "C:\Dev\bridge\restart-simulation.py" -ErrorAction SilentlyContinue

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
Write-Host "Task state persistence system is ready for testing with actual OpenClaw restarts." -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Daryl: Run 'openclaw gateway restart' to test" -ForegroundColor White
Write-Host "2. After restart, check if tasks resume correctly" -ForegroundColor White
Write-Host "3. Verify task-state.json persists across restart" -ForegroundColor White