Add-Type -AssemblyName System.Drawing

$src = @'
using System;
using System.IO;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public static class NewIcoGenerator {
    [DllImport("shell32.dll", CharSet = CharSet.Auto)]
    public static extern uint ExtractIconEx(string szFileName, int nIconIndex, IntPtr[] phiconLarge, IntPtr[] phiconSmall, uint nIcons);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool DestroyIcon(IntPtr hIcon);

    public static byte[] CreateDIBEntry(Bitmap master, int size) {
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

    public static byte[] CreatePngEntry(Bitmap master, int size) {
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

    public static void BuildIcon(string srcPng, string outIco) {
        using (Bitmap master = new Bitmap(srcPng)) {
            int[] dibSizes = new int[] { 16, 24, 32, 48, 64, 128 };
            int totalEntries = dibSizes.Length + 1; // + 256 PNG

            int[] sizes = new int[totalEntries];
            byte[][] images = new byte[totalEntries][];

            for (int i = 0; i < dibSizes.Length; i++) {
                sizes[i] = dibSizes[i];
                images[i] = CreateDIBEntry(master, dibSizes[i]);
            }

            // 256 PNG
            sizes[dibSizes.Length] = 256;
            images[dibSizes.Length] = CreatePngEntry(master, 256);

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
                    bw.Write((ushort)1); // planes
                    bw.Write((ushort)32); // bitCount
                    bw.Write((uint)images[i].Length);
                    bw.Write((uint)offset);
                    offset += images[i].Length;
                }

                for (int i = 0; i < totalEntries; i++) {
                    bw.Write(images[i]);
                }
            }
        }
    }

    public static bool TestExtract(string icoPath) {
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

Add-Type -TypeDefinition $src -ReferencedAssemblies "System.Drawing.dll"

$root = (Split-Path -Parent $PSScriptRoot)
$png = Join-Path $root "client\electron\icon.png"
$ico = Join-Path $root "client\electron\test_naruto.ico"

[NewIcoGenerator]::BuildIcon($png, $ico)
$ok = [NewIcoGenerator]::TestExtract($ico)
Write-Host "TestExtract result: $ok (File size: $((Get-Item $ico).Length) bytes)"
