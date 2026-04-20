# MODEL FALLBACK POLICY - 2026-04-20

**Established:** 2026-04-20 16:24 GMT+2
**Purpose:** Define model hierarchy and usage policies

## MODEL HIERARCHY

### PRIMARY LOCAL WORKER
**Model:** `ollama/qwen2.5:7b-instruct`
**Status:** READY AND PROMOTED
**Validation:** Minimal live-response test passed in 8 seconds
**Usage:** Default active model for all work
**Rationale:** Fast, reliable, sufficient capacity, proven stable

### FALLBACK / DEBUG / RECOVERY
**Model:** `deepseek/deepseek-chat`
**Status:** TRUSTED FALLBACK BASELINE
**Usage:** Emergency recovery, debugging, when 7B fails
**Rationale:** Proven operational, API-based, reliable fallback

### FAILED VALIDATION - DO NOT USE AS ACTIVE WORKER
**Model:** `ollama/qwen3.5:9b`
**Status:** FAILED VALIDATION
**Reason:** Idle-timeout / no-reply degradation
**Usage:** DO NOT USE as active worker
**Rationale:** Failed autonomous validation, unstable behavior

### HIGH-RISK EXPERIMENTAL ONLY
**Model:** `ollama/qwen2.5-coder:14b`
**Status:** HIGH-RISK
**Usage:** Experimental only, not baseline
**Rationale:** Not verified, high resource cost, unproven reliability

## POLICY

1. **Primary:** Always use qwen2.5:7b-instruct as default
2. **Fallback:** Use DeepSeek Chat only for recovery/debugging
3. **Avoid:** Do not use qwen3.5:9b for active work (failed validation)
4. **Experimental:** Only use qwen2.5-coder:14b for specific coding tasks when needed
5. **Monitor:** Watch for any model degradation, fall back to DeepSeek if needed
