# Monitor simulation progress
$logFile = "C:\Dev\restart-log.txt"
$checkpointFile = "C:\Dev\simulation-results\checkpoint.json"
$resultsFile = "C:\Dev\simulation-results\million-simulations-results.json"

while ($true) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    if (Test-Path $checkpointFile) {
        try {
            $checkpoint = Get-Content $checkpointFile | ConvertFrom-Json
            $completed = $checkpoint.completed
            $totalNetWorth = $checkpoint.total_net_worth
            $avgNetWorth = $totalNetWorth / [math]::Max(1, $completed)
            
            "[$timestamp] [SIM-MONITOR] Progress: $completed/1000000 ($([math]::Round($completed/10000, 1))%)" | Out-File $logFile -Encoding UTF8 -Append
            "[$timestamp] [SIM-MONITOR] Avg net worth: R$($avgNetWorth.ToString('N2'))" | Out-File $logFile -Encoding UTF8 -Append
            
            if ($completed -ge 1000000) {
                "[$timestamp] [SIM-MONITOR] COMPLETE: 1,000,000 simulations finished!" | Out-File $logFile -Encoding UTF8 -Append
                break
            }
        }
        catch {
            "[$timestamp] [SIM-MONITOR] Error reading checkpoint: $_" | Out-File $logFile -Encoding UTF8 -Append
        }
    }
    else {
        "[$timestamp] [SIM-MONITOR] Waiting for checkpoint file..." | Out-File $logFile -Encoding UTF8 -Append
    }
    
    Start-Sleep -Seconds 60  # Check every minute
}
