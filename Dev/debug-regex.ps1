$openclawPath = "C:\Users\dkmac\AppData\Roaming\npm\openclaw.cmd"
$statusOutput = & $openclawPath status 2>&1
Write-Host "Output length: $($statusOutput.Length)"
Write-Host "First 500 chars:"
$statusOutput.Substring(0, [Math]::Min(500, $statusOutput.Length))
Write-Host "`nLooking for pattern..."
$match = [regex]::Match($statusOutput, '\d+k/\d+k\s*\((\d+)%\)')
Write-Host "Match success: $($match.Success)"
if ($match.Success) {
    Write-Host "Context percentage: $($match.Groups[1].Value)"
}
