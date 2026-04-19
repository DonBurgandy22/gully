"""
burgandy-runtime-hooks.py — Runtime integration between OpenClaw/Burgandy and the cognitive framework.

This file provides the missing wiring: calls activate() at task start and deactivate_all() at completion.
Import this in AGENTS.md or BOOTSTRAP.md to enable live cognitive network visualization.

Usage:
    from burgandy-runtime-hooks import task_start, task_end
    
    task_start("Analyzing structural design", ["logic", "mathematics", "systems_thinking"])
    # ... do work ...
    task_end()
"""
import sys
import traceback
import time
import json
import uuid
from datetime import datetime
from pathlib import Path

# Add cognitive framework to path
framework_path = Path(__file__).parent / "burgandy-cognitive-framework" / "src"
if framework_path.exists():
    sys.path.insert(0, str(framework_path))

try:
    from live_network import activate, deactivate_all, get_status
    FRAMEWORK_AVAILABLE = True
except ImportError as e:
    FRAMEWORK_AVAILABLE = False
    print(f"[BURGANDY] Cognitive framework not available: {e}")

# Default node mappings for common task types
TASK_NODE_MAP = {
    "structural": ["logic", "mathematics", "systems_thinking", "first_principles_reasoning"],
    "coding": ["logic", "symbolic_reasoning", "planning", "error_detection"],
    "planning": ["planning", "decision_making", "working_memory", "prioritisation"],
    "analysis": ["logic", "causal_reasoning", "pattern_recognition", "abstraction"],
    "research": ["abstraction", "systems_thinking", "long_term_retrieval", "synthesis"],
    "default": ["language_comprehension", "working_memory", "planning"]
}


def task_start(task_description, nodes=None, task_type=None):
    """
    Call at the beginning of any Burgandy task.
    
    Args:
        task_description: Human-readable description of current task
        nodes: List of node IDs to activate (optional)
        task_type: One of "structural", "coding", "planning", etc. (optional)
    """
    if not FRAMEWORK_AVAILABLE:
        return
    
    try:
        if nodes is None:
            if task_type and task_type in TASK_NODE_MAP:
                nodes = TASK_NODE_MAP[task_type]
            else:
                nodes = TASK_NODE_MAP["default"]
        
        activate(nodes, task=task_description)
        print(f"[BURGANDY] Task started: {task_description}")
        print(f"[BURGANDY] Activated nodes: {nodes}")
        
        # Record activation time for minimum visible dwell
        global _activation_time
        _activation_time = time.time()
    except Exception as e:
        print(f"[BURGANDY] Failed to activate nodes: {e}")
        traceback.print_exc()


def task_end(task_id=None, activated_nodes=None, traversed_edges=None, result="success"):
    """Call when task completes successfully.
    
    Args:
        task_id: Unique identifier for this task (optional)
        activated_nodes: Ordered list of cognitive node IDs activated during task
        traversed_edges: Ordered list of [source, target] edges traversed
        result: "success", "failure", or "partial"
    """
    if not FRAMEWORK_AVAILABLE:
        return
    
    try:
        # Ensure minimum 10-second visible dwell for human observation
        global _activation_time
        if '_activation_time' in globals():
            elapsed = time.time() - _activation_time
            if elapsed < 10:
                remaining = 10 - elapsed
                print(f"[BURGANDY] Ensuring minimum visible dwell: waiting {remaining:.1f}s")
                time.sleep(remaining)
        
        deactivate_all()
        print("[BURGANDY] Task completed, nodes cooled down")
        
        # Record thought-train if we have activation data
        if activated_nodes is not None:
            # Auto-generate traversed_edges from activated_nodes sequence if not provided
            if traversed_edges is None or (isinstance(traversed_edges, list) and len(traversed_edges) == 0):
                if len(activated_nodes) >= 2:
                    # Infer edges in order: [a,b,c,d] -> [[a,b],[b,c],[c,d]]
                    inferred_edges = []
                    for i in range(len(activated_nodes) - 1):
                        inferred_edges.append([activated_nodes[i], activated_nodes[i + 1]])
                    edges = inferred_edges
                    print(f"[BURGANDY] Auto-generated {len(edges)} edges from node sequence")
                else:
                    edges = []  # Single node or empty, no edges to infer
            else:
                # Use explicitly provided edges
                edges = traversed_edges
            
            record_thought_train(task_id, activated_nodes, edges, result)
            
    except Exception as e:
        print(f"[BURGANDY] Failed to deactivate nodes: {e}")
        traceback.print_exc()


