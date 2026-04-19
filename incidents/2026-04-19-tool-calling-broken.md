# Incident: Tool Calling Broken (2026-04-19)

## Summary
Tool calling was completely broken from system startup on 2026-04-19, requiring a full diagnostic and fix chain.

## Timeline
- **Start**: System startup, 2026-04-19 morning
- **Detection**: All tool calls failing, model confabulating instead of calling tools
- **Resolution**: Afternoon, 2026-04-19
- **Duration**: ~4-6 hours

## Root Cause Chain
1. **Incorrect Ollama baseUrl**: `openclaw.json` `models.json` had `baseUrl: "http://127.0.0.1:11434/v1"` (should be no `/v1` for native Ollama tool calling)
2. **Missing tool compatibility flags**: All local models were missing `"compat": {"supportsTools": true}` in `models.json`
3. **Wrong tool names in AGENTS.md**: Listed `read_file`, `write_file`, `run_command` instead of real OpenClaw tool names (`read`, `write`, `exec`)
4. **Stale model reference in MEMORY.md**: Referenced `ollama/qwen3.5:4b` which was not the active model
5. **Context overflow**: Session history had 175 messages / 94K tokens causing context overflow and compaction failures
6. **Model confabulation**: `qwen2.5:7b-instruct` confabulates instead of calling tools when context is heavy or tool names are wrong
7. **Fix required**: Switching to `deepseek/deepseek-chat` + clearing the session file entirely

## Resolution Steps
1. Updated `models.json`:
   - Removed `/v1` from Ollama `baseUrl`
   - Added `"compat": {"supportsTools": true}` to all local models
2. Updated AGENTS.md with correct OpenClaw tool names
3. Updated MEMORY.md with current model truth
4. Switched active model to `deepseek/deepseek-chat`
5. Cleared session history to eliminate context overflow

## Lessons Learned
1. **Never use `/v1` in Ollama baseUrl for native tool calling**
2. **Always include `"compat": {"supportsTools": true}` for local models**
3. **Use exact OpenClaw tool names in documentation** (`read`, `write`, `exec`, not `read_file`, `write_file`, `run_command`)
4. **Keep MEMORY.md current with actual model in use**
5. **Monitor session context size** - clear when approaching limits
6. **`qwen2.5:7b-instruct` is unreliable for tool calling under heavy context or incorrect tool names**
7. **`deepseek/deepseek-chat` is more reliable for tool calling**

## Prevention Measures
1. **Configuration validation**: Check `baseUrl` and `compat` settings after any model config changes
2. **Documentation sync**: Keep AGENTS.md tool names synchronized with actual OpenClaw tool names
3. **Memory hygiene**: Update MEMORY.md immediately when model changes
4. **Session management**: Implement regular session clearing or use lighter context modes
5. **Model selection**: Prefer `deepseek/deepseek-chat` for reliable tool calling

## Status
✅ Resolved - All tools now functioning correctly with `deepseek/deepseek-chat`

## Verified By
- Tool calls now execute successfully
- Session context clean and compact
- Configuration validated