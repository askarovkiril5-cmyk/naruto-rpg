const { execSync } = require('child_process');
const ffmpeg = './server/node_modules/ffmpeg-static/ffmpeg.exe';
const files = ['chidori.mp3', 'kirin.mp3', 'shinra_tensei.mp3', 'rasengan.mp3', 'amaterasu.mp3', 'kamui.mp3', 'kage_bunshin.mp3', 'raikiri.mp3'];

files.forEach(f => {
  const p = './client/public/audio/voices/' + f;
  try {
    const out = execSync(`"${ffmpeg}" -i "${p}" -af silencedetect=noise=-30dB:d=0.3 -f null -`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    console.log('=== ' + f + ' ===');
    const lines = out.split('\n').filter(l => l.includes('silence_') || l.includes('Duration'));
    console.log(lines.join('\n'));
  } catch(e) {
    console.log('=== ' + f + ' ===');
    const combined = (e.stdout || '') + (e.stderr || '');
    const lines = combined.split('\n').filter(l => l.includes('silence_') || l.includes('Duration'));
    console.log(lines.join('\n'));
  }
});
