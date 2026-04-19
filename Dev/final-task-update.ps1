# final-task-update.ps1
# Updates the BurgundyContextMonitor2Min task to use the correct fixed script
# Must be run as Administrator

$taskName = "BurgundyContextMonitor2Min"
$taskScript = "C:\Dev\fixed-context-monitor-fullpath.ps1"

Write-Host "Updating task: $taskName"
Write-Host "New script: $taskScript"

# Check if running as Administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Please right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

# Check if task exists
$taskExists = schtasks /query /tn $taskName 2>$null
if (-not $taskExists) {
    Write-Host "ERROR: Task '$taskName' does not exist!" -ForegroundColor Red
    exit 1
}

# Update the task
Write-Host "Updating task arguments..."
$updateResult = schtasks /change /tn $taskName /tr "powershell.exe -NonInteractive -WindowStyle Hidden -File `"$taskScript`""

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Task updated successfully!" -ForegroundColor Green
    
    # Verify the update
    Write-Host "`nVerifying task configuration..."
    schtasks /query /tn $taskName /fo list | Select-String -Pattern "TaskName|Next Run Time|Status|Arguments"
    
    Write-Host "`nTask will run every 2 minutes starting at:"
    schtasks /query /tn $taskName /fo list | Select-String "Next Run Time"
    
    Write-Host "`nThe task now uses the correct script that:"
    Write-Host "1. Uses 'openclaw status --json' to get accurate context percentage"
    Write-Host "2. Triggers at ≥70% context"
    Write-Host "3. Saves memory before restart"
    Write-Host "4. Restarts gateway silently"
    Write-Host "5. Preserves all memory files"
    
} else {
    Write-Host "ERROR: Failed to update task!" -ForegroundColor Red
    Write-Host "Update result: $updateResult"
    exit 1
}