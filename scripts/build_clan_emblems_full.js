const fs = require('fs');
const path = require('path');

// Полноценный генератор 19 императорских гербов кланов (Kamon 3D Masterpiece Edition)
// по эталонному стандарту icon.png (8-слойная ювелирная архитектура).

const CLANS = [
  // 1. УЧИХА
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
    desc: 'Легендарный церемониальный веер Учиха Гунбай из кости и рубинового шелка. Окаймлен золотыми томоэ Шарингана, кованой пластиной с боевыми шрамами и ревущей огненной короной Катона.',
    p: 'm_uchiha',
    lacquerStops: `
      <stop offset="0%" stopColor="#ff4d6d" />
      <stop offset="35%" stopColor="#ef4444" />
      <stop offset="75%" stopColor="#b91c1c" />
      <stop offset="100%" stopColor="#450a0a" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #ef4444)">
        <path d="M 50 2 C 53 -4 60 -1 58 7 C 65 3 71 8 67 15 C 75 12 80 18 77 24 C 84 21 88 28 85 35 C 92 33 96 41 93 48 C 98 47 101 54 96 61 C 100 62 101 70 95 76 C 98 79 97 86 91 90 C 93 94 89 99 83 99 C 83 103 76 105 71 102 C 68 106 61 106 58 101 C 54 105 47 104 45 99 C 40 102 34 100 33 95 C 27 96 23 90 26 84 C 20 83 19 76 23 70 C 17 68 17 60 22 55 C 16 52 18 44 24 41 C 19 36 22 28 29 27 C 26 21 32 14 39 16 C 38 10 45 4 50 2 Z" fill="none" stroke="#ef4444" strokeWidth="1.6" strokeDasharray="6 3" />
        <path d="M 48 0 C 51 -6 58 -2 55 6 C 63 2 68 8 64 14 C 72 11 77 17 74 23" fill="none" stroke="#fde047" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 88 32 C 94 36 96 44 91 49 C 97 51 98 59 93 64" fill="none" stroke="#fde047" strokeWidth="1.8" strokeLinecap="round" />
        <polyline points="85,25 90,20 88,28 94,22" stroke="#38bdf8" strokeWidth="1.2" fill="none" />
        <polyline points="15,70 10,75 12,68 6,72" stroke="#38bdf8" strokeWidth="1.2" fill="none" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_uchiha_chisel)">
        <path d="M46 64 L46 88 C46 90.5 47.8 92 50 92 C52.2 92 54 90.5 54 88 L54 64 Z" fill="url(#m_uchiha_gold)" stroke="#713f12" strokeWidth="0.8" />
        <line x1="46" y1="70" x2="54" y2="70" stroke="#451a03" strokeWidth="1.2" />
        <line x1="46" y1="76" x2="54" y2="76" stroke="#451a03" strokeWidth="1.2" />
        <line x1="46" y1="82" x2="54" y2="82" stroke="#451a03" strokeWidth="1.2" />
        <circle cx="50" cy="90" r="1.8" fill="#18181b" stroke="url(#m_uchiha_gold)" strokeWidth="0.8" />
        <path d="M49 92 L47 96 M51 92 L53 96 M50 92 L50 97" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
        <path d="M24 48 C24 62 35 68 50 68 C65 68 76 62 76 48 Z" fill="#f8fafc" stroke="url(#m_uchiha_gold)" strokeWidth="1.5" />
        <path d="M35 50 Q42 62 50 67" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.6" />
        <path d="M65 50 Q58 62 50 67" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.6" />
        <path d="M24 48 C24 32 35 20 50 20 C65 20 76 32 76 48 Z" fill="url(#m_uchiha_lacquer)" stroke="url(#m_uchiha_gold)" strokeWidth="1.6" />
        <path d="M35 46 Q42 28 50 22" stroke="#fca5a5" strokeWidth="0.8" opacity="0.4" />
        <path d="M65 46 Q58 28 50 22" stroke="#fca5a5" strokeWidth="0.8" opacity="0.4" />
        <line x1="24" y1="48" x2="76" y2="48" stroke="url(#m_uchiha_gold)" strokeWidth="2.6" strokeLinecap="round" />
        <line x1="26" y1="48" x2="74" y2="48" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
        <g fill="url(#m_uchiha_gold)" filter="drop-shadow(0 0 4px #ef4444)">
          <circle cx="30" cy="30" r="2.2" />
          <path d="M30 28 C32 28 33 31 31 32.5 C29.5 33.5 28 31 30 28 Z" />
          <circle cx="70" cy="30" r="2.2" />
          <path d="M70 28 C72 28 73 31 71 32.5 C69.5 33.5 68 31 70 28 Z" />
          <circle cx="50" cy="14" r="2.2" />
          <path d="M50 12 C52 12 53 15 51 16.5 C49.5 17.5 48 15 50 12 Z" />
        </g>
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 48)" filter="drop-shadow(0 0 8px #ef4444)">
        <circle cx="0" cy="0" r="7.5" fill="#180104" stroke="url(#m_uchiha_gold)" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="5.5" fill="#ef4444" />
        <path d="M 0 0 C 2 -4 5 -5 5 -1 C 3 2 1 4 0 0 Z" fill="#000000" />
        <path d="M 0 0 C -4 -2 -5 1 -1 5 C 2 3 4 1 0 0 Z" fill="#000000" transform="rotate(120)" />
        <path d="M 0 0 C -4 -2 -5 1 -1 5 C 2 3 4 1 0 0 Z" fill="#000000" transform="rotate(240)" />
        <circle cx="0" cy="0" r="1.5" fill="#000000" />
        <polygon points="0,-9 1.2,-1.5 9,0 1.2,1.5 0,9 -1.2,1.5 -9,0 -1.2,-1.5" fill="#ffffff" opacity="0.95" />
        <polygon points="0,-5 0.8,-1 5,0 0.8,1 0,5 -0.8,1 -5,0 -0.8,-1" fill="#fde047" opacity="0.75" transform="rotate(45)" />
      </g>
    `
  },

  // 2. УДЗУМАКИ
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
    desc: 'Священный вихрь Удзусио: кованый золотой обод, цепи чакры Конго Фуса, 4 священные печати Сики Фудзин и раскаленное ядро жизненной силы.',
    p: 'm_uzu',
    lacquerStops: `
      <stop offset="0%" stopColor="#fb923c" />
      <stop offset="35%" stopColor="#ea580c" />
      <stop offset="75%" stopColor="#c2410c" />
      <stop offset="100%" stopColor="#431407" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #f97316)">
        <circle cx="50" cy="50" r="51" stroke="#f97316" strokeWidth="1.4" strokeDasharray="8 4" fill="none" />
        <circle cx="50" cy="50" r="53" stroke="#fde047" strokeWidth="0.8" strokeDasharray="3 3" fill="none" />
        <path d="M 50 -2 Q 62 10 52 20" stroke="#fde047" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M 102 50 Q 90 62 80 52" stroke="#fde047" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M 50 102 Q 38 90 48 80" stroke="#fde047" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M -2 50 Q 10 38 20 48" stroke="#fde047" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_uzu_chisel)">
        <g stroke="url(#m_uzu_gold)" strokeWidth="0.6" opacity="0.35" fill="none">
          <circle cx="50" cy="50" r="37" strokeDasharray="6 4" />
          <circle cx="50" cy="50" r="29" strokeDasharray="4 3" />
        </g>
        <path 
          d="M50 50 m 0, -4.5 a 4.5,4.5 0 0,1 4.5,4.5 a 9,9 0 0,1 -9,9 a 14.5,14.5 0 0,1 -14.5,-14.5 a 20,20 0 0,1 20,-20 a 25.5,25.5 0 0,1 25.5,25.5 a 31,31 0 0,1 -31,31" 
          stroke="url(#m_uzu_lacquer)" 
          strokeWidth="7.5" 
          strokeLinecap="round" 
          fill="none"
        />
        <path 
          d="M50 50 m 0, -4.5 a 4.5,4.5 0 0,1 4.5,4.5 a 9,9 0 0,1 -9,9 a 14.5,14.5 0 0,1 -14.5,-14.5 a 20,20 0 0,1 20,-20 a 25.5,25.5 0 0,1 25.5,25.5 a 31,31 0 0,1 -31,31" 
          stroke="url(#m_uzu_gold)" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          fill="none"
          opacity="0.95"
        />
        <g fill="url(#m_uzu_gold)">
          <circle cx="50" cy="14" r="3" stroke="#431407" strokeWidth="0.8" />
          <circle cx="86" cy="50" r="3" stroke="#431407" strokeWidth="0.8" />
          <circle cx="50" cy="86" r="3" stroke="#431407" strokeWidth="0.8" />
          <circle cx="14" cy="50" r="3" stroke="#431407" strokeWidth="0.8" />
          <circle cx="50" cy="14" r="1.2" fill="#ffffff" />
          <circle cx="86" cy="50" r="1.2" fill="#ffffff" />
          <circle cx="50" cy="86" r="1.2" fill="#ffffff" />
          <circle cx="14" cy="50" r="1.2" fill="#ffffff" />
        </g>
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 50)" filter="drop-shadow(0 0 8px #f97316)">
        <circle cx="0" cy="0" r="6" fill="#431407" stroke="url(#m_uzu_gold)" strokeWidth="1.4" />
        <circle cx="0" cy="0" r="4" fill="#ea580c" />
        <circle cx="0" cy="0" r="2" fill="#fed7aa" />
        <polygon points="0,-8 1.2,-1.5 8,0 1.2,1.5 0,8 -1.2,1.5 -8,0 -1.2,-1.5" fill="#ffffff" opacity="0.95" />
        <polygon points="0,-4.5 0.8,-1 4.5,0 0.8,1 0,4.5 -0.8,1 -4.5,0 -0.8,-1" fill="#fde047" opacity="0.75" transform="rotate(45)" />
      </g>
    `
  },

  // 3. СЕНДЖУ
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
    p: 'm_senju',
    lacquerStops: `
      <stop offset="0%" stopColor="#34d399" />
      <stop offset="35%" stopColor="#10b981" />
      <stop offset="75%" stopColor="#047857" />
      <stop offset="100%" stopColor="#022c22" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #10b981)">
        <circle cx="50" cy="50" r="51" stroke="#10b981" strokeWidth="1.4" strokeDasharray="10 5" fill="none" />
        <path d="M 48 -3 Q 44 8 52 14 Q 60 8 56 -3" fill="#10b981" opacity="0.8" />
        <path d="M 103 48 Q 92 44 86 52 Q 92 60 103 56" fill="#10b981" opacity="0.8" />
        <path d="M 48 103 Q 44 92 52 86 Q 60 92 56 103" fill="#10b981" opacity="0.8" />
        <path d="M -3 48 Q 8 44 14 52 Q 8 60 -3 56" fill="#10b981" opacity="0.8" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_senju_chisel)">
        <line x1="50" y1="13" x2="50" y2="87" stroke="url(#m_senju_gold)" strokeWidth="6" strokeLinecap="round" />
        <line x1="50" y1="15" x2="50" y2="85" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
        <line x1="26" y1="34" x2="74" y2="34" stroke="url(#m_senju_gold)" strokeWidth="4.2" strokeLinecap="round" />
        <line x1="30" y1="50" x2="70" y2="50" stroke="url(#m_senju_gold)" strokeWidth="3.8" strokeLinecap="round" />
        <line x1="26" y1="66" x2="74" y2="66" stroke="url(#m_senju_gold)" strokeWidth="4.2" strokeLinecap="round" />
        <path d="M38 22 L50 11 L62 22" fill="none" stroke="url(#m_senju_gold)" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M38 78 L50 89 L62 78" fill="none" stroke="url(#m_senju_gold)" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26 34 Q18 22 28 18 Q36 28 26 34" fill="#34d399" stroke="url(#m_senju_gold)" strokeWidth="1.2" />
        <path d="M74 34 Q82 22 72 18 Q64 28 74 34" fill="#34d399" stroke="url(#m_senju_gold)" strokeWidth="1.2" />
        <path d="M26 66 Q18 78 28 82 Q36 72 26 66" fill="#34d399" stroke="url(#m_senju_gold)" strokeWidth="1.2" />
        <path d="M74 66 Q82 78 72 82 Q64 72 74 66" fill="#34d399" stroke="url(#m_senju_gold)" strokeWidth="1.2" />
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 50)" filter="drop-shadow(0 0 8px #10b981)">
        <circle cx="0" cy="0" r="7" fill="#022c22" stroke="url(#m_senju_gold)" strokeWidth="1.6" />
        <circle cx="0" cy="0" r="5" fill="#10b981" />
        <circle cx="0" cy="0" r="2.5" fill="#a7f3d0" />
        <polygon points="0,-9 1.2,-1.5 9,0 1.2,1.5 0,9 -1.2,1.5 -9,0 -1.2,-1.5" fill="#ffffff" opacity="0.95" />
        <polygon points="0,-5 0.8,-1 5,0 0.8,1 0,5 -0.8,1 -5,0 -0.8,-1" fill="#34d399" opacity="0.75" transform="rotate(45)" />
      </g>
    `
  },

  // 4. ХЬЮГА
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
    p: 'm_hyuga',
    lacquerStops: `
      <stop offset="0%" stopColor="#d8b4fe" />
      <stop offset="35%" stopColor="#c084fc" />
      <stop offset="75%" stopColor="#7e22ce" />
      <stop offset="100%" stopColor="#2e1065" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #c084fc)">
        <circle cx="50" cy="50" r="51" stroke="#c084fc" strokeWidth="1.4" strokeDasharray="4 4" fill="none" />
        <circle cx="50" cy="50" r="53" stroke="#e9d5ff" strokeWidth="0.8" fill="none" opacity="0.6" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_hyuga_chisel)">
        {Array.from({ length: 8 }).map((_, i) => {
          const deg = i * 45;
          return (
            <g key={i} transform={\`translate(50,50) rotate(\${deg}) translate(0, -32)\`}>
              <line x1="-5" y1="-2" x2="5" y2="-2" stroke="url(#m_hyuga_gold)" strokeWidth="1.2" />
              <line x1="-5" y1="0" x2="-1" y2="0" stroke="url(#m_hyuga_gold)" strokeWidth="1.2" />
              <line x1="1" y1="0" x2="5" y2="0" stroke="url(#m_hyuga_gold)" strokeWidth="1.2" />
              <line x1="-5" y1="2" x2="5" y2="2" stroke="url(#m_hyuga_gold)" strokeWidth="1.2" />
            </g>
          );
        })}
        <g transform="translate(50,50)">
          <path d="M 0 -18 A 18 18 0 0 1 0 18 A 9 9 0 0 1 0 0 A 9 9 0 0 0 0 -18 Z" fill="#ffffff" />
          <path d="M 0 -18 A 18 18 0 0 0 0 18 A 9 9 0 0 0 0 0 A 9 9 0 0 1 0 -18 Z" fill="#09090b" stroke="url(#m_hyuga_gold)" strokeWidth="1.2" />
          <circle cx="0" cy="-9" r="2.5" fill="#09090b" />
          <circle cx="0" cy="9" r="2.5" fill="#ffffff" />
        </g>
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 50)" filter="drop-shadow(0 0 8px #c084fc)">
        <polygon points="0,-8 1.2,-1.5 8,0 1.2,1.5 0,8 -1.2,1.5 -8,0 -1.2,-1.5" fill="#ffffff" opacity="0.95" />
        <polygon points="0,-4.5 0.8,-1 4.5,0 0.8,1 0,4.5 -0.8,1 -4.5,0 -0.8,-1" fill="#e9d5ff" opacity="0.75" transform="rotate(45)" />
      </g>
    `
  },

  // 5. ТЭНРАЙ
  {
    id: 'emblem_tenrai',
    name: 'Герб Тэнрай (Небесный Трезубец & Барабаны Райдзина)',
    kanji: '天雷',
    element: 'LIGHTNING',
    elementBadge: '⚡ Райтон & Райдзин',
    themeColor: '#06b6d4',
    bgGradient: 'from-cyan-950 via-zinc-950 to-blue-950',
    borderColor: 'border-cyan-500/50',
    glowColor: 'shadow-cyan-500/40',
    defaultMotto: 'Скорость мысли, удар небесного грома!',
    desc: 'Священный трезубец бога грома Райдзина с тремя барабанами Томоэ и высокочастотными разрядами Райтона.',
    p: 'm_tenrai',
    lacquerStops: `
      <stop offset="0%" stopColor="#38bdf8" />
      <stop offset="35%" stopColor="#0284c7" />
      <stop offset="75%" stopColor="#0369a1" />
      <stop offset="100%" stopColor="#082f49" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #06b6d4)">
        <polyline points="50,-4 54,6 48,12 55,20" stroke="#38bdf8" strokeWidth="1.6" fill="none" />
        <polyline points="104,50 94,54 88,48 80,55" stroke="#38bdf8" strokeWidth="1.6" fill="none" />
        <polyline points="50,104 46,94 52,88 45,80" stroke="#38bdf8" strokeWidth="1.6" fill="none" />
        <polyline points="-4,50 6,46 12,52 20,45" stroke="#38bdf8" strokeWidth="1.6" fill="none" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_tenrai_chisel)">
        {/**/}
        <line x1="50" y1="16" x2="50" y2="84" stroke="url(#m_tenrai_gold)" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 34 32 C 34 50 66 50 66 32" fill="none" stroke="url(#m_tenrai_gold)" strokeWidth="3.5" strokeLinecap="round" />
        <polyline points="34,36 34,22 30,26" fill="none" stroke="url(#m_tenrai_gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="66,36 66,22 70,26" fill="none" stroke="url(#m_tenrai_gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="50,22 50,12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        {/**/}
        <circle cx="30" cy="65" r="5" fill="#082f49" stroke="url(#m_tenrai_gold)" strokeWidth="1.2" />
        <circle cx="70" cy="65" r="5" fill="#082f49" stroke="url(#m_tenrai_gold)" strokeWidth="1.2" />
        <circle cx="50" cy="78" r="5" fill="#082f49" stroke="url(#m_tenrai_gold)" strokeWidth="1.2" />
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 42)" filter="drop-shadow(0 0 8px #06b6d4)">
        <polygon points="0,-9 1.2,-1.5 9,0 1.2,1.5 0,9 -1.2,1.5 -9,0 -1.2,-1.5" fill="#ffffff" opacity="0.95" />
        <polygon points="0,-5 0.8,-1 5,0 0.8,1 0,5 -0.8,1 -5,0 -0.8,-1" fill="#38bdf8" opacity="0.75" transform="rotate(45)" />
      </g>
    `
  },

  // 6. СИНКАЙ
  {
    id: 'emblem_shinkai',
    name: 'Герб Синкай (Водный Дракон & Око Аойган)',
    kanji: '深海',
    element: 'WATER',
    elementBadge: '🌊 Суйтон & Аойган',
    themeColor: '#0ea5e9',
    bgGradient: 'from-blue-950 via-zinc-950 to-teal-950',
    borderColor: 'border-blue-500/50',
    glowColor: 'shadow-blue-500/40',
    defaultMotto: 'Вода принимает любую форму и сокрушает скалы!',
    desc: 'Герб повелителей бездны: чеканный золотой обод, пенные гребни Водного Дракона Суйрюдан и лазурная жемчужина Аойгана.',
    p: 'm_shinkai',
    lacquerStops: `
      <stop offset="0%" stopColor="#38bdf8" />
      <stop offset="35%" stopColor="#0284c7" />
      <stop offset="75%" stopColor="#0f766e" />
      <stop offset="100%" stopColor="#042f2e" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #0ea5e9)">
        <circle cx="50" cy="50" r="51" stroke="#0ea5e9" strokeWidth="1.4" strokeDasharray="6 3" fill="none" />
        <path d="M 45 -3 Q 55 5 48 15" stroke="#ffffff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 103 45 Q 95 55 85 48" stroke="#ffffff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_shinkai_chisel)">
        {/**/}
        <path d="M 50 18 C 72 24 82 48 70 70 C 58 64 62 52 50 50 C 38 52 42 64 30 70 C 18 48 28 24 50 18 Z" fill="url(#m_shinkai_lacquer)" stroke="url(#m_shinkai_gold)" strokeWidth="2" />
        <path d="M 50 25 C 62 30 68 44 60 58 C 50 54 50 40 50 25 Z" fill="#f0fdfa" opacity="0.75" />
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 50)" filter="drop-shadow(0 0 8px #0ea5e9)">
        <circle cx="0" cy="0" r="7" fill="#042f2e" stroke="url(#m_shinkai_gold)" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="5" fill="#0ea5e9" />
        <polygon points="0,-8 1.2,-1.5 8,0 1.2,1.5 0,8 -1.2,1.5 -8,0 -1.2,-1.5" fill="#ffffff" opacity="0.95" />
      </g>
    `
  },

  // 7. КИНГАН
  {
    id: 'emblem_kingan',
    name: 'Герб Кинган (Золотое Око & Раскол Уязвимостей)',
    kanji: '金眼',
    element: 'EARTH',
    elementBadge: '💎 Дотон & Кинган',
    themeColor: '#eab308',
    bgGradient: 'from-amber-950 via-zinc-950 to-yellow-950',
    borderColor: 'border-yellow-500/50',
    glowColor: 'shadow-yellow-500/40',
    defaultMotto: 'В любой несокрушимой броне есть роковая трещина!',
    desc: 'Октаэдрическая призма анализа слабых мест клана Кинган: золотые призматические лучи и алмазное око прозрения.',
    p: 'm_kingan',
    lacquerStops: `
      <stop offset="0%" stopColor="#fef08a" />
      <stop offset="35%" stopColor="#eab308" />
      <stop offset="75%" stopColor="#a16207" />
      <stop offset="100%" stopColor="#451a03" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #eab308)">
        <circle cx="50" cy="50" r="51" stroke="#eab308" strokeWidth="1.4" strokeDasharray="4 2" fill="none" />
        {Array.from({ length: 8 }).map((_, i) => {
          const rad = (i * 45 * Math.PI) / 180;
          return <line key={i} x1={50 + 49 * Math.cos(rad)} y1={50 + 49 * Math.sin(rad)} x2={50 + 54 * Math.cos(rad)} y2={50 + 54 * Math.sin(rad)} stroke="#fef08a" strokeWidth="1.8" strokeLinecap="round" />;
        })}
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_kingan_chisel)">
        {/**/}
        <polygon points="50,16 76,46 50,84 24,46" fill="url(#m_kingan_lacquer)" stroke="url(#m_kingan_gold)" strokeWidth="2.2" />
        <polygon points="50,16 64,46 50,84 36,46" fill="#fef08a" opacity="0.5" />
        <line x1="24" y1="46" x2="76" y2="46" stroke="url(#m_kingan_gold)" strokeWidth="2" />
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 46)" filter="drop-shadow(0 0 8px #eab308)">
        <circle cx="0" cy="0" r="6" fill="#451a03" stroke="url(#m_kingan_gold)" strokeWidth="1.5" />
        <polygon points="0,-8 1.2,-1.5 8,0 1.2,1.5 0,8 -1.2,1.5 -8,0 -1.2,-1.5" fill="#ffffff" opacity="0.95" />
      </g>
    `
  },

  // 8. НАРА
  {
    id: 'emblem_nara',
    name: 'Герб Нара (Оленьи Рога & Теневой Компас)',
    kanji: '奈良',
    element: 'SHADOW',
    elementBadge: '🦌 Тень Каге & Инь',
    themeColor: '#84cc16',
    bgGradient: 'from-lime-950 via-zinc-950 to-neutral-950',
    borderColor: 'border-lime-500/50',
    glowColor: 'shadow-lime-500/40',
    defaultMotto: 'Тень подчиняет тело, разум предвидит сотню ходов!',
    desc: 'Ветвистые золотые оленьи рога священного леса Нара с черным обсидиановым компасом Теневого подражания.',
    p: 'm_nara',
    lacquerStops: `
      <stop offset="0%" stopColor="#a3e635" />
      <stop offset="35%" stopColor="#65a30d" />
      <stop offset="75%" stopColor="#3f6212" />
      <stop offset="100%" stopColor="#142605" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #84cc16)">
        <circle cx="50" cy="50" r="51" stroke="#84cc16" strokeWidth="1.4" strokeDasharray="6 3" fill="none" />
        <polyline points="48,-2 52,8 50,15" stroke="#a3e635" strokeWidth="1.6" fill="none" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_nara_chisel)">
        {/**/}
        <path d="M 50 78 C 45 60 30 45 22 28 C 26 34 32 35 34 26 C 36 34 44 38 42 48" fill="none" stroke="url(#m_nara_gold)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 50 78 C 55 60 70 45 78 28 C 74 34 68 35 66 26 C 64 34 56 38 58 48" fill="none" stroke="url(#m_nara_gold)" strokeWidth="3" strokeLinecap="round" />
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 52)" filter="drop-shadow(0 0 8px #84cc16)">
        <circle cx="0" cy="0" r="7" fill="#000000" stroke="url(#m_nara_gold)" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="4.5" fill="#3f6212" />
        <polygon points="0,-8 1.2,-1.5 8,0 1.2,1.5 0,8 -1.2,1.5 -8,0 -1.2,-1.5" fill="#ffffff" opacity="0.95" />
      </g>
    `
  },

  // 9. АКИМИЧИ
  {
    id: 'emblem_akimichi',
    name: 'Герб Акимичи (Кандзи Сёку & Крылья Бабочки)',
    kanji: '秋道',
    element: 'YANG',
    elementBadge: '🦋 Ян & Бабочка Чоджи',
    themeColor: '#f43f5e',
    bgGradient: 'from-rose-950 via-zinc-950 to-pink-950',
    borderColor: 'border-rose-500/50',
    glowColor: 'shadow-rose-500/40',
    defaultMotto: 'Калории обращаются в сокрушительную мощь!',
    desc: 'Бронированный щит богатырей Акимичи: золотой каллиграфический кандзи 『食』 (Пища) и сияющие крылья бабочки чакры.',
    p: 'm_aki',
    lacquerStops: `
      <stop offset="0%" stopColor="#fb7185" />
      <stop offset="35%" stopColor="#e11d48" />
      <stop offset="75%" stopColor="#9f1239" />
      <stop offset="100%" stopColor="#4c0519" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #f43f5e)">
        <circle cx="50" cy="50" r="51" stroke="#f43f5e" strokeWidth="1.4" strokeDasharray="8 4" fill="none" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_aki_chisel)">
        {/**/}
        <circle cx="50" cy="50" r="26" fill="url(#m_aki_lacquer)" stroke="url(#m_aki_gold)" strokeWidth="2" />
        <text x="50" y="58" textAnchor="middle" fill="url(#m_aki_gold)" fontSize="24" fontWeight="900" fontFamily="serif">食</text>
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 24)" filter="drop-shadow(0 0 8px #f43f5e)">
        <polygon points="0,-7 1,-1.2 7,0 1,1.2 0,7 -1,1.2 -7,0 -1,-1.2" fill="#ffffff" opacity="0.95" />
      </g>
    `
  },

  // 10. ЯМАНАКА
  {
    id: 'emblem_yamanaka',
    name: 'Герб Яманака (Цветок Хаги & Пси-Око)',
    kanji: '山中',
    element: 'MIND',
    elementBadge: '🌸 Телепатия & Синтенсин',
    themeColor: '#a855f7',
    bgGradient: 'from-purple-950 via-zinc-950 to-fuchsia-950',
    borderColor: 'border-purple-500/50',
    glowColor: 'shadow-purple-500/40',
    defaultMotto: 'Чужой разум открыт перед истинным мастером!',
    desc: 'Священный цветок клевера Хаги: концентрические телепатические кольца Синтенсин но Дзюцу и ядро ментального проникновения.',
    p: 'm_yam',
    lacquerStops: `
      <stop offset="0%" stopColor="#c084fc" />
      <stop offset="35%" stopColor="#9333ea" />
      <stop offset="75%" stopColor="#6b21a8" />
      <stop offset="100%" stopColor="#3b0764" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #a855f7)">
        <circle cx="50" cy="50" r="51" stroke="#a855f7" strokeWidth="1.4" strokeDasharray="5 5" fill="none" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_yam_chisel)">
        {/**/}
        <path d="M 50 50 C 40 30 40 18 50 18 C 60 18 60 30 50 50 Z" fill="url(#m_yam_lacquer)" stroke="url(#m_yam_gold)" strokeWidth="1.5" />
        <path d="M 50 50 C 30 40 18 40 18 50 C 18 60 30 60 50 50 Z" fill="url(#m_yam_lacquer)" stroke="url(#m_yam_gold)" strokeWidth="1.5" transform="rotate(120 50 50)" />
        <path d="M 50 50 C 30 40 18 40 18 50 C 18 60 30 60 50 50 Z" fill="url(#m_yam_lacquer)" stroke="url(#m_yam_gold)" strokeWidth="1.5" transform="rotate(240 50 50)" />
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 50)" filter="drop-shadow(0 0 8px #a855f7)">
        <circle cx="0" cy="0" r="6" fill="#3b0764" stroke="url(#m_yam_gold)" strokeWidth="1.5" />
        <polygon points="0,-8 1.2,-1.5 8,0 1.2,1.5 0,8 -1.2,1.5 -8,0 -1.2,-1.5" fill="#ffffff" opacity="0.95" />
      </g>
    `
  },

  // 11. АБУРАМЭ
  {
    id: 'emblem_aburame',
    name: 'Герб Абурамэ (Скарабей Кикайчу & Соты)',
    kanji: '油女',
    element: 'INSECTS',
    elementBadge: '🪲 Кикайчу & Хитин',
    themeColor: '#14b8a6',
    bgGradient: 'from-teal-950 via-zinc-950 to-emerald-950',
    borderColor: 'border-teal-500/50',
    glowColor: 'shadow-teal-500/40',
    defaultMotto: 'Тихий рой поглощает чакру без остатка.',
    desc: 'Хитиновый скарабей Кикайчу в золотой оправе с сотовой решеткой поглощения чакры.',
    p: 'm_abu',
    lacquerStops: `
      <stop offset="0%" stopColor="#2dd4bf" />
      <stop offset="35%" stopColor="#0d9488" />
      <stop offset="75%" stopColor="#115e59" />
      <stop offset="100%" stopColor="#042f2e" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #14b8a6)">
        <circle cx="50" cy="50" r="51" stroke="#14b8a6" strokeWidth="1.4" strokeDasharray="3 3" fill="none" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_abu_chisel)">
        {/**/}
        <ellipse cx="50" cy="52" rx="14" ry="18" fill="url(#m_abu_lacquer)" stroke="url(#m_abu_gold)" strokeWidth="2" />
        <line x1="50" y1="34" x2="50" y2="70" stroke="url(#m_abu_gold)" strokeWidth="1.5" />
        <circle cx="50" cy="30" r="6" fill="#042f2e" stroke="url(#m_abu_gold)" strokeWidth="1.5" />
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 30)" filter="drop-shadow(0 0 8px #14b8a6)">
        <polygon points="0,-7 1,-1.2 7,0 1,1.2 0,7 -1,1.2 -7,0 -1,-1.2" fill="#ffffff" opacity="0.95" />
      </g>
    `
  },

  // 12. ИНУЗУКА
  {
    id: 'emblem_inuzuka',
    name: 'Герб Инузука (Алые Клыки & Оттиск Лапы)',
    kanji: '犬塚',
    element: 'BEAST',
    elementBadge: '🐾 Звериный Нинкен & Гацуга',
    themeColor: '#ea580c',
    bgGradient: 'from-amber-950 via-zinc-950 to-red-950',
    borderColor: 'border-orange-600/50',
    glowColor: 'shadow-orange-600/40',
    defaultMotto: 'Два тела — одно сердце дикого зверя!',
    desc: 'Священные алые клыки на щеках шиноби Инузука с золотым оттиском лапы нинкена и диким огнем чакры.',
    p: 'm_inu',
    lacquerStops: `
      <stop offset="0%" stopColor="#fb923c" />
      <stop offset="35%" stopColor="#ea580c" />
      <stop offset="75%" stopColor="#9a3412" />
      <stop offset="100%" stopColor="#431407" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #ea580c)">
        <circle cx="50" cy="50" r="51" stroke="#ea580c" strokeWidth="1.4" strokeDasharray="6 3" fill="none" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_inu_chisel)">
        {/**/}
        <path d="M 36 28 C 30 45 36 68 44 76 C 42 62 44 45 42 28 Z" fill="url(#m_inu_lacquer)" stroke="url(#m_inu_gold)" strokeWidth="1.8" />
        <path d="M 64 28 C 70 45 64 68 56 76 C 58 62 56 45 58 28 Z" fill="url(#m_inu_lacquer)" stroke="url(#m_inu_gold)" strokeWidth="1.8" />
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 48)" filter="drop-shadow(0 0 8px #ea580c)">
        <polygon points="0,-8 1.2,-1.5 8,0 1.2,1.5 0,8 -1.2,1.5 -8,0 -1.2,-1.5" fill="#ffffff" opacity="0.95" />
      </g>
    `
  },

  // 13. САРУТОБИ
  {
    id: 'emblem_sarutobi',
    name: 'Герб Сарутоби (Посох Энмы & 5 Стихий)',
    kanji: '猿飛',
    element: 'ALL_FIVE',
    elementBadge: '🔥 5 Стихий & Король Обезьян',
    themeColor: '#f59e0b',
    bgGradient: 'from-amber-950 via-zinc-950 to-orange-950',
    borderColor: 'border-amber-500/50',
    glowColor: 'shadow-amber-500/40',
    defaultMotto: 'Листья Конохи взмывают в небо, огонь освещает деревню!',
    desc: 'Алмазный несокрушимый шест царя обезьян Энмы с 5 стихийными цветными сферами чакры.',
    p: 'm_saru',
    lacquerStops: `
      <stop offset="0%" stopColor="#fde047" />
      <stop offset="35%" stopColor="#d97706" />
      <stop offset="75%" stopColor="#92400e" />
      <stop offset="100%" stopColor="#451a03" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #f59e0b)">
        <circle cx="50" cy="50" r="51" stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="7 3" fill="none" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_saru_chisel)">
        {/**/}
        <rect x="46" y="16" width="8" height="68" rx="3" fill="#09090b" stroke="url(#m_saru_gold)" strokeWidth="2" />
        <rect x="44" y="22" width="12" height="4" fill="url(#m_saru_gold)" />
        <rect x="44" y="74" width="12" height="4" fill="url(#m_saru_gold)" />
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 50)" filter="drop-shadow(0 0 8px #f59e0b)">
        <polygon points="0,-8 1.2,-1.5 8,0 1.2,1.5 0,8 -1.2,1.5 -8,0 -1.2,-1.5" fill="#ffffff" opacity="0.95" />
      </g>
    `
  },

  // 14. ХАТАКЭ
  {
    id: 'emblem_hatake',
    name: 'Герб Хатакэ (Белый Клык & Скрещенные Танто)',
    kanji: 'はたけ',
    element: 'LIGHTNING',
    elementBadge: '⚔️ Белый Клык & Райкири',
    themeColor: '#cbd5e1',
    bgGradient: 'from-slate-900 via-zinc-950 to-blue-950',
    borderColor: 'border-slate-400/50',
    glowColor: 'shadow-slate-400/40',
    defaultMotto: 'Тот, кто предает друзей — хуже мусора!',
    desc: 'Скрещенные фамильные клинки Белого Клыка Конохи (Хатакэ Сакумо) с искрящимся серебряным лезвием чакры Райтона.',
    p: 'm_hatake',
    lacquerStops: `
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="35%" stopColor="#94a3b8" />
      <stop offset="75%" stopColor="#475569" />
      <stop offset="100%" stopColor="#0f172a" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #38bdf8)">
        <circle cx="50" cy="50" r="51" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="5 5" fill="none" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_hatake_chisel)">
        {/**/}
        <g transform="translate(50,50) rotate(45)">
          <line x1="-32" y1="0" x2="32" y2="0" stroke="url(#m_hatake_gold)" strokeWidth="3" strokeLinecap="round" />
          <line x1="-32" y1="-0.8" x2="32" y2="-0.8" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        </g>
        <g transform="translate(50,50) rotate(-45)">
          <line x1="-32" y1="0" x2="32" y2="0" stroke="url(#m_hatake_gold)" strokeWidth="3" strokeLinecap="round" />
          <line x1="-32" y1="-0.8" x2="32" y2="-0.8" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        </g>
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 50)" filter="drop-shadow(0 0 8px #38bdf8)">
        <polygon points="0,-8 1.2,-1.5 8,0 1.2,1.5 0,8 -1.2,1.5 -8,0 -1.2,-1.5" fill="#ffffff" opacity="0.95" />
      </g>
    `
  },

  // 15. ХОКАГЕ
  {
    id: 'emblem_hokage',
    name: 'Императорский Герб Хокаге (Воля Огня)',
    kanji: '火影',
    element: 'FIRE',
    elementBadge: '🔥 Высшая Воля Огня Конохи',
    themeColor: '#ef4444',
    bgGradient: 'from-red-950 via-zinc-950 to-amber-950',
    borderColor: 'border-red-500/80',
    glowColor: 'shadow-red-500/60',
    defaultMotto: 'Пока горят листья дерева, пламя озаряет деревню!',
    desc: 'Императорский герб лидеров Конохи: золотая шляпа Хокаге, священный кандзи 『火』 и ревущее вечное пламя Воли Огня.',
    p: 'm_hoka',
    lacquerStops: `
      <stop offset="0%" stopColor="#f87171" />
      <stop offset="35%" stopColor="#dc2626" />
      <stop offset="75%" stopColor="#991b1b" />
      <stop offset="100%" stopColor="#450a0a" />
    `,
    coronaSvg: `
      <g opacity="0.95" filter="drop-shadow(0 0 10px #ef4444)">
        <circle cx="50" cy="50" r="51" stroke="#fde047" strokeWidth="1.8" strokeDasharray="8 4" fill="none" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_hoka_chisel)">
        {/**/}
        <path d="M 26 58 L 50 24 L 74 58 Z" fill="url(#m_hoka_lacquer)" stroke="url(#m_hoka_gold)" strokeWidth="2.4" />
        <path d="M 20 60 Q 50 54 80 60" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <text x="50" y="52" textAnchor="middle" fill="url(#m_hoka_gold)" fontSize="16" fontWeight="900" fontFamily="serif">火</text>
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 24)" filter="drop-shadow(0 0 8px #fde047)">
        <polygon points="0,-8 1.2,-1.5 8,0 1.2,1.5 0,8 -1.2,1.5 -8,0 -1.2,-1.5" fill="#ffffff" opacity="0.95" />
      </g>
    `
  },

  // 16. АНБУ
  {
    id: 'emblem_anbu',
    name: 'Герб Спецподразделения АНБУ',
    kanji: '暗部',
    element: 'SHADOW',
    elementBadge: '🎭 Тайные Операции Конохи',
    themeColor: '#f43f5e',
    bgGradient: 'from-zinc-950 via-rose-950 to-black',
    borderColor: 'border-rose-500/60',
    glowColor: 'shadow-rose-500/50',
    defaultMotto: 'Безымянные тени, хранящие покой Конохи в ночи.',
    desc: 'Фарфоровая маска Лиса Кицунэ специального подразделения тайных операций Конохи с алыми ритуальными знаками.',
    p: 'm_anbu',
    lacquerStops: `
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="35%" stopColor="#e2e8f0" />
      <stop offset="75%" stopColor="#94a3b8" />
      <stop offset="100%" stopColor="#0f172a" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #f43f5e)">
        <circle cx="50" cy="50" r="51" stroke="#f43f5e" strokeWidth="1.4" strokeDasharray="6 3" fill="none" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_anbu_chisel)">
        {/**/}
        <path d="M 30 30 L 36 44 C 36 62 44 72 50 76 C 56 72 64 62 64 44 L 70 30 C 62 34 56 36 50 36 C 44 36 38 34 30 30 Z" fill="#ffffff" stroke="url(#m_anbu_gold)" strokeWidth="2" />
        <ellipse cx="42" cy="50" rx="3" ry="1.5" fill="#e11d48" transform="rotate(-15 42 50)" />
        <ellipse cx="58" cy="50" rx="3" ry="1.5" fill="#e11d48" transform="rotate(15 58 50)" />
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 42)" filter="drop-shadow(0 0 8px #f43f5e)">
        <polygon points="0,-8 1.2,-1.5 8,0 1.2,1.5 0,8 -1.2,1.5 -8,0 -1.2,-1.5" fill="#ffffff" opacity="0.95" />
      </g>
    `
  },

  // 17. ООЦУЦУКИ
  {
    id: 'emblem_otsutsuki',
    name: 'Герб Клана Ооцуцуки (Божественное Древо & Рога)',
    kanji: '大筒木',
    element: 'DIVINE',
    elementBadge: '🌕 Божественная Чакра & Риннеган',
    themeColor: '#e2e8f0',
    bgGradient: 'from-purple-950 via-zinc-950 to-slate-900',
    borderColor: 'border-purple-400/60',
    glowColor: 'shadow-purple-400/50',
    defaultMotto: 'Мы — боги, пожинающие плоды миров во вселенной.',
    desc: 'Священные лунные рога прародителей чакры Ооцуцуки с золотым оком Риннегана и 9 томоэ.',
    p: 'm_otsu',
    lacquerStops: `
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="35%" stopColor="#e9d5ff" />
      <stop offset="75%" stopColor="#7e22ce" />
      <stop offset="100%" stopColor="#1e0a38" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #c084fc)">
        <circle cx="50" cy="50" r="51" stroke="#c084fc" strokeWidth="1.6" strokeDasharray="3 3" fill="none" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_otsu_chisel)">
        {/**/}
        <path d="M 28 26 C 26 40 32 66 50 78 C 68 66 74 40 72 26 C 68 36 60 46 50 48 C 40 46 32 36 28 26 Z" fill="url(#m_otsu_lacquer)" stroke="url(#m_otsu_gold)" strokeWidth="2" />
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 48)" filter="drop-shadow(0 0 8px #fde047)">
        <circle cx="0" cy="0" r="7" fill="#1e0a38" stroke="url(#m_otsu_gold)" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="4.5" fill="#fde047" />
        <polygon points="0,-8 1.2,-1.5 8,0 1.2,1.5 0,8 -1.2,1.5 -8,0 -1.2,-1.5" fill="#ffffff" opacity="0.95" />
      </g>
    `
  },

  // 18. КАЗЕКАГЕ
  {
    id: 'emblem_kazekage',
    name: 'Герб Казекаге (Песчаная Тыква & Кандзи Ай)',
    kanji: '風影',
    element: 'SAND',
    elementBadge: '⏳ Золотой Песок & Дзитон',
    themeColor: '#d97706',
    bgGradient: 'from-amber-950 via-zinc-950 to-stone-900',
    borderColor: 'border-amber-600/60',
    glowColor: 'shadow-amber-600/50',
    defaultMotto: 'Песок защищает того, чье сердце познало любовь.',
    desc: 'Песчаная тыква Гаары Хётан с выгравированным алым кандзи 『愛』 (Любовь) и бурей золотого песка.',
    p: 'm_kaze',
    lacquerStops: `
      <stop offset="0%" stopColor="#fde68a" />
      <stop offset="35%" stopColor="#d97706" />
      <stop offset="75%" stopColor="#92400e" />
      <stop offset="100%" stopColor="#451a03" />
    `,
    coronaSvg: `
      <g opacity="0.9" filter="drop-shadow(0 0 8px #d97706)">
        <circle cx="50" cy="50" r="51" stroke="#d97706" strokeWidth="1.4" strokeDasharray="4 2" fill="none" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_kaze_chisel)">
        {/**/}
        <circle cx="50" cy="42" r="14" fill="url(#m_kaze_lacquer)" stroke="url(#m_kaze_gold)" strokeWidth="2" />
        <circle cx="50" cy="62" r="18" fill="url(#m_kaze_lacquer)" stroke="url(#m_kaze_gold)" strokeWidth="2" />
        <text x="50" y="68" textAnchor="middle" fill="#dc2626" fontSize="18" fontWeight="900" fontFamily="serif">愛</text>
      </g>
    `,
    coreSvg: `
      <g transform="translate(50, 36)" filter="drop-shadow(0 0 8px #d97706)">
        <polygon points="0,-7 1,-1.2 7,0 1,1.2 0,7 -1,1.2 -7,0 -1,-1.2" fill="#ffffff" opacity="0.95" />
      </g>
    `
  },

  // 19. ГЕРБ СОЗДАТЕЛЯ (КИРИЛЛ)
  {
    id: 'emblem_creator_genesis',
    name: '👑 Герб Создателя: Око Сотворения и Единства Всех Кланов',
    kanji: '創世',
    element: 'ALL',
    elementBadge: '👑 СОЗДАТЕЛЬ ИГРЫ • КИРИЛЛ • ВСЕ СТИХИИ',
    themeColor: '#facc15',
    bgGradient: 'from-amber-950 via-zinc-950 to-purple-950',
    borderColor: 'border-yellow-400/90',
    glowColor: 'shadow-yellow-400/70',
    isCreatorExclusive: true,
    developerEmail: 'askarovkiril5@gmail.com',
    defaultMotto: 'Тот, кто сотворил этот мир, объединил пламя, молнию и волю всех кланов воедино!',
    desc: 'Священный первородный герб Создателя и Архитектора мира шиноби (Кирилла). Синтезирует величайшие реликвии: рубиновый Гунбай Учиха, Спираль Удзумаки, Ветви Мокутона Сэндзю, 8 Триграмм Хьюга, барабаны Райдзина, 9 парящих сфер Гудодама и Око Ринне-Шарингана под золотой Короной Творца 『創世』.',
    p: 'm_gen',
    lacquerStops: `
      <stop offset="0%" stopColor="#fde047" />
      <stop offset="35%" stopColor="#ec4899" />
      <stop offset="75%" stopColor="#06b6d4" />
      <stop offset="100%" stopColor="#3b0764" />
    `,
    coronaSvg: `
      <g opacity="0.95" filter="drop-shadow(0 0 12px #facc15)">
        <circle cx="50" cy="50" r="51" stroke="#facc15" strokeWidth="1.8" strokeDasharray="3 2" fill="none" />
        <circle cx="50" cy="50" r="53.5" stroke="#38bdf8" strokeWidth="1" opacity="0.6" fill="none" />
        <polyline points="50,-4 54,6 48,12 55,20" stroke="#fde047" strokeWidth="1.6" fill="none" />
        <polyline points="104,50 94,54 88,48 80,55" stroke="#38bdf8" strokeWidth="1.6" fill="none" />
        <polyline points="50,104 46,94 52,88 45,80" stroke="#ec4899" strokeWidth="1.6" fill="none" />
        <polyline points="-4,50 6,46 12,52 20,45" stroke="#fde047" strokeWidth="1.6" fill="none" />
      </g>
    `,
    symbolSvg: `
      <g filter="url(#m_gen_chisel)">
        {/**/}
        <path d="M 50 16 C 70 16 78 35 68 48 C 76 60 70 74 50 74 C 30 74 24 60 32 48 C 22 35 30 16 50 16 Z" fill="url(#m_gen_lacquer)" stroke="url(#m_gen_gold)" strokeWidth="2.2" />
        {/**/}
        <path d="M 32 64 C 28 52 24 40 32 30 C 35 24 30 18 38 12" stroke="url(#m_gen_gold)" strokeWidth="1.4" fill="none" />
        <path d="M 68 64 C 72 52 76 40 68 30 C 65 24 70 18 62 12" stroke="url(#m_gen_gold)" strokeWidth="1.4" fill="none" />
        {/**/}
        <g transform="translate(50, 14)">
          <path d="M -12 4 L -15 -7 L -7 -2 L 0 -11 L 7 -2 L 15 -7 L 12 4 Z" fill="url(#m_gen_gold)" stroke="#78350f" strokeWidth="0.9" />
          <circle cx="-15" cy="-7" r="1.3" fill="#ef4444" stroke="#ffffff" strokeWidth="0.4" />
          <circle cx="0" cy="-11" r="1.7" fill="#ef4444" stroke="#ffffff" strokeWidth="0.5" />
          <circle cx="15" cy="-7" r="1.3" fill="#ef4444" stroke="#ffffff" strokeWidth="0.4" />
          <text x="0" y="2.8" textAnchor="middle" fill="#000000" fontSize="4.2" fontWeight="900" fontFamily="serif">創世</text>
        </g>
        {/**/}
        {Array.from({ length: 6 }).map((_, i) => {
          const rad = (i * 60 * Math.PI) / 180;
          return (
            <circle key={i} cx={50 + 36 * Math.cos(rad)} cy={48 + 36 * Math.sin(rad)} r="3" fill="#020617" stroke="#38bdf8" strokeWidth="0.6" />
          );
        })}
      </g>
    `,
    coreSvg: `
      {/**/}
      <g transform="translate(50, 48)" filter="drop-shadow(0 0 10px #facc15)">
        <circle cx="0" cy="0" r="10" fill="#180104" stroke="url(#m_gen_gold)" strokeWidth="1.6" />
        <circle cx="0" cy="0" r="7.5" fill="#ef4444" />
        <circle cx="0" cy="0" r="5" fill="none" stroke="#18181b" strokeWidth="0.7" />
        <circle cx="0" cy="0" r="2.5" fill="none" stroke="#18181b" strokeWidth="0.7" />
        <polygon points="0,-12 1.5,-2 12,0 1.5,2 0,12 -1.5,2 -12,0 -1.5,-2" fill="#ffffff" opacity="0.95" />
        <polygon points="0,-7 1,-1.5 7,0 1,1.5 0,7 -1,1.5 -7,0 -1,-1.5" fill="#fde047" opacity="0.8" transform="rotate(45)" />
      </g>
    `
  }
];

