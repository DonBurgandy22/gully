#!/usr/bin/env pwsh
<#
Test WhatsApp Connection Status
#>

Write-Host "Testing WhatsApp Connection..." -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Test 1: Check OpenClaw status
Write-Host "`n1. Checking OpenClaw status..." -ForegroundColor Yellow
$status = openclaw status --json 2>&1
if ($LASTEXITCODE -eq 0) {
    $statusObj = $status | ConvertFrom-Json
    Write-Host "   ✓ OpenClaw running" -ForegroundColor Green
    Write-Host "   Gateway: $($statusObj.gateway.mode)" -ForegroundColor Gray
    Write-Host "   Context: $($statusObj.sessions.recent[0].percentUsed)%" -ForegroundColor Gray
    
    # Check WhatsApp status
    if ($statusObj.linkChannel) {
        $whatsapp = $statusObj.linkChannel
        Write-Host "   WhatsApp: $($whatsapp.label)" -ForegroundColor Gray
        Write-Host "   Linked: $($whatsapp.linked)" -ForegroundColor $(if ($whatsapp.linked) { "Green" } else { "Red" })
        Write-Host "   Auth Age: $([math]::Round($whatsapp.authAgeMs/1000, 1)) seconds" -ForegroundColor Gray
    }
} else {
    Write-Host "   ✗ OpenClaw status check failed" -ForegroundColor Red
    Write-Host "   Error: $status" -ForegroundColor Red
}

# Test 2: Check channels status
Write-Host "`n2. Checking channels status..." -ForegroundColor Yellow
$channels = openclaw channels status 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Channels status retrieved" -ForegroundColor Green
    Write-Host "   Output:`n$channels" -ForegroundColor Gray
} else {
    Write-Host "   ✗ Channels status check failed" -ForegroundColor Red
    Write-Host "   Error: $channels" -ForegroundColor Red
}

# Test 3: Check recent logs for WhatsApp errors
Write-Host "`n3. Checking recent logs for WhatsApp errors..." -ForegroundColor Yellow
$logs = openclaw logs --limit 10 2>&1
if ($LASTEXITCODE -eq 0) {
    $whatsappLogs = $logs | Select-String -Pattern "whatsapp|499|heartbeat" -CaseSensitive:$false
    if ($whatsappLogs) {
        Write-Host "   Found WhatsApp-related logs:" -ForegroundColor Yellow
        $whatsappLogs | ForEach-Object {
            Write-Host "   - $_" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ✓ No recent WhatsApp errors in logs" -ForegroundColor Green
    }
} else {
    Write-Host "   ✗ Log check failed" -ForegroundColor Red
}

# Test 4: Simple message test (with timeout)
Write-Host "`n4. Testing message send (with 10s timeout)..." -ForegroundColor Yellow
$testMessage = "🤖 Connection test - $(Get-Date -Format 'HH:mm:ss')"
$job = Start-Job -ScriptBlock {
    param($msg)
    openclaw message send --target "+27614236040" --message $msg 2>&1
} -ArgumentList $testMessage

$result = $job | Wait-Job -Timeout 10
if ($result) {
    $output = Receive-Job -Job $job
    Remove-Job -Job $job
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Message sent successfully" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Message send failed" -ForegroundColor Red
        Write-Host "   Error: $output" -ForegroundColor Red
    }
} else {
    Write-Host "   ⚠ Message send timed out (10s)" -ForegroundColor Yellow
    Write-Host "   This suggests WhatsApp connection issues" -ForegroundColor Yellow
    Remove-Job -Job $job -Force
}

Write-Host "`n==============================" -ForegroundColor Cyan
Write-Host "Test Complete" -ForegroundColor Cyan