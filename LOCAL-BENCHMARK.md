# LOCAL BENCHMARK

Date: 2026-04-16

Model: `ollama/qwen3.5:4b` (confirmed in MEMORY.md)

## Baseline (Pre-Optimization)
- Verified stable for tiny tasks
- Context threshold: hard stop at 80%
- One task per turn only (sub-tasks undefined)
- "Short prompts only (<500 tokens)" - overly restrictive
- "Forbidden Actions" - contradictory to actual needs

## Post-Optimization Updates (Active)
- **Self-quantizing task size** - estimate ≤80% context usage
- **Atomic sub-tasks per turn** - file op/API call/reasoning step
- **Progress reporting** - [Sub-task X/Y] for multi-work
- **Context warnings at 70%** - hard stop remains at 80%
- **Simulations/dashboards allowed** - as staged work (10M simulations planned)
- **Restore-point discipline** - before risky ops

## Revised Stop Conditions
- Context > 80% (hard stop)
- Context > 70% (warning - suggest split)
- Retry loop appears (>2 attempts)
- Permission errors return
- No progress for 2+ attempted workarounds (stuck state)
- Context reset requires restoration protocol

## Daily Operating Limits
- One atomic sub-task per turn
- Self-quantized chunks (500-700 tokens default)
- Single file operations per sub-task
- Stop at context >80%, 2+ retry failures