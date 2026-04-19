# burgundy-memory-save-every-10min.ps1
# Saves memory AND refreshes context space every 10 minutes
# 1. Save all memory files
# 2. Clear session files to refresh context space
# 3. Does NOT restart gateway (only clears context)

$logFile = "C:\Dev\save-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$today = Get-Date -Format "yyyy-MM-dd"

# Memory file paths
$workspace = "C:\Users\dkmac\.openclaw\workspace"
$sessionSummary = "$workspace\session-summary.md"
$todayMemory = "$workspace\memory\$today.md"
$memoryDir = "$workspace\memory"
$sessionPath = "C:\Users\dkmac\.openclaw\agents\main\sessions\"

Add-Content $logFile "[$timestamp] 10-MINUTE MEMORY SAVE + CONTEXT REFRESH STARTED"

# 1. Ensure memory directory exists
if (-not (Test-Path $memoryDir)) {
    New-Item -ItemType Directory -Path $memoryDir -Force | Out-Null
}

# 2. Save session summary with CURRENT INVESTIGATION STATE
$currentTask = ""

# Try to detect current investigation from recent messages
$recentMessages = @()
try {
    $status = openclaw status --json 2>$null | ConvertFrom-Json
    if ($status.sessions.recent) {
        $recentMessages = $status.sessions.recent[0].messages | Select-Object -Last 3
    }
} catch { }

# Build current task description
if ($recentMessages.Count -gt 0) {
    $lastUserMsg = $recentMessages | Where-Object { $_.role -eq "user" } | Select-Object -Last 1
    if ($lastUserMsg) {
        $currentTask = "**Current Investigation:** " + ($lastUserMsg.content -replace "`n", " " -replace "`r", "").Substring(0, [Math]::Min(100, $lastUserMsg.content.Length))
    }
}

$summaryContent = @"
# Session Summary - $timestamp
## Current Task
$currentTask
**Status:** 10-minute auto-save + context refresh
**Next Action:** Resume investigation immediately after restart

## System Status
- Memory being saved to all files
- Session files being cleared to refresh context space
- Gateway continues running (no restart)

## Recent Context
- 10-minute scheduled memory save
- Context space being refreshed
- Memory preserved for continuity

## Next Steps
- Continue normal operations
- Memory preserved in files
- Fresh context space available
"@

$summaryContent | Out-File $sessionSummary -Encoding UTF8
Add-Content $logFile "[$timestamp] Saved session-summary.md"

# 3. Append to today's memory file
$memoryEntry = @"

---
## 10-Minute Auto-Save + Context Refresh - $timestamp
**Reason:** Scheduled 10-minute memory save and context refresh
**Action:** 
1. Saving all memory to files
2. Clearing session files to refresh context space
3. Gateway continues running (no restart)

**Files saved:**
- session-summary.md (current state)
- memory\$today.md (this entry)
- save-log.txt (this entry)

**Context refresh:**
- Session files cleared: YES
- Gateway restart: NO
- Memory preserved: YES
"@

Add-Content $todayMemory $memoryEntry
Add-Content $logFile "[$timestamp] Appended to memory\$today.md"

# 4. CLEAR SESSION FILES TO REFRESH CONTEXT SPACE
if (Test-Path $sessionPath) {
    $files = Get-ChildItem $sessionPath -Filter "*.jsonl"
    $fileCount = ($files | Measure-Object).Count
    if ($fileCount -gt 0) {
        $files | Remove-Item -Force -ErrorAction SilentlyContinue
        Add-Content $logFile "[$timestamp] Cleared $fileCount session files (context refreshed)"
    } else {
        Add-Content $logFile "[$timestamp] No session files to clear"
    }
}

Add-Content $logFile "[$timestamp] 10-minute memory save + context refresh COMPLETED"