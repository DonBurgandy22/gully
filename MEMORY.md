# MEMORY.md

## Durable truths
- Burgandy is Daryl Mack's budget-first AI operating system.
- Current workspace root is `C:\Burgandy`.
- Current HQ is this PC.
- OpenClaw runtime state lives in `.openclaw` only.
- The workspace is the durable continuity layer.
- WhatsApp is the current primary live interface.
- Current preferred local controller model is `deepseek/deepseek-chat`.
- Use the cheapest viable solution first.
- Preserve continuity through files, not long chat history.
- The laptop may later become a worker machine.
- Antigravity is the main website design/build engine.
- Claude Code is reserved for heavy coding only when necessary.
- Avoid stale absolute paths from previous machines.
- Do not store credentials, tokens, or passwords in workspace memory files.
- Always continue from current checkpoint/master/state only — never reconstruct from full chat history unless explicitly told.
- Use only: current objective, current confirmed truths, exact file read-backs, current runtime/output state.
- Do not re-summarize old work by default.
- Do not use canvas as source of truth unless explicitly confirmed.
- Default to one atomic step at a time.
- Read back local code before patching.
- Do not claim completion without visual/runtime verification.

## Core project direction
- Burgandy is not just a chatbot; it is Daryl's operating system for income, engineering, automation, web work, research, and continuity.
- OpenClaw is the orchestration layer.
- Budget efficiency matters more than elegance.
- Reusable systems are better than one-off outputs.
- File-based continuity must be preserved before risky operations.

## Current operating preference
- Local-first where practical.
- Keep MEMORY.md compact.
- Move bulky history to archive files.
- agents.defaults.compaction.reserveTokensFloor = 20000 (configured)

## Tool calling reliability lessons (2026-04-19)
- Never use `/v1` in Ollama baseUrl for native tool calling
- Always include `"compat": {"supportsTools": true}` for local models in models.json
- Use exact OpenClaw tool names in documentation (read, write, exec, not read_file, write_file, run_command)
- Keep MEMORY.md current with actual model in use
- Monitor session context size - clear when approaching limits
- qwen2.5:7b-instruct is unreliable for tool calling under heavy context or incorrect tool names
- deepseek/deepseek-chat is more reliable for tool calling
- Configuration validation: Check baseUrl and compat settings after any model config changes
- Documentation sync: Keep AGENTS.md tool names synchronized with actual OpenClaw tool names


## Tool calling rules (2026-04-19)
- Ollama baseUrl must NOT have /v1 suffix
- All local models need compat.supportsTools: true in models.json
- Tool names are: read, write, exec (not read_file/write_file/run_command)
- Clear session if history exceeds ~100 messages
- Use deepseek/deepseek-chat for multi-step tasks
