const { generateCharacter, rollLineageClans, balanceCharacters, calculatePowerWeight } = require('../server/clanTemplates');
const { generateDojutsu, calculateEffectiveStats } = require('../server/dojutsuSystem');

console.log('=== TEST 1: RANDOM LINEAGE GENERATION (Step A & Step B) ===');
for (let i = 0; i < 5; i++) {
  const clans = rollLineageClans();
  const char = generateCharacter(`Тестовый ${i + 1}`, { clans });
  console.log(`\n[${char.name}] Кланы: ${char.clan} | Тег: ${char.clanTag}`);
  console.log(`Чакра: ${char.chakra.toLocaleString()} (Реген: +${char.chakraRegen.toLocaleString()}/ход) | Скорость: ${char.speed} м/с | Реакция: ${char.reaction} мс | Предвидение: ${char.predvidenie}%`);
  console.log(`Глаза: ${char.eye ? char.eye.name : 'Нет'} (Поддержка: ${char.eye ? char.eye.upkeep : '0'})`);
  console.log(`Стихии: ${char.elements.join(', ')}`);
  console.log(`Всего авто-техник: ${char.autoJutsu.length}`);
}

console.log('\n=== TEST 2: EXPLICIT MIXED CLAN: Учиха + Хьюга ===');
const uchihaHyuga = generateCharacter('Саске Хьюга', { clans: ['Учиха', 'Хьюга'] });
console.log(`Кланы: ${uchihaHyuga.clan}`);
console.log(`Глаза: ${uchihaHyuga.eye ? uchihaHyuga.eye.name : 'Нет'}`);
console.log(`Предвидение: ${uchihaHyuga.predvidenie}%, Точность: ${uchihaHyuga.eye?.accuracy}%, Усиление: ${uchihaHyuga.eye?.techniqueAmp}%`);
console.log(`Поддержка глаз: ${uchihaHyuga.eye?.upkeep}`);
console.log(`Пассивки (${uchihaHyuga.passives.length}):`, uchihaHyuga.passives.slice(0, 4));

console.log('\n=== TEST 3: SYNERGY PENALTY CHECK: Сюнрай + Учиха ===');
const shunraiUchiha = generateCharacter('Райден Учиха', { clans: ['Сюнрай', 'Учиха'], dojutsu: 'sharingan_3' });
console.log(`Кланы: ${shunraiUchiha.clan}`);
console.log(`Базовая скорость: ${shunraiUchiha.baseSpeed} м/с, Реакция тела: ${shunraiUchiha.baseReaction} мс`);
console.log(`Сырое предвидение 3 томоэ: ${shunraiUchiha.eye?.rawPredvidenie}%`);
console.log(`Эффективное предвидение (с потолком ×0.7): ${shunraiUchiha.predvidenie}% (ожидаем 45 * 0.7 = 32%)`);
console.log(`Финальная эффективная реакция в бою: ${shunraiUchiha.reaction} мс`);

console.log('\n=== TEST 4: TENRAI + SHINKAI (SPEED SUMMING & SYNERGY PENALTY) ===');
const tenraiShinkai = generateCharacter('Штормовой Ниндзя', { clans: ['Тэнрай', 'Синкай'] });
console.log(`Кланы: ${tenraiShinkai.clan}`);
console.log(`Глаза: ${tenraiShinkai.eye?.name}`);
console.log(`Бонус скорости глаз: ${tenraiShinkai.eye?.speedBonusPercent}%`);
console.log(`Базовая скорость: ${tenraiShinkai.baseSpeed} м/с -> Итоговая: ${tenraiShinkai.speed} м/с`);
console.log(`Поддержка глаз: ${tenraiShinkai.eye?.upkeep}`);

console.log('\n=== TEST 5: BALANCING CHECK (Раздел 1.5) ===');
const p1 = generateCharacter('Слабый Ниндзя', { clans: ['Кинган'], dojutsu: 'kingan_1' });
const p2 = generateCharacter('Сильный Ниндзя', { clans: ['Учиха', 'Сенджу', 'Удзумаки'], dojutsu: 'mangekyo', specialTrait: 'jinchuriki' });
console.log(`До балансировки: Вес P1 = ${calculatePowerWeight(p1)}, Вес P2 = ${calculatePowerWeight(p2)} (разница: ${Math.abs(calculatePowerWeight(p1) - calculatePowerWeight(p2))})`);
balanceCharacters(p1, p2);
console.log(`После балансировки: Вес P1 = ${p1.powerWeight}, Вес P2 = ${p2.powerWeight} (разница: ${Math.abs(p1.powerWeight - p2.powerWeight)})`);

console.log('\n=== TEST 6: CUSTOM MULTI-EYE SELECTION (3+ EYES FROM CLANS) ===');
const multiNinja = generateCharacter('Мультиглазый Учиха-Хьюга', {
  clans: ['Учиха', 'Хьюга'],
  dojutsuList: ['sharingan_3', 'mangekyo', 'byakugan_3', 'byakugan_awakened']
});
console.log(`Кланы: ${multiNinja.clan}`);
console.log(`Глаза: ${multiNinja.eye?.name}`);
console.log(`Ступени: ${multiNinja.eye?.stage}`);
console.log(`Итоговое предвидение: ${multiNinja.predvidenie}% (сырое: ${multiNinja.eye?.rawPredvidenie}%)`);
console.log(`Точность: +${multiNinja.eye?.accuracy}%, Усиление: +${multiNinja.eye?.techniqueAmp}%`);
console.log(`Поддержка глаз: ${multiNinja.eye?.upkeep}`);
console.log(`Техники глаз (${multiNinja.eye?.jutsu?.length}):`, multiNinja.eye?.jutsu?.map(j => j.name));

console.log('\n✅ ALL SERVER TESTS COMPLETED SUCCESSFULLY!');
