# Hermes Inbox

Hermes drops proposals here for review.

## Proposal schema
Each proposal is a JSON file named: hms_YYYYMMDD_NNNN.json

Fields:
- proposal_id: unique identifier
- source_task_id: task that triggered this proposal
- type: memory_update | skill_update | routing_change | workflow_improvement
- content: exact proposed change
- target_path: file to modify if approved
- status: pending | approved | rejected
- created_at: ISO timestamp
- reasoning: why this improvement is suggested
- risk: low | medium | high

## Rules
- All proposals require review before application
- Human approval required for memory, skill, and routing proposals
- Low-risk workflow improvements may be auto-approved by Burgandy
- Hermes never directly edits core files
