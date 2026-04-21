# TASK QUANTIZATION RULES
Date: 2026-04-21
Status: Active rule file
Purpose: Define how Burgandy-class tasks must be reduced to one safe atomic action

---

## 1. Purpose

These rules prevent Burgandy failure through:
- Multi-step execution
- Chained actions
- Ambiguous task collapse
- incomplete-turn / zero-payload stops
- Pseudo-completion without host execution

Every task must reduce to one safe, verifiable next action.

---

## 2. Definition of Atomic

A task is atomic only if it performs exactly one of:
- Read one target
- Write one target
- Verify one result
- Execute one bounded command

If the action changes host state and also checks results — that is not atomic. Verification is always separate.

---

## 3. Allowed Atomic Task Types

### Read
- Read one file
- Inspect one config
- List one folder
- Check one file exists

### Write
- Create one file
- Overwrite one file
- Append one section to one file

### Verify
- Read back one file after write
- Check one process state
- Confirm one command result
- Confirm one git state

### Execute
- Run one script
- Run one git command
- Run one diagnostic command
- Run one PowerShell command

---

## 4. Forbidden Patterns

The following are not atomic and must be rejected or split:
- read + write
- write + verify
- commit + push
- diagnose + fix
- inspect + rewrite
- stage + commit + push
- create multiple files
- modify multiple unrelated files
- any prompt containing multiple state-changing verbs

---

## 5. Split Trigger Words

If a request contains any of the following, treat it as multi-step until proven otherwise:
- and / then / after that / also / plus / as well as
- verify and / create and / read and / write and / commit and / push and

---

## 6. Smallest Safe Step Rule

Always choose the smallest safe step that advances the task.

Bad: "Set up the whole persistence layer"
Good: "Create session-summary.md only"

Bad: "Push all relevant files to GitHub"
Good: "Run git status only"

---

## 7. Ambiguous Task Rule

If a request is ambiguous — do not execute immediately.

First reduce to:
- Concrete system interpretation
- Three possible atomic actions
- One safest selected action

If the selected action is still not explicit: no execution.

---

## 8. File Write Rule

One write task targets one file only.

Allowed:
- Overwrite one file with full content
- Append one section to one file

Not allowed:
- Update several files in one run
- Write one file and verify in the same run
- Write one file and commit it in the same run

---

## 9. Verification Rule

Verification is always separate from state change.

Correct:
- Step 1: write file
- Step 2: read file

Incorrect:
- Write file and verify file in the same task

---

## 10. Execution Rule

Task requires host action → use /bash.
Task is reasoning-only → no /bash.

This rule is absolute.

---

## 11. Command Simplicity Rule

Commands must be:
- Single-line
- Explicit
- Deterministic
- Minimal
- Windows-safe

Prefer: Set-Content, Add-Content, type, cmd /c echo
Avoid: here-strings, multiline commands, chained shell operators, embedded control logic unless strictly necessary

---

## 12. Git Quantization Rule

Git must be broken into separate atomic actions.

Allowed sequence:
1. Verify target files
2. Stage approved files
3. Verify staged status
4. Commit
5. Verify commit
6. Push
7. Verify clean status

Each step is separate.

---

## 13. Diagnostic Rule

A diagnostic task does exactly one of:
- Inspect one log source
- Inspect one file
- Extract one class of errors
- Summarize one evidence set

A diagnostic task must not inspect + diagnose + fix + rewrite in the same action.

---

## 14. Response Format — Ambiguous Tasks

```
INTERPRETATION:
- <system meaning>

ATOMIC OPTIONS:
- <option 1>
- <option 2>
- <option 3>

SELECTED ACTION:
- <single safest action>

COMMAND:
- <exact /bash command or "no execution">

RISK:
- <failure mode if executed incorrectly>
```

---

## 15. Response Format — Execution Tasks

```
TASK TYPE:
- <read / write / verify / execute>

TARGET:
- <single target>

COMMAND:
- /bash <single-line command>

NEXT STEP:
- verify separately
```

---

## 16. Fail-Stop Rule

If a request cannot be safely reduced to one atomic step:
- Do not execute
- Do not guess
- Do not chain
- Do not fabricate progress

Response:
```
STATUS:
- blocked

REASON:
- request is not safely reducible to one atomic action

SAFE NEXT STEP:
- <single smallest safe step>
```

---

## 17. Weakness This File Addresses

Verified weakness:
- Burgandy can execute explicit commands reliably
- Burgandy cannot reliably self-quantize ambiguous tasks

This file reduces that gap by externalizing the quantization responsibility to Hermes.

---

## 18. Final Rule

One safe step now is better than a larger unstable plan.

Atomic first. Always.
