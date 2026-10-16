const fs = require('fs');
const path = require('path');

// ============================================================================
// ULTRA-AAA MASTERPIECE FRAMES GENERATOR (Mobile Legends Divine Edition)
// ============================================================================
// Каждая из 11 наградных рамок — это высокодетализированная 3D векторная
// скульптура с анимированными стихийными ядрами (пламя, молнии, дым, гравитация,
// орбитальные сферы Гудодама), чеканными металлическими фасками и массивным
// силуэтным выносом (viewBox="-32 -32 164 164").

const FRAMES_DATA = [
  // =========================================================================
  // 1. АКАДЕМИЯ ЛИСТА (Hinoki Wood Grain, Stitched Leather Belt & Dewy Jade Leaf)
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
        <stop offset="0%" stopColor="#92400e" />
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
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="40%" stopColor="#9a3412" />
        <stop offset="80%" stopColor="#7c2d12" />
        <stop offset="100%" stopColor="#2e0d05" />
      </linearGradient>
      <linearGradient id="fr_acad_jade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a7f3d0" />
        <stop offset="40%" stopColor="#10b981" />
        <stop offset="80%" stopColor="#047857" />
        <stop offset="100%" stopColor="#022c22" />
      </linearGradient>
      <filter id="fr_acad_shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="5" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.85" />
      </filter>
    `,
    bgSvg: `
      {/* Мягкий изумрудно-янтарный ореол чакры природы */}
      <rect x="-10" y="-10" width="120" height="120" rx="30" fill="none" stroke="#10b981" strokeWidth="5" opacity="0.35" filter="blur(8px)" />
      <circle cx="50" cy="50" r="56" fill="none" stroke="#ca8a04" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
    `,
    chassisSvg: `
      {/* Тяжелый кованый каркас из дерева Хиноки */}
      <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#fr_acad_wood)" stroke="url(#fr_acad_brass)" strokeWidth="3.2" filter="url(#fr_acad_shadow)" />
      <rect x="5.5" y="5.5" width="89" height="89" rx="18.5" fill="none" stroke="#fef08a" strokeWidth="0.8" opacity="0.5" />
      <rect x="8" y="8" width="84" height="84" rx="16" fill="none" stroke="#10b981" strokeWidth="1.2" opacity="0.6" strokeDasharray="5 3" />
      
      {/* 4 Литые латунные угловые скобы с полированными заклепками */}
      <g fill="url(#fr_acad_brass)">
        {/* Топ-лево */}
        <polygon points="3,3 20,3 20,8 8,8 8,20 3,20" />
        <circle cx="12" cy="12" r="1.8" fill="#fef08a" stroke="#422006" strokeWidth="0.6" />
        {/* Топ-право */}
        <polygon points="97,3 80,3 80,8 92,8 92,20 97,20" />
        <circle cx="88" cy="12" r="1.8" fill="#fef08a" stroke="#422006" strokeWidth="0.6" />
        {/* Низ-лево */}
        <polygon points="3,97 20,97 20,92 8,92 8,80 3,80" />
        <circle cx="12" cy="88" r="1.8" fill="#fef08a" stroke="#422006" strokeWidth="0.6" />
        {/* Низ-право */}
        <polygon points="97,97 80,97 80,92 92,92 92,80 97,80" />
        <circle cx="88" cy="88" r="1.8" fill="#fef08a" stroke="#422006" strokeWidth="0.6" />
      </g>
    `,
    propsSvg: `
      {/* Топ-Право: Светящийся Нефритовый Лист Конохи с росой (вынос 22px) */}
      <g transform="translate(82, -14)" filter="drop-shadow(0 0 10px #10b981)">
        <path d="M 0,26 C 12,6 30,-4 36,-12 C 26,8 18,22 8,28 C 3,30 0,30 0,26 Z" fill="url(#fr_acad_jade)" stroke="#fef08a" strokeWidth="1.4" />
        <path d="M 2,-10 Q 14,8 8,24" stroke="#a7f3d0" strokeWidth="1" fill="none" />
        {/* Анимированная капля росы */}
        <circle cx="20" cy="2" r="2.5" fill="#ffffff" opacity="0.95">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Низ-Лево: Прошитый кожаный ремень шиноби с латунной пряжкой (вынос 18px) */}
      <g transform="translate(-18, 72)" filter="url(#fr_acad_shadow)">
        <path d="M 0,22 L 42,-4 L 50,8 L 8,34 Z" fill="url(#fr_acad_leather)" stroke="#2e0d05" strokeWidth="1.2" />
        {/* Стежки нити */}
        <line x1="2" y1="23" x2="40" y2="-3" stroke="#fef08a" strokeWidth="0.8" strokeDasharray="3 2" />
        <line x1="6" y1="32" x2="48" y2="6" stroke="#fef08a" strokeWidth="0.8" strokeDasharray="3 2" />
        {/* Латунная массивная пряжка с язычком */}
        <g transform="rotate(-32 24 15)">
          <rect x="14" y="6" width="20" height="18" rx="4" fill="none" stroke="url(#fr_acad_brass)" strokeWidth="3.5" />
          <line x1="18" y1="15" x2="30" y2="15" stroke="url(#fr_acad_brass)" strokeWidth="3" strokeLinecap="round" />
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
        <stop offset="25%" stopColor="#cbd5e1" />
        <stop offset="60%" stopColor="#475569" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="fr_genin_cyan" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bae6fd" />
        <stop offset="40%" stopColor="#38bdf8" />
        <stop offset="80%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#082f49" />
      </linearGradient>
      <filter id="fr_genin_glow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38bdf8" floodOpacity="0.85" />
      </filter>
    `,
    bgSvg: `
      <rect x="-12" y="-12" width="124" height="124" rx="32" fill="none" stroke="#0284c7" strokeWidth="5" opacity="0.45" filter="blur(8px)" />
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#060c18" stroke="url(#fr_genin_steel)" strokeWidth="3.6" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#38bdf8" strokeWidth="1.4" opacity="0.85" />
    `,
    propsSvg: `
      {/* Левые тройные острые клинки-крылья куная (вынос 26px) */}
      <g transform="translate(-28, 22)" filter="url(#fr_genin_glow)">
        <polygon points="26,10 2,20 26,28 30,19" fill="url(#fr_genin_steel)" stroke="#e2e8f0" strokeWidth="1.2" />
        <polygon points="28,-4 0,6 28,16 32,6" fill="url(#fr_genin_steel)" stroke="#38bdf8" strokeWidth="1.5" />
        <polygon points="26,26 4,38 26,44 30,35" fill="url(#fr_genin_steel)" stroke="#e2e8f0" strokeWidth="1.2" />
        <line x1="2" y1="6" x2="30" y2="6" stroke="#ffffff" strokeWidth="1.5" />
      </g>

      {/* Правые тройные острые клинки-крылья куная (вынос 26px) */}
      <g transform="translate(98, 22)" filter="url(#fr_genin_glow)">
        <polygon points="4,10 28,20 4,28 0,19" fill="url(#fr_genin_steel)" stroke="#e2e8f0" strokeWidth="1.2" />
        <polygon points="2,-4 30,6 2,16 -2,6" fill="url(#fr_genin_steel)" stroke="#38bdf8" strokeWidth="1.5" />
        <polygon points="4,26 26,38 4,44 0,35" fill="url(#fr_genin_steel)" stroke="#e2e8f0" strokeWidth="1.2" />
        <line x1="2" y1="6" x2="30" y2="6" stroke="#ffffff" strokeWidth="1.5" />
      </g>

      {/* Топ-навершие: Стальной протектор Конохи со шрамом и заклепками */}
      <g transform="translate(14, -18)" filter="drop-shadow(0 6px 8px rgba(0,0,0,0.95))">
        <rect x="0" y="0" width="72" height="24" rx="7" fill="url(#fr_genin_steel)" stroke="#ffffff" strokeWidth="1.6" />
        <circle cx="7" cy="12" r="2.6" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="65" cy="12" r="2.6" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
        {/* Выгравированный знак Листа */}
        <path d="M 32,15 C 33,9 39,7 44,8 C 41,13 36,17 31,16 C 28,15 27,10 31,8 C 36,5 43,6 47,11" fill="none" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" />
        <polygon points="44,8 48,6 47,10" fill="#0f172a" />
        {/* Боевой глубокий шрам через пластину */}
        <line x1="22" y1="2" x2="36" y2="22" stroke="#020617" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="22.5" y1="2.5" x2="36.5" y2="22.5" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" />
      </g>

      {/* Нижний граненый лазурный кристалл в зубчатой оправе */}
      <g transform="translate(36, 84)" filter="drop-shadow(0 0 14px #38bdf8)">
        <polygon points="14,-2 28,10 14,24 0,10" fill="url(#fr_genin_cyan)" stroke="#ffffff" strokeWidth="1.6" />
        <polygon points="14,2 22,10 14,19 6,10" fill="#bae6fd" opacity="0.75" />
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
    bgSvg: `
      <rect x="-10" y="-10" width="120" height="120" rx="30" fill="none" stroke="#22c55e" strokeWidth="4" opacity="0.35" filter="blur(8px)" />
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#fr_chun_tactical)" stroke="url(#fr_chun_gold)" strokeWidth="3.6" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#4ade80" strokeWidth="1.4" opacity="0.8" />
    `,
    propsSvg: `
      {/* Боковые золотые шевроны чунина (MLBB Officer Chevrons) */}
      <g transform="translate(-18, 22)" fill="url(#fr_chun_gold)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">
        <polygon points="20,0 4,9 20,18 15,9" stroke="#ffffff" strokeWidth="0.8" />
        <polygon points="20,20 4,29 20,38 15,29" stroke="#ffffff" strokeWidth="0.8" />
        <polygon points="20,40 4,49 20,58 15,49" stroke="#ffffff" strokeWidth="0.8" />
      </g>
      <g transform="translate(98, 22)" fill="url(#fr_chun_gold)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">
        <polygon points="0,0 16,9 0,18 5,9" stroke="#ffffff" strokeWidth="0.8" />
        <polygon points="0,20 16,29 0,38 5,29" stroke="#ffffff" strokeWidth="0.8" />
        <polygon points="0,40 16,49 0,58 5,49" stroke="#ffffff" strokeWidth="0.8" />
      </g>

      {/* Верхний картуш со скрещенными кунаями и рубиновым шнуром */}
      <g transform="translate(26, -18)" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.95))">
        <polygon points="0,22 48,22 42,0 6,0" fill="url(#fr_chun_gold)" stroke="#ffffff" strokeWidth="1.2" />
        <line x1="8" y1="3" x2="40" y2="19" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
        <line x1="8" y1="3" x2="40" y2="19" stroke="#e2e8f0" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="40" y1="3" x2="8" y2="19" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
        <line x1="40" y1="3" x2="8" y2="19" stroke="#e2e8f0" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="24" cy="11" r="3" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
      </g>

      {/* Нижний тяжелый золотой орден 『忍』 (Шиноби) с лавровыми ветвями */}
      <g transform="translate(30, 84)" filter="drop-shadow(0 0 12px #eab308)">
        <rect x="0" y="0" width="40" height="20" rx="6" fill="#071b0e" stroke="url(#fr_chun_gold)" strokeWidth="2.4" />
        <text x="20" y="15" fill="#fef08a" fontSize="14" fontWeight="900" fontFamily="serif" textAnchor="middle">忍</text>
      </g>
    `
  },

  // =========================================================================
  // 4. ДЖОНИН КОНОХИ (Flying Thunder God Silver Wings & Raikiri Lightning)
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
        <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#60a5fa" floodOpacity="0.9" />
      </filter>
    `,
    bgSvg: `
      {/* Анимированные зигзагообразные молнии Райкири */}
      <g stroke="#67e8f9" strokeWidth="2" fill="none" opacity="0.85" filter="url(#fr_jonin_lightning)">
        <path d="M -16,10 L -4,26 L -12,38 L -2,56 L -10,74 L -2,90">
          <animate attributeName="opacity" values="0.4;1;0.3;0.9;0.4" dur="1s" repeatCount="indefinite" />
        </path>
        <path d="M 116,10 L 104,26 L 112,38 L 102,56 L 110,74 L 102,90">
          <animate attributeName="opacity" values="0.9;0.3;1;0.4;0.9" dur="1s" repeatCount="indefinite" />
        </path>
      </g>
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#040816" stroke="url(#fr_jonin_silver)" strokeWidth="3.8" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#38bdf8" strokeWidth="1.6" />
    `,
    propsSvg: `
      {/* Массивные серебряные крылья Хирайшина с формулой телепортации (вынос 30px) */}
      <g transform="translate(-30, 12)" filter="url(#fr_jonin_lightning)">
        <polygon points="30,0 2,22 30,30" fill="url(#fr_jonin_silver)" stroke="#ffffff" strokeWidth="1.4" />
        <polygon points="30,24 6,46 30,54" fill="url(#fr_jonin_silver)" stroke="#67e8f9" strokeWidth="1.4" />
        <polygon points="30,48 12,68 30,76" fill="url(#fr_jonin_silver)" stroke="#ffffff" strokeWidth="1.4" />
        <line x1="2" y1="22" x2="30" y2="22" stroke="#ffffff" strokeWidth="1.8" />
      </g>
      <g transform="translate(100, 12)" filter="url(#fr_jonin_lightning)">
        <polygon points="0,0 28,22 0,30" fill="url(#fr_jonin_silver)" stroke="#ffffff" strokeWidth="1.4" />
        <polygon points="0,24 24,46 0,54" fill="url(#fr_jonin_silver)" stroke="#67e8f9" strokeWidth="1.4" />
        <polygon points="0,48 18,68 0,76" fill="url(#fr_jonin_silver)" stroke="#ffffff" strokeWidth="1.4" />
        <line x1="0" y1="22" x2="28" y2="22" stroke="#ffffff" strokeWidth="1.8" />
      </g>

      {/* Верхнее навершие: Барабан Райдзина с трёхлучевой звездой Минато */}
      <g transform="translate(34, -20)" filter="drop-shadow(0 0 12px #38bdf8)">
        <circle cx="16" cy="16" r="16" fill="#040816" stroke="url(#fr_jonin_silver)" strokeWidth="2.5" />
        <polygon points="16,2 20,12 30,16 20,20 16,30 12,20 2,16 12,12" fill="#38bdf8" />
        <circle cx="16" cy="16" r="4" fill="#ffffff" />
      </g>

      {/* Нижний граненый сапфир в золотых когтях */}
      <g transform="translate(36, 84)" filter="drop-shadow(0 0 16px #3b82f6)">
        <polygon points="14,-3 28,9 14,24 0,9" fill="url(#fr_jonin_sapphire)" stroke="#ffffff" strokeWidth="1.8" />
        <polygon points="14,1 22,9 14,18 6,9" fill="#bfdbfe" opacity="0.8" />
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
    bgSvg: `
      <rect x="-12" y="-12" width="124" height="124" rx="32" fill="none" stroke="#e11d48" strokeWidth="5" opacity="0.4" filter="blur(10px)" />
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#0c0205" stroke="url(#fr_anbu_blood)" strokeWidth="4" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#fecdd3" strokeWidth="1.2" opacity="0.75" />
    `,
    propsSvg: `
      {/* Левые обсидиановые перья теней */}
      <g transform="translate(-20, 26)" fill="#1c050b" stroke="#e11d48" strokeWidth="1.2">
        <path d="M 20,0 C 4,12 -2,28 4,38 C 10,28 18,14 20,0 Z" />
        <path d="M 20,24 C 6,34 0,48 6,58 C 12,48 18,36 20,24 Z" />
      </g>

      {/* ШЕДЕВРАЛЬНЫЙ АРТЕФАКТ: Скульптурная фарфоровая маска Лиса Кицунэ (вынос 38px) */}
      <g transform="translate(64, -28)" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.98))">
        {/* Черные кончики ушей */}
        <polygon points="6,12 16,-10 24,10" fill="url(#fr_anbu_porcelain)" stroke="#be123c" strokeWidth="1.4" />
        <polygon points="12,4 16,-8 20,4" fill="#0f172a" />
        <polygon points="30,10 38,-10 46,12" fill="url(#fr_anbu_porcelain)" stroke="#be123c" strokeWidth="1.4" />
        <polygon points="34,4 38,-8 42,4" fill="#0f172a" />
        
        {/* Фарфоровый череп маски */}
        <path d="M 4,14 C 2,30 12,46 26,52 C 40,46 50,30 48,14 C 36,8 16,8 4,14 Z" fill="url(#fr_anbu_porcelain)" stroke="#020617" strokeWidth="1.8" />
        
        {/* Ритуальные алые контуры глаз */}
        <path d="M 10,24 Q 18,19 23,25 Q 18,29 10,24 Z" fill="#be123c" />
        <path d="M 42,24 Q 34,19 29,25 Q 34,29 42,24 Z" fill="#be123c" />
        <circle cx="17" cy="24" r="1.5" fill="#ffffff" />
        <circle cx="35" cy="24" r="1.5" fill="#ffffff" />
        
        {/* Алая каллиграфия носа и усов */}
        <line x1="26" y1="22" x2="26" y2="38" stroke="#be123c" strokeWidth="2" strokeLinecap="round" />
        <circle cx="26" cy="42" r="2.5" fill="#020617" />
        <path d="M 8,36 Q 16,38 20,40" stroke="#be123c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 44,36 Q 36,38 32,40" stroke="#be123c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>

      {/* Низ-лево: Ограненный рубин крови */}
      <g transform="translate(6, 84)" filter="drop-shadow(0 0 12px #e11d48)">
        <polygon points="10,0 20,10 10,22 0,10" fill="url(#fr_anbu_blood)" stroke="#ffffff" strokeWidth="1.4" />
        <polygon points="10,3 16,10 10,17 4,10" fill="#fecdd3" opacity="0.8" />
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
    bgSvg: `
      <rect x="-14" y="-14" width="128" height="128" rx="34" fill="none" stroke="#ea580c" strokeWidth="5" opacity="0.45" filter="blur(10px)" />
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#140602" stroke="url(#fr_san_fire)" strokeWidth="4.2" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#fed7aa" strokeWidth="1.4" opacity="0.85" />
    `,
    propsSvg: `
      {/* ШЕДЕВРАЛЬНЫЙ АРТЕФАКТ: 3D Скульптурная голова Жабы Гамабунты с курительной трубкой кисэру */}
      <g transform="translate(20, -30)" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.98))">
        {/* Базальт головы жабы */}
        <ellipse cx="30" cy="20" rx="30" ry="18" fill="url(#fr_san_stone)" stroke="url(#fr_san_fire)" strokeWidth="2.4" />
        
        {/* Золотые выпуклые глаза с горизонтальными зрачками Мудреца */}
        <circle cx="16" cy="11" r="7.5" fill="#fef08a" stroke="#713f12" strokeWidth="1.5" />
        <line x1="10" y1="11" x2="22" y2="11" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        <circle cx="44" cy="11" r="7.5" fill="#fef08a" stroke="#713f12" strokeWidth="1.5" />
        <line x1="38" y1="11" x2="50" y2="11" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        
        {/* Пасть и бронзовая курительная трубка кисэру */}
        <path d="M 12,27 Q 30,32 48,27" stroke="#0c0a09" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M 44,26 L 64,18 L 66,10" stroke="#d97706" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        
        {/* Анимированный поднимающийся дым из трубки */}
        <circle cx="66" cy="6" r="3.5" fill="#ffffff" opacity="0.8">
          <animate attributeName="r" values="3;6;9" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.3;0" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Вздымающиеся языки пламени жабьего масла по бокам */}
      <g transform="translate(-18, 36)" fill="url(#fr_san_fire)">
        <path d="M 18,0 Q 0,14 8,28 Q -4,18 18,42 Z" />
      </g>
      <g transform="translate(100, 36)" fill="url(#fr_san_fire)">
        <path d="M 0,0 Q 18,14 10,28 Q 22,18 0,42 Z" />
      </g>

      {/* Нижний раскаленный картуш 『油』 (Масло) */}
      <g transform="translate(30, 84)" filter="drop-shadow(0 0 16px #ea580c)">
        <rect x="0" y="0" width="40" height="20" rx="6" fill="#1c0502" stroke="url(#fr_san_fire)" strokeWidth="2.5" />
        <text x="20" y="15" fill="#fed7aa" fontSize="14" fontWeight="900" fontFamily="serif" textAnchor="middle">油</text>
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
        <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#a855f7" floodOpacity="0.9" />
      </filter>
    `,
    bgSvg: `
      <rect x="-16" y="-16" width="132" height="132" rx="36" fill="none" stroke="#9333ea" strokeWidth="6" opacity="0.5" filter="blur(12px)" />
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#0c0214" stroke="url(#fr_sus_amethyst)" strokeWidth="4.4" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#e9d5ff" strokeWidth="1.6" />
    `,
    propsSvg: `
      {/* КУЛЬМИНАЦИЯ MLBB DEMONLORD: Массивные изогнутые рога шлема Они Тэнгу (вынос 42px!) */}
      <g transform="translate(10, -38)" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.98))">
        {/* Левый рог Они */}
        <path d="M 20,32 C 14,16 -6,-6 -16,-12 C -10,6 2,28 16,38 Z" fill="url(#fr_sus_horn)" stroke="#ffffff" strokeWidth="1.6" />
        {/* Правый рог Они */}
        <path d="M 60,32 C 66,16 86,-6 96,-12 C 90,6 78,28 64,38 Z" fill="url(#fr_sus_horn)" stroke="#ffffff" strokeWidth="1.6" />
        
        {/* Лобный титановый шлем Тэнгу с анимированными глазами демона */}
        <polygon points="40,2 54,18 40,40 26,18" fill="url(#fr_sus_amethyst)" stroke="#ffffff" strokeWidth="2" />
        
        {/* Горящие желтые глаза демона Сусаноо */}
        <circle cx="34" cy="20" r="3" fill="#facc15" filter="drop-shadow(0 0 6px #facc15)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="46" cy="20" r="3" fill="#facc15" filter="drop-shadow(0 0 6px #facc15)">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Костяные реберные щиты Сусаноо по бокам */}
      <g transform="translate(-20, 16)" fill="none" stroke="url(#fr_sus_amethyst)" strokeWidth="3.6" strokeLinecap="round" filter="url(#fr_sus_glow)">
        <path d="M 20,0 C 2,8 2,22 20,28" />
        <path d="M 20,24 C 0,32 0,46 20,52" />
        <path d="M 20,48 C 2,56 2,70 20,76" />
      </g>
      <g transform="translate(100, 16)" fill="none" stroke="url(#fr_sus_amethyst)" strokeWidth="3.6" strokeLinecap="round" filter="url(#fr_sus_glow)">
        <path d="M 0,0 C 18,8 18,22 0,28" />
        <path d="M 0,24 C 20,32 20,46 0,52" />
        <path d="M 0,48 C 20,56 20,70 0,76" />
      </g>

      {/* Нижний аметистовый картуш 『覇』 (Владычество) */}
      <g transform="translate(30, 84)" filter="drop-shadow(0 0 16px #a855f7)">
        <rect x="0" y="0" width="40" height="20" rx="6" fill="#140220" stroke="url(#fr_sus_amethyst)" strokeWidth="2.6" />
        <text x="20" y="15" fill="#f3e8ff" fontSize="14" fontWeight="900" fontFamily="serif" textAnchor="middle">覇</text>
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
    bgSvg: `
      <rect x="-16" y="-16" width="132" height="132" rx="36" fill="none" stroke="#eab308" strokeWidth="6" opacity="0.5" filter="blur(12px)" />
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#140d02" stroke="url(#fr_sage_gold)" strokeWidth="4.4" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#fef08a" strokeWidth="1.6" />
    `,
    propsSvg: `
      {/* Ветвистые золотые рога Дракона Сендзюцу (вынос 38px) */}
      <g transform="translate(8, -36)" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.95))">
        {/* Левый ветвистый рог */}
        <path d="M 24,32 C 18,12 -2,-4 -12,-8 C -8,2 4,18 12,22 C 2,12 -4,4 -8,2 C -4,12 8,26 20,36 Z" fill="url(#fr_sage_horn)" stroke="#ffffff" strokeWidth="1.5" />
        {/* Правый ветвистый рог */}
        <path d="M 60,32 C 66,12 86,-4 96,-8 C 92,2 80,18 72,22 C 82,12 88,4 92,2 C 88,12 76,26 64,36 Z" fill="url(#fr_sage_horn)" stroke="#ffffff" strokeWidth="1.5" />
        {/* Центральный лотос бессмертия */}
        <polygon points="42,10 52,24 42,38 32,24" fill="#10b981" stroke="#fde047" strokeWidth="1.8" />
        <circle cx="42" cy="24" r="3.5" fill="#fef08a" />
      </g>

      {/* Оранжевые тени глаз Мудреца Сеннин-мода */}
      <g fill="#ea580c" opacity="0.9">
        <path d="M 2,34 Q -8,45 2,56 Z" />
        <path d="M 98,34 Q 108,45 98,56 Z" />
      </g>

      {/* Нижний свиток природы и картуш 『仙』 (Мудрец) */}
      <g transform="translate(30, 84)" filter="drop-shadow(0 0 16px #eab308)">
        <rect x="0" y="0" width="40" height="20" rx="6" fill="#1c1202" stroke="url(#fr_sage_gold)" strokeWidth="2.6" />
        <text x="20" y="15" fill="#fef08a" fontSize="14" fontWeight="900" fontFamily="serif" textAnchor="middle">仙</text>
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
    bgSvg: `
      {/* Анимированные концентрические кольца гравитации Риннегана */}
      <circle cx="50" cy="50" r="64" fill="none" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="8 4" opacity="0.5">
        <animate attributeName="r" values="62;66;62" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="50" r="74" fill="none" stroke="#e879f9" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.4" />
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#08020e" stroke="url(#fr_rin_nebula)" strokeWidth="4.6" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="#f0abfc" strokeWidth="1.6" />
    `,
    propsSvg: `
      {/* 6 выступающих черных штырей чакры (вынос 28px) */}
      <g fill="url(#fr_rin_rod)" stroke="#c084fc" strokeWidth="1.4" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.9))">
        {/* Топ-лево */}
        <polygon points="-10,-10 -2,-6 -14,12 -20,8" />
        {/* Топ-право */}
        <polygon points="110,-10 102,-6 114,12 120,8" />
        {/* Середина-лево */}
        <polygon points="-18,45 -8,47 -8,53 -18,55" />
        {/* Середина-право */}
        <polygon points="118,45 108,47 108,53 118,55" />
        {/* Низ-лево */}
        <polygon points="-10,110 -2,106 -14,88 -20,92" />
        {/* Низ-право */}
        <polygon points="110,110 102,106 114,88 120,92" />
      </g>

      {/* Верхнее гравитационное ядро Шинра Тенсей */}
      <g transform="translate(32, -22)" filter="drop-shadow(0 0 16px #c084fc)">
        <circle cx="18" cy="18" r="18" fill="#020617" stroke="url(#fr_rin_nebula)" strokeWidth="3" />
        <circle cx="18" cy="18" r="11" fill="none" stroke="#c084fc" strokeWidth="1.5" />
        <circle cx="18" cy="18" r="5.5" fill="none" stroke="#f0abfc" strokeWidth="1.5" />
        <circle cx="18" cy="18" r="2.2" fill="#ffffff" />
      </g>

      {/* Нижний картуш 『六道』 (Шесть Путей) */}
      <g transform="translate(26, 84)" filter="drop-shadow(0 0 16px #c084fc)">
        <rect x="0" y="0" width="48" height="20" rx="6" fill="#0f011a" stroke="url(#fr_rin_nebula)" strokeWidth="2.6" />
        <text x="24" y="15" fill="#f5d0fe" fontSize="12" fontWeight="900" fontFamily="serif" textAnchor="middle">六道</text>
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
    bgSvg: `
      <rect x="-16" y="-16" width="132" height="132" rx="36" fill="none" stroke="#ef4444" strokeWidth="6" opacity="0.5" filter="blur(12px)" />
    `,
    chassisSvg: `
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#140204" stroke="url(#fr_hok_crimson)" strokeWidth="4.6" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="url(#fr_hok_gold)" strokeWidth="1.8" />
    `,
    propsSvg: `
      {/* ШЕДЕВРАЛЬНЫЙ АРТЕФАКТ: Скульптурная Церемониальная Шляпа Хокаге (вынос 42px) */}
      <g transform="translate(14, -38)" filter="drop-shadow(0 10px 18px rgba(0,0,0,0.98))">
        {/* Алое основание зонта шляпы */}
        <polygon points="36,-4 -4,24 76,24" fill="url(#fr_hok_crimson)" stroke="#450a0a" strokeWidth="1.5" />
        
        {/* Белый центральный ромбовидный щит с кандзи Огня */}
        <polygon points="36,0 18,24 54,24" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" />
        <text x="36" y="19" fill="#b91c1c" fontSize="16" fontWeight="900" fontFamily="serif" textAnchor="middle">火</text>
        
        {/* Спадающие белые полосы ткани плаща по бокам */}
        <path d="M -4,24 L -12,38 L -2,36 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        <path d="M 76,24 L 84,38 L 74,36 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
      </g>

      {/* Огненные зубцы плаща Хокаге по бокам */}
      <g transform="translate(-18, 40)" fill="url(#fr_hok_crimson)">
        <polygon points="18,0 2,14 18,18 6,28 18,38" />
      </g>
      <g transform="translate(100, 40)" fill="url(#fr_hok_crimson)">
        <polygon points="0,0 16,14 0,18 12,28 0,38" />
      </g>

      {/* Нижний золотой картуш Хокаге */}
      <g transform="translate(30, 84)" filter="drop-shadow(0 0 16px #ef4444)">
        <rect x="0" y="0" width="40" height="20" rx="6" fill="#1c0205" stroke="url(#fr_hok_gold)" strokeWidth="2.6" />
        <text x="20" y="15" fill="#fca5a5" fontSize="14" fontWeight="900" fontFamily="serif" textAnchor="middle">火</text>
      </g>
    `
  },

  // =========================================================================
  // 11. 👑 ВЕНЕЦ ТВОРЦА (GENESIS CREATOR) — ДЛЯ КИРИЛЛА (askarovkiril5@gmail.com)
  // СВЕРХШЕДЕВР: 5-УРОВНЕВЫЕ КРЫЛЬЯ ДРАКОНА, КОРОНА С РУБИНАМИ И 6 ОРБИТАЛЬНЫХ СФЕР ГУДОДАМА!
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
        <stop offset="25%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#eab308" />
        <stop offset="75%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
      <linearGradient id="fr_gen_wing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="25%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id="fr_gen_rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="25%" stopColor="#eab308" />
        <stop offset="50%" stopColor="#10b981" />
        <stop offset="75%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <filter id="fr_gen_divine" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor="#fde047" floodOpacity="0.95" />
      </filter>
    `,
    bgSvg: `
      {/* Радужно-призматический космический ореол Творца */}
      <rect x="-20" y="-20" width="140" height="140" rx="38" fill="none" stroke="url(#fr_gen_rainbow)" strokeWidth="7" opacity="0.65" filter="blur(14px)" />
    `,
    chassisSvg: `
      {/* Золотая ограненная броня с сакральными гранями */}
      <rect x="2" y="2" width="96" height="96" rx="22" fill="#080310" stroke="url(#fr_gen_gold)" strokeWidth="4.8" filter="url(#fr_gen_divine)" />
      <rect x="6" y="6" width="88" height="88" rx="18" fill="none" stroke="url(#fr_gen_rainbow)" strokeWidth="2" />
      <rect x="9" y="9" width="82" height="82" rx="15" fill="none" stroke="#fef08a" strokeWidth="1" opacity="0.9" strokeDasharray="5 3" />
    `,
    propsSvg: `
      {/* 5-УРОВНЕВЫЕ ИМПЕРАТОРСКИЕ ЗОЛОТЫЕ ДРАКОНЬИ КРЫЛЬЯ (MLBB Collector, вынос 42px!) */}
      <g transform="translate(-40, 10)" filter="url(#fr_gen_divine)">
        <polygon points="40,2 2,12 40,18" fill="url(#fr_gen_wing)" stroke="#ffffff" strokeWidth="1.2" />
        <polygon points="40,16 -4,28 40,34" fill="url(#fr_gen_wing)" stroke="#fef08a" strokeWidth="1.4" />
        <polygon points="40,32 -8,46 40,52" fill="url(#fr_gen_wing)" stroke="#ffffff" strokeWidth="1.8" />
        <polygon points="40,50 -4,64 40,70" fill="url(#fr_gen_wing)" stroke="#fef08a" strokeWidth="1.4" />
        <polygon points="40,68 4,80 40,86" fill="url(#fr_gen_wing)" stroke="#ffffff" strokeWidth="1.2" />
      </g>
      <g transform="translate(100, 10)" filter="url(#fr_gen_divine)">
        <polygon points="0,2 38,12 0,18" fill="url(#fr_gen_wing)" stroke="#ffffff" strokeWidth="1.2" />
        <polygon points="0,16 44,28 0,34" fill="url(#fr_gen_wing)" stroke="#fef08a" strokeWidth="1.4" />
        <polygon points="0,32 48,46 0,52" fill="url(#fr_gen_wing)" stroke="#ffffff" strokeWidth="1.8" />
        <polygon points="0,50 44,64 0,70" fill="url(#fr_gen_wing)" stroke="#fef08a" strokeWidth="1.4" />
        <polygon points="0,68 36,80 0,86" fill="url(#fr_gen_wing)" stroke="#ffffff" strokeWidth="1.2" />
      </g>

      {/* ШЕДЕВРАЛЬНЫЙ АРТЕФАКТ: 3D Скульптурная Корона Создателя с рубинами и лучами (вынос 42px!) */}
      <g transform="translate(14, -40)" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.98))">
        {/* Корона из золота высшей пробы */}
        <polygon points="36,0 46,16 62,4 56,28 16,28 10,4 26,16" fill="url(#fr_gen_gold)" stroke="#ffffff" strokeWidth="2.2" />
        
        {/* Большой королевский рубин по центру */}
        <polygon points="36,-4 42,4 36,12 30,4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.4" filter="drop-shadow(0 0 10px #ef4444)" />
        <circle cx="10" cy="4" r="3.2" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
        <circle cx="62" cy="4" r="3.2" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
        
        {/* Основание венца с драгоценными камнями */}
        <rect x="14" y="26" width="44" height="7" rx="2.5" fill="url(#fr_gen_gold)" stroke="#451a03" strokeWidth="1.2" />
        <circle cx="23" cy="29.5" r="1.8" fill="#ffffff" />
        <circle cx="36" cy="29.5" r="2.2" fill="#ef4444" />
        <circle cx="49" cy="29.5" r="1.8" fill="#ffffff" />
      </g>

      {/* 6 ОРБИТАЛЬНЫХ СФЕР ГУДОДАМА (ФИЗИЧЕСКИ ВРАЩАЮТСЯ ПО ОРБИТЕ ЧЕРЕЗ АНИМАЦИЮ!) */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="14s"
          repeatCount="indefinite"
        />
        <circle cx="50" cy="-14" r="5.5" fill="#020617" stroke="#fef08a" strokeWidth="1.8" filter="drop-shadow(0 0 10px #fde047)" />
        <circle cx="108" cy="20" r="5" fill="#020617" stroke="#38bdf8" strokeWidth="1.8" filter="drop-shadow(0 0 10px #38bdf8)" />
        <circle cx="108" cy="80" r="5.5" fill="#020617" stroke="#fef08a" strokeWidth="1.8" filter="drop-shadow(0 0 10px #fde047)" />
        <circle cx="50" cy="114" r="5" fill="#020617" stroke="#38bdf8" strokeWidth="1.8" filter="drop-shadow(0 0 10px #38bdf8)" />
        <circle cx="-8" cy="80" r="5.5" fill="#020617" stroke="#fef08a" strokeWidth="1.8" filter="drop-shadow(0 0 10px #fde047)" />
        <circle cx="-8" cy="20" r="5" fill="#020617" stroke="#38bdf8" strokeWidth="1.8" filter="drop-shadow(0 0 10px #38bdf8)" />
      </g>

      {/* НИЖНИЙ МОНОЛИТНЫЙ ПОСТАМЕНТ ТВОРЦА 『創世』 (Сотворение) */}
      <g transform="translate(24, 82)" filter="drop-shadow(0 0 18px #fde047)">
        <polygon points="4,0 48,0 52,24 0,24" fill="#080210" stroke="url(#fr_gen_gold)" strokeWidth="2.8" />
        <text x="26" y="17" fill="#fef08a" fontSize="14" fontWeight="900" fontFamily="serif" letterSpacing="3" textAnchor="middle">創世</text>
      </g>
    `
  }
];

let code = `import React from 'react';

/**
 * playerFramesData.jsx
 * Каталог наградных рамок за боевые достижения (Achievement Frames).
 * Выполнены по высшему стандарту Mobile Legends: Bang Bang (MLBB Masterpiece Edition):
 * - Скульптурный силуэтный вынос (viewBox="-32 -32 164 164", overflow-visible)
 * - Настоящие 3D-артефакты: шляпа Хокаге, маска АНБУ, драконьи крылья, рога они Сусаноо, корона Творца
 * - Живые SVG-анимации: вращающиеся сферы Гудодама, пульсирующие угли, молнии Райкири, дым трубки
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
          viewBox="-32 -32 164 164" 
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            ${f.defs}
          </defs>

          {/* Слой 0: Фоновая аура чакры */}
          ${f.bgSvg}

          {/* Слой 1: Карточка аватара шиноби с клиппингом и глубоким врезом */}
          <foreignObject x="8" y="8" width="84" height="84" className="pointer-events-auto">
            <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-950 shadow-inner">
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
console.log('Successfully generated Ultra-AAA MLBB Masterpiece SVG frames at:', outputPath);
