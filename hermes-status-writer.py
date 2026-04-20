from pathlib import Path
import json

memory_updates = Path(r"C:\Burgandy\memory-updates.json")
routing_hints = Path(r"C:\Burgandy\routing-hints.txt")
status_file = Path(r"C:\Burgandy\hermes-status.txt")

if not memory_updates.exists():
    raise FileNotFoundError("memory-updates.json not found.")

data = json.loads(memory_updates.read_text(encoding="utf-8"))

total_events = int(data.get("total_events", 0) or 0)
log_scan_events = int(data.get("log_scan_events", 0) or 0)
timeout_total = int(data.get("timeout_total", 0) or 0)
failover_total = int(data.get("failover_total", 0) or 0)

primary_worker = "ollama/qwen2.5:7b-instruct"
top_recommendation = "keep system stable"

if routing_hints.exists():
    hints = routing_hints.read_text(encoding="utf-8", errors="ignore").splitlines()
    for line in hints:
        clean = line.strip()
        if clean.startswith("- ") and "ollama/qwen2.5:7b-instruct" in clean:
            primary_worker = clean[2:]
            break
    for line in hints:
        clean = line.strip()
        if clean.startswith("- ") and "reduce task scope" in clean.lower():
            top_recommendation = clean[2:]
            break

lines = []
lines.append("HERMES STATUS")
lines.append("Date: 2026-04-20")
lines.append("")
lines.append(f"total_events: {total_events}")
lines.append(f"log_scan_events: {log_scan_events}")
lines.append(f"timeout_total: {timeout_total}")
lines.append(f"failover_total: {failover_total}")
lines.append(f"primary_worker: {primary_worker}")
lines.append(f"top_recommendation: {top_recommendation}")

status_file.write_text("\n".join(lines) + "\n", encoding="utf-8")
