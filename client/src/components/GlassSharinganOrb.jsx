import React from 'react';

/**
 * 3D GLASS ORB / MARBLE SHADER FOR NARUTO DŌJUTSU
 * Эталонная реализация оптической 3D-сферы (Glass Orb).
 * 
 * КАНОНИЧЕСКАЯ РЕВИЗИЯ:
 * 1. РИННЕ-ШАРИНГАН: каноническая версия с 9 ТОМОЭ (Кагуя / Мадара / Бесконечное Цукуёми) на алом куполе + 4 кольца!
 * 2. РИННЕГАН САСКЕ: 6 томоэ на фиолетовом куполе (Аменотедзикара).
 * 3. РИННЕГАН ШЕСТИ ПУТЕЙ: концентрические кольца без томоэ (Пейн / Нагато).
 * 4. ТОП-5 ОФИЦИАЛЬНЫХ МАНГЁКЁ:
 *    - Саске: инвертированный МШ (красная 6-конечная звезда Чоку-Томоэ на черном поле) + каноничный ВМШ
 *    - Итачи: 3 органических серпа мельницы
 *    - Мадара: 3 петли томоэ (МШ) + внешний обод с дисками и клиньями Изуны (ВМШ)
 *    - Обито (Камуи): 3 хищных клыка-крюка воронки сингулярности
 *    - Шисуи (Кото): 4-лопастной сюрикен абсолютного гендзюцу под 45°
 * 5. БЬЯКУГАН: 4 уникальные стадии (1 кольцо фокуса -> 2 кольца + 16 Тэнкэцу + Кейракукей -> 3 кольца Багуа + 8 Триграмм + Инь-Ян -> Тэнсэйган)
 * 6. КИНГАН, АОЙГАН, ИКАДЗУТИГАН: 4 уникальные стадии для каждого.
 */

export const MANGEKYO_PATTERNS = {
  SASUKE_EMS: 'sasuke_ems',
  ITACHI: 'itachi',
  SASUKE_MS: 'sasuke_ms',
  MADARA_EMS: 'madara_ems',
  MADARA_MS: 'madara_ms',
  KAMUI: 'kamui',
  SHISUI: 'shisui'
};

// ТОЛЬКО 5 ОФИЦИАЛЬНЫХ КАНОНИЧНЫХ ОБЛАДАТЕЛЕЙ МАНГЁКЁ
export const MANGEKYO_LIST = [
  { id: 'sasuke_ems', name: 'Саске (ВМШ)', owner: 'Саске Учиха', desc: 'Слияние прямой 6-конечной звезды Чоку-Томоэ Саске и лезвий Итачи. Вечный огонь Аматэрасу.' },
  { id: 'itachi', name: 'Итачи (МШ)', owner: 'Итачи Учиха', desc: '3 закрученных серпа мельницы. Пламя Аматэрасу и гендзюцу Цукуёми.' },
  { id: 'sasuke_ms', name: 'Саске (МШ)', owner: 'Саске Учиха', desc: 'Инвертированная 6-конечная звезда Чоку-Томоэ (красная звезда на черном поле). Контроль пламени Энтон.' },
  { id: 'madara_ems', name: 'Мадара (ВМШ)', owner: 'Мадара Учиха', desc: 'Толстый внешний обруч, 3 петли с просветами радужки и клинья Изуны. Завершённое Сусаноо.' },
  { id: 'madara_ms', name: 'Мадара (МШ)', owner: 'Мадара Учиха', desc: '3 замкнутых кольца томоэ вокруг ядра сингулярности.' },
  { id: 'kamui', name: 'Камуи (Обито)', owner: 'Обито / Какаши', desc: '3 массивных хищных клыка-крюка. Искажение пространства-времени и телепортация в карманное измерение.' },
  { id: 'shisui', name: 'Шисуи (Кото)', owner: 'Шисуи Учиха', desc: '4-лопастной стремительный сюрикен. Котоамацуками — абсолютное подчинение разума без осознания жертвы.' }
];

/**
 * 8 Сакральных Триграмм Багуа (八卦) для 3 ступени Бьякугана
 */
