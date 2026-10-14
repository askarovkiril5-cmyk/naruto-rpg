Add-Type -AssemblyName System.Drawing

$sourceCode = @'
using System;
using System.IO;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Collections.Generic;

public static class IcoBuilder {
    public static Bitmap RemoveWhiteCorners(Bitmap src) {
        int w = src.Width;
        int h = src.Height;
        Bitmap result = new Bitmap(src);
        
        // Глубокий черный фон для бесшовного слияния (R=0, G=2, B=14)
        Color fillColor = Color.FromArgb(255, 0, 2, 14);
        
        Point[] startPoints = new Point[] {
            new Point(0, 0),
            new Point(w - 1, 0),
            new Point(0, h - 1),
            new Point(w - 1, h - 1)
        };
        
        bool[,] visited = new bool[w, h];
        Queue<Point> queue = new Queue<Point>();
        
        foreach (var pt in startPoints) {
            queue.Enqueue(pt);
            visited[pt.X, pt.Y] = true;
        }
        
        int[] dx = { 0, 0, 1, -1, 1, 1, -1, -1 };
        int[] dy = { 1, -1, 0, 0, 1, -1, 1, -1 };
        
        while (queue.Count > 0) {
            Point p = queue.Dequeue();
            Color c = result.GetPixel(p.X, p.Y);
            
            // Если пиксель светлый (белый угол или светлый градиент перехода)
            if (c.R > 25 || c.G > 25 || c.B > 25) {
                result.SetPixel(p.X, p.Y, fillColor);
                
                for (int i = 0; i < 8; i++) {
                    int nx = p.X + dx[i];
                    int ny = p.Y + dy[i];
                    if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited[nx, ny]) {
                        visited[nx, ny] = true;
                        queue.Enqueue(new Point(nx, ny));
                    }
                }
            }
        }
        
        return result;
    }

    public static void CreateIco(Bitmap cleanBmp, string targetIcoPath) {
        int[] sizes = new int[] { 256, 128, 64, 48, 32, 16 };
        byte[][] pngData = new byte[sizes.Length][];
        for (int i = 0; i < sizes.Length; i++) {
            int s = sizes[i];
            using (var bmp = new Bitmap(s, s, PixelFormat.Format32bppArgb)) {
                using (var g = Graphics.FromImage(bmp)) {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.CompositingQuality = CompositingQuality.HighQuality;
                    g.DrawImage(cleanBmp, 0, 0, s, s);
                }
                using (var ms = new MemoryStream()) {
                    bmp.Save(ms, ImageFormat.Png);
                    pngData[i] = ms.ToArray();
                }
            }
        }

        string dir = Path.GetDirectoryName(targetIcoPath);
        if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);

        using (var fs = new FileStream(targetIcoPath, FileMode.Create, FileAccess.Write))
        using (var writer = new BinaryWriter(fs)) {
            writer.Write((ushort)0);
            writer.Write((ushort)1);
            writer.Write((ushort)sizes.Length);

            int offset = 6 + (sizes.Length * 16);
            for (int i = 0; i < sizes.Length; i++) {
                byte w = (byte)(sizes[i] >= 256 ? 0 : sizes[i]);
                byte h = (byte)(sizes[i] >= 256 ? 0 : sizes[i]);
                writer.Write(w);
                writer.Write(h);
                writer.Write((byte)0);
                writer.Write((byte)0);
                writer.Write((ushort)1);
                writer.Write((ushort)32);
                writer.Write((uint)pngData[i].Length);
                writer.Write((uint)offset);
                offset += pngData[i].Length;
            }

            for (int i = 0; i < sizes.Length; i++) {
                writer.Write(pngData[i]);
            }
        }
    }

    public static void ProcessAll(string srcPath, string cleanPngPath, string[] icoPaths) {
        using (var raw = (Bitmap)Image.FromFile(srcPath))
        using (var clean = RemoveWhiteCorners(raw)) {
            string pDir = Path.GetDirectoryName(cleanPngPath);
            if (!Directory.Exists(pDir)) Directory.CreateDirectory(pDir);
            clean.Save(cleanPngPath, ImageFormat.Png);

            foreach (var icoPath in icoPaths) {
                CreateIco(clean, icoPath);
            }
        }
    }
}
'@

