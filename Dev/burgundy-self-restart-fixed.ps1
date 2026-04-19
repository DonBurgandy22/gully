# burgundy-self-restart-fixed.ps1
# COMPLETE FIXED RESTART PROTOCOL
# 1. Save all memory files
# 2. Kill ALL gateway processes
# 3. Clear session files  
# 4. Restart gateway PROPERLY (no CMD pop-ups)
# 5. Update bootstrap character limit

$sessionPath = "C:\Users\dkmac\.openclaw\agents\main\sessions\"
$logFile = "C:\Dev\restart-log.txt"
$lockFile = "C:\Dev\restart-lock.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# UTF-8 encoding for proper emoji support
$utf8 = [System.Text.Encoding]::UTF8

# Check if another restart is already running
if (Test-Path $lockFile) {
    $lockTime = (Get-Item $lockFile).LastWriteTime
    $age = (Get-Date) - $lockTime
    if ($age.TotalMinutes -lt 5) {
        "[$timestamp] SKIP - Restart already in progress (lock file age: $($age.TotalSeconds) seconds)" | Out-File $logFile -Encoding UTF8 -Append
        exit 0
    } else {
        # Stale lock file - remove it
        Remove-Item $lockFile -Force
        "[$timestamp] WARN - Removed stale lock file" | Out-File $logFile -Encoding UTF8 -Append
    }
}

# Create lock file
"Restart in progress - started at $timestamp" | Out-File $lockFile -Encoding UTF8

