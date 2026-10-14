
$sh = New-Object -ComObject WScript.Shell
$desktop = [System.Environment]::GetFolderPath('Desktop')
$narutoWord = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('0J3QsNGA0YPRgtC+')) # "Наруто"

# English shortcut
$sc1Path = Join-Path $desktop "Naruto RPG.lnk"
if (Test-Path $sc1Path) { Remove-Item $sc1Path -Force }
$sc1 = $sh.CreateShortcut($sc1Path)
$sc1.TargetPath = "C:\\Users\\Acer\\Desktop\\Наруто\\client\\node_modules\\electron\\dist\\electron.exe"
$sc1.Arguments = "."
$sc1.WorkingDirectory = "C:\\Users\\Acer\\Desktop\\Наруто\\client"
$sc1.IconLocation = "C:\\Users\\Acer\\Desktop\\Наруто\\client\\electron\\naruto_app.ico,0"
$sc1.Description = "Naruto RPG: Will of Fire"
$sc1.Save()
Write-Host "Created: $sc1Path"

# Russian shortcut
$sc2Path = Join-Path $desktop "$narutoWord RPG.lnk"
if (Test-Path $sc2Path) { Remove-Item $sc2Path -Force }
$sc2 = $sh.CreateShortcut($sc2Path)
$sc2.TargetPath = "C:\\Users\\Acer\\Desktop\\Наруто\\client\\node_modules\\electron\\dist\\electron.exe"
$sc2.Arguments = "."
$sc2.WorkingDirectory = "C:\\Users\\Acer\\Desktop\\Наруто\\client"
$sc2.IconLocation = "C:\\Users\\Acer\\Desktop\\Наруто\\client\\electron\\naruto_app.ico,0"
$sc2.Description = "$narutoWord RPG: Will of Fire"
$sc2.Save()
Write-Host "Created: $sc2Path"

# Folder Наруто desktop.ini
$targetFolder = Join-Path $desktop $narutoWord
if (Test-Path $targetFolder) {
    $ini = Join-Path $targetFolder "desktop.ini"
    cmd /c "attrib -h -s -r `"$ini`"" 2>$null
    if (Test-Path $ini) { Remove-Item $ini -Force }
    $content = "[.ShellClassInfo]`r`nIconResource=C:\\Users\\Acer\\Desktop\\Наруто\\client\\electron\\naruto_app.ico,0`r`n[ViewState]`r`nMode=`r`nVid=`r`nFolderType=Generic`r`n"
    [System.IO.File]::WriteAllText($ini, $content, [System.Text.Encoding]::Unicode)
    cmd /c "attrib +h +s `"$ini`""
    cmd /c "attrib +r `"$targetFolder`""
    Write-Host "Folder icon applied: $targetFolder"
}
