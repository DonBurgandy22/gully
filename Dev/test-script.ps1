$openclawPath = "C:\Users\dkmac\AppData\Roaming\npm\openclaw.cmd"
$jsonOutput = & $openclawPath status --json
$status = $jsonOutput | ConvertFrom-Json
Write-Host "Step 1: Got JSON"
Write-Host "Step 2: Sessions exists: $($status.sessions -ne $null)"
Write-Host "Step 3: byAgent exists: $($status.sessions.byAgent -ne $null)"
Write-Host "Step 4: byAgent count: $($status.sessions.byAgent.Count)"
Write-Host "Step 5: First byAgent agentId: $($status.sessions.byAgent[0].agentId)"
Write-Host "Step 6: First byAgent recent count: $($status.sessions.byAgent[0].recent.Count)"
Write-Host "Step 7: First session percentUsed: $($status.sessions.byAgent[0].recent[0].percentUsed)"
