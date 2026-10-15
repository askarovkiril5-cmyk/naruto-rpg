const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ffmpeg = path.resolve('server/node_modules/ffmpeg-static/ffmpeg.exe');
const dir = path.resolve('client/public/audio/voices');

// Inspect start of sound (silencedetect with -35dB)
const files = [
  'clean_chidori.mp3',
  'chidori.mp3',
  'rasengan.mp3',
  'shinra_tensei.mp3',
  'amaterasu.mp3',
  'kamui.mp3',
  'kage_bunshin.mp3'
];

files.forEach(f => {
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) return;
  try {
    const out = execSync(`"${ffmpeg}" -i "${p}" -af "silencedetect=noise=-30dB:d=0.1" -f null - 2>&1`, { encoding: 'utf8' });
    const lines = out.split('\n').filter(l => l.includes('silence_end') || l.includes('Duration'));
    console.log(`=== ${f} ===\n${lines.join('\n')}`);
  } catch (e) {
    const out = (e.stdout || '') + (e.stderr || '');
    const lines = out.split('\n').filter(l => l.includes('silence_end') || l.includes('Duration'));
    console.log(`=== ${f} ===\n${lines.join('\n')}`);
  }
});
