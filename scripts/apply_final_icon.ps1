Add-Type -AssemblyName System.Drawing

$sourceCode = @'
using System;
using System.IO;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public static class FinalIconEngine {
    [DllImport("shell32.dll", CharSet = CharSet.Auto)]
    public static extern uint ExtractIconEx(string szFileName, int nIconIndex, IntPtr[] phiconLarge, IntPtr[] phiconSmall, uint nIcons);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool DestroyIcon(IntPtr hIcon);

    [DllImport("shell32.dll")]
    public static extern void SHChangeNotify(uint wEventId, uint uFlags, IntPtr dwItem1, IntPtr dwItem2);

    public const uint SHCNE_ASSOCCHANGED = 0x08000000;
    public const uint SHCNF_FLUSH = 0x1000;

    public static void NotifyShell() {
        try {
            SHChangeNotify(SHCNE_ASSOCCHANGED, SHCNF_FLUSH, IntPtr.Zero, IntPtr.Zero);
        } catch { }
    }

    public static Bitmap MakePureBlackBackground(Bitmap src) {
        int w = src.Width;
        int h = src.Height;
        Bitmap res = new Bitmap(w, h, PixelFormat.Format32bppArgb);
        Color pureBlack = Color.FromArgb(255, 0, 0, 0);

        using (Graphics g = Graphics.FromImage(res)) {
            g.DrawImage(src, 0, 0, w, h);
        }

        // Заменяем остаточный тёмно-синий или светлый фон по углам на абсолютно чистый чёрный (0,0,0)
        // Алгоритм заливки от всех 4 углов
        Point[] corners = new Point[] {
            new Point(0, 0),
            new Point(w - 1, 0),
            new Point(0, h - 1),
            new Point(w - 1, h - 1)
        };

        bool[,] visited = new bool[w, h];
        Queue<Point> queue = new Queue<Point>();

        foreach (var pt in corners) {
            queue.Enqueue(pt);
            visited[pt.X, pt.Y] = true;
        }

        int[] dx = { 0, 0, 1, -1, 1, 1, -1, -1 };
        int[] dy = { 1, -1, 0, 0, 1, -1, 1, -1 };

        while (queue.Count > 0) {
            Point p = queue.Dequeue();
            Color c = res.GetPixel(p.X, p.Y);

            // Если это фоновый пиксель (темный фон или остаточный белый угол)
            // Фон имеет яркость < 35 или мы в углах
            bool isBackground = (c.R <= 20 && c.G <= 20 && c.B <= 35) || (c.R > 230 && c.G > 230 && c.B > 230);
            if (isBackground) {
                res.SetPixel(p.X, p.Y, pureBlack);

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

        return res;
    }

    public static byte[] CreateDIBIconData(Bitmap master, int size) {
        using (Bitmap bmp = new Bitmap(size, size, PixelFormat.Format32bppArgb)) {
            using (Graphics g = Graphics.FromImage(bmp)) {
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                g.CompositingQuality = CompositingQuality.HighQuality;
                g.DrawImage(master, 0, 0, size, size);
            }

            int andRowBytes = ((size + 31) / 32) * 4;
            int andMaskSize = andRowBytes * size;
            int xorMaskSize = size * size * 4;
            byte[] data = new byte[40 + xorMaskSize + andMaskSize];

            using (MemoryStream ms = new MemoryStream(data))
            using (BinaryWriter bw = new BinaryWriter(ms)) {
                bw.Write((uint)40); // biSize
                bw.Write((int)size); // biWidth
                bw.Write((int)(size * 2)); // biHeight (doubled!)
                bw.Write((ushort)1); // biPlanes
                bw.Write((ushort)32); // biBitCount
                bw.Write((uint)0); // biCompression = BI_RGB
                bw.Write((uint)xorMaskSize); // biSizeImage
                bw.Write((int)0);
                bw.Write((int)0);
                bw.Write((uint)0);
                bw.Write((uint)0);

                // XOR mask (bottom-to-top)
                for (int y = size - 1; y >= 0; y--) {
                    for (int x = 0; x < size; x++) {
                        Color c = bmp.GetPixel(x, y);
                        bw.Write(c.B);
                        bw.Write(c.G);
                        bw.Write(c.R);
                        bw.Write(c.A);
                    }
                }

                // AND mask (bottom-to-top)
                for (int y = size - 1; y >= 0; y--) {
                    byte curByte = 0;
                    int bitPos = 7;
                    int bytesWritten = 0;
                    for (int x = 0; x < size; x++) {
                        Color c = bmp.GetPixel(x, y);
                        if (c.A == 0) {
                            curByte |= (byte)(1 << bitPos);
                        }
                        bitPos--;
                        if (bitPos < 0) {
                            bw.Write(curByte);
                            bytesWritten++;
                            curByte = 0;
                            bitPos = 7;
                        }
                    }
                    if (bitPos != 7) {
                        bw.Write(curByte);
                        bytesWritten++;
                    }
                    while (bytesWritten < andRowBytes) {
                        bw.Write((byte)0);
                        bytesWritten++;
                    }
                }
            }
            return data;
        }
    }

    public static byte[] CreatePngIconData(Bitmap master, int size) {
        using (Bitmap bmp = new Bitmap(size, size, PixelFormat.Format32bppArgb)) {
            using (Graphics g = Graphics.FromImage(bmp)) {
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                g.CompositingQuality = CompositingQuality.HighQuality;
                g.DrawImage(master, 0, 0, size, size);
            }
            using (MemoryStream ms = new MemoryStream()) {
                bmp.Save(ms, ImageFormat.Png);
                return ms.ToArray();
            }
        }
    }

    public static void SaveUniversalIco(Bitmap cleanBmp, string outIco) {
        int[] dibSizes = new int[] { 16, 24, 32, 48, 64, 128 };
        int totalEntries = dibSizes.Length + 1; // + 256 PNG

        int[] sizes = new int[totalEntries];
        byte[][] images = new byte[totalEntries][];

        for (int i = 0; i < dibSizes.Length; i++) {
            sizes[i] = dibSizes[i];
            images[i] = CreateDIBIconData(cleanBmp, dibSizes[i]);
        }

        // 256x256 PNG
        sizes[dibSizes.Length] = 256;
        images[dibSizes.Length] = CreatePngIconData(cleanBmp, 256);

        string dir = Path.GetDirectoryName(outIco);
        if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);

        using (FileStream fs = new FileStream(outIco, FileMode.Create, FileAccess.Write))
        using (BinaryWriter bw = new BinaryWriter(fs)) {
            bw.Write((ushort)0); // idReserved
            bw.Write((ushort)1); // idType (1 = icon)
            bw.Write((ushort)totalEntries);

            int offset = 6 + (totalEntries * 16);
            for (int i = 0; i < totalEntries; i++) {
                byte w = (byte)(sizes[i] >= 256 ? 0 : sizes[i]);
                byte h = (byte)(sizes[i] >= 256 ? 0 : sizes[i]);
                bw.Write(w);
                bw.Write(h);
                bw.Write((byte)0);
                bw.Write((byte)0);
                bw.Write((ushort)1);
                bw.Write((ushort)32);
                bw.Write((uint)images[i].Length);
                bw.Write((uint)offset);
                offset += images[i].Length;
            }

            for (int i = 0; i < totalEntries; i++) {
                bw.Write(images[i]);
            }
        }
    }

    public static bool VerifyExtraction(string icoPath) {
        IntPtr[] l = new IntPtr[1];
        IntPtr[] s = new IntPtr[1];
        uint res = ExtractIconEx(icoPath, 0, l, s, 1);
        bool success = (res > 0 && res != 0xFFFFFFFF && l[0] != IntPtr.Zero);
        if (l[0] != IntPtr.Zero) DestroyIcon(l[0]);
        if (s[0] != IntPtr.Zero) DestroyIcon(s[0]);
        return success;
    }
}
'@

Add-Type -TypeDefinition $sourceCode -ReferencedAssemblies "System.Drawing.dll"

$root = (Split-Path -Parent $PSScriptRoot)
$sourcePngPath = Join-Path $root "client\electron\icon.png"

Write-Host "1. Processing image to pure pitch black background..."
$rawBmp = [System.Drawing.Bitmap]::FromFile($sourcePngPath)
$cleanBmp = [FinalIconEngine]::MakePureBlackBackground($rawBmp)
$rawBmp.Dispose()

# Сохраняем обновленный чистый PNG
$cleanPngPath = Join-Path $root "client\electron\icon.png"
$cleanBmp.Save($cleanPngPath, [System.Drawing.Imaging.ImageFormat]::Png)
Copy-Item $cleanPngPath (Join-Path $root "client\public\icon.png") -Force
Copy-Item $cleanPngPath (Join-Path $root "client\dist\icon.png") -Force
Copy-Item $cleanPngPath "C:\Users\Acer\.gemini\antigravity\brain\ab4d87be-0a4e-454c-ad43-b5a5b983bba7\naruto_rpg_icon_pure_black.png" -Force

Write-Host "2. Building Universal DIB+PNG Windows Icons..."
$icoFiles = @(
    (Join-Path $root "client\electron\naruto_app.ico"),
    (Join-Path $root "client\electron\app_icon.ico"),
    (Join-Path $root "client\electron\icon.ico"),
    (Join-Path $root "client\public\favicon.ico"),
    (Join-Path $root "client\dist\favicon.ico")
)

foreach ($ico in $icoFiles) {
    [FinalIconEngine]::SaveUniversalIco($cleanBmp, $ico)
    $ok = [FinalIconEngine]::VerifyExtraction($ico)
    Write-Host "Generated: $ico (Shell32 extraction verified: $ok)"
}
$cleanBmp.Dispose()

Write-Host "3. Updating Desktop Shortcuts..."
$WshShell = New-Object -ComObject WScript.Shell
$desktopDir = [System.Environment]::GetFolderPath('Desktop')
$electronExe = Join-Path $root "client\node_modules\electron\dist\electron.exe"
$clientDir = Join-Path $root "client"
$finalIco = Join-Path $root "client\electron\naruto_app.ico"

# Ярлык Naruto RPG.lnk
$scEnglish = Join-Path $desktopDir "Naruto RPG.lnk"
if (Test-Path $scEnglish) { Remove-Item $scEnglish -Force }
$shortcut1 = $WshShell.CreateShortcut($scEnglish)
$shortcut1.TargetPath = $electronExe
$shortcut1.Arguments = "."
$shortcut1.WorkingDirectory = $clientDir
$shortcut1.IconLocation = "$finalIco,0"
$shortcut1.Description = "Naruto RPG: Will of Fire"
$shortcut1.Save()
Write-Host "Saved Desktop shortcut: $scEnglish"

# Ярлык Наруто RPG.lnk (на русском)
$scRussian = Join-Path $desktopDir "Наруто RPG.lnk"
if (Test-Path $scRussian) { Remove-Item $scRussian -Force }
$shortcut2 = $WshShell.CreateShortcut($scRussian)
$shortcut2.TargetPath = $electronExe
$shortcut2.Arguments = "."
$shortcut2.WorkingDirectory = $clientDir
$shortcut2.IconLocation = "$finalIco,0"
$shortcut2.Description = "Наруто: Боевая Арена Шиноби (Воля Огня)"
$shortcut2.Save()
Write-Host "Saved Desktop shortcut (Russian): $scRussian"

# Меню Пуск
$startMenuDir = [System.Environment]::GetFolderPath('Programs')
$startSc = Join-Path $startMenuDir "Naruto RPG.lnk"
if (Test-Path $startSc) { Remove-Item $startSc -Force }
$shortcut3 = $WshShell.CreateShortcut($startSc)
$shortcut3.TargetPath = $electronExe
$shortcut3.Arguments = "."
$shortcut3.WorkingDirectory = $clientDir
$shortcut3.IconLocation = "$finalIco,0"
$shortcut3.Description = "Naruto RPG: Will of Fire"
$shortcut3.Save()
Write-Host "Saved Start Menu shortcut: $startSc"

Write-Host "4. Setting custom emblem on the Desktop folder 'Наруто'..."
$desktopFolder = Join-Path $desktopDir "Наруто"
if (Test-Path $desktopFolder) {
    $desktopIni = Join-Path $desktopFolder "desktop.ini"
    if (Test-Path $desktopIni) {
        attrib -h -s -r $desktopIni
        Remove-Item $desktopIni -Force
    }
    $iniContent = @"
[.ShellClassInfo]
IconResource=$finalIco,0
[ViewState]
Mode=
Vid=
FolderType=Generic
"@
    [System.IO.File]::WriteAllText($desktopIni, $iniContent, [System.Text.Encoding]::Unicode)
    attrib +h +s $desktopIni
    attrib +r $desktopFolder
    Write-Host "Folder icon configured with desktop.ini on: $desktopFolder"
}

Write-Host "5. Purging Windows Explorer Icon & Thumbnail Caches..."
Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 1200

$localApp = [System.Environment]::GetFolderPath('LocalApplicationData')
$iconCacheOld = Join-Path $localApp "IconCache.db"
if (Test-Path $iconCacheOld) {
    Remove-Item $iconCacheOld -Force -ErrorAction SilentlyContinue
}

$explorerCacheDir = Join-Path $localApp "Microsoft\Windows\Explorer"
if (Test-Path $explorerCacheDir) {
    Get-ChildItem -Path $explorerCacheDir -Filter "iconcache*.db" -Force -ErrorAction SilentlyContinue | ForEach-Object {
        Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
    }
    Get-ChildItem -Path $explorerCacheDir -Filter "thumbcache*.db" -Force -ErrorAction SilentlyContinue | ForEach-Object {
        Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "6. Restarting Explorer and broadcasting SHChangeNotify..."
Start-Process explorer.exe
Start-Sleep -Milliseconds 1500

[FinalIconEngine]::NotifyShell()
Write-Host "ALL TASKS COMPLETE! Icons refreshed across desktop, folders, shortcuts, and taskbar."
