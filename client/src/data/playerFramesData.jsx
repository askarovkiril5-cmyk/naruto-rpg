import React from 'react';

/**
 * playerFramesData.jsx
 * Каталог аватарок и система наградных рамок за боевые достижения (Achievement Frames).
 * Дизайн рамок выполнен по высочайшим стандартам Mobile Legends: Bang Bang (MLBB Masterpiece Edition):
 * - Полный силуэтный прорыв (Silhouette Breakout & Asymmetry)
 * - Скульптурные 3D-артефакты на углах (шляпа Хокаге, маска АНБУ, ремень шиноби, рога Сусаноо, корона Творца)
 * - Чеканная трехмерная фаска, скосы и тени окклюзии (3-Tier Chiseled Lighting)
 * - Многослойный контраст материалов (кованое золото, вороненый титан, фарфор, кожа, драгоценные камни, плазма)
 */

export const DEVELOPER_EMAIL = 'askarovkiril5@gmail.com';

export function isDeveloperAccount(email) {
  if (!email) return false;
  return String(email).trim().toLowerCase() === DEVELOPER_EMAIL;
}

export const PRESET_AVATARS = [
  { id: 'av_naruto', name: 'Наруто Удзумаки', icon: '🍥', desc: 'Джинчурики Девятихвостого и Седьмой Хокаге' },
  { id: 'av_sasuke', name: 'Саске Учиха', icon: '⚡', desc: 'Теневой Хокаге и мастер Вечного Мангёкё' },
  { id: 'av_itachi', name: 'Итачи Учиха', icon: '👁️', desc: 'Гений клана Учиха и мастер Цукуёми' },
  { id: 'av_kakashi', name: 'Какаши Хатаке', icon: '🐕', desc: 'Копирующий ниндзя Конохи и Шестой Хокаге' },
  { id: 'av_madara', name: 'Мадара Учиха', icon: '🔥', desc: 'Легендарный патриарх Учиха и Бог войны' },
  { id: 'av_minato', name: 'Минато Намикадзе', icon: '⚡', desc: 'Жёлтая Молния Конохи и Четвёртый Хокаге' },
  { id: 'av_pain', name: 'Пейн (Тэндо)', icon: '🌀', desc: 'Бог Деревни Дождя и носитель Риннегана' },
  { id: 'av_jiraiya', name: 'Джирайя', icon: '🐸', desc: 'Жабий Мудрец с горы Мёбоку' },
  { id: 'av_tsunade', name: 'Цунаде Сенджу', icon: '🎲', desc: 'Величайший ниндзя-медик и Пятая Хокаге' },
  { id: 'av_gaara', name: 'Гаара Песчаный', icon: '⏳', desc: 'Пятый Казекаге Сунагакуре' },
  { id: 'av_orochimaru', name: 'Орочимару', icon: '🐍', desc: 'Бессмертный исследователь запретных техник' },
  { id: 'av_tobirama', name: 'Тобирама Сенджу', icon: '🌊', desc: 'Второй Хокаге и создатель Летящего Бога Грома' },
  { id: 'av_hashirama', name: 'Хаширама Сенджу', icon: '🌿', desc: 'Первый Хокаге и Бог Шиноби' },
  { id: 'av_hinata', name: 'Хината Хьюга', icon: '🕊️', desc: 'Принцесса Бьякугана' },
  { id: 'av_anbu_fox', name: 'Маска АНБУ Лиса', icon: '🎭', desc: 'Секретная служба тайных операций Конохи' },
  { id: 'av_creator', name: '👑 Создатель Мира Шиноби', icon: '👑', desc: 'Верховный Архитектор и Разработчик игры' }
];

