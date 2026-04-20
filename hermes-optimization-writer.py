from pathlib import Path
import json

memory_updates = Path(r"C:\Burgandy\memory-updates.json")
optimization_file = Path(r"C:\Burgandy\optimization-suggestions.txt")

if not memory_updates.exists():
    raise FileNotFoundError("memory-updates.json not found.")

data = json.loads(memory_updates.read_text(encoding="utf-8"))

timeout_total = int(data.get("timeout_total", 0) or 0)
failover_total = int(data.get("failover_total", 0) or 0)
success_count = int(data.get("success_count", 0) or 0)

lines = []
lines.append("HERMES OPTIMIZATION SUGGESTIONS")
lines.append("Date: 2026-04-20")
lines.append("")

if timeout_total > 0:
    lines.append("- Reduce task size before changing model.")

if failover_total > timeout_total:
    lines.append("- Investigate non-timeout stop causes because failovers exceed timeouts.")

if success_count <= 1:
    lines.append("- Prefer read-only tasks or exact-content overwrites for stability.")

lines.append("- Keep ollama/qwen2.5:7b-instruct as the primary local worker.")

optimization_file.write_text("\n".join(lines) + "\n", encoding="utf-8")
