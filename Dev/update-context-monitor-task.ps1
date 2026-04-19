# Update Context Monitor Task
# Deletes and recreates the task with the fixed script

$taskName = "BurgundyContextMonitor2Min"
$scriptPath = "C:\Dev\burgundy-context-monitor-fixed.ps1"

Write-Host "Updating context monitor task..."

# Delete existing task
try {
    schtasks /delete /tn $taskName /f
    Write-Host "Deleted existing task"
} catch {
    Write-Host "Task may not exist or couldn't be deleted"
}

# Create new task
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
    <DisallowStartIfOnBatteries>true</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>true</StopIfGoingOnBatteries>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <IdleSettings>
      <Duration>PT10M</Duration>
      <WaitTimeout>PT1H</WaitTimeout>
      <StopOnIdleEnd>true</StopOnIdleEnd>
      <RestartOnIdle>false</RestartOnIdle>
    </IdleSettings>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
    <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT1H</ExecutionTimeLimit>
    <Priority>7</Priority>
  </Settings>
  <Triggers>
    <TimeTrigger>
      <StartBoundary>$(Get-Date -Format "yyyy-MM-ddTHH:mm:ss")</StartBoundary>
      <Repetition>
        <Interval>PT2M</Interval>
      </Repetition>
    </TimeTrigger>
  </Triggers>
  <Actions Context="Author">
    <Exec>
      <Command>powershell.exe</Command>
      <Arguments>-NonInteractive -WindowStyle Hidden -File "$scriptPath"</Arguments>
    </Exec>
  </Actions>
</Task>
"@

# Save XML to temp file
$tempXml = "C:\Dev\temp-task.xml"
$xmlContent | Out-File $tempXml -Encoding Unicode

# Create task from XML
try {
    schtasks /create /tn $taskName /xml $tempXml
    Write-Host "✅ Task created successfully"
} catch {
    Write-Host "❌ Failed to create task: $_"
}

# Clean up
if (Test-Path $tempXml) {
    Remove-Item $tempXml
}

Write-Host "Task update complete"