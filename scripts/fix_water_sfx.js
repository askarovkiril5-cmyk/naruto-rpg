const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const ytdlp = path.join(rootDir, 'scripts', 'yt-dlp.exe');
const ffmpeg = path.join(rootDir, 'server', 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');
const pubVoicesDir = path.join(rootDir, 'client', 'public', 'audio', 'voices');
const tempDir = path.join(rootDir, 'scripts', 'temp_voices');

// Let's test suiryudan.mp3 first
const suiryudanPath = path.join(pubVoicesDir, 'suiryudan.mp3');
if (fs.existsSync(suiryudanPath)) {
  const out = execSync(`"${ffmpeg}" -i "${suiryudanPath}" -af silencedetect=noise=-30dB:d=0.1 -f null - 2>&1`, { encoding: 'utf8' });
  console.log('suiryudan silence detect:\n', out.split('\n').filter(l => l.includes('silence_') || l.includes('Duration')).join('\n'));
}

// Download a crisp water splash / wave sound effect
const rawDest = path.join(tempDir, 'raw_water.mp3');
const finalPath = path.join(pubVoicesDir, 'sfx_water_dragon.mp3');

console.log('Downloading real water splash SFX...');
try {
  const cmd = `"${ytdlp}" --extract-audio --audio-format mp3 --audio-quality 0 --ffmpeg-location "${ffmpeg}" -o "${rawDest}" "ytsearch1:water splash sound effect"`;
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(rawDest)) {
    const trimCmd = `"${ffmpeg}" -y -i "${rawDest}" -t 2.5 -af "afade=t=in:ss=0:d=0.05,afade=t=out:st=2.1:d=0.4,loudnorm=I=-14:LRA=7:TP=-1" "${finalPath}"`;
    execSync(trimCmd, { stdio: 'ignore' });
    console.log(`Success! Saved ${finalPath} (${(fs.statSync(finalPath).size / 1024).toFixed(1)} KB)`);
    try { fs.unlinkSync(rawDest); } catch(_) {}
  }
} catch(e) {
  console.error('Failed water download:', e.message);
}
