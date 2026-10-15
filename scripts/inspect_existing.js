const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ffmpeg = path.resolve('server/node_modules/ffmpeg-static/ffmpeg.exe');
const ytdlp = path.resolve('scripts/yt-dlp.exe');
const voicesDir = path.resolve('client/public/audio/voices');
const tempDir = path.resolve('scripts/temp_voices');

if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

console.log('=== Inspecting Existing Audio Files ===');
const checkFiles = ['katon_gokakyu.mp3', 'suiton_suiryudan.mp3', 'kaiten.mp3', 'raikiri.mp3', 'chidori.mp3', 'clean_chidori.mp3'];
checkFiles.forEach(f => {
  const p = path.join(voicesDir, f);
  if (fs.existsSync(p)) {
    const stats = fs.statSync(p);
    console.log(`${f}: ${(stats.size / 1024).toFixed(1)} KB`);
  }
});
