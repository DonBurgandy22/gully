"""
serve.py — Local HTTP server for the Burgandy 3D live network.

Run this, then open: http://localhost:8765/burgandy_network_3d.html
The 3D network will poll live_state.json every 2s for live updates.

Usage:
    python serve.py
    python serve.py --port 9000
"""
import argparse
import http.server
import os
from pathlib import Path

PORT = 8765
SERVE_DIR = Path(__file__).resolve().parent / "outputs"


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # suppress request logs


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=PORT)
    args = parser.parse_args()

    os.chdir(SERVE_DIR)
    addr = ("", args.port)
    with http.server.HTTPServer(addr, NoCacheHandler) as httpd:
        url = f"http://localhost:{args.port}/burgandy_network_3d.html"
        print(f"Burgandy 3D Network server running")
        print(f"Open: {url}")
        print(f"Serving: {SERVE_DIR}")
        print(f"Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
