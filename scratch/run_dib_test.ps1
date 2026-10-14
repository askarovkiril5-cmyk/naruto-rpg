Add-Type -AssemblyName System.Drawing
$csharpCode = Get-Content "C:\Users\Acer\Desktop\Наруто\scratch\DIBIcoTester.cs" -Raw
Add-Type -TypeDefinition $csharpCode -ReferencedAssemblies "System.Drawing"

$testerCode = @'
using System;
using System.Runtime.InteropServices;

public class ShellIconTester2 {
    [DllImport("shell32.dll", CharSet = CharSet.Auto)]
    public static extern uint ExtractIconEx(string szFileName, int nIconIndex, IntPtr[] phiconLarge, IntPtr[] phiconSmall, uint nIcons);
    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool DestroyIcon(IntPtr hIcon);
}
'@
Add-Type -TypeDefinition $testerCode

$pngPath = "C:\Users\Acer\Desktop\Наруто\client\electron\icon.png"
$icoPath = "C:\Users\Acer\Desktop\Наруто\client\electron\app_icon_dib.ico"

[DIBIcoTester]::SaveMultiResIcon($pngPath, $icoPath)
Write-Host "Saved icon to: $icoPath (Size: $((Get-Item $icoPath).Length) bytes)"

$large = New-Object IntPtr[] 1
$small = New-Object IntPtr[] 1
$res = [ShellIconTester2]::ExtractIconEx($icoPath, 0, $large, $small, 1)

Write-Host "ExtractIconEx result: $res"
Write-Host "Large icon handle: $($large[0])"
Write-Host "Small icon handle: $($small[0])"

if ($large[0] -ne [IntPtr]::Zero) {
    [ShellIconTester2]::DestroyIcon($large[0]) | Out-Null
    Write-Host "SUCCESS: Shell32 extracted Large icon successfully!"
} else {
    Write-Host "FAILURE: Large icon is null"
}
if ($small[0] -ne [IntPtr]::Zero) {
    [ShellIconTester2]::DestroyIcon($small[0]) | Out-Null
    Write-Host "SUCCESS: Shell32 extracted Small icon successfully!"
} else {
    Write-Host "FAILURE: Small icon is null"
}
