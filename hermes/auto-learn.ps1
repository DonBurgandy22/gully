# Hermes Auto-Learning Hook
# Called automatically by Burgandy after significant tasks
param(
 [string]$TaskSummary = "Task completed",
 [string]$TaskType = "general",
 [string]$Result = "success"
)

$prompt = "A Burgandy task just completed. Task type: $TaskType. Summary: $TaskSummary. Result: $Result. Based on this and your memory of past tasks, identify 1-3 specific improvements Burgandy should make to her skills, routing, or memory. Write your proposals to /mnt/c/Burgandy/hermes/inbox/ as a JSON file named hms_$(Get-Date -Format 'yyyyMMdd_HHmmss').json. Keep proposals actionable and specific."

wsl -d Ubuntu bash -c ". ~/.local/bin/env && . ~/.hermes/venv/bin/activate && hermes chat -q '$prompt' 2>&1" | Out-File "C:\Burgandy\hermes\last-learning-run.txt" -Encoding utf8
Write-Host "[Hermes] Auto-learning run complete. Check C:\Burgandy\hermes\last-learning-run.txt"