try {
    "[$timestamp] 🚀 COMPLETE FIXED RESTART PROTOCOL STARTED" | Out-File $logFile -Encoding UTF8 -Append
    
    # STEP 1: SAVE ALL MEMORY FIRST
    "[$timestamp] Step 1/4: Saving memory..." | Out-File $logFile -Encoding UTF8 -Append
    $memorySave = Start-Process powershell -ArgumentList "-NonInteractive -File C:\Dev\burgundy-memory-save-restart.ps1" -NoNewWindow -Wait -PassThru
    if ($memorySave.ExitCode -eq 0) {
        "[$timestamp] ✅ Memory saved successfully" | Out-File $logFile -Encoding UTF8 -Append
    } else {
        "[$timestamp] ⚠️ Memory save completed with exit code $($memorySave.ExitCode)" | Out-File $logFile -Encoding UTF8 -Append
    }
    
    # STEP 2: KILL ALL GATEWAY PROCESSES (FIXED)
    "[$timestamp] Step 2/4: Killing ALL gateway processes..." | Out-File $logFile -Encoding UTF8 -Append
    
    # Method 1: Use WMIC to find ALL gateway processes by command line
    $gatewayProcesses = @()
    
    # Get all node processes with openclaw in command line
    $wmicOutput = wmic process where "name='node.exe'" get ProcessId,CommandLine 2>$null
    foreach ($line in $wmicOutput) {
        if ($line -match "openclaw.*gateway" -and $line -match "ProcessId\s+=\s+(\d+)") {
            $pid = $matches[1]
            $gatewayProcesses += $pid
            "[$timestamp] Found gateway process PID: $pid" | Out-File $logFile -Encoding UTF8 -Append
        }
    }
    
    # Also check with Get-Process for any we missed
    $nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
    foreach ($proc in $nodeProcesses) {
        try {
            $cmdLine = $proc.CommandLine
            if ($cmdLine -like "*openclaw*" -and $cmdLine -like "*gateway*") {
                if ($proc.Id -notin $gatewayProcesses) {
                    $gatewayProcesses += $proc.Id
                    "[$timestamp] Found gateway process PID (Get-Process): $($proc.Id)" | Out-File $logFile -Encoding UTF8 -Append
                }
            }
        } catch {
            # Some processes may not allow CommandLine access
        }
    }
    
    # Kill ALL found processes
    $killedCount = 0
    foreach ($pid in $gatewayProcesses) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction Stop
            "[$timestamp] Killed gateway process PID: $pid" | Out-File $logFile -Encoding UTF8 -Append
            $killedCount++
        } catch {
            "[$timestamp] Failed to kill PID $pid: $($_.Exception.Message)" | Out-File $logFile -Encoding UTF8 -Append
        }
    }
    
    if ($killedCount -gt 0) {
        "[$timestamp] ✅ Killed $killedCount gateway process(es)" | Out-File $logFile -Encoding UTF8 -Append
    } else {
        "[$timestamp] ℹ️ No gateway processes found to kill" | Out-File $logFile -Encoding UTF8 -Append
    }
    
    # Wait for processes to fully terminate
    Start-Sleep -Seconds 5
    
    # STEP 3: CLEAR SESSION FILES
    "[$timestamp] Step 3/4: Clearing session files..." | Out-File $logFile -Encoding UTF8 -Append
    if (Test-Path $sessionPath) {
        $files = Get-ChildItem $sessionPath -Filter "*.jsonl"
        $fileCount = ($files | Measure-Object).Count
        $files | Remove-Item -Force -ErrorAction SilentlyContinue
        "[$timestamp] Cleared $fileCount session files" | Out-File $logFile -Encoding UTF8 -Append
    }
    
    # STEP 4: RESTART GATEWAY PROPERLY (NO CMD POP-UPS)
    "[$timestamp] Step 4/4: Restarting gateway (no pop-ups)..." | Out-File $logFile -Encoding UTF8 -Append
    
    # Method: Start gateway directly with node.exe (no cmd.exe wrapper)
    $nodePath = "C:\Program Files\nodejs\node.exe"
    $openclawPath = "C:\Users\dkmac\AppData\Roaming\npm\node_modules\openclaw\dist\index.js"
    
    if (Test-Path $nodePath) {
        # Start gateway in background with hidden window
        $processInfo = New-Object System.Diagnostics.ProcessStartInfo
        $processInfo.FileName = $nodePath
        $processInfo.Arguments = "`"$openclawPath`" gateway --port 18789"
        $processInfo.WorkingDirectory = "C:\Users\dkmac\.openclaw"
        $processInfo.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
        $processInfo.CreateNoWindow = $true
        $processInfo.UseShellExecute = $false
        $processInfo.RedirectStandardOutput = $true
        $processInfo.RedirectStandardError = $true
        
        $process = New-Object System.Diagnostics.Process
        $process.StartInfo = $processInfo
        $process.Start() | Out-Null
        
        "[$timestamp] Started gateway with PID: $($process.Id)" | Out-File $logFile -Encoding UTF8 -Append
        
        # Wait for gateway to start
        Start-Sleep -Seconds 10
        
        $timestamp2 = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        
        # Check if gateway is responding
        try {
            $status = Invoke-RestMethod -Uri "http://127.0.0.1:18789/__openclaw__/status" -Method GET -TimeoutSec 15
            "[$timestamp2] ✅ Restart completed successfully - gateway responding" | Out-File $logFile -Encoding UTF8 -Append
            "[$timestamp2] 🧠 Memory preserved - Burgundy will resume with full context" | Out-File $logFile -Encoding UTF8 -Append
            
            # UPDATE BOOTSTRAP CHARACTER LIMIT TO 150,000
            "[$timestamp2] Updating bootstrap character limit to 150,000..." | Out-File $logFile -Encoding UTF8 -Append
            try {
                $configPath = "C:\Users\dkmac\.openclaw\openclaw.json"
                $config = Get-Content $configPath -Raw | ConvertFrom-Json
                
                # Ensure agents.defaults exists
                if (-not $config.agents) { $config | Add-Member -NotePropertyName agents -NotePropertyValue @{} }
                if (-not $config.agents.defaults) { $config.agents | Add-Member -NotePropertyName defaults -NotePropertyValue @{} }
                
                # Update bootstrapMaxChars
                $config.agents.defaults.bootstrapMaxChars = 150000
                
                # Save config
                $config | ConvertTo-Json -Depth 10 | Set-Content $configPath -Encoding UTF8
                "[$timestamp2] ✅ Bootstrap character limit updated to 150,000" | Out-File $logFile -Encoding UTF8 -Append
            } catch {
                "[$timestamp2] ⚠️ Failed to update bootstrap limit: $($_.Exception.Message)" | Out-File $logFile -Encoding UTF8 -Append
            }
            
        } catch {
            "[$timestamp2] ⚠️ Gateway started but not responding yet: $($_.Exception.Message)" | Out-File $logFile -Encoding UTF8 -Append
        }
    } else {
        "[$timestamp] ❌ Node.js not found at: $nodePath" | Out-File $logFile -Encoding UTF8 -Append
    }
}
catch {
    $errorMsg = $_.Exception.Message
    $timestamp3 = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "[$timestamp3] ❌ Restart error: $errorMsg" | Out-File $logFile -Encoding UTF8 -Append
}
finally {
    # Always remove lock file
    if (Test-Path $lockFile) {
        Remove-Item $lockFile -Force
    }
}