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
    name: 'Дерево Академии Листа',
    tier: 1,
    rarity: 'Обычная',
    rarityColor: '#94a3b8',
    requirementText: 'Доступна всем новобранцам Конохи',
    checkUnlocked: () => true,
    progressText: () => 'Разблокировано',
    badge: '🍃 Академия',
    borderClass: 'border-emerald-600/70',
    glowClass: 'shadow-md shadow-emerald-900/30',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group`}>
        {/* Древесный контур с мягким зелёным свечением листа */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-emerald-600/20 via-amber-700/20 to-transparent blur-sm opacity-80" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-950 via-zinc-950 to-emerald-950 border-2 border-emerald-600/60 shadow-lg shadow-black/60 overflow-hidden">
          <div className="absolute inset-0.5 border border-amber-600/40 rounded-xl" />
          {/* Зеленый священный лист Конохи в изголовье */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] filter drop-shadow">🍃</div>
          {/* 4 заклепки из кованой бронзы */}
          <span className="absolute top-1 left-1 w-1 h-1 rounded-full bg-amber-500/80 shadow" />
          <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-amber-500/80 shadow" />
          <span className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-amber-500/80 shadow" />
          <span className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-amber-500/80 shadow" />
        </div>
        <div className="relative z-10 w-full h-full p-1.5 flex items-center justify-center overflow-hidden rounded-xl">
          {avatarContent}
        </div>
        {extraBadge}
      </div>
    )
  },

  // 2. ГЕНИН (3 победы)
  {
    id: 'frame_genin',
    name: 'Сталь Протектора Генина',
    tier: 2,
    rarity: 'Редкая',
    rarityColor: '#38bdf8',
    requirementText: '3 победы в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 3,
    progressText: (p) => `${Math.min(3, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 3 побед`,
    badge: '⚡ Генин',
    borderClass: 'border-sky-400',
    glowClass: 'shadow-lg shadow-sky-500/25',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group`}>
        {/* Лазурный неоновый ореол чакры */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-500/30 via-cyan-400/20 to-blue-600/30 blur-sm opacity-90 animate-pulse" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-900 via-zinc-950 to-sky-950 border-2 border-sky-400 shadow-xl overflow-hidden">
          <div className="absolute inset-0.5 border border-sky-300/40 rounded-xl" />
          {/* Стальной налобный протектор с гравировкой спирали */}
          <div className="absolute top-0 inset-x-2 h-1.5 bg-gradient-to-r from-slate-400 via-white to-slate-400 rounded-b shadow-sm opacity-70" />
          {/* 4 стальных шестигранных болта */}
          <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-600 shadow-inner" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-600 shadow-inner" />
          <span className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-600 shadow-inner" />
          <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-600 shadow-inner" />
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
    badge: '📜 Чунин',
    borderClass: 'border-amber-500',
    glowClass: 'shadow-lg shadow-amber-500/30',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group`}>
        {/* Янтарно-бронзовый ореол */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-600/30 via-orange-500/20 to-yellow-600/30 blur-sm opacity-90" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-950 via-zinc-950 to-orange-950 border-2 border-amber-500 shadow-xl overflow-hidden">
          <div className="absolute inset-1 border border-yellow-400/50 rounded-xl" />
          {/* Рельефный знак ниндзя 『忍』 */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] font-black text-amber-300 font-serif filter drop-shadow-[0_0_4px_#f59e0b]">
            忍
          </div>
          {/* Тактические уголки */}
          <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400 rounded-tl-xl" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400 rounded-tr-xl" />
          <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400 rounded-bl-xl" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400 rounded-br-xl" />
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
    badge: '🌪️ Джонин',
    borderClass: 'border-indigo-400',
    glowClass: 'shadow-xl shadow-indigo-500/35',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group`}>
        {/* Сапфирово-платиновый сияющий контур */}
        <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-indigo-500/40 via-sky-400/30 to-purple-500/40 blur-md opacity-90 animate-pulse" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-950 via-zinc-950 to-slate-900 border-2 border-indigo-400 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 border border-indigo-300/50 rounded-xl" />
          {/* Сюрикен и вихревой гравированный уголок */}
          <div className="absolute -top-1 right-0 text-[10px] filter drop-shadow-[0_0_4px_#818cf8]">✦</div>
          <div className="absolute -bottom-1 left-0 text-[10px] filter drop-shadow-[0_0_4px_#818cf8]">✦</div>
          {/* Платиновые фаски */}
          <div className="absolute top-0 inset-x-3 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
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
    name: 'Маска Тайных Операций АНБУ',
    tier: 5,
    rarity: 'Эпическая',
    rarityColor: '#f43f5e',
    requirementText: '50 побед в PvP дуэлях',
    checkUnlocked: (p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 50,
    progressText: (p) => `${Math.min(50, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 50 побед`,
    badge: '🎭 АНБУ',
    borderClass: 'border-rose-500',
    glowClass: 'shadow-xl shadow-rose-600/40',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group`}>
        {/* Кроваво-алый теневой дым */}
        <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-rose-600/40 via-red-500/30 to-rose-700/40 blur-md opacity-90 animate-pulse" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zinc-950 via-rose-950/40 to-black border-2 border-rose-500 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 border border-rose-400/50 rounded-xl" />
          {/* Маска Лиса с ритуальной киноварью */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 filter drop-shadow-[0_0_6px_#f43f5e]">
            <span className="text-[10px]">🦊</span>
          </div>
          {/* Боковые церемониальные алые полосы */}
          <span className="absolute top-3 left-0 w-1 h-3 bg-rose-500 rounded-r shadow-[0_0_4px_#f43f5e]" />
          <span className="absolute top-3 right-0 w-1 h-3 bg-rose-500 rounded-l shadow-[0_0_4px_#f43f5e]" />
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
    badge: '🐸 Саннин',
    borderClass: 'border-amber-400',
    glowClass: 'shadow-2xl shadow-amber-500/50',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group`}>
        {/* Бушующее пламя Мёбоку */}
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 blur-lg opacity-80 animate-pulse" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-950 via-zinc-950 to-orange-950 border-2 border-amber-400 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 border border-orange-400/60 rounded-xl" />
          {/* Кандзи 『油』 (Масло Мёбоку) */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] font-black text-amber-200 font-serif px-1 rounded bg-black/60 border border-amber-500/40">
            油
          </div>
          <span className="absolute -top-1 -right-1 text-[11px] animate-bounce">🔥</span>
          <span className="absolute -bottom-1 -left-1 text-[11px]">🐸</span>
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
    name: 'Астральная Броня Сусаноо',
    tier: 7,
    rarity: 'Легендарная',
    rarityColor: '#a855f7',
    requirementText: '30 техник в боевом арсенале + 30 побед',
    checkUnlocked: (p) => ((p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 30) && ((p?.selectedJutsuIds?.length || 0) >= 30),
    progressText: (p) => `${Math.min(30, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)}/30 побед, ${Math.min(30, p?.selectedJutsuIds?.length || 0)}/30 техник`,
    badge: '⚔️ Сусаноо',
    borderClass: 'border-purple-400',
    glowClass: 'shadow-2xl shadow-purple-600/50',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group`}>
        {/* Астральный фиолетовый призматический ореол Сусаноо */}
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 blur-lg opacity-85 animate-pulse" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-950 via-black to-indigo-950 border-2 border-purple-400 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 border border-purple-300/60 rounded-xl" />
          {/* Рельефные клыки Сусаноо */}
          <div className="absolute top-0 inset-x-2 flex justify-between text-[8px] text-purple-300 opacity-90">
            <span>▼</span>
            <span>▼</span>
          </div>
          <span className="absolute -bottom-1 -left-1 text-[10px] filter drop-shadow-[0_0_4px_#c084fc]">⚡</span>
          <span className="absolute -bottom-1 -right-1 text-[10px] filter drop-shadow-[0_0_4px_#c084fc]">⚔️</span>
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
    badge: '🌿 Сеннин',
    borderClass: 'border-emerald-400',
    glowClass: 'shadow-2xl shadow-emerald-500/40',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group`}>
        {/* Изумрудно-нефритовый природный бриз */}
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-green-600 blur-lg opacity-80 animate-pulse" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-950 via-zinc-950 to-teal-950 border-2 border-emerald-400 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 border border-teal-300/60 rounded-xl" />
          {/* Золотой кандзи 『仙』 (Сеннин / Мудрец) */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] font-black text-orange-400 font-serif px-1 rounded bg-black/70 border border-orange-400/50 filter drop-shadow-[0_0_6px_#f97316]">
            仙
          </div>
          {/* Оранжевые жабьи тени глаз Мудреца */}
          <span className="absolute top-2 left-0.5 w-1 h-3 bg-orange-500 rounded-full shadow-[0_0_4px_#ea580c]" />
          <span className="absolute top-2 right-0.5 w-1 h-3 bg-orange-500 rounded-full shadow-[0_0_4px_#ea580c]" />
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
    badge: '🌀 Риннеган',
    borderClass: 'border-purple-400',
    glowClass: 'shadow-2xl shadow-indigo-500/50',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group`}>
        {/* Гравитационная волна Синра Тэнсэй */}
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-500 blur-lg opacity-85 animate-pulse" />
        <div className="absolute inset-0 rounded-2xl bg-black border-2 border-purple-400 shadow-2xl overflow-hidden">
          {/* Концентрические кольца Риннегана */}
          <div className="absolute inset-1 rounded-xl border border-purple-400/50" />
          <div className="absolute inset-2 rounded-lg border border-purple-300/30" />
          <div className="absolute inset-3 rounded-md border border-purple-200/20" />
          {/* Чёрные штыри чакры Шести Путей по краям */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-1 bg-zinc-950 border border-purple-400 rounded" />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-1 bg-zinc-950 border border-purple-400 rounded" />
          <span className="absolute -top-1 -right-1 text-[11px] animate-spin" style={{ animationDuration: '6s' }}>🌀</span>
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
    badge: '🔥 Хокаге',
    borderClass: 'border-red-500',
    glowClass: 'shadow-2xl shadow-red-500/60',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group`}>
        {/* Алое пламя Воли Огня */}
        <div className="absolute -inset-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-rose-600 blur-xl opacity-90 animate-pulse" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-950 via-zinc-950 to-amber-950 border-2 border-red-500 shadow-2xl overflow-hidden">
          <div className="absolute inset-1 border-2 border-amber-400/90 rounded-xl" />
          {/* Пылающий кандзи 『火』 (Огонь Хокаге) */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-xs font-black text-amber-300 font-serif px-1.5 rounded-md bg-black/80 border border-amber-400 shadow-lg filter drop-shadow-[0_0_8px_#ef4444]">
            火
          </div>
          {/* Белые языки пламени хаори Хокаге снизу */}
          <div className="absolute bottom-0 inset-x-2 h-2 bg-gradient-to-t from-white/90 to-transparent rounded-t opacity-90" />
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
    badge: '👑 Творец',
    borderClass: 'border-yellow-400',
    glowClass: 'shadow-[0_0_35px_rgba(250,204,21,0.8)]',
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div className={`relative ${sizeClass} shrink-0 select-none flex items-center justify-center group`}>
        {/* Радужно-призматический ореол Творца (Prismatic Cosmic Shimmer) */}
        <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-amber-400 via-fuchsia-500 to-cyan-400 blur-xl opacity-90 animate-pulse" />
        
        {/* Парящая императорская золотая корона над рамкой */}
        <div className="absolute -top-4 z-30 flex items-center justify-center filter drop-shadow-[0_0_12px_#fde047]">
          <span className="text-lg sm:text-xl transform hover:scale-125 transition-transform animate-bounce">👑</span>
        </div>

        {/* 6 Сфер Гудодама по орбите с золотыми ореолами */}
        <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-black border border-amber-400 shadow-[0_0_10px_#fde047] z-20 animate-pulse" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-black border border-amber-400 shadow-[0_0_10px_#fde047] z-20 animate-pulse" />
        <span className="absolute top-1/2 -left-2 -translate-y-1/2 w-2 h-2 rounded-full bg-black border border-cyan-400 shadow-[0_0_8px_#38bdf8] z-20" />
        <span className="absolute top-1/2 -right-2 -translate-y-1/2 w-2 h-2 rounded-full bg-black border border-cyan-400 shadow-[0_0_8px_#38bdf8] z-20" />
        <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full bg-black border border-amber-400 shadow-[0_0_10px_#fde047] z-20 animate-pulse" />
        <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-black border border-amber-400 shadow-[0_0_10px_#fde047] z-20 animate-pulse" />

        {/* Золотая ограненная рамка с сакральной гравировкой */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-950 via-zinc-950 to-purple-950 border-2 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.7)] overflow-hidden">
          <div className="absolute inset-1 rounded-xl border border-cyan-400/60" />
          <div className="absolute inset-1.5 rounded-lg border border-fuchsia-400/50" />
          {/* Золотые кандзи 『創世』 внизу */}
          <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] font-black tracking-widest text-yellow-300 font-serif px-1.5 rounded bg-black/90 border border-yellow-400/60 z-20">
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
    // Если игрок не разработчик, но у него сохранен этот frameId, сбрасываем на academy
    return PLAYER_FRAMES[0];
  }
  const found = PLAYER_FRAMES.find(f => f.id === frameId);
  return found || PLAYER_FRAMES[0];
}
