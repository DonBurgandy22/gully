# HERMES INTEGRATION SPEC
Version: 1.0
Created: 2026-04-19

## What Hermes is
Hermes is a sidecar learning and optimization engine for Burgandy.
It observes completed tasks, identifies patterns, and proposes improvements.
It never acts directly. All proposals require review before application.

## Folder structure
- hermes/inbox/       -- Hermes drops proposals here
- hermes/review/      -- proposals.json and decisions.json
- hermes/applied/     -- successfully applied proposals

## Proposal schema
{
  "proposal_id": "hms_YYYYMMDD_NNNN",
  "source_task_id": "task that triggered this proposal",
  "type": "memory_update | skill_update | routing_change | workflow_improvement",
  "content": "exact proposed change",
  "target_path": "file to be modified if approved",
  "status": "pending | approved | rejected",
  "created_at": "ISO timestamp",
  "reasoning": "why this improvement is suggested",
  "risk": "low | medium | high"
}

## When Hermes runs
- After task completion
- After a postmortem or incident
- Never for routine messages
- Never during active debugging

## Approval rules
- memory_update: requires Daryl approval
- skill_update: requires Daryl approval
- routing_change: requires Daryl approval
- workflow_improvement low risk: Burgandy may auto-approve
- workflow_improvement medium/high risk: requires Daryl approval

## What Hermes must never do
- Directly edit MEMORY.md, AGENTS.md, SOUL.md, PROTOCOLS.md
- Execute shell commands
- Push to GitHub
- Modify openclaw.json
- Act without a proposal being reviewed first

## How to invoke
After any significant task send to Burgandy:
  Hermes review: [brief description of what was just completed]
