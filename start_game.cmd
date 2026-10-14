@echo off
chcp 65001 >nul
title Naruto RPG Launcher

echo ========================================================
echo       ЗАПУСК ИГРОВОГО КОМПЛЕКСА NARUTO RPG
echo ========================================================

:: 1. Проверяем и запускаем Radmin VPN при необходимости
tasklist /FI "IMAGENAME eq RvRvpnGui.exe" 2>NUL | find /I /N "RvRvpnGui.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] Radmin VPN уже запущен.
) else (
    echo [..] Запуск Radmin VPN...
    if exist "C:\Program Files (x86)\Radmin VPN\RvRvpnGui.exe" (
        start "" "C:\Program Files (x86)\Radmin VPN\RvRvpnGui.exe"
    )
)

:: 2. Запуск бэкенд сервера
echo [1/2] Запуск сервера (Node.js + Socket.io + AI)...
start "Naruto RPG Server (Port 4000)" /d "%~dp0server" cmd.exe /k "run_server.cmd"

ping 127.0.0.1 -n 3 >nul

:: 3. Запуск веб-клиента Vite
echo [2/2] Запуск веб-клиента (Vite на порту 5173)...
start "Naruto RPG Web Client (Port 5173)" /d "%~dp0client" cmd.exe /k "run_client.cmd"

echo.
echo ========================================================
echo       СЕРВЕРЫ УСПЕШНО РАБОТАЮТ!
echo ========================================================
echo.
echo [1] Твоя ссылка для вставки в браузер (Chrome / Яндекс):
echo     http://localhost:5173
echo.
echo [2] Ссылка для твоего друга (через сеть Radmin VPN):
echo     http://26.79.157.88:5173
echo.
echo ========================================================
echo Окна серверов должны оставаться открытыми во время игры.
echo Нажмите любую клавишу, чтобы закрыть это стартовое окно...
pause >nul
