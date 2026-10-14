/**
 * parse_jutsu.js
 * Скрипт автоматического парсинга всех техник из файлов правил:
 * - Naruto_GM_Prompt_v0_3_2_Base.md (Регламент 0.3.2 Базовый)
 * - Naruto_GM_Prompt_v0_3_3_Tactical.md (Регламент 0.3.3 Тактический)
 *
 * Генерирует server/jutsuData.json и client/src/data/jutsuData.json
 * с поддержкой адаптации под выбранную версию игры!
 */

const fs = require('fs');
const path = require('path');

const promptPath32 = path.join(__dirname, 'rules', 'Naruto_GM_Prompt_v0_3_2_Base.md');
const promptPath33 = path.join(__dirname, 'rules', 'Naruto_GM_Prompt_v0_3_3_Tactical.md');
const serverOut = path.join(__dirname, 'server', 'jutsuData.json');
const clientOut = path.join(__dirname, 'client', 'src', 'data', 'jutsuData.json');

if (!fs.existsSync(promptPath32) || !fs.existsSync(promptPath33)) {
  console.error(`Файлы правил не найдены!`);
  process.exit(1);
}

const content32 = fs.readFileSync(promptPath32, 'utf-8');
const content33 = fs.readFileSync(promptPath33, 'utf-8');

const rangeMap33 = {
  'К': '[К] Контакт (до 3м)',
  'Б': '[Б] Ближняя (до 10м)',
  'С': '[С] Средняя (до 25м)',
  'Д': '[Д] Дальняя (до 40м)',
  'О': '[О] В пределах видимости (до 50м)',
  'Я': '[Я] На себя / зона'
};

const tagMap = {
  'Р': 'Реактивная контратака [Р]',
  'М': 'Реактивная мобильность [М]',
  'Г': 'Снятие гендзюцу [Г]'
};

