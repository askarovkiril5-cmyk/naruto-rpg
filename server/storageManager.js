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
const crypto = require('crypto');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const BATTLES_FILE = path.join(DATA_DIR, 'battles_history.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const DIRECT_MESSAGES_FILE = path.join(DATA_DIR, 'direct_messages.json');
const CLANS_FILE = path.join(DATA_DIR, 'clans.json');
const ANNOUNCEMENTS_FILE = path.join(DATA_DIR, 'system_announcements.json');

// Официальная почта Создателя игры (Кирилла)
const DEVELOPER_EMAIL = 'askarovkiril5@gmail.com';

function hashPassword(password, salt) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  const hash = crypto.pbkdf2Sync(String(password), salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function verifyPassword(password, storedHash, salt) {
  if (!password || !storedHash || !salt) return false;
  const { hash } = hashPassword(password, salt);
  return hash === storedHash;
}

function isDeveloper(email) {
  if (!email) return false;
  return String(email).trim().toLowerCase() === DEVELOPER_EMAIL;
}

function sanitizeUser(user) {
  if (!user) return null;
  const copy = { ...user };
  delete copy.passwordHash;
  delete copy.passwordSalt;
  copy.isDeveloper = isDeveloper(copy.email);
  return copy;
}

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
 * Расчет уровня шиноби по общему накопленному опыту (XP)
 * 100 уровней развития от Студента Академии до Бога Ниндзюцу
 */
function calculateShinobiLevelFromXp(totalXp = 0) {
  let xp = Math.max(0, Math.floor(Number(totalXp) || 0));
  let level = 1;
  let remainingXp = xp;

  // Опыт, требуемый для перехода на следующий уровень:
  // Плавная и сбалансированная кривая прокачки (1-100 уровней)
  function getXpForLevel(lvl) {
    if (lvl < 10) return 400 + (lvl - 1) * 60;       // Ур 1-9 (Генины): 400 - 880 XP на уровень
    if (lvl < 25) return 900 + (lvl - 10) * 80;     // Ур 10-24 (Чунины): 900 - 2020 XP
    if (lvl < 45) return 2100 + (lvl - 25) * 120;   // Ур 25-44 (Спец-Джонины): 2100 - 4380 XP
    if (lvl < 70) return 4500 + (lvl - 45) * 160;   // Ур 45-69 (Джонины): 4500 - 8340 XP
    if (lvl < 90) return 8500 + (lvl - 70) * 220;   // Ур 70-89 (АНБУ): 8500 - 12680 XP
    if (lvl < 95) return 13000 + (lvl - 90) * 350;  // Ур 90-94 (Саннины): 13000 - 14400 XP
    return 15000 + (lvl - 95) * 500;                // Ур 95-99 (Каге -> Бог Ниндзюцу): 15000 - 17000 XP
  }

  let req = getXpForLevel(1);
  while (remainingXp >= req && level < 100) {
    remainingXp -= req;
    level += 1;
    req = getXpForLevel(level);
  }

  const rank = getShinobiRank(level);
  const progressPercent = level >= 100 ? 100 : Math.min(100, Math.floor((remainingXp / req) * 100));

  return {
    level,
    totalXp: xp,
    currentXpInLevel: remainingXp,
    xpRequiredForNextLevel: req,
    progressPercent,
    rank
  };
}

// Алиас для обратной совместимости
function calculateShinobiLevelFromPvpWins(pvpWins = 0) {
  return calculateShinobiLevelFromXp(pvpWins * 500);
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
      totalXp: 0,
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

  // Если у профиля еще нет totalXp, восстанавливаем на основе прошлых PvP побед (ИИ опыт не дает)
  let userTotalXp = raw.totalXp;
  if (userTotalXp === undefined || userTotalXp === null) {
    userTotalXp = Math.max(0, 
      (pvpStats.battlesWon * 500) + 
      (pvpStats.battlesLost * 200)
    );
  } else {
    userTotalXp = Math.max(0, Number(userTotalXp) || 0);
  }

  const progression = calculateShinobiLevelFromXp(userTotalXp);

  const isDev = isDeveloper(raw.email);
  const result = {
    ...raw,
    identifier: raw.identifier || key,
    email: raw.email || (key.includes('@') ? key : null),
    name: raw.name || identifier,
    avatar: raw.avatar || '🍥',
    frameId: raw.frameId || (isDev ? 'frame_creator_genesis' : 'frame_academy'),
    isDeveloper: isDev,
    totalXp: userTotalXp,
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
  delete result.passwordHash;
  delete result.passwordSalt;
  return result;
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

  // Мерджим общий опыт (XP)
  const incomingXp = Number(userData.totalXp);
  const currentXp = Number(current.totalXp);
  const mergedTotalXp = !isNaN(incomingXp) && incomingXp > 0
    ? Math.max(incomingXp, !isNaN(currentXp) ? currentXp : 0)
    : (!isNaN(currentXp) ? currentXp : 0);

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

  const resolvedEmail = emailKey || current.email || null;
  const isDevUser = isDeveloper(resolvedEmail);

  const updated = {
    ...current,
    ...userData,
    identifier: key,
    email: resolvedEmail,
    name: userData.name || current.name || 'Кирилл',
    passwordHash: current.passwordHash,
    passwordSalt: current.passwordSalt,
    avatar: userData.avatar !== undefined ? userData.avatar : (current.avatar || '🍥'),
    frameId: userData.frameId !== undefined ? userData.frameId : (current.frameId || (isDevUser ? 'frame_creator_genesis' : 'frame_academy')),
    googleConnected: Boolean(resolvedEmail || current.googleConnected),
    totalXp: mergedTotalXp,
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
 * Регистрация нового аккаунта с подтверждением пароля
 */
function registerUser({ email, password, confirmPassword, name, avatar, frameId }) {
  if (!email || !String(email).includes('@')) {
    return { error: 'Пожалуйста, укажите корректный адрес электронной почты!' };
  }
  const cleanEmail = String(email).trim().toLowerCase();
  
  if (!password || password.length < 4) {
    return { error: 'Пароль должен содержать не менее 4 символов!' };
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return { error: 'Введённый пароль и подтверждение пароля не совпадают!' };
  }

  const users = readJsonFile(USERS_FILE, {});
  const existing = users[cleanEmail];

  // Если аккаунт уже существует и у него есть пароль
  if (existing && existing.passwordHash) {
    return { error: 'Аккаунт с этой почтой уже зарегистрирован и защищён паролем! Пожалуйста, войдите в аккаунт.' };
  }

  const { hash, salt } = hashPassword(password);
  const isDev = isDeveloper(cleanEmail);

  const baseData = existing || {
    identifier: cleanEmail,
    name: name || cleanEmail.split('@')[0],
    email: cleanEmail,
    googleConnected: true,
    totalXp: 0,
    friends: [],
    stats: {
      pvp: { battlesPlayed: 0, battlesWon: 0, battlesLost: 0, winrate: 0 },
      ai: { battlesPlayed: 0, battlesWon: 0, battlesLost: 0, winrate: 0 }
    },
    unlockedTitles: ['first_step'],
    activeTitleId: null,
    selectedJutsuIds: [],
    customNinja: null,
    createdAt: new Date().toISOString()
  };

  const updated = {
    ...baseData,
    email: cleanEmail,
    name: name || baseData.name || 'Шиноби',
    passwordHash: hash,
    passwordSalt: salt,
    avatar: avatar || baseData.avatar || '🍥',
    frameId: frameId || baseData.frameId || (isDev ? 'frame_creator_genesis' : 'frame_academy'),
    googleConnected: true,
    updatedAt: new Date().toISOString()
  };

  users[cleanEmail] = updated;
  writeJsonFile(USERS_FILE, users);

  const profile = getUserProfile(cleanEmail);
  return { success: true, profile: sanitizeUser(profile) };
}

/**
 * Вход в существующий аккаунт по почте и паролю
 */
function loginUser({ email, password }) {
  if (!email || !String(email).includes('@')) {
    return { error: 'Пожалуйста, укажите корректный адрес электронной почты!' };
  }
  if (!password) {
    return { error: 'Введите пароль от вашего аккаунта!' };
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const users = readJsonFile(USERS_FILE, {});
  let user = users[cleanEmail];

  // Если не найден по почте напрямую, ищем по linkedToEmail
  if (!user) {
    const foundKey = Object.keys(users).find(k => {
      const u = users[k];
      return (u.email && u.email.toLowerCase() === cleanEmail) ||
             (u.linkedToEmail && u.linkedToEmail.toLowerCase() === cleanEmail);
    });
    if (foundKey) user = users[foundKey];
  }

  if (!user) {
    return { error: 'Аккаунт с такой почтой не найден в летописях Конохи! Пожалуйста, зарегистрируйтесь.' };
  }

  // Если у ранее созданного аккаунта еще не было пароля, задаем этот пароль в качестве основного
  if (!user.passwordHash || !user.passwordSalt) {
    const { hash, salt } = hashPassword(password);
    user.passwordHash = hash;
    user.passwordSalt = salt;
    user.updatedAt = new Date().toISOString();
    users[cleanEmail] = user;
    writeJsonFile(USERS_FILE, users);
  } else {
    const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      return { error: 'Неверный пароль от аккаунта! Проверьте введённые данные.' };
    }
  }

  const profile = getUserProfile(cleanEmail);
  return { success: true, profile: sanitizeUser(profile) };
}

/**
 * Системные оповещения Создателя игры (Кирилла)
 */
function saveSystemAnnouncement({ title, category, content, senderName, senderEmail }) {
  if (!isDeveloper(senderEmail)) {
    return { error: 'Доступ запрещён: только Создатель игры (Кирилл) имеет право отправлять системные оповещения!' };
  }
  if (!title || !title.trim()) {
    return { error: 'Укажите тему оповещения!' };
  }
  if (!content || !content.trim()) {
    return { error: 'Текст оповещения не может быть пустым!' };
  }

  const announcements = readJsonFile(ANNOUNCEMENTS_FILE, []);
  const entry = {
    id: `notice_sys_${Date.now()}`,
    timestamp: Date.now(),
    date: 'Сегодня',
    title: `👑 Оповещение Создателя: ${title.trim()}`,
    category: category || 'village', // 'village' | 'hokage' | 'battle'
    sender: senderName || '👑 Создатель игры (Кирилл)',
    senderEmail: DEVELOPER_EMAIL,
    content: content.trim(),
    isCreatorAnnouncement: true,
    read: false
  };

  announcements.unshift(entry);
  if (announcements.length > 100) announcements.length = 100;
  writeJsonFile(ANNOUNCEMENTS_FILE, announcements);

  return { success: true, announcement: entry };
}

function getSystemAnnouncements(limit = 30) {
  const announcements = readJsonFile(ANNOUNCEMENTS_FILE, []);
  return announcements.slice(0, limit);
}

/**
 * Начисление результата битвы и опыта (XP):
 * - PvP победа: 450 XP (+ раунд-бонус)
 * - PvP поражение: 180 XP (+ раунд-бонус)
 * - Тренировка с ИИ: 150 / 60 XP
 * - Бонус за привязанную почту: +25% XP
 */
function awardBattleResult(identifier, { isPvp = true, isWinner = false, rounds = 1, opponentName = '' }) {
  const profile = getUserProfile(identifier);
  if (!profile) return null;

  const oldLevel = profile.level;
  const oldRankTitle = profile.rank?.title;

  let updatedStats = { ...profile.stats };
  let xpGain = 0;

  if (isPvp) {
    const pvp = { ...(updatedStats.pvp || { battlesPlayed: 0, battlesWon: 0, battlesLost: 0, winrate: 0 }) };
    pvp.battlesPlayed += 1;
    if (isWinner) {
      pvp.battlesWon += 1;
      xpGain = 450 + Math.min(10, rounds) * 40;
    } else {
      pvp.battlesLost += 1;
      xpGain = 180 + Math.min(10, rounds) * 25;
    }
    // Бонус +25% к XP за привязку облачного аккаунта (почты) действует в PvP
    if (profile.email || profile.googleConnected) {
      xpGain = Math.round(xpGain * 1.25);
    }
    pvp.winrate = Math.round((pvp.battlesWon / pvp.battlesPlayed) * 100);
    updatedStats.pvp = pvp;
  } else {
    // Тренировка с ИИ (полигон): за спарринги с ботами опыт (XP) НЕ начисляется!
    const ai = { ...(updatedStats.ai || { battlesPlayed: 0, battlesWon: 0, battlesLost: 0, winrate: 0 }) };
    ai.battlesPlayed += 1;
    if (isWinner) {
      ai.battlesWon += 1;
    } else {
      ai.battlesLost += 1;
    }
    ai.winrate = Math.round((ai.battlesWon / ai.battlesPlayed) * 100);
    updatedStats.ai = ai;
    xpGain = 0; // Строго 0 XP за ИИ
  }

  const currentTotalXp = Number(profile.totalXp) || 0;
  const newTotalXp = currentTotalXp + xpGain;

  const updatedProfile = saveUser({
    ...profile,
    totalXp: newTotalXp,
    stats: updatedStats
  });

  const leveledUp = isPvp && updatedProfile.level > oldLevel;
  const rankPromoted = isPvp && updatedProfile.rank?.title !== oldRankTitle;

  return {
    profile: updatedProfile,
    isPvp,
    isWinner,
    xpGain,
    totalXp: newTotalXp,
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

  // Сортировка: 1) Опыт (XP) / Уровень, 2) PvP победы, 3) Винрейт
  list.sort((a, b) => {
    if ((b.totalXp || 0) !== (a.totalXp || 0)) return (b.totalXp || 0) - (a.totalXp || 0);
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
    totalXp: u.totalXp || 0,
    currentXpInLevel: u.currentXpInLevel || 0,
    xpRequiredForNextLevel: u.xpRequiredForNextLevel || 0,
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

// ==========================================
// КЛАНОВАЯ СИСТЕМА КОНОХИ (CLAN SYSTEM)
// ==========================================

function enrichClan(clan) {
  if (!clan) return null;
  const memberKeys = clan.members || [];
  let totalClanXp = 0;
  let totalPvpWins = 0;
  let totalLevels = 0;

  const enrichedMembers = memberKeys.map(key => {
    const p = getUserProfile(key);
    if (!p) {
      return {
        identifier: key,
        name: key.split('@')[0],
        email: key.includes('@') ? key : null,
        level: 1,
        totalXp: 0,
        rank: getShinobiRank(1),
        activeTitle: null,
        pvpStats: { battlesWon: 0, battlesLost: 0, winrate: 0 }
      };
    }
    const xp = p.totalXp || 0;
    const wins = p.stats?.pvp?.battlesWon || 0;
    totalClanXp += xp;
    totalPvpWins += wins;
    totalLevels += (p.level || 1);

    return {
      identifier: p.identifier,
      name: p.name,
      email: p.email,
      level: p.level || 1,
      totalXp: xp,
      rank: p.rank,
      activeTitle: p.activeTitle,
      pvpStats: p.stats?.pvp || { battlesWon: 0, battlesLost: 0, winrate: 0 }
    };
  });

  // Сортировка соклановцев: сначала Глава, затем по опыту (XP)
  enrichedMembers.sort((a, b) => {
    if (a.identifier === clan.leaderKey) return -1;
    if (b.identifier === clan.leaderKey) return 1;
    return (b.totalXp || 0) - (a.totalXp || 0);
  });

  return {
    ...clan,
    memberCount: enrichedMembers.length,
    totalClanXp,
    totalPvpWins,
    avgLevel: enrichedMembers.length > 0 ? Math.round(totalLevels / enrichedMembers.length) : 1,
    membersDetails: enrichedMembers
  };
}

function getAllClansRaw() {
  return readJsonFile(CLANS_FILE, []);
}

function saveAllClans(clans) {
  writeJsonFile(CLANS_FILE, clans);
}

function createClan({ name, leaderKey, leaderName, motto, emblemId }) {
  if (!name || name.trim().length < 2) {
    return { error: 'Название клана должно содержать минимум 2 символа!' };
  }
  if (!leaderKey) {
    return { error: 'Не указан основатель клана!' };
  }

  const clans = getAllClansRaw();
  const cleanName = name.trim();
  const cleanLeaderKey = String(leaderKey).trim().toLowerCase();

  // Проверка уникальности названия клана
  const existsName = clans.some(c => c.name.toLowerCase() === cleanName.toLowerCase());
  if (existsName) {
    return { error: `Клан с названием «${cleanName}» уже основан в Конохе! Выберите другое имя.` };
  }

  // Проверка: состоит ли уже лидер в каком-то клане
  const existingClan = clans.find(c => (c.members || []).map(m => m.toLowerCase()).includes(cleanLeaderKey));
  if (existingClan) {
    return { error: `Вы уже состоите в клане «${existingClan.name}»! Сначала покиньте его.` };
  }

  const clanId = `clan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newClan = {
    id: clanId,
    name: cleanName,
    leaderKey: cleanLeaderKey,
    leaderName: leaderName || cleanLeaderKey.split('@')[0],
    motto: motto && motto.trim() ? motto.trim() : 'Воля нашего Клана несокрушима!',
    emblemId: emblemId || 'emblem_uchiha',
    createdAt: new Date().toISOString(),
    members: [cleanLeaderKey],
    invites: [],
    chat: [
      {
        id: `cmsg_${Date.now()}`,
        fromKey: 'system',
        fromName: 'Канцелярия Конохи',
        text: `Великий клан «${cleanName}» официально основан шиноби ${leaderName || 'Главой'}! Да озарит Воля Огня путь соклановцев!`,
        timestamp: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  };

  clans.push(newClan);
  saveAllClans(clans);

  // Обновляем профиль игрока в базе пользователей
  const userProf = getUser(cleanLeaderKey);
  if (userProf) {
    saveUser({
      ...userProf,
      clanId: clanId,
      clanName: cleanName
    });
  }

  return { success: true, clan: enrichClan(newClan) };
}

function getClan(clanId) {
  if (!clanId) return null;
  const clans = getAllClansRaw();
  const found = clans.find(c => c.id === clanId);
  return found ? enrichClan(found) : null;
}

function getUserClan(userKey) {
  if (!userKey) return null;
  const cleanKey = String(userKey).trim().toLowerCase();
  const clans = getAllClansRaw();
  const found = clans.find(c => (c.members || []).some(m => String(m).trim().toLowerCase() === cleanKey));
  return found ? enrichClan(found) : null;
}

function updateClan({ clanId, userKey, motto, emblemId }) {
  if (!clanId || !userKey) return { error: 'Некорректные параметры обновления клана' };
  const clans = getAllClansRaw();
  const clanIndex = clans.findIndex(c => c.id === clanId);
  if (clanIndex === -1) return { error: 'Клан не найден!' };

  const clan = clans[clanIndex];
  if (String(clan.leaderKey).toLowerCase() !== String(userKey).toLowerCase()) {
    return { error: 'Только Глава Клана имеет право изменять девиз и герб!' };
  }

  if (motto !== undefined && motto !== null) {
    clan.motto = motto.trim() || clan.motto;
  }
  if (emblemId) {
    clan.emblemId = emblemId;
  }

  clans[clanIndex] = clan;
  saveAllClans(clans);

  return { success: true, clan: enrichClan(clan) };
}

function inviteUserToClan({ clanId, fromKey, toKey }) {
  if (!clanId || !fromKey || !toKey) return { error: 'Параметры приглашения не заполнены' };
  const clans = getAllClansRaw();
  const clanIndex = clans.findIndex(c => c.id === clanId);
  if (clanIndex === -1) return { error: 'Клан не найден' };

  const clan = clans[clanIndex];
  const cleanFrom = String(fromKey).trim().toLowerCase();
  const cleanTo = String(toKey).trim().toLowerCase();

  // Проверяем, что приглашающий в клане
  if (!clan.members.map(m => m.toLowerCase()).includes(cleanFrom)) {
    return { error: 'Вы не состоите в этом клане' };
  }

  // Проверяем, не в клане ли уже приглашаемый
  if (clan.members.map(m => m.toLowerCase()).includes(cleanTo)) {
    return { error: 'Этот шиноби уже состоит в вашем клане!' };
  }

  // Проверяем, не отправлено ли уже приглашение
  clan.invites = clan.invites || [];
  const alreadyInvited = clan.invites.some(inv => inv.toUserKey.toLowerCase() === cleanTo);
  if (alreadyInvited) {
    return { error: 'Приглашение этому шиноби уже отправлено и ожидает ответа!' };
  }

  const senderProfile = getUserProfile(cleanFrom);
  const inviteEntry = {
    id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    clanId: clan.id,
    clanName: clan.name,
    emblemId: clan.emblemId,
    motto: clan.motto,
    fromUserKey: cleanFrom,
    fromName: senderProfile?.name || cleanFrom.split('@')[0],
    toUserKey: cleanTo,
    timestamp: Date.now()
  };

  clan.invites.push(inviteEntry);
  clans[clanIndex] = clan;
  saveAllClans(clans);

  return { success: true, invite: inviteEntry };
}

function respondClanInvite({ clanId, userKey, accept }) {
  if (!clanId || !userKey) return { error: 'Некорректные параметры ответа на приглашение' };
  const clans = getAllClansRaw();
  const clanIndex = clans.findIndex(c => c.id === clanId);
  if (clanIndex === -1) return { error: 'Клан не найден' };

  const clan = clans[clanIndex];
  const cleanUserKey = String(userKey).trim().toLowerCase();

  // Удаляем приглашение из списка
  clan.invites = (clan.invites || []).filter(inv => inv.toUserKey.toLowerCase() !== cleanUserKey);

  if (accept) {
    // Если игрок уже был в каком-то другом клане — удаляем его оттуда
    clans.forEach((c, idx) => {
      if (idx !== clanIndex && c.members) {
        c.members = c.members.filter(m => m.toLowerCase() !== cleanUserKey);
      }
    });

    if (!clan.members.map(m => m.toLowerCase()).includes(cleanUserKey)) {
      clan.members.push(cleanUserKey);
    }

    const joiningUser = getUserProfile(cleanUserKey);
    const userName = joiningUser?.name || cleanUserKey.split('@')[0];

    clan.chat = clan.chat || [];
    clan.chat.push({
      id: `cmsg_${Date.now()}`,
      fromKey: 'system',
      fromName: 'Канцелярия Конохи',
      text: `Шиноби ${userName} принял свиток-приглашение и вступил в ряды клана!`,
      timestamp: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // Обновляем профиль пользователя
    const u = getUser(cleanUserKey);
    if (u) {
      saveUser({
        ...u,
        clanId: clan.id,
        clanName: clan.name
      });
    }
  }

  clans[clanIndex] = clan;
  saveAllClans(clans);

  return { success: true, accepted: Boolean(accept), clan: enrichClan(clan) };
}

function leaveClan({ clanId, userKey }) {
  if (!clanId || !userKey) return { error: 'Параметры не указаны' };
  const clans = getAllClansRaw();
  const clanIndex = clans.findIndex(c => c.id === clanId);
  if (clanIndex === -1) return { error: 'Клан не найден' };

  const clan = clans[clanIndex];
  const cleanUserKey = String(userKey).trim().toLowerCase();

  clan.members = (clan.members || []).filter(m => m.toLowerCase() !== cleanUserKey);

  // Сброс у пользователя
  const u = getUser(cleanUserKey);
  if (u) {
    saveUser({
      ...u,
      clanId: null,
      clanName: null
    });
  }

  // Если клан опустел — удаляем его
  if (clan.members.length === 0) {
    clans.splice(clanIndex, 1);
    saveAllClans(clans);
    return { success: true, disbanded: true };
  }

  // Если ушел лидер — передаем лидерство следующему члену
  if (String(clan.leaderKey).toLowerCase() === cleanUserKey) {
    clan.leaderKey = clan.members[0];
    const newLeader = getUserProfile(clan.leaderKey);
    clan.leaderName = newLeader?.name || clan.leaderKey.split('@')[0];
  }

  clans[clanIndex] = clan;
  saveAllClans(clans);

  return { success: true, clan: enrichClan(clan) };
}

function disbandClan({ clanId, userKey }) {
  if (!clanId || !userKey) return { error: 'Параметры не указаны' };
  const clans = getAllClansRaw();
  const clanIndex = clans.findIndex(c => c.id === clanId);
  if (clanIndex === -1) return { error: 'Клан не найден' };

  const clan = clans[clanIndex];
  const cleanUserKey = String(userKey).trim().toLowerCase();

  if (String(clan.leaderKey).toLowerCase() !== cleanUserKey) {
    return { error: 'Только Глава Клана может распустить клан!' };
  }

  // Сбрасываем clanId у всех членов
  for (const mKey of clan.members || []) {
    const u = getUser(mKey);
    if (u) {
      saveUser({
        ...u,
        clanId: null,
        clanName: null
      });
    }
  }

  clans.splice(clanIndex, 1);
  saveAllClans(clans);

  return { success: true };
}

function getClanLeaderboard() {
  const clans = getAllClansRaw();
  const enriched = clans.map(c => enrichClan(c)).filter(Boolean);

  // Сортировка по суммарному PvP XP всех соклановцев, затем по победам
  enriched.sort((a, b) => {
    if (b.totalClanXp !== a.totalClanXp) return b.totalClanXp - a.totalClanXp;
    return b.totalPvpWins - a.totalPvpWins;
  });

  return enriched.slice(0, 50).map((clan, idx) => ({
    rankPosition: idx + 1,
    id: clan.id,
    name: clan.name,
    leaderName: clan.leaderName,
    leaderKey: clan.leaderKey,
    motto: clan.motto,
    emblemId: clan.emblemId,
    createdAt: clan.createdAt,
    memberCount: clan.memberCount,
    totalClanXp: clan.totalClanXp,
    totalPvpWins: clan.totalPvpWins,
    avgLevel: clan.avgLevel
  }));
}

function saveClanMessage({ clanId, fromKey, fromName, text }) {
  if (!clanId || !text || !text.trim()) return null;
  const clans = getAllClansRaw();
  const clanIndex = clans.findIndex(c => c.id === clanId);
  if (clanIndex === -1) return null;

  const clan = clans[clanIndex];
  clan.chat = clan.chat || [];

  const newMsg = {
    id: `cmsg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fromKey: String(fromKey).trim().toLowerCase(),
    fromName: fromName || fromKey.split('@')[0],
    text: text.trim(),
    timestamp: Date.now(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  clan.chat.push(newMsg);
  if (clan.chat.length > 200) clan.chat.shift();

  clans[clanIndex] = clan;
  saveAllClans(clans);

  return newMsg;
}

function getClanMessages(clanId) {
  if (!clanId) return [];
  const clan = getClan(clanId);
  return clan ? (clan.chat || []) : [];
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
  calculateShinobiLevelFromXp,
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
  getDirectMessages,
  // Клановая Система Конохи
  createClan,
  getClan,
  getUserClan,
  updateClan,
  inviteUserToClan,
  respondClanInvite,
  leaveClan,
  disbandClan,
  getClanLeaderboard,
  saveClanMessage,
  getClanMessages,
  // Авторизация, Пароли и Оповещения Создателя
  registerUser,
  loginUser,
  isDeveloper,
  saveSystemAnnouncement,
  getSystemAnnouncements,
  DEVELOPER_EMAIL
};

