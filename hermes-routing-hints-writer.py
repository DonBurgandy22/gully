from pathlib import Path

optimization_file = Path(r"C:\Burgandy\optimization-suggestions.txt")
routing_hints_file = Path(r"C:\Burgandy\routing-hints.txt")

if not optimization_file.exists():
    raise FileNotFoundError("optimization-suggestions.txt not found.")

opt_text = optimization_file.read_text(encoding="utf-8", errors="ignore").lower()

lines = []
lines.append("HERMES ROUTING HINTS")
lines.append("Date: 2026-04-20")
lines.append("")
lines.append("PRIMARY LOCAL WORKER")
lines.append("- ollama/qwen2.5:7b-instruct")
lines.append("")

if "reduce task size" in opt_text:
    lines.append("TASK SIZE")
    lines.append("- reduce task scope before changing model")
    lines.append("")

if "non-timeout stop causes" in opt_text:
    lines.append("FAILURE PATTERN")
    lines.append("- investigate incomplete-turn or non-timeout stop causes")
    lines.append("")

if "read-only tasks or exact-content overwrites" in opt_text:
    lines.append("WRITE STRATEGY")
    lines.append("- prefer read-only tasks when possible")
    lines.append("- prefer exact-content overwrites over generated edits")
    lines.append("")

lines.append("MODEL RULE")
lines.append("- keep ollama/qwen2.5:7b-instruct as primary")
lines.append("- do not escalate model before reducing scope")

routing_hints_file.write_text("\n".join(lines) + "\n", encoding="utf-8")
