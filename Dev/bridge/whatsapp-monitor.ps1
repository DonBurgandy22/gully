#!/usr/bin/env pwsh
<#
WhatsApp Connection Monitor - Phase 1
Monitors WhatsApp connection stability and logs 499 errors
#>

param(
    [int]$CheckInterval = 10,  # seconds (reduced from 60 to catch brief disconnections)
    [int]$Timeout = 5,         # seconds (reduced for faster checks)
    [int]$MaxFailures = 3,
    [string]$LogFile = "C:\Dev\bridge\logs\whatsapp-health.log"
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

function Test-WhatsAppConnection {
    try {
        # Try to get WhatsApp status
        $status = openclaw channels status 2>&1
        if ($LASTEXITCODE -eq 0) {
            # Parse status output
            if ($status -match "whatsapp.*connected") {
                return @{
                    Status = "connected"
                    Message = "WhatsApp connection healthy"
                    RawOutput = $status
                }
            } elseif ($status -match "disconnected|error|499") {
                return @{
                    Status = "error"
                    Message = "WhatsApp connection issue detected"
                    RawOutput = $status
                }
            } else {
                return @{
                    Status = "unknown"
                    Message = "Could not parse WhatsApp status"
                    RawOutput = $status
                }
            }
        } else {
            return @{
                Status = "error"
                Message = "Failed to get channel status"
                RawOutput = $status
            }
        }
    }
    catch {
        return @{
            Status = "error"
            Message = "Exception testing WhatsApp: $($_.Exception.Message)"
            RawOutput = $null
        }
    }
}

function Update-ConnectionStats {
    param(
        [hashtable]$Result,
        [ref]$FailureCount,
        [ref]$LastFailureTime
    )
    
    if ($Result.Status -eq "error") {
        $FailureCount.Value++
        $LastFailureTime.Value = Get-Date
        
        Write-Log "Connection error detected: $($Result.Message)" "WARNING"
        Write-Log "Failure count: $($FailureCount.Value)" "WARNING"
        
        # Check if we need to alert
        if ($FailureCount.Value -ge $MaxFailures) {
            Write-Log "CRITICAL: $MaxFailures consecutive WhatsApp failures detected" "ERROR"
            # Here you could add notification logic (email, push, etc.)
        }
    }
    else {
        # Reset failure count on success
        if ($FailureCount.Value -gt 0) {
            Write-Log "Connection restored after $($FailureCount.Value) failures" "INFO"
            $FailureCount.Value = 0
        }
        
        Write-Log "Connection healthy: $($Result.Message)" "INFO"
    }
}

# Main monitoring loop
Write-Log "Starting WhatsApp connection monitor" "INFO"
Write-Log "Check interval: ${CheckInterval}s, Timeout: ${Timeout}s, Max failures: $MaxFailures" "INFO"

$failureCount = 0
$lastFailureTime = $null
$monitoringStart = Get-Date

try {
    while ($true) {
        $checkStart = Get-Date
        
        # Test connection
        $result = Test-WhatsAppConnection
        
        # Update statistics
        Update-ConnectionStats -Result $result -FailureCount ([ref]$failureCount) -LastFailureTime ([ref]$lastFailureTime)
        
        # Log detailed result if in error state
        if ($result.Status -eq "error" -and $result.RawOutput) {
            Write-Log "Raw output: $($result.RawOutput)" "DEBUG"
        }
        
        # Calculate sleep time (account for test duration)
        $checkDuration = (Get-Date) - $checkStart
        $sleepTime = [Math]::Max(1, $CheckInterval - $checkDuration.TotalSeconds)
        
        Write-Log "Next check in ${sleepTime}s" "DEBUG"
        Start-Sleep -Seconds $sleepTime
    }
}
catch {
    Write-Log "Monitor stopped with error: $($_.Exception.Message)" "ERROR"
    Write-Log "Monitor runtime: $(((Get-Date) - $monitoringStart).TotalMinutes) minutes" "INFO"
}
finally {
    Write-Log "WhatsApp monitor stopped" "INFO"
}