function parseRulesFile(content, ver) {
  const lines = content.split(/\r?\n/);
  const result = new Map();
  let currentCategory = 'БАЗОВЫЕ';

  // 1. Извлекаем режимы 214–224 из раздела 4
  const modeRegex = /\*\*(\d+)\.\s+([^*]+)\*\*\s*(.*)/;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(modeRegex);
    if (match) {
      const id = parseInt(match[1], 10);
      const name = match[2].trim();
      const tagPart = match[3] || '';
      
      let cost = '';
      let descLines = [];
      
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (!nextLine || nextLine.startsWith('**') || nextLine.startsWith('#')) break;
        if (nextLine.toLowerCase().startsWith('расход:')) {
          cost = nextLine.replace(/расход:/i, '').trim();
        } else {
          descLines.push(nextLine.replace(/^[-\s*]+/, '').trim());
        }
      }

      const fullDesc = descLines.join('. ');
      const cleanDesc = fullDesc.replace(/\s*\[[А-ЯA-Z]\]/g, '').trim();

      const rangeMatch = tagPart.match(/\[([КБСДОЯ])\]/);
      const range = ver === '0.3.3'
        ? (rangeMatch ? (rangeMap33[rangeMatch[1]] || `[${rangeMatch[1]}]`) : '[Я] На себя')
        : 'На себя / Режим ауры';

      result.set(id, {
        id,
        name,
        category: 'РЕЖИМЫ И ПОКРОВЫ',
        element: 'Режим',
        rank: 'Режим',
        cost: cost || 'Поддержка чакрой',
        fullDesc,
        cleanDesc,
        range,
        rangeTag: rangeMatch ? rangeMatch[1] : 'Я',
        tags: ver === '0.3.3'
          ? ['[Режим] Усиление тела/чакры', range]
          : ['[Режим] Усиление тела/чакры']
      });
    }
  }

  // 2. Сканируем раздел 6
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('## ')) {
      currentCategory = line.replace('## ', '').replace(/\s*\([\d–, ]+\)/, '').trim();
      continue;
    }

    const numMatch = line.match(/^(\d+)\.\s+(.+?)\s+—\s+([A-S/]+|[А-Яa-z]+)\s+—\s+([^—]+?)\s+—\s+(.+)$/);
    if (numMatch) {
      const id = parseInt(numMatch[1], 10);
      const name = numMatch[2].trim();
      const rank = numMatch[3].trim();
      const cost = numMatch[4].trim();
      let fullDesc = numMatch[5].trim();

      const rangeMatch = fullDesc.match(/\[([КБСДОЯ])\]/);
      let range = ver === '0.3.3'
        ? (rangeMatch ? (rangeMap33[rangeMatch[1]] || `[${rangeMatch[1]}]`) : '[Я] На себя / зона')
        : (currentCategory.includes('БАЗОВЫЕ') ? 'Базовый радиус'
           : currentCategory.includes('ТАЙДЗЮЦУ') ? 'Ближний бой'
           : currentCategory.includes('ОГОНЬ') || currentCategory.includes('ВЕТЕР') || currentCategory.includes('МОЛНИЯ') || currentCategory.includes('ВОДА') || currentCategory.includes('ЗЕМЛЯ') ? 'Дистанция атаки'
           : 'Стандартный радиус');

      const tags = [];
      const tagMatches = fullDesc.matchAll(/\[([РМГ])\]/g);
      for (const tm of tagMatches) {
        if (tagMap[tm[1]]) tags.push(tagMap[tm[1]]);
      }
      if (ver === '0.3.3' && rangeMatch) {
        tags.push(rangeMap33[rangeMatch[1]] || `[${rangeMatch[1]}]`);
      }

      const cleanDesc = fullDesc.replace(/\s*\[[А-ЯA-Z]\]/g, '').trim();

      let element = 'Универсальное';
      if (currentCategory.includes('ОГОНЬ')) element = 'Огонь (Катон)';
      else if (currentCategory.includes('ВОДА')) element = 'Вода (Суйтон)';
      else if (currentCategory.includes('ВЕТЕР')) element = 'Ветер (Фуутон)';
      else if (currentCategory.includes('МОЛНИЯ')) element = 'Молния (Райтон)';
      else if (currentCategory.includes('ЗЕМЛЯ')) element = 'Земля (Дотон)';
      else if (currentCategory.includes('ТАЙДЗЮЦУ')) element = 'Тайдзюцу';
      else if (currentCategory.includes('ГЕНДЗЮЦУ')) element = 'Гендзюцу';
      else if (currentCategory.includes('ПЕЧАТИ')) element = 'Фуиндзюцу';
      else if (currentCategory.includes('МЕДИЦИНА')) element = 'Ирьёниндзюцу';
      else if (currentCategory.includes('ПРИЗЫВЫ')) element = 'Призыв';

      result.set(id, {
        id,
        name,
        category: currentCategory,
        element,
        rank,
        cost,
        fullDesc,
        cleanDesc,
        range,
        rangeTag: rangeMatch ? rangeMatch[1] : 'Я',
        tags: tags.length > 0 ? tags : ['Стандартное действие']
      });
      continue;
    }

    // Специальные предметы
    if (line.startsWith('- Военная пилюля')) {
      result.set(249, {
        id: 249,
        name: 'Военная пилюля (Хёроган)',
        category: 'МЕДИЦИНА',
        element: 'Предмет',
        rank: 'Предмет',
        cost: '0 (1 действие)',
        fullDesc: 'Мгновенно восстанавливает 30 000 чакры. Вторую за бой принимать нельзя (смертельный исход). Есть у всех бойцов.',
        cleanDesc: 'Мгновенно восстанавливает 30 000 чакры. Вторую за бой принимать нельзя (смертельный исход). Есть у всех бойцов.',
        range: ver === '0.3.3' ? '[Я] На себя' : 'На себя',
        rangeTag: 'Я',
        tags: ['Базовый предмет']
      });
    } else if (line.startsWith('- Бьякуго')) {
      result.set(250, {
        id: 250,
        name: 'Бьякуго (Печать Силы Сотни)',
        category: 'МЕДИЦИНА',
        element: 'Ирьёниндзюцу',
        rank: 'S',
        cost: 'Свободное действие (при чакре < 130 000)',
        fullDesc: 'Мгновенно восстанавливает 150 000 чакры и даёт мощную регенерацию смертельных ран на 3 раунда.',
        cleanDesc: 'Мгновенно восстанавливает 150 000 чакры и даёт мощную регенерацию смертельных ран на 3 раунда.',
        range: ver === '0.3.3' ? '[Я] На себя' : 'На себя',
        rangeTag: 'Я',
        tags: ['Свободное действие']
      });
    } else if (line.startsWith('- Техника поглощения чакры')) {
      result.set(251, {
        id: 251,
        name: 'Техника поглощения чакры',
        category: 'ТАКТИЧЕСКИЕ И ВСПОМОГАТЕЛЬНЫЕ',
        element: 'Чистая чакра',
        rank: 'A',
        cost: '15 000',
        fullDesc: ver === '0.3.3'
          ? 'Концентрация чакры в ладонях. Позволяет перехватить технику врага или схватить врага в ближнем бою. Восстанавливает чакру атаки. [К] [Р]'
          : 'Концентрация чакры в ладонях. Позволяет перехватить технику врага или схватить врага в ближнем бою. Восстанавливает чакру атаки. [Р]',
        cleanDesc: 'Концентрация чакры в ладонях. Позволяет перехватить технику врага или схватить врага в ближнем бою. Восстанавливает чакру атаки.',
        range: ver === '0.3.3' ? '[К] Контакт (до 3м)' : 'Ближний бой (контакт)',
        rangeTag: 'К',
        tags: ['Реактивная контратака [Р]']
      });
    }
  }

  return result;
}

