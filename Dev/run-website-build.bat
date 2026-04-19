@echo off
echo ============================================
echo   Website Build Script for Daryl
echo   Date: 2026-04-03
echo   API Rate Limit: RESET (Ready to go!)
echo ============================================
echo.
echo This script will help you build a mobile-accessible website
echo using Claude Code with the Claude Haiku model.
echo.
echo IMPORTANT: Run this in ADMIN PowerShell
echo.
echo Steps:
echo 1. Website will be built in: C:\dev\antigravity\daryl-mobile-portfolio\
echo 2. You can access it on your phone via localtunnel
echo 3. QR code will be generated for easy access
echo.
pause

powershell -ExecutionPolicy Bypass -File "C:\Dev\run-claude-code-website.ps1"