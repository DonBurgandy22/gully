import sys
import json
import subprocess
import urllib.request
from pathlib import Path

ROOT = Path(r"C:\Burgandy")
TASK_BRIDGE = ROOT / "task-prefix-bridge.py"
OLLAMA_MODEL = "qwen3.5:4b"
OLLAMA_URL = "http://127.0.0.1:11434/api/chat"

CLASSIFY_SYSTEM = "You are a message classifier. Reply with only ONE word. Rules: EXECUTE = message clearly asks to DO something on a computer (read file, write file, run script, git, create, delete, check folder, run command). CONVERSE = message is chat, greeting, question, opinion, or discussion with no computer action needed. CLARIFY = message is vague with no clear subject or action (example: do the thing, handle it, sort it out, fix it). One word only: EXECUTE, CONVERSE, or CLARIFY."

CONVERSE_SYSTEM = "You are Burgandy, a local AI assistant. Be direct and concise. No filler. You run on the user machine via WhatsApp."

def ollama(system, user, tokens=20):
    try:
        payload = json.dumps({"model": OLLAMA_MODEL, "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}], "stream": False, "think": False, "options": {"num_predict": tokens, "temperature": 0.1}}).encode()
        req = urllib.request.Request(OLLAMA_URL, payload, {"Content-Type": "application/json"})
        r = urllib.request.urlopen(req, timeout=60)
        return json.loads(r.read())["message"]["content"].strip()
    except Exception as e:
        return "OLLAMA_ERROR: " + str(e)

def classify(msg):
    result = ollama(CLASSIFY_SYSTEM, msg, tokens=20)
    for word in ["EXECUTE", "CONVERSE", "CLARIFY"]:
        if word in result.upper():
            return word
    return "CONVERSE"

def execute(msg):
    r = subprocess.run(["python", str(TASK_BRIDGE), msg], capture_output=True, text=True, encoding="utf-8", cwd=str(ROOT))
    out = r.stdout.strip() or r.stderr.strip() or "EXECUTION_FAILED"
    if "RESPONSE:" in out:
        resp = out.split("RESPONSE:")[-1].strip()
        lines = [l for l in resp.splitlines() if l.strip() and not l.startswith("ADAPTIVE") and not l.startswith("-")]
        return "\n".join(lines[:3]).strip()
    return out

def converse(msg):
    result = ollama(CONVERSE_SYSTEM, msg, tokens=300)
    if result.startswith("OLLAMA_ERROR"):
        return "Could not reach local model. Try again."
    return result

def main():
    msg = " ".join(sys.argv[1:]).strip() if len(sys.argv) > 1 else sys.stdin.read().strip()
    if not msg:
        sys.stdout.write("NO_INPUT\n")
        return
    route = classify(msg)
    if route == "EXECUTE":
        sys.stdout.write(execute(msg) + "\n")
    elif route == "CLARIFY":
        sys.stdout.write("Not sure if you want an action or chat. Use 'task:' for actions.\n")
    else:
        sys.stdout.write(converse(msg) + "\n")
    sys.stdout.flush()

if __name__ == "__main__":
    main()