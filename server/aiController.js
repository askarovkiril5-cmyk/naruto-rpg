/**
 * aiController.js
 * Контроллер взаимодействия с ИИ-Ведущим (Game Master) для Naruto RPG.
 * Поддерживает Gemini API и OpenAI API, загрузку правил из .md файлов и парсинг вердиктов раунда.
 */

const fs = require('fs');
const path = require('path');
const { generateCharacter } = require('./clanTemplates');
const { resolve1v1TacticalBattle, resolve2v2TacticalBattle, ALL_JUTSU, getFighterTacticalCapabilities } = require('./tacticalCombatEngine');
const rulesManager = require('./rulesManager');
const { maskApiKey } = require('./geminiService');
const storageManager = require('./storageManager');

/**
 * 1. Чтение и кеширование файлов правил (System Prompts)
 * Автоматически поддерживает версии 0.3.2, 0.3.3 и любые новые файлы (0.3.4 и т.д.) через rulesManager
 * @param {string} version 
 * @returns {string} Исходный текст системного промпта без каких-либо искажений
 */
function loadPromptForVersion(version) {
  return rulesManager.getRulesContent(version);
}

function formatFighterCard(p, action, roleTitle) {
  const c = p.character || {};
  const eye = c.eye;
  let eyeInfo = 'Нет додзюцу (Предвидение 0%, Точность 0%, Поддержка 0/ход)';
  if (eye && eye.id !== 'none' && eye.name !== 'Без додзюцу') {
    eyeInfo = `${eye.name} (${eye.stage}): Предвидение +${c.predvidenie || eye.predvidenie || 0}%, Точность +${eye.accuracy || 0}%, Усиление +${eye.techniqueAmp || 0}%${eye.speedBonusPercent ? `, Скорость +${eye.speedBonusPercent}%` : ''}, Поддержка: ${eye.upkeep || '0'}/ход. Статус: ${c.isEyeActive !== false ? 'ВКЛЮЧЕНЫ' : 'ВЫКЛЮЧЕНЫ'}`;
  }

  const jutsuListStr = (c.autoJutsu && c.autoJutsu.length > 0)
    ? c.autoJutsu.map(j => `«${j.name}» [${j.rank}] (${j.cost})`).join(', ')
    : 'Нет';

  const selectedIds = Array.isArray(p.selectedJutsuIds) ? p.selectedJutsuIds : [];
  const chosenJutsuObjs = selectedIds.map(id => ALL_JUTSU.find(x => x.id === Number(id))).filter(Boolean);
  const cap = getFighterTacticalCapabilities(p, c);

  const reactiveCountersStr = cap.reactiveCounter.length > 0
    ? cap.reactiveCounter.map(j => `«${j.name}» [${j.rank}] (${j.cost})`).join(', ')
    : 'Нет';
  const reactiveMobilityStr = cap.reactiveMobility.length > 0
    ? cap.reactiveMobility.map(j => `«${j.name}» [${j.rank}] (${j.cost})`).join(', ')
    : 'Нет';
  const genjutsuCounterStr = cap.genjutsuCounter.length > 0
    ? cap.genjutsuCounter.map(j => `«${j.name}» [${j.rank}] (${j.cost})`).join(', ')
    : 'Нет';

  const arsenalStr = chosenJutsuObjs.length > 0
    ? chosenJutsuObjs.map(j => `#${j.id} «${j.name}» [${j.rank}]`).join(', ')
    : (selectedIds.length > 0 ? selectedIds.map(id => `#${id}`).join(', ') : 'Базовый набор дзюцу');

  return `--- ${roleTitle} (${p.name}, Команда: ${p.team === 'red' ? 'Красные' : 'Синие'}) ---
- Клан: ${c.clan || 'Коноха'} (Архетип: ${c.clanTag || 'Шиноби'})
- Додзюцу / Глаза: ${eyeInfo}
- Запас Чакры: ${c.chakra || 100000} / ${c.maxChakra || 100000} (Регенерация: +${c.chakraRegen || 5000}/ход)
- Физическая Скорость: ${c.speed || 15} м/с (Базовая: ${c.baseSpeed || c.speed || 15} м/с)
- Время нервной Реакции: ${c.reaction || 150} мс (Базовая: ${c.baseReaction || c.reaction || 150} мс, Эффективное Предвидение: ${c.predvidenie || 0}%)
- Стихии: ${c.elements ? c.elements.join(', ') : 'Огонь'}
- Накопленные ранения / Статус: ${c.wounds || 'В идеальной форме'}
- Активные режимы/глаза: ${c.activeModes || (c.isEyeActive !== false && eye ? `Глаза: ${eye.name}` : 'Базовое состояние')}
- Бесплатные клановые/глазные техники: ${jutsuListStr}
- Выбранный боевой арсенал (30 слотов): ${arsenalStr}
- ⚡ РЕАКТИВНЫЕ КОНТРАТАКИ [Р] (срабатывают АВТОМАТИЧЕСКИ): ${reactiveCountersStr}
- 🏃 РЕАКТИВНАЯ МОБИЛЬНОСТЬ [М] (срабатывает АВТОМАТИЧЕСКИ): ${reactiveMobilityStr}
- 👁️ СНЯТИЕ ИЛЛЮЗИЙ [Г] (срабатывает АВТОМАТИЧЕСКИ): ${genjutsuCounterStr}
- СЕКРЕТНОЕ ДЕЙСТВИЕ В ЭТОМ РАУНДЕ: "${action}"`;
}

