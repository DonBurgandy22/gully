@echo off
echo Keeping Burgundy Simulation Tunnel Alive
echo ========================================
echo.
echo Current tunnel: https://eighty-jeans-win.loca.lt
echo Local server: http://localhost:8006
echo.
echo Press Ctrl+C to stop
echo.

:check_tunnel
tasklist /FI "IMAGENAME eq node.exe" /FI "WINDOWTITLE eq localtunnel*" 2>nul | find /I "node.exe" >nul
if errorlevel 1 (
    echo [%time%] Tunnel not running, starting...
    start /B npx localtunnel --port 8006
    timeout /t 10 /nobreak >nul
)

timeout /t 30 /nobreak >nul
goto check_tunnel