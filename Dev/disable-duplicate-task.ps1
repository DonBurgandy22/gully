# disable-duplicate-task.ps1
# Disables duplicate BurgundyContextMonitor task (older version)
# Keeps BurgundyContextMonitor2Min active

$taskName = "BurgundyContextMonitor"
$logFile = "C:\Dev\task-cleanup-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

try {
    $task = Get-ScheduledTask -TaskName $taskName -ErrorAction Stop
    if ($task.State -ne "Disabled") {
        Disable-ScheduledTask -TaskName $taskName -ErrorAction Stop
        "[$timestamp] Disabled scheduled task: $taskName" | Out-File $logFile -Encoding UTF8 -Append
        Write-Host "Disabled task: $taskName"
    } else {
        "[$timestamp] Task already disabled: $taskName" | Out-File $logFile -Encoding UTF8 -Append
        Write-Host "Task already disabled."
    }
}
catch [Microsoft.PowerShell.Cmdletization.Cim.CimJobException] {
    if ($_.Exception.Message -like "*not found*") {
        "[$timestamp] Task not found: $taskName" | Out-File $logFile -Encoding UTF8 -Append
        Write-Host "Task not found."
    } else {
        "[$timestamp] ERROR: $($_.Exception.Message)" | Out-File $logFile -Encoding UTF8 -Append
        Write-Error "Failed to disable task: $_"
    }
}
catch {
    "[$timestamp] ERROR: $($_.Exception.Message)" | Out-File $logFile -Encoding UTF8 -Append
    Write-Error "Unexpected error: $_"
}