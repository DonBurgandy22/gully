# HERMES TASK TRACKING SPEC
Date: 2026-04-20

## GOAL
Hermes must track real task outcomes from actual system evidence.

## TRACK THESE EVENT TYPES
- inbound_message
- task_started
- task_completed
- task_failed
- llm_idle_timeout
- failover
- gateway_restart
- whatsapp_ready
- file_write_success
- file_write_failed
- file_read_success
- file_read_failed

## PRIMARY SOURCES
- C:\Burgandy\learning-events.txt
- C:\Users\User\AppData\Local\Temp\openclaw\openclaw-YYYY-MM-DD.log

## RULE
Hermes must infer only from evidence already written to disk.

## OUTPUT PURPOSE
Use tracked events to improve:
- memory-updates.json
- routing-hints.txt
- optimization-suggestions.txt
- network-map-state.json