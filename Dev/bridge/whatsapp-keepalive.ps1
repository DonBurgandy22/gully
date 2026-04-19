#!/usr/bin/env pwsh
<#
WhatsApp Keep-Alive System
Sends periodic messages to prevent heartbeat timeout (30+ minutes no messages)
#>

param(
    [int]$IntervalMinutes = 20,  # Send keep-alive every 20 minutes
    [string]$TargetNumber = "+27614236040",  # Daryl's number
    [string]$LogFile = "C:\Dev\bridge\logs\whatsapp-keepalive.log"
)

# Create log directory if needed
$LogDir = Split-Path $LogFile -Parent
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
    $logEntry = "$timestamp - $Level - $Message"
    Add-Content -Path $LogFile -Value $logEntry
    Write-Host $logEntry
}

function Send-KeepAlive {
    try {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $message = "🤖 WhatsApp keep-alive ping - $timestamp"
        
        Write-Log "Sending keep-alive to $TargetNumber"
        
        # First check WhatsApp status
        $status = openclaw status --json 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Log "WARN: Cannot check status, OpenClaw may be unavailable" -Level "WARN"
        } else {
            $statusObj = $status | ConvertFrom-Json
            $whatsappStatus = $statusObj.linkChannel
            if ($whatsappStatus.linked -eq $true) {
                Write-Log "WhatsApp status: Linked (auth age: $($whatsappStatus.authAgeMs)ms)"
            } else {
                Write-Log "WARN: WhatsApp not linked, skipping keep-alive" -Level "WARN"
                return $false
            }
        }
        
        # Send message via OpenClaw with timeout
        $job = Start-Job -ScriptBlock {
            param($target, $msg)
            openclaw message send --target $target --message $msg 2>&1
        } -ArgumentList $TargetNumber, $message
        
        # Wait for job with timeout (30 seconds)
        $jobResult = $job | Wait-Job -Timeout 30
        
        if ($jobResult) {
            $result = Receive-Job -Job $job
            Remove-Job -Job $job
            
            if ($LASTEXITCODE -eq 0) {
                Write-Log "Keep-alive sent successfully: $message"
                return $true
            } else {
                Write-Log "ERROR: Failed to send keep-alive. Exit code: $LASTEXITCODE" -Level "ERROR"
                Write-Log "ERROR Details: $result" -Level "ERROR"
                return $false
            }
        } else {
            # Timeout occurred
            Write-Log "ERROR: Keep-alive send timed out after 30 seconds" -Level "ERROR"
            Remove-Job -Job $job -Force
            return $false
        }
    }
    catch {
        Write-Log "EXCEPTION: Failed to send keep-alive: $_" -Level "ERROR"
        return $false
    }
}

# Main loop
Write-Log "WhatsApp Keep-Alive System started"
Write-Log "Interval: $IntervalMinutes minutes | Target: $TargetNumber"

while ($true) {
    try {
        # Send keep-alive
        $success = Send-KeepAlive
        
        if ($success) {
            Write-Log "Next keep-alive in $IntervalMinutes minutes"
        } else {
            Write-Log "Will retry in 5 minutes after failure"
            Start-Sleep -Seconds 300  # Wait 5 minutes on failure
            continue
        }
        
        # Wait for next interval
        $sleepSeconds = $IntervalMinutes * 60
        Write-Log "Sleeping for $sleepSeconds seconds..."
        Start-Sleep -Seconds $sleepSeconds
        
    }
    catch {
        Write-Log "FATAL: Main loop exception: $_" -Level "ERROR"
        Write-Log "Restarting in 60 seconds..."
        Start-Sleep -Seconds 60
    }
}