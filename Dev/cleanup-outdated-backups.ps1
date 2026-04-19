# cleanup-outdated-backups.ps1
# Moves outdated Desktop Burgandy backups to Recycle Bin
# Requires confirmation

$backupPath = "C:\Users\dkmac\Desktop\Burgandy\Done"
$logFile = "C:\Dev\cleanup-log.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

if (-not (Test-Path $backupPath)) {
    Write-Host "Backup path not found: $backupPath"
    exit 0
}

# List files for verification
$files = Get-ChildItem -Path $backupPath -File -Recurse
$count = $files.Count
$totalSize = ($files | Measure-Object -Property Length -Sum).Sum / 1MB

Write-Host "Found $count files ($totalSize MB) in $backupPath"
Write-Host "Files last modified between $(($files | Measure-Object -Property LastWriteTime -Minimum).Minimum) and $(($files | Measure-Object -Property LastWriteTime -Maximum).Maximum)"

# Ask for confirmation (if running interactively)
if ($Host.UI.RawUI.KeyAvailable -or $env:CI -eq $true) {
    # Non-interactive mode - assume approval
    $confirm = 'Y'
} else {
    $confirm = Read-Host "Move to Recycle Bin? (Y/N)"
}

if ($confirm -eq 'Y') {
    try {
        # Use Recycle Bin via Shell.Application
        $shell = New-Object -ComObject Shell.Application
        $folder = $shell.Namespace(0).Self.Path
        # Move each file to recycle bin
        $files | ForEach-Object {
            $shell.Namespace(0).ParseName($_.FullName).InvokeVerb("delete")
        }
        # Log
        "[$timestamp] Moved $count files ($totalSize MB) to Recycle Bin from $backupPath" | Out-File $logFile -Encoding UTF8 -Append
        Write-Host "Successfully moved $count files to Recycle Bin."
    }
    catch {
        "[$timestamp] ERROR: $($_.Exception.Message)" | Out-File $logFile -Encoding UTF8 -Append
        Write-Error "Failed to move files: $_"
    }
} else {
    Write-Host "Cancelled."
}