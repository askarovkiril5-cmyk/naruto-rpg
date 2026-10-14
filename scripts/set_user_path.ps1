$target = "User"
$current = [System.Environment]::GetEnvironmentVariable("Path", $target)
if (-not $current) { $current = "" }
$paths = $current -split ';' | Where-Object { $_ -ne "" }

$gitDir = "C:\Users\Acer\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd"
$ghDir = "C:\Program Files\GitHub CLI"

$changed = $false
if ($paths -notcontains $gitDir) {
    $paths += $gitDir
    $changed = $true
}
if ($paths -notcontains $ghDir) {
    $paths += $ghDir
    $changed = $true
}

if ($changed) {
    $newPath = $paths -join ';'
    [System.Environment]::SetEnvironmentVariable("Path", $newPath, $target)
    Write-Host "PATH updated successfully with Git and GitHub CLI!"
} else {
    Write-Host "Git and GitHub CLI already present in User PATH."
}
