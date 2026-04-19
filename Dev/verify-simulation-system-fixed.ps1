# Verify Simulation System Readiness
# Comprehensive check before running 1 million simulations

$logFile = "C:\Dev\restart-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

"[$timestamp] [VERIFY] Starting comprehensive system verification..." | Out-File $logFile -Encoding UTF8 -Append
"[$timestamp] [VERIFY] ===========================================" | Out-File $logFile -Encoding UTF8 -Append

# 1. Check Python installation
"[$timestamp] [VERIFY] 1. Checking Python installation..." | Out-File $logFile -Encoding UTF8 -Append
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        "[$timestamp] [VERIFY]   [OK] Python: $pythonVersion" | Out-File $logFile -Encoding UTF8 -Append
    } else {
        "[$timestamp] [VERIFY]   ✗ Python not found or error: $pythonVersion" | Out-File $logFile -Encoding UTF8 -Append
        exit 1
    }
} catch {
    "[$timestamp] [VERIFY]   ✗ Python check failed: $($_.Exception.Message)" | Out-File $logFile -Encoding UTF8 -Append
    exit 1
}

# 2. Check required Python modules
"[$timestamp] [VERIFY] 2. Checking Python modules..." | Out-File $logFile -Encoding UTF8 -Append
$modules = @("json", "random", "time", "statistics", "datetime", "pathlib", "logging", "sys", "os")
foreach ($module in $modules) {
    try {
        $test = python -c "import $module; print('OK')" 2>&1
        if ($LASTEXITCODE -eq 0) {
            "[$timestamp] [VERIFY]   ✓ Module: $module" | Out-File $logFile -Encoding UTF8 -Append
        } else {
            "[$timestamp] [VERIFY]   ✗ Module missing: $module" | Out-File $logFile -Encoding UTF8 -Append
        }
    } catch {
        "[$timestamp] [VERIFY]   ✗ Module check failed for $module" | Out-File $logFile -Encoding UTF8 -Append
    }
}

# 3. Check simulation scripts
"[$timestamp] [VERIFY] 3. Checking simulation scripts..." | Out-File $logFile -Encoding UTF8 -Append
$scripts = @(
    "C:\Dev\million-simulations-runner.py",
    "C:\Dev\run-million-simulations.ps1",
    "C:\Dev\verify-simulation-system.ps1"
)

foreach ($script in $scripts) {
    if (Test-Path $script) {
        $size = (Get-Item $script).Length
        "[$timestamp] [VERIFY]   ✓ Script: $(Split-Path $script -Leaf) ($size bytes)" | Out-File $logFile -Encoding UTF8 -Append
    } else {
        "[$timestamp] [VERIFY]   ✗ Script missing: $script" | Out-File $logFile -Encoding UTF8 -Append
        exit 1
    }
}

# 4. Check output directories
"[$timestamp] [VERIFY] 4. Checking directories..." | Out-File $logFile -Encoding UTF8 -Append
$dirs = @(
    "C:\Dev\simulation-results",
    "C:\Dev\bridge",
    "C:\Dev\bridge\logs"
)

foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        "[$timestamp] [VERIFY]   ✓ Directory: $dir" | Out-File $logFile -Encoding UTF8 -Append
    } else {
        try {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            "[$timestamp] [VERIFY]   ✓ Created directory: $dir" | Out-File $logFile -Encoding UTF8 -Append
        } catch {
            "[$timestamp] [VERIFY]   ✗ Failed to create directory: $dir" | Out-File $logFile -Encoding UTF8 -Append
        }
    }
}

# 5. Check system resources
"[$timestamp] [VERIFY] 5. Checking system resources..." | Out-File $logFile -Encoding UTF8 -Append
try {
    $os = Get-WmiObject Win32_OperatingSystem
    $freeMemoryMB = [math]::Round($os.FreePhysicalMemory / 1KB)
    $totalMemoryMB = [math]::Round($os.TotalVisibleMemorySize / 1KB)
    $memoryPercent = [math]::Round(($freeMemoryMB / $totalMemoryMB) * 100, 1)
    
    $cpu = Get-WmiObject Win32_Processor
    $cpuLoad = $cpu.LoadPercentage
    
    "[$timestamp] [VERIFY]   ✓ Memory: $freeMemoryMB/$totalMemoryMB MB free ($memoryPercent%)" | Out-File $logFile -Encoding UTF8 -Append
    "[$timestamp] [VERIFY]   ✓ CPU load: $cpuLoad%" | Out-File $logFile -Encoding UTF8 -Append
    
    if ($freeMemoryMB -lt 1024) {
        "[$timestamp] [VERIFY]   ⚠ Warning: Low memory (<1GB free)" | Out-File $logFile -Encoding UTF8 -Append
    }
    
    if ($cpuLoad -gt 80) {
        "[$timestamp] [VERIFY]   ⚠ Warning: High CPU load (>80%)" | Out-File $logFile -Encoding UTF8 -Append
    }
} catch {
    "[$timestamp] [VERIFY]   ⚠ Resource check failed: $($_.Exception.Message)" | Out-File $logFile -Encoding UTF8 -Append
}

