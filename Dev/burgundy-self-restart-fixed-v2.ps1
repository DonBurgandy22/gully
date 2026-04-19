# burgundy-self-restart-fixed-v2.ps1
# COMPLETE FIXED RESTART PROTOCOL
# 1. Save all memory files
# 2. Kill ALL gateway processes
# 3. Clear session files  
# 4. Restart gateway PROPERLY (no CMD pop-ups)

$sessionPath = "C:\Users\dkmac\.openclaw\agents\main\sessions\"
$logFile = "C:\Dev\restart-log.txt"
$lockFile = "C:\Dev\restart-lock.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

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
    "[$timestamp] COMPLETE FIXED RESTART PROTOCOL STARTED" | Out-File $logFile -Encoding UTF8 -Append
    
    # STEP 1: SAVE ALL MEMORY FIRST
    "[$timestamp] Step 1/4: Saving memory..." | Out-File $logFile -Encoding UTF8 -Append
    $memorySave = Start-Process powershell -ArgumentList "-NonInteractive -File C:\Dev\burgundy-memory-save-restart.ps1" -NoNewWindow -Wait -PassThru
    if ($memorySave.ExitCode -eq 0) {
        "[$timestamp] Memory saved successfully" | Out-File $logFile -Encoding UTF8 -Append
    } else {
        "[$timestamp] Memory save completed with exit code $($memorySave.ExitCode)" | Out-File $logFile -Encoding UTF8 -Append
    }
    
    # STEP 2: KILL ALL GATEWAY PROCESSES (FIXED)
    "[$timestamp] Step 2/4: Killing ALL gateway processes..." | Out-File $logFile -Encoding UTF8 -Append
    
    # Get all node processes with openclaw in command line using WMIC
    $gatewayProcesses = @()
    $wmicOutput = wmic process where "name='node.exe'" get ProcessId,CommandLine 2>$null
    
    foreach ($line in $wmicOutput) {
        if ($line -match "openclaw.*gateway" -and $line -match "ProcessId\s+=\s+(\d+)") {
            $pid = $matches[1]
            $gatewayProcesses += $pid
            "[$timestamp] Found gateway process PID: $pid" | Out-File $logFile -Encoding UTF8 -Append
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
            $errorMsg = $_.Exception.Message
            "[$timestamp] Failed to kill PID $pid : $errorMsg" | Out-File $logFile -Encoding UTF8 -Append
        }
    }
    
    if ($killedCount -gt 0) {
        "[$timestamp] Killed $killedCount gateway process(es)" | Out-File $logFile -Encoding UTF8 -Append
    } else {
        "[$timestamp] No gateway processes found to kill" | Out-File $logFile -Encoding UTF8 -Append
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
        # Start gateway in background
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = $nodePath
        $psi.Arguments = "`"$openclawPath`" gateway --port 18789"
        $psi.WorkingDirectory = "C:\Users\dkmac\.openclaw"
        $psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
        $psi.CreateNoWindow = $true
        $psi.UseShellExecute = $false
        
        $process = New-Object System.Diagnostics.Process
        $process.StartInfo = $psi
        $process.Start() | Out-Null
        
        "[$timestamp] Started gateway with PID: $($process.Id)" | Out-File $logFile -Encoding UTF8 -Append
        
        # Wait for gateway to start
        Start-Sleep -Seconds 10
        
        $timestamp2 = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        
        # Check if gateway is responding
        try {
            $status = Invoke-RestMethod -Uri "http://127.0.0.1:18789/__openclaw__/status" -Method GET -TimeoutSec 15
            "[$timestamp2] Restart completed successfully - gateway responding" | Out-File $logFile -Encoding UTF8 -Append
            "[$timestamp2] Memory preserved - Burgundy will resume with full context" | Out-File $logFile -Encoding UTF8 -Append
        } catch {
            $errorMsg = $_.Exception.Message
            "[$timestamp2] Gateway started but not responding yet: $errorMsg" | Out-File $logFile -Encoding UTF8 -Append
        }
    } else {
        "[$timestamp] Node.js not found at: $nodePath" | Out-File $logFile -Encoding UTF8 -Append
    }
}
catch {
    $errorMsg = $_.Exception.Message
    $timestamp3 = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "[$timestamp3] Restart error: $errorMsg" | Out-File $logFile -Encoding UTF8 -Append
}
finally {
    # Always remove lock file
    if (Test-Path $lockFile) {
        Remove-Item $lockFile -Force
    }
}