import http.server
import socketserver
import os

PORT = 8080

class EnhancedSimulationHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Serve the enhanced simulation monitor as default
        if self.path == '/' or self.path == '/index.html':
            self.path = '/enhanced-simulation-monitor-complete.html'
        
        # Check if file exists
        file_path = self.translate_path(self.path)
        if os.path.exists(file_path):
            return super().do_GET()
        else:
            # Fall back to enhanced version
            self.path = '/enhanced-simulation-monitor-complete.html'
            return super().do_GET()
    
    def log_message(self, format, *args):
        # Custom log format
        print(f"[{self.log_date_time_string()}] {self.address_string()} - {format % args}")

# Change to the Dev directory
os.chdir('C:\\Dev')

with socketserver.TCPServer(("", PORT), EnhancedSimulationHandler) as httpd:
    print(f"Enhanced Simulation Monitor Server running on port {PORT}")
    print(f"Local: http://localhost:{PORT}")
    print(f"Access from: https://burgandy-sim-enhanced.loca.lt")
    print("Serving enhanced simulation monitor with all features...")
    httpd.serve_forever()