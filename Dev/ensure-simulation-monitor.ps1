# Ensure Simulation Monitor is Running
Write-Host "=== Burgundy Simulation Monitor ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check and start Python server
Write-Host "1. Checking Python server..." -ForegroundColor Yellow
$portCheck = netstat -ano | findstr :8006
if (-not $portCheck) {
    Write-Host "   Starting Python server on port 8006..." -ForegroundColor Green
    Start-Process python -ArgumentList "C:\Dev\simulation-server.py" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    Write-Host "   ✓ Python server started" -ForegroundColor Green
} else {
    Write-Host "   ✓ Python server already running on port 8006" -ForegroundColor Green
}

# 2. Test local access
Write-Host "`n2. Testing local access..." -ForegroundColor Yellow
try {
    $response = curl.exe -I http://localhost:8006 --connect-timeout 5 2>&1
    if ($response -match "200 OK") {
        Write-Host "   ✓ Local server responding: http://localhost:8006" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Local server not responding properly" -ForegroundColor Red
        Write-Host "   Response: $response" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ✗ Cannot connect to local server" -ForegroundColor Red
}

# 3. Check/start tunnel
Write-Host "`n3. Checking tunnel..." -ForegroundColor Yellow
$tunnelProcess = Get-Process node -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like "*localtunnel*"}
if ($tunnelProcess) {
    Write-Host "   ✓ Tunnel already running (PID: $($tunnelProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "   Starting tunnel..." -ForegroundColor Green
    Start-Process npx -ArgumentList "localtunnel --port 8006 --subdomain burgandy-sim" -WindowStyle Hidden
    Start-Sleep -Seconds 5
    Write-Host "   ✓ Tunnel started" -ForegroundColor Green
}

# 4. Test tunnel
Write-Host "`n4. Testing tunnel access..." -ForegroundColor Yellow
Write-Host "   This may take a moment for tunnel to establish..." -ForegroundColor Gray
Start-Sleep -Seconds 10

try {
    $tunnelResponse = curl.exe -I https://burgandy-sim.loca.lt --connect-timeout 10 2>&1
    if ($tunnelResponse -match "200 OK") {
        Write-Host "   ✓ Tunnel working: https://burgandy-sim.loca.lt" -ForegroundColor Green
    } elseif ($tunnelResponse -match "503") {
        Write-Host "   ⚠ Tunnel 503 - May need more time to establish" -ForegroundColor Yellow
        Write-Host "   Try again in 30 seconds" -ForegroundColor Gray
    } else {
        Write-Host "   ✗ Tunnel issue: $($tunnelResponse | Select-String -Pattern 'HTTP.*')" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Cannot test tunnel" -ForegroundColor Red
}

# 5. Summary
Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Local URL:  http://localhost:8006" -ForegroundColor White
Write-Host "Tunnel URL: https://burgandy-sim.loca.lt" -ForegroundColor White
Write-Host ""
Write-Host "To keep tunnel alive, run:" -ForegroundColor Gray
Write-Host "  npx localtunnel --port 8006 --subdomain burgandy-sim" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")