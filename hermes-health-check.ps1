$memory = Get-Content "C:\Burgandy\memory-updates.json" | ConvertFrom-Json
Write-Output "HERMES HEALTH CHECK"
Write-Output "total_events: $($memory.total_events)"
Write-Output "log_scan_events: $($memory.log_scan_events)"
Write-Output "timeout_total: $($memory.timeout_total)"
Write-Output "failover_total: $($memory.failover_total)"