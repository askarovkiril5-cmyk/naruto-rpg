@echo off
setlocal
cd /d "%~dp0"
echo =========================================================
echo   Creating Naruto RPG Desktop and Start Menu Shortcuts...
echo =========================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\create_desktop_shortcut.ps1"
echo.
pause
