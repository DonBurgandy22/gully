# Incident: OpenClaw Restart Loop During Cognitive Framework Integration
**Date:** April 17, 2026  
**Status:** Resolved  
**Impact:** Late-night debugging, delayed task execution  
**Root Cause:** Startup control flow misinterpretation  

## Summary
During integration of the Burgandy cognitive framework runtime hooks, OpenClaw entered a restart loop where the gateway continuously restarted before reaching task execution phase. The issue was caused by OpenClaw interpreting Python import/execution in AGENTS.md as a bootstrap failure, triggering automatic recovery restarts.

## What Changed Before the Incident
1. Cognitive framework runtime hooks (`burgandy-runtime-hooks.py`) were created
2. AGENTS.md was updated with Python import code for framework integration
3. The system attempted to load these hooks during OpenClaw agent startup

## Symptoms Observed
- Repeated "Gateway restart restart ok" messages
- System never reached task execution phase
- Live network visualization remained idle
- `live_state.json` showed no active tasks despite framework being ready

## User-Visible Impact
- Inability to execute tasks through Burgandy
- Restart messages suggesting system instability
- Late-night debugging required to identify root cause

## Why the Symptoms Were Misleading
The restart messages suggested intentional restart behavior, masking that it was an automatic recovery loop. The framework appeared stalled or broken when in reality it was never given a chance to run.

## Initial Hypotheses Considered
1. Framework API failure (incorrect - API worked when tested directly)
2. Live visualization server issues (incorrect - server was running)
3. Path mismatches in `live_state.json` (incorrect - paths were correct)
4. Runtime wiring missing (partially correct but not root cause)

## Actual Root Cause
OpenClaw interpreted the Python import/execution code in AGENTS.md's "Cognitive Framework Integration" section as a bootstrap failure. OpenClaw's default behavior when encountering what it perceives as startup failures is to automatically restart the agent/gateway, creating a loop where startup never completed.

## Exact Files/Sections Involved
**File:** `C:\Burgandy\AGENTS.md`  
**Section:** "Cognitive Framework Integration" (lines 15-24)  
**Code Block:**
```python
import sys
sys.path.insert(0, 'C:\\Burgandy')
try:
    from burgandy-runtime-hooks import task_start, task_end, task_failed
    print('[BURGANDY] Cognitive framework hooks loaded')
except ImportError:
    print('[BURGANDY] Cognitive framework hooks unavailable')
```

## Exact Fix Applied
Added a "RESTART PROHIBITION" section to AGENTS.md:
```markdown
## RESTART PROHIBITION
DO NOT restart OpenClaw during startup.
DO NOT call gateway.restart, openclaw doctor, or any restart triggers.
The system must reach execution phase without restarting.
If hooks fail to load, continue without them - DO NOT restart.
```

## Verification Performed
Three real task types were executed and verified:

### Test 1: Simple File Read Task
- Task: Read 500 characters from AGENTS.md
- Activated nodes: language_comprehension, working_memory, long_term_retrieval
- Result: ✅ Success - file read, nodes activated and cooled down, no restart

### Test 2: Simple Reasoning Task
- Task: Compare two implementation approaches
- Activated nodes: logic, causal_reasoning, decision_making
- Result: ✅ Success - reasoning completed, nodes activated and cooled down, no restart

### Test 3: Simple File Write Task
- Task: Create test file with verification content
- Activated nodes: planning, symbolic_reasoning, error_detection
- Result: ✅ Success - file created, nodes activated and cooled down, no restart

## Results of the 3 Real Task Tests
All tests confirmed:
- ✅ Task execution reached and completed
- ✅ Cognitive nodes activated appropriately
- ✅ `live_state.json` updated with task information
- ✅ Nodes cooled down after task completion
- ✅ No restart triggered during or after tasks
- ✅ OpenClaw session remained stable throughout

**Note:** Initial verification proved runtime activity but not adequate human-visible visualization. The visualizer polls every 2 seconds, and tasks completed too quickly for visual confirmation. A minimum 10-second visible dwell was later added to ensure nodes remain active long enough for human observation.

## Remaining Risks
1. **Future AGENTS.md modifications:** New code blocks could inadvertently trigger similar behavior
2. **OpenClaw version updates:** Default restart behavior could change
3. **Framework dependency changes:** Missing imports could cause silent failures

## Permanent Prevention Rules
1. **Startup execution priority:** Runtime must always take priority over bootstrap self-repair
2. **Restart prohibition:** No automatic restarts during startup unless explicitly requested
3. **Failure tolerance:** Startup code must handle failures gracefully without triggering restarts
4. **Verification first:** Test integration changes with simple tasks before broader deployment

## Recommended AGENTS.md Wording (Permanent)
```markdown
## RESTART PROHIBITION
DO NOT restart OpenClaw during startup.
DO NOT call gateway.restart, openclaw doctor, or any restart triggers.
The system must reach execution phase without restarting.
If hooks fail to load, continue without them - DO NOT restart.
```

## Why This Turned Into a Late-Night Debugging Incident

### Why the Issue Looked Bigger Than It Was
The restart messages created the appearance of systemic instability, suggesting deeper architectural problems rather than a simple startup control flow issue.

### Why Restart Messages Hid the Real Cause
OpenClaw's automatic recovery behavior masked the actual problem: startup code execution being misinterpreted as failure. The symptom (restart) became the dominant observable behavior, hiding the cause.

### Why Runtime Never Properly Began Before the Fix
The restart loop prevented the system from ever reaching the task execution phase. Each restart reset progress, creating the illusion of a stalled framework when in reality the framework was ready but never invoked.

### Why Startup Control Logic Must Never Silently Dominate Execution Flow Again
Automatic recovery mechanisms, while well-intentioned, can create opaque failure modes where the system appears broken but is actually trapped in a recovery loop. Startup must prioritize reaching execution phase over attempting to repair perceived issues.

## Lessons Learned
1. **Startup vs Runtime Separation:** Code executed during agent startup has different failure semantics than runtime code
2. **OpenClaw Behavior Understanding:** The platform has automatic recovery behaviors that can create loops
3. **Symptom vs Cause Distinction:** Restart messages were a symptom, not the cause
4. **Incremental Verification:** Small, simple tests can reveal integration issues before they become systemic
5. **Documentation Value:** Clear restart prohibition prevents recurrence

## Final System Status
✅ **Restart loop resolved**  
✅ **Cognitive framework runtime-integrated**  
✅ **Live visualization working**  
✅ **Task execution stable**  
✅ **Prevention rules established**

The incident, while costing debugging time, resulted in a stronger system with clear prevention rules and verified runtime integration. The cognitive framework is now properly wired into Burgandy's task execution flow with live visualization working as intended.
