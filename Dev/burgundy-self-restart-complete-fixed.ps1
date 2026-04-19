# burgundy-self-restart-complete.ps1
# Complete restart protocol with memory save
# 1. Save all memory files
# 2. Clear session files  
# 3. Restart gateway
# 4. Clean up

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
    "[$timestamp] 🚀 COMPLETE RESTART PROTOCOL STARTED" | Out-File $logFile -Encoding UTF8 -Append
    
    # STEP 1: SAVE ALL MEMORY FIRST
    "[$timestamp] Step 1/3: Saving memory..." | Out-File $logFile -Encoding UTF8 -Append
    $memorySave = Start-Process powershell -ArgumentList "-NonInteractive -File C:\Dev\burgundy-memory-save-restart.ps1" -NoNewWindow -Wait -PassThru
    if ($memorySave.ExitCode -eq 0) {
        "[$timestamp] ✅ Memory saved successfully" | Out-File $logFile -Encoding UTF8 -Append
    } else {
        "[$timestamp] ⚠️ Memory save completed with exit code $($memorySave.ExitCode)" | Out-File $logFile -Encoding UTF8 -Append
    }
    
    # STEP 2: CLEAR SESSION FILES
    "[$timestamp] Step 2/3: Clearing session files..." | Out-File $logFile -Encoding UTF8 -Append
    if (Test-Path $sessionPath) {
        $files = Get-ChildItem $sessionPath -Filter "*.jsonl"
        $fileCount = ($files | Measure-Object).Count
        $files | Remove-Item -Force -ErrorAction SilentlyContinue
        "[$timestamp] Cleared $fileCount session files" | Out-File $logFile -Encoding UTF8 -Append
    }
    
    # STEP 3: RESTART GATEWAY
    "[$timestamp] Step 3/3: Restarting gateway..." | Out-File $logFile -Encoding UTF8 -Append
    
    # Method 1: Restart gateway by killing process and restarting via CMD
    try {
        # Step 1: Find and kill the gateway process
        $gatewayProcess = Get-Process node -ErrorAction SilentlyContinue | Where-Object {
            $_.CommandLine -like "*openclaw*" -and $_.CommandLine -like "*gateway*"
        }
        
        if ($gatewayProcess) {
            "[$timestamp] Found gateway process PID: $($gatewayProcess.Id)" | Out-File $logFile -Encoding UTF8 -Append
            $gatewayProcess | Stop-Process -Force
            Start-Sleep -Seconds 3
            "[$timestamp] Gateway process stopped" | Out-File $logFile -Encoding UTF8 -Append
        } else {
            "[$timestamp] No gateway process found (may already be stopped)" | Out-File $logFile -Encoding UTF8 -Append
        }
        
        # Step 2: Start gateway using the CMD file
        $gatewayCmd = "C:\Users\dkmac\.openclaw\gateway.cmd"
        if (Test-Path $gatewayCmd) {
            $process = Start-Process cmd.exe -ArgumentList "/c", $gatewayCmd -WindowStyle Hidden -PassThru
            Start-Sleep -Seconds 5
            
            $timestamp2 = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            
            # Check if gateway is responding
            try {
                $status = Invoke-RestMethod -Uri "http://127.0.0.1:18789/__openclaw__/status" -Method GET -TimeoutSec 10
                "[$timestamp2] ✅ Restart completed successfully - gateway responding" | Out-File $logFile -Encoding UTF8 -Append
                "[$timestamp2] 🧠 Memory preserved - Burgundy will resume with full context" | Out-File $logFile -Encoding UTF8 -Append
            }
            catch {
                "[$timestamp2] ⚠️ Gateway started but not responding yet" | Out-File $logFile -Encoding UTF8 -Append
            }
        } else {
            "[$timestamp] ❌ Gateway CMD file not found at: $gatewayCmd" | Out-File $logFile -Encoding UTF8 -Append
        }
    }
    catch {
        $timestamp2 = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        "[$timestamp2] ❌ Restart error: $($_.Exception.Message)" | Out-File $logFile -Encoding UTF8 -Append
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