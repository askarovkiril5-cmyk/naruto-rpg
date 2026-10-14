using System;
using System.IO;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public static class DIBIcoTester {
    public static byte[] CreateDIBIconData(Bitmap src, int size) {
        using (Bitmap bmp = new Bitmap(size, size, PixelFormat.Format32bppArgb)) {
            using (Graphics g = Graphics.FromImage(bmp)) {
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                g.DrawImage(src, 0, 0, size, size);
            }

            int andRowBytes = ((size + 31) / 32) * 4;
            int andMaskSize = andRowBytes * size;
            int xorMaskSize = size * size * 4;
            int headerSize = 40;
            byte[] data = new byte[headerSize + xorMaskSize + andMaskSize];

            using (MemoryStream ms = new MemoryStream(data))
            using (BinaryWriter bw = new BinaryWriter(ms)) {
                // BITMAPINFOHEADER
                bw.Write((uint)40); // biSize
                bw.Write((int)size); // biWidth
                bw.Write((int)(size * 2)); // biHeight (doubled!)
                bw.Write((ushort)1); // biPlanes
                bw.Write((ushort)32); // biBitCount
                bw.Write((uint)0); // biCompression (BI_RGB)
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
                    byte currentByte = 0;
                    int bitIndex = 7;
                    int bytesWritten = 0;
                    for (int x = 0; x < size; x++) {
                        Color c = bmp.GetPixel(x, y);
                        if (c.A == 0) {
                            currentByte |= (byte)(1 << bitIndex);
                        }
                        bitIndex--;
                        if (bitIndex < 0) {
                            bw.Write(currentByte);
                            bytesWritten++;
                            currentByte = 0;
                            bitIndex = 7;
                        }
                    }
                    if (bitIndex != 7) {
                        bw.Write(currentByte);
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

    public static void SaveMultiResIcon(string srcPng, string outIco) {
        using (Bitmap master = new Bitmap(srcPng)) {
            int[] dibSizes = new int[] { 16, 32, 48, 64 };
            byte[][] images = new byte[dibSizes.Length + 1][];
            int[] sizes = new int[dibSizes.Length + 1];

            for (int i = 0; i < dibSizes.Length; i++) {
                sizes[i] = dibSizes[i];
                images[i] = CreateDIBIconData(master, dibSizes[i]);
            }

            // 256x256 as PNG
            sizes[dibSizes.Length] = 256;
            using (Bitmap b256 = new Bitmap(256, 256, PixelFormat.Format32bppArgb)) {
                using (Graphics g = Graphics.FromImage(b256)) {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.DrawImage(master, 0, 0, 256, 256);
                }
                using (MemoryStream ms = new MemoryStream()) {
                    b256.Save(ms, ImageFormat.Png);
                    images[dibSizes.Length] = ms.ToArray();
                }
            }

            using (FileStream fs = new FileStream(outIco, FileMode.Create, FileAccess.Write))
            using (BinaryWriter bw = new BinaryWriter(fs)) {
                bw.Write((ushort)0); // reserved
                bw.Write((ushort)1); // type 1 = icon
                bw.Write((ushort)images.Length);

                int offset = 6 + (images.Length * 16);
                for (int i = 0; i < images.Length; i++) {
                    byte w = (byte)(sizes[i] >= 256 ? 0 : sizes[i]);
                    byte h = (byte)(sizes[i] >= 256 ? 0 : sizes[i]);
                    bw.Write(w);
                    bw.Write(h);
                    bw.Write((byte)0); // color count
                    bw.Write((byte)0); // reserved
                    bw.Write((ushort)1); // planes
                    bw.Write((ushort)32); // bit count
                    bw.Write((uint)images[i].Length);
                    bw.Write((uint)offset);
                    offset += images[i].Length;
                }

                for (int i = 0; i < images.Length; i++) {
                    bw.Write(images[i]);
                }
            }
        }
    }
}
