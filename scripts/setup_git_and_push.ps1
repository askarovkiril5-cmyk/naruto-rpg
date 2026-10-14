$gitDir = "C:\Users\Acer\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd"
$ghDir = "C:\Program Files\GitHub CLI"
$env:Path = "$gitDir;$ghDir;$env:Path"

$root = (Split-Path -Parent $PSScriptRoot)
Set-Location $root

Write-Host "1. Running gh auth setup-git..."
& gh auth setup-git

Write-Host "2. Pushing main to origin..."
& git push -u origin main --force

Write-Host "3. Verifying remote ref on GitHub..."
& git ls-remote origin main
