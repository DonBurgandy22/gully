# QWEN3.5:9B VALIDATION FAILURE - 2026-04-20

**Validation Timestamp:** 2026-04-20 15:23 GMT+2
**Model Tested:** `ollama/qwen3.5:9b`
**Outcome:** FAILED
**Reason Class:** idle-timeout / no-reply degradation

## VERIFIED TRUTH

From system logs:
1. ✅ Gateway was running on DeepSeek Chat before 9B test
2. ✅ WhatsApp was connected before 9B test
3. ❌ 9B run hit idle timeout
4. ❌ No clean reply was produced
5. ✅ System came back on DeepSeek after restart
6. ✅ Therefore qwen3.5:9b did NOT pass autonomous validation

## FAILURE DETAILS

**What Happened:**
- Model switched from DeepSeek Chat to qwen3.5:9b
- User sent initial message (15:08)
- System entered idle state
- No reply produced within reasonable timeframe
- User had to restart gateway manually (15:23)
- Gateway came back on DeepSeek Chat

**Root Cause:**
- qwen3.5:9b exhibited idle-timeout behavior
- Model degraded into no-reply state
- Did not sustain active conversation
- Failed autonomous validation criteria

**Status:**
- Model is NOT promoted to baseline
- Model is marked as FAILED for autonomous validation
- Requires further investigation before re-testing

## NEXT ACTIONS

1. **Do not promote 9B** - Failed current validation
2. **Document failure** - This file serves as record
3. **Consider deferring re-test** - Investigate root cause first
4. **Continue using DeepSeek Chat** - Trusted baseline

## MODEL CLASSIFICATION

| Model | Status | Notes |
|-------|--------|-------|
| DeepSeek Chat | ✅ TRUSTED BASELINE | Verified operational, stable |
| qwen3.5:9b | ❌ FAILED | Idle-timeout / no-reply degradation |
| qwen2.5-coder:14b | ⚠️ HIGH-RISK | Not verified, use with caution |
