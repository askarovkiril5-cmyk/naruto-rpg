$gitDir = "C:\Users\Acer\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd"
$ghDir = "C:\Program Files\GitHub CLI"
$env:Path = "$gitDir;$ghDir;$env:Path"

$root = (Split-Path -Parent $PSScriptRoot)
Set-Location $root

Write-Host "Creating GitHub repo and pushing code..."
& gh repo create naruto-rpg --public --source="." --remote=origin --push
