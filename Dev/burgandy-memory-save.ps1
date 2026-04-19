# burgundy-memory-save.ps1
# Auto-save script for Burgundy's continuous memory protocol
# Runs every 10 minutes via Windows Task Scheduler

$date = Get-Date -Format "yyyy-MM-dd"
$time = Get-Date -Format "HH:mm:ss"
$memFile = "C:\Users\dkmac\.openclaw\workspace\memory\$date.md"
$summaryFile = "C:\Users\dkmac\.openclaw\workspace\session-summary.md"

# Create memory directory if it doesn't exist
$memDir = Split-Path $memFile -Parent
if (-not (Test-Path $memDir)) {
    New-Item -ItemType Directory -Force -Path $memDir | Out-Null
}

# Create memory file if it doesn't exist
if (-not (Test-Path $memFile)) {
    $header = "# $date`n`n## Auto-Save Heartbeats`n"
    Set-Content -Path $memFile -Value $header -Encoding UTF8
}

# Append heartbeat timestamp to daily memory file
$entry = "`n[Auto-save $time] Session active - review session-summary.md for current state"
Add-Content -Path $memFile -Value $entry -Encoding UTF8

# Log the heartbeat (optional)
$logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Heartbeat saved to $memFile"
Add-Content -Path "C:\Dev\burgundy-memory-save.log" -Value $logEntry -Encoding UTF8

# Check if session-summary.md exists and is recent (last 30 minutes)
if (Test-Path $summaryFile) {
    $summaryAge = (Get-Date) - (Get-Item $summaryFile).LastWriteTime
    if ($summaryAge.TotalMinutes -gt 30) {
        # Session summary is stale - add warning
        $minutesOld = [math]::Round($summaryAge.TotalMinutes)
        $staleWarning = "`n[Auto-save $time] WARNING: session-summary.md is $minutesOld minutes old"
        Add-Content -Path $memFile -Value $staleWarning -Encoding UTF8
    }
}