const fs = require('fs');
const path = require('path');

// Генератор 11 наградных 3D SVG рамок высочайшего класса Mobile Legends: Bang Bang (MLBB Masterpiece Edition)
// Каждая рамка построена в расширенном viewBox="-30 -30 160 160", что позволяет
// скульптурным элементам (шляпам, рогам, маскам, крыльям, коронам) совершать
// беспрепятственный силуэтный вынос за пределы аватарки на 25-40%, создавая
// подлинный кинематографичный объем.

const FRAMES_DATA = [
  // 1. АКАДЕМИЯ (Wood & Brass Belt)
  {
    id: 'frame_academy',
    name: 'Дерево Академии Листа',
    tier: 1,
    rarity: 'Обычная (Warrior)',
    rarityColor: '#94a3b8',
    requirementText: 'Доступна всем новобранцам Конохи',
    checkUnlocked: '() => true',
    progressText: '() => "Разблокировано"',
    badge: '🍃 Академия',
    borderClass: 'border-emerald-600/70',
    glowClass: 'shadow-md shadow-emerald-900/30',
    prefix: 'fr_acad',
    defs: `
      <linearGradient id="fr_acad_wood" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#78350f" />
        <stop offset="50%" stopColor="#451a03" />
        <stop offset="100%" stopColor="#290e02" />
      </linearGradient>
      <linearGradient id="fr_acad_brass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
      <linearGradient id="fr_acad_leather" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9a3412" />
        <stop offset="50%" stopColor="#7c2d12" />
        <stop offset="100%" stopColor="#431407" />
      </linearGradient>
      <linearGradient id="fr_acad_jade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6ee7b7" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#064e3b" />
      </linearGradient>
      <filter id="fr_acad_shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.8" />
      </filter>
    `,
    bgSvg: `
      {/* Изумрудно-янтарный ореол чакры */}
      <rect x="-8" y="-8" width="116" height="116" rx="28" fill="none" stroke="#10b981" strokeWidth="4" opacity="0.3" filter="blur(6px)" />
    `,
    chassisSvg: `
      {/* Массивный деревянный резной каркас Хиноки */}
      <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#fr_acad_wood)" stroke="url(#fr_acad_brass)" strokeWidth="3" filter="url(#fr_acad_shadow)" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#10b981" strokeWidth="1.2" opacity="0.6" strokeDasharray="6 3" />
      
      {/* Литые латунные угловые скобы с заклепками */}
      <g fill="url(#fr_acad_brass)">
        <polygon points="4,4 18,4 18,8 8,8 8,18 4,18" />
        <circle cx="10" cy="10" r="1.5" fill="#fef08a" />
        <polygon points="96,4 82,4 82,8 92,8 92,18 96,18" />
        <circle cx="90" cy="10" r="1.5" fill="#fef08a" />
        <polygon points="4,96 18,96 18,92 8,92 8,82 4,82" />
        <circle cx="10" cy="90" r="1.5" fill="#fef08a" />
        <polygon points="96,96 82,96 82,92 92,92 92,82 96,82" />
        <circle cx="90" cy="90" r="1.5" fill="#fef08a" />
      </g>
    `,
    propsSvg: `
      {/* Топ-Правый угол: Светящийся Нефритовый Лист Конохи (вынос 20px) */}
      <g transform="translate(85, -12)" filter="drop-shadow(0 0 8px #10b981)">
        <path d="M 0,22 C 10,5 28,-2 32,-10 C 24,6 18,18 8,24 C 4,26 0,26 0,22 Z" fill="url(#fr_acad_jade)" stroke="#fef08a" strokeWidth="1.2" />
        <path d="M 2,-8 Q 12,8 6,20" stroke="#a7f3d0" strokeWidth="0.8" fill="none" />
        <circle cx="18" cy="2" r="2" fill="#ffffff" opacity="0.9" />
      </g>

      {/* Низ-Левый угол: Тактильный ремень шиноби с латунной пряжкой (вынос 15px) */}
      <g transform="translate(-16, 75)" filter="url(#fr_acad_shadow)">
        <path d="M 0,20 L 38,-4 L 46,6 L 8,30 Z" fill="url(#fr_acad_leather)" stroke="#290e02" strokeWidth="1" />
        <line x1="2" y1="21" x2="36" y2="-3" stroke="#f97316" strokeWidth="0.6" strokeDasharray="2 1" />
        <line x1="6" y1="28" x2="44" y2="4" stroke="#f97316" strokeWidth="0.6" strokeDasharray="2 1" />
        {/* Латунная пряжка */}
        <rect x="14" y="5" width="16" height="16" rx="3" fill="none" stroke="url(#fr_acad_brass)" strokeWidth="3" transform="rotate(-30 22 13)" />
        <rect x="20" y="7" width="4" height="12" fill="url(#fr_acad_brass)" transform="rotate(-30 22 13)" />
      </g>
    `
  },

  // 2. ГЕНИН (Steel Protector & Kunai Wings)
  {
    id: 'frame_genin',
    name: 'Сталь Протектора Генина',
    tier: 2,
    rarity: 'Редкая (Elite)',
    rarityColor: '#38bdf8',
    requirementText: '3 победы в PvP дуэлях',
    checkUnlocked: '(p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 3',
    progressText: '(p) => `${Math.min(3, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 3 побед`',
    badge: '⚡ Генин',
    borderClass: 'border-sky-400',
    glowClass: 'shadow-lg shadow-sky-500/35',
    prefix: 'fr_genin',
    defs: `
      <linearGradient id="fr_genin_steel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="25%" stopColor="#94a3b8" />
        <stop offset="60%" stopColor="#334155" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="fr_genin_cyan" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bae6fd" />
        <stop offset="50%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
      <filter id="fr_genin_glow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38bdf8" floodOpacity="0.8" />
      </filter>
    `,
    bgSvg: `
      {/* Лазурный контур энергии чакры */}
      <rect x="-10" y="-10" width="120" height="120" rx="30" fill="none" stroke="#0284c7" strokeWidth="4" opacity="0.4" filter="blur(8px)" />
    `,
    chassisSvg: `
      {/* Корпус из вороненого титана */}
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#090d16" stroke="url(#fr_genin_steel)" strokeWidth="3.5" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
    `,
    propsSvg: `
      {/* Левые тройные клинки-крылья куная (вынос 25px) */}
      <g transform="translate(-25, 25)" filter="url(#fr_genin_glow)">
        <polygon points="20,8 2,16 20,24 24,16" fill="url(#fr_genin_steel)" stroke="#e2e8f0" strokeWidth="1" />
        <polygon points="22,-2 0,6 22,14 26,6" fill="url(#fr_genin_steel)" stroke="#38bdf8" strokeWidth="1.2" />
        <polygon points="20,22 4,32 20,38 24,30" fill="url(#fr_genin_steel)" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="2" y1="6" x2="24" y2="6" stroke="#ffffff" strokeWidth="1.2" />
      </g>

      {/* Правые тройные клинки-крылья куная (вынос 25px) */}
      <g transform="translate(100, 25)" filter="url(#fr_genin_glow)">
        <polygon points="5,8 23,16 5,24 1,16" fill="url(#fr_genin_steel)" stroke="#e2e8f0" strokeWidth="1" />
        <polygon points="3,-2 25,6 3,14 -1,6" fill="url(#fr_genin_steel)" stroke="#38bdf8" strokeWidth="1.2" />
        <polygon points="5,22 21,32 5,38 1,30" fill="url(#fr_genin_steel)" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="3" y1="6" x2="25" y2="6" stroke="#ffffff" strokeWidth="1.2" />
      </g>

      {/* Верхнее навершие: Изогнутый стальной протектор Конохи с заклепками */}
      <g transform="translate(18, -14)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.9))">
        <rect x="0" y="0" width="64" height="20" rx="6" fill="url(#fr_genin_steel)" stroke="#e2e8f0" strokeWidth="1.5" />
        <circle cx="5" cy="10" r="2.2" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.8" />
        <circle cx="59" cy="10" r="2.2" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.8" />
        {/* Символ Листа */}
        <path d="M 28,12 C 29,8 34,6 38,7 C 36,11 31,14 27,13 C 25,12 24,8 27,6 C 31,4 37,5 40,9" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        <polygon points="38,7 41,5 40,8" fill="#0f172a" />
      </g>

      {/* Нижний пьедестал: Граненый лазурный кристалл в оправе */}
      <g transform="translate(38, 86)" filter="drop-shadow(0 0 10px #38bdf8)">
        <polygon points="12,0 24,10 12,20 0,10" fill="url(#fr_genin_cyan)" stroke="#ffffff" strokeWidth="1.4" />
        <polygon points="12,3 19,10 12,17 5,10" fill="#bae6fd" opacity="0.6" />
      </g>
    `
  },

  // 3. ЧУНИН (Tactical Armor & Gold Chevrons)
  {
    id: 'frame_chunin',
    name: 'Броня Жилета Чунина',
    tier: 3,
    rarity: 'Мастер (Master)',
    rarityColor: '#10b981',
    requirementText: '7 побед в PvP дуэлях',
    checkUnlocked: '(p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 7',
    progressText: '(p) => `${Math.min(7, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 7 побед`',
    badge: '📜 Чунин',
    borderClass: 'border-emerald-500',
    glowClass: 'shadow-lg shadow-emerald-500/40',
    prefix: 'fr_chun',
    defs: `
      <linearGradient id="fr_chun_gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#eab308" />
        <stop offset="70%" stopColor="#a16207" />
        <stop offset="100%" stopColor="#422006" />
      </linearGradient>
      <linearGradient id="fr_chun_tactical" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14532d" />
        <stop offset="50%" stopColor="#052e16" />
        <stop offset="100%" stopColor="#021a0c" />
      </linearGradient>
    `,
    bgSvg: `
      <rect x="-8" y="-8" width="116" height="116" rx="26" fill="none" stroke="#22c55e" strokeWidth="3" opacity="0.3" filter="blur(6px)" />
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#fr_chun_tactical)" stroke="url(#fr_chun_gold)" strokeWidth="3.5" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.7" />
    `,
    propsSvg: `
      {/* Боковые золотые шевроны чунина */}
      <g transform="translate(-16, 25)" fill="url(#fr_chun_gold)">
        <polygon points="18,0 4,8 18,16 14,8" />
        <polygon points="18,18 4,26 18,34 14,26" />
        <polygon points="18,36 4,44 18,52 14,44" />
      </g>
      <g transform="translate(98, 25)" fill="url(#fr_chun_gold)">
        <polygon points="0,0 14,8 0,16 4,8" />
        <polygon points="0,18 14,26 0,34 4,26" />
        <polygon points="0,36 14,44 0,52 4,44" />
      </g>

      {/* Верхний картуш с двумя скрещенными кунаями */}
      <g transform="translate(30, -16)" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.85))">
        <polygon points="0,18 40,18 36,0 4,0" fill="url(#fr_chun_gold)" stroke="#fef08a" strokeWidth="1" />
        <line x1="8" y1="2" x2="32" y2="16" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="8" y1="2" x2="32" y2="16" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        <line x1="32" y1="2" x2="8" y2="16" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="2" x2="8" y2="16" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Нижний золотой картуш 『忍』 (Шиноби) */}
      <g transform="translate(32, 85)" filter="drop-shadow(0 0 10px #eab308)">
        <rect x="0" y="0" width="36" height="18" rx="5" fill="#090d16" stroke="url(#fr_chun_gold)" strokeWidth="2" />
        <text x="18" y="14" fill="#fef08a" fontSize="13" fontWeight="900" fontFamily="serif" textAnchor="middle">忍</text>
      </g>
    `
  },

  // 4. ДЖОНИН (Hiraishin Silver Wings & Lightning)
  {
    id: 'frame_jonin',
    name: 'Крылья Бога Грома Джонина',
    tier: 4,
    rarity: 'Грандмастер (Grandmaster)',
    rarityColor: '#60a5fa',
    requirementText: '15 побед в PvP дуэлях',
    checkUnlocked: '(p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 15',
    progressText: '(p) => `${Math.min(15, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 15 побед`',
    badge: '⚡ Джонин',
    borderClass: 'border-blue-400',
    glowClass: 'shadow-xl shadow-blue-500/50',
    prefix: 'fr_jonin',
    defs: `
      <linearGradient id="fr_jonin_silver" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#cbd5e1" />
        <stop offset="75%" stopColor="#64748b" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      <linearGradient id="fr_jonin_plasma" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#67e8f9" />
        <stop offset="50%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#083344" />
      </linearGradient>
    `,
    bgSvg: `
      {/* Молниевые разряды Райкири */}
      <g stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.8" filter="drop-shadow(0 0 6px #38bdf8)">
        <path d="M -15,10 L -4,25 L -10,35 L -2,50" />
        <path d="M 115,10 L 104,25 L 110,35 L 102,50" />
      </g>
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#040814" stroke="url(#fr_jonin_silver)" strokeWidth="3.5" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
    `,
    propsSvg: `
      {/* Серебряные крылья Хирайшина Минато (вынос 28px) */}
      <g transform="translate(-28, 15)" filter="drop-shadow(0 0 8px #60a5fa)">
        <path d="M 28,0 L 4,18 L 28,26 L 10,38 L 28,48 L 18,58 L 28,68" fill="none" stroke="url(#fr_jonin_silver)" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M 28,0 L 4,18 L 28,26 L 10,38 L 28,48" fill="url(#fr_jonin_plasma)" opacity="0.3" />
      </g>
      <g transform="translate(100, 15)" filter="drop-shadow(0 0 8px #60a5fa)">
        <path d="M 0,0 L 24,18 L 0,26 L 18,38 L 0,48 L 10,58 L 0,68" fill="none" stroke="url(#fr_jonin_silver)" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M 0,0 L 24,18 L 0,26 L 18,38 L 0,48" fill="url(#fr_jonin_plasma)" opacity="0.3" />
      </g>

      {/* Верхнее навершие: Барабан Райдзина с синей звездой */}
      <g transform="translate(36, -18)" filter="drop-shadow(0 0 10px #38bdf8)">
        <circle cx="14" cy="14" r="14" fill="#040814" stroke="url(#fr_jonin_silver)" strokeWidth="2" />
        <polygon points="14,2 17,11 26,14 17,17 14,26 11,17 2,14 11,11" fill="#38bdf8" />
        <circle cx="14" cy="14" r="3.5" fill="#ffffff" />
      </g>

      {/* Нижний граненый сапфир в золотой оправе */}
      <g transform="translate(38, 86)" filter="drop-shadow(0 0 12px #3b82f6)">
        <polygon points="12,0 24,9 12,22 0,9" fill="#2563eb" stroke="#93c5fd" strokeWidth="1.5" />
        <polygon points="12,3 18,9 12,17 6,9" fill="#bfdbfe" opacity="0.75" />
      </g>
    `
  },

  // 5. АНБУ (Porcelain Kitsune Fox Mask)
  {
    id: 'frame_anbu',
    name: 'Фарфоровая Маска АНБУ Лиса',
    tier: 5,
    rarity: 'Эпическая (Epic)',
    rarityColor: '#f43f5e',
    requirementText: '25 побед в PvP дуэлях',
    checkUnlocked: '(p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 25',
    progressText: '(p) => `${Math.min(25, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 25 побед`',
    badge: '🎭 АНБУ',
    borderClass: 'border-rose-500',
    glowClass: 'shadow-xl shadow-rose-600/50',
    prefix: 'fr_anbu',
    defs: `
      <linearGradient id="fr_anbu_porcelain" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#f1f5f9" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      <linearGradient id="fr_anbu_crimson" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="70%" stopColor="#be123c" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>
    `,
    bgSvg: `
      <rect x="-10" y="-10" width="120" height="120" rx="30" fill="none" stroke="#e11d48" strokeWidth="4" opacity="0.35" filter="blur(8px)" />
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#080204" stroke="url(#fr_anbu_crimson)" strokeWidth="3.5" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#fda4af" strokeWidth="1" opacity="0.7" />
    `,
    propsSvg: `
      {/* Обсидиановые перья по левому краю */}
      <g transform="translate(-18, 30)" fill="#180509" stroke="#e11d48" strokeWidth="1">
        <path d="M 18,0 C 6,10 0,24 4,32 C 10,24 16,12 18,0 Z" />
        <path d="M 18,20 C 8,28 2,40 6,48 C 12,40 16,30 18,20 Z" />
      </g>

      {/* ГЛАВНЫЙ АРТЕФАКТ: Скульптурная фарфоровая маска Лиса Кицунэ (вынос 35px) */}
      <g transform="translate(68, -24)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.95))">
        {/* Уши лиса */}
        <polygon points="8,10 16,-8 24,8" fill="url(#fr_anbu_porcelain)" stroke="#be123c" strokeWidth="1.2" />
        <polygon points="12,6 16,-4 20,6" fill="#be123c" />
        <polygon points="28,8 36,-8 44,10" fill="url(#fr_anbu_porcelain)" stroke="#be123c" strokeWidth="1.2" />
        <polygon points="32,6 36,-4 40,6" fill="#be123c" />
        
        {/* Морда лиса */}
        <path d="M 6,12 C 4,26 12,40 26,46 C 40,40 48,26 46,12 C 34,8 18,8 6,12 Z" fill="url(#fr_anbu_porcelain)" stroke="#0f172a" strokeWidth="1.5" />
        
        {/* Алые ритуальные узоры глаз */}
        <path d="M 12,22 Q 18,18 22,23 Q 18,26 12,22 Z" fill="#be123c" />
        <path d="M 40,22 Q 34,18 30,23 Q 34,26 40,22 Z" fill="#be123c" />
        <line x1="26" y1="20" x2="26" y2="34" stroke="#be123c" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="26" cy="38" r="2.2" fill="#0f172a" />
        
        {/* Усы */}
        <line x1="10" y1="32" x2="18" y2="34" stroke="#be123c" strokeWidth="1.2" />
        <line x1="42" y1="32" x2="34" y2="34" stroke="#be123c" strokeWidth="1.2" />
      </g>

      {/* Низ-лево: Капли крови и золотой колокольчик */}
      <g transform="translate(8, 86)" filter="drop-shadow(0 0 8px #f43f5e)">
        <circle cx="6" cy="6" r="5" fill="url(#fr_anbu_crimson)" stroke="#fecdd3" strokeWidth="1.2" />
        <circle cx="16" cy="12" r="3.5" fill="url(#fr_anbu_crimson)" />
      </g>
    `
  },

  // 6. САННИН (Mt. Myoboku Toad Hermit)
  {
    id: 'frame_sannin',
    name: 'Жабий Мудрец Горы Мёбоку',
    tier: 6,
    rarity: 'Легендарная (Legend)',
    rarityColor: '#f97316',
    requirementText: '40 побед в PvP дуэлях',
    checkUnlocked: '(p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 40',
    progressText: '(p) => `${Math.min(40, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 40 побед`',
    badge: '🐸 Саннин',
    borderClass: 'border-orange-500',
    glowClass: 'shadow-2xl shadow-orange-500/50',
    prefix: 'fr_san',
    defs: `
      <linearGradient id="fr_san_fire" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#f97316" />
        <stop offset="75%" stopColor="#c2410c" />
        <stop offset="100%" stopColor="#431407" />
      </linearGradient>
      <linearGradient id="fr_san_stone" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#78716c" />
        <stop offset="50%" stopColor="#44403c" />
        <stop offset="100%" stopColor="#1c1917" />
      </linearGradient>
    `,
    bgSvg: `
      <rect x="-12" y="-12" width="124" height="124" rx="32" fill="none" stroke="#ea580c" strokeWidth="4" opacity="0.4" filter="blur(8px)" />
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#140702" stroke="url(#fr_san_fire)" strokeWidth="3.8" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity="0.8" />
    `,
    propsSvg: `
      {/* ГЛАВНЫЙ АРТЕФАКТ: Скульптурная голова Жабы Гамабунты с курительной трубкой */}
      <g transform="translate(24, -26)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.95))">
        {/* Голова жабы */}
        <ellipse cx="26" cy="18" rx="26" ry="16" fill="url(#fr_san_stone)" stroke="url(#fr_san_fire)" strokeWidth="2" />
        
        {/* Глаза с горизонтальными зрачками */}
        <circle cx="14" cy="10" r="6" fill="#fef08a" stroke="#451a03" strokeWidth="1.2" />
        <line x1="9" y1="10" x2="19" y2="10" stroke="#000000" strokeWidth="2.5" />
        <circle cx="38" cy="10" r="6" fill="#fef08a" stroke="#451a03" strokeWidth="1.2" />
        <line x1="33" y1="10" x2="43" y2="10" stroke="#000000" strokeWidth="2.5" />
        
        {/* Рот и курительная трубка кисэру */}
        <path d="M 12,24 Q 26,28 40,24" stroke="#1c1917" strokeWidth="3" fill="none" />
        <path d="M 38,23 L 56,18 L 58,12" stroke="#d97706" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Дым из трубки */}
        <circle cx="58" cy="8" r="3" fill="#ffffff" opacity="0.7" />
        <circle cx="62" cy="4" r="4.5" fill="#ffffff" opacity="0.5" />
      </g>

      {/* Языки пламени жабьего масла по бокам */}
      <g transform="translate(-16, 40)" fill="url(#fr_san_fire)">
        <path d="M 16,0 Q 2,12 8,24 Q 0,16 16,36 Z" />
      </g>
      <g transform="translate(100, 40)" fill="url(#fr_san_fire)">
        <path d="M 0,0 Q 14,12 8,24 Q 16,16 0,36 Z" />
      </g>

      {/* Нижний огненный картуш 『油』 (Масло) */}
      <g transform="translate(32, 85)" filter="drop-shadow(0 0 12px #ea580c)">
        <rect x="0" y="0" width="36" height="18" rx="6" fill="#180402" stroke="url(#fr_san_fire)" strokeWidth="2" />
        <text x="18" y="14" fill="#fed7aa" fontSize="13" fontWeight="900" fontFamily="serif" textAnchor="middle">油</text>
      </g>
    `
  },

  // 7. СУСАНОО (Demonic Tengu Horned Helmet - MLBB Demonlord style)
  {
    id: 'frame_susanoo',
    name: 'Астральный Шлем Сусаноо Войны',
    tier: 7,
    rarity: 'Мифическая (Mythic)',
    rarityColor: '#a855f7',
    requirementText: '60 побед в PvP дуэлях',
    checkUnlocked: '(p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 60',
    progressText: '(p) => `${Math.min(60, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 60 побед`',
    badge: '🟣 Сусаноо',
    borderClass: 'border-purple-500',
    glowClass: 'shadow-2xl shadow-purple-600/60',
    prefix: 'fr_sus',
    defs: `
      <linearGradient id="fr_sus_amethyst" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f3e8ff" />
        <stop offset="30%" stopColor="#c084fc" />
        <stop offset="70%" stopColor="#7e22ce" />
        <stop offset="100%" stopColor="#3b0764" />
      </linearGradient>
      <linearGradient id="fr_sus_horn" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e9d5ff" />
        <stop offset="40%" stopColor="#9333ea" />
        <stop offset="80%" stopColor="#4c1d95" />
        <stop offset="100%" stopColor="#1e0538" />
      </linearGradient>
    `,
    bgSvg: `
      <rect x="-14" y="-14" width="128" height="128" rx="34" fill="none" stroke="#9333ea" strokeWidth="5" opacity="0.45" filter="blur(10px)" />
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#0c0214" stroke="url(#fr_sus_amethyst)" strokeWidth="4" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#d8b4fe" strokeWidth="1.4" opacity="0.8" />
    `,
    propsSvg: `
      {/* ГЛАВНЫЙ АРТЕФАКТ MLBB: Массивные рога демонического шлема Тэнгу (вынос 38px) */}
      <g transform="translate(14, -34)" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.95))">
        {/* Левый изогнутый рог они */}
        <path d="M 18,28 C 12,14 -4,-4 -12,-8 C -8,6 2,24 14,34 Z" fill="url(#fr_sus_horn)" stroke="#e9d5ff" strokeWidth="1.5" />
        {/* Правый изогнутый рог они */}
        <path d="M 54,28 C 60,14 76,-4 84,-8 C 80,6 70,24 58,34 Z" fill="url(#fr_sus_horn)" stroke="#e9d5ff" strokeWidth="1.5" />
        
        {/* Центральный лобный гребень шлема */}
        <polygon points="36,4 46,18 36,36 26,18" fill="url(#fr_sus_amethyst)" stroke="#f3e8ff" strokeWidth="1.6" />
        <circle cx="36" cy="18" r="4" fill="#fef08a" filter="drop-shadow(0 0 6px #fef08a)" />
      </g>

      {/* Реберные щиты Сусаноо по бокам */}
      <g transform="translate(-18, 20)" fill="none" stroke="url(#fr_sus_amethyst)" strokeWidth="3" strokeLinecap="round">
        <path d="M 18,0 C 4,6 4,18 18,24" />
        <path d="M 18,20 C 2,26 2,38 18,44" />
        <path d="M 18,40 C 4,46 4,58 18,64" />
      </g>
      <g transform="translate(100, 20)" fill="none" stroke="url(#fr_sus_amethyst)" strokeWidth="3" strokeLinecap="round">
        <path d="M 0,0 C 14,6 14,18 0,24" />
        <path d="M 0,20 C 16,26 16,38 0,44" />
        <path d="M 0,40 C 14,46 14,58 0,64" />
      </g>

      {/* Нижний имперский картуш 『覇』 (Владычество) */}
      <g transform="translate(32, 85)" filter="drop-shadow(0 0 14px #a855f7)">
        <rect x="0" y="0" width="36" height="18" rx="6" fill="#150324" stroke="url(#fr_sus_amethyst)" strokeWidth="2.2" />
        <text x="18" y="14" fill="#f3e8ff" fontSize="13" fontWeight="900" fontFamily="serif" textAnchor="middle">覇</text>
      </g>
    `
  },

  // 8. МУДРЕЦ (Dragon Horns & Nature Scroll)
  {
    id: 'frame_sage',
    name: 'Ветвистые Рога Мудреца',
    tier: 8,
    rarity: 'Мифическая Слава (Mythic Glory)',
    rarityColor: '#eab308',
    requirementText: '80 побед в PvP дуэлях',
    checkUnlocked: '(p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 80',
    progressText: '(p) => `${Math.min(80, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 80 побед`',
    badge: '👑 Мудрец',
    borderClass: 'border-yellow-400',
    glowClass: 'shadow-2xl shadow-yellow-500/60',
    prefix: 'fr_sage',
    defs: `
      <linearGradient id="fr_sage_gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#fde047" />
        <stop offset="70%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
      <linearGradient id="fr_sage_jade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bbf7d0" />
        <stop offset="50%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#14532d" />
      </linearGradient>
    `,
    bgSvg: `
      <rect x="-14" y="-14" width="128" height="128" rx="34" fill="none" stroke="#eab308" strokeWidth="5" opacity="0.45" filter="blur(10px)" />
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#140f02" stroke="url(#fr_sage_gold)" strokeWidth="4" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#fef08a" strokeWidth="1.4" opacity="0.8" />
    `,
    propsSvg: `
      {/* Ветвистые рога дракона Мудреца Сендзюцу (вынос 35px) */}
      <g transform="translate(10, -32)" filter="drop-shadow(0 6px 14px rgba(0,0,0,0.9))">
        {/* Левый рог */}
        <path d="M 22,28 C 16,10 0,-4 -8,-6 C -6,2 6,16 12,20 C 4,12 -2,4 -6,2 C -2,10 8,24 18,32 Z" fill="url(#fr_sage_gold)" stroke="#ffffff" strokeWidth="1.2" />
        {/* Правый рог */}
        <path d="M 58,28 C 64,10 80,-4 88,-6 C 86,2 74,16 68,20 C 76,12 82,4 86,2 C 82,10 72,24 62,32 Z" fill="url(#fr_sage_gold)" stroke="#ffffff" strokeWidth="1.2" />
        {/* Центральный лотос */}
        <polygon points="40,12 48,24 40,36 32,24" fill="url(#fr_sage_jade)" stroke="#fde047" strokeWidth="1.5" />
      </g>

      {/* Оранжевые тени глаз Мудреца по бокам */}
      <g fill="#ea580c" opacity="0.85">
        <path d="M 2,36 Q -6,45 2,54 Z" />
        <path d="M 98,36 Q 106,45 98,54 Z" />
      </g>

      {/* Нижний свиток и картуш 『仙』 (Мудрец) */}
      <g transform="translate(32, 85)" filter="drop-shadow(0 0 14px #eab308)">
        <rect x="0" y="0" width="36" height="18" rx="6" fill="#1f1402" stroke="url(#fr_sage_gold)" strokeWidth="2.2" />
        <text x="18" y="14" fill="#fef08a" fontSize="13" fontWeight="900" fontFamily="serif" textAnchor="middle">仙</text>
      </g>
    `
  },

  // 9. РИННЕГАН (Six Paths Gravity & Black Receiver Rods)
  {
    id: 'frame_rinnegan',
    name: 'Гравитация Шести Путей Риннегана',
    tier: 9,
    rarity: 'Бессмертная (Immortal)',
    rarityColor: '#c084fc',
    requirementText: '110 побед в PvP дуэлях',
    checkUnlocked: '(p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 110',
    progressText: '(p) => `${Math.min(110, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 110 побед`',
    badge: '🌀 Риннеган',
    borderClass: 'border-fuchsia-500',
    glowClass: 'shadow-2xl shadow-fuchsia-600/70',
    prefix: 'fr_rin',
    defs: `
      <linearGradient id="fr_rin_titanium" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f5d0fe" />
        <stop offset="35%" stopColor="#c084fc" />
        <stop offset="70%" stopColor="#6b21a8" />
        <stop offset="100%" stopColor="#1e0538" />
      </linearGradient>
      <linearGradient id="fr_rin_rod" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="50%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
    `,
    bgSvg: `
      {/* Концентрические кольца гравитации Риннегана */}
      <circle cx="50" cy="50" r="62" fill="none" stroke="#c084fc" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
      <circle cx="50" cy="50" r="70" fill="none" stroke="#e879f9" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#08020e" stroke="url(#fr_rin_titanium)" strokeWidth="4.2" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#e879f9" strokeWidth="1.5" opacity="0.8" />
    `,
    propsSvg: `
      {/* 6 выступающих чёрных штырей чакры (вынос 25px) */}
      <g fill="url(#fr_rin_rod)" stroke="#c084fc" strokeWidth="1">
        {/* Верх-лево */}
        <polygon points="-8,-8 -2,-4 -12,10 -16,6" />
        {/* Верх-право */}
        <polygon points="108,-8 102,-4 112,10 116,6" />
        {/* Середина-лево */}
        <polygon points="-16,46 -8,48 -8,52 -16,54" />
        {/* Середина-право */}
        <polygon points="116,46 108,48 108,52 116,54" />
        {/* Низ-лево */}
        <polygon points="-8,108 -2,104 -12,90 -16,94" />
        {/* Низ-право */}
        <polygon points="108,108 102,104 112,90 116,94" />
      </g>

      {/* Верхнее гравитационное ядро Шинра Тенсей */}
      <g transform="translate(36, -20)" filter="drop-shadow(0 0 14px #c084fc)">
        <circle cx="14" cy="14" r="14" fill="#020617" stroke="url(#fr_rin_titanium)" strokeWidth="2.5" />
        <circle cx="14" cy="14" r="9" fill="none" stroke="#c084fc" strokeWidth="1.2" />
        <circle cx="14" cy="14" r="4.5" fill="none" stroke="#e879f9" strokeWidth="1.2" />
        <circle cx="14" cy="14" r="1.8" fill="#ffffff" />
      </g>

      {/* Нижний картуш 『六道』 (Шесть Путей) */}
      <g transform="translate(28, 85)" filter="drop-shadow(0 0 14px #c084fc)">
        <rect x="0" y="0" width="44" height="18" rx="6" fill="#0d0217" stroke="url(#fr_rin_titanium)" strokeWidth="2.2" />
        <text x="22" y="14" fill="#f5d0fe" fontSize="11" fontWeight="900" fontFamily="serif" textAnchor="middle">六道</text>
      </g>
    `
  },

  // 10. ХОКАГЕ (Ceremonial Hokage Hat & Fire Cloak)
  {
    id: 'frame_hokage',
    name: 'Священный Венец Хокаге Листа',
    tier: 10,
    rarity: 'Хокаге (Hokage)',
    rarityColor: '#ef4444',
    requirementText: '150 побед в PvP дуэлях',
    checkUnlocked: '(p) => (p?.stats?.pvp?.battlesWon || p?.battlesWon || 0) >= 150',
    progressText: '(p) => `${Math.min(150, p?.stats?.pvp?.battlesWon || p?.battlesWon || 0)} / 150 побед`',
    badge: '🔥 Хокаге',
    borderClass: 'border-red-500',
    glowClass: 'shadow-2xl shadow-red-600/70',
    prefix: 'fr_hok',
    defs: `
      <linearGradient id="fr_hok_crimson" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fca5a5" />
        <stop offset="35%" stopColor="#ef4444" />
        <stop offset="70%" stopColor="#b91c1c" />
        <stop offset="100%" stopColor="#450a0a" />
      </linearGradient>
      <linearGradient id="fr_hok_gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
    `,
    bgSvg: `
      <rect x="-14" y="-14" width="128" height="128" rx="34" fill="none" stroke="#ef4444" strokeWidth="5" opacity="0.45" filter="blur(10px)" />
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#140203" stroke="url(#fr_hok_crimson)" strokeWidth="4.2" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="url(#fr_hok_gold)" strokeWidth="1.6" />
    `,
    propsSvg: `
      {/* ГЛАВНЫЙ АРТЕФАКТ: Высокодетализированная скульптурная шляпа Хокаге (вынос 38px) */}
      <g transform="translate(18, -34)" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.95))">
        {/* Поля шляпы Хокаге (трехлучевой зонт) */}
        <polygon points="32,-2 0,22 64,22" fill="url(#fr_hok_crimson)" stroke="#450a0a" strokeWidth="1.2" />
        
        {/* Белый передний козырек с символом огня */}
        <polygon points="32,2 18,22 46,22" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
        {/* Красный кандзи 『火』 (Огонь) на белом козырьке */}
        <text x="32" y="18" fill="#b91c1c" fontSize="14" fontWeight="900" fontFamily="serif" textAnchor="middle">火</text>
        
        {/* Белые полосы ткани по бокам */}
        <path d="M 0,22 L -6,34 L 2,32 Z" fill="#ffffff" />
        <path d="M 64,22 L 70,34 L 62,32 Z" fill="#ffffff" />
      </g>

      {/* Огненные полы плаща Хокаге по бокам */}
      <g transform="translate(-16, 45)" fill="url(#fr_hok_crimson)">
        <polygon points="16,0 2,12 16,16 6,24 16,32" />
      </g>
      <g transform="translate(100, 45)" fill="url(#fr_hok_crimson)">
        <polygon points="0,0 14,12 0,16 10,24 0,32" />
      </g>

      {/* Нижний картуш Хокаге */}
      <g transform="translate(32, 85)" filter="drop-shadow(0 0 14px #ef4444)">
        <rect x="0" y="0" width="36" height="18" rx="6" fill="#180103" stroke="url(#fr_hok_gold)" strokeWidth="2.2" />
        <text x="18" y="14" fill="#fca5a5" fontSize="13" fontWeight="900" fontFamily="serif" textAnchor="middle">火</text>
      </g>
    `
  },

  // 11. 👑 ВЕНЕЦ ТВОРЦА (GENESIS CREATOR) — для Кирилла (askarovkiril5@gmail.com)
  {
    id: 'frame_creator_genesis',
    name: '👑 Венец Творца (Genesis Creator)',
    tier: 11,
    rarity: 'Создатель Мира (Genesis)',
    rarityColor: '#fbbf24',
    requirementText: 'Священный артефакт Создателя игры (Кирилл)',
    checkUnlocked: '(p) => isDeveloperAccount(p?.email)',
    progressText: '(p) => isDeveloperAccount(p?.email) ? "👑 Создатель игры подтверждён" : "🔒 Эксклюзив Создателя игры"',
    badge: '👑 Творец',
    borderClass: 'border-yellow-400',
    glowClass: 'shadow-[0_0_40px_rgba(250,204,21,0.9)]',
    prefix: 'fr_gen',
    isCreatorExclusive: true,
    defs: `
      <linearGradient id="fr_gen_gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="25%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#eab308" />
        <stop offset="75%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
      <linearGradient id="fr_gen_wing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#fde047" />
        <stop offset="70%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
      <linearGradient id="fr_gen_rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="25%" stopColor="#eab308" />
        <stop offset="50%" stopColor="#10b981" />
        <stop offset="75%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <filter id="fr_gen_divine" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#fde047" floodOpacity="0.9" />
      </filter>
    `,
    bgSvg: `
      {/* Радужно-призматический ореол Творца */}
      <rect x="-18" y="-18" width="136" height="136" rx="36" fill="none" stroke="url(#fr_gen_rainbow)" strokeWidth="6" opacity="0.6" filter="blur(12px)" />
    `,
    chassisSvg: `
      {/* Золотая ограненная броня с сакральными гранями */}
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#080310" stroke="url(#fr_gen_gold)" strokeWidth="4.5" filter="url(#fr_gen_divine)" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="url(#fr_gen_rainbow)" strokeWidth="1.8" />
      <rect x="9" y="9" width="82" height="82" rx="15" fill="none" stroke="#fef08a" strokeWidth="0.8" opacity="0.8" strokeDasharray="4 2" />
    `,
    propsSvg: `
      {/* 5-УРОВНЕВЫЕ ИМПЕРАТОРСКИЕ ЗОЛОТЫЕ ДРАКОНЬИ КРЫЛЬЯ (MLBB Collector, вынос 40px) */}
      <g transform="translate(-36, 12)" filter="url(#fr_gen_divine)">
        {/* 5 перьев-клинков дракона левого крыла */}
        <polygon points="36,4 4,12 36,18" fill="url(#fr_gen_wing)" stroke="#ffffff" strokeWidth="1" />
        <polygon points="36,16 -2,26 36,32" fill="url(#fr_gen_wing)" stroke="#fef08a" strokeWidth="1.2" />
        <polygon points="36,30 -6,44 36,50" fill="url(#fr_gen_wing)" stroke="#ffffff" strokeWidth="1.5" />
        <polygon points="36,48 -2,62 36,68" fill="url(#fr_gen_wing)" stroke="#fef08a" strokeWidth="1.2" />
        <polygon points="36,66 6,78 36,84" fill="url(#fr_gen_wing)" stroke="#ffffff" strokeWidth="1" />
      </g>
      <g transform="translate(100, 12)" filter="url(#fr_gen_divine)">
        {/* 5 перьев-клинков дракона правого крыла */}
        <polygon points="0,4 32,12 0,18" fill="url(#fr_gen_wing)" stroke="#ffffff" strokeWidth="1" />
        <polygon points="0,16 38,26 0,32" fill="url(#fr_gen_wing)" stroke="#fef08a" strokeWidth="1.2" />
        <polygon points="0,30 42,44 0,50" fill="url(#fr_gen_wing)" stroke="#ffffff" strokeWidth="1.5" />
        <polygon points="0,48 38,62 0,68" fill="url(#fr_gen_wing)" stroke="#fef08a" strokeWidth="1.2" />
        <polygon points="0,66 30,78 0,84" fill="url(#fr_gen_wing)" stroke="#ffffff" strokeWidth="1" />
      </g>

      {/* ГЛАВНЫЙ АРТЕФАКТ: 3D Скульптурная Корона Создателя с рубинами и лучами (вынос 38px) */}
      <g transform="translate(18, -36)" filter="drop-shadow(0 8px 18px rgba(0,0,0,0.95))">
        {/* Золотая 5-лучевая корона */}
        <polygon points="32,2 40,16 54,6 48,26 16,26 10,6 24,16" fill="url(#fr_gen_gold)" stroke="#ffffff" strokeWidth="1.8" />
        
        {/* Рубины на зубцах короны */}
        <circle cx="32" cy="2" r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.2" filter="drop-shadow(0 0 6px #ef4444)" />
        <circle cx="10" cy="6" r="2.8" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.8" />
        <circle cx="54" cy="6" r="2.8" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.8" />
        <circle cx="24" cy="16" r="2.2" fill="#ef4444" />
        <circle cx="40" cy="16" r="2.2" fill="#ef4444" />
        
        {/* Основание короны с жемчужинами */}
        <rect x="14" y="24" width="36" height="6" rx="2" fill="url(#fr_gen_gold)" stroke="#713f12" strokeWidth="1" />
        <circle cx="22" cy="27" r="1.5" fill="#ffffff" />
        <circle cx="32" cy="27" r="1.8" fill="#ef4444" />
        <circle cx="42" cy="27" r="1.5" fill="#ffffff" />
      </g>

      {/* 6 СФЕР ГУДОДАМА ПО ОРБИТЕ С ЗОЛОТЫМИ И ЛАЗУРНЫМИ ОРЕОЛАМИ */}
      <g>
        <circle cx="-6" cy="4" r="5" fill="#020617" stroke="#fef08a" strokeWidth="1.5" filter="drop-shadow(0 0 8px #fde047)" />
        <circle cx="106" cy="4" r="5" fill="#020617" stroke="#fef08a" strokeWidth="1.5" filter="drop-shadow(0 0 8px #fde047)" />
        <circle cx="-14" cy="50" r="4.5" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" filter="drop-shadow(0 0 8px #38bdf8)" />
        <circle cx="114" cy="50" r="4.5" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" filter="drop-shadow(0 0 8px #38bdf8)" />
        <circle cx="-6" cy="96" r="5" fill="#020617" stroke="#fef08a" strokeWidth="1.5" filter="drop-shadow(0 0 8px #fde047)" />
        <circle cx="106" cy="96" r="5" fill="#020617" stroke="#fef08a" strokeWidth="1.5" filter="drop-shadow(0 0 8px #fde047)" />
      </g>

      {/* НИЖНИЙ МОНОЛИТНЫЙ ПОСТАМЕНТ ТВОРЦА 『創世』 (Сотворение) */}
      <g transform="translate(26, 84)" filter="drop-shadow(0 0 16px #fde047)">
        <polygon points="4,0 44,0 48,22 0,22" fill="#090212" stroke="url(#fr_gen_gold)" strokeWidth="2.5" />
        <text x="24" y="16" fill="#fef08a" fontSize="13" fontWeight="900" fontFamily="serif" letterSpacing="2" textAnchor="middle">創世</text>
      </g>
    `
  }
];

