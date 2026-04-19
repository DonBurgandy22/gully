@echo off
echo n8n YouTube Automation
echo ======================
echo.
echo Starting n8n on port 5678...
echo Open: http://localhost:5678
echo.
cd /d "C:\Dev\n8n-youtube"
n8n start --port=5678 --host=localhost
pause
