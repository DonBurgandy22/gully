# PowerShell script to run Claude Code for website building
# Run this in an admin PowerShell window

Write-Host "Starting Claude Code for website building..." -ForegroundColor Green
Write-Host "API rate limit has reset - ready to go!" -ForegroundColor Yellow

# Navigate to antigravity workspace
Set-Location "C:\dev\antigravity"

# Run Claude Code with proper flags
# --print: Print output to console
# --permission-mode bypassPermissions: Skip permission prompts
# --model claude-3-5-haiku-20241022: Use Claude Haiku model
claude --print --permission-mode bypassPermissions --model claude-3-5-haiku-20241022

Write-Host ""
Write-Host "Instructions:" -ForegroundColor Cyan
Write-Host "1. Copy the prompt from C:\Dev\claude-code-queue.md (the new task at the bottom)" -ForegroundColor White
Write-Host "2. Paste it into Claude Code terminal" -ForegroundColor White
Write-Host "3. Let Claude Code build the website in C:\dev\antigravity\daryl-mobile-portfolio\" -ForegroundColor White
Write-Host "4. Test on your phone using localtunnel or local IP" -ForegroundColor White

Write-Host ""
Write-Host "For mobile access:" -ForegroundColor Cyan
Write-Host "Option 1 (LocalTunnel):" -ForegroundColor Yellow
Write-Host "   cd C:\dev\antigravity\daryl-mobile-portfolio\" -ForegroundColor White
Write-Host "   python -m http.server 3000" -ForegroundColor White
Write-Host "   lt --port 3000 --subdomain daryl-portfolio" -ForegroundColor White
Write-Host "   Access: https://daryl-portfolio.loca.lt" -ForegroundColor Green

Write-Host ""
Write-Host "Option 2 (Local IP):" -ForegroundColor Yellow
Write-Host "   Get your laptop IP: ipconfig | findstr IPv4" -ForegroundColor White
Write-Host "   Access: http://[YOUR-IP]:3000" -ForegroundColor Green

Write-Host ""
Write-Host "Press any key to open Claude Code terminal..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")