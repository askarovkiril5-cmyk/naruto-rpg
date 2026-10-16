const fs = require('fs');
const path = require('path');

// ============================================================================
// ULTRA-AAA MASTERPIECE FRAMES GENERATOR (Mobile Legends Divine Edition)
// ============================================================================
// Архитектура:
// 1. Аватар рендерится в нативном HTML контейнере (absolute inset-2), гарантируя
//    100% четкость, яркость и читаемость фотографии/эмодзи без закрытия заливками.
// 2. Рамка — это навесной 3D SVG оверлей с fill="none" и толстым кованым бортом
//    (strokeWidth="8..10"), поверх которого вырываются скульптурные артефакты
//    (шляпы, рога, маски, крылья, короны, сферы) в расширенном viewBox="-35 -35 170 170".

const FRAMES_DATA = [
  // =========================================================================
  // 1. АКАДЕМИЯ ЛИСТА (Hinoki Wood, Forged Brass Brackets & Stitched Leather Belt)
  // =========================================================================
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
    defs: `
      <linearGradient id="fr_acad_wood" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="35%" stopColor="#78350f" />
        <stop offset="70%" stopColor="#451a03" />
        <stop offset="100%" stopColor="#1c0a02" />
      </linearGradient>
      <linearGradient id="fr_acad_brass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="30%" stopColor="#eab308" />
        <stop offset="70%" stopColor="#a16207" />
        <stop offset="100%" stopColor="#422006" />
      </linearGradient>
      <linearGradient id="fr_acad_leather" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ea580c" />
        <stop offset="40%" stopColor="#c2410c" />
        <stop offset="80%" stopColor="#7c2d12" />
        <stop offset="100%" stopColor="#2e0d05" />
      </linearGradient>
      <linearGradient id="fr_acad_jade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6ee7b7" />
        <stop offset="40%" stopColor="#10b981" />
        <stop offset="80%" stopColor="#047857" />
        <stop offset="100%" stopColor="#022c22" />
      </linearGradient>
      <filter id="fr_acad_shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.9" />
      </filter>
    `,
    auraSvg: `
      <rect x="-6" y="-6" width="112" height="112" rx="26" fill="none" stroke="#10b981" strokeWidth="4" opacity="0.35" filter="blur(6px)" />
    `,
    borderStroke: `url(#fr_acad_wood)`,
    borderStrokeWidth: '9',
    accentStroke: `url(#fr_acad_brass)`,
    heroSvg: `
      {/* 4 Литые латунные угловые скобы с полированными заклепками */}
      <g fill="url(#fr_acad_brass)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">
        {/* Топ-лево */}
        <polygon points="0,0 18,0 18,7 7,7 7,18 0,18" />
        <circle cx="10" cy="10" r="1.8" fill="#fef08a" stroke="#422006" strokeWidth="0.6" />
        {/* Топ-право */}
        <polygon points="100,0 82,0 82,7 93,7 93,18 100,18" />
        <circle cx="90" cy="10" r="1.8" fill="#fef08a" stroke="#422006" strokeWidth="0.6" />
        {/* Низ-лево */}
        <polygon points="0,100 18,100 18,93 7,93 7,82 0,82" />
        <circle cx="10" cy="90" r="1.8" fill="#fef08a" stroke="#422006" strokeWidth="0.6" />
        {/* Низ-право */}
        <polygon points="100,100 82,100 82,93 93,93 93,82 100,82" />
        <circle cx="90" cy="90" r="1.8" fill="#fef08a" stroke="#422006" strokeWidth="0.6" />
      </g>

      {/* Топ-Право: Светящийся Нефритовый Лист Конохи (вынос 24px) */}
      <g transform="translate(80, -18)" filter="drop-shadow(0 0 10px #10b981)">
        <path d="M 0,28 C 14,8 32,-4 38,-14 C 28,6 20,22 8,30 C 3,32 0,32 0,28 Z" fill="url(#fr_acad_jade)" stroke="#fef08a" strokeWidth="1.5" />
        <path d="M 4,-10 Q 15,8 8,24" stroke="#a7f3d0" strokeWidth="1" fill="none" />
        <circle cx="22" cy="2" r="2.5" fill="#ffffff" opacity="0.95">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Низ-Лево: Прошитый кожаный ремень шиноби с латунной пряжкой (вынос 20px) */}
      <g transform="translate(-20, 70)" filter="url(#fr_acad_shadow)">
        <path d="M 0,22 L 44,-4 L 52,8 L 8,34 Z" fill="url(#fr_acad_leather)" stroke="#2e0d05" strokeWidth="1.2" />
        <line x1="2" y1="23" x2="42" y2="-3" stroke="#fef08a" strokeWidth="0.8" strokeDasharray="3 2" />
        <line x1="6" y1="32" x2="50" y2="6" stroke="#fef08a" strokeWidth="0.8" strokeDasharray="3 2" />
        {/* Латунная массивная пряжка */}
        <g transform="rotate(-32 25 15)">
          <rect x="15" y="5" width="20" height="20" rx="4" fill="none" stroke="url(#fr_acad_brass)" strokeWidth="3.5" />
          <line x1="19" y1="15" x2="31" y2="15" stroke="url(#fr_acad_brass)" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      </g>
    `
  },

  // =========================================================================
  // 2. ГЕНИН КОНОХИ (Steel Hitai-ate, Flaring Kunai Wings & Azure Crystal)
  // =========================================================================
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
    defs: `
      <linearGradient id="fr_genin_steel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#cbd5e1" />
        <stop offset="70%" stopColor="#475569" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="fr_genin_cyan" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bae6fd" />
        <stop offset="40%" stopColor="#38bdf8" />
        <stop offset="80%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#082f49" />
      </linearGradient>
      <filter id="fr_genin_glow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#38bdf8" floodOpacity="0.9" />
      </filter>
    `,
    auraSvg: `
      <rect x="-8" y="-8" width="116" height="116" rx="28" fill="none" stroke="#0284c7" strokeWidth="5" opacity="0.45" filter="blur(8px)" />
    `,
    borderStroke: `url(#fr_genin_steel)`,
    borderStrokeWidth: '9.5',
    accentStroke: `#38bdf8`,
    heroSvg: `
      {/* Левые тройные острые клинки-крылья куная (вынос 28px) */}
      <g transform="translate(-30, 22)" filter="url(#fr_genin_glow)">
        <polygon points="28,10 2,20 28,28 32,19" fill="url(#fr_genin_steel)" stroke="#ffffff" strokeWidth="1.2" />
        <polygon points="30,-6 -2,6 30,16 34,5" fill="url(#fr_genin_steel)" stroke="#38bdf8" strokeWidth="1.5" />
        <polygon points="28,26 4,40 28,46 32,36" fill="url(#fr_genin_steel)" stroke="#ffffff" strokeWidth="1.2" />
        <line x1="2" y1="6" x2="32" y2="6" stroke="#ffffff" strokeWidth="1.6" />
      </g>

      {/* Правые тройные острые клинки-крылья куная (вынос 28px) */}
      <g transform="translate(98, 22)" filter="url(#fr_genin_glow)">
        <polygon points="4,10 30,20 4,28 0,19" fill="url(#fr_genin_steel)" stroke="#ffffff" strokeWidth="1.2" />
        <polygon points="2,-6 34,6 2,16 -2,5" fill="url(#fr_genin_steel)" stroke="#38bdf8" strokeWidth="1.5" />
        <polygon points="4,26 28,40 4,46 0,36" fill="url(#fr_genin_steel)" stroke="#ffffff" strokeWidth="1.2" />
        <line x1="0" y1="6" x2="30" y2="6" stroke="#ffffff" strokeWidth="1.6" />
      </g>

      {/* Топ-навершие: Стальной протектор Конохи со шрамом и 2 заклепками (вынос 24px) */}
      <g transform="translate(10, -22)" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.95))">
        <rect x="0" y="0" width="80" height="26" rx="7" fill="url(#fr_genin_steel)" stroke="#ffffff" strokeWidth="1.8" />
        <circle cx="8" cy="13" r="2.8" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.2" />
        <circle cx="72" cy="13" r="2.8" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.2" />
        {/* Выгравированный знак Листа */}
        <path d="M 36,17 C 37,10 44,8 50,9 C 47,15 41,19 35,18 C 32,17 31,11 35,9 C 41,5 49,6 54,12" fill="none" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" />
        <polygon points="50,9 55,7 54,11" fill="#0f172a" />
        {/* Боевой глубокий шрам через протектор */}
        <line x1="26" y1="3" x2="42" y2="23" stroke="#020617" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="26.6" y1="3.6" x2="42.6" y2="23.6" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" />
      </g>

      {/* Нижний граненый лазурный кристалл в зубчатой стальной оправе */}
      <g transform="translate(34, 82)" filter="drop-shadow(0 0 16px #38bdf8)">
        <polygon points="16,-3 32,10 16,25 0,10" fill="url(#fr_genin_cyan)" stroke="#ffffff" strokeWidth="1.8" />
        <polygon points="16,2 25,10 16,20 7,10" fill="#bae6fd" opacity="0.8" />
      </g>
    `
  },

  // =========================================================================
  // 3. ЧУНИН КОНОХИ (Tactical Kevlar Armor, Gold Chevrons & Medal 『忍』)
  // =========================================================================
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
    defs: `
      <linearGradient id="fr_chun_gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#fde047" />
        <stop offset="65%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
      <linearGradient id="fr_chun_tactical" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#15803d" />
        <stop offset="45%" stopColor="#14532d" />
        <stop offset="85%" stopColor="#052e16" />
        <stop offset="100%" stopColor="#02140a" />
      </linearGradient>
    `,
    auraSvg: `
      <rect x="-8" y="-8" width="116" height="116" rx="28" fill="none" stroke="#22c55e" strokeWidth="4" opacity="0.35" filter="blur(6px)" />
    `,
    borderStroke: `url(#fr_chun_tactical)`,
    borderStrokeWidth: '9.5',
    accentStroke: `url(#fr_chun_gold)`,
    heroSvg: `
      {/* Боковые золотые шевроны чунина (MLBB Officer Chevrons) */}
      <g transform="translate(-18, 20)" fill="url(#fr_chun_gold)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">
        <polygon points="20,0 2,10 20,20 15,10" stroke="#ffffff" strokeWidth="0.8" />
        <polygon points="20,22 2,32 20,42 15,32" stroke="#ffffff" strokeWidth="0.8" />
        <polygon points="20,44 2,54 20,64 15,54" stroke="#ffffff" strokeWidth="0.8" />
      </g>
      <g transform="translate(98, 20)" fill="url(#fr_chun_gold)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">
        <polygon points="0,0 18,10 0,20 5,10" stroke="#ffffff" strokeWidth="0.8" />
        <polygon points="0,22 18,32 0,42 5,32" stroke="#ffffff" strokeWidth="0.8" />
        <polygon points="0,44 18,54 0,64 5,54" stroke="#ffffff" strokeWidth="0.8" />
      </g>

      {/* Верхний картуш со скрещенными кунаями и рубиновым узлом */}
      <g transform="translate(24, -22)" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.95))">
        <polygon points="0,24 52,24 45,0 7,0" fill="url(#fr_chun_gold)" stroke="#ffffff" strokeWidth="1.4" />
        <line x1="8" y1="3" x2="44" y2="21" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="8" y1="3" x2="44" y2="21" stroke="#e2e8f0" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="44" y1="3" x2="8" y2="21" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="44" y1="3" x2="8" y2="21" stroke="#e2e8f0" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="26" cy="12" r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
      </g>

      {/* Нижний тяжелый золотой орден 『忍』 (Шиноби) */}
      <g transform="translate(28, 82)" filter="drop-shadow(0 0 14px #eab308)">
        <rect x="0" y="0" width="44" height="22" rx="6" fill="#071b0e" stroke="url(#fr_chun_gold)" strokeWidth="2.6" />
        <text x="22" y="16" fill="#fef08a" fontSize="15" fontWeight="900" fontFamily="serif" textAnchor="middle">忍</text>
      </g>
    `
  },

  // =========================================================================
  // 4. ДЖОНИН КОНОХИ (Hiraishin Silver Wings & Lightning Raikiri)
  // =========================================================================
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
    defs: `
      <linearGradient id="fr_jonin_silver" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#e2e8f0" />
        <stop offset="70%" stopColor="#64748b" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
      <linearGradient id="fr_jonin_sapphire" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="40%" stopColor="#3b82f6" />
        <stop offset="80%" stopColor="#1d4ed8" />
        <stop offset="100%" stopColor="#172554" />
      </linearGradient>
      <filter id="fr_jonin_lightning" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#60a5fa" floodOpacity="0.95" />
      </filter>
    `,
    auraSvg: `
      {/* Анимированные зигзагообразные молнии Райкири */}
      <g stroke="#67e8f9" strokeWidth="2.2" fill="none" opacity="0.9" filter="url(#fr_jonin_lightning)">
        <path d="M -16,8 L -4,26 L -14,40 L -2,58 L -12,76 L -2,92">
          <animate attributeName="opacity" values="0.4;1;0.3;0.9;0.4" dur="1s" repeatCount="indefinite" />
        </path>
        <path d="M 116,8 L 104,26 L 114,40 L 102,58 L 112,76 L 102,92">
          <animate attributeName="opacity" values="0.9;0.3;1;0.4;0.9" dur="1s" repeatCount="indefinite" />
        </path>
      </g>
    `,
    borderStroke: `url(#fr_jonin_silver)`,
    borderStrokeWidth: '9.5',
    accentStroke: `#38bdf8`,
    heroSvg: `
      {/* Массивные серебряные крылья Хирайшина Минато (вынос 32px) */}
      <g transform="translate(-32, 10)" filter="url(#fr_jonin_lightning)">
        <polygon points="32,0 2,24 32,32" fill="url(#fr_jonin_silver)" stroke="#ffffff" strokeWidth="1.5" />
        <polygon points="32,26 6,50 32,58" fill="url(#fr_jonin_silver)" stroke="#67e8f9" strokeWidth="1.5" />
        <polygon points="32,52 14,72 32,80" fill="url(#fr_jonin_silver)" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="2" y1="24" x2="32" y2="24" stroke="#ffffff" strokeWidth="2" />
      </g>
      <g transform="translate(100, 10)" filter="url(#fr_jonin_lightning)">
        <polygon points="0,0 30,24 0,32" fill="url(#fr_jonin_silver)" stroke="#ffffff" strokeWidth="1.5" />
        <polygon points="0,26 26,50 0,58" fill="url(#fr_jonin_silver)" stroke="#67e8f9" strokeWidth="1.5" />
        <polygon points="0,52 18,72 0,80" fill="url(#fr_jonin_silver)" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="0" y1="24" x2="30" y2="24" stroke="#ffffff" strokeWidth="2" />
      </g>

      {/* Верхнее навершие: Барабан Райдзина с трёхлучевой золотой звездой */}
      <g transform="translate(32, -22)" filter="drop-shadow(0 0 14px #38bdf8)">
        <circle cx="18" cy="18" r="18" fill="#040816" stroke="url(#fr_jonin_silver)" strokeWidth="2.8" />
        <polygon points="18,3 23,13 33,18 23,23 18,33 13,23 3,18 13,13" fill="#38bdf8" />
        <circle cx="18" cy="18" r="4.5" fill="#ffffff" />
      </g>

      {/* Нижний граненый сапфир в золотых лапках */}
      <g transform="translate(34, 82)" filter="drop-shadow(0 0 18px #3b82f6)">
        <polygon points="16,-4 32,10 16,26 0,10" fill="url(#fr_jonin_sapphire)" stroke="#ffffff" strokeWidth="2" />
        <polygon points="16,2 25,10 16,20 7,10" fill="#bfdbfe" opacity="0.85" />
      </g>
    `
  },

  // =========================================================================
  // 5. АНБУ КОНОХИ (Porcelain Kitsune Fox Mask & Blood Ruby)
  // =========================================================================
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
    defs: `
      <linearGradient id="fr_anbu_porcelain" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
      <linearGradient id="fr_anbu_blood" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fb7185" />
        <stop offset="35%" stopColor="#e11d48" />
        <stop offset="75%" stopColor="#9f1239" />
        <stop offset="100%" stopColor="#4c0519" />
      </linearGradient>
    `,
    auraSvg: `
      <rect x="-10" y="-10" width="120" height="120" rx="30" fill="none" stroke="#e11d48" strokeWidth="5" opacity="0.45" filter="blur(8px)" />
    `,
    borderStroke: `url(#fr_anbu_blood)`,
    borderStrokeWidth: '10',
    accentStroke: `#fecdd3`,
    heroSvg: `
      {/* Левые обсидиановые перья теней */}
      <g transform="translate(-20, 24)" fill="#1c050b" stroke="#e11d48" strokeWidth="1.4">
        <path d="M 20,0 C 4,12 -2,28 4,38 C 10,28 18,14 20,0 Z" />
        <path d="M 20,24 C 6,34 0,48 6,58 C 12,48 18,36 20,24 Z" />
      </g>

      {/* ШЕДЕВРАЛЬНЫЙ АРТЕФАКТ: Скульптурная фарфоровая маска Лиса Кицунэ (вынос 40px!) */}
      <g transform="translate(62, -32)" filter="drop-shadow(0 10px 18px rgba(0,0,0,0.98))">
        {/* Черные кончики ушей */}
        <polygon points="6,12 16,-12 24,10" fill="url(#fr_anbu_porcelain)" stroke="#be123c" strokeWidth="1.5" />
        <polygon points="12,4 16,-10 20,4" fill="#0f172a" />
        <polygon points="30,10 38,-12 46,12" fill="url(#fr_anbu_porcelain)" stroke="#be123c" strokeWidth="1.5" />
        <polygon points="34,4 38,-10 42,4" fill="#0f172a" />
        
        {/* Фарфоровый череп маски */}
        <path d="M 4,14 C 2,32 12,48 26,54 C 40,48 50,32 48,14 C 36,8 16,8 4,14 Z" fill="url(#fr_anbu_porcelain)" stroke="#020617" strokeWidth="2" />
        
        {/* Ритуальные алые контуры глаз */}
        <path d="M 10,24 Q 18,19 23,25 Q 18,29 10,24 Z" fill="#be123c" />
        <path d="M 42,24 Q 34,19 29,25 Q 34,29 42,24 Z" fill="#be123c" />
        <circle cx="17" cy="24" r="1.6" fill="#ffffff" />
        <circle cx="35" cy="24" r="1.6" fill="#ffffff" />
        
        {/* Алая каллиграфия носа и усов */}
        <line x1="26" y1="22" x2="26" y2="40" stroke="#be123c" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="26" cy="44" r="2.8" fill="#020617" />
        <path d="M 8,36 Q 16,38 20,41" stroke="#be123c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M 44,36 Q 36,38 32,41" stroke="#be123c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>

      {/* Низ-лево: Ограненный рубин крови */}
      <g transform="translate(4, 82)" filter="drop-shadow(0 0 14px #e11d48)">
        <polygon points="12,0 24,12 12,25 0,12" fill="url(#fr_anbu_blood)" stroke="#ffffff" strokeWidth="1.6" />
        <polygon points="12,3 19,12 12,20 5,12" fill="#fecdd3" opacity="0.85" />
      </g>
    `
  },

  // =========================================================================
  // 6. САННИН КОНОХИ (Stone Gamabunta Toad, Billowing Pipe Smoke & Oil Flames)
  // =========================================================================
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
    defs: `
      <linearGradient id="fr_san_fire" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#f97316" />
        <stop offset="70%" stopColor="#ea580c" />
        <stop offset="100%" stopColor="#7c2d12" />
      </linearGradient>
      <linearGradient id="fr_san_stone" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a8a29e" />
        <stop offset="40%" stopColor="#78716c" />
        <stop offset="80%" stopColor="#44403c" />
        <stop offset="100%" stopColor="#1c1917" />
      </linearGradient>
    `,
    auraSvg: `
      <rect x="-10" y="-10" width="120" height="120" rx="30" fill="none" stroke="#ea580c" strokeWidth="5" opacity="0.45" filter="blur(8px)" />
    `,
    borderStroke: `url(#fr_san_fire)`,
    borderStrokeWidth: '10',
    accentStroke: `#fed7aa`,
    heroSvg: `
      {/* ШЕДЕВРАЛЬНЫЙ АРТЕФАКТ: 3D Скульптурная голова Жабы Гамабунты с курительной трубкой кисэру (вынос 35px) */}
      <g transform="translate(18, -34)" filter="drop-shadow(0 10px 18px rgba(0,0,0,0.98))">
        {/* Базальт головы жабы */}
        <ellipse cx="32" cy="22" rx="32" ry="19" fill="url(#fr_san_stone)" stroke="url(#fr_san_fire)" strokeWidth="2.6" />
        
        {/* Золотые выпуклые глаза с горизонтальными зрачками Мудреца */}
        <circle cx="17" cy="12" r="8" fill="#fef08a" stroke="#713f12" strokeWidth="1.6" />
        <line x1="10" y1="12" x2="24" y2="12" stroke="#000000" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="47" cy="12" r="8" fill="#fef08a" stroke="#713f12" strokeWidth="1.6" />
        <line x1="40" y1="12" x2="54" y2="12" stroke="#000000" strokeWidth="3.2" strokeLinecap="round" />
        
        {/* Пасть и бронзовая курительная трубка кисэру */}
        <path d="M 14,29 Q 32,34 50,29" stroke="#0c0a09" strokeWidth="3.8" fill="none" strokeLinecap="round" />
        <path d="M 46,28 L 68,19 L 70,10" stroke="#d97706" strokeWidth="3.8" fill="none" strokeLinecap="round" />
        
        {/* Анимированный поднимающийся дым из трубки */}
        <circle cx="70" cy="5" r="4" fill="#ffffff" opacity="0.8">
          <animate attributeName="r" values="3;7;10" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.3;0" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Вздымающиеся языки пламени жабьего масла по бокам */}
      <g transform="translate(-20, 34)" fill="url(#fr_san_fire)">
        <path d="M 20,0 Q 0,14 10,30 Q -4,20 20,44 Z" />
      </g>
      <g transform="translate(100, 34)" fill="url(#fr_san_fire)">
        <path d="M 0,0 Q 20,14 10,30 Q 24,20 0,44 Z" />
      </g>

      {/* Нижний раскаленный картуш 『油』 (Масло) */}
      <g transform="translate(28, 82)" filter="drop-shadow(0 0 16px #ea580c)">
        <rect x="0" y="0" width="44" height="22" rx="6" fill="#1c0502" stroke="url(#fr_san_fire)" strokeWidth="2.8" />
        <text x="22" y="16" fill="#fed7aa" fontSize="15" fontWeight="900" fontFamily="serif" textAnchor="middle">油</text>
      </g>
    `
  },

  // =========================================================================
  // 7. СУСАНОО ВОЙНЫ (Demonic Tengu Helmet, Giant Curved Horns & Soul Fire)
  // =========================================================================
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
    defs: `
      <linearGradient id="fr_sus_amethyst" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#d8b4fe" />
        <stop offset="70%" stopColor="#9333ea" />
        <stop offset="100%" stopColor="#3b0764" />
      </linearGradient>
      <linearGradient id="fr_sus_horn" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f3e8ff" />
        <stop offset="40%" stopColor="#a855f7" />
        <stop offset="80%" stopColor="#581c87" />
        <stop offset="100%" stopColor="#1e0538" />
      </linearGradient>
      <filter id="fr_sus_glow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#a855f7" floodOpacity="0.95" />
      </filter>
    `,
    auraSvg: `
      <rect x="-12" y="-12" width="124" height="124" rx="32" fill="none" stroke="#9333ea" strokeWidth="6" opacity="0.5" filter="blur(10px)" />
    `,
    borderStroke: `url(#fr_sus_amethyst)`,
    borderStrokeWidth: '10.5',
    accentStroke: `#e9d5ff`,
    heroSvg: `
      {/* КУЛЬМИНАЦИЯ MLBB DEMONLORD: Массивные изогнутые рога шлема Они Тэнгу (вынос 42px!) */}
      <g transform="translate(8, -42)" filter="drop-shadow(0 10px 22px rgba(0,0,0,0.98))">
        {/* Левый рог Они */}
        <path d="M 22,34 C 15,18 -8,-6 -18,-14 C -12,6 2,30 18,40 Z" fill="url(#fr_sus_horn)" stroke="#ffffff" strokeWidth="1.8" />
        {/* Правый рог Они */}
        <path d="M 62,34 C 69,18 92,-6 102,-14 C 96,6 82,30 66,40 Z" fill="url(#fr_sus_horn)" stroke="#ffffff" strokeWidth="1.8" />
        
        {/* Лобный титановый шлем Тэнгу */}
        <polygon points="42,2 56,20 42,42 28,20" fill="url(#fr_sus_amethyst)" stroke="#ffffff" strokeWidth="2.2" />
        
        {/* Горящие желтые глаза демона Сусаноо */}
        <circle cx="35" cy="22" r="3.2" fill="#facc15" filter="drop-shadow(0 0 8px #facc15)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="49" cy="22" r="3.2" fill="#facc15" filter="drop-shadow(0 0 8px #facc15)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Костяные реберные щиты Сусаноо по бокам */}
      <g transform="translate(-22, 14)" fill="none" stroke="url(#fr_sus_amethyst)" strokeWidth="4" strokeLinecap="round" filter="url(#fr_sus_glow)">
        <path d="M 22,0 C 2,8 2,24 22,30" />
        <path d="M 22,26 C 0,34 0,50 22,56" />
        <path d="M 22,52 C 2,60 2,76 22,82" />
      </g>
      <g transform="translate(100, 14)" fill="none" stroke="url(#fr_sus_amethyst)" strokeWidth="4" strokeLinecap="round" filter="url(#fr_sus_glow)">
        <path d="M 0,0 C 20,8 20,24 0,30" />
        <path d="M 0,26 C 22,34 22,50 0,56" />
        <path d="M 0,52 C 20,60 20,76 0,82" />
      </g>

      {/* Нижний аметистовый картуш 『覇』 (Владычество) */}
      <g transform="translate(28, 82)" filter="drop-shadow(0 0 16px #a855f7)">
        <rect x="0" y="0" width="44" height="22" rx="6" fill="#140220" stroke="url(#fr_sus_amethyst)" strokeWidth="2.8" />
        <text x="22" y="16" fill="#f3e8ff" fontSize="15" fontWeight="900" fontFamily="serif" textAnchor="middle">覇</text>
      </g>
    `
  },

  // =========================================================================
  // 8. ИСТИННЫЙ МУДРЕЦ (Branched Dragon Horns & Nature Scroll)
  // =========================================================================
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
    defs: `
      <linearGradient id="fr_sage_gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="25%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>
      <linearGradient id="fr_sage_horn" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#fef08a" />
        <stop offset="80%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#422006" />
      </linearGradient>
    `,
    auraSvg: `
      <rect x="-12" y="-12" width="124" height="124" rx="32" fill="none" stroke="#eab308" strokeWidth="6" opacity="0.5" filter="blur(10px)" />
    `,
    borderStroke: `url(#fr_sage_gold)`,
    borderStrokeWidth: '10.5',
    accentStroke: `#fef08a`,
    heroSvg: `
      {/* Ветвистые золотые рога Дракона Сендзюцу (вынос 40px) */}
      <g transform="translate(6, -40)" filter="drop-shadow(0 10px 18px rgba(0,0,0,0.95))">
        {/* Левый ветвистый рог */}
        <path d="M 26,34 C 20,14 -4,-4 -14,-10 C -10,2 4,18 12,24 C 2,14 -4,6 -8,4 C -4,14 8,28 22,38 Z" fill="url(#fr_sage_horn)" stroke="#ffffff" strokeWidth="1.6" />
        {/* Правый ветвистый рог */}
        <path d="M 62,34 C 68,14 92,-4 102,-10 C 98,2 84,18 76,24 C 86,14 92,6 96,4 C 92,14 80,28 66,38 Z" fill="url(#fr_sage_horn)" stroke="#ffffff" strokeWidth="1.6" />
        {/* Центральный лотос бессмертия */}
        <polygon points="44,10 55,26 44,42 33,26" fill="#10b981" stroke="#fde047" strokeWidth="2" />
        <circle cx="44" cy="26" r="4" fill="#fef08a" />
      </g>

      {/* Оранжевые тени глаз Мудреца Сеннин-мода */}
      <g fill="#ea580c" opacity="0.95">
        <path d="M 0,34 Q -10,45 0,56 Z" />
        <path d="M 100,34 Q 110,45 100,56 Z" />
      </g>

      {/* Нижний свиток природы и картуш 『仙』 (Мудрец) */}
      <g transform="translate(28, 82)" filter="drop-shadow(0 0 16px #eab308)">
        <rect x="0" y="0" width="44" height="22" rx="6" fill="#1c1202" stroke="url(#fr_sage_gold)" strokeWidth="2.8" />
        <text x="22" y="16" fill="#fef08a" fontSize="15" fontWeight="900" fontFamily="serif" textAnchor="middle">仙</text>
      </g>
    `
  },

  // =========================================================================
  // 9. РИННЕГАН ШЕСТИ ПУТЕЙ (6 Black Receiver Rods & Gravitational Rings)
  // =========================================================================
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
    defs: `
      <linearGradient id="fr_rin_nebula" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f5d0fe" />
        <stop offset="35%" stopColor="#c084fc" />
        <stop offset="70%" stopColor="#7e22ce" />
        <stop offset="100%" stopColor="#1e0538" />
      </linearGradient>
      <linearGradient id="fr_rin_rod" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#64748b" />
        <stop offset="40%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
    `,
    auraSvg: `
      {/* Анимированные концентрические кольца гравитации Риннегана */}
      <circle cx="50" cy="50" r="66" fill="none" stroke="#c084fc" strokeWidth="1.4" strokeDasharray="8 4" opacity="0.6">
        <animate attributeName="r" values="64;68;64" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="50" r="76" fill="none" stroke="#e879f9" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.4" />
    `,
    borderStroke: `url(#fr_rin_nebula)`,
    borderStrokeWidth: '10.5',
    accentStroke: `#f0abfc`,
    heroSvg: `
      {/* 6 выступающих черных штырей чакры (вынос 30px) */}
      <g fill="url(#fr_rin_rod)" stroke="#c084fc" strokeWidth="1.6" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.95))">
        {/* Топ-лево */}
        <polygon points="-12,-12 -4,-8 -16,14 -22,10" />
        {/* Топ-право */}
        <polygon points="112,-12 104,-8 116,14 122,10" />
        {/* Середина-лево */}
        <polygon points="-20,44 -8,46 -8,54 -20,56" />
        {/* Середина-право */}
        <polygon points="120,44 108,46 108,54 120,56" />
        {/* Низ-лево */}
        <polygon points="-12,112 -4,108 -16,86 -22,90" />
        {/* Низ-право */}
        <polygon points="112,112 104,108 116,86 122,90" />
      </g>

      {/* Верхнее гравитационное ядро Шинра Тенсей */}
      <g transform="translate(30, -26)" filter="drop-shadow(0 0 18px #c084fc)">
        <circle cx="20" cy="20" r="20" fill="#020617" stroke="url(#fr_rin_nebula)" strokeWidth="3.2" />
        <circle cx="20" cy="20" r="12" fill="none" stroke="#c084fc" strokeWidth="1.6" />
        <circle cx="20" cy="20" r="6" fill="none" stroke="#f0abfc" strokeWidth="1.6" />
        <circle cx="20" cy="20" r="2.5" fill="#ffffff" />
      </g>

      {/* Нижний картуш 『六道』 (Шесть Путей) */}
      <g transform="translate(24, 82)" filter="drop-shadow(0 0 16px #c084fc)">
        <rect x="0" y="0" width="52" height="22" rx="6" fill="#0f011a" stroke="url(#fr_rin_nebula)" strokeWidth="2.8" />
        <text x="26" y="16" fill="#f5d0fe" fontSize="13" fontWeight="900" fontFamily="serif" textAnchor="middle">六道</text>
      </g>
    `
  },

  // =========================================================================
  // 10. ХОКАГЕ КОНОХИ (Ceremonial Hokage Hat, Fire Cloak Flames & Golden Rope)
  // =========================================================================
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
    auraSvg: `
      <rect x="-12" y="-12" width="124" height="124" rx="32" fill="none" stroke="#ef4444" strokeWidth="6" opacity="0.5" filter="blur(10px)" />
    `,
    borderStroke: `url(#fr_hok_crimson)`,
    borderStrokeWidth: '10.5',
    accentStroke: `url(#fr_hok_gold)`,
    heroSvg: `
      {/* ШЕДЕВРАЛЬНЫЙ АРТЕФАКТ: Скульптурная Церемониальная Шляпа Хокаге (вынос 42px!) */}
      <g transform="translate(10, -42)" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.98))">
        {/* Алое основание зонта шляпы */}
        <polygon points="40,-4 -6,26 86,26" fill="url(#fr_hok_crimson)" stroke="#450a0a" strokeWidth="1.6" />
        
        {/* Белый центральный ромбовидный щит с кандзи Огня */}
        <polygon points="40,0 18,26 62,26" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.4" />
        <text x="40" y="21" fill="#b91c1c" fontSize="18" fontWeight="900" fontFamily="serif" textAnchor="middle">火</text>
        
        {/* Спадающие белые полосы ткани плаща по бокам */}
        <path d="M -6,26 L -16,42 L -4,40 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        <path d="M 86,26 L 96,42 L 84,40 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      </g>

      {/* Огненные зубцы плаща Хокаге по бокам */}
      <g transform="translate(-20, 38)" fill="url(#fr_hok_crimson)">
        <polygon points="20,0 2,16 20,20 6,32 20,44" />
      </g>
      <g transform="translate(100, 38)" fill="url(#fr_hok_crimson)">
        <polygon points="0,0 18,16 0,20 14,32 0,44" />
      </g>

      {/* Нижний золотой картуш Хокаге */}
      <g transform="translate(28, 82)" filter="drop-shadow(0 0 16px #ef4444)">
        <rect x="0" y="0" width="44" height="22" rx="6" fill="#1c0205" stroke="url(#fr_hok_gold)" strokeWidth="2.8" />
        <text x="22" y="16" fill="#fca5a5" fontSize="15" fontWeight="900" fontFamily="serif" textAnchor="middle">火</text>
      </g>
    `
  },

  // =========================================================================
  // 11. 👑 ВЕНЕЦ ТВОРЦА (GENESIS CREATOR) — ДЛЯ КИРИЛЛА (askarovkiril5@gmail.com)
  // СВЕРХШЕДЕВР: 5-УРОВНЕВЫЕ КРЫЛЬЯ ДРАКОНА, КОРОНА С РУБИНАМИ И 6 ВРАЩАЮЩИХСЯ СФЕР ГУДОДАМА!
  // =========================================================================
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
    isCreatorExclusive: true,
    defs: `
      <linearGradient id="fr_gen_gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="20%" stopColor="#fef08a" />
        <stop offset="45%" stopColor="#f59e0b" />
        <stop offset="75%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
      <linearGradient id="fr_gen_gold_light" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="fr_gen_gold_dark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="60%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#290e03" />
      </linearGradient>
      <radialGradient id="fr_gen_gudo" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="40%" stopColor="#0f172a" />
        <stop offset="90%" stopColor="#020617" />
        <stop offset="100%" stopColor="#000000" />
      </radialGradient>
      <linearGradient id="fr_gen_rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="25%" stopColor="#eab308" />
        <stop offset="50%" stopColor="#10b981" />
        <stop offset="75%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <filter id="fr_gen_divine" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#fde047" floodOpacity="0.9" />
      </filter>
    `,
    auraSvg: `
      {/* Радужно-призматический космический ореол Творца */}
      <rect x="-10" y="-10" width="120" height="120" rx="32" fill="none" stroke="url(#fr_gen_rainbow)" strokeWidth="5" opacity="0.6" filter="blur(10px)" />
      <circle cx="50" cy="50" r="62" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="6 6" opacity="0.5" />
    `,
    borderStroke: `url(#fr_gen_gold)`,
    borderStrokeWidth: '9.5',
    accentStroke: `url(#fr_gen_rainbow)`,
    heroSvg: `
      {/* 5-УРОВНЕВЫЕ СКУЛЬПТУРНЫЕ КРЫЛЬЯ ДРАКОНА С 3D-ГРАНЯМИ И СВЕТОТЕНЕВЫМ ХРЕБТОМ (MLBB Collector) */}
      {/* Левые крылья */}
      <g filter="url(#fr_gen_divine)">
        {/* Перо 1 (Верхнее) */}
        <path d="M 0,16 C -12,12 -24,4 -30,-6 C -24,8 -12,18 0,22 Z" fill="url(#fr_gen_gold_light)" stroke="#ffffff" strokeWidth="0.8" />
        <path d="M 0,22 C -12,18 -24,8 -30,-6 C -18,12 -8,22 0,26 Z" fill="url(#fr_gen_gold_dark)" />
        {/* Перо 2 */}
        <path d="M 0,28 C -14,24 -28,18 -34,8 C -26,20 -14,28 0,34 Z" fill="url(#fr_gen_gold_light)" stroke="#fef08a" strokeWidth="0.8" />
        <path d="M 0,34 C -14,28 -26,20 -34,8 C -20,22 -8,32 0,38 Z" fill="url(#fr_gen_gold_dark)" />
        {/* Перо 3 (Центральное, самое длинное) */}
        <path d="M 0,40 C -16,38 -32,32 -38,24 C -28,34 -16,42 0,46 Z" fill="url(#fr_gen_gold_light)" stroke="#ffffff" strokeWidth="1" />
        <path d="M 0,46 C -16,42 -28,34 -38,24 C -22,36 -10,46 0,52 Z" fill="url(#fr_gen_gold_dark)" />
        {/* Перо 4 */}
        <path d="M 0,54 C -14,52 -28,48 -32,42 C -24,50 -12,56 0,60 Z" fill="url(#fr_gen_gold_light)" stroke="#fef08a" strokeWidth="0.8" />
        <path d="M 0,60 C -12,56 -24,50 -32,42 C -18,52 -8,60 0,64 Z" fill="url(#fr_gen_gold_dark)" />
        {/* Перо 5 (Нижнее) */}
        <path d="M 0,66 C -10,66 -20,64 -24,60 C -16,66 -8,70 0,72 Z" fill="url(#fr_gen_gold_light)" stroke="#ffffff" strokeWidth="0.6" />
        <path d="M 0,72 C -8,70 -16,66 -24,60 C -12,66 -4,72 0,76 Z" fill="url(#fr_gen_gold_dark)" />
      </g>

      {/* Правые крылья */}
      <g filter="url(#fr_gen_divine)">
        {/* Перо 1 */}
        <path d="M 100,16 C 112,12 124,4 130,-6 C 124,8 112,18 100,22 Z" fill="url(#fr_gen_gold_light)" stroke="#ffffff" strokeWidth="0.8" />
        <path d="M 100,22 C 112,18 124,8 130,-6 C 118,12 108,22 100,26 Z" fill="url(#fr_gen_gold_dark)" />
        {/* Перо 2 */}
        <path d="M 100,28 C 114,24 128,18 134,8 C 126,20 114,28 100,34 Z" fill="url(#fr_gen_gold_light)" stroke="#fef08a" strokeWidth="0.8" />
        <path d="M 100,34 C 114,28 126,20 134,8 C 120,22 108,32 100,38 Z" fill="url(#fr_gen_gold_dark)" />
        {/* Перо 3 (Центральное) */}
        <path d="M 100,40 C 116,38 132,32 138,24 C 128,34 116,42 100,46 Z" fill="url(#fr_gen_gold_light)" stroke="#ffffff" strokeWidth="1" />
        <path d="M 100,46 C 116,42 128,34 138,24 C 122,36 110,46 100,52 Z" fill="url(#fr_gen_gold_dark)" />
        {/* Перо 4 */}
        <path d="M 100,54 C 114,52 128,48 132,42 C 124,50 112,56 100,60 Z" fill="url(#fr_gen_gold_light)" stroke="#fef08a" strokeWidth="0.8" />
        <path d="M 100,60 C 112,56 124,50 132,42 C 118,52 108,60 100,64 Z" fill="url(#fr_gen_gold_dark)" />
        {/* Перо 5 */}
        <path d="M 100,66 C 110,66 120,64 124,60 C 116,66 108,70 100,72 Z" fill="url(#fr_gen_gold_light)" stroke="#ffffff" strokeWidth="0.6" />
        <path d="M 100,72 C 108,70 116,66 124,60 C 112,66 104,72 100,76 Z" fill="url(#fr_gen_gold_dark)" />
      </g>

      {/* ШЕДЕВРАЛЬНЫЙ АРТЕФАКТ: 3D Ювелирная Корона Создателя (MLBB Collector Crown) */}
      <g transform="translate(18, -36)" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.95))">
        {/* Золотая арка диадемы */}
        <path d="M 2,24 Q 32,16 62,24 L 60,30 Q 32,22 4,30 Z" fill="url(#fr_gen_gold_dark)" stroke="#ca8a04" strokeWidth="1" />
        
        {/* 5 Зубцов короны с гранеными градиентами */}
        {/* Центральный главный зубец */}
        <polygon points="32,-2 40,22 24,22" fill="url(#fr_gen_gold_light)" stroke="#ffffff" strokeWidth="1" />
        <polygon points="32,-2 40,22 32,22" fill="url(#fr_gen_gold_dark)" />
        {/* Левый средний зубец */}
        <polygon points="14,6 22,24 10,24" fill="url(#fr_gen_gold_light)" stroke="#fef08a" strokeWidth="0.8" />
        <polygon points="14,6 22,24 16,24" fill="url(#fr_gen_gold_dark)" />
        {/* Правый средний зубец */}
        <polygon points="50,6 54,24 42,24" fill="url(#fr_gen_gold_light)" stroke="#fef08a" strokeWidth="0.8" />
        <polygon points="50,6 54,24 48,24" fill="url(#fr_gen_gold_dark)" />
        {/* Крайний левый зубец */}
        <polygon points="2,14 8,26 0,26" fill="url(#fr_gen_gold_light)" />
        {/* Крайний правый зубец */}
        <polygon points="62,14 64,26 56,26" fill="url(#fr_gen_gold_light)" />

        {/* Большой королевский ограненный рубин Творца в центре */}
        <polygon points="32,2 38,10 32,18 26,10" fill="#ef4444" stroke="#ffffff" strokeWidth="1.2" filter="drop-shadow(0 0 10px #ef4444)" />
        <polygon points="32,2 38,10 32,10" fill="#fca5a5" />
        <polygon points="32,10 38,10 32,18" fill="#991b1b" />
        <polygon points="32,10 26,10 32,18" fill="#450a0a" />
        {/* Сверкающая 4-лучевая звезда-блик на рубине */}
        <polygon points="32,7 33,10 35,10 33,11 32,13 31,11 29,10 31,10" fill="#ffffff" />

        {/* Сапфиры на боковых зубцах */}
        <circle cx="14" cy="10" r="2.8" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.8" filter="drop-shadow(0 0 6px #38bdf8)" />
        <circle cx="50" cy="10" r="2.8" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.8" filter="drop-shadow(0 0 6px #38bdf8)" />
      </g>

      {/* 6 ОРБИТАЛЬНЫХ СФЕР ГУДОДАМА (ВРАЩАЮТСЯ ПО ОРБИТЕ В РЕАЛЬНОМ ВРЕМЕНИ!) */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="14s"
          repeatCount="indefinite"
        />
        <circle cx="50" cy="-14" r="5.5" fill="url(#fr_gen_gudo)" stroke="#fef08a" strokeWidth="1.8" filter="drop-shadow(0 0 8px #fde047)" />
        <circle cx="110" cy="18" r="5" fill="url(#fr_gen_gudo)" stroke="#38bdf8" strokeWidth="1.8" filter="drop-shadow(0 0 8px #38bdf8)" />
        <circle cx="110" cy="82" r="5.5" fill="url(#fr_gen_gudo)" stroke="#fef08a" strokeWidth="1.8" filter="drop-shadow(0 0 8px #fde047)" />
        <circle cx="50" cy="114" r="5" fill="url(#fr_gen_gudo)" stroke="#38bdf8" strokeWidth="1.8" filter="drop-shadow(0 0 8px #38bdf8)" />
        <circle cx="-10" cy="82" r="5.5" fill="url(#fr_gen_gudo)" stroke="#fef08a" strokeWidth="1.8" filter="drop-shadow(0 0 8px #fde047)" />
        <circle cx="-10" cy="18" r="5" fill="url(#fr_gen_gudo)" stroke="#38bdf8" strokeWidth="1.8" filter="drop-shadow(0 0 8px #38bdf8)" />
      </g>

      {/* НИЖНИЙ МОНОЛИТНЫЙ ПОСТАМЕНТ ТВОРЦА 『創世』 (Сотворение) */}
      <g transform="translate(26, 82)" filter="drop-shadow(0 0 16px #fde047)">
        <polygon points="4,0 44,0 48,22 0,22" fill="#080210" stroke="url(#fr_gen_gold)" strokeWidth="2.6" />
        <text x="24" y="16" fill="#fef08a" fontSize="14" fontWeight="900" fontFamily="serif" letterSpacing="2" textAnchor="middle">創世</text>
      </g>
    `
  }
];

