# Fixed Context Monitor - UTF-8 Encoding Corrected
# Version: 2026-03-30
# Purpose: Monitor OpenClaw context usage and trigger auto-restart at 70% threshold

# Set UTF-8 encoding for proper character handling
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Configuration
$contextThreshold = 70  # Auto-restart at 70% context usage
$emergencyThreshold = 80  # Emergency restart at 80%
$memorySaveScript = "C:\Users\dkmac\.openclaw\workspace\current-memory-save-restart.ps1"
$restartScript = "C:\Users\dkmac\.openclaw\workspace\current-self-restart.ps1"
$logFile = "C:\Users\dkmac\.openclaw\workspace\context-monitor.log"

# Function to write log with timestamp
function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] $Message"
    Add-Content -Path $logFile -Value $logMessage
}

try {
    Write-Log "=== Context Monitor Started ==="
    
    # Get OpenClaw status
    $statusJson = openclaw status --json 2>$null
    if (-not $statusJson) {
        Write-Log "ERROR: Could not get OpenClaw status"
        exit 1
    }
    
    # Parse JSON
    $status = $statusJson | ConvertFrom-Json
    
    # Find active session with valid percentUsed
    $contextPct = $null
    foreach ($session in $status.sessions.recent) {
        if ($session.percentUsed -ne $null -and $session.percentUsed -ge 0 -and $session.percentUsed -le 100) {
            $contextPct = $session.percentUsed
            Write-Log "Found session with context usage: $contextPct%"
            break
        }
    }
    
    # Fallback: Check totalTokens if percentUsed not available
    if (-not $contextPct -and $status.context) {
        if ($status.context.totalTokens -and $status.context.maxTokens) {
            $contextPct = [math]::Round(($status.context.totalTokens / $status.context.maxTokens) * 100)
            Write-Log "Calculated context usage from tokens: $contextPct%"
        }
    }
    
    # If still no context percentage, use file-based fallback
    if (-not $contextPct) {
        Write-Log "WARNING: Could not determine context percentage from status"
        
        # File-based fallback: Check last known context
        $contextFile = "C:\Users\dkmac\.openclaw\workspace\last-context.txt"
        if (Test-Path $contextFile) {
            $lastContext = Get-Content $contextFile -Raw
            if ($lastContext -match '(\d+)') {
                $contextPct = [int]$matches[1]
                Write-Log "Using file-based context: $contextPct%"
            }
        }
        
        if (-not $contextPct) {
            Write-Log "ERROR: Could not determine context percentage"
            exit 1
        }
    }
    
    # Save current context for future reference
    $contextPct | Out-File -FilePath "C:\Users\dkmac\.openclaw\workspace\last-context.txt" -Encoding UTF8
    
    Write-Log "Current context usage: $contextPct%"
    
    # Check thresholds
    if ($contextPct -ge $emergencyThreshold) {
        Write-Log "EMERGENCY: Context at $contextPct% >= $emergencyThreshold% - Triggering emergency restart"
        
        # Save memory first
        Write-Log "Saving memory before emergency restart..."
        & powershell.exe -ExecutionPolicy Bypass -NonInteractive -WindowStyle Hidden -File $memorySaveScript
        
        # Wait for save to complete
        Start-Sleep -Seconds 5
        
        # Execute restart
        Write-Log "Executing emergency restart..."
        & powershell.exe -ExecutionPolicy Bypass -NonInteractive -WindowStyle Hidden -File $restartScript
        
    } elseif ($contextPct -ge $contextThreshold) {
        Write-Log "WARNING: Context at $contextPct% >= $contextThreshold% - Triggering auto-restart"
        
        # Save memory first
        Write-Log "Saving memory before auto-restart..."
        & powershell.exe -ExecutionPolicy Bypass -NonInteractive -WindowStyle Hidden -File $memorySaveScript
        
        # Wait for save to complete
        Start-Sleep -Seconds 5
        
        # Execute restart
        Write-Log "Executing auto-restart..."
        & powershell.exe -ExecutionPolicy Bypass -NonInteractive -WindowStyle Hidden -File $restartScript
        
    } else {
        Write-Log "OK: Context at $contextPct% - below $contextThreshold% threshold"
    }
    
    Write-Log "=== Context Monitor Completed ==="
    
} catch {
    Write-Log "ERROR: Exception occurred: $_"
    Write-Log "Stack trace: $($_.ScriptStackTrace)"
    exit 1
}