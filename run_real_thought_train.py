import sys
sys.path.insert(0, '.')
try:
    from burgandy_runtime_hooks import task_start, task_end
    print('[BURGANDY] Framework available')
    
    # Run a real task with multi-node activation
    task_start('verify_thought_train_visualization')
    
    # Activate nodes in sequence
    activated = ['logic', 'mathematics', 'systems_thinking', 'first_principles_reasoning']
    print(f'[BURGANDY] Activating nodes: {activated}')
    
    # Complete task - let runtime auto-generate edges
    task_end(
        task_id='verify_thought_train_visualization',
        activated_nodes=activated,
        # DO NOT provide traversed_edges - let runtime auto-generate
        traversed_edges=None  # This triggers auto-generation
    )
    print('[BURGANDY] Task completed with auto-generated edges')
    
except Exception as e:
    print(f'[BURGANDY] Error: {e}')
    import traceback
    traceback.print_exc()