// Генерация JSX кода
let output = `import React from 'react';

/**
 * clanEmblemsData.jsx
 * Элитная коллекция императорских гербов и медальонов кланов (Kamon 3D Masterpiece Edition):
 * Стандарт детализации кинематографической иконки игры (icon.png):
 * - [0] Корона чакры (Corona & Lightning Arcs) - вырывается за пределы обода (overflow="visible")
 * - [1] Чеканный трехмерный золотой обод с 12 заклепками
 * - [2] Кованая пластина протектора из титана со следами сражений (Battle Scars & Hex Bolts)
 * - [3] Двухкомпонентный вихревой диск Инь-Ян (темный титан + клановый цветной лак)
 * - [4] Сакральные узоры и рельефная фаска
 * - [5] Скульптурный 3D-символ клана с металлической фаской (feDropShadow)
 * - [6] Центральное фотонное око со звездой-бликом (Lens Flare Star)
 * - [7] Купольный софтбокс-блик стекла и контурный рефлекс Френеля
 */

export const CLAN_EMBLEMS = [
`;

CLANS.forEach(c => {
  output += `  {
    id: '${c.id}',
    name: '${c.name}',
    kanji: '${c.kanji}',
    element: '${c.element}',
    elementBadge: '${c.elementBadge}',
    themeColor: '${c.themeColor}',
    bgGradient: '${c.bgGradient}',
    borderColor: '${c.borderColor}',
    glowColor: '${c.glowColor}',
    defaultMotto: '${c.defaultMotto}',
    desc: '${c.desc}',
    ${c.isCreatorExclusive ? `isCreatorExclusive: true,\n    developerEmail: '${c.developerEmail}',` : ''}
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="-10 -10 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" overflow="visible">
        <defs>
          <linearGradient id="${c.p}_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="15%" stopColor="#fffbeb" />
            <stop offset="35%" stopColor="#fde047" />
            <stop offset="55%" stopColor="#ca8a04" />
            <stop offset="75%" stopColor="#78350f" />
            <stop offset="90%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>

          <linearGradient id="${c.p}_titanium" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="40%" stopColor="#1e293b" />
            <stop offset="80%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="${c.p}_lacquer" x1="0%" y1="0%" x2="100%" y2="100%">
            ${c.lacquerStops}
          </linearGradient>

          <filter id="${c.p}_chisel" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3.2" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.9" />
            <feDropShadow dx="0" dy="-0.8" stdDeviation="0.6" floodColor="#ffffff" floodOpacity="0.35" />
          </filter>

          <radialGradient id="${c.p}_glint" cx="35%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* LAYER 0: Стихийная корона чакры (Flames & Arcs) */}
        ${c.coronaSvg}

        {/* LAYER 1: Чеканный трехмерный золотой обод с 12 заклепками */}
        <circle cx="50" cy="50" r="48" stroke="url(#${c.p}_gold)" strokeWidth="3" />
        <circle cx="50" cy="50" r="45" stroke="#09090b" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#${c.p}_gold)" strokeWidth="0.8" strokeDasharray="3 2" />
        <g fill="url(#${c.p}_gold)">
          {Array.from({ length: 12 }).map((_, i) => {
            const rad = (i * 30 * Math.PI) / 180;
            return <circle key={i} cx={50 + 46.5 * Math.cos(rad)} cy={50 + 46.5 * Math.sin(rad)} r="1.4" />;
          })}
        </g>

        {/* LAYER 3: Двухкомпонентный вихревой диск Инь-Ян (как в icon.png) */}
        <circle cx="50" cy="50" r="42" fill="url(#${c.p}_titanium)" />
        <path d="M 50 8 A 42 42 0 0 1 92 50 A 42 42 0 0 1 50 92 A 21 21 0 0 1 50 50 A 21 21 0 0 0 50 8 Z" fill="url(#${c.p}_lacquer)" />

        {/* LAYER 2: Верхняя накладная пластина протектора из титана со следами сражений */}
        <path d="M 28 20 C 40 16 60 16 72 20 C 74 28 71 36 67 38 C 57 40 43 40 33 38 C 29 36 26 28 28 20 Z" fill="#1e293b" stroke="url(#${c.p}_gold)" strokeWidth="1" />
        <circle cx="33" cy="28" r="1.2" fill="url(#${c.p}_gold)" />
        <circle cx="67" cy="28" r="1.2" fill="url(#${c.p}_gold)" />
        <line x1="38" y1="23" x2="48" y2="30" stroke="#000000" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="38.4" y1="23.4" x2="48.4" y2="30.4" stroke="#94a3b8" strokeWidth="0.5" strokeLinecap="round" />
        <line x1="56" y1="24" x2="62" y2="32" stroke="#000000" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="56.4" y1="24.4" x2="62.4" y2="32.4" stroke="#cbd5e1" strokeWidth="0.4" strokeLinecap="round" />

        {/* LAYER 5: Скульптурный 3D-символ клана */}
        ${c.symbolSvg}

        {/* LAYER 6: Центральное фотонное око со звездой-бликом (как в icon.png) */}
        ${c.coreSvg}

        {/* LAYER 7: Двойной купольный софтбокс-блик стекла и контурный рефлекс */}
        <ellipse cx="38" cy="34" rx="22" ry="12" fill="url(#${c.p}_glint)" transform="rotate(-30 38 34)" pointerEvents="none" />
        <circle cx="30" cy="25" r="3" fill="#ffffff" opacity="0.5" pointerEvents="none" />
        <path d="M 68 76 C 76 68, 80 58, 80 48" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.35" pointerEvents="none" />
      </svg>
    )
  },
`;
});

output += `];

export const DEVELOPER_EMAIL = 'askarovkiril5@gmail.com';

export function isDeveloperAccount(email) {
  if (!email) return false;
  return String(email).trim().toLowerCase() === DEVELOPER_EMAIL;
}

export function getClanEmblemById(id) {
  if (!id) return CLAN_EMBLEMS[0];
  const found = CLAN_EMBLEMS.find(e => e.id === id);
  return found || CLAN_EMBLEMS[0];
}
`;

const targetPath = path.join(__dirname, '..', 'client', 'src', 'data', 'clanEmblemsData.jsx');
fs.writeFileSync(targetPath, output, 'utf-8');
console.log('Successfully generated clanEmblemsData.jsx at ' + targetPath);
