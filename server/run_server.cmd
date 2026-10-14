@echo off
chcp 65001 >nul
set "PATH=C:\Users\Acer\AppData\Local\Programs\nodejs;%PATH%"
cd /d "%~dp0"
node index.js
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] Сервер завершил работу с ошибкой.
  pause
)
