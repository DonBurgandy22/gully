param(
    [string]$logPath = "C:\Users\User\AppData\Local\Temp\openclaw\openclaw-$(Get-Date -Format 'yyyy-MM-dd').log"
)

$keywords = @(
    "Inbound message",
    "auto-reply sent",
    "llm-idle-timeout",
    "failover",
    "typing TTL reached",
    "web heartbeat",
    "Sent message",
    "error",
    "read failed",
    "edit failed"
)

if (-not (Test-Path $logPath)) {
    New-Item -ItemType File -Path $logPath -Force | Out-Null
}

$content = Get-Content $logPath -Tail 120 -ErrorAction SilentlyContinue

$filtered = $content | Where-Object { $_ -match [regex]::Escape($keywords -join '|') }

$raw = Get-Content $logPath -Tail 40 -ErrorAction SilentlyContinue

$output = @()

if ($filtered) {
    $output += "=== Filtered Lines (120) ==="
    $output += $filtered -join "`n"
}

if ($raw) {
    $output += "`n=== Raw Lines (40) ==="
    $output += $raw -join "`n"
}

$output | Out-File "C:\Burgandy\hermes-runtime-snapshot.txt" -Encoding utf8 -Force
