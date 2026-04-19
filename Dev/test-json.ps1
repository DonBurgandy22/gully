$openclawPath = "C:\Users\dkmac\AppData\Roaming\npm\openclaw.cmd"
$jsonOutput = & $openclawPath status --json
$status = $jsonOutput | ConvertFrom-Json
Write-Host "Sessions property exists: $($status.sessions -ne $null)"
Write-Host "byAgent property exists: $($status.sessions.byAgent -ne $null)"
Write-Host "byAgent count: $($status.sessions.byAgent.Count)"
if ($status.sessions.byAgent) {
    $mainAgent = $status.sessions.byAgent | Where-Object { $_.agentId -eq "main" }
    Write-Host "Found main agent: $($mainAgent -ne $null)"
    if ($mainAgent) {
        Write-Host "Main agent recent count: $($mainAgent.recent.Count)"
        if ($mainAgent.recent.Count -gt 0) {
            Write-Host "First session percentUsed: $($mainAgent.recent[0].percentUsed)"
        }
    }
}