export const PLAYER_FRAMES = [
  // =========================================================================
  // 1. АКАДЕМИЯ (Warrior Rank - MLBB Starlight Style)
  // Дерево Хиноки + диагональный кожаный ремень с латунной пряжкой + резной лист
  // =========================================================================
  {
    id: 'frame_academy',
    name: 'Дерево Академии Листа',
    tier: 1,
    rarity: 'Обычная (Warrior)',
    rarityColor: '#94a3b8',
    requirementText: 'Доступна всем новобранцам Конохи',
    checkUnlocked: () => true,
    progressText: () => 'Разблокировано',
    badge: '🍃 Академия',
    borderClass: 'border-emerald-600/70',
    glowClass: 'shadow-md shadow-emerald-900/30',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group overflow-visible`}>
        {/* Изумрудно-древесный ореол чакры */}
        <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-emerald-600/25 via-amber-800/20 to-transparent blur-sm opacity-80 pointer-events-none" />

        {/* Боковые деревянные пилоны с бронзовыми накладками */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-7 bg-gradient-to-b from-amber-700 via-amber-900 to-amber-950 rounded-l border-l border-y border-amber-500/60 shadow pointer-events-none flex flex-col justify-between py-1 items-center">
          <span className="w-1 h-1 rounded-full bg-amber-400" />
          <span className="w-1 h-1 rounded-full bg-amber-400" />
        </div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-7 bg-gradient-to-b from-amber-700 via-amber-900 to-amber-950 rounded-r border-r border-y border-amber-500/60 shadow pointer-events-none flex flex-col justify-between py-1 items-center">
          <span className="w-1 h-1 rounded-full bg-amber-400" />
          <span className="w-1 h-1 rounded-full bg-amber-400" />
        </div>

        {/* Основной корпус рамки из резного дерева Хиноки */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-950 via-zinc-950 to-emerald-950 border-2 border-emerald-600/80 shadow-xl shadow-black/80 overflow-hidden">
          <div className="absolute inset-0.5 border border-amber-600/40 rounded-xl" />
          {/* Бронзовые угловые скобы */}
          <span className="absolute top-0.5 left-0.5 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400 rounded-tl-md" />
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400 rounded-tr-md" />
          <span className="absolute bottom-0.5 left-0.5 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400 rounded-bl-md" />
          <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400 rounded-br-md" />
        </div>

        {/* Навершие (Top-Right): Резной нефритовый лист Конохи с росой */}
        <div className="absolute -top-2.5 right-1 z-20 flex items-center justify-center filter drop-shadow-[0_0_8px_#10b981] pointer-events-none">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-950 border border-amber-300 flex items-center justify-center text-xs shadow-md">
            🍃
          </div>
        </div>

        {/* Тактильный кожаный ремень шиноби с пряжкой через нижний левый угол (как в MLBB) */}
        <div className="absolute -bottom-1 -left-1 z-20 pointer-events-none flex items-center filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <div className="w-8 h-2.5 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 border border-amber-700 rounded-sm transform -rotate-12 flex items-center justify-center relative">
            <span className="w-3 h-3 bg-gradient-to-b from-yellow-300 to-amber-600 border border-black rounded-sm shadow-sm" />
            <span className="absolute w-1 h-0.5 bg-black" />
          </div>
        </div>

        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // =========================================================================
  // 2. ГЕНИН (Elite Rank - MLBB Style)
  // Изогнутый стальной протектор с заклепками + тройные клинки-крылья куная
  // =========================================================================
  {
    id: 'frame_genin',
    name: 'Сталь Протектора Генина',
    tier: 2,
    rarity: 'Редкая (Elite)',
    rarityColor: '#38bdf8',
    requirementText: '3 победы в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 3,
    progressText: (p) => `${Math.min(3, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 3 побед`,
    badge: '⚡ Генин',
    borderClass: 'border-sky-400',
    glowClass: 'shadow-lg shadow-sky-500/35',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group overflow-visible`}>
        {/* Неоновый лазурный ореол чакры */}
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-sky-500/35 via-cyan-400/25 to-blue-600/35 blur-md opacity-90 animate-pulse pointer-events-none" />

        {/* Боковые стальные клинки-крылья куная (MLBB Elite Bladed Winglets) */}
        <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none filter drop-shadow-[0_0_6px_#38bdf8]">
          <span className="w-3 h-1.5 bg-gradient-to-r from-sky-300 to-slate-700 rounded-l transform -rotate-12" />
          <span className="w-4.5 h-2.5 bg-gradient-to-r from-white via-cyan-300 to-slate-900 rounded-l border-l-2 border-white shadow -my-0.5" />
          <span className="w-3 h-1.5 bg-gradient-to-r from-sky-300 to-slate-700 rounded-l transform rotate-12" />
        </div>
        <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 flex flex-col items-start pointer-events-none filter drop-shadow-[0_0_6px_#38bdf8]">
          <span className="w-3 h-1.5 bg-gradient-to-l from-sky-300 to-slate-700 rounded-r transform rotate-12" />
          <span className="w-4.5 h-2.5 bg-gradient-to-l from-white via-cyan-300 to-slate-900 rounded-r border-r-2 border-white shadow -my-0.5" />
          <span className="w-3 h-1.5 bg-gradient-to-l from-sky-300 to-slate-700 rounded-r transform -rotate-12" />
        </div>

        {/* Корпус рамки из вороненого титана */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-900 via-zinc-950 to-sky-950 border-2 border-sky-400 shadow-2xl overflow-hidden">
          <div className="absolute inset-0.5 border border-sky-300/40 rounded-xl" />
          {/* 4 стальных шестигранных болта */}
          <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-600 shadow-inner" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-600 shadow-inner" />
          <span className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-600 shadow-inner" />
          <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-600 shadow-inner" />
        </div>

        {/* Навершие: Изогнутый стальной налобный протектор Хитаи-атэ со спиралью Листа */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-11 h-3.5 bg-gradient-to-b from-white via-slate-300 to-slate-600 border border-slate-800 rounded shadow-md flex items-center justify-between px-1 pointer-events-none filter drop-shadow-[0_0_6px_#38bdf8]">
          <span className="w-1 h-1 rounded-full bg-black/70" />
          <span className="text-[9px] font-black leading-none text-zinc-900 select-none">🍥</span>
          <span className="w-1 h-1 rounded-full bg-black/70" />
        </div>

        {/* Нижний пьедестал: Граненый лазурный кристалл чакры (Socketed Azure Gem) */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center filter drop-shadow-[0_0_8px_#06b6d4] pointer-events-none">
          <div className="w-4 h-4 rotate-45 bg-gradient-to-br from-white via-cyan-400 to-blue-900 border-2 border-sky-200 shadow-lg flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-75" />
          </div>
        </div>

        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // =========================================================================
  // 3. ЧУНИН (Master Rank - MLBB Style)
  // Бронепластины тактического жилета + золотые шевроны + картуш 『忍』
  // =========================================================================
  {
    id: 'frame_chunin',
    name: 'Чеканная Бронза Чунина',
    tier: 3,
    rarity: 'Редкая (Master)',
    rarityColor: '#fb923c',
    requirementText: '10 побед в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 10,
    progressText: (p) => `${Math.min(10, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 10 побед`,
    badge: '📜 Чунин',
    borderClass: 'border-amber-500',
    glowClass: 'shadow-lg shadow-amber-500/40',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group overflow-visible`}>
        {/* Янтарно-бронзовый ореол */}
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-amber-600/35 via-orange-500/25 to-yellow-600/35 blur-md opacity-90 pointer-events-none" />

        {/* Боковые золотые шевроны-щиты (MLBB Master Armored Chevrons) */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none filter drop-shadow-[0_0_6px_#f59e0b]">
          <span className="w-2.5 h-2.5 bg-gradient-to-r from-amber-300 to-amber-800 rounded-l border-y border-l border-yellow-200" />
          <span className="w-4.5 h-3.5 bg-gradient-to-r from-yellow-200 via-amber-400 to-amber-900 rounded-l border-l-2 border-white shadow -my-0.5" />
          <span className="w-2.5 h-2.5 bg-gradient-to-r from-amber-300 to-amber-800 rounded-l border-y border-l border-yellow-200" />
        </div>
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex flex-col items-start pointer-events-none filter drop-shadow-[0_0_6px_#f59e0b]">
          <span className="w-2.5 h-2.5 bg-gradient-to-l from-amber-300 to-amber-800 rounded-r border-y border-r border-yellow-200" />
          <span className="w-4.5 h-3.5 bg-gradient-to-l from-yellow-200 via-amber-400 to-amber-900 rounded-r border-r-2 border-white shadow -my-0.5" />
          <span className="w-2.5 h-2.5 bg-gradient-to-l from-amber-300 to-amber-800 rounded-r border-y border-r border-yellow-200" />
        </div>

        {/* Корпус рамки */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-950 via-zinc-950 to-orange-950 border-2 border-amber-500 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 border border-yellow-400/50 rounded-xl" />
          {/* Литые золотые когти по углам */}
          <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-yellow-300 rounded-tl-xl" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-yellow-300 rounded-tr-xl" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-yellow-300 rounded-bl-xl" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-yellow-300 rounded-br-xl" />
        </div>

        {/* Верхний картуш: Литой знак ниндзя 『忍』 с золотой фаской */}
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center filter drop-shadow-[0_0_8px_#f59e0b] pointer-events-none">
          <div className="px-2.5 py-0.5 rounded-md bg-gradient-to-b from-yellow-300 via-amber-600 to-zinc-950 border-2 border-yellow-200 text-[10px] font-black text-black font-serif tracking-widest shadow-lg">
            忍
          </div>
        </div>

        {/* Нижний пьедестал: Тигриный глаз чунина */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center filter drop-shadow-[0_0_6px_#f59e0b] pointer-events-none">
          <span className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-amber-900 border border-white shadow" />
        </div>

        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // =========================================================================
  // 4. ДЖОНИН (Grandmaster Rank - MLBB Style)
  // Платиновые крылья Летящего Бога Грома + дуги молний Райкири + сапфир
  // =========================================================================
  {
    id: 'frame_jonin',
    name: 'Серебряный Вихрь Джонина',
    tier: 4,
    rarity: 'Эпическая (Grandmaster)',
    rarityColor: '#818cf8',
    requirementText: '25 побед в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 25,
    progressText: (p) => `${Math.min(25, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 25 побед`,
    badge: '🌪️ Джонин',
    borderClass: 'border-indigo-400',
    glowClass: 'shadow-xl shadow-indigo-500/50',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group overflow-visible`}>
        {/* Сапфирово-платиновый сияющий контур */}
        <div className="absolute -inset-2.5 rounded-2xl bg-gradient-to-tr from-indigo-500/45 via-sky-400/35 to-purple-500/45 blur-lg opacity-90 animate-pulse pointer-events-none" />

        {/* Боковые трехлопастные клинки-крылья Хирайшин (MLBB Grandmaster Wing Blades) */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none filter drop-shadow-[0_0_8px_#818cf8]">
          <span className="w-3.5 h-2 bg-gradient-to-r from-indigo-300 via-white to-indigo-700 rounded-l transform -rotate-15 shadow" />
          <span className="w-5.5 h-3 bg-gradient-to-r from-sky-200 via-white to-indigo-900 rounded-l border-l-2 border-white shadow-lg -my-0.5" />
          <span className="w-3.5 h-2 bg-gradient-to-r from-indigo-300 via-white to-indigo-700 rounded-l transform rotate-15 shadow" />
        </div>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col items-start pointer-events-none filter drop-shadow-[0_0_8px_#818cf8]">
          <span className="w-3.5 h-2 bg-gradient-to-l from-indigo-300 via-white to-indigo-700 rounded-r transform rotate-15 shadow" />
          <span className="w-5.5 h-3 bg-gradient-to-l from-sky-200 via-white to-indigo-900 rounded-r border-r-2 border-white shadow-lg -my-0.5" />
          <span className="w-3.5 h-2 bg-gradient-to-l from-indigo-300 via-white to-indigo-700 rounded-r transform -rotate-15 shadow" />
        </div>

        {/* Корпус рамки */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-950 via-zinc-950 to-slate-900 border-2 border-indigo-400 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 border border-indigo-300/50 rounded-xl" />
          <div className="absolute top-0 inset-x-3 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
        </div>

        {/* Навершие: Граненый сапфир Джонина с 4-лучевой фотонной звездой */}
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center filter drop-shadow-[0_0_10px_#6366f1] pointer-events-none">
          <div className="w-5 h-5 rotate-45 bg-gradient-to-br from-white via-indigo-400 to-indigo-950 border-2 border-sky-200 flex items-center justify-center shadow-lg">
            <span className="text-[9px] text-white font-black rotate-[-45deg]">✦</span>
          </div>
        </div>

        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // =========================================================================
  // 5. АНБУ (Epic Shadow Rank - MLBB Style)
  // Скульптурная фарфоровая маска Лиса Кицунэ + обсидиановые крылья + капли крови
  // =========================================================================
  {
    id: 'frame_anbu',
    name: 'Маска Тайных Операций АНБУ',
    tier: 5,
    rarity: 'Эпическая (Epic Shadow)',
    rarityColor: '#f43f5e',
    requirementText: '50 побед в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 50,
    progressText: (p) => `${Math.min(50, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 50 побед`,
    badge: '🎭 АНБУ',
    borderClass: 'border-rose-500',
    glowClass: 'shadow-xl shadow-rose-600/60',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group overflow-visible`}>
        {/* Кроваво-алый теневой дым */}
        <div className="absolute -inset-2.5 rounded-2xl bg-gradient-to-r from-rose-600/45 via-red-500/35 to-rose-700/45 blur-lg opacity-90 animate-pulse pointer-events-none" />

        {/* Обсидиановые перья ворона и лезвия танто (MLBB Epic Dragon Wings) */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none filter drop-shadow-[0_0_8px_#e11d48]">
          <span className="w-3.5 h-1.5 bg-gradient-to-r from-rose-500 to-black rounded-l border-l border-rose-300 transform -rotate-15" />
          <span className="w-6 h-3 bg-gradient-to-r from-white via-rose-600 to-black rounded-l border-l-2 border-rose-400 shadow-lg -my-0.5" />
          <span className="w-3.5 h-1.5 bg-gradient-to-r from-rose-500 to-black rounded-l border-l border-rose-300 transform rotate-15" />
        </div>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col items-start pointer-events-none filter drop-shadow-[0_0_8px_#e11d48]">
          <span className="w-3.5 h-1.5 bg-gradient-to-l from-rose-500 to-black rounded-r border-r border-rose-300 transform rotate-15" />
          <span className="w-6 h-3 bg-gradient-to-l from-white via-rose-600 to-black rounded-r border-r-2 border-rose-400 shadow-lg -my-0.5" />
          <span className="w-3.5 h-1.5 bg-gradient-to-l from-rose-500 to-black rounded-r border-r border-rose-300 transform -rotate-15" />
        </div>

        {/* Корпус рамки */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zinc-950 via-rose-950/60 to-black border-2 border-rose-500 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 border border-rose-400/50 rounded-xl" />
          <span className="absolute top-3 left-0 w-1.5 h-4 bg-rose-500 rounded-r shadow-[0_0_8px_#f43f5e]" />
          <span className="absolute top-3 right-0 w-1.5 h-4 bg-rose-500 rounded-l shadow-[0_0_8px_#f43f5e]" />
        </div>

        {/* Асимметричный угол (Top-Left): Скульптурная фарфоровая маска Лиса Кицунэ */}
        <div className="absolute -top-3.5 -left-2 z-30 pointer-events-none flex items-center justify-center filter drop-shadow-[0_0_10px_#f43f5e]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-b from-white via-rose-100 to-zinc-950 border-2 border-rose-400 flex items-center justify-center shadow-2xl text-sm">
            🦊
          </div>
        </div>

        {/* Нижний правый угол: Рукоять зазубренного танто со свитком */}
        <div className="absolute -bottom-1 -right-1 z-30 pointer-events-none filter drop-shadow-[0_0_6px_#f43f5e]">
          <span className="text-xs">🗡️</span>
        </div>

        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // =========================================================================
  // 6. САННИН (Epic Flame Rank - MLBB Style)
  // Каменная голова жабы Гамабунты + вздымающееся пламя Мёбоку + картуш 『油』
  // =========================================================================
  {
    id: 'frame_sannin',
    name: 'Пламя Легендарного Саннина',
    tier: 6,
    rarity: 'Легендарная (Epic Flame)',
    rarityColor: '#f59e0b',
    requirementText: '75 побед в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 75,
    progressText: (p) => `${Math.min(75, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 75 побед`,
    badge: '🐸 Саннин',
    borderClass: 'border-amber-400',
    glowClass: 'shadow-2xl shadow-amber-500/70',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group overflow-visible`}>
        {/* Бушующее пламя Мёбоку */}
        <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 blur-xl opacity-90 animate-pulse pointer-events-none" />

        {/* Боковые огненные крылья жабьего масла (MLBB Flame Wings) */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none filter drop-shadow-[0_0_10px_#f59e0b]">
          <span className="w-4 h-2 bg-gradient-to-r from-yellow-300 to-orange-600 rounded-l transform -rotate-15 shadow" />
          <span className="w-6.5 h-3.5 bg-gradient-to-r from-white via-amber-400 to-red-700 rounded-l border-l-2 border-yellow-200 shadow-xl -my-0.5" />
          <span className="w-4 h-2 bg-gradient-to-r from-yellow-300 to-orange-600 rounded-l transform rotate-15 shadow" />
        </div>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col items-start pointer-events-none filter drop-shadow-[0_0_10px_#f59e0b]">
          <span className="w-4 h-2 bg-gradient-to-l from-yellow-300 to-orange-600 rounded-r transform rotate-15 shadow" />
          <span className="w-6.5 h-3.5 bg-gradient-to-l from-white via-amber-400 to-red-700 rounded-r border-r-2 border-yellow-200 shadow-xl -my-0.5" />
          <span className="w-4 h-2 bg-gradient-to-l from-yellow-300 to-orange-600 rounded-r transform -rotate-15 shadow" />
        </div>

        {/* Корпус рамки */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-950 via-zinc-950 to-orange-950 border-2 border-amber-400 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 border border-orange-400/60 rounded-xl" />
        </div>

        {/* Асимметричный угол (Top-Right): Монументальная каменная голова жабы Гамабунты с трубкой */}
        <div className="absolute -top-3.5 -right-2 z-30 pointer-events-none flex items-center justify-center filter drop-shadow-[0_0_10px_#f59e0b]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-300 via-amber-600 to-zinc-950 border-2 border-yellow-200 flex items-center justify-center text-sm shadow-xl">
            🐸
          </div>
        </div>

        {/* Верхняя золотая плашка: Кандзи 『油』 (Масло Мёбоку) */}
        <div className="absolute -top-2.5 left-1/3 -translate-x-1/2 z-20 flex items-center justify-center filter drop-shadow-[0_0_10px_#f59e0b] pointer-events-none">
          <div className="px-2.5 py-0.5 rounded-lg bg-gradient-to-b from-yellow-300 via-amber-600 to-zinc-950 border-2 border-yellow-200 text-[10px] font-black text-black font-serif tracking-widest shadow-xl">
            油
          </div>
        </div>

        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // =========================================================================
  // 7. СУСАНОО (Legendary Astral - MLBB Style)
  // Рогатый шлем Сусаноо + наплечники реберного доспеха + картуш 『覇』
  // =========================================================================
  {
    id: 'frame_susanoo',
    name: 'Астральная Броня Сусаноо',
    tier: 7,
    rarity: 'Легендарная (Legendary)',
    rarityColor: '#a855f7',
    requirementText: '30 техник в боевом арсенале + 30 побед',
    checkUnlocked: (p) => ((p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 30) && ((p?.selectedJutsuIds?.length || 0) >= 30),
    progressText: (p) => `${Math.min(30, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)}/30 побед, ${Math.min(30, p?.selectedJutsuIds?.length || 0)}/30 техник`,
    badge: '⚔️ Сусаноо',
    borderClass: 'border-purple-400',
    glowClass: 'shadow-2xl shadow-purple-600/70',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group overflow-visible`}>
        {/* Астральный фиолетовый ореол Сусаноо */}
        <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 blur-xl opacity-90 animate-pulse pointer-events-none" />

        {/* Массивные астральные наплечники Сусаноо (MLBB Susanoo Pauldron Wings) */}
        <div className="absolute -left-4.5 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none filter drop-shadow-[0_0_12px_#a855f7]">
          <span className="w-4 h-2 bg-gradient-to-r from-purple-300 via-fuchsia-400 to-purple-800 rounded-l transform -rotate-20 shadow" />
          <span className="w-7 h-4 bg-gradient-to-r from-white via-purple-500 to-indigo-950 rounded-l border-l-2 border-purple-200 shadow-xl -my-0.5" />
          <span className="w-4 h-2 bg-gradient-to-r from-purple-300 via-fuchsia-400 to-purple-800 rounded-l transform rotate-20 shadow" />
        </div>
        <div className="absolute -right-4.5 top-1/2 -translate-y-1/2 flex flex-col items-start pointer-events-none filter drop-shadow-[0_0_12px_#a855f7]">
          <span className="w-4 h-2 bg-gradient-to-l from-purple-300 via-fuchsia-400 to-purple-800 rounded-r transform rotate-20 shadow" />
          <span className="w-7 h-4 bg-gradient-to-l from-white via-purple-500 to-indigo-950 rounded-r border-r-2 border-purple-200 shadow-xl -my-0.5" />
          <span className="w-4 h-2 bg-gradient-to-l from-purple-300 via-fuchsia-400 to-purple-800 rounded-r transform -rotate-20 shadow" />
        </div>

        {/* Корпус рамки */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-950 via-black to-indigo-950 border-2 border-purple-400 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 border border-purple-300/60 rounded-xl" />
        </div>

        {/* Навершие: Скульптурный шлем Сусаноо с золотым картушем 『覇』 */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center filter drop-shadow-[0_0_12px_#c084fc] pointer-events-none">
          <div className="px-3 py-0.5 rounded-lg bg-gradient-to-b from-purple-300 via-purple-700 to-zinc-950 border-2 border-purple-200 text-[11px] font-black text-white font-serif tracking-widest shadow-2xl">
            覇
          </div>
        </div>

        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // =========================================================================
  // 8. РЕЖИМ МУДРЕЦА (Legendary Sage - MLBB Style)
  // Драконьи рога пещеры Рьючи + жабьи тени глаз + свиток Сендзюцу + картуш 『仙』
  // =========================================================================
  {
    id: 'frame_sage',
    name: 'Природная Чакра Мудреца',
    tier: 8,
    rarity: 'Легендарная (Legendary)',
    rarityColor: '#10b981',
    requirementText: '40 побед в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 40,
    progressText: (p) => `${Math.min(40, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 40 побед`,
    badge: '🌿 Сеннин',
    borderClass: 'border-emerald-400',
    glowClass: 'shadow-2xl shadow-emerald-500/60',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group overflow-visible`}>
        {/* Изумрудно-нефритовый природный бриз */}
        <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-green-600 blur-xl opacity-90 animate-pulse pointer-events-none" />

        {/* Нефритовые крылья ветра дракона (MLBB Sage Jade Wings) */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none filter drop-shadow-[0_0_10px_#10b981]">
          <span className="w-4 h-2 bg-gradient-to-r from-emerald-300 to-teal-700 rounded-l transform -rotate-15" />
          <span className="w-6.5 h-3.5 bg-gradient-to-r from-white via-emerald-400 to-green-950 rounded-l border-l-2 border-emerald-200 shadow-md -my-0.5" />
          <span className="w-4 h-2 bg-gradient-to-r from-emerald-300 to-teal-700 rounded-l transform rotate-15" />
        </div>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col items-start pointer-events-none filter drop-shadow-[0_0_10px_#10b981]">
          <span className="w-4 h-2 bg-gradient-to-l from-emerald-300 to-teal-700 rounded-r transform rotate-15" />
          <span className="w-6.5 h-3.5 bg-gradient-to-l from-white via-emerald-400 to-green-950 rounded-r border-r-2 border-emerald-200 shadow-md -my-0.5" />
          <span className="w-4 h-2 bg-gradient-to-l from-emerald-300 to-teal-700 rounded-r transform -rotate-15" />
        </div>

        {/* Корпус рамки */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-950 via-zinc-950 to-teal-950 border-2 border-emerald-400 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 border border-teal-300/60 rounded-xl" />
          {/* Оранжевые жабьи тени глаз Мудреца */}
          <span className="absolute top-2 left-0.5 w-1.5 h-4 bg-orange-500 rounded-full shadow-[0_0_8px_#ea580c]" />
          <span className="absolute top-2 right-0.5 w-1.5 h-4 bg-orange-500 rounded-full shadow-[0_0_8px_#ea580c]" />
        </div>

        {/* Навершие: Золотой картуш Мудреца 『仙』 */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center filter drop-shadow-[0_0_10px_#f97316] pointer-events-none">
          <div className="px-3 py-0.5 rounded-lg bg-gradient-to-b from-orange-300 via-amber-600 to-zinc-950 border-2 border-yellow-200 text-[10px] font-black text-black font-serif tracking-widest shadow-xl">
            仙
          </div>
        </div>

        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // =========================================================================
  // 9. СФЕРА РИННЕГАНА (Mythic Six Paths - MLBB Style)
  // Обсидиановые штыри чакры Шести Путей + кольца гравитации + картуш 『六道』
  // =========================================================================
  {
    id: 'frame_rinnegan',
    name: 'Сфера Шести Путей (Риннеган)',
    tier: 9,
    rarity: 'Мифическая (Mythic)',
    rarityColor: '#c084fc',
    requirementText: '60 побед в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 60,
    progressText: (p) => `${Math.min(60, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 60 побед`,
    badge: '🌀 Риннеган',
    borderClass: 'border-purple-400',
    glowClass: 'shadow-2xl shadow-indigo-500/70',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group overflow-visible`}>
        {/* Гравитационная волна Синра Тэнсэй */}
        <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-500 blur-xl opacity-90 animate-pulse pointer-events-none" />

        {/* Штыри чакры Шести Путей (MLBB Mythic Six Paths Spires) */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none filter drop-shadow-[0_0_10px_#c084fc]">
          <span className="w-3.5 h-1.5 bg-black border border-purple-400 rounded-l" />
          <span className="w-6 h-2.5 bg-gradient-to-r from-purple-300 via-black to-zinc-950 rounded-l border-l-2 border-purple-300 shadow -my-0.5" />
          <span className="w-3.5 h-1.5 bg-black border border-purple-400 rounded-l" />
        </div>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col items-start pointer-events-none filter drop-shadow-[0_0_10px_#c084fc]">
          <span className="w-3.5 h-1.5 bg-black border border-purple-400 rounded-r" />
          <span className="w-6 h-2.5 bg-gradient-to-l from-purple-300 via-black to-zinc-950 rounded-r border-r-2 border-purple-300 shadow -my-0.5" />
          <span className="w-3.5 h-1.5 bg-black border border-purple-400 rounded-r" />
        </div>

        {/* Корпус рамки с кольцами Риннегана */}
        <div className="absolute inset-0 rounded-2xl bg-black border-2 border-purple-400 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 rounded-xl border border-purple-400/60" />
          <div className="absolute inset-2 rounded-lg border border-purple-300/40" />
          <div className="absolute inset-3 rounded-md border border-purple-200/20" />
          <span className="absolute -top-1 -right-1 text-[11px] animate-spin" style={{ animationDuration: '6s' }}>🌀</span>
        </div>

        {/* Нижний пьедестал: Кандзи 『六道』 (Шесть Путей) */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center filter drop-shadow-[0_0_12px_#a855f7] pointer-events-none">
          <div className="px-3 py-0.5 rounded-lg bg-gradient-to-b from-purple-400 via-indigo-800 to-black border border-purple-300 text-[10px] font-black text-purple-100 font-serif tracking-widest shadow-2xl">
            六道
          </div>
        </div>

        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // =========================================================================
  // 10. ХОКАГЕ (Mythic Immortal / Glory - MLBB Style)
  // Скульптурная красно-белая шляпа Хокаге + золотые крылья огненного дракона + пламя
  // =========================================================================
  {
    id: 'frame_hokage',
    name: 'Рубиновый Венец Хокаге',
    tier: 10,
    rarity: 'Мифическая (Mythic Immortal)',
    rarityColor: '#ef4444',
    requirementText: '100 побед в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 100,
    progressText: (p) => `${Math.min(100, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 100 побед`,
    badge: '🔥 Хокаге',
    borderClass: 'border-red-500',
    glowClass: 'shadow-2xl shadow-red-500/80',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group overflow-visible`}>
        {/* Алое пламя Воли Огня */}
        <div className="absolute -inset-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-rose-600 blur-xl opacity-90 animate-pulse pointer-events-none" />

        {/* Императорские золотые крылья огненного дракона (MLBB Mythic Glory Dragon Wings) */}
        <div className="absolute -left-4.5 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none filter drop-shadow-[0_0_12px_#ef4444]">
          <span className="w-4 h-2 bg-gradient-to-r from-yellow-300 to-red-600 rounded-l transform -rotate-15 shadow" />
          <span className="w-7 h-4 bg-gradient-to-r from-white via-yellow-400 to-red-700 rounded-l border-l-2 border-yellow-200 shadow-xl -my-0.5" />
          <span className="w-4 h-2 bg-gradient-to-r from-yellow-300 to-red-600 rounded-l transform rotate-15 shadow" />
        </div>
        <div className="absolute -right-4.5 top-1/2 -translate-y-1/2 flex flex-col items-start pointer-events-none filter drop-shadow-[0_0_12px_#ef4444]">
          <span className="w-4 h-2 bg-gradient-to-l from-yellow-300 to-red-600 rounded-r transform rotate-15 shadow" />
          <span className="w-7 h-4 bg-gradient-to-l from-white via-yellow-400 to-red-700 rounded-r border-r-2 border-yellow-200 shadow-xl -my-0.5" />
          <span className="w-4 h-2 bg-gradient-to-l from-yellow-300 to-red-600 rounded-r transform -rotate-15 shadow" />
        </div>

        {/* Корпус рамки */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-950 via-zinc-950 to-amber-950 border-2 border-red-500 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 border-2 border-amber-400/90 rounded-xl" />
          {/* Белые языки пламени хаори Хокаге снизу */}
          <div className="absolute bottom-0 inset-x-2 h-3 bg-gradient-to-t from-white/95 to-transparent rounded-t opacity-95" />
        </div>

        {/* Навершие (вынос 30%): Скульптурная церемониальная шляпа Хокаге с кандзи 『火』 */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center filter drop-shadow-[0_0_14px_#ef4444] pointer-events-none">
          <div className="w-10 h-6 bg-gradient-to-b from-red-600 via-rose-700 to-zinc-950 border-2 border-yellow-300 rounded-t-full shadow-2xl flex items-center justify-center relative">
            <span className="text-[11px] font-black text-yellow-200 font-serif">火</span>
            {/* Белые поля шляпы */}
            <span className="absolute -bottom-1 inset-x-[-4px] h-1.5 bg-white rounded-full border border-red-800" />
          </div>
        </div>

        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // =========================================================================
  // 11. ЭКСКЛЮЗИВ: ВЕНЕЦ ТВОРЦА (GENESIS CREATOR) — ТОЛЬКО ДЛЯ КИРИЛЛА!
  // (Supreme God / All-Star Collector Tier - MLBB Ultimate Masterpiece)
  // Императорские 5-ярусные золотые крылья + корона Творца с рубинами + 6 сфер Гудодама
  // =========================================================================
  {
    id: 'frame_creator_genesis',
    name: '👑 Венец Творца (Genesis Creator)',
    tier: 99,
    rarity: 'Божественная (Создатель)',
    rarityColor: '#facc15',
    isCreatorExclusive: true,
    requirementText: 'Священный артефакт Создателя игры (Кирилл)',
    checkUnlocked: (p) => isDeveloperAccount(p?.email),
    progressText: (p) => isDeveloperAccount(p?.email) ? '👑 Создатель игры подтверждён' : '🔒 Эксклюзив Создателя игры',
    badge: '👑 Творец',
    borderClass: 'border-yellow-400',
    glowClass: 'shadow-[0_0_40px_rgba(250,204,21,0.9)]',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group overflow-visible`}>
        {/* Радужно-призматический космический ореол Творца */}
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-amber-400 via-fuchsia-500 to-cyan-400 blur-2xl opacity-90 animate-pulse pointer-events-none" />

        {/* Императорские Божественные Золотые Крылья (MLBB Supreme Celestial Dragon Wings, вынос 30px) */}
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none filter drop-shadow-[0_0_14px_#fde047]">
          <span className="w-5 h-2 bg-gradient-to-r from-yellow-200 to-amber-600 rounded-l transform -rotate-25 shadow" />
          <span className="w-7 h-3 bg-gradient-to-r from-white via-yellow-300 to-amber-700 rounded-l border-l-2 border-white shadow-lg -my-0.5" />
          <span className="w-9 h-4 bg-gradient-to-r from-cyan-200 via-yellow-400 to-amber-900 rounded-l border-l-2 border-yellow-200 shadow-2xl -my-0.5" />
          <span className="w-7 h-3 bg-gradient-to-r from-white via-yellow-300 to-amber-700 rounded-l border-l-2 border-white shadow-lg -my-0.5" />
          <span className="w-5 h-2 bg-gradient-to-r from-yellow-200 to-amber-600 rounded-l transform rotate-25 shadow" />
        </div>
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col items-start pointer-events-none filter drop-shadow-[0_0_14px_#fde047]">
          <span className="w-5 h-2 bg-gradient-to-l from-yellow-200 to-amber-600 rounded-r transform rotate-25 shadow" />
          <span className="w-7 h-3 bg-gradient-to-l from-white via-yellow-300 to-amber-700 rounded-r border-r-2 border-white shadow-lg -my-0.5" />
          <span className="w-9 h-4 bg-gradient-to-l from-cyan-200 via-yellow-400 to-amber-900 rounded-r border-r-2 border-yellow-200 shadow-2xl -my-0.5" />
          <span className="w-7 h-3 bg-gradient-to-l from-white via-yellow-300 to-amber-700 rounded-r border-r-2 border-white shadow-lg -my-0.5" />
          <span className="w-5 h-2 bg-gradient-to-l from-yellow-200 to-amber-600 rounded-r transform -rotate-25 shadow" />
        </div>

        {/* Парящая императорская золотая корона над рамкой с рубинами */}
        <div className="absolute -top-6 z-30 flex items-center justify-center filter drop-shadow-[0_0_16px_#fde047] pointer-events-none">
          <span className="text-2xl sm:text-3xl transform hover:scale-125 transition-transform animate-bounce">👑</span>
        </div>

        {/* 6 Сфер Гудодама по орбите с золотыми ореолами */}
        <span className="absolute -top-2 -left-2 w-3.5 h-3.5 rounded-full bg-black border border-amber-300 shadow-[0_0_14px_#fde047] z-20 animate-pulse pointer-events-none" />
        <span className="absolute -top-2 -right-2 w-3.5 h-3.5 rounded-full bg-black border border-amber-300 shadow-[0_0_14px_#fde047] z-20 animate-pulse pointer-events-none" />
        <span className="absolute top-1/2 -left-3 -translate-y-1/2 w-3 h-3 rounded-full bg-black border border-cyan-400 shadow-[0_0_12px_#38bdf8] z-20 pointer-events-none" />
        <span className="absolute top-1/2 -right-3 -translate-y-1/2 w-3 h-3 rounded-full bg-black border border-cyan-400 shadow-[0_0_12px_#38bdf8] z-20 pointer-events-none" />
        <span className="absolute -bottom-2 -left-2 w-3.5 h-3.5 rounded-full bg-black border border-amber-300 shadow-[0_0_14px_#fde047] z-20 animate-pulse pointer-events-none" />
        <span className="absolute -bottom-2 -right-2 w-3.5 h-3.5 rounded-full bg-black border border-amber-300 shadow-[0_0_14px_#fde047] z-20 animate-pulse pointer-events-none" />

        {/* Золотая ограненная рамка с сакральной гравировкой */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-950 via-zinc-950 to-purple-950 border-2 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.9)] overflow-hidden">
          <div className="absolute inset-1 rounded-xl border border-cyan-400/80" />
          <div className="absolute inset-1.5 rounded-lg border border-fuchsia-400/70" />
        </div>

        {/* Золотой императорский постамент с кандзи 『創世』 */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center filter drop-shadow-[0_0_14px_#facc15] pointer-events-none">
          <div className="px-3.5 py-0.5 rounded-lg bg-gradient-to-b from-yellow-300 via-amber-600 to-zinc-950 border-2 border-yellow-200 text-[10px] font-black tracking-widest text-black font-serif shadow-2xl">
            創世
          </div>
        </div>

        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  }
];

export function getPlayerFrameById(frameId, userProfile = null) {
  const isDev = isDeveloperAccount(userProfile?.email);
  if (frameId === 'frame_creator_genesis' && !isDev) {
    return PLAYER_FRAMES[0];
  }
  const found = PLAYER_FRAMES.find(f => f.id === frameId);
  return found || PLAYER_FRAMES[0];
}