const Trigram = ({ lines, angle }) => {
  return (
    <g transform={`rotate(${angle})`}>
      {lines.map((isYang, idx) => {
        const y = -58 - idx * 4.2;
        if (isYang) {
          return <line key={idx} x1="-7" y1={y} x2="7" y2={y} stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" />;
        }
        return (
          <g key={idx}>
            <line x1="-7" y1={y} x2="-1.5" y2={y} stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="1.5" y1={y} x2="7" y2={y} stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
};

/**
 * Procedural Chakra Fiber Wisps (Радиальные волокна стромы)
 */
const ChakraFiberWisps = ({ color = '#ff4d58', count = 36 }) => {
  return (
    <g opacity="0.38" stroke={color} strokeLinecap="round">
      {Array.from({ length: count }).map((_, i) => {
        const ang = (i * (360 / count) * Math.PI) / 180;
        const r1 = 16 + (i % 3) * 5;
        const len = 70 + (i % 4) * 5;
        const x1 = Math.cos(ang) * r1;
        const y1 = Math.sin(ang) * r1;
        const x2 = Math.cos(ang) * len;
        const y2 = Math.sin(ang) * len;
        const width = 0.9 + (i % 3) * 0.6;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeWidth={width}
            opacity={0.35 + (i % 2) * 0.3}
          />
        );
      })}
    </g>
  );
};

/**
 * Рендерер геометрических узоров по центру (0, 0)
 */
export const OrbPatternRenderer = ({ pattern, family = 'Sharingan', stageId = null }) => {
  const stage = String(stageId || '').toLowerCase();
  const fam = String(family || '').toLowerCase();
  const pat = String(pattern || '').toLowerCase();

  // ========================================================
  // [1] БАЗОВЫЙ ШАРИНГАН (1, 2, 3 ТОМОЭ)
  // ========================================================
  if (stage === 'sharingan_1' || stage === 'sharingan_2' || stage === 'sharingan_3') {
    const tomoeCount = stage === 'sharingan_1' ? 1 : (stage === 'sharingan_2' ? 2 : 3);
    const angles = tomoeCount === 1 ? [0] : (tomoeCount === 2 ? [0, 180] : [0, 120, 240]);
    return (
      <g>
        <circle r="52" fill="none" stroke="#09090b" strokeWidth="2.5" opacity="0.85" />
        <circle r="12" fill="#050505" stroke="#7f1d1d" strokeWidth="1.5" />
        <circle r="4" fill="#ffffff" filter="drop-shadow(0 0 3px #ff2a4b)" />
        {angles.map((deg, i) => (
          <g key={i} transform={`rotate(${deg})`}>
            <g transform="translate(0, -52)">
              <circle r="8" fill="#050505" stroke="#ef4444" strokeWidth="1" />
              <path d="M -7 0 C -7 -10, 4 -14, 8 -22 C 6 -14, 2 -8, 0 -5 Z" fill="#050505" stroke="#ff2a4b" strokeWidth="0.8" />
              <circle r="2.5" fill="#ffffff" />
            </g>
          </g>
        ))}
      </g>
    );
  }

  // ========================================================
  // [2] РИННЕГАН И РИННЕ-ШАРИНГАН
  // ========================================================
  if (fam.includes('rinne') || stage.includes('rinne') || pat === 'rinne_sharingan' || pat === 'kaguya') {
    const isRinneSharingan = pat === 'rinne_sharingan' || pat === 'kaguya' || stage === 'rinne_sharingan';
    if (isRinneSharingan) {
      return (
        <g id="rinne_sharingan_9_tomoe">
          {/* 4 Концентрических кольца Бесконечного Цукуёми */}
          <circle r="80" fill="none" stroke="#050505" strokeWidth="2.8" />
          <circle r="62" fill="none" stroke="#050505" strokeWidth="2.8" />
          <circle r="44" fill="none" stroke="#050505" strokeWidth="2.8" />
          <circle r="26" fill="none" stroke="#050505" strokeWidth="2.8" />
          <circle r="12" fill="#050505" stroke="#7f1d1d" strokeWidth="1.5" />
          <circle r="4" fill="#ffffff" filter="drop-shadow(0 0 4px #ffffff)" />

          {/* РОВНО 9 ТОМОЭ: 3 кольца по 3 томоэ */}
          {/* Кольцо 1 (внутреннее r=44): 3 томоэ под 0°, 120°, 240° */}
          {[0, 120, 240].map((deg) => (
            <g key={`inner-r1-${deg}`} transform={`rotate(${deg})`}>
              <g transform="translate(0, -44) scale(0.68)">
                <circle r="7.5" fill="#050505" stroke="#991b1b" strokeWidth="1" />
                <path d="M -6.5 0 C -6.5 -9.5, 3.5 -13, 7.5 -20 C 5.5 -13, 2 -7.5, 0 -4.5 Z" fill="#050505" stroke="#ef4444" strokeWidth="0.8" />
                <circle r="2.2" fill="#ffffff" />
              </g>
            </g>
          ))}

          {/* Кольцо 2 (среднее r=62): 3 томоэ со сдвигом на 60°: 60°, 180°, 300° */}
          {[60, 180, 300].map((deg) => (
            <g key={`mid-r2-${deg}`} transform={`rotate(${deg})`}>
              <g transform="translate(0, -62) scale(0.68)">
                <circle r="7.5" fill="#050505" stroke="#991b1b" strokeWidth="1" />
                <path d="M -6.5 0 C -6.5 -9.5, 3.5 -13, 7.5 -20 C 5.5 -13, 2 -7.5, 0 -4.5 Z" fill="#050505" stroke="#ef4444" strokeWidth="0.8" />
                <circle r="2.2" fill="#ffffff" />
              </g>
            </g>
          ))}

          {/* Кольцо 3 (внешнее r=80): 3 томоэ под 0°, 120°, 240° */}
          {[0, 120, 240].map((deg) => (
            <g key={`outer-r3-${deg}`} transform={`rotate(${deg})`}>
              <g transform="translate(0, -80) scale(0.68)">
                <circle r="7.5" fill="#050505" stroke="#991b1b" strokeWidth="1" />
                <path d="M -6.5 0 C -6.5 -9.5, 3.5 -13, 7.5 -20 C 5.5 -13, 2 -7.5, 0 -4.5 Z" fill="#050505" stroke="#ef4444" strokeWidth="0.8" />
                <circle r="2.2" fill="#ffffff" />
              </g>
            </g>
          ))}
        </g>
      );
    }

    const isSasukeAwakened = stage === 'rinnegan_awakened' || pat === 'sasuke';
    return (
      <g id="rinnegan_six_paths">
        <circle r="78" fill="none" stroke="#2e1065" strokeWidth="2.8" />
        <circle r="62" fill="none" stroke="#3b0764" strokeWidth="2.8" />
        <circle r="46" fill="none" stroke="#2e1065" strokeWidth="2.8" />
        <circle r="30" fill="none" stroke="#3b0764" strokeWidth="2.8" />
        <circle r="14" fill="#1e0538" stroke="#a855f7" strokeWidth="1.5" />
        <circle r="5" fill="#ffffff" filter="drop-shadow(0 0 4px #c084fc)" />

        {/* РОВНО 6 ТОМОЭ САСКЕ: 3 на внутреннем, 3 на среднем */}
        {isSasukeAwakened && (
          <g>
            {[0, 120, 240].map(deg => (
              <g key={`inner-${deg}`} transform={`rotate(${deg})`}>
                <g transform="translate(0, -46) scale(0.7)">
                  <circle r="7" fill="#0b0314" stroke="#c084fc" strokeWidth="1.2" />
                  <path d="M -6 0 C -6 -9, 3 -12, 7 -19 C 5 -12, 2 -7, 0 -4 Z" fill="#0b0314" />
                  <circle r="2.2" fill="#ffffff" />
                </g>
              </g>
            ))}
            {[60, 180, 300].map(deg => (
              <g key={`outer-${deg}`} transform={`rotate(${deg})`}>
                <g transform="translate(0, -62) scale(0.7)">
                  <circle r="7" fill="#0b0314" stroke="#c084fc" strokeWidth="1.2" />
                  <path d="M -6 0 C -6 -9, 3 -12, 7 -19 C 5 -12, 2 -7, 0 -4 Z" fill="#0b0314" />
                  <circle r="2.2" fill="#ffffff" />
                </g>
              </g>
            ))}
          </g>
        )}
      </g>
    );
  }

  // ========================================================
  // [3] БЬЯКУГАН — 4 КАНОНИЧЕСКИЕ УНИКАЛЬНЫЕ СТУПЕНИ
  // ========================================================
  if (fam.includes('byakugan') || stage.includes('byakugan')) {
    // 1 этап: Око Ясности (Базовый обзор 360°)
    if (stage === 'byakugan_1') {
      return (
        <g id="byakugan_1">
          <circle r="14" fill="#f8faff" stroke="#9bb1e8" strokeWidth="2.2" />
          <circle r="4.5" fill="#8197d6" opacity="0.8" />
          <circle r="52" fill="none" stroke="#9bb1e8" strokeWidth="2" strokeDasharray="6 3" />
          {[0, 90, 180, 270].map((deg) => (
            <line
              key={deg}
              x1="0"
              y1="-42"
              x2="0"
              y2="-64"
              stroke="#8197d6"
              strokeWidth="2.2"
              strokeLinecap="round"
              transform={`rotate(${deg})`}
            />
          ))}
          {[45, 135, 225, 315].map((deg) => (
            <circle key={deg} cx="0" cy="-52" r="1.8" fill="#8197d6" transform={`rotate(${deg})`} />
          ))}
        </g>
      );
    }

    // 2 этап: Прозрение (361 узел Тэнкэцу и сеть Кейракукей)
    if (stage === 'byakugan_2') {
      return (
        <g id="byakugan_2">
          <circle r="15" fill="#f4f7ff" stroke="#7e98df" strokeWidth="2.4" />
          <circle r="5" fill="#6783d2" />
          <circle r="40" fill="none" stroke="#8fa8eb" strokeWidth="2" />
          <circle r="70" fill="none" stroke="#718cd4" strokeWidth="2.4" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <path
                d="M 0,-15 C 4,-26 -3,-32 0,-40 C 3,-48 6,-58 0,-70 C -4,-76 -2,-80 0,-84"
                fill="none"
                stroke="#6c87d6"
                strokeWidth="1.4"
                opacity="0.8"
              />
              <path
                d="M 0,-40 C -6,-48 -8,-56 -4,-64"
                fill="none"
                stroke="#8fa8eb"
                strokeWidth="1"
                opacity="0.65"
              />
            </g>
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 22.5})`}>
              <circle cy="-70" r="3.4" fill="#ffffff" stroke="#4a6cb5" strokeWidth="1.2" />
              <circle cy="-70" r="1.4" fill="#0284c7" />
            </g>
          ))}
        </g>
      );
    }

    // 3 этап: Поле Багуа 64 ладоней (Ровно 3 кольца, 8 Триграмм и Тайцзи Инь-Ян)
    if (stage === 'byakugan_3') {
      return (
        <g id="byakugan_3">
          <circle r="28" fill="none" stroke="#7994df" strokeWidth="2" />
          <circle r="52" fill="none" stroke="#5d7cd4" strokeWidth="2.2" />
          <circle r="78" fill="none" stroke="#0284c7" strokeWidth="2.6" strokeDasharray="1.6 2.22" />

          {/* Центральный сакральный символ Инь-Ян (Тайдзи Мягкого кулака Хьюга) */}
          <g id="yin_yang">
            <circle r="16" fill="#f8faff" stroke="#0284c7" strokeWidth="1.6" />
            <path d="M 0,-16 A 16 16 0 0 0 0,16 A 8 8 0 0 1 0,0 A 8 8 0 0 0 0,-16 Z" fill="#0284c7" />
            <circle cy="-8" r="2.8" fill="#f8faff" />
            <circle cy="8" r="2.8" fill="#0284c7" />
          </g>

          {/* 8 Священных Триграмм Багуа (八卦) */}
          <Trigram angle={0} lines={[true, true, true]} />       {/* Цянь ☰ */}
          <Trigram angle={45} lines={[false, true, true]} />     {/* Дуй ☱ */}
          <Trigram angle={90} lines={[true, false, true]} />     {/* Ли ☲ */}
          <Trigram angle={135} lines={[false, false, true]} />   {/* Чжэнь ☳ */}
          <Trigram angle={180} lines={[false, false, false]} />  {/* Кунь ☷ */}
          <Trigram angle={225} lines={[true, false, false]} />   {/* Гэнь ☶ */}
          <Trigram angle={270} lines={[false, true, false]} />   {/* Кань ☵ */}
          <Trigram angle={315} lines={[true, true, false]} />    {/* Сюнь ☴ */}
        </g>
      );
    }

    // 4 этап: Пробуждённый Тэнсэйган (Цветок Хамуры Ооцуцуки из The Last)
    return (
      <g id="tensei_awakened">
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => (
          <path
            key={deg}
            d="M 0,-16 C -11,-32 -13,-54 0,-74 C 13,-54 11,-32 0,-16 Z"
            fill="#0369a1"
            stroke="#38bdf8"
            strokeWidth="1.4"
            transform={`rotate(${deg})`}
          />
        ))}

        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <path
              d="M 0,-18 C -15,-36 -17,-64 0,-86 C 17,-64 15,-36 0,-18 Z"
              fill="rgba(255, 255, 255, 0.85)"
              stroke="#0284c7"
              strokeWidth="1.8"
            />
            <line x1="0" y1="-20" x2="0" y2="-82" stroke="#00e5ff" strokeWidth="2" />
          </g>
        ))}

        <circle r="18" fill="#ffffff" />
        <circle r="13" fill="#00d4ff" opacity="0.8" />
        <circle r="6" fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff)" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <circle key={deg} cx="0" cy="-86" r="2.8" fill="#ffffff" filter="drop-shadow(0 0 4px #38bdf8)" transform={`rotate(${deg})`} />
        ))}
      </g>
    );
  }

  // ========================================================
  // [4] КИНГАН, АОЙГАН, ИКАДЗУТИГАН
  // ========================================================
  if (fam.includes('kingan') || stage.includes('kingan')) {
    if (stage === 'kingan_1') {
      return (
        <g id="kingan_1">
          <circle r="13" fill="#181002" stroke="#ffe100" strokeWidth="2.5" />
          <circle r="4.5" fill="#ffffff" filter="drop-shadow(0 0 5px #ffffff)" />
          <circle r="54" fill="none" stroke="#ffe100" strokeWidth="2.5" strokeDasharray="4 3" />
          <circle r="54" fill="none" stroke="#ffaa00" strokeWidth="1" opacity="0.6" />
          {[0, 90, 180, 270].map((deg) => (
            <line key={deg} x1="0" y1="-44" x2="0" y2="-66" stroke="#ffe100" strokeWidth="2.8" strokeLinecap="round" transform={`rotate(${deg})`} />
          ))}
          {[45, 135, 225, 315].map((deg) => (
            <line key={deg} x1="0" y1="-50" x2="0" y2="-58" stroke="#ffffff" strokeWidth="1.5" transform={`rotate(${deg})`} />
          ))}
        </g>
      );
    }
    if (stage === 'kingan_2') {
      return (
        <g id="kingan_2">
          <circle r="14" fill="#181002" stroke="#ffe100" strokeWidth="2.8" />
          <circle r="5" fill="#ffffff" filter="drop-shadow(0 0 5px #ffffff)" />
          <circle r="44" fill="none" stroke="#ffe100" strokeWidth="2.6" />
          <circle r="72" fill="none" stroke="#ffaa00" strokeWidth="2.2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <polygon points="-4,-54 0,-66 4,-54" fill="#ffe100" stroke="#ffffff" strokeWidth="0.8" />
              <line x1="0" y1="-44" x2="0" y2="-50" stroke="#ffffff" strokeWidth="1.6" />
            </g>
          ))}
          <circle r="58" fill="none" stroke="#ffe100" strokeWidth="1" strokeDasharray="2 5" opacity="0.75" />
        </g>
      );
    }
    if (stage === 'kingan_3') {
      return (
        <g id="kingan_3">
          <circle r="15" fill="#181002" stroke="#ffe100" strokeWidth="3" />
          <circle r="5.5" fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff)" />
          <circle r="36" fill="none" stroke="#ffe100" strokeWidth="2.2" />
          <circle r="56" fill="none" stroke="#ffc400" strokeWidth="2.8" strokeDasharray="16 4" />
          <circle r="76" fill="none" stroke="#ff9400" strokeWidth="2" />
          {[0, 90, 180, 270].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <path d="M -5,-22 L 0,-84 L 5,-22 L 2.5,-16 L -2.5,-16 Z" fill="#ffe100" stroke="#ffffff" strokeWidth="1" />
              <line x1="0" y1="-20" x2="0" y2="-82" stroke="#ffffff" strokeWidth="1.6" />
            </g>
          ))}
          {[45, 135, 225, 315].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <line x1="-7" y1="-64" x2="7" y2="-64" stroke="#ffe100" strokeWidth="2.2" />
              <line x1="-7" y1="-68" x2="7" y2="-68" stroke="#ffe100" strokeWidth="2.2" />
            </g>
          ))}
        </g>
      );
    }
    return (
      <g id="kingan_awakened">
        <circle r="18" fill="#181002" stroke="#ffe100" strokeWidth="3.2" />
        <circle r="6.5" fill="#ffffff" filter="drop-shadow(0 0 8px #ffffff)" />
        <polygon points="0,-80 80,0 0,80 -80,0" fill="none" stroke="#ffe100" strokeWidth="3.2" />
        <polygon points="56,-56 56,56 -56,56 -56,-56" fill="none" stroke="#ffaa00" strokeWidth="2.6" />
        <polygon
          points="0,-54 38.2,-38.2 54,0 38.2,38.2 0,54 -38.2,38.2 -54,0 -38.2,-38.2"
          fill="rgba(255, 225, 0, 0.2)"
          stroke="#ffffff"
          strokeWidth="1.6"
        />
        {[0, 90, 180, 270].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <line x1="0" y1="-18" x2="0" y2="-86" stroke="#ffffff" strokeWidth="3" />
            <line x1="0" y1="-18" x2="0" y2="-86" stroke="#ffe100" strokeWidth="6" opacity="0.4" />
            <polygon points="0,-88 -6,-80 0,-72 6,-80" fill="#ffffff" stroke="#ffe100" strokeWidth="1.6" />
          </g>
        ))}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <circle key={deg} cx="0" cy="-80" r="3.2" fill="#ffffff" filter="drop-shadow(0 0 4px #ffe100)" transform={`rotate(${deg})`} />
        ))}
      </g>
    );
  }

  if (fam.includes('aoigan') || stage.includes('aoigan')) {
    if (stage === 'aoigan_1') {
      return (
        <g id="aoigan_1">
          <circle r="13" fill="#010d21" stroke="#00e5ff" strokeWidth="2.6" />
          <circle r="4.5" fill="#ffffff" filter="drop-shadow(0 0 5px #00e5ff)" />
          <circle r="46" fill="none" stroke="#00b4d8" strokeWidth="1.6" opacity="0.75" />
          <circle r="70" fill="none" stroke="#0077b6" strokeWidth="1.4" strokeDasharray="6 4" opacity="0.6" />
          <path d="M 0,-32 C -13,-46 -15,-62 0,-80 C 15,-62 13,-46 0,-32 Z" fill="#00e5ff" stroke="#ffffff" strokeWidth="1" />
          <path d="M 0,-40 C -5,-48 -5,-60 0,-70" stroke="#ffffff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="0" cy="-52" r="3" fill="#ffffff" />
        </g>
      );
    }
    if (stage === 'aoigan_2') {
      return (
        <g id="aoigan_2">
          <circle r="14" fill="#010d21" stroke="#00e5ff" strokeWidth="2.8" />
          <circle r="5" fill="#ffffff" filter="drop-shadow(0 0 5px #00e5ff)" />
          <circle r="58" fill="none" stroke="#0096c7" strokeWidth="2" strokeDasharray="32 14" />
          {[0, 180].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <path d="M 0,-30 C -14,-44 -16,-62 0,-80 C 16,-62 14,-44 0,-30 Z" fill="#00e5ff" stroke="#ffffff" strokeWidth="1" />
              <path d="M 0,-38 C -5,-46 -5,-58 0,-70" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 0,-30 C 18,-28 36,-14 36,0" fill="none" stroke="#00f0ff" strokeWidth="2.2" strokeLinecap="round" />
            </g>
          ))}
        </g>
      );
    }
    if (stage === 'aoigan_3') {
      return (
        <g id="aoigan_3">
          <circle r="15" fill="#010d21" stroke="#00e5ff" strokeWidth="3" />
          <circle r="5.5" fill="#ffffff" filter="drop-shadow(0 0 6px #00e5ff)" />
          {[0, 120, 240].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <path d="M 0,-15 C 16,-22 42,-36 52,-70 C 35,-66 17,-47 9,-31 C 5,-23 2,-16 0,-15 Z" fill="#00e5ff" stroke="#0077b6" strokeWidth="1.2" />
              <path d="M 6,-24 C 20,-34 32,-46 38,-62" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </g>
          ))}
          <circle r="74" fill="none" stroke="#00b4d8" strokeWidth="2.2" strokeDasharray="18 8" />
        </g>
      );
    }
    return (
      <g id="aoigan_awakened">
        <circle r="18" fill="#010d21" stroke="#00f5ff" strokeWidth="3.2" />
        <circle r="6.5" fill="#ffffff" filter="drop-shadow(0 0 8px #00f5ff)" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <path d="M 0,-26 C -15,-40 -18,-64 0,-84 C 18,-64 15,-40 0,-26 Z" fill="rgba(0, 200, 255, 0.5)" stroke="#00f5ff" strokeWidth="2.4" />
            <line x1="0" y1="-28" x2="0" y2="-82" stroke="#ffffff" strokeWidth="2" />
          </g>
        ))}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path key={deg} d="M 0,-40 C 26,-46 48,-25 48,0" fill="none" stroke="#00ffff" strokeWidth="2.6" strokeLinecap="round" transform={`rotate(${deg})`} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx="0" cy="-78" r="2.4" fill="#ffffff" filter="drop-shadow(0 0 4px #00f5ff)" transform={`rotate(${i * 30})`} />
        ))}
      </g>
    );
  }

  // ========================================================
  // [5] ИКАДЗУТИГАН — 4 ВЕЛИКИХ СТУПЕНИ ГРОМА РАЙДЗИНА (ТЭНРАЙ)
  // ========================================================
  if (fam.includes('ikadzutigan') || stage.includes('ikadzutigan')) {
    // 1 СТАДИЯ: 1 разряд / Статическое напряжение (пробой диэлектрика)
    if (stage === 'ikadzutigan_1') {
      return (
        <g id="ikadzutigan_1">
          {/* Ионизационные кольца предпробоя с фазовыми импульсами */}
          <circle r="54" fill="none" stroke="#00ffff" strokeWidth="1.2" strokeDasharray="3 6" opacity="0.6" />
          <circle r="74" fill="none" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="2 8" opacity="0.45" />

          {/* Вторичные ветви-ответвления от главного ствола молнии */}
          <g stroke="#00ffff" strokeWidth="1.2" fill="none" opacity="0.85" filter="url(#lightningGlowCyan)">
            {/* Ответвление вправо на r=42 */}
            <path d="M 6,-42 L 20,-48 L 26,-44 L 34,-52" />
            <circle cx="34" cy="-52" r="1.5" fill="#ffffff" />
            {/* Ответвление влево на r=62 */}
            <path d="M -6,-62 L -20,-66 L -24,-76" />
            <circle cx="-24" cy="-76" r="1.5" fill="#ffffff" />
            {/* Прикорневая микро-искра у ядра */}
            <path d="M -5,-26 L -16,-22 L -22,-28" />
          </g>

          {/* Главный ствол молнии Райдзина (темное тело + неоновый кант + раскаленный сердечник) */}
          <g filter="url(#lightningGlowCyan)">
            <path
              d="M -3,-14 L -8,-28 L 0,-32 L -7,-48 L 6,-42 L -6,-62 L 4,-66 L -2,-84 L 2,-84 L 8,-64 L -2,-60 L 9,-40 L -3,-46 L 4,-30 L 1,-14 Z"
              fill="#050014"
              stroke="#00ffff"
              strokeWidth="1.8"
            />
            <path
              d="M 0,-14 L -4,-28 L 3,-31 L -3,-48 L 8,-41 L -3,-62 L 5,-65 L 0,-84"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          {/* Искровой фокус-конденсатор на острие разряда (0°, r=84) */}
          <g transform="translate(0, -84)" filter="url(#lightningGlowCyan)">
            <polygon points="0,-7 -5,0 0,7 5,0" fill="#ffffff" stroke="#00ffff" strokeWidth="1.5" />
            <circle r="2" fill="#00ffff" />
            <line x1="-9" y1="0" x2="9" y2="0" stroke="#ffffff" strokeWidth="1.2" />
            <line x1="0" y1="-9" x2="0" y2="9" stroke="#ffffff" strokeWidth="1.2" />
          </g>

          {/* Центральный экранированный зрачок с плазменной точкой */}
          <circle r="14" fill="#050014" stroke="#a855f7" strokeWidth="2.5" />
          <circle r="14" fill="none" stroke="#00ffff" strokeWidth="1.2" strokeDasharray="4 2" />
          <circle r="4.5" fill="#ffffff" filter="drop-shadow(0 0 5px #00ffff)" />
        </g>
      );
    }

    // 2 СТАДИЯ: 2 разряда / Ионный дуговой ток (двуполярный LC-разрядник Тесла)
    if (stage === 'ikadzutigan_2') {
      return (
        <g id="ikadzutigan_2">
          {/* Высокочастотные дуговые плазменные мосты Тесла (слева и справа) */}
          <g filter="url(#lightningGlowCyan)">
            {/* Левая дуга разрядника */}
            <path
              d="M 0,-76 C -52,-64 -72,-36 -72,0 C -72,36 -52,64 0,76"
              fill="none"
              stroke="#00ffff"
              strokeWidth="2.4"
            />
            <path
              d="M 0,-76 C -48,-60 -66,-32 -66,0 C -66,32 -48,60 0,76"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeDasharray="12 4"
            />
            {/* Правая дуга разрядника */}
            <path
              d="M 0,-76 C 52,-64 72,-36 72,0 C 72,36 52,64 0,76"
              fill="none"
              stroke="#00ffff"
              strokeWidth="2.4"
            />
            <path
              d="M 0,-76 C 48,-60 66,-32 66,0 C 66,32 48,60 0,76"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeDasharray="12 4"
            />
            {/* Искровые пробои по бокам (электрический джиттер) */}
            <polyline points="-72,0 -80,-5 -74,-12 -82,-18" fill="none" stroke="#ffffff" strokeWidth="1.4" />
            <polyline points="72,0 80,5 74,12 82,18" fill="none" stroke="#ffffff" strokeWidth="1.4" />
          </g>

          {/* Внутреннее резонаторное кольцо */}
          <circle r="36" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeDasharray="6 3" />

          {/* 2 Зеркальные громовые ветви под 180° (0° и 180°) */}
          {[0, 180].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`} filter="url(#lightningGlowCyan)">
              {/* Боковые отростки разряда */}
              <path d="M 6,-42 L 22,-46 L 28,-40" fill="none" stroke="#00ffff" strokeWidth="1.4" />
              <path d="M -6,-58 L -20,-62 L -24,-72" fill="none" stroke="#00ffff" strokeWidth="1.4" />

              {/* Тело молнии */}
              <path
                d="M -3,-14 L -8,-28 L 0,-32 L -7,-48 L 6,-42 L -6,-62 L 4,-66 L 0,-82 L 4,-66 L -2,-60 L 9,-40 L -3,-46 L 4,-30 L 1,-14 Z"
                fill="#050014"
                stroke="#00ffff"
                strokeWidth="1.8"
              />
              <path
                d="M 0,-14 L -4,-28 L 3,-31 L -3,-48 L 8,-41 L -3,-62 L 5,-65 L 0,-80"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.4"
                strokeLinecap="round"
              />

              {/* Плазменный полюсный узел (spark capacitor на r=78) */}
              <g transform="translate(0, -78)">
                <circle r="6" fill="#050014" stroke="#00ffff" strokeWidth="2" />
                <circle r="3" fill="#ffffff" />
                <line x1="-10" y1="0" x2="10" y2="0" stroke="#ffffff" strokeWidth="1.4" />
              </g>
            </g>
          ))}

          {/* Центральный плазменный зрачок */}
          <circle r="15" fill="#050014" stroke="#00ffff" strokeWidth="2.5" />
          <circle r="5" fill="#ffffff" filter="drop-shadow(0 0 6px #00ffff)" />
        </g>
      );
    }

    // 3 СТАДИЯ: 3 разряда / Каскад Тесла (трехфазный Дельта-резонатор Райдзина)
    if (stage === 'ikadzutigan_3') {
      return (
        <g id="ikadzutigan_3">
          {/* Вращающийся треугольный плазменный резонатор (Дельта Тесла) */}
          <g filter="url(#plasmaVioletGlow)">
            {/* Внешний равносторонний треугольник плазмы */}
            <polygon
              points="0,-48 41.6,24 -41.6,24"
              fill="rgba(168, 85, 247, 0.12)"
              stroke="#a855f7"
              strokeWidth="2.4"
            />
            {/* Внутренний контр-треугольник со сдвигом фазы на 60° */}
            <polygon
              points="0,48 -41.6,-24 41.6,-24"
              fill="none"
              stroke="#00ffff"
              strokeWidth="1.4"
              strokeDasharray="8 4"
            />
          </g>

          {/* 3 Священные Триграммы Грома «Чжэнь» (☳) под 60°, 180°, 300° */}
          {[60, 180, 300].map((deg) => (
            <g key={`trigram-${deg}`} transform={`rotate(${deg})`}>
              <g transform="translate(0, -74)" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" filter="drop-shadow(0 0 4px #0284c7)">
                {/* Прерывистая черта 1 (верх) */}
                <line x1="-8" y1="-4" x2="-2" y2="-4" /><line x1="2" y1="-4" x2="8" y2="-4" />
                {/* Прерывистая черта 2 (середина) */}
                <line x1="-8" y1="0" x2="-2" y2="0" /><line x1="2" y1="0" x2="8" y2="0" />
                {/* Сплошная черта 3 (низ) */}
                <line x1="-8" y1="4" x2="8" y2="4" />
              </g>
            </g>
          ))}

          {/* Ветвящиеся дуговые микроразряды (паутина коронного пробоя между клыками) */}
          {[0, 120, 240].map((deg) => (
            <g key={`arc-${deg}`} transform={`rotate(${deg})`} stroke="#00ffff" strokeWidth="1.2" fill="none" opacity="0.75" filter="url(#lightningGlowCyan)">
              <path d="M 0,-70 C 24,-68 45,-52 52,-32" />
              <polyline points="28,-62 36,-68 42,-64" />
              <circle cx="52" cy="-32" r="1.5" fill="#ffffff" />
            </g>
          ))}

          {/* 3 Хищных громовых серпа-клыка (0°, 120°, 240°) */}
          {[0, 120, 240].map((deg) => (
            <g key={`blade-${deg}`} transform={`rotate(${deg})`} filter="url(#lightningGlowCyan)">
              {/* Массивное зазубренное тело клыка из черного обсидиана с циановым кантом */}
              <path
                d="M -4,-16 L -10,-34 L -3,-38 L -14,-56 L -4,-60 L -12,-76 L 0,-85 L 3,-74 L -2,-70 L 6,-52 L 0,-48 L 7,-30 L 3,-16 Z"
                fill="#050014"
                stroke="#00ffff"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              {/* Раскаленный сердечник молнии внутри клыка */}
              <path
                d="M 0,-18 L -6,-36 L 1,-39 L -8,-58 L 1,-61 L -5,-76 L 0,-83"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              {/* Искровые шпоры на изломах */}
              <polygon points="-14,-56 -20,-58 -16,-52" fill="#ffffff" />
              <polygon points="-12,-76 -18,-80 -13,-72" fill="#ffffff" />
            </g>
          ))}

          {/* Внешнее ограничительное кольцо вспышки */}
          <circle r="76" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeDasharray="20 10" opacity="0.6" />

          {/* Центральный искрящийся зрачок */}
          <circle r="16" fill="#04000a" stroke="#00ffff" strokeWidth="2.8" />
          <circle r="6" fill="#ffffff" filter="drop-shadow(0 0 6px #00ffff)" />
        </g>
      );
    }

    // 4 СТАДИЯ: Пробуждённый Икадзутиган / Высший Райдзин Курорайтон (Чёрная Молния)
    return (
      <g id="ikadzutigan_awakened">
        {/* Слой 0: Октаграмма грома (сакральная печать Райдзина) */}
        <g filter="url(#plasmaVioletGlow)">
          {/* Октагональный периметр */}
          <polygon
            points="0,-82 58,-58 82,0 58,58 0,82 -58,58 -82,0 -58,-58"
            fill="rgba(5, 0, 20, 0.55)"
            stroke="#a855f7"
            strokeWidth="2.5"
          />
          {/* Звездный внутренний ромб печати */}
          <polygon
            points="0,-82 82,0 0,82 -82,0"
            fill="none"
            stroke="#00ffff"
            strokeWidth="1.8"
            strokeDasharray="6 3"
          />
          <polygon
            points="58,-58 58,58 -58,58 -58,-58"
            fill="none"
            stroke="#c084fc"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
        </g>

        {/* Слой 1: 4 Промежуточных плазменных дуги с барабанами томоэ (45°, 135°, 225°, 315°) */}
        {[45, 135, 225, 315].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`} filter="url(#plasmaVioletGlow)">
            {/* Извивающийся язык фиолетовой плазмы */}
            <path
              d="M 0,-18 C -14,-32 -16,-52 0,-72 C 16,-52 14,-32 0,-18 Z"
              fill="rgba(168, 85, 247, 0.4)"
              stroke="#c084fc"
              strokeWidth="2"
            />
            <line x1="0" y1="-20" x2="0" y2="-70" stroke="#ffffff" strokeWidth="1.8" />
            {/* Священный барабан Райдзина с символом томоэ на вершине (r=72) */}
            <g transform="translate(0, -72)">
              <circle r="7" fill="#04000a" stroke="#00ffff" strokeWidth="1.8" />
              {/* Золотисто-белый микро-томоэ внутри барабана */}
              <path d="M 0,-3 C 3,-3 4,0 2,2 C 0,4 -3,2 -2,0 Z" fill="#ffffff" />
            </g>
          </g>
        ))}

        {/* Слой 2: 4 Кардинальных Черных Разряда Курорайтон (0°, 90°, 180°, 270°) */}
        {[0, 90, 180, 270].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`} filter="url(#lightningGlowCyan)">
            {/* Мощное обсидиановое тело Черной Молнии Курорайтон */}
            <path
              d="M -5,-18 L -12,-38 L -4,-40 L -16,-62 L -6,-64 L -18,-78 L 0,-86 L 4,-74 L -3,-72 L 7,-54 L 0,-52 L 9,-32 L 4,-18 Z"
              fill="#030008"
              stroke="#00ffff"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Раскаленный добела сверхпроводящий сердечник */}
            <path
              d="M 0,-18 L -8,-39 L 2,-41 L -10,-63 L 2,-65 L -4,-78 L 0,-85"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Боковые шипы черной плазмы */}
            <polygon points="-16,-62 -24,-65 -19,-58" fill="#030008" stroke="#00ffff" strokeWidth="1.2" />
            <polygon points="-18,-78 -26,-82 -21,-74" fill="#030008" stroke="#00ffff" strokeWidth="1.2" />
            {/* Вершинный плазменный конденсатор */}
            <circle cx="0" cy="-86" r="3" fill="#ffffff" />
          </g>
        ))}

        {/* Слой 3: Сакральное внешнее кольцо барабанов томоэ (Raijin Taiko Ring) */}
        <circle r="72" fill="none" stroke="#00ffff" strokeWidth="1.8" strokeDasharray="16 4" opacity="0.85" />

        {/* Слой 4: Центральная шаровая плазма Райдзина (Singularity Core) */}
        <g filter="url(#lightningGlowCyan)">
          {/* Ореол рассеяния */}
          <circle r="24" fill="url(#plasmaBallSingularity)" />
          {/* Черная граница горизонта событий зрачка */}
          <circle r="16" fill="#030008" stroke="#00ffff" strokeWidth="3" />
          <circle r="16" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="6 3" />
          {/* Чисто белое ядро плазмы */}
          <circle r="6.5" fill="#ffffff" />
          {/* 4 микро-орбитальных плазменных вихря */}
          {[0, 90, 180, 270].map((deg) => (
            <circle key={deg} cx="0" cy="-11" r="1.5" fill="#00ffff" transform={`rotate(${deg})`} />
          ))}
        </g>
      </g>
    );
  }

  // ========================================================
  // [6] ТОЛЬКО 5 КАНОНИЧЕСКИХ ОБЛАДАТЕЛЕЙ МАНГЁКЁ (ПО АНИМЕ И ЭТАЛОНУ)
  // ========================================================
  switch (pattern) {
    // 1. ИТАЧИ УЧИХА (3 органических клинка мельницы, канон аниме и сетки 4x4)
    case MANGEKYO_PATTERNS.ITACHI:
      return (
        <g fill="#050505">
          {/* Центральный обод зрачка и ядро */}
          <circle r="15" fill="#050505" />
          <circle r="5.5" fill="#991b1b" opacity="0.85" />
          <circle r="3.2" fill="#ffffff" filter="drop-shadow(0 0 3px #ffffff)" />

          {/* 3 мощных каноничных серпа мельницы Итачи */}
          {[0, 120, 240].map((deg) => (
            <path
              key={deg}
              d="M -7,-13 C 18,-35 56,-52 46,-78 C 24,-58 6,-36 14,-5 Z"
              transform={`rotate(${deg})`}
              stroke="#180003"
              strokeWidth="0.8"
            />
          ))}
        </g>
      );

    // 2а. САСКЕ УЧИХА — ВМШ (Слияние 6-конечной звезды Чоку-Томоэ Саске и лезвий Итачи)
    case MANGEKYO_PATTERNS.SASUKE_EMS:
      return (
        <g id="sasuke_ems">
          {/* Подложка: 6 заостренных алых лепестков звезды Саске */}
          <g id="sasuke_ems_bg_petals">
            {[0, 60, 120].map((deg) => (
              <path
                key={deg}
                d="M 0,-83 A 211 211 0 0 1 0,83 A 211 211 0 0 1 0,-83 Z"
                fill="url(#sasukePetalGrad)"
                transform={`rotate(${deg})`}
              />
            ))}
          </g>

          {/* Черный слитый узор ВМШ: 6-конечная прямая звезда + 3 серпа Итачи */}
          <g fill="#050505">
            {/* 6-конечная прямая звезда Саске */}
            <path d="M 0,-78 L 14,-28 L 67.5,-39 L 28,0 L 67.5,39 L 14,28 L 0,78 L -14,28 L -67.5,39 L -28,0 L -67.5,-39 L -14,-28 Z" />

            {/* 3 серпа Итачи в межлучевых секторах (30°, 150°, 270°) */}
            {[30, 150, 270].map((deg) => (
              <path
                key={deg}
                d="M -7,-13 C 18,-35 56,-52 46,-78 C 24,-58 6,-36 14,-5 Z"
                transform={`rotate(${deg})`}
              />
            ))}

            {/* Центральный черный зрачок и блик */}
            <circle r="14" fill="#050505" />
            <circle r="3.5" fill="#ffffff" filter="drop-shadow(0 0 4px #ffffff)" />
          </g>
        </g>
      );

    // 2б. САСКЕ УЧИХА — МШ (Чоку-Томоэ — 100% точная копия канонического эталона Кирилла)
    case MANGEKYO_PATTERNS.SASUKE_MS:
      return (
        <g id="sasuke_ms_canon">
          {/* 1. Глубокий черный фон сферы */}
          <circle r="88" fill="#000000" />

          {/* 2. Заливка 3 заостренных линз (мандорл) под 0°, 60°, 120° */}
          {[0, 60, 120].map((deg) => (
            <path
              key={`fill-${deg}`}
              d="M 0,-83 A 211 211 0 0 1 0,83 A 211 211 0 0 1 0,-83 Z"
              fill="url(#sasukePetalGrad)"
              transform={`rotate(${deg})`}
            />
          ))}

          {/* 3. Сквозной черный каркас пересечений (контуры всех 3 линз, образующие шестиугольный узел) */}
          {[0, 60, 120].map((deg) => (
            <path
              key={`stroke-${deg}`}
              d="M 0,-83 A 211 211 0 0 1 0,83 A 211 211 0 0 1 0,-83 Z"
              fill="none"
              stroke="#000000"
              strokeWidth="2.8"
              strokeLinejoin="round"
              transform={`rotate(${deg})`}
            />
          ))}

          {/* 4. Внешний черный лимбальный ободок */}
          <circle r="88" fill="none" stroke="#000000" strokeWidth="2.5" />

          {/* 5. Монолитный черный каноничный зрачок */}
          <circle r="14" fill="#000000" />
        </g>
      );

    // 3а. МАДАРА УЧИХА — ВМШ (Внешний черный обруч + 3 петли со сквозными просветами + клинья Изуны)
    case MANGEKYO_PATTERNS.MADARA_EMS:
      return (
        <g fill="#050505">
          {/* Мощный внешний обруч по периметру */}
          <circle r="78" fill="none" stroke="#050505" strokeWidth="12" />
          <circle r="15" />
          <circle r="3.5" fill="#ffffff" filter="drop-shadow(0 0 4px #ff2a4b)" />

          {/* 3 петли Мадары с открытыми окнами радужки */}
          {[0, 120, 240].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <path
                fillRule="evenodd"
                d="M 0,-76 A 20 20 0 1 1 0,-36 A 20 20 0 1 1 0,-76 Z M 0,-66 A 9.5 9.5 0 1 0 0,-47 A 9.5 9.5 0 1 0 0,-66 Z"
              />
              <polygon points="-6,-14 6,-14 8,-38 -8,-38" />
            </g>
          ))}

          {/* 3 клина Изуны между петлями */}
          {[60, 180, 300].map((deg) => (
            <polygon key={`izuna-${deg}`} points="0,-14 8,-44 0,-76 -8,-44" transform={`rotate(${deg})`} />
          ))}
        </g>
      );

    // 3б. МАДАРА УЧИХА — МШ (3 замкнутые круговые петли со сквозными просветами радужки)
    case MANGEKYO_PATTERNS.MADARA_MS:
      return (
        <g fill="#050505">
          <circle r="14" />
          <circle r="3.5" fill="#ffffff" filter="drop-shadow(0 0 4px #ff2a4b)" />
          {[0, 120, 240].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <path
                fillRule="evenodd"
                d="M 0,-68 A 21 21 0 1 1 0,-26 A 21 21 0 1 1 0,-68 Z M 0,-57 A 10.5 10.5 0 1 0 0,-37 A 10.5 10.5 0 1 0 0,-57 Z"
              />
              <polygon points="-6,-14 6,-14 7,-28 -7,-28" />
            </g>
          ))}
        </g>
      );

    // 4. ОБИТО УЧИХА / КАКАШИ (Камуи — 3 хищных клыка-крюка воронки сингулярности)
    case MANGEKYO_PATTERNS.KAMUI:
      return (
        <g fill="#050505">
          <circle r="14" />
          <circle r="3.5" fill="#ffffff" filter="drop-shadow(0 0 4px #ff2a4b)" />
          {[0, 120, 240].map((deg) => (
            <path
              key={deg}
              d="M -5,-14 C -12,-36 -28,-58 -38,-78 C -8,-80 48,-66 70,-46 C 46,-34 24,-22 14,-5 Z"
              transform={`rotate(${deg})`}
              stroke="#180003"
              strokeWidth="0.8"
            />
          ))}
        </g>
      );

    // 5. ШИСУИ УЧИХА (Котоамацуками — 4-лопастной сюрикен абсолютного гендзюцу)
    case MANGEKYO_PATTERNS.SHISUI:
      return (
        <g fill="#050505">
          <circle r="14" />
          <circle r="3.5" fill="#ffffff" filter="drop-shadow(0 0 4px #ff2a4b)" />
          {[45, 135, 225, 315].map((deg) => (
            <path
              key={deg}
              d="M -6,-13 C 16,-32 54,-56 72,-52 C 48,-40 24,-24 13,-6 Z"
              transform={`rotate(${deg})`}
              stroke="#180003"
              strokeWidth="0.8"
            />
          ))}
        </g>
      );

    default:
      return null;
  }
};

