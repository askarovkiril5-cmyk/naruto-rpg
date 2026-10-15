const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ffmpeg = path.resolve('server/node_modules/ffmpeg-static/ffmpeg.exe');
const dir = path.resolve('client/public/audio/voices');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp3'));

console.log('File'.padEnd(25), 'Duration'.padEnd(15), 'Mean Vol'.padEnd(12), 'Max Vol'.padEnd(10));
console.log('-'.repeat(65));

files.forEach(f => {
  const p = path.join(dir, f);
  try {
    const out = execSync(`"${ffmpeg}" -i "${p}" -af volumedetect -f null - 2>&1`, { encoding: 'utf8' });
    const durMatch = out.match(/Duration: ([^,]+)/);
    const meanMatch = out.match(/mean_volume: ([^\n\r]+)/);
    const maxMatch = out.match(/max_volume: ([^\n\r]+)/);
    const dur = durMatch ? durMatch[1].trim() : 'unknown';
    const mean = meanMatch ? meanMatch[1].trim() : 'unknown';
    const max = maxMatch ? maxMatch[1].trim() : 'unknown';
    console.log(f.padEnd(25), dur.padEnd(15), mean.padEnd(12), max.padEnd(10));
  } catch (e) {
    console.log(f.padEnd(25), 'ERROR');
  }
});
