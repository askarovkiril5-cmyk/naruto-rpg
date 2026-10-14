/**
 * storageManager.js
 * Надежное постоянное хранилище для Naruto RPG.
 * Сохраняет историю сражений, летописи боев, пользовательских шиноби и статистику.
 * Работает как на локальном ПК, так и в Docker / облаке (Render Persistent Disk).
 */

const fs = require('fs');
const path = require('path');

// Путь к папке постоянного хранилища (поддерживает переменную DATA_DIR для Render/Docker)
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const BATTLES_FILE = path.join(DATA_DIR, 'battles_history.json');
const CHARACTERS_FILE = path.join(DATA_DIR, 'saved_characters.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

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
  // Сохраняем до 500 последних боев
  if (battles.length > 500) battles.length = 500;
  writeJsonFile(BATTLES_FILE, battles);
  console.log(`[StorageManager] Партия ${entry.id} успешно сохранена в постоянное хранилище.`);
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
  if (level >= 90) return { title: 'Каге / Легендарный Саннин', icon: '🔥', tier: 6, color: '#f59e0b' };
  if (level >= 70) return { title: 'Элитный АНБУ', icon: '🎭', tier: 5, color: '#ec4899' };
  if (level >= 45) return { title: 'Джонин Конохи', icon: '🌪️', tier: 4, color: '#8b5cf6' };
  if (level >= 25) return { title: 'Специальный Джонин', icon: '⚔️', tier: 3, color: '#3b82f6' };
  if (level >= 10) return { title: 'Чунин', icon: '📜', tier: 2, color: '#10b981' };
  return { title: 'Генин', icon: '🥋', tier: 1, color: '#94a3b8' };
}

/**
 * Расчет уровня шиноби и оставшегося опыта
 */
function calculateLevelFromXp(totalXp = 0) {
  let level = 1;
  let remaining = Math.max(0, totalXp);
  let req = 400;

  while (remaining >= req && level < 100) {
    remaining -= req;
    level += 1;
    req = Math.floor(400 + (level - 1) * 250);
  }

  const rank = getShinobiRank(level);
  const progressPercent = Math.min(100, Math.floor((remaining / req) * 100));

  return {
    level,
    currentXp: remaining,
    nextLevelXp: req,
    totalXp,
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
  const raw = users[key] || {
    identifier: key,
    name: identifier,
    email: key.includes('@') ? key : null,
    googleConnected: key.includes('@'),
    totalXp: 0,
    battlesPlayed: 0,
    battlesWon: 0,
    createdAt: new Date().toISOString()
  };

  const progression = calculateLevelFromXp(raw.totalXp || 0);

  return {
    ...raw,
    ...progression,
    unlockedTopModels: Boolean(raw.googleConnected || raw.email)
  };
}

/**
 * Сохранить / обновить данные пользователя
 */
function saveUser(userData) {
  if (!userData) return null;
  const key = (userData.email || userData.name || userData.identifier || 'shinobi').trim().toLowerCase();
  const users = readJsonFile(USERS_FILE, {});
  const current = users[key] || {};

  const updated = {
    ...current,
    ...userData,
    identifier: key,
    email: userData.email || current.email || (key.includes('@') ? key : null),
    googleConnected: Boolean(userData.googleConnected || userData.email || current.googleConnected),
    totalXp: userData.totalXp !== undefined ? userData.totalXp : (current.totalXp || 0),
    battlesPlayed: userData.battlesPlayed !== undefined ? userData.battlesPlayed : (current.battlesPlayed || 0),
    battlesWon: userData.battlesWon !== undefined ? userData.battlesWon : (current.battlesWon || 0),
    updatedAt: new Date().toISOString()
  };

  users[key] = updated;
  writeJsonFile(USERS_FILE, users);

  return getUserProfile(key);
}

/**
 * Начислить опыт по итогам битвы
 */
function awardBattleExperience(identifier, { isWinner = false, rounds = 1 }) {
  const profile = getUserProfile(identifier);
  if (!profile) return null;

  // Базовые награды
  let xpGain = (isWinner ? 400 : 150) + (rounds * 40);
  // Бонус 25% за привязанный Google-аккаунт
  if (profile.googleConnected) {
    xpGain = Math.round(xpGain * 1.25);
  }

  const oldLevel = profile.level;
  const newTotalXp = (profile.totalXp || 0) + xpGain;
  const updatedProfile = saveUser({
    ...profile,
    totalXp: newTotalXp,
    battlesPlayed: (profile.battlesPlayed || 0) + 1,
    battlesWon: (profile.battlesWon || 0) + (isWinner ? 1 : 0)
  });

  const leveledUp = updatedProfile.level > oldLevel;

  return {
    profile: updatedProfile,
    xpGain,
    leveledUp,
    oldLevel,
    newLevel: updatedProfile.level
  };
}

function getUser(email) {
  return getUserProfile(email);
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
  calculateLevelFromXp,
  awardBattleExperience
};
