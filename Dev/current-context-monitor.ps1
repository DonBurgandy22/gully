# burgundy-context-monitor-complete.ps1
# Runs every 2 minutes via Task Scheduler
# Checks OpenClaw context and triggers restart if over 70%
# Uses complete restart protocol with memory save
# NO POP-UPS - runs silently

$logFile = "C:\Dev\restart-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:18789/__openclaw__/status" -Method GET -TimeoutSec 5
    $contextPct = $response.context.usedPercent

    if ($contextPct -ge 80) {
        "[$timestamp] [EMERGENCY] EMERGENCY RESTART - context: $contextPct%" | Out-File $logFile -Encoding UTF8 -Append
        # Run silently with -WindowStyle Hidden
        Start-Process powershell -ArgumentList "-NonInteractive -WindowStyle Hidden -File C:\Dev\current-self-restart.ps1" -WindowStyle Hidden
    }
    elseif ($contextPct -ge 70) {
        "[$timestamp] [RESTART] AUTO-RESTART TRIGGERED - context: $contextPct%" | Out-File $logFile -Encoding UTF8 -Append
        # Run silently with -WindowStyle Hidden
        Start-Process powershell -ArgumentList "-NonInteractive -WindowStyle Hidden -File C:\Dev\current-self-restart.ps1" -WindowStyle Hidden
    }
    else {
        # Only log every 10th check to reduce log spam
        $random = Get-Random -Minimum 1 -Maximum 11
        if ($random -eq 1) {
            "[$timestamp] Context check: $contextPct% - OK" | Out-File $logFile -Encoding UTF8 -Append
        }
    }
}
catch {
    Add-Content $logFile "[$timestamp] Context monitor error: $($_.Exception.Message)"
    exit 0
}