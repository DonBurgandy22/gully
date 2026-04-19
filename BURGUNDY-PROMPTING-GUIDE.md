# BURGUNDY PROMPTING GUIDE
**Owner:** Daryl Mack  
**Project:** Burgandy / Burgundy  
**Last Updated:** 2026-04-17  
**Purpose:** Permanent practical guide for prompting Burgandy effectively so work stays aligned, quantized, truthful, and low-drift.

---

## 1. Core principle

Burgandy works best when prompts are:

- objective-driven
- bounded
- dependency-aware
- explicit about what is already proven
- explicit about what is not yet proven
- strict about output format
- strict about stop conditions

The more vague the prompt, the more likely Burgandy is to:
- drift
- over-explain
- over-patch
- over-build scaffolding
- answer from implementation confidence instead of verified truth

---

## 2. The 5 things every good prompt should include

Every serious Burgandy prompt should include these:

1. **Objective**  
   What the real goal is.

2. **Known truth**  
   What is already established and should not be re-litigated.

3. **Boundary**  
   What files/systems she may touch and what she must not touch.

4. **Execution style**  
   Whether she should diagnose, verify, patch one block, recover from reset, etc.

5. **Success condition**  
   What counts as done for this step.

---

## 3. Master prompting rule

Use this mental model:

**objective → current truth → uncertainty boundary → exact task scope → exact output format**

That is the safest way to keep Burgandy aligned.

---

## 4. Default prompt template

```text
QUANTIZED EXECUTION REQUEST

1. ACTIVE OBJECTIVE
[State the real goal in one sentence.]

2. CURRENT CONTEXT / KNOWN TRUTH
[State only the most important facts already known.]

3. WHAT IS ALREADY PROVEN
[State what should NOT be re-argued.]

4. WHAT IS NOT YET PROVEN
[State the uncertainty boundary.]

5. TASK BOUNDARY
[Say exactly what she may and may not touch.]

6. EXECUTION STYLE
[Choose one:
- one atomic patch only
- analysis only, no patch yet
- verify only
- diagnose then patch one block
- recover and continue
]

7. SUCCESS CONDITION
[State exactly what counts as done.]

8. OUTPUT FORMAT
Return only:
1. overall objective
2. current executable sub-task
3. result
4. blocker
5. exact next executable sub-task
6. whether safe to continue now: yes/no
7. overall completion state

9. HARD RULES
- No drift to side tasks
- No broad retries
- No extra scaffolding unless absolutely necessary
- No “should work”
- No claiming success without read-back or observed truth
- Stop at the boundary between implementation truth and visual truth
- Think independently in alignment with the goal, not just the wording

10. START NOW
[Optional:
Proceed automatically with the next safe meaningful step.]
```

---

## 5. Short prompt template

Use this when speed matters.

```text
QUANTIZED EXECUTION REQUEST

Active objective:
[one sentence]

Known truth:
- [fact 1]
- [fact 2]
- [fact 3]

Not yet proven:
- [uncertainty]

Boundary:
- touch only [file/path/system]
- do not touch [other path/system]
- no new test files
- no redesign
- no extra features

Execution style:
[analysis only / one atomic patch / verify only]

Success condition:
[what counts as done]

Return only:
1. current executable sub-task
2. result
3. blocker
4. exact next executable sub-task
5. safe to continue now: yes/no
6. overall completion state
```

---

## 6. Prompt types you will use most

### 6.1 Diagnose only

Use when you do not want any patching yet.

```text
QUANTIZED EXECUTION REQUEST

Active objective:
Identify the single strongest bottleneck causing [problem].

Known truth:
- [facts]

Boundary:
- touch only [file/system]
- no patch yet
- no new test files
- no redesign

Execution style:
analysis only, no patch yet

Success condition:
name the bottleneck and the exact next block to patch

Return only:
1. current executable sub-task
2. result
3. blocker
4. exact next executable sub-task
5. safe to continue now: yes/no
6. overall completion state
```

### 6.2 One atomic patch

Use when you already know the target block.

```text
QUANTIZED EXECUTION REQUEST

Active objective:
Patch the single exact block causing [problem].

Known truth:
- [facts]

Boundary:
- touch only [file]
- one atomic patch only
- no extra files
- no redesign

Execution style:
patch one exact block only

Success condition:
patch applied and read-back snippet shown

Return only:
1. current executable sub-task
2. result
3. exact snippet now present
4. blocker
5. exact next executable sub-task
6. safe to continue now: yes/no
7. overall completion state
```

