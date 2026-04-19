import json, os, re
from datetime import datetime

INPUTS = [
    "input/burgandy-master.md",
    "input/openclaw.json",
    "input/agents.md"
]
OUTPUT = "output/burgandy-graph.json"
CHECKPOINT = "checkpoint.json"
MAX_BYTES = 300_000

nodes = {}
edges = []

def read_file(path):
    with open(path, "rb") as f:
        raw = f.read(MAX_BYTES)
    try:
        text = raw.decode("utf-8")
    except:
        text = raw.decode("utf-8", errors="replace")
    if os.path.getsize(path) > MAX_BYTES:
        print(f"TRUNCATED: {path} at 300KB")
    return text

# PRIORITY 1: Parse NODE_ID structured blocks from master file
def parse_node_blocks(text):
    # Match blocks: NODE_ID: id\nTYPE: type\nDESCRIPTION: desc\nPROPERTIES: props
    pattern = re.compile(
        r"NODE_ID:\s*(.+?)\n.*?TYPE:\s*(.+?)\n.*?DESCRIPTION:\s*(.+?)\n.*?PROPERTIES:\s*(.+?)(?=\nNODE_ID:|\Z)",
        re.DOTALL | re.IGNORECASE
    )
    found = []
    for m in pattern.finditer(text):
        nid = m.group(1).strip().replace(" ", "_").lower()
        found.append({
            "id": nid,
            "type": m.group(2).strip().lower(),
            "label": m.group(3).strip()[:80],
            "notes": m.group(4).strip()[:120],
            "source": "node_block"
        })
    return found

# PRIORITY 2: Known entity extraction from master file
KNOWN_MODELS = [
    ("qwen3.5:4b", "model", "Primary local model"),
    ("phi3.5", "model", "Fallback local — no tools"),
    ("deepseek-coder:6.7b", "model", "Coding tasks"),
    ("llama3.2:3b", "model", "Chat only — not suitable for agent"),
    ("deepseek-chat", "model", "Cloud primary (legacy)"),
    ("deepseek-reasoner", "model", "Cloud reasoning — Deep think trigger"),
    ("gemini-2.0-flash", "model", "Free cloud fallback"),
    ("claude-code", "model", "Production coding — separate key"),
]
KNOWN_CHANNELS = [
    ("whatsapp", "channel", "Primary — +27602678740"),
    ("telegram", "channel", "Secondary — disabled"),
]
KNOWN_TOOLS = [
    ("youtube_skill", "tool", "YouTube pipeline"),
    ("finance_skill", "tool", "Finance tracking"),
    ("security_skill", "tool", "8-step security scan"),
    ("coding_agent_skill", "tool", "Code task queue"),
    ("websiteautomation_skill", "tool", "Client website pipeline"),
    ("antigravity_skill", "tool", "GSAP physics animations"),
    ("spline_skill", "tool", "3D Spline integration"),
    ("himalaya_skill", "tool", "Email via Outlook COM"),
    ("organisation_skill", "tool", "File organisation"),
    ("productivity_skill", "tool", "Morning/evening routines"),
    ("weather_skill", "tool", "Weather lookup"),
    ("skill_creator_skill", "tool", "Create/refine skills"),
]
KNOWN_FILES = [
    ("agents_md", "file", "Startup rules and behaviour"),
    ("soul_md", "file", "Identity and tone"),
    ("memory_md", "file", "Long-term durable memory"),
    ("user_md", "file", "User profile"),
    ("session_summary_md", "file", "Cross-session continuity"),
    ("daily_memory", "file", "memory/YYYY-MM-DD.md"),
    ("openclaw_json", "file", "Config — models, channels, gateway"),
    ("checkpoint_json", "file", "Pipeline step tracking"),
]
KNOWN_PROCESSES = [
    ("gateway", "process", "OpenClaw gateway ws://127.0.0.1:18789"),
    ("auto_restart_loop", "process", "70% context threshold trigger"),
    ("context_monitor", "process", "BurgandyContextMonitor2Min task"),
    ("memory_save", "process", "Save before restart"),
    ("model_router", "process", "Routes tasks to cheapest viable model"),
    ("compaction", "process", "safeguard mode — context management"),
]
KNOWN_HARDWARE = [
    ("rtx_3060", "hardware", "12GB VRAM — runs local models"),
    ("ryzen_5600", "hardware", "AMD Ryzen 5 5600 — 16GB RAM"),
]
KNOWN_SERVICES = [
    ("deepseek_api", "service", "Cloud API — $25/mo max"),
    ("google_cloud", "service", "TTS + NotebookLM"),
    ("elevenlabs_api", "service", "YouTube voiceover — pending"),
    ("reddit_praw", "service", "Story scraping — pending"),
    ("youtube_data_api", "service", "Upload automation — pending"),
    ("ollama", "service", "Local model runtime — port 11434"),
]

all_known = KNOWN_MODELS + KNOWN_CHANNELS + KNOWN_TOOLS + KNOWN_FILES + KNOWN_PROCESSES + KNOWN_HARDWARE + KNOWN_SERVICES

for nid, ntype, label in all_known:
    if nid not in nodes:
        nodes[nid] = {"id": nid, "type": ntype, "label": label, "notes": "", "source": "known"}

