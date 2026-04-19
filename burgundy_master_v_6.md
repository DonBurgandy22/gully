# BURGUNDY / BURGANDY MASTER FILE — COGNITIVE FRAMEWORK + THOUGHT-PROCESSING INTEGRATION
**Owner:** Daryl Mack  
**Location Context:** South Africa  
**Last Updated:** 2026-04-17  
**Status:** Comprehensive current-state handoff for Claude Code / future continuation  
**Purpose:** Full updated master file capturing the current Burgandy state, the cognitive-network build, runtime/stall debugging, visualizer work, task-processing framework integration, video-observed behavior, current bottlenecks, and exact next steps.

---

## 1. Executive state

Burgandy is no longer just a model wrapper or file-memory system. The current system is now made up of four interacting layers:

1. **Base cognitive graph**  
   The designed reasoning architecture / “brain network” with nodes, edges, loops, activation behavior, and domain clusters.

2. **Task-processing framework**  
   The dependency-aware, quantized execution method for handling real requests under weak local hardware constraints.

3. **Adaptive overlay**  
   The learned edge layer that forms and strengthens based on repeated co-activation / repeated successful usage.

4. **Thought-train layer**  
   The ordered sequence of node activations / traversed edges representing the route just used during a task.

The immediate mission is to turn these from adjacent concepts into one real live feedback system:

**task → thought-train → live visualization → adaptive reinforcement → future routing preference**

---

## 2. Most important current truths

### 2.1 Restart-loop root cause was found and fixed
The apparent “framework stall” was not initially a broken framework. The first confirmed root cause was a startup restart loop caused by cognitive framework hooks in `AGENTS.md` triggering restart behavior during bootstrap.

Confirmed fix:
- explicit restart prohibition added
- no automatic restart during startup
- no `gateway.restart`
- no `openclaw doctor`
- if hooks fail, continue without them rather than restart

Result:
- runtime reaches execution phase
- simple file read / reasoning / file write tests executed
- nodes activate and cool down
- no restart triggered during those tests

### 2.2 Runtime reserve truth is now corrected
Correct verified runtime truth:
- Disk config file path: `C:\Users\User\.openclaw\openclaw.json`
- Disk config `reserveTokensFloor`: `20000`
- Effective runtime reserve: `16384`
- Active model: `ollama/qwen3.5:4b`
- Approximate total context: `~32K`
- Operational truth is the **effective runtime value**, not disk intent

Correct conclusion:
- `20000` on disk is **not** the operational runtime value
- runtime behaves as if reserve is hard-clamped to `~16K`
- large prompts / large tool outputs cause overflow relative to the actual prompt budget
- reducing reserve would increase available prompt space if the runtime honors it
- larger-context models are needed if both large reserve and large prompt space are desired

### 2.3 The visualizer exists and is live, but visible truth has lagged behind implementation claims
The 3D network visualizer and live network API do exist and are working in some form, but the major recurring issue has been the difference between:
- code-level implementation claims
- runtime truth
- what is visibly convincing on localhost by eye

This became a major theme:
**do not claim “working” unless it is visibly true on screen, not just structurally true in code.**

---

## 3. Current operating model for Burgandy

### 3.1 Default task-handling model
The correct processing model for weak hardware is now:

1. understand the full objective  
2. break it into **dependency-ordered atomic executable sub-tasks**  
3. choose the first safe executable task  
4. complete one atomic task at a time  
5. verify result  
6. log lightweight progress  
7. continue only if safe  
8. compile completed chunks into the final package gradually  
9. declare full completion only when the real deliverable exists and is verified

### 3.2 Correct phrase to preserve
The best short expression of the system now is:

**one dependency-ready atomic sub-task at a time, with rolling compilation toward the final package**

### 3.3 Important correction
The rule is **not**:
- “break everything into the tiniest possible pieces”

The correct rule is:
- break work into the **smallest safe meaningful executable pieces**

Too small creates overhead and fragmentation.  
Too large causes overflow, retries, drift, and tool jams.

---

## 4. Integrated task-processing framework now in effect conceptually

The processing framework that emerged is:

### Intake
- understand full user objective
- infer missing low-risk defaults when safe
- avoid blocking on obvious starter assumptions

