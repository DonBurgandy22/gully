from pathlib import Path
from datetime import datetime
import json

log_dir = Path(r"C:\Users\User\AppData\Local\Temp\openclaw")
matches = sorted(log_dir.glob("openclaw-*.log"), key=lambda p: p.stat().st_mtime)

if not matches:
    raise FileNotFoundError("No OpenClaw log files found.")

log_file = matches[-1]
last_200_lines = log_file.read_text(encoding="utf-8", errors="ignore").splitlines()[-200:]

llm_idle_timeout_count = 0
failover_count = 0

for line in last_200_lines:
    lower = line.lower()
    if "llm-idle-timeout" in lower or "llm_idle_timeout" in lower:
        llm_idle_timeout_count += 1
    if "failover" in lower:
        failover_count += 1

output = {
    "ts": datetime.now().isoformat(timespec="seconds"),
    "type": "log_scan",
    "timeouts": llm_idle_timeout_count,
    "failovers": failover_count,
}

learning_events = Path(r"C:\Burgandy\learning-events.txt")
with learning_events.open("a", encoding="utf-8") as f:
    f.write(json.dumps(output) + "\n")