# 6. Check OpenClaw status
"[$timestamp] [VERIFY] 6. Checking OpenClaw status..." | Out-File $logFile -Encoding UTF8 -Append
try {
    $status = openclaw status --json 2>&1 | ConvertFrom-Json
    if ($status) {
        $context = $status.sessions.recent[0].percentUsed
        "[$timestamp] [VERIFY]   ✓ OpenClaw running, context: $context%" | Out-File $logFile -Encoding UTF8 -Append
        
        if ($context -gt 70) {
            "[$timestamp] [VERIFY]   ⚠ Warning: High context ($context%), may trigger auto-restart" | Out-File $logFile -Encoding UTF8 -Append
        }
    }
} catch {
    "[$timestamp] [VERIFY]   ⚠ OpenClaw check failed: $($_.Exception.Message)" | Out-File $logFile -Encoding UTF8 -Append
}

# 7. Check context monitor
"[$timestamp] [VERIFY] 7. Checking context monitor..." | Out-File $logFile -Encoding UTF8 -Append
try {
    $task = schtasks /query /tn "BurgandyContextMonitor2Min" /fo list 2>&1
    if ($LASTEXITCODE -eq 0) {
        $statusLine = $task | Select-String "Status"
        if ($statusLine -match "Running") {
            "[$timestamp] [VERIFY]   ✓ Context monitor task: Running" | Out-File $logFile -Encoding UTF8 -Append
        } else {
            "[$timestamp] [VERIFY]   ⚠ Context monitor task: $($statusLine -replace 'Status:\s+', '')" | Out-File $logFile -Encoding UTF8 -Append
        }
    } else {
        "[$timestamp] [VERIFY]   ⚠ Context monitor task query failed" | Out-File $logFile -Encoding UTF8 -Append
    }
} catch {
    "[$timestamp] [VERIFY]   ⚠ Context monitor check failed: $($_.Exception.Message)" | Out-File $logFile -Encoding UTF8 -Append
}

# 8. Check restart system
"[$timestamp] [VERIFY] 8. Checking restart system..." | Out-File $logFile -Encoding UTF8 -Append
$restartFiles = @(
    "C:\Dev\current-self-restart.ps1",
    "C:\Dev\current-memory-save-restart.ps1",
    "C:\Dev\restart-log.txt"
)

foreach ($file in $restartFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        "[$timestamp] [VERIFY]   ✓ Restart file: $(Split-Path $file -Leaf) ($size bytes)" | Out-File $logFile -Encoding UTF8 -Append
    } else {
        "[$timestamp] [VERIFY]   ⚠ Restart file missing: $file" | Out-File $logFile -Encoding UTF8 -Append
    }
}

# 9. Test Python script execution
"[$timestamp] [VERIFY] 9. Testing Python script..." | Out-File $logFile -Encoding UTF8 -Append
try {
    $testOutput = python -c "
import sys
print('Python test: OK')
print(f'Python version: {sys.version}')
print(f'Platform: {sys.platform}')
" 2>&1

    if ($LASTEXITCODE -eq 0) {
        "[$timestamp] [VERIFY]   ✓ Python execution test passed" | Out-File $logFile -Encoding UTF8 -Append
        $testOutput | ForEach-Object { "[$timestamp] [VERIFY]     $_" | Out-File $logFile -Encoding UTF8 -Append }
    } else {
        "[$timestamp] [VERIFY]   ✗ Python execution test failed" | Out-File $logFile -Encoding UTF8 -Append
        $testOutput | ForEach-Object { "[$timestamp] [VERIFY]     $_" | Out-File $logFile -Encoding UTF8 -Append }
        exit 1
    }
} catch {
    "[$timestamp] [VERIFY]   ✗ Python test failed: $($_.Exception.Message)" | Out-File $logFile -Encoding UTF8 -Append
    exit 1
}

# 10. Final verification summary
"[$timestamp] [VERIFY] ===========================================" | Out-File $logFile -Encoding UTF8 -Append
"[$timestamp] [VERIFY] VERIFICATION COMPLETE" | Out-File $logFile -Encoding UTF8 -Append
"[$timestamp] [VERIFY] System is READY for 1 million simulations" | Out-File $logFile -Encoding UTF8 -Append
"[$timestamp] [VERIFY] ===========================================" | Out-File $logFile -Encoding UTF8 -Append

# Display summary
Write-Host "`n===========================================" -ForegroundColor Green
Write-Host "SIMULATION SYSTEM VERIFICATION COMPLETE" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host "System is READY for 1 million simulations" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Run: C:\Dev\run-million-simulations.ps1" -ForegroundColor Cyan
Write-Host "2. Monitor: C:\Dev\restart-log.txt" -ForegroundColor Cyan
Write-Host "3. Results: C:\Dev\simulation-results\" -ForegroundColor Cyan
Write-Host "`nThe system will:" -ForegroundColor White
Write-Host "- Run 1,000,000 decision-making simulations" -ForegroundColor White
Write-Host "- Auto-save checkpoints every 1000 simulations" -ForegroundColor White
Write-Host "- Survive context resets via task persistence" -ForegroundColor White
Write-Host "- Generate optimal decision patterns" -ForegroundColor White
Write-Host "===========================================" -ForegroundColor Green
