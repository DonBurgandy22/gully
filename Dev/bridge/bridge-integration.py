#!/usr/bin/env python3
"""
Bridge Integration - Interface for Burgundy to use bridge worker
"""

import json
import sys
from pathlib import Path
from datetime import datetime

# Add bridge directory to path
BRIDGE_DIR = Path("C:/Dev/bridge")
sys.path.append(str(BRIDGE_DIR))

try:
    # Import bridge worker components directly
    import sys
    import os
    sys.path.insert(0, str(BIDGE_DIR))
    
    # We'll use a simpler approach - just check if files exist
    BRIDGE_AVAILABLE = os.path.exists(str(BRIDGE_DIR / "bridge-worker-v2.py"))
    
    if BRIDGE_AVAILABLE:
        # Import only when needed
        pass
except Exception:
    BRIDGE_AVAILABLE = False
    print("Bridge Worker V2 not available")

class BridgeIntegration:
    """Simple interface for Burgundy to use bridge worker"""
    
    def __init__(self):
        if not BRIDGE_AVAILABLE:
            raise ImportError("Bridge Worker V2 not found")
        
        self.worker = BridgeWorkerV2()
        self.task_state_path = BRIDGE_DIR / "task-state.json"
    
    def process_task(self, task_text):
        """Process a task through the bridge"""
        print(f"[Bridge] Processing: {task_text[:80]}...")
        
        # Process through bridge worker
        result = self.worker.process_task(task_text)
        
        # Log to bridge integration log
        self._log_integration("task_processed", {
            "task_id": result.get("task_id"),
            "task_text": task_text[:100],
            "path": result.get("path"),
            "timestamp": datetime.now().isoformat()
        })
        
        return result
    
    def get_status(self):
        """Get bridge status"""
        status = self.worker.get_status_report()
        
        # Format for Burgundy
        formatted = {
            "timestamp": status["timestamp"],
            "claude_status": status["claude_status"],
            "active_tasks": status["active_tasks_count"],
            "task_state_file": str(self.task_state_path),
            "details": {
                "claude_last_checked": status.get("claude_details", {}).get("last_checked"),
                "claude_error_count": status.get("claude_details", {}).get("error_count", 0)
            }
        }
        
        # Add active task summaries
        if status["active_tasks_count"] > 0:
            formatted["active_task_list"] = [
                {
                    "id": t["task_id"],
                    "text": t["task_text"],
                    "progress": t["progress"],
                    "checkpoint": t.get("last_checkpoint", "unknown")
                }
                for t in status.get("active_tasks", [])
            ]
        
        return formatted
    
    def emergency_save(self):
        """Perform emergency save before restart"""
        print("[Bridge] Performing emergency save...")
        success = self.worker.emergency_save()
        
        self._log_integration("emergency_save", {
            "success": success,
            "timestamp": datetime.now().isoformat(),
            "reason": "manual_restart_requested"
        })
        
        return success
    
    def resume_tasks(self):
        """Check for tasks to resume after restart"""
        status = self.get_status()
        
        if status["active_tasks"] > 0:
            print(f"[Bridge] Found {status['active_tasks']} tasks to resume")
            
            self._log_integration("resume_check", {
                "tasks_found": status["active_tasks"],
                "timestamp": datetime.now().isoformat(),
                "state_file_exists": self.task_state_path.exists()
            })
            
            return True
        return False
    
    def _log_integration(self, event_type, data):
        """Log integration events"""
        log_entry = {
            "event": event_type,
            "timestamp": datetime.now().isoformat(),
            "data": data
        }
        
        log_file = BRIDGE_DIR / "logs" / "bridge-integration.log"
        log_file.parent.mkdir(exist_ok=True)
        
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")

def main():
    """Command line interface for testing"""
    if not BRIDGE_AVAILABLE:
        print("Error: Bridge Worker V2 not available")
        print("Make sure bridge-worker-v2.py is in C:/Dev/bridge/")
        return 1
    
    try:
        bridge = BridgeIntegration()
    except Exception as e:
        print(f"Error initializing bridge: {e}")
        return 1
    
    # Parse command line arguments
    if len(sys.argv) < 2:
        print("Usage: python bridge-integration.py <command> [args]")
        print("Commands: status, process <task>, save, resume")
        return 1
    
    command = sys.argv[1].lower()
    
    if command == "status":
        status = bridge.get_status()
        print(json.dumps(status, indent=2, ensure_ascii=False))
    
    elif command == "process" and len(sys.argv) > 2:
        task_text = " ".join(sys.argv[2:])
        result = bridge.process_task(task_text)
        print(json.dumps(result, indent=2, ensure_ascii=False))
    
    elif command == "save":
        success = bridge.emergency_save()
        print(f"Emergency save: {'SUCCESS' if success else 'FAILED'}")
    
    elif command == "resume":
        has_tasks = bridge.resume_tasks()
        print(f"Tasks to resume: {'YES' if has_tasks else 'NO'}")
    
    else:
        print(f"Unknown command: {command}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())