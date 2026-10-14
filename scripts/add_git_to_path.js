import { execSync } from 'child_process';

const gitCmdDir = 'C:\\Users\\Acer\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\\cmd';
const ghDir = 'C:\\Program Files\\GitHub CLI';

const psCode = `
$target = "User"
$current = [System.Environment]::GetEnvironmentVariable("Path", $target)
$paths = $current -split ';' | Where-Object { $_ }

$added = $false
if ($paths -notcontains "${gitCmdDir.replace(/\\/g, '\\\\')}") {
    $paths += "${gitCmdDir.replace(/\\/g, '\\\\')}"
    $added = $true
}
if ($paths -notcontains "${ghDir.replace(/\\/g, '\\\\')}") {
    $paths += "${ghDir.replace(/\\/g, '\\\\')}"
    $added = $true
}

if ($added) {
    $newPath = $paths -join ';'
    [System.Environment]::SetEnvironmentVariable("Path", $newPath, $target)
    Write-Host "PATH updated successfully!"
} else {
    Write-Host "Paths already present in User PATH."
}
`;

const res = execSync(`powershell -NoProfile -Command "${psCode.replace(/\n/g, ' ')}"`);
console.log(res.toString());
