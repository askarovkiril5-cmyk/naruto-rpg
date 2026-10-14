$ErrorActionPreference = "Stop"

$nodeUrl = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip"
$destZip = "$env:TEMP\node.zip"
$tempExtract = "$env:TEMP\node_temp"
$destDir = "$env:LOCALAPPDATA\Programs\nodejs"

Write-Host "1. Downloading portable Node.js LTS..."
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
(New-Object Net.WebClient).DownloadFile($nodeUrl, $destZip)

Write-Host "2. Extracting archive..."
if (Test-Path $tempExtract) { Remove-Item $tempExtract -Recurse -Force }
Expand-Archive -Path $destZip -DestinationPath $tempExtract -Force

if (-not (Test-Path $destDir)) { 
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

Write-Host "3. Copying files to $destDir..."
Copy-Item -Path "$tempExtract\node-v20.18.0-win-x64\*" -Destination $destDir -Recurse -Force

Remove-Item $destZip -Force -ErrorAction SilentlyContinue
Remove-Item $tempExtract -Recurse -Force -ErrorAction SilentlyContinue

$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$destDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$destDir;$userPath", "User")
}

$env:Path = "$destDir;$env:Path"

Write-Host "4. Testing Node.js installation:"
& "$destDir\node.exe" -v
& "$destDir\npm.cmd" -v
Write-Host "Success! Node.js is ready."
