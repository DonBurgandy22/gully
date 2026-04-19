# Folder Consolidation Plan & GitHub Repo Preparation
**Date:** 2026-03-29  
**Purpose:** Identify duplicate folders, consolidate to single source of truth, prepare for GitHub migration

## Current Structure Analysis

### Primary Locations
1. **OpenClaw Workspace** (`C:\Users\dkmac\.openclaw\workspace`)
   - Symbolic link to: `C:\Users\dkmac\OneDrive\Documents\Burgandy\workspace`
   - Contains: AGENTS.md, memory files, scripts, diagnostic files
   - **Status:** Active, up-to-date

2. **Dev Folder** (`C:\Dev`)
   - Symbolic link to: `C:\Users\dkmac\OneDrive\Documents\Burgandy\dev`
   - Contains: Antigravity, bridge, Claude_Code, scripts, project files
   - **Status:** Active, up-to-date

3. **Skills Folder** (`C:\Users\dkmac\.openclaw\skills`)
   - Symbolic link to: `C:\Users\dkmac\OneDrive\Documents\Burgandy\skills`
   - Contains: 12 custom skill definitions
   - **Status:** Active, up-to-date

4. **Local Data Folder** (`C:\Users\dkmac\Documents\Burgandy`)
   - Contains: Finance, Personal, Skills (documents), WhatsApp, YouTube
   - **Status:** Contains sensitive data, not synced to OneDrive

5. **OneDrive Data Folder** (`C:\Users\dkmac\OneDrive\Documents\Burgandy`)
   - Contains: dev, Obsidian Ideas, Self Training Sandbox, skills, WhatsApp Exports, workspace
   - **Status:** Contains dev/workspace (synced via symlinks)

### Duplicate/Backup Locations
1. **Desktop Burgandy** (`C:\Users\dkmac\Desktop\Burgandy\Done`)
   - Contains: Older versions of AGENTS.md, scripts, logs, memory files
   - **Timestamps:** Mostly from morning of 2026-03-29 (older than workspace versions)
   - **Status:** Backup/archive, likely outdated

2. **Claude Projects** (`C:\Users\dkmac\.claude\projects\...`)
   - Claude Code project cache
   - **Status:** Can be ignored

## File Version Comparison
| File | Desktop Version | Workspace Version | Newer |
|------|----------------|-------------------|-------|
| AGENTS.md | 2026-03-29 08:46 | 2026-03-29 18:56 | Workspace |
| burgundy-self-restart.ps1 | 2026-03-29 08:44 | 2026-03-29 21:17 | Workspace |
| claude-code-queue.md | 2026-03-28 16:42 | 2026-03-29 21:28 | Workspace |
| MEMORY.md | 2026-03-29 01:29 | 2026-03-29 21:36 | Workspace |

**Conclusion:** Workspace versions are consistently newer. Desktop folder contains outdated backups.

## Script Duplication Analysis
**Found multiple script variants in `C:\Dev` folder:**

### Context Monitor Scripts (10 variants)
- **Active task:** `BurgundyContextMonitor2Min` → `fixed-context-monitor-fullpath.ps1` (2026-03-29 16:47)
- **Duplicate task:** `BurgundyContextMonitor` → `burgundy-context-monitor.ps1` (2026-03-29 08:21) - likely obsolete
- **Other variants:** 8 other scripts with similar functionality

### Memory Save Scripts (4 variants)
- **Active task:** `BurgundyMemorySave10Min` → `burgundy-memory-save-every-10min.ps1` (2026-03-29 18:41)
- **Other variants:** 3 older scripts

### Restart Scripts (multiple)
- **Primary:** `current-self-restart.ps1` (2026-03-29 18:59) - includes auto-wake fix
- **Others:** Several older restart scripts

**Recommendation:** Consolidate scripts to single versions and update task scheduler references during GitHub migration.

## Consolidation Plan

### Immediate Actions (Tonight)
1. **Delete outdated backups:**
   - `C:\Users\dkmac\Desktop\Burgandy\Done` (move to Recycle Bin after verification)
   - Keep only unique files (logs, task XMLs) if needed for reference

2. **Verify symlink integrity:**
   - Confirm all symlinks point to correct targets
   - Fix any broken links

3. **Data folder consolidation:**
   - Move sensitive data (Finance, Personal, YouTube) to OneDrive for backup
   - Keep local copy as primary for performance
   - Ensure no duplication between local and OneDrive

4. **Disable duplicate scheduled task:**
   - Disable `BurgundyContextMonitor` task (uses older script) after confirming `BurgundyContextMonitor2Min` is functioning
   - Keep `BurgundyMemorySave10Min` and `BurgundyContextMonitor2Min` as the only active tasks

### GitHub Repo Structure (Tomorrow)
```
burgundy-ai-life-os/
├── .gitignore                 # Exclude sensitive data, logs, node_modules
├── README.md                  # Project overview
├── docs/                      # Documentation
│   ├── AGENTS.md
│   ├── MEMORY.md
│   ├── USER.md
│   └── SKILLS.md
├── workspace/                 # OpenClaw workspace (excluding memory/)
│   ├── diagnostics/
│   ├── scripts/
│   └── AGENTS.md
├── dev/                       # Development projects
│   ├── antigravity/
│   ├── bridge/
│   ├── claude-code-queue.md
│   └── scripts/
├── skills/                    # Skill definitions
│   ├── youtube/
│   ├── finance/
│   └── ...
├── config/                    # Configuration (redacted)
│   └── openclaw-redacted.json
└── logs/                      # Historical logs (optional)
```

### Sensitive Data Handling
- **Exclude:** Finance data, Personal documents, WhatsApp exports, YouTube raw files
- **Include:** Redacted configs, skill definitions, non-sensitive scripts
- **.gitignore patterns:**
  ```
  # Sensitive data
  **/Finance/
  **/Personal/
  **/WhatsApp Exports/
  **/YouTube/raw/
  
  # System files
  **/memory/
  **/session-summary.md
  **/*.log
  **/node_modules/
  **/.openclaw/
  ```

### Migration Steps
1. Create GitHub repository (private)
2. Clone to `C:\Dev\burgundy-repo`
3. Copy non-sensitive files to repo structure
4. Test OpenClaw operation with repo paths
5. Update symlinks to point to repo locations
6. Commit and push initial version

## Risk Assessment
- **Low risk:** Deleting outdated desktop backups
- **Medium risk:** Moving sensitive data to OneDrive (ensure backup)
- **High risk:** Changing symlink targets during migration (requires testing)

## Verification Checklist
- [ ] Desktop backup folder reviewed and archived
- [ ] Symlinks verified (workspace, dev, skills)
- [ ] Sensitive data backed up to OneDrive
- [ ] GitHub repo structure created
- [ ] Non-sensitive files copied to repo
- [ ] OpenClaw functionality tested with new paths
- [ ] Final commit and push

## Next Steps
1. Present this plan to Daryl for approval
2. Execute immediate actions (delete outdated backups)
3. Tomorrow: Create GitHub repo and begin migration

---
*Diagnostic created by Burgundy at 2026-03-29 21:45 SAST*