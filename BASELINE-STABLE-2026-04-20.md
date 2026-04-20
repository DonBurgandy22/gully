# BASELINE STABLE STATE - 2026-04-20

**Created:** 2026-04-20 14:55 GMT+2
**Purpose:** Last known stable working state for Burgandy system
**Status:** VERIFIED OPERATIONAL

## 1. ACTIVE MODEL

**Model:** `deepseek/deepseek-chat`
**Provider:** DeepSeek API (via models.json)
**Status:** VERIFIED WORKING
**Tool Calling:** Reliable
**Context:** 64k (operating at ~79% utilization)
**Cost:** $0.0000 per session

**Verification Evidence:**
- Session status shows model active
- Tool calling working reliably
- Response generation stable
- No context overflow or compaction issues

## 2. CONFIG STATE

**Config File:** `C:\Users\User\.openclaw\openclaw.json`
**Last Modified:** 2026-04-20 14:36:44
**Size:** 6185 bytes
**Hash:** (see clobbered backup for exact state)

### Critical Settings:
```json
{
  "commands": {
    "restart": false
  },
  "agents": {
    "defaults": {
      "compaction": {
        "reserveTokensFloor": 20000
      }
    }
  },
  "models": {
    "default": "deepseek/deepseek-chat"
  },
  "providers": {
    "deepseek": {
      "apiKey": "sk-16849ccfef0f4f5dbe921fd202cf4d1a"
    }
  }
}
```

### Verification:
- `commands.restart = false` (DISABLED - prevents accidental restarts)
- `compaction.reserveTokensFloor = 20000` (prevents context overflow)
- `models.default = "deepseek/deepseek-chat"` (stable default)
- DeepSeek API key configured and working

## 3. WHATSAPP CHANNEL STATUS

**Gateway:** Running (last run 2026/04/20 14:41:23)
**Port:** 18789 (loopback only)
**Dashboard:** http://127.0.0.1:18789/
**WhatsApp Listener:** ACTIVE (last seen 2026-04-20T14:42:19.822+02:00)
**WhatsApp Number:** +27602678740
**Primary Contact:** +27614236040 (Daryl Mack)

### Verification Evidence:
- Gateway RPC probe: ok
- WhatsApp listener line in logs: "Listening for personal WhatsApp inbound messages."
- Bidirectional communication confirmed (send/receive working)
- Message delivery confirmed (messageId: 3EB038B4899C95400FACE0)

## 4. KNOWN WORKING BEHAVIOR

### Inbound → Response Loop:
1. WhatsApp message received from +27614236040
2. Gateway processes and routes to OpenClaw
3. DeepSeek Chat model generates response
4. Response delivered back via WhatsApp
5. Confirmation in logs

### Tool Calling:
- `read`: File reading working
- `write`: File writing working  
- `exec`: Command execution working
- `edit`: File editing working
- `message`: WhatsApp messaging working
- All tools reliable with DeepSeek Chat

### Session Management:
- Context management stable
- No compaction issues
- Token usage: ~30k in / 4 out per session
- Cache hit rate: 36%

## 5. KNOWN RISKS

### CONFIG DRIFT (PRIMARY RISK)
**Evidence:** 13 clobbered config files in `C:\Users\User\.openclaw\`
**Most Recent:** `openclaw.json.clobbered.2026-04-20T12-36-45-365Z`
**Risk Level:** MEDIUM
**Symptoms:** Unexpected model changes, tool calling failures, restart loops
**Mitigation:** Config backups, restart disabled, monitoring

### UNVERIFIED MODELS
1. `qwen2.5-coder:14b` - NOT VERIFIED IN THIS RUN
2. `qwen3.5:9b` - NOT VERIFIED IN THIS RUN
**Risk:** Tool calling reliability unknown, context management unproven
**Mitigation:** Use DeepSeek Chat as default; test other models in isolated sessions

### GATEWAY RESTART
**Risk:** DISABLED (`commands.restart = false`)
**Mitigation:** Manual restart only via verified script

## 6. VERIFIED FILES

### Core Files:
- `C:\Burgandy\AGENTS.md` - Agent configuration
- `C:\Burgandy\SOUL.md` - Identity and tone
- `C:\Burgandy\USER.md` - User preferences
- `C:\Burgandy\MEMORY.md` - Durable truths
- `C:\Burgandy\PROTOCOLS.md` - Operating procedures

### Hardening Files:
- `C:\Burgandy\restart-gateway-and-notify.ps1` - Safe restart script
- `C:\Burgandy\CONFIG-DRIFT-HARDENING-2026-04-20.md` - Drift awareness
- `C:\Burgandy\MODEL-READINESS-EXPLANATION-2026-04-20.md` - Model status
- `C:\Burgandy\LIVE-VERIFICATION-2026-04-20.md` - Verification report

### Backup Configs:
- `C:\Users\User\.openclaw\openclaw.json.clobbered.*` - 13 backup versions
- Most recent matches current working config size (6185 bytes)

## 7. SYSTEM READINESS

**Overall Status:** READY
**Production Ready:** YES
**Stability:** HIGH (with DeepSeek Chat)
**Recovery:** Tools and procedures in place
**Monitoring:** Config drift awareness, gateway status checks

## 8. BASELINE VALIDATION CRITERIA

To confirm system is still in baseline state:
1. ✅ Model is `deepseek/deepseek-chat`
2. ✅ `commands.restart = false` in config
3. ✅ WhatsApp listener active in logs
4. ✅ Gateway running (RPC probe ok)
5. ✅ Config size ~6185 bytes
6. ✅ Tool calling working reliably

**If any criterion fails:** Execute rollback procedure from `C:\Burgandy\ROLLBACK-PROCEDURE-2026-04-20.md`