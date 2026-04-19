# verify-restart-system.ps1
# Verifies the complete restart recovery protocol is correctly installed

Write-Host "=== RESTART RECOVERY PROTOCOL VERIFICATION ===" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""

# 1. Check scheduled tasks
Write-Host "1. SCHEDULED TASKS:" -ForegroundColor Yellow
$tasks = @("BurgundyContextMonitor2Min", "BurgundyMemorySave10Min")

foreach ($task in $tasks) {
    Write-Host "`n  Checking: $task" -ForegroundColor White
    $taskInfo = schtasks /query /tn $task /fo list 2>$null
    
    if ($taskInfo) {
        Write-Host "  Status: EXISTS" -ForegroundColor Green
        
        # Extract key info
        $status = $taskInfo | Select-String "Status"
        $nextRun = $taskInfo | Select-String "Next Run Time"
        $arguments = schtasks /query /tn $task /xml 2>$null | Select-String "Arguments"
        
        Write-Host "  $status"
        Write-Host "  $nextRun"
        
        if ($arguments) {
            $argLine = $arguments.ToString()
            Write-Host "  Script: $argLine" -ForegroundColor Gray
        }
    } else {
        Write-Host "  Status: MISSING" -ForegroundColor Red
    }
}

# 2. Check script files
Write-Host "`n2. SCRIPT FILES:" -ForegroundColor Yellow
$scripts = @(
    @{Name="Context Monitor"; Path="C:\Dev\fixed-context-monitor-fullpath.ps1"},
    @{Name="Memory Save (Restart)"; Path="C:\Dev\current-memory-save-restart.ps1"},
    @{Name="Self Restart"; Path="C:\Dev\current-self-restart.ps1"},
    @{Name="Memory Save (10-min)"; Path="C:\Dev\burgundy-memory-save-every-10min.ps1"}
)

foreach ($script in $scripts) {
    Write-Host "`n  Checking: $($script.Name)" -ForegroundColor White
    if (Test-Path $script.Path) {
        $size = (Get-Item $script.Path).Length
        $modified = (Get-Item $script.Path).LastWriteTime
        Write-Host "  Status: EXISTS ($size bytes)" -ForegroundColor Green
        Write-Host "  Modified: $modified" -ForegroundColor Gray
    } else {
        Write-Host "  Status: MISSING" -ForegroundColor Red
    }
}

# 3. Check log files
Write-Host "`n3. LOG FILES (recent activity):" -ForegroundColor Yellow
$logs = @(
    @{Name="Restart Log"; Path="C:\Dev\restart-log.txt"},
    @{Name="Save Log"; Path="C:\Dev\save-log.txt"}
)

foreach ($log in $logs) {
    Write-Host "`n  Checking: $($log.Name)" -ForegroundColor White
    if (Test-Path $log.Path) {
        $size = (Get-Item $log.Path).Length
        $modified = (Get-Item $log.Path).LastWriteTime
        Write-Host "  Status: EXISTS ($size bytes)" -ForegroundColor Green
        Write-Host "  Modified: $modified" -ForegroundColor Gray
        
        # Show last 3 lines
        try {
            $lastLines = Get-Content $log.Path -Tail 3
            Write-Host "  Last 3 entries:" -ForegroundColor Gray
            foreach ($line in $lastLines) {
                Write-Host "    $line" -ForegroundColor DarkGray
            }
        } catch {
            Write-Host "  Could not read log" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  Status: MISSING" -ForegroundColor Yellow
    }
}

# 4. Check memory files
Write-Host "`n4. MEMORY FILES:" -ForegroundColor Yellow
$today = Get-Date -Format "yyyy-MM-dd"
$memoryFiles = @(
    @{Name="Today's Memory"; Path="C:\Users\dkmac\.openclaw\workspace\memory\$today.md"},
    @{Name="Session Summary"; Path="C:\Users\dkmac\.openclaw\workspace\session-summary.md"},
    @{Name="AGENTS.md"; Path="C:\Users\dkmac\.openclaw\workspace\AGENTS.md"}
)

foreach ($file in $memoryFiles) {
    Write-Host "`n  Checking: $($file.Name)" -ForegroundColor White
    if (Test-Path $file.Path) {
        $size = (Get-Item $file.Path).Length
        $modified = (Get-Item $file.Path).LastWriteTime
        Write-Host "  Status: EXISTS ($size bytes)" -ForegroundColor Green
        Write-Host "  Modified: $modified" -ForegroundColor Gray
    } else {
        Write-Host "  Status: MISSING" -ForegroundColor Yellow
    }
}

# 5. Check current context
Write-Host "`n5. CURRENT SYSTEM STATUS:" -ForegroundColor Yellow
try {
    $status = openclaw status --json 2>$null | ConvertFrom-Json
    if ($status -and $status.sessions -and $status.sessions.recent -and $status.sessions.recent.Count -gt 0) {
        $session = $status.sessions.recent[0]
        $contextPct = if ($session.percentUsed) { $session.percentUsed } else { "N/A" }
        Write-Host "  Context usage: $contextPct%" -ForegroundColor White
        
        if ($contextPct -ge 70) {
            Write-Host "  WARNING: Context at or above 70% threshold!" -ForegroundColor Red
            Write-Host "  Auto-restart should trigger soon..." -ForegroundColor Yellow
        } elseif ($contextPct -ge 50) {
            Write-Host "  INFO: Context above 50% - monitoring active" -ForegroundColor Yellow
        } else {
            Write-Host "  OK: Context below 50%" -ForegroundColor Green
        }
    } else {
        Write-Host "  Could not get session status" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  Error checking context: $_" -ForegroundColor Red
}

# 6. Protocol summary
Write-Host "`n6. RESTART PROTOCOL SUMMARY:" -ForegroundColor Cyan
Write-Host "  Manual restarts:" -ForegroundColor White
Write-Host "    - When you ask me to restart → 'I'm back online' notification" -ForegroundColor Gray
Write-Host "  Auto-restarts:" -ForegroundColor White
Write-Host "    - Context monitor triggers at ≥70% → NO notification (seamless)" -ForegroundColor Gray
Write-Host "  Memory preservation:" -ForegroundColor White
Write-Host "    - All memory saved before restart" -ForegroundColor Gray
Write-Host "    - Session files cleared to refresh context" -ForegroundColor Gray
Write-Host "    - Gateway restarted silently" -ForegroundColor Gray

Write-Host "`n=== VERIFICATION COMPLETE ===" -ForegroundColor Cyan
Write-Host "If any issues are shown above, run final-task-update.ps1 as Administrator" -ForegroundColor Yellow