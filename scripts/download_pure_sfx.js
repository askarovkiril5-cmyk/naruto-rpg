const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const ytdlp = path.join(rootDir, 'scripts', 'yt-dlp.exe');
const ffmpeg = path.join(rootDir, 'server', 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');
const tempDir = path.join(rootDir, 'scripts', 'temp_voices');
const pubVoicesDir = path.join(rootDir, 'client', 'public', 'audio', 'voices');

const SFX_DOWNLOADS = [
  {
    filename: 'sfx_chidori_stream.mp3',
    query: 'ytsearch1:chidori sound effect no voice',
    maxDuration: 2.5
  },
  {
    filename: 'sfx_fire_blast.mp3',
    query: 'ytsearch1:anime fire blast fireball sound effect',
    maxDuration: 2.5
  },
  {
    filename: 'sfx_water_dragon.mp3',
    query: 'ytsearch1:anime water explosion splash sound effect',
    maxDuration: 2.5
  },
  {
    filename: 'sfx_kaiten_spin.mp3',
    query: 'ytsearch1:anime energy shield force field sound effect',
    maxDuration: 2.5
  }
];

SFX_DOWNLOADS.forEach(item => {
  const finalPath = path.join(pubVoicesDir, item.filename);
  if (fs.existsSync(finalPath) && fs.statSync(finalPath).size > 10000) {
    console.log(`[Already Exists] ${item.filename}`);
    return;
  }
  const rawDest = path.join(tempDir, `raw_${item.filename}`);
  console.log(`Downloading SFX: ${item.filename} with query: ${item.query}`);
  try {
    const cmd = `"${ytdlp}" --extract-audio --audio-format mp3 --audio-quality 0 --ffmpeg-location "${ffmpeg}" -o "${rawDest}" "${item.query}"`;
    execSync(cmd, { stdio: 'inherit' });
    if (fs.existsSync(rawDest)) {
      // Cut to 2.5s and loudnorm normalize
      const trimCmd = `"${ffmpeg}" -y -i "${rawDest}" -t ${item.maxDuration} -af "afade=t=out:st=2.0:d=0.5,loudnorm=I=-14:LRA=7:TP=-1" "${finalPath}"`;
      execSync(trimCmd, { stdio: 'ignore' });
      console.log(`Successfully prepared ${item.filename} (${(fs.statSync(finalPath).size / 1024).toFixed(1)} KB)`);
      try { fs.unlinkSync(rawDest); } catch(_) {}
    }
  } catch (err) {
    console.error(`Failed to download ${item.filename}:`, err.message);
  }
});
