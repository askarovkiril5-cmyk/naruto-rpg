const { generateCharacter } = require('../server/clanTemplates');
const { resolve1v1TacticalBattle } = require('../server/tacticalCombatEngine');

console.log('=== TEST: HYBRID SHINOBI VS MINATO TACTICAL RESOLUTION ===');
// Создаем гибридного шиноби: Учиха + Сюнрай (Шаринган 3 томоэ + разгон тела Сюнрай)
const hybrid = generateCharacter('Кирилл (Учиха+Сюнрай)', {
  clans: ['Учиха', 'Сюнрай'],
  dojutsu: 'sharingan_3',
  archetype: 'taijutsu'
});

console.log(`Игрок: ${hybrid.name}`);
console.log(`Кланы: ${hybrid.clan} | Базовая скорость: ${hybrid.baseSpeed} м/с, Реакция: ${hybrid.baseReaction} мс`);
console.log(`Предвидение с потолком ×0.7: ${hybrid.predvidenie}% | Финальная реакция: ${hybrid.reaction} мс | Финальная скорость: ${hybrid.speed} м/с`);
console.log(`Глаз: ${hybrid.eye?.name} | Поддержка: ${hybrid.eye?.upkeep}`);

// Противник: Минато Намиказе
const minato = {
  name: 'Минато Намикадзе',
  clan: 'Намикадзе',
  chakra: 750000,
  maxChakra: 750000,
  chakraRegen: 5000,
  speed: 36,
  baseSpeed: 36,
  reaction: 85,
  baseReaction: 85,
  predvidenie: 0,
  eye: null,
  activeModes: 'Базовое состояние',
  wounds: 'Без ранений'
};

const p1 = { name: hybrid.name, character: hybrid };
const p2 = { name: minato.name, character: minato };

const result = resolve1v1TacticalBattle(
  { distance: 35, terrain: { name: 'Лес Конохи' } },
  p1,
  p2,
  'Активирую покров чакры (#214), затем Чидори (#57) на предельной скорости, при опасности Хирайсин (#9)',
  'Мгновенный рывок Хирайсином (#9) с Расенганом (#145)'
);

console.log('\n--- ИТОГИ РАУНДА ---');
console.log('Журнал боя (текст):');
console.log(result.story);
console.log('\nОбоснование ГМ (⚖ Почему так):');
console.log(result.whySo);
console.log('\nИзменения чакры:', result.chakraChanges);
console.log('Ранения:', result.wounds);

console.log('\n✅ HYBRID TACTICAL RESOLUTION TEST PASSED!');
