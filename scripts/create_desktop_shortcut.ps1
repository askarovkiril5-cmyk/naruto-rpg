# ========================================================
# Скрипт создания ярлыка Naruto RPG на Рабочем столе Windows
# и в Меню «Пуск» с кастомной иконкой шиноби (.ico)
# ========================================================

$ErrorActionPreference = 'Stop'
$root = (Split-Path -Parent $PSScriptRoot)
$launcherPath = Join-Path $root "start_desktop_app.cmd"
$iconPath = Join-Path $root "client\electron\app_icon.ico"
if (-not (Test-Path $iconPath)) {
    $iconPath = Join-Path $root "client\electron\icon.ico"
}

$WshShell = New-Object -ComObject WScript.Shell

$electronExe = Join-Path $root "client\node_modules\electron\dist\electron.exe"
$clientDir = Join-Path $root "client"

# 1. Создание ярлыка на Рабочем столе
$desktopDir = [System.Environment]::GetFolderPath('Desktop')
Get-ChildItem -Path $desktopDir -Filter "*Naruto RPG*.lnk" | Remove-Item -Force -ErrorAction SilentlyContinue

$desktopShortcutPath = Join-Path $desktopDir "Naruto RPG.lnk"
$shortcut = $WshShell.CreateShortcut($desktopShortcutPath)
if (Test-Path $electronExe) {
    $shortcut.TargetPath = $electronExe
    $shortcut.Arguments = "."
    $shortcut.WorkingDirectory = $clientDir
} else {
    $shortcut.TargetPath = $launcherPath
    $shortcut.WorkingDirectory = $root
}
$shortcut.IconLocation = "$iconPath,0"
$shortcut.Description = "Naruto RPG (Shippuden Era) - AI Game Master"
$shortcut.Save()

Write-Host "Shortcut created: $desktopShortcutPath"

# 2. Создание ярлыка в Меню «Пуск»
$startMenuDir = [System.Environment]::GetFolderPath('Programs')
Get-ChildItem -Path $startMenuDir -Filter "*Naruto RPG*.lnk" | Remove-Item -Force -ErrorAction SilentlyContinue

$startShortcutPath = Join-Path $startMenuDir "Naruto RPG.lnk"
$shortcutStart = $WshShell.CreateShortcut($startShortcutPath)
if (Test-Path $electronExe) {
    $shortcutStart.TargetPath = $electronExe
    $shortcutStart.Arguments = "."
    $shortcutStart.WorkingDirectory = $clientDir
} else {
    $shortcutStart.TargetPath = $launcherPath
    $shortcutStart.WorkingDirectory = $root
}
$shortcutStart.IconLocation = "$iconPath,0"
$shortcutStart.Description = "Naruto RPG (Shippuden Era) - AI Game Master"
$shortcutStart.Save()

Write-Host "Start Menu shortcut created: $startShortcutPath"
