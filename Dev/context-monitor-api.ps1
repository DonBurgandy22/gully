$logFile = "C:\Dev\restart-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

try {
    # Use Invoke-RestMethod to call the OpenClaw status API
    $status = Invoke-RestMethod -Uri "http://127.0.0.1:18789/status" -Method Get -ErrorAction Stop
    
    # Check if we have sessions data
    if ($status.sessions -and $status.sessions.recent -and $status.sessions.recent.Count -gt 0) {
        $percentUsed = $status.sessions.recent[0].percentUsed
        
        if ($percentUsed -ge 90) {
            Add-Content $logFile "[$timestamp] Context check: $percentUsed% - TRIGGERING RESTART"
            
            # Trigger restart
            Start-Process powershell -ArgumentList "-NonInteractive -WindowStyle Hidden -File C:\Dev\current-self-restart.ps1" -WindowStyle Hidden
        } else {
            Add-Content $logFile "[$timestamp] Context check: $percentUsed% - OK"
        }
    } else {
        Add-Content $logFile "[$timestamp] Context monitor error: No session data in API response"
    }
} catch {
    Add-Content $logFile "[$timestamp] Context monitor error: $($_.Exception.Message)"
}