/**
 * 2. Сборка полного запроса к ИИ с инъекцией скрытого статуса и действий участников (1v1 или 2v2)
 * @param {object} room - объект комнаты боя
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
function buildRoundPrompts(room) {
  const players = Array.from(room.players.values());
  const is2v2 = room.battleMode === '2v2';

  // Базовый системный промпт из .md файла (правила выбранной версии)
  const systemPrompt = room.systemPrompt || loadPromptForVersion(room.gameVersion);

  if (is2v2) {
    const blueTeam = players.filter(p => p.team === 'blue');
    const redTeam = players.filter(p => p.team === 'red');
    const finalBlue = blueTeam.length > 0 ? blueTeam : players.slice(0, 2);
    const finalRed = redTeam.length > 0 ? redTeam : players.slice(2, 4);

    const blueDescriptions = finalBlue.map((p, i) => {
      const act = room.pendingActions.get(p.id) || room.pendingActions.get(p.socketId) || 'Бездействует';
      return formatFighterCard(p, act, `СИНИЕ: Боец ${i + 1}`);
    }).join('\n\n');

    const redDescriptions = finalRed.map((p, i) => {
      const act = room.pendingActions.get(p.id) || room.pendingActions.get(p.socketId) || 'Бездействует';
      return formatFighterCard(p, act, `КРАСНЫЕ: Боец ${i + 1}`);
    }).join('\n\n');

    const userPrompt = `
=== ВХОДНЫЕ ДАННЫЕ ДЛЯ РАЗРЕШЕНИЯ РАУНДА ${room.roundNumber} (КОМАНДНЫЙ БОЙ 2 НА 2) ===
РЕЖИМ ПРАВИЛ: Версия ${room.gameVersion} (${room.gameVersion === '0.3.2' ? 'Базовая' : 'Тактическая с точной физикой'})
МЕСТНОСТЬ БОЯ: ${room.terrain?.name || 'Долина Завершения'}
ДИСТАНЦИЯ МЕЖДУ КОМАНДАМИ: ${room.distance || 30} метров.

=== КОМАНДА 1: СИНИЕ (ЛИСТ) ===
${blueDescriptions}

=== КОМАНДА 2: КРАСНЫЕ (СОПЕРНИКИ) ===
${redDescriptions}

ИНСТРУКЦИЯ К ОТВЕТУ ДЛЯ РЕЖИМА 2v2:
1. КАТЕГОРИЧЕСКИ СТРОГОЕ ПРАВИЛО ИМЕН: В литературном описании (narrative) и расчете (whySo) ты ОБЯЗАН называть шиноби ИСКЛЮЧИТЕЛЬНО по их реальным именам: ${players.map(p => `"${p.name}"`).join(', ')}. Запрещены слова "Боец 1", "Игрок 1"!
2. КОМАНДНАЯ СИНЕРГИЯ И ТАКТИКА: Опиши парные взаимодействия! Поддерживает ли напарник своего союзника? Раздувает ли стихия Ветра пламя союзника? Спасает ли вовремя барьер или клон? Как распределились цели (две дуэли 1v1 или скоординированный фокус одной цели)?
3. АВТОМАТИЧЕСКИЕ РЕАКТИВНЫЕ ТЕХНИКИ [Р], [М], [Г] (Раздел 7 правил): Если у бойца есть техники с пометками [Р] (контратака), [М] (уход с вектора) или [Г] (Кай / отражение), и его реакция позволяет спастись/парировать, АВТОМАТИЧЕСКИ примени их и спиши за них чакру!
4. Напиши масштабный кинематографичный сюжет командного боя (3-4 абзаца).
5. В блоке "⚖ Почему так" детально обоснуй командный результат с формулами и скоростями.
6. Рассчитай изменения чакры и ранения для каждого из участников.
7. Ответ верни СТРОГО в формате валидного JSON (без оберток \`\`\`json):
{
  "narrative": "Художественное командное описание раунда с реальными именами всех бойцов...",
  "whySo": "Строка '⚖ Почему так': командный расчет и взаимодействие...",
  "chakraChanges": {
    ${players.map(p => `"${p.name}": -20000`).join(',\n    ')}
  },
  "wounds": {
    ${players.map(p => `"${p.name}": "В форме"`).join(',\n    ')}
  },
  "newDistance": 15,
  "isBattleOver": false,
  "winner": null
}
`;
    return { systemPrompt, userPrompt, is2v2: true };
  }

  // Классический режим 1v1
  const p1 = players[0] || { id: 'p1', name: 'Шиноби 1', character: generateCharacter('Шиноби 1') };
  const p2 = players[1] || { id: 'p2', name: 'Шиноби 2', character: generateCharacter('Шиноби 2') };

  if (!p1.character) p1.character = generateCharacter(p1.name);
  if (!p2.character) p2.character = generateCharacter(p2.name);

  const p1Action = room.pendingActions.get(p1.id) || room.pendingActions.get(p1.socketId) || 'Бездействует';
  const p2Action = room.pendingActions.get(p2.id) || room.pendingActions.get(p2.socketId) || 'Бездействует';

  const userPrompt = `
=== ВХОДНЫЕ ДАННЫЕ ДЛЯ РАЗРЕШЕНИЯ РАУНДА ${room.roundNumber} ===
РЕЖИМ ПРАВИЛ: Версия ${room.gameVersion} (${room.gameVersion === '0.3.2' ? 'Базовая' : 'Тактическая с точной физикой'})
МЕСТНОСТЬ БОЯ: ${room.terrain?.name || 'Долина Завершения'}
ТЕКУЩЕЕ РАССТОЯНИЕ МЕЖДУ БОЙЦАМИ: ${room.distance || 30} метров.

${formatFighterCard(p1, p1Action, `БОЕЦ 1 (Игрок 1: ${p1.name})`)}

${formatFighterCard(p2, p2Action, `БОЕЦ 2 (Игрок 2: ${p2.name})`)}

ИНСТРУКЦИЯ К ОТВЕТУ:
1. КАТЕГОРИЧЕСКИ СТРОГОЕ ПРАВИЛО ИМЕН: В литературном описании (narrative) и расчете (whySo) ты ОБЯЗАН называть шиноби ИСКЛЮЧИТЕЛЬНО по их реальным именам: "${p1.name}" и "${p2.name}". ЗАПРЕЩЕНО использовать безликие слова "Игрок 1", "Игрок 2", "Боец 1", "Боец 2". Описывай эпическую дуэль конкретно ${p1.name} против ${p2.name}!
2. Разреши действия строго по принципам раздела 7 правил версии ${room.gameVersion} (приоритет скоростей, реакция, формулы столкновения техник, стихийные слабости, дистанция).
3. АВТОМАТИЧЕСКОЕ СРАБАТЫВАНИЕ РЕАКТИВНЫХ ТЕХНИК [Р], [М], [Г] (Раздел 7 правил):
   Если у бойца в списке есть техники с пометками [Р] (контратака: #225-238, #251, Камуи, Аменотедзикара, Обратный разряд), [М] (контр-отступление: #1 Каварими, #7 Сюнсин, #9 Хирайсин, #239-245, Сюнрай шаг) или [Г] (Кай #4, #230, #236), и его реакция позволяет среагировать на атаку врага (время подлёта >= реакции в дальнем бою, или реакция <= 85мс в ближнем), ТЫ ОБЯЗАН САМ применить их в сюжете раунда и в расчете «⚖ Почему так», даже если игрок не писал их в действие! Спиши за них чакру и опиши спасение или контратаку!
4. Напиши кинематографичный литературный сюжет раунда (2-3 абзаца).
5. В КОНЦЕ литературного сюжета (narrative) ОБЯЗАТЕЛЬНО выведи каноничный статус-блок по образцу:
   ════ ТЕКУЩИЙ СТАТУС БОЙЦОВ ПОСЛЕ РАУНДА ════
   🥋 ${p1.name}: Чакра ... (потрачено в раунде: ..., за бой: ...) / Скорость ... м/с (бег ... м / шаг+удар ... м) / Реакция ... мс (Предвидение ...%) / Ранения: ... / Активные режимы и глаза: ...
   🥋 ${p2.name}: Чакра ... (потрачено в раунде: ..., за бой: ...) / Скорость ... м/с (бег ... м / шаг+удар ... м) / Реакция ... мс (Предвидение ...%) / Ранения: ... / Активные режимы и глаза: ...
   📏 Дистанция между бойцами: ... метров.
6. Добавь обязательный расчет «⚖ Почему так» (время подлета, проверка уклонения, преимущество стихий, сработавшие реактивные техники).
7. Рассчитай точный расход чакры (с учетом примененных и реактивных техник, поддержки режимов/додзюцу и естественного восстановления) и ранения.
8. Ответ верни СТРОГО в формате валидного JSON (без оберток \`\`\`json):
{
  "narrative": "Художественное описание столкновения и событий раунда с именами ${p1.name} и ${p2.name}...",
  "whySo": "Строка '⚖ Почему так': обоснование вердикта с числами...",
  "p1ChakraChange": -15000,
  "p2ChakraChange": -25000,
  "p1Wounds": "Легкий ожог левого плеча",
  "p2Wounds": "Без видимых повреждений",
  "newDistance": 12,
  "isBattleOver": false,
  "winner": null
}
`;

  return { systemPrompt, userPrompt, act1: p1Action, act2: p2Action, is2v2: false };
}

/**
 * 3. Вызов нейросети (Gemini API или OpenAI API)
 */
