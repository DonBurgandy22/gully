# OpenClaw Admin Setup
# Run this to give OpenClaw admin rights on startup

$taskName = "OpenClawAdminStart"
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -Command `"openclaw gateway start`""
$trigger = New-ScheduledTaskTrigger -AtStartup
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description "OpenClaw with admin rights"

Write-Host "OpenClaw will now start with admin rights on system startup." -ForegroundColor Green
