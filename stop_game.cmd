@echo off
chcp 65001 >nul
title Naruto RPG - Остановка серверов

echo ========================================================
echo       ОСТАНОВКА СЕРВЕРОВ NARUTO RPG
echo ========================================================

taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM electron.exe /T 2>nul

echo.
echo [OK] Все игровые серверы и фоновые процессы успешно остановлены!
echo.
timeout /t 3 >nul
