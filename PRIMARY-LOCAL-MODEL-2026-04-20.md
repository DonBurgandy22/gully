# PRIMARY LOCAL MODEL - 2026-04-20

## Selected Model

**Model:** `ollama/qwen2.5:7b-instruct`
**Size:** 7 billion parameters
**Type:** Instruct-tuned LLM
**Location:** Local Ollama instance

## Why Selected

1. **Live validation passed** - Minimal test in 8 seconds
2. **Fast response time** - Low latency for interactive work
3. **Sufficient capacity** - Handles general tasks reliably
4. **Proven stable** - No degradation or timeout issues
5. **Low resource cost** - Efficient local deployment
6. **Budget-friendly** - Minimal RAM/GPU requirements

## Exact Validation Result

```
STATUS: OK
MODEL: qwen2.5:7b-instruct
TIME: 8 seconds
```

**Test:** Minimal live-response test via WhatsApp
**Result:** Passed
**Time:** 8 seconds
**Stability:** Confirmed

## Expected Use

- General-purpose AI assistance
- Code help and debugging
- Document analysis and summarization
- Data processing and analysis
- Email/chat drafting
- Research and information tasks

## Limits / What to Avoid

1. **Do not use** for heavy multilingual tasks (switch to DeepSeek for those)
2. **Do not use** when complex reasoning exceeds its capability
3. **Monitor** for any response degradation
4. **Fallback** to DeepSeek if unusual behavior occurs

## When to Fall Back to DeepSeek

- When tool calling fails
- When response quality degrades
- When task exceeds 7B capability
- When DeepSeek API is available and preferred
- During emergency recovery scenarios

## Configuration

**Ollama Command:** `ollama run qwen2.5:7b-instruct`
**Default Context:** 16384 tokens
**Recommended RAM:** 8GB minimum

## Notes

This is the primary local model for Burgandy HQ.
DeepSeek Chat serves as fallback/recovery only.
qwen3.5:9b failed validation and is not recommended.