### Breakdown
- identify real sub-task pool
- determine dependency order
- choose the first executable atomic step

### Execution
- perform one atomic executable step
- avoid broad multi-edit patches
- use direct commands instead of complex shell chains where possible
- prefer exact, unique edits

### Verification
- use read-back verification for file writes
- use live runtime truth for runtime claims
- use visible screen truth for live visual claims

### Stop logic
Stop safely if:
- context pressure rises
- repeated retry loops appear
- exact-match edit failures repeat
- permission/path/tool errors appear
- output starts rambling
- the task becomes too heavy for the active model/runtime

### Status endings
When stopping at the end of a turn, only end as:
- `complete and stopping`
- `stuck and stopping`

Never stop as “in progress” unless work is actually continuing in the same response.

---

## 5. Live memory / continuity framework

A tiered memory policy is now conceptually established:

### 5.1 Micro-log
After each completed atomic sub-task:
- objective
- current sub-task
- status
- result
- blocker
- next sub-task

Stored in:
- `C:\Burgandy\memory\YYYY-MM-DD.md`

### 5.2 Milestone summary
After a meaningful phase:
- what was completed
- what it solved
- what appeared
- what was resolved
- what remains unresolved
- what required user input vs what could have been handled automatically

Stored in:
- `C:\Burgandy\session-summary.md`

### 5.3 Durable memory / protocol updates
Only when patterns are proven and reusable:
- `C:\Burgandy\MEMORY.md`
- `C:\Burgandy\PROTOCOLS.md`
- restore-point files

Important distinction:
- **MEMORY.md** = durable truths
- **memory/YYYY-MM-DD.md** = daily / running logs
- do not bloat durable memory with operational noise

---

## 6. Restore-point discipline now established

### 6.1 Important restore files now in play
- `RESTORE-POINT-LOCAL-BASELINE.md`
- `FINAL-BASE-RESTORE-POINT.md`

### 6.2 Final base restore point meaning
This became the preferred local restore baseline because it proved:
- local qwen operation usable
- dependency-aware quantized execution workable
- one atomic executable sub-task at a time
- truthful sub-task/result alignment
- clean stopped-state reporting
- safe continuation logic
- real progress on meaningful work without broad overload

### 6.3 Practical restore rule
If local operation fails, drifts, overloads, retries, or starts rambling:
- return first to the final base restore point
- reapply small-step execution
- re-establish one dependency-ready atomic task at a time

---

## 7. Cognitive framework status

### 7.1 Base cognitive graph exists
The “brain framework” / cognitive framework is real and includes:
- multiple layers
- node taxonomy
- starter nodes / starter edges
- activation engine
- loops / convergence logic
- visualization and live network support

### 7.2 Framework integration status
The framework is no longer merely theoretical:
- live network API exists
- 3D visualizer exists
- runtime hooks exist
- node activation / cooldown is wired at least for normal test tasks
- restart-loop issue has already been fixed

### 7.3 The graph is being treated as more than a picture
The conceptual goal now is:

- the graph is the **brain structure**
- the task-processing framework is the **method of thought**
- the thought-train is the **actual route just taken**
- the adaptive overlay is the **learned shortcut memory**
- future routing should be shaped by repeated successful thought-trains

This is the intended live feedback loop.

---

## 8. Live network / visualizer progress so far

### 8.1 What already exists
- `live_network.py`
- `live_net.py`
- `burgandy_network_3d.html`
- `live_state.json`
- serve script / localhost rendering
- polling-based update loop
- edgeMap / base graph rendering
- adaptive edge rendering
- active-edge rendering

### 8.2 What was improved
1. **Restart-loop fixed**
2. **10-second visible dwell added**
3. **Adaptive edges introduced**
4. **Weight-based edge behavior introduced**
5. **Polling interval reduced** (conceptually from 2000ms to 500ms)
6. **Status badge logic improved conceptually** so edge life should influence status, not just active nodes
7. **Thought-train recording added**
8. **Traversed-edge auto-inference added**
9. **Temporary overlay edges for missing thought-train edges added conceptually/in code path**

### 8.3 Known visualizer problems encountered over time
- graph often looked too static
- Idle badge sometimes remained misleading
- glow was too subtle
- adaptive edges were not visibly distinct enough
- thought-train initially had no real sequence layer
- some thought-train edges did not exist in `edgeMap`, preventing visualization
- implementation claims frequently ran ahead of what was visibly convincing on screen