const map32 = parseRulesFile(content32, '0.3.2');
const map33 = parseRulesFile(content33, '0.3.3');

const combinedList = [];

// Объединяем все техники 1..251
for (let id = 1; id <= 251; id++) {
  const item33 = map33.get(id);
  const item32 = map32.get(id);
  const base = item33 || item32;

  if (!base) {
    console.warn(`ВНИМАНИЕ: Техника #${id} не найдена в правилах!`);
    continue;
  }

  const desc33 = item33 ? item33.fullDesc : base.fullDesc;
  const desc32 = item32 ? item32.fullDesc : base.fullDesc;
  const cleanDesc33 = item33 ? item33.cleanDesc : base.cleanDesc;
  const cleanDesc32 = item32 ? item32.cleanDesc : base.cleanDesc;

  const range33 = item33 ? item33.range : '[Я] На себя';
  const range32 = item32 ? item32.range : 'Стандартный радиус';

  const tags33 = item33 ? item33.tags : ['Стандартное действие'];
  const tags32 = item32 ? item32.tags : ['Стандартное действие'];

  combinedList.push({
    id,
    name: base.name,
    category: base.category,
    element: base.element,
    rank: base.rank,
    cost: base.cost,
    
    // Версионные описания (полные и чистые)
    desc_v033: desc33,
    desc_v032: desc32,
    cleanDesc_v033: cleanDesc33,
    cleanDesc_v032: cleanDesc32,
    desc: desc33, // Дефолт v0.3.3

    // Версионная дальность и зоны
    range_v033: range33,
    range_v032: range32,
    range: range33, // Дефолт v0.3.3
    rangeTag: item33 ? item33.rangeTag : 'Я',

    // Версионные теги
    tags_v033: tags33,
    tags_v032: tags32,
    tags: tags33 // Дефолт v0.3.3
  });
}

combinedList.sort((a, b) => a.id - b.id);

console.log(`\n========================================`);
console.log(` ВСЕГО ОБЪЕДИНЕНО ТЕХНИК: ${combinedList.length}`);
console.log(` Версия 0.3.2 (Базовая): ${map32.size} техник`);
console.log(` Версия 0.3.3 (Тактическая): ${map33.size} техник`);
console.log(`========================================`);

fs.writeFileSync(serverOut, JSON.stringify(combinedList, null, 2), 'utf-8');
console.log(`✓ Записан серверный арсенал: ${serverOut}`);

fs.mkdirSync(path.dirname(clientOut), { recursive: true });
fs.writeFileSync(clientOut, JSON.stringify(combinedList, null, 2), 'utf-8');
console.log(`✓ Записан клиентский арсенал: ${clientOut}`);