/**
 * 3D Glass Marble Dōjutsu Orb Component
 */
export default function GlassSharinganOrb({
  pattern = MANGEKYO_PATTERNS.SASUKE_EMS,
  family = 'Sharingan',
  stageId = null,
  size = 280,
  rotation = 0,
  isSpinning = false,
  className = ''
}) {
  const stage = String(stageId || '').toLowerCase();
  const fam = String(family || '').toLowerCase();
  const pat = String(pattern || '').toLowerCase();

  const isRinneSharingan = (fam.includes('rinne') || stage.includes('rinne') || pat === 'rinne_sharingan' || pat === 'kaguya')
    && (pat === 'rinne_sharingan' || pat === 'kaguya' || stage === 'rinne_sharingan');

  const isSasukeMS = (fam.includes('sharingan') || !family || stage === 'mangekyo')
    && stage !== 'sharingan_1' && stage !== 'sharingan_2' && stage !== 'sharingan_3'
    && pat === MANGEKYO_PATTERNS.SASUKE_MS;

  // Цветовая гамма стромы в зависимости от семейства
  const isGold = fam.includes('kingan') || stage.includes('kingan');
  const isByakugan = (fam.includes('byakugan') || stage.includes('byakugan')) && stage !== 'byakugan_awakened';
  const isTenseigan = stage === 'byakugan_awakened';
  const isRinnegan = (fam.includes('rinne') || stage.includes('rinne')) && !isRinneSharingan;
  const isAoigan = fam.includes('aoigan') || stage.includes('aoigan');
  const isIkadzutigan = fam.includes('ikadzutigan') || stage.includes('ikadzutigan');

  const irisColorStops = isGold ? (
    <>
      <stop offset="0%" stopColor="#fffbeb" />
      <stop offset="25%" stopColor="#fde047" />
      <stop offset="55%" stopColor="#ca8a04" />
      <stop offset="78%" stopColor="#854d0e" />
      <stop offset="94%" stopColor="#451a03" />
      <stop offset="100%" stopColor="#1c0a00" />
    </>
  ) : isTenseigan ? (
    <>
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="20%" stopColor="#c8f9ff" />
      <stop offset="50%" stopColor="#00d4ff" />
      <stop offset="78%" stopColor="#0066cc" />
      <stop offset="95%" stopColor="#002666" />
      <stop offset="100%" stopColor="#000f2e" />
    </>
  ) : isByakugan ? (
    <>
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="25%" stopColor="#f8faff" />
      <stop offset="55%" stopColor="#dbeafe" />
      <stop offset="80%" stopColor="#bfdbfe" />
      <stop offset="95%" stopColor="#93c5fd" />
      <stop offset="100%" stopColor="#3b82f6" />
    </>
  ) : isRinnegan ? (
    <>
      <stop offset="0%" stopColor="#faf5ff" />
      <stop offset="25%" stopColor="#e9d5ff" />
      <stop offset="55%" stopColor="#c084fc" />
      <stop offset="78%" stopColor="#7e22ce" />
      <stop offset="94%" stopColor="#3b0764" />
      <stop offset="100%" stopColor="#140224" />
    </>
  ) : isAoigan ? (
    <>
      <stop offset="0%" stopColor="#ecfeff" />
      <stop offset="25%" stopColor="#22d3ee" />
      <stop offset="55%" stopColor="#0891b2" />
      <stop offset="80%" stopColor="#0e7490" />
      <stop offset="94%" stopColor="#155e75" />
      <stop offset="100%" stopColor="#042f2e" />
    </>
  ) : isIkadzutigan ? (
    <>
      <stop offset="0%" stopColor="#e0f2fe" />
      <stop offset="14%" stopColor="#38bdf8" />
      <stop offset="36%" stopColor="#9333ea" />
      <stop offset="68%" stopColor="#3b0764" />
      <stop offset="88%" stopColor="#150228" />
      <stop offset="100%" stopColor="#04000a" />
    </>
  ) : isSasukeMS ? (
    // Инвертированная строма Саске: темный обсидиан
    <>
      <stop offset="0%" stopColor="#220005" />
      <stop offset="35%" stopColor="#140003" />
      <stop offset="70%" stopColor="#090002" />
      <stop offset="95%" stopColor="#000000" />
      <stop offset="100%" stopColor="#000000" />
    </>
  ) : (
    // Рубиновый Шаринган и Алый Ринне-Шаринган (Кагуя/Мадара 9 томоэ)
    <>
      <stop offset="0%" stopColor="#ff2a38" />
      <stop offset="30%" stopColor="#e10617" />
      <stop offset="62%" stopColor="#9e000d" />
      <stop offset="84%" stopColor="#4c0005" />
      <stop offset="96%" stopColor="#180002" />
      <stop offset="100%" stopColor="#080001" />
    </>
  );

  const fiberColor = isGold ? '#fef08a' : (isByakugan ? '#ffffff' : (isRinnegan ? '#e9d5ff' : (isAoigan ? '#67e8f9' : (isIkadzutigan ? '#00ffff' : (isSasukeMS ? '#ff2a38' : '#ff4d58')))));
  const fresnelColor = isGold ? '#fef08a' : (isByakugan ? '#e0f2fe' : (isRinnegan ? '#d8b4fe' : (isAoigan ? '#a5f3fc' : (isIkadzutigan ? '#00ffff' : '#ff858e'))));

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="overflow-visible select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.98)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 1. Procedural Chakra Fibers (feTurbulence) */}
          <filter id="chakraTurbulence" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.08" numOctaves="3" seed="1337" result="noise" />
            <feColorMatrix
              type="matrix"
              values="
                0.33 0.33 0.33 0 0.55
                0.33 0.33 0.33 0 0.55
                0.33 0.33 0.33 0 0.55
                0    0    0    0 1"
              in="noise"
              result="monoNoise"
            />
            <feBlend mode="multiply" in="SourceGraphic" in2="monoNoise" result="blended" />
          </filter>

          {/* 2. Мягкое размытие блика софтбокса */}
          <filter id="softGlossBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>

          {/* 3. Горячий фокус блика */}
          <filter id="hotspotGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 4. Радиальный градиент радужки (с оффсетом под угол освещения) */}
          <radialGradient id="orbIrisBase" cx="38%" cy="32%" r="68%">
            {irisColorStops}
          </radialGradient>

          {/* 5. 3D Convex Lens Shading (Сферическая выпуклая линза cx=35%, cy=30%) */}
          <radialGradient id="sphereLensVolume" cx="35%" cy="30%" r="68%" fx="35%" fy="30%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isByakugan ? 0.35 : 0.4} />
            <stop offset="30%" stopColor={isGold ? '#fef08a' : (isAoigan ? '#22d3ee' : (isIkadzutigan ? '#a855f7' : '#ff404a'))} stopOpacity="0.08" />
            <stop offset="62%" stopColor={isGold ? '#713f12' : (isAoigan ? '#083344' : (isIkadzutigan ? '#3b0764' : '#450005'))} stopOpacity="0.28" />
            <stop offset="82%" stopColor="#000000" stopOpacity="0.75" />
            <stop offset="94%" stopColor="#000000" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#000000" stopOpacity="1" />
          </radialGradient>

          {/* 6. Rim Occlusion (Сферическая краевая виньетка) */}
          <radialGradient id="rimOcclusion" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#000000" stopOpacity="0" />
            <stop offset="85%" stopColor="#000000" stopOpacity="0.6" />
            <stop offset="96%" stopColor="#000000" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#000000" stopOpacity="1" />
          </radialGradient>

          {/* 7. Fresnel Rim Bounce (Контурный рефлекс Френеля на 4-5 часов) */}
          <linearGradient id="fresnelBounce" x1="100%" y1="100%" x2="55%" y2="55%">
            <stop offset="0%" stopColor={fresnelColor} stopOpacity="0.65" />
            <stop offset="16%" stopColor={fresnelColor} stopOpacity="0.35" />
            <stop offset="38%" stopColor={fresnelColor} stopOpacity="0.0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
          </linearGradient>

          {/* 8. Studio Glass Soft Reflection Arc (Изогнутый софтбокс-блик на 10-11 часов) */}
          <linearGradient id="studioReflectGrad" x1="0%" y1="0%" x2="80%" y2="80%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>

          {/* 9. Specular Hotspot Radial Glow */}
          <radialGradient id="hotspotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* 10. Тень парения узоров над дном */}
          <filter id="glassOrbBladeShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#000000" floodOpacity="0.92" />
          </filter>

          {/* 11. Неоновое циановое свечение молнии (Икадзутиган) */}
          <filter id="lightningGlowCyan" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 12. Фиолетовая плазменная аура Тесла */}
          <filter id="plasmaVioletGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 13. Раскаленное ядро шаровой плазмы Райдзина */}
          <radialGradient id="plasmaBallSingularity" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="28%" stopColor="#00ffff" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="85%" stopColor="#3b0764" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#050014" stopOpacity="0" />
          </radialGradient>

          {/* 14. Градиент лепестков Саске МШ: от глубокого карминового в центре к алому на кончиках */}
          <radialGradient id="sasukePetalGrad" cx="0" cy="0" r="83" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7a0000" />
            <stop offset="30%" stopColor="#8c0101" />
            <stop offset="70%" stopColor="#b20404" />
            <stop offset="100%" stopColor="#ba0505" />
          </radialGradient>

          {/* Master Circular Sphere Clip (r=88) */}
          <clipPath id="sphereClip">
            <circle cx="100" cy="100" r="88" />
          </clipPath>
        </defs>

        {/* ======================================================== */}
        {/* КЛИПИРОВАННОЕ СОДЕРЖИМОЕ СФЕРЫ                           */}
        {/* ======================================================== */}
        <g clipPath="url(#sphereClip)">
          {/* Layer 1: Подложка радужки с дымчатой структурой */}
          <circle cx="100" cy="100" r="88" fill="url(#orbIrisBase)" filter="url(#chakraTurbulence)" />

          {/* Layer 1b: Тонкие каноничные кольца разметки додзюцу и насечки шкалы фокуса (Anime Precision Rings) */}
          <circle cx="100" cy="100" r="54" fill="none" stroke="#000000" strokeWidth="0.8" opacity="0.22" />
          <circle cx="100" cy="100" r="76" fill="none" stroke="#000000" strokeWidth="0.8" opacity="0.18" />
          <g transform="translate(100, 100)" opacity="0.25">
            {Array.from({ length: 48 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1="-85"
                x2="0"
                y2={i % 4 === 0 ? "-79" : "-82"}
                stroke="#000000"
                strokeWidth={i % 4 === 0 ? "1.2" : "0.7"}
                transform={`rotate(${i * 7.5})`}
              />
            ))}
          </g>

          {/* Layer 2: Радиальные волокна стромы чакры */}
          <g transform="translate(100, 100)">
            <ChakraFiberWisps color={fiberColor} />
          </g>

          {/* Layer 3: Геометрический узор (DOUBLE-G CONTAINER: СТРОГОЕ ВРАЩЕНИЕ В ЦЕНТРЕ БЕЗ СМЕЩЕНИЙ!) */}
          <g transform="translate(100, 100)">
            <g filter="url(#glassOrbBladeShadow)">
              {isSpinning && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 0 0"
                  to="360 0 0"
                  dur="2.2s"
                  repeatCount="indefinite"
                />
              )}
              <OrbPatternRenderer pattern={pattern} family={family} stageId={stageId} />
            </g>
          </g>

          {/* Layer 4: 3D Convex Lens Shading (Преломление выпуклой линзы) */}
          <circle cx="100" cy="100" r="88" fill="url(#sphereLensVolume)" pointerEvents="none" />

          {/* Layer 5: Fresnel Edge Counter-Reflex (Контурный рефлекс на 4-5 часов) */}
          <circle cx="100" cy="100" r="88" fill="url(#fresnelBounce)" pointerEvents="none" />

          {/* Layer 6: Rim Occlusion Vignette (Глубокая краевая тень) */}
          <circle cx="100" cy="100" r="88" fill="url(#rimOcclusion)" pointerEvents="none" />

          {/* Layer 7: Studio Glass Soft Curved Reflection (Софтбокс на 10-11 часов) */}
          <path
            d="M 44,58 C 48,38 72,28 98,26 C 88,34 74,44 62,68 C 52,66 46,62 44,58 Z"
            fill="url(#studioReflectGrad)"
            filter="url(#softGlossBlur)"
            pointerEvents="none"
          />

          {/* Layer 8: Specular Hotspot (Ослепительный горячий фокус на ~10:30) */}
          <g transform="translate(74, 72)" filter="url(#hotspotGlowFilter)" pointerEvents="none">
            <circle cx="0" cy="0" r="14" fill="url(#hotspotGlow)" />
            <ellipse cx="0" cy="0" rx="4.8" ry="3.4" transform="rotate(-30)" fill="#ffffff" opacity="0.98" />
          </g>
        </g>

        {/* Тонкий внешний обод роговицы */}
        <circle cx="100" cy="100" r="88" fill="none" stroke="#050505" strokeWidth="2.5" opacity="0.95" />
      </svg>
    </div>
  );
}