### 8.4 Current major visualizer concepts now in play
There are now three distinct visual classes to preserve:

1. **Base edges**  
   The designed cognitive architecture

2. **Adaptive edges**  
   Learned shortcuts / strengthened repeated relationships

3. **Thought-train edges**  
   The actual recent route used for a task, shown as a temporary overlay/trail

### 8.5 Critical visualizer rule
Do **not** mutate base identity (such as `baseColor`) to represent thought-train overlays permanently.

Correct model:
- thought-train is a temporary overlay
- adaptive edges are persistent learned overlays
- base graph remains stable underneath

---

## 9. Thought-train layer status

### 9.1 This was the missing layer
The biggest conceptual gap was:
- the graph could show state
- but not “what route was just used”

### 9.2 Runtime thought-train recording now exists
`burgandy-runtime-hooks.py` now reportedly records thought-trains including fields like:
- thought-train id
- task id
- timestamp
- activated nodes in order
- traversed edges in order
- duration
- result / error state

### 9.3 Reduced caller burden
Thought-trains no longer always require explicit traversed edge input.

Reported improvement:
- if `activated_nodes` is provided and `traversed_edges` is empty or omitted
- sequential edges are auto-inferred:
  `[a,b,c,d] -> [[a,b],[b,c],[c,d]]`

This is correct and should be preserved.

### 9.4 Correct next use of thought-trains
The next long-term use is:
- repeated successful thought-trains reinforce adaptive edges
- reinforced adaptive routes can influence future task-routing preference
- base graph remains preserved

---

## 10. Critical lessons from runtime/tool-loop failures

### 10.1 Restart loop lesson
Startup control logic must never silently dominate runtime execution.

### 10.2 Tool-loop lesson
Broad multi-edit operations caused repeated failures because:
- oldText blocks were not unique
- edit retries created tool-loop bloat
- compaction was triggered
- response continuity degraded

Correct fix:
- exact file
- exact unique block
- one atomic patch
- verify
- only then continue

### 10.3 Runtime truth lesson
Disk config intent is not operational truth.  
Operational truth = effective runtime behavior.

### 10.4 File-write lesson
Never claim file updates without read-after-write verification.

### 10.5 Visual truth lesson
Never claim live visual success from code logic alone.  
Success = user can actually see it working on localhost.

### 10.6 Queue/context drift lesson
Under heavy context load, older tasks can resurface out of order.  
A real example was a structural-analysis reply arriving out of sequence while the visualizer thread was active.

Correct mitigation:
Before any major response, restate the current active objective internally and ensure it matches the latest thread.

---

## 11. Video-derived observations that should be preserved

The uploaded videos and screenshots added important practical observations:

### 11.1 Handwritten process sketch / mental model
The phone-recorded note/video showed the intended task-processing structure visually:
- **Prompt**
- **Comprehend**
- **Task break down**
- **Re-order by priority / requirements**
- **Schedule / low load**
- **Complete tasks one at a time**
- **Compile**
- **Output**

This should be treated as the practical thinking model for Burgandy on weak hardware.

The sketch strongly supports:
- dependency ordering
- low-load scheduling
- chunk compilation
- final output assembly
- controlled task flow over one-shot execution

### 11.2 Screen recordings of live system
The desktop recordings showed:
- browser with live 3D cognitive network
- terminal with runtime/tool logs
- WhatsApp conversation / instruction thread
- graph often partially alive but still visually under-expressive
- status/Idle truth lag
- evidence that the graph and runtime are live, but not always convincingly synchronized

### 11.3 Practical video conclusion
The videos support the conclusion that the system is now in a “live but still imperfectly synchronized” state:
- not dead
- not merely conceptual
- not yet fully truthful/obvious visually in all moments

This is important:
The problem is no longer “does it exist?”
The problem is now:
**does it show the real cognitive/runtime usage truthfully and clearly enough by eye?**

---

## 12. Structural analysis / engineering direction

A side project/request emerged during the session:
- build an AI-assisted structural finite element / structural analysis workflow
- start with something light/basic
- beam analyser and designer for reinforced concrete geometry and steel reinforcement

