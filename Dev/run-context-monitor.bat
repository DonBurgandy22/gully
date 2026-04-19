@echo off
REM This batch file runs in user context
cd /d "C:\Dev"
powershell.exe -NonInteractive -WindowStyle Hidden -File "fixed-context-monitor.ps1"