async function callLlmApi(systemPrompt, userPrompt, room) {
  const geminiKey = room?.customApiKey || process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // Вариант А: Google Gemini API (gemini-2.5-pro / gemini-1.5-pro / gemini-2.0-flash / gemini-1.5-flash)
  // Google AI Studio API ключи имеют префикс 'AIzaSy'
  if (geminiKey && geminiKey.startsWith('AIzaSy')) {
    const modelName = room?.activeModel || process.env.GEMINI_MODEL || 'gemini-2.5-pro';
    console.log(`[AI Controller] Отправка запроса в Gemini API (${modelName}, ключ: ${maskApiKey(geminiKey)})...`);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`;

    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.6
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[AI Controller] Gemini API (${modelName}) вернул статус ${response.status}: ${errText}. Переключение на тактический движок...`);
        return generateSimulatedResolution(systemPrompt, userPrompt, room);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        return JSON.parse(cleanJsonString(rawText));
      }
    } catch (apiErr) {
      console.warn(`[AI Controller] Ошибка сети при вызове Gemini API (${modelName}): ${apiErr.message}. Используется тактический движок.`);
      return generateSimulatedResolution(systemPrompt, userPrompt, room);
    }
  } else if (geminiKey) {
    console.log(`[AI Controller] GEMINI_API_KEY имеет сессионный формат (${maskApiKey(geminiKey)}). Используется встроенный тактический движок правил v0.3.3.`);
  }

  // Вариант Б: OpenAI API (gpt-4o / gpt-4o-mini)
  if (openaiKey && openaiKey.startsWith('sk-')) {
    console.log('[AI Controller] Отправка запроса в OpenAI API...');
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.6
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[AI Controller] OpenAI API вернул статус ${response.status}: ${errText}`);
        return generateSimulatedResolution(systemPrompt, userPrompt, room);
      }

      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content;
      if (rawText) {
        return JSON.parse(cleanJsonString(rawText));
      }
    } catch (err) {
      console.warn('[AI Controller] Ошибка OpenAI API:', err.message);
      return generateSimulatedResolution(systemPrompt, userPrompt, room);
    }
  }

  // Автономный тактический движок (строгое соблюдение физики и правил v0.3.3)
  return generateSimulatedResolution(systemPrompt, userPrompt, room);
}

/**
 * Очистка markdown блоков ```json ... ``` при парсинге
 */
function cleanJsonString(str) {
  return str.replace(/```json/gi, '').replace(/```/g, '').trim();
}

/**
 * Автономный тактический генератор вердикта раунда (по канону правил v0.3.3 & v0.3.2)
 */
function generateSimulatedResolution(systemPrompt, userPrompt, room) {
  if (room && room.battleMode === '2v2') {
    return resolve2v2TacticalBattle(room);
  }

  const players = room ? Array.from(room.players.values()) : [];
  const p1 = players[0] || { id: 'p1', name: 'Шиноби 1', character: generateCharacter('Шиноби 1') };
  const p2 = players[1] || { id: 'p2', name: 'Шиноби 2', character: generateCharacter('Шиноби 2') };

  const act1 = (room?.pendingActions?.get(p1.id) || room?.pendingActions?.get(p1.socketId)) || 'совершает тактический маневр';
  const act2 = (room?.pendingActions?.get(p2.id) || room?.pendingActions?.get(p2.socketId)) || 'совершает тактический маневр';

  return resolve1v1TacticalBattle(room, p1, p2, act1, act2);
}

/**
 * Главный метод контроллера: разрешить раунд комнаты
 * @param {object} room 
 */
async function resolveRound(room) {
  const players = Array.from(room.players.values());

  // Проверяем наличие карточек у всех
  players.forEach(p => {
    if (!p.character) p.character = generateCharacter(p.name);
  });

  // 1. ОПЛАТА ПОДДЕРЖКИ ГЛАЗ В НАЧАЛЕ РАУНДА (Раздел 2 правил)
  // "1) Оплачиваешь поддержку глаз и режимов чакрой в начале раунда (если не хватает — режим отключается)."
  players.forEach(p => {
    const c = p.character;
    if (c && c.eye && c.isEyeActive !== false && c.eye.id !== 'none') {
      const upkeepVal = Number(c.eye.upkeepNumber || (typeof c.eye.upkeep === 'string' ? parseInt(c.eye.upkeep.replace(/\D/g, ''), 10) : 0)) || 0;
      if (upkeepVal > 0) {
        if ((c.chakra || 0) >= upkeepVal) {
          c.chakra -= upkeepVal;
        } else {
          // Чакры не хватает на поддержку — глаза деактивируются
          c.isEyeActive = false;
          c.activeModes = 'Глаза отключены (недостаток чакры)';
        }
      }
    }
  });

  const { systemPrompt, userPrompt, is2v2 } = buildRoundPrompts(room);

  const aiResult = await callLlmApi(systemPrompt, userPrompt, room);

  // 2. Применяем изменения к чакре и статам от действий раунда
  players.forEach((p, idx) => {
    let diff = -20000;
    if (aiResult.chakraChanges && aiResult.chakraChanges[p.name] !== undefined) {
      diff = aiResult.chakraChanges[p.name];
    } else if (aiResult[`p${idx + 1}ChakraChange`] !== undefined) {
      diff = aiResult[`p${idx + 1}ChakraChange`];
    }
    p.character.chakra = Math.max(0, (p.character.chakra || 100000) + diff);
    p.character.totalChakraSpent = (p.character.totalChakraSpent || 0) + Math.abs(diff);

    // Проверка активных покровов и режимов скорости
    const actText = String(room.pendingActions.get(p.id) || room.pendingActions.get(p.socketId) || '').toLowerCase();
    let modeBonus = 0;
    let modeNames = [];
    if (actText.includes('райтон но ёрой') || actText.includes('#216') || actText.includes('доспех молнии')) {
      modeBonus += 30;
      modeNames.push('Райтон но Ёрой (+30%)');
    }
    if (actText.includes('покров чакры') || actText.includes('#214')) {
      modeBonus += 20;
      modeNames.push('Покров чакры (+20%)');
    }
    if (actText.includes('врата') || actText.includes('#217') || actText.includes('хатимон')) {
      modeBonus += 25;
      modeNames.push('Хатимон Тонко (+25%)');
    }
    if (actText.includes('плащ') || actText.includes('#223')) {
      modeBonus += 25;
      modeNames.push('Плащ ветра (+25%)');
    }
    if (actText.includes('биджу') || actText.includes('джинчурики')) {
      modeBonus += 40;
      modeNames.push('Покров Биджу (+40%)');
    }
    if (actText.includes('проклятая печать')) {
      modeBonus += 40;
      modeNames.push('Проклятая печать (+40%)');
    }

    if (modeBonus > 0 && p.character) {
      const base = Number(p.character.baseSpeed || p.character.speed) || 24;
      p.character.speed = Math.round(base * (1 + modeBonus / 100));
      const eyeStr = (p.character.isEyeActive !== false && p.character.eye && p.character.eye.id !== 'none') ? `Глаза: ${p.character.eye.name}` : null;
      p.character.activeModes = [eyeStr, ...modeNames].filter(Boolean).join(' • ');
    }

    // 3. ЕСТЕСТВЕННАЯ РЕГЕНЕРАЦИЯ ЧАКРЫ В КОНЦЕ РАУНДА (Раздел 1 и 2 правил)
    // "5) Прибавляешь восстановление чакры (числом) и просишь действия на следующий раунд."
    if ((p.character.chakra || 0) > 0) {
      const regenVal = Number(p.character.chakraRegen) || 5000;
      p.character.chakra = Math.min(p.character.maxChakra || p.character.chakra, p.character.chakra + regenVal);
    }

    if (aiResult.wounds && aiResult.wounds[p.name]) {
      p.character.wounds = aiResult.wounds[p.name];
    } else if (aiResult[`p${idx + 1}Wounds`]) {
      p.character.wounds = aiResult[`p${idx + 1}Wounds`];
    }
  });

  if (aiResult.newDistance) room.distance = aiResult.newDistance;

  // Гарантируем наличие каноничного статус-блока в конце narrative
  let finalNarrative = aiResult.narrative || '';
  if (!finalNarrative.includes('════ ТЕКУЩИЙ СТАТУС БОЙЦОВ ПОСЛЕ РАУНДА ════')) {
    const statusRows = players.map(p => {
      const c = p.character || {};
      const speed = c.speed || c.baseSpeed || 24;
      const react = c.reaction || c.baseReaction || 160;
      const pred = c.predvidenie || 0;
      const rem = c.chakra || 0;
      const spentThisRound = Math.abs(aiResult.chakraChanges?.[p.name] || aiResult[`p${players.indexOf(p) + 1}ChakraChange`] || 20000);
      const wounds = c.wounds || 'В идеальной боевой форме';
      const modes = c.activeModes || 'Базовое состояние';
      return `🥋 ${p.name}: Чакра ${rem.toLocaleString('ru-RU')} (потрачено в раунде: ${spentThisRound.toLocaleString('ru-RU')}, за бой: ${(c.totalChakraSpent || spentThisRound).toLocaleString('ru-RU')}) / Скорость ${speed} м/с (бег ${speed} м / шаг+удар ${Math.round(speed / 2)} м) / Реакция ${react} мс (Предвидение ${pred}%) / Ранения: ${wounds} / Активные режимы и глаза: ${modes}`;
    }).join('\n');
    finalNarrative += `\n\n════ ТЕКУЩИЙ СТАТУС БОЙЦОВ ПОСЛЕ РАУНДА ════\n${statusRows}\n📏 Дистанция между бойцами: ${room.distance} метров.`;
  }

  // Проверка завершения битвы
  let isFinished = aiResult.isBattleOver;
  let winner = aiResult.winner;

  if (is2v2) {
    const blueAlive = players.filter(p => p.team === 'blue' && (p.character.chakra || 0) > 0);
    const redAlive = players.filter(p => p.team === 'red' && (p.character.chakra || 0) > 0);
    if (blueAlive.length === 0 || redAlive.length === 0) {
      isFinished = true;
      if (!winner) {
        winner = blueAlive.length > 0 ? 'Команда Синих' : 'Команда Красных';
      }
    }
  } else {
    const p1 = players[0];
    const p2 = players[1];
    if (p1 && p2 && ((p1.character?.chakra || 0) <= 0 || (p2.character?.chakra || 0) <= 0)) {
      isFinished = true;
      if (!winner) {
        winner = (p1.character?.chakra || 0) > (p2.character?.chakra || 0) ? p1.name : p2.name;
      }
    }
  }

  // При завершении сражения автоматически сохраняем запись в постоянное хранилище
  if (isFinished) {
    try {
      storageManager.saveBattleRecord({
        roomId: room.id || room.roomId || 'BATTLE',
        gameVersion: room.gameVersion,
        battleMode: room.battleMode,
        terrain: room.terrain,
        roundNumber: room.roundNumber,
        winner,
        players,
        chronicle: room.chronicle || []
      });
    } catch (saveErr) {
      console.warn('[AI Controller] Ошибка сохранения записи боя:', saveErr.message);
    }
  }

  // Сборка раскрытых действий
  const revealedActions = players.map(p => ({
    senderId: p.socketId,
    authorName: p.name,
    team: p.team || (players.indexOf(p) < 2 ? 'blue' : 'red'),
    text: room.pendingActions.get(p.id) || room.pendingActions.get(p.socketId) || 'Бездействует'
  }));

  const playerUpdates = players.map(p => ({
    socketId: p.socketId,
    playerId: p.id,
    character: p.character
  }));

  return {
    narrative: finalNarrative,
    whySo: aiResult.whySo,
    revealedActions,
    playerUpdates,
    // Для совместимости с 1v1 кодом
    p1Updated: players[0]?.character,
    p2Updated: players[1]?.character,
    p1SocketId: players[0]?.socketId,
    p2SocketId: players[1]?.socketId,
    distance: room.distance,
    isFinished,
    winner
  };
}

// Список каноничных ландшафтов из Раздела 5 правил игры
const TERRAINS = [
  {
    name: 'Лес Конохи',
    modifiers: 'Огонь +15% к силе, изобилие естественных укрытий, кроны деревьев мешают крупным техникам',
    description: 'Вековой исполинский массив Страны Огня. Кроны вековых сосен и дубов переплетаются высоко над головой, отбрасывая причудливую вязь теней на замшелую землю. Воздух напоен запахом хвои, влажной коры и сырой земли. Сквозь листву бьют косые лучи полуденного солнца, а массивные древесные стволы шириной в несколько обхватов служат естественными укрытиями от метательного оружия и стихийных снарядов.'
  },
  {
    name: 'Долина Завершения',
    modifiers: 'Вода +25% к силе и −20% расхода чакры (водопад), скалистый рельеф даёт трехуровневые укрытия',
    description: 'Легендарное ущелье с колоссальными каменными изваяниями Хаширамы Сенджу и Мадары Учихи, застывшими в вечном противостоянии над грохочущей бездной. Бурные потоки реки низвергаются с головокружительной высоты в пенную чашу озера, поднимая густую водяную взвесь и радужные блики. Подножия гигантских статуй и острые базальтовые уступы создают идеальное многоуровневое поле битвы.'
  },
  {
    name: 'Пустыня Страны Ветра',
    modifiers: 'Ветер +20% к силе, Вода −30% к силе и +50% расхода, открытая видимость во всех направлениях',
    description: 'Бескрайнее море раскаленных золотых барханов под безжалостным зенитным солнцем Сунагакуре. Горячий порывистый ветер взметает мириады колких песчинок, затрудняя дыхание. Видимость простирается на многие километры вокруг, однако зыбкий сыпучий песок под ногами гасит инерцию резких рывков и лишает бойцов надежных укрытий.'
  },
  {
    name: 'Побережье Страны Воды',
    modifiers: 'Вода +30% к силе и −30% расхода, Молния +10% (проводимость соленой воды)',
    description: 'Мрачное скалистое побережье с черными базальтовыми рифами, омываемыми пенными холодными волнами океана. Соленый сырой бриз несет рваные клочья белесого тумана, оседающего росой на одежде. Мокрая почва и бесконечные запасы открытой воды делают это место смертоносным для противников стихии Воды и многократно усиливают разряды молний.'
  },
  {
    name: 'Скалистый каньон Страны Земли',
    modifiers: 'Земля +30% к силе и −20% расхода, узкие каменные проходы ограничивают масштабные техники',
    description: 'Глубокий разлом в вековых пластах гранита и сланца. Монолитные каменные утесы отвесно вздымаются на десятки метров ввысь, создавая узкий каменный лабиринт с острыми валунами и естественными каменными террасами. Эхо малейшего шага гулко разносится меж скал, предупреждая о любом движении.'
  },
  {
    name: 'Дождливый Амегакурэ',
    modifiers: 'Молния +25% (Кирин доступен), Вода +15%, Огонь −25%',
    description: 'Индустриальные крыши и мокрые подвесные мосты Деревни Скрытого Дождя. Свинцовые тучи непрерывно изливают холодные струи дождя на стальные трубы и бетонные плиты. Грозовой фронт висит низко над головой, наполняя воздух озоном и электрическим гулом, создавая непревзойденные условия для мощнейших техник Райтона.'
  },
  {
    name: 'Снежное поле Страны Железа',
    modifiers: 'Физическая Скорость всех −10%, Огонь −15%, отчетливо видны следы и траектории',
    description: 'Безмолвная замерзшая равнина, укрытая глубоким слоем скрипучего серебристого снега. Ледяной северный ветер обжигает дыхание и развевает полы плащей. Каждый шаг оставляет глубокие вмятины в сугробах, сводя на нет бесшумное перемещение и требуя от шиноби максимальной концентрации при балансировке чакры на стопах.'
  },
  {
    name: 'Пустошь-полигон',
    modifiers: 'Нейтральная зона: без модификаторов, абсолютно ровный рельеф, отсутствие укрытий',
    description: 'Широкая выжженная арена древнего тренировочного полигона. Твердая утрамбованная земля, испещренная следами былых битв, и полное отсутствие каких-либо преград. Здесь нет места случайностям: исход дуэли определит лишь чистая скорость, тактический расчет и мастерство управления чакрой.'
  }
];

/**
 * 4. Генерация масштабного стартового сообщения ИИ с описанием местности и системным обращением
 * @param {object} room 
 * @returns {Promise<string>}
 */
async function generateOpeningScene(room) {
  if (!room.terrain) {
    room.terrain = TERRAINS[Math.floor(Math.random() * TERRAINS.length)];
  }

  const players = Array.from(room.players.values());
  const p1 = players[0] || { name: 'Шиноби 1', character: { clan: 'Коноха' } };
  const p2 = players[1] || { name: 'Шиноби 2', character: { clan: 'Суна' } };

  const startDistance = room.distance || 35;
  const isTactical = room.gameVersion === '0.3.3';
  const mandatoryInstruction = 'Пожалуйста, выберите 30 техник для боя перед вашим первым ходом.';

  const geminiKey = room?.customApiKey || process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey || openaiKey) {
    try {
      const systemInstruction = room.systemPrompt || loadPromptForVersion(room.gameVersion);
      const userPrompt = `
ТЫ — ВЕДУЩИЙ (GAME MASTER) ТАКТИЧЕСКОЙ ТЕКСТОВОЙ ИГРЫ ПО НАРУТО.
Создай масштабное, эпичное и кинематографичное вступительное описание начала дуэли (3-4 подробных художественных абзаца):
- Сгенерированная арена: "${room.terrain.name}". Модификаторы: "${room.terrain.modifiers}".
- Погода, звуки, визуальные эффекты и окружение: ${room.terrain.description}
- Два бойца готовы к схватке:
  * Боец 1: ${p1.name} (Клан: ${p1.character?.clan || 'Шиноби'}, Геном: ${p1.character?.kekkeiGenkai || 'Отсутствует'}, Стихии: ${(p1.character?.elements || []).join(', ')})
  * Боец 2: ${p2.name} (Клан: ${p2.character?.clan || 'Шиноби'}, Геном: ${p2.character?.kekkeiGenkai || 'Отсутствует'}, Стихии: ${(p2.character?.elements || []).join(', ')})
- Начальная дистанция: ровно ${startDistance} метров (зона дальней/средней дистанции [С]/[Д]).
- Опиши психологическое напряжение, подготовку шиноби, колыхание протекторов, фокусировку чакры.
- В САМОМ КОНЦЕ ответа обязательно отдельным абзацем напиши СТРОГО следующее системное обращение:
"${mandatoryInstruction}"
`;
      if (geminiKey) {
        const modelName = room?.activeModel || process.env.GEMINI_MODEL || 'gemini-2.5-pro';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`;
        const payload = {
          contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }] }],
          generationConfig: { temperature: 0.7 }
        };
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (resp.ok) {
          const data = await resp.json();
          let txt = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (txt) {
            if (!txt.includes(mandatoryInstruction)) {
              txt = txt.trim() + `\n\n📜 ${mandatoryInstruction}`;
            }
            return txt;
          }
        }
      } else if (openaiKey) {
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          let txt = data.choices?.[0]?.message?.content;
          if (txt) {
            if (!txt.includes(mandatoryInstruction)) {
              txt = txt.trim() + `\n\n📜 ${mandatoryInstruction}`;
            }
            return txt;
          }
        }
      }
    } catch (err) {
      console.warn('[AI Controller] Фоновая ошибка LLM для стартовой сцены:', err.message);
    }
  }

  // Каноничное высокохудожественное описание на основе правил
  const terrain = room.terrain;
  if (room.battleMode === '2v2') {
    const blue = players.filter(p => p.team === 'blue');
    const red = players.filter(p => p.team === 'red');
    const finalBlue = blue.length > 0 ? blue : players.slice(0, 2);
    const finalRed = red.length > 0 ? red : players.slice(2, 4);

    const blueStr = finalBlue.map(p => `**${p.name}** (${p.character?.clan || 'Шиноби'})`).join(' и ');
    const redStr = finalRed.map(p => `**${p.name}** (${p.character?.clan || 'Шиноби'})`).join(' и ');

    const part1 = `В воздухе нарастает напряжение перед грандиозной командной битвой 2 на 2! Ареной противостояния избрана легендарная локация — **${terrain.name}**.\n\n${terrain.description}`;
    const part2 = `Ландшафт и погода диктуют свои правила: *«${terrain.modifiers}»*. Земля вибрирует от циркуляции чакры четырех бойцов, готовых ко взаимному прикрытию и комбинированным стихийным техникам.`;
    const part3 = `На противоположных флангах арены, на дистанции ровно в **${startDistance} метров** друг от друга, построились две боевые двойки:\n` +
      `🔵 **Команда Синих (Лист)**: ${blueStr}\n` +
      `🔴 **Команда Красных (Соперники)**: ${redStr}\n\n` +
      `Регламент битвы: **Версия ${room.gameVersion} (${isTactical ? 'Тактическая с точной физикой' : 'Базовая'})**. Победа зависит от слаженности команды, комбинирования техник и своевременной защиты союзника!`;

    const ending = `\n\n📜 Обращение Гейм-Мастера к шиноби:\n${mandatoryInstruction}`;
    return `${part1}\n\n${part2}\n\n${part3}${ending}`;
  }

  const p1Clan = p1.character?.clan || 'Шиноби';
  const p2Clan = p2.character?.clan || 'Шиноби';
  const p1Elements = (p1.character?.elements || ['Огонь']).join(', ');
  const p2Elements = (p2.character?.elements || ['Молния']).join(', ');

  const part1 = `В воздухе повисает звенящая тишина перед надвигающейся бурей. Ареной для смертельного противостояния избрана легендарная локация — **${terrain.name}**.\n\n${terrain.description}`;

  const part2 = `Погода и ландшафт уже диктуют свои правила тактической физики: *«${terrain.modifiers}»*. Ветер треплет края одежд и ленты налобных протекторов шиноби. В воздухе отчетливо чувствуются пульсирующие возмущения концентрированной чакры, заставляющие дрожать мелкие камни на границе видимости.`;

  const part3 = `На противоположных краях арены, на исходной боевой дистанции ровно в **${startDistance} метров** друг от друга, замерли соперники:\n` +
    `• С одной стороны — **${p1.name}**, представитель клана **${p1Clan}** (стихии: ${p1Elements}). Его пальцы слегка касаются пояса с подсумком снаряжения, оценивая геометрию укрытий.\n` +
    `• Напротив — **${p2.name}**, искусный воин клана **${p2Clan}** (стихии: ${p2Elements}). Взгляд оппонента предельно сосредоточен, считывая малейшие микродвижения мышц соперника.\n\n` +
    `Регламент дуэли: **Версия ${room.gameVersion} (${isTactical ? 'Тактическая, с точной физикой дистанций и баллистикой полета' : 'Базовая, боевой радиус'})**. До начала активных действий оба ниндзя мысленно перебирают свой арсенал дзюцу, выстраивая стратегию победы.`;

  const ending = `\n\n📜 Обращение Гейм-Мастера к шиноби:\n${mandatoryInstruction}`;

  return `${part1}\n\n${part2}\n\n${part3}${ending}`;
}

module.exports = {
  loadPromptForVersion,
  buildRoundPrompts,
  resolveRound,
  generateOpeningScene,
  TERRAINS
};

