const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const aiController = require('./aiController');
const rulesManager = require('./rulesManager');
const storageManager = require('./storageManager');
const geminiService = require('./geminiService');
const { formatCanonicalMarkdownCard } = require('./fighterCardFormatter');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

process.on('uncaughtException', (err) => {
  console.error('[CRITICAL Uncaught Exception]:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL Unhandled Rejection]:', reason);
});

// Статическая раздача аудиофайлов (поддерживает server/public/audio, client/dist/audio и client/public/audio)
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));
const clientDistAudio = path.join(__dirname, '..', 'client', 'dist', 'audio');
if (fs.existsSync(clientDistAudio)) {
  app.use('/audio', express.static(clientDistAudio));
}
const clientPublicAudio = path.join(__dirname, '..', 'client', 'public', 'audio');
if (fs.existsSync(clientPublicAudio)) {
  app.use('/audio', express.static(clientPublicAudio));
}

// Статическая раздача собранного клиента (для деплоя на Render / Docker)
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// Загрузка базы дзюцу
let jutsuDatabase = [];
try {
  const jutsuPath = path.join(__dirname, 'jutsuData.json');
  jutsuDatabase = JSON.parse(fs.readFileSync(jutsuPath, 'utf-8'));
} catch (e) {
  console.warn('Не удалось загрузить jutsuData.json:', e.message);
}

// REST эндпоинт для списка дзюцу (всегда актуальный срез 248 техник)
app.get('/api/jutsu', (req, res) => {
  try {
    const freshData = JSON.parse(fs.readFileSync(path.join(__dirname, 'jutsuData.json'), 'utf-8'));
    res.json(freshData);
  } catch (e) {
    res.json(jutsuDatabase);
  }
});

// REST эндпоинт для списка версий правил (динамическое обнаружение 0.3.2, 0.3.3, 0.3.4 и т.д.)
app.get('/api/rules/versions', (req, res) => {
  res.json(rulesManager.getAvailableRuleVersions());
});

// REST эндпоинт для загрузки Markdown правил игры
app.get('/api/rules/:version', (req, res) => {
  const version = req.params.version;
  const content = rulesManager.getRulesContent(version);
  res.json({ version, content });
});

// REST эндпоинт для загрузки нового файла правил
app.post('/api/rules/upload', (req, res) => {
  const { fileName, content } = req.body;
  if (!fileName || !content) {
    return res.status(400).json({ error: 'fileName и content обязательны' });
  }
  const info = rulesManager.saveNewRuleFile(fileName, content);
  res.json({ success: true, info });
});

// REST эндпоинт для запроса списка моделей Gemini (ListModels)
app.post('/api/gemini/models', async (req, res) => {
  try {
    const { apiKey } = req.body || {};
    const models = await geminiService.fetchGeminiModels(apiKey);
    res.json({ models });
  } catch (err) {
    res.status(500).json({ error: err.message, models: geminiService.getFallbackModels() });
  }
});

