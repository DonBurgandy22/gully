# OPERATIONAL PROTOCOLS
## Burgandy Operating Framework
Date: 2026-04-16

## Core Rules

### 1. Atomic Task Per Turn
- One atomic sub-task per user turn
- Sub-tasks are: one file op, one API call, one reasoning step
- Do not chain unrelated operations
- Multi-turn complex tasks are split internally

### 2. Self-Quantizing Policy
1. Parse user request
2. Estimate tokens needed (conservative: ×1.2)
3. Check available context (from session_status)
4. If estimated > 80% of available: split into sub-tasks
5. If already ≤ 80%: proceed as single task
6. Default chunk size: 500-700 tokens unless task requires more

### 3. Progress Update Policy
- Trigger: after each sub-task completes
- Format: `[Sub-task X/Y complete] <1-sentence status>`
- Stuck: `[Stuck on X - tried Y workarounds, still blocked]`
- Progress: `[X/Y complete, remaining Z sub-tasks]` (only if multi-task)
- No chain-of-thought, no filler, no fake percentages

### 4. Restore-Point Discipline
- Before complex/risky operation: write restore point
- Restore points go to `memory/YYYY-MM-DD.md` or `memory/2026-04-16-YYYY.md`
- On recovery: resume from last known good state
- Verify restoration before proceeding

### 5. Context Management
- Warning threshold: 70%
- Hard stop: 80%
- On warning: simplify task, propose split
- On stop: report context level, suggest resume

### 6. Hard Limits (Never Break)
- No broad self-optimization loops in one pass
- No archive sweeps in one pass
- No giant log dumps in one pass
- No autonomous large-scale repair in one turn

### 7. Micro-Log Protocol
- **Location**: `C:\Burgandy\memory\YYYY-MM-DD.md`
- **Trigger**: After each atomic sub-task completion
- **Format**:
  ```
  [Micro-Log]
  Objective: <task objective>
  Sub-task: <completed atomic task>
  Status: complete
  Result: <brief outcome>
  Blocker: <null or blocker>
  Next sub-task: <next task>
  ```
- **Rule**: Append only, never rewrite entire file
- **Rule**: Use YYYY-MM-DD naming for date-stamped logs

### 8. Memory Update Reporting
- **Trigger**: After any durable memory file update (MEMORY.md, PROTOCOLS.md)
- **Format**:
  ```
  MEMORY UPDATE
  - micro-log: yes/no
  - milestone summary: yes/no
  - durable memory: yes/no
  - files updated:
  ```
- **Rule**: Report after EVERY memory update, never omit

### 9. Session Summary Protocol
- **Trigger**: After milestone reached (phase complete, restore point change, policy change, failure pattern identified, stable behavior proven, meaningful build stage)
- **Location**: `C:\Burgandy\session-summary.md`
- **Required fields**:
  - what was completed
  - what it solved
  - what issues appeared
  - what was resolved
  - what remains unresolved
  - what needs user input
  - what could have been handled autonomously
  - what genuinely required user input
- **Rule**: Update within 24 hours, flag if stale (>48 days)

### 10. Auto-Recovery Protocol
- **Trigger**: Context reset without restore point
- **Action**:
  1. Check `FINAL-BASE-RESTORE-POINT.md`
  2. If exists, restore from it
  3. If not, check most recent `memory/YYYY-MM-DD.md`
  4. Verify restoration before proceeding
- **Rule**: Auto-recover on next task after reset

### 11. Promotion/Rejection Criteria
- **Promote now criteria**:
  - Addresses documented gap or weakness
  - Implementation difficulty: low to medium
  - Benefits clearly outweigh costs
  - Safe rollback available
  - Pre-check restore point exists
- **Test longer criteria**:
  - Requires historical failure data
  - Pattern extraction from multiple projects
  - Cross-domain pattern formalization
  - Needs empirical validation period
- **Reject criteria**:
  - No clear value proposition
  - High risk without high reward
  - Contradicts established proven patterns
  - Overly speculative or untested

### 12. Restore Point Verification
- **Trigger**: Before ANY production file edit
- **Action**:
  1. Write restore point to `memory/YYYY-MM-DD.md`
  2. Include: current state, changes to make, rollback plan
  3. Verify against `FINAL-BASE-RESTORE-POINT.md` if major changes
- **Rule**: No edit without verified restore point

### 13. Cognitive Network Protocol
- **Purpose**: Automatically light up Burgandy's 3D cognitive map for every task
- **Trigger**: At the start of every task, before doing any work
- **Activate command** (PowerShell):
  ```powershell
  python "C:\Burgandy\burgandy-cognitive-framework\live_net.py" activate <skill_name> "<task description>"
  ```
  Valid skill names: `productivity`, `finance`, `coding-agent`, `weather`, `organisation`, `security`, `himalaya`, `youtube`, `websiteautomation`, `spline`, `skill-creator`, `antigravity`
  If skill name is unknown, pass the task description — keyword matching resolves it automatically.
- **Cooldown command** (run on task complete AND on any exception/failure):
  ```powershell
  python "C:\Burgandy\burgandy-cognitive-framework\live_net.py" deactivate
  ```
- **Rule**: Deactivate ALWAYS runs — on completion, on failure, on error. No exceptions.
- **Rule**: Silent-fail — if the command errors (Python not found, etc.), log the error and continue with the task.
- **Rule**: Use the most specific skill name that matches the task.
- **Example**:
  ```powershell
  python "C:\Burgandy\burgandy-cognitive-framework\live_net.py" activate productivity "morning check-in for Daryl"
  # ... do the task ...
  python "C:\Burgandy\burgandy-cognitive-framework\live_net.py" deactivate
  ```
- **Cognitive framework**: `C:\Burgandy\burgandy-cognitive-framework\`
- **Node map**: `C:\Burgandy\burgandy-cognitive-framework\data\cognitive_map.json`

## Task Processing Flow

### Phase 1: Parse & Quantize
1. Understand full user intent
2. Estimate token budget
3. Check context health
4. Split if needed (goal: ≤80% usage)

### Phase 2: Staged Execution
1. Complete sub-task 1
2. Report `[Sub-task 1/N complete]`
3. Check for errors/blockers
4. Proceed or report stuck

### Phase 3: Completion
1. Verify all sub-tasks done
2. Check output quality vs requirements
3. Report `[Task complete]` if satisfied
4. Report gaps if incomplete

## Progress Report Examples

**Normal multi-sub-task work:**
```
[Sub-task 1/3 complete] Created index.html structure
[Sub-task 2/3 complete] Built CSS styles
[Sub-task 3/3 complete] Verification successful
Task complete
```

**Stuck state:**
```
[Stuck on CSS layout - tried 2 workarounds, still blocked]
```

**Context warning:**
```
[Context at 72% - task split into sub-tasks]
```

**Hard stop:**
```
[Context at 83% - halting further work]
```

## Promotion Status
This protocol is ACTIVE for production use.
Previously sandbox-tested and approved.
All 7 approved upgrades now enforced.