def task_failed(error_message=None, task_id=None, activated_nodes=None, traversed_edges=None):
    """Call when task fails.
    
    Args:
        error_message: Description of failure
        task_id: Unique identifier for this task (optional)
        activated_nodes: Ordered list of cognitive node IDs activated
        traversed_edges: Ordered list of [source, target] edges traversed
    """
    if not FRAMEWORK_AVAILABLE:
        return
    
    try:
        if error_message:
            print(f"[BURGANDY] Task failed: {error_message}")
        
        # Ensure minimum 10-second visible dwell even on failure
        global _activation_time
        if '_activation_time' in globals():
            elapsed = time.time() - _activation_time
            if elapsed < 10:
                remaining = 10 - elapsed
                print(f"[BURGANDY] Ensuring minimum visible dwell before cleanup: waiting {remaining:.1f}s")
                time.sleep(remaining)
        
        deactivate_all()
        print("[BURGANDY] Nodes cooled down after failure")
        
        # Record thought-train even on failure
        if activated_nodes is not None:
            # Auto-generate traversed_edges from activated_nodes sequence if not provided
            if traversed_edges is None or (isinstance(traversed_edges, list) and len(traversed_edges) == 0):
                if len(activated_nodes) >= 2:
                    # Infer edges in order: [a,b,c,d] -> [[a,b],[b,c],[c,d]]
                    inferred_edges = []
                    for i in range(len(activated_nodes) - 1):
                        inferred_edges.append([activated_nodes[i], activated_nodes[i + 1]])
                    edges = inferred_edges
                    print(f"[BURGANDY] Auto-generated {len(edges)} edges from node sequence (failure)")
                else:
                    edges = []  # Single node or empty, no edges to infer
            else:
                # Use explicitly provided edges
                edges = traversed_edges
            
            record_thought_train(task_id, activated_nodes, edges, "failure", error_message)
            
    except Exception as e:
        print(f"[BURGANDY] Failed to clean up after failure: {e}")


def get_framework_status():
    """Return current framework status."""
    if not FRAMEWORK_AVAILABLE:
        return {"available": False, "error": "Framework not loaded"}
    
    try:
        status = get_status()
        status["available"] = True
        return status
    except Exception as e:
        return {"available": False, "error": str(e)}


def record_thought_train(task_id, activated_nodes, traversed_edges, result="success", error_message=None):
    """Record a thought-train in live_state.json for visualization.
    
    Args:
        task_id: Task identifier (generated if None)
        activated_nodes: Ordered list of node IDs
        traversed_edges: Ordered list of [source, target] edges
        result: "success", "failure", or "partial"
        error_message: Optional error description
    """
    try:
        # Generate task ID if not provided
        if task_id is None:
            task_id = f"task_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}"
        
        # Calculate duration if we have activation time
        duration_ms = None
        global _activation_time
        if '_activation_time' in globals():
            duration_ms = int((time.time() - _activation_time) * 1000)
        
        # Create thought-train record
        thought_train = {
            "id": f"tt_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:4]}",
            "task_id": task_id,
            "timestamp": datetime.now().isoformat(),
            "activated_nodes": activated_nodes,
            "traversed_edges": traversed_edges if traversed_edges else [],
            "duration_ms": duration_ms,
            "result": result,
            "error_message": error_message
        }
        
        # Load existing live state
        live_state_path = Path(__file__).parent / "burgandy-cognitive-framework" / "outputs" / "live_state.json"
        if live_state_path.exists():
            with open(live_state_path, 'r') as f:
                live_state = json.load(f)
        else:
            live_state = {"task": "", "timestamp": "", "active_nodes": [], "active_edges": [], "all_edges": []}
        
        # Initialize thought_trains array if not present
        if "thought_trains" not in live_state:
            live_state["thought_trains"] = []
        
        # Add new thought-train (most recent first)
        live_state["thought_trains"].insert(0, thought_train)
        
        # Keep only last 10 thought-trains to prevent bloat
        if len(live_state["thought_trains"]) > 10:
            live_state["thought_trains"] = live_state["thought_trains"][:10]
        
        # Write back to file
        with open(live_state_path, 'w') as f:
            json.dump(live_state, f, indent=2)
        
        print(f"[BURGANDY] Thought-train recorded: {thought_train['id']} ({result})")
        print(f"[BURGANDY] Path: {' -> '.join(activated_nodes) if activated_nodes else 'No nodes'}")
        
    except Exception as e:
        print(f"[BURGANDY] Failed to record thought-train: {e}")
        traceback.print_exc()


# Test the integration
if __name__ == "__main__":
    print("Testing Burgandy runtime hooks...")
    status = get_framework_status()
    print(f"Framework available: {status.get('available', False)}")
    
    if status.get("available"):
        task_start("Test runtime integration", ["logic", "mathematics"])
        import time
        time.sleep(2)
        task_end()
        print("Test completed successfully")
    else:
        print(f"Framework unavailable: {status.get('error', 'Unknown')}")