import React from 'react';

/**
 * clanEmblemsData.jsx
 * Элитная коллекция императорских гербов и медальонов кланов (Kamon 3D Masterpiece Edition):
 * - 7-слойная ювелирная архитектура:
 *   [0] Наружный ореол чакры (Chakra Bloom Aura)
 *   [1] Чеканный трехслойный золотой обод с 12 заклепками-самоцветами и гравированными зубцами
 *   [2] Дно из полированного обсидиана / драгоценной эмали клуазоне
 *   [3] Сакральная гильош-гравировка (Сейгайха, 8 триграмм, лучи, годовые кольца)
 *   [4] Рельефный каноничный гербовый символ с металлической фаской и глубокой тенью
 *   [5] Неоновые микро-элементы и рунические кандзи
 *   [6] Двойной купольный софтбокс-блик (глянцевое стекло + рефлекс Френеля)
 * - Полная изоляция SVG <defs> с уникальными префиксами для каждого клана.
 */

export const CLAN_EMBLEMS = [
  // =========================================================================
  // 1. УЧИХА (Огненный Веер Гунбай & Золотые Томоэ)
  // =========================================================================
  {
    id: 'emblem_uchiha',
    name: 'Герб Учиха (Огненный Веер & Томоэ)',
    kanji: 'うちは',
    element: 'FIRE',
    elementBadge: '🔥 Катон & Шаринган',
    themeColor: '#ef4444',
    bgGradient: 'from-rose-950 via-zinc-950 to-red-950',
    borderColor: 'border-red-500/50',
    glowColor: 'shadow-red-500/40',
    defaultMotto: 'Тот, кто владеет пламенем, разгоняет тьму!',
    desc: 'Легендарный церемониальный веер Учиха из слоновой кости и рубинового шелка. Окаймлен золотыми томоэ Шарингана, шелковой кистью и венцом священного пламени Катона.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_uchiha_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="20%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#ca8a04" />
            <stop offset="70%" stopColor="#854d0e" />
            <stop offset="90%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <radialGradient id="m_uchiha_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#6b0d16" />
            <stop offset="40%" stopColor="#3b040a" />
            <stop offset="75%" stopColor="#180104" />
            <stop offset="100%" stopColor="#050001" />
          </radialGradient>
          <linearGradient id="m_uchiha_red" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff4d6d" />
            <stop offset="35%" stopColor="#ef4444" />
            <stop offset="75%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <linearGradient id="m_uchiha_ivory" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f4f4f5" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <filter id="m_uchiha_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.9" />
          </filter>
          <radialGradient id="m_uchiha_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Наружное огненное сияние чакры */}
        <circle cx="50" cy="50" r="49" stroke="#ef4444" strokeWidth="1" opacity="0.35" />

        {/* Чеканный золотой обод с тройной фаской */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_uchiha_gold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_uchiha_gold)" strokeWidth="1" strokeDasharray="3 2" />

        {/* 12 Золотых заклепок по ободу */}
        <g fill="url(#m_uchiha_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        {/* Обсидиановое эмалевое дно */}
        <circle cx="50" cy="50" r="42" fill="url(#m_uchiha_gem)" />

        {/* Гравированные лучи Катона и язычки пламени */}
        <g stroke="url(#m_uchiha_gold)" strokeWidth="0.5" opacity="0.25">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <line key={i} x1="50" y1="50" x2={50 + 40 * Math.cos(rad)} y2={50 + 40 * Math.sin(rad)} />;
          })}
          <circle cx="50" cy="50" r="32" strokeDasharray="4 3" />
        </g>

        {/* Рельефный веер Учиха Гунбай */}
        <g filter="url(#m_uchiha_shadow)">
          {/* Рукоять веера с золотой оплеткой и кистью */}
          <path d="M46 64 L46 88 C46 90.5 47.8 92 50 92 C52.2 92 54 90.5 54 88 L54 64 Z" fill="url(#m_uchiha_gold)" stroke="#713f12" strokeWidth="0.8" />
          <line x1="46" y1="70" x2="54" y2="70" stroke="#451a03" strokeWidth="1.2" />
          <line x1="46" y1="76" x2="54" y2="76" stroke="#451a03" strokeWidth="1.2" />
          <line x1="46" y1="82" x2="54" y2="82" stroke="#451a03" strokeWidth="1.2" />
          {/* Шелковая кисть на рукояти */}
          <circle cx="50" cy="90" r="1.8" fill="#18181b" stroke="url(#m_uchiha_gold)" strokeWidth="0.8" />
          <path d="M49 92 L47 96 M51 92 L53 96 M50 92 L50 97" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />

          {/* Нижняя половина (слоновая кость с текстурными ребрами) */}
          <path d="M22 48 C22 62 34 68 50 68 C66 68 78 62 78 48 Z" fill="url(#m_uchiha_ivory)" stroke="url(#m_uchiha_gold)" strokeWidth="1.4" />
          <path d="M34 50 Q42 62 50 67" stroke="#e4e4e7" strokeWidth="0.8" opacity="0.6" />
          <path d="M66 50 Q58 62 50 67" stroke="#e4e4e7" strokeWidth="0.8" opacity="0.6" />

          {/* Верхняя алая половина (рубин с золотой фаской) */}
          <path d="M22 48 C22 30 34 18 50 18 C66 18 78 30 78 48 Z" fill="url(#m_uchiha_red)" stroke="url(#m_uchiha_gold)" strokeWidth="1.6" />
          <path d="M34 46 Q42 26 50 20" stroke="#fca5a5" strokeWidth="0.8" opacity="0.4" />
          <path d="M66 46 Q58 26 50 20" stroke="#fca5a5" strokeWidth="0.8" opacity="0.4" />

          {/* Золотой разделительный молдинг */}
          <line x1="22" y1="48" x2="78" y2="48" stroke="url(#m_uchiha_gold)" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="24" y1="48" x2="76" y2="48" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />

          {/* Три золотых томоэ Шарингана вокруг веера */}
          <g fill="url(#m_uchiha_gold)" filter="drop-shadow(0 0 4px #ef4444)">
            <circle cx="28" cy="28" r="2.4" />
            <path d="M28 26 C30 26 31 29 29 31 C27.5 32.5 26 30 28 26 Z" />
            <circle cx="72" cy="28" r="2.4" />
            <path d="M72 26 C74 26 75 29 73 31 C71.5 32.5 70 30 72 26 Z" />
            <circle cx="50" cy="12" r="2.4" />
            <path d="M50 10 C52 10 53 13 51 15 C49.5 16.5 48 14 50 10 Z" />
          </g>
        </g>

        {/* Купольный софтбокс-блик стекла */}
        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_uchiha_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        {/* Рефлекс Френеля снизу справа */}
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
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
    element: 'SEALING',
    elementBadge: '🌀 Фуиндзюцу & Жизнь',
    themeColor: '#f97316',
    bgGradient: 'from-orange-950 via-zinc-950 to-red-950',
    borderColor: 'border-orange-500/50',
    glowColor: 'shadow-orange-500/40',
    defaultMotto: 'Воля водоворота никогда не угаснет!',
    desc: 'Священный вихрь Удзусио: многослойная золотая спираль жизненной силы, волны Сейгайха и 4 священные печати четырех стихий Сики Фудзин.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_uzu_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff7ed" />
            <stop offset="25%" stopColor="#fed7aa" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="75%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          <radialGradient id="m_uzu_gem" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#9a3412" />
            <stop offset="45%" stopColor="#431407" />
            <stop offset="80%" stopColor="#1c0602" />
            <stop offset="100%" stopColor="#050100" />
          </radialGradient>
          <linearGradient id="m_uzu_spiral" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff8a4c" />
            <stop offset="45%" stopColor="#ea580c" />
            <stop offset="85%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
          <filter id="m_uzu_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_uzu_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Внешний ореол */}
        <circle cx="50" cy="50" r="49" stroke="#f97316" strokeWidth="1" opacity="0.35" />

        {/* Чеканный золотой обод */}
        <circle cx="50" cy="50" r="48" stroke="url(#m_uzu_gold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_uzu_gold)" strokeWidth="1" strokeDasharray="3 2" />

        {/* 12 Заклепок */}
        <g fill="url(#m_uzu_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        {/* Огненное эмалевое дно */}
        <circle cx="50" cy="50" r="42" fill="url(#m_uzu_gem)" />

        {/* Волны Сейгайха и кольца печати */}
        <g stroke="url(#m_uzu_gold)" strokeWidth="0.6" opacity="0.3" fill="none">
          <circle cx="50" cy="50" r="37" strokeDasharray="6 4" />
          <circle cx="50" cy="50" r="29" strokeDasharray="4 3" />
          <circle cx="50" cy="50" r="21" strokeDasharray="3 2" />
        </g>

        {/* 3D Спираль Удзумаки с золотым гребнем */}
        <g filter="url(#m_uzu_shadow)">
          <path 
            d="M50 50 m 0, -4.5 a 4.5,4.5 0 0,1 4.5,4.5 a 9,9 0 0,1 -9,9 a 14.5,14.5 0 0,1 -14.5,-14.5 a 20,20 0 0,1 20,-20 a 25.5,25.5 0 0,1 25.5,25.5 a 31,31 0 0,1 -31,31" 
            stroke="url(#m_uzu_spiral)" 
            strokeWidth="7.5" 
            strokeLinecap="round" 
          />
          <path 
            d="M50 50 m 0, -4.5 a 4.5,4.5 0 0,1 4.5,4.5 a 9,9 0 0,1 -9,9 a 14.5,14.5 0 0,1 -14.5,-14.5 a 20,20 0 0,1 20,-20 a 25.5,25.5 0 0,1 25.5,25.5 a 31,31 0 0,1 -31,31" 
            stroke="url(#m_uzu_gold)" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            opacity="0.95"
          />
          <path 
            d="M50 50 m 0, -4.5 a 4.5,4.5 0 0,1 4.5,4.5 a 9,9 0 0,1 -9,9 a 14.5,14.5 0 0,1 -14.5,-14.5 a 20,20 0 0,1 20,-20" 
            stroke="#ffffff" 
            strokeWidth="0.8" 
            strokeLinecap="round" 
            opacity="0.75"
          />
        </g>

        {/* 4 Священные печати Сики Фудзин с руническими символами */}
        <g fill="url(#m_uzu_gold)">
          <circle cx="50" cy="14" r="3.2" stroke="#431407" strokeWidth="0.8" />
          <circle cx="86" cy="50" r="3.2" stroke="#431407" strokeWidth="0.8" />
          <circle cx="50" cy="86" r="3.2" stroke="#431407" strokeWidth="0.8" />
          <circle cx="14" cy="50" r="3.2" stroke="#431407" strokeWidth="0.8" />
          <circle cx="50" cy="14" r="1.2" fill="#ffffff" />
          <circle cx="86" cy="50" r="1.2" fill="#ffffff" />
          <circle cx="50" cy="86" r="1.2" fill="#ffffff" />
          <circle cx="14" cy="50" r="1.2" fill="#ffffff" />
        </g>

        {/* Стеклянный блик */}
        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_uzu_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
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
    element: 'WOOD',
    elementBadge: '🌿 Мокутон & Асура',
    themeColor: '#10b981',
    bgGradient: 'from-emerald-950 via-zinc-950 to-green-950',
    borderColor: 'border-emerald-500/50',
    glowColor: 'shadow-emerald-500/40',
    defaultMotto: 'Воля Огня пускает корни глубоко в сердце!',
    desc: 'Священный скипетр Ваджра клана Сенджу из древней бронзы и золота. Обвит живыми побегами священного древа Мокутон с ограненным изумрудом чакры Асуры.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_senju_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ecfdf5" />
            <stop offset="25%" stopColor="#a7f3d0" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="75%" stopColor="#047857" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <radialGradient id="m_senju_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#065f46" />
            <stop offset="45%" stopColor="#022c22" />
            <stop offset="80%" stopColor="#011811" />
            <stop offset="100%" stopColor="#000906" />
          </radialGradient>
          <filter id="m_senju_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_senju_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="49" stroke="#10b981" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="48" stroke="url(#m_senju_gold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_senju_gold)" strokeWidth="1" strokeDasharray="3 3" />

        <g fill="url(#m_senju_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        <circle cx="50" cy="50" r="42" fill="url(#m_senju_gem)" />

        {/* Кольца древесного среза */}
        <g stroke="url(#m_senju_gold)" strokeWidth="0.5" opacity="0.3">
          <circle cx="50" cy="50" r="36" />
          <circle cx="50" cy="50" r="28" />
          <circle cx="50" cy="50" r="20" />
        </g>

        {/* Рельефная Ваджра Мокутона */}
        <g filter="url(#m_senju_shadow)">
          <line x1="50" y1="13" x2="50" y2="87" stroke="url(#m_senju_gold)" strokeWidth="6" strokeLinecap="round" />
          <line x1="50" y1="15" x2="50" y2="85" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />

          {/* Перекладины */}
          <line x1="26" y1="34" x2="74" y2="34" stroke="url(#m_senju_gold)" strokeWidth="4.2" strokeLinecap="round" />
          <line x1="30" y1="50" x2="70" y2="50" stroke="url(#m_senju_gold)" strokeWidth="3.8" strokeLinecap="round" />
          <line x1="26" y1="66" x2="74" y2="66" stroke="url(#m_senju_gold)" strokeWidth="4.2" strokeLinecap="round" />

          {/* Верхний и нижний трехзубец */}
          <path d="M38 22 L50 11 L62 22" fill="none" stroke="url(#m_senju_gold)" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M38 78 L50 89 L62 78" fill="none" stroke="url(#m_senju_gold)" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />

          {/* Живые изумрудные листья чакры */}
          <path d="M26 34 Q18 22 28 18 Q36 28 26 34" fill="#34d399" stroke="url(#m_senju_gold)" strokeWidth="1.2" />
          <path d="M74 34 Q82 22 72 18 Q64 28 74 34" fill="#34d399" stroke="url(#m_senju_gold)" strokeWidth="1.2" />
          <path d="M26 66 Q18 78 28 82 Q36 72 26 66" fill="#34d399" stroke="url(#m_senju_gold)" strokeWidth="1.2" />
          <path d="M74 66 Q82 78 72 82 Q64 72 74 66" fill="#34d399" stroke="url(#m_senju_gold)" strokeWidth="1.2" />

          {/* Центральный ограненный изумруд чакры Асуры */}
          <circle cx="50" cy="50" r="8" fill="#10b981" stroke="url(#m_senju_gold)" strokeWidth="2" />
          <circle cx="50" cy="50" r="4" fill="#a7f3d0" />
          <circle cx="48.5" cy="48.5" r="1.5" fill="#ffffff" />
        </g>

        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_senju_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
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
    element: 'BYAKUGAN',
    elementBadge: '👁️ Бьякуган & Дзюкэн',
    themeColor: '#c084fc',
    bgGradient: 'from-purple-950 via-zinc-950 to-indigo-950',
    borderColor: 'border-purple-500/50',
    glowColor: 'shadow-purple-500/40',
    defaultMotto: 'Всеведущий взор не знает слепых зон!',
    desc: 'Священная мандала Багуа: 8 триграмм поля 64 ладоней, перламутровое пламя Мягкого кулака и вращающийся знак Тайцзи (Инь-Ян).',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_hyuga_plat" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#f3e8ff" />
            <stop offset="65%" stopColor="#c084fc" />
            <stop offset="85%" stopColor="#7e22ce" />
            <stop offset="100%" stopColor="#e9d5ff" />
          </linearGradient>
          <radialGradient id="m_hyuga_gem" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4c1d95" />
            <stop offset="45%" stopColor="#2e1065" />
            <stop offset="80%" stopColor="#110328" />
            <stop offset="100%" stopColor="#04000d" />
          </radialGradient>
          <linearGradient id="m_hyuga_flame" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f5f3ff" />
            <stop offset="80%" stopColor="#d8b4fe" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id="m_hyuga_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_hyuga_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="49" stroke="#c084fc" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="48" stroke="url(#m_hyuga_plat)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_hyuga_plat)" strokeWidth="1" strokeDasharray="4 2" />

        <g fill="url(#m_hyuga_plat)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        <circle cx="50" cy="50" r="42" fill="url(#m_hyuga_gem)" />

        {/* 8 Триграмм И-Цзин поля Багуа */}
        <g stroke="url(#m_hyuga_plat)" strokeWidth="1.3" opacity="0.5">
          {/* Верхняя триграмма Цянь (☰) */}
          <line x1="44" y1="13.5" x2="56" y2="13.5" />
          <line x1="44" y1="16" x2="56" y2="16" />
          <line x1="44" y1="18.5" x2="56" y2="18.5" />

          {/* Нижняя триграмма Кунь (☷) */}
          <line x1="44" y1="81.5" x2="48.5" y2="81.5" /><line x1="51.5" y1="81.5" x2="56" y2="81.5" />
          <line x1="44" y1="84" x2="48.5" y2="84" /><line x1="51.5" y1="84" x2="56" y2="84" />
          <line x1="44" y1="86.5" x2="48.5" y2="86.5" /><line x1="51.5" y1="86.5" x2="56" y2="86.5" />

          {/* Правая триграмма Ли (☲) */}
          <line x1="81.5" y1="45" x2="86.5" y2="45" />
          <line x1="81.5" y1="50" x2="83.2" y2="50" /><line x1="84.8" y1="50" x2="86.5" y2="50" />
          <line x1="81.5" y1="55" x2="86.5" y2="55" />

          {/* Левая триграмма Кань (☵) */}
          <line x1="13.5" y1="45" x2="15.2" y2="45" /><line x1="16.8" y1="45" x2="18.5" y2="45" />
          <line x1="13.5" y1="50" x2="18.5" y2="50" />
          <line x1="13.5" y1="55" x2="15.2" y2="55" /><line x1="16.8" y1="55" x2="18.5" y2="55" />
        </g>

        <circle cx="50" cy="50" r="31" stroke="url(#m_hyuga_plat)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

        {/* Перламутровое пламя Дзюкэн */}
        <g filter="url(#m_hyuga_shadow)">
          <path 
            d="M50 17 C39 31 35 44 35 54 C35 67 41 75 50 75 C59 75 65 67 65 54 C65 44 61 31 50 17 Z" 
            fill="url(#m_hyuga_flame)" 
            stroke="url(#m_hyuga_plat)" 
            strokeWidth="2"
          />
          <path 
            d="M50 31 C44 41 42 48 42 55 C42 62 45 67 50 67 C55 67 58 62 58 55 C58 48 56 41 50 31 Z" 
            fill="#a855f7" 
            opacity="0.85" 
          />

          {/* Знак Тайцзи (Инь-Ян) в ядре пламени */}
          <circle cx="50" cy="55" r="5.5" fill="#ffffff" stroke="#4c1d95" strokeWidth="1.2" />
          <path d="M50 49.5 A2.75 2.75 0 0 1 50 55 A2.75 2.75 0 0 0 50 60.5 A5.5 5.5 0 0 1 50 49.5 Z" fill="#4c1d95" />
          <circle cx="50" cy="52.2" r="1" fill="#4c1d95" />
          <circle cx="50" cy="57.8" r="1" fill="#ffffff" />
        </g>

        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_hyuga_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
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
    element: 'LIGHTNING',
    elementBadge: '⚡ Райтон & Икадзути',
    themeColor: '#38bdf8',
    bgGradient: 'from-sky-950 via-zinc-950 to-blue-950',
    borderColor: 'border-sky-500/50',
    glowColor: 'shadow-sky-500/40',
    defaultMotto: 'Скорость небесной молнии разит без пощады!',
    desc: 'Герб громового клана Тэнрай: небесный трезубец разрядов Икадзутигана, 3 барабана Томоэ бога грома Райдзина и искрящиеся электрические дуги Райтона.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_tenrai_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="30%" stopColor="#38bdf8" />
            <stop offset="65%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <radialGradient id="m_tenrai_gem" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#075985" />
            <stop offset="45%" stopColor="#032b43" />
            <stop offset="80%" stopColor="#011420" />
            <stop offset="100%" stopColor="#00060a" />
          </radialGradient>
          <filter id="m_tenrai_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_tenrai_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="49" stroke="#38bdf8" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="48" stroke="url(#m_tenrai_gold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_tenrai_gold)" strokeWidth="1" strokeDasharray="3 3" />

        <g fill="url(#m_tenrai_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        <circle cx="50" cy="50" r="42" fill="url(#m_tenrai_gem)" />

        {/* 3 Барабана Райдзина с черными томоэ */}
        <g stroke="url(#m_tenrai_gold)" strokeWidth="1.4">
          <circle cx="50" cy="19" r="6.8" fill="#082f49" />
          <circle cx="50" cy="19" r="2.6" fill="#38bdf8" />
          <circle cx="23" cy="66" r="6.8" fill="#082f49" />
          <circle cx="23" cy="66" r="2.6" fill="#38bdf8" />
          <circle cx="77" cy="66" r="6.8" fill="#082f49" />
          <circle cx="77" cy="66" r="2.6" fill="#38bdf8" />
        </g>

        {/* Рельефный Громовой Трезубец */}
        <g filter="url(#m_tenrai_shadow)">
          <path d="M50 13 L43 42 L53 42 L41 87 L65 48 L53 48 L61 13 Z" fill="url(#m_tenrai_gold)" stroke="#e0f2fe" strokeWidth="1.4" />
          <path d="M25 33 L36 42 L30 49 L44 55" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M75 33 L64 42 L70 49 L56 55" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="50" cy="46" r="3.2" fill="#ffffff" />
        </g>

        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_tenrai_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
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
    element: 'WATER',
    elementBadge: '🌊 Суйтон & Аойган',
    themeColor: '#06b6d4',
    bgGradient: 'from-cyan-950 via-zinc-950 to-teal-950',
    borderColor: 'border-cyan-500/50',
    glowColor: 'shadow-cyan-500/40',
    defaultMotto: 'Океан сокрушает даже самые крепкие утесы!',
    desc: 'Лазурный герб морского клана Синкай: закрученный в спираль драконий водоворот Аойгана, пенные гребни волн и жемчужное ядро океанской бездны.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_shinkai_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ecfeff" />
            <stop offset="30%" stopColor="#06b6d4" />
            <stop offset="70%" stopColor="#0e7490" />
            <stop offset="100%" stopColor="#a5f3fc" />
          </linearGradient>
          <radialGradient id="m_shinkai_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#155e75" />
            <stop offset="50%" stopColor="#083344" />
            <stop offset="85%" stopColor="#011822" />
            <stop offset="100%" stopColor="#00070a" />
          </radialGradient>
          <linearGradient id="m_shinkai_drop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <filter id="m_shinkai_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.8" />
          </filter>
          <radialGradient id="m_shinkai_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="49" stroke="#06b6d4" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="48" stroke="url(#m_shinkai_gold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_shinkai_gold)" strokeWidth="1" strokeDasharray="3 2" />

        <g fill="url(#m_shinkai_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        <circle cx="50" cy="50" r="42" fill="url(#m_shinkai_gem)" />

        <g stroke="url(#m_shinkai_gold)" strokeWidth="1.2" opacity="0.35" fill="none">
          <circle cx="50" cy="50" r="35" strokeDasharray="5 3" />
          <path d="M15 67 Q33 58 50 67 T85 67" strokeWidth="1.8" />
          <path d="M19 75 Q35 68 50 75 T81 75" strokeWidth="2.2" />
        </g>

        {/* Рельефная тройная капля Аойгана */}
        <g filter="url(#m_shinkai_shadow)">
          <path 
            d="M50 19 C50 19 67 39 67 54 C67 64 59 71 50 71 C41 71 33 64 33 54 C33 39 50 19 50 19 Z" 
            fill="url(#m_shinkai_drop)" 
            stroke="url(#m_shinkai_gold)" 
            strokeWidth="2" 
          />
          <path 
            d="M31 52 C31 52 19 60 19 68 C19 75 25 79 31 79 C37 79 42 75 42 68 C42 60 31 52 31 52 Z" 
            fill="url(#m_shinkai_drop)" 
            stroke="url(#m_shinkai_gold)" 
            strokeWidth="1.4" 
          />
          <path 
            d="M69 52 C69 52 58 60 58 68 C58 75 63 79 69 79 C75 79 81 75 81 68 C81 60 69 52 69 52 Z" 
            fill="url(#m_shinkai_drop)" 
            stroke="url(#m_shinkai_gold)" 
            strokeWidth="1.4" 
          />
          <circle cx="50" cy="54" r="5.5" fill="#cffafe" stroke="#0891b2" strokeWidth="1.2" />
          <circle cx="48.2" cy="52.2" r="1.8" fill="#ffffff" />
        </g>

        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_shinkai_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
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
    element: 'ANALYSIS',
    elementBadge: '💎 Кинган & Раскол',
    themeColor: '#eab308',
    bgGradient: 'from-amber-950 via-zinc-950 to-yellow-950',
    borderColor: 'border-yellow-500/50',
    glowColor: 'shadow-yellow-500/40',
    defaultMotto: 'В любой броне и технике есть роковой шов!',
    desc: 'Ограненный кристалл червонного золота Кингана с зеркальными призмами анализа уязвимостей, лазерным прицелом и линиями раскола барьеров.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_kingan_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="30%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#ca8a04" />
            <stop offset="85%" stopColor="#854d0e" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
          <radialGradient id="m_kingan_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#854d0e" />
            <stop offset="50%" stopColor="#451a03" />
            <stop offset="85%" stopColor="#1a0901" />
            <stop offset="100%" stopColor="#050100" />
          </radialGradient>
          <linearGradient id="m_kingan_prism" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="45%" stopColor="#eab308" />
            <stop offset="80%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <filter id="m_kingan_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_kingan_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="49" stroke="#eab308" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="48" stroke="url(#m_kingan_gold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_kingan_gold)" strokeWidth="1" strokeDasharray="3 3" />

        <g fill="url(#m_kingan_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        <circle cx="50" cy="50" r="42" fill="url(#m_kingan_gem)" />

        {/* Лазерные оси разлома с угловыми насечками */}
        <g stroke="url(#m_kingan_gold)" strokeWidth="0.8" opacity="0.4">
          <circle cx="50" cy="50" r="36" strokeDasharray="4 4" />
          <line x1="14" y1="50" x2="86" y2="50" strokeDasharray="2 3" />
          <line x1="50" y1="14" x2="50" y2="86" strokeDasharray="2 3" />
        </g>

        {/* Ограненный кристалл Кингана */}
        <g filter="url(#m_kingan_shadow)">
          <polygon points="50,14 83,50 50,86 17,50" fill="url(#m_kingan_prism)" stroke="url(#m_kingan_gold)" strokeWidth="2.2" />
          <polygon points="50,25 72,50 50,75 28,50" fill="#a16207" stroke="url(#m_kingan_gold)" strokeWidth="1.4" />

          {/* Центральный солнечный диск */}
          <circle cx="50" cy="50" r="14" fill="url(#m_kingan_gold)" stroke="#713f12" strokeWidth="1.4" />
          <circle cx="50" cy="50" r="6.5" fill="#ffffff" />
          <circle cx="48.5" cy="48.5" r="2" fill="#fef08a" />

          {/* 4 Золотые призматические вершины */}
          <circle cx="50" cy="14" r="2.4" fill="#ffffff" stroke="url(#m_kingan_gold)" strokeWidth="0.8" />
          <circle cx="83" cy="50" r="2.4" fill="#ffffff" stroke="url(#m_kingan_gold)" strokeWidth="0.8" />
          <circle cx="50" cy="86" r="2.4" fill="#ffffff" stroke="url(#m_kingan_gold)" strokeWidth="0.8" />
          <circle cx="17" cy="50" r="2.4" fill="#ffffff" stroke="url(#m_kingan_gold)" strokeWidth="0.8" />
        </g>

        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_kingan_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
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
    element: 'SHADOW',
    elementBadge: '🌑 Каге & Интеллект',
    themeColor: '#84cc16',
    bgGradient: 'from-lime-950 via-zinc-950 to-emerald-950',
    borderColor: 'border-lime-500/50',
    glowColor: 'shadow-lime-500/40',
    defaultMotto: 'Победа куется тактикой и холодным расчетом!',
    desc: 'Благородные ветвистые рога священного белого оленя клана Нара на фоне зеркала теневых нитей Каге Мане но Дзюцу.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_nara_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f7fee7" />
            <stop offset="25%" stopColor="#bef264" />
            <stop offset="55%" stopColor="#65a30d" />
            <stop offset="85%" stopColor="#365314" />
            <stop offset="100%" stopColor="#d9f99d" />
          </linearGradient>
          <radialGradient id="m_nara_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="45%" stopColor="#052e16" />
            <stop offset="80%" stopColor="#02140a" />
            <stop offset="100%" stopColor="#000703" />
          </radialGradient>
          <filter id="m_nara_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_nara_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="49" stroke="#84cc16" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="48" stroke="url(#m_nara_gold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_nara_gold)" strokeWidth="1" strokeDasharray="3 3" />

        <g fill="url(#m_nara_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        <circle cx="50" cy="50" r="42" fill="url(#m_nara_gem)" />

        {/* Обсидиановое зеркало тени */}
        <circle cx="50" cy="50" r="29" fill="#09090b" stroke="url(#m_nara_gold)" strokeWidth="2" />

        {/* Теневые щупальца Каге Мане */}
        <g stroke="#65a30d" strokeWidth="1.6" strokeLinecap="round" opacity="0.65" fill="none">
          <path d="M50 50 Q36 60 26 52 Q18 46 22 36" />
          <path d="M50 50 Q64 60 74 52 Q82 46 78 36" />
          <path d="M50 50 Q42 34 50 24" />
        </g>

        {/* Рельефные золотые оленьи рога */}
        <g filter="url(#m_nara_shadow)" stroke="url(#m_nara_gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M48 68 C46 54 38 42 26 34" />
          <path d="M38 48 C30 44 24 45 18 43" />
          <path d="M44 68 C44 48 38 32 32 20" />

          <path d="M52 68 C54 54 62 42 74 34" />
          <path d="M62 48 C70 44 76 45 82 43" />
          <path d="M56 68 C56 48 62 32 68 20" />

          <polygon points="50,62 46,74 54,74" fill="url(#m_nara_gold)" strokeWidth="1" />
        </g>

        <circle cx="50" cy="74" r="3.8" fill="#a3e635" stroke="#365314" strokeWidth="1.2" />

        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_nara_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
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
    element: 'YANG',
    elementBadge: '💥 Калории & Титан',
    themeColor: '#f43f5e',
    bgGradient: 'from-rose-950 via-zinc-950 to-pink-950',
    borderColor: 'border-rose-500/50',
    glowColor: 'shadow-rose-500/40',
    defaultMotto: 'Истинная мощь рождается в великом теле!',
    desc: 'Величественные сияющие крылья чакровой бабочки Чодан Бакугеки и рубиновый щит со священным золотым рельефным кандзи «食» (Пища / Богатырская мощь).',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_aki_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff1f2" />
            <stop offset="25%" stopColor="#fecdd3" />
            <stop offset="55%" stopColor="#f43f5e" />
            <stop offset="85%" stopColor="#9f1239" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
          <radialGradient id="m_aki_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#9f1239" />
            <stop offset="45%" stopColor="#4c0519" />
            <stop offset="80%" stopColor="#1f020a" />
            <stop offset="100%" stopColor="#080002" />
          </radialGradient>
          <filter id="m_aki_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_aki_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="49" stroke="#f43f5e" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="48" stroke="url(#m_aki_gold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_aki_gold)" strokeWidth="1" strokeDasharray="3 3" />

        <g fill="url(#m_aki_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        <circle cx="50" cy="50" r="42" fill="url(#m_aki_gem)" />

        {/* Крылья бабочки Чодан Бакугеки */}
        <g opacity="0.65" stroke="url(#m_aki_gold)" strokeWidth="1.4">
          <path d="M50 50 C28 16 8 22 12 48 C15 67 33 73 50 56 Z" fill="#fb7185" fillOpacity="0.45" />
          <path d="M50 50 C72 16 92 22 88 48 C85 67 67 73 50 56 Z" fill="#fb7185" fillOpacity="0.45" />
        </g>

        {/* Центральный рубиновый щит с кандзи 食 */}
        <g filter="url(#m_aki_shadow)">
          <circle cx="50" cy="50" r="23" fill="#e11d48" stroke="url(#m_aki_gold)" strokeWidth="2.6" />
          <circle cx="50" cy="50" r="20" stroke="#fda4af" strokeWidth="0.9" />
          <text 
            x="50" 
            y="59" 
            fontSize="26" 
            fontWeight="900" 
            fill="url(#m_aki_gold)" 
            stroke="#881337" 
            strokeWidth="0.8" 
            textAnchor="middle" 
            fontFamily="'Hiragino Mincho Pro', 'Yu Mincho', serif"
          >
            食
          </text>
        </g>

        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_aki_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
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
    element: 'YIN',
    elementBadge: '🔮 Телепатия & Разум',
    themeColor: '#a855f7',
    bgGradient: 'from-purple-950 via-zinc-950 to-violet-950',
    borderColor: 'border-purple-500/50',
    glowColor: 'shadow-purple-500/40',
    defaultMotto: 'Разум проникает сквозь любые преграды!',
    desc: 'Аметистовый цветок кустарникового клевера Хаги с золотой сердцевиной и кольцами телепатической пси-связи Синтенсин но Дзюцу.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_yama_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#faf5ff" />
            <stop offset="25%" stopColor="#e9d5ff" />
            <stop offset="55%" stopColor="#a855f7" />
            <stop offset="85%" stopColor="#6b21a8" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <radialGradient id="m_yama_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#6b21a8" />
            <stop offset="45%" stopColor="#3b0764" />
            <stop offset="80%" stopColor="#1a012d" />
            <stop offset="100%" stopColor="#06000a" />
          </radialGradient>
          <filter id="m_yama_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.8" />
          </filter>
          <radialGradient id="m_yama_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="49" stroke="#a855f7" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="48" stroke="url(#m_yama_gold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_yama_gold)" strokeWidth="1" strokeDasharray="3 3" />

        <g fill="url(#m_yama_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        <circle cx="50" cy="50" r="42" fill="url(#m_yama_gem)" />

        {/* Кольца телепатической пси-связи */}
        <g stroke="url(#m_yama_gold)" strokeWidth="0.9" opacity="0.45" fill="none">
          <circle cx="50" cy="50" r="35" strokeDasharray="4 3" />
          <circle cx="50" cy="50" r="27" strokeDasharray="3 2" />
        </g>

        {/* Аметистовый цветок кустарникового клевера Хаги */}
        <g filter="url(#m_yama_shadow)">
          <circle cx="50" cy="33" r="11" fill="#9333ea" stroke="url(#m_yama_gold)" strokeWidth="1.4" />
          <circle cx="65" cy="44" r="11" fill="#7e22ce" stroke="url(#m_yama_gold)" strokeWidth="1.4" />
          <circle cx="60" cy="63" r="11" fill="#6b21a8" stroke="url(#m_yama_gold)" strokeWidth="1.4" />
          <circle cx="40" cy="63" r="11" fill="#6b21a8" stroke="url(#m_yama_gold)" strokeWidth="1.4" />
          <circle cx="35" cy="44" r="11" fill="#7e22ce" stroke="url(#m_yama_gold)" strokeWidth="1.4" />

          {/* Золотая сердцевина цветка с глазом разума */}
          <circle cx="50" cy="50" r="8.5" fill="#f3e8ff" stroke="url(#m_yama_gold)" strokeWidth="2.2" />
          <circle cx="50" cy="50" r="4" fill="#7e22ce" />
          <circle cx="48.5" cy="48.5" r="1.2" fill="#ffffff" />
        </g>

        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_yama_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
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
    element: 'INSECTS',
    elementBadge: '🪲 Кикайчу & Рой',
    themeColor: '#14b8a6',
    bgGradient: 'from-teal-950 via-zinc-950 to-slate-950',
    borderColor: 'border-teal-500/50',
    glowColor: 'shadow-teal-500/40',
    defaultMotto: 'Тихий рой поглощает любую чакру!',
    desc: 'Хитиновый изумрудный скарабей Кикайчу с золотыми рунами симбиоза на панцире и шестиугольными сотами защитного гнезда.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_abu_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0fdfa" />
            <stop offset="25%" stopColor="#99f6e4" />
            <stop offset="55%" stopColor="#0d9488" />
            <stop offset="85%" stopColor="#115e59" />
            <stop offset="100%" stopColor="#5eead4" />
          </linearGradient>
          <radialGradient id="m_abu_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#134e4a" />
            <stop offset="45%" stopColor="#042f2e" />
            <stop offset="80%" stopColor="#011615" />
            <stop offset="100%" stopColor="#000606" />
          </radialGradient>
          <filter id="m_abu_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_abu_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="49" stroke="#14b8a6" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="48" stroke="url(#m_abu_gold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_abu_gold)" strokeWidth="1" strokeDasharray="3 3" />

        <g fill="url(#m_abu_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        <circle cx="50" cy="50" r="42" fill="url(#m_abu_gem)" />

        {/* Сотовая решетка роя жуков */}
        <g stroke="url(#m_abu_gold)" strokeWidth="0.8" opacity="0.25" fill="none">
          <polygon points="50,17 59,22 59,33 50,38 41,33 41,22" />
          <polygon points="68,27 77,32 77,43 68,48 59,43 59,32" />
          <polygon points="32,27 41,32 41,43 32,48 23,43 23,32" />
          <polygon points="50,63 59,68 59,79 50,84 41,79 41,68" />
        </g>

        {/* Рельефный жук-скарабей Кикайчу */}
        <g filter="url(#m_abu_shadow)">
          <path d="M33 44 L19 38 M31 54 L15 54 M33 66 L19 72" stroke="url(#m_abu_gold)" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M67 44 L81 38 M69 54 L85 54 M67 66 L81 72" stroke="url(#m_abu_gold)" strokeWidth="2.4" strokeLinecap="round" />

          {/* Панцирь-надкрылья */}
          <ellipse cx="50" cy="55" rx="19.5" ry="25.5" fill="#0d9488" stroke="url(#m_abu_gold)" strokeWidth="2.2" />
          <line x1="50" y1="29" x2="50" y2="81" stroke="url(#m_abu_gold)" strokeWidth="2" />

          {/* Голова и усики */}
          <ellipse cx="50" cy="27" rx="10.5" ry="8.5" fill="#134e4a" stroke="url(#m_abu_gold)" strokeWidth="1.8" />
          <path d="M43 23 Q33 13 27 16" stroke="url(#m_abu_gold)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M57 23 Q67 13 73 16" stroke="url(#m_abu_gold)" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Чакровые люминесцентные точки */}
          <circle cx="43" cy="49" r="2.2" fill="#5eead4" />
          <circle cx="57" cy="49" r="2.2" fill="#5eead4" />
          <circle cx="43" cy="62" r="2.2" fill="#5eead4" />
          <circle cx="57" cy="62" r="2.2" fill="#5eead4" />
        </g>

        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_abu_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
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
    element: 'BEAST',
    elementBadge: '🐺 Тайдзюцу & Нинкен',
    themeColor: '#ef4444',
    bgGradient: 'from-red-950 via-zinc-950 to-amber-950',
    borderColor: 'border-red-500/50',
    glowColor: 'shadow-red-500/40',
    defaultMotto: 'Верность стае и ярость зверя превыше всего!',
    desc: 'Массивные ритуальные клыки клана Инузука в золотом обрамлении, следы звериных когтей и золотой оттиск лапы боевого нинкена Акамару.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_inu_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff1f2" />
            <stop offset="25%" stopColor="#fecaca" />
            <stop offset="55%" stopColor="#ef4444" />
            <stop offset="85%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <radialGradient id="m_inu_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#7f1d1d" />
            <stop offset="45%" stopColor="#450a0a" />
            <stop offset="80%" stopColor="#1a0202" />
            <stop offset="100%" stopColor="#050000" />
          </radialGradient>
          <linearGradient id="m_inu_fang" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff4d4d" />
            <stop offset="45%" stopColor="#dc2626" />
            <stop offset="85%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>
          <filter id="m_inu_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_inu_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="49" stroke="#ef4444" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="48" stroke="url(#m_inu_gold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_inu_gold)" strokeWidth="1" strokeDasharray="3 3" />

        <g fill="url(#m_inu_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        <circle cx="50" cy="50" r="42" fill="url(#m_inu_gem)" />

        {/* 4 следа когтей на фоне */}
        <g stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round" opacity="0.45">
          <line x1="26" y1="19" x2="36" y2="34" />
          <line x1="42" y1="15" x2="48" y2="29" />
          <line x1="58" y1="15" x2="52" y2="29" />
          <line x1="74" y1="19" x2="64" y2="34" />
        </g>

        {/* Рельефные клыки Инузука */}
        <g filter="url(#m_inu_shadow)">
          <polygon points="29,21 44,21 37,77" fill="url(#m_inu_fang)" stroke="url(#m_inu_gold)" strokeWidth="2.2" strokeLinejoin="round" />
          <polygon points="56,21 71,21 63,77" fill="url(#m_inu_fang)" stroke="url(#m_inu_gold)" strokeWidth="2.2" strokeLinejoin="round" />

          {/* Золотой оттиск лапы нинкена */}
          <circle cx="50" cy="46" r="4.2" fill="url(#m_inu_gold)" stroke="#7f1d1d" strokeWidth="0.8" />
          <circle cx="43" cy="38" r="2.4" fill="url(#m_inu_gold)" />
          <circle cx="48" cy="34" r="2.4" fill="url(#m_inu_gold)" />
          <circle cx="54" cy="34" r="2.4" fill="url(#m_inu_gold)" />
          <circle cx="59" cy="38" r="2.4" fill="url(#m_inu_gold)" />
        </g>

        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_inu_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
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
    element: 'FIRE',
    elementBadge: '🔥 5 Стихий & Энма',
    themeColor: '#f97316',
    bgGradient: 'from-orange-950 via-zinc-950 to-amber-950',
    borderColor: 'border-orange-500/50',
    glowColor: 'shadow-orange-500/40',
    defaultMotto: 'Листья кружатся там, где горит истинный Огонь!',
    desc: 'Священный пятилепестковый факел природных стихий клана Сарутоби, алмазный медальон посоха Энмы и 5 цветных драгоценных камней стихий.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_saru_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff7ed" />
            <stop offset="30%" stopColor="#fb923c" />
            <stop offset="65%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <radialGradient id="m_saru_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#9a3412" />
            <stop offset="45%" stopColor="#431407" />
            <stop offset="80%" stopColor="#1c0602" />
            <stop offset="100%" stopColor="#050100" />
          </radialGradient>
          <filter id="m_saru_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_saru_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="49" stroke="#f97316" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="48" stroke="url(#m_saru_gold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_saru_gold)" strokeWidth="1" strokeDasharray="3 3" />

        <g fill="url(#m_saru_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        <circle cx="50" cy="50" r="42" fill="url(#m_saru_gem)" />

        {/* 5 самоцветов стихий по ободу */}
        <g stroke="#18181b" strokeWidth="1">
          <circle cx="50" cy="14" r="3.2" fill="#ef4444" title="Огонь" />
          <circle cx="79" cy="34" r="3.2" fill="#38bdf8" title="Молния" />
          <circle cx="68" cy="74" r="3.2" fill="#10b981" title="Ветер" />
          <circle cx="32" cy="74" r="3.2" fill="#ca8a04" title="Земля" />
          <circle cx="21" cy="34" r="3.2" fill="#06b6d4" title="Вода" />
        </g>

        {/* Рельефный Факел Сарутоби */}
        <g filter="url(#m_saru_shadow)">
          <path 
            d="M50 15 Q65 35 59 48 Q71 44 67 60 Q61 77 50 83 Q39 77 33 60 Q29 44 41 48 Q35 35 50 15 Z" 
            fill="url(#m_saru_gold)" 
            stroke="#7c2d12" 
            strokeWidth="2.2" 
          />
          {/* Алмазный медальон посоха Энмы */}
          <polygon points="50,45 59,56 50,67 41,56" fill="#fef08a" stroke="#451a03" strokeWidth="1.4" />
          <circle cx="50" cy="56" r="3.5" fill="#ea580c" />
          <circle cx="49" cy="55" r="1.2" fill="#ffffff" />
        </g>

        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_saru_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
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
    element: 'LIGHTNING',
    elementBadge: '⚡ Райкири & Белый Клык',
    themeColor: '#94a3b8',
    bgGradient: 'from-slate-950 via-zinc-950 to-zinc-900',
    borderColor: 'border-slate-400/50',
    glowColor: 'shadow-slate-400/40',
    defaultMotto: 'Те, кто нарушают правила — отбросы, но те, кто бросают друзей — хуже отбросов!',
    desc: 'Граненый серебряный танто Сакумо и Какаши Хатаке из дамасской стали с зеркальной линией закалки хамон и ослепительными искрами Райкири.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_hatake_silver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#cbd5e1" />
            <stop offset="65%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <radialGradient id="m_hatake_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="45%" stopColor="#0f172a" />
            <stop offset="80%" stopColor="#050811" />
            <stop offset="100%" stopColor="#010204" />
          </radialGradient>
          <filter id="m_hatake_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_hatake_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="49" stroke="#94a3b8" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="48" stroke="url(#m_hatake_silver)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_hatake_silver)" strokeWidth="1" strokeDasharray="3 3" />

        <g fill="url(#m_hatake_silver)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        <circle cx="50" cy="50" r="42" fill="url(#m_hatake_gem)" />

        {/* Разряды молний Райкири */}
        <g stroke="#38bdf8" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M26 38 L38 44 L31 52 L48 55" />
          <path d="M74 38 L62 44 L69 52 L52 55" />
        </g>

        {/* Рельефный танто Белого Клыка */}
        <g filter="url(#m_hatake_shadow)">
          <path d="M50 13 L57 24 L52 66 L48 66 L43 24 Z" fill="url(#m_hatake_silver)" stroke="#ffffff" strokeWidth="1.4" />
          <line x1="50" y1="17" x2="50" y2="65" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />

          {/* Гарда цуба */}
          <rect x="40" y="66" width="20" height="5.5" rx="1.5" fill="#475569" stroke="url(#m_hatake_silver)" strokeWidth="1.2" />

          {/* Рукоять цука с оплеткой */}
          <rect x="44.5" y="71.5" width="11" height="17" rx="1.2" fill="#1e293b" stroke="url(#m_hatake_silver)" strokeWidth="1" />
          <line x1="44.5" y1="76" x2="55.5" y2="76" stroke="#94a3b8" strokeWidth="1.4" />
          <line x1="44.5" y1="82" x2="55.5" y2="82" stroke="#94a3b8" strokeWidth="1.4" />
        </g>

        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_hatake_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
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
    element: 'WILL_OF_FIRE',
    elementBadge: '🔥 Воля Огня & Каге',
    themeColor: '#ef4444',
    bgGradient: 'from-rose-950 via-amber-950 to-zinc-950',
    borderColor: 'border-amber-500/50',
    glowColor: 'shadow-amber-500/40',
    defaultMotto: 'Деревня — это моя семья, и я защищу ее ценой жизни!',
    desc: 'Священный имперский герб Воли Огня: спираль Скрытого Листа Конохи и золотой каллиграфический иероглиф «火» (Огонь) на церемониальной шляпе Хокаге.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_hoka_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="25%" stopColor="#fde047" />
            <stop offset="55%" stopColor="#f59e0b" />
            <stop offset="85%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
          <radialGradient id="m_hoka_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="45%" stopColor="#450a0a" />
            <stop offset="80%" stopColor="#1a0202" />
            <stop offset="100%" stopColor="#050000" />
          </radialGradient>
          <filter id="m_hoka_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_hoka_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="49" stroke="#ef4444" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="48" stroke="url(#m_hoka_gold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_hoka_gold)" strokeWidth="1" strokeDasharray="3 3" />

        <g fill="url(#m_hoka_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        <circle cx="50" cy="50" r="42" fill="url(#m_hoka_gem)" />

        {/* 8 Языков пламени основателей по ободу */}
        <g fill="url(#m_hoka_gold)" opacity="0.45">
          <polygon points="50,11 53,17 47,17" />
          <polygon points="50,89 53,83 47,83" />
          <polygon points="89,50 83,53 83,47" />
          <polygon points="11,50 17,53 17,47" />
          <polygon points="78,22 73,26 76,29" />
          <polygon points="22,78 27,74 24,71" />
          <polygon points="78,78 73,74 76,71" />
          <polygon points="22,22 27,26 24,29" />
        </g>

        {/* Шляпа Хокаге и спираль Листа Конохи */}
        <g filter="url(#m_hoka_shadow)">
          <polygon points="50,17 79,42 21,42" fill="#ef4444" stroke="url(#m_hoka_gold)" strokeWidth="2.2" strokeLinejoin="round" />
          <polygon points="50,21 75,42 25,42" fill="#f4f4f5" />

          {/* Золотой каллиграфический кандзи 火 */}
          <text 
            x="50" 
            y="38" 
            fontSize="19" 
            fontWeight="900" 
            fill="#dc2626" 
            stroke="url(#m_hoka_gold)" 
            strokeWidth="0.8" 
            textAnchor="middle" 
            fontFamily="'Hiragino Mincho Pro', 'Yu Mincho', serif"
          >
            火
          </text>

          {/* Спираль Листа Конохи */}
          <path 
            d="M34 64 C30 49 42 37 56 39 C64 40 70 47 66 55 C62 63 50 69 42 65 C38 63 35 67 30 75" 
            stroke="url(#m_hoka_gold)" 
            strokeWidth="4.2" 
            fill="none" 
            strokeLinecap="round" 
          />
          <circle cx="50" cy="52" r="3.4" fill="#fde047" stroke="#451a03" strokeWidth="1" />
        </g>

        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_hoka_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
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
    element: 'ANBU',
    elementBadge: '🎭 Спецоперации & Тень',
    themeColor: '#a855f7',
    bgGradient: 'from-zinc-950 via-purple-950 to-slate-950',
    borderColor: 'border-purple-500/50',
    glowColor: 'shadow-purple-500/40',
    defaultMotto: 'Мы действуем из тени, чтобы деревня жила на свету!',
    desc: 'Фарфоровая маска лисицы отряда спецопераций АНБУ с алыми ритуальными метками и горящими глазами на фоне скрещенных клинков ниндзято.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_anbu_plat" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#d8b4fe" />
            <stop offset="65%" stopColor="#7e22ce" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <radialGradient id="m_anbu_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#3b0764" />
            <stop offset="45%" stopColor="#18052e" />
            <stop offset="80%" stopColor="#0a0114" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <filter id="m_anbu_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_anbu_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="49" stroke="#a855f7" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="48" stroke="url(#m_anbu_plat)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_anbu_plat)" strokeWidth="1" strokeDasharray="3 3" />

        <g fill="url(#m_anbu_plat)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        <circle cx="50" cy="50" r="42" fill="url(#m_anbu_gem)" />

        {/* Скрещенные клинки ниндзято */}
        <g stroke="#94a3b8" strokeWidth="2.6" strokeLinecap="round">
          <line x1="21" y1="21" x2="79" y2="79" />
          <line x1="79" y1="21" x2="21" y2="79" />
          <line x1="26" y1="19" x2="19" y2="26" stroke="url(#m_anbu_plat)" strokeWidth="3.4" />
          <line x1="74" y1="19" x2="81" y2="26" stroke="url(#m_anbu_plat)" strokeWidth="3.4" />
        </g>

        {/* Фарфоровая маска Кицунэ АНБУ */}
        <g filter="url(#m_anbu_shadow)">
          <path d="M50 19 C35 19 27 34 27 52 C27 71 37 83 50 83 C63 83 73 71 73 52 C73 34 65 19 50 19 Z" fill="#f4f4f5" stroke="url(#m_anbu_plat)" strokeWidth="2" />

          {/* Лисьи ушки */}
          <polygon points="34,21 27,11 38,17" fill="#e4e4e7" stroke="#71717a" strokeWidth="1" />
          <polygon points="66,21 73,11 62,17" fill="#e4e4e7" stroke="#71717a" strokeWidth="1" />
          <polygon points="33,19 29,14 36,17" fill="#dc2626" />
          <polygon points="67,19 71,14 64,17" fill="#dc2626" />

          {/* Раскосые прорези глаз с алым светом */}
          <path d="M35 46 Q42 41 46 47" stroke="#18181b" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M65 46 Q58 41 54 47" stroke="#18181b" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <line x1="39" y1="46" x2="43" y2="46" stroke="#ef4444" strokeWidth="1.4" />
          <line x1="61" y1="46" x2="57" y2="46" stroke="#ef4444" strokeWidth="1.4" />

          {/* Алые ритуальные изогнутые метки на щеках */}
          <path d="M31 56 Q36 63 44 60" stroke="#dc2626" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M69 56 Q64 63 56 60" stroke="#dc2626" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <polygon points="50,65 48,69 52,69" fill="#18181b" />
        </g>

        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_anbu_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 17. ООЦУЦУКИ (Рога Прародителей & Золотой Риннеган)
  // =========================================================================
  {
    id: 'emblem_otsutsuki',
    name: 'Герб Ооцуцуки (Рога Богов & Золотой Риннеган)',
    kanji: '大筒木',
    element: 'RINNEGAN',
    elementBadge: '👑 Риннеган & Прародители',
    themeColor: '#e0e7ff',
    bgGradient: 'from-indigo-950 via-zinc-950 to-slate-950',
    borderColor: 'border-indigo-400/50',
    glowColor: 'shadow-indigo-400/40',
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
            <stop offset="0%" stopColor="#3730a3" />
            <stop offset="45%" stopColor="#1e1b4b" />
            <stop offset="80%" stopColor="#0b0a21" />
            <stop offset="100%" stopColor="#020008" />
          </radialGradient>
          <filter id="m_otsu_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_otsu_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="49" stroke="#818cf8" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="48" stroke="url(#m_otsu_gold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_otsu_gold)" strokeWidth="1" strokeDasharray="3 3" />

        <g fill="url(#m_otsu_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        <circle cx="50" cy="50" r="42" fill="url(#m_otsu_gem)" />

        {/* Кольца Риннегана на фоне */}
        <g stroke="url(#m_otsu_gold)" strokeWidth="0.9" opacity="0.4" fill="none">
          <circle cx="50" cy="55" r="33" />
          <circle cx="50" cy="55" r="25" />
          <circle cx="50" cy="55" r="17" />
        </g>

        {/* Рельефные Рога Ооцуцуки и Золотой Риннеган */}
        <g filter="url(#m_otsu_shadow)">
          <path d="M42 50 C38 34 24 22 15 15 C22 28 28 42 36 56 Z" fill="#ffffff" stroke="url(#m_otsu_gold)" strokeWidth="1.8" />
          <path d="M58 50 C62 34 76 22 85 15 C78 28 72 42 64 56 Z" fill="#ffffff" stroke="url(#m_otsu_gold)" strokeWidth="1.8" />

          {/* Плод Божественного Древа (Золотой Риннеган) */}
          <ellipse cx="50" cy="56" rx="14.5" ry="10.5" fill="#fef08a" stroke="url(#m_otsu_gold)" strokeWidth="2.2" />
          <circle cx="50" cy="56" r="6.5" fill="#818cf8" stroke="#312e81" strokeWidth="1.2" />
          <circle cx="50" cy="56" r="2.8" fill="#1e1b4b" />
          <circle cx="48.5" cy="54.5" r="1.2" fill="#ffffff" />

          {/* 3 Томоэ */}
          <circle cx="43" cy="56" r="1.6" fill="#312e81" />
          <circle cx="57" cy="56" r="1.6" fill="#312e81" />
          <circle cx="50" cy="50" r="1.6" fill="#312e81" />
        </g>

        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_otsu_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 18. КАЗЕКАГЕ / СУНА (Золотая Тыква Гаары & Алый Кандзи 愛)
  // =========================================================================
  {
    id: 'emblem_kazekage',
    name: 'Герб Казекаге (Золотой Песок & Кандзи 愛)',
    kanji: '風影',
    element: 'SAND',
    elementBadge: '🏜️ Песок & Казекаге',
    themeColor: '#ca8a04',
    bgGradient: 'from-amber-950 via-zinc-950 to-orange-950',
    borderColor: 'border-yellow-600/50',
    glowColor: 'shadow-yellow-600/40',
    defaultMotto: 'Песчаная буря похоронит врагов, оставив лишь Любовь!',
    desc: 'Великая песчаная тыква Гаары с золотыми печатями и священный светящийся алый кандзи «愛» (Любовь) на фоне дюн Сунагакуре.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_suna_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="30%" stopColor="#facc15" />
            <stop offset="65%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
          <radialGradient id="m_suna_gem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="45%" stopColor="#451a03" />
            <stop offset="80%" stopColor="#1c0b02" />
            <stop offset="100%" stopColor="#080200" />
          </radialGradient>
          <filter id="m_suna_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.8" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <radialGradient id="m_suna_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="50" r="49" stroke="#ca8a04" strokeWidth="1" opacity="0.35" />
        <circle cx="50" cy="50" r="48" stroke="url(#m_suna_gold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="45" stroke="#18181b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#m_suna_gold)" strokeWidth="1" strokeDasharray="3 3" />

        <g fill="url(#m_suna_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        <circle cx="50" cy="50" r="42" fill="url(#m_suna_gem)" />

        {/* Песчаные дюны */}
        <g stroke="url(#m_suna_gold)" strokeWidth="0.9" opacity="0.4" fill="none">
          <path d="M17 71 Q35 63 50 71 T83 71" />
          <path d="M21 79 Q38 71 50 79 T79 79" />
        </g>

        {/* Рельефная тыква Гаары и кандзи 愛 */}
        <g filter="url(#m_suna_shadow)">
          <circle cx="50" cy="38" r="13.5" fill="#d97706" stroke="url(#m_suna_gold)" strokeWidth="2" />
          <rect x="46" y="20" width="8" height="7.5" rx="1.5" fill="#92400e" stroke="url(#m_suna_gold)" strokeWidth="1.4" />
          <circle cx="50" cy="62" r="18.5" fill="#b45309" stroke="url(#m_suna_gold)" strokeWidth="2.2" />

          {/* Поясная золотая обвязка */}
          <path d="M37 48 Q50 54 63 48" stroke="url(#m_suna_gold)" strokeWidth="2.6" fill="none" />

          {/* Алый светящийся кандзи 愛 */}
          <text 
            x="50" 
            y="43" 
            fontSize="14.5" 
            fontWeight="900" 
            fill="#ef4444" 
            stroke="#ffffff" 
            strokeWidth="0.5" 
            textAnchor="middle" 
            fontFamily="'Hiragino Mincho Pro', 'Yu Mincho', serif"
          >
            愛
          </text>
        </g>

        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_suna_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.45" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3" pointerEvents="none" />
      </svg>
    )
  },

  // =========================================================================
  // 19. ЭКСКЛЮЗИВ СОЗДАТЕЛЯ: ОКО СОТВОРЕНИЯ И ЕДИНСТВА ВСЕХ КЛАНОВ (創世の神紋)
  // ТОЛЬКО ДЛЯ КИРИЛЛА (askarovkiril5@gmail.com)
  // =========================================================================
  {
    id: 'emblem_creator_genesis',
    name: '👑 Герб Создателя: Око Сотворения и Единства Всех Кланов',
    kanji: '創世',
    element: 'ALL',
    elementBadge: '👑 СОЗДАТЕЛЬ ИГРЫ • КИРИЛЛ • ВСЕ СТИХИИ',
    themeColor: '#facc15',
    bgGradient: 'from-amber-950 via-zinc-950 to-purple-950',
    borderColor: 'border-yellow-400/90',
    glowColor: 'shadow-yellow-400/60',
    isCreatorExclusive: true,
    developerEmail: 'askarovkiril5@gmail.com',
    defaultMotto: 'Тот, кто сотворил этот мир, объединил пламя, молнию и волю всех кланов воедино!',
    desc: 'Священный первородный герб Создателя и Архитектора мира шиноби (Кирилла). Синтезирует величайшие реликвии: рубиновый Гунбай Учиха, Спираль Удзумаки, Ветви Мокутона Сэндзю, 8 Триграмм Хьюга, барабаны Райдзина, 9 парящих сфер Гудодама и Око Ринне-Шарингана под золотой Короной Творца 『創世』.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m_gen_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="75%" stopColor="#a16207" />
            <stop offset="90%" stopColor="#713f12" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
          <radialGradient id="m_gen_cosmos" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#3b0764" />
            <stop offset="40%" stopColor="#1e0a38" />
            <stop offset="75%" stopColor="#090412" />
            <stop offset="100%" stopColor="#020105" />
          </radialGradient>
          <radialGradient id="m_gen_ruby" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="45%" stopColor="#b91c1c" />
            <stop offset="80%" stopColor="#58050e" />
            <stop offset="100%" stopColor="#250205" />
          </radialGradient>
          <radialGradient id="m_gen_gudodama" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="30%" stopColor="#0f172a" />
            <stop offset="85%" stopColor="#020617" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <radialGradient id="m_gen_plasma" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#ff4d4d" />
            <stop offset="75%" stopColor="#990000" />
            <stop offset="100%" stopColor="#2b0000" />
          </radialGradient>
          <filter id="m_gen_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.95" />
          </filter>
          <radialGradient id="m_gen_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 0. Божественный наружный ореол чакры творения */}
        <circle cx="50" cy="50" r="49" stroke="#facc15" strokeWidth="1.2" opacity="0.6" strokeDasharray="3 2" />
        <circle cx="50" cy="50" r="47.5" stroke="#38bdf8" strokeWidth="0.8" opacity="0.45" />

        {/* 1. Чеканный золотой обод с 12 заклепками */}
        <circle cx="50" cy="50" r="46.5" stroke="url(#m_gen_gold)" strokeWidth="2.8" />
        <circle cx="50" cy="50" r="43.5" stroke="#09090b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="42" stroke="url(#m_gen_gold)" strokeWidth="0.8" strokeDasharray="2 1.5" />

        {/* 12 заклепок по ободу */}
        <g fill="url(#m_gen_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 45 * Math.cos(rad)} cy={50 + 45 * Math.sin(rad)} r="1.3" />;
          })}
        </g>

        {/* 2. Космическое эмалевое дно (Клуазоне) */}
        <circle cx="50" cy="50" r="41" fill="url(#m_gen_cosmos)" />

        {/* 3. Щит Гунбай Учиха (Рельефная база в форме веера) */}
        <g filter="url(#m_gen_shadow)">
          {/* Рукоять веера с золотой намоткой */}
          <path d="M48 68 L48 88 C48 90 49 91 50 91 C51 91 52 90 52 88 L52 68 Z" fill="#18181b" stroke="url(#m_gen_gold)" strokeWidth="0.8" />
          <circle cx="50" cy="89" r="1.6" fill="url(#m_gen_gold)" />
          {/* Алая шелковая кисть */}
          <path d="M49 90 L47 95 M51 90 L53 95 M50 90 L50 96" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />

          {/* Корпус Гунбая (двойной лепесток веера) */}
          <path
            d="M 50 16 C 70 16 78 35 68 48 C 76 60 70 74 50 74 C 30 74 24 60 32 48 C 22 35 30 16 50 16 Z"
            fill="url(#m_gen_ruby)"
            stroke="url(#m_gen_gold)"
            strokeWidth="2.2"
          />
        </g>

        {/* 4. Спираль Удзумаки & волны Сейгайха */}
        <g stroke="#fca5a5" fill="none" strokeWidth="0.9" opacity="0.4">
          <circle cx="50" cy="46" r="19" stroke="#fbbf24" strokeWidth="0.6" strokeDasharray="2 2" />
          <path d="M 50 46 A 4 4 0 0 1 50 54 A 8 8 0 0 0 50 38 A 12 12 0 0 1 50 62 A 16 16 0 0 0 50 30" />
        </g>

        {/* 5. Золотые ветви Мокутона Сэндзю */}
        <g stroke="url(#m_gen_gold)" fill="none" strokeWidth="1.2" strokeLinecap="round">
          <path d="M 32 64 C 28 52 24 40 32 30 C 35 24 30 18 38 12" />
          <path d="M 68 64 C 72 52 76 40 68 30 C 65 24 70 18 62 12" />
          {/* Листья Мокутона */}
          <path d="M 28 46 Q 23 44 26 40 Q 30 42 28 46 Z" fill="url(#m_gen_gold)" />
          <path d="M 72 46 Q 77 44 74 40 Q 70 42 72 46 Z" fill="url(#m_gen_gold)" />
          <path d="M 34 26 Q 29 23 32 19 Q 36 22 34 26 Z" fill="url(#m_gen_gold)" />
          <path d="M 66 26 Q 71 23 68 19 Q 64 22 66 26 Z" fill="url(#m_gen_gold)" />
        </g>

        {/* 6. Ореол 8 Триграмм Хьюга & вены Бьякугана */}
        <g stroke="#38bdf8" opacity="0.8" strokeWidth="0.8">
          <circle cx="50" cy="46" r="16" fill="none" strokeDasharray="3 1.5" />
          <path d="M 33 46 C 29 42 26 46 22 44" fill="none" opacity="0.6" strokeWidth="0.7" />
          <path d="M 67 46 C 71 42 74 46 78 44" fill="none" opacity="0.6" strokeWidth="0.7" />
        </g>

        {/* 7. Барабаны Томоэ Райдзина (4 по диагоналям) */}
        {[-45, 45, 135, -135].map((deg) => (
          <g key={deg} transform={`translate(50, 46) rotate(${deg}) translate(0, -25)`}>
            <circle cx="0" cy="0" r="3.2" fill="#09090b" stroke="url(#m_gen_gold)" strokeWidth="0.8" />
            <path d="M -0.8 -1.2 C 1.2 -1.8 1.8 0.6 0.6 1.8 C -0.6 1.8 -1.2 0 -0.8 -1.2 Z" fill="#fbbf24" />
          </g>
        ))}

        {/* 8. Священное Око Ринне-Шарингана (9 томоэ) в ядре */}
        <g transform="translate(50, 46)" filter="url(#m_gen_shadow)">
          <circle cx="0" cy="0" r="12" fill="url(#m_gen_ruby)" stroke="url(#m_gen_gold)" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="9" fill="none" stroke="#18181b" strokeWidth="0.7" />
          <circle cx="0" cy="0" r="6" fill="none" stroke="#18181b" strokeWidth="0.7" />
          <circle cx="0" cy="0" r="3" fill="none" stroke="#18181b" strokeWidth="0.7" />
          
          {/* Сверхновая сингулярность */}
          <circle cx="0" cy="0" r="1.8" fill="url(#m_gen_plasma)" />
          <circle cx="0" cy="0" r="0.7" fill="#ffffff" />

          {/* 9 Томоэ на 3-х орбитах */}
          {[0, 120, 240].map((deg) => (
            <circle key={`t1-${deg}`} cx={Math.cos(deg * Math.PI / 180) * 3} cy={Math.sin(deg * Math.PI / 180) * 3} r="0.7" fill="#000000" />
          ))}
          {[60, 180, 300].map((deg) => (
            <circle key={`t2-${deg}`} cx={Math.cos(deg * Math.PI / 180) * 6} cy={Math.sin(deg * Math.PI / 180) * 6} r="0.8" fill="#000000" />
          ))}
          {[0, 120, 240].map((deg) => (
            <circle key={`t3-${deg}`} cx={Math.cos(deg * Math.PI / 180) * 9} cy={Math.sin(deg * Math.PI / 180) * 9} r="0.9" fill="#000000" />
          ))}
        </g>

        {/* 9. Корона Творца 👑 с кандзи 『創世』 */}
        <g transform="translate(50, 13)" filter="url(#m_gen_shadow)">
          <path
            d="M -12 4 L -15 -7 L -7 -2 L 0 -11 L 7 -2 L 15 -7 L 12 4 Z"
            fill="url(#m_gen_gold)"
            stroke="#78350f"
            strokeWidth="0.9"
          />
          {/* 3 рубина на зубцах короны */}
          <circle cx="-15" cy="-7" r="1.3" fill="#ef4444" stroke="#ffffff" strokeWidth="0.4" />
          <circle cx="0" cy="-11" r="1.7" fill="#ef4444" stroke="#ffffff" strokeWidth="0.5" />
          <circle cx="15" cy="-7" r="1.3" fill="#ef4444" stroke="#ffffff" strokeWidth="0.4" />
          
          {/* Золотой кандзи 『創世』 */}
          <text
            x="0"
            y="2.8"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="4.2"
            fontWeight="900"
            fontFamily="'Hiragino Mincho Pro', 'Yu Mincho', serif"
            style={{ textShadow: '0 0 2px #000000' }}
          >
            創世
          </text>
        </g>

        {/* 10. 9 Сфер Гудодама по внешнему кругу */}
        <g>
          {Array.from({ length: 9 }).map((_, i) => {
            const rad = (i * 40 * Math.PI) / 180;
            const cx = 50 + 36 * Math.cos(rad);
            const cy = 48 + 36 * Math.sin(rad);
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r="3.2" fill="url(#m_gen_gudodama)" stroke="#38bdf8" strokeWidth="0.5" opacity="0.95" />
                <circle cx={cx - 0.9} cy={cy - 0.9} r="0.9" fill="#ffffff" opacity="0.65" />
              </g>
            );
          })}
        </g>

        {/* 11. Двойной купольный софтбокс-блик линзы */}
        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#m_gen_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.5" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.35" pointerEvents="none" />
      </svg>
    )
  }
];

export const DEVELOPER_EMAIL = 'askarovkiril5@gmail.com';

export function isDeveloperAccount(email) {
  if (!email) return false;
  return String(email).trim().toLowerCase() === DEVELOPER_EMAIL;
}

/**
 * Быстрый и безопасный поиск герба клана по его уникальному ID
 */
export function getClanEmblemById(id) {
  if (!id) return CLAN_EMBLEMS[0];
  const found = CLAN_EMBLEMS.find(e => e.id === id);
  return found || CLAN_EMBLEMS[0];
}
