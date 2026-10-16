const fs = require('fs');
const path = require('path');
const { PNG } = require('../client/node_modules/pngjs');

const inputPath = path.join(__dirname, '..', 'client', 'public', 'frames', 'frame_creator_genesis_mlbb.png');
const outputPath = inputPath; // overwrite in-place

console.log('Reading PNG:', inputPath);
const data = fs.readFileSync(inputPath);
const png = PNG.sync.read(data);
const { width, height } = png;
console.log(`Dimensions: ${width}x${height}`);

// Helper function to get/set pixel
function getPixel(x, y) {
  const idx = (width * y + x) << 2;
  return {
    r: png.data[idx],
    g: png.data[idx + 1],
    b: png.data[idx + 2],
    a: png.data[idx + 3],
    idx
  };
}

function setPixel(x, y, r, g, b, a) {
  const idx = (width * y + x) << 2;
  png.data[idx] = r;
  png.data[idx + 1] = g;
  png.data[idx + 2] = b;
  png.data[idx + 3] = a;
}

// 1. Ensure central viewport (where player avatar sits) is 100% cleanly transparent
// Inner square is from x: 295 to 729, y: 290 to 724
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const p = getPixel(x, y);

    // Center cutout check (inside inner gold bezel)
    const inCenterBox = (x >= 295 && x <= 729 && y >= 290 && y <= 724);
    if (inCenterBox) {
      // Rounded corner check
      const cornerRadius = 75;
      let inCorner = false;
      // Top-left
      if (x < 295 + cornerRadius && y < 290 + cornerRadius) {
        const dx = x - (295 + cornerRadius);
        const dy = y - (290 + cornerRadius);
        if (dx * dx + dy * dy > cornerRadius * cornerRadius) inCorner = true;
      }
      // Top-right
      if (x > 729 - cornerRadius && y < 290 + cornerRadius) {
        const dx = x - (729 - cornerRadius);
        const dy = y - (290 + cornerRadius);
        if (dx * dx + dy * dy > cornerRadius * cornerRadius) inCorner = true;
      }
      // Bottom-left
      if (x < 295 + cornerRadius && y > 724 - cornerRadius) {
        const dx = x - (295 + cornerRadius);
        const dy = y - (724 - cornerRadius);
        if (dx * dx + dy * dy > cornerRadius * cornerRadius) inCorner = true;
      }
      // Bottom-right
      if (x > 729 - cornerRadius && y > 724 - cornerRadius) {
        const dx = x - (729 - cornerRadius);
        const dy = y - (724 - cornerRadius);
        if (dx * dx + dy * dy > cornerRadius * cornerRadius) inCorner = true;
      }

      if (!inCorner) {
        // Pixel is inside the avatar opening
        setPixel(x, y, 0, 0, 0, 0);
        continue;
      }
    }

    // 2. Clear out enclosed black pockets:
    // Pocket A: behind crown (y < 250, x between 360 and 664, above the gold arch)
    if (y < 235 && (x < 430 || x > 594)) {
      if (p.r < 40 && p.g < 35 && p.b < 35) {
        setPixel(x, y, 0, 0, 0, 0);
        continue;
      }
    }

    // Pocket B: between frame and left wing (x: 180..245, y: 300..600)
    if (x >= 180 && x <= 245 && y >= 320 && y <= 580) {
      if (p.r < 35 && p.g < 35 && p.b < 35) {
        setPixel(x, y, 0, 0, 0, 0);
        continue;
      }
    }

    // Pocket C: between frame and right wing (x: 775..840, y: 300..600)
    if (x >= 775 && x <= 840 && y >= 320 && y <= 580) {
      if (p.r < 35 && p.g < 35 && p.b < 35) {
        setPixel(x, y, 0, 0, 0, 0);
        continue;
      }
    }

    // 3. Keep pedestal solid black marble & gold kanji
    // Pedestal area: y >= 750 && x >= 240 && x <= 784
    if (y >= 750 && x >= 240 && x <= 784) {
      // Don't let pedestal become transparent
      if (p.a < 255) {
        setPixel(x, y, p.r, p.g, p.b, 255);
      }
    }

    // 4. Smooth out black halo / fringing around outer edges
    if (p.a > 0 && p.a < 255) {
      // Near transparent edge: remove dark fringing
      const maxC = Math.max(p.r, p.g, p.b);
      if (maxC < 15) {
        setPixel(x, y, 0, 0, 0, 0);
      }
    }
  }
}

const refinedBuffer = PNG.sync.write(png);
fs.writeFileSync(outputPath, refinedBuffer);
console.log('SUCCESS! Refined transparent frame written to:', outputPath, 'size:', refinedBuffer.length);
