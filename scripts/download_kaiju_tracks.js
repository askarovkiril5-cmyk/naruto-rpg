const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const ytdlpPath = path.join(rootDir, 'scripts', 'yt-dlp.exe');
const ffmpegPath = path.join(rootDir, 'server', 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');
const tempDir = path.join(rootDir, 'scripts', 'temp_audio');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const targetDirs = [
  path.join(rootDir, 'server', 'public', 'audio'),
  path.join(rootDir, 'client', 'public', 'audio'),
  path.join(rootDir, 'client', 'dist', 'audio')
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const tracks = [
  {
    id: 'kaiju_abyss',
    name: 'Kaiju No. 8 Season 1 Opening (YUNGBLUD - Abyss)',
    url: 'https://www.youtube.com/watch?v=CFjI21M9wZs',
    outputFile: 'kaiju_abyss.mp3'
  },
  {
    id: 'kaiju_s2_opening',
    name: 'Kaiju No. 8 Season 2 Opening (AURORA - You Can\'t Run From Yourself)',
    url: 'https://www.youtube.com/watch?v=rH8FCwzOdpI',
    outputFile: 'kaiju_s2_opening.mp3'
  },
  {
    id: 'kaiju_s2_russian',
    name: 'Kaiju No. 8 Season 2 Opening (Russian Cover)',
    url: 'https://www.youtube.com/watch?v=U-vfv7xytus',
    outputFile: 'kaiju_s2_russian.mp3'
  }
];

console.log('--- Starting Kaiju No. 8 Audio Download & Conversion ---');
console.log('yt-dlp:', ytdlpPath);
console.log('ffmpeg:', ffmpegPath);

for (const track of tracks) {
  const destPath = path.join(tempDir, track.outputFile);
  console.log(`\n[Downloading]: ${track.name} -> ${track.outputFile}...`);

  const cmd = `"${ytdlpPath}" --extract-audio --audio-format mp3 --audio-quality 0 --ffmpeg-location "${ffmpegPath}" -o "${destPath}" "${track.url}"`;
  
  try {
    execSync(cmd, { stdio: 'inherit' });
    if (fs.existsSync(destPath)) {
      console.log(`[Success]: Downloaded and encoded ${destPath} (${(fs.statSync(destPath).size / 1024 / 1024).toFixed(2)} MB)`);
      
      // Copy to target directories
      for (const targetDir of targetDirs) {
        const finalDest = path.join(targetDir, track.outputFile);
        fs.copyFileSync(destPath, finalDest);
        console.log(` -> Copied to ${finalDest}`);
      }
    } else {
      console.error(`[Error]: Output file not found: ${destPath}`);
    }
  } catch (err) {
    console.error(`[Failed]: Error downloading ${track.name}:`, err.message);
  }
}

console.log('\n--- Finished downloading Kaiju No. 8 tracks! ---');
