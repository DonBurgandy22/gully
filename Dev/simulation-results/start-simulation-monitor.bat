@echo off
echo Starting Burgundy Simulation Monitor...
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed or not in PATH.
    echo Please install Python 3.8 or later.
    pause
    exit /b 1
)

REM Change to script directory
cd /d "%~dp0"

REM Start the simulation monitor server
echo Starting simulation monitor server on http://localhost:18080...
echo Press Ctrl+C to stop the server when done.
echo.

python simulation-server.py

pause