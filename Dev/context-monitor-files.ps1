$logFile = "C:\Dev\restart-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

try {
    $sessionPath = "C:\Users\dkmac\.openclaw\agents\main\sessions\"
    
    if (Test-Path $sessionPath) {
        # Get all session files
        $files = Get-ChildItem $sessionPath -Filter "*.jsonl"
        $totalSize = ($files | Measure-Object -Property Length -Sum).Sum
        
        # Estimate context usage (rough calculation)
        # Each token is ~4 bytes, 65k context = ~260KB max
        # But files are compressed JSON, so let's use a simpler heuristic
        
        if ($totalSize -eq 0) {
            $percentUsed = 0
        } else {
            # Simple heuristic: if total size > 100KB, we're getting full
            # 100KB ≈ 40% of context (260KB max)
            # So percent = (size / 250KB) * 100
            $percentUsed = [math]::Min(100, [math]::Round(($totalSize / 250000) * 100))
        }
        
        Add-Content $logFile "[$timestamp] File-based context check: $percentUsed% (total size: $totalSize bytes)"
        
        if ($percentUsed -ge 90) {
            Add-Content $logFile "[$timestamp] Context check: $percentUsed% - TRIGGERING RESTART"
            
            # Trigger restart
            Start-Process powershell -ArgumentList "-NonInteractive -WindowStyle Hidden -File C:\Dev\current-self-restart.ps1" -WindowStyle Hidden
        }
    } else {
        Add-Content $logFile "[$timestamp] Context monitor error: Session path not found"
    }
} catch {
    Add-Content $logFile "[$timestamp] Context monitor error: $($_.Exception.Message)"
}