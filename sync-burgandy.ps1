$ErrorActionPreference = "Stop"

Write-Host "=== Burgandy sync starting ==="

$Workspace = "C:\Burgandy"
$VenvPython = Join-Path $Workspace ".venv\Scripts\python.exe"
$Requirements = Join-Path $Workspace "requirements.txt"
$HermesTaskScript = Join-Path $Workspace "setup-hermes-task.ps1"
$RunHermes = Join-Path $Workspace "run-hermes.ps1"

if (-not (Test-Path $Workspace)) {
    throw "Workspace $Workspace does not exist. Clone the repo first."
}

Set-Location $Workspace

git pull --ff-only

if (Test-Path $VenvPython -and (Test-Path $Requirements)) {
    Write-Host "Refreshing Python dependencies..."
    & $VenvPython -m pip install -r $Requirements
} else {
    Write-Host "Virtual environment or requirements.txt missing. Skipping dependency refresh."
}

if (Test-Path $HermesTaskScript) {
    Write-Host "Refreshing Hermes scheduled task..."
    powershell -ExecutionPolicy Bypass -File $HermesTaskScript
}

if (Test-Path $RunHermes) {
    Write-Host "Running Hermes once after sync..."
    powershell -ExecutionPolicy Bypass -File $RunHermes
}

Write-Host "=== Burgandy sync complete ==="
