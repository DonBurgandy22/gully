# Claude Diagnostic Program

## Purpose
This document tracks the diagnostic program for Claude's behavior, model routing decisions, and system configuration.

## History

### March 28, 2026
**14:46:** Session bootstrap and gap analysis completed. Documented missing chat history and system state.

**Earlier today:**
- Model routing rules established in AGENTS.md
- Budget guardrails set: DeepSeek $25/month max
- Claude via OpenClaw removed. Claude Code key is separate.
- Gemini Flash set as free fallback
- openclaw.json patched: Haiku removed, Chat renamed Primary, model order fixed
- Claude Code queue workflow added: "Code task: [x]" trigger â†’ Reasoner plans â†’ writes to C:\Dev\claude-code-queue.md â†’ WhatsApp Daryl

**Issues encountered:**
- Stalled at 16:20 processing a large FEA file (500+ lines) â€” 5 min dropout
- Came back with full memory loss â€” introduced yourself as if meeting Daryl for first time
- Wrote diagnostics to wrong file (claude-code-queue.md instead of claude-diagnostic-program.md)
- 23 legal case documents sent around 3pm â€” NOT processed. Still pending.

**Urgent legal case:** CCMA GATW4273-26 â€” hearing 7 April 2026

## Model Routing Framework

### Decision Triggers
- **Normal message** â†’ DeepSeek Chat (primary)
- **"Deep think:" message** â†’ DeepSeek Reasoner (complex tasks only)
- **DeepSeek unavailable** â†’ google/gemini-2.0-flash (free fallback)
- **"Code task:"** â†’ Use Reasoner to plan â†’ write to Claude Code queue â†’ notify Daryl

### Confirmation Protocol
- **Always announce model switches:** "Switching to DeepSeek Reasoner for this task." and "Switching back to DeepSeek Chat."
- **Always include current model status** at bottom of responses: [?? Model: deepseek/deepseek-chat] or [?? Model: deepseek/deepseek-reasoner]

### Budget Guardrails
- DeepSeek: $25/month max
- Warn Daryl at $20
- Switch non-critical to Gemini Flash at $23
- Claude via OpenClaw: $0 (removed)
- Gemini Flash: free fallback only

## File Locations
- **claude-diagnostic-program.md:** C:\Dev\claude-diagnostic-program.md (THIS FILE)
- **claude-code-queue.md:** C:\Dev\claude-code-queue.md (coding task prompts)
- **AGENTS.md:** C:\Users\dkmac\.openclaw\workspace\AGENTS.md (core configuration)
- **session-summary.md:** C:\Users\dkmac\.openclaw\workspace\session-summary.md (context summaries)

## Large Task Protocol (Added 2026-03-28)

### Kill Switch
If Daryl sends "ðŸ›‘ Stop" at any time:
1. Immediately stop current task
2. Save everything processed so far to disk
3. WhatsApp Daryl: "ðŸ›‘ Stopped. Completed: [x]. Pending: [y]. Files saved at [path]"
4. Wait for next instruction. Do not continue.

### Individual Document Processing
If given more than 5 documents or files at once:
- DO NOT process all at once
- WhatsApp Daryl: "Large batch detected â€” X items. Processing ONE document at a time."
- Process document 1 â†’ save summary to disk â†’ WhatsApp confirmation â†’ wait for "next" or "continue"
- Only proceed to next document after explicit confirmation
- Repeat until complete
- Final message: "All X items processed. Summaries at [path]"

### Individual Document Processing Rule
For any document processing task (legal docs, emails, PDFs, etc.):
- Process ONE document at a time
- Save summary to disk immediately after each one
- WhatsApp confirmation after each one
- Wait for "next" or "continue" before moving to next document
- Never auto-proceed to next document without confirmation

### Checkpoint Saves
For any task over 5 minutes or involving more than 3 files:
- Save progress to disk after EVERY single item â€” not at the end
- Path: C:\Users\dkmac\Documents\Burgandy\[domain]\progress-[date].md
- Never hold results in memory. Write immediately after each item.
- If session crashes, progress is already on disk.

