$git = "C:\Users\Acer\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd\git.exe"

$root = (Split-Path -Parent $PSScriptRoot)
Set-Location $root

Write-Host "1. Initializing Git repository in: $root"
& $git init

Write-Host "2. Checking Git user identity..."
$currentName = & $git config user.name
if (-not $currentName) {
    & $git config user.name "Vova"
    Write-Host "Set default user.name: Vova"
}
$currentEmail = & $git config user.email
if (-not $currentEmail) {
    & $git config user.email "shinobi-hokage@naruto-rpg.local"
    Write-Host "Set default user.email: shinobi-hokage@naruto-rpg.local"
}

Write-Host "3. Adding files to Git index (respecting .gitignore)..."
& $git add .

Write-Host "4. Creating initial commit..."
& $git branch -M main
& $git commit -m "Naruto RPG: Will of Fire v1.0 Production Release"

Write-Host "5. Commit status:"
& $git status -s
& $git log -n 1 --oneline
