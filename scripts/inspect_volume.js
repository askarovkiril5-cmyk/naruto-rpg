const { execSync } = require('child_process');
const ffmpeg = './server/node_modules/ffmpeg-static/ffmpeg.exe';
const fs = require('fs');

const files = ['chidori.mp3', 'rasengan.mp3', 'shinra_tensei.mp3', 'amaterasu.mp3', 'kamui.mp3', 'kage_bunshin.mp3'];

files.forEach(f => {
  const p = `client/public/audio/voices/${f}`;
  try {
    const proc = execSync(`"${ffmpeg}" -i "${p}" -af "volumedetect" -f null - 2>&1`, { encoding: 'utf8' });
    const mean = proc.match(/mean_volume: ([\d.-]+ dB)/);
    const max = proc.match(/max_volume: ([\d.-]+ dB)/);
    const dur = proc.match(/Duration: ([\d:.]+)/);
    console.log(f.padEnd(20), 'Dur:', dur ? dur[1] : '?', 'Max:', max ? max[1] : '?', 'Mean:', mean ? mean[1] : '?');
  } catch(e) {
    console.log(f, e.message);
  }
});
