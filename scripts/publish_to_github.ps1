[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "Публикация Naruto RPG на GitHub"

$gh = "C:\Program Files\GitHub CLI\gh.exe"
$git = "C:\Users\Acer\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd\git.exe"
$root = (Split-Path -Parent $PSScriptRoot)
Set-Location $root

Clear-Host
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "     ⚡ АВТОМАТИЧЕСКАЯ ПУБЛИКАЦИЯ NARUTO RPG НА GITHUB" -ForegroundColor Yellow
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Все 105 файлов игры уже сохранены и закоммичены в локальный Git." -ForegroundColor Green
Write-Host ""
Write-Host "ИНСТРУКЦИЯ:" -ForegroundColor White
Write-Host "1. Сейчас откроется окно авторизации GitHub в вашем браузере." -ForegroundColor Gray
Write-Host "2. В окне консоли появится 8-значный код." -ForegroundColor Gray
Write-Host "3. Подтвердите вход в браузере (нажмите 'Authorize')." -ForegroundColor Gray
Write-Host "4. После этого программа САМА создаст репозиторий и зальет код!" -ForegroundColor Gray
Write-Host ""

Write-Host "[1/3] Запуск авторизации GitHub CLI..." -ForegroundColor Yellow
& $gh auth login --web -h github.com -p https -w

Write-Host ""
Write-Host "[2/3] Проверка авторизации..." -ForegroundColor Yellow
$authCheck = & $gh auth status 2>&1
Write-Host $authCheck

Write-Host ""
Write-Host "[3/3] Создание репозитория и отправка файлов на GitHub..." -ForegroundColor Yellow
& $gh repo create naruto-rpg --private --source="." --remote=origin --push 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Попытка отправить в существующий репозиторий..." -ForegroundColor Cyan
    & $git push -u origin main 2>&1
}

Write-Host ""
Write-Host "===================================================================" -ForegroundColor Green
Write-Host "🎉 УСПЕХ! ВАШ ПРОЕКТ УСПЕШНО ОПУБЛИКОВАН НА GITHUB!" -ForegroundColor Green
Write-Host "===================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Теперь переходите на Render.com:" -ForegroundColor White
Write-Host "1. Зайдите на https://dashboard.render.com" -ForegroundColor Cyan
Write-Host "2. Нажмите 'New +' -> 'Web Service' -> выберите 'naruto-rpg'." -ForegroundColor Cyan
Write-Host "3. Все настройки подтянутся автоматически! Нажмите 'Create Web Service'." -ForegroundColor Cyan
Write-Host ""
Write-Host "Нажмите Enter для завершения..." -ForegroundColor Gray
Read-Host
