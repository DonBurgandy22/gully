from __future__ import annotations
import json
from datetime import datetime
from pathlib import Path
from typing import List

from src.models import SimulationResult


def get_project_root() -> Path:
    """Return the absolute path to the burgandy-cognitive-framework directory."""
    return Path(__file__).resolve().parent.parent


def get_outputs_dir() -> Path:
    return get_project_root() / "outputs"


def get_data_dir() -> Path:
    return get_project_root() / "data"


def ensure_outputs_dir() -> Path:
    out = get_outputs_dir()
    out.mkdir(parents=True, exist_ok=True)
    return out


def write_json(data: object, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, default=str)


def read_json(path: Path) -> object:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def format_activation_table(result: SimulationResult, top_n: int = 20) -> str:
    """Format top-N activated nodes as a markdown table."""
    lines = [
        f"### {result.demo_name}",
        f"**Seeds:** {', '.join(result.seed_nodes)}  ",
        f"**Iterations:** {result.iterations_run}  ",
        f"**Saturated nodes:** {', '.join(result.saturated_nodes) or 'None'}  ",
        "",
        "| Rank | Node | Final Activation | Visit Count |",
        "|------|------|-----------------|-------------|",
    ]
    for rank, record in enumerate(result.activated_nodes[:top_n], 1):
        bar = "█" * int(record.final_activation * 20)
        lines.append(
            f"| {rank} | `{record.node_id}` | {record.final_activation:.4f} {bar} | {record.visit_count} |"
        )

    if result.loop_traversals:
        lines += ["", "**Loop traversal counts (capped paths):**"]
        for path, count in sorted(result.loop_traversals.items(), key=lambda x: -x[1]):
            lines.append(f"- `{path}`: {count} capped traversal(s)")

    return "\n".join(lines)


def write_activation_report(results: List[SimulationResult], output_path: Path) -> None:
    """Write the full activation report for all demos to a markdown file."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    sections = [
        "# Burgandy Cognitive Framework — Activation Report",
        f"**Generated:** {timestamp}  ",
        "",
        "---",
        "",
    ]

    for result in results:
        sections.append(format_activation_table(result))
        sections.append("\n---\n")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(sections), encoding="utf-8")


def file_size_str(path: Path) -> str:
    """Return human-readable file size string."""
    if not path.exists():
        return "missing"
    size = path.stat().st_size
    if size < 1024:
        return f"{size} B"
    elif size < 1024 * 1024:
        return f"{size / 1024:.1f} KB"
    else:
        return f"{size / 1024 / 1024:.1f} MB"
