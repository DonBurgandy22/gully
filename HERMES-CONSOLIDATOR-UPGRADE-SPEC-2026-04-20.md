# HERMES CONSOLIDATOR UPGRADE SPEC
Date: 2026-04-20

## GOAL
Upgrade Hermes consolidator to understand log_scan events.

## REQUIRED BEHAVIOR
- read C:\Burgandy\learning-events.txt
- ignore invalid JSON lines safely
- process valid JSON lines only
- detect events where type = log_scan
- total timeout counts across log_scan events
- total failover counts across log_scan events

## OUTPUT IMPACT
Update memory-updates.json to include:
- log_scan_events
- timeout_total
- failover_total

Do not change routing yet.