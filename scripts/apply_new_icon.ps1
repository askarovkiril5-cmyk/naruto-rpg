Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Acer\.gemini\antigravity\brain\ab4d87be-0a4e-454c-ad43-b5a5b983bba7\naruto_rpg_app_icon_1791936909493.jpg"
if (-not (Test-Path $srcPath)) {
    throw "Source icon not found at $srcPath"
}

$src = [System.Drawing.Image]::FromFile($srcPath)
$root = (Split-Path -Parent $PSScriptRoot)

# 1. Сохранение высокого разрешения PNG (512x512)
$bmp512 = New-Object System.Drawing.Bitmap(512, 512)
$g = [System.Drawing.Graphics]::FromImage($bmp512)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($src, 0, 0, 512, 512)
$g.Dispose()

$pngTargets = @(
    (Join-Path $root "client\electron\icon.png"),
    (Join-Path $root "client\public\icon.png"),
    (Join-Path $root "client\dist\icon.png")
)

foreach ($target in $pngTargets) {
    $dir = Split-Path $target
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $bmp512.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Host "Saved PNG: $target"
}

# 2. Сохранение Windows ICO (256x256)
$bmp256 = New-Object System.Drawing.Bitmap(256, 256)
$g2 = [System.Drawing.Graphics]::FromImage($bmp256)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g2.DrawImage($src, 0, 0, 256, 256)
$g2.Dispose()

$hIcon = $bmp256.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)

$icoTargets = @(
    (Join-Path $root "client\electron\icon.ico"),
    (Join-Path $root "client\public\favicon.ico"),
    (Join-Path $root "client\dist\favicon.ico")
)

foreach ($target in $icoTargets) {
    $dir = Split-Path $target
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $fs = New-Object System.IO.FileStream($target, [System.IO.FileMode]::Create)
    $icon.Save($fs)
    $fs.Close()
    Write-Host "Saved ICO: $target"
}

$bmp512.Dispose()
$bmp256.Dispose()
$src.Dispose()

Write-Host "All icons generated successfully!"
