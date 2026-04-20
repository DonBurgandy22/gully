$ErrorActionPreference = "Stop"

$TaskName = "Hermes-Auto-Loop"
$RunHermes = "C:\Burgandy\run-hermes.ps1"

if (-not (Test-Path $RunHermes)) {
    throw "run-hermes.ps1 not found at $RunHermes"
}

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -File $RunHermes"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 5) -RepetitionDuration (New-TimeSpan -Days 3650)
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Description "Runs Hermes analyzer, consolidator, optimization writer, routing hints writer, and status writer every 5 minutes" -Force | Out-Null

Write-Host "Scheduled task '$TaskName' is registered and ready."