This thread partially resurfaced out of order at one point, so it should be preserved as a valid project objective, but **it is not the current primary debugging objective**.

Correct current status:
- this engineering tool concept remains active and important
- but it should be resumed after the brain framework / thought-processing integration is stable enough
- the cognitive network may later support this engineering workflow directly

Potential future use:
- structural tasks may become a key domain cluster for the adaptive cognitive system

---

## 13. Codex role

Codex became available during this work.

Best current role:
- precise code-edit fallback
- patch-review / diff-review helper
- useful when DeepSeek tool loops become too heavy
- useful for syntax-sensitive or multi-file precision tasks

Not recommended as the primary permanent controller yet:
- not full architecture owner
- not broad autonomous coding lead for the whole stack
- better as a precise support engine

---

## 14. GitHub push direction

There is a parallel goal to prepare:
- `C:\Burgandy`
- selected `.openclaw` material

for safe GitHub push.

Correct safety approach:
- safe-to-push = core framework code, selected docs, selected source files
- redact-first = files with local paths, personal identifiers, tokens, secrets, sensitive memory
- never-push = auth/session/runtime state, WhatsApp session data, secrets, local caches

Important:
Do not push raw runtime state, auth files, or personal/private content.

This repo-prep work is important but secondary to stabilizing the current integrated system truthfully.

---

## 15. Current unresolved bottlenecks

### 15.1 Visual truth still not fully trusted
Even after many improvements, the remaining question is still:
- can the user see the actual recent thought path clearly and reliably?

### 15.2 Overlay priority correctness
Current correct rendering priority should be:
1. thought-train overlay
2. ordinary active edge state
3. adaptive edge state
4. base edge state

Any renderer logic that lets lower-priority styling overwrite thought-train overlays still needs tightening.

### 15.3 Event timing vs poll timing
Polling was reduced conceptually, but a poll-based loop still means there can be visible lag or “state flash” behavior after refresh.

### 15.4 Existing-edge vs missing-edge thought-train rendering
This was correctly identified:
- if a thought-train transition does not already exist in `edgeMap`, it must be rendered as a temporary overlay edge, not dropped

### 15.5 True visual confirmation gap
A recurring issue remains:
- the system can explain why it *should* work
- but Claude should only trust things once they are verified in code **and** visually convincing enough for the user

---

## 16. Current best description of the desired final system

The target system is:

### 16.1 Neural-feedback model
Think of the network map as a neural network governed by the method of thought, and think of the method of thought as being shaped by the network in return.

### 16.2 Clean layered model
- **Base graph:** designed cognitive architecture
- **Task-processing framework:** dependency-aware method of thought
- **Thought-train overlay:** recent route actually used
- **Adaptive overlay:** learned shortcuts from repeated successful use
- **Feedback loop:** repeated thought-trains strengthen future routing

### 16.3 Why this matters
That is how Burgandy becomes:
- not just a file-memory assistant
- not just a visual graph
- but a real evolving reasoning system with visible thought structure

---

## 17. Current recommended next steps for Claude Code when available again

### Immediate priority sequence
1. **Verify visual thought-train truth on localhost**
   - run real multi-node task
   - confirm recent path is visibly shown
   - confirm fade behaves correctly

2. **Check overlay priority**
   - ensure thought-train overlay is not overwritten by regular edge styling while active

3. **Tighten status truth**
   - ensure badge reflects visible live activity, not just node activity

4. **Validate missing-edge temporary overlay rendering**
   - confirm thought-train routes show completely even if some edges are absent from base/adaptive graph

5. **Only after visual truth is solid**
   - reinforce adaptive overlay from repeated successful thought-trains
   - influence future routing priority gently from learned paths

### Do NOT do first
- do not redesign the whole architecture
- do not move first into AGENTS.md for runtime features
- do not broaden into unrelated projects before visual/runtime truth is solid
- do not trust implementation summaries without read-back and screen-level validation

---

## 18. Claude re-entry brief

When Claude becomes available again, Claude should assume:

### 18.1 What is already solved
- restart-loop root cause found and fixed
- qwen runtime reserve truth corrected
- 10-second dwell added
- adaptive overlay exists
- thought-train recording exists
- auto traversed-edge inference exists
- temporary thought-train overlay edges are conceptually/partially implemented
- task-processing framework is much cleaner than before

