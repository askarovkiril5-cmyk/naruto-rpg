$code = @'
using System;
using System.Runtime.InteropServices;

public class ShellIconTester {
    [DllImport("shell32.dll", CharSet = CharSet.Auto)]
    public static extern uint ExtractIconEx(string szFileName, int nIconIndex, IntPtr[] phiconLarge, IntPtr[] phiconSmall, uint nIcons);
}
'@

Add-Type -TypeDefinition $code

$large = New-Object IntPtr[] 1
$small = New-Object IntPtr[] 1
$res = [ShellIconTester]::ExtractIconEx("C:\Users\Acer\Desktop\Наруто\client\electron\app_icon.ico", 0, $large, $small, 1)
Write-Host "ExtractIconEx returned: $res"
Write-Host "Large icon pointer: $($large[0])"
Write-Host "Small icon pointer: $($small[0])"
