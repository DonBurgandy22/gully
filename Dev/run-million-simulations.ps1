# Run Million Simulations Script
# Integrated with Bridge Worker system
# Runs 1,000,000 decision-making simulations

$logFile = "C:\Dev\restart-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Log start
"[$timestamp] [MILLION-SIMULATIONS] Starting 1,000,000 simulation run..." | Out-File $logFile -Encoding UTF8 -Append

# Check if Python is available
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Python not found or not in PATH"
    }
    "[$timestamp] [MILLION-SIMULATIONS] Python found: $pythonVersion" | Out-File $logFile -Encoding UTF8 -Append
}
catch {
    "[$timestamp] [MILLION-SIMULATIONS] ERROR: Python not available: $($_.Exception.Message)" | Out-File $logFile -Encoding UTF8 -Append
    exit 1
}

# Create simulation results directory
$simulationDir = "C:\Dev\simulation-results"
if (-not (Test-Path $simulationDir)) {
    New-Item -ItemType Directory -Path $simulationDir -Force | Out-Null
    "[$timestamp] [MILLION-SIMULATIONS] Created directory: $simulationDir" | Out-File $logFile -Encoding UTF8 -Append
}

# Check system resources
$memory = Get-WmiObject Win32_OperatingSystem | Select-Object @{Name="FreeMemoryMB";Expression={[math]::Round($_.FreePhysicalMemory/1KB)}}
$cpu = Get-WmiObject Win32_Processor | Select-Object LoadPercentage
"[$timestamp] [MILLION-SIMULATIONS] System check - Free memory: $($memory.FreeMemoryMB)MB, CPU load: $($cpu.LoadPercentage)%" | Out-File $logFile -Encoding UTF8 -Append

# Run the simulation engine
try {
    "[$timestamp] [MILLION-SIMULATIONS] Starting simulation engine..." | Out-File $logFile -Encoding UTF8 -Append
    
    # Run Python script
    $pythonScript = "C:\Dev\million-simulations-runner.py"
    if (Test-Path $pythonScript) {
        # Start simulation in background
        $process = Start-Process python -ArgumentList $pythonScript -NoNewWindow -PassThru -RedirectStandardOutput "$simulationDir\python-output.log" -RedirectStandardError "$simulationDir\python-error.log"
        
        "[$timestamp] [MILLION-SIMULATIONS] Simulation process started (PID: $($process.Id))" | Out-File $logFile -Encoding UTF8 -Append
        "[$timestamp] [MILLION-SIMULATIONS] Output logs: $simulationDir\python-output.log" | Out-File $logFile -Encoding UTF8 -Append
        "[$timestamp] [MILLION-SIMULATIONS] Error logs: $simulationDir\python-error.log" | Out-File $logFile -Encoding UTF8 -Append
        
        # Monitor process
        Start-Sleep -Seconds 5
        if (-not $process.HasExited) {
            "[$timestamp] [MILLION-SIMULATIONS] Simulation engine running successfully" | Out-File $logFile -Encoding UTF8 -Append
            
            # Check initial output
            if (Test-Path "$simulationDir\python-output.log") {
                $firstLines = Get-Content "$simulationDir\python-output.log" -First 10
                "[$timestamp] [MILLION-SIMULATIONS] Initial output:" | Out-File $logFile -Encoding UTF8 -Append
                $firstLines | ForEach-Object { "[$timestamp] [MILLION-SIMULATIONS]   $_" | Out-File $logFile -Encoding UTF8 -Append }
            }
        }
        else {
            $exitCode = $process.ExitCode
            "[$timestamp] [MILLION-SIMULATIONS] WARNING: Process exited immediately with code $exitCode" | Out-File $logFile -Encoding UTF8 -Append
            
            # Check error log
            if (Test-Path "$simulationDir\python-error.log") {
                $errors = Get-Content "$simulationDir\python-error.log"
                "[$timestamp] [MILLION-SIMULATIONS] Error details:" | Out-File $logFile -Encoding UTF8 -Append
                $errors | ForEach-Object { "[$timestamp] [MILLION-SIMULATIONS]   $_" | Out-File $logFile -Encoding UTF8 -Append }
            }
        }
    }
    else {
        "[$timestamp] [MILLION-SIMULATIONS] ERROR: Python script not found: $pythonScript" | Out-File $logFile -Encoding UTF8 -Append
        exit 1
    }
}
catch {
    "[$timestamp] [MILLION-SIMULATIONS] ERROR: Failed to start simulations: $($_.Exception.Message)" | Out-File $logFile -Encoding UTF8 -Append
    exit 1
}

# Create monitoring task
$monitorScript = @'
# Monitor simulation progress
$logFile = "C:\Dev\restart-log.txt"
$checkpointFile = "C:\Dev\simulation-results\checkpoint.json"
$resultsFile = "C:\Dev\simulation-results\million-simulations-results.json"

while ($true) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    if (Test-Path $checkpointFile) {
        try {
            $checkpoint = Get-Content $checkpointFile | ConvertFrom-Json
            $completed = $checkpoint.completed
            $totalNetWorth = $checkpoint.total_net_worth
            $avgNetWorth = $totalNetWorth / [math]::Max(1, $completed)
            
            "[$timestamp] [SIM-MONITOR] Progress: $completed/1000000 ($([math]::Round($completed/10000, 1))%)" | Out-File $logFile -Encoding UTF8 -Append
            "[$timestamp] [SIM-MONITOR] Avg net worth: R$($avgNetWorth.ToString('N2'))" | Out-File $logFile -Encoding UTF8 -Append
            
            if ($completed -ge 1000000) {
                "[$timestamp] [SIM-MONITOR] COMPLETE: 1,000,000 simulations finished!" | Out-File $logFile -Encoding UTF8 -Append
                break
            }
        }
        catch {
            "[$timestamp] [SIM-MONITOR] Error reading checkpoint: $_" | Out-File $logFile -Encoding UTF8 -Append
        }
    }
    else {
        "[$timestamp] [SIM-MONITOR] Waiting for checkpoint file..." | Out-File $logFile -Encoding UTF8 -Append
    }
    
    Start-Sleep -Seconds 60  # Check every minute
}
'@

$monitorScriptPath = "C:\Dev\simulation-monitor.ps1"
$monitorScript | Out-File $monitorScriptPath -Encoding UTF8

# Start monitor in background
Start-Process powershell -ArgumentList "-NonInteractive -WindowStyle Hidden -File `"$monitorScriptPath`"" -WindowStyle Hidden

"[$timestamp] [MILLION-SIMULATIONS] Monitor started: $monitorScriptPath" | Out-File $logFile -Encoding UTF8 -Append
"[$timestamp] [MILLION-SIMULATIONS] Simulation system initialized successfully" | Out-File $logFile -Encoding UTF8 -Append
"[$timestamp] [MILLION-SIMULATIONS] 1,000,000 simulations are now running..." | Out-File $logFile -Encoding UTF8 -Append