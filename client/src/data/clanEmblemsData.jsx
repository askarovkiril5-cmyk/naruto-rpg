/**
 * clanEmblemsData.js
 * Высокодетализированная коллекция гербов и эмблем кланов мира шиноби:
 * - Каноничные кланы Конохи (Учиха, Сенджу, Удзумаки, Хьюга, Нара, Акимичи, Яманака, Абураме, Инузука, Сарутоби, Хатаке)
 * - Уникальные кланы (Тэнрай, Синкай, Кинган)
 * - Легендарные институты (АНБУ, Хокаге, Скрытый Песок, Скрытый Туман)
 * Каждый герб содержит художественные SVG-векторы, кандзи, девиз по умолчанию и цветовую гамму.
 */

export const CLAN_EMBLEMS = [
  {
    id: 'emblem_uchiha',
    name: 'Герб Учиха (Огненный Веер)',
    kanji: 'うちは',
    themeColor: '#ef4444',
    bgGradient: 'from-rose-950 via-zinc-950 to-red-950',
    borderColor: 'border-red-500/50',
    glowColor: 'shadow-red-500/30',
    defaultMotto: 'Тот, кто владеет пламенем, разгоняет тьму!',
    desc: 'Традиционный веер Учиха: верхняя половина алая, нижняя белая. Символизирует контроль над огненной стихией Катон и пробуждение проклятия ненависти/любви.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#ef4444" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="url(#uchiha-bg)" />
        <defs>
          <radialGradient id="uchiha-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#450a0a" />
            <stop offset="100%" stopColor="#09090b" />
          </radialGradient>
          <linearGradient id="uchiha-red" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>
        {/* Рукоять веера */}
        <path d="M46 64 L46 88 C46 90.2 47.8 92 50 92 C52.2 92 54 90.2 54 88 L54 64 Z" fill="#e4e4e7" stroke="#71717a" strokeWidth="1.5" />
        {/* Нижняя белая половина веера */}
        <path d="M22 48 C22 62 34 68 50 68 C66 68 78 62 78 48 Z" fill="#f4f4f5" stroke="#a1a1aa" strokeWidth="1" />
        {/* Верхняя алая половина веера */}
        <path d="M22 48 C22 32 34 22 50 22 C66 22 78 32 78 48 Z" fill="url(#uchiha-red)" stroke="#f87171" strokeWidth="1.2" />
        {/* Центральный разделитель */}
        <line x1="22" y1="48" x2="78" y2="48" stroke="#18181b" strokeWidth="2" />
        {/* Декоративные искры чакры */}
        <circle cx="36" cy="36" r="1.5" fill="#fca5a5" />
        <circle cx="64" cy="36" r="1.5" fill="#fca5a5" />
      </svg>
    )
  },
  {
    id: 'emblem_uzumaki',
    name: 'Герб Удзумаки (Алая Спираль)',
    kanji: 'うずまき',
    themeColor: '#f97316',
    bgGradient: 'from-orange-950 via-zinc-950 to-red-950',
    borderColor: 'border-orange-500/50',
    glowColor: 'shadow-orange-500/30',
    defaultMotto: 'Воля водоворота никогда не угаснет!',
    desc: 'Великая алая спираль Деревни Водоворотов (Удзусио). Герб нанесён на форменные жилеты шиноби Конохи как знак вечной дружбы и несокрушимой жизненной силы.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#f97316" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="#2a0808" />
        {/* Алая спираль Удзумаки */}
        <path 
          d="M50 50 
             m 0, -5 
             a 5,5 0 0,1 5,5 
             a 10,10 0 0,1 -10,10 
             a 16,16 0 0,1 -16,-16 
             a 22,22 0 0,1 22,-22 
             a 28,28 0 0,1 28,28 
             a 34,34 0 0,1 -34,34" 
          stroke="#ea580c" 
          strokeWidth="6" 
          strokeLinecap="round" 
        />
        <path 
          d="M50 50 
             m 0, -5 
             a 5,5 0 0,1 5,5 
             a 10,10 0 0,1 -10,10 
             a 16,16 0 0,1 -16,-16 
             a 22,22 0 0,1 22,-22" 
          stroke="#ffedd5" 
          strokeWidth="2" 
          strokeLinecap="round" 
          opacity="0.8"
        />
        {/* Четыре печати по краям */}
        <circle cx="50" cy="14" r="2.5" fill="#f97316" />
        <circle cx="86" cy="50" r="2.5" fill="#f97316" />
        <circle cx="50" cy="86" r="2.5" fill="#f97316" />
        <circle cx="14" cy="50" r="2.5" fill="#f97316" />
      </svg>
    )
  },
  {
    id: 'emblem_senju',
    name: 'Герб Сенджу (Древо Тысячи Рук)',
    kanji: '千手',
    themeColor: '#10b981',
    bgGradient: 'from-emerald-950 via-zinc-950 to-green-950',
    borderColor: 'border-emerald-500/50',
    glowColor: 'shadow-emerald-500/30',
    defaultMotto: 'Воля Огня пускает корни глубоко в сердце!',
    desc: 'Священный символ клана Сенджу — потомков Асуры Ооцуцуки. Ваджра лесной чакры и несокрушимой жизненной силы Мокутон.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#10b981" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="#022c22" />
        {/* Ваджра Сенджу */}
        <g stroke="#34d399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          {/* Вертикальная ось */}
          <line x1="50" y1="18" x2="50" y2="82" stroke="#10b981" strokeWidth="5" />
          {/* Горизонтальные перекладины */}
          <line x1="30" y1="36" x2="70" y2="36" />
          <line x1="34" y1="50" x2="66" y2="50" />
          <line x1="30" y1="64" x2="70" y2="64" />
          {/* Верхний зубец */}
          <path d="M42 24 L50 16 L58 24" fill="none" strokeWidth="3.5" />
          {/* Нижний зубец */}
          <path d="M42 76 L50 84 L58 76" fill="none" strokeWidth="3.5" />
        </g>
        <circle cx="50" cy="50" r="6" fill="#6ee7b7" />
      </svg>
    )
  },
  {
    id: 'emblem_hyuga',
    name: 'Герб Хьюга (Пламя Дзюкэн & Инь-Ян)',
    kanji: '日向',
    themeColor: '#c084fc',
    bgGradient: 'from-purple-950 via-zinc-950 to-indigo-950',
    borderColor: 'border-purple-500/50',
    glowColor: 'shadow-purple-500/30',
    defaultMotto: 'Всеведущий взор не знает слепых зон!',
    desc: 'Благородный герб Хьюга: белоснежное пламя чакры и круги поля Багуа. Символизирует абсолютную чистоту родословной Бьякугана и мастерство Мягкого кулака.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#c084fc" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="#2e1065" />
        {/* Кольца Багуа */}
        <circle cx="50" cy="50" r="32" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 3" />
        <circle cx="50" cy="50" r="22" stroke="#d8b4fe" strokeWidth="1" />
        {/* Факел пламени Хьюга */}
        <path 
          d="M50 20 C42 32 38 42 38 52 C38 64 43 72 50 72 C57 72 62 64 62 52 C62 42 58 32 50 20 Z" 
          fill="#f5f3ff" 
          stroke="#c084fc" 
          strokeWidth="2"
        />
        <path 
          d="M50 34 C46 42 44 48 44 54 C44 60 47 64 50 64 C53 64 56 60 56 54 C56 48 54 42 50 34 Z" 
          fill="#c084fc" 
          opacity="0.8"
        />
        <circle cx="50" cy="52" r="3" fill="#ffffff" />
      </svg>
    )
  },
  {
    id: 'emblem_tenrai',
    name: 'Герб Тэнрай (Громовой Трезубец)',
    kanji: '天雷',
    themeColor: '#38bdf8',
    bgGradient: 'from-sky-950 via-zinc-950 to-blue-950',
    borderColor: 'border-sky-500/50',
    glowColor: 'shadow-sky-500/30',
    defaultMotto: 'Скорость небесной молнии разит без пощады!',
    desc: 'Герб громового клана Тэнрай: небесный трезубец разрядов и спираль Икадзутигана. Сверхскоростные нервные импульсы и Чёрная Молния.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#38bdf8" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="#082f49" />
        {/* Разряды молнии */}
        <path d="M50 16 L42 44 L54 44 L44 84 L64 48 L52 48 L60 16 Z" fill="#38bdf8" stroke="#bae6fd" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="34" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="6 4" />
        {/* Вспомогательные искры */}
        <path d="M26 32 L34 40 L30 46" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" />
        <path d="M74 32 L66 40 L70 46" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'emblem_shinkai',
    name: 'Герб Синкай (Глубинная Бездна)',
    kanji: '深海',
    themeColor: '#06b6d4',
    bgGradient: 'from-cyan-950 via-zinc-950 to-teal-950',
    borderColor: 'border-cyan-500/50',
    glowColor: 'shadow-cyan-500/30',
    defaultMotto: 'Океан сокрушает даже самые крепкие утесы!',
    desc: 'Лазурные морские капли и вихрь глубин Аойгана. Водное ускорение, чешуйчатый доспех Гёрин но Ёрой и сокрушительные приливные волны.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#06b6d4" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="#042f2e" />
        {/* Тройная водяная капля Аойгана */}
        <path d="M50 24 C50 24 64 42 64 54 C64 62 58 68 50 68 C42 68 36 62 36 54 C36 42 50 24 50 24 Z" fill="#06b6d4" stroke="#a5f3fc" strokeWidth="2" />
        <path d="M34 56 C34 56 24 64 24 72 C24 78 28 82 34 82 C40 82 44 78 44 72 C44 64 34 56 34 56 Z" fill="#0891b2" />
        <path d="M66 56 C66 56 56 64 56 72 C56 78 60 82 66 82 C72 82 76 78 76 72 C76 64 66 56 66 56 Z" fill="#0891b2" />
        {/* Водные волны снизу */}
        <path d="M20 78 Q35 72 50 78 T80 78" stroke="#67e8f9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'emblem_kingan',
    name: 'Герб Кинган (Золотой Разлом)',
    kanji: '金眼',
    themeColor: '#eab308',
    bgGradient: 'from-amber-950 via-zinc-950 to-yellow-950',
    borderColor: 'border-yellow-500/50',
    glowColor: 'shadow-yellow-500/30',
    defaultMotto: 'В любой броне и технике есть роковой шов!',
    desc: 'Золотой солнечный кристалл и кольца анализа слабостей Кингана. Видение структурных дефектов и разрушение барьеров любой прочности.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#eab308" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="#422006" />
        {/* Золотой ромб-кристалл */}
        <polygon points="50,18 78,50 50,82 22,50" fill="#ca8a04" stroke="#fef08a" strokeWidth="2" />
        <circle cx="50" cy="50" r="16" stroke="#fde047" strokeWidth="2" fill="#a16207" />
        <circle cx="50" cy="50" r="6" fill="#ffffff" />
        {/* Линии разлома */}
        <line x1="18" y1="50" x2="82" y2="50" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="50" y1="18" x2="50" y2="82" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    )
  },
  {
    id: 'emblem_nara',
    name: 'Герб Нара (Оленьи Рога Тени)',
    kanji: '奈良',
    themeColor: '#84cc16',
    bgGradient: 'from-lime-950 via-zinc-950 to-emerald-950',
    borderColor: 'border-lime-500/50',
    glowColor: 'shadow-lime-500/30',
    defaultMotto: 'Победа куется тактикой и холодным расчетом!',
    desc: 'Благородные оленьи рога заповедного леса Нара и теневые нити Каге Мане но Дзюцу. Тактический гений и абсолютный контроль оппонента.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#84cc16" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="#14532d" />
        {/* Теневой круг */}
        <circle cx="50" cy="50" r="28" fill="#09090b" stroke="#a3e635" strokeWidth="2" />
        {/* Оленьи рога */}
        <path d="M38 68 C38 52 32 40 24 32 M34 46 C28 42 22 44 18 42 M46 68 C46 48 42 34 36 22 M50 68 L50 48" stroke="#bef264" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M62 68 C62 52 68 40 76 32 M66 46 C72 42 78 44 82 42 M54 68 C54 48 58 34 64 22 M50 68 L50 48" stroke="#bef264" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="74" r="3" fill="#a3e635" />
      </svg>
    )
  },
  {
    id: 'emblem_akimichi',
    name: 'Герб Акимичи (Кандзи «Пища» & Бабочка)',
    kanji: '秋道',
    themeColor: '#f43f5e',
    bgGradient: 'from-rose-950 via-zinc-950 to-pink-950',
    borderColor: 'border-rose-500/50',
    glowColor: 'shadow-rose-500/30',
    defaultMotto: 'Истинная мощь рождается в великом теле!',
    desc: 'Священный круг с иероглифом «食» (Еда / Сила) и крыльями чакровой бабочки Чодан Бакугеки. Несокрушимая физическая мощь и расширение массы тела.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#f43f5e" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="#4c0519" />
        {/* Крылья чакровой бабочки */}
        <path d="M50 50 Q20 20 22 45 Q24 70 50 55" fill="#fda4af" opacity="0.4" />
        <path d="M50 50 Q80 20 78 45 Q76 70 50 55" fill="#fda4af" opacity="0.4" />
        {/* Центральный круг с кандзи 食 */}
        <circle cx="50" cy="50" r="24" fill="#e11d48" stroke="#ffe4e6" strokeWidth="2" />
        <text x="50" y="58" fontSize="24" fontWeight="900" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">食</text>
      </svg>
    )
  },
  {
    id: 'emblem_yamanaka',
    name: 'Герб Яманака (Цветок Клевера)',
    kanji: '山中',
    themeColor: '#a855f7',
    bgGradient: 'from-purple-950 via-zinc-950 to-violet-950',
    borderColor: 'border-purple-500/50',
    glowColor: 'shadow-purple-500/30',
    defaultMotto: 'Разум проникает сквозь любые преграды!',
    desc: 'Благородный цветок кустарникового клевера (Хаги) и волны ментальной связи Синтенсин но Дзюцу. Телепатия, перехват контроля и сенсорная разведка.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#a855f7" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="#3b0764" />
        {/* Кольца телепатии */}
        <circle cx="50" cy="50" r="34" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
        <circle cx="50" cy="50" r="26" stroke="#d8b4fe" strokeWidth="1.5" opacity="0.8" />
        {/* Лепестки цветка Хаги */}
        <circle cx="50" cy="36" r="10" fill="#a855f7" />
        <circle cx="63" cy="45" r="10" fill="#9333ea" />
        <circle cx="58" cy="61" r="10" fill="#7e22ce" />
        <circle cx="42" cy="61" r="10" fill="#7e22ce" />
        <circle cx="37" cy="45" r="10" fill="#9333ea" />
        <circle cx="50" cy="50" r="7" fill="#f3e8ff" stroke="#6b21a8" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: 'emblem_aburame',
    name: 'Герб Абураме (Печать Кикайчу)',
    kanji: '油女',
    themeColor: '#14b8a6',
    bgGradient: 'from-teal-950 via-zinc-950 to-slate-950',
    borderColor: 'border-teal-500/50',
    glowColor: 'shadow-teal-500/30',
    defaultMotto: 'Тихий рой поглощает любую чакру!',
    desc: 'Обсидиановый жук-скарабей и руны симбиоза с жуками Кикайчу. Незаметное истощение запасов врага и абсолютная защита роя.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#14b8a6" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="#042f2e" />
        {/* Панцирь жука Кикайчу */}
        <ellipse cx="50" cy="54" rx="18" ry="24" fill="#0d9488" stroke="#5eead4" strokeWidth="2" />
        <line x1="50" y1="30" x2="50" y2="78" stroke="#115e59" strokeWidth="2" />
        <ellipse cx="50" cy="28" rx="10" ry="8" fill="#134e4a" stroke="#5eead4" strokeWidth="1.5" />
        {/* Усики */}
        <path d="M44 24 Q36 14 30 18" stroke="#2dd4bf" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M56 24 Q64 14 70 18" stroke="#2dd4bf" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Лапки */}
        <path d="M34 44 L20 38 M32 54 L18 54 M34 64 L20 70" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
        <path d="M66 44 L80 38 M68 54 L82 54 M66 64 L80 70" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'emblem_inuzuka',
    name: 'Герб Инузука (Двойной Клык)',
    kanji: '犬塚',
    themeColor: '#ef4444',
    bgGradient: 'from-red-950 via-zinc-950 to-amber-950',
    borderColor: 'border-red-500/50',
    glowColor: 'shadow-red-500/30',
    defaultMotto: 'Верность стае и ярость зверя превыше всего!',
    desc: 'Алые парные клыки (татуировки на щеках бойцов Инузука) и след волчьей лапы. Неукротимое звериное тайдзюцу Гацуга и боевые нинкен.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#ef4444" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="#450a0a" />
        {/* Парные красные клыки на щеках */}
        <polygon points="32,24 44,24 38,76" fill="#dc2626" stroke="#fca5a5" strokeWidth="1.5" />
        <polygon points="56,24 68,24 62,76" fill="#dc2626" stroke="#fca5a5" strokeWidth="1.5" />
        {/* След когтей на фоне */}
        <circle cx="50" cy="50" r="32" stroke="#f87171" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
    )
  },
  {
    id: 'emblem_sarutobi',
    name: 'Герб Сарутоби (Обезьяний Пламень)',
    kanji: '猿飛',
    themeColor: '#f97316',
    bgGradient: 'from-orange-950 via-zinc-950 to-amber-950',
    borderColor: 'border-orange-500/50',
    glowColor: 'shadow-orange-500/30',
    defaultMotto: 'Листья кружатся там, где горит истинный Огонь!',
    desc: 'Священный огонь клана Сарутоби — рода Третьего Хокаге Хирузена и Конохамару. Владение всеми пятью стихиями и призыв Царя Обезьян Энмы.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#f97316" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="#431407" />
        {/* Пятиконечный факел пяти стихий */}
        <path d="M50 18 Q62 38 56 50 Q68 46 64 62 Q58 76 50 82 Q42 76 36 62 Q32 46 44 50 Q38 38 50 18 Z" fill="#ea580c" stroke="#fed7aa" strokeWidth="2" />
        <circle cx="50" cy="56" r="6" fill="#fde047" />
      </svg>
    )
  },
  {
    id: 'emblem_hatake',
    name: 'Герб Хатаке (Белый Клык)',
    kanji: 'はたけ',
    themeColor: '#94a3b8',
    bgGradient: 'from-slate-950 via-zinc-950 to-zinc-900',
    borderColor: 'border-slate-400/50',
    glowColor: 'shadow-slate-400/30',
    defaultMotto: 'Те, кто нарушают правила — отбросы, но те, кто бросают друзей — хуже отбросов!',
    desc: 'Серебряный короткий клинок чакры Белого Клыка Сакумо и Какаши Хатаке. Легендарный гений клинка и тысячи скопированных дзюцу.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#94a3b8" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="#0f172a" />
        {/* Белый танто-клинок Белого Клыка */}
        <path d="M50 16 L56 24 L52 66 L48 66 L44 24 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="42" y="66" width="16" height="5" rx="1.5" fill="#64748b" />
        <rect x="46" y="71" width="8" height="15" rx="1" fill="#334155" />
        {/* Разряды Райкири вокруг клинка */}
        <path d="M30 40 L40 45 L35 52 L48 55" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M70 40 L60 45 L65 52 L52 55" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    )
  },
  {
    id: 'emblem_hokage',
    name: 'Герб Воли Огня (Хокаге Конохи)',
    kanji: '火影',
    themeColor: '#ef4444',
    bgGradient: 'from-rose-950 via-amber-950 to-zinc-950',
    borderColor: 'border-amber-500/50',
    glowColor: 'shadow-amber-500/30',
    defaultMotto: 'Деревня — это моя семья, и я защищу ее ценой жизни!',
    desc: 'Священный кандзи «火» (Огонь) на треугольной шляпе Хокаге и символ Скрытого Листа. Высший символ защиты и единства всей Деревни.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="#450a0a" />
        {/* Символ листа Конохи */}
        <path 
          d="M34 58 C30 44 42 32 56 34 C64 35 70 42 66 50 C62 58 50 64 42 60 C38 58 35 62 30 70" 
          stroke="#ef4444" 
          strokeWidth="4" 
          fill="none" 
          strokeLinecap="round" 
        />
        <circle cx="50" cy="46" r="3" fill="#fde047" />
        <polygon points="50,16 54,24 46,24" fill="#f59e0b" />
      </svg>
    )
  },
  {
    id: 'emblem_anbu',
    name: 'Герб Спецназа АНБУ (Маска Лисицы)',
    kanji: '暗部',
    themeColor: '#a855f7',
    bgGradient: 'from-zinc-950 via-purple-950 to-slate-950',
    borderColor: 'border-purple-500/50',
    glowColor: 'shadow-purple-500/30',
    defaultMotto: 'Мы действуем из тени, чтобы деревня жила на свету!',
    desc: 'Фарфоровая маска лисицы подразделения АНБУ и церемониальная татуировка на плече. Тайные миссии класса S и защита Каге.',
    renderSvg: (className = "w-12 h-12") => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#a855f7" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="42" fill="#18181b" />
        {/* Маска АНБУ */}
        <path d="M50 20 C36 20 28 34 28 52 C28 70 38 82 50 82 C62 82 72 70 72 52 C72 34 64 20 50 20 Z" fill="#f4f4f5" stroke="#71717a" strokeWidth="1.5" />
        {/* Прорези глаз */}
        <path d="M36 46 Q42 42 46 48" stroke="#18181b" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M64 46 Q58 42 54 48" stroke="#18181b" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Красные тату лисицы на щеках */}
        <path d="M32 56 Q36 62 44 60" stroke="#dc2626" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M68 56 Q64 62 56 60" stroke="#dc2626" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <polygon points="50,66 48,70 52,70" fill="#18181b" />
      </svg>
    )
  }
];

export function getClanEmblemById(id) {
  if (!id) return CLAN_EMBLEMS[0];
  const found = CLAN_EMBLEMS.find(e => e.id === id);
  return found || CLAN_EMBLEMS[0];
}
