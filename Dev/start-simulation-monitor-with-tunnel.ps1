# Start simulation monitor with localtunnel
Write-Host "Starting Burgundy Simulation Monitor with Tunnel..." -ForegroundColor Green
Write-Host ""

# Check if Python server is already running
$portCheck = netstat -ano | findstr :8006
if ($portCheck) {
    Write-Host "Python server is already running on port 8006" -ForegroundColor Yellow
} else {
    Write-Host "Starting Python server on port 8006..." -ForegroundColor Cyan
    Start-Process python -ArgumentList "C:\Dev\simulation-server.py" -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

# Check local access
Write-Host "Local URL: http://localhost:8006" -ForegroundColor Green
Write-Host ""

# Start localtunnel
Write-Host "Starting localtunnel (this may take a moment)..." -ForegroundColor Cyan
$tunnelProcess = Start-Process npx -ArgumentList "localtunnel --port 8006 --subdomain burgandy-sim-enhanced" -WindowStyle Hidden -PassThru

Write-Host "Waiting for tunnel to establish..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Get tunnel URL (localtunnel outputs to stderr)
Write-Host ""
Write-Host "Tunnel should be available at: https://burgandy-sim-enhanced.loca.lt" -ForegroundColor Green
Write-Host ""
Write-Host "Press Enter to stop the tunnel and server..." -ForegroundColor Gray
Read-Host

# Cleanup
Write-Host "Stopping tunnel and server..." -ForegroundColor Red
Stop-Process -Id $tunnelProcess.Id -Force -ErrorAction SilentlyContinue

# Find and stop Python server
$pythonProcess = Get-Process python -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*simulation*"}
if ($pythonProcess) {
    Stop-Process -Id $pythonProcess.Id -Force
}

Write-Host "Simulation monitor stopped." -ForegroundColor Green