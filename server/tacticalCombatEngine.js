/**
 * =======================================================================
 * 🥋 TACTICAL COMBAT ENGINE (NARUTO RPG v0.3.3 & v0.3.2)
 * Каноничное тактическое ИИ-судейство по регламенту правил:
 * 
 * 1. Многослойный парсинг действий (1-3 действия за раунд):
 *    - Режимы и покровы ([Я], [Режим]: #214 Покров чакры, #216 Райтон но Ёрой, #217 Врата, #223 Плащ, Сусаноо, Додзюцу)
 *    - Тактическая подготовка / метки (#9 Хирайсин-метки, #5 кибаку, #14 клоны, #10 туман)
 *    - Оружие и экипировка (катана, меч, сюрикены #22)
 *    - Перемещение и скорости (спринт, рывок, отскок, сближение на скорости)
 *    - Ближний контактный бой ([К]: #94 Расенган, #57 Чидори, #11 Коноха Сэмпу, #201 Дзюкэн, удары оружием)
 *    - Дальнобойные снаряды ([С], [Д]: #35 Гокакю, #48 Ренкудан, #60 Гиан, #83 Суйрюдан)
 *    - Защитные барьеры и стены ([Защита]: #69 Дорюхэки, #84 Суйдзинхэки, #206 Кайтен, #114 Кэккай)
 *    - Реактивная мобильность ([М]: #1 Каварими, #7 Сюнсин, #9 Хирайсин при метке, #239 Отскок, #242 Мгновенный шаг)
 *    - Реактивные контратаки ([Р]: #991 Камуи, #281 Обратный разряд, #225 Каиши, #234 Клон-щит, #996 Прета)
 *    - Снятие иллюзий ([Г]: #4 Кай, #230 Разрыв иллюзии)
 * 
 * 2. Физика и правила Раздела 7:
 *    - Скорости снарядов: Молния 80, Ветер 60, Оружие 40, Огонь 35, Додзюцу 30, Вода 25, Земля 15 м/с
 *    - Баллистика t = S / V
 *    - Нервная проверка: t_react = react_ms * (1 - predvidenie/100) / 1000
 *    - В ближнем бою (до 3м): быстрее реагирует тот, у кого t_react меньше!
 *    - Проверка тела: отношение скоростей (>2.0, 1.5-2.0, <1.5)
 *    - Автоматическое срабатывание реактивных техник ([М] Хирайсин/Каварими, [Р] Камуи/контрудар)
 *    - Столкновение техник (Clash: Power = Rank * (1 + amp + elem)) — ТОЛЬКО для встречных атак!
 *    - Броня из чакры: Райтон но Ёрой (ранг A), Сусаноо (B/A/S), Покров чакры
 * 
 * 3. Кинематографичный 3-абзацный сюжет с РЕАЛЬНЫМИ ИМЕНАМИ и блок «⚖ Почему так»
 * =======================================================================
 */

const fs = require('path');

// Загрузка базы 251 техники
let ALL_JUTSU = [];
try {
  ALL_JUTSU = require('./jutsuData.json');
} catch (e) {
  try {
    ALL_JUTSU = require('../client/src/data/jutsuData.json');
  } catch (err) {
    console.warn('[TacticalEngine] Не удалось загрузить jutsuData.json');
    ALL_JUTSU = [];
  }
}

// Скорости снарядов и техник по Разделу 7 правил v0.3.3
const PROJECTILE_SPEEDS = {
  LIGHTNING: 80, // Молния 80 м/с
  WIND: 60,      // Ветер 60 м/с
  FIRE: 35,      // Огонь 35 м/с
  WATER: 25,     // Вода 25 м/с
  EARTH: 15,     // Земля 15 м/с
  WEAPON: 40,    // Оружие / сюрикены / кунаи 40 м/с
  DOJUTSU: 30,   // Аматерасу / техники глаз 30 м/с
  CONTACT: 0     // Контактный ближний бой [К] (мгновенно при сближении)
};

// Круг стихий: кто кого побеждает
const ELEMENT_ADVANTAGES = {
  'Огонь': 'Ветер',
  'Ветер': 'Молния',
  'Молния': 'Земля',
  'Земля': 'Вода',
  'Вода': 'Огонь'
};

// Численные ранги для формулы столкновения
const RANK_VALUES = {
  'D': 1,
  'C': 2,
  'B': 3,
  'A': 4,
  'S': 5
};

/**
 * Классификация типа техники по канону книги
 */
function classifyJutsu(jutsu) {
  if (!jutsu) return 'UNKNOWN';
  const id = jutsu.id;
  const name = (jutsu.name || '').toLowerCase();
  const cat = (jutsu.category || '').toLowerCase();
  const tags = (jutsu.tags || []).join(' ').toLowerCase();
  const range = jutsu.range || '';

  // 1. Режимы и покровы ([Я], [Режим])
  if (id === 214 || id === 216 || id === 217 || id === 223 || id === 215 || id === 74 || id === 994 ||
      tags.includes('[режим]') || tags.includes('усиление тела') || cat.includes('режимы') || name.includes('покров')) {
    return 'MODE';
  }
  // 2. Реактивная мобильность ([М])
  if (id === 1 || id === 7 || (id === 9 && !name.includes('бросок')) || id === 239 || id === 240 || id === 242 || id === 245 ||
      tags.includes('[м]') || tags.includes('мобильность (уклонение)')) {
    return 'REACTIVE_MOBILITY';
  }
  // 3. Реактивные контратаки ([Р])
  if (id === 991 || id === 281 || id === 225 || id === 226 || id === 227 || id === 229 || id === 234 || id === 996 ||
      tags.includes('[р]') || tags.includes('контратака') || name.includes('контрудар') || name.includes('редирект')) {
    return 'REACTIVE_COUNTER';
  }
  // 4. Защитные техники (стены, щиты, барьеры)
  if (id === 69 || id === 84 || id === 90 || id === 53 || id === 114 || id === 206 || id === 210 ||
      name.includes('стена') || name.includes('щит') || name.includes('барьер') || name.includes('купол') || name.includes('кайтен')) {
    return 'DEFENSE';
  }
  // 5. Тактическая подготовка / метки / клоны / туман
  if (id === 5 || id === 10 || id === 14 || id === 2 || id === 87 || id === 117 ||
      name.includes('клон') || name.includes('туман') || name.includes('печать') || name.includes('двойник')) {
    return 'SETUP';
  }
  // 6. Контактные удары ближнего боя ([К])
  if (id === 94 || id === 95 || id === 96 || id === 97 || id === 57 || id === 58 || id === 59 ||
      id === 11 || id === 12 || id === 201 || id === 202 || id === 204 || id === 205 || id === 33 ||
      range.includes('[К]') || name.includes('расенган') || name.includes('чидори') || name.includes('райкири') || name.includes('кулак')) {
    return 'MELEE_ATTACK';
  }
  // 7. Глазные и пространственные абсолюты ([О])
  if (id === 992 || id === 993 || id === 995 || id === 214 || id === 215) {
    return 'SPECIAL_OCULAR';
  }
  // 8. Дальнобойные снаряды ([С], [Д], [О])
  if (range.includes('[С]') || range.includes('[Д]') || range.includes('[О]') || id === 22 || id === 35 || id === 48 || id === 60 || id === 83) {
    return 'RANGED_ATTACK';
  }

  return 'ATTACK';
}

/**
 * Словарь ключевых корней для точного распознавания техник
 */
const COMMON_ROOTS = [
  { roots: ['каварими', 'подмен', 'замен'], id: 1 },
  { roots: ['бунсин', 'двойник', 'иллюзорн.*клон'], id: 2 },
  { roots: ['хэнгэ', 'превращен'], id: 3 },
  { roots: ['кай', 'рассеиван'], id: 4 },
  { roots: ['взрывн.*печат', 'кибаку'], id: 5 },
  { roots: ['сюнсин', 'телесн.*мерцан'], id: 7 },
  { roots: ['хирайсин', 'летящ.*бог.*гром'], id: 9 },
  { roots: ['кирикакурэ', 'туман'], id: 10 },
  { roots: ['коноха.*сэмпу', 'вихр.*лист'], id: 11 },
  { roots: ['омотэ.*рэнгэ', 'первичн.*лотос', 'лотос'], id: 12 },
  { roots: ['каге.*бунсин', 'теневое.*клонирован', 'теневы.*клон'], id: 14 },
  { roots: ['сюрикен', 'кунай', 'сенбон'], id: 22 },

  // Огонь
  { roots: ['гокакю', 'огненн.*шар', 'шар.*огн'], id: 35 },
  { roots: ['хосэнк', 'цвет.*феникс'], id: 36 },
  { roots: ['рюка', 'дракон.*плам', 'огненн.*дракон'], id: 37 },
  { roots: ['хайсэкисё', 'пепельн.*облак'], id: 38 },
  { roots: ['гока.*массицу', 'огненн.*волн'], id: 39 },
  { roots: ['огненн.*клинок'], id: 40 },
  { roots: ['огненн.*лавин'], id: 41 },
  { roots: ['огненн.*купол'], id: 43 },
  { roots: ['феникс.*бессмерти'], id: 45 },

  // Ветер
  { roots: ['дайтоппа', 'порыв.*ветр'], id: 47 },
  { roots: ['ренкудан', 'воздушн.*снаряд'], id: 48 },
  { roots: ['синкугёку', 'вакуумн.*сфер'], id: 49 },
  { roots: ['расен.*сюрикен', 'расенсюрикен'], id: 50 },
  { roots: ['серп.*ветр', 'кадзэ.*кама'], id: 51 },
  { roots: ['рассекающ.*поток'], id: 52 },
  { roots: ['щит.*вихр'], id: 53 },
  { roots: ['режущ.*вихр'], id: 56 },

  // Молния
  { roots: ['чидори', 'тидори'], id: 57 },
  { roots: ['райкири', 'ракири'], id: 58 },
  { roots: ['чидори.*нагаси', 'нагаси', 'поток.*молни'], id: 59 },
  { roots: ['гиан', 'ложная.*тьма', 'молниев.*копь'], id: 60 },
  { roots: ['кирин'], id: 61 },
  { roots: ['дзибаси', 'искров.*пол'], id: 62 },
  { roots: ['цепн.*молни'], id: 63 },
  { roots: ['молниев.*шаг'], id: 65 },
  { roots: ['клетк.*молни'], id: 67 },
  { roots: ['молниев.*прорыв'], id: 68 },
  { roots: ['райтон.*но.*ёрой', 'доспех.*молни', 'райтон.*ёрой'], id: 216 },
  { roots: ['покров.*чакр'], id: 214 },

  // Земля
  { roots: ['дорю.*хэк', 'грязев.*стен', 'землян.*стен', 'каменн.*стен'], id: 69 },
  { roots: ['ёми.*нума', 'топь.*ёми'], id: 70 },
  { roots: ['дорю.*тайга', 'поток.*земл'], id: 71 },
  { roots: ['доро.*домо', 'глинян.*тюрьм'], id: 72 },
  { roots: ['дзюкай.*коутан', 'лес.*землян.*колонн'], id: 73 },
  { roots: ['землян.*панцир'], id: 74 },
  { roots: ['обвал'], id: 75 },
  { roots: ['каменн.*кулак'], id: 76 },
  { roots: ['землян.*копь'], id: 79 },
  { roots: ['землян.*пик'], id: 80 },

  // Вода
  { roots: ['суйрюдан', 'водян.*дракон'], id: 83 },
  { roots: ['суйдзинхэк', 'водян.*стен', 'стена.*вод'], id: 84 },
  { roots: ['бакусуй.*сёха', 'взрывн.*волн.*вод'], id: 85 },
  { roots: ['суйгадан', 'водян.*клык'], id: 86 },
  { roots: ['мидзу.*бунсин', 'водян.*клон'], id: 87 },
  { roots: ['суйсёха', 'водян.*пул'], id: 88 },
  { roots: ['водян.*щит'], id: 90 },

  // Расенган
  { roots: ['расенган'], id: 94 },
  { roots: ['одама.*расенган', 'большой.*расенган'], id: 95 },
  { roots: ['двойн.*расенган'], id: 96 },
  { roots: ['расенган.*таран'], id: 97 },

  // Хьюга
  { roots: ['дзюкэн', 'мягк.*кулак'], id: 201 },
  { roots: ['дзюхо.*сосикен', 'львин.*кулак'], id: 202 },
  { roots: ['хакке.*кусё', 'удар.*воздух'], id: 203 },
  { roots: ['64.*ладон', 'рокудзюёнсё'], id: 204 },
  { roots: ['128.*ладон', 'хякунидзюхатисё'], id: 205 },
  { roots: ['кайтен', 'небесн.*вихр', 'вращающ.*купол'], id: 206 },
  { roots: ['заттай.*хаккэ', 'абсолютн.*сфер'], id: 210 },

  // Додзюцу
  { roots: ['камуи', 'kamui'], id: 991 },
  { roots: ['аматерасу', 'черн.*плам', 'amaterasu'], id: 992 },
  { roots: ['цукуёми', 'цукуеми', 'tsukuyomi'], id: 993 },
  { roots: ['сусаноо', 'susanoo'], id: 994 },
  { roots: ['синра', 'шинра', 'shinra'], id: 995 },
  { roots: ['прета', 'поглощен.*чакр'], id: 996 }
];

