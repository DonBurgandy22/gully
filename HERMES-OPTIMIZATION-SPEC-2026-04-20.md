# HERMES OPTIMIZATION SPEC
Date: 2026-04-20

## GOAL
Use memory-updates.json to produce short human-readable optimization advice.

## INPUT
- C:\Burgandy\memory-updates.json

## OUTPUT
- C:\Burgandy\optimization-suggestions.txt

## RULES
- if timeout_total > 0:
suggest reducing task size before changing model
- if failover_total > timeout_total:
suggest investigating non-timeout stop causes
- if success_count is low:
suggest using read-only tasks or exact-content overwrites
- always keep ollama/qwen2.5:7b-instruct as primary local worker

## STYLE
Write short plain-text guidance only.
No JSON.
No code.