/**
 * shinobiRanksData.js
 * 100 уровней развития шиноби:
 * Содержит строго: Уровень, Ранг шиноби и Символ.
 */

export const SHINOBI_RANKS_DATA = [
  // 1 - 9: Академия и младшие генины
  { level: 1, rank: 'Студент Академии Ниндзя', tier: 'academy', kanji: '生', icon: '🌱', color: '#94a3b8' },
  { level: 2, rank: 'Студент: Отработка базовых чакра-каналов', tier: 'academy', kanji: '学', icon: '📜', color: '#94a3b8' },
  { level: 3, rank: 'Выпускник Академии Скрытого Листа', tier: 'academy', kanji: '卒', icon: '🍃', color: '#94a3b8' },
  { level: 4, rank: 'Начинающий Генин (Протектор Конохи)', tier: 'genin', kanji: '忍', icon: '🥋', color: '#64748b' },
  { level: 5, rank: 'Генин ранга D: Командные миссии', tier: 'genin', kanji: '下', icon: '🗡️', color: '#64748b' },
  { level: 6, rank: 'Генин ранга D: Контроль древесной чакры', tier: 'genin', kanji: '木', icon: '🌿', color: '#64748b' },
  { level: 7, rank: 'Генин ранга C: Первые боевые стычки', tier: 'genin', kanji: '葉', icon: '🍁', color: '#64748b' },
  { level: 8, rank: 'Опытный боевой Генин команды', tier: 'genin', kanji: '隊', icon: '⚔️', color: '#64748b' },
  { level: 9, rank: 'Старший Генин (Допуск к Экзамену Чунина)', tier: 'genin', kanji: '試', icon: '🎯', color: '#64748b' },

  // 10 - 24: Чунины (Лидеры звеньев)
  { level: 10, rank: 'Чунин (Сдавший Экзамен в Лесу Смерти)', tier: 'chunin', kanji: '中', icon: '📜', color: '#10b981' },
  { level: 11, rank: 'Чунин тактического звена', tier: 'chunin', kanji: '策', icon: '🧩', color: '#10b981' },
  { level: 12, rank: 'Чунин: Разведчик первого эшелона', tier: 'chunin', kanji: '探', icon: '🔍', color: '#10b981' },
  { level: 13, rank: 'Чунин: Боевой медик поддержки', tier: 'chunin', kanji: '医', icon: '💚', color: '#10b981' },
  { level: 14, rank: 'Чунин: Специалист по маскировке', tier: 'chunin', kanji: '隠', icon: '🌫️', color: '#10b981' },
  { level: 15, rank: 'Чунин: Командир патрульного отряда', tier: 'chunin', kanji: '巡', icon: '🛡️', color: '#10b981' },
  { level: 16, rank: 'Чунин: Мастер взрывных печатей', tier: 'chunin', kanji: '爆', icon: '💥', color: '#10b981' },
  { level: 17, rank: 'Чунин: Инструктор юных шиноби', tier: 'chunin', kanji: '教', icon: '📚', color: '#10b981' },
  { level: 18, rank: 'Чунин: Специалист стихийного резонанса', tier: 'chunin', kanji: '気', icon: '⚡', color: '#10b981' },
  { level: 19, rank: 'Чунин боевого авангарда', tier: 'chunin', kanji: '鋒', icon: '🗡️', color: '#10b981' },
  { level: 20, rank: 'Старший Чунин Скрытого Листа', tier: 'chunin', kanji: '統', icon: '🎖️', color: '#059669' },
  { level: 21, rank: 'Старший Чунин: Эксперт засад', tier: 'chunin', kanji: '伏', icon: '🪤', color: '#059669' },
  { level: 22, rank: 'Старший Чунин: Командир штурмовой группы', tier: 'chunin', kanji: '襲', icon: '⚔️', color: '#059669' },
  { level: 23, rank: 'Старший Чунин миссий ранга B', tier: 'chunin', kanji: '乙', icon: '📜', color: '#059669' },
  { level: 24, rank: 'Ветеран Чунинов (Кандидат в Спец-Джонины)', tier: 'chunin', kanji: '選', icon: '⭐', color: '#059669' },

  // 25 - 44: Специальные Джонины (Токубецу Джонин)
  { level: 25, rank: 'Специальный Джонин (Токубецу Джонин)', tier: 'tokubetsu', kanji: '特', icon: '⚔️', color: '#3b82f6' },
  { level: 26, rank: 'Спец-Джонин: Мастер допросов и ментальной защиты', tier: 'tokubetsu', kanji: '問', icon: '🧠', color: '#3b82f6' },
  { level: 27, rank: 'Спец-Джонин: Эксперт боевых ядов и трав', tier: 'tokubetsu', kanji: '毒', icon: '🧪', color: '#3b82f6' },
  { level: 28, rank: 'Спец-Джонин: Архитектор защитных барьеров', tier: 'tokubetsu', kanji: '結', icon: '🔮', color: '#3b82f6' },
  { level: 29, rank: 'Спец-Джонин: Сенсор дальнего радиуса', tier: 'tokubetsu', kanji: '感', icon: '📡', color: '#3b82f6' },
  { level: 30, rank: 'Спец-Джонин: Мастер кэндзюцу (Путь Клинка)', tier: 'tokubetsu', kanji: '剣', icon: '🗡️', color: '#3b82f6' },
  { level: 31, rank: 'Спец-Джонин: Мастер фуиндзюцу (Запечатывание)', tier: 'tokubetsu', kanji: '封', icon: '🌀', color: '#3b82f6' },
  { level: 32, rank: 'Спец-Джонин: Эксперт гендзюцу и контр-иллюзий', tier: 'tokubetsu', kanji: '幻', icon: '👁️', color: '#3b82f6' },
  { level: 33, rank: 'Спец-Джонин: Охотник за дезертирами (Нукенинами)', tier: 'tokubetsu', kanji: '狩', icon: '🐺', color: '#3b82f6' },
  { level: 34, rank: 'Спец-Джонин: Мастер призыва зверей-союзников', tier: 'tokubetsu', kanji: '召', icon: '🐾', color: '#3b82f6' },
  { level: 35, rank: 'Спец-Джонин: Координатор штаба обороны Конохи', tier: 'tokubetsu', kanji: '防', icon: '🏯', color: '#2563eb' },
  { level: 36, rank: 'Спец-Джонин: Разведчик глубокого тыла врага', tier: 'tokubetsu', kanji: '密', icon: '🥷', color: '#2563eb' },
  { level: 37, rank: 'Спец-Джонин: Эксперт стихии Огня и Взрыва', tier: 'tokubetsu', kanji: '炎', icon: '🔥', color: '#2563eb' },
  { level: 38, rank: 'Спец-Джонин: Эксперт стихии Ветра и Режущей чакры', tier: 'tokubetsu', kanji: '風', icon: '🌪️', color: '#2563eb' },
  { level: 39, rank: 'Спец-Джонин: Эксперт стихии Молнии и Скорости', tier: 'tokubetsu', kanji: '雷', icon: '⚡', color: '#2563eb' },
  { level: 40, rank: 'Спец-Джонин: Эксперт стихии Земли и Несокрушимости', tier: 'tokubetsu', kanji: '土', icon: '⛰️', color: '#2563eb' },
  { level: 41, rank: 'Спец-Джонин: Эксперт стихии Воды и Скрытого Тумана', tier: 'tokubetsu', kanji: '水', icon: '🌊', color: '#2563eb' },
  { level: 42, rank: 'Старший Спец-Джонин тайных операций', tier: 'tokubetsu', kanji: '極', icon: '💠', color: '#1d4ed8' },
  { level: 43, rank: 'Инструктор особого назначения Конохи', tier: 'tokubetsu', kanji: '師', icon: '🎖️', color: '#1d4ed8' },
  { level: 44, rank: 'Кандидат в Совет Высших Джонинов', tier: 'tokubetsu', kanji: '昇', icon: '✨', color: '#1d4ed8' },

  // 45 - 69: Джонины (Элита деревни)
  { level: 45, rank: 'Джонин Скрытого Листа (Высший Ранг)', tier: 'jonin', kanji: '上', icon: '🌪️', color: '#8b5cf6' },
  { level: 46, rank: 'Джонин: Наставник трех Генинов', tier: 'jonin', kanji: '導', icon: '👥', color: '#8b5cf6' },
  { level: 47, rank: 'Джонин: Мастер двойного стихийного дзюцу', tier: 'jonin', kanji: '双', icon: '☯️', color: '#8b5cf6' },
  { level: 48, rank: 'Джонин: Мастер скрытого проникновения', tier: 'jonin', kanji: '潜', icon: '🌑', color: '#8b5cf6' },
  { level: 49, rank: 'Джонин: Командующий оборонительным сектором', tier: 'jonin', kanji: '陣', icon: '🚩', color: '#8b5cf6' },
  { level: 50, rank: 'Джонин: Полководец боевых баталий', tier: 'jonin', kanji: '将', icon: '⚔️', color: '#8b5cf6' },
  { level: 51, rank: 'Джонин: Исполнитель миссий ранга A', tier: 'jonin', kanji: '甲', icon: '📜', color: '#8b5cf6' },
  { level: 52, rank: 'Джонин: Мастер боевого предвидения', tier: 'jonin', kanji: '眼', icon: '👁️', color: '#8b5cf6' },
  { level: 53, rank: 'Джонин: Хранитель клановых секретов', tier: 'jonin', kanji: '秘', icon: '🗝️', color: '#8b5cf6' },
  { level: 54, rank: 'Джонин: Эксперт подавления бунтов', tier: 'jonin', kanji: '鎮', icon: '⚖️', color: '#8b5cf6' },
  { level: 55, rank: 'Старший Джонин Скрытого Листа', tier: 'jonin', kanji: '高', icon: '🏅', color: '#7c3aed' },
  { level: 56, rank: 'Старший Джонин: Ветеран Великих Войн', tier: 'jonin', kanji: '戦', icon: '🛡️', color: '#7c3aed' },
  { level: 57, rank: 'Старший Джонин: Мастер высшего тайдзюцу', tier: 'jonin', kanji: '体', icon: '👊', color: '#7c3aed' },
  { level: 58, rank: 'Старший Джонин: Мастер высшего ниндзюцу', tier: 'jonin', kanji: '法', icon: '🔮', color: '#7c3aed' },
  { level: 59, rank: 'Старший Джонин: Сокрушитель вражеских взводов', tier: 'jonin', kanji: '破', icon: '⚡', color: '#7c3aed' },
  { level: 60, rank: 'Элитный Джонин Конохи', tier: 'jonin', kanji: '精', icon: '💎', color: '#6d28d9' },
  { level: 61, rank: 'Элитный Джонин: Лидер корпуса Джонинов', tier: 'jonin', kanji: '首', icon: '👑', color: '#6d28d9' },
  { level: 62, rank: 'Элитный Джонин: Хранитель Деревни', tier: 'jonin', kanji: '守', icon: '🛡️', color: '#6d28d9' },
  { level: 63, rank: 'Элитный Джонин миссий ранга S', tier: 'jonin', kanji: '極', icon: '🔥', color: '#6d28d9' },
  { level: 64, rank: 'Элитный Джонин: Советник Конохи', tier: 'jonin', kanji: '相', icon: '📜', color: '#6d28d9' },
  { level: 65, rank: 'Мастер Воли Огня Скрытого Листа', tier: 'jonin', kanji: '火', icon: '🔥', color: '#6d28d9' },
  { level: 66, rank: 'Мастер высшей концентрации чакры', tier: 'jonin', kanji: '聚', icon: '🌀', color: '#5b21b6' },
  { level: 67, rank: 'Мастер боевого просветления', tier: 'jonin', kanji: '悟', icon: '✨', color: '#5b21b6' },
  { level: 68, rank: 'Легендарный Ветеран Совета Джонинов', tier: 'jonin', kanji: '老', icon: '🏛️', color: '#5b21b6' },
  { level: 69, rank: 'Верховный Джонин Конохи', tier: 'jonin', kanji: '頂', icon: '🌟', color: '#5b21b6' },

  // 70 - 89: АНБУ (Специальный отряд тайных операций)
  { level: 70, rank: 'Оперативник АНБУ (Маска Зверя)', tier: 'anbu', kanji: '暗', icon: '🎭', color: '#ec4899' },
  { level: 71, rank: 'АНБУ: Клинок ночного правосудия', tier: 'anbu', kanji: '刃', icon: '🗡️', color: '#ec4899' },
  { level: 72, rank: 'АНБУ: Тень Скрытого Листа', tier: 'anbu', kanji: '影', icon: '👤', color: '#ec4899' },
  { level: 73, rank: 'АНБУ: Эксперт бесследной ликвидации', tier: 'anbu', kanji: '滅', icon: '🩸', color: '#ec4899' },
  { level: 74, rank: 'АНБУ: Охотник за секретами других деревень', tier: 'anbu', kanji: '密', icon: '🦅', color: '#ec4899' },
  { level: 75, rank: 'Командир тактической ячейки АНБУ', tier: 'anbu', kanji: '班', icon: '🐺', color: '#db2777' },
  { level: 76, rank: 'АНБУ: Мастер техники быстрого перемещения', tier: 'anbu', kanji: '瞬', icon: '⚡', color: '#db2777' },
  { level: 77, rank: 'АНБУ: Защитник резиденции Хокаге', tier: 'anbu', kanji: '衛', icon: '🏯', color: '#db2777' },
  { level: 78, rank: 'АНБУ: Эксперт ликвидации отступников S-ранга', tier: 'anbu', kanji: '誅', icon: '⚔️', color: '#db2777' },
  { level: 79, rank: 'АНБУ: Мастер запечатывания Биджу и демонов', tier: 'anbu', kanji: '鎖', icon: '⛓️', color: '#db2777' },
  { level: 80, rank: 'Капитан Подразделения АНБУ', tier: 'anbu', kanji: '長', icon: '👺', color: '#be185d' },
  { level: 81, rank: 'Капитан АНБУ: Мастер Чёрного Клинка', tier: 'anbu', kanji: '黒', icon: '🗡️', color: '#be185d' },
  { level: 82, rank: 'Капитан АНБУ: Карающий призрак Конохи', tier: 'anbu', kanji: '幽', icon: '👻', color: '#be185d' },
  { level: 83, rank: 'Капитан АНБУ: Невидимый страж границ', tier: 'anbu', kanji: '境', icon: '🛡️', color: '#be185d' },
  { level: 84, rank: 'Капитан АНБУ: Стратег тайных войн', tier: 'anbu', kanji: '謀', icon: '♟️', color: '#be185d' },
  { level: 85, rank: 'Генеральный Командующий АНБУ', tier: 'anbu', kanji: '統', icon: '🎖️', color: '#9d174d' },
  { level: 86, rank: 'Верховная Тень Совета Старейшин', tier: 'anbu', kanji: '冥', icon: '👁️', color: '#9d174d' },
  { level: 87, rank: 'Хранитель Кодекса Шиноби Ночи', tier: 'anbu', kanji: '律', icon: '📜', color: '#9d174d' },
  { level: 88, rank: 'Правая Рука Хокаге по Тайным Операциям', tier: 'anbu', kanji: '右', icon: '🗡️', color: '#9d174d' },
  { level: 89, rank: 'Легенда АНБУ: Призрак Войны', tier: 'anbu', kanji: '鬼', icon: '👺', color: '#831843' },

  // 90 - 94: Легендарные Саннины (Великая Троица)
  { level: 90, rank: 'Легендарный Саннин Конохи', tier: 'sannin', kanji: '仙', icon: '🐸', color: '#f59e0b' },
  { level: 91, rank: 'Саннин: Мастер Природной Энергии (Сеннин Мод)', tier: 'sannin', kanji: '道', icon: '✨', color: '#f59e0b' },
  { level: 92, rank: 'Саннин: Непобедимый Полководец Войн', tier: 'sannin', kanji: '豪', icon: '💥', color: '#d97706' },
  { level: 93, rank: 'Великий Мудрец Горы Мьёбоку / Пещеры Рьючи', tier: 'sannin', kanji: '聖', icon: '🐍', color: '#d97706' },
  { level: 94, rank: 'Живая Легенда Пяти Великих Стран', tier: 'sannin', kanji: '巨', icon: '👑', color: '#b45309' },

  // 95 - 99: Каге (Тень Деревни / Хокаге)
  { level: 95, rank: 'Кандидат на пост Хокаге', tier: 'kage', kanji: '選', icon: '⛩️', color: '#ef4444' },
  { level: 96, rank: 'Заместитель Главы Деревни Скрытого Листа', tier: 'kage', kanji: '補', icon: '📜', color: '#ef4444' },
  { level: 97, rank: 'Тень Огня (Хокаге Конохи)', tier: 'kage', kanji: '火', icon: '🔥', color: '#dc2626' },
  { level: 98, rank: 'Великий Каге: Лидер Альянса Пяти Стран', tier: 'kage', kanji: '盟', icon: '🌍', color: '#b91c1c' },
  { level: 99, rank: 'Верховный Хокаге: Защитник Всех Народов', tier: 'kage', kanji: '尊', icon: '☀️', color: '#991b1b' },

  // 100: Легенда Мира Шиноби (Бог Ниндзюцу)
  { level: 100, rank: 'Бог Ниндзюцу (Легенда Мира Шиноби)', tier: 'legend', kanji: '神', icon: '⚡', color: '#fbbf24' }
];

export const TIER_CATEGORIES = [
  { id: 'all', title: 'Все ранги (1-100)', levels: '1-100', color: '#e2e8f0' },
  { id: 'genin', title: 'Генин & Академия', levels: '1-9', color: '#94a3b8' },
  { id: 'chunin', title: 'Чунин', levels: '10-24', color: '#10b981' },
  { id: 'tokubetsu', title: 'Спец. Джонин', levels: '25-44', color: '#3b82f6' },
  { id: 'jonin', title: 'Джонин', levels: '45-69', color: '#8b5cf6' },
  { id: 'anbu', title: 'АНБУ', levels: '70-89', color: '#ec4899' },
  { id: 'sannin', title: 'Саннин', levels: '90-94', color: '#f59e0b' },
  { id: 'kage', title: 'Хокаге / Каге', levels: '95-99', color: '#ef4444' },
  { id: 'legend', title: 'Бог Ниндзюцу', levels: '100', color: '#fbbf24' }
];
