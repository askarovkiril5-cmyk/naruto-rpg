const { execSync } = require('child_process');
const ffmpeg = './server/node_modules/ffmpeg-static/ffmpeg.exe';

// Создаем 2-секундный идеальный клип Чидори:
// В файле 'chidori.mp3', отрезаем первые секунды если там тишина, оставляем чистый выкрик
try {
  // Тестируем извлечение с 0 по 3 секунду
  execSync(`"${ffmpeg}" -y -i "client/public/audio/voices/chidori.mp3" -ss 00:00:00 -t 3 -af "loudnorm=I=-14:LRA=7:TP=-1" "client/public/audio/voices/test_chidori.mp3"`);
  console.log('Chidori trimmed successfully');
} catch(e) {
  console.error(e.message);
}
