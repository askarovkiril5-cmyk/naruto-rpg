@echo off
title Публикация Naruto RPG на GitHub
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\publish_to_github.ps1"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Ошибка выполнения. Нажмите любую клавишу для закрытия...
    pause >nul
)
