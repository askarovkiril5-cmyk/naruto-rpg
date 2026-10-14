Add-Type -AssemblyName System.Drawing

function Generate-NarutoIcon([string]$pngPath, [string]$icoPath) {
    $dir1 = Split-Path $pngPath
    if (-not (Test-Path $dir1)) { New-Item -ItemType Directory -Path $dir1 -Force | Out-Null }
    $dir2 = Split-Path $icoPath
    if (-not (Test-Path $dir2)) { New-Item -ItemType Directory -Path $dir2 -Force | Out-Null }

    $size = 256
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # 1. Тёмный круг фона
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 12, 12, 16))
    $g.FillEllipse($bgBrush, 8, 8, 240, 240)

    # 2. Огненная аура чакры Листа (красно-оранжевый градиент)
    $auraPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 220, 38, 38), 12)
    $g.DrawEllipse($auraPen, 18, 18, 220, 220)

    $innerAuraPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(240, 234, 88, 12), 8)
    $g.DrawEllipse($innerAuraPen, 26, 26, 204, 204)

    # 3. Золотое кольцо печати с пунктиром
    $goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 245, 158, 11), 5)
    $goldPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $g.DrawEllipse($goldPen, 38, 38, 180, 180)

    # 4. Тонкое алое кольцо
    $redPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 239, 68, 68), 2)
    $g.DrawEllipse($redPen, 48, 48, 160, 160)

    # 5. Лучи печати
    $rayPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 245, 158, 11), 3)
    $g.DrawLine($rayPen, 128, 10, 128, 36)
    $g.DrawLine($rayPen, 128, 220, 128, 246)
    $g.DrawLine($rayPen, 10, 128, 36, 128)
    $g.DrawLine($rayPen, 220, 128, 246, 128)

    # 6. Спираль Удзумаки (печать шиноби)
    $spiralPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 254, 240, 138), 11)
    $spiralPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $spiralPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    $points = @(
        (New-Object System.Drawing.PointF(128, 128)),
        (New-Object System.Drawing.PointF(138, 134)),
        (New-Object System.Drawing.PointF(142, 146)),
        (New-Object System.Drawing.PointF(134, 160)),
        (New-Object System.Drawing.PointF(118, 164)),
        (New-Object System.Drawing.PointF(102, 152)),
        (New-Object System.Drawing.PointF(96, 132)),
        (New-Object System.Drawing.PointF(106, 108)),
        (New-Object System.Drawing.PointF(128, 96)),
        (New-Object System.Drawing.PointF(154, 102)),
        (New-Object System.Drawing.PointF(172, 124)),
        (New-Object System.Drawing.PointF(174, 152)),
        (New-Object System.Drawing.PointF(158, 178)),
        (New-Object System.Drawing.PointF(128, 192)),
        (New-Object System.Drawing.PointF(92, 186)),
        (New-Object System.Drawing.PointF(68, 158)),
        (New-Object System.Drawing.PointF(64, 124)),
        (New-Object System.Drawing.PointF(82, 88)),
        (New-Object System.Drawing.PointF(120, 68)),
        (New-Object System.Drawing.PointF(166, 68))
    )
    $g.DrawCurve($spiralPen, $points, 0.5)

    # 7. Кончик листа Конохи
    $leafBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))
    $leafPts = @(
        (New-Object System.Drawing.Point(166, 68)),
        (New-Object System.Drawing.Point(196, 56)),
        (New-Object System.Drawing.Point(184, 82))
    )
    $g.FillPolygon($leafBrush, $leafPts)

    # 8. Ядро печати
    $coreBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 254, 240, 138))
    $g.FillEllipse($coreBrush, 122, 122, 12, 12)

    # 9. Голубые молнии Райтона
    $lightningBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 56, 189, 248))
    $lPts1 = @((New-Object System.Drawing.Point(54, 120)), (New-Object System.Drawing.Point(44, 130)), (New-Object System.Drawing.Point(56, 132)), (New-Object System.Drawing.Point(46, 145)), (New-Object System.Drawing.Point(68, 128)))
    $g.FillPolygon($lightningBrush, $lPts1)

    $lPts2 = @((New-Object System.Drawing.Point(202, 115)), (New-Object System.Drawing.Point(212, 125)), (New-Object System.Drawing.Point(200, 128)), (New-Object System.Drawing.Point(214, 142)), (New-Object System.Drawing.Point(194, 124)))
    $g.FillPolygon($lightningBrush, $lPts2)

    # Сохраняем PNG
    $bmp.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)

    # Создаем и сохраняем ICO из Hicon
    $hIcon = $bmp.GetHicon()
    $icon = [System.Drawing.Icon]::FromHandle($hIcon)
    $fs = New-Object System.IO.FileStream($icoPath, [System.IO.FileMode]::Create)
    $icon.Save($fs)
    $fs.Close()

    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Иконки успешно сгенерированы: $pngPath и $icoPath"
}

$root = Split-Path -Parent $PSScriptRoot
Generate-NarutoIcon "$root\client\electron\icon.png" "$root\client\electron\icon.ico"
Generate-NarutoIcon "$root\electron\icon.png" "$root\electron\icon.ico"
