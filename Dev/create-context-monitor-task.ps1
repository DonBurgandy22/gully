# Create BurgundyContextMonitor scheduled task
# Runs every 2 minutes to check OpenClaw context usage

Write-Host "Creating BurgundyContextMonitor scheduled task..."

try {
    # Create action
    $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NonInteractive -WindowStyle Hidden -File C:\Dev\burgundy-context-monitor.ps1"
    
    # Create trigger that runs every 2 minutes
    $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 2)
    
    # Register the task
    Register-ScheduledTask -TaskName "BurgundyContextMonitor" -Action $action -Trigger $trigger -RunLevel Highest -Force
    
    Write-Host "✅ BurgundyContextMonitor task created successfully" -ForegroundColor Green
    Write-Host "Task will run every 2 minutes starting now"
    Write-Host "Logs: C:\Dev\restart-log.txt"
    Write-Host "Monitor script: C:\Dev\burgundy-context-monitor.ps1"
    Write-Host "Restart script: C:\Dev\burgundy-self-restart.ps1"
    
} catch {
    Write-Host "❌ Failed to create task: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}