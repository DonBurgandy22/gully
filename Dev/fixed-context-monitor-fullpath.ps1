# fixed-context-monitor.ps1
# Uses full path to openclaw.cmd to work under SYSTEM account
# Runs every 2 minutes via Task Scheduler
# Checks OpenClaw context and triggers restart if over 70%
# Uses complete restart protocol with memory save
# NO POP-UPS - runs silently

$logFile = "C:\Dev\restart-log.txt"
$openclawPath = "C:\Users\dkmac\AppData\Roaming\npm\openclaw.cmd"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

try {
    # Use openclaw CLI to get status as JSON with full path
    $jsonOutput = & $openclawPath status --json
    if (-not $jsonOutput) {
        throw "openclaw status --json returned empty"
    }
    
    # Parse JSON
    $status = $jsonOutput | ConvertFrom-Json
    
    # Find the active session with valid percentUsed or totalTokens
    if ($status.sessions -and $status.sessions.recent -and $status.sessions.recent.Count -gt 0) {
        $contextPct = $null
        # Try each recent session until we find a valid percentage
        foreach ($session in $status.sessions.recent) {
            # Use percentUsed if available and numeric
            if ($session.percentUsed -ne $null -and $session.percentUsed -ge 0 -and $session.percentUsed -le 100) {
                $contextPct = $session.percentUsed
                break
            }
            # Otherwise compute from totalTokens if available
            elseif ($session.totalTokens -ne $null -and $session.totalTokens -gt 0 -and $session.contextTokens -ne $null -and $session.contextTokens -gt 0) {
                $contextPct = [math]::Round(($session.totalTokens / $session.contextTokens) * 100, 2)
                # Sanity check: if percentage > 100, maybe totalTokens is cumulative, fallback
                if ($contextPct -gt 100) {
                    $contextPct = $null
                    continue
                }
                break
            }
        }
        
        if ($contextPct -eq $null) {
            # Fallback to file-based estimation using burgundy-context-monitor.ps1 logic
            $sessionFilesPath = "C:\Users\dkmac\.openclaw\agents\main\sessions\*.jsonl"
            if (Test-Path $sessionFilesPath) {
                $totalSize = (Get-ChildItem $sessionFilesPath | Measure-Object -Property Length -Sum).Sum
                # Approximate: 1 token ≈ 4 bytes, context window 65536 tokens ≈ 262144 bytes
                $contextBytes = 262144
                if ($contextBytes -gt 0) {
                    $contextPct = [math]::Round(($totalSize / $contextBytes) * 100, 2)
                }
                else {
                    $contextPct = 0
                }
            }
            else {
                throw "Could not find session context percentage in status output and no session files"
            }
        }
    }
    else {
        throw "Could not find session context percentage in status output"
    }
    
    # Thresholds per AGENTS.md: 70% auto-restart, 80% emergency restart
    # Use ">=" instead of "≥" to avoid UTF-8 encoding issues
    if ($contextPct -ge 80) {
        "[$timestamp] [EMERGENCY] EMERGENCY RESTART - context: $contextPct%" | Out-File $logFile -Encoding UTF8 -Append
        # Run silently with -WindowStyle Hidden
        Start-Process powershell -ArgumentList "-NonInteractive -WindowStyle Hidden -File C:\Dev\current-self-restart.ps1" -WindowStyle Hidden
    }
    elseif ($contextPct -ge 70) {
        "[$timestamp] [AUTO-RESTART] AUTO-RESTART TRIGGERED - context: $contextPct%" | Out-File $logFile -Encoding UTF8 -Append
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