/**
 * geminiService.js
 * Сервис интеграции с Google Gemini API.
 * Поддерживает:
 * - Запрос реального списка доступных моделей (ListModels) через API
 * - Автоматический выбор самой мощной модели (gemini-2.5-pro / gemini-1.5-pro)
 * - Безопасную маскировку ключей (никаких ключей в открытом виде в логах)
 * - Смену модели на лету в процессе битвы
 */

// Рейтинг мощности моделей для авто-выбора лучшей
const MODEL_PRIORITY_ORDER = [
  'gemini-3.8-flash',
  'gemini-3.0-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash-thinking-exp',
  'gemini-2.0-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.0-pro'
];

/**
 * Безопасная маскировка ключа для логов
 */
function maskApiKey(key) {
  if (!key || typeof key !== 'string') return 'none';
  if (key.length <= 8) return '****';
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

/**
 * Запрос списка моделей из Google Gemini API (ListModels)
 * @param {string} [customApiKey] - Пользовательский ключ, если указан
 */
async function fetchGeminiModels(customApiKey) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey || !apiKey.startsWith('AIzaSy')) {
    // Возвращаем стандартный проверенный каталог с флагами
    return getFallbackModels();
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[GeminiService] Ошибка ListModels (${response.status}):`, errText);
      return getFallbackModels();
    }

    const data = await response.json();
    const models = Array.isArray(data.models) ? data.models : [];

    // Фильтруем только модели, поддерживающие генерацию текста (generateContent)
    const filtered = models.filter(m => {
      const methods = m.supportedGenerationMethods || [];
      return methods.includes('generateContent') && !m.name.includes('embedding') && !m.name.includes('aqa');
    });

    // Форматируем для клиента
    const formatted = filtered.map(m => {
      const id = m.name.replace(/^models\//, '');
      let tier = 'STANDARD';
      let badge = 'Быстрая';
      let requiresGoogle = false;

      if (id.includes('3.8-flash') || id.includes('3.0-flash')) {
        tier = 'NEXT_GEN';
        badge = '⚡ VIP (Google 3.8 Flash)';
        requiresGoogle = true;
      } else if (id.includes('2.5-pro') || id.includes('1.5-pro')) {
        tier = 'PRO';
        badge = '🧠 Глубокий расчет (Флагман 2.5 Pro)';
        requiresGoogle = true;
      } else if (id.includes('2.0-flash')) {
        tier = 'FLASH_2';
        badge = '⚡ Сверхбыстрая 2.0';
      } else if (id.includes('1.5-flash')) {
        tier = 'FLASH_1';
        badge = '⚡ Базовая 1.5';
      }

      return {
        id,
        name: m.name,
        displayName: m.displayName || id,
        description: m.description || 'Модель Google Gemini',
        badge,
        tier,
        requiresGoogle
      };
    });

    // Сортируем: сначала самые мощные
    formatted.sort((a, b) => {
      const idxA = MODEL_PRIORITY_ORDER.findIndex(p => a.id.includes(p));
      const idxB = MODEL_PRIORITY_ORDER.findIndex(p => b.id.includes(p));
      const scoreA = idxA >= 0 ? idxA : 999;
      const scoreB = idxB >= 0 ? idxB : 999;
      return scoreA - scoreB;
    });

    if (formatted.length > 0) {
      formatted[0].isDefault = true;
      return formatted;
    }
  } catch (err) {
    console.warn('[GeminiService] Ошибка сети при запросе ListModels:', err.message);
  }

  return getFallbackModels();
}

/**
 * Каталог моделей по умолчанию
 */
function getFallbackModels() {
  return [
    {
      id: 'gemini-3.8-flash',
      name: 'models/gemini-3.8-flash',
      displayName: 'Gemini 3.8 Flash (Preview)',
      description: 'Ультра-быстрая флагманская модель нового поколения. Мгновенная генерация кинематографичных раундов и точнейший учет всех 248 техник.',
      badge: '⚡ VIP: Разблокировано с Google-почтой',
      tier: 'NEXT_GEN',
      requiresGoogle: true,
      isDefault: true
    },
    {
      id: 'gemini-2.5-pro',
      name: 'models/gemini-2.5-pro',
      displayName: 'Gemini 2.5 Pro',
      description: 'Глубокий тактический интеллект, точная физика дистанций 0.3.3 и детальный расчёт «⚖ Почему так».',
      badge: '🧠 VIP: Глубокий расчет (Google-аккаунт)',
      tier: 'PRO',
      requiresGoogle: true
    },
    {
      id: 'gemini-2.0-flash',
      name: 'models/gemini-2.0-flash',
      displayName: 'Gemini 2.0 Flash',
      description: 'Новейшее поколение сверхбыстрых моделей, мгновенный расчет раунда дуэли.',
      badge: '⚡ Сверхскорость',
      tier: 'FLASH_2',
      requiresGoogle: false
    },
    {
      id: 'gemini-1.5-pro',
      name: 'models/gemini-1.5-pro',
      displayName: 'Gemini 1.5 Pro',
      description: 'Максимальное контекстное окно, строгое соблюдение баланса кланов.',
      badge: '🎯 Высокая точность',
      tier: 'PRO',
      requiresGoogle: false
    },
    {
      id: 'gemini-1.5-flash',
      name: 'models/gemini-1.5-flash',
      displayName: 'Gemini 1.5 Flash',
      description: 'Экономная и стабильная модель для базовых боев.',
      badge: '💨 Базовая',
      tier: 'FLASH_1',
      requiresGoogle: false
    }
  ];
}

module.exports = {
  MODEL_PRIORITY_ORDER,
  maskApiKey,
  fetchGeminiModels,
  getFallbackModels
};
