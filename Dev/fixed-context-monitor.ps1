# fixed-context-monitor.ps1
# Uses full path to openclaw.cmd to work under SYSTEM account
# Runs every 2 minutes via Task Scheduler
# Checks OpenClaw context and triggers restart if over 70%
# Uses complete restart protocol with memory save
# NO POP-UPS - runs silently

$logFile = "C:\Dev\restart-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

try {
    # Try multiple approaches to get status
    
    # Approach 1: Use openclaw.cmd with full path
    $openclawPath = "C:\Users\dkmac\AppData\Roaming\npm\openclaw.cmd"
    $jsonOutput = & $openclawPath status --json 2>&1
    
    # If that fails, try Approach 2: Use node directly
    if (-not $jsonOutput -or $jsonOutput -match "is not recognized") {
        $nodePath = "C:\Program Files\nodejs\node.exe"
        $openclawJsPath = "C:\Users\dkmac\AppData\Roaming\npm\node_modules\openclaw\openclaw.mjs"
        $jsonOutput = & $nodePath $openclawJsPath status --json 2>&1
    }
    
    if (-not $jsonOutput) {
        throw "openclaw status --json returned empty"
    }
    
    # Parse JSON
    $status = $jsonOutput | ConvertFrom-Json
    
    # Find the active session - look in sessions.recent array (main session is first)
    if ($status.sessions -and $status.sessions.recent -and $status.sessions.recent.Count -gt 0) {
        $session = $status.sessions.recent[0]
        
        # Calculate context percentage if not provided
        if ($session.percentUsed -ne $null) {
            $contextPct = $session.percentUsed
        }
        else {
            # Compute from input/output tokens
            $inputTokens = if ($session.inputTokens -ne $null) { $session.inputTokens } else { 0 }
            $outputTokens = if ($session.outputTokens -ne $null) { $session.outputTokens } else { 0 }
            $contextTokens = if ($session.contextTokens -ne $null) { $session.contextTokens } else { 65536 }
            $totalTokens = $inputTokens + $outputTokens
            if ($contextTokens -gt 0) {
                $contextPct = [math]::Round(($totalTokens / $contextTokens) * 100, 2)
            }
            else {
                $contextPct = 0
            }
        }
    }
    else {
        throw "Could not find session context percentage in status output"
    }
    
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