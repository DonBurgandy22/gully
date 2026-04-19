#!/usr/bin/env python3
"""
n8n Integration for Bridge Worker
Handles YouTube automation tasks via n8n workflow engine
"""

import json
import requests
import logging
from datetime import datetime
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class N8nIntegration:
    """Integration with n8n workflow automation"""
    
    def __init__(self, base_url="http://localhost:5678", api_key=None):
        self.base_url = base_url
        self.api_key = api_key
        self.workflows = {}
        self.load_config()
        
    def load_config(self):
        """Load n8n configuration"""
        config_path = Path("C:/Dev/bridge/n8n-config.json")
        if config_path.exists():
            with open(config_path, 'r') as f:
                self.config = json.load(f)
        else:
            self.config = {
                "workflows": {
                    "content_pipeline": "YouTube Content Pipeline",
                    "analytics_monitor": "YouTube Analytics Monitor",
                    "revenue_tracker": "Revenue Tracking",
                    "engagement_automation": "Engagement Automation"
                },
                "webhooks": {
                    "burgandy_integration": "http://localhost:18789/webhook/n8n"
                }
            }
            self.save_config()
    
    def save_config(self):
        """Save n8n configuration"""
        config_path = Path("C:/Dev/bridge/n8n-config.json")
        with open(config_path, 'w') as f:
            json.dump(self.config, f, indent=2)
    
    def trigger_workflow(self, workflow_name, data=None):
        """Trigger a n8n workflow via webhook"""
        try:
            # Construct webhook URL
            webhook_url = f"{self.base_url}/webhook/{workflow_name}"
            
            # Prepare request data
            payload = {
                "timestamp": datetime.now().isoformat(),
                "source": "burgandy_bridge",
                "data": data or {}
            }
            
            # Send request
            headers = {}
            if self.api_key:
                headers["Authorization"] = f"Bearer {self.api_key}"
            
            response = requests.post(webhook_url, json=payload, headers=headers, timeout=30)
            
            if response.status_code == 200:
                logger.info(f"Workflow {workflow_name} triggered successfully")
                return response.json()
            else:
                logger.error(f"Failed to trigger workflow {workflow_name}: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error triggering workflow {workflow_name}: {e}")
            return None
    
    def get_workflow_status(self, execution_id):
        """Get status of a workflow execution"""
        try:
            url = f"{self.base_url}/api/v1/executions/{execution_id}"
            headers = {}
            if self.api_key:
                headers["Authorization"] = f"Bearer {self.api_key}"
            
            response = requests.get(url, headers=headers, timeout=30)
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Failed to get execution status: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error getting workflow status: {e}")
            return None
    
    def list_workflows(self):
        """List all available workflows"""
        try:
            url = f"{self.base_url}/api/v1/workflows"
            headers = {}
            if self.api_key:
                headers["Authorization"] = f"Bearer {self.api_key}"
            
            response = requests.get(url, headers=headers, timeout=30)
            
            if response.status_code == 200:
                workflows = response.json()
                logger.info(f"Found {len(workflows)} workflows")
                return workflows
            else:
                logger.error(f"Failed to list workflows: {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Error listing workflows: {e}")
            return []
    
    def create_youtube_task(self, task_type, task_data):
        """Create and route YouTube automation tasks"""
        
        task_map = {
            "generate_content": {
                "workflow": "content_pipeline",
                "description": "Generate YouTube content from idea to script"
            },
            "upload_video": {
                "workflow": "content_pipeline",
                "description": "Upload video to YouTube with metadata"
            },
            "check_analytics": {
                "workflow": "analytics_monitor",
                "description": "Check YouTube analytics and performance"
            },
            "track_revenue": {
                "workflow": "revenue_tracker",
                "description": "Track YouTube revenue and expenses"
            },
            "engage_audience": {
                "workflow": "engagement_automation",
                "description": "Automate audience engagement"
            }
        }
        
        if task_type not in task_map:
            logger.error(f"Unknown task type: {task_type}")
            return None
        
        task_info = task_map[task_type]
        
        # Prepare task data
        enhanced_data = {
            **task_data,
            "task_type": task_type,
            "task_description": task_info["description"],
            "timestamp": datetime.now().isoformat(),
            "source": "burgandy_system"
        }
        
        # Trigger workflow
        result = self.trigger_workflow(task_info["workflow"], enhanced_data)
        
        # Log task creation
        self.log_task(task_type, enhanced_data, result)
        
        return result
    
    def log_task(self, task_type, task_data, result):
        """Log task execution for monitoring"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "task_type": task_type,
            "task_data": task_data,
            "result": result,
            "status": "success" if result else "failed"
        }
        
        # Save to log file
        log_path = Path("C:/Dev/bridge/logs/n8n-tasks.log")
        log_path.parent.mkdir(exist_ok=True)
        
        with open(log_path, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
        
        logger.info(f"Task logged: {task_type} - {log_entry['status']}")
    
    def generate_content_pipeline(self, topic, channel="tech"):
        """Generate complete content pipeline task"""
        task_data = {
            "topic": topic,
            "channel": channel,
            "requirements": {
                "script_length": "5-10 minutes",
                "voice_tone": "professional",
                "target_audience": "developers",
                "keywords": ["tutorial", "how-to", "technology"]
            },
            "output_format": {
                "video_length": "5-10 minutes",
                "resolution": "1080p",
                "include_captions": True,
                "thumbnail_style": "professional"
            }
        }
        
        return self.create_youtube_task("generate_content", task_data)
    
    def check_channel_analytics(self, channel_id, period="7days"):
        """Check channel analytics"""
        task_data = {
            "channel_id": channel_id,
            "period": period,
            "metrics": [
                "views",
                "watch_time",
                "subscribers",
                "revenue",
                "engagement_rate"
            ],
            "comparison": "previous_period"
        }
        
        return self.create_youtube_task("check_analytics", task_data)
    
    def upload_video_task(self, video_path, metadata):
        """Upload video to YouTube"""
        task_data = {
            "video_path": video_path,
            "metadata": metadata,
            "publish_settings": {
                "privacy": "private",  # Start as private for review
                "schedule_time": None,  # Publish immediately
                "notify_subscribers": True,
                "auto_chapters": True
            },
            "optimization": {
                "auto_tags": True,
                "auto_description": True,
                "auto_thumbnail": True
            }
        }
        
        return self.create_youtube_task("upload_video", task_data)

# Bridge Worker integration
def integrate_with_bridge_worker():
    """Integrate n8n with existing Bridge Worker"""
    
    # Load bridge worker
    bridge_config_path = Path("C:/Dev/bridge/bridge-config.json")
    if bridge_config_path.exists():
        with open(bridge_config_path, 'r') as f:
            bridge_config = json.load(f)
    else:
        bridge_config = {}
    
    # Add n8n integration to bridge config
    bridge_config["integrations"] = bridge_config.get("integrations", {})
    bridge_config["integrations"]["n8n"] = {
        "enabled": True,
        "base_url": "http://localhost:5678",
        "workflows": [
            "content_pipeline",
            "analytics_monitor",
            "revenue_tracker",
            "engagement_automation"
        ],
        "task_routing": {
            "youtube_content": "n8n",
            "youtube_analytics": "n8n",
            "youtube_monetization": "n8n"
        }
    }
    
    # Save updated config
    with open(bridge_config_path, 'w') as f:
        json.dump(bridge_config, f, indent=2)
    
    logger.info("n8n integration added to Bridge Worker")
    
    return bridge_config

# Test function
def test_n8n_integration():
    """Test n8n integration"""
    n8n = N8nIntegration()
    
    # Test 1: List workflows
    print("Testing n8n integration...")
    workflows = n8n.list_workflows()
    print(f"Workflows found: {len(workflows)}")
    
    # Test 2: Generate content task
    print("\nTesting content generation...")
    result = n8n.generate_content_pipeline("Python AI Tutorial", "tech")
    if result:
        print("Content generation task created")
    else:
        print("Content generation failed - n8n might not be running")
    
    # Test 3: Integrate with Bridge Worker
    print("\nIntegrating with Bridge Worker...")
    bridge_config = integrate_with_bridge_worker()
    print("Integration complete")
    
    return {
        "workflows": len(workflows),
        "content_task": bool(result),
        "bridge_integration": True
    }

if __name__ == "__main__":
    # Run tests
    results = test_n8n_integration()
    print(f"\nTest results: {results}")
    
    # Create example usage documentation
    doc = """
    n8n YouTube Automation Integration
    ==================================
    
    Usage:
    
    1. Start n8n: Run C:\\Dev\\n8n-youtube\\start.bat
    2. Access n8n UI: http://localhost:5678
    3. Set up YouTube API credentials in n8n
    4. Import workflow templates
    
    Python API:
    
    ```python
    from n8n_integration import N8nIntegration
    
    # Initialize
    n8n = N8nIntegration()
    
    # Generate content
    n8n.generate_content_pipeline("AI Tutorial", "tech")
    
    # Check analytics
    n8n.check_channel_analytics("UC123456", "30days")
    
    # Upload video
    n8n.upload_video_task("video.mp4", {
        "title": "My Video",
        "description": "Video description",
        "tags": ["tutorial", "python"]
    })
    ```
    
    Bridge Worker Integration:
    
    The n8n integration is automatically added to the Bridge Worker.
    YouTube tasks will be routed to n8n for automation.
    
    Monitor logs: C:\\Dev\\bridge\\logs\\n8n-tasks.log
    """
    
    print(doc)