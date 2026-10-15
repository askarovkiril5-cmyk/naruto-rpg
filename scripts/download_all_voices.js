const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const ytdlpPath = path.join(rootDir, 'scripts', 'yt-dlp.exe');
const ffmpegPath = path.join(rootDir, 'server', 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');

const targetDirs = [
  path.join(rootDir, 'client', 'public', 'audio', 'voices'),
  path.join(rootDir, 'client', 'dist', 'audio', 'voices'),
  path.join(rootDir, 'server', 'public', 'audio', 'voices')
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const tempDir = path.join(rootDir, 'scripts', 'temp_voices');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// 18 каноничных техник с проверенными короткими клипами
const VOICE_TRACKS = [
  {
    key: 'chidori',
    filename: 'chidori.mp3',
    url: 'https://www.youtube.com/watch?v=qDV3Ec1qDk8',
    maxDuration: 5
  },
  {
    key: 'shinra_tensei',
    filename: 'shinra_tensei.mp3',
    url: 'https://www.youtube.com/watch?v=7VZoDYc3Y40',
    maxDuration: 6
  },
  {
    key: 'amaterasu',
    filename: 'amaterasu.mp3',
    url: 'https://www.youtube.com/watch?v=s5RNTdR3V9g',
    maxDuration: 5
  },
  {
    key: 'kamui',
    filename: 'kamui.mp3',
    url: 'https://www.youtube.com/watch?v=pRxzLuHrWKY',
    maxDuration: 4
  },
  {
    key: 'rasengan',
    filename: 'rasengan.mp3',
    url: 'https://www.youtube.com/watch?v=qODByY9FJto',
    maxDuration: 5
  },
  {
    key: 'raikiri',
    filename: 'raikiri.mp3',
    query: 'ytsearch1:kakashi raikiri sound effect',
    maxDuration: 6
  },
  {
    key: 'kirin',
    filename: 'kirin.mp3',
    query: 'ytsearch1:sasuke kirin sound effect',
    maxDuration: 7
  },
  {
    key: 'oodama_rasengan',
    filename: 'oodama_rasengan.mp3',
    query: 'ytsearch1:naruto oodama rasengan sound effect',
    maxDuration: 6
  },
  {
    key: 'kage_bunshin',
    filename: 'kage_bunshin.mp3',
    query: 'ytsearch1:kage bunshin no jutsu sound effect',
    maxDuration: 5
  },
  {
    key: 'katon_gokakyu',
    filename: 'katon_gokakyu.mp3',
    query: 'ytsearch1:katon goukakyuu no jutsu sound effect',
    maxDuration: 6
  },
  {
    key: 'katon_hosenka',
    filename: 'katon_hosenka.mp3',
    query: 'ytsearch1:katon housenka sound effect',
    maxDuration: 6
  },
  {
    key: 'suiton_suiryudan',
    filename: 'suiton_suiryudan.mp3',
    query: 'ytsearch1:suiton suiryudan no jutsu sound effect',
    maxDuration: 7
  },
  {
    key: 'tsukuyomi',
    filename: 'tsukuyomi.mp3',
    query: 'ytsearch1:itachi tsukuyomi sound effect',
    maxDuration: 5
  },
  {
    key: 'susanoo',
    filename: 'susanoo.mp3',
    query: 'ytsearch1:susanoo sound effect japanese',
    maxDuration: 6
  },
  {
    key: 'chibaku_tensei',
    filename: 'chibaku_tensei.mp3',
    query: 'ytsearch1:pain chibaku tensei sound effect japanese',
    maxDuration: 7
  },
  {
    key: 'hakke_64',
    filename: 'hakke_64.mp3',
    query: 'ytsearch1:neji eight trigrams 64 palms sound effect',
    maxDuration: 7
  },
  {
    key: 'kaiten',
    filename: 'kaiten.mp3',
    query: 'ytsearch1:neji kaiten sound effect',
    maxDuration: 6
  },
  {
    key: 'hachimon_kai',
    filename: 'hachimon_kai.mp3',
    query: 'ytsearch1:might guy eight gates open sound effect',
    maxDuration: 6
  }
];

console.log('=== Starting Download of All 18 Authentic Anime Voice Lines ===');

for (const track of VOICE_TRACKS) {
  const destPath = path.join(tempDir, track.filename);
  const targetSource = track.url || track.query;

  // Если файл уже есть в public, проверяем размер
  const pubPath = path.join(rootDir, 'client', 'public', 'audio', 'voices', track.filename);
  if (fs.existsSync(pubPath) && fs.statSync(pubPath).size > 15000) {
    console.log(`[Already Exists]: ${track.filename} (${(fs.statSync(pubPath).size / 1024).toFixed(1)} KB)`);
    // Синхронизируем в dist и server
    targetDirs.forEach(dir => {
      const p = path.join(dir, track.filename);
      if (!fs.existsSync(p)) fs.copyFileSync(pubPath, p);
    });
    continue;
  }

  console.log(`\n[Downloading]: ${track.key} -> ${track.filename}...`);
  try {
    const rawDest = path.join(tempDir, `raw_${track.filename}`);
    const cmd = `"${ytdlpPath}" --extract-audio --audio-format mp3 --audio-quality 0 --ffmpeg-location "${ffmpegPath}" -o "${rawDest}" "${targetSource}"`;
    execSync(cmd, { stdio: 'inherit' });

    if (fs.existsSync(rawDest)) {
      // Обрезаем до нужной длины и нормализуем громкость через ffmpeg
      console.log(` -> Normalizing & trimming to ${track.maxDuration}s max...`);
      const trimCmd = `"${ffmpegPath}" -y -i "${rawDest}" -t ${track.maxDuration} -af "loudnorm=I=-14:LRA=7:TP=-1" "${destPath}"`;
      execSync(trimCmd, { stdio: 'ignore' });

      const finalPath = fs.existsSync(destPath) ? destPath : rawDest;

      // Копируем во все целевые директории
      targetDirs.forEach(dir => {
        const p = path.join(dir, track.filename);
        fs.copyFileSync(finalPath, p);
        console.log(` -> Copied to ${p} (${(fs.statSync(p).size / 1024).toFixed(1)} KB)`);
      });

      try { fs.unlinkSync(rawDest); } catch(e) {}
    }
  } catch (err) {
    console.error(`[Error downloading ${track.key}]:`, err.message);
  }
}

console.log('\n=== All voice lines download process complete! ===');
