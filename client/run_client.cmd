@echo off
chcp 65001 >nul
set "PATH=C:\Users\Acer\AppData\Local\Programs\nodejs;%PATH%"
cd /d "%~dp0"
npm run dev
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] Клиент завершил работу с ошибкой.
  pause
)
