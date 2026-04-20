# BURGANDY OFFLOAD BLUEPRINT

**Purpose:**
This file is the portable deployment blueprint for reconstructing Burgandy on a new Windows PC after OpenClaw has been installed.

**Primary repo:**
`https://github.com/DonBurgandy22/gully.git`

**Primary workspace:**
`C:\Burgandy`

**Primary local worker:**
`ollama/qwen2.5:7b-instruct`

**Execution policy:**
Permanent atomic execution.

---

## 1. Deployment objective

The goal is not to clone a live machine state.
The goal is to rebuild Burgandy quickly and consistently from GitHub, while preserving local-only secrets, credentials, auth sessions, and runtime state.

This blueprint defines:
- what the repo controls
- what stays local
- how a new PC is prepared
- how an existing PC syncs to the latest repo version
- how Hermes is restored and scheduled

---

## 2. Core deployment model

### Repo-controlled files
These may be overwritten from GitHub:
- `*.py`
- `*.ps1`
- `*.md`
- `requirements.txt`
- template config files
- portable workspace control files

### Local-only files
These must never be overwritten automatically from GitHub:
- `.openclaw` runtime/session state
- WhatsApp credentials/session files
- API keys, tokens, secrets
- logs
- temporary files
- downloaded Ollama model blobs
- machine-specific runtime files

### Locally generated but safe to recreate
These may be generated on the machine after setup:
- `learning-events.txt`
- `memory-updates.json`
- `routing-hints.txt`
- `optimization-suggestions.txt`
- `network-map-state.json`
- `hermes-status.txt`

---

## 3. Required software on a new PC

Install these before or during bootstrap:
- Git
- Python 3.11+ with `python` on PATH
- OpenClaw
- Ollama

Optional but recommended:
- VS Code
- Node.js if future OpenClaw/Burgandy scripts depend on it

---

## 4. Standard target paths

### Workspace
- `C:\Burgandy`

### OpenClaw config path
- `C:\Users\User\.openclaw\openclaw.json`

### OpenClaw temp log path
- `C:\Users\User\AppData\Local\Temp\openclaw\`

### Hermes scheduled task name
- `Hermes-Auto-Loop`

---

## 5. One-command new-PC offload command

Run this in PowerShell after OpenClaw is installed:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; \
if (Test-Path C:\Burgandy) { Remove-Item C:\Burgandy -Recurse -Force }; \
git clone https://github.com/DonBurgandy22/gully.git C:\Burgandy; \
cd C:\Burgandy; \
powershell -ExecutionPolicy Bypass -File .\bootstrap.ps1
```

If the repo is already present, use:

```powershell
cd C:\Burgandy
powershell -ExecutionPolicy Bypass -File .\sync-burgandy.ps1
```

---

## 6. Bootstrap responsibilities

`bootstrap.ps1` must:
- verify Git is installed
- verify Python is installed
- verify OpenClaw is installed or warn if missing
- create `C:\Burgandy` if missing
- create a Python virtual environment if missing
- install Python dependencies from `requirements.txt`
- create missing Hermes files if missing
- copy `openclaw.template.json` to a live config path only if the live config is missing
- register the Hermes scheduled task
- print next manual steps

---

## 7. Sync responsibilities

`sync-burgandy.ps1` must:
- pull latest repo changes into `C:\Burgandy`
- re-run dependency install if needed
- refresh Hermes scheduled task
- avoid overwriting local secrets and runtime auth state
- preserve `.openclaw` runtime/session files
- avoid touching local credentials

---

## 8. Hermes v1 components expected after offload

The following files should exist in `C:\Burgandy`:
- `hermes-log-analyzer.py`
- `hermes-consolidator.py`
- `hermes-optimization-writer.py`
- `hermes-routing-hints-writer.py`
- `hermes-status-writer.py`
- `run-hermes.ps1`
- `learning-events.txt`
- `memory-updates.json`
- `routing-hints.txt`
- `optimization-suggestions.txt`
- `network-map-state.json`
- `hermes-status.txt`

---

## 9. Hermes runtime loop

The Hermes loop should run in this order:
1. `hermes-log-analyzer.py`
2. `hermes-consolidator.py`
3. `hermes-optimization-writer.py`
4. `hermes-routing-hints-writer.py`
5. `hermes-status-writer.py`

This loop is executed by:
- `run-hermes.ps1`

This loop is scheduled by:
- Windows Scheduled Task: `Hermes-Auto-Loop`

---

## 10. Current routing truth

Current enforced behavioral guidance:
- keep `ollama/qwen2.5:7b-instruct` as primary local worker
- reduce task size before changing model
- investigate incomplete-turn or non-timeout stop causes
- prefer read-only tasks when possible
- prefer exact-content overwrites over generated edits
- do not escalate model before reducing scope

---

## 11. Recovery protocol

If Burgandy becomes unstable:

### Clean start protocol
1. stop OpenClaw
2. clear stale session files under `.openclaw\agents\main\sessions\`
3. clear temp OpenClaw logs if needed
4. restart OpenClaw
5. verify gateway is back on `ollama/qwen2.5:7b-instruct`
6. verify WhatsApp listener comes up cleanly

### Verification commands
```powershell
Get-Content "C:\Users\User\AppData\Local\Temp\openclaw\openclaw-$(Get-Date -Format 'yyyy-MM-dd').log" -Tail 80
```

```powershell
Get-ScheduledTask -TaskName "Hermes-Auto-Loop"
```

---

## 12. What must stay out of GitHub

Never commit:
- `.openclaw/`
- `*.log`
- credentials
- tokens
- secrets
- WhatsApp auth/session files
- machine-specific cache/state
- downloaded model blobs

---

## 13. Offload success criteria

A new PC is considered successfully offloaded when:
- `C:\Burgandy` exists
- repo files are present
- Python venv exists
- requirements installed successfully
- Hermes files exist
- `run-hermes.ps1` runs successfully
- scheduled task `Hermes-Auto-Loop` exists
- `routing-hints.txt` and `hermes-status.txt` are generated
- OpenClaw is installed and can be configured against the workspace

---

## 14. Manual post-bootstrap checks

After bootstrap completes, verify:

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Burgandy\run-hermes.ps1"
Get-Content "C:\Burgandy\hermes-status.txt"
Get-Content "C:\Burgandy\routing-hints.txt"
Get-ScheduledTask -TaskName "Hermes-Auto-Loop"
```

If OpenClaw is already installed and configured, also verify gateway startup and WhatsApp readiness.

---

## 15. Long-term role of this repo

The `gully` repo is the portable deployment and recovery source of truth for Burgandy.
It is not a dump of live runtime state.
It is the rebuildable, syncable blueprint that allows Burgandy to move between PCs with minimal manual effort.
