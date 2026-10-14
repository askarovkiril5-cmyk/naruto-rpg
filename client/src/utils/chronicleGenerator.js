/**
 * chronicleGenerator.js
 * Генератор литературной летописи сражения шиноби:
 * компилирует все скрытые ходы, литературные вердикты ИИ Ведущего,
 * досье участников и итог дуэли в связный рассказ/фанфик.
 */

export function generateBattleStory({
  messages = [],
  profile = null,
  battleMode = '1v1',
  roomId = 'KONOHA',
  gameVersion = '0.3.3',
  playerName = 'Шиноби'
}) {
  const dateStr = new Date().toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const modeTitle = battleMode === '2v2' 
    ? '👥 Командный бой 2 на 2 (4 шиноби)' 
    : '🗡️ Одиночная тактическая дуэль 1 на 1';

  let text = `========================================================================\n`;
  text += `📜 ЛЕТОПИСЬ БОЯ ШИНОБИ: ХРОНИКА СРАЖЕНИЯ НА АРЕНЕ КОНОХИ\n`;
  text += `========================================================================\n\n`;

  text += `📅 Дата поединка: ${dateStr}\n`;
  text += `⛩️ Комната: ${roomId}\n`;
  text += `⚔️ Формат сражения: ${modeTitle}\n`;
  text += `📜 Регламент судейства: Версия ${gameVersion} ${gameVersion === '0.3.3' ? '(Тактическая с баллистикой и дистанциями)' : '(Базовая динамическая)'}\n\n`;

  // Досье шиноби
  if (profile) {
    text += `------------------------------------------------------------------------\n`;
    text += `🥷 ДОСЬЕ ГЛАВНОГО ШИНОБИ:\n`;
    text += `• Имя: ${profile.name || playerName}\n`;
    text += `• Клан: ${profile.clan} (${profile.clanTag || 'Мастер'})\n`;
    text += `• Боевой архетип: ${profile.archetype || 'Универсал'}\n`;
    text += `• Родные стихии: ${profile.elements ? profile.elements.join(', ') : 'Не указаны'}\n`;
    text += `• Базовый резерв чакры: ${(profile.maxChakra || profile.chakra || 0).toLocaleString()} ед.\n`;
    text += `• Скорость рывка: ${profile.speed || 28} м/с | Время реакции: ${profile.reaction || 180} мс\n`;
    if (profile.kekkeiGenkai) {
      text += `• Додзюцу / Кеккей Генкай: ${profile.kekkeiGenkai}\n`;
    }
    if (profile.passives && profile.passives.length > 0) {
      text += `• Особые пассивные черты:\n`;
      profile.passives.forEach(p => { text += `   - ${p}\n`; });
    }
    text += `------------------------------------------------------------------------\n\n`;
  }

  text += `========================================================================\n`;
  text += `📖 ХОД СРАЖЕНИЯ (РАУНД ЗА РАУНДОМ)\n`;
  text += `========================================================================\n\n`;

  if (!messages || messages.length === 0) {
    text += `(В этом поединке пока не было зафиксировано ходов)\n`;
    return text;
  }

  let roundCounter = 0;

  messages.forEach((m) => {
    if (!m) return;

    if (m.type === 'system') {
      text += `\n[СИСТЕМА] ${m.text}\n\n`;
    } else if (m.type === 'gm') {
      roundCounter++;
      const title = m.authorName || `ИИ Ведущий (Раунд ${roundCounter})`;
      text += `\n------------------------------------------------------------------------\n`;
      text += `📜 ${title.toUpperCase()} [${m.time || ''}]\n`;
      text += `------------------------------------------------------------------------\n`;
      text += `${m.text.trim()}\n\n`;
    } else {
      // Ход игрока / оппонента
      const author = m.authorName || (m.type === 'player' ? 'Вы' : 'Оппонент');
      const teamTag = m.team ? (m.team === 'blue' ? ' [🔵 Команда Синих]' : ' [🔴 Команда Красных]') : '';
      text += `🥷 ${author}${teamTag} (${m.time || ''}):\n`;
      text += `   «${m.text.trim()}»\n\n`;
    }
  });

  text += `========================================================================\n`;
  text += `🏆 КОНЕЦ ЛЕТОПИСИ БОЯ ШИНОБИ\n`;
  text += `Записано Свитком Арены Деревни Скрытого Листа.\n`;
  text += `========================================================================\n`;

  return text;
}

/**
 * Скачивание летописи в файл на диск
 */
export function downloadChronicleFile(content, filename = 'Naruto_Battle_Chronicle.txt') {
  try {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Download chronicle error:', err);
    return false;
  }
}