/**
 * Полный многоуровневый парсер действий раунда
 */
function parseFullAction(text, character = {}) {
  const clean = (text || '').trim();
  const lower = clean.toLowerCase();

  const foundJutsu = [];

  // 1. Поиск по явным номерам #ID или №ID или техника ID
  const idRegex = /(?:#|№|техник[аеуоы]\s*№?|дзюцу\s*№?|скилл\s*№?|номер\s*|id\s*)(\d{1,3})\b/gi;
  let m;
  while ((m = idRegex.exec(clean)) !== null) {
    const id = parseInt(m[1], 10);
    const j = ALL_JUTSU.find(x => x.id === id);
    if (j && !foundJutsu.some(x => x.id === j.id)) foundJutsu.push(j);
  }

  // 2. Число в самом начале строки (напр. "94. Расенган")
  const leadingMatch = clean.match(/^(\d{1,3})\b(?!\s*(?:м\b|метр|сек|мин|раунд|ход|хп|hp|ед|чакр|дм|см|км|%))/i);
  if (leadingMatch) {
    const id = parseInt(leadingMatch[1], 10);
    const j = ALL_JUTSU.find(x => x.id === id);
    if (j && !foundJutsu.some(x => x.id === j.id)) foundJutsu.push(j);
  }

  // 3. Поиск по корням названий техник
  for (const alias of COMMON_ROOTS) {
    for (const root of alias.roots) {
      const reg = new RegExp(root, 'i');
      if (reg.test(lower)) {
        if (alias.id === 991) {
          if (!foundJutsu.some(x => x.id === 991)) {
            foundJutsu.push({ id: 991, name: 'Камуи', rank: 'A', cost: 40000, category: 'ДОДЗЮЦУ', range: '[Я] [Р]', element: 'Пространство' });
          }
        } else if (alias.id === 992) {
          if (!foundJutsu.some(x => x.id === 992)) {
            foundJutsu.push({ id: 992, name: 'Аматерасу', rank: 'S', cost: 60000, category: 'ДОДЗЮЦУ', range: '[О]', element: 'Огонь', projectileSpeed: 30 });
          }
        } else if (alias.id === 993) {
          if (!foundJutsu.some(x => x.id === 993)) {
            foundJutsu.push({ id: 993, name: 'Цукуёми', rank: 'S', cost: 80000, category: 'ГЕНДЗЮЦУ', range: '[О]', element: 'Иллюзия' });
          }
        } else if (alias.id === 994) {
          if (!foundJutsu.some(x => x.id === 994)) {
            foundJutsu.push({ id: 994, name: 'Сусаноо', rank: 'A', cost: 25000, category: 'ДОДЗЮЦУ', range: '[Я]', element: 'Чакра' });
          }
        } else if (alias.id === 995) {
          if (!foundJutsu.some(x => x.id === 995)) {
            foundJutsu.push({ id: 995, name: 'Синра Тэнсэй', rank: 'S', cost: 60000, category: 'РИННЕГАН', range: '[Я]', element: 'Гравитация' });
          }
        } else if (alias.id === 996) {
          if (!foundJutsu.some(x => x.id === 996)) {
            foundJutsu.push({ id: 996, name: 'Путь Преты', rank: 'A', cost: 15000, category: 'РИННЕГАН', range: '[Р]', element: 'Поглощение' });
          }
        } else {
          const j = ALL_JUTSU.find(x => x.id === alias.id);
          if (j && !foundJutsu.some(x => x.id === j.id)) foundJutsu.push(j);
        }
        break;
      }
    }
  }

  // Распределение техник по тактическим категориям
  const modes = [];
  const reactiveMobility = [];
  const reactiveCounter = [];
  const defenses = [];
  const setups = [];
  const meleeAttacks = [];
  const rangedAttacks = [];
  let detectedElement = null;

  foundJutsu.forEach(j => {
    const type = classifyJutsu(j);
    if (type === 'MODE') modes.push(j);
    else if (type === 'REACTIVE_MOBILITY') reactiveMobility.push(j);
    else if (type === 'REACTIVE_COUNTER') reactiveCounter.push(j);
    else if (type === 'DEFENSE') defenses.push(j);
    else if (type === 'SETUP') setups.push(j);
    else if (type === 'MELEE_ATTACK') meleeAttacks.push(j);
    else if (type === 'RANGED_ATTACK') rangedAttacks.push(j);
    else if (type === 'SPECIAL_OCULAR') {
      if (j.id === 995) defenses.push(j);
      else rangedAttacks.push(j);
    } else {
      meleeAttacks.push(j);
    }

    const jCat = (j.category || '').toLowerCase();
    const jName = (j.name || '').toLowerCase();
    if (jCat.includes('огонь') || jName.includes('катон')) detectedElement = 'Огонь';
    else if (jCat.includes('вода') || jName.includes('суйтон')) detectedElement = 'Вода';
    else if (jCat.includes('молния') || jName.includes('райтон')) detectedElement = 'Молния';
    else if (jCat.includes('ветер') || jName.includes('фуутон')) detectedElement = 'Ветер';
    else if (jCat.includes('земля') || jName.includes('дотон')) detectedElement = 'Земля';
  });

  // Флаги экипировки и пространственных условий
  const hasHiraishinMark = lower.includes('под ноги') || lower.includes('метк') || lower.includes('кунай с формул') || lower.includes('разбрасыва') || lower.includes('трезуб');
  const hasWeapon = lower.includes('катан') || lower.includes('меч') || lower.includes('клинок') || lower.includes('оружие в рук') || lower.includes('достаю');
  const isSprint = lower.includes('бегу') || lower.includes('рывок') || lower.includes('спринт') || lower.includes('сокраща') || lower.includes('навстречу') || lower.includes('вперед');
  const isRetreat = lower.includes('отскок') || lower.includes('отпрыг') || lower.includes('назад') || lower.includes('разрыв дистанц');

  // Если игрок явно написал об уклонении или подмене текстом
  if ((lower.includes('каварими') || lower.includes('подмена') || lower.includes('замена')) && !reactiveMobility.some(x => x.id === 1)) {
    const kawarimi = ALL_JUTSU.find(x => x.id === 1);
    if (kawarimi) {
      reactiveMobility.push(kawarimi);
      foundJutsu.push(kawarimi);
    }
  }

  // Если поставил метку Хирайсина, техника #9 становится доступна как реактивная мобильность
  if (hasHiraishinMark && !reactiveMobility.some(x => x.id === 9)) {
    const hiraishin = ALL_JUTSU.find(x => x.id === 9);
    if (hiraishin) {
      reactiveMobility.push(hiraishin);
      if (!foundJutsu.some(x => x.id === 9)) foundJutsu.push(hiraishin);
    }
  }

  return {
    rawText: clean,
    foundJutsu,
    modes,
    reactiveMobility,
    reactiveCounter,
    defenses,
    setups,
    meleeAttacks,
    rangedAttacks,
    primaryMelee: meleeAttacks[0] || null,
    primaryRanged: rangedAttacks[0] || null,
    primaryDefense: defenses[0] || null,
    hasHiraishinMark,
    hasWeapon,
    isSprint,
    isRetreat,
    detectedElement: detectedElement || (character.elements ? character.elements[0] : null)
  };
}

/**
 * Расчет скорости полета снаряда
 */
function getJutsuProjectileSpeed(jutsu, element) {
  if (!jutsu) return 35;
  if (jutsu.projectileSpeed) return jutsu.projectileSpeed;
  if (jutsu.range && jutsu.range.includes('[К]')) return PROJECTILE_SPEEDS.CONTACT;

  const elem = element || '';
  if (elem.includes('Молния')) return PROJECTILE_SPEEDS.LIGHTNING;
  if (elem.includes('Ветер')) return PROJECTILE_SPEEDS.WIND;
  if (elem.includes('Огонь')) return PROJECTILE_SPEEDS.FIRE;
  if (elem.includes('Вода')) return PROJECTILE_SPEEDS.WATER;
  if (elem.includes('Земля')) return PROJECTILE_SPEEDS.EARTH;
  if (elem.includes('Оружие') || jutsu.category?.includes('ОРУЖИ') || jutsu.id === 22) return PROJECTILE_SPEEDS.WEAPON;
  return 35;
}

/**
 * Расчет стоимости чакры с учетом скидок стихии (-20%) и клана Удзумаки (-30%)
 */
function calculateJutsuCost(jutsu, character) {
  if (!jutsu) return 5000;
  let rawCost = 5000;
  if (typeof jutsu.cost === 'number') {
    rawCost = jutsu.cost;
  } else if (typeof jutsu.cost === 'string') {
    const parts = jutsu.cost.split(/[+,]/);
    const firstPart = parts[0] || jutsu.cost;
    const num = parseInt(firstPart.replace(/\D/g, ''), 10);
    rawCost = isNaN(num) ? 5000 : num;
  }

  if (jutsu.category && character.elements && character.elements.some(e => jutsu.category.includes(e))) {
    rawCost = Math.round(rawCost * 0.8);
  }
  if (character.clan && character.clan.includes('Узумаки') && (jutsu.category?.includes('ПЕЧАТ') || jutsu.name?.includes('печать'))) {
    rawCost = Math.round(rawCost * 0.7);
  }

  return rawCost;
}

/**
 * Сбор всех доступных техник бойца (30 из арсенала + клановые + глазные + заявка)
 * с классификацией на реактивную мобильность [М], контратаки [Р] и снятие гендзюцу [Г].
 */
function getFighterTacticalCapabilities(player, character, parsedAction) {
  const c = character || player?.character || {};
  const selectedIds = Array.isArray(player?.selectedJutsuIds) ? player.selectedJutsuIds : [];
  
  const allAvailable = [];
  const addedIds = new Set();

  const addJutsu = (j) => {
    if (!j || !j.id) return;
    if (!addedIds.has(j.id)) {
      addedIds.add(j.id);
      allAvailable.push(j);
    }
  };

  // 1. Из 30 выбранных техник арсенала
  selectedIds.forEach(id => {
    const numId = Number(id);
    const found = ALL_JUTSU.find(x => x.id === numId);
    if (found) addJutsu(found);
  });

  // 2. Бесплатные клановые дзюцу
  if (Array.isArray(c.autoJutsu)) {
    c.autoJutsu.forEach(j => addJutsu(j));
  }

  // 3. Глазные и клановые уникальные способности
  const eye = c.eye || {};
  const eyeName = (eye.name || '').toLowerCase();
  const eyeId = (eye.id || '').toLowerCase();
  const clan = (c.clan || '').toLowerCase();

  // Мангёкё / ВМШ: Камуи [Р]
  if (eyeId.includes('mangekyo') || eyeName.includes('мангёкё') || eyeName.includes('мангекё') || eyeName.includes('вмш')) {
    addJutsu({ id: 991, name: 'Камуи', rank: 'A', cost: 40000, category: 'ДОДЗЮЦУ', range: '[Я] [Р]', element: 'Пространство', isReactive: true, isCounter: true });
  }

  // Пробужденный Риннеган: Аменотедзикара [Р] [М]
  if (eyeId.includes('rinnegan_awakened') || (eyeName.includes('риннеган') && eyeName.includes('пробужд'))) {
    addJutsu({ id: 997, name: 'Аменотедзикара', rank: 'S', cost: 45000, category: 'РИННЕГАН', range: '[Р] [М] [О]', element: 'Пространство', isReactive: true, isMobility: true, isCounter: true });
  }

  // Риннеган: Путь Преты [Р]
  if (eyeId.includes('rinnegan') || eyeName.includes('риннеган')) {
    addJutsu({ id: 996, name: 'Путь Преты', rank: 'A', cost: 15000, category: 'РИННЕГАН', range: '[Р]', element: 'Поглощение', isReactive: true, isCounter: true });
  }

  // Икадзутиган / Тэнрай: Обратный разряд [Р]
  if (eyeId.includes('ikadzutigan') || eyeName.includes('икадзутиган') || clan.includes('тэнрай') || clan.includes('тенрай')) {
    addJutsu({ id: 281, name: 'Обратный разряд (Гяку Дэнрю)', rank: 'A', cost: 25000, category: 'КЛАН', range: '[Р] [К]', element: 'Молния', isReactive: true, isCounter: true });
  }

  // Сюнрай: Мгновенный шаг [М], Прорыв звукового барьера [М]
  if (clan.includes('сюнрай')) {
    addJutsu({ id: 242, name: 'Мгновенный шаг (Сюнрай)', rank: 'C', cost: 3000, category: 'КЛАН', range: '[М] [Я]', element: 'Тело', isReactive: true, isMobility: true });
    addJutsu({ id: 245, name: 'Прорыв звукового барьера', rank: 'A', cost: 18000, category: 'КЛАН', range: '[М] [Я]', element: 'Тело', isReactive: true, isMobility: true });
  }

  // Хьюга / Бьякуган: Кайтен
  if (eyeId.includes('byakugan') || eyeName.includes('бьякуган') || clan.includes('хьюга')) {
    addJutsu({ id: 206, name: 'Кайтен', rank: 'A', cost: 12000, category: 'ХЬЮГА', range: '[Я]', element: 'Чакра' });
  }

  // 4. Что введено в раунде
  if (parsedAction && Array.isArray(parsedAction.foundJutsu)) {
    parsedAction.foundJutsu.forEach(j => addJutsu(j));
  }

  const reactiveMobility = [];
  const reactiveCounter = [];
  const genjutsuCounter = [];

  allAvailable.forEach(j => {
    const id = j.id;
    const cat = (j.category || '').toUpperCase();
    const tags = Array.isArray(j.tags) ? j.tags.join(' ') : (j.tags || '');
    const tags33 = Array.isArray(j.tags_v033) ? j.tags_v033.join(' ') : (j.tags_v033 || '');
    const allTags = (tags + ' ' + tags33).toUpperCase();
    const desc = ((j.desc || '') + ' ' + (j.desc_v033 || '')).toUpperCase();

    const isMob = id === 1 || id === 7 || id === 9 || id === 997 || (id >= 239 && id <= 245) ||
      cat.includes('МОБИЛЬНОСТЬ') || allTags.includes('[М]') || desc.includes('[М]') || j.isMobility;

    const isCtr = id === 991 || id === 281 || id === 996 || id === 997 || id === 251 || (id >= 225 && id <= 238) ||
      cat.includes('КОНТРАТАК') || allTags.includes('[Р]') || desc.includes('[Р]') || j.isCounter;

    const isGen = id === 4 || id === 230 || id === 236 || allTags.includes('[Г]') || desc.includes('[Г]');

    if (isMob) reactiveMobility.push(j);
    if (isCtr) reactiveCounter.push(j);
    if (isGen) genjutsuCounter.push(j);
  });

  return {
    allAvailable,
    reactiveMobility,
    reactiveCounter,
    genjutsuCounter
  };
}

/**
 * Тактическая оценка защиты и автоматического срабатывания реактивных техник [Р], [М], [Г]
 * Строго по Разделу 7 правил v0.3.3 / v0.3.2.
 */
function evaluateTacticalDefense({
  defender,
  defenderChar,
  defenderCap,
  effReactSecDef,
  predDef,
  speedDef,
  attacker,
  attackerChar,
  attackerCap,
  effReactSecAtk,
  predAtk,
  speedAtk,
  incomingAttack,
  attackType, // 'MELEE' | 'RANGED' | 'GENJUTSU'
  currentDist,
  deliverySec,
  whySoDetails
}) {
  const result = {
    defended: false,
    counterTriggered: null,
    mobilityTriggered: null,
    genjutsuCounterTriggered: null,
    chakraSpent: 0,
    defenderWound: null,
    attackerWound: null,
    distDelta: 0,
    narrativeNote: ''
  };

  const defName = defender.name;
  const atkName = attacker.name;
  const atkTechName = incomingAttack?.name || 'Атака';
  const atkRank = incomingAttack?.rank || 'B';

  // =========================================================================
  // 1. ГЕНДЗЮЦУ (ИЛЛЮЗИИ)
  // =========================================================================
  if (attackType === 'GENJUTSU') {
    whySoDetails.push(`Воздействие иллюзии: «${atkTechName}» от ${atkName} по ${defName}.`);
    
    // Пробуждённый Бьякуган: пассивно видит сквозь любое гендзюцу без затрат на Кай
    const eyeName = (defenderChar.eye?.name || '').toLowerCase();
    const eyeId = (defenderChar.eye?.id || '').toLowerCase();
    if ((eyeName.includes('пробужд') && eyeName.includes('бьякуган')) || eyeId.includes('byakugan_awakened')) {
      whySoDetails.push(`Пробуждённый Бьякуган ${defName} («Всеведущий взор») пассивно видит сквозь любое гендзюцу без затрат чакры! Иллюзия «${atkTechName}» рассеяна мгновенно.`);
      result.defended = true;
      result.narrativeNote = `Всеведущий взор Пробуждённого Бьякугана ${defName} мгновенно вскрывает иллюзорную природу техники, полностью игнорируя наваждение!`;
      return result;
    }

    // Пробуждённый Риннеган: невосприимчивость к гендзюцу ниже ранга A
    if ((eyeName.includes('риннеган') && eyeName.includes('пробужд')) || eyeId.includes('rinnegan_awakened')) {
      if (atkRank !== 'A' && atkRank !== 'S') {
        whySoDetails.push(`Пробуждённый Риннеган ${defName} обеспечивает иммунитет к иллюзиям ниже ранга A. Техника «${atkTechName}» не оказывает эффекта.`);
        result.defended = true;
        result.narrativeNote = `Риннеган ${defName} сияет высшей чакрой, рассеивая слабое гендзюцу без малейших усилий.`;
        return result;
      }
    }

    // #236 Гендзюцу-отражение [Р] [Г] (18 000 чакры)
    const genReflect = defenderCap.genjutsuCounter.find(j => j.id === 236);
    if (genReflect) {
      const cost = calculateJutsuCost(genReflect, defenderChar);
      result.defended = true;
      result.genjutsuCounterTriggered = genReflect;
      result.chakraSpent = cost;
      result.attackerWound = `Дезориентация и шок от собственного отраженного гендзюцу «${atkTechName}»`;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [Р] [Г]: #236 «Гендзюцу-отражение» (${cost} чакры). ${defName} перехватывает импульс и отправляет иллюзию обратно в ${atkName}!`);
      result.narrativeNote = `Сконцентрировав чакру глаз, ${defName} техникой «Гендзюцу-отражение» разворачивает морок обратно в сознание ${atkName}, повергая атакующего в шок!`;
      return result;
    }

    // #230 Разрыв иллюзии (Гэнкай Хакай) [Р] [Г] (10 000 чакры)
    const genBreak = defenderCap.genjutsuCounter.find(j => j.id === 230);
    if (genBreak) {
      const cost = calculateJutsuCost(genBreak, defenderChar);
      result.defended = true;
      result.genjutsuCounterTriggered = genBreak;
      result.chakraSpent = cost;
      result.attackerWound = `Ушиб от встречного контрудара Разрыва иллюзии`;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [Р] [Г]: #230 «Разрыв иллюзии» (${cost} чакры). ${defName} разрушает чакро-канал иллюзии и наносит встречный физический удар по ${atkName}!`);
      result.narrativeNote = `Резким выбросом внутренней чакры ${defName} применяет «Разрыв иллюзии» (#230), вдребезги разбивая наваждение и проводя жесткий встречный контрудар!`;
      return result;
    }

    // #4 Кай (освобождение) [Г] (2 000 чакры)
    const kai = defenderCap.genjutsuCounter.find(j => j.id === 4);
    if (kai && !atkTechName.toLowerCase().includes('цукуёми') && !atkTechName.toLowerCase().includes('tsukuyomi')) {
      const cost = calculateJutsuCost(kai, defenderChar);
      result.defended = true;
      result.genjutsuCounterTriggered = kai;
      result.chakraSpent = cost;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [Г]: #4 «Кай» (${cost} чакры). ${defName} мгновенно складывает печать концентрации и сбивает чужую чакру до потери действия.`);
      result.narrativeNote = `Сложив пальцы в печать концентрации [Г] Кай, ${defName} сбивает ток внутренней чакры, мгновенно рассеивая иллюзорный морок «${atkTechName}».`;
      return result;
    }

    // Цукуёми (S) — Кай не работает!
    if (atkTechName.toLowerCase().includes('цукуёми') || atkTechName.toLowerCase().includes('tsukuyomi')) {
      const hasEyeResist = eyeName.includes('мангёкё') || eyeName.includes('риннеган') || eyeName.includes('бьякуган');
      whySoDetails.push(`Цукуёми (S): абсолютное оптическое гендзюцу. Кай не работает.${hasEyeResist ? ` Глазное сопротивление ${defName} снижает эффект до 1 раунда.` : ` ${defName} выбывает из строя на 2 раунда.`}`);
      result.defended = false;
      result.defenderWound = hasEyeResist ? 'Тяжелое истощение сознания от Цукуёми (1 раунд)' : 'Коллапс сознания от Цукуёми (2 раунда)';
      return result;
    }

    // Если нет способов снятия:
    whySoDetails.push(`${defName} не имеет в арсенале техник снятия [Г] (Кай, #230, #236) — иллюзия срабатывает в полном объеме!`);
    result.defended = false;
    result.defenderWound = `Подавлен техникой «${atkTechName}» (потеря концентрации и реакции)`;
    return result;
  }

  // =========================================================================
  // 2. БЛИЖНИЙ БОЙ (MELEE CONTACT)
  // =========================================================================
  if (attackType === 'MELEE') {
    const meleeTime = deliverySec || 0.085;
    whySoDetails.push(`Атака ${atkName}: «${atkTechName}» (ранг ${atkRank}, [К]). Время удара: ~${(meleeTime * 1000).toFixed(0)}мс. Эффективная реакция ${defName}: ${(effReactSecDef * 1000).toFixed(0)}мс (Предвидение ${predDef}%).`);

    const canReact = effReactSecDef <= meleeTime;

    if (!canReact) {
      whySoDetails.push(`Реакция ${defName} (${(effReactSecDef * 1000).toFixed(0)}мс) ПРЕВЫШАЕТ время удара (${(meleeTime * 1000).toFixed(0)}мс): прямое попадание!`);
      result.defended = false;
      result.defenderWound = `Тяжелое попадание техники «${atkTechName}»`;
      return result;
    }

    whySoDetails.push(`Реакция ${defName} (${(effReactSecDef * 1000).toFixed(0)}мс <= ${(meleeTime * 1000).toFixed(0)}мс) позволяет среагировать до касания!`);

    // Проверяем доступные реактивные способности в порядке тактического приоритета:

    // 1) Аменотедзикара [Р] [М] (#997)
    const ameno = defenderCap.reactiveMobility.find(j => j.id === 997) || defenderCap.reactiveCounter.find(j => j.id === 997);
    if (ameno) {
      const cost = calculateJutsuCost(ameno, defenderChar);
      result.defended = true;
      result.counterTriggered = ameno;
      result.chakraSpent = cost;
      result.distDelta = 8;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [Р] [М]: #997 «Аменотедзикара» (${cost} чакры). За микросекунду до контакта ${defName} меняется местами в пространстве, прерывая выпад «${atkTechName}»!`);
      result.narrativeNote = `Глаз Пробуждённого Риннегана ${defName} вспыхивает рябью томоэ: «Аменотедзикара» меняет положение тел в пространстве, и сокрушительный удар ${atkName} разносит пустую землю!`;
      return result;
    }

    // 2) Камуи [Р] (#991)
    const kamui = defenderCap.reactiveCounter.find(j => j.id === 991);
    if (kamui) {
      const cost = calculateJutsuCost(kamui, defenderChar);
      result.defended = true;
      result.counterTriggered = kamui;
      result.chakraSpent = cost;
      result.attackerWound = `Ранение от внезапного контрудара сквозь неосязаемость Камуи`;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [Р]: #991 «Камуи» (${cost} чакры). Реактивная неосязаемость: удар проходит насквозь через фантомный силуэт, после чего следует встречный контрудар!`);
      result.narrativeNote = `Пространственный вихрь Мангёкё Шарингана переносит тело ${defName} в иное измерение: атака «${atkTechName}» проваливается сквозь призрачный корпус, а мгновенный встречный выпад рассекает плечо ${atkName}!`;
      return result;
    }

    // 3) Хирайсин [М] (#9) (при наличии метки)
    const hiraishin = defenderCap.reactiveMobility.find(j => j.id === 9);
    if (hiraishin) {
      const cost = calculateJutsuCost(hiraishin, defenderChar);
      result.defended = true;
      result.mobilityTriggered = hiraishin;
      result.chakraSpent = cost;
      result.distDelta = 12;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [М]: #9 «Хирайсин» (${cost} чакры). Золотая вспышка телепортирует ${defName} к оставленной формуле Бога Грома, уводя из-под удара.`);
      result.narrativeNote = `Ослепительная золотая вспышка Летящего Бога Грома разрезает пространство: телепортировавшись к пространственной формуле, ${defName} оставляет выпад «${atkTechName}» сотрясать пустоту!`;
      return result;
    }

    // 4) Обратный разряд (Гяку Дэнрю) [Р] (#281)
    const gyaku = defenderCap.reactiveCounter.find(j => j.id === 281);
    if (gyaku) {
      const cost = calculateJutsuCost(gyaku, defenderChar);
      result.defended = true;
      result.counterTriggered = gyaku;
      result.chakraSpent = cost;
      result.attackerWound = `Онемение мышц и электрический шок от Обратного разряда (−30мс реакции)`;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [Р]: #281 «Обратный разряд» (${cost} чакры). При встречном контакте электростатический разряд парализует ${atkName}!`);
      result.narrativeNote = `Икадзутиган ${defName} выбрасывает встречную высоковольтную дугу: «Обратный разряд» пробивает проводящие пути ${atkName}, сковывая мышцы судорожным спазмом!`;
      return result;
    }

    // 5) Поглощение чакры [Р] (#251 или #996 Путь Преты)
    const absorb = defenderCap.reactiveCounter.find(j => j.id === 251 || j.id === 996);
    if (absorb) {
      const baseCost = 15000;
      const atkCost = calculateJutsuCost(incomingAttack, attackerChar);
      result.defended = true;
      result.counterTriggered = absorb;
      result.chakraSpent = Math.max(0, baseCost - atkCost); // Восстанавливает чакру
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [Р]: «${absorb.name}». Ладони перехватывают выпад, впитывая ${atkCost} чакры атаки в резерв ${defName}!`);
      result.narrativeNote = `Выставив ладони с вихрем чакрового поглощения, ${defName} гасит импульс техники «${atkTechName}», без остатка втягивая чужую чакру в собственные каналы!`;
      return result;
    }

    // 6) Стальной приём [Р] (#229)
    const tekkon = defenderCap.reactiveCounter.find(j => j.id === 229);
    if (tekkon) {
      const cost = calculateJutsuCost(tekkon, defenderChar);
      result.defended = true;
      result.counterTriggered = tekkon;
      result.chakraSpent = cost;
      result.attackerWound = `Ушиб от кинетического рикошета Стального приёма`;
      result.distDelta = 4;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [Р]: #229 «Стальной приём» (${cost} чакры). Блок парирует мощный удар и возвращает отдачу в ${atkName}.`);
      result.narrativeNote = `Применив «Стальной приём» (#229), ${defName} глухим блоком гасит кинетический вектор и силовой волной отдачи отбрасывает ${atkName} назад!`;
      return result;
    }

    // 7) Каиши: контрудар [Р] (#225)
    const kaishi = defenderCap.reactiveCounter.find(j => j.id === 225);
    if (kaishi) {
      const cost = calculateJutsuCost(kaishi, defenderChar);
      result.defended = true;
      result.counterTriggered = kaishi;
      result.chakraSpent = cost;
      result.attackerWound = `Рассечение от встречного контрудара Каиши`;
      result.distDelta = 3;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [Р]: #225 «Каиши: контрудар» (${cost} чакры). Мгновенный ответный выпад сразу после парирования.`);
      result.narrativeNote = `Парировав выпад жестким блоком, ${defName} техникой «Каиши» (#225) в то же мгновение проводит разящий контрудар по открывшейся груди соперника!`;
      return result;
    }

    // 8) Встречный удар [Р] (#226)
    const mukae = defenderCap.reactiveCounter.find(j => j.id === 226);
    if (mukae) {
      const cost = calculateJutsuCost(mukae, defenderChar);
      result.defended = true;
      result.counterTriggered = mukae;
      result.chakraSpent = cost;
      result.attackerWound = `Сбитое дыхание от встречного удара`;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [Р]: #226 «Встречный удар» (${cost} чакры). Опережающий контрудар сбивает фазу атаки.`);
      result.narrativeNote = `Быстрым выпадом «Встречный удар» (#226) ${defName} сбивает баланс нападающего, заставляя ${atkName} отступить!`;
      return result;
    }

    // 9) Каварими [М] (#1)
    const kawarimi = defenderCap.reactiveMobility.find(j => j.id === 1);
    if (kawarimi) {
      const cost = calculateJutsuCost(kawarimi, defenderChar);
      result.defended = true;
      result.mobilityTriggered = kawarimi;
      result.chakraSpent = cost;
      result.distDelta = 8;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [М]: #1 «Каварими» (${cost} чакры). Тело подменено деревянным бруском за миллисекунду до контакта.`);
      result.narrativeNote = `Хлопок дыма возвещает о технике «Каварими»: сокрушительный удар «${atkTechName}» раскалывает сухой деревянный брусок, пока ${defName} уже смещается на выгодный рубеж!`;
      return result;
    }

    // 10) Мгновенный шаг / Прорыв звукового барьера (Сюнрай) [М] (#242, #245)
    const shunraiStep = defenderCap.reactiveMobility.find(j => j.id === 242 || j.id === 245);
    if (shunraiStep) {
      const cost = calculateJutsuCost(shunraiStep, defenderChar);
      result.defended = true;
      result.mobilityTriggered = shunraiStep;
      result.chakraSpent = cost;
      result.distDelta = 10;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [М]: «${shunraiStep.name}» (${cost} чакры). Сверхзвуковой микрорывок тела на предельной скорости оставляет ложный силуэт.`);
      result.narrativeNote = `Со звуковым хлопком «${shunraiStep.name}» ${defName} разрывает дистанцию на сверхзвуке, оставив ${atkName} атаковать остаточный силуэт!`;
      return result;
    }

    // 11) Аварийный свиток (#243) / Отскок (#239) / Сюнсин (#7) [М]
    const mobAny = defenderCap.reactiveMobility.find(j => j.id === 243 || j.id === 239 || j.id === 7 || (j.id >= 239 && j.id <= 245));
    if (mobAny) {
      const cost = calculateJutsuCost(mobAny, defenderChar);
      result.defended = true;
      result.mobilityTriggered = mobAny;
      result.chakraSpent = cost;
      result.distDelta = 6;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [М]: «${mobAny.name}» (${cost} чакры). Чистый тактический уход с вектора удара.`);
      result.narrativeNote = `Используя реактивный маневр «${mobAny.name}», ${defName} уходит с линии контакта, разрывая ближний бой!`;
      return result;
    }

    // 12) Райтон но Ёрой (#216)
    if (defenderChar.activeModes?.includes('Райтон') || defenderCap.allAvailable.some(j => j.id === 216)) {
      result.defended = true;
      result.defenderWound = 'Легкий ушиб сквозь покров молнии';
      result.attackerWound = 'Онемение мышц от электрического разряда Райтон но Ёрой';
      whySoDetails.push(`Покров «Райтон но Ёрой» (#216): электрическая броня ранга A рассеивает удар и бьет током по ${atkName}.`);
      result.narrativeNote = `Громовой доспех Райтон но Ёрой принимает кинетику удара на мерцающую броню, ударив ${atkName} встречной электрической дугой!`;
      return result;
    }

    // 13) Обычное парирование / смещение
    result.defended = true;
    result.defenderWound = `Скользящий след техники «${atkTechName}»`;
    whySoDetails.push(`${defName} успевает сместить корпус, получив лишь скользящий урон.`);
    result.narrativeNote = `${defName} в последний миг уводит корпус в сторону, смягчая эпицентр техники до скользящего касания.`;
    return result;
  }

  // =========================================================================
  // 3. ДАЛЬНОБОЙНАЯ БАЛЛИСТИКА (BALLISTIC EVASION)
  // =========================================================================
  if (attackType === 'RANGED') {
    const projSpeed = getJutsuProjectileSpeed(incomingAttack, incomingAttack.element);
    const tFlight = deliverySec || (currentDist / projSpeed);
    whySoDetails.push(`Дальнобойная атака ${atkName}: «${atkTechName}» (ранг ${atkRank}, ${projSpeed} м/с). Дистанция: ${currentDist}м. Время подлёта: ${currentDist}м / ${projSpeed} м/с = ${tFlight.toFixed(2)}с. Эффективная реакция ${defName}: ${(effReactSecDef * 1000).toFixed(0)}мс (${effReactSecDef.toFixed(2)}с, Предвидение ${predDef}%).`);

    const canReact = tFlight >= effReactSecDef;

    if (!canReact) {
      whySoDetails.push(`Время подлёта (${tFlight.toFixed(2)}с) МЕНЬШЕ реакции (${effReactSecDef.toFixed(2)}с) — ${defName} не успевает уйти: прямое попадание!`);
      result.defended = false;
      result.defenderWound = `Прямое попадание техники «${atkTechName}»`;
      return result;
    }

    whySoDetails.push(`Время подлёта (${tFlight.toFixed(2)}с) >= реакции (${effReactSecDef.toFixed(2)}с) — ${defName} успевает отреагировать!`);

    // Проверяем реактивные способности перехвата снарядов:

    // 1) Аменотедзикара [Р] [М] (#997)
    const ameno = defenderCap.reactiveMobility.find(j => j.id === 997) || defenderCap.reactiveCounter.find(j => j.id === 997);
    if (ameno) {
      const cost = calculateJutsuCost(ameno, defenderChar);
      result.defended = true;
      result.counterTriggered = ameno;
      result.chakraSpent = cost;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [Р] [М]: #997 «Аменотедзикара» (${cost} чакры). Обмен местами в полете снаряда — техника летит в пустоту.`);
      result.narrativeNote = `Вспышка Риннегана «Аменотедзикара» переносит ${defName} в сторону от летящего снаряда, оставив «${atkTechName}» врезаться в пустой валун!`;
      return result;
    }

    // 2) Камуи [Р] (#991)
    const kamui = defenderCap.reactiveCounter.find(j => j.id === 991);
    if (kamui) {
      const cost = calculateJutsuCost(kamui, defenderChar);
      result.defended = true;
      result.counterTriggered = kamui;
      result.chakraSpent = cost;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [Р]: #991 «Камуи» (${cost} чакры). Пространственный перехват: снаряд в полете затянут в карман измерения Камуи!`);
      result.narrativeNote = `Пространственный барьер Камуи закручивает воздух в спираль: летящий снаряд «${atkTechName}» бесследно исчезает в межпространственной воронке!`;
      return result;
    }

    // 3) Поглощение чакры / Путь Преты (#996, #251) [Р]
    const absorb = defenderCap.reactiveCounter.find(j => j.id === 251 || j.id === 996);
    if (absorb) {
      const atkCost = calculateJutsuCost(incomingAttack, attackerChar);
      result.defended = true;
      result.counterTriggered = absorb;
      result.chakraSpent = Math.max(0, 15000 - atkCost);
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [Р]: «${absorb.name}». Летящая стихийная техника поглощена барьером чакры (+${atkCost} восстановлено)!`);
      result.narrativeNote = `Выставив ладони вперед, ${defName} вбирает в себя всю мощь летящей техники «${atkTechName}», поглощая чакру до последней капли!`;
      return result;
    }

    // 4) Зеркальный редирект [Р] (#227)
    const redirect = defenderCap.reactiveCounter.find(j => j.id === 227);
    if (redirect) {
      const cost = calculateJutsuCost(redirect, defenderChar);
      result.defended = true;
      result.counterTriggered = redirect;
      result.chakraSpent = cost;
      result.attackerWound = `Ожоги/ранения от отраженной собственной техники «${atkTechName}»`;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [Р]: #227 «Зеркальный редирект» (${cost} чакры). Входящая техника перенаправлена обратно в ${atkName}!`);
      result.narrativeNote = `Применив «Зеркальный редирект» (#227), ${defName} чакровым вектором разворачивает поток «${atkTechName}» обратно в сторону ${atkName}!`;
      return result;
    }

    // 5) Отбитие оружия [Р] (#231)
    const deflectWp = defenderCap.reactiveCounter.find(j => j.id === 231);
    if (deflectWp && (incomingAttack.category?.includes('ОРУЖ') || incomingAttack.id === 22)) {
      result.defended = true;
      result.counterTriggered = deflectWp;
      result.chakraSpent = 2000;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [Р]: #231 «Отбитие» (2 000 чакры). Оружие противника отбито сталью клинка.`);
      return result;
    }

    // 6) Каварими [М] (#1)
    const kawarimi = defenderCap.reactiveMobility.find(j => j.id === 1);
    if (kawarimi) {
      const cost = calculateJutsuCost(kawarimi, defenderChar);
      result.defended = true;
      result.mobilityTriggered = kawarimi;
      result.chakraSpent = cost;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [М]: #1 «Каварими» (${cost} чакры). Замена телом уводит из эпицентра взрыва.`);
      result.narrativeNote = `Взрыв снаряда разносит лишь подставленное бревно (#1 Каварими): ${defName} уже находится вне зоны поражения.`;
      return result;
    }

    // 7) Хирайсин [М] (#9)
    const hiraishin = defenderCap.reactiveMobility.find(j => j.id === 9);
    if (hiraishin) {
      const cost = calculateJutsuCost(hiraishin, defenderChar);
      result.defended = true;
      result.mobilityTriggered = hiraishin;
      result.chakraSpent = cost;
      result.distDelta = 10;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [М]: #9 «Хирайсин» (${cost} чакры). Мгновенный уход к формуле Летящего Бога Грома.`);
      return result;
    }

    // 8) Другие техники мобильности [М] (#239–245, Сюнсин #7)
    const anyMob = defenderCap.reactiveMobility.find(j => j.id === 7 || j.id === 243 || j.id === 239 || j.id === 240 || (j.id >= 239 && j.id <= 245));
    if (anyMob) {
      const cost = calculateJutsuCost(anyMob, defenderChar);
      result.defended = true;
      result.mobilityTriggered = anyMob;
      result.chakraSpent = cost;
      whySoDetails.push(`АВТОМАТИЧЕСКАЯ РЕАКЦИЯ [М]: «${anyMob.name}» (${cost} чакры). Уход с вектора подлёта.`);
      result.narrativeNote = `Используя реактивную мобильность «${anyMob.name}», ${defName} чисто смещается с траектории снаряда.`;
      return result;
    }

    // 9) Физический уход
    if ((speedDef / speedAtk) >= 1.4) {
      result.defended = true;
      whySoDetails.push(`Превосходство физической скорости (${speedDef} м/с против ${speedAtk} м/с) позволяет ${defName} чисто уйти с вектора.`);
      result.narrativeNote = `На высокой физической скорости (${speedDef} м/с) ${defName} уходит с линии огня без повреждений.`;
      return result;
    }

    result.defended = true;
    result.defenderWound = 'Скользящий след от осколков снаряда';
    whySoDetails.push(`${defName} успевает сместиться, получая лишь легкое скользящее касание.`);
    return result;
  }

  return result;
}

