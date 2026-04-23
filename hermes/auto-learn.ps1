param(
    [string]$TaskSummary = "Task completed",
    [string]$TaskType = "general",
    [string]$Result = "success"
)
$prompt = "Burgandy task completed. Type: $TaskType. Summary: $TaskSummary. Result: $Result. Suggest 1-2 specific improvements to skills, routing, or memory. Be brief and actionable."
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outfile = "C:\Burgandy\hermes\inbox\hms_$timestamp.json"
$body = @{model="qwen3.5:4b"; messages=@(@{role="user"; content=$prompt}); stream=$false; think=$false; options=@{num_predict=300}} | ConvertTo-Json -Depth 5
$response = Invoke-RestMethod -Uri "http://127.0.0.1:11434/api/chat" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 60
$proposal = @{timestamp=$timestamp; task_type=$TaskType; summary=$TaskSummary; result=$Result; proposals=$response.message.content} | ConvertTo-Json -Depth 3
Set-Content -Path $outfile -Value $proposal -Encoding UTF8
Add-Content "C:\Burgandy\hermes\scheduled-runs.log" "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - $TaskType - $Result - OK"
Write-Host "[Hermes] Learning run complete: $outfile"