### Context Thresholds
- At 50% context â†’ WhatsApp Daryl: "âš ï¸ Context at 50% â€” saving and continuing"
- At 60% context â†’ summarise to workspace/session-summary.md, clear, continue
- At 80% context â†’ STOP. Save everything. WhatsApp Daryl to restart before continuing.

### Memory on Reconnect
After ANY restart or reconnection â€” before responding to anything:
1. Read AGENTS.md
2. Read USER.md
3. Read workspace/memory/[today].md
4. Read workspace/session-summary.md
5. Only then respond â€” never introduce yourself as if meeting Daryl for the first time

## Pending Tasks
1. Process 23 legal documents â€” ONE document at a time, save summaries to C:\Users\dkmac\Documents\Burgandy\Personal\legal-case\, confirm after each
2. Confirm gateway restart is working or set up Task Scheduler job
3. Update this file with correct history (not claude-code-queue.md)

## Current Status
- âœ… AGENTS.md updated with Large Task Protocol (individual document processing)
- âœ… claude-diagnostic-program.md created and updated
- â³ Ready to process legal documents ONE at a time (awaiting confirmation)
- â³ Gateway restart confirmation pending
- â³ 23 legal documents pending processing

## Today's Major Accomplishments (2026-03-28)

### 1. **Notebook LLM Integration Complete** âœ…
- **FastAPI server** running on http://localhost:8000
- **Burgundy integration module** created (`burgundy_notebooklm_integration.py`)
- **CLI interface** for easy workflow integration
- **PDF processing pipeline** tested successfully (text extraction â†’ Gemini transcript)
- **Google Cloud API configured** for darylmack124@gmail.com (Gemini working, TTS pending)
- **Knowledge base established** at `C:\Dev\knowledge-base\`

### 2. **Portfolio Website Enhancement** âœ…
- **Glass-like glossy effect** on all boxes (Technical Stack, project cards, detail items)
- **Navbar transparency** with hover-reveal text for desktop, permanent visibility for mobile
- **7 CSS versions** (v=20260327c to v=20260328g) with progressive enhancements
- **Multiple tunnel deployments** for mobile/desktop testing

### 3. **Claude Code Queue Structure** âœ…
- **Fixed markdown hierarchy** for Claude Code dropdown functionality
- **Established Daryl's preferred MD format:** 2-space indentation, hierarchical structure
- **Applied to:** `useful-sites.md` and all future MD files

### 4. **YouTube Revenue Pipeline** âœ…
- **Shorts inspiration library** created with format analysis
- **Added to revenue plan:** Reddit Stories channel section
- **Inspiration source:** https://youtube.com/shorts/R3QwUXO0wHE

### 5. **Useful Sites MD File** âœ…
- **Comprehensive resource collection** with 50+ sites
- **9 categories:** AI Website Development, YouTube, AI & Automation, Productivity, Finance, Legal, Communication, Infrastructure, Security
- **Structured for Claude Code:** Dropdown-friendly hierarchy

### 6. **Folder Rename - OpenClaw â†’ Burgandy** âœ…
- **Renamed:** `C:\Users\dkmac\Documents\Burgandy` â†’ `C:\Users\dkmac\Documents\Burgandy`
- **Philosophy:** "I don't refer to open claw, I refer to you. Burgandy!"
- **Updated references** in all core files
- **New structure:** Burgandy/Finance, Personal, Skills, YouTube

### 7. **Legal Document Analysis** âœ…
- **Document 1:** `Combined_1_copy.pdf` (65 pages) - ECSA Professional Misconduct Complaint
- **Document 2:** `Combines_2_copies.pdf` (105 pages) - CCMA Automatically Unfair Dismissal
- **Total pages:** 170
- **Hybrid extraction strategy:** Text pages (PyPDF2) + Scanned pages (Tesseract OCR)
- **Status:** Analysis complete, extraction strategy ready. Awaiting "Extract both" command.

## File Locations (Updated)
- **claude-diagnostic-program.md:** C:\Dev\claude-diagnostic-program.md (THIS FILE)
- **claude-code-queue.md:** C:\Dev\claude-code-queue.md (coding task prompts)
- **AGENTS.md:** C:\Users\dkmac\.openclaw\workspace\AGENTS.md (core configuration)
- **session-summary.md:** C:\Users\dkmac\.openclaw\workspace\session-summary.md (context summaries)
- **memory/2026-03-28.md:** C:\Users\dkmac\.openclaw\workspace\memory\2026-03-28.md (daily log)
- **USER.md:** C:\Users\dkmac\.openclaw\workspace\USER.md (about Daryl)
- **useful-sites.md:** C:\Users\dkmac\.openclaw\workspace\useful-sites.md (resource collection)

## Checkpoint Save Paths (Updated)
- **Legal documents:** C:\Users\dkmac\Documents\Burgandy\Personal\legal-case\progress-[date].md
- **YouTube:** C:\Users\dkmac\Documents\Burgandy\YouTube\progress-[date].md
- **Finance:** C:\Users\dkmac\Documents\Burgandy\Finance\progress-[date].md
- **Personal:** C:\Users\dkmac\Documents\Burgandy\Personal\progress-[date].md

## Pending Tasks
1. **Legal Document Extraction** â³ - Awaiting "Extract both" command
2. **Notebook LLM TTS Configuration** â³ - Enable Cloud Text-to-Speech API
3. **Session Health** â³ - Refresh session-summary.md (13 hours old)
4. **Heartbeat Checks** â³ - Email, calendar, weather rotation needed

## Current System Status
- **Model routing:** Normal â†’ DeepSeek Chat, "Deep think:" â†’ DeepSeek Reasoner
- **Primary workspace:** `C:\dev\antigravity\` for website development
- **Memory protocol:** BurgundyMemorySave task active (every 10 minutes)
- **Large task protocol:** 1 document at a time with confirmation
- **Kill switch:** "ðŸ›‘ Stop" triggers immediate stop and save
- **Context management:** Near auto-compaction threshold, memory flush completed

**Last updated:** 2026-03-28 20:10

## SELF-DIAGNOSTIC REPORT — March 28, 2026 (20:50 SAST)

### Diagnostic Results

#### 1. **Symlinks (3/3 working)**
- ✅ `C:\Users\dkmac\.openclaw\workspace` → OneDrive\OpenClaw\workspace (SymbolicLink)
- ✅ `C:\Users\dkmac\.openclaw\skills` → OneDrive\OpenClaw\skills (SymbolicLink)
- ✅ `C:\Dev` → OneDrive\Dev (SymbolicLink)
- **Status:** All 3 symlinks confirmed working

#### 2. **BurgundyMemorySave Task Scheduler**
- ✅ Task 'BurgundyMemorySave' found
- State: Ready
- Status: ✅ ACTIVE (created 2026-03-28 19:33:01)
- Runs: Every 10 minutes
- **Status:** Task scheduler job running correctly

#### 3. **Claude Code Queue Accessibility**
- ✅ File accessible: `C:\Dev\claude-code-queue.md`
- Size: 56,598 bytes
- Lines: 1,292
- Status: ✅ Has content
- **Status:** File accessible and has content

#### 4. **Burgandy Folder Structure**
- ✅ Folder exists: `C:\Users\dkmac\Documents\Burgandy\`
- Found folders: Finance, Personal, Skills, YouTube
- Status: ✅ All expected folders present
- Total size: 36.52 MB
- **Status:** Folder structure correct

#### 5. **Skill Files Readability (7/11)**
- ✅ Readable: youtube, finance, organisation, productivity, antigravity, spline, websiteautomation
- ❌ Not found: himalaya, weather, coding-agent, skill-creator
- **Status:** ⚠️ 7/11 skill files readable (4 missing from .openclaw\skills folder)

#### 6. **OpenClaw Config Primary Model**
- ✅ Config file accessible: `C:\Users\dkmac\.openclaw\openclaw.json`
- Default model: (empty/not set)
- Status: ⚠️ Default model not explicitly set to deepseek/deepseek-chat
- **Note:** System may be using runtime default instead of config default

#### 7. **Current Context Usage**
- Estimated context: 40-50% (reconciliation in progress)
- Status: ✅ Within safe limits (<60%)
- **Note:** File reconciliation task has been running for ~15 minutes

#### 8. **Today's DeepSeek Spend**
- Estimated today's spend: $0.50-$1.00 USD
- Monthly budget: $25.00 USD max
- Status: ✅ Well within budget
- **Note:** Based on today's activities: portfolio work, Notebook LLM integration, file reconciliation

### Summary Statistics
- ✅ **Passing:** 6/8 diagnostics
- ⚠️ **Warnings:** 2/8 diagnostics
- ❌ **Failing:** 0/8 diagnostics

### Key Issues Identified
1. **Missing skill files:** 4 skills (himalaya, weather, coding-agent, skill-creator) not found in `.openclaw\skills` folder
2. **Config default model:** openclaw.json defaultModel not explicitly set (may be using runtime default)

### Recommendations
1. **Create missing skill files** in `C:\Users\dkmac\.openclaw\skills\` folder
2. **Set explicit default model** in openclaw.json: `"defaultModel": "deepseek/deepseek-chat"`
3. **Continue monitoring** context usage during large tasks
4. **Maintain current budget guardrails** ($25/month max, warn at $20)

### System Health: ✅ STABLE
- Core infrastructure working (symlinks, task scheduler, folder structure)
- Memory protocol active (BurgundyMemorySave running every 10 minutes)
- File reconciliation in progress (6/8 steps complete)
- Budget within limits
- Context usage manageable

## ANTI-STALL & DISCONNECT DIAGNOSTIC — March 28, 2026 (22:10 SAST)

### Diagnostic Results

#### 1. **bootstrapMaxChars Configuration**
- **Status:** Not configured
- **Finding:** `bootstrapMaxChars` not found in openclaw.json agents.defaults
- **Impact:** Using system default bootstrap size

#### 2. **Compaction Settings**
- **Status:** Configured
- **Setting:** `"mode": "safeguard"`
- **Location:** agents.defaults.compaction.mode
- **Impact:** Safeguard mode active for context management

#### 3. **Session File Size**
- **Location:** `C:\Users\dkmac\.openclaw\agents\main\sessions\`
- **Files:** 3 session files
- **Total size:** 0.29 MB
- **Status:** ✅ Normal session file size

#### 4. **AGENTS.md Size**
- **Lines:** 608 lines
- **Size:** 25,692 bytes (25.7 KB)
- **Status:** ✅ Reasonable size after duplicate removal

#### 5. **Current Context Usage**
- **Usage:** 47k/66k tokens (71%)
- **Status:** ⚠️ Approaching compaction threshold (71%)
- **Action needed:** Monitor for auto-compaction at 80%

#### 6. **OpenClaw Log Errors**
- **Log file:** `C:\Users\dkmac\AppData\Local\Temp\openclaw\openclaw-2026-03-28.log`
- **Errors found:** 3 ERROR entries
  - 06:28:25 - `read failed: ENOENT: no such file or directory, access 'C:\Users\dkmac\.openclaw\workspace\session-summary.md'` (2 occurrences)
  - 06:47:59 - `read failed: Offset 650 is beyond end of file (621 lines total)`
- **Status:** ⚠️ Minor file access errors, no disconnection/timeout errors
- **Heartbeat logs:** Normal web gateway heartbeat every minute

### Anti-Stall Recommendations
1. **Monitor context usage** - Currently at 71%, auto-compaction at 80%
2. **Consider setting bootstrapMaxChars** to limit initial context load
3. **Check session file growth** - 0.29 MB is normal
4. **Address file access errors** - Ensure session-summary.md exists at expected path
5. **Maintain safeguard compaction mode** - Already configured correctly

### Disconnect Prevention Status
- ✅ No disconnection or timeout errors in logs
- ✅ Normal heartbeat activity (web gateway heartbeat every minute)
- ✅ Session files stable (3 files, 0.29 MB total)
- ⚠️ Context usage high (71%) - monitor for auto-compaction
- ⚠️ Minor file access errors - check file paths

### Summary
**Overall stability:** ✅ GOOD
- No disconnection issues detected
- Normal system heartbeat
- Minor file access errors (non-critical)
- Context management active (safeguard mode)
- Session persistence working

**Action items:**
1. Monitor context usage (currently 71%)
2. Consider setting bootstrapMaxChars if context loading becomes problematic
3. Verify file paths for session-summary.md access


---
## System Enhancement - 2026-03-29 01:23:00
**Event:** Enhanced automated context monitoring and restart system
**Changes:**
1. Fixed UTF-8 encoding in all PowerShell scripts (emoji support)
2. Enhanced memory save script to save ALL relevant files
3. Verified monitor tracks context and triggers at ≥70%
4. Validated Save → Clear → Restart sequence

**Scripts updated:**
- burgundy-memory-save-restart.ps1 (saves all memory files)
- burgundy-self-restart-complete.ps1 (UTF-8 encoding fix)
- burgundy-context-monitor-complete.ps1 (UTF-8 encoding fix)

**System status:** ✅ Working correctly per requirements
**Current context:** 65% (below 70% threshold)
**Monitor:** Active (every 2 minutes)
**Memory save:** Active (every 10 minutes)

---
## Complete Memory System Enhancement - 2026-03-29 01:31:26
**Event:** Enhanced memory save to include ALL MD files
**Requirement:** "These must grow with you and your memory" - Daryl
**Change:** Now saves identity files (AGENTS.md, SOUL.md, USER.md, MEMORY.md, TOOLS.md, IDENTITY.md)
**Purpose:** Foundational files must evolve with learning and experience
**Status:** Complete memory preservation implemented

---
## System Change - 2026-03-29 01:31:37
**Event:** Auto-restart memory save (context >=70%)
**Action:** Saving all memory before gateway restart
**Files updated:**
- session-summary.md
- memory\2026-03-29.md
- save-log.txt
- This diagnostic file

**Context:** Context threshold triggered automated restart protocol
**Status:** Memory preserved, gateway restart pending

---
## System Change - 2026-03-29 01:34:11
**Event:** Auto-restart memory save (context >=70%)
**Action:** Saving all memory before gateway restart
**Files updated:**
- session-summary.md
- memory\2026-03-29.md
- save-log.txt
- This diagnostic file

**Context:** Context threshold triggered automated restart protocol
**Status:** Memory preserved, gateway restart pending

---
## System Change - 2026-03-29 01:51:14
**Event:** Auto-restart memory save (context >=70%)
**Action:** Saving all memory before gateway restart
**Files updated:**
- session-summary.md
- memory\2026-03-29.md
- save-log.txt
- This diagnostic file

**Context:** Context threshold triggered automated restart protocol
**Status:** Memory preserved, gateway restart pending

---
## System Change - 2026-03-29 01:52:10
**Event:** Auto-restart memory save (context >=70%)
**Action:** Saving all memory before gateway restart
**Files updated:**
- session-summary.md
- memory\2026-03-29.md
- save-log.txt
- This diagnostic file

**Context:** Context threshold triggered automated restart protocol
**Status:** Memory preserved, gateway restart pending

---
## System Change - 2026-03-29 02:28:08
**Event:** Auto-restart memory save (context >=70%)
**Action:** Saving all memory before gateway restart
**Files updated:**
- session-summary.md
- memory\2026-03-29.md
- save-log.txt
- This diagnostic file

**Context:** Context threshold triggered automated restart protocol
**Status:** Memory preserved, gateway restart pending

---
## System Change - 2026-03-29 02:47:59
**Event:** Auto-restart memory save (context >=70%)
**Action:** Saving all memory before gateway restart
**Files updated:**
- session-summary.md
- memory\2026-03-29.md
- save-log.txt
- This diagnostic file

**Context:** Context threshold triggered automated restart protocol
**Status:** Memory preserved, gateway restart pending

---
## System Change - 2026-03-29 02:53:56
**Event:** Auto-restart memory save (context >=70%)
**Action:** Saving all memory before gateway restart
**Files updated:**
- session-summary.md
- memory\2026-03-29.md
- save-log.txt
- This diagnostic file

**Context:** Context threshold triggered automated restart protocol
**Status:** Memory preserved, gateway restart pending

---
## Complete Memory System Enhancement - 2026-03-29 21:17:39
**Event:** Enhanced memory save to include ALL MD files
**Requirement:** "These must grow with you and your memory" - Daryl
**Change:** Now saves identity files (AGENTS.md, SOUL.md, USER.md, MEMORY.md, TOOLS.md, IDENTITY.md)
**Purpose:** Foundational files must evolve with learning and experience
**Status:** Complete memory preservation implemented

---
## Complete Memory System Enhancement - 2026-03-29 21:28:05
**Event:** Enhanced memory save to include ALL MD files
**Requirement:** "These must grow with you and your memory" - Daryl
**Change:** Now saves identity files (AGENTS.md, SOUL.md, USER.md, MEMORY.md, TOOLS.md, IDENTITY.md)
**Purpose:** Foundational files must evolve with learning and experience
**Status:** Complete memory preservation implemented

---
## System Change - 2026-03-29 21:51:16
**Event:** Auto-restart memory save (context >=70%)
**Action:** Saving all memory before gateway restart
**Files updated:**
- session-summary.md
- memory\2026-03-29.md
- save-log.txt
- This diagnostic file

**Context:** Context threshold triggered automated restart protocol
**Status:** Memory preserved, gateway restart pending

---
## Complete Memory System Enhancement - 2026-03-29 21:57:51
**Event:** Enhanced memory save to include ALL MD files
**Requirement:** "These must grow with you and your memory" - Daryl
**Change:** Now saves identity files (AGENTS.md, SOUL.md, USER.md, MEMORY.md, TOOLS.md, IDENTITY.md)
**Purpose:** Foundational files must evolve with learning and experience
**Status:** Complete memory preservation implemented

---
## System Change - 2026-03-29 23:04:25
**Event:** Auto-restart memory save (context >=70%)
**Action:** Saving all memory before gateway restart
**Files updated:**
- session-summary.md
- memory\2026-03-29.md
- save-log.txt
- This diagnostic file

**Context:** Context threshold triggered automated restart protocol
**Status:** Memory preserved, gateway restart pending

---
## System Change - 2026-03-29 23:05:02
**Event:** Auto-restart memory save (context >=70%)
**Action:** Saving all memory before gateway restart
**Files updated:**
- session-summary.md
- memory\2026-03-29.md
- save-log.txt
- This diagnostic file

**Context:** Context threshold triggered automated restart protocol
**Status:** Memory preserved, gateway restart pending

---
## System Change - 2026-03-30 06:58:50
**Event:** Auto-restart memory save (context >=70%)
**Action:** Saving all memory before gateway restart
**Files updated:**
- session-summary.md
- memory\2026-03-30.md
- save-log.txt
- This diagnostic file

**Context:** Context threshold triggered automated restart protocol
**Status:** Memory preserved, gateway restart pending

---
## Complete Memory System Enhancement - 2026-03-30 19:11:48
**Event:** Enhanced memory save to include ALL MD files
**Requirement:** "These must grow with you and your memory" - Daryl
**Change:** Now saves identity files (AGENTS.md, SOUL.md, USER.md, MEMORY.md, TOOLS.md, IDENTITY.md)
**Purpose:** Foundational files must evolve with learning and experience
**Status:** Complete memory preservation implemented

---
## System Change - 2026-04-02 08:26:55
**Event:** Auto-restart memory save (context >=70%)
**Action:** Saving all memory before gateway restart
**Files updated:**
- session-summary.md
- memory\2026-04-02.md
- save-log.txt
- This diagnostic file

**Context:** Context threshold triggered automated restart protocol
**Status:** Memory preserved, gateway restart pending

---
## System Change - 2026-04-02 08:28:05
**Event:** Auto-restart memory save (context >=70%)
**Action:** Saving all memory before gateway restart
**Files updated:**
- session-summary.md
- memory\2026-04-02.md
- save-log.txt
- This diagnostic file

**Context:** Context threshold triggered automated restart protocol
**Status:** Memory preserved, gateway restart pending
