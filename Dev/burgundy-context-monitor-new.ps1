# burgundy-context-monitor.ps1
# Monitors context by measuring session file size
# No API needed — reads session file directly
# Runs every 2 minutes via Task Scheduler

$logFile = "C:\Dev\restart-log.txt"
$lockFile = "C:\Dev\restart.lock"
$sessionPath = "C:\Users\dkmac\.openclaw\agents\main\sessions\"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Skip if restart already in progress
if (Test-Path $lockFile) {
    Add-Content $logFile "[$timestamp] Monitor skipped — restart in progress"
    exit 0
}

# Find the active session file (largest .jsonl)
$sessionFile = Get-ChildItem $sessionPath -Filter "*.jsonl" -ErrorAction SilentlyContinue | Sort-Object Length -Descending | Select-Object -First 1

if (-not $sessionFile) {
    Add-Content $logFile "[$timestamp] No session file found — skipping"
    exit 0
}

$fileSizeKB = [math]::Round($sessionFile.Length / 1KB, 1)

# Context estimation:
# OpenClaw context window = 65536 tokens
# Average ~4 chars per token = ~262KB for full context
# 70% threshold = ~183KB
# 80% threshold = ~210KB
$fullContextKB = 262
$threshold70KB = 183
$threshold80KB = 210
$contextPct = [math]::Round(($fileSizeKB / $fullContextKB) * 100, 1)

Add-Content $logFile "[$timestamp] Context check: ${fileSizeKB}KB (~${contextPct}%) — file: $($sessionFile.Name)"

if ($fileSizeKB -ge $threshold80KB) {
    Add-Content $logFile "[$timestamp] EMERGENCY — context ~${contextPct}% (${fileSizeKB}KB) — triggering restart"
    $args = "-NonInteractive -WindowStyle Hidden -File C:\Dev\burgundy-self-restart.ps1"
    Start-Process powershell -ArgumentList $args
}
elseif ($fileSizeKB -ge $threshold70KB) {
    Add-Content $logFile "[$timestamp] AUTO-RESTART — context ~${contextPct}% (${fileSizeKB}KB) — triggering restart"
    $args = "-NonInteractive -WindowStyle Hidden -File C:\Dev\burgundy-self-restart.ps1"
    Start-Process powershell -ArgumentList $args
}