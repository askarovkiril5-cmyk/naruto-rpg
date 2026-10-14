@echo off
setlocal
cd /d "%~dp0"
title Naruto RPG Desktop Launcher

echo ========================================================
echo   Naruto RPG: Shippuden Era - Windows Desktop Client
echo ========================================================

REM 1. Check if Node.js server is already active on port 4000
netstat -ano | findstr :4000 >nul 2>&1
if %errorlevel% neq 0 (
    echo [1/2] Starting AI Game Master server on port 4000...
    start "Naruto RPG Server" /min node server/index.js
    timeout /t 2 /nobreak >nul
) else (
    echo [1/2] Server is already active on port 4000.
)

REM 2. Launch Desktop Client Window directly via local Electron
echo [2/2] Launching desktop game window...
cd /d "%~dp0client"
if exist "node_modules\electron\dist\electron.exe" (
    start "" "node_modules\electron\dist\electron.exe" .
) else (
    call npm exec electron .
)
