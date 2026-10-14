/**
 * jutsuHelper.js
 * Утилиты для версионной адаптации техник (Регламент 0.3.2 Базовый vs 0.3.3 Тактический)
 */

export function getJutsuDesc(jutsu, gameVersion = '0.3.3') {
  if (!jutsu) return '';
  if (gameVersion === '0.3.2') {
    return jutsu.desc_v032 || jutsu.cleanDesc_v032 || jutsu.desc || '';
  }
  return jutsu.desc_v033 || jutsu.cleanDesc_v033 || jutsu.desc || '';
}

export function getJutsuCleanDesc(jutsu, gameVersion = '0.3.3') {
  if (!jutsu) return '';
  if (gameVersion === '0.3.2') {
    return jutsu.cleanDesc_v032 || jutsu.desc_v032 || jutsu.desc || '';
  }
  return jutsu.cleanDesc_v033 || jutsu.desc_v033 || jutsu.desc || '';
}

export function getJutsuRange(jutsu, gameVersion = '0.3.3') {
  if (!jutsu) return '';
  if (gameVersion === '0.3.2') {
    return jutsu.range_v032 || 'Базовый радиус';
  }
  return jutsu.range_v033 || jutsu.range || '[Я] На себя';
}

export function getJutsuTags(jutsu, gameVersion = '0.3.3') {
  if (!jutsu) return [];
  if (gameVersion === '0.3.2') {
    return jutsu.tags_v032 || [];
  }
  return jutsu.tags_v033 || jutsu.tags || [];
}

/**
 * Требования техник по каноничной ТАБЛИЦЕ ТРЕБОВАНИЙ (Раздел 6 правил)
 */
export const JUTSU_REQUIREMENTS = {
  12: 'Требует в сборке №217 (Открытие Врат)',
  98: 'Требует предрасположенность к Огню И Ветру',
  99: 'Требует предрасположенность к Воде И Молнии',
  100: 'Требует предрасположенность к Земле И Огню',
  101: 'Требует предрасположенность к Земле И Огню',
  102: 'Требует предрасположенность к Ветру И Молнии',
  103: 'Требует предрасположенность к Воде И Земле',
  104: 'Требует предрасположенность минимум к 2 стихиям',
  144: 'Требует клан Удзумаки в родословной',
  167: 'Требует клан Хьюга в родословной',
  168: 'Требует клан Учиха в родословной',
  169: 'Требует клан Удзумаки в родословной',
  172: 'Требует клан Хьюга в родословной',
  173: 'Требует клан Учиха в родословной',
  174: 'Требует клан Удзумаки в родословной',
  216: 'Требует предрасположенность к Молнии',
  220: 'Требует оружие в руке',
  221: 'Требует в сборке №138 (Марионеточный призыв)',
  222: 'Требует в сборке №10 (Скрывающий туман)',
  223: 'Требует предрасположенность хотя бы к 1 стихии',
  232: 'Требует предрасположенность к превосходящей стихии',
  238: 'Требует минимум 2 додзюцу одновременно'
};

/**
 * Тактическая классификация техники (Реактивная контратака, Мобильность, Гендзюцу)
 */
export function getJutsuTacticalInfo(jutsu) {
  if (!jutsu) return {};
  const id = Number(jutsu.id) || 0;
  const tagsStr = (jutsu.tags || []).join(' ');
  const descStr = (jutsu.desc || '') + ' ' + (jutsu.desc_v033 || '');
  const cat = (jutsu.category || '').toUpperCase();

  const isReactiveCounter = id === 991 || id === 281 || (id >= 225 && id <= 238) || id === 996 ||
    cat.includes('КОНТРАТАК') || tagsStr.includes('[Р]') || descStr.includes('[Р]');
  const isReactiveMobility = id === 1 || id === 7 || id === 9 || (id >= 239 && id <= 245) ||
    cat.includes('МОБИЛЬНОСТЬ') || tagsStr.includes('[М]') || descStr.includes('[М]');
  const isGenjutsuCounter = id === 4 || id === 230 || id === 236 || tagsStr.includes('[Г]') || descStr.includes('[Г]');
  const req = JUTSU_REQUIREMENTS[id] || null;

  return {
    isReactiveCounter,
    isReactiveMobility,
    isGenjutsuCounter,
    requirement: req
  };
}

