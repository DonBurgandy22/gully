@echo off
echo Burgundy Simulation Tunnel - Keep Alive
echo ========================================
echo.
echo This script will keep the simulation monitor tunnel alive.
echo If the tunnel drops, it will automatically restart.
echo.
echo Press Ctrl+C to stop.
echo.

:start
echo [%date% %time%] Starting localtunnel...
npx localtunnel --port 8006 --subdomain burgandy-sim 2>&1

echo.
echo [%date% %time%] Tunnel stopped, restarting in 5 seconds...
timeout /t 5 /nobreak >nul
goto start