let code = `import React from 'react';

/**
 * playerFramesData.jsx
 * Каталог наградных рамок за боевые достижения (Achievement Frames).
 * Выполнены по высшему стандарту Mobile Legends: Bang Bang (MLBB Masterpiece Edition):
 * - Скульптурный силуэтный вынос (viewBox="-30 -30 160 160", overflow-visible)
 * - Настоящие 3D-артефакты: шляпа Хокаге, маска АНБУ, драконьи крылья, рога они Сусаноо, корона Творца
 * - Металлическая чеканка, филигрань, глубокие тени и фотоника
 */

export const DEVELOPER_EMAIL = 'askarovkiril5@gmail.com';

export function isDeveloperAccount(email) {
  if (!email) return false;
  return String(email).trim().toLowerCase() === DEVELOPER_EMAIL;
}

export const PLAYER_FRAMES = [
`;

FRAMES_DATA.forEach((f) => {
  code += `  // =========================================================================
  // ${f.tier}. ${f.name}
  // =========================================================================
  {
    id: '${f.id}',
    name: '${f.name}',
    tier: ${f.tier},
    rarity: '${f.rarity}',
    rarityColor: '${f.rarityColor}',
    requirementText: '${f.requirementText}',
    checkUnlocked: ${f.checkUnlocked},
    progressText: ${f.progressText},
    badge: '${f.badge}',
    borderClass: '${f.borderClass}',
    glowClass: '${f.glowClass}',
    ${f.isCreatorExclusive ? 'isCreatorExclusive: true,' : ''}
    renderFrame: (avatarContent, sizeClass = "w-14 h-14", extraBadge = null) => (
      <div 
        className={\`relative \${sizeClass} shrink-0 select-none flex items-center justify-center overflow-visible\`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <svg 
          viewBox="-30 -30 160 160" 
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            ${f.defs}
          </defs>

          {/* Слой 0: Фоновая аура чакры */}
          ${f.bgSvg}

          {/* Слой 1: Карточка аватара шиноби с клиппингом */}
          <foreignObject x="8" y="8" width="84" height="84" className="pointer-events-auto">
            <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-950">
              {avatarContent}
            </div>
          </foreignObject>

          {/* Слой 2: Основной трехмерный несущий каркас */}
          ${f.chassisSvg}

          {/* Слой 3: Выступающие 3D-артефакты героя (MLBB Hero Props) */}
          ${f.propsSvg}
        </svg>

        {extraBadge}
      </div>
    )
  },
`;
});

code += `];

export function getPlayerFrameById(frameId, userProfile = null) {
  const isDev = isDeveloperAccount(userProfile?.email);
  if (frameId === 'frame_creator_genesis' && !isDev) {
    return PLAYER_FRAMES[0];
  }
  const found = PLAYER_FRAMES.find(f => f.id === frameId);
  return found || PLAYER_FRAMES[0];
}
`;

const outputPath = path.join(__dirname, '..', 'client', 'src', 'data', 'playerFramesData.jsx');
fs.writeFileSync(outputPath, code, 'utf8');
console.log('Successfully generated MLBB Masterpiece SVG frames at:', outputPath);
