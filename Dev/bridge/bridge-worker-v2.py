#!/usr/bin/env python3
"""
Bridge Worker v2 - With Task State Persistence
Routes tasks between Antigravity, Spline, Claude Code, DeepSeek, and YouTube pipelines
Includes checkpoint system to survive context resets
"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
import logging
import uuid

# Configuration
CONFIG_PATH = Path("C:/Dev/bridge/bridge-config.json")
STATUS_PATH = Path("C:/Dev/bridge/claude-status.json")
TASK_STATE_PATH = Path("C:/Dev/bridge/task-state.json")
LOG_PATH = Path("C:/Dev/bridge/logs/bridge-decisions.log")
ANTIGRAVITY_PATH = Path("C:/dev/antigravity")
CLAUDE_QUEUE_PATH = Path("C:/Dev/claude-code-queue.md")

# Setup logging
os.makedirs(LOG_PATH.parent, exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_PATH),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class TaskStateManager:
    """Manage task state persistence across restarts"""
    
    def __init__(self, state_file=TASK_STATE_PATH):
        self.state_file = state_file
        self.state = self._load_state()
        logger.info(f"TaskStateManager initialized with {len(self.state.get('active_tasks', []))} active tasks")
    
    def _load_state(self):
        """Load task state from file or create default"""
        if self.state_file.exists():
            try:
                with open(self.state_file, 'r', encoding='utf-8') as f:
                    state = json.load(f)
                    logger.info(f"Loaded task state from {self.state_file}")
                    return state
            except (json.JSONDecodeError, UnicodeDecodeError) as e:
                logger.warning(f"Failed to parse {self.state_file}: {e}, creating default")
        
        # Default state
        return {
            "schema_version": "1.0",
            "last_updated": datetime.now().isoformat(),
            "active_tasks": [],
            "completed_tasks": [],
            "failed_tasks": [],
            "system_state": {
                "bridge_worker_version": "v2",
                "context_usage_percent": 0,
                "claude_status": "unknown",
                "whatsapp_connected": False,
                "last_restart": datetime.now().isoformat()
            },
            "metadata": {
                "purpose": "Persist task state across OpenClaw restarts",
                "checkpoint_frequency": "every_significant_step",
                "auto_save": True,
                "recovery_mode": "resume_from_last_checkpoint"
            }
        }
    
    def _save_state(self):
        """Save task state to file"""
        self.state["last_updated"] = datetime.now().isoformat()
        try:
            with open(self.state_file, 'w', encoding='utf-8') as f:
                json.dump(self.state, f, indent=2, ensure_ascii=False)
            logger.debug(f"Saved task state to {self.state_file}")
            return True
        except Exception as e:
            logger.error(f"Failed to save task state: {e}")
            return False
    
    def create_task(self, task_text, task_type="general", priority="medium"):
        """Create a new task with checkpoint system"""
        task_id = str(uuid.uuid4())[:8]
        
        task = {
            "task_id": task_id,
            "task_text": task_text,
            "task_type": task_type,
            "priority": priority,
            "status": "created",
            "created_at": datetime.now().isoformat(),
            "started_at": None,
            "completed_at": None,
            "last_checkpoint": None,
            "checkpoint_data": {
                "step": "created",
                "progress": 0,
                "next_steps": [],
                "completed_steps": []
            },
            "created_by": "bridge_worker",
            "session_id": os.environ.get("SESSION_ID", "unknown")
        }
        
        self.state["active_tasks"].append(task)
        self._save_state()
        logger.info(f"Created task {task_id}: {task_text[:50]}...")
        return task_id
    
    def start_task(self, task_id):
        """Mark task as in progress"""
        for task in self.state["active_tasks"]:
            if task["task_id"] == task_id:
                task["status"] = "in_progress"
                task["started_at"] = datetime.now().isoformat()
                self._save_state()
                logger.info(f"Started task {task_id}")
                return True
        logger.warning(f"Task {task_id} not found")
        return False
    
    def update_checkpoint(self, task_id, step, progress, next_steps=None, completed_steps=None, data=None):
        """Update task checkpoint"""
        for task in self.state["active_tasks"]:
            if task["task_id"] == task_id:
                task["last_checkpoint"] = datetime.now().isoformat()
                task["checkpoint_data"]["step"] = step
                task["checkpoint_data"]["progress"] = progress
                
                if next_steps:
                    task["checkpoint_data"]["next_steps"] = next_steps
                if completed_steps:
                    task["checkpoint_data"]["completed_steps"] = completed_steps
                if data:
                    task["checkpoint_data"]["data"] = data
                
                self._save_state()
                logger.debug(f"Updated checkpoint for task {task_id}: {step} ({progress}%)")
                return True
        return False
    
    def complete_task(self, task_id, success=True, result=None):
        """Mark task as completed or failed"""
        for i, task in enumerate(self.state["active_tasks"]):
            if task["task_id"] == task_id:
                task["completed_at"] = datetime.now().isoformat()
                task["result"] = result
                
                if success:
                    task["status"] = "completed"
                    self.state["completed_tasks"].append(task)
                    logger.info(f"Completed task {task_id}")
                else:
                    task["status"] = "failed"
                    task["error"] = result
                    self.state["failed_tasks"].append(task)
                    logger.error(f"Failed task {task_id}: {result}")
                
                # Remove from active tasks
                self.state["active_tasks"].pop(i)
                self._save_state()
                return True
        return False
    
    def get_active_tasks(self):
        """Get all active tasks"""
        return self.state.get("active_tasks", [])
    
    def get_task_by_id(self, task_id):
        """Get task by ID"""
        for task in self.state["active_tasks"]:
            if task["task_id"] == task_id:
                return task
        return None
    
    def resume_task(self, task_id):
        """Resume a task from last checkpoint"""
        task = self.get_task_by_id(task_id)
        if task and task["status"] == "in_progress":
            logger.info(f"Resuming task {task_id} from checkpoint: {task['checkpoint_data']['step']}")
            return task["checkpoint_data"]
        return None
    
    def update_system_state(self, key, value):
        """Update system state information"""
        if key in self.state["system_state"]:
            self.state["system_state"][key] = value
            self._save_state()
            return True
        return False

class ClaudeStatusDetector:
    """Detect Claude Code availability"""
    
    def __init__(self, status_file=STATUS_PATH):
        self.status_file = status_file
        self.status = self._load_status()
    
    def _load_status(self):
        """Load status from file or create default"""
        if self.status_file.exists():
            try:
                with open(self.status_file, 'r') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                logger.warning(f"Failed to parse {self.status_file}, using defaults")
        
        # Default status
        return {
            "last_success": None,
            "error_count": 0,
            "status": "unknown",
            "credits_estimated": 100,
            "last_checked": datetime.now().isoformat()
        }
    
    def _save_status(self):
        """Save status to file"""
        self.status["last_checked"] = datetime.now().isoformat()
        with open(self.status_file, 'w') as f:
            json.dump(self.status, f, indent=2)
    
    def check_status(self):
        """Check Claude Code availability"""
        # Simple file-based detection for Phase 1
        # If last success was < 1 hour ago, assume available
        if self.status["last_success"]:
            last_success = datetime.fromisoformat(self.status["last_success"])
            if datetime.now() - last_success < timedelta(hours=1):
                self.status["status"] = "available"
                self._save_status()
                return "available"
        
        # Check error count
        if self.status["error_count"] >= 3:
            self.status["status"] = "rate_limited"
            self._save_status()
            return "rate_limited"
        
        # Default to unknown (will be updated by actual usage)
        return self.status.get("status", "unknown")
    
    def is_available(self):
        """Simple boolean availability check"""
        status = self.check_status()
        return status in ["available", "recently_used"]
    
    def record_success(self):
        """Record successful Claude Code execution"""
        self.status["last_success"] = datetime.now().isoformat()
        self.status["error_count"] = 0
        self.status["status"] = "available"
        self._save_status()
        logger.info("Recorded Claude Code success")
    
    def record_error(self):
        """Record Claude Code error"""
        self.status["error_count"] = self.status.get("error_count", 0) + 1
        if self.status["error_count"] >= 3:
            self.status["status"] = "rate_limited"
        self._save_status()
        logger.warning(f"Recorded Claude Code error (count: {self.status['error_count']})")

class TaskClassifier:
    """Classify tasks into execution paths"""
    
    def __init__(self):
        self.keywords = {
            'antigravity': [
                'website', 'design', 'portfolio', 'visual', 'page', 
                'landing', 'homepage', 'ui', 'ux', 'frontend', 'css',
                'html', 'responsive', 'mobile', 'web', 'site'
            ],
            'spline': [
                '3d', 'interactive', 'scene', 'animation', 'spline',
                'three.js', 'webgl', 'model', 'orbit', 'camera',
                'particle', 'effect', 'immersive'
            ],
            'claude_code': [
                'code', 'build', 'refactor', 'debug', 'architecture',
                'api', 'backend', 'database', 'server', 'python',
                'javascript', 'typescript', 'complex', 'large',
                'generation', 'implementation', 'system'
            ],
            'deepseek': [
                'think', 'plan', 'summary', 'reason', 'analyze',
                'explain', 'understand', 'concept', 'idea', 'strategy',
                'orchestrate', 'coordinate', 'lightweight', 'simple'
            ],
            'youtube': [
                'video', 'channel', 'upload', 'edit', 'thumbnail',
                'script', 'voiceover', 'export', 'render', 'content',
                'monetize', 'audience', 'seo', 'title', 'description'
            ]
        }
    
    def classify(self, task_text):
        """Classify task text into primary path"""
        task_text_lower = task_text.lower()
        scores = {path: 0 for path in self.keywords}
        
        # Score based on keyword matches
        for path, keywords in self.keywords.items():
            for keyword in keywords:
                if keyword in task_text_lower:
                    scores[path] += 1
        
        # Get top scoring path
        if not any(scores.values()):
            return 'deepseek'  # Default
        
        top_path = max(scores, key=scores.get)
        confidence = scores[top_path] / sum(scores.values())
        
        return {
            'primary_path': top_path,
            'confidence': confidence,
            'all_scores': scores
        }

class PathRouter:
    """Route tasks to appropriate execution paths"""
    
    def __init__(self, task_state_manager):
        self.claude_detector = ClaudeStatusDetector()
        self.classifier = TaskClassifier()
        self.task_state = task_state_manager
        
        # Routing rules from AGENTS.md
        self.routing_rules = {
            'antigravity': 'antigravity',
            'spline': 'spline',
            'claude_code': self._route_claude,
            'deepseek': 'deepseek',
            'youtube': 'youtube'
        }
        
        # Fallback chain
        self.fallback_chain = {
            'claude_code': ['deepseek', 'antigravity'],
            'antigravity': ['deepseek'],
            'spline': ['antigravity', 'deepseek'],
            'deepseek': [],  # No fallback for DeepSeek (handled at model level)
            'youtube': ['deepseek']
        }
    
    def _route_claude(self, classification):
        """Special routing for Claude Code based on availability"""
        claude_status = self.claude_detector.check_status()
        
        if claude_status == 'available':
            # Check task complexity (use confidence as proxy)
            if classification['confidence'] > 0.3:  # Medium/high confidence
                return 'claude_code'
            else:
                return 'deepseek'  # Simple tasks to DeepSeek
        else:
            logger.info(f"Claude unavailable ({claude_status}), falling back to DeepSeek")
            return 'deepseek'
    
    def route(self, task_text, task_id=None):
        """Route task to execution path with state persistence"""
        # Check if this is a resumed task
        if task_id:
            checkpoint = self.task_state.resume_task(task_id)
            if checkpoint:
                logger.info(f"Resuming task {task_id} from checkpoint: {checkpoint['step']}")
                # Return cached routing decision if available
                if checkpoint.get('routing_decision'):
                    return checkpoint['routing_decision']
        
        # Classify task
        classification = self.classifier.classify(task_text)
        logger.info(f"Task classified as {classification['primary_path']} (confidence: {classification['confidence']:.2f})")
        
        # Get routing decision
        primary_path = classification['primary_path']
        router = self.routing_rules.get(primary_path)
        
        if callable(router):
            final_path = router(classification)
        else:
            final_path = router or 'deepseek'
        
        # Get fallback options
        fallback_options = self.fallback_chain.get(final_path, ['deepseek'])
        
        decision = {
            'task_text': task_text[:100],  # Truncate for logging
            'classification': classification,
            'final_path': final_path,
            'fallback_options': fallback_options,
            'claude_status': self.claude_detector.check_status(),
            'timestamp': datetime.now().isoformat(),
            'task_id': task_id
        }
        
        # Save routing decision to task state
        if task_id:
            self.task_state.update_checkpoint(
                task_id=task_id,
                step=f"routed_to_{final_path}",
                progress=25,
                data={"routing_decision": decision}
            )
        
        return decision

class BridgeLogger:
    """Log bridge decisions"""
    
    def __init__(self, log_file=LOG_PATH):
        self.log_file = log_file
        os.makedirs(self.log_file.parent, exist_ok=True)
    
    def log_decision(self, decision):
        """Log routing decision"""
        log_entry = {
            'timestamp': decision['timestamp'],
            'task': decision['task_text'],
            'primary_classification': decision['classification']['primary_path'],
            'confidence': decision['classification']['confidence'],
            'final_path': decision['final_path'],
            'claude_status': decision['claude_status'],
            'fallback_options': decision['fallback_options'],
            'task_id': decision.get('task_id')
        }
        
        # Append to log file
        with open(self.log_file, 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')
        
        # Also log to console
        task_id_msg = f" (task: {decision.get('task_id', 'new')})" if decision.get('task_id') else ""
        logger.info(f"Routed to {decision['final_path']}{task_id_msg}")
        
        return log_entry

class BridgeWorkerV2:
    """Main bridge worker coordinating all components with state persistence"""
    
    def __init__(self):
        self.task_state = TaskStateManager()
        self.router = PathRouter(self.task_state)
        self.logger = BridgeLogger()
        self.claude_detector = ClaudeStatusDetector()
        
        # Check for tasks to resume
        self._resume_tasks()
        
        logger.info("Bridge Worker V2 initialized with task state persistence")
    
    def _resume_tasks(self):
        """Resume any interrupted tasks"""
        active_tasks = self.task_state.get_active_tasks()
        if active_tasks:
            logger.info(f"Found {len(active_tasks)} active tasks to resume")
            for task in active_tasks:
                if task["status"] == "in_progress":
                    logger.info(f"Task {task['task_id']} ready for resume: {task['task_text'][:50]}...")
    
    def process_task(self, task_text, resume_task_id=None):
        """Process a single task through the bridge with state persistence"""
        logger.info(f"Processing task: {task_text[:50]}...")
        
        # Create or resume task
        if resume_task_id:
            task_id = resume_task_id
            self.task_state.start_task(task_id)
        else:
            task_id = self.task_state.create_task(
                task_text=task_text,
                task_type="bridge_processing",
                priority="medium"
            )
            self.task_state.start_task(task_id)
        
        # Update checkpoint
        self.task_state.update_checkpoint(
            task_id=task_id,
            step="task_received",
            progress=10,
            next_steps=["classify_task", "route_task", "execute_path"],
            completed_steps=["task_created", "task_started"]
        )
        
        # Route the task
        decision = self.router.route(task_text, task_id)
        
        # Log the decision
        self.logger.log_decision(decision)
        
        # Update checkpoint
        self.task_state.update_checkpoint(
            task_id=task_id,
            step=f"routed_to_{decision['final_path']}",
            progress=30,
            next_steps=[f"execute_{decision['final_path']}", "monitor_execution", "complete_task"],
            completed_steps=["task_received", "classified_task", "routed_task"]
        )
        
        # Return execution instructions
        instructions = self._get_execution_instructions(decision, task_id)
        
        # Update checkpoint
        self.task_state.update_checkpoint(
            task_id=task_id,
            step="execution_instructions_generated",
            progress=50,
            data={"instructions": instructions}
        )
        
        return instructions
    
    def _get_execution_instructions(self, decision, task_id):
        """Get execution instructions for the chosen path"""
        path = decision['final_path']
        
        instructions = {
            'task_id': task_id,
            'path': path,
            'task': decision['task_text'],
            'timestamp': decision['timestamp'],
            'claude_status': decision['claude_status'],
            'instructions': {}
        }
        
        if path == 'antigravity':
            instructions['instructions'] = {
                'workspace': str(ANTIGRAVITY_PATH),
                'action': 'Create or modify website in antigravity workspace',
                'output': 'Files in C:/dev/antigravity/[project]/',
                'checkpoint_step': 'antigravity_execution'
            }
        elif path == 'spline':
            instructions['instructions'] = {
                'workspace': str(ANTIGRAVITY_PATH),
                'action': 'Create 3D interactive scene within website',
                'note': 'Integrated with Antigravity workflow',
                'checkpoint_step': 'spline_execution'
            }
        elif path == 'claude_code':
            instructions['instructions'] = {
                'queue_file': str(CLAUDE_QUEUE_PATH),
                'action': 'Add prompt to Claude Code queue',
                'note': 'Daryl executes from terminal',
                'checkpoint_step': 'claude_code_queue'
            }
        elif path == 'deepseek':
            instructions['instructions'] = {
                'model': 'deepseek-chat or deepseek-reasoner',
                'action': 'Process directly in current session',
                'note': 'Use Reasoner for complex tasks',
                'checkpoint_step': 'deepseek_processing'
            }
        elif path == 'youtube':
            instructions['instructions'] = {
                'skill': 'youtube',
                'action': 'Use YouTube skill with DeepSeek support',
                'note': 'Check C:/Users/dkmac/.openclaw/skills/youtube/SKILL.md',
                'checkpoint_step': 'youtube_workflow'
            }
        
        return instructions
    
    def complete_task_execution(self, task_id, success=True, result=None):
        """Mark task execution as complete"""
        return self.task_state.complete_task(task_id, success, result)
    
    def update_claude_status(self, success=True):
        """Update Claude status based on execution result"""
        if success:
            self.claude_detector.record_success()
        else:
            self.claude_detector.record_error()
    
    def get_status_report(self):
        """Get current bridge status report"""
        active_tasks = self.task_state.get_active_tasks()
        
        return {
            'timestamp': datetime.now().isoformat(),
            'claude_status': self.claude_detector.check_status(),
            'claude_details': self.claude_detector.status,
            'active_tasks_count': len(active_tasks),
            'active_tasks': [{
                'task_id': t['task_id'],
                'task_text': t['task_text'][:50] + '...' if len(t['task_text']) > 50 else t['task_text'],
                'status': t['status'],
                'progress': t['checkpoint_data']['progress'],
                'last_checkpoint': t['last_checkpoint']
            } for t in active_tasks],
            'log_file': str(LOG_PATH),
            'config_file': str(CONFIG_PATH),
            'status_file': str(STATUS_PATH),
            'task_state_file': str(TASK_STATE_PATH)
        }
    
    def emergency_save(self):
        """Emergency save of all state before restart"""
        logger.warning("Performing emergency state save before restart")
        
        # Update system state with current context
        self.task_state.update_system_state("last_emergency_save", datetime.now().isoformat())
        
        # Force save
        self.task_state._save_state()
        
        logger.info("Emergency state save completed")
        return True

def main():
    """Main entry point for testing"""
    worker = BridgeWorkerV2()
    
    # Show status
    status = worker.get_status_report()
    print("Bridge Worker V2 - Task State Persistence Test")
    print("=" * 60)
    print(f"Claude Status: {status['claude_status']}")
    print(f"Active Tasks: {status['active_tasks_count']}")
    
    if status['active_tasks_count'] > 0:
        print("\nActive Tasks:")
        for task in status['active_tasks']:
            print(f"  • {task['task_id']}: {task['task_text']} ({task['progress']}%)")
    
    # Test with sample tasks
    test_tasks = [
        "Build a portfolio website with 3D effects",
        "Create a complex API backend with authentication",
        "Plan YouTube content strategy for next month"
    ]
    
    print("\n" + "=" * 60)
    print("Testing Task Processing with State Persistence:")
    
    for i, task in enumerate(test_tasks, 1):
        print(f"\nTest {i}: {task}")
        result = worker.process_task(task)
        print(f"  -> Task ID: {result['task_id']}")
        print(f"  -> Routed to: {result['path']}")
        print(f"  -> Progress: 50% (checkpoint saved)")
    
    # Show final status
    print("\n" + "=" * 60)
    print("Final Status:")
    final_status = worker.get_status_report()
    print(f"Active Tasks: {final_status['active_tasks_count']}")
    
    # Simulate task completion
    if final_status['active_tasks_count'] > 0:
        task_id = final_status['active_tasks'][0]['task_id']
        worker.complete_task_execution(task_id, success=True, result="Test completed successfully")
        print(f"\nCompleted task {task_id}")
    
    print("\nBridge Worker V2 ready for integration!")
    print("Task state will persist across OpenClaw restarts.")

if __name__ == "__main__":
    main()
