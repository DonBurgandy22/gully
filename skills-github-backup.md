# SKILL: GitHub Backup to DonBurgandy22/gully

## Trigger phrases
Any of: "back up to github", "github backup", "commit to github", "push to github", "daily backup", "checkpoint to github"

## BRANCH RULE
- ALWAYS use branch: main
- NEVER use branch: master
- If on master, run: git branch -m master main before anything else

## Every time this skill runs, execute these steps in order:

### Step 1 - Rename branch if needed
exec: git -C C:\Burgandy branch -m master main 2>NUL

### Step 2 - Stage all changes
exec: git -C C:\Burgandy add -A

### Step 3 - Unstage protected paths
exec: git -C C:\Burgandy reset HEAD -- ".openclaw/" "Dev/Antigravity/Website Templates/" "credentials/" "*.pem" "*.key" ".env"

### Step 4 - Commit with date
exec: git -C C:\Burgandy commit -m "Checkpoint 2026-04-19 14:04"

### Step 5 - Push to main
exec: git -C C:\Burgandy push origin main

### Step 6 - Confirm
exec: git -C C:\Burgandy log --oneline -3

## Rules
- Always run all 6 steps in order
- Never push: .openclaw/ credentials secrets .env node_modules Dev/Antigravity/Website Templates/
- Always show final log as confirmation
- Remote is always: https://github.com/DonBurgandy22/gully.git
- Branch is always: main
