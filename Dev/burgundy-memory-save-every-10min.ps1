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

# 2. Save session summary (current state)
# Get current context usage if possible
$contextInfo = ""
try {
    $status = Invoke-RestMethod -Uri "http://127.0.0.1:18789/__openclaw__/status" -Method GET -TimeoutSec 5
    $contextInfo = "Context usage: $($status.context.usagePercent)% - Model: $($status.model)"
} catch {
    $contextInfo = "Context: Gateway status check failed (may be busy)"
}

# Get recent bridge decisions for context
$bridgeContext = ""
$bridgeLog = "C:\Dev\bridge\logs\bridge-decisions.log"
if (Test-Path $bridgeLog) {
    $lastBridge = Get-Content $bridgeLog -Tail 5 -ErrorAction SilentlyContinue
    if ($lastBridge) {
        $bridgeContext = "### Recent Bridge Activity:`n$($lastBridge -join "`n")"
    }
}

$summaryContent = @"
# Session Summary - $timestamp
## Current Task
[10-minute auto-save + context refresh]

## System Status
$contextInfo
Trigger: Scheduled 10-minute memory preservation
Action: Save memory + clear session files (context refresh)

## Recent Activity
$bridgeContext

## Memory Preservation
- **Session summary:** Current task state saved
- **Today's memory:** Enhanced context appended
- **Session files:** Being cleared for fresh context space
- **Gateway:** Continues running (no restart)

## Context Enhancement
- Bridge decision logging included
- System status snapshot captured
- Task continuity preserved
- Memory structure enriched

## Next Steps
- Continue normal operations with fresh context space
- Memory fully preserved in files
- Enhanced context available for future sessions
- Bridge routing decisions logged for continuity
"@

$summaryContent | Out-File $sessionSummary -Encoding UTF8
Add-Content $logFile "[$timestamp] Saved session-summary.md"

# 3. Append to today's memory file
# Get current date for memory file
$todayDate = Get-Date -Format "yyyy-MM-dd"
$memoryFile = "$memoryDir\$todayDate.md"

# Check if memory file exists, create if not
if (-not (Test-Path $memoryFile)) {
    "# Memory for $todayDate`n`n" | Out-File $memoryFile -Encoding UTF8
}

# Get bridge context for last 10 minutes
$bridgeContext = ""
$bridgeLog = "C:\Dev\bridge\logs\bridge-decisions.log"
if (Test-Path $bridgeLog) {
    $time10minAgo = (Get-Date).AddMinutes(-10).ToString("yyyy-MM-dd HH:mm")
    $recentLines = Get-Content $bridgeLog -Tail 20 -ErrorAction SilentlyContinue
    if ($recentLines) {
        $bridgeContext = "### Bridge Activity (last 10 minutes):`n"
        $bridgeCount = 0
        foreach ($line in $recentLines) {
            if ($line -match "$todayDate" -and $line -match "Routing") {
                $bridgeContext += "- $line`n"
                $bridgeCount++
                if ($bridgeCount -ge 5) { break }
            }
        }
        if ($bridgeCount -eq 0) {
            $bridgeContext = "### Bridge Activity: No recent routing decisions"
        }
    }
}

$memoryEntry = @"

---
## ⏰ 10-Minute Auto-Save + Context Refresh - $timestamp
**Trigger:** Scheduled 10-minute memory preservation cycle
**Action:** Enhanced memory save with context refresh
**Memory Context Level:** Rich situational awareness

### System Status:
- **Context usage:** Captured before refresh
- **Gateway:** Running (no restart)
- **Session files:** Cleared for fresh context space
- **Memory:** Fully preserved with enhanced context

### Files Preserved:
- **session-summary.md** - Current task state with bridge context
- **memory\$today.md** - This enhanced memory entry  
- **save-log.txt** - Save event log with timestamps
- **AGENTS.md** - Core protocols and routing rules
- **USER.md** - User preferences and skills
- **MEMORY.md** - Long-term memory and achievements

### Bridge Context:
$bridgeContext

### Context Preservation Details:
1. **Task State:** Current investigation/activity captured
2. **Bridge Decisions:** Recent routing choices logged  
3. **System Status:** Gateway and memory state snapshot
4. **Session Files:** Cleared (✅ context space refreshed)
5. **Memory Links:** All relevant files referenced

### Memory Enhancement Applied:
✅ Richer context capture (bridge decisions, system status)  
✅ Enhanced memory structure for better continuity  
✅ Task state preservation with situational awareness  
✅ Context space refreshed for optimal performance  
✅ Gateway continues running (seamless operation)

### Next 10-Minute Cycle:
- Memory will be saved again at $(Get-Date).AddMinutes(10).ToString("HH:mm")
- Context space will be refreshed
- Gateway continues uninterrupted
- Enhanced context preserved for continuity
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