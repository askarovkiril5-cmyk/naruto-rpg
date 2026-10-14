<#
.SYNOPSIS
    Скрипт автоматической сборки и запуска Naruto RPG Desktop (Electron + React + Socket.io + AI GM)
.DESCRIPTION
    1. Проверяет наличие Node.js и npm (при отсутствии предлагает установить через winget).
    2. Устанавливает серверные зависимости (Express, Socket.io, Dotenv, Cors).
    3. Устанавливает клиентские зависимости (Electron, Vite, React, Tailwind, Lucide).
    4. Запускает локальный сервер и открывает десктопное приложение Electron.
#>

$ErrorActionPreference = "Stop"
$Host.UI.RawUI.WindowTitle = "Naruto RPG - Сборка и Запуск"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       НАРУТО: БОЕВАЯ АРЕНА ШИНОБИ (DESKTOP RPG + AI)     " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Проверка наличия Node.js
Write-Host "[1/4] Проверка окружения Node.js..." -ForegroundColor DarkYellow
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue

if (-not $nodeCmd) {
    Write-Host "[!] Node.js не найден в системе." -ForegroundColor Red
    Write-Host "[*] Пытаемся установить Node.js LTS автоматически через winget..." -ForegroundColor Yellow
    
    $wingetCmd = Get-Command winget -ErrorAction SilentlyContinue
    if ($wingetCmd) {
        winget install OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements
        Write-Host "[OK] Node.js установлен! Пожалуйста, перезапустите PowerShell и запустите .\setup.ps1 снова." -ForegroundColor Green
        Read-Host "Нажмите Enter для выхода..."
        exit
    } else {
        Write-Host "Пожалуйста, скачайте и установите Node.js LTS с официального сайта: https://nodejs.org/" -ForegroundColor Red
        Read-Host "Нажмите Enter для выхода..."
        exit
    }
} else {
    $nodeVer = node -v
    Write-Host " -> Node.js обнаружен: $nodeVer" -ForegroundColor Green
}

# 2. Установка зависимостей сервера
Write-Host ""
Write-Host "[2/4] Установка зависимостей игрового сервера (Socket.io + Express)..." -ForegroundColor DarkYellow
Set-Location -Path "$PSScriptRoot\server"
npm install --silent
Write-Host " -> Серверные модули установлены успешно!" -ForegroundColor Green

# 3. Установка зависимостей клиента (Electron + React)
Write-Host ""
Write-Host "[3/4] Установка зависимостей клиента (Electron + Vite + React + Tailwind)..." -ForegroundColor DarkYellow
Set-Location -Path "$PSScriptRoot\client"
npm install --silent
Write-Host " -> Клиентские модули и Electron установлены успешно!" -ForegroundColor Green

# 4. Запуск сервера и приложения
Write-Host ""
Write-Host "[4/4] Запуск Игрового Сервера и окна Electron..." -ForegroundColor DarkYellow

# Запускаем сервер в фоновом процессе PowerShell
$serverScript = @"
cd '$PSScriptRoot\server'
node index.js
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $serverScript -WindowStyle Minimized
Write-Host " -> Игровой сервер запущен на http://localhost:4000 (в свернутом окне)" -ForegroundColor Green

Start-Sleep -Seconds 2

# Запускаем клиент Electron
Set-Location -Path "$PSScriptRoot\client"
Write-Host " -> Запуск десктопного окна приложения..." -ForegroundColor Cyan
npm start
