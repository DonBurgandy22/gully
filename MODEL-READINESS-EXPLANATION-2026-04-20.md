# MODEL READINESS EXPLANATION - 2026-04-20

## Current Status

| Model | Status | Evidence |
|-------|--------|----------|
| qwen2.5:7b-instruct | READY | Minimal live-response test passed in 8 seconds |
| qwen3.5:9b | NOT READY | Failed validation - idle-timeout / no-reply degradation |
| qwen2.5-coder:14b | NOT BASELINE | Not verified, high-risk experimental only |
| deepseek/deepseek-chat | TRUSTED FALLBACK BASELINE | Proven operational, API-based reliable fallback |

## Proof

**qwen2.5:7b-instruct = READY**
- Proof: Minimal live-response test passed in 8 seconds
- Live validation confirmed stable response behavior
- Promoted as PRIMARY LOCAL WORKER

**qwen3.5:9b = NOT READY**
- Failed autonomous validation test
- Exhibited idle-timeout / no-reply degradation
- Did not sustain active conversation
- DO NOT USE as active worker

**qwen2.5-coder:14b = NOT BASELINE**
- High resource cost
- Not verified for baseline stability
- Experimental only

**deepseek/deepseek-chat = TRUSTED FALLBACK BASELINE**
- Proven operational
- API-based reliable fallback
- Use only for recovery/debugging

## Usage Policy

1. **Default:** qwen2.5:7b-instruct for all work
2. **Emergency:** deepseek/deepseek-chat for recovery
3. **Avoid:** qwen3.5:9b - failed validation
4. **Experimental:** qwen2.5-coder:14b only when specifically needed
