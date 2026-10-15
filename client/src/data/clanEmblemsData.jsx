import React from 'react';

/**
 * clanEmblemsData.jsx
 * Элитная коллекция императорских гербов и медальонов кланов (Kamon 3D):
 * - 6-слойная ювелирная архитектура: золотой чеканный обод, драгоценное эмалевое дно,
 *   сакральная гравировка, рельефный каноничный символ с неоновой фаской и стеклянный софтбокс-блик.
 * - Полная изоляция SVG <defs> с уникальными префиксами для предотвращения конфликтов стилей.
 */

export const CLAN_EMBLEMS = [
  // =========================================================================
  // 1. УЧИХА (Огненный Веер Гунбай & Золотые Томоэ)
  // =========================================================================
  {
    id: 'emblem_uchiha',
    name: 'Герб Учиха (Огненный Веер & Томоэ)',
    kanji: 'うちは',
    themeColor: '#ef4444',
    bgGradient: 'from-rose-950 via-zinc-950 to-red-950',
    borderColor: 'border-red-500/50',
    glowColor: 'shadow-red-500/30',
    defaultMotto: 'Тот, кто владеет пламенем, разгоняет тьму!',
    desc: 'Легендарный церемониальный веер Учиха из слоновой кости и рубинового шелка. Окаймлен золотыми томоэ Шарингана и венцом священного пламени Катона.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_uchiha_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#ca8a04" />
            <stop offset="50%" stopColor="#fef9c3" />
            <stop offset="75%" stopColor="#854d0e" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <radialGradient id="m_uchiha_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#58080f" />
            <stop offset="50%" stopColor="#250306" />
            <stop offset="85%" stopColor="#100103" />
            <stop offset="100%" stopColor="#040001" />
          </radialGradient>
          <linearGradient id="m_uchiha_red" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff4d6d" />
            <stop offset="40%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          <linearGradient id="m_uchiha_ivory" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f4f4f5" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <filter id="m_uchiha_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_uchiha_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный золотой обод с двойной фаской */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_uchiha_gold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_uchiha_gold)" strokeWidth="1" strokeDasharray="3 2" />

        {/* Дно из кровавого обсидиана */}
        <circle cx="50" cy="50" r="42" fill="url(#m_uchiha_gem)" />

        {/* Гравированные лучи Катона */}
        <g stroke="url(#m_uchiha_gold)" strokeWidth="0.5" opacity="0.3">
          <line x1="50" y1="50" x2="85" y2="15" />
          <line x1="50" y1="50" x2="15" y2="15" />
          <line x1="50" y1="50" x2="85" y2="85" />
          <line x1="50" y1="50" x2="15" y2="85" />
          <line x1="50" y1="50" x2="50" y2="8" />
          <line x1="50" y1="50" x2="92" y2="50" />
          <line x1="50" y1="50" x2="8" y2="50" />
        </g>

        {/* Рельефный веер Учиха */}
        <g filter="url(#m_uchiha_shadow)">
          {/* Рукоять веера с оплёткой */}
          <path d="M46 64 L46 88 C46 90.5 47.8 92 50 92 C52.2 92 54 90.5 54 88 L54 64 Z" fill="url(#m_uchiha_gold)" stroke="#713f12" strokeWidth="0.8" />
          <line x1="46" y1="72" x2="54" y2="72" stroke="#451a03" strokeWidth="1" />
          <line x1="46" y1="80" x2="54" y2="80" stroke="#451a03" strokeWidth="1" />
          <circle cx="50" cy="89" r="1.5" fill="#18181b" />

          {/* Нижняя половина (слоновая кость) */}
          <path d="M22 48 C22 62 34 68 50 68 C66 68 78 62 78 48 Z" fill="url(#m_uchiha_ivory)" stroke="url(#m_uchiha_gold)" strokeWidth="1.2" />

          {/* Верхняя алая половина (рубин) */}
          <path d="M22 48 C22 30 34 18 50 18 C66 18 78 30 78 48 Z" fill="url(#m_uchiha_red)" stroke="url(#m_uchiha_gold)" strokeWidth="1.4" />

          {/* Золотой разделительный молдинг */}
          <line x1="22" y1="48" x2="78" y2="48" stroke="url(#m_uchiha_gold)" strokeWidth="2.4" strokeLinecap="round" />

          {/* Три золотых томоэ Шарингана */}
          <g fill="url(#m_uchiha_gold)">
            <circle cx="28" cy="28" r="2.2" />
            <circle cx="72" cy="28" r="2.2" />
            <circle cx="50" cy="12" r="2.2" />
          </g>
        </g>

        {/* Купольный софтбокс-блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_uchiha_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 2. УДЗУМАКИ (Алая Спираль Сейгайха & Печать Фуиндзюцу)
  // =========================================================================
  {
    id: 'emblem_uzumaki',
    name: 'Герб Удзумаки (Алая Спираль & Фуиндзюцу)',
    kanji: 'うずまき',
    themeColor: '#f97316',
    bgGradient: 'from-orange-950 via-zinc-950 to-red-950',
    borderColor: 'border-orange-500/50',
    glowColor: 'shadow-orange-500/30',
    defaultMotto: 'Воля водоворота никогда не угаснет!',
    desc: 'Священный вихрь Удзусио: многослойная золотая спираль жизненной силы и волны Сейгайха, скрепленные печатями Сики Фудзин.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_uzu_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="30%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          <radialGradient id="m_uzu_gem" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#7c2d12" />
            <stop offset="45%" stopColor="#3d0a04" />
            <stop offset="85%" stopColor="#1a0402" />
            <stop offset="100%" stopColor="#050100" />
          </radialGradient>
          <linearGradient id="m_uzu_spiral" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff7849" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>
          <filter id="m_uzu_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
          </filter>
          <radialGradient id="m_uzu_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный обод */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_uzu_gold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_uzu_gold)" strokeWidth="1" strokeDasharray="2 3" />

        {/* Карминовое эмалевое дно */}
        <circle cx="50" cy="50" r="42" fill="url(#m_uzu_gem)" />

        {/* Фоновые волны Сейгайха */}
        <g stroke="url(#m_uzu_gold)" strokeWidth="0.6" opacity="0.25">
          <circle cx="50" cy="50" r="36" strokeDasharray="6 4" />
          <circle cx="50" cy="50" r="28" strokeDasharray="4 3" />
          <circle cx="50" cy="50" r="20" strokeDasharray="3 2" />
        </g>

        {/* 3D Спираль Удзумаки */}
        <g filter="url(#m_uzu_shadow)">
          <path 
            d="M50 50 m 0, -4.5 a 4.5,4.5 0 0,1 4.5,4.5 a 9,9 0 0,1 -9,9 a 14.5,14.5 0 0,1 -14.5,-14.5 a 20,20 0 0,1 20,-20 a 25.5,25.5 0 0,1 25.5,25.5 a 31,31 0 0,1 -31,31" 
            stroke="url(#m_uzu_spiral)" 
            strokeWidth="7" 
            strokeLinecap="round" 
          />
          {/* Золотая гребневая жила спирали */}
          <path 
            d="M50 50 m 0, -4.5 a 4.5,4.5 0 0,1 4.5,4.5 a 9,9 0 0,1 -9,9 a 14.5,14.5 0 0,1 -14.5,-14.5 a 20,20 0 0,1 20,-20 a 25.5,25.5 0 0,1 25.5,25.5 a 31,31 0 0,1 -31,31" 
            stroke="url(#m_uzu_gold)" 
            strokeWidth="1.6" 
            strokeLinecap="round" 
            opacity="0.9"
          />
        </g>

        {/* 4 Руны-печати Фуиндзюцу по сторонам света */}
        <g fill="url(#m_uzu_gold)">
          <circle cx="50" cy="14" r="3" />
          <circle cx="86" cy="50" r="3" />
          <circle cx="50" cy="86" r="3" />
          <circle cx="14" cy="50" r="3" />
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_uzu_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 3. СЕНДЖУ (Ваджра Мокутона & Древо Тысячи Рук)
  // =========================================================================
  {
    id: 'emblem_senju',
    name: 'Герб Сенджу (Ваджра & Древо Мокутона)',
    kanji: '千手',
    themeColor: '#10b981',
    bgGradient: 'from-emerald-950 via-zinc-950 to-green-950',
    borderColor: 'border-emerald-500/50',
    glowColor: 'shadow-emerald-500/30',
    defaultMotto: 'Воля Огня пускает корни глубоко в сердце!',
    desc: 'Священный скипетр Ваджра клана Сенджу из древней бронзы и золота. Обвит живыми побегами древа Мокутон с изумрудным ядром Асуры.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_senju_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d1fae5" />
            <stop offset="30%" stopColor="#10b981" />
            <stop offset="70%" stopColor="#047857" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <radialGradient id="m_senju_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="50%" stopColor="#022c22" />
            <stop offset="85%" stopColor="#011710" />
            <stop offset="100%" stopColor="#000805" />
          </radialGradient>
          <linearGradient id="m_senju_stem" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>
          <filter id="m_senju_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_senju_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный изумрудно-золотой обод */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_senju_gold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_senju_gold)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Нефритовое дно */}
        <circle cx="50" cy="50" r="42" fill="url(#m_senju_gem)" />

        {/* Годовые кольца священного древа */}
        <g stroke="url(#m_senju_gold)" strokeWidth="0.5" opacity="0.3">
          <circle cx="50" cy="50" r="35" />
          <circle cx="50" cy="50" r="27" />
          <circle cx="50" cy="50" r="19" />
        </g>

        {/* Рельефная Ваджра Мокутона */}
        <g filter="url(#m_senju_shadow)">
          {/* Вертикальный ствол */}
          <line x1="50" y1="14" x2="50" y2="86" stroke="url(#m_senju_gold)" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="50" y1="16" x2="50" y2="84" stroke="#a7f3d0" strokeWidth="1.5" strokeLinecap="round" />

          {/* Поперечные перекладины ваджры */}
          <line x1="28" y1="34" x2="72" y2="34" stroke="url(#m_senju_gold)" strokeWidth="4" strokeLinecap="round" />
          <line x1="32" y1="50" x2="68" y2="50" stroke="url(#m_senju_gold)" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="28" y1="66" x2="72" y2="66" stroke="url(#m_senju_gold)" strokeWidth="4" strokeLinecap="round" />

          {/* Верхний и нижний наконечники-пики */}
          <path d="M40 22 L50 12 L60 22" fill="none" stroke="url(#m_senju_gold)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M40 78 L50 88 L60 78" fill="none" stroke="url(#m_senju_gold)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Живые изумрудные листья чакры */}
          <path d="M28 34 Q22 24 30 20 Q36 28 28 34" fill="#34d399" stroke="url(#m_senju_gold)" strokeWidth="1" />
          <path d="M72 34 Q78 24 70 20 Q64 28 72 34" fill="#34d399" stroke="url(#m_senju_gold)" strokeWidth="1" />
          <path d="M28 66 Q22 76 30 80 Q36 72 28 66" fill="#34d399" stroke="url(#m_senju_gold)" strokeWidth="1" />
          <path d="M72 66 Q78 76 70 80 Q64 72 72 66" fill="#34d399" stroke="url(#m_senju_gold)" strokeWidth="1" />

          {/* Центральный ограненный изумруд чакры Асуры */}
          <circle cx="50" cy="50" r="7.5" fill="#10b981" stroke="url(#m_senju_gold)" strokeWidth="1.8" />
          <circle cx="50" cy="50" r="3.5" fill="#a7f3d0" />
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_senju_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 4. ХЬЮГА (Мандала 8 Триграмм Багуа & Пламя Дзюкэн)
  // =========================================================================
  {
    id: 'emblem_hyuga',
    name: 'Герб Хьюга (8 Триграмм Багуа & Дзюкэн)',
    kanji: '日向',
    themeColor: '#c084fc',
    bgGradient: 'from-purple-950 via-zinc-950 to-indigo-950',
    borderColor: 'border-purple-500/50',
    glowColor: 'shadow-purple-500/30',
    defaultMotto: 'Всеведущий взор не знает слепых зон!',
    desc: 'Священная мандала Багуа: 8 триграмм поля 64 ладоней, перламутровое пламя Мягкого кулака и вращающийся знак Тайцзи (Инь-Ян).',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_hyuga_plat" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5f3ff" />
            <stop offset="35%" stopColor="#c084fc" />
            <stop offset="70%" stopColor="#7e22ce" />
            <stop offset="100%" stopColor="#e9d5ff" />
          </linearGradient>
          <radialGradient id="m_hyuga_gem" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#3b0764" />
            <stop offset="50%" stopColor="#1e0538" />
            <stop offset="85%" stopColor="#0f021d" />
            <stop offset="100%" stopColor="#040008" />
          </radialGradient>
          <linearGradient id="m_hyuga_flame" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f3e8ff" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <filter id="m_hyuga_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
          </filter>
          <radialGradient id="m_hyuga_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный платиновый обод */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_hyuga_plat)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_hyuga_plat)" strokeWidth="1" strokeDasharray="4 2" />

        {/* Аметистовое дно */}
        <circle cx="50" cy="50" r="42" fill="url(#m_hyuga_gem)" />

        {/* 8 Триграмм И-Цзин поля Багуа */}
        <g stroke="url(#m_hyuga_plat)" strokeWidth="1.2" opacity="0.45">
          {/* Верхняя триграмма Цянь (☰) */}
          <line x1="45" y1="14" x2="55" y2="14" />
          <line x1="45" y1="16.5" x2="55" y2="16.5" />
          <line x1="45" y1="19" x2="55" y2="19" />

          {/* Нижняя триграмма Кунь (☷) */}
          <line x1="45" y1="81" x2="49" y2="81" /><line x1="51" y1="81" x2="55" y2="81" />
          <line x1="45" y1="83.5" x2="49" y2="83.5" /><line x1="51" y1="83.5" x2="55" y2="83.5" />
          <line x1="45" y1="86" x2="49" y2="86" /><line x1="51" y1="86" x2="55" y2="86" />

          {/* Правая триграмма Ли (☲) */}
          <line x1="81" y1="46" x2="86" y2="46" />
          <line x1="81" y1="50" x2="83" y2="50" /><line x1="84" y1="50" x2="86" y2="50" />
          <line x1="81" y1="54" x2="86" y2="54" />

          {/* Левая триграмма Кань (☵) */}
          <line x1="14" y1="46" x2="16" y2="46" /><line x1="17" y1="46" x2="19" y2="46" />
          <line x1="14" y1="50" x2="19" y2="50" />
          <line x1="14" y1="54" x2="16" y2="54" /><line x1="17" y1="54" x2="19" y2="54" />
        </g>

        {/* Кольца раскрытия Тенкецу */}
        <circle cx="50" cy="50" r="30" stroke="url(#m_hyuga_plat)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

        {/* Перламутровое пламя Дзюкэн */}
        <g filter="url(#m_hyuga_shadow)">
          <path 
            d="M50 18 C40 32 36 44 36 54 C36 66 42 74 50 74 C58 74 64 66 64 54 C64 44 60 32 50 18 Z" 
            fill="url(#m_hyuga_flame)" 
            stroke="url(#m_hyuga_plat)" 
            strokeWidth="1.8"
          />
          {/* Внутренний лепесток чакры */}
          <path 
            d="M50 32 C45 42 43 48 43 55 C43 62 46 66 50 66 C54 66 57 62 57 55 C57 48 55 42 50 32 Z" 
            fill="#a855f7" 
            opacity="0.85"
          />

          {/* Знак Инь-Ян (Тайцзи) в сердцевине */}
          <circle cx="50" cy="55" r="5" fill="#ffffff" stroke="#581c87" strokeWidth="1" />
          <path d="M50 50 A2.5 2.5 0 0 1 50 55 A2.5 2.5 0 0 0 50 60 A5 5 0 0 1 50 50 Z" fill="#581c87" />
          <circle cx="50" cy="52.5" r="0.9" fill="#581c87" />
          <circle cx="50" cy="57.5" r="0.9" fill="#ffffff" />
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_hyuga_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 5. ТЭНРАЙ (Громовой Трезубец & Барабаны Райдзина)
  // =========================================================================
  {
    id: 'emblem_tenrai',
    name: 'Герб Тэнрай (Трезубец & Барабаны Райдзина)',
    kanji: '天雷',
    themeColor: '#38bdf8',
    bgGradient: 'from-sky-950 via-zinc-950 to-blue-950',
    borderColor: 'border-sky-500/50',
    glowColor: 'shadow-sky-500/30',
    defaultMotto: 'Скорость небесной молнии разит без пощады!',
    desc: 'Герб громового клана Тэнрай: небесный трезубец разрядов Икадзутигана, окруженный тремя барабанами Томоэ бога грома Райдзина.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_tenrai_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="35%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <radialGradient id="m_tenrai_gem" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#0c4a6e" />
            <stop offset="50%" stopColor="#072b42" />
            <stop offset="85%" stopColor="#031622" />
            <stop offset="100%" stopColor="#01080d" />
          </radialGradient>
          <filter id="m_tenrai_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_tenrai_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный титановый обод */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_tenrai_gold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_tenrai_gold)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Грозовое дно */}
        <circle cx="50" cy="50" r="42" fill="url(#m_tenrai_gem)" />

        {/* 3 Барабана Райдзина по кругу (120°) */}
        <g stroke="url(#m_tenrai_gold)" strokeWidth="1.2">
          {/* Верхний барабан */}
          <circle cx="50" cy="20" r="6.5" fill="#082f49" />
          <circle cx="50" cy="20" r="2.5" fill="#38bdf8" />

          {/* Левый нижний */}
          <circle cx="24" cy="65" r="6.5" fill="#082f49" />
          <circle cx="24" cy="65" r="2.5" fill="#38bdf8" />

          {/* Правый нижний */}
          <circle cx="76" cy="65" r="6.5" fill="#082f49" />
          <circle cx="76" cy="65" r="2.5" fill="#38bdf8" />
        </g>

        {/* Рельефный Громовой Трезубец */}
        <g filter="url(#m_tenrai_shadow)">
          {/* Центральный разряд-клинок */}
          <path d="M50 14 L44 42 L53 42 L42 86 L64 48 L53 48 L60 14 Z" fill="url(#m_tenrai_gold)" stroke="#bae6fd" strokeWidth="1.2" />

          {/* Боковые электрические дуги */}
          <path d="M26 34 L36 42 L31 48 L44 54" stroke="#7dd3fc" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M74 34 L64 42 L69 48 L56 54" stroke="#7dd3fc" strokeWidth="2.2" strokeLinecap="round" fill="none" />

          {/* Сердечник молнии */}
          <circle cx="50" cy="46" r="3" fill="#ffffff" />
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_tenrai_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 6. СИНКАЙ (Океанический Водоворот & Чешуя Морского Дракона)
  // =========================================================================
  {
    id: 'emblem_shinkai',
    name: 'Герб Синкай (Дракон & Глубинная Бездна)',
    kanji: '深海',
    themeColor: '#06b6d4',
    bgGradient: 'from-cyan-950 via-zinc-950 to-teal-950',
    borderColor: 'border-cyan-500/50',
    glowColor: 'shadow-cyan-500/30',
    defaultMotto: 'Океан сокрушает даже самые крепкие утесы!',
    desc: 'Лазурный герб морского клана Синкай: закрученный в спираль драконий водоворот Аойгана и сапфировые капли океанской бездны.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_shinkai_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cffafe" />
            <stop offset="30%" stopColor="#06b6d4" />
            <stop offset="70%" stopColor="#0e7490" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>
          <radialGradient id="m_shinkai_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#155e75" />
            <stop offset="50%" stopColor="#083344" />
            <stop offset="85%" stopColor="#021c27" />
            <stop offset="100%" stopColor="#000b10" />
          </radialGradient>
          <linearGradient id="m_shinkai_drop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <filter id="m_shinkai_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
          </filter>
          <radialGradient id="m_shinkai_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный лазурный обод */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_shinkai_gold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_shinkai_gold)" strokeWidth="1" strokeDasharray="3 2" />

        {/* Марианское дно */}
        <circle cx="50" cy="50" r="42" fill="url(#m_shinkai_gem)" />

        {/* Водные волны цунами */}
        <g stroke="url(#m_shinkai_gold)" strokeWidth="1" opacity="0.3" fill="none">
          <circle cx="50" cy="50" r="34" strokeDasharray="5 3" />
          <path d="M16 68 Q33 60 50 68 T84 68" strokeWidth="1.5" />
          <path d="M20 76 Q35 70 50 76 T80 76" strokeWidth="2" />
        </g>

        {/* Рельефная тройная капля Аойгана */}
        <g filter="url(#m_shinkai_shadow)">
          {/* Главная центральная капля */}
          <path 
            d="M50 20 C50 20 66 40 66 54 C66 63 59 70 50 70 C41 70 34 63 34 54 C34 40 50 20 50 20 Z" 
            fill="url(#m_shinkai_drop)" 
            stroke="url(#m_shinkai_gold)" 
            strokeWidth="1.8" 
          />
          {/* Левая малая вихревая капля */}
          <path 
            d="M32 52 C32 52 20 60 20 68 C20 74 25 78 31 78 C37 78 41 74 41 68 C41 60 32 52 32 52 Z" 
            fill="url(#m_shinkai_drop)" 
            stroke="url(#m_shinkai_gold)" 
            strokeWidth="1.2" 
          />
          {/* Правая малая вихревая капля */}
          <path 
            d="M68 52 C68 52 59 60 59 68 C59 74 63 78 69 78 C75 78 80 74 80 68 C80 60 68 52 68 52 Z" 
            fill="url(#m_shinkai_drop)" 
            stroke="url(#m_shinkai_gold)" 
            strokeWidth="1.2" 
          />

          {/* Жемчужное ядро морского дракона */}
          <circle cx="50" cy="54" r="5" fill="#cffafe" stroke="#0891b2" strokeWidth="1" />
          <circle cx="48.5" cy="52.5" r="1.5" fill="#ffffff" />
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_shinkai_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 7. КИНГАН (Солнечный Алмаз & Спектральные Грани Разлома)
  // =========================================================================
  {
    id: 'emblem_kingan',
    name: 'Герб Кинган (Солнечный Алмаз & Разлом)',
    kanji: '金眼',
    themeColor: '#eab308',
    bgGradient: 'from-amber-950 via-zinc-950 to-yellow-950',
    borderColor: 'border-yellow-500/50',
    glowColor: 'shadow-yellow-500/30',
    defaultMotto: 'В любой броне и технике есть роковой шов!',
    desc: 'Ограненный золотой кристалл Кингана с зеркальными гранями анализа уязвимостей и лазерными линиями раскола любой защиты.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_kingan_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="30%" stopColor="#eab308" />
            <stop offset="70%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
          <radialGradient id="m_kingan_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#713f12" />
            <stop offset="50%" stopColor="#451a03" />
            <stop offset="85%" stopColor="#1c0b02" />
            <stop offset="100%" stopColor="#080300" />
          </radialGradient>
          <linearGradient id="m_kingan_prism" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="50%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
          <filter id="m_kingan_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_kingan_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный обод червонного золота */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_kingan_gold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_kingan_gold)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Топазовое дно */}
        <circle cx="50" cy="50" r="42" fill="url(#m_kingan_gem)" />

        {/* Лазерные кольца разлома швов чакры */}
        <g stroke="url(#m_kingan_gold)" strokeWidth="0.8" opacity="0.35">
          <circle cx="50" cy="50" r="35" strokeDasharray="4 4" />
          <line x1="15" y1="50" x2="85" y2="50" strokeDasharray="2 3" />
          <line x1="50" y1="15" x2="50" y2="85" strokeDasharray="2 3" />
        </g>

        {/* Ограненный золотой кристалл Кингана */}
        <g filter="url(#m_kingan_shadow)">
          {/* Наружный ромб */}
          <polygon points="50,15 82,50 50,85 18,50" fill="url(#m_kingan_prism)" stroke="url(#m_kingan_gold)" strokeWidth="2" />

          {/* Внутренние грани огранки */}
          <polygon points="50,26 71,50 50,74 29,50" fill="#a16207" stroke="url(#m_kingan_gold)" strokeWidth="1.2" />

          {/* Центральный солнечный диск */}
          <circle cx="50" cy="50" r="14" fill="url(#m_kingan_gold)" stroke="#713f12" strokeWidth="1.2" />
          <circle cx="50" cy="50" r="6" fill="#ffffff" />

          {/* 4 Золотые призматические вершины */}
          <circle cx="50" cy="15" r="2" fill="#ffffff" />
          <circle cx="82" cy="50" r="2" fill="#ffffff" />
          <circle cx="50" cy="85" r="2" fill="#ffffff" />
          <circle cx="18" cy="50" r="2" fill="#ffffff" />
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_kingan_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 8. НАРА (Золотые Оленьи Рога & Зеркало Теней Каге)
  // =========================================================================
  {
    id: 'emblem_nara',
    name: 'Герб Нара (Оленьи Рога & Зеркало Теней)',
    kanji: '奈良',
    themeColor: '#84cc16',
    bgGradient: 'from-lime-950 via-zinc-950 to-emerald-950',
    borderColor: 'border-lime-500/50',
    glowColor: 'shadow-lime-500/30',
    defaultMotto: 'Победа куется тактикой и холодным расчетом!',
    desc: 'Благородные ветвистые рога священного белого оленя клана Нара на фоне зеркала теневых нитей Каге Мане но Дзюцу.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_nara_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ecfccb" />
            <stop offset="30%" stopColor="#84cc16" />
            <stop offset="70%" stopColor="#4d7c0f" />
            <stop offset="100%" stopColor="#d9f99d" />
          </linearGradient>
          <radialGradient id="m_nara_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#14532d" />
            <stop offset="50%" stopColor="#052e16" />
            <stop offset="85%" stopColor="#02140a" />
            <stop offset="100%" stopColor="#000803" />
          </radialGradient>
          <filter id="m_nara_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_nara_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный обод лесного золота */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_nara_gold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_nara_gold)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Малахитовое дно */}
        <circle cx="50" cy="50" r="42" fill="url(#m_nara_gem)" />

        {/* Черное обсидиановое зеркало тени */}
        <circle cx="50" cy="50" r="28" fill="#09090b" stroke="url(#m_nara_gold)" strokeWidth="1.8" />

        {/* Теневые щупальца Каге Мане */}
        <g stroke="#65a30d" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" fill="none">
          <path d="M50 50 Q36 60 26 52 Q18 46 22 36" />
          <path d="M50 50 Q64 60 74 52 Q82 46 78 36" />
          <path d="M50 50 Q42 34 50 24" />
        </g>

        {/* Рельефные золотые оленьи рога */}
        <g filter="url(#m_nara_shadow)" stroke="url(#m_nara_gold)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Левый рог */}
          <path d="M48 68 C46 54 38 42 26 34" />
          <path d="M38 48 C30 44 24 45 18 43" />
          <path d="M44 68 C44 48 38 32 32 20" />

          {/* Правый рог */}
          <path d="M52 68 C54 54 62 42 74 34" />
          <path d="M62 48 C70 44 76 45 82 43" />
          <path d="M56 68 C56 48 62 32 68 20" />

          {/* Центральный черепной щиток */}
          <polygon points="50,62 46,74 54,74" fill="url(#m_nara_gold)" strokeWidth="1" />
        </g>

        {/* Изумрудный свет клана */}
        <circle cx="50" cy="74" r="3.5" fill="#a3e635" stroke="#365314" strokeWidth="1" />

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_nara_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 9. АКИМИЧИ (Кандзи «食» & Крылья Чакровой Бабочки)
  // =========================================================================
  {
    id: 'emblem_akimichi',
    name: 'Герб Акимичи (Кандзи «食» & Бабочка)',
    kanji: '秋道',
    themeColor: '#f43f5e',
    bgGradient: 'from-rose-950 via-zinc-950 to-pink-950',
    borderColor: 'border-rose-500/50',
    glowColor: 'shadow-rose-500/30',
    defaultMotto: 'Истинная мощь рождается в великом теле!',
    desc: 'Величественные сияющие крылья чакровой бабочки Чодан Бакугеки и рубиновый щит со священным золотым кандзи «食» (Пища / Богатырская мощь).',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_aki_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffe4e6" />
            <stop offset="30%" stopColor="#f43f5e" />
            <stop offset="70%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <radialGradient id="m_aki_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#881337" />
            <stop offset="50%" stopColor="#4c0519" />
            <stop offset="85%" stopColor="#25020c" />
            <stop offset="100%" stopColor="#0a0003" />
          </radialGradient>
          <filter id="m_aki_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_aki_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный золотой обод */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_aki_gold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_aki_gold)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Гранатовое дно */}
        <circle cx="50" cy="50" r="42" fill="url(#m_aki_gem)" />

        {/* Крылья чакровой бабочки Чодан Бакугеки */}
        <g opacity="0.6" stroke="url(#m_aki_gold)" strokeWidth="1.2">
          {/* Левое крыло */}
          <path d="M50 50 C30 18 10 24 14 48 C16 66 34 72 50 56 Z" fill="#fb7185" fillOpacity="0.45" />
          {/* Правое крыло */}
          <path d="M50 50 C70 18 90 24 86 48 C84 66 66 72 50 56 Z" fill="#fb7185" fillOpacity="0.45" />
        </g>

        {/* Центральный рубиновый щит с кандзи 食 */}
        <g filter="url(#m_aki_shadow)">
          <circle cx="50" cy="50" r="23" fill="#e11d48" stroke="url(#m_aki_gold)" strokeWidth="2.4" />
          <circle cx="50" cy="50" r="20" stroke="#fda4af" strokeWidth="0.8" />
          {/* Золотой рельефный кандзи 食 */}
          <text 
            x="50" 
            y="59" 
            fontSize="26" 
            fontWeight="900" 
            fill="url(#m_aki_gold)" 
            stroke="#881337" 
            strokeWidth="0.6" 
            textAnchor="middle" 
            fontFamily="'Hiragino Mincho Pro', 'Yu Mincho', serif"
          >
            食
          </text>
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_aki_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 10. ЯМАНАКА (Цветок Хаги & Пси-Мандала Синтенсин)
  // =========================================================================
  {
    id: 'emblem_yamanaka',
    name: 'Герб Яманака (Цветок Хаги & Пси-Кольца)',
    kanji: '山中',
    themeColor: '#a855f7',
    bgGradient: 'from-purple-950 via-zinc-950 to-violet-950',
    borderColor: 'border-purple-500/50',
    glowColor: 'shadow-purple-500/30',
    defaultMotto: 'Разум проникает сквозь любые преграды!',
    desc: 'Аметистовый цветок кустарникового клевера Хаги и золотые концентрические кольца ментальной связи Синтенсин но Дзюцу.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_yama_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3e8ff" />
            <stop offset="30%" stopColor="#a855f7" />
            <stop offset="70%" stopColor="#6b21a8" />
            <stop offset="100%" stopColor="#e9d5ff" />
          </linearGradient>
          <radialGradient id="m_yama_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#581c87" />
            <stop offset="50%" stopColor="#3b0764" />
            <stop offset="85%" stopColor="#1e0235" />
            <stop offset="100%" stopColor="#090011" />
          </radialGradient>
          <filter id="m_yama_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
          </filter>
          <radialGradient id="m_yama_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный обод */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_yama_gold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_yama_gold)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Аметистовое дно */}
        <circle cx="50" cy="50" r="42" fill="url(#m_yama_gem)" />

        {/* Кольца телепатической пси-связи */}
        <g stroke="url(#m_yama_gold)" strokeWidth="0.8" opacity="0.4" fill="none">
          <circle cx="50" cy="50" r="34" strokeDasharray="4 3" />
          <circle cx="50" cy="50" r="26" strokeDasharray="3 2" />
        </g>

        {/* Аметистовый цветок кустарникового клевера Хаги */}
        <g filter="url(#m_yama_shadow)">
          {/* 5 лепестков цветка */}
          <circle cx="50" cy="34" r="10.5" fill="#9333ea" stroke="url(#m_yama_gold)" strokeWidth="1.2" />
          <circle cx="64" cy="44" r="10.5" fill="#7e22ce" stroke="url(#m_yama_gold)" strokeWidth="1.2" />
          <circle cx="59" cy="62" r="10.5" fill="#6b21a8" stroke="url(#m_yama_gold)" strokeWidth="1.2" />
          <circle cx="41" cy="62" r="10.5" fill="#6b21a8" stroke="url(#m_yama_gold)" strokeWidth="1.2" />
          <circle cx="36" cy="44" r="10.5" fill="#7e22ce" stroke="url(#m_yama_gold)" strokeWidth="1.2" />

          {/* Золотая сердцевина цветка с глазом разума */}
          <circle cx="50" cy="50" r="8" fill="#f3e8ff" stroke="url(#m_yama_gold)" strokeWidth="2" />
          <circle cx="50" cy="50" r="3.5" fill="#7e22ce" />
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_yama_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 11. АБУРАМЕ (Изумрудный Кикайчу & Соты Роя)
  // =========================================================================
  {
    id: 'emblem_aburame',
    name: 'Герб Абураме (Кикайчу & Соты Роя)',
    kanji: '油女',
    themeColor: '#14b8a6',
    bgGradient: 'from-teal-950 via-zinc-950 to-slate-950',
    borderColor: 'border-teal-500/50',
    glowColor: 'shadow-teal-500/30',
    defaultMotto: 'Тихий рой поглощает любую чакру!',
    desc: 'Хитиновый изумрудный скарабей Кикайчу с золотыми рунами симбиоза на крыльях, окруженный сотами защитного гнезда.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_abu_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ccfbf1" />
            <stop offset="30%" stopColor="#14b8a6" />
            <stop offset="70%" stopColor="#0f766e" />
            <stop offset="100%" stopColor="#5eead4" />
          </linearGradient>
          <radialGradient id="m_abu_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#115e59" />
            <stop offset="50%" stopColor="#042f2e" />
            <stop offset="85%" stopColor="#011817" />
            <stop offset="100%" stopColor="#000908" />
          </radialGradient>
          <filter id="m_abu_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_abu_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный обод */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_abu_gold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_abu_gold)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Нефритовое дно */}
        <circle cx="50" cy="50" r="42" fill="url(#m_abu_gem)" />

        {/* Сотовая решетка роя жуков */}
        <g stroke="url(#m_abu_gold)" strokeWidth="0.7" opacity="0.25" fill="none">
          <polygon points="50,18 58,23 58,33 50,38 42,33 42,23" />
          <polygon points="66,28 74,33 74,43 66,48 58,43 58,33" />
          <polygon points="34,28 42,33 42,43 34,48 26,43 26,33" />
          <polygon points="50,62 58,67 58,77 50,82 42,77 42,67" />
        </g>

        {/* Рельефный жук-скарабей Кикайчу */}
        <g filter="url(#m_abu_shadow)">
          {/* Лапки жука */}
          <path d="M34 44 L20 38 M32 54 L16 54 M34 66 L20 72" stroke="url(#m_abu_gold)" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M66 44 L80 38 M68 54 L84 54 M66 66 L80 72" stroke="url(#m_abu_gold)" strokeWidth="2.2" strokeLinecap="round" />

          {/* Панцирь-надкрылья */}
          <ellipse cx="50" cy="55" rx="19" ry="25" fill="#0d9488" stroke="url(#m_abu_gold)" strokeWidth="2" />
          <line x1="50" y1="30" x2="50" y2="80" stroke="url(#m_abu_gold)" strokeWidth="1.8" />

          {/* Голова и жвала */}
          <ellipse cx="50" cy="27" rx="10" ry="8" fill="#134e4a" stroke="url(#m_abu_gold)" strokeWidth="1.6" />
          <path d="M44 23 Q34 14 28 17" stroke="url(#m_abu_gold)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M56 23 Q66 14 72 17" stroke="url(#m_abu_gold)" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* Золотые чакровые точки на панцире */}
          <circle cx="43" cy="50" r="2" fill="#5eead4" />
          <circle cx="57" cy="50" r="2" fill="#5eead4" />
          <circle cx="43" cy="62" r="2" fill="#5eead4" />
          <circle cx="57" cy="62" r="2" fill="#5eead4" />
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_abu_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 12. ИНУЗУКА (Алые Клыки & Звериный След Нинкен)
  // =========================================================================
  {
    id: 'emblem_inuzuka',
    name: 'Герб Инузука (Алые Клыки & Нинкен)',
    kanji: '犬塚',
    themeColor: '#ef4444',
    bgGradient: 'from-red-950 via-zinc-950 to-amber-950',
    borderColor: 'border-red-500/50',
    glowColor: 'shadow-red-500/30',
    defaultMotto: 'Верность стае и ярость зверя превыше всего!',
    desc: 'Массивные ритуальные клыки клана Инузука в золотом обрамлении и оттиск волчьей лапы боевого нинкена Акамару.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_inu_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fecaca" />
            <stop offset="30%" stopColor="#ef4444" />
            <stop offset="70%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <radialGradient id="m_inu_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#58080f" />
            <stop offset="50%" stopColor="#250306" />
            <stop offset="85%" stopColor="#100103" />
            <stop offset="100%" stopColor="#040001" />
          </radialGradient>
          <linearGradient id="m_inu_fang" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <filter id="m_inu_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_inu_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный обод */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_inu_gold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_inu_gold)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Дно из темного кармина */}
        <circle cx="50" cy="50" r="42" fill="url(#m_inu_gem)" />

        {/* Следы когтей на фоне */}
        <g stroke="#991b1b" strokeWidth="2" strokeLinecap="round" opacity="0.4">
          <line x1="28" y1="20" x2="38" y2="34" />
          <line x1="48" y1="16" x2="52" y2="30" />
          <line x1="68" y1="20" x2="62" y2="34" />
        </g>

        {/* Рельефные клыки Инузука */}
        <g filter="url(#m_inu_shadow)">
          {/* Левый клык */}
          <polygon points="30,22 44,22 37,76" fill="url(#m_inu_fang)" stroke="url(#m_inu_gold)" strokeWidth="2" strokeLinejoin="round" />
          {/* Правый клык */}
          <polygon points="56,22 70,22 63,76" fill="url(#m_inu_fang)" stroke="url(#m_inu_gold)" strokeWidth="2" strokeLinejoin="round" />

          {/* Золотой оттиск волчьей лапы нинкена */}
          <circle cx="50" cy="46" r="4" fill="url(#m_inu_gold)" />
          <circle cx="43" cy="38" r="2.2" fill="url(#m_inu_gold)" />
          <circle cx="48" cy="34" r="2.2" fill="url(#m_inu_gold)" />
          <circle cx="54" cy="34" r="2.2" fill="url(#m_inu_gold)" />
          <circle cx="59" cy="38" r="2.2" fill="url(#m_inu_gold)" />
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_inu_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 13. САРУТОБИ (Факел 5 Стихий & Алмазный Посох Энмы)
  // =========================================================================
  {
    id: 'emblem_sarutobi',
    name: 'Герб Сарутоби (Факел 5 Стихий & Посох Энмы)',
    kanji: '猿飛',
    themeColor: '#f97316',
    bgGradient: 'from-orange-950 via-zinc-950 to-amber-950',
    borderColor: 'border-orange-500/50',
    glowColor: 'shadow-orange-500/30',
    defaultMotto: 'Листья кружатся там, где горит истинный Огонь!',
    desc: 'Священный пятилепестковый факел природных стихий клана Сарутоби и золотые кольца алмазного посоха Царя Обезьян Энмы.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_saru_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="30%" stopColor="#f97316" />
            <stop offset="70%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <radialGradient id="m_saru_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#7c2d12" />
            <stop offset="50%" stopColor="#431407" />
            <stop offset="85%" stopColor="#1a0601" />
            <stop offset="100%" stopColor="#080200" />
          </radialGradient>
          <filter id="m_saru_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_saru_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный обод */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_saru_gold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_saru_gold)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Терракотовое дно */}
        <circle cx="50" cy="50" r="42" fill="url(#m_saru_gem)" />

        {/* 5 самоцветов природных трансформаций по кругу */}
        <g stroke="#18181b" strokeWidth="0.8">
          <circle cx="50" cy="14" r="2.8" fill="#ef4444" title="Огонь" />
          <circle cx="78" cy="34" r="2.8" fill="#38bdf8" title="Молния" />
          <circle cx="68" cy="74" r="2.8" fill="#10b981" title="Ветер" />
          <circle cx="32" cy="74" r="2.8" fill="#a16207" title="Земля" />
          <circle cx="22" cy="34" r="2.8" fill="#06b6d4" title="Вода" />
        </g>

        {/* Рельефный Факел Сарутоби */}
        <g filter="url(#m_saru_shadow)">
          <path 
            d="M50 16 Q64 36 58 48 Q70 44 66 60 Q60 76 50 82 Q40 76 34 60 Q30 44 42 48 Q36 36 50 16 Z" 
            fill="url(#m_saru_gold)" 
            stroke="#7c2d12" 
            strokeWidth="2" 
          />
          {/* Алмазный медальон посоха Энмы */}
          <polygon points="50,46 58,56 50,66 42,56" fill="#fef08a" stroke="#451a03" strokeWidth="1.2" />
          <circle cx="50" cy="56" r="3" fill="#ea580c" />
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_saru_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 14. ХАТАКЕ (Клинок Белого Клыка & Шепот Райкири)
  // =========================================================================
  {
    id: 'emblem_hatake',
    name: 'Герб Хатаке (Клинок Белого Клыка & Райкири)',
    kanji: 'はたけ',
    themeColor: '#94a3b8',
    bgGradient: 'from-slate-950 via-zinc-950 to-zinc-900',
    borderColor: 'border-slate-400/50',
    glowColor: 'shadow-slate-400/30',
    defaultMotto: 'Те, кто нарушают правила — отбросы, но те, кто бросают друзей — хуже отбросов!',
    desc: 'Граненый серебряный танто Сакумо и Какаши Хатаке с зеркальной линией закалки и небесными всполохами клинка молний Райкири.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_hatake_silver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#94a3b8" />
            <stop offset="70%" stopColor="#475569" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <radialGradient id="m_hatake_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="85%" stopColor="#050810" />
            <stop offset="100%" stopColor="#010205" />
          </radialGradient>
          <filter id="m_hatake_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_hatake_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный обод дамасской стали */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_hatake_silver)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_hatake_silver)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Антрацитовое дно */}
        <circle cx="50" cy="50" r="42" fill="url(#m_hatake_gem)" />

        {/* Разряды молний Райкири вокруг клинка */}
        <g stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M28 38 L38 44 L32 52 L48 55" />
          <path d="M72 38 L62 44 L68 52 L52 55" />
        </g>

        {/* Рельефный танто Белого Клыка */}
        <g filter="url(#m_hatake_shadow)">
          {/* Стальное лезвие танто */}
          <path d="M50 14 L56 24 L52 66 L48 66 L44 24 Z" fill="url(#m_hatake_silver)" stroke="#ffffff" strokeWidth="1.2" />
          {/* Линия закалки хамон */}
          <line x1="50" y1="18" x2="50" y2="65" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
          {/* Гарда цуба */}
          <rect x="41" y="66" width="18" height="5" rx="1.5" fill="#64748b" stroke="url(#m_hatake_silver)" strokeWidth="1" />
          {/* Рукоять цука с оплеткой */}
          <rect x="45" y="71" width="10" height="17" rx="1" fill="#1e293b" stroke="url(#m_hatake_silver)" strokeWidth="1" />
          <line x1="45" y1="76" x2="55" y2="76" stroke="#94a3b8" strokeWidth="1.2" />
          <line x1="45" y1="82" x2="55" y2="82" stroke="#94a3b8" strokeWidth="1.2" />
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_hatake_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 15. ХОКАГЕ (Имперский Лист Конохи & Золотой Кандзи 火)
  // =========================================================================
  {
    id: 'emblem_hokage',
    name: 'Герб Воли Огня (Хокаге Конохи & Кандзи 火)',
    kanji: '火影',
    themeColor: '#ef4444',
    bgGradient: 'from-rose-950 via-amber-950 to-zinc-950',
    borderColor: 'border-amber-500/50',
    glowColor: 'shadow-amber-500/30',
    defaultMotto: 'Деревня — это моя семья, и я защищу ее ценой жизни!',
    desc: 'Священный имперский герб Воли Огня: спираль Скрытого Листа Конохи и золотой каллиграфический иероглиф «火» (Огонь) на треугольной шляпе Хокаге.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_hoka_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="30%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
          <radialGradient id="m_hoka_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#7f1d1d" />
            <stop offset="50%" stopColor="#450a0a" />
            <stop offset="85%" stopColor="#1c0202" />
            <stop offset="100%" stopColor="#080000" />
          </radialGradient>
          <filter id="m_hoka_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_hoka_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный обод червонного сусального золота */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_hoka_gold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_hoka_gold)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Императорское карминовое дно */}
        <circle cx="50" cy="50" r="42" fill="url(#m_hoka_gem)" />

        {/* 8 Языков пламени основателей по ободу */}
        <g fill="url(#m_hoka_gold)" opacity="0.35">
          <polygon points="50,11 53,17 47,17" />
          <polygon points="50,89 53,83 47,83" />
          <polygon points="89,50 83,53 83,47" />
          <polygon points="11,50 17,53 17,47" />
        </g>

        {/* Рельефный символ Листа Конохи и шляпа Хокаге */}
        <g filter="url(#m_hoka_shadow)">
          {/* Треугольный навес шляпы Хокаге */}
          <polygon points="50,18 78,42 22,42" fill="#ef4444" stroke="url(#m_hoka_gold)" strokeWidth="2" strokeLinejoin="round" />
          {/* Белый веерный обод шляпы */}
          <polygon points="50,22 74,42 26,42" fill="#f4f4f5" />

          {/* Золотой каллиграфический кандзи 火 */}
          <text 
            x="50" 
            y="38" 
            fontSize="18" 
            fontWeight="900" 
            fill="#dc2626" 
            stroke="url(#m_hoka_gold)" 
            strokeWidth="0.8" 
            textAnchor="middle" 
            fontFamily="'Hiragino Mincho Pro', 'Yu Mincho', serif"
          >
            火
          </text>

          {/* Символ спирали Листа Конохи внизу */}
          <path 
            d="M34 64 C30 50 42 38 56 40 C64 41 70 48 66 56 C62 64 50 70 42 66 C38 64 35 68 30 76" 
            stroke="url(#m_hoka_gold)" 
            strokeWidth="4" 
            fill="none" 
            strokeLinecap="round" 
          />
          <circle cx="50" cy="52" r="3.2" fill="#fde047" stroke="#451a03" strokeWidth="0.8" />
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_hoka_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 16. АНБУ (Фарфоровая Маска Кицунэ & Скрещенные Ниндзято)
  // =========================================================================
  {
    id: 'emblem_anbu',
    name: 'Герб Спецназа АНБУ (Маска Кицунэ & Ниндзято)',
    kanji: '暗部',
    themeColor: '#a855f7',
    bgGradient: 'from-zinc-950 via-purple-950 to-slate-950',
    borderColor: 'border-purple-500/50',
    glowColor: 'shadow-purple-500/30',
    defaultMotto: 'Мы действуем из тени, чтобы деревня жила на свету!',
    desc: 'Фарфоровая маска лисицы отряда спецопераций АНБУ с алыми ритуальными метками на фоне скрещенных клинков ниндзято.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_anbu_plat" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#a855f7" />
            <stop offset="70%" stopColor="#581c87" />
            <stop offset="100%" stopColor="#d8b4fe" />
          </linearGradient>
          <radialGradient id="m_anbu_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#2e1065" />
            <stop offset="50%" stopColor="#180838" />
            <stop offset="85%" stopColor="#0a0218" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <filter id="m_anbu_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_anbu_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный обод */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_anbu_plat)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_anbu_plat)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Обсидиановое дно ночных операций */}
        <circle cx="50" cy="50" r="42" fill="url(#m_anbu_gem)" />

        {/* Скрещенные клинки ниндзято за маской */}
        <g stroke="#94a3b8" strokeWidth="2.4" strokeLinecap="round">
          <line x1="22" y1="22" x2="78" y2="78" />
          <line x1="78" y1="22" x2="22" y2="78" />
          {/* Золотые гарды */}
          <line x1="26" y1="20" x2="20" y2="26" stroke="url(#m_anbu_plat)" strokeWidth="3" />
          <line x1="74" y1="20" x2="80" y2="26" stroke="url(#m_anbu_plat)" strokeWidth="3" />
        </g>

        {/* Фарфоровая маска Кицунэ АНБУ */}
        <g filter="url(#m_anbu_shadow)">
          {/* Основа маски */}
          <path d="M50 20 C36 20 28 34 28 52 C28 70 38 82 50 82 C62 82 72 70 72 52 C72 34 64 20 50 20 Z" fill="#f4f4f5" stroke="url(#m_anbu_plat)" strokeWidth="1.8" />
          {/* Лисьи ушки */}
          <polygon points="34,22 28,12 38,18" fill="#e4e4e7" stroke="#71717a" strokeWidth="1" />
          <polygon points="66,22 72,12 62,18" fill="#e4e4e7" stroke="#71717a" strokeWidth="1" />
          <polygon points="33,20 30,15 36,18" fill="#dc2626" />
          <polygon points="67,20 70,15 64,18" fill="#dc2626" />

          {/* Раскосые прорези глаз с алым светом */}
          <path d="M36 46 Q42 42 46 48" stroke="#18181b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M64 46 Q58 42 54 48" stroke="#18181b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <line x1="40" y1="46" x2="43" y2="46" stroke="#ef4444" strokeWidth="1.2" />
          <line x1="60" y1="46" x2="57" y2="46" stroke="#ef4444" strokeWidth="1.2" />

          {/* Алые ритуальные изогнутые метки на щеках */}
          <path d="M32 56 Q36 62 44 60" stroke="#dc2626" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M68 56 Q64 62 56 60" stroke="#dc2626" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          {/* Носик */}
          <polygon points="50,65 48,68 52,68" fill="#18181b" />
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_anbu_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 17. ООЦУЦУКИ (Рога Прародителей & Золотой Риннеган) [БОНУС-КЛАН]
  // =========================================================================
  {
    id: 'emblem_otsutsuki',
    name: 'Герб Ооцуцуки (Рога Богов & Золотой Риннеган)',
    kanji: '大筒木',
    themeColor: '#e0e7ff',
    bgGradient: 'from-indigo-950 via-zinc-950 to-slate-950',
    borderColor: 'border-indigo-400/50',
    glowColor: 'shadow-indigo-400/30',
    defaultMotto: 'Вселенная подчиняется воле Божественного Древа!',
    desc: 'Священный клан прародителей чакры: венчающие рога Кагуи и Хагоромо, кольца Риннегана и плод Божественного Древа.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_otsu_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#e0e7ff" />
            <stop offset="70%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <radialGradient id="m_otsu_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="50%" stopColor="#1e1b4b" />
            <stop offset="85%" stopColor="#0c0a24" />
            <stop offset="100%" stopColor="#02000a" />
          </radialGradient>
          <filter id="m_otsu_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_otsu_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный обод небесного золота */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_otsu_gold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_otsu_gold)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Космическое дно бездны */}
        <circle cx="50" cy="50" r="42" fill="url(#m_otsu_gem)" />

        {/* Кольца Риннегана на фоне */}
        <g stroke="url(#m_otsu_gold)" strokeWidth="0.8" opacity="0.35" fill="none">
          <circle cx="50" cy="55" r="32" />
          <circle cx="50" cy="55" r="24" />
          <circle cx="50" cy="55" r="16" />
        </g>

        {/* Рельефные Рога Ооцуцуки и Око Ринне-Шарингана */}
        <g filter="url(#m_otsu_shadow)">
          {/* Изогнутые рога Кагуи */}
          <path d="M42 50 C38 34 24 22 16 16 C22 28 28 42 36 56 Z" fill="#ffffff" stroke="url(#m_otsu_gold)" strokeWidth="1.6" />
          <path d="M58 50 C62 34 76 22 84 16 C78 28 72 42 64 56 Z" fill="#ffffff" stroke="url(#m_otsu_gold)" strokeWidth="1.6" />

          {/* Центральный плод Божественного Древа (Золотой Риннеган) */}
          <ellipse cx="50" cy="56" rx="14" ry="10" fill="#fef08a" stroke="url(#m_otsu_gold)" strokeWidth="2" />
          <circle cx="50" cy="56" r="6" fill="#818cf8" stroke="#312e81" strokeWidth="1" />
          <circle cx="50" cy="56" r="2.5" fill="#1e1b4b" />
          <circle cx="48.5" cy="54.5" r="1" fill="#ffffff" />

          {/* 3 Томоэ вокруг ока */}
          <circle cx="43" cy="56" r="1.5" fill="#312e81" />
          <circle cx="57" cy="56" r="1.5" fill="#312e81" />
          <circle cx="50" cy="50" r="1.5" fill="#312e81" />
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_otsu_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 18. КАЗЕКАГЕ / СУНА (Золотая Тыква Гаары & Алый Кандзи 愛) [БОНУС-КЛАН]
  // =========================================================================
  {
    id: 'emblem_kazekage',
    name: 'Герб Казекаге (Золотой Песок & Кандзи 愛)',
    kanji: '風影',
    themeColor: '#ca8a04',
    bgGradient: 'from-amber-950 via-zinc-950 to-orange-950',
    borderColor: 'border-yellow-600/50',
    glowColor: 'shadow-yellow-600/30',
    defaultMotto: 'Песчаная буря похоронит врагов, оставив лишь Любовь!',
    desc: 'Великая песчаная тыква Гаары с защитными печатями и священный светящийся алый кандзи «愛» (Любовь) на фоне дюн Сунагакуре.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_suna_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#ca8a04" />
            <stop offset="70%" stopColor="#854d0e" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
          <radialGradient id="m_suna_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="50%" stopColor="#451a03" />
            <stop offset="85%" stopColor="#1c0b02" />
            <stop offset="100%" stopColor="#080300" />
          </radialGradient>
          <filter id="m_suna_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_suna_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Чеканный обод древнего золота пустыни */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_suna_gold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_suna_gold)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Дно пустынного янтаря */}
        <circle cx="50" cy="50" r="42" fill="url(#m_suna_gem)" />

        {/* Песчаные вихревые дюны */}
        <g stroke="url(#m_suna_gold)" strokeWidth="0.8" opacity="0.35" fill="none">
          <path d="M18 72 Q35 64 50 72 T82 72" />
          <path d="M22 80 Q38 72 50 80 T78 80" />
        </g>

        {/* Рельефная тыква Гаары и кандзи 愛 */}
        <g filter="url(#m_suna_shadow)">
          {/* Верхняя малая часть тыквы */}
          <circle cx="50" cy="38" r="13" fill="#d97706" stroke="url(#m_suna_gold)" strokeWidth="1.8" />
          {/* Горлышко и пробка */}
          <rect x="46" y="20" width="8" height="7" rx="1.5" fill="#92400e" stroke="url(#m_suna_gold)" strokeWidth="1.2" />

          {/* Нижняя большая часть тыквы */}
          <circle cx="50" cy="62" r="18" fill="#b45309" stroke="url(#m_suna_gold)" strokeWidth="2" />

          {/* Поясная обвязка тыквы */}
          <path d="M38 48 Q50 54 62 48" stroke="url(#m_suna_gold)" strokeWidth="2.4" fill="none" />

          {/* Алый светящийся кандзи 愛 (Любовь) на лбу тыквы */}
          <text 
            x="50" 
            y="43" 
            fontSize="14" 
            fontWeight="900" 
            fill="#ef4444" 
            stroke="#ffffff" 
            strokeWidth="0.4" 
            textAnchor="middle" 
            fontFamily="'Hiragino Mincho Pro', 'Yu Mincho', serif"
          >
            愛
          </text>
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="20" ry="11" fill="url(#m_suna_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
      </svg>
    )
  }
];

/**
 * Быстрый и безопасный поиск герба клана по его уникальному ID
 */
export function getClanEmblemById(id) {
  if (!id) return CLAN_EMBLEMS[0];
  const found = CLAN_EMBLEMS.find(e => e.id === id);
  return found || CLAN_EMBLEMS[0];
}
