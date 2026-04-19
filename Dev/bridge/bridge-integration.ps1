#!/usr/bin/env pwsh
<#
Bridge Integration Script - Phase 1
Simple wrapper to route tasks through the bridge worker
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$Task,
    
    [string]$BridgePath = "C:\Dev\bridge\bridge-worker.py",
    [string]$PythonPath = "python"
)

function Write-BridgeOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host "[Bridge] $Message" -ForegroundColor $Color
}

# Check if bridge worker exists
if (-not (Test-Path $BridgePath)) {
    Write-BridgeOutput "Bridge worker not found at: $BridgePath" "Red"
    exit 1
}

# Check Python availability
try {
    $pythonVersion = & $PythonPath --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Python not available"
    }
}
catch {
    Write-BridgeOutput "Python not available. Please install Python 3.8+." "Red"
    exit 1
}

Write-BridgeOutput "Processing task through bridge worker..." "Cyan"
Write-BridgeOutput "Task: $Task" "Yellow"

# Create a temporary Python script to process the task
$tempScript = @"
import sys
sys.path.insert(0, r'C:\Dev\bridge')

from bridge_worker import BridgeWorker

def main():
    worker = BridgeWorker()
    result = worker.process_task(r'$Task')
    
    # Print result in a parseable format
    print("BRIDGE_RESULT_START")
    print(f"Path: {result['path']}")
    print(f"Task: {result['task']}")
    print(f"Instructions: {result['instructions']}")
    print("BRIDGE_RESULT_END")
    
    # Also return as exit code for simple detection
    sys.exit(0 if result['path'] else 1)

if __name__ == "__main__":
    main()
"@

$tempScriptPath = [System.IO.Path]::GetTempFileName() + ".py"
$tempScript | Out-File -FilePath $tempScriptPath -Encoding UTF8

try {
    # Execute the bridge worker
    $output = & $PythonPath $tempScriptPath 2>&1
    
    # Parse the output
    $inResult = $false
    $result = @{}
    
    foreach ($line in $output) {
        if ($line -eq "BRIDGE_RESULT_START") {
            $inResult = $true
            continue
        }
        elseif ($line -eq "BRIDGE_RESULT_END") {
            $inResult = $false
            continue
        }
        elseif ($inResult) {
            if ($line -match "^Path: (.+)$") {
                $result.Path = $matches[1]
            }
            elseif ($line -match "^Task: (.+)$") {
                $result.Task = $matches[1]
            }
            elseif ($line -match "^Instructions: (.+)$") {
                $result.Instructions = $matches[1]
            }
        }
        else {
            # Regular output (logging)
            Write-Host $line
        }
    }
    
    if ($result.Path) {
        Write-BridgeOutput "Task routed to: $($result.Path)" "Green"
        Write-BridgeOutput "Instructions: $($result.Instructions)" "Green"
        
        # Return the path for further processing
        return $result.Path
    }
    else {
        Write-BridgeOutput "Failed to get routing result" "Red"
        return $null
    }
}
catch {
    Write-BridgeOutput "Error executing bridge worker: $($_.Exception.Message)" "Red"
    return $null
}
finally {
    # Clean up temp file
    if (Test-Path $tempScriptPath) {
        Remove-Item $tempScriptPath -Force
    }
}