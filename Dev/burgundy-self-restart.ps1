# burgundy-self-restart.ps1
$sessionPath = "C:\Users\dkmac\.openclaw\agents\main\sessions\"
$logFile     = "C:\Dev\restart-log.txt"
$lockFile    = "C:\Dev\restart.lock"
$openclaw    = "C:\Users\dkmac\AppData\Roaming\npm\openclaw.ps1"
$workspace   = "C:\Users\dkmac\.openclaw\workspace"
$timestamp   = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$date        = Get-Date -Format "yyyy-MM-dd"

if (Test-Path $lockFile) {
    Add-Content $logFile "[$timestamp] RESTART SKIPPED — already in progress"
    exit
}

Set-Content $lockFile "restarting" -Encoding UTF8

try {
    Add-Content $logFile "[$timestamp] AUTO-RESTART TRIGGERED"

    $summaryPath = "$workspace\session-summary.md"
    $memoryPath  = "$workspace\memory\$date.md"
    $lastWrite   = $null
    if (Test-Path $summaryPath) { $lastWrite = (Get-Item $summaryPath).LastWriteTime }
    $fiveMinAgo  = (Get-Date).AddMinutes(-5)

    if (-not $lastWrite -or $lastWrite -lt $fiveMinAgo) {
        $emergencySave = "# Session Summary — Emergency auto-save`n**Time:** $timestamp`n**Reason:** Context threshold — auto-restart`n`n## On Return — Read in this order`n1. AGENTS.md`n2. USER.md`n3. session-summary.md`n4. memory/$date.md`n5. Update all MD files then continue last task`n"
        Set-Content $summaryPath $emergencySave -Encoding UTF8
        Add-Content $logFile "[$timestamp] Emergency session-summary.md written"
    } else {
        Add-Content $logFile "[$timestamp] Recent session-summary.md found — keeping Burgundy's save"
    }

    $memoryEntry = "`n## Auto-Restart — $timestamp`n- Context threshold triggered restart`n- Session cleared`n- Read session-summary.md on return`n"
    if (-not (Test-Path (Split-Path $memoryPath))) {
        New-Item -ItemType Directory -Path (Split-Path $memoryPath) -Force | Out-Null
    }
    Add-Content $memoryPath $memoryEntry -Encoding UTF8
    Add-Content $logFile "[$timestamp] Appended to memory/$date.md"

    if (Test-Path $sessionPath) {
        $files = Get-ChildItem $sessionPath -Filter "*.jsonl"
        $count = $files.Count
        $files | Remove-Item -Force -ErrorAction SilentlyContinue
        Add-Content $logFile "[$timestamp] Sessions cleared ($count files)"
    }

    Add-Content $logFile "[$timestamp] Stopping gateway..."
    & powershell.exe -ExecutionPolicy Bypass -NonInteractive -File $openclaw gateway stop 2>$null
    Start-Sleep -Seconds 4

    Add-Content $logFile "[$timestamp] Starting gateway..."
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = "powershell.exe"
    $startInfo.Arguments = "-ExecutionPolicy Bypass -NonInteractive -WindowStyle Hidden -File `"$openclaw`" gateway start"
    $startInfo.UseShellExecute = $true
    $startInfo.WindowStyle = "Hidden"
    [System.Diagnostics.Process]::Start($startInfo) | Out-Null

    Start-Sleep -Seconds 8
    $timestamp2 = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content $logFile "[$timestamp2] Restart complete — Burgundy reads memory on reconnect"
}
catch {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content $logFile "[$ts] ERROR: $($_.Exception.Message)"
}
finally {
    Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
}