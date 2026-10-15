import React from 'react';

/**
 * 3D GLASS ORB / MARBLE SHADER FOR NARUTO DŌJUTSU
 * Эталонная реализация оптической 3D-сферы (Glass Orb) на основе анализа сетки 4x4.
 * Включает:
 * - Подповерхностное преломление (Convex Lens Shading)
 * - Дымчатую перисто-волокнистую строму чакры (feTurbulence + radial fibers)
 * - Краевую виньетку окклюзии (Rim Occlusion)
 * - Контурный рефлекс Френеля на 4-5 часов (Fresnel Rim Bounce)
 * - Фирменный глянцевый блик студийного софтбокса на 10-11 часов (Studio Softbox Reflection)
 * - Ослепительно-белый горячий фокус (Specular Hotspot)
 */

export const MANGEKYO_PATTERNS = {
  SASUKE_EMS: 'sasuke_ems',
  ITACHI: 'itachi',
  KAMUI: 'kamui',
  MADARA_EMS: 'madara_ems',
  MADARA_MS: 'madara_ms',
  SHISUI: 'shisui',
  SASUKE_MS: 'sasuke_ms',
  FUGAKU: 'fugaku',
  NAORI: 'naori',
  BARU: 'baru',
  NAKA: 'naka',
  IZUNA: 'izuna',
  RINNE_SHARINGAN: 'rinne_sharingan',
  GOLD_RINNE_SHARINGAN: 'gold_rinne_sharingan'
};

