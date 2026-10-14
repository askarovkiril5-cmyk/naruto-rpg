/**
 * storageManager.js
 * Надежное постоянное хранилище для Naruto RPG.
 * - История сражений и летописи
 * - Профили шиноби с раздельным PvP и ИИ рейтингом
 * - Уровень 1-100 растет строго от побед в PvP над реальными игроками
 * - Система друзей, Зал Славы (Таблица лидеров) и личные сообщения
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const BATTLES_FILE = path.join(DATA_DIR, 'battles_history.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const DIRECT_MESSAGES_FILE = path.join(DATA_DIR, 'direct_messages.json');

function readJsonFile(filePath, defaultValue = []) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`[StorageManager] Ошибка чтения ${filePath}:`, err.message);
  }
  return defaultValue;
}

function writeJsonFile(filePath, data) {
  try {
    const tempPath = `${filePath}.tmp_${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error(`[StorageManager] Ошибка записи ${filePath}:`, err.message);
  }
}

/**
 * Сохранить результат завершенной партии
 */
function saveBattleRecord(record) {
  const battles = readJsonFile(BATTLES_FILE, []);
  const entry = {
    id: record.id || `battle_${Date.now()}`,
    timestamp: new Date().toISOString(),
    roomId: record.roomId,
    gameVersion: record.gameVersion || '0.3.3',
    battleMode: record.battleMode || '1v1',
    terrain: record.terrain?.name || 'Арена',
    roundsTotal: record.roundNumber || 1,
    winner: record.winner || 'Ничья',
    players: (record.players || []).map(p => ({
      name: p.name,
      team: p.team,
      clan: p.character?.clan,
      eye: p.character?.eye?.name,
      chakraSpent: p.character?.totalChakraSpent || 0,
      wounds: p.character?.wounds
    })),
    chronicle: record.chronicle || []
  };

  battles.unshift(entry);
  if (battles.length > 500) battles.length = 500;
  writeJsonFile(BATTLES_FILE, battles);
  return entry;
}

function getBattleRecords(limit = 50) {
  const battles = readJsonFile(BATTLES_FILE, []);
  return battles.slice(0, limit);
}

function getBattleById(id) {
  const battles = readJsonFile(BATTLES_FILE, []);
  return battles.find(b => b.id === id) || null;
}

/**
 * Ранговая система мира шиноби по уровням
 */
function getShinobiRank(level) {
  if (level >= 100) return { title: 'Бог Ниндзюцу', icon: '⚡', tier: 8, color: '#fbbf24' };
  if (level >= 95) return { title: 'Хокаге / Каге', icon: '🔥', tier: 7, color: '#ef4444' };
  if (level >= 90) return { title: 'Легендарный Саннин', icon: '🐸', tier: 6, color: '#f59e0b' };
  if (level >= 70) return { title: 'Элитный АНБУ', icon: '🎭', tier: 5, color: '#ec4899' };
  if (level >= 45) return { title: 'Джонин Конохи', icon: '🌪️', tier: 4, color: '#8b5cf6' };
  if (level >= 25) return { title: 'Специальный Джонин', icon: '⚔️', tier: 3, color: '#3b82f6' };
  if (level >= 10) return { title: 'Чунин', icon: '📜', tier: 2, color: '#10b981' };
  return { title: 'Генин', icon: '🥋', tier: 1, color: '#94a3b8' };
}

/**
 * Расчет уровня шиноби строго по числу побед над живыми игроками (PvP)
 * Без XP и без урона!
 */
function calculateShinobiLevelFromPvpWins(pvpWins = 0) {
  let level = 1;
  let remainingWins = Math.max(0, pvpWins);
  let req = 1; // 1 победа для первого уровня

  while (remainingWins >= req && level < 100) {
    remainingWins -= req;
    level += 1;
    // Градация побед на уровень:
    if (level <= 10) req = 1;       // Ур 1-10: 1 победа на уровень (10 побед до Чунина)
    else if (level <= 25) req = 2;  // Ур 11-25: 2 победы (30 побед до Спец-Джонина)
    else if (level <= 50) req = 3;  // Ур 26-50: 3 победы (75 побед до Джонина)
    else if (level <= 75) req = 4;  // Ур 51-75: 4 победы (100 побед до АНБУ)
    else if (level <= 90) req = 5;  // Ур 76-90: 5 побед (75 побед до Саннина)
    else req = 6;                   // Ур 91-100: 6 побед (60 побед до Бога Ниндзюцу)
  }

  const rank = getShinobiRank(level);
  const progressPercent = Math.min(100, Math.floor((remainingWins / req) * 100));

  return {
    level,
    currentWinsInLevel: remainingWins,
    winsRequiredForNextLevel: req,
    progressPercent,
    rank
  };
}

