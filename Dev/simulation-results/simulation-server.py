#!/usr/bin/env python3
"""
Simple Simulation Monitor Server
Serves simulation progress and results via HTTP
"""

import json
import os
import time
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import webbrowser

class SimulationHandler(BaseHTTPRequestHandler):
    """HTTP request handler for simulation monitor"""
    
    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/':
            # Serve HTML monitor
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            
            with open('simulation-monitor.html', 'r', encoding='utf-8') as f:
                self.wfile.write(f.read().encode('utf-8'))
                
        elif self.path == '/api/simulation/progress':
            # Serve progress data
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            progress_data = self.load_progress()
            self.wfile.write(json.dumps(progress_data).encode('utf-8'))
            
        elif self.path == '/api/simulation/results':
            # Serve results data
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            results_data = self.load_results()
            self.wfile.write(json.dumps(results_data).encode('utf-8'))
            
        elif self.path == '/api/simulation/learning':
            # Serve learning data
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            learning_data = self.load_learning()
            self.wfile.write(json.dumps(learning_data).encode('utf-8'))
            
        else:
            self.send_response(404)
            self.end_headers()
    
    def load_progress(self):
        """Load progress data from file"""
        progress_file = 'progress-v2.json'
        default_progress = {
            "completed": 0,
            "total": 1000000,
            "timestamp": datetime.now().isoformat(),
            "remaining": 1000000,
            "completion_percentage": 0
        }
        
        try:
            if os.path.exists(progress_file):
                with open(progress_file, 'r') as f:
                    data = json.load(f)
                    # Update timestamp
                    data['timestamp'] = datetime.now().isoformat()
                    data['remaining'] = data['total'] - data['completed']
                    data['completion_percentage'] = (data['completed'] / data['total'] * 100) if data['total'] > 0 else 0
                    return data
        except Exception as e:
            print(f"Error loading progress: {e}")
        
        return default_progress
    
    def load_results(self):
        """Load results data from file"""
        results_file = 'simulation-results-v2.json'
        default_results = {
            "total_simulations": 0,
            "successful_simulations": 0,
            "processing_time_seconds": 0,
            "avg_net_worth": 0,
            "success_rate": 0
        }
        
        try:
            if os.path.exists(results_file):
                with open(results_file, 'r') as f:
                    data = json.load(f)
                    
                    # Calculate statistics
                    simulations = data.get('simulations', [])
                    if simulations:
                        successful = [s for s in simulations if s.get('final_net_worth_zar', 0) >= 75000000]
                        avg_net_worth = sum(s.get('final_net_worth_zar', 0) for s in simulations) / len(simulations)
                        
                        return {
                            "total_simulations": len(simulations),
                            "successful_simulations": len(successful),
                            "processing_time_seconds": data.get('processing_time_seconds', 0),
                            "avg_net_worth": avg_net_worth,
                            "success_rate": (len(successful) / len(simulations) * 100) if simulations else 0,
                            "timestamp": data.get('timestamp', datetime.now().isoformat())
                        }
        except Exception as e:
            print(f"Error loading results: {e}")
        
        return default_results
    
    def load_learning(self):
        """Load learning data from file"""
        learning_file = 'learning-db-v2.json'
        default_learning = {
            "total_learnings": 0,
            "top_skills": [],
            "optimization_rules": [],
            "risk_patterns": []
        }
        
        try:
            if os.path.exists(learning_file):
                with open(learning_file, 'r') as f:
                    data = json.load(f)
                    learnings = data.get('learnings', [])
                    
                    # Extract top skills
                    skill_counts = {}
                    for learning in learnings:
                        skill = learning.get('most_effective_skill')
                        if skill and skill != 'none':
                            skill_counts[skill] = skill_counts.get(skill, 0) + 1
                    
                    top_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:5]
                    
                    # Extract optimization rules from progress file
                    progress_file = 'progress.json'
                    optimization_rules = []
                    if os.path.exists(progress_file):
                        with open(progress_file, 'r') as pf:
                            progress_data = json.load(pf)
                            optimization_rules = progress_data.get('learning_patterns', {}).get('optimization_rules', [])
                    
                    return {
                        "total_learnings": len(learnings),
                        "top_skills": [{"skill": skill, "count": count} for skill, count in top_skills],
                        "optimization_rules": optimization_rules[:10],  # Top 10 rules
                        "timestamp": data.get('timestamp', datetime.now().isoformat())
                    }
        except Exception as e:
            print(f"Error loading learning: {e}")
        
        return default_learning
    
    def log_message(self, format, *args):
        """Suppress log messages"""
        pass

def start_server(port=18080):
    """Start the HTTP server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, SimulationHandler)
    
    print(f"Simulation monitor server started on http://localhost:{port}")
    print("Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")

def open_browser(port=18080):
    """Open browser to the monitor"""
    time.sleep(2)  # Wait for server to start
    webbrowser.open(f'http://localhost:{port}')

if __name__ == '__main__':
    import sys
    
    port = 8080
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port: {sys.argv[1]}, using default port 8080")
    
    # Start browser in separate thread
    browser_thread = threading.Thread(target=open_browser, args=(port,))
    browser_thread.daemon = True
    browser_thread.start()
    
    # Start server
    start_server(port)