// REST эндпоинт для Google OAuth 2.0 (валидация ID токена)
app.post('/api/auth/google', (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'credential обязателен' });
    }
    const parts = credential.split('.');
    if (parts.length < 2) {
      return res.status(400).json({ error: 'Неверный формат JWT' });
    }
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
    const user = storageManager.saveUser({
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REST эндпоинты для системы уровней и рангов шиноби
app.get('/api/user/profile/:identifier', (req, res) => {
  const profile = storageManager.getUserProfile(req.params.identifier);
  res.json(profile || {
    level: 1,
    currentWinsInLevel: 0,
    winsRequiredForNextLevel: 1,
    progressPercent: 0,
    rank: storageManager.getShinobiRank(1),
    stats: {
      pvp: { battlesPlayed: 0, battlesWon: 0, battlesLost: 0, winrate: 0 },
      ai: { battlesPlayed: 0, battlesWon: 0, battlesLost: 0, winrate: 0 }
    }
  });
});

app.post('/api/user/profile', (req, res) => {
  const profile = storageManager.saveUser(req.body);
  res.json({ success: true, profile });
});

// REST эндпоинты для истории боев и летописей (постоянное хранилище)
app.get('/api/battles', (req, res) => {
  res.json(storageManager.getBattleRecords());
});

app.get('/api/battles/:id', (req, res) => {
  const battle = storageManager.getBattleById(req.params.id);
  if (!battle) return res.status(404).json({ error: 'Бой не найден' });
  res.json(battle);
});

// REST эндпоинты для Зала Славы, Друзей и Сообщений
app.get('/api/leaderboard', (req, res) => {
  const filter = req.query.filter || 'global';
  const user = req.query.user || null;
  res.json(storageManager.getLeaderboard(filter, user));
});

app.get('/api/users/search', (req, res) => {
  const q = req.query.q || '';
  const exclude = req.query.exclude || '';
  res.json(storageManager.searchUsers(q, exclude));
});

app.get('/api/friends/:identifier', (req, res) => {
  res.json(storageManager.getFriendsList(req.params.identifier));
});

app.post('/api/friends/add', (req, res) => {
  const { userKey, friendKey } = req.body;
  const ok = storageManager.addFriend(userKey, friendKey);
  res.json({ success: ok });
});

app.post('/api/friends/remove', (req, res) => {
  const { userKey, friendKey } = req.body;
  const ok = storageManager.removeFriend(userKey, friendKey);
  res.json({ success: ok });
});

app.get('/api/messages/:userA/:userB', (req, res) => {
  res.json(storageManager.getDirectMessages(req.params.userA, req.params.userB));
});

app.post('/api/messages', (req, res) => {
  const saved = storageManager.saveDirectMessage(req.body);
  res.json({ success: Boolean(saved), message: saved });
});

// REST эндпоинт для списка каноничных ботов (Саске, Итачи, Минато, Наруто, Какаши)
const { BOTS, getBot, getRandomBot, getAllBotsList } = require('./botCharacters');
app.get('/api/bots', (req, res) => {
  res.json(getAllBotsList());
});

// Импорт детального генератора персонажей с клановыми техниками, додзюцу и балансировщиком силы
const { generateCharacter, balanceCharacters } = require('./clanTemplates');

// Хранилище комнат в оперативной памяти
const rooms = new Map();

function getConnectedHumanCount(room) {
  let count = 0;
  for (const p of room.players.values()) {
    if (p.isConnected && !p.isBot) {
      count++;
    }
  }
  return count;
}

function buildRoomState(room) {
  const max = room.battleMode === '2v2' ? 4 : 2;
  const connectedHumans = getConnectedHumanCount(room);
  const activeCount = room.status === 'BATTLE' && room.isBotBattle
    ? (room.battleMode === '2v2' ? 4 : 2)
    : Math.min(room.players.size, max);

  const playersList = Array.from(room.players.values()).map(p => ({
    id: p.id,
    name: p.name,
    team: p.team || 'blue',
    isHost: p.isHost,
    isBot: p.isBot,
    isConnected: p.isConnected
  }));

  return {
    roomId: room.roomId,
    gameVersion: room.gameVersion,
    battleMode: room.battleMode || '1v1',
    activeModel: room.activeModel || 'gemini-2.5-pro',
    playerCount: activeCount,
    maxPlayers: max,
    status: room.status,
    isBotBattle: !!room.isBotBattle,
    playersList
  };
}

function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) {
    const defaultVersion = '0.3.3';
    rooms.set(roomId, {
      roomId,
      hostId: null,
      hostPlayerId: null,
      gameVersion: defaultVersion,
      battleMode: '1v1', // '1v1' | '2v2'
      activeModel: 'gemini-2.5-pro',
      customApiKey: null,
      systemPrompt: aiController.loadPromptForVersion(defaultVersion), // Предзагрузка правил
      status: 'LOBBY',
      players: new Map(),
      pendingActions: new Map(),
      roundNumber: 1,
      distance: 35, // Стартовая дистанция в метрах
      terrain: { name: 'Долина Завершения', details: 'Бурный водопад, скалы и монументы древних шиноби' },
      chronicle: [],
      isResolving: false,
    });
  }
  return rooms.get(roomId);
}

const onlineUsers = new Map(); // identifier -> socketId

io.on('connection', (socket) => {
  console.log(`[Socket.io] Клиент подключился: ${socket.id}`);

  // Регистрация активного шиноби в сети
  socket.on('register_shinobi', ({ identifier }) => {
    if (identifier) {
      const key = String(identifier).trim().toLowerCase();
      onlineUsers.set(key, socket.id);
      io.emit('online_users_updated', Array.from(onlineUsers.keys()));
      console.log(`[Online] Шиноби ${key} в сети (socket: ${socket.id})`);
    }
  });

  // Отправка личного сообщения другу
  socket.on('send_direct_message', ({ from, to, text, inviteData }) => {
    const saved = storageManager.saveDirectMessage({ from, to, text, inviteData });
    if (saved) {
      socket.emit('direct_message_sent', saved);
      const targetSocketId = onlineUsers.get(String(to).trim().toLowerCase());
      if (targetSocketId) {
        io.to(targetSocketId).emit('receive_direct_message', saved);
      }
    }
  });

  // Запрос истории личных сообщений
  socket.on('get_direct_messages', ({ userA, userB }) => {
    const list = storageManager.getDirectMessages(userA, userB);
    socket.emit('direct_messages_history', { userB, messages: list });
  });

  // Смена модели ИИ-ведущего (на лету в любой момент игры)
  socket.on('change_ai_model', ({ roomId, modelId, apiKey }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    if (modelId) room.activeModel = modelId;
    if (apiKey) room.customApiKey = apiKey;
    io.to(roomId).emit('ai_model_updated', {
      activeModel: room.activeModel
    });
    io.to(roomId).emit('room_state_update', buildRoomState(room));
    io.to(roomId).emit('system_message', {
      text: `⚡ ИИ-Ведущий переключен на модель: ${room.activeModel}`
    });
    console.log(`[Room ${roomId}] Модель ИИ переключена на: ${room.activeModel}`);
  });

  // Подключение к комнате
  socket.on('join_battle', ({ roomId, playerName, playerId, team, customNinja }) => {
    const room = getOrCreateRoom(roomId);
    socket.join(roomId);

    const effectivePlayerId = playerId || socket.id;

    // В лобби очищаем старых отключенных и ботов
    for (const [pId, p] of room.players.entries()) {
      if (p.isBot) room.players.delete(pId);
      if (room.status === 'LOBBY' && !p.isConnected) room.players.delete(pId);
    }

    // Ищем существующего игрока по playerId или socket.id
    let player = room.players.get(effectivePlayerId);
    if (!player) {
      for (const p of room.players.values()) {
        if (p.socketId === socket.id) {
          player = p;
          break;
        }
      }
    }

    const maxSlots = room.battleMode === '2v2' ? 4 : 2;

    if (player) {
      // Игрок вернулся (F5 / переподключение)
      player.socketId = socket.id;
      player.isConnected = true;
      if (playerName && playerName.trim()) {
        player.name = playerName.trim();
      }
      if (team && (team === 'blue' || team === 'red')) {
        player.team = team;
      }
      if (customNinja) {
        player.customNinja = customNinja;
      }
      console.log(`[Reconnected] Шиноби ${player.name} (${effectivePlayerId}) вернулся! Сокет: ${socket.id}`);

      // Если карточка уже была И бой уже идет, отправляем её
      if (player.character && room.status === 'BATTLE') {
        socket.emit('private_character_assigned', player.character);
      }
    } else {
      // Новый игрок. Ограничиваем комнату лимитом слотов
      if (room.players.size >= maxSlots) {
        let disconnectedKey = null;
        for (const [pKey, pVal] of room.players.entries()) {
          if (!pVal.isConnected || pVal.isBot) {
            disconnectedKey = pKey;
            break;
          }
        }
        if (disconnectedKey) {
          room.players.delete(disconnectedKey);
        } else {
          const keys = Array.from(room.players.keys());
          if (keys.length >= maxSlots) {
            room.players.delete(keys[keys.length - 1]);
          }
        }
      }

      const isHost = !room.hostPlayerId || room.players.size === 0;
      if (isHost) {
        room.hostPlayerId = effectivePlayerId;
        room.hostId = socket.id;
      }

      // Выбор команды
      let assignedTeam = team;
      if (!assignedTeam || (assignedTeam !== 'blue' && assignedTeam !== 'red')) {
        const blueCount = Array.from(room.players.values()).filter(p => p.team === 'blue').length;
        const redCount = Array.from(room.players.values()).filter(p => p.team === 'red').length;
        assignedTeam = blueCount <= redCount ? 'blue' : 'red';
      }

      const defaultName = isHost ? 'Игрок 1 (Хост)' : `Игрок ${room.players.size + 1}`;
      player = {
        id: effectivePlayerId,
        socketId: socket.id,
        name: (playerName && playerName.trim()) ? playerName.trim() : defaultName,
        team: assignedTeam,
        isHost,
        isBot: false,
        isConnected: true,
        customNinja: customNinja || null,
        character: null
      };
      room.players.set(effectivePlayerId, player);

      console.log(`[Joined] Новый игрок ${player.name} (${effectivePlayerId}, ${player.team}). Всего в лобби: ${room.players.size}/${maxSlots}`);

      // Если бой уже идет, генерируем карточку сразу
      if (room.status === 'BATTLE') {
        player.character = generateCharacter(player.name, player.customNinja);
        socket.emit('private_character_assigned', player.character);
      }
    }

    const roomState = buildRoomState(room);

    socket.emit('joined_room_info', {
      isHost: player.isHost,
      team: player.team,
      gameVersion: room.gameVersion,
      battleMode: room.battleMode,
      status: room.status,
      roundNumber: room.roundNumber,
      playerCount: roomState.playerCount,
      maxPlayers: maxSlots,
      playersList: roomState.playersList
    });

    io.to(roomId).emit('room_state_update', roomState);

    io.to(roomId).emit('system_message', {
      text: `⛩️ ${player.name} вошел в комнату (${player.team === 'blue' ? '🔵 Синие' : '🔴 Красные'}). Игроков: ${roomState.playerCount}/${maxSlots}`
    });
  });

  // Ручной запрос / повторная отправка карточки персонажа (только во время активного боя)
  socket.on('request_character_card', ({ roomId, playerId }) => {
    const room = rooms.get(roomId);
    if (!room || room.status === 'LOBBY') return;

    let player = playerId ? room.players.get(playerId) : null;
    if (!player) {
      for (const p of room.players.values()) {
        if (p.socketId === socket.id) {
          player = p;
          break;
        }
      }
    }

    if (!player) {
      const isHost = room.players.size === 0;
      player = {
        id: playerId || socket.id,
        socketId: socket.id,
        name: isHost ? 'Игрок 1' : 'Игрок 2',
        isHost,
        isBot: false,
        isConnected: true,
        character: null
      };
      room.players.set(player.id, player);
    }

    if (!player.character) {
      player.character = generateCharacter(player.name, player.customNinja);
    }
    socket.emit('private_character_assigned', player.character);
    console.log(`[Manual Request] Карточка шиноби (${player.character.clan}) выдана игроку ${player.name} (${socket.id})`);
  });

  // ПОДТВЕРЖДЕНИЕ И ФИКСАЦИЯ АРСЕНАЛА ТЕХНИК
  socket.on('confirm_arsenal', ({ roomId, playerId, selectedJutsuIds, jutsuCount }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    let player = playerId ? room.players.get(playerId) : null;
    if (!player) {
      for (const p of room.players.values()) {
        if (p.socketId === socket.id) { player = p; break; }
      }
    }
    if (player && Array.isArray(selectedJutsuIds)) {
      player.selectedJutsuIds = selectedJutsuIds;
    }
    const name = player ? player.name : 'Шиноби';
    const count = jutsuCount || (Array.isArray(selectedJutsuIds) ? selectedJutsuIds.length : 0);
    io.to(roomId).emit('system_message', {
      text: `🔒 Шиноби ${name} зафиксировал свой боевой арсенал (${count}/30 техник)! Изменение техник во время дуэли заблокировано.`
    });
  });

  // 1. ВЫБОР ВЕРСИИ ИГРЫ В ЛОББИ (ХОСТ ИЛИ ИГРОК)
  socket.on('set_game_version', ({ roomId, version }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.gameVersion = version;
    room.systemPrompt = aiController.loadPromptForVersion(version);

    console.log(`[Room ${roomId}] Версия переключена на: ${version}`);

    io.to(roomId).emit('version_changed', { version });
    io.to(roomId).emit('system_message', {
      text: `📜 Регламент дуэли изменен на: Версия ${version} (${version === '0.3.2' ? 'Базовая, без дистанций' : 'Тактическая, с точной физикой'}). System Prompt обновлен!`
    });
  });

  // ОБНОВЛЕНИЕ ИМЕНИ БОЙЦА
  socket.on('update_player_name', ({ roomId, playerName, playerId }) => {
    try {
      const room = rooms.get(roomId);
      if (!room) return;

      let player = playerId ? room.players.get(playerId) : null;
      if (!player) {
        for (const p of room.players.values()) {
          if (p.socketId === socket.id) {
            player = p;
            break;
          }
        }
      }

      if (player && playerName && playerName.trim()) {
        const trimmed = playerName.trim();
        if (player.name === trimmed) return;
        const oldName = player.name;
        player.name = trimmed;
        console.log(`[Room ${roomId}] Игрок ${oldName} изменил имя на: ${player.name}`);
        if (oldName && oldName !== trimmed && !oldName.startsWith('Игрок')) {
          io.to(roomId).emit('system_message', {
            text: `👤 Шиноби ${oldName} теперь известен как: ${player.name}`
          });
        }
        io.to(roomId).emit('room_state_update', buildRoomState(room));
      }
    } catch (err) {
      console.error('[Error update_player_name]:', err);
    }
  });

  // ОБНОВЛЕНИЕ ДОСЬЕ ШИНОБИ (КЛАН, СТИХИИ, АРХЕТИП)
  socket.on('update_custom_ninja', ({ roomId, playerId, customNinja }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const effectivePlayerId = playerId || socket.id;
    let player = room.players.get(effectivePlayerId);
    if (!player) {
      for (const p of room.players.values()) {
        if (p.socketId === socket.id) { player = p; break; }
      }
    }
    if (player && customNinja) {
      player.customNinja = customNinja;
      console.log(`[Room ${roomId}] Шиноби ${player.name} утвердил досье: Клан ${customNinja.clan}, Архетип: ${customNinja.archetype}`);
      if (room.status === 'LOBBY') {
        io.to(roomId).emit('system_message', {
          text: `🥷 Шиноби ${player.name} настроил досье: Клан ${customNinja.clan} • ${customNinja.archetype || 'Универсал'}`
        });
      }
    }
  });

  // ВЫБОР ФОРМАТА БОЯ (1v1 ДУЭЛЬ ИЛИ 2v2 КОМАНДНЫЙ БОЙ)
  socket.on('set_battle_mode', ({ roomId, mode }) => {
    const room = rooms.get(roomId);
    if (!room || room.status === 'BATTLE') return;
    room.battleMode = (mode === '2v2') ? '2v2' : '1v1';
    console.log(`[Room ${roomId}] Формат боя изменен на: ${room.battleMode}`);
    io.to(roomId).emit('room_state_update', buildRoomState(room));
    io.to(roomId).emit('system_message', {
      text: `⚔️ Формат сражения изменен на: ${room.battleMode === '2v2' ? '👥 Командный бой 2 на 2 (до 4 шиноби)' : '🗡️ Одиночная дуэль 1 на 1'}!`
    });
  });

  // ПЕРЕКЛЮЧЕНИЕ КОМАНДЫ (СИНИЕ / КРАСНЫЕ) В 2v2
  socket.on('switch_team', ({ roomId, playerId, team }) => {
    const room = rooms.get(roomId);
    if (!room || room.status === 'BATTLE') return;
    const effectivePlayerId = playerId || socket.id;
    let player = room.players.get(effectivePlayerId);
    if (!player) {
      for (const p of room.players.values()) {
        if (p.socketId === socket.id) { player = p; break; }
      }
    }
    if (player && (team === 'blue' || team === 'red')) {
      player.team = team;
      console.log(`[Room ${roomId}] Игрок ${player.name} сменил команду на: ${team}`);
      io.to(roomId).emit('room_state_update', buildRoomState(room));
      io.to(roomId).emit('system_message', {
        text: `🛡️ ${player.name} теперь в составе: ${team === 'blue' ? '🔵 Команда Синих (Лист)' : '🔴 Команда Красных (Соперники)'}`
      });
    }
  });

  // СТАРТ ИГРЫ И ГЕНЕРАЦИЯ ПЕРСОНАЖЕЙ (ФАЗА 1)
  socket.on('start_battle', async ({ roomId, autoFillBots = true } = {}) => {
    try {
      const room = rooms.get(roomId);
      if (!room) return;

      if (room.battleMode === '2v2') {
        // 2v2 РЕЖИМ
        // Удаляем ботов из предыдущих матчей
        for (const [pId, p] of room.players.entries()) {
          if (p.isBot) room.players.delete(pId);
        }

        let blueHumans = Array.from(room.players.values()).filter(p => p.team === 'blue' && !p.isBot);
        let redHumans = Array.from(room.players.values()).filter(p => p.team === 'red' && !p.isBot);

        // Если все живые игроки собрались в одной команде
        if (blueHumans.length === 0 && redHumans.length > 0) {
          redHumans[0].team = 'blue';
          blueHumans.push(redHumans.shift());
        } else if (redHumans.length === 0 && blueHumans.length > 1 && !autoFillBots) {
          blueHumans[1].team = 'red';
          redHumans.push(blueHumans.pop());
        }

        // Заполнение свободных слотов каноничными ИИ-ботами (Co-op 2v2 против ботов)
        const botPool = ['sasuke', 'itachi', 'kakashi', 'minato', 'naruto'];
        let bIdx = 0;

        while (blueHumans.length < 2 && (autoFillBots || room.players.size < 4)) {
          const botKey = botPool[bIdx % botPool.length];
          const botObj = getBot(botKey) || getRandomBot();
          const bId = `bot_blue_${botKey}_${Date.now()}`;
          const bPlayer = {
            id: bId,
            socketId: bId,
            name: `${botObj.name} (Союзник)`,
            team: 'blue',
            isHost: false,
            isBot: true,
            isConnected: true,
            character: botObj.characterCard,
            botKey: botObj.id
          };
          room.players.set(bId, bPlayer);
          blueHumans.push(bPlayer);
          bIdx++;
        }

        while (redHumans.length < 2 && (autoFillBots || room.players.size < 4)) {
          const botKey = botPool[(bIdx + 1) % botPool.length];
          const botObj = getBot(botKey) || getRandomBot();
          const bId = `bot_red_${botKey}_${Date.now()}`;
          const bPlayer = {
            id: bId,
            socketId: bId,
            name: `${botObj.name} (ИИ)`,
            team: 'red',
            isHost: false,
            isBot: true,
            isConnected: true,
            character: botObj.characterCard,
            botKey: botObj.id
          };
          room.players.set(bId, bPlayer);
          redHumans.push(bPlayer);
          bIdx++;
        }

      } else {
        // 1v1 РЕЖИМ
        const humanPlayers = Array.from(room.players.values()).filter(p => !p.isBot);
        if (humanPlayers.length >= 2) {
          for (const [pId, p] of room.players.entries()) {
            if (p.isBot) room.players.delete(pId);
          }
        } else if (humanPlayers.length === 1) {
          const botId = 'bot_rival';
          const botObj = getRandomBot();
          room.players.set(botId, {
            id: botId,
            socketId: botId,
            name: `${botObj.name} (ИИ-Шиноби)`,
            team: 'red',
            isHost: false,
            isBot: true,
            isConnected: true,
            character: botObj.characterCard,
            botKey: botObj.id
          });
        }
      }

      room.status = 'BATTLE';
      room.roundNumber = 1;
      room.distance = 35;
      room.pendingActions.clear();
      room.systemPrompt = aiController.loadPromptForVersion(room.gameVersion);

      // Генерируем карточки для участников
      const playerList = Array.from(room.players.values());
      for (const player of playerList) {
        if (!player.isBot) {
          player.character = generateCharacter(player.name, player.customNinja);
        } else if (!player.character) {
          player.character = generateCharacter(player.name);
        }
      }

      // Если дуэль 1v1 (2 бойца) — применяем молчаливый Балансировщик силы по Разделу 1.5
      if (playerList.length === 2 && playerList[0].character && playerList[1].character) {
        balanceCharacters(playerList[0].character, playerList[1].character);
      }

      // Отправляем карточки живым игрокам
      for (const player of playerList) {
        if (!player.isBot && player.socketId) {
          io.to(player.socketId).emit('private_character_assigned', player.character);
          console.log(`[Card Sent] Карточка персонажа (${player.character.clan}, ${player.character.archetype}) отправлена игроку ${player.name}`);
        }
      }

      const participants = Array.from(room.players.values()).map(p => ({
        id: p.id,
        name: p.name,
        team: p.team,
        isBot: p.isBot
      }));

      io.to(roomId).emit('battle_started', {
        gameVersion: room.gameVersion,
        battleMode: room.battleMode,
        roundNumber: room.roundNumber,
        distance: room.distance,
        playersList: participants
      });

      io.to(roomId).emit('room_state_update', buildRoomState(room));

      // Каноничные открытые карточки бойцов в общий чат по Разделу 2 правил
      for (const p of playerList) {
        const cardMarkdown = formatCanonicalMarkdownCard(p, p.team || 'blue');
        io.to(roomId).emit('gm_round_narrative', {
          roundNumber: 0,
          isFighterCard: true,
          fighterName: p.name,
          team: p.team,
          narrative: cardMarkdown
        });
      }

      // Генерация описания арены
      const openingSceneText = await aiController.generateOpeningScene(room);

      io.to(roomId).emit('gm_round_narrative', {
        roundNumber: 1,
        isOpening: true,
        narrative: openingSceneText
      });

      io.to(roomId).emit('system_message', {
        text: `⚡ ${room.battleMode === '2v2' ? '👥 Командный бой 2 на 2 начался!' : '🗡️ Дуэль началась!'} Арена: «${room.terrain?.name || 'Боевой полигон'}»! Стартовая дистанция: ${room.distance}м. Отправьте ваш скрытый ход!`
      });
    } catch (err) {
      console.error('[Error start_battle]:', err);
      io.to(roomId).emit('system_message', {
        text: `⚠️ Ошибка при запуске дуэли: ${err.message}`
      });
    }
  });

  // СТАРТ ТРЕНИРОВОЧНОЙ ДУЭЛИ С КАНОНИЧНЫМ ИИ-БОТОМ (САСКЕ, ИТАЧИ, МИНАТО, НАРУТО, КАКАШИ)
  socket.on('start_bot_battle', async (payload = {}) => {
    try {
      const { roomId, botId, playerName, playerId, gameVersion, customNinja } = payload;
      const room = getOrCreateRoom(roomId);
      if (gameVersion) {
        room.gameVersion = gameVersion;
        room.systemPrompt = aiController.loadPromptForVersion(gameVersion);
      }

      const effectivePlayerId = playerId || socket.id;
      let humanPlayer = room.players.get(effectivePlayerId);
      if (!humanPlayer) {
        for (const p of room.players.values()) {
          if (p.socketId === socket.id) { humanPlayer = p; break; }
        }
      }

      const displayName = (playerName && playerName.trim()) ? playerName.trim() : 'Шиноби';
      const activeCustomNinja = (typeof customNinja !== 'undefined' && customNinja) ? customNinja : (humanPlayer ? humanPlayer.customNinja : null);
      if (!humanPlayer) {
        humanPlayer = {
          id: effectivePlayerId,
          socketId: socket.id,
          name: displayName,
          isHost: true,
          isBot: false,
          isConnected: true,
          customNinja: activeCustomNinja,
          character: generateCharacter(displayName, activeCustomNinja)
        };
        room.players.set(effectivePlayerId, humanPlayer);
      } else {
        humanPlayer.name = displayName;
        if (activeCustomNinja) humanPlayer.customNinja = activeCustomNinja;
        humanPlayer.character = generateCharacter(displayName, humanPlayer.customNinja);
      }

      // Удаляем предыдущих ботов и неактивных участников
      for (const [pId, p] of room.players.entries()) {
        if (p.id !== humanPlayer.id) {
          room.players.delete(pId);
        }
      }

      // Выбираем каноничного шиноби
      const selectedBot = (botId && botId !== 'random') ? getBot(botId) : getRandomBot();
      const finalBot = selectedBot || getRandomBot();
      const botPlayerId = 'bot_' + finalBot.id;

      const botPlayer = {
        id: botPlayerId,
        socketId: botPlayerId,
        name: finalBot.name,
        isHost: false,
        isBot: true,
        isConnected: true,
        character: finalBot.characterCard,
        botKey: finalBot.id
      };
      room.players.set(botPlayerId, botPlayer);

      room.status = 'BATTLE';
      room.roundNumber = 1;
      room.distance = 35;
      room.pendingActions.clear();
      room.isResolving = false;
      room.isBotBattle = true;
      room.activeBot = finalBot;

      // Выдаем карточку живому игроку
      socket.emit('private_character_assigned', humanPlayer.character);

      io.to(roomId).emit('battle_started', {
        gameVersion: room.gameVersion,
        roundNumber: room.roundNumber,
        distance: room.distance,
        isBotBattle: true,
        botName: finalBot.name,
        botTitle: finalBot.title,
        botAvatar: finalBot.avatar,
        botCharacter: finalBot.characterCard
      });

      io.to(roomId).emit('room_state_update', {
        gameVersion: room.gameVersion,
        playerCount: 2,
        status: 'BATTLE',
        isBotBattle: true
      });

      io.to(roomId).emit('system_message', {
        text: `🤖 Начинается тренировочная дуэль! Противник: ${finalBot.name} — «${finalBot.title}». ИИ готов к судейству!`
      });

      // Каноничные открытые карточки бойцов в чат
      const botP = room.players.get(botPlayerId);
      for (const p of [humanPlayer, botP].filter(Boolean)) {
        const cardMarkdown = formatCanonicalMarkdownCard(p, p.team || (p.isBot ? 'red' : 'blue'));
        io.to(roomId).emit('gm_round_narrative', {
          roundNumber: 0,
          isFighterCard: true,
          fighterName: p.name,
          team: p.team,
          narrative: cardMarkdown
        });
      }

      // Стартовое описание арены
      const openingSceneText = await aiController.generateOpeningScene(room);
      io.to(roomId).emit('gm_round_narrative', {
        roundNumber: 1,
        isOpening: true,
        narrative: openingSceneText
      });
    } catch (err) {
      console.error('[Error start_bot_battle]:', err);
      socket.emit('system_message', {
        text: `⚠️ Ошибка при запуске дуэли с ботом: ${err.message}`
      });
    }
  });

  // ФАЗА 2: СКРЫТЫЙ ВВОД ДЕЙСТВИЙ (SIMULTANEOUS TURNS)
  socket.on('submit_hidden_action', async ({ roomId, playerId, actionText }) => {
    const room = rooms.get(roomId);
    if (!room || room.status !== 'BATTLE' || room.isResolving) return;

    let player = playerId ? room.players.get(playerId) : null;
    if (!player) {
      for (const p of room.players.values()) {
        if (p.socketId === socket.id) {
          player = p;
          break;
        }
      }
    }
    if (!player) return;

    const sanitizedAction = String(actionText || '').trim().slice(0, 1500);
    if (!sanitizedAction) return;

    // Сохраняем действие в памяти и по ID, и по socketId
    room.pendingActions.set(player.id, sanitizedAction);
    room.pendingActions.set(socket.id, sanitizedAction);

    // В чате пишем только статус готовности
    io.to(roomId).emit('system_message', {
      text: `🥋 ${player.name} готов к раунду! (Действие засекречено)`
    });

    socket.emit('action_locked');

    // Если в комнате есть бот-соперник, он делает каноничный ответный ход
    for (const [pId, pData] of room.players.entries()) {
      if (pData.isBot && !room.pendingActions.has(pId)) {
        const botObj = getBot(pData.botKey) || getRandomBot();
        const botMove = botObj.generateAction(room.roundNumber, room.distance);
        room.pendingActions.set(pId, botMove);
        room.pendingActions.set(pData.socketId, botMove);
        io.to(roomId).emit('system_message', {
          text: `🥋 ${pData.name} готов к раунду! (Действие засекречено)`
        });
      }
    }

    // Проверяем: сделали ли ход ВСЕ участники (и в 1v1, и в 2v2)?
    const allPlayers = Array.from(room.players.values());
    const allReady = allPlayers.length >= 2 && allPlayers.every(p => 
      room.pendingActions.has(p.id) || room.pendingActions.has(p.socketId)
    );

    if (allReady) {
      await executeRoundResolution(room);
    }
  });

  // ФАЗА 3: РЕЗОЛВ РАУНДА ЧЕРЕЗ AI CONTROLLER
  async function executeRoundResolution(room) {
    room.isResolving = true;
    io.to(room.roomId).emit('system_message', {
      text: '⚔️ Все шиноби совершили ход! Тексты раскрываются, ИИ Ведущий разрешает раунд...'
    });

    try {
      // Вызываем контроллер ИИ с подстановкой правил и статусов
      const result = await aiController.resolveRound(room);

      // 1. Раскрываем тексты ходов всех участников в общем чате
      io.to(room.roomId).emit('actions_revealed', {
        revealed: result.revealedActions
      });

      // 2. Отправляем в чат литературный сюжет и блок "Почему так"
      const fullNarrative = `${result.narrative}\n\n${result.whySo}\n\n📏 Дистанция до цели: ${result.distance}м.`;
      io.to(room.roomId).emit('gm_round_narrative', {
        roundNumber: room.roundNumber,
        narrative: fullNarrative
      });

      // 3. Отправляем скрытые обновления характеристик каждому игроку отдельно
      if (result.playerUpdates) {
        result.playerUpdates.forEach(up => {
          if (up.socketId && !up.socketId.startsWith('bot_')) {
            io.to(up.socketId).emit('private_profile_update', up.character);
          }
        });
      } else {
        if (result.p1SocketId) io.to(result.p1SocketId).emit('private_profile_update', result.p1Updated);
        if (result.p2SocketId) io.to(result.p2SocketId).emit('private_profile_update', result.p2Updated);
      }

      // 4. Сохранение летописи раунда и состояния боя в постоянное хранилище (storageManager)
      if (!room.battleHistory) room.battleHistory = [];
      room.battleHistory.push({
        roundNumber: room.roundNumber,
        narrative: fullNarrative,
        revealed: result.revealedActions,
        whySo: result.whySo || '',
        distance: result.distance
      });

      storageManager.saveBattleRecord({
        id: `battle_${room.roomId}`,
        roomId: room.roomId,
        gameVersion: room.gameVersion,
        battleMode: room.battleMode,
        terrain: room.terrain,
        roundNumber: room.roundNumber,
        winner: result.isFinished ? (result.winner || 'Ничья') : 'В процессе',
        players: Array.from(room.players.values()).map(p => ({
          name: p.name,
          team: p.team,
          clan: p.character?.clan || 'Шиноби',
          chakra: p.character?.chakra || 0
        })),
        history: room.battleHistory
      });

      // 5. Проверка завершения битвы и начисление статистики (PvP vs ИИ)
      if (result.isFinished) {
        room.status = 'FINISHED';

        const humanPlayers = Array.from(room.players.values()).filter(p => !p.isBot);
        const hasBots = Array.from(room.players.values()).some(p => p.isBot);
        // Честное PvP: минимум 2 живых человека и никаких ботов
        const isPvp = humanPlayers.length >= 2 && !hasBots;

        const battleReports = [];
        for (const p of room.players.values()) {
          if (!p.isBot) {
            const isWinner = Boolean(
              result.winner && 
              (result.winner.includes(p.name) || (p.team && result.winner.toLowerCase().includes(p.team === 'blue' ? 'синие' : 'красные')))
            );

            const battleRes = storageManager.awardBattleResult(p.accountEmail || p.name, {
              isPvp,
              isWinner,
              rounds: room.roundNumber,
              opponentName: result.winner
            });

            if (battleRes) {
              battleReports.push({
                name: p.name,
                isPvp,
                isWinner,
                level: battleRes.newLevel,
                rank: battleRes.newRank,
                leveledUp: battleRes.leveledUp,
                rankPromoted: battleRes.rankPromoted,
                profile: battleRes.profile
              });

              if (p.socketId) {
                io.to(p.socketId).emit('account_battle_awarded', battleRes);
              }
            }
          }
        }

        io.to(room.roomId).emit('battle_finished', {
          winner: result.winner,
          text: `🏆 Сражение завершено! Победитель: ${result.winner}!`,
          isPvp,
          reports: battleReports
        });
      } else {
        // Переход к следующему раунду
        room.roundNumber += 1;
        room.pendingActions.clear();
        room.isResolving = false;
        io.to(room.roomId).emit('next_round_ready', { roundNumber: room.roundNumber });
      }

    } catch (error) {
      console.error('[Room] Ошибка при резолве раунда:', error);
      io.to(room.roomId).emit('system_message', {
        text: `⚠️ Ошибка связи с ИИ Ведущим: ${error.message}. Повторите ввод.`
      });
      room.isResolving = false;
    }
  }

  // ВОЗВРАТ В ЛОББИ / ЗАВЕРШЕНИЕ ДУЭЛИ
  socket.on('reset_to_lobby', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    room.status = 'LOBBY';
    room.roundNumber = 1;
    room.distance = 35;
    room.pendingActions.clear();
    room.isResolving = false;
    room.isBotBattle = false;
    room.activeBot = null;

    // Удаляем ботов при возврате в лобби
    for (const [pId, p] of room.players.entries()) {
      if (p.isBot) {
        room.players.delete(pId);
      }
    }

    io.to(roomId).emit('room_state_update', buildRoomState(room));
    io.to(roomId).emit('system_message', {
      text: '🏠 Комната возвращена в режим лобби. Вы можете выбрать другого соперника, настроить арсенал или изменить формат боя.'
    });
  });

  socket.on('disconnect', () => {
    for (const [roomId, room] of rooms.entries()) {
      for (const [pId, player] of room.players.entries()) {
        if (player.socketId === socket.id) {
          player.isConnected = false;
          room.pendingActions.delete(socket.id);
          room.pendingActions.delete(pId);

          if (room.status === 'LOBBY') {
            room.players.delete(pId);
            if (player.isHost) {
              const remaining = Array.from(room.players.values()).filter(p => !p.isBot);
              if (remaining.length > 0) {
                remaining[0].isHost = true;
                room.hostPlayerId = remaining[0].id;
                room.hostId = remaining[0].socketId;
              } else {
                room.hostPlayerId = null;
                room.hostId = null;
              }
            }
          }

          io.to(roomId).emit('system_message', { 
            text: `⚠️ Соединение с ${player?.name || 'шиноби'} прервано.` 
          });

          io.to(roomId).emit('room_state_update', buildRoomState(room));
        }
      }
    }
  });
});

// SPA fallback: отдаем index.html для любых не-API запросов (при монолитном деплое в Docker/Render)
if (fs.existsSync(clientDistPath)) {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/audio') && !req.path.startsWith('/socket.io')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`⚡ Naruto RPG Server запущен на порту ${PORT}`);
  console.log(`⚡ Правила v0.3.2 и v0.3.3 подключены к ИИ`);
  console.log(`=========================================`);
});
