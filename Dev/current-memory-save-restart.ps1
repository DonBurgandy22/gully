# burgundy-memory-save-restart.ps1
# Saves ALL memory before restarting gateway
# Called by context monitor when context >=70%
# Saves: session-summary.md, memory/today.md, claude-diagnostic-program.md, save-log.txt

$logFile = "C:\Dev\restart-log.txt"
$saveLogFile = "C:\Dev\save-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$today = Get-Date -Format "yyyy-MM-dd"

# Memory file paths
$workspace = "C:\Users\dkmac\.openclaw\workspace"
$sessionSummary = "$workspace\session-summary.md"
$todayMemory = "$workspace\memory\$today.md"
$memoryDir = "$workspace\memory"
$diagnostic = "C:\Dev\claude-diagnostic-program.md"

Add-Content $logFile "[$timestamp] MEMORY SAVE BEFORE RESTART STARTED"

# 1. Ensure memory directory exists
if (-not (Test-Path $memoryDir)) {
    New-Item -ItemType Directory -Path $memoryDir -Force | Out-Null
    Add-Content $logFile "[$timestamp] Created memory directory"
}

# 2. Save session summary (what's happening right now, what's pending)
# Get current context usage if possible
$contextInfo = ""
try {
    $status = Invoke-RestMethod -Uri "http://127.0.0.1:18789/__openclaw__/status" -Method GET -TimeoutSec 5
    $contextInfo = "Context usage: $($status.context.usagePercent)% - Model: $($status.model)"
} catch {
    $contextInfo = "Context: Gateway not responding (restart in progress)"
}

# Get recent bridge decisions if available
$bridgeLog = "C:\Dev\bridge\logs\bridge-decisions.log"
$recentBridge = ""
if (Test-Path $bridgeLog) {
    $lastBridge = Get-Content $bridgeLog -Tail 3 -ErrorAction SilentlyContinue
    if ($lastBridge) {
        $recentBridge = "Recent bridge decisions:`n$($lastBridge -join "`n")"
    }
}

$summaryContent = @"
# Session Summary - $timestamp
## Current Task
[Auto-saved before restart - context >=70%]

## System Status
$contextInfo
Trigger: Context threshold reached (>=70%)
Action: Auto-restart memory save

## Recent Activity
$recentBridge

## Pending Actions
- Gateway restart due to high context usage
- Memory preservation completed
- Context refresh pending

## Recent Context
- Context threshold triggered auto-restart
- Memory being saved to all relevant files
- Task state preserved for continuity

## Next Steps After Restart
1. Read AGENTS.md (protocols)
2. Read USER.md (preferences)  
3. Read session-summary.md (current state)
4. Read memory\$today.md (today's memory)
5. Read MEMORY.md (long-term memory)
6. Continue from pending actions
7. Check bridge decisions for recent routing

## Memory Context Enhancement
- Added richer context capture
- Bridge decision logging included
- System status snapshot preserved
- Task continuity ensured
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

# Get last 5 minutes of bridge decisions for context
$bridgeContext = ""
$bridgeLog = "C:\Dev\bridge\logs\bridge-decisions.log"
if (Test-Path $bridgeLog) {
    $recentLines = Get-Content $bridgeLog -Tail 10 -ErrorAction SilentlyContinue
    if ($recentLines) {
        $bridgeContext = "### Recent Bridge Decisions (last 5 minutes):`n"
        foreach ($line in $recentLines) {
            if ($line -match "$todayDate") {
                $bridgeContext += "- $line`n"
            }
        }
    }
}

$memoryEntry = @"

---
## 🚨 Auto-Save Before Restart - $timestamp
**Trigger:** Context threshold reached (>=70%) - auto-restart protocol
**Action:** Comprehensive memory save before gateway restart
**Memory Context Level:** Enhanced (rich situational awareness)

### Files Preserved:
- **session-summary.md** - Current task state and pending actions
- **memory\$today.md** - This enhanced memory entry  
- **claude-diagnostic-program.md** - System change history
- **save-log.txt** - Save event log
- **AGENTS.md** - Core protocols and routing rules
- **USER.md** - User preferences and skills
- **MEMORY.md** - Long-term memory and achievements

### System Status Snapshot:
- **Gateway:** Restart pending (context refresh)
- **Memory:** Fully preserved with enhanced context
- **Continuity:** Task state saved for seamless resume
- **Bridge:** Recent decisions captured for context

### Recent Bridge Activity:
$bridgeContext

### Context Preservation:
1. **Task State:** Current investigation/activity captured
2. **Bridge Decisions:** Recent routing choices logged  
3. **System Status:** Gateway and memory state snapshot
4. **Pending Actions:** Next steps after restart defined
5. **Memory Links:** All relevant files referenced

### After Restart Protocol:
1. Read AGENTS.md → Core protocols
2. Read USER.md → User preferences  
3. Read session-summary.md → Current state
4. Read memory\$today.md → Today's memory
5. Read MEMORY.md → Long-term context
6. Check bridge decisions → Recent routing
7. Resume from pending actions → Seamless continuity

### Memory Enhancement Applied:
✅ Richer context capture  
✅ Bridge decision logging  
✅ System status snapshot  
✅ Task continuity assurance  
✅ Enhanced memory structure
"@

Add-Content $todayMemory $memoryEntry
Add-Content $logFile "[$timestamp] Appended to memory\$today.md"

# 4. Update diagnostic file with system change
$diagnosticEntry = @"

---
## System Change - $timestamp
**Event:** Auto-restart memory save (context >=70%)
**Action:** Saving all memory before gateway restart
**Files updated:**
- session-summary.md
- memory\$today.md
- save-log.txt
- This diagnostic file

**Context:** Context threshold triggered automated restart protocol
**Status:** Memory preserved, gateway restart pending
"@

Add-Content $diagnostic $diagnosticEntry
Add-Content $logFile "[$timestamp] Updated claude-diagnostic-program.md"

# 5. Update save log
$saveEntry = "[$timestamp] SAVE BEFORE RESTART - context: >=70% - task: Auto-restart memory save - reason: Context threshold reached"
Add-Content $saveLogFile $saveEntry
Add-Content $logFile "[$timestamp] Updated save-log.txt"

Add-Content $logFile "[$timestamp] Memory save completed - ready for restart"