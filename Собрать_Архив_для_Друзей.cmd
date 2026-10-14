@echo off
chcp 65001 >nul
title Сборка архива игры для друзей
cls
echo ========================================================
echo   УПАКОВКА ИГРЫ В ZIP-АРХИВ ДЛЯ ДРУЗЕЙ (PORTABLE WINDOWS)
echo ========================================================
echo.
node "%~dp0scripts\build_portable_zip.js"
echo.
if exist "%~dp0release\Naruto_RPG_Windows.zip" (
    echo [OK] Архив успешно создан:
    echo %~dp0release\Naruto_RPG_Windows.zip
    echo.
    echo Открываем папку с готовым архивом...
    explorer "%~dp0release"
) else (
    echo [ОШИБКА] Не удалось создать архив.
)
pause
