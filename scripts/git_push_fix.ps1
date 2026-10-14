$gitDir = "C:\Users\Acer\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd"
$ghDir = "C:\Program Files\GitHub CLI"
$env:Path = "$gitDir;$ghDir;$env:Path"

$root = (Split-Path -Parent $PSScriptRoot)
Set-Location $root

Write-Host "1. Staging updated files..."
& git add .gitignore
& git add client/src/data/
& git add scripts/
& git add *.cmd

Write-Host "2. Committing..."
& git commit -m "Fix missing client/src/data folder and gitignore rules"

Write-Host "3. Pushing to GitHub..."
& git push origin main

Write-Host "Done! Pushed successfully to GitHub."