let code = `import React from 'react';

/**
 * playerFramesData.jsx
 * Каталог наградных рамок за боевые достижения (Achievement Frames).
 * Выполнены по высшему стандарту Mobile Legends: Bang Bang (MLBB Masterpiece Edition):
 * - Чистый нативный контейнер аватара (100% четкость и яркость, без перекрытий!)
 * - Скульптурный силуэтный вынос (viewBox="-35 -35 170 170", overflow-visible)
 * - Настоящие 3D-артефакты: шляпа Хокаге, маска АНБУ, драконьи крылья, рога они Сусаноо, корона Творца
 * - Живые SVG-анимации: вращающиеся сферы Гудодама, молнии Райкири, дым трубки, пульсирующие рубины
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
    renderFrame: (avatarContent, sizeClass = "w-16 h-16", extraBadge = null) => (
      <div 
        className={\`relative \${sizeClass} shrink-0 select-none flex items-center justify-center overflow-visible group\`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 1. Слой АВАТАРА (Полноразмерный, глубокий, кристально четкий) */}
        <div 
          className="absolute inset-[3px] rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center shadow-inner"
          style={{ transform: 'translateZ(0px)' }}
        >
          {avatarContent}
          {/* Внутренняя тень фаски посадки аватара */}
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.85)] pointer-events-none" />
        </div>

        {/* 2. Навесной 3D SVG ОВЕРЛЕЙ (Никогда не перекрывает аватар, fill="none"!) */}
        <svg 
          viewBox="-35 -35 170 170" 
          className="absolute pointer-events-none overflow-visible"
          style={{ 
            left: '-35%', 
            top: '-35%', 
            width: '170%', 
            height: '170%', 
            transform: 'translateZ(20px)' 
          }}
        >
          <defs>
            ${f.defs}
          </defs>

          {/* Слой АУРЫ под рамкой */}
          ${f.auraSvg}

          {/* Основной литой каркас рамки (ТОЛЬКО STROKE, АВАТАР ВСЕГДА ВИДЕН!) */}
          <rect 
            x="2" y="2" width="96" height="96" rx="20" 
            fill="none" 
            stroke="${f.borderStroke}" 
            strokeWidth="${f.borderStrokeWidth}" 
          />
          <rect 
            x="5.5" y="5.5" width="89" height="89" rx="17" 
            fill="none" 
            stroke="${f.accentStroke}" 
            strokeWidth="1.2" 
            opacity="0.85" 
          />

          {/* Скульптурные 3D-артефакты героя (MLBB Hero Props) с массивным выносом */}
          ${f.heroSvg}
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
console.log('Successfully generated Ultra-AAA MLBB Masterpiece frames at:', outputPath);
