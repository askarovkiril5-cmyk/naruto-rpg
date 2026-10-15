const { execSync } = require('child_process');
const ffmpeg = './server/node_modules/ffmpeg-static/ffmpeg.exe';
const fs = require('fs');
const dir = './client/public/audio/voices';

fs.readdirSync(dir).filter(f => f.endsWith('.mp3')).forEach(f => {
  const p = dir + '/' + f;
  try {
    const out = execSync(`"${ffmpeg}" -i "${p}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    const durMatch = out.match(/Duration: ([\d:.]+)/);
    console.log(f.padEnd(25), durMatch ? durMatch[1] : 'unknown');
  } catch(e) {
    const combined = (e.stdout || '') + (e.stderr || '');
    const durMatch = combined.match(/Duration: ([\d:.]+)/);
    console.log(f.padEnd(25), durMatch ? durMatch[1] : 'unknown');
  }
});
