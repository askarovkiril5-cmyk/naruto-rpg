import React from 'react';

/**
 * playerFramesData.jsx
 * Каталог аватарок и система наградных рамок за боевые достижения (Achievement Frames).
 * Поддерживает кастомную загрузку пользовательских картинок (Custom Avatar Image Upload).
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
  // 1. АКАДЕМИЯ (По умолчанию)
  {
    id: 'frame_academy',
    name: 'Дерево Академии',
    tier: 1,
    rarity: 'Обычная',
    rarityColor: '#94a3b8',
    requirementText: 'Доступна всем новобранцам Конохи',
    checkUnlocked: () => true,
    progressText: () => 'Разблокировано',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center`}>
        <div className="absolute inset-0 rounded-2xl bg-amber-950/40 border-2 border-amber-800/80 shadow-md overflow-hidden">
          <div className="absolute inset-0 border border-amber-600/30 rounded-xl" />
        </div>
        <div className="relative z-10 w-full h-full p-1 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // 2. ГЕНИН (3 победы)
  {
    id: 'frame_genin',
    name: 'Сталь Генина',
    tier: 2,
    rarity: 'Редкая',
    rarityColor: '#38bdf8',
    requirementText: '3 победы в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 3,
    progressText: (p) => `${Math.min(3, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 3 побед`,
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center`}>
        <div className="absolute inset-0 rounded-2xl bg-slate-900 border-2 border-slate-400 shadow-lg shadow-sky-500/10 overflow-hidden">
          <div className="absolute inset-0.5 border border-sky-400/40 rounded-xl" />
          {/* 4 стальные заклепки */}
          <span className="absolute top-1 left-1 w-1 h-1 rounded-full bg-slate-300 shadow-sm" />
          <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-slate-300 shadow-sm" />
          <span className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-slate-300 shadow-sm" />
          <span className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-slate-300 shadow-sm" />
        </div>
        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // 3. ЧУНИН (10 побед)
  {
    id: 'frame_chunin',
    name: 'Чеканная Бронза Чунина',
    tier: 3,
    rarity: 'Редкая',
    rarityColor: '#fb923c',
    requirementText: '10 побед в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 10,
    progressText: (p) => `${Math.min(10, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 10 побед`,
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center`}>
        <div className="absolute inset-0 rounded-2xl bg-amber-950/70 border-2 border-amber-600 shadow-lg shadow-amber-600/20 overflow-hidden">
          <div className="absolute inset-1 border border-yellow-500/50 rounded-xl" />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] text-amber-300 font-mono">忍</div>
        </div>
        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // 4. ДЖОНИН (25 побед)
  {
    id: 'frame_jonin',
    name: 'Серебряный Вихрь Джонина',
    tier: 4,
    rarity: 'Эпическая',
    rarityColor: '#818cf8',
    requirementText: '25 побед в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 25,
    progressText: (p) => `${Math.min(25, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 25 побед`,
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center`}>
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-slate-400 via-indigo-400 to-white opacity-80 blur-[2px]" />
        <div className="absolute inset-0 rounded-2xl bg-indigo-950/80 border-2 border-indigo-400 shadow-xl shadow-indigo-500/30 overflow-hidden">
          <div className="absolute inset-0.5 border border-white/40 rounded-xl" />
          <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-500/30 rotate-45 transform origin-top-right border-l border-b border-indigo-300" />
        </div>
        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // 5. АНБУ (50 побед)
  {
    id: 'frame_anbu',
    name: 'Золотая Маска АНБУ',
    tier: 5,
    rarity: 'Эпическая',
    rarityColor: '#f43f5e',
    requirementText: '50 побед в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 50,
    progressText: (p) => `${Math.min(50, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 50 побед`,
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center`}>
        <div className="absolute -inset-1 rounded-2xl bg-rose-500/30 blur-md animate-pulse" />
        <div className="absolute inset-0 rounded-2xl bg-zinc-950 border-2 border-rose-500 shadow-xl shadow-rose-500/40 overflow-hidden">
          <div className="absolute inset-1 border border-amber-400/60 rounded-xl" />
          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[9px]">🦊</div>
        </div>
        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // 6. САННИН (75 побед)
  {
    id: 'frame_sannin',
    name: 'Пламя Легендарного Саннина',
    tier: 6,
    rarity: 'Легендарная',
    rarityColor: '#f59e0b',
    requirementText: '75 побед в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 75,
    progressText: (p) => `${Math.min(75, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 75 побед`,
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center`}>
        <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 blur-md opacity-75 animate-pulse" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-950 via-zinc-950 to-orange-950 border-2 border-amber-400 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 border border-orange-400/60 rounded-xl" />
          <span className="absolute -top-1 -right-1 text-[10px]">🔥</span>
        </div>
        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // 7. СУСАНОО (30 дзюцу в арсенале + 30 побед)
  {
    id: 'frame_susanoo',
    name: 'Призрачное Сусаноо',
    tier: 7,
    rarity: 'Легендарная',
    rarityColor: '#a855f7',
    requirementText: '30 техник в боевом арсенале + 30 побед',
    checkUnlocked: (p) => ((p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 30) && ((p?.selectedJutsuIds?.length || 0) >= 30),
    progressText: (p) => `${Math.min(30, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)}/30 побед, ${Math.min(30, p?.selectedJutsuIds?.length || 0)}/30 техник`,
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center`}>
        <div className="absolute -inset-1.5 rounded-2xl bg-purple-600/50 blur-lg animate-pulse" />
        <div className="absolute inset-0 rounded-2xl bg-purple-950 border-2 border-purple-400 shadow-2xl shadow-purple-500/50 overflow-hidden">
          <div className="absolute inset-1 border border-purple-300/60 rounded-xl" />
          <span className="absolute -top-1 -left-1 text-[10px]">⚡</span>
          <span className="absolute -bottom-1 -right-1 text-[10px]">⚔️</span>
        </div>
        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // 8. РЕЖИМ МУДРЕЦА (40 побед)
  {
    id: 'frame_sage',
    name: 'Природная Чакра Мудреца',
    tier: 8,
    rarity: 'Легендарная',
    rarityColor: '#10b981',
    requirementText: '40 побед в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 40,
    progressText: (p) => `${Math.min(40, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 40 побед`,
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center`}>
        <div className="absolute -inset-1.5 rounded-2xl bg-emerald-500/40 blur-md animate-pulse" />
        <div className="absolute inset-0 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 shadow-xl shadow-emerald-500/30 overflow-hidden">
          <div className="absolute inset-1 border border-teal-300/50 rounded-xl" />
          <span className="absolute top-0 right-1 text-[9px] text-orange-400 font-black">仙</span>
        </div>
        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // 9. СФЕРА РИННЕГАНА (60 побед)
  {
    id: 'frame_rinnegan',
    name: 'Сфера Шести Путей (Риннеган)',
    tier: 9,
    rarity: 'Мифическая',
    rarityColor: '#c084fc',
    requirementText: '60 побед в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 60,
    progressText: (p) => `${Math.min(60, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 60 побед`,
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center`}>
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 blur-lg opacity-60 animate-pulse" />
        <div className="absolute inset-0 rounded-2xl bg-black border-2 border-purple-400 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 rounded-xl border border-purple-400/40" />
          <div className="absolute inset-2 rounded-lg border border-purple-300/20" />
          <span className="absolute -top-1 -right-1 text-[10px]">🌀</span>
        </div>
        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // 10. ХОКАГЕ (100 побед)
  {
    id: 'frame_hokage',
    name: 'Рубиновый Венец Хокаге',
    tier: 10,
    rarity: 'Мифическая',
    rarityColor: '#ef4444',
    requirementText: '100 побед в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 100,
    progressText: (p) => `${Math.min(100, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 100 побед`,
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center`}>
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-rose-600 blur-lg opacity-80 animate-pulse" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-950 via-zinc-950 to-amber-950 border-2 border-red-500 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 border-2 border-amber-400/80 rounded-xl" />
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-xs font-black text-amber-300 font-serif">火</span>
        </div>
        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // 11. ЭКСКЛЮЗИВ: ВЕНЕЦ ТВОРЦА (GENESIS CREATOR) — ТОЛЬКО ДЛЯ КИРИЛЛА!
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
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center`}>
        {/* Радужно-призматический ореол Творца */}
        <div className="absolute -inset-2.5 rounded-3xl bg-gradient-to-r from-amber-400 via-fuchsia-500 to-cyan-400 blur-xl opacity-85 animate-pulse" />
        
        {/* Парящая императорская золотая корона над рамкой */}
        <div className="absolute -top-3.5 z-30 flex items-center justify-center filter drop-shadow-[0_0_8px_#fde047]">
          <span className="text-base sm:text-lg animate-bounce">👑</span>
        </div>

        {/* 4 Сферы Гудодама по углам */}
        <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-black border border-amber-400 shadow-[0_0_8px_#000] z-20 animate-pulse" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-black border border-amber-400 shadow-[0_0_8px_#000] z-20 animate-pulse" />
        <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full bg-black border border-amber-400 shadow-[0_0_8px_#000] z-20 animate-pulse" />
        <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-black border border-amber-400 shadow-[0_0_8px_#000] z-20 animate-pulse" />

        {/* Золотая ограненная рамка с сакральной гравировкой */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-950 via-zinc-950 to-purple-950 border-2 border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.6)] overflow-hidden">
          <div className="absolute inset-1 rounded-xl border border-cyan-400/50" />
          <div className="absolute inset-1.5 rounded-lg border border-fuchsia-400/40" />
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
    // Если игрок не разработчик, но у него сохранен этот frameId, сбрасываем на academy
    return PLAYER_FRAMES[0];
  }
  const found = PLAYER_FRAMES.find(f => f.id === frameId);
  return found || PLAYER_FRAMES[0];
}
