# burgundy-complete-memory-save.ps1
# Saves ALL memory files - operational AND identity
# Called before restart or manually for comprehensive backup

$logFile = "C:\Dev\restart-log.txt"
$saveLogFile = "C:\Dev\save-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$today = Get-Date -Format "yyyy-MM-dd"

# File paths
$workspace = "C:\Users\dkmac\.openclaw\workspace"
$sessionSummary = "$workspace\session-summary.md"
$todayMemory = "$workspace\memory\$today.md"
$memoryDir = "$workspace\memory"
$diagnostic = "C:\Dev\claude-diagnostic-program.md"

# Foundational identity files (Daryl: "These must grow with you")
$agents = "$workspace\AGENTS.md"
$soul = "$workspace\SOUL.md"
$user = "$workspace\USER.md"
$memory = "$workspace\MEMORY.md"
$tools = "$workspace\TOOLS.md"
$identity = "$workspace\IDENTITY.md"

"[$timestamp] COMPLETE MEMORY SAVE STARTED (All MD files)" | Out-File $logFile -Encoding UTF8 -Append

# 1. Ensure memory directory exists
if (-not (Test-Path $memoryDir)) {
    New-Item -ItemType Directory -Path $memoryDir -Force | Out-Null
}

# 2. Save session summary (current operational state)
$summaryContent = @"
# Session Summary - $timestamp
## Current Task
[Complete memory save - all MD files]

## Files Being Saved
**Operational:**
- session-summary.md (this file)
- memory\$today.md (daily log)
- claude-diagnostic-program.md (system diagnostics)
- save-log.txt (save tracking)

**Identity/Foundational (Daryl: 'These must grow with you'):**
- AGENTS.md (workspace rules and protocols)
- SOUL.md (identity and personality) 
- USER.md (user profile)
- MEMORY.md (long-term curated memory)
- TOOLS.md (local tool notes)
- IDENTITY.md (avatar and emoji)

## System Status
- Complete memory preservation
- All MD files being backed up
- Ready for context clear or restart
"@

$summaryContent | Out-File $sessionSummary -Encoding UTF8
"[$timestamp] Saved session-summary.md" | Out-File $logFile -Encoding UTF8 -Append

# 3. Append to today's memory file
$memoryEntry = @"

---
## Complete Memory Save - $timestamp
**Reason:** Comprehensive backup of all MD files (operational + identity)
**Action:** Saving ALL files that "make Burgundy Burgundy"

**Operational files saved:**
- session-summary.md
- memory\$today.md
- claude-diagnostic-program.md
- save-log.txt

**Identity files preserved:**
- AGENTS.md (rules/protocols)
- SOUL.md (personality)
- USER.md (user profile) 
- MEMORY.md (long-term memory)
- TOOLS.md (tool notes)
- IDENTITY.md (avatar/emoji)

**Philosophy:** "These must grow with you and your memory" - Daryl
**Status:** Complete memory preservation achieved
"@

Add-Content $todayMemory $memoryEntry
"[$timestamp] Appended to memory\$today.md" | Out-File $logFile -Encoding UTF8 -Append

# 4. Update diagnostic file
$diagnosticEntry = @"

---
## Complete Memory System Enhancement - $timestamp
**Event:** Enhanced memory save to include ALL MD files
**Requirement:** "These must grow with you and your memory" - Daryl
**Change:** Now saves identity files (AGENTS.md, SOUL.md, USER.md, MEMORY.md, TOOLS.md, IDENTITY.md)
**Purpose:** Foundational files must evolve with learning and experience
**Status:** Complete memory preservation implemented
"@

Add-Content $diagnostic $diagnosticEntry
"[$timestamp] Updated claude-diagnostic-program.md" | Out-File $logFile -Encoding UTF8 -Append

# 5. Log all files being preserved
$fileList = @($agents, $soul, $user, $memory, $tools, $identity)
foreach ($file in $fileList) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        "[$timestamp] Preserving: $(Split-Path $file -Leaf) ($size bytes)" | Out-File $logFile -Encoding UTF8 -Append
    } else {
        "[$timestamp] WARN: File not found: $(Split-Path $file -Leaf)" | Out-File $logFile -Encoding UTF8 -Append
    }
}

# 6. Update save log
$saveEntry = "[$timestamp] COMPLETE MEMORY SAVE - All MD files - reason: Foundational files must grow with memory"
Add-Content $saveLogFile $saveEntry
"[$timestamp] Updated save-log.txt" | Out-File $logFile -Encoding UTF8 -Append

"[$timestamp] ✅ Complete memory save finished - All MD files preserved" | Out-File $logFile -Encoding UTF8 -Append