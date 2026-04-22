param(
    [string]$json
)

$file = "C:\Burgandy\learning-events.txt"

if (-not (Test-Path $file)) {
    New-Item -ItemType File -Path $file -Force | Out-Null
}

$json | Add-Content -Path $file