/**
 * Точное сопоставление категории дзюцу без ложных совпадений подстрок (напр. "разряд" не попадает в "яды")
 */
export function matchJutsuCategory(item, selectedCategory) {
  if (!item) return false;
  if (!selectedCategory || selectedCategory === 'Все') return true;
  const cat = (item.category || '').toUpperCase();
  const val = selectedCategory.toUpperCase();

  if (val === 'ЯДЫ' || val === 'ЯД') {
    return cat === 'ЯДЫ' || (item.id >= 153 && item.id <= 158);
  }
  if (val === 'БАЗОВ' || val === 'БАЗОВЫЕ') {
    return cat.includes('БАЗОВ') || (item.id >= 1 && item.id <= 10);
  }
  if (val === 'ТАЙДЗЮЦУ') {
    return (cat.includes('ТАЙДЗЮЦУ') && item.id <= 26) || (item.id >= 11 && item.id <= 26);
  }
  if (val === 'ОРУЖИ' || val === 'ОРУЖИЕ') {
    return cat.includes('ОРУЖИ') || (item.id >= 27 && item.id <= 40);
  }
  if (val === 'ОГОНЬ') {
    return cat.includes('ОГОНЬ') || cat.includes('КАТОН');
  }
  if (val === 'ВЕТЕР') {
    return cat.includes('ВЕТЕР') || cat.includes('ФУУТОН');
  }
  if (val === 'МОЛНИЯ') {
    return cat.includes('МОЛНИЯ') || cat.includes('РАЙТОН');
  }
  if (val === 'ЗЕМЛЯ') {
    return cat.includes('ЗЕМЛЯ') || cat.includes('ДОТОН');
  }
  if (val === 'ВОДА') {
    return cat.includes('ВОДА') || cat.includes('СУЙТОН');
  }
  if (val === 'РАСЕНГАН') {
    return cat.includes('РАСЕНГАН') || (item.id >= 94 && item.id <= 97);
  }
  if (val === 'ГЕНДЗЮЦУ') {
    return cat.includes('ГЕНДЗЮЦУ') || (item.id >= 105 && item.id <= 113);
  }
  if (val === 'ПЕЧАТИ') {
    return cat.includes('ПЕЧАТИ') || (item.id >= 114 && item.id <= 131);
  }
  if (val === 'ПРИЗЫВ' || val === 'ПРИЗЫВЫ') {
    return cat.includes('ПРИЗЫВ') || (item.id >= 132 && item.id <= 136);
  }
  if (val === 'МАРИОНЕТК' || val === 'МАРИОНЕТКИ') {
    return cat.includes('МАРИОНЕТК') || (item.id >= 137 && item.id <= 142);
  }
  if (val === 'МЕДИЦИН' || val === 'МЕДИЦИНА') {
    return cat.includes('МЕДИЦИН') || (item.id >= 143 && item.id <= 152);
  }
  if (val === 'КЛАН' || val === 'КЛАНОВЫЕ') {
    return cat.includes('КЛАН') || (item.id >= 159 && item.id <= 176);
  }
  if (val === 'КЕККЕЙ') {
    return cat.includes('КЕККЕЙ') || (item.id >= 177 && item.id <= 182);
  }
  if (val === 'ТАКТИЧ' || val === 'ТАКТИЧЕСКИЕ') {
    return cat.includes('ТАКТИЧ') || (item.id >= 183 && item.id <= 196);
  }
  if (val === 'КОНТРАТАК' || val === 'КОНТРАТАКИ') {
    return cat.includes('КОНТРАТАК') || (item.id >= 225 && item.id <= 238) || (item.tags && item.tags.some(t => t.includes('[Р]')));
  }
  if (val === 'МОБИЛЬНОСТЬ') {
    return cat.includes('МОБИЛЬНОСТЬ') || (item.id >= 239 && item.id <= 245) || (item.tags && item.tags.some(t => t.includes('[М]')));
  }
  if (val === 'РЕЖИМ' || val === 'РЕЖИМЫ') {
    return cat.includes('РЕЖИМ') || item.rank === 'Режим' || (item.id >= 214 && item.id <= 224);
  }
  return cat.includes(val);
}
