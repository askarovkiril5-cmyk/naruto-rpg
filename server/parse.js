const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '..', 'rules', 'Naruto_GM_Prompt_v0_3_3_Tactical.md');
const outputPath = path.join(__dirname, 'jutsuData.json');

const content = fs.readFileSync(mdPath, 'utf-8');
const lines = content.split(/\r?\n/);

const jutsuList = [];
let currentCategory = 'Базовые';

// Словарь расшифровки меток дальности и типа
const rangeDescriptions = {
  'К': '[К] Контактная (до 3м)',
  'Б': '[Б] Ближняя (до 10м)',
  'С': '[С] Средняя (до 25м)',
  'Д': '[Д] Дальняя (до 40м)',
  'О': '[О] Прямая видимость (до 50м)',
  'Я': '[Я] На себя / зона вокруг'
};

const tagDescriptions = {
  'Р': '[Р] Реактивная контратака',
  'М': '[М] Реактивная мобильность (уклонение)',
  'Г': '[Г] Реакция на гендзюцу'
};

// 1. Сначала извлекаем режимы 214–224 из Раздела 4
const modesMap = new Map();
const modeRegex = /\*\*(\d+)\.\s+([^*]+)\*\*\s*(.*)/;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  const match = line.match(modeRegex);
  if (match) {
    const id = parseInt(match[1]);
    const name = match[2].trim();
    const tagPart = match[3] || '';
    
    let cost = '';
    let descLines = [];
    
    // Считываем следующие строки описания режима
    for (let j = i + 1; j < lines.length; j++) {
      const nextLine = lines[j].trim();
      if (!nextLine || nextLine.startsWith('**') || nextLine.startsWith('#')) break;
      if (nextLine.toLowerCase().startsWith('расход:')) {
        cost = nextLine.replace(/расход:/i, '').trim();
      } else {
        descLines.push(nextLine.replace(/^[-\s*]+/, '').trim());
      }
    }

    const rangeMatch = tagPart.match(/\[([КБСДОЯ])\]/);
    const range = rangeMatch ? (rangeDescriptions[rangeMatch[1]] || `[${rangeMatch[1]}]`) : '[Я] На себя / зона вокруг';

    modesMap.set(id, {
      id,
      name,
      category: 'Режимы и покровы',
      rank: 'Режим',
      cost: cost || 'Поддержка чакрой',
      desc: descLines.join('. '),
      range,
      tags: ['[Режим] Усиление тела/чакры']
    });
  }
}

// 2. Сканируем Раздел 6 на предмет всех 248 техник
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // Отслеживаем категорию
  if (line.startsWith('## ')) {
    currentCategory = line.replace('## ', '').replace(/\s*\([\d–, ]+\)/, '').trim();
    continue;
  }

  // Обычные нумерованные техники: 1. Каварими ... — D — 1 500 — эффект [М] [Я]
  const numMatch = line.match(/^(\d+)\.\s+(.+?)\s+—\s+([A-S/]+|[А-Яa-z]+)\s+—\s+([^—]+?)\s+—\s+(.+)$/);
  if (numMatch) {
    const id = parseInt(numMatch[1]);
    const name = numMatch[2].trim();
    const rank = numMatch[3].trim();
    const cost = numMatch[4].trim();
    let desc = numMatch[5].trim();

    // Извлекаем теги дальности
    const rangeMatch = desc.match(/\[([КБСДОЯ])\]/);
    const range = rangeMatch ? (rangeDescriptions[rangeMatch[1]] || `[${rangeMatch[1]}]`) : 'Уточняется';

    // Извлекаем теги реакции [Р], [М], [Г]
    const tags = [];
    const tagMatches = desc.matchAll(/\[([РМГ])\]/g);
    for (const tm of tagMatches) {
      if (tagDescriptions[tm[1]]) {
        tags.push(tagDescriptions[tm[1]]);
      }
    }

    // Очищаем описание от скобок тегов в конце
    const cleanDesc = desc.replace(/\s*\[[А-ЯA-Z]\]/g, '').trim();

    jutsuList.push({
      id,
      name,
      category: currentCategory,
      rank,
      cost,
      desc: cleanDesc,
      range,
      tags: tags.length > 0 ? tags : ['Стандартное действие']
    });
    continue;
  }

  // Особые специальные предметы и техники без номера
  if (line.startsWith('- Военная пилюля')) {
    jutsuList.push({
      id: 249,
      name: 'Военная пилюля (Хёроган)',
      category: 'Медицина (Базовый предмет)',
      rank: 'Предмет',
      cost: '0 (1 действие)',
      desc: 'Мгновенно восстанавливает 30 000 чакры. Вторую за бой принимать нельзя (смертельный исход). Есть у всех.',
      range: '[Я] На себя',
      tags: ['Базовый предмет']
    });
  } else if (line.startsWith('- Бьякуго')) {
    jutsuList.push({
      id: 250,
      name: 'Бьякуго (Печать Силы Сотни)',
      category: 'Медицина',
      rank: 'S',
      cost: 'Свободное действие (при чакре < 130 000)',
      desc: 'Мгновенно восстанавливает 150 000 чакры и дает мощную регенерацию смертельных ран на 3 раунда.',
      range: '[Я] На себя',
      tags: ['Свободное действие']
    });
  } else if (line.startsWith('- Техника поглощения чакры')) {
    jutsuList.push({
      id: 251,
      name: 'Техника поглощения чакры',
      category: 'Тактические и вспомогательные',
      rank: 'A',
      cost: '15 000',
      desc: 'Концентрация чакры в ладонях. Перехват техники врага или захват в ближнем бою. Восстанавливает чакру атаки.',
      range: '[К] Контактная',
      tags: ['[Р] Реактивная контратака']
    });
  }
}

// Добавляем режимы 214–224
for (const [id, mode] of modesMap.entries()) {
  jutsuList.push(mode);
}

// Сортируем строго по ID
jutsuList.sort((a, b) => a.id - b.id);

console.log(`Успешно обработано техник: ${jutsuList.length}`);

// Записываем итоговый файл в server и client
fs.writeFileSync(outputPath, JSON.stringify(jutsuList, null, 2), 'utf-8');
console.log(`Файл записан в: ${outputPath}`);

const clientOutputPath = path.join(__dirname, '..', 'client', 'src', 'data', 'jutsuData.json');
try {
  fs.writeFileSync(clientOutputPath, JSON.stringify(jutsuList, null, 2), 'utf-8');
  console.log(`Файл также синхронизирован в: ${clientOutputPath}`);
} catch (e) {
  console.warn('Не удалось обновить клиентский jutsuData.json:', e.message);
}