### 6.3 Verification only

Use when you want truth, not action.

```text
QUANTIZED EXECUTION REQUEST

Active objective:
Verify whether [feature/behavior] is actually true.

Known truth:
- [facts]

Boundary:
- no patches
- no new files
- no redesign

Execution style:
verify only

Success condition:
separate implementation truth from runtime truth / visual truth

Return only:
1. what is implementation-proven
2. what is runtime-proven
3. what is visually unverified
4. minimum next verification needed
5. whether any patch is justified now: yes/no
```

### 6.4 Recovery after reset / overflow

Use after compaction, context reset, or drift.

```text
QUANTIZED EXECUTION REQUEST

Continue from current master/state only, not from full chat history.

Active objective:
[one sentence]

Known truth:
- [facts]

Boundary:
- one dependency-ready atomic sub-task only
- no broad retries
- no extra scaffolding
- no new test files unless absolutely necessary

Execution style:
recover and continue with the next safe step

Success condition:
restate the current objective and identify the exact next executable sub-task

Return only:
1. current objective
2. current executable sub-task
3. blocker
4. exact next executable sub-task
5. safe to continue now: yes/no
```

### 6.5 Goal-lock prompt

Use when she is drifting into enhancements or side quests.

```text
Current goal lock:

The current goal is:
[one sentence]

Do not drift into:
- [side system]
- [enhancement]
- [extra polish]
- [new scaffolding]

Do only:
[exact next verification or exact next atomic step]

Return only:
1. whether the current goal is proven
2. what remains unproven
3. exact next patch only if still needed
```

---

## 7. How to state proven vs unproven

This is one of the most important disciplines.

### Good example

```text
Already proven:
- runtime hooks exist
- local visualizer path is confirmed
- thought-train recording exists

Not yet proven:
- why edges still render black
- whether the recent thought path is visually obvious by eye
```

This stops Burgandy from re-solving already solved things and stops her from claiming proof where none exists.

---

## 8. The truth ladder

Burgandy should always separate these layers:

### 8.1 Implementation truth
The code/file/state exists.

### 8.2 Runtime truth
The live system actually performs the behavior.

### 8.3 Visual truth
The user can see it by eye.

### 8.4 Completion truth
The requested deliverable exists in usable form.

Never let these collapse into one another.

**Important rule:**  
Implementation truth is not visual truth.  
Visual truth is not automatically completion truth.

---

## 9. When to stop Burgandy

You should stop her or tighten the prompt when you see:

- “should be visible”
- “likely yes”
- “patch applied” without read-back
- broad new scaffolding
- drifting to side systems
- re-diagnosing solved layers
- creating test files without necessity
- talking beyond the verification boundary

If she hits the truth boundary and cannot directly verify further, the correct behavior is:

1. state what is implementation-proven
2. state what is still unverified
3. state the exact minimum external verification needed
4. stop

---

## 10. Path discipline rules

Burgandy has shown that wrong-path assumptions can waste time.

So when paths matter, prompts should explicitly say:

```text
Correct path:
C:\Burgandy\burgandy-cognitive-framework\outputs\burgandy_network_3d.html

Do not search guessed paths.
Do not infer nonexistence from the wrong directory.
```

If there are two nearby systems, force the distinction explicitly.

Example:

```text
Antigravity is a separate project.
The current task is the Burgandy cognitive visualizer.
Do not blur them together.
```

---

## 11. Best practices for local weak-hardware operation

Prompting should respect the local setup.

### Use:
- one dependency-ready atomic sub-task at a time
- shorter prompts
- fewer pasted logs
- read-back before claims
- direct file/path references
- master file context instead of full chat replay

### Avoid:
- giant recap prompts
- many side instructions at once
- broad patch sweeps
- repeated retries from memory
- unnecessary test scaffolding

Best phrase to preserve:

**one dependency-ready atomic sub-task at a time, with rolling compilation toward the final package**

---

## 12. Best practices for live visual/system tasks

When the task involves a local browser, live network, UI, or renderer:

### Always require:
- implementation truth
- then runtime truth
- then visual truth