Add-Type -TypeDefinition $sourceCode -ReferencedAssemblies "System.Drawing.dll"

$srcPath = "C:\Users\Acer\.gemini\antigravity\brain\ab4d87be-0a4e-454c-ad43-b5a5b983bba7\naruto_rpg_app_icon_1791936909493.jpg"
$root = (Split-Path -Parent $PSScriptRoot)

$cleanPng = Join-Path $root "client\electron\icon.png"
$icoTargets = @(
    (Join-Path $root "client\electron\app_icon.ico"),
    (Join-Path $root "client\electron\icon.ico"),
    (Join-Path $root "client\public\favicon.ico"),
    (Join-Path $root "client\dist\favicon.ico")
)

Write-Host "1. Removing white corners and generating deep-black multi-res icons..."
[IcoBuilder]::ProcessAll($srcPath, $cleanPng, $icoTargets)

# Копируем PNG в public, dist и brain
Copy-Item $cleanPng (Join-Path $root "client\public\icon.png") -Force
Copy-Item $cleanPng (Join-Path $root "client\dist\icon.png") -Force
Copy-Item $cleanPng "C:\Users\Acer\.gemini\antigravity\brain\ab4d87be-0a4e-454c-ad43-b5a5b983bba7\naruto_rpg_icon_pure_black.png" -Force

foreach ($target in $icoTargets) {
    $fi = Get-Item $target
    Write-Host "Created valid multi-resolution ICO: $target ($($fi.Length) bytes)"
}

Write-Host "2. Updating Desktop and Start Menu Shortcuts..."
$WshShell = New-Object -ComObject WScript.Shell
$desktopDir = [System.Environment]::GetFolderPath('Desktop')
$desktopShortcutPath = Join-Path $desktopDir "Naruto RPG.lnk"

if (Test-Path $desktopShortcutPath) {
    Remove-Item $desktopShortcutPath -Force
}

$newIcoPath = Join-Path $root "client\electron\app_icon.ico"
$electronExe = Join-Path $root "client\node_modules\electron\dist\electron.exe"
$clientDir = Join-Path $root "client"

$shortcut = $WshShell.CreateShortcut($desktopShortcutPath)
$shortcut.TargetPath = $electronExe
$shortcut.Arguments = "."
$shortcut.WorkingDirectory = $clientDir
$shortcut.IconLocation = "$newIcoPath,0"
$shortcut.Description = "Naruto RPG: Will of Fire (Shippuden Era)"
$shortcut.Save()
Write-Host "Shortcut created on Desktop: $desktopShortcutPath"

# Обновляем ярлык в меню Пуск
$startMenuDir = [System.Environment]::GetFolderPath('Programs')
$startShortcutPath = Join-Path $startMenuDir "Naruto RPG.lnk"
if (Test-Path $startShortcutPath) { Remove-Item $startShortcutPath -Force }
$shortcutStart = $WshShell.CreateShortcut($startShortcutPath)
$shortcutStart.TargetPath = $electronExe
$shortcutStart.Arguments = "."
$shortcutStart.WorkingDirectory = $clientDir
$shortcutStart.IconLocation = "$newIcoPath,0"
$shortcutStart.Description = "Naruto RPG: Will of Fire (Shippuden Era)"
$shortcutStart.Save()
Write-Host "Shortcut created in Start Menu: $startShortcutPath"

# 3. Перезапуск проводника Windows для моментального обновления иконок на экране
Write-Host "3. Refreshing Windows Explorer desktop icon cache..."
Stop-Process -Name explorer -Force
Start-Sleep -Milliseconds 800
Write-Host "SUCCESS! White corners completely removed, black background applied!"
