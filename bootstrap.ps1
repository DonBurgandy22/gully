$ErrorActionPreference = "Stop"

Write-Host "=== Burgandy bootstrap starting ==="

$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Workspace = "C:\Burgandy"
$VenvPath = Join-Path $Workspace ".venv"
$PythonExe = "python"
$Requirements = Join-Path $Workspace "requirements.txt"
$HermesTaskScript = Join-Path $Workspace "setup-hermes-task.ps1"
$OpenClawTemplate = Join-Path $Workspace "openclaw.template.json"
$OpenClawLiveDir = Join-Path $env:USERPROFILE ".openclaw"
$OpenClawLiveConfig = Join-Path $OpenClawLiveDir "openclaw.json"

function Assert-CommandExists {
    param([string]$CommandName, [string]$FriendlyName)
    if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
        throw "$FriendlyName is not installed or not available on PATH."
    }
}

Assert-CommandExists -CommandName "git" -FriendlyName "Git"
Assert-CommandExists -CommandName "python" -FriendlyName "Python"

if (-not (Test-Path $Workspace)) {
    New-Item -ItemType Directory -Path $Workspace -Force | Out-Null
}

Set-Location $Workspace

if (-not (Test-Path $VenvPath)) {
    Write-Host "Creating virtual environment..."
    & $PythonExe -m venv $VenvPath
}

$VenvPython = Join-Path $VenvPath "Scripts\python.exe"
if (-not (Test-Path $VenvPython)) {
    throw "Virtual environment Python executable not found at $VenvPython"
}

Write-Host "Upgrading pip..."
& $VenvPython -m pip install --upgrade pip

if (Test-Path $Requirements) {
    Write-Host "Installing Python requirements..."
    & $VenvPython -m pip install -r $Requirements
} else {
    Write-Host "requirements.txt not found. Skipping dependency install."
}

$GeneratedFiles = @(
    @{ Path = "C:\Burgandy\learning-events.txt"; Content = "" },
    @{ Path = "C:\Burgandy\memory-updates.json"; Content = "{}" },
    @{ Path = "C:\Burgandy\routing-hints.txt"; Content = "" },
    @{ Path = "C:\Burgandy\optimization-suggestions.txt"; Content = "" },
    @{ Path = "C:\Burgandy\network-map-state.json"; Content = '{"nodes":[],"edges":[]}' },
    @{ Path = "C:\Burgandy\hermes-status.txt"; Content = "" }
)

foreach ($file in $GeneratedFiles) {
    if (-not (Test-Path $file.Path)) {
        Set-Content -Path $file.Path -Value $file.Content -Encoding UTF8
    }
}

if (Test-Path $OpenClawTemplate) {
    if (-not (Test-Path $OpenClawLiveDir)) {
        New-Item -ItemType Directory -Path $OpenClawLiveDir -Force | Out-Null
    }
    if (-not (Test-Path $OpenClawLiveConfig)) {
        Copy-Item $OpenClawTemplate $OpenClawLiveConfig -Force
        Write-Host "Copied openclaw.template.json to live config location."
    } else {
        Write-Host "Live OpenClaw config already exists. Leaving it unchanged."
    }
} else {
    Write-Host "openclaw.template.json not found. Skipping config template copy."
}

if (Get-Command "openclaw" -ErrorAction SilentlyContinue) {
    Write-Host "OpenClaw detected on PATH."
} else {
    Write-Host "WARNING: OpenClaw not detected on PATH. Install or configure it manually."
}

if (Test-Path $HermesTaskScript) {
    Write-Host "Registering Hermes scheduled task..."
    powershell -ExecutionPolicy Bypass -File $HermesTaskScript
} else {
    Write-Host "setup-hermes-task.ps1 not found. Skipping task registration."
}

Write-Host ""
Write-Host "=== Burgandy bootstrap complete ==="
Write-Host "Next recommended checks:"
Write-Host "1. powershell -ExecutionPolicy Bypass -File C:\Burgandy\run-hermes.ps1"
Write-Host "2. Get-Content C:\Burgandy\hermes-status.txt"
Write-Host "3. Get-ScheduledTask -TaskName Hermes-Auto-Loop"
Write-Host "4. Verify OpenClaw installation and WhatsApp re-auth if needed"