### 18.2 What is NOT yet fully trusted
- final visual truth of thought-train overlay by eye
- full synchronization between runtime activity and rendered status truth
- final renderer priority correctness for thought-train overlays
- automatic adaptive reinforcement affecting future routing in a clean, verified way

### 18.3 How Claude should work
Claude should continue in the same disciplined mode:
- one dependency-ready atomic sub-task at a time
- verify before claiming
- runtime truth over disk intent
- visual truth over code assumptions
- file read-back verification before success claims
- no broad rewrites without need

---

## 19. Compact current-state summary

### Proven
- Burgandy now has both a cognitive network framework and a thought-processing framework
- the correct execution model for weak hardware is dependency-aware quantized execution
- restart-loop issue has been fixed
- thought-train recording exists
- auto edge inference exists

### Partially proven
- adaptive learning / edge strengthening
- live overlay rendering improvements
- status badge truth improvements

### Not fully proven yet
- complete visual truth of recent thought path on localhost in all cases
- final renderer priority correctness
- future routing shaped by learned thought-trains

### Core immediate mission
Finish turning:
- **brain framework**
- **task-processing framework**
- **thought-train overlay**
- **adaptive overlay**

into one visibly truthful live feedback system.

---

## 20. Practical commandment for continuation

If continuing this project later, follow this rule:

**Do not move forward on conceptual brilliance until the failed or uncertain atomic step is either verified true, fixed, or explicitly rejected.**

And the other essential rule:

**Operational truth = what the live runtime and the user-visible system actually do, not what the code was intended to do.**

---

## 21. Suggested next atomic task for continuation

If resuming immediately from this master state, the safest next atomic task is:

**Run one real multi-node task and verify whether the visualizer now clearly shows the recent thought-train path by eye, including temporary overlay edges where needed.**

If that still fails, the next atomic task should be:

**Patch the single exact visualizer block responsible for overwriting or under-rendering active thought-train overlays, without touching unrelated layers.**

---

## 22. Appendix — high-value files in current workspace

### Identity / restore / memory
- `C:\Burgandy\MEMORY.md`
- `C:\Burgandy\PROTOCOLS.md`
- `C:\Burgandy\session-summary.md`
- `C:\Burgandy\memory\YYYY-MM-DD.md`
- `C:\Burgandy\RESTORE-POINT-LOCAL-BASELINE.md`
- `C:\Burgandy\FINAL-BASE-RESTORE-POINT.md`

### Cognitive framework / graph
- `C:\Burgandy\cognitive_map.json`
- `C:\Burgandy\starter_nodes.json`
- `C:\Burgandy\starter_edges.json`
- `C:\Burgandy\graph_builder.py`
- `C:\Burgandy\activation_engine.py`
- `C:\Burgandy\live_network.py`
- `C:\Burgandy\live_net.py`
- `C:\Burgandy\burgandy_network_3d.html`
- `C:\Burgandy\live_state.json`

### Runtime hooks
- `C:\Burgandy\burgandy-runtime-hooks.py`

### Diagnostics / handoffs / master docs
- `C:\Burgandy\BURGUNDY-MASTER-v4.4-2026-04-17.md`
- `C:\Burgandy\BURGANDY-STALL-POSTMORTEM-2026-04-17.md`
- `C:\Burgandy\handover-live-network-status.md`
- `C:\Burgandy\WhatsApp Chat with Burgandy.txt`

### Visual / evidence files
- screen recordings and AVI/MP4 captures from 2026-04-17
- handwritten task-processing sketch / note pages captured in video and PDF export
- screenshots/contact sheets showing live browser + terminal + WhatsApp behavior

---

## 23. Final one-paragraph truth

Burgandy has moved from a fragile local assistant into an emerging live cognitive system with a designed brain graph, a disciplined dependency-aware thought-processing framework, runtime thought-train recording, adaptive-edge learning concepts, and a 3D live network that is increasingly close to showing real reasoning flow. The first major failure mode (restart-loop bootstrap control) has been fixed. The next real finish line is not conceptual architecture but user-visible truth: the recent thought path must be rendered clearly, temporarily, and honestly enough on localhost that the graph can be trusted as a real reflection of what Burgandy just thought through.

