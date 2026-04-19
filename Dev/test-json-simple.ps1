$openclawPath = "C:\Users\dkmac\AppData\Roaming\npm\openclaw.cmd"
$jsonOutput = & $openclawPath status --json
Write-Host "JSON output length: $($jsonOutput.Length)"
$status = $jsonOutput | ConvertFrom-Json
Write-Host "Sessions property exists: $($status.sessions -ne $null)"
if ($status.sessions) {
    Write-Host "byAgent property exists: $($status.sessions.byAgent -ne $null)"
    if ($status.sessions.byAgent) {
        Write-Host "byAgent type: $($status.sessions.byAgent.GetType().Name)"
        if ($status.sessions.byAgent -is [array]) {
            Write-Host "byAgent array count: $($status.sessions.byAgent.Count)"
            $mainAgent = $status.sessions.byAgent | Where-Object { $_.agentId -eq "main" }
        } else {
            Write-Host "byAgent is single object"
            $mainAgent = $status.sessions.byAgent
        }
        Write-Host "Main agent found: $($mainAgent -ne $null)"
        if ($mainAgent) {
            Write-Host "Recent property exists: $($mainAgent.recent -ne $null)"
            if ($mainAgent.recent) {
                Write-Host "Recent count: $($mainAgent.recent.Count)"
                if ($mainAgent.recent.Count -gt 0) {
                    Write-Host "First session percentUsed: $($mainAgent.recent[0].percentUsed)"
                }
            }
        }
    }
}