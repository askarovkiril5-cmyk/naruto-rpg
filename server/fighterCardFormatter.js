/**
 * fighterCardFormatter.js
 * Генератор каноничных карточек бойцов по разделу «2. ХОД ИГРЫ» правил v0.3.2 и v0.3.3.
 * Формат каждой карточки:
 * Заголовок «🔴 КАРТОЧКА: Имя» (или «🔵 КАРТОЧКА: Имя»)
 * Таблица «Параметр | Значение»
 * Таблица «Техники | Ранг | Расход | Эффект» (техники глаз, клана и хвостатого)
 */

function formatCanonicalMarkdownCard(player, teamColor = 'red') {
  const p = player || {};
  const c = p.character || {};
  const icon = teamColor === 'blue' ? '🔵' : '🔴';
  const name = p.name || 'Шиноби';

  // Глаза
  const eye = c.eye;
  let eyeStr = 'Нет додзюцу';
  if (eye && eye.id !== 'none' && eye.name !== 'Без додзюцу') {
    eyeStr = `${eye.name} (${eye.stage || ''}): Предвидение +${c.predvidenie || eye.predvidenie || 0}%, Точность +${eye.accuracy || 0}%, Усиление +${eye.techniqueAmp || 0}%${eye.speedBonusPercent ? `, Скорость +${eye.speedBonusPercent}%` : ''}, Поддержка: ${eye.upkeep || '0'}/ход. ${eye.passives ? eye.passives.join('; ') : ''}`;
  }

  // Стихии
  const elements = (c.elements && c.elements.length > 0) ? c.elements : ['Огонь'];
  const nativeEl = elements[0];
  const elementsStr = elements.map(el => el === nativeEl ? `${el} (родная: −20% расхода, +25% силы)` : el).join(', ');

  // Хвостатый
  const bijuStr = c.bijuu ? `${c.bijuu.name} (+${c.bijuu.chakraBonus?.toLocaleString()} к чакре)` : 'Отсутствует';

  // Клан и архетип
  const clanTitle = `${c.clan || 'Коноха'} («${c.clanTag || 'Шиноби'}»)`;

  // Таблица 1: Параметр | Значение
  let rows = [
    `| **Клан** | ${clanTitle} |`,
    `| **Макс. чакра** | ${(c.maxChakra || c.chakra || 100000).toLocaleString('ru-RU')} ед. |`,
    `| **Восстановление/раунд** | +${(c.chakraRegen || 5000).toLocaleString('ru-RU')} ед./ход |`,
    `| **Физическая скорость** | ${c.baseSpeed || c.speed || 24} м/с |`,
    `| **Реакция** | ${c.baseReaction || c.reaction || 160} мс |`,
    `| **Стихии** | ${elementsStr} |`,
    `| **Хвостатый** | ${bijuStr} |`,
    `| **Глаза** | ${eyeStr} |`
  ];

  if (c.hasSenjutsu) {
    rows.push(`| **Сендзюцу** | Режим Мудреца усилен (расход снижен до 10 000/ход, без ограничения в 5 раундов) |`);
  }

  const table1 = `| Параметр | Значение |\n| :--- | :--- |\n${rows.join('\n')}`;

  // Таблица 2: Техники (глаза + клановые + хвостатого)
  const autoJutsu = Array.isArray(c.autoJutsu) ? c.autoJutsu : [];
  let table2 = '';

  if (autoJutsu.length > 0) {
    const techRows = autoJutsu.map(j => {
      const desc = (j.desc || j.description || j.effect || 'Клановая техника').replace(/\|/g, '/');
      return `| ${j.name} | ${j.rank || 'A'} | ${j.cost || '20 000'} | ${desc} |`;
    });
    table2 = `\n\n**Врождённые техники сверх 30 слотов (глаза, клан, хвостатый):**\n\n| Техника | Ранг | Расход | Эффект |\n| :--- | :--- | :--- | :--- |\n${techRows.join('\n')}`;
  }

  return `### ${icon} КАРТОЧКА: ${name}\n\n${table1}${table2}`;
}

module.exports = {
  formatCanonicalMarkdownCard
};