### Good prompt line:
```text
Do not say “should be visible.”
Do not claim success from code assumptions.
Only observed runtime truth and user-visible truth count.
```

### Good verification line:
```text
Return only:
1. what is implementation-proven
2. what is visually unverified
3. the exact minimum human verification needed
4. whether any patch is justified before that verification: yes/no
```

---

## 13. Best practices for coding/debugging prompts

### 13.1 Diagnose first when uncertain
If you are not sure of the bottleneck, ask for:
- exact snippet now present
- exact block to patch next

### 13.2 Patch only one block when the cause is known
Do not let her patch multiple areas unless one block truly cannot solve it.

### 13.3 Read-back is mandatory
Never accept “patch applied” without the exact changed snippet.

### 13.4 No new test files unless necessary
This was a repeated drift pattern.
Make it explicit:
```text
Do not create new test files unless absolutely necessary.
```

---

## 14. Example prompts for this project

### 14.1 Example — diagnose only

```text
QUANTIZED EXECUTION REQUEST

Active objective:
Identify the single strongest bottleneck causing black/unlit edges in the local 3D cognitive visualizer.

Known truth:
- Work only in C:\Burgandy\burgandy-cognitive-framework\outputs\burgandy_network_3d.html
- Antigravity is a separate project
- Edges are black and no visible live updates are happening

Not yet proven:
- Why the current render path still produces black edges

Boundary:
- touch only burgandy_network_3d.html
- no patch yet
- no test files
- no redesign
- no enhancements

Execution style:
analysis only, no patch yet

Success condition:
name the single strongest bottleneck and the exact next block to patch

Return only:
1. current executable sub-task
2. result
3. blocker
4. exact next executable sub-task
5. safe to continue now: yes/no
6. overall completion state
```

### 14.2 Example — one atomic patch

```text
QUANTIZED EXECUTION REQUEST

Active objective:
Patch the single exact block causing black/unlit edge rendering.

Known truth:
- Correct file is C:\Burgandy\burgandy-cognitive-framework\outputs\burgandy_network_3d.html
- Antigravity is not the current task
- The current observed symptom is black/unlit edges

Boundary:
- patch one exact block only
- no new files
- no redesign
- no extra features

Execution style:
patch one exact block only

Success condition:
patch applied and exact snippet shown by read-back

Return only:
1. current executable sub-task
2. result
3. exact snippet now present
4. blocker
5. exact next executable sub-task
6. safe to continue now: yes/no
7. overall completion state
```

### 14.3 Example — visual truth boundary

```text
QUANTIZED EXECUTION REQUEST

Active objective:
Determine whether the recent thought-train path is visually trustworthy by eye.

Known truth:
- implementation patches exist
- runtime thought-train recording exists

Not yet proven:
- whether the path is clearly visible in the browser

Boundary:
- no patches
- no test files
- no redesign

Execution style:
verify only

Success condition:
separate implementation truth from visual truth and stop cleanly

Return only:
1. what is implementation-proven
2. what is visually unverified
3. the exact minimum human verification needed
4. whether any patch is justified before that verification: yes/no
5. the exact next action
```

---

## 15. Bad prompt examples to avoid

Do not prompt like this:

- “fix this”
- “make it work”
- “look through everything”
- “sort out the whole system”
- “try a few things”
- “just improve it”

These are too broad and encourage drift, retries, and false completion.

---

## 16. Good one-line helpers you can add

These short lines are often useful:

- `Do not drift to side tasks.`
- `Do not re-argue proven layers.`
- `No new test files unless absolutely necessary.`
- `Patch only one exact block.`
- `Read back the exact snippet after patching.`
- `Stop at the boundary between implementation truth and visual truth.`
- `Do not say “should work.”`
- `Think independently in alignment with the goal, not just literally with the wording.`

---

## 17. How to use this guide in practice

For most work, you only need:

1. one-sentence objective
2. 3–5 known truths
3. one uncertainty
4. a boundary
5. an execution style
6. a success condition
7. a tight output format

That is enough to keep Burgandy effective without wasting tokens.

---

## 18. Final rule

Whenever prompting Burgandy, remember:

**Good prompts do not micromanage every thought. They define the goal, the truth boundary, the scope, and the success condition clearly enough that Burgandy can think independently without drifting.**
