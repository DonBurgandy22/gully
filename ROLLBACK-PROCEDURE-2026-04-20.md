# ROLLBACK PROCEDURE - 2026-04-20

**Purpose:** Return system to stable DeepSeek Chat baseline state
**Trigger:** Any deviation from baseline (model change, config drift, tool failure)
**Baseline:** `C:\Burgandy\BASELINE-STABLE-2026-04-20.md`
**Execution Time:** ~2-5 minutes

## PREREQUISITES

**Files Required:**
1. `C:\Burgandy\restart-gateway-and-notify.ps1` - Safe restart script
2. Latest `openclaw.json.clobbered.*` backup
3. This procedure file

**Permissions Required:**
- PowerShell execution
- File write access to `C:\Users\User\.openclaw\`

## STEP 1 — DIAGNOSE DEVIATION

**Execute:** Check current state vs baseline

```powershell
# 1.1 Check current model
openclaw status

# 1.2 Check config restart setting
findstr /C:"restart" C:\Users\User\.openclaw\openclaw.json

# 1.3 Check WhatsApp listener
Select-String -Path "$env:TEMP\openclaw\openclaw-2026-04-20.log" -Pattern "Listening for personal WhatsApp" | Select-Object -Last 1

# 1.4 Check gateway status
openclaw gateway status

# 1.5 Check config size
(Get-Item "C:\Users\User\.openclaw\openclaw.json").Length
```

**Expected Baseline:**
- Model: `deepseek/deepseek-chat`
- Config: `"restart": false`
- WhatsApp: Active (last seen today)
- Gateway: Running (RPC probe ok)
- Config size: ~6185 bytes

## STEP 2 — RESTORE CONFIG IF CLOBBERED

**Execute only if config is wrong or missing:**

```powershell
# 2.1 Find latest clobbered backup
$backups = Get-ChildItem "C:\Users\User\.openclaw\openclaw.json.clobbered.*" | Sort-Object LastWriteTime -Descending
$latestBackup = $backups[0].FullName

# 2.2 Backup current config (if exists)
if (Test-Path "C:\Users\User\.openclaw\openclaw.json") {
    $timestamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
    Copy-Item "C:\Users\User\.openclaw\openclaw.json" "C:\Users\User\.openclaw\openclaw.json.broken-$timestamp"
}

# 2.3 Restore from backup
Copy-Item $latestBackup "C:\Users\User\.openclaw\openclaw.json"

# 2.4 Verify restore
$restoredSize = (Get-Item "C:\Users\User\.openclaw\openclaw.json").Length
Write-Host "Restored config size: $restoredSize bytes"
```

**Expected:** Config restored to ~6185 bytes with `"restart": false`

## STEP 3 — ENSURE DEEPSEEK MODEL SET

**Execute always (safe):**

```powershell
# 3.1 Check models.json for DeepSeek
$modelsPath = "C:\Users\User\.openclaw\models.json"
if (Test-Path $modelsPath) {
    $modelsContent = Get-Content $modelsPath -Raw
    if ($modelsContent -notmatch 'deepseek/deepseek-chat') {
        Write-Host "WARNING: DeepSeek not in models.json"
    }
}

# 3.2 Set DeepSeek as default in session (if possible)
# This depends on current session capabilities
# If in a broken session, may need to restart OpenClaw
```

## STEP 4 — RESTART GATEWAY SAFELY

**Execute if gateway not running or WhatsApp disconnected:**

```powershell
# 4.1 Use verified restart script
cd C:\Burgandy
.\restart-gateway-and-notify.ps1 -TimeoutSeconds 45

# 4.2 Verify restart succeeded
Start-Sleep -Seconds 5
openclaw gateway status

# 4.3 Verify WhatsApp listener
Start-Sleep -Seconds 10
$logCheck = Select-String -Path "$env:TEMP\openclaw\openclaw-*.log" -Pattern "Listening for personal WhatsApp" | Select-Object -Last 1
if ($logCheck) {
    Write-Host "SUCCESS: WhatsApp listener active"
} else {
    Write-Host "WARNING: WhatsApp listener not found in logs"
}
```

## STEP 5 — VERIFY ROLLBACK COMPLETE

**Execute final verification:**

```powershell
# 5.1 Model check
Write-Host "=== FINAL VERIFICATION ==="
openclaw status

# 5.2 Config check
findstr /C:"restart" C:\Users\User\.openclaw\openclaw.json

# 5.3 Gateway check
openclaw gateway status

# 5.4 WhatsApp check
$whatsappCheck = Select-String -Path "$env:TEMP\openclaw\openclaw-*.log" -Pattern "Listening for personal WhatsApp" | Select-Object -Last 1
if ($whatsappCheck) {
    Write-Host "WhatsApp: ACTIVE"
} else {
    Write-Host "WhatsApp: NOT FOUND - may need manual check"
}

# 5.5 Send test message
Write-Host "Sending verification message..."
# Note: Actual send command depends on session state
# If tool calling works: use message tool
# If not: proceed to Step 6
```

## STEP 6 — TEST TOOL CALLING

**Execute if session allows:**

```powershell
# 6.1 Test basic tool (read baseline file)
# This step is conceptual - actual execution depends on AI session
# If in a working Burgandy session:
# - Use read tool on BASELINE-STABLE-2026-04-20.md
# - Use message tool to send verification

# 6.2 If tool calling broken:
Write-Host "If tool calling is broken, you may need to:"
Write-Host "1. Restart OpenClaw session"
Write-Host "2. Ensure model is deepseek/deepseek-chat"
Write-Host "3. Check config has restart: false"
```

## STEP 7 — DOCUMENT ROLLBACK

**Execute after successful rollback:**

```powershell
# 7.1 Create rollback record
$rollbackRecord = @"
ROLLBACK EXECUTED: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
From State: [Describe broken state]
To State: Baseline 2026-04-20 (DeepSeek Chat)
Config Restored: $(Test-Path "C:\Users\User\.openclaw\openclaw.json.clobbered.*")
Gateway Restarted: [Yes/No]
WhatsApp Active: [Yes/No]
"@

# 7.2 Save to file
$rollbackRecord | Out-File "C:\Burgandy\rollback-executed-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
```

## QUICK REFERENCE COMMANDS

### Most Common Rollback Scenario (Config Drift):
```powershell
# 1. Restore config
Copy-Item (Get-ChildItem "C:\Users\User\.openclaw\openclaw.json.clobbered.*" | Sort LastWriteTime -Desc)[0] "C:\Users\User\.openclaw\openclaw.json"

# 2. Restart gateway
cd C:\Burgandy; .\restart-gateway-and-notify.ps1

# 3. Verify
openclaw gateway status
```

### WhatsApp Disconnect Only:
```powershell
cd C:\Burgandy; .\restart-gateway-and-notify.ps1
```

### Model Switch Recovery:
1. Manually set model to `deepseek/deepseek-chat` in session
2. Or restart OpenClaw with DeepSeek as default

## TROUBLESHOOTING

### If config backups missing:
1. Use baseline config template from `BASELINE-STABLE-2026-04-20.md`
2. Ensure `commands.restart = false`
3. Set `models.default = "deepseek/deepseek-chat"`

### If gateway won't start:
1. Check port 18789 not in use
2. Run `openclaw doctor`
3. Check Windows Event Log for errors

### If WhatsApp not connecting:
1. Verify phone has internet
2. Check WhatsApp Web session not expired
3. May require QR re-scan (manual process)

### If DeepSeek API failing:
1. Check API key in config
2. Verify internet connectivity
3. Check DeepSeek service status

## ROLLBACK SUCCESS CRITERIA

✅ Model is `deepseek/deepseek-chat`
✅ `commands.restart = false` in config
✅ Gateway running (RPC probe ok)
✅ WhatsApp listener active in logs
✅ Tool calling working (if in session)
✅ Config size ~6185 bytes

**If all criteria met:** System restored to baseline
**If any criteria failed:** Repeat relevant steps or seek manual intervention