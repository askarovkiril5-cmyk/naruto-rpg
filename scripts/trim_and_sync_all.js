const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const ffmpeg = path.join(rootDir, 'server', 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');
const pubVoicesDir = path.join(rootDir, 'client', 'public', 'audio', 'voices');
const distVoicesDir = path.join(rootDir, 'client', 'dist', 'audio', 'voices');
const srvVoicesDir = path.join(rootDir, 'server', 'public', 'audio', 'voices');
const tempDir = path.join(rootDir, 'scripts', 'temp_voices');

[pubVoicesDir, distVoicesDir, srvVoicesDir, tempDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

console.log('=== Trimming Canonical Voice Files ===');

// Exact cut points for canonical anime voice lines
const CUTS = [
  {
    src: 'clean_chidori.mp3',
    dest: 'chidori.mp3',
    ss: '00:00:00.25',
    duration: 2.3,
    fadeStart: 2.0,
    fadeDur: 0.3
  },
  {
    src: 'rasengan.mp3',
    dest: 'rasengan.mp3',
    ss: '00:00:00.12',
    duration: 2.2,
    fadeStart: 1.9,
    fadeDur: 0.3
  },
  {
    src: 'shinra_tensei.mp3',
    dest: 'shinra_tensei.mp3',
    ss: '00:00:00.12',
    duration: 2.4,
    fadeStart: 2.1,
    fadeDur: 0.3
  },
  {
    src: 'amaterasu.mp3',
    dest: 'amaterasu.mp3',
    ss: '00:00:00.00',
    duration: 2.0,
    fadeStart: 1.7,
    fadeDur: 0.3
  },
  {
    src: 'kamui.mp3',
    dest: 'kamui.mp3',
    ss: '00:00:00.00',
    duration: 2.0,
    fadeStart: 1.7,
    fadeDur: 0.3
  },
  {
    src: 'kage_bunshin.mp3',
    dest: 'kage_bunshin.mp3',
    ss: '00:00:00.40',
    duration: 2.5,
    fadeStart: 2.2,
    fadeDur: 0.3
  }
];

CUTS.forEach(item => {
  const srcPath = path.join(pubVoicesDir, item.src);
  if (!fs.existsSync(srcPath)) {
    console.warn(`Source missing: ${item.src}`);
    return;
  }
  const tempOut = path.join(tempDir, `trimmed_${item.dest}`);
  const finalOut = path.join(pubVoicesDir, item.dest);

  console.log(`Trimming ${item.src} -> ${item.dest} (${item.duration}s)...`);
  try {
    const cmd = `"${ffmpeg}" -y -i "${srcPath}" -ss ${item.ss} -t ${item.duration} -af "afade=t=in:ss=0:d=0.04,afade=t=out:st=${item.fadeStart}:d=${item.fadeDur},loudnorm=I=-14:LRA=7:TP=-1" "${tempOut}"`;
    execSync(cmd, { stdio: 'ignore' });
    if (fs.existsSync(tempOut)) {
      fs.copyFileSync(tempOut, finalOut);
      fs.unlinkSync(tempOut);
      console.log(` -> Saved ${item.dest} (${(fs.statSync(finalOut).size / 1024).toFixed(1)} KB)`);
    }
  } catch (err) {
    console.error(`Error processing ${item.dest}:`, err.message);
  }
});

// All 10 active files to synchronize
const ACTIVE_FILES = [
  'chidori.mp3',
  'rasengan.mp3',
  'shinra_tensei.mp3',
  'amaterasu.mp3',
  'kamui.mp3',
  'kage_bunshin.mp3',
  'sfx_chidori_stream.mp3',
  'sfx_fire_blast.mp3',
  'sfx_water_dragon.mp3',
  'sfx_kaiten_spin.mp3'
];

console.log('\n=== Synchronizing Audio Assets to dist and server ===');
ACTIVE_FILES.forEach(file => {
  const src = path.join(pubVoicesDir, file);
  if (!fs.existsSync(src)) {
    console.warn(`Warning: active file not found: ${file}`);
    return;
  }
  [distVoicesDir, srvVoicesDir].forEach(targetDir => {
    const dest = path.join(targetDir, file);
    fs.copyFileSync(src, dest);
  });
  console.log(`Synced ${file} (${(fs.statSync(src).size / 1024).toFixed(1)} KB)`);
});

console.log('\n=== Audio Trim & Sync Complete! ===');
