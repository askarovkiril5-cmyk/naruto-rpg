/**
 * rulesManager.js
 * Менеджер правил для игры «Наруто RPG».
 * Автоматически обнаруживает любые файлы правил в папке rules/ (0.3.2, 0.3.3, 0.3.4 и далее)
 * без необходимости переделывать приложение.
 * Предоставляет полный текст правил ИИ-ведущему как системный промпт без каких-либо искажений.
 */

const fs = require('fs');
const path = require('path');

const RULES_DIR = path.join(__dirname, '..', 'rules');

// Кеш текстов правил в памяти
const rulesCache = new Map();

/**
 * Извлечение информации о версии из имени файла
 * Поддерживает форматы:
 * - Naruto_GM_Prompt_v0_3_2_Base.md -> version: "0.3.2", title: "0.3.2 Базовая"
 * - Naruto_GM_Prompt_v0_3_3_Tactical.md -> version: "0.3.3", title: "0.3.3 Время и дальность"
 * - Naruto_GM_Prompt_v0_3_4_ChakraFlow.md -> version: "0.3.4", title: "0.3.4 ChakraFlow"
 * - Любой файл *.md
 */
function parseRuleFileInfo(fileName) {
  const ext = path.extname(fileName);
  if (ext.toLowerCase() !== '.md') return null;

  let version = '0.3.2';
  let title = fileName.replace(/\.md$/i, '');

  const vMatch = fileName.match(/v?(\d+)[_.](\d+)[_.](\d+)/i);
  if (vMatch) {
    version = `${vMatch[1]}.${vMatch[2]}.${vMatch[3]}`;
  }

  if (version === '0.3.2') {
    title = '0.3.2 Базовая (Каноничный баланс)';
  } else if (version === '0.3.3') {
    title = '0.3.3 Время и дальность (Тактическая с точной физикой)';
  } else {
    // Для будущих версий (0.3.4+)
    const cleanTitle = fileName
      .replace(/Naruto_GM_Prompt_/i, '')
      .replace(/v?\d+[_.]\d+[_.]\d+[_.]?/i, '')
      .replace(/\.md$/i, '')
      .replace(/_/g, ' ')
      .trim();
    title = cleanTitle ? `${version} ${cleanTitle}` : `Версия ${version}`;
  }

  return {
    version,
    title,
    fileName,
    fullPath: path.join(RULES_DIR, fileName)
  };
}

/**
 * Получить список всех доступных версий правил
 */
function getAvailableRuleVersions() {
  if (!fs.existsSync(RULES_DIR)) {
    fs.mkdirSync(RULES_DIR, { recursive: true });
  }

  const files = fs.readdirSync(RULES_DIR);
  const versions = [];

  for (const f of files) {
    const info = parseRuleFileInfo(f);
    if (info && fs.statSync(info.fullPath).isFile()) {
      versions.push({
        version: info.version,
        title: info.title,
        fileName: info.fileName
      });
    }
  }

  // Сортировка по номеру версии (новые выше)
  versions.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));

  // Если папка пуста (не должно быть), добавляем дефолтные версии
  if (versions.length === 0) {
    versions.push(
      { version: '0.3.3', title: '0.3.3 Время и дальность', fileName: 'Naruto_GM_Prompt_v0_3_3_Tactical.md' },
      { version: '0.3.2', title: '0.3.2 Базовая', fileName: 'Naruto_GM_Prompt_v0_3_2_Base.md' }
    );
  }

  return versions;
}

/**
 * Загрузить полный текст правил для указанной версии без изменений
 * @param {string} version 
 * @returns {string} Исходный текст правил из файла
 */
function getRulesContent(version) {
  if (rulesCache.has(version)) {
    return rulesCache.get(version);
  }

  const all = getAvailableRuleVersions();
  const match = all.find(r => r.version === version || r.fileName.includes(version)) || all[0];

  if (!match) {
    return `Ты — Ведущий тактической текстовой PvP-RPG по Наруто. Действуй строго по регламенту версии ${version}.`;
  }

  const fullPath = path.join(RULES_DIR, match.fileName);
  try {
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      rulesCache.set(version, content);
      return content;
    }
  } catch (err) {
    console.error(`[RulesManager] Ошибка чтения правил ${fullPath}:`, err.message);
  }

  return `Ты — Ведущий тактической текстовой PvP-RPG по Наруто. Действуй строго по регламенту версии ${version}.`;
}

/**
 * Добавление нового файла правил (0.3.4 и т.д.)
 */
function saveNewRuleFile(fileName, content) {
  if (!fs.existsSync(RULES_DIR)) {
    fs.mkdirSync(RULES_DIR, { recursive: true });
  }

  const safeName = path.basename(fileName);
  const targetPath = path.join(RULES_DIR, safeName);

  fs.writeFileSync(targetPath, content, 'utf-8');
  // Сбрасываем кеш
  rulesCache.clear();

  const info = parseRuleFileInfo(safeName);
  return info;
}

module.exports = {
  RULES_DIR,
  getAvailableRuleVersions,
  getRulesContent,
  saveNewRuleFile
};
