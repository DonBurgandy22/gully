# Simple verification script - ASCII only, no UTF-8 issues
$logFile = "C:\Dev\verification-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Clear log
"" | Out-File $logFile

# 1. Check Python
try {
    $pythonVersion = python --version 2>&1
    "[$timestamp] [VERIFY] Python: $pythonVersion" | Out-File $logFile -Append
} catch {
    "[$timestamp] [VERIFY] ERROR: Python not found" | Out-File $logFile -Append
}

# 2. Check simulation files
$simulationFiles = @(
    "C:\Dev\million-simulations-runner.py",
    "C:\Dev\run-million-simulations.ps1",
    "C:\Dev\simulation-results\million-simulations-results.json"
)

foreach ($file in $simulationFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        "[$timestamp] [VERIFY] File: $(Split-Path $file -Leaf) ($size bytes)" | Out-File $logFile -Append
    } else {
        "[$timestamp] [VERIFY] ERROR: File missing: $(Split-Path $file -Leaf)" | Out-File $logFile -Append
    }
}

# 3. Check simulation results
if (Test-Path "C:\Dev\simulation-results\million-simulations-results.json") {
    try {
        $results = Get-Content "C:\Dev\simulation-results\million-simulations-results.json" -Raw | ConvertFrom-Json
        $simCount = $results.total_simulations
        $totalNetWorth = $results.total_net_worth
        $avgNetWorth = $results.average_net_worth
        "[$timestamp] [VERIFY] Results: $simCount simulations, Total: R$totalNetWorth, Avg: R$avgNetWorth" | Out-File $logFile -Append
    } catch {
        "[$timestamp] [VERIFY] ERROR: Could not parse results JSON" | Out-File $logFile -Append
    }
}

# 4. Check system memory
try {
    $memory = Get-CimInstance Win32_OperatingSystem
    $freeMemoryMB = [math]::Round($memory.FreePhysicalMemory / 1024, 0)
    $totalMemoryMB = [math]::Round($memory.TotalVisibleMemorySize / 1024, 0)
    $memoryPercent = [math]::Round(($freeMemoryMB / $totalMemoryMB) * 100, 1)
    "[$timestamp] [VERIFY] Memory: ${freeMemoryMB}/${totalMemoryMB} MB free (${memoryPercent}%)" | Out-File $logFile -Append
} catch {
    "[$timestamp] [VERIFY] ERROR: Could not get memory info" | Out-File $logFile -Append
}

# 5. Check OpenClaw context
try {
    $context = openclaw status --json | ConvertFrom-Json
    if ($context.sessions -and $context.sessions.recent -and $context.sessions.recent.Count -gt 0) {
        $session = $context.sessions.recent[0]
        if ($session.percentUsed -ne $null) {
            $contextPct = $session.percentUsed
            "[$timestamp] [VERIFY] OpenClaw context: ${contextPct}%" | Out-File $logFile -Append
        } else {
            "[$timestamp] [VERIFY] OpenClaw context: Unknown (no percentUsed)" | Out-File $logFile -Append
        }
    } else {
        "[$timestamp] [VERIFY] OpenClaw context: No active sessions" | Out-File $logFile -Append
    }
} catch {
    "[$timestamp] [VERIFY] ERROR: Could not get OpenClaw status" | Out-File $logFile -Append
}

# 6. Check context monitor
try {
    $task = schtasks /query /tn "BurgundyContextMonitor2Min" /fo list 2>&1
    if ($LASTEXITCODE -eq 0) {
        "[$timestamp] [VERIFY] Context monitor: Scheduled task active" | Out-File $logFile -Append
    } else {
        "[$timestamp] [VERIFY] ERROR: Context monitor task not found" | Out-File $logFile -Append
    }
} catch {
    "[$timestamp] [VERIFY] ERROR: Could not check scheduled task" | Out-File $logFile -Append
}

# 7. Check restart script
if (Test-Path "C:\Dev\current-self-restart.ps1") {
    $script = Get-Content "C:\Dev\current-self-restart.ps1" -Raw
    if ($script -match "auto-wake") {
        "[$timestamp] [VERIFY] Restart script: Auto-wake enabled" | Out-File $logFile -Append
    } else {
        "[$timestamp] [VERIFY] Restart script: Auto-wake NOT found" | Out-File $logFile -Append
    }
}

"[$timestamp] [VERIFY] System verification COMPLETE" | Out-File $logFile -Append

# Display results
Get-Content $logFile