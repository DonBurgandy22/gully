# FINAL RESTART PROTOCOL - IMPLEMENTATION SUMMARY
**Date:** March 29, 2026  
**Status:** 95% Complete - One Fix Required

## ✅ WHAT'S WORKING CORRECTLY

### 1. **Memory Save System (10-minute intervals)**
- **Task:** `BurgundyMemorySave10Min`
- **Script:** `C:\Dev\burgundy-memory-save-every-10min.ps1`
- **Function:** Saves all memory files + clears session files (context refresh)
- **Status:** ✅ WORKING PERFECTLY

### 2. **Restart Scripts**
- **Memory Save (Restart):** `C:\Dev\current-memory-save-restart.ps1` - ✅ WORKING
- **Self Restart:** `C:\Dev\current-self-restart.ps1` - ✅ WORKING
- **Complete protocol:** Save → Clear → Restart → Memory preserved

### 3. **Logging System**
- **Restart Log:** `C:\Dev\restart-log.txt` - ✅ WORKING
- **Save Log:** `C:\Dev\save-log.txt` - ✅ WORKING
- **Memory Files:** All preserved in workspace/memory/ - ✅ WORKING

### 4. **Current Context Monitoring**
- **Current context:** 50% (as of 10:52 AM)
- **System:** Monitoring active, below 70% threshold

## ⚠️ **ONE FIX REQUIRED**

### **Context Monitor Task Update**
**Problem:** The `BurgundyContextMonitor2Min` task is using the OLD script:
- **Current:** `C:\Dev\context-monitor-files.ps1` (file-based heuristic - BROKEN)
- **Should be:** `C:\Dev\fixed-context-monitor-fullpath.ps1` (JSON API - CORRECT)

**Impact:** The old script uses file size heuristics instead of accurate `openclaw status --json` API calls. This means auto-restarts at 70% context won't trigger correctly.

## 🛠️ **FINAL FIX REQUIRED**

### **Run as Administrator:**
```powershell
# 1. Open PowerShell as Administrator
# 2. Run the update script:
powershell -File "C:\Dev\final-task-update.ps1"
```

**What this does:**
1. Updates the scheduled task to use the correct script
2. Ensures accurate context monitoring via `openclaw status --json`
3. Enables proper auto-restart triggering at ≥70% context

## 📋 **RESTART PROTOCOL - FINAL VERSION**

### **Manual Restarts:**
- **When:** Daryl asks to restart
- **Notification:** "I'm back online"
- **Process:** You save memory, then trigger restart script

### **Auto-Restarts:**
- **Trigger:** Context reaches ≥70% (monitored every 2 minutes)
- **Notification:** NONE (seamless)
- **Process:** 
  1. Context monitor detects ≥70%
  2. Triggers `current-self-restart.ps1`
  3. Script saves memory → clears session files → restarts gateway
  4. Burgundy resumes with full memory

### **Memory Preservation:**
- **10-minute saves:** All memory files saved, session files cleared (context refresh)
- **Restart saves:** Memory saved BEFORE any restart
- **Continuity:** All memory preserved across restarts

## 🔍 **VERIFICATION CHECKLIST**

After running the fix, verify with:
```powershell
powershell -File "C:\Dev\verify-restart-system.ps1"
```

**Expected output:**
1. Context monitor task using `fixed-context-monitor-fullpath.ps1`
2. All scripts present and correct
3. Logs showing recent activity
4. Memory files up to date
5. Context monitoring active

## 🎯 **WHY THIS MATTERS**

**Without this fix:**
- Auto-restarts won't trigger at correct thresholds
- Context could overflow without restart
- Memory could be lost

**With this fix:**
- ✅ Auto-restarts at ≥70% context (seamless)
- ✅ Memory always preserved
- ✅ System self-manages context
- ✅ No manual intervention needed
- ✅ Burgundy runs 24/7 without context issues

## 📝 **FINAL STEP**

**Run this command as Administrator:**
```powershell
powershell -File "C:\Dev\final-task-update.ps1"
```

**Then verify:**
```powershell
powershell -File "C:\Dev\verify-restart-system.ps1"
```

**Expected result:** "Context monitor: USING CORRECT SCRIPT" in green.

---

**Status:** Ready for final fix. System is 95% complete. One scheduled task update needed for full functionality.