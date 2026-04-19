# DIAGNOSTIC LOG TEMPLATE

## Diagnostic Action Protocol
**Established:** March 29, 2026
**Purpose:** Track all diagnostic actions, what was tried, and what worked

## Log Entry Format
```
### [YYYY-MM-DD HH:MM] - [Brief Description]
**Issue:** [What problem was being diagnosed]
**Actions Taken:**
1. [Action 1 with timestamp]
2. [Action 2 with timestamp]
3. [Action 3 with timestamp]

**Results:**
- [What worked]
- [What didn't work]
- [Root cause identified]

**Resolution:** [How the issue was resolved]
**Lessons Learned:** [Key takeaways for future diagnostics]
**Files Updated:** [List of files modified during diagnosis]
```

## Example Entry
```
### [2026-03-29 12:00] - WhatsApp Connection Issue
**Issue:** WhatsApp messages not being received
**Actions Taken:**
1. 12:00 - Checked OpenClaw status (gateway running)
2. 12:01 - Verified WhatsApp plugin configuration
3. 12:02 - Tested message send/receive

**Results:**
- ✅ Gateway running normally
- ✅ WhatsApp plugin configured correctly
- ❌ Messages not being delivered to device

**Resolution:** Restarted WhatsApp plugin, re-established connection
**Lessons Learned:** WhatsApp plugin occasionally needs manual restart after system updates
**Files Updated:** openclaw.json (plugin restart config)
```

## Current Diagnostic Files
- `diagnostics/` - Main diagnostics folder
- `diagnostics/DIAGNOSTIC_LOG_TEMPLATE.md` - This template
- `diagnostics/[date]-[issue].md` - Individual diagnostic logs

## Rules
1. **Create a new log file** for each distinct diagnostic session
2. **Use descriptive filenames:** `YYYY-MM-DD-[issue].md`
3. **Include timestamps** for every action
4. **Document both successes and failures**
5. **Update MEMORY.md** with significant diagnostic learnings
6. **Reference diagnostic logs** in MEMORY.md when appropriate