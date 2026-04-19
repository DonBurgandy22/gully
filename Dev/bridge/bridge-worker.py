#!/usr/bin/env python3
"""
Bridge Worker - Phase 1 Implementation
Routes tasks between Antigravity, Spline, Claude Code, DeepSeek, and YouTube pipelines
"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
import logging

# Configuration
CONFIG_PATH = Path("C:/Dev/bridge/bridge-config.json")
STATUS_PATH = Path("C:/Dev/bridge/claude-status.json")
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
    
    def __init__(self):
        self.claude_detector = ClaudeStatusDetector()
        self.classifier = TaskClassifier()
        
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
    
    def route(self, task_text):
        """Route task to execution path"""
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
        
        return {
            'task_text': task_text[:100],  # Truncate for logging
            'classification': classification,
            'final_path': final_path,
            'fallback_options': fallback_options,
            'claude_status': self.claude_detector.check_status(),
            'timestamp': datetime.now().isoformat()
        }

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
            'fallback_options': decision['fallback_options']
        }
        
        # Append to log file
        with open(self.log_file, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
        
        # Also log to console
        logger.info(f"Routed to {decision['final_path']} (from {decision['classification']['primary_path']})")
        
        return log_entry

class BridgeWorker:
    """Main bridge worker coordinating all components"""
    
    def __init__(self):
        self.router = PathRouter()
        self.logger = BridgeLogger()
        self.claude_detector = ClaudeStatusDetector()
        
        logger.info("Bridge Worker initialized")
    
    def process_task(self, task_text):
        """Process a single task through the bridge"""
        logger.info(f"Processing task: {task_text[:50]}...")
        
        # Route the task
        decision = self.router.route(task_text)
        
        # Log the decision
        self.logger.log_decision(decision)
        
        # Return execution instructions
        return self._get_execution_instructions(decision)
    
    def _get_execution_instructions(self, decision):
        """Get execution instructions for the chosen path"""
        path = decision['final_path']
        
        instructions = {
            'path': path,
            'task': decision['task_text'],
            'timestamp': decision['timestamp'],
            'instructions': {}
        }
        
        if path == 'antigravity':
            instructions['instructions'] = {
                'workspace': str(ANTIGRAVITY_PATH),
                'action': 'Create or modify website in antigravity workspace',
                'output': 'Files in C:/dev/antigravity/[project]/'
            }
        elif path == 'spline':
            instructions['instructions'] = {
                'workspace': str(ANTIGRAVITY_PATH),
                'action': 'Create 3D interactive scene within website',
                'note': 'Integrated with Antigravity workflow'
            }
        elif path == 'claude_code':
            instructions['instructions'] = {
                'queue_file': str(CLAUDE_QUEUE_PATH),
                'action': 'Add prompt to Claude Code queue',
                'note': 'Daryl executes from terminal'
            }
        elif path == 'deepseek':
            instructions['instructions'] = {
                'model': 'deepseek-chat or deepseek-reasoner',
                'action': 'Process directly in current session',
                'note': 'Use Reasoner for complex tasks'
            }
        elif path == 'youtube':
            instructions['instructions'] = {
                'skill': 'youtube',
                'action': 'Use YouTube skill with DeepSeek support',
                'note': 'Check C:/Users/dkmac/.openclaw/skills/youtube/SKILL.md'
            }
        
        return instructions
    
    def update_claude_status(self, success=True):
        """Update Claude status based on execution result"""
        if success:
            self.claude_detector.record_success()
        else:
            self.claude_detector.record_error()
    
    def get_status_report(self):
        """Get current bridge status report"""
        return {
            'timestamp': datetime.now().isoformat(),
            'claude_status': self.claude_detector.check_status(),
            'claude_details': self.claude_detector.status,
            'log_file': str(LOG_PATH),
            'config_file': str(CONFIG_PATH),
            'status_file': str(STATUS_PATH)
        }

def main():
    """Main entry point for testing"""
    worker = BridgeWorker()
    
    # Test with sample tasks
    test_tasks = [
        "Build a portfolio website with 3D effects",
        "Create a complex API backend with authentication",
        "Plan YouTube content strategy for next month",
        "Debug this JavaScript code that's not working",
        "Design a landing page for a tech startup"
    ]
    
    print("Bridge Worker Test - Phase 1")
    print("=" * 50)
    
    for i, task in enumerate(test_tasks, 1):
        print(f"\nTest {i}: {task}")
        result = worker.process_task(task)
        print(f"  -> Routed to: {result['path']}")
        print(f"  Instructions: {result['instructions']}")
    
    # Show status report
    print("\n" + "=" * 50)
    print("Status Report:")
    status = worker.get_status_report()
    print(f"Claude Status: {status['claude_status']}")
    print(f"Last Checked: {status['claude_details'].get('last_checked', 'Never')}")
    print(f"Error Count: {status['claude_details'].get('error_count', 0)}")
    
    print("\nBridge Worker ready for integration!")

if __name__ == "__main__":
    main()