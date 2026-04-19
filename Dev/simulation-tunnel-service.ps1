# Simulation Tunnel Service - Runs in background
$logFile = "C:\Dev\simulation-tunnel.log"
$tunnelUrl = "https://burgandy-sim-enhanced.loca.lt"

function Log-Message {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $Message" | Out-File $logFile -Encoding UTF8 -Append
    Write-Host "$timestamp - $Message"
}

# Clear old log
"" | Out-File $logFile -Encoding UTF8

Log-Message "Starting Simulation Tunnel Service..."

# Ensure Python server is running
$portCheck = netstat -ano | findstr :8006
if (-not $portCheck) {
    Log-Message "Starting Python server on port 8006..."
    Start-Process python -ArgumentList "C:\Dev\simulation-server.py" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    Log-Message "Python server started"
} else {
    Log-Message "Python server already running on port 8006"
}

Log-Message "Local URL: http://localhost:8006"

# Start localtunnel in background
Log-Message "Starting localtunnel..."
$tunnelJob = Start-Job -ScriptBlock {
    npx localtunnel --port 8006 --subdomain burgandy-sim-enhanced 2>&1
}

Log-Message "Tunnel job started (ID: $($tunnelJob.Id))"
Log-Message "Tunnel URL: $tunnelUrl"

# Monitor tunnel
while ($true) {
    $tunnelState = $tunnelJob.State
    $tunnelOutput = Receive-Job $tunnelJob -ErrorAction SilentlyContinue
    
    if ($tunnelOutput) {
        foreach ($line in $tunnelOutput) {
            if ($line -match "your url is:") {
                $newUrl = $line -replace ".*your url is:\s*", ""
                if ($newUrl -ne $tunnelUrl) {
                    $tunnelUrl = $newUrl
                    Log-Message "Tunnel URL updated: $tunnelUrl"
                }
            }
        }
    }
    
    if ($tunnelState -eq "Failed" -or $tunnelState -eq "Completed") {
        Log-Message "Tunnel job $tunnelState, restarting..."
        $tunnelJob | Remove-Job -Force
        $tunnelJob = Start-Job -ScriptBlock {
            npx localtunnel --port 8006 --subdomain burgandy-sim-enhanced 2>&1
        }
        Log-Message "Tunnel restarted (new ID: $($tunnelJob.Id))"
    }
    
    # Check local server
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8006" -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            # Server is responding
        }
    } catch {
        Log-Message "Local server not responding, restarting..."
        Get-Process python -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*simulation*"} | Stop-Process -Force
        Start-Process python -ArgumentList "C:\Dev\simulation-server.py" -WindowStyle Hidden
        Start-Sleep -Seconds 3
        Log-Message "Python server restarted"
    }
    
    Start-Sleep -Seconds 30
}