/**
 * =========================================================================
 * ГЛАВНЫЙ МЕТОД: Разрешение тактического раунда 1v1
 * =========================================================================
 */
function resolve1v1TacticalBattle(room, p1, p2, p1RawAction, p2RawAction) {
  const isTactical = (room?.gameVersion || '0.3.3') === '0.3.3';
  const currentDist = Number(room?.distance) || 35;
  const c1 = p1.character || {};
  const c2 = p2.character || {};

  const a1 = parseFullAction(p1RawAction, c1);
  const a2 = parseFullAction(p2RawAction, c2);

  // Сбор всех доступных реактивных техник из арсенала (30 слотов), профиля и действий
  const cap1 = getFighterTacticalCapabilities(p1, c1, a1);
  const cap2 = getFighterTacticalCapabilities(p2, c2, a2);

  // 1. БАЗОВЫЕ И РЕЖИМНЫЕ СКОРОСТИ
  let speed1 = Number(c1.speed) || Number(c1.baseSpeed) || 24;
  let speed2 = Number(c2.speed) || Number(c2.baseSpeed) || 24;

  // Проверяем покровы и режимы у p1 (из найденных техник и текста хода)
  let p1ModeSpeedBonus = 0;
  let p1ModeNames = [];
  const p1RawLower = (p1RawAction || '').toLowerCase();
  if (a1.modes.some(m => m.id === 216) || p1RawLower.includes('райтон но ёрой') || p1RawLower.includes('#216') || p1RawLower.includes('доспех молнии')) {
    p1ModeSpeedBonus += 30;
    p1ModeNames.push('Райтон но Ёрой (+30% скор.)');
  }
  if (a1.modes.some(m => m.id === 214) || p1RawLower.includes('покров чакры') || p1RawLower.includes('#214')) {
    p1ModeSpeedBonus += 20;
    p1ModeNames.push('Покров чакры (+20% скор.)');
  }
  if (a1.modes.some(m => m.id === 217) || p1RawLower.includes('врата') || p1RawLower.includes('#217') || p1RawLower.includes('хатимон')) {
    p1ModeSpeedBonus += 25;
    p1ModeNames.push('Хатимон Тонко (+25% скор.)');
  }
  if (a1.modes.some(m => m.id === 223) || p1RawLower.includes('плащ') || p1RawLower.includes('#223')) {
    p1ModeSpeedBonus += 25;
    p1ModeNames.push('Плащ ветра (+25% скор.)');
  }
  if (a1.modes.some(m => m.id === 995) || p1RawLower.includes('сусаноо')) {
    p1ModeNames.push('Сусаноо (Доспех)');
  }
  if (p1RawLower.includes('биджу') || p1RawLower.includes('джинчурики')) {
    p1ModeSpeedBonus += 40;
    p1ModeNames.push('Покров Биджу (+40% скор.)');
  }
  if (p1RawLower.includes('проклятая печать')) {
    p1ModeSpeedBonus += 40;
    p1ModeNames.push('Проклятая печать (+40% скор.)');
  }

  // Проверяем покровы и режимы у p2
  let p2ModeSpeedBonus = 0;
  let p2ModeNames = [];
  const p2RawLower = (p2RawAction || '').toLowerCase();
  if (a2.modes.some(m => m.id === 216) || p2RawLower.includes('райтон но ёрой') || p2RawLower.includes('#216') || p2RawLower.includes('доспех молнии')) {
    p2ModeSpeedBonus += 30;
    p2ModeNames.push('Райтон но Ёрой (+30% скор.)');
  }
  if (a2.modes.some(m => m.id === 214) || p2RawLower.includes('покров чакры') || p2RawLower.includes('#214')) {
    p2ModeSpeedBonus += 20;
    p2ModeNames.push('Покров чакры (+20% скор.)');
  }
  if (a2.modes.some(m => m.id === 217) || p2RawLower.includes('врата') || p2RawLower.includes('#217') || p2RawLower.includes('хатимон')) {
    p2ModeSpeedBonus += 25;
    p2ModeNames.push('Хатимон Тонко (+25% скор.)');
  }
  if (a2.modes.some(m => m.id === 223) || p2RawLower.includes('плащ') || p2RawLower.includes('#223')) {
    p2ModeSpeedBonus += 25;
    p2ModeNames.push('Плащ ветра (+25% скор.)');
  }
  if (a2.modes.some(m => m.id === 995) || p2RawLower.includes('сусаноо')) {
    p2ModeNames.push('Сусаноо (Доспех)');
  }
  if (p2RawLower.includes('биджу') || p2RawLower.includes('джинчурики')) {
    p2ModeSpeedBonus += 40;
    p2ModeNames.push('Покров Биджу (+40% скор.)');
  }
  if (p2RawLower.includes('проклятая печать')) {
    p2ModeSpeedBonus += 40;
    p2ModeNames.push('Проклятая печать (+40% скор.)');
  }

  // Применяем прибавку скорости от покровов
  if (p1ModeSpeedBonus > 0) {
    speed1 = Math.round(speed1 * (1 + p1ModeSpeedBonus / 100));
  }
  if (p2ModeSpeedBonus > 0) {
    speed2 = Math.round(speed2 * (1 + p2ModeSpeedBonus / 100));
  }

  // 2. ВРЕМЯ РЕАКЦИИ И СИНЕРГЕТИЧЕСКИЙ ПОТОЛОК
  const react1 = Number(c1.reaction) || Number(c1.baseReaction) || 160;
  const react2 = Number(c2.reaction) || Number(c2.baseReaction) || 160;
  let pred1 = Number(c1.predvidenie) || 0;
  let pred2 = Number(c2.predvidenie) || 0;

  // Синергетический потолок: если Сюнрай/Тэнрай + Додзюцу -> Предвидение * 0.7, потолок 90%
  const isCapped1 = (c1.clan?.includes('Сюнрай') || c1.clan?.includes('Тэнрай')) && pred1 > 0;
  const isCapped2 = (c2.clan?.includes('Сюнрай') || c2.clan?.includes('Тэнрай')) && pred2 > 0;
  if (isCapped1) pred1 = Math.min(90, Math.round(pred1 * 0.7));
  if (isCapped2) pred2 = Math.min(90, Math.round(pred2 * 0.7));

  // Эффективная реакция в секундах: t_react = react_ms * (1 - pred/100) / 1000
  const effReactSec1 = (react1 * (1 - pred1 / 100)) / 1000;
  const effReactSec2 = (react2 * (1 - pred2 / 100)) / 1000;

  // 3. РАСХОД ЧАКРЫ НА ЗАЯВЛЕННЫЕ ДЕЙСТВИЯ
  let p1ChakraSpent = 0;
  let p2ChakraSpent = 0;
  a1.foundJutsu.forEach(j => { p1ChakraSpent += calculateJutsuCost(j, c1); });
  a2.foundJutsu.forEach(j => { p2ChakraSpent += calculateJutsuCost(j, c2); });
  if (p1ChakraSpent === 0) p1ChakraSpent = 4000;
  if (p2ChakraSpent === 0) p2ChakraSpent = 4000;

  let newDistance = currentDist;
  let p1WoundDesc = 'Без повреждений';
  let p2WoundDesc = 'Без повреждений';
  let clashType = 'TACTICAL_MANEUVER';
  let whySoDetails = [];
  const narrativeSnippets = [];

  // =========================================================================
  // ПРОВЕРКА ГЕНДЗЮЦУ В ЗАЯВКАХ
  // =========================================================================
  const p1Genjutsu = a1.foundJutsu.find(j => (j.category || '').includes('ГЕНДЗЮЦУ') || (j.tags || []).includes('[Г]') || j.id === 993 || (j.id >= 105 && j.id <= 113));
  const p2Genjutsu = a2.foundJutsu.find(j => (j.category || '').includes('ГЕНДЗЮЦУ') || (j.tags || []).includes('[Г]') || j.id === 993 || (j.id >= 105 && j.id <= 113));

  if (p1Genjutsu) {
    const genDef = evaluateTacticalDefense({
      defender: p2, defenderChar: c2, defenderCap: cap2, effReactSecDef: effReactSec2, predDef: pred2, speedDef: speed2,
      attacker: p1, attackerChar: c1, attackerCap: cap1, effReactSecAtk: effReactSec1, predAtk: pred1, speedAtk: speed1,
      incomingAttack: p1Genjutsu, attackType: 'GENJUTSU', currentDist, whySoDetails
    });
    p2ChakraSpent += genDef.chakraSpent;
    if (genDef.defenderWound) p2WoundDesc = genDef.defenderWound;
    if (genDef.attackerWound) p1WoundDesc = genDef.attackerWound;
    if (genDef.narrativeNote) narrativeSnippets.push(genDef.narrativeNote);
  }

  if (p2Genjutsu) {
    const genDef = evaluateTacticalDefense({
      defender: p1, defenderChar: c1, defenderCap: cap1, effReactSecDef: effReactSec1, predDef: pred1, speedDef: speed1,
      attacker: p2, attackerChar: c2, attackerCap: cap2, effReactSecAtk: effReactSec2, predAtk: pred2, speedAtk: speed2,
      incomingAttack: p2Genjutsu, attackType: 'GENJUTSU', currentDist, whySoDetails
    });
    p1ChakraSpent += genDef.chakraSpent;
    if (genDef.defenderWound) p1WoundDesc = genDef.defenderWound;
    if (genDef.attackerWound) p2WoundDesc = genDef.attackerWound;
    if (genDef.narrativeNote) narrativeSnippets.push(genDef.narrativeNote);
  }

  // =========================================================================
  // СЦЕНАРИЙ 1: БЛИЖНИЙ БОЙ (MELEE CONTACT / РЫВОК)
  // =========================================================================
  const bothRush = (a1.isSprint || a1.primaryMelee) && (a2.isSprint || a2.primaryMelee);

  if (bothRush) {
    clashType = 'MELEE_ENGAGEMENT';
    const relSpeed = speed1 + speed2;
    const timeToMeet = (currentDist / relSpeed).toFixed(2);
    const meetDistFromP1 = Math.round(currentDist * (speed1 / relSpeed));

    whySoDetails.push(`Оба бойца срываются навстречу: ${p1.name} (${speed1} м/с) и ${p2.name} (${speed2} м/с). Относительная скорость сближения: ${relSpeed} м/с. Время встречи на дистанции ${currentDist}м: ${timeToMeet}с (точка контакта в ${meetDistFromP1}м от ${p1.name}).`);

    // Проверяем атаку P2 на P1
    if (a2.primaryMelee) {
      const defRes = evaluateTacticalDefense({
        defender: p1, defenderChar: c1, defenderCap: cap1, effReactSecDef: effReactSec1, predDef: pred1, speedDef: speed1,
        attacker: p2, attackerChar: c2, attackerCap: cap2, effReactSecAtk: effReactSec2, predAtk: pred2, speedAtk: speed2,
        incomingAttack: a2.primaryMelee, attackType: 'MELEE', currentDist, deliverySec: 0.085, whySoDetails
      });
      p1ChakraSpent += defRes.chakraSpent;
      if (defRes.defenderWound) p1WoundDesc = defRes.defenderWound;
      if (defRes.attackerWound) p2WoundDesc = defRes.attackerWound;
      if (defRes.distDelta) newDistance = Math.max(5, defRes.distDelta);
      if (defRes.narrativeNote) narrativeSnippets.push(defRes.narrativeNote);
    }

    // Проверяем атаку P1 на P2
    if (a1.primaryMelee) {
      const defRes = evaluateTacticalDefense({
        defender: p2, defenderChar: c2, defenderCap: cap2, effReactSecDef: effReactSec2, predDef: pred2, speedDef: speed2,
        attacker: p1, attackerChar: c1, attackerCap: cap1, effReactSecAtk: effReactSec1, predAtk: pred1, speedAtk: speed1,
        incomingAttack: a1.primaryMelee, attackType: 'MELEE', currentDist, deliverySec: 0.085, whySoDetails
      });
      p2ChakraSpent += defRes.chakraSpent;
      if (defRes.defenderWound) p2WoundDesc = defRes.defenderWound;
      if (defRes.attackerWound) p1WoundDesc = defRes.attackerWound;
      if (defRes.distDelta) newDistance = Math.max(5, defRes.distDelta);
      if (defRes.narrativeNote) narrativeSnippets.push(defRes.narrativeNote);
    }
  }

  // =========================================================================
  // СЦЕНАРИЙ 2: ВСТРЕЧНЫЙ ДАЛЬНОБОЙНЫЙ CLASH (АТАКА НАВСТРЕЧУ АТАКЕ)
  // Применяется ИСКЛЮЧИТЕЛЬНО когда обе техники — снаряды, летящие навстречу!
  // =========================================================================
  else if (a1.primaryRanged && a2.primaryRanged) {
    clashType = 'RANGED_CLASH';
    const r1 = RANK_VALUES[a1.primaryRanged.rank] || 3;
    const r2 = RANK_VALUES[a2.primaryRanged.rank] || 3;
    const amp1 = (c1.eye?.techniqueAmp || 0) / 100;
    const amp2 = (c2.eye?.techniqueAmp || 0) / 100;

    let elem1 = 0;
    let elem2 = 0;
    if (a1.detectedElement && ELEMENT_ADVANTAGES[a1.detectedElement] === a2.detectedElement) {
      elem1 = 0.50; // Преимущество по кругу +50%
      elem2 = -0.25; // Слабость -25%
    } else if (a2.detectedElement && ELEMENT_ADVANTAGES[a2.detectedElement] === a1.detectedElement) {
      elem2 = 0.50;
      elem1 = -0.25;
    }

    const power1 = r1 * (1 + amp1 + elem1);
    const power2 = r2 * (1 + amp2 + elem2);
    const diff = power1 - power2;

    whySoDetails.push(`Встречное столкновение техник (Clash): «${a1.primaryRanged.name}» (Сила: ${power1.toFixed(2)}) против «${a2.primaryRanged.name}» (Сила: ${power2.toFixed(2)}). Разница: ${Math.abs(diff).toFixed(2)}.`);

    if (diff >= 1.0) {
      whySoDetails.push(`Разница сил ≥ 1.0: техника ${p1.name} полностью пробивает вражескую атаку.`);
      p2WoundDesc = `Ожоги/ранения от техники «${a1.primaryRanged.name}»`;
    } else if (diff <= -1.0) {
      whySoDetails.push(`Разница сил ≥ 1.0: техника ${p2.name} полностью доминирует и наносит урон.`);
      p1WoundDesc = `Ожоги/ранения от техники «${a2.primaryRanged.name}»`;
    } else if (Math.abs(diff) >= 0.4) {
      if (diff > 0) {
        whySoDetails.push(`Разница 0.4–1.0: частичный прорыв техники ${p1.name}.`);
        p2WoundDesc = 'Легкие ожоги от прорвавшейся части снаряда';
      } else {
        whySoDetails.push(`Разница 0.4–1.0: частичный прорыв техники ${p2.name}.`);
        p1WoundDesc = 'Легкие ожоги от прорвавшейся части снаряда';
      }
    } else {
      whySoDetails.push('Разница < 0.4: взаимное рассеивание с ударной волной.');
      p1WoundDesc = 'Ссадины от встречной волны детонации';
      p2WoundDesc = 'Ссадины от встречной волны детонации';
    }
    newDistance = Math.max(10, currentDist - 5);
  }

  // =========================================================================
  // СЦЕНАРИЙ 3: ДАЛЬНОБОЙНАЯ АТАКА ПРОТИВ СТЕНЫ / БАРЬЕРА
  // =========================================================================
  else if (a1.primaryRanged && a2.primaryDefense) {
    clashType = 'ATTACK_VS_DEFENSE';
    const atkRank = RANK_VALUES[a1.primaryRanged.rank] || 3;
    const defRank = RANK_VALUES[a2.primaryDefense.rank] || 2;
    let defBonus = 0;
    if (a2.detectedElement && ELEMENT_ADVANTAGES[a2.detectedElement] === a1.detectedElement) defBonus = 1;

    whySoDetails.push(`Атака «${a1.primaryRanged.name}» (ранг ${atkRank}) против Защиты «${a2.primaryDefense.name}» (ранг ${defRank}${defBonus ? ' +1 стихия' : ''}).`);
    if ((defRank + defBonus) >= atkRank) {
      whySoDetails.push(`Защита ${p2.name} полностью нейтрализует атаку.`);
    } else {
      whySoDetails.push(`Защита частично трескается от превосходящего ранга.`);
      p2WoundDesc = 'Скользящие ссадины сквозь треснувший щит';
    }
    newDistance = Math.max(10, currentDist - 4);
  } else if (a2.primaryRanged && a1.primaryDefense) {
    clashType = 'ATTACK_VS_DEFENSE';
    const atkRank = RANK_VALUES[a2.primaryRanged.rank] || 3;
    const defRank = RANK_VALUES[a1.primaryDefense.rank] || 2;
    let defBonus = 0;
    if (a1.detectedElement && ELEMENT_ADVANTAGES[a1.detectedElement] === a2.detectedElement) defBonus = 1;

    whySoDetails.push(`Атака «${a2.primaryRanged.name}» (ранг ${atkRank}) против Защиты «${a1.primaryDefense.name}» (ранг ${defRank}${defBonus ? ' +1 стихия' : ''}).`);
    if ((defRank + defBonus) >= atkRank) {
      whySoDetails.push(`Защита ${p1.name} полностью блокирует удар.`);
    } else {
      whySoDetails.push(`Защита ослабляет атаку, пропуская часть кинетики.`);
      p1WoundDesc = 'Ссадины сквозь пробитый барьер';
    }
    newDistance = Math.max(10, currentDist - 4);
  }

  // =========================================================================
  // СЦЕНАРИЙ 4: БАЛЛИСТИКА И АВТОМАТИЧЕСКОЕ РЕАКТИВНОЕ УКЛОНЕНИЕ / ПЕРЕХВАТ
  // =========================================================================
  else {
    clashType = 'BALLISTIC_EVASION';

    if (a1.primaryRanged && !a2.primaryDefense) {
      const defRes = evaluateTacticalDefense({
        defender: p2, defenderChar: c2, defenderCap: cap2, effReactSecDef: effReactSec2, predDef: pred2, speedDef: speed2,
        attacker: p1, attackerChar: c1, attackerCap: cap1, effReactSecAtk: effReactSec1, predAtk: pred1, speedAtk: speed1,
        incomingAttack: a1.primaryRanged, attackType: 'RANGED', currentDist, whySoDetails
      });
      p2ChakraSpent += defRes.chakraSpent;
      if (defRes.defenderWound) p2WoundDesc = defRes.defenderWound;
      if (defRes.attackerWound) p1WoundDesc = defRes.attackerWound;
      if (defRes.narrativeNote) narrativeSnippets.push(defRes.narrativeNote);
    }

    if (a2.primaryRanged && !a1.primaryDefense) {
      const defRes = evaluateTacticalDefense({
        defender: p1, defenderChar: c1, defenderCap: cap1, effReactSecDef: effReactSec1, predDef: pred1, speedDef: speed1,
        attacker: p2, attackerChar: c2, attackerCap: cap2, effReactSecAtk: effReactSec2, predAtk: pred2, speedAtk: speed2,
        incomingAttack: a2.primaryRanged, attackType: 'RANGED', currentDist, whySoDetails
      });
      p1ChakraSpent += defRes.chakraSpent;
      if (defRes.defenderWound) p1WoundDesc = defRes.defenderWound;
      if (defRes.attackerWound) p2WoundDesc = defRes.attackerWound;
      if (defRes.narrativeNote) narrativeSnippets.push(defRes.narrativeNote);
    }

    // Изменение дистанции при рывке / отскоке
    let delta = 0;
    if (a1.isSprint) delta += Math.round(speed1 * 0.5);
    if (a2.isSprint) delta += Math.round(speed2 * 0.5);
    if (a1.isRetreat) delta -= 6;
    if (a2.isRetreat) delta -= 6;
    newDistance = Math.max(5, currentDist - delta);
  }

  // ОБНОВЛЕНИЕ ПАРАМЕТРОВ ПЕРСОНАЖЕЙ В РЕАЛЬНОМ ВРЕМЕНИ ДЛЯ «МОЙ ПРОФИЛЬ» (Задача 4)
  const eye1Str = (c1.isEyeActive !== false && c1.eye && c1.eye.id !== 'none') ? `Глаза: ${c1.eye.name}` : null;
  const activeModes1Str = [eye1Str, ...p1ModeNames].filter(Boolean).join(' • ') || 'Базовое состояние';

  const eye2Str = (c2.isEyeActive !== false && c2.eye && c2.eye.id !== 'none') ? `Глаза: ${c2.eye.name}` : null;
  const activeModes2Str = [eye2Str, ...p2ModeNames].filter(Boolean).join(' • ') || 'Базовое состояние';

  c1.speed = speed1;
  c1.reaction = Math.round(effReactSec1 * 1000);
  c1.wounds = p1WoundDesc;
  c1.activeModes = activeModes1Str;
  c1.totalChakraSpent = (c1.totalChakraSpent || 0) + p1ChakraSpent;

  c2.speed = speed2;
  c2.reaction = Math.round(effReactSec2 * 1000);
  c2.wounds = p2WoundDesc;
  c2.activeModes = activeModes2Str;
  c2.totalChakraSpent = (c2.totalChakraSpent || 0) + p2ChakraSpent;

  // =========================================================================
  // ГЕНЕРАЦИЯ КИНЕМАТОГРАФИЧНОГО ЛИТЕРАТУРНОГО СЮЖЕТА (3 АБЗАЦА) + СТАТУС БЛОК (Задача 3)
  // Строжайшее правило: ИСКЛЮЧИТЕЛЬНО реальные имена p1.name и p2.name!
  // =========================================================================
  const p1ModesText = a1.modes.map(m => `«${m.name}»`).join(' и ');
  const p2ModesText = a2.modes.map(m => `«${m.name}»`).join(' и ');

  const narrativeP1 = `Старт раунда взрывается предельной концентрацией чакры: ${p1.name} ${a1.modes.length > 0 ? `мгновенно высвобождает ${p1ModesText}, окутывая тело плотной энергетической аурой` : `занимает устойчивую боевую стойку`}${a1.hasHiraishinMark ? `, оставляя у своих ног кунай с пространственной формулой Хирайсина для реактивного маневра` : ''}${a1.hasWeapon ? `, и с обнажённым клинком в руках` : ''} ${a1.isSprint ? `срывается в молниеносный спурт на скорости ${speed1} м/с через разделяющие ${currentDist} метров!` : `готовит тактический ответ.`}`;

  const narrativeP2 = `Однако ${p2.name} ни на долю секунды не уступает инициативу. ${a2.hasHiraishinMark ? `Веерным броском раскидав вокруг арены трезубые кунаи с метками Летящего Бога Грома, он` : `Мгновенно прочитав траекторию оппонента, он`} ${a2.isSprint ? `на встречной скорости ${speed2} м/с сокращает дистанцию` : `разворачивает защитные построения`}${a2.primaryMelee ? `, формируя в ладони сокрушительный выпад техники «${a2.primaryMelee.name}»!` : a2.primaryRanged ? `, концентрируя чакру для залпа «${a2.primaryRanged.name}»!` : `!`}`;

  let narrativeP3 = '';
  if (narrativeSnippets.length > 0) {
    narrativeP3 = narrativeSnippets.join('\n') + `\nОба воина разрывают контакт, стабилизируя дыхание на рубеже ${newDistance} метров в абсолютной боеготовности.`;
  } else if (clashType === 'MELEE_ENGAGEMENT') {
    narrativeP3 = `На отметке встречи пространство взрывается от колоссального кинетического столкновения! Вихревой выпад сотрясает воздух, но выверенная реакция и боевые рефлексы позволяют шиноби разминуться в воздухе без фатального урона.\nОба воина стабилизируют стойки на дистанции ${newDistance} метров.`;
  } else if (clashType === 'RANGED_CLASH') {
    narrativeP3 = `Два могущественных стихийных потока с грохотом врезаются друг в друга на перекрестном векторе! Энергетический купол детонации озаряет всё поле боя. Ударная волна сминает верхушки каменных глыб, пока бойцы отступают на рубеж ${newDistance} метров.`;
  } else {
    narrativeP3 = `Свист рассекаемого воздуха и взрывная вспышка оглашают полигон! Четко выверенный расчет времени подлёта и скоростной манёвр позволяют бойцам уйти из-под летального вектора атак. Сместившись на рубеж ${newDistance} метров, шиноби перегруппировываются для следующего размена.`;
  }

  // КАНОНИЧНЫЙ СТАТУС-БЛОК ПО ОКОНЧАНИИ РАУНДА (Раздел 2 правил)
  const remainingChakra1 = Math.max(0, (c1.chakra || 100000) - p1ChakraSpent);
  const remainingChakra2 = Math.max(0, (c2.chakra || 100000) - p2ChakraSpent);

  const statusBlock = `════ ТЕКУЩИЙ СТАТУС БОЙЦОВ ПОСЛЕ РАУНДА ════
🥋 ${p1.name}: Чакра ${remainingChakra1.toLocaleString('ru-RU')} (потрачено в раунде: ${p1ChakraSpent.toLocaleString('ru-RU')}, за бой: ${c1.totalChakraSpent.toLocaleString('ru-RU')}) / Скорость ${speed1} м/с (бег ${speed1} м / шаг+удар ${Math.round(speed1 / 2)} м) / Реакция ${Math.round(effReactSec1 * 1000)} мс (Предвидение ${pred1}%) / Ранения: ${p1WoundDesc} / Активные режимы и глаза: ${activeModes1Str}
🥋 ${p2.name}: Чакра ${remainingChakra2.toLocaleString('ru-RU')} (потрачено в раунде: ${p2ChakraSpent.toLocaleString('ru-RU')}, за бой: ${c2.totalChakraSpent.toLocaleString('ru-RU')}) / Скорость ${speed2} м/с (бег ${speed2} м / шаг+удар ${Math.round(speed2 / 2)} м) / Реакция ${Math.round(effReactSec2 * 1000)} мс (Предвидение ${pred2}%) / Ранения: ${p2WoundDesc} / Активные режимы и глаза: ${activeModes2Str}
📏 Дистанция между бойцами: ${newDistance} метров.`;

  const fullNarrative = `${narrativeP1}\n\n${narrativeP2}\n\n${narrativeP3}\n\n${statusBlock}`;
  const versionPrefix = isTactical ? '⚖ Почему так (Регламент 0.3.3 Тактический):' : '⚖ Почему так (Регламент 0.3.2 Базовый):';
  const whySoStr = `${versionPrefix} ${whySoDetails.join(' ')}`;

  return {
    narrative: fullNarrative,
    whySo: whySoStr,
    p1ChakraChange: -p1ChakraSpent,
    p2ChakraChange: -p2ChakraSpent,
    p1Wounds: p1WoundDesc,
    p2Wounds: p2WoundDesc,
    newDistance,
    isBattleOver: false,
    winner: null
  };
}