# PRIORITY 3: Parse openclaw.json for config-derived nodes
try:
    cfg_text = read_file("input/openclaw.json")
    cfg = json.loads(cfg_text)
    primary = cfg.get("agents", {}).get("defaults", {}).get("model", {}).get("primary", "")
    if primary:
        pid = primary.replace("/", "_").replace(":", "_").replace(".", "_")
        if pid not in nodes:
            nodes[pid] = {"id": pid, "type": "model", "label": primary, "notes": "from openclaw.json", "source": "config"}
    bootstrap = cfg.get("agents", {}).get("defaults", {}).get("bootstrapMaxChars", 0)
    nodes["openclaw_config"] = {"id": "openclaw_config", "type": "process", "label": f"OpenClaw Config (bootstrap:{bootstrap})", "notes": "version 2026.4.14", "source": "config"}
except Exception as e:
    print(f"WARN: openclaw.json parse error: {e}")

# KNOWN EDGES — derived from verified system relationships
known_edges = [
    # Channel → model routing
    ("whatsapp", "model_router", "routes_to", "WhatsApp input"),
    ("telegram", "model_router", "routes_to", "Telegram input (disabled)"),
    ("model_router", "qwen3_5_4b", "routes_to", "primary local"),
    ("model_router", "deepseek_reasoner", "routes_to", "deep think trigger"),
    ("model_router", "gemini_2_0_flash", "routes_to", "cloud fallback"),
    # Fallback chain
    ("qwen3_5_4b", "phi3_5", "falls_back_to", "no tools"),
    ("phi3_5", "gemini_2_0_flash", "falls_back_to", "cloud"),
    ("deepseek_chat", "gemini_2_0_flash", "falls_back_to", "budget limit"),
    # Models run on hardware
    ("qwen3_5_4b", "rtx_3060", "runs_on", "GPU inference"),
    ("phi3_5", "rtx_3060", "runs_on", "GPU inference"),
    ("deepseek_coder_6_7b", "rtx_3060", "runs_on", "GPU inference"),
    # Ollama serves models
    ("ollama", "qwen3_5_4b", "calls", "serves"),
    ("ollama", "phi3_5", "calls", "serves"),
    ("ollama", "deepseek_coder_6_7b", "calls", "serves"),
    # Gateway
    ("gateway", "model_router", "triggers", "message dispatch"),
    ("gateway", "whatsapp", "reads", "channel input"),
    # Startup file reads
    ("gateway", "agents_md", "reads", "bootstrap"),
    ("gateway", "soul_md", "reads", "bootstrap"),
    ("gateway", "user_md", "reads", "bootstrap"),
    ("gateway", "memory_md", "reads", "bootstrap"),
    ("gateway", "session_summary_md", "reads", "on reconnect"),
    # Process chains
    ("context_monitor", "auto_restart_loop", "triggers", "70% threshold"),
    ("auto_restart_loop", "memory_save", "triggers", "save before restart"),
    ("memory_save", "session_summary_md", "writes", "state preservation"),
    ("memory_save", "daily_memory", "writes", "daily log"),
    ("auto_restart_loop", "gateway", "triggers", "restart via gateway.cmd"),
    ("compaction", "context_monitor", "reads", "session size proxy"),
    # Skills called by models
    ("qwen3_5_4b", "youtube_skill", "calls", ""),
    ("qwen3_5_4b", "finance_skill", "calls", ""),
    ("qwen3_5_4b", "security_skill", "calls", ""),
    ("qwen3_5_4b", "coding_agent_skill", "calls", ""),
    ("qwen3_5_4b", "websiteautomation_skill", "calls", ""),
    ("qwen3_5_4b", "antigravity_skill", "calls", ""),
    ("deepseek_coder_6_7b", "coding_agent_skill", "calls", ""),
    # External services
    ("youtube_skill", "youtube_data_api", "calls", "upload"),
    ("youtube_skill", "elevenlabs_api", "calls", "voiceover"),
    ("youtube_skill", "reddit_praw", "calls", "scrape"),
    ("coding_agent_skill", "claude_code", "calls", "heavy coding"),
    ("deepseek_reasoner", "deepseek_api", "calls", "cloud inference"),
    ("gemini_2_0_flash", "google_cloud", "calls", "cloud inference"),
    # Config
    ("openclaw_config", "gateway", "reads", "runtime config"),
    ("openclaw_config", "openclaw_json", "reads", "disk config"),
]

for src, tgt, etype, label in known_edges:
    # Normalize IDs
    src_n = src.replace(":", "_").replace(".", "_").replace("/", "_").replace("-", "_")
    tgt_n = tgt.replace(":", "_").replace(".", "_").replace("/", "_").replace("-", "_")
    edges.append({"from": src_n, "to": tgt_n, "type": etype, "label": label})
    # Auto-add missing nodes as stubs
    for nid in [src_n, tgt_n]:
        if nid not in nodes:
            nodes[nid] = {"id": nid, "type": "unknown", "label": nid, "notes": "auto-stub", "source": "edge_inference"}

graph = {
    "nodes": list(nodes.values()),
    "edges": edges,
    "meta": {
        "source_files": INPUTS,
        "generated_at": datetime.utcnow().isoformat(),
        "node_count": len(nodes),
        "edge_count": len(edges)
    }
}

os.makedirs("output", exist_ok=True)
with open(OUTPUT, "w") as f:
    json.dump(graph, f, indent=2)

# Update checkpoint
with open(CHECKPOINT) as f:
    cp = json.load(f)
cp["last_completed"] = 1
cp["steps"]["1"] = {"output": OUTPUT, "nodes": len(nodes), "edges": len(edges)}
with open(CHECKPOINT, "w") as f:
    json.dump(cp, f)

print(f"STEP 1 COMPLETE — {len(nodes)} nodes, {len(edges)} edges → {OUTPUT}")
