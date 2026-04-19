@echo off
echo Burgundy Simulation Runner - V2
echo ================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python not found.
    echo Please install Python 3.8 or later.
    pause
    exit /b 1
)

REM Change to script directory
cd /d "%~dp0"

echo Available commands:
echo   1. run-batch [size] - Run a batch of simulations
echo   2. monitor - Start simulation monitor
echo   3. summary - Generate summary report
echo   4. clear - Clear all simulation data
echo.

set /p choice="Enter command (1-4): "

if "%choice%"=="1" (
    set /p batch_size="Enter batch size (default 100): "
    if "%batch_size%"=="" set batch_size=100
    echo Running batch of %batch_size% simulations...
    python "C:\Dev\gully\scripts\simulation-engine-v2-complete.py" %batch_size%
)

if "%choice%"=="2" (
    echo Starting simulation monitor...
    start "" "start-simulation-monitor.bat"
)

if "%choice%"=="3" (
    echo Generating summary report...
    python -c "
import json
import os
from datetime import datetime

def generate_summary():
    results_file = 'simulation-results-v2.json'
    progress_file = 'progress-v2.json'
    
    if not os.path.exists(results_file):
        print('No simulation results found.')
        return
    
    with open(results_file, 'r') as f:
        data = json.load(f)
    
    simulations = data.get('simulations', [])
    if not simulations:
        print('No simulations found.')
        return
    
    successful = [s for s in simulations if s.get('final_net_worth_zar', 0) >= 75000000]
    millionaires = [s for s in simulations if s.get('final_net_worth_zar', 0) >= 1000000]
    
    print('=== SIMULATION SUMMARY ===')
    print(f'Total simulations: {len(simulations):,}')
    print(f'Successful (ZAR 75M+): {len(successful):,} ({len(successful)/len(simulations)*100:.1f}%%)')
    print(f'Millionaires (ZAR 1M+): {len(millionaires):,} ({len(millionaires)/len(simulations)*100:.1f}%%)')
    
    if successful:
        best = max(successful, key=lambda x: x['final_net_worth_zar'])
        print(f'\\nBest simulation (ID: {best[\"simulation_id\"]}):')
        print(f'  Net worth: ZAR {best[\"final_net_worth_zar\"]:,}')
        print(f'  Success rate: {best[\"success_rate\"]*100:.1f}%%')
        print(f'  Years to milestone: {best.get(\"years_to_milestone\", \"N/A\")}')
    
    # Load progress
    if os.path.exists(progress_file):
        with open(progress_file, 'r') as f:
            progress = json.load(f)
        print(f'\\nProgress: {progress.get(\"completed\", 0):,}/{progress.get(\"total\", 0):,} simulations')
        print(f'Completion: {progress.get(\"completion_percentage\", 0):.1f}%%')

generate_summary()
"
)

if "%choice%"=="4" (
    echo WARNING: This will delete all simulation data!
    set /p confirm="Type 'YES' to confirm: "
    if "%confirm%"=="YES" (
        del progress-v2.json 2>nul
        del simulation-results-v2.json 2>nul
        del learning-db-v2.json 2>nul
        echo All simulation data cleared.
    ) else (
        echo Operation cancelled.
    )
)

echo.
pause