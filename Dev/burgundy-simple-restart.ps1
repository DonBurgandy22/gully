# burgundy-simple-restart.ps1
# SIMPLE RELIABLE RESTART PROTOCOL
# 1. Save memory
# 2. Kill ALL node processes with openclaw
# 3. Clear session files
# 4. Start fresh gateway

$sessionPath = "C:\Users\dkmac\.openclaw\agents\main\sessions\"
$logFile = "C:\Dev\restart-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

Write-Host "[$timestamp] Starting simple restart protocol..."

# STEP 1: SAVE MEMORY
Write-Host "[$timestamp] Step 1: Saving memory..."
try {
    & "C:\Dev\burgundy-memory-save-restart.ps1"
    Write-Host "[$timestamp] Memory saved"
} catch {
    Write-Host "[$timestamp] Memory save error: $_"
}

# STEP 2: KILL ALL OPENCLAW PROCESSES
Write-Host "[$timestamp] Step 2: Killing all OpenClaw processes..."

# Get all node processes
$processes = Get-Process node -ErrorAction SilentlyContinue
$killedCount = 0

foreach ($proc in $processes) {
    try {
        # Check if it's an OpenClaw process
        $cmdLine = (Get-WmiObject Win32_Process -Filter "ProcessId = $($proc.Id)").CommandLine
        if ($cmdLine -like "*openclaw*") {
            Write-Host "[$timestamp] Killing OpenClaw process PID: $($proc.Id)"
            Stop-Process -Id $proc.Id -Force
            $killedCount++
        }
    } catch {
        # Skip processes we can't access
    }
}

Write-Host "[$timestamp] Killed $killedCount OpenClaw process(es)"
Start-Sleep -Seconds 3

# STEP 3: CLEAR SESSION FILES
Write-Host "[$timestamp] Step 3: Clearing session files..."
if (Test-Path $sessionPath) {
    $files = Get-ChildItem $sessionPath -Filter "*.jsonl" -ErrorAction SilentlyContinue
    $fileCount = ($files | Measure-Object).Count
    if ($fileCount -gt 0) {
        $files | Remove-Item -Force -ErrorAction SilentlyContinue
        Write-Host "[$timestamp] Cleared $fileCount session files"
    }
}

# STEP 4: START FRESH GATEWAY
Write-Host "[$timestamp] Step 4: Starting fresh gateway..."

# Kill any remaining node processes just in case
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start gateway using the original CMD file but hidden
$gatewayCmd = "C:\Users\dkmac\.openclaw\gateway.cmd"
if (Test-Path $gatewayCmd) {
    # Create a scheduled task to run the gateway (will run even after this script exits)
    $taskName = "OpenClawGatewayRestartTemp"
    
    # Delete existing temp task if it exists
    schtasks /delete /tn $taskName /f 2>$null
    
    # Create XML for task
    $xmlContent = @"
<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Date>$(Get-Date -Format "yyyy-MM-ddTHH:mm:ss")</Date>
    <Author>DARYL\dkmac</Author>
    <URI>\$taskName</URI>
  </RegistrationInfo>
  <Principals>
    <Principal id="Author">
      <UserId>S-1-5-18</UserId>
      <LogonType>Password</LogonType>
      <RunLevel>HighestAvailable</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
    <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT0S</ExecutionTimeLimit>
    <Priority>7</Priority>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
  </Settings>
  <Triggers>
    <TimeTrigger>
      <StartBoundary>$(Get-Date -Format "yyyy-MM-ddTHH:mm:ss")</StartBoundary>
      <Enabled>true</Enabled>
    </TimeTrigger>
  </Triggers>
  <Actions Context="Author">
    <Exec>
      <Command>cmd.exe</Command>
      <Arguments>/c "$gatewayCmd"</Arguments>
    </Exec>
  </Actions>
</Task>
"@
    
    # Save XML and create task
    $tempXml = "C:\Dev\gateway-task.xml"
    $xmlContent | Out-File $tempXml -Encoding Unicode
    
    schtasks /create /tn $taskName /xml $tempXml 2>$null
    Remove-Item $tempXml -ErrorAction SilentlyContinue
    
    # Run the task
    schtasks /run /tn $taskName 2>$null
    
    Write-Host "[$timestamp] Gateway restart initiated via scheduled task"
    
    # Delete the task after a delay
    Start-Sleep -Seconds 5
    schtasks /delete /tn $taskName /f 2>$null
    
} else {
    Write-Host "[$timestamp] ERROR: Gateway CMD file not found at: $gatewayCmd"
}

Write-Host "[$timestamp] Restart protocol completed"
Write-Host "[$timestamp] Gateway should be restarting now..."