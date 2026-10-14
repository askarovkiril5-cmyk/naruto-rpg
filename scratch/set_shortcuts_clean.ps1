
# Force UTF8 Output
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$sh = New-Object -ComObject WScript.Shell
$desktop = [System.Environment]::GetFolderPath('Desktop')

# 1. English shortcut: Naruto RPG.lnk
$sc1Path = Join-Path $desktop "Naruto RPG.lnk"
if (Test-Path -LiteralPath $sc1Path) { Remove-Item -LiteralPath $sc1Path -Force }
$sc1 = $sh.CreateShortcut($sc1Path)
$sc1.TargetPath = "C:\Users\Acer\Desktop\Наруто\client\node_modules\electron\dist\electron.exe"
$sc1.Arguments = "."
$sc1.WorkingDirectory = "C:\Users\Acer\Desktop\Наруто\client"
$sc1.IconLocation = "C:\Users\Acer\AppData\Local\NarutoRPG\naruto_app.ico,0"
$sc1.Description = "Naruto RPG: Will of Fire"
$sc1.Save()
Write-Host "Created sc1:" $sc1Path

# 2. Russian shortcut: Наруто RPG.lnk
$sc2Path = Join-Path $desktop "Наруто RPG.lnk"
if (Test-Path -LiteralPath $sc2Path) { Remove-Item -LiteralPath $sc2Path -Force }
$sc2 = $sh.CreateShortcut($sc2Path)
$sc2.TargetPath = "C:\Users\Acer\Desktop\Наруто\client\node_modules\electron\dist\electron.exe"
$sc2.Arguments = "."
$sc2.WorkingDirectory = "C:\Users\Acer\Desktop\Наруто\client"
$sc2.IconLocation = "C:\Users\Acer\AppData\Local\NarutoRPG\naruto_app.ico,0"
$sc2.Description = "Наруто: Боевая Арена Шиноби (Воля Огня)"
$sc2.Save()
Write-Host "Created sc2:" $sc2Path

# 3. Start Menu shortcut
$startMenu = [System.Environment]::GetFolderPath('Programs')
$startSc = Join-Path $startMenu "Naruto RPG.lnk"
if (Test-Path -LiteralPath $startSc) { Remove-Item -LiteralPath $startSc -Force }
$sc3 = $sh.CreateShortcut($startSc)
$sc3.TargetPath = "C:\Users\Acer\Desktop\Наруто\client\node_modules\electron\dist\electron.exe"
$sc3.Arguments = "."
$sc3.WorkingDirectory = "C:\Users\Acer\Desktop\Наруто\client"
$sc3.IconLocation = "C:\Users\Acer\AppData\Local\NarutoRPG\naruto_app.ico,0"
$sc3.Description = "Naruto RPG: Will of Fire"
$sc3.Save()
Write-Host "Created sc3:" $startSc

# 4. Folder desktop.ini
$targetFolder = "C:\Users\Acer\Desktop\Наруто"
if (Test-Path -LiteralPath $targetFolder) {
    $ini = Join-Path $targetFolder "desktop.ini"
    if (Test-Path -LiteralPath $ini) {
        attrib -h -s -r "$ini"
        Remove-Item -LiteralPath $ini -Force
    }
    $iniText = "[.ShellClassInfo]`r`nIconResource=C:\Users\Acer\AppData\Local\NarutoRPG\naruto_app.ico,0`r`n[ViewState]`r`nMode=`r`nVid=`r`nFolderType=Generic`r`n"
    [System.IO.File]::WriteAllText($ini, $iniText, [System.Text.Encoding]::Unicode)
    attrib +h +s "$ini"
    attrib +r "$targetFolder"
    Write-Host "Configured folder desktop.ini for:" $targetFolder
}
