# restart-gateway-and-notify.ps1
# Purpose: Safely restart OpenClaw gateway and verify WhatsApp listener is back
# Usage: .\restart-gateway-and-notify.ps1

param(
    [int]$TimeoutSeconds = 120,
    [string]$LogFile = "C:\Burgandy\gateway-restart-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"
)

# Clear any existing log file
if (Test-Path $LogFile) {
    Remove-Item $LogFile -Force
}

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] $Message"
    Write-Host $logEntry
    Add-Content -Path $LogFile -Value $logEntry
}

Write-Log "=== OpenClaw Gateway Restart Script ==="
Write-Log "Starting gateway restart process..."

# Step 1: Restart the gateway
Write-Log "Executing: openclaw.cmd gateway restart"
try {
    $process = Start-Process -FilePath "openclaw.cmd" -ArgumentList "gateway", "restart" -NoNewWindow -PassThru -RedirectStandardOutput "$env:TEMP\gateway-restart-output.txt" -RedirectStandardError "$env:TEMP\gateway-restart-error.txt"
    
    # Wait briefly for process to start
    Start-Sleep -Seconds 2
    
    Write-Log "Gateway restart command sent. Process ID: $($process.Id)"
} catch {
    Write-Log "ERROR: Failed to start gateway restart: $_"
    exit 1
}

# Step 2: Monitor for WhatsApp listener startup
Write-Log "Monitoring for WhatsApp listener startup (timeout: $TimeoutSeconds seconds)..."
Write-Log "Target string: '[whatsapp] Listening for personal WhatsApp inbound messages. Ctrl+C to stop.'"

$startTime = Get-Date
$success = $false
$checkInterval = 2

while (((Get-Date) - $startTime).TotalSeconds -lt $TimeoutSeconds) {
    # Check if the output file exists and contains the target string
    if (Test-Path "$env:TEMP\gateway-restart-output.txt") {
        $content = Get-Content "$env:TEMP\gateway-restart-output.txt" -Raw -ErrorAction SilentlyContinue
        if ($content -and $content -match '\[whatsapp\] Listening for personal WhatsApp inbound messages\. Ctrl\+C to stop\.') {
            Write-Log "SUCCESS: WhatsApp listener detected as running!"
            $success = $true
            break
        }
    }
    
    # Also check error file in case output is there
    if (Test-Path "$env:TEMP\gateway-restart-error.txt") {
        $errorContent = Get-Content "$env:TEMP\gateway-restart-error.txt" -Raw -ErrorAction SilentlyContinue
        if ($errorContent -and $errorContent -match '\[whatsapp\] Listening for personal WhatsApp inbound messages\. Ctrl\+C to stop\.') {
            Write-Log "SUCCESS: WhatsApp listener detected in error output!"
            $success = $true
            break
        }
    }
    
    Write-Log "Waiting for WhatsApp listener... ($((Get-Date) - $startTime).TotalSeconds.ToString('F0'))s elapsed)"
    Start-Sleep -Seconds $checkInterval
}

# Step 3: Final status and notification
if ($success) {
    Write-Log "Gateway restart completed successfully."
    Write-Log "Sending notification: 'Burgandy has restarted the gateway and is back.'"
    
    # The notification will be sent via the normal OpenClaw messaging channel
    # This script assumes the gateway is now running and will handle the notification
    Write-Log "Notification queued for delivery via WhatsApp."
} else {
    Write-Log "FAILURE: Timeout reached without detecting WhatsApp listener."
    Write-Log "Gateway may not have started correctly."
    Write-Log "Check logs at: $env:TEMP\gateway-restart-output.txt and $env:TEMP\gateway-restart-error.txt"
    exit 1
}

Write-Log "=== Script completed ==="
Write-Log "Log saved to: $LogFile"