#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8006
HTML_FILE = "simulation-monitor.html"

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Always serve the simulation monitor page
        if self.path == "/" or self.path == "/index.html":
            self.path = f"/{HTML_FILE}"
        
        # Check if the requested file exists
        file_path = os.path.join(os.getcwd(), self.path.lstrip('/'))
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return super().do_GET()
        else:
            # If file doesn't exist, serve the simulation monitor
            self.path = f"/{HTML_FILE}"
            return super().do_GET()
    
    def log_message(self, format, *args):
        # Suppress default logging
        pass

def main():
    os.chdir("C:\\Dev")  # Change to the Dev directory
    
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Simulation monitor server started on port {PORT}")
        print(f"Serving: http://localhost:{PORT}/")
        print(f"Primary file: {HTML_FILE}")
        print("Press Ctrl+C to stop the server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")

if __name__ == "__main__":
    main()