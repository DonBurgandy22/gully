# Quick test to check context percentage
try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:18789/__openclaw__/status" -Method GET -TimeoutSec 5
    $contextPct = $response.context.usedPercent
    Write-Host "Context from API: $contextPct%"
    
    if ($contextPct -ge 70) {
        Write-Host "ABOVE THRESHOLD (>=70%) - Should trigger restart"
    } else {
        Write-Host "Below threshold (<70%)"
    }
}
catch {
    Write-Host "Error: $($_.Exception.Message)"
}