/**
 * Получить или создать профиль игрока по email или имени
 */
function getUserProfile(identifier) {
  if (!identifier) return null;
  const key = String(identifier).trim().toLowerCase();
  const users = readJsonFile(USERS_FILE, {});

  // 1. Прямой поиск по ключу
  let raw = users[key];

  // 2. Если не найден по ключу, ищем пользователя, у которого email === key или name.toLowerCase() === key
  if (!raw) {
    const foundKey = Object.keys(users).find(k => {
      const u = users[k];
      return (u.email && u.email.toLowerCase() === key) ||
             (u.name && u.name.toLowerCase() === key) ||
             (u.identifier && u.identifier.toLowerCase() === key);
    });
    if (foundKey) {
      raw = users[foundKey];
    }
  }

  // 3. Если профиль еще не создан
  if (!raw) {
    raw = {
      identifier: key,
      name: identifier,
      email: key.includes('@') ? key : null,
      googleConnected: key.includes('@'),
      activeTitle: null,
      activeTitleId: null,
      unlockedTitles: ['first_step'],
      selectedJutsuIds: [],
      customNinja: null,
      friends: [],
      stats: {
        pvp: { battlesPlayed: 0, battlesWon: 0, battlesLost: 0, winrate: 0 },
        ai: { battlesPlayed: 0, battlesWon: 0, battlesLost: 0, winrate: 0 }
      },
      createdAt: new Date().toISOString()
    };
  }

  // Миграция старых данных (если были плоские battlesPlayed/battlesWon)
  const pvpStats = raw.stats?.pvp || {
    battlesPlayed: raw.battlesPlayed || 0,
    battlesWon: raw.battlesWon || 0,
    battlesLost: Math.max(0, (raw.battlesPlayed || 0) - (raw.battlesWon || 0)),
    winrate: raw.battlesPlayed ? Math.round(((raw.battlesWon || 0) / raw.battlesPlayed) * 100) : 0
  };

  const aiStats = raw.stats?.ai || {
    battlesPlayed: 0,
    battlesWon: 0,
    battlesLost: 0,
    winrate: 0
  };

  const progression = calculateShinobiLevelFromPvpWins(pvpStats.battlesWon || 0);

  return {
    ...raw,
    identifier: raw.identifier || key,
    email: raw.email || (key.includes('@') ? key : null),
    name: raw.name || identifier,
    stats: {
      pvp: pvpStats,
      ai: aiStats
    },
    friends: Array.isArray(raw.friends) ? raw.friends : [],
    unlockedTitles: Array.isArray(raw.unlockedTitles) ? raw.unlockedTitles : ['first_step'],
    activeTitle: raw.activeTitle || null,
    activeTitleId: raw.activeTitleId || null,
    selectedJutsuIds: Array.isArray(raw.selectedJutsuIds) ? raw.selectedJutsuIds : [],
    customNinja: raw.customNinja || null,
    ...progression,
    unlockedTopModels: Boolean(raw.googleConnected || raw.email)
  };
}

/**
 * Сохранить / обновить данные пользователя (почта — главный ключ аккаунта!)
 */
function saveUser(userData) {
  if (!userData) return null;
  const emailKey = userData.email ? String(userData.email).trim().toLowerCase() : null;
  const nameKey = userData.name ? String(userData.name).trim().toLowerCase() : null;
  const key = emailKey || nameKey || (userData.identifier ? String(userData.identifier).trim().toLowerCase() : 'shinobi');

  const users = readJsonFile(USERS_FILE, {});

  // Если указана почта, проверяем, не было ли ранее сохраненного профиля по имени
  let current = users[key] || {};
  if (emailKey && (!current || Object.keys(current).length === 0) && nameKey && users[nameKey]) {
    // Переносим существующие достижения игрока под его привязанную почту
    current = { ...users[nameKey] };
  }

  // Мерджим статистику (сохраняем максимальные победы при синхронизации)
  const incomingPvp = userData.stats?.pvp || {};
  const currentPvp = current.stats?.pvp || {
    battlesPlayed: current.battlesPlayed || 0,
    battlesWon: current.battlesWon || 0,
    battlesLost: Math.max(0, (current.battlesPlayed || 0) - (current.battlesWon || 0)),
    winrate: 0
  };

  const mergedPvp = {
    battlesPlayed: Math.max(Number(incomingPvp.battlesPlayed) || 0, Number(currentPvp.battlesPlayed) || 0),
    battlesWon: Math.max(Number(incomingPvp.battlesWon) || 0, Number(currentPvp.battlesWon) || 0),
    battlesLost: Math.max(Number(incomingPvp.battlesLost) || 0, Number(currentPvp.battlesLost) || 0),
    winrate: 0
  };
  if (mergedPvp.battlesPlayed > 0) {
    mergedPvp.winrate = Math.round((mergedPvp.battlesWon / mergedPvp.battlesPlayed) * 100);
  }

  const incomingAi = userData.stats?.ai || {};
  const currentAi = current.stats?.ai || { battlesPlayed: 0, battlesWon: 0, battlesLost: 0, winrate: 0 };
  const mergedAi = {
    battlesPlayed: Math.max(Number(incomingAi.battlesPlayed) || 0, Number(currentAi.battlesPlayed) || 0),
    battlesWon: Math.max(Number(incomingAi.battlesWon) || 0, Number(currentAi.battlesWon) || 0),
    battlesLost: Math.max(Number(incomingAi.battlesLost) || 0, Number(currentAi.battlesLost) || 0),
    winrate: 0
  };
  if (mergedAi.battlesPlayed > 0) {
    mergedAi.winrate = Math.round((mergedAi.battlesWon / mergedAi.battlesPlayed) * 100);
  }

  // Объединяем открытые титулы (чтобы не потерять ни одного открытого достижения)
  const existingTitles = Array.isArray(current.unlockedTitles) ? current.unlockedTitles : ['first_step'];
  const newTitles = Array.isArray(userData.unlockedTitles || userData.unlockedTitleIds) ? (userData.unlockedTitles || userData.unlockedTitleIds) : [];
  const mergedTitles = Array.from(new Set([...existingTitles, ...newTitles]));

  // Арсенал выбранных техник (30 дзюцу)
  const mergedArsenal = Array.isArray(userData.selectedJutsuIds) && userData.selectedJutsuIds.length > 0
    ? userData.selectedJutsuIds
    : (Array.isArray(current.selectedJutsuIds) ? current.selectedJutsuIds : []);

  // Созданный персонаж (конструктор шиноби)
  const mergedCustomNinja = userData.customNinja || current.customNinja || null;

  const updated = {
    ...current,
    ...userData,
    identifier: key,
    email: emailKey || current.email || null,
    name: userData.name || current.name || 'Кирилл',
    googleConnected: Boolean(emailKey || current.googleConnected),
    stats: {
      pvp: mergedPvp,
      ai: mergedAi
    },
    selectedJutsuIds: mergedArsenal,
    customNinja: mergedCustomNinja,
    friends: Array.isArray(userData.friends) ? userData.friends : (current.friends || []),
    activeTitle: userData.activeTitle !== undefined ? userData.activeTitle : current.activeTitle,
    activeTitleId: userData.activeTitleId !== undefined ? userData.activeTitleId : current.activeTitleId,
    unlockedTitles: mergedTitles,
    updatedAt: new Date().toISOString()
  };

  users[key] = updated;

  // Если сохранен по почте, но у него есть имя, связываем также имя для быстрого поиска
  if (emailKey && nameKey && nameKey !== emailKey) {
    users[nameKey] = {
      ...updated,
      identifier: nameKey,
      linkedToEmail: emailKey
    };
  }

  writeJsonFile(USERS_FILE, users);

  return getUserProfile(key);
}

/**
 * Начисление результата битвы:
 * - Если PvP: обновляет stats.pvp и прокачивает уровень шиноби
 * - Если против ИИ: обновляет stats.ai (полигон), уровень НЕ трогает
 */
function awardBattleResult(identifier, { isPvp = true, isWinner = false, rounds = 1, opponentName = '' }) {
  const profile = getUserProfile(identifier);
  if (!profile) return null;

  const oldLevel = profile.level;
  const oldRankTitle = profile.rank?.title;

  let updatedStats = { ...profile.stats };

  if (isPvp) {
    const pvp = { ...(updatedStats.pvp || { battlesPlayed: 0, battlesWon: 0, battlesLost: 0, winrate: 0 }) };
    pvp.battlesPlayed += 1;
    if (isWinner) {
      pvp.battlesWon += 1;
    } else {
      pvp.battlesLost += 1;
    }
    pvp.winrate = Math.round((pvp.battlesWon / pvp.battlesPlayed) * 100);
    updatedStats.pvp = pvp;
  } else {
    const ai = { ...(updatedStats.ai || { battlesPlayed: 0, battlesWon: 0, battlesLost: 0, winrate: 0 }) };
    ai.battlesPlayed += 1;
    if (isWinner) {
      ai.battlesWon += 1;
    } else {
      ai.battlesLost += 1;
    }
    ai.winrate = Math.round((ai.battlesWon / ai.battlesPlayed) * 100);
    updatedStats.ai = ai;
  }

  const updatedProfile = saveUser({
    ...profile,
    stats: updatedStats
  });

  const leveledUp = isPvp && updatedProfile.level > oldLevel;
  const rankPromoted = isPvp && updatedProfile.rank?.title !== oldRankTitle;

  return {
    profile: updatedProfile,
    isPvp,
    isWinner,
    leveledUp,
    rankPromoted,
    oldLevel,
    newLevel: updatedProfile.level,
    newRank: updatedProfile.rank
  };
}

// Для обратной совместимости
function awardBattleExperience(identifier, opts) {
  return awardBattleResult(identifier, opts);
}

function getUser(email) {
  return getUserProfile(email);
}

// ==========================================
// СИСТЕМА ДРУЗЕЙ И ПОИСК
// ==========================================

function searchUsers(query, excludeKey = '') {
  if (!query || typeof query !== 'string') return [];
  const q = query.trim().toLowerCase();
  const users = readJsonFile(USERS_FILE, {});
  const results = [];

  for (const [key, user] of Object.entries(users)) {
    if (key === excludeKey.trim().toLowerCase()) continue;
    const matchesEmail = user.email && user.email.toLowerCase().includes(q);
    const matchesName = user.name && user.name.toLowerCase().includes(q);
    const matchesKey = key.includes(q);

    if (matchesEmail || matchesName || matchesKey) {
      const fullProfile = getUserProfile(key);
      results.push({
        identifier: fullProfile.identifier,
        name: fullProfile.name,
        email: fullProfile.email,
        level: fullProfile.level,
        rank: fullProfile.rank,
        activeTitle: fullProfile.activeTitle,
        pvpStats: fullProfile.stats.pvp
      });
    }
    if (results.length >= 15) break;
  }

  return results;
}

function addFriend(userKey, friendKeyOrEmail) {
  if (!userKey || !friendKeyOrEmail) return false;
  const uKey = String(userKey).trim().toLowerCase();
  const fKey = String(friendKeyOrEmail).trim().toLowerCase();
  if (uKey === fKey) return false;

  const userProfile = getUserProfile(uKey);
  const friendProfile = getUserProfile(fKey);
  if (!userProfile || !friendProfile) return false;

  const currentFriends = new Set(userProfile.friends || []);
  currentFriends.add(friendProfile.identifier);

  saveUser({
    ...userProfile,
    friends: Array.from(currentFriends)
  });

  // Взаимное добавление в контакты
  const friendFriends = new Set(friendProfile.friends || []);
  friendFriends.add(userProfile.identifier);
  saveUser({
    ...friendProfile,
    friends: Array.from(friendFriends)
  });

  return true;
}

function removeFriend(userKey, friendKey) {
  if (!userKey || !friendKey) return false;
  const uKey = String(userKey).trim().toLowerCase();
  const fKey = String(friendKey).trim().toLowerCase();

  const userProfile = getUserProfile(uKey);
  if (!userProfile) return false;

  const currentFriends = (userProfile.friends || []).filter(f => f.toLowerCase() !== fKey);
  saveUser({
    ...userProfile,
    friends: currentFriends
  });

  return true;
}

function getFriendsList(userKey) {
  const profile = getUserProfile(userKey);
  if (!profile || !profile.friends) return [];

  return profile.friends.map(fKey => {
    const friend = getUserProfile(fKey);
    if (!friend) return null;
    return {
      identifier: friend.identifier,
      name: friend.name,
      email: friend.email,
      level: friend.level,
      rank: friend.rank,
      activeTitle: friend.activeTitle,
      pvpStats: friend.stats.pvp,
      aiStats: friend.stats.ai
    };
  }).filter(Boolean);
}

// ==========================================
// ЗАЛ СЛАВЫ КОНОХИ (ТАБЛИЦА ЛИДЕРОВ)
// ==========================================

function getLeaderboard(filter = 'global', userKey = null) {
  const users = readJsonFile(USERS_FILE, {});
  let list = [];

  if (filter === 'friends' && userKey) {
    const myProfile = getUserProfile(userKey);
    const friendKeys = new Set(myProfile?.friends || []);
    friendKeys.add(String(userKey).trim().toLowerCase());

    for (const key of friendKeys) {
      const p = getUserProfile(key);
      if (p) list.push(p);
    }
  } else {
    // Вся Коноха (глобально)
    for (const key of Object.keys(users)) {
      const p = getUserProfile(key);
      if (p) list.push(p);
    }
  }

  // Сортировка: 1) Уровень (PvP), 2) PvP победы, 3) Винрейт
  list.sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    if (b.stats.pvp.battlesWon !== a.stats.pvp.battlesWon) return b.stats.pvp.battlesWon - a.stats.pvp.battlesWon;
    return b.stats.pvp.winrate - a.stats.pvp.winrate;
  });

  return list.slice(0, 50).map((u, index) => ({
    rankPosition: index + 1,
    identifier: u.identifier,
    name: u.name,
    email: u.email,
    level: u.level,
    rank: u.rank,
    activeTitle: u.activeTitle,
    pvp: u.stats.pvp,
    ai: u.stats.ai
  }));
}

// ==========================================
// ЛИЧНЫЕ СООБЩЕНИЯ (DIRECT CHAT)
// ==========================================

function getChatKey(userA, userB) {
  const a = String(userA).trim().toLowerCase();
  const b = String(userB).trim().toLowerCase();
  return a < b ? `${a}___${b}` : `${b}___${a}`;
}

function saveDirectMessage({ from, to, text, inviteData = null }) {
  if (!from || !to || (!text && !inviteData)) return null;
  const messagesStore = readJsonFile(DIRECT_MESSAGES_FILE, {});
  const chatKey = getChatKey(from, to);

  const history = messagesStore[chatKey] || [];
  const newMsg = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    from: String(from).trim().toLowerCase(),
    to: String(to).trim().toLowerCase(),
    text: text || '',
    inviteData: inviteData || null,
    timestamp: Date.now(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  history.push(newMsg);
  // Храним до 200 последних сообщений диалога
  if (history.length > 200) history.shift();

  messagesStore[chatKey] = history;
  writeJsonFile(DIRECT_MESSAGES_FILE, messagesStore);

  return newMsg;
}

function getDirectMessages(userA, userB) {
  if (!userA || !userB) return [];
  const messagesStore = readJsonFile(DIRECT_MESSAGES_FILE, {});
  const chatKey = getChatKey(userA, userB);
  return messagesStore[chatKey] || [];
}

module.exports = {
  DATA_DIR,
  saveBattleRecord,
  getBattleRecords,
  getBattleById,
  saveUser,
  getUser,
  getUserProfile,
  getShinobiRank,
  calculateShinobiLevelFromPvpWins,
  awardBattleResult,
  awardBattleExperience,
  // Друзья & Зал Славы & Личные сообщения
  searchUsers,
  addFriend,
  removeFriend,
  getFriendsList,
  getLeaderboard,
  saveDirectMessage,
  getDirectMessages
};