export const MANGEKYO_LIST = [
  { id: 'sasuke_ems', name: 'Саске (ВМШ)', owner: 'Саске Учиха', desc: 'Слияние прямой 6-конечной звезды Чоку-Томоэ Саске и лезвий Итачи. Вечный огонь Аматэрасу.' },
  { id: 'itachi', name: 'Итачи (МШ)', owner: 'Итачи Учиха', desc: '3 закрученных серпа мельницы. Пламя Аматэрасу и гендзюцу Цукуёми.' },
  { id: 'kamui', name: 'Камуи (Обито)', owner: 'Обито / Какаши', desc: '3 массивных хищных клыка-крюка. Искажение пространства-времени и телепортация в карманное измерение.' },
  { id: 'madara_ems', name: 'Мадара (ВМШ)', owner: 'Мадара Учиха', desc: 'Толстый внешний обруч, 3 петли с просветами радужки и клинья Изуны. Завершённое Сусаноо.' },
  { id: 'madara_ms', name: 'Мадара (МШ)', owner: 'Мадара Учиха', desc: '3 замкнутых кольца томоэ вокруг ядра сингулярности.' },
  { id: 'shisui', name: 'Шисуи (Кото)', owner: 'Шисуи Учиха', desc: '4-лопастной стремительный сюрикен. Котоамацуками — абсолютное подчинение разума без осознания жертвы.' },
  { id: 'sasuke_ms', name: 'Саске (МШ)', owner: 'Саске Учиха', desc: '6-конечная прямая звезда Чоку-Томоэ. Контроль формы черного пламени Энтон: Кагуцути.' },
  { id: 'fugaku', name: 'Фугаку (Спираль)', owner: 'Фугаку Учиха', desc: '12 закручивающихся спиральных рукавов гипнотического водоворота.' },
  { id: 'naori', name: 'Наори (Идзанами)', owner: 'Наори Учиха', desc: 'Трилистник с круглыми вырезами чакры. Священная петля судьбы Идзанами.' },
  { id: 'baru', name: 'Бару (Крест)', owner: 'Бару Учиха', desc: 'Монолитный закруглённый крест власти клана Учиха.' },
  { id: 'naka', name: 'Нака (Клевер)', owner: 'Нака Учиха', desc: '4-лепестковый диагональный клевер Идзанаги.' },
  { id: 'izuna', name: 'Изуна (Клинки)', owner: 'Изуна Учиха', desc: '3 сегментированных клинка-бруска с выемками.' },
  { id: 'rinne_sharingan', name: 'Ринне-Шаринган', owner: 'Кагуя / Мадара', desc: 'Красное око прародительницы. 4 кольца и 9 томоэ Бесконечного Цукуёми.' },
  { id: 'gold_rinne_sharingan', name: 'Золотой Риннеган', owner: 'Ооцуцуки', desc: 'Божественное золотое сияние превосходства клана Ооцуцуки.' }
];

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
  // 1. БЬЯКУГАН
  if (family === 'Byakugan') {
    if (stageId === 'byakugan_awakened') {
      return (
        <g>
          <polygon points="0,-82 14,-16 82,0 14,16 0,82 -14,16 -82,0 -14,-16" fill="#ffffff" opacity="0.85" filter="drop-shadow(0 0 10px #38bdf8)" />
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 45})`}>
              <path d="M 0 0 C 10 -16, 14 -35, 0 -50 C -14 -35, -10 -16, 0 0 Z" fill="#ffffff" stroke="#0284c7" strokeWidth="1.2" opacity="0.95" />
              <circle cy="-32" r="3" fill="#06b6d4" />
            </g>
          ))}
          <circle r="7" fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff)" />
        </g>
      );
    }
    return (
      <g>
        <circle r="68" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 4" opacity="0.75" />
        <circle r="46" fill="none" stroke="#93c5fd" strokeWidth="1.8" opacity="0.85" />
        <circle r="26" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.9" />
        {/* Багуа Инь-Ян центр */}
        <circle r="14" fill="#ffffff" stroke="#0284c7" strokeWidth="1.2" />
        <path d="M 0 -14 A 14 14 0 0 1 0 14 A 7 7 0 0 1 0 0 A 7 7 0 0 0 0 -14 Z" fill="#0284c7" />
        <circle cy="-7" r="2.5" fill="#ffffff" />
        <circle cy="7" r="2.5" fill="#0284c7" />
      </g>
    );
  }

  // 2. РИННЕГАН
  if (family === 'Rinnegan' && pattern !== 'rinne_sharingan' && pattern !== 'gold_rinne_sharingan') {
    const isSasukeAwakened = stageId === 'rinnegan_awakened';
    return (
      <g>
        <circle r="78" fill="none" stroke="#2e1065" strokeWidth="2.8" />
        <circle r="62" fill="none" stroke="#3b0764" strokeWidth="2.8" />
        <circle r="46" fill="none" stroke="#2e1065" strokeWidth="2.8" />
        <circle r="30" fill="none" stroke="#3b0764" strokeWidth="2.8" />
        <circle r="14" fill="#1e0538" stroke="#a855f7" strokeWidth="1.5" />
        <circle r="5" fill="#ffffff" filter="drop-shadow(0 0 4px #c084fc)" />

        {/* 6 томоэ Саске */}
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

  // 3. БАЗОВЫЙ ШАРИНГАН (1, 2, 3 ТОМОЭ)
  if (stageId === 'sharingan_1' || stageId === 'sharingan_2' || stageId === 'sharingan_3') {
    const tomoeCount = stageId === 'sharingan_1' ? 1 : (stageId === 'sharingan_2' ? 2 : 3);
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

  // 4. МАНГЁКЁ ШАРИНГАН (ВСЕ 14 КАНОНИЧНЫХ ФОРМ)
  switch (pattern) {
    case MANGEKYO_PATTERNS.ITACHI:
      return (
        <g fill="#050505">
          <circle r="14" />
          <circle r="4" fill="#ffffff" filter="drop-shadow(0 0 4px #ff2a4b)" />
          {[0, 120, 240].map((deg) => (
            <path
              key={deg}
              d="M -6,-13 C 14,-32 50,-52 42,-74 C 24,-54 8,-34 12,-8 Z"
              transform={`rotate(${deg})`}
              stroke="#180003"
              strokeWidth="0.8"
            />
          ))}
        </g>
      );

    case MANGEKYO_PATTERNS.KAMUI:
      return (
        <g fill="#050505">
          <circle r="15" />
          <circle r="4.5" fill="#ffffff" filter="drop-shadow(0 0 4px #ff2a4b)" />
          {[0, 120, 240].map((deg) => (
            <path
              key={deg}
              d="M -4,-15 C -12,-38 -22,-62 -30,-78 A 84 84 0 0 1 68,-50 C 42,-38 20,-24 15,-5 Z"
              transform={`rotate(${deg})`}
              stroke="#180003"
              strokeWidth="0.8"
            />
          ))}
        </g>
      );

    case MANGEKYO_PATTERNS.SASUKE_EMS:
      return (
        <g fill="#050505">
          {/* 6-конечная прямая звезда Чоку-Томоэ Саске */}
          <path d="M 0,-80 L 15,-26 L 69.3,-40 L 30,0 L 69.3,40 L 15,26 L 0,80 L -15,26 L -69.3,40 L -30,0 L -69.3,-40 L -15,-26 Z" />
          {/* 3 серпа мельницы Итачи в промежутках */}
          {[30, 150, 270].map((deg) => (
            <path
              key={deg}
              d="M -6,-13 C 14,-32 50,-52 42,-74 C 24,-54 8,-34 12,-8 Z"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r="14" />
          <circle r="4" fill="#ffffff" filter="drop-shadow(0 0 4px #ff2a4b)" />
        </g>
      );

    case MANGEKYO_PATTERNS.MADARA_EMS:
      return (
        <g fill="#050505">
          {/* Внешний обруч */}
          <circle r="77" fill="none" stroke="#050505" strokeWidth="13" />
          <circle r="16" />
          <circle r="4.5" fill="#ffffff" filter="drop-shadow(0 0 4px #ff2a4b)" />
          {/* 3 петли с красными окнами Мадары */}
          {[0, 120, 240].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <path d="M 0,-16 C 24,-16 65,-40 68,-77 C 48,-64 24,-38 14,-8 Z" />
              <circle cy="-77" r="14" fill="#050505" />
              <circle cy="-77" r="6" fill="url(#orbIrisBase)" />
            </g>
          ))}
          {/* 3 клина Изуны */}
          {[60, 180, 300].map((deg) => (
            <polygon key={`izuna-${deg}`} points="0,0 9,-32 0,-76 -9,-32" transform={`rotate(${deg})`} />
          ))}
        </g>
      );

    case MANGEKYO_PATTERNS.MADARA_MS:
      return (
        <g fill="#050505" fillRule="evenodd">
          <circle r="16" />
          <circle r="4.5" fill="#ffffff" filter="drop-shadow(0 0 4px #ff2a4b)" />
          {[0, 120, 240].map((deg) => (
            <path
              key={deg}
              d="M -7,-14 C -16,-28 -22,-44 0,-62 C 22,-44 16,-28 7,-14 Z M 0,-28 C -7,-36 -7,-48 0,-52 C 7,-48 7,-36 0,-28 Z"
              transform={`rotate(${deg})`}
            />
          ))}
        </g>
      );

    case MANGEKYO_PATTERNS.SHISUI:
      return (
        <g fill="#050505">
          <circle r="14" />
          <circle r="4" fill="#ffffff" filter="drop-shadow(0 0 4px #ff2a4b)" />
          {[0, 90, 180, 270].map((deg) => (
            <path
              key={deg}
              d="M -5,-13 C 14,-32 50,-56 68,-52 C 46,-40 22,-24 12,-7 Z"
              transform={`rotate(${deg})`}
              stroke="#180003"
              strokeWidth="0.8"
            />
          ))}
        </g>
      );

    case MANGEKYO_PATTERNS.SASUKE_MS:
      return (
        <g fill="#050505">
          <path d="M 0,-82 L 14,-24 L 71,-41 L 28,0 L 71,41 L 14,24 L 0,82 L -14,24 L -71,41 L -28,0 L -71,-41 L -14,-24 Z" />
          <circle r="14" />
          <circle r="4.2" fill="#ffffff" filter="drop-shadow(0 0 4px #ff2a4b)" />
        </g>
      );

    case MANGEKYO_PATTERNS.FUGAKU:
      return (
        <g fill="#050505">
          <circle r="18" />
          <circle r="25" fill="none" stroke="#050505" strokeWidth="2.5" />
          <circle r="4.5" fill="#ffffff" filter="drop-shadow(0 0 4px #ff2a4b)" />
          {Array.from({ length: 12 }).map((_, idx) => (
            <path
              key={idx}
              d="M 24,0 C 35,22 45,55 49.3,70.4 A 86 86 0 0 1 32.2,79.7 C 32,60 26,30 23.4,5.4 Z"
              transform={`rotate(${idx * 30})`}
            />
          ))}
        </g>
      );

    case MANGEKYO_PATTERNS.NAORI:
      return (
        <g fill="#050505">
          <circle r="16" />
          <circle r="4" fill="#ffffff" filter="drop-shadow(0 0 4px #ff2a4b)" />
          {[0, 120, 240].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <path d="M -10,-14 C -30,-35 -38,-65 0,-76 C 38,-65 30,-35 10,-14 Z" />
              <circle cy="-48" r="6" fill="url(#orbIrisBase)" />
            </g>
          ))}
          {[60, 180, 300].map((deg) => (
            <polygon key={deg} points="-6,-42 0,-84 6,-42" transform={`rotate(${deg})`} />
          ))}
        </g>
      );

    case MANGEKYO_PATTERNS.BARU:
      return (
        <g fill="#050505">
          <rect x="-14" y="-80" width="28" height="160" rx="14" />
          <rect x="-80" y="-14" width="160" height="28" rx="14" />
          <circle r="14" />
          <circle r="4" fill="#ffffff" filter="drop-shadow(0 0 4px #ff2a4b)" />
        </g>
      );

    case MANGEKYO_PATTERNS.NAKA:
      return (
        <g fill="#050505" transform="rotate(45)">
          <rect x="-16" y="-78" width="32" height="156" rx="16" />
          <rect x="-78" y="-16" width="156" height="32" rx="16" />
          <circle r="14" />
          <circle r="4" fill="#ffffff" filter="drop-shadow(0 0 4px #ff2a4b)" />
        </g>
      );

    case MANGEKYO_PATTERNS.IZUNA:
      return (
        <g fill="#050505">
          <circle r="14" />
          <circle r="4" fill="#ffffff" filter="drop-shadow(0 0 4px #ff2a4b)" />
          {[0, 120, 240].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              <path d="M -7 -14 L -13 -76 C -5 -84, 5 -84, 13 -76 L 7 -14 Z" />
              <line x1="0" y1="-14" x2="0" y2="-76" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" />
              <circle cy="-66" r="3" fill="#ffffff" />
            </g>
          ))}
        </g>
      );

    case MANGEKYO_PATTERNS.RINNE_SHARINGAN:
    case MANGEKYO_PATTERNS.GOLD_RINNE_SHARINGAN:
      return (
        <g>
          <circle r="78" fill="none" stroke="#050505" strokeWidth="2.8" />
          <circle r="60" fill="none" stroke="#050505" strokeWidth="2.8" />
          <circle r="42" fill="none" stroke="#050505" strokeWidth="2.8" />
          <circle r="24" fill="none" stroke="#050505" strokeWidth="2.8" />
          <circle r="10" fill="#050505" />
          <circle r="3.5" fill="#ffffff" filter="drop-shadow(0 0 3px #ffffff)" />

          {/* 9 Томоэ: 3 кольца по 3 томоэ */}
          {[0, 120, 240].map(deg => (
            <g key={`r1-${deg}`} transform={`rotate(${deg})`}>
              <g transform="translate(0, -42) scale(0.65)">
                <circle r="7" fill="#050505" />
                <path d="M -6 0 C -6 -9, 3 -12, 7 -19 C 5 -12, 2 -7, 0 -4 Z" fill="#050505" />
                <circle r="2" fill="#ffffff" />
              </g>
            </g>
          ))}
          {[60, 180, 300].map(deg => (
            <g key={`r2-${deg}`} transform={`rotate(${deg})`}>
              <g transform="translate(0, -60) scale(0.65)">
                <circle r="7" fill="#050505" />
                <path d="M -6 0 C -6 -9, 3 -12, 7 -19 C 5 -12, 2 -7, 0 -4 Z" fill="#050505" />
                <circle r="2" fill="#ffffff" />
              </g>
            </g>
          ))}
          {[0, 120, 240].map(deg => (
            <g key={`r3-${deg}`} transform={`rotate(${deg})`}>
              <g transform="translate(0, -78) scale(0.65)">
                <circle r="7" fill="#050505" />
                <path d="M -6 0 C -6 -9, 3 -12, 7 -19 C 5 -12, 2 -7, 0 -4 Z" fill="#050505" />
                <circle r="2" fill="#ffffff" />
              </g>
            </g>
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
  // Цветовая гамма стромы в зависимости от семейства
  const isGold = pattern === MANGEKYO_PATTERNS.GOLD_RINNE_SHARINGAN || family === 'Kingan';
  const isByakugan = family === 'Byakugan';
  const isRinnegan = family === 'Rinnegan' && pattern !== 'rinne_sharingan' && pattern !== 'gold_rinne_sharingan';
  const isAoigan = family === 'Aoigan';
  const isIkadzutigan = family === 'Ikadzutigan';

  const irisColorStops = isGold ? (
    <>
      <stop offset="0%" stopColor="#fffbeb" />
      <stop offset="25%" stopColor="#fef08a" />
      <stop offset="55%" stopColor="#eab308" />
      <stop offset="78%" stopColor="#a16207" />
      <stop offset="94%" stopColor="#451a03" />
      <stop offset="100%" stopColor="#1c0a00" />
    </>
  ) : isByakugan ? (
    <>
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="30%" stopColor="#f0f9ff" />
      <stop offset="60%" stopColor="#bae6fd" />
      <stop offset="82%" stopColor="#7dd3fc" />
      <stop offset="95%" stopColor="#38bdf8" />
      <stop offset="100%" stopColor="#0369a1" />
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
      <stop offset="30%" stopColor="#67e8f9" />
      <stop offset="65%" stopColor="#06b6d4" />
      <stop offset="85%" stopColor="#0e7490" />
      <stop offset="100%" stopColor="#083344" />
    </>
  ) : isIkadzutigan ? (
    <>
      <stop offset="0%" stopColor="#f0f9ff" />
      <stop offset="30%" stopColor="#7dd3fc" />
      <stop offset="65%" stopColor="#0284c7" />
      <stop offset="85%" stopColor="#075985" />
      <stop offset="100%" stopColor="#082f49" />
    </>
  ) : (
    // Рубиновый Шаринган по эталону
    <>
      <stop offset="0%" stopColor="#ff2a38" />
      <stop offset="30%" stopColor="#e10617" />
      <stop offset="62%" stopColor="#9e000d" />
      <stop offset="84%" stopColor="#4c0005" />
      <stop offset="96%" stopColor="#180002" />
      <stop offset="100%" stopColor="#080001" />
    </>
  );

  const fiberColor = isGold ? '#fef08a' : (isByakugan ? '#ffffff' : (isRinnegan ? '#e9d5ff' : (isAoigan ? '#67e8f9' : '#ff4d58')));
  const fresnelColor = isGold ? '#fef08a' : (isByakugan ? '#e0f2fe' : (isRinnegan ? '#d8b4fe' : '#ff858e'));

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
                1 0 0 0 0.85
                0 0 0 0 0.03
                0 0 0 0 0.06
                0 0 0 0.42 0"
              in="noise"
              result="coloredNoise"
            />
            <feBlend mode="multiply" in="SourceGraphic" in2="coloredNoise" result="blended" />
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
            <stop offset="30%" stopColor="#ff404a" stopOpacity="0.08" />
            <stop offset="62%" stopColor="#450005" stopOpacity="0.28" />
            <stop offset="82%" stopColor="#1a0002" stopOpacity="0.75" />
            <stop offset="94%" stopColor="#0a0001" stopOpacity="0.95" />
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
            <stop offset="38%" stopColor="#ff0014" stopOpacity="0.0" />
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

          {/* Layer 2: Радиальные волокна стромы чакры */}
          <g transform="translate(100, 100)">
            <ChakraFiberWisps color={fiberColor} />
          </g>

          {/* Layer 3: Геометрический узор (с вращением и тенью парения) */}
          <g
            transform={`translate(100, 100) rotate(${rotation})`}
            filter="url(#glassOrbBladeShadow)"
            className={isSpinning ? 'animate-spin' : ''}
            style={{ transformOrigin: '0px 0px', animationDuration: isSpinning ? '2s' : '9s' }}
          >
            <OrbPatternRenderer pattern={pattern} family={family} stageId={stageId} />
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