/**
 * Разрешение раунда командного боя 2v2 с точным расчетом тактических реакций [Р], [М], [Г]
 */
function resolve2v2TacticalBattle(room) {
  const players = Array.from(room.players.values());
  const blue = players.filter(p => p.team === 'blue');
  const red = players.filter(p => p.team === 'red');
  const blueTeam = blue.length > 0 ? blue : players.slice(0, 2);
  const redTeam = red.length > 0 ? red : players.slice(2, 4);

  const currentDist = Number(room.distance) || 35;
  const chakraChanges = {};
  const wounds = {};
  const whySoList = [];

  const blueNames = blueTeam.map(p => p.name).join(' и ');
  const redNames = redTeam.map(p => p.name).join(' и ');

  const parsedPlayers = players.map(p => {
    const act = room.pendingActions.get(p.id) || room.pendingActions.get(p.socketId) || 'маневрирует';
    const parsed = parseFullAction(act, p.character);
    const cap = getFighterTacticalCapabilities(p, p.character, parsed);
    let speed = Number(p.character?.speed) || Number(p.character?.baseSpeed) || 24;
    const react = Number(p.character?.reaction) || Number(p.character?.baseReaction) || 160;
    const pred = Number(p.character?.predvidenie) || 0;
    const effReactSec = (react * (1 - pred / 100)) / 1000;

    // Учет покровов и режимов
    let modeBonus = 0;
    let modeNames = [];
    const actLower = act.toLowerCase();
    if (parsed.modes.some(m => m.id === 216) || actLower.includes('райтон но ёрой') || actLower.includes('#216')) {
      modeBonus += 30;
      modeNames.push('Райтон но Ёрой (+30%)');
    }
    if (parsed.modes.some(m => m.id === 214) || actLower.includes('покров чакры') || actLower.includes('#214')) {
      modeBonus += 20;
      modeNames.push('Покров чакры (+20%)');
    }
    if (parsed.modes.some(m => m.id === 217) || actLower.includes('врата') || actLower.includes('#217')) {
      modeBonus += 25;
      modeNames.push('Хатимон Тонко (+25%)');
    }
    if (parsed.modes.some(m => m.id === 223) || actLower.includes('плащ') || actLower.includes('#223')) {
      modeBonus += 25;
      modeNames.push('Плащ ветра (+25%)');
    }
    if (modeBonus > 0) {
      speed = Math.round(speed * (1 + modeBonus / 100));
    }

    let spent = 0;
    if (parsed.foundJutsu.length > 0) {
      parsed.foundJutsu.forEach(j => { spent += calculateJutsuCost(j, p.character || {}); });
    } else {
      spent = 4000;
    }

    // Обновляем статы в объекте character для «Мой профиль»
    const eyeStr = (p.character?.isEyeActive !== false && p.character?.eye && p.character?.eye.id !== 'none') ? `Глаза: ${p.character.eye.name}` : null;
    const activeModesStr = [eyeStr, ...modeNames].filter(Boolean).join(' • ') || 'Базовое состояние';

    if (p.character) {
      p.character.speed = speed;
      p.character.reaction = Math.round(effReactSec * 1000);
      p.character.activeModes = activeModesStr;
      p.character.wounds = 'В строю (прикрытие напарника)';
      p.character.totalChakraSpent = (p.character.totalChakraSpent || 0) + spent;
    }

    return {
      player: p,
      act,
      parsed,
      cap,
      speed,
      react,
      pred,
      effReactSec,
      spent,
      activeModesStr
    };
  });

  // Расчет взаимного прикрытия и реакций
  parsedPlayers.forEach(entry => {
    const p = entry.player;
    if (entry.cap.reactiveMobility.length > 0) {
      const mob = entry.cap.reactiveMobility[0];
      whySoList.push(`${p.name} держит в готовности реактивную мобильность [М]: «${mob.name}».`);
    }
    if (entry.cap.reactiveCounter.length > 0) {
      const ctr = entry.cap.reactiveCounter[0];
      whySoList.push(`${p.name} прикрывает позицию реактивной контратакой [Р]: «${ctr.name}».`);
    }

    chakraChanges[p.name] = -entry.spent;
    wounds[p.name] = 'В форме (прикрытие напарника)';
  });

  const blueActions = blueTeam.map(p => {
    const act = room.pendingActions.get(p.id) || room.pendingActions.get(p.socketId) || 'маневрирует';
    return `${p.name}: «${act}»`;
  }).join(' | ');

  const redActions = redTeam.map(p => {
    const act = room.pendingActions.get(p.id) || room.pendingActions.get(p.socketId) || 'маневрирует';
    return `${p.name}: «${act}»`;
  }).join(' | ');

  const narrativeP1 = `МАСШТАБНОЕ КОМАНДНОЕ СТОЛКНОВЕНИЕ 2v2 (Дистанция ${currentDist}м):\nКоманда Синих (${blueNames}) синхронно реализует скоординированный тактический план: ${blueActions}! Напарники выстраивают перекрестное прикрытие, комбинируя углы обзора и прикрывая слепые зоны друг друга.`;

  const narrativeP2 = `Команда Красных (${redNames}) мгновенно реагирует на изменение позиций: ${redActions}! Бойцы подхватывают маневры союзников, встречая напор слаженными защитными барьерами и реактивными контр-действиями.`;

  const narrativeP3 = `Громоподобные детонации сотрясают арену по широкому фронту! Взаимная поддержка союзников и своевременное срабатывание реактивных техник уклонения не позволяют нанести критический урон ни одному из участников. Поднятая каменная пыль заволакивает полигон, и обе пары бойцов разрывают контакт, перегруппировываясь на рубеже ${Math.max(10, currentDist - 8)} метров!`;

  // Каноничный статус-блок 2v2
  const statusRows = parsedPlayers.map(e => {
    const rem = Math.max(0, (e.player.character?.chakra || 100000) - e.spent);
    return `🥋 ${e.player.name}: Чакра ${rem.toLocaleString('ru-RU')} (потрачено: ${e.spent.toLocaleString('ru-RU')}) / Скорость ${e.speed} м/с / Реакция ${Math.round(e.effReactSec * 1000)} мс (Предвидение ${e.pred}%) / Ранения: В строю / Режимы: ${e.activeModesStr}`;
  }).join('\n');

  const statusBlock = `════ ТЕКУЩИЙ СТАТУС БОЙЦОВ ПОСЛЕ РАУНДА ════\n${statusRows}\n📏 Дистанция между командами: ${Math.max(10, currentDist - 8)} метров.`;

  const narrative = `${narrativeP1}\n\n${narrativeP2}\n\n${narrativeP3}\n\n${statusBlock}`;
  const isTactical = (room?.gameVersion || '0.3.3') === '0.3.3';
  const versionHeader = isTactical ? '⚖ Почему так (Регламент 0.3.3 Тактический):' : '⚖ Почему так (Регламент 0.3.2 Базовый):';
  const whySo = `${versionHeader} Командный расчет (2v2). ${whySoList.join(' ')} Парная координация позволила нейтрализовать концентрированные выпады через своевременное прикрытие напарников. Расход чакры строго рассчитан по примененным техникам каждого бойца.${isTactical ? ' Дистанция сокращена на 8м.' : ''}`;

  return {
    narrative,
    whySo,
    chakraChanges,
    wounds,
    p1ChakraChange: chakraChanges[players[0]?.name] || -20000,
    p2ChakraChange: chakraChanges[players[1]?.name] || -20000,
    newDistance: Math.max(10, currentDist - 8),
    isBattleOver: false,
    winner: null
  };
}

module.exports = {
  ALL_JUTSU,
  PROJECTILE_SPEEDS,
  ELEMENT_ADVANTAGES,
  classifyJutsu,
  parseFullAction,
  calculateJutsuCost,
  getFighterTacticalCapabilities,
  evaluateTacticalDefense,
  resolve1v1TacticalBattle,
  resolve2v2TacticalBattle
};
