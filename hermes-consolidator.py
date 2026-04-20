from pathlib import Path
import json

learning_events = Path(r"C:\Burgandy\learning-events.txt")
memory_updates = Path(r"C:\Burgandy\memory-updates.json")

total_events = 0
success_count = 0
failure_count = 0
log_scan_events = 0
timeout_total = 0
failover_total = 0
engines = {}

if learning_events.exists():
    for raw_line in learning_events.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = raw_line.strip()
        if not line:
            continue
        try:
            event = json.loads(line)
        except json.JSONDecodeError:
            continue

        total_events += 1

        if event.get("success") is True:
            success_count += 1
        if event.get("success") is False:
            failure_count += 1

        if event.get("type") == "log_scan":
            log_scan_events += 1
            timeout_total += int(event.get("timeouts", 0) or 0)
            failover_total += int(event.get("failovers", 0) or 0)

        engine = event.get("engine")
        if engine:
            engines[engine] = engines.get(engine, 0) + 1

output = {
    "total_events": total_events,
    "success_count": success_count,
    "failure_count": failure_count,
    "log_scan_events": log_scan_events,
    "timeout_total": timeout_total,
    "failover_total": failover_total,
    "engines": engines,
}

memory_updates.write_text(json.dumps(output, indent=2), encoding="utf-8")
