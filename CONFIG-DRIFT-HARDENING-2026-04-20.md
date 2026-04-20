# CONFIG-DRIFT HARDENING - 2026-04-20

## What Config Drift/Clobbering Means Here
Config drift refers to the unintended partial overwriting or corruption of the OpenClaw configuration file (`C:\Users\User\.openclaw\openclaw.json`). This occurs when multiple processes attempt to write to the same file simultaneously or when a process writes an incomplete configuration.

**Evidence**: 18+ `openclaw.json.clobbered.*` backup files exist, showing repeated "size-drop" events (e.g., 19521→6179 bytes).

## Why It Is Dangerous
1. **Model Switching Failures**: Partial configs can break model definitions
2. **Gateway Instability**: Incomplete gateway settings cause restart loops
3. **Channel Disconnects**: WhatsApp/Telegram configurations can be lost
4. **Silent Degradation**: System may appear functional but have hidden issues
5. **Recovery Complexity**: Multiple backup versions make restoration difficult

## Likely Causes
1. **Multiple OpenClaw Processes**: Concurrent `openclaw` commands writing config
2. **Gateway Auto-Restarts**: Gateway process writing config on startup
3. **Config Command Conflicts**: `openclaw config set` commands overlapping
4. **File Lock Issues**: Windows file locking not preventing concurrent writes
5. **Power/Process Interruptions**: Sudden termination during config write

## File Snapshots/Backups That Exist
- **Primary**: `C:\Users\User\.openclaw\openclaw.json` (current)
- **Backups**: Multiple `openclaw.json.bak`, `openclaw.json.bak-*` files
- **Clobbered Archives**: 18+ `openclaw.json.clobbered.*` timestamped files
- **Audit Log**: `C:\Users\User\.openclaw\logs\config-audit.jsonl` (detailed write history)

## Practical Prevention Steps

### IMMEDIATE ACTIONS (Already Done):
1. **Disable Restart Command**: Set `commands.restart = false` in config
2. **Create Safe Restart Script**: `restart-gateway-and-notify.ps1` with verification

### ONGOING PROTECTION:
1. **Single-Writer Principle**: Only use `openclaw config` commands from one session at a time
2. **Pre-Write Backup**: Always backup config before changes:
   ```powershell
   Copy-Item C:\Users\User\.openclaw\openclaw.json C:\Users\User\.openclaw\openclaw.json.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')
   ```
3. **Verify After Changes**: Read back config to confirm changes persisted
4. **Monitor Audit Log**: Check `config-audit.jsonl` after config operations
5. **Avoid Concurrent Operations**: Don't run multiple config-changing commands simultaneously

### RECOVERY PROCEDURE:
If config drift is suspected:
1. Check for `openclaw.json.clobbered.*` files
2. Compare file sizes: `ls C:\Users\User\.openclaw\openclaw.json* | select Name, Length`
3. Restore from most recent valid backup
4. Verify config with: `openclaw config get --json`

## What to Verify Before Changing Models Again

### PRE-CHECKLIST:
1. **Config Integrity**: No recent `clobbered` files (last 24 hours)
2. **Single Process**: Only one OpenClaw session active
3. **Backup Exists**: Current config backed up with timestamp
4. **Audit Log Clean**: No "size-drop" warnings in recent audit entries
5. **Gateway Stable**: No recent restarts in logs

### MODEL SWITCH PROTOCOL:
1. Backup current config
2. Run single command: `openclaw config set agents.defaults.model "MODEL_ID"`
3. Wait 10 seconds for write to complete
4. Verify change: `openclaw config get agents.defaults.model`
5. Check audit log for successful write
6. Monitor for 5 minutes for stability

### RED FLAGS (Stop Immediately):
- Multiple `clobbered` files appear during operation
- Config file size drops significantly
- Gateway restarts unexpectedly
- WhatsApp listener disconnects
- Audit log shows "suspicious" entries

## Emergency Contacts
- **Primary Config**: `C:\Users\User\.openclaw\openclaw.json`
- **Last Known Good**: Most recent `openclaw.json.bak` with correct size (~6KB+)
- **Audit Trail**: `C:\Users\User\.openclaw\logs\config-audit.jsonl`
- **Restart Script**: `C:\Burgandy\restart-gateway-and-notify.ps1`

## Last Verified Stable State
- **Date**: 2026-04-20
- **Config Size**: 6184 bytes
- **Restart Command**: Disabled (`false`)
- **Default Model**: `deepseek/deepseek-chat`
- **WhatsApp**: Connected (+27602678740)
- **Gateway**: Stable (loopback:18789)