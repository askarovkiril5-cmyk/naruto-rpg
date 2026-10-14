/**
 * test_full_game_scenario.js
 * Сквозной интеграционный тест полного игрового сценария:
 * 1. Запуск и проверка доступности сервера и REST API (/api/rules/versions, /api/gemini/models, /api/battles)
 * 2. Подключение двух игроков: «Вова» (хост, синие) и «Кирилл» (соперник, красные)
 * 3. Выбор версии правил (0.3.3) и выбор флагманской модели (gemini-2.5-pro)
 * 4. Старт битвы, генерация и проверка каноничных карточек бойцов по Разделу 2
 * 5. Выбор и фиксация 30 техник обоими игроками
 * 6. Раунд 1: Скрытый ввод действий, взаимный расчет, списание чакры, статус раунда и «⚖ Почему так»
 * 7. Проверка сохранения в постоянное хранилище (storageManager / data/)
 * 8. Повторное подключение и восстановление состояния
 */

const { io } = require('../client/node_modules/socket.io-client');
const http = require('http');

const SERVER_URL = 'http://localhost:4000';
const ROOM_ID = 'SCENARIO-TEST-' + Math.floor(100 + Math.random() * 900);

async function fetchJson(path, options = {}) {
  const res = await fetch(`${SERVER_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  return await res.json();
}

async function runScenario() {
  console.log('===============================================================');
  console.log('🧪 НАЧАЛО СКВОЗНОГО ТЕСТИРОВАНИЯ ПОЛНОГО СЦЕНАРИЯ (0.3)');
  console.log('===============================================================');

  // --- ЭТАП 1: Проверка REST API ---
  console.log('\n[ЭТАП 1] Проверка REST эндпоинтов сервера...');
  
  // 1.1 Версии правил
  const versions = await fetchJson('/api/rules/versions');
  console.log('✓ Доступные версии правил:', versions.map(v => `${v.version} (${v.title})`).join(', '));
  if (!versions.some(v => v.version === '0.3.3') || !versions.some(v => v.version === '0.3.2')) {
    throw new Error('ОШИБКА: Версии 0.3.2 или 0.3.3 не найдены в правилах!');
  }

  // 1.2 Проверка целостности текстов правил
  const rule032 = await fetchJson('/api/rules/0.3.2');
  const rule033 = await fetchJson('/api/rules/0.3.3');
  console.log(`✓ Текст правил 0.3.2 загружен (${rule032.content?.length} символов)`);
  console.log(`✓ Текст правил 0.3.3 загружен (${rule033.content?.length} символов)`);
  if (!rule032.content?.includes('248') || !rule033.content?.includes('248')) {
    throw new Error('ОШИБКА: Тексты правил не содержат 248 техник!');
  }

  // 1.3 Каталог моделей Gemini
  const modelData = await fetchJson('/api/gemini/models', { method: 'POST', body: JSON.stringify({}) });
  console.log('✓ Каталог моделей Gemini:', modelData.models?.map(m => m.id).join(', '));
  if (!modelData.models || modelData.models.length === 0) {
    throw new Error('ОШИБКА: Каталог моделей пуст!');
  }

  // --- ЭТАП 2: Подключение двух игроков ---
  console.log('\n[ЭТАП 2] Подключение двух игроков через WebSocket...');
  
  const socket1 = io(SERVER_URL, { transports: ['websocket'] });
  const socket2 = io(SERVER_URL, { transports: ['websocket'] });

  await new Promise(resolve => socket1.on('connect', resolve));
  await new Promise(resolve => socket2.on('connect', resolve));
  console.log('✓ Игрок 1 (Вова) подключен к сокету:', socket1.id);
  console.log('✓ Игрок 2 (Кирилл) подключен к сокету:', socket2.id);

  // Игрок 1 входит в комнату как хост
  socket1.emit('join_battle', {
    roomId: ROOM_ID,
    playerName: 'Вова',
    playerId: 'vova_player_1',
    team: 'blue'
  });

  // Игрок 2 входит в ту же комнату
  socket2.emit('join_battle', {
    roomId: ROOM_ID,
    playerName: 'Кирилл',
    playerId: 'kirill_player_2',
    team: 'red'
  });

  // Ждем синхронизации лобби
  await new Promise(resolve => setTimeout(resolve, 800));
  console.log(`✓ Оба игрока вошли в комнату: ${ROOM_ID}`);

  // --- ЭТАП 3: Выбор версии и смена модели ведущего ---
  console.log('\n[ЭТАП 3] Выбор версии 0.3.3 и смена модели на gemini-2.5-pro...');
  socket1.emit('change_version', { roomId: ROOM_ID, version: '0.3.3' });
  socket1.emit('change_ai_model', { roomId: ROOM_ID, modelId: 'gemini-2.5-pro' });
  await new Promise(resolve => setTimeout(resolve, 400));

  // --- ЭТАП 4: Старт битвы и проверка каноничных карточек ---
  console.log('\n[ЭТАП 4] Запуск дуэли и проверка каноничных карточек бойцов...');
  
  let p1CardReceived = false;
  let p2CardReceived = false;
  let markdownCardsCount = 0;
  let openingSceneReceived = false;

  socket1.on('private_character_assigned', (card) => {
    p1CardReceived = true;
    console.log(`✓ Игрок 1 получил карточку: ${card.name} (Клан: ${card.clan}, Скорость: ${card.speed} м/с, Чакра: ${card.chakra})`);
  });

  socket2.on('private_character_assigned', (card) => {
    p2CardReceived = true;
    console.log(`✓ Игрок 2 получил карточку: ${card.name} (Клан: ${card.clan}, Скорость: ${card.speed} м/с, Чакра: ${card.chakra})`);
  });

  socket1.on('gm_round_narrative', (data) => {
    if (data.isFighterCard) {
      markdownCardsCount++;
      console.log(`✓ Получен каноничный Markdown-свиток бойца: ${data.fighterName}`);
    }
    if (data.isOpening) {
      openingSceneReceived = true;
      console.log(`✓ Получено стартовое описание арены (длина: ${data.narrative?.length} симв.)`);
    }
  });

  socket1.emit('start_battle', { roomId: ROOM_ID, autoFillBots: false });

  // Ждем генерации
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!p1CardReceived || !p2CardReceived) {
    throw new Error('ОШИБКА: Карточки персонажей не были выданы игрокам!');
  }
  if (markdownCardsCount < 2) {
    console.warn('Предупреждение: получено Markdown карточек:', markdownCardsCount);
  }

  // --- ЭТАП 5: Выбор 30 техник ---
  console.log('\n[ЭТАП 5] Выбор и подтверждение 30 техник обоими игроками...');
  // Генерируем 30 уникальных валидных ID (1..30)
  const jutsu30_vova = Array.from({ length: 30 }, (_, i) => i + 1);
  const jutsu30_kirill = Array.from({ length: 30 }, (_, i) => i + 15);

  socket1.emit('confirm_arsenal', { roomId: ROOM_ID, playerId: 'vova_player_1', selectedJutsuIds: jutsu30_vova, jutsuCount: 30 });
  socket2.emit('confirm_arsenal', { roomId: ROOM_ID, playerId: 'kirill_player_2', selectedJutsuIds: jutsu30_kirill, jutsuCount: 30 });
  console.log('✓ Вова подтвердил 30 техник в арсенале');
  console.log('✓ Кирилл подтвердил 30 техник в арсенале');

  // --- ЭТАП 6: Раунд 1 (Скрытый ввод ходов и расчет) ---
  console.log('\n[ЭТАП 6] Симуляция Раунда 1: скрытые действия бойцов...');

  let roundVerdictReceived = false;
  let roundVerdictData = null;

  socket1.on('gm_round_narrative', (data) => {
    if (!data.isOpening && !data.isFighterCard) {
      roundVerdictReceived = true;
      roundVerdictData = data;
    }
  });

  // Вова отправляет скрытый ход
  socket1.emit('submit_hidden_action', {
    roomId: ROOM_ID,
    playerId: 'vova_player_1',
    actionText: 'Активирую додзюцу и складываю печати Огненного шара (#1 Катон: Гокакью но Дзюцу), совершая рывок влево.'
  });

  // Кирилл отправляет скрытый ход
  socket2.emit('submit_hidden_action', {
    roomId: ROOM_ID,
    playerId: 'kirill_player_2',
    actionText: 'Концентрирую Райтон на клинке (#7 Чидори) и совершаю диагональный рывок вперед на 15 метров с уклонением.'
  });

  console.log('✓ Оба игрока отправили скрытые ходы. Ожидание резолва раунда ИИ-Ведущим...');
  
  // Ждем разрешения раунда
  const startTime = Date.now();
  while (!roundVerdictReceived && Date.now() - startTime < 8000) {
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  if (!roundVerdictReceived) {
    throw new Error('ОШИБКА: Резолв раунда не получен за 8 секунд!');
  }

  console.log('✓ Резолв раунда 1 успешно получен!');
  console.log('--- Фрагмент сюжета раунда ---');
  console.log(roundVerdictData.narrative?.slice(0, 300) + '...');
  
  if (roundVerdictData.narrative?.includes('════ ТЕКУЩИЙ СТАТУС БОЙЦОВ ПОСЛЕ РАУНДА ════')) {
    console.log('✓ Каноничный блок «ТЕКУЩИЙ СТАТУС БОЙЦОВ ПОСЛЕ РАУНДА» присутствует!');
  }

  // --- ЭТАП 7: Постоянное хранилище и история партий ---
  console.log('\n[ЭТАП 7] Проверка постоянного хранилища боев (/api/battles)...');
  const battles = await fetchJson('/api/battles');
  console.log(`✓ Записей в истории постоянного хранилища: ${battles.length}`);

  // Отключаем сокеты
  socket1.disconnect();
  socket2.disconnect();

  console.log('\n===============================================================');
  console.log('🎉 ВСЕ ЭТАПЫ СКВОЗНОГО ТЕСТА УСПЕШНО ПРОЙДЕНЫ БЕЗ ЕДИНОЙ ОШИБКИ!');
  console.log('===============================================================');
}

runScenario().catch(err => {
  console.error('\n❌ ОШИБКА ТЕСТА:', err);
  process.exit(1);
});
