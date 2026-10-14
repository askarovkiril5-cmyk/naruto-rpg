const { resolve1v1TacticalBattle } = require('../server/tacticalCombatEngine');
const jutsuData = require('../server/jutsuData.json');
const { CLAN_TEMPLATES, CANONICAL_CLAN_NAMES, generateCharacter } = require('../server/clanTemplates');

console.log('=== TEST 1: VERIFY ARSENAL 251 TECHNIQUES & VERSION DESCRIPTIONS ===');
console.log('Total jutsu count:', jutsuData.length);
if (jutsuData.length !== 251) throw new Error('Expected 251 jutsu!');

const hiraishin = jutsuData.find(j => j.id === 9);
console.log('Hiraishin v0.3.3 desc:', hiraishin.desc_v033);
console.log('Hiraishin v0.3.2 desc:', hiraishin.desc_v032);
if (!hiraishin.desc_v033.includes('[О]')) throw new Error('v0.3.3 Hiraishin must have [О] range tag!');
if (hiraishin.desc_v032.includes('[О]')) throw new Error('v0.3.2 Hiraishin should NOT have [О] range tag!');

const chidori = jutsuData.find(j => j.id === 57);
console.log('Chidori v0.3.3 range:', chidori.range_v033);
console.log('Chidori v0.3.2 range:', chidori.range_v032);

console.log('\n=== TEST 2: VERIFY CLANS (ONLY 9 CANONICAL REMAIN) ===');
console.log('CLAN_TEMPLATES count:', CLAN_TEMPLATES.length);
const clanNames = CLAN_TEMPLATES.map(c => c.clan);
console.log('Clans:', clanNames);

const forbiddenClans = ['Нара', 'Абураме', 'Инузука', 'Акимити', 'Яманака', 'Кагуя'];
forbiddenClans.forEach(fc => {
  if (clanNames.includes(fc)) {
    throw new Error(`Clan ${fc} was not removed!`);
  }
});
console.log('✓ All 6 forbidden clans successfully removed!');

console.log('\n=== TEST 3: BATTLE RESOLUTION VERSION ADAPTATION ===');
const p1 = { name: 'Саске', character: generateCharacter('Саске', { clans: ['Учиха'] }) };
const p2 = { name: 'Неджи', character: generateCharacter('Неджи', { clans: ['Хьюга'] }) };

const res033 = resolve1v1TacticalBattle(
  { distance: 25, gameVersion: '0.3.3' },
  p1, p2,
  'Рывок с Чидори (#57)',
  'Активирую Хаккэ Сё Кайтен (#25)'
);
console.log('\nVerdict v0.3.3 prefix:');
console.log(res033.whySo.slice(0, 80) + '...');
if (!res033.whySo.includes('Регламент 0.3.3 Тактический')) throw new Error('Expected 0.3.3 whySo header!');

const res032 = resolve1v1TacticalBattle(
  { distance: 25, gameVersion: '0.3.2' },
  p1, p2,
  'Рывок с Чидори (#57)',
  'Активирую Хаккэ Сё Кайтен (#25)'
);
console.log('\nVerdict v0.3.2 prefix:');
console.log(res032.whySo.slice(0, 80) + '...');
if (!res032.whySo.includes('Регламент 0.3.2 Базовый')) throw new Error('Expected 0.3.2 whySo header!');

console.log('\n✅ ALL VERSION ADAPTATION & CLAN TESTS PASSED!');
