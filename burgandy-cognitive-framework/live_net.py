"""
live_net.py — CLI wrapper for Burgandy's cognitive network.

Usage (from anywhere on this machine):
    python "C:/Burgandy/burgandy-cognitive-framework/live_net.py" activate <skill_name> [task_description]
    python "C:/Burgandy/burgandy-cognitive-framework/live_net.py" deactivate

Examples:
    python live_net.py activate productivity "doing morning check-in"
    python live_net.py activate coding-agent "debugging a Python script"
    python live_net.py deactivate
"""
import sys
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from src.live_network import activate, deactivate_all

_MAP_PATH = ROOT / "data" / "cognitive_map.json"


def _load_map() -> dict:
    return json.loads(_MAP_PATH.read_text(encoding="utf-8"))


def _resolve_skill(skill_name: str, cmap: dict) -> tuple[list, list]:
    """Return (nodes, edges) for a given skill name or keyword."""
    skill_name = skill_name.lower().strip()

    # Direct skill match
    if skill_name in cmap["skills"]:
        entry = cmap["skills"][skill_name]
        return entry["nodes"], entry["edges"]

    # Keyword partial match
    for kw, mapped_skill in cmap["keywords"].items():
        if kw in skill_name:
            entry = cmap["skills"][mapped_skill]
            return entry["nodes"], entry["edges"]

    # Fallback
    entry = cmap["default"]
    return entry["nodes"], entry["edges"]


def cmd_activate(args: list[str]) -> None:
    if not args:
        print("Usage: live_net.py activate <skill_name> [task_description]", file=sys.stderr)
        sys.exit(1)

    skill_name = args[0]
    task_desc = " ".join(args[1:]) if len(args) > 1 else f"Task: {skill_name}"

    cmap = _load_map()
    nodes, edges = _resolve_skill(skill_name, cmap)

    activate(node_ids=nodes, task=task_desc, edges=edges)
    print(f"[cognitive] activated {len(nodes)} nodes for '{skill_name}': {', '.join(nodes)}")


def cmd_deactivate() -> None:
    deactivate_all()
    print("[cognitive] network cooled down — all nodes deactivated")


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(0)

    command = sys.argv[1].lower()

    if command == "activate":
        cmd_activate(sys.argv[2:])
    elif command in ("deactivate", "deactivate_all", "cool", "cooldown"):
        cmd_deactivate()
    elif command == "status":
        from src.live_network import get_status
        import json as _json
        print(_json.dumps(get_status(), indent=2))
    else:
        print(f"Unknown command: {command}. Use: activate | deactivate | status", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
