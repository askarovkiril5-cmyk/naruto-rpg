import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Eye, Zap, Flame, Sparkles, Volume2, Check, Moon, Shield
} from 'lucide-react';
import { audioManager } from '../utils/audioManager';
import { DOJUTSU_OPTIONS, getDojutsuById } from '../data/dojutsuData';

/**
 * DOJUTSU_FAMILIES_META
 * Каталог семейств глаз, всех их ступеней (1, 2, 3 и Пробуждённая) с точным числом элементов.
 */
export const DOJUTSU_FAMILIES_META = {
  Sharingan: {
    family: 'Sharingan',
    name: 'Шаринган',
    kanji: '写輪眼',
    color: '#ef4444',
    veinColor: '#ff1744',
    lightningColor: '#ff2a4b',
    bgAura: 'rgba(239, 68, 68, 0.55)',
    desc: 'Додзюцу клана Учиха. Читает движения, копирует техники, накладывает иллюзии и открывает врата Сусаноо.',
    stages: [
      { id: 'sharingan_1', label: '1 томоэ', stageNum: 1, badge: 'Пробуждение', desc: '1 томоэ. Базовое чтение движений и видение чакры.' },
      { id: 'sharingan_2', label: '2 томоэ', stageNum: 2, badge: 'Копирование', desc: '2 томоэ под 180°. Копирование стихийных техник D–B ранга.' },
      { id: 'sharingan_3', label: '3 томоэ', stageNum: 3, badge: 'Отмена внезапности', desc: 'Ровно 3 томоэ (0°, 120°, 240°). Полная отмена 1 скрытой атаки.' },
      { id: 'mangekyo', label: 'Вечный Мангёкё (ВМШ)', stageNum: 'awakened', badge: 'Абсолют Учиха', desc: 'Пробуждённая форма. Без риска слепоты. Аматерасу, Цукуёми, Камуи и Сусаноо.' }
    ]
  },
  Byakugan: {
    family: 'Byakugan',
    name: 'Бьякуган',
    kanji: '白眼',
    color: '#93c5fd',
    veinColor: '#60a5fa',
    lightningColor: '#93c5fd',
    bgAura: 'rgba(147, 197, 253, 0.55)',
    desc: 'Священное всевидящее око клана Хьюга. Круговой обзор 360°, видение 361 узла Тэнкэцу и поле Багуа 64 ладоней.',
    stages: [
      { id: 'byakugan_1', label: '1 этап (Базовый)', stageNum: 1, badge: 'Обзор 360°', desc: '1 фокусное кольцо. Первичные пульсирующие вены висков, круговой обзор 360°.' },
      { id: 'byakugan_2', label: '2 этап (Тэнкецу)', stageNum: 2, badge: '361 узел чакры', desc: '2 кольца глубины. Проявление сияющих узлов Тэнкэцу и нитей кейракукей.' },
      { id: 'byakugan_3', label: '3 этап (Багуа 360°)', stageNum: 3, badge: '64 ладони Багуа', desc: 'Ровно 3 кольца Багуа! 8 Триграмм И-Цзин, символ Тайцзи Инь-Ян и поле 64 ладоней.' },
      { id: 'byakugan_awakened', label: 'Всеведущий взор', stageNum: 'awakened', badge: 'Тэнсэйган / Небесный', desc: 'Пробуждённая божественная форма. 8-лепестковый цветок чакры Хамуры, сенсорика всей арены.' }
    ]
  },
  Rinnegan: {
    family: 'Rinnegan',
    name: 'Риннеган',
    kanji: '輪廻眼',
    color: '#c084fc',
    veinColor: '#a855f7',
    lightningColor: '#d8b4fe',
    bgAura: 'rgba(192, 132, 252, 0.55)',
    desc: 'Око Мудреца Шести Путей. Полный контроль гравитации, притяжения, отталкивания и поглощения чакры.',
    stages: [
      { id: 'rinnegan', label: 'Шесть Путей', stageNum: 3, badge: 'Гравитация', desc: '6 концентрических фиолетовых колец Шести Путей. Синра Тэнсэй и Тибаку Тэнсэй.' },
      { id: 'rinnegan_awakened', label: 'Пробуждённый', stageNum: 'awakened', badge: 'Саске & Кагуя', desc: 'Высшая форма: Риннеган Саске (6 томоэ) / Ринне-Шаринган Кагуи (9 томоэ).' }
    ]
  },
  Kingan: {
    family: 'Kingan',
    name: 'Кинган',
    kanji: '金眼',
    color: '#facc15',
    veinColor: '#eab308',
    lightningColor: '#fef08a',
    bgAura: 'rgba(250, 204, 21, 0.55)',
    desc: 'Золотое рассекающее око. Находит швы чакры в технике оппонента и разрушает ее в момент формирования.',
    stages: [
      { id: 'kingan_1', label: '1 кольцо', stageNum: 1, badge: 'Калибровка', desc: '1 золотое кольцо. Калибровка оптического фокуса на чакре врага.' },
      { id: 'kingan_2', label: '2 кольца', stageNum: 2, badge: 'Анализ швов', desc: '2 концентрических золотых кольца. Видение слабых мест в чужих дзюцу.' },
      { id: 'kingan_3', label: '3 кольца', stageNum: 3, badge: 'Рассечение', desc: 'Ровно 3 золотых кольца с клинописными рунами печатей. Моментальный разрыв связок.' },
      { id: 'kingan_awakened', label: 'Печать разрушения', stageNum: 'awakened', badge: 'Золотой Суверен', desc: 'Пробуждённая октагональная призма. 4 перекрестных лазера полного уничтожения техник.' }
    ]
  },
  Aoigan: {
    family: 'Aoigan',
    name: 'Аойган',
    kanji: '青眼',
    color: '#06b6d4',
    veinColor: '#0891b2',
    lightningColor: '#67e8f9',
    bgAura: 'rgba(6, 182, 212, 0.55)',
    desc: 'Лазурное око клана Синкай. Водное ускорение синапсов, гидродинамическая реакция и доспех глубин.',
    stages: [
      { id: 'aoigan_1', label: '1 капля', stageNum: 1, badge: 'Ускорение +10%', desc: 'Ровно 1 лазурная капля (0°). Начальный разгон нервной проводимости.' },
      { id: 'aoigan_2', label: '2 капли', stageNum: 2, badge: 'Ускорение +20%', desc: 'Ровно 2 капли под 180°. Гидродинамическое восприятие встречных атак.' },
      { id: 'aoigan_3', label: '3 капли', stageNum: 3, badge: 'Ускорение +30%', desc: 'Ровно 3 капли (0°, 120°, 240°)! Сжатый водоворот максимальной скорости.' },
      { id: 'aoigan_awakened', label: 'Глубинная Бездна', stageNum: 'awakened', badge: 'Гёрин но Ёрой', desc: 'Пробуждённый сапфировый океан. Чешуйчатые лепестки брони глубин и сверхзвуковой вихрь.' }
    ]
  },
  Ikadzutigan: {
    family: 'Ikadzutigan',
    name: 'Икадзутиган',
    kanji: '雷眼',
    color: '#38bdf8',
    veinColor: '#0284c7',
    lightningColor: '#7dd3fc',
    bgAura: 'rgba(56, 189, 248, 0.55)',
    desc: 'Громовое око клана Тэнрай. Дуговые разряды Тесла, ионная реакция и абсолютное владение молнией Райдзина.',
    stages: [
      { id: 'ikadzutigan_1', label: '1 разряд', stageNum: 1, badge: 'Статика +10%', desc: 'Ровно 1 громовой разряд (0°). Электростимуляция глазных нервов.' },
      { id: 'ikadzutigan_2', label: '2 разряда', stageNum: 2, badge: 'Ионный ток +20%', desc: 'Ровно 2 разряда под 180°. Дуговой контур предвидения траекторий.' },
      { id: 'ikadzutigan_3', label: '3 разряда', stageNum: 3, badge: 'Дуга Тесла +28%', desc: 'Ровно 3 громовых разряда (0°, 120°, 240°)! Каскад высокочастотного напряжения.' },
      { id: 'ikadzutigan_awakened', label: 'Божественная Молния', stageNum: 'awakened', badge: 'Курорайтон', desc: 'Пробуждённая сфера плазмы Райдзина. Ветвящаяся чёрная молния Курорайтон.' }
    ]
  }
};

/**
 * Определение семейства глаза по ID или имени
 */
export function resolveDojutsuFamily(eyeId = '') {
  const s = String(eyeId || '').toLowerCase();
  if (s.includes('byakugan') || s.includes('бьякуган') || s.includes('всеведущ')) return 'Byakugan';
  if (s.includes('rinne') || s.includes('ринне')) return 'Rinnegan';
  if (s.includes('kingan') || s.includes('кинган')) return 'Kingan';
  if (s.includes('aoigan') || s.includes('аойган') || s.includes('синкай')) return 'Aoigan';
  if (s.includes('ikadzutigan') || s.includes('икадзутиган') || s.includes('тэнрай')) return 'Ikadzutigan';
  return 'Sharingan';
}

export default function EyeActivationOverlay({
  isOpen,
  onClose,
  dojutsuId = 'mangekyo',
  opponentName = null,
  onShowToOpponent = null,
  autoDismissMs = 0
}) {
  const [currentEyeId, setCurrentEyeId] = useState(dojutsuId);
  // Для ВМШ: 'sasuke' | 'itachi' | 'madara' | 'kamui' | 'shisui'
  const [selectedPattern, setSelectedPattern] = useState('sasuke');
  // Для Пробуждённого Риннегана: 'sasuke' (6 томоэ Саске) | 'kaguya' (9 томоэ Кагуи / Мадары)
  const [selectedRinnePattern, setSelectedRinnePattern] = useState('sasuke');
  
  const [isSpinning, setIsSpinning] = useState(true);
  const [isSurging, setIsSurging] = useState(false);
  const [showDemonstrateNotice, setShowDemonstrateNotice] = useState(false);
  const [alwaysShowToOpponent, setAlwaysShowToOpponent] = useState(() => {
    return localStorage.getItem('naruto_always_show_eye_opponent') === 'true';
  });

  const containerRef = useRef(null);

  // Синхронизация при открытии
  useEffect(() => {
    if (isOpen) {
      setCurrentEyeId(dojutsuId);
    }
  }, [isOpen, dojutsuId]);

  const familyKey = resolveDojutsuFamily(currentEyeId);
  const familyMeta = DOJUTSU_FAMILIES_META[familyKey] || DOJUTSU_FAMILIES_META.Sharingan;
  const dojutsuData = getDojutsuById(currentEyeId) || DOJUTSU_OPTIONS.find(d => d.id === currentEyeId) || DOJUTSU_OPTIONS[3];

  // Звук и 3D импульс при смене формы или узора
  const triggerActivation = (eyeIdToPlay, subPat = null) => {
    setIsSpinning(true);
    setIsSurging(true);
    
    const activePat = subPat !== null ? subPat : (familyKey === 'Rinnegan' ? selectedRinnePattern : selectedPattern);
    audioManager.playEyeSound(eyeIdToPlay, familyKey, activePat);

    const spinTimer = setTimeout(() => setIsSpinning(false), 2400);
    const surgeTimer = setTimeout(() => setIsSurging(false), 520);

    return () => {
      clearTimeout(spinTimer);
      clearTimeout(surgeTimer);
    };
  };

  useEffect(() => {
    if (!isOpen) return;

    const cleanup = triggerActivation(currentEyeId);

    let dismissTimer = null;
    if (autoDismissMs > 0) {
      dismissTimer = setTimeout(() => {
        onClose?.();
      }, autoDismissMs);
    }

    return () => {
      cleanup();
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [isOpen, currentEyeId, autoDismissMs]);

  if (!isOpen) return null;

  // Смена ступени
  const handleSelectStage = (stageId) => {
    setCurrentEyeId(stageId);
    triggerActivation(stageId);
  };

  // Тумблер сохранения
  const handleToggleAlwaysShow = () => {
    const next = !alwaysShowToOpponent;
    setAlwaysShowToOpponent(next);
    try {
      localStorage.setItem('naruto_always_show_eye_opponent', next ? 'true' : 'false');
    } catch (e) {}
  };

  // Демонстрация сопернику
  const handleDemonstrate = () => {
    if (onShowToOpponent) {
      const activePat = familyKey === 'Rinnegan' ? selectedRinnePattern : selectedPattern;
      onShowToOpponent({
        dojutsuId: currentEyeId,
        dojutsuName: dojutsuData?.name || familyMeta.name,
        pattern: activePat,
        family: familyKey
      });
      setShowDemonstrateNotice(true);
      setTimeout(() => setShowDemonstrateNotice(false), 2600);
    }
  };

  const isAwakened = currentEyeId.includes('awakened') || currentEyeId === 'mangekyo';
  const CX = 170;
  const CY = 160;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none animate-in fade-in duration-300"
      style={{ 
        background: `radial-gradient(circle at center, ${familyMeta.bgAura} 0%, rgba(8,10,14,0.96) 55%, #030406 100%)` 
      }}
    >
      {/* CSS-стили кинематографичного 3D-парения и органических эффектов */}
      <style>{`
        @keyframes eyeFloat3D {
          0%, 100% {
            transform: translateZ(0px) rotateX(1.8deg) rotateY(-1.2deg);
          }
          50% {
            transform: translateZ(26px) rotateX(-1.5deg) rotateY(1.8deg);
          }
        }
        @keyframes chakraOrbital1 {
          0% { transform: translateZ(35px) rotateX(65deg) rotateY(15deg) rotateZ(0deg); }
          100% { transform: translateZ(35px) rotateX(65deg) rotateY(15deg) rotateZ(360deg); }
        }
        @keyframes chakraOrbital2 {
          0% { transform: translateZ(-25px) rotateX(-55deg) rotateY(-20deg) rotateZ(0deg); }
          100% { transform: translateZ(-25px) rotateX(-55deg) rotateY(-20deg) rotateZ(-360deg); }
        }
        @keyframes veinHeartbeatPulse {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); filter: drop-shadow(0 0 10px #ff1744); }
        }
        @keyframes lightningFlicker {
          0%, 100% { opacity: 0.9; stroke-dashoffset: 0; }
          25% { opacity: 0.3; }
          50% { opacity: 1; filter: drop-shadow(0 0 10px #ff3366); }
          75% { opacity: 0.4; }
        }
        @keyframes emberDrift {
          0% { transform: translate(0, 0) scale(0.8); opacity: 0; }
          40% { opacity: 0.9; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1.3); opacity: 0; }
        }
      `}</style>

      {/* 3D Атмосферные световые столбы и ореолы */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full blur-[140px] opacity-40 transition-all duration-700"
          style={{ backgroundColor: familyMeta.color }}
        />
        {isAwakened && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.09)_0%,transparent_70%)] animate-pulse" />
        )}

        {/* Парящие угли чакры (Embers VFX) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const tx = (i % 2 === 0 ? 1 : -1) * (30 + (i * 18));
          const ty = -60 - (i * 22);
          const left = 35 + ((i * 7) % 35);
          const top = 50 + ((i * 5) % 30);
          return (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                backgroundColor: familyMeta.color,
                boxShadow: `0 0 8px ${familyMeta.color}`,
                animation: `emberDrift ${3 + (i % 3)}s infinite ease-out ${i * 0.4}s`,
                '--tx': `${tx}px`,
                '--ty': `${ty}px`
              }}
            />
          );
        })}
      </div>

      {/* Верхняя шапка: Заголовок и кнопка закрытия */}
      <div className="absolute top-3 inset-x-3 sm:inset-x-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-black/80 border border-white/20 text-xs font-mono font-bold text-zinc-100 backdrop-blur-md flex items-center gap-2.5 shadow-2xl">
            <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: familyMeta.color }} />
            <span>{opponentName ? `👁️ ДЕМОНСТРАЦИЯ СОПЕРНИКА: ${opponentName}` : `👁️ ВЕЛИКОЕ ДОДЗЮЦУ: ${familyMeta.name.toUpperCase()}`}</span>
            {isAwakened && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/50 text-[10px] text-amber-300 animate-pulse font-black">
                {currentEyeId === 'rinnegan_awakened' ? (selectedRinnePattern === 'sasuke' ? 'САСКЕ (6 ТОМОЭ)' : 'КАГУЯ (9 ТОМОЭ)') : 'ВЫСШАЯ ФОРМА'}
              </span>
            )}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2.5 rounded-full bg-black/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/20 transition cursor-pointer backdrop-blur-md shadow-xl hover:scale-105 active:scale-95"
          title="Закрыть демонстрацию"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* ГЛАВНЫЙ 3D КОНТЕЙНЕР (Чистый прямой мистический взор без слежения за мышью) */}
      <div 
        ref={containerRef}
        className="relative flex flex-col items-center max-w-2xl w-full z-20 text-center px-2 py-3"
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        
        {/* Парящий кандзи на заднем плане (в 3D глубине) */}
        <div 
          className="text-8xl sm:text-9xl font-black font-serif opacity-15 tracking-widest absolute -top-12 sm:-top-16 pointer-events-none select-none transition-all duration-700"
          style={{ 
            color: familyMeta.color,
            transform: 'translateZ(-95px)'
          }}
        >
          {familyMeta.kanji}
        </div>

        {/* ПЕРЕКЛЮЧАТЕЛЬ СТУПЕНЕЙ ГЛАЗА (1, 2, 3 и Пробуждённая) */}
        <div className="relative z-30 mb-3 flex flex-wrap items-center justify-center gap-1.5 bg-black/80 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md shadow-2xl max-w-full">
          {familyMeta.stages.map(st => {
            const isSelected = currentEyeId === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleSelectStage(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-white/25 via-white/20 to-white/10 text-white border border-white/40 shadow-lg scale-105'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/10'
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 20px ${familyMeta.color}66` : 'none',
                  borderColor: isSelected ? familyMeta.color : 'rgba(255,255,255,0.1)'
                }}
              >
                <span>{st.stageNum === 'awakened' ? '✨' : `${st.stageNum} ст.`}</span>
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3D СФЕРА ГЛАЗНОГО ЯБЛОКА С АВТОНОМНЫМ КИНЕМАТОГРАФИЧНЫМ ПАРЕНИЕМ */}
        <div 
          className="relative my-2 sm:my-3 flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: isSurging ? 'translateZ(50px) scale(1.12)' : 'translateZ(0px) scale(1)',
            animation: isSurging ? 'none' : 'eyeFloat3D 6.5s ease-in-out infinite',
            transition: isSurging ? 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.6s ease-out'
          }}
        >
          {/* Внешний объемный ореол ауры (Back 3D layer) */}
          <div 
            className="absolute -inset-6 sm:-inset-10 rounded-full opacity-60 blur-2xl transition-all duration-700 pointer-events-none"
            style={{ 
              backgroundColor: familyMeta.color,
              transform: 'translateZ(-45px)'
            }}
          />

          {/* 3D Двойное гироскопическое орбитальное кольцо чакры */}
          <div 
            className="absolute -inset-8 sm:-inset-12 rounded-full pointer-events-none border border-white/25 opacity-70"
            style={{
              animation: 'chakraOrbital1 16s linear infinite',
              boxShadow: `0 0 25px ${familyMeta.color}88`,
              borderColor: familyMeta.color
            }}
          />
          <div 
            className="absolute -inset-10 sm:-inset-14 rounded-full pointer-events-none border border-white/15 opacity-40"
            style={{
              animation: 'chakraOrbital2 22s linear infinite',
              borderColor: familyMeta.color
            }}
          />

          {/* SVG КИНЕМАТОГРАФИЧНЫЙ ГЛАЗ (viewBox: 340 x 320 с анатомическим разрезом века) */}
          <div className="w-64 h-56 sm:w-84 sm:h-72 relative flex items-center justify-center rounded-3xl shadow-[0_0_95px_rgba(0,0,0,0.95)]">
            <svg 
              viewBox="0 0 340 320" 
              className="w-full h-full overflow-visible drop-shadow-[0_20px_45px_rgba(0,0,0,0.98)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* 1. АНАТОМИЧЕСКИЙ МИНДАЛЕВИДНЫЙ РАЗРЕЗ ГЛАЗА (SANPAKU / ХИЩНОЕ ВЕКО) */}
                <clipPath id="ninja-eye-cutout">
                  <path d="M 24 160 C 60 100, 130 84, 170 84 C 210 84, 275 100, 314 160 C 275 218, 210 236, 170 236 C 130 236, 60 218, 24 160 Z" />
                </clipPath>

                {/* 2. HDR BLOOM СВЕТОФИЛЬТР ДЛЯ ФОТОННОГО ЯДРА И МОЛНИЙ */}
                <filter id="god-eye-bloom" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="2.5" result="blur1" />
                  <feGaussianBlur stdDeviation="6.5" result="blur2" />
                  <feGaussianBlur stdDeviation="14" result="blur3" />
                  <feMerge>
                    <feMergeNode in="blur3" />
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* 3. ГЛУБОКАЯ ТЕНЬ ВЕРХНЕГО ВЕКА (AMBIENT OCCLUSION) */}
                <linearGradient id="lid-ambient-shadow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#040407" stopOpacity="0.95" />
                  <stop offset="35%" stopColor="#07070b" stopOpacity="0.65" />
                  <stop offset="70%" stopColor="#0a0a0f" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0a0a0f" stopOpacity="0" />
                </linearGradient>

                {/* 4. ГРАДИЕНТ СКЛЕРЫ (СВЕТОТЕНЬ ГЛАЗНИЦЫ) */}
                <radialGradient id="sclera-3d-gradient" cx="44%" cy="42%" r="62%">
                  <stop offset="0%" stopColor="#f4ecec" />
                  <stop offset="45%" stopColor="#ded3d5" />
                  <stop offset="78%" stopColor="#9a8c92" />
                  <stop offset="94%" stopColor="#483a40" />
                  <stop offset="100%" stopColor="#1c1216" />
                </radialGradient>

                {/* 5. РАДИАЛЬНЫЙ ГРАДИЕНТ РАДУЖКИ */}
                <radialGradient id="iris-3d-gradient" cx="42%" cy="40%" r="58%">
                  {familyKey === 'Sharingan' && (
                    <>
                      <stop offset="0%" stopColor="#ff5252" />
                      <stop offset="28%" stopColor="#f81b1b" />
                      <stop offset="65%" stopColor="#b91c1c" />
                      <stop offset="88%" stopColor="#450a0a" />
                      <stop offset="100%" stopColor="#140202" />
                    </>
                  )}
                  {familyKey === 'Byakugan' && (
                    <>
                      {currentEyeId === 'byakugan_awakened' ? (
                        <>
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="25%" stopColor="#a5f3fc" />
                          <stop offset="60%" stopColor="#06b6d4" />
                          <stop offset="85%" stopColor="#0e7490" />
                          <stop offset="100%" stopColor="#083344" />
                        </>
                      ) : (
                        <>
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="35%" stopColor="#f1f5f9" />
                          <stop offset="68%" stopColor="#cbd5e1" />
                          <stop offset="88%" stopColor="#94a3b8" />
                          <stop offset="100%" stopColor="#334155" />
                        </>
                      )}
                    </>
                  )}
                  {familyKey === 'Rinnegan' && (
                    <>
                      {currentEyeId === 'rinnegan_awakened' && selectedRinnePattern === 'kaguya' ? (
                        /* Ринне-Шаринган Кагуи / Мадары (Кроваво-красный) */
                        <>
                          <stop offset="0%" stopColor="#ff5252" />
                          <stop offset="35%" stopColor="#dc2626" />
                          <stop offset="70%" stopColor="#991b1b" />
                          <stop offset="92%" stopColor="#450a0a" />
                          <stop offset="100%" stopColor="#1a0303" />
                        </>
                      ) : (
                        /* Риннеган Саске (Глубокий благородный фиолетовый Шести Путей) */
                        <>
                          <stop offset="0%" stopColor="#f3e8ff" />
                          <stop offset="22%" stopColor="#d8b4fe" />
                          <stop offset="48%" stopColor="#a855f7" />
                          <stop offset="74%" stopColor="#6b21a8" />
                          <stop offset="90%" stopColor="#3b0764" />
                          <stop offset="100%" stopColor="#18032d" />
                        </>
                      )}
                    </>
                  )}
                  {familyKey === 'Kingan' && (
                    <>
                      <stop offset="0%" stopColor="#fef9c3" />
                      <stop offset="35%" stopColor="#facc15" />
                      <stop offset="70%" stopColor="#ca8a04" />
                      <stop offset="90%" stopColor="#713f12" />
                      <stop offset="100%" stopColor="#2e1a03" />
                    </>
                  )}
                  {familyKey === 'Aoigan' && (
                    <>
                      <stop offset="0%" stopColor="#cffafe" />
                      <stop offset="35%" stopColor="#22d3ee" />
                      <stop offset="70%" stopColor="#0891b2" />
                      <stop offset="90%" stopColor="#155e75" />
                      <stop offset="100%" stopColor="#042f2e" />
                    </>
                  )}
                  {familyKey === 'Ikadzutigan' && (
                    <>
                      <stop offset="0%" stopColor="#e0f2fe" />
                      <stop offset="35%" stopColor="#38bdf8" />
                      <stop offset="70%" stopColor="#0284c7" />
                      <stop offset="90%" stopColor="#075985" />
                      <stop offset="100%" stopColor="#082f49" />
                    </>
                  )}
                </radialGradient>

                {/* 6. МЕТАЛЛИЧЕСКИЙ СКОС ЛЕЗВИЙ (BEVEL STEEL) */}
                <linearGradient id="blade-steel" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#d4d4d8" />
                  <stop offset="60%" stopColor="#71717a" />
                  <stop offset="85%" stopColor="#27272a" />
                  <stop offset="100%" stopColor="#09090b" />
                </linearGradient>

                {/* Одиночное каноничное томоэ Шарингана / Риннегана */}
                <g id="tomoe-symbol">
                  <circle cx="0" cy="0" r="8.5" fill="#09090b" stroke="#18181b" strokeWidth="0.8" />
                  <path d="M -7 0 C -7 -11, 4 -15, 8.5 -24 C 6.5 -15, 2.5 -8.5, 0 -5.5 Z" fill="#09090b" />
                  <circle cx="0" cy="0" r="2.8" fill="#27272a" />
                </g>

                {/* Томоэ Риннегана Саске с фиолетовой окантовкой */}
                <g id="rinnegan-tomoe-sasuke">
                  <circle cx="0" cy="0" r="7.5" fill="#0b0314" stroke="#a855f7" strokeWidth="1.2" />
                  <path d="M -6.5 0 C -6.5 -9.5, 3.8 -13, 8 -21 C 6 -13, 2.2 -7.5, 0 -5 Z" fill="#0b0314" />
                  <circle cx="0" cy="0" r="2.5" fill="#c084fc" />
                </g>

                {/* Водная капля Аойгана */}
                <g id="aoigan-single-drop">
                  <path d="M 0 -22 C 10 -12, 12 0, 0 12 C -12 0, -10 -12, 0 -22 Z" fill="#083344" stroke="#67e8f9" strokeWidth="1.5" />
                  <circle cx="0" cy="3" r="3" fill="#a5f3fc" />
                </g>

                {/* Разряд молнии Икадзутигана */}
                <g id="lightning-bolt-single">
                  <path d="M 0 -25 L -7 -7 L 2 -7 L -5 20 L 7 -2 L 0 -2 Z" fill="#0c4a6e" stroke="#7dd3fc" strokeWidth="1.6" strokeLinejoin="round" />
                  <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
                </g>
              </defs>

              {/* ======================================================== */}
              {/* АНАТОМИЧЕСКИЕ ПУЛЬСИРУЮЩИЕ ВЕНЫ ВИСКОВ (ХЬЮГА / БЬЯКУГАН) */}
              {/* ======================================================== */}
              {familyKey === 'Byakugan' && (
                <g style={{ animation: 'veinHeartbeatPulse 1.9s ease-in-out infinite' }}>
                  {/* Левая ветвь виска */}
                  <g stroke="#93c5fd" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.95" filter="drop-shadow(0 0 6px #60a5fa)">
                    <path d="M 74 160 C 45 145, 25 130, 2 115" />
                    <path d="M 52 148 C 32 165, 18 190, 4 215" strokeWidth="2.2" />
                    <path d="M 78 145 C 50 115, 32 80, 16 45" strokeWidth="2.5" />
                    <path d="M 78 175 C 50 205, 32 240, 14 275" strokeWidth="2.5" />
                  </g>
                  {/* Правая ветвь виска */}
                  <g stroke="#93c5fd" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.95" filter="drop-shadow(0 0 6px #60a5fa)">
                    <path d="M 266 160 C 295 145, 315 130, 338 115" />
                    <path d="M 288 148 C 308 165, 322 190, 336 215" strokeWidth="2.2" />
                    <path d="M 262 145 C 290 115, 308 80, 324 45" strokeWidth="2.5" />
                    <path d="M 262 175 C 290 205, 308 240, 326 275" strokeWidth="2.5" />
                  </g>
                </g>
              )}

              {/* ======================================================== */}
              {/* СОДЕРЖИМОЕ ВНУТРИ АНАТОМИЧЕСКОГО РАЗРЕЗА ВЕКА (CLIP-PATH) */}
              {/* ======================================================== */}
              <g clipPath="url(#ninja-eye-cutout)">
                
                {/* 1. БЕЛОК ГЛАЗА (СКЛЕРА) */}
                <rect x="0" y="0" width="340" height="320" fill="url(#sclera-3d-gradient)" />

                {/* 2. ФРАКТАЛЬНАЯ ПАУТИНА СВЕТЯЩИХСЯ КАПИЛЛЯРОВ И ТРЕЩИН ЧАКРЫ */}
                <g stroke={familyMeta.veinColor} strokeWidth="1" fill="none" opacity="0.75" filter="url(#god-eye-bloom)">
                  {/* Левая капиллярная ветвь (от угла века к радужке) */}
                  <path d="M 24 160 Q 55 155 86 150 Q 105 142 120 152" strokeWidth="1.6" />
                  <path d="M 40 156 Q 65 140 85 135 Q 105 130 115 138" strokeWidth="0.9" />
                  <path d="M 50 168 Q 75 178 98 174 Q 115 172 122 165" strokeWidth="1.1" />
                  <path d="M 75 142 Q 88 126 102 122" strokeWidth="0.7" />
                  <path d="M 85 175 Q 98 190 112 188" strokeWidth="0.8" />

                  {/* Правая капиллярная ветвь (от внешнего угла к радужке) */}
                  <path d="M 314 160 Q 280 155 254 150 Q 235 142 220 152" strokeWidth="1.6" />
                  <path d="M 300 156 Q 275 140 252 135 Q 235 130 224 138" strokeWidth="0.9" />
                  <path d="M 290 168 Q 265 178 242 174 Q 225 172 218 165" strokeWidth="1.1" />
                  <path d="M 265 142 Q 252 126 238 122" strokeWidth="0.7" />
                  <path d="M 255 175 Q 242 190 228 188" strokeWidth="0.8" />
                </g>

                {/* 3. ОСНОВНАЯ РАДУЖКА ГЛАЗА */}
                <circle 
                  cx={CX} 
                  cy={CY} 
                  r="78" 
                  fill="url(#iris-3d-gradient)" 
                  stroke="#07070a" 
                  strokeWidth="2.8"
                  filter="drop-shadow(0 6px 14px rgba(0,0,0,0.85))"
                />

                {/* 4. САКРАЛЬНЫЙ РУНИЧЕСКИЙ ЦИФЕРБЛАТ (ПРЕЦИЗИОННЫЕ НАСЕЧКИ ХРОНОГРАФА) */}
                <g>
                  {/* Двойные координатные кольца печати */}
                  <circle cx={CX} cy={CY} r="77" fill="none" stroke="#180408" strokeWidth="2.2" />
                  <circle cx={CX} cy={CY} r="75" fill="none" stroke={familyMeta.lightningColor} strokeWidth="0.9" opacity="0.85" />
                  <circle cx={CX} cy={CY} r="66" fill="none" stroke={familyMeta.lightningColor} strokeWidth="0.6" opacity="0.65" strokeDasharray="3 3" />

                  {/* 72 прецизионные насечки рунического циферблата */}
                  <g opacity="0.82">
                    {Array.from({ length: 72 }).map((_, i) => {
                      const isMajor = i % 6 === 0;
                      const angle = (i * 5 * Math.PI) / 180;
                      const rOuter = 75;
                      const rInner = isMajor ? 66 : 70;
                      return (
                        <line
                          key={i}
                          x1={CX + Math.cos(angle) * rInner}
                          y1={CY + Math.sin(angle) * rInner}
                          x2={CX + Math.cos(angle) * rOuter}
                          y2={CY + Math.sin(angle) * rOuter}
                          stroke={isMajor ? "#ffffff" : familyMeta.lightningColor}
                          strokeWidth={isMajor ? 1.3 : 0.65}
                          filter={isMajor ? "drop-shadow(0 0 2px #ffffff)" : "none"}
                        />
                      );
                    })}
                  </g>
                </g>

                {/* ======================================================== */}
                {/* 1. БЬЯКУГАН (ВОЛОКНА, ТЭНКЭЦУ, 3 КОЛЬЦА БАГУА 64 ЛАДОНИ)  */}
                {/* ======================================================== */}
                {familyKey === 'Byakugan' && (
                  <g>
                    {/* Кристаллические радиальные волокна перламутровой радужки (36 лучей) */}
                    <g stroke="#ffffff" strokeWidth="0.8" opacity="0.5" strokeLinecap="round">
                      {Array.from({ length: 36 }).map((_, i) => {
                        const angle = (i * 10 * Math.PI) / 180;
                        const x1 = CX + Math.cos(angle) * 22;
                        const y1 = CY + Math.sin(angle) * 22;
                        const x2 = CX + Math.cos(angle) * 75;
                        const y2 = CY + Math.sin(angle) * 75;
                        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
                      })}
                    </g>

                    {/* 1 СТУПЕНЬ: Базовое кольцо фокуса и круговой дальномер 360° */}
                    {currentEyeId === 'byakugan_1' && (
                      <g>
                        <circle cx={CX} cy={CY} r="62" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.85" />
                        <line x1={CX} y1={CY - 76} x2={CX} y2={CY - 60} stroke="#93c5fd" strokeWidth="2" />
                        <line x1={CX} y1={CY + 60} x2={CX} y2={CY + 76} stroke="#93c5fd" strokeWidth="2" />
                        <line x1={CX - 76} y1={CY} x2={CX - 60} y2={CY} stroke="#93c5fd" strokeWidth="2" />
                        <line x1={CX + 60} y1={CY} x2={CX + 76} y2={CY} stroke="#93c5fd" strokeWidth="2" />
                      </g>
                    )}

                    {/* 2 СТУПЕНЬ: 2 кольца глубины + 16 сияющих узлов Тэнкэцу */}
                    {currentEyeId === 'byakugan_2' && (
                      <g>
                        <circle cx={CX} cy={CY} r="64" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeDasharray="10 5" opacity="0.8" />
                        <circle cx={CX} cy={CY} r="44" fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.9" />
                        <g className={isSpinning ? 'animate-spin' : ''} style={{ transformOrigin: `${CX}px ${CY}px`, animationDuration: '14s' }}>
                          {Array.from({ length: 16 }).map((_, i) => {
                            const angle = (i * 22.5 * Math.PI) / 180;
                            const cx = CX + Math.cos(angle) * 44;
                            const cy = CY + Math.sin(angle) * 44;
                            return (
                              <g key={i}>
                                <circle cx={cx} cy={cy} r="2.8" fill="#ffffff" filter="drop-shadow(0 0 4px #93c5fd)" />
                                <circle cx={cx} cy={cy} r="1.4" fill="#3b82f6" />
                              </g>
                            );
                          })}
                        </g>
                      </g>
                    )}

                    {/* 3 СТУПЕНЬ: РОВНО 3 КОЛЬЦА БАГУА + 8 ТРИГРАММ + ТАЙЦЗИ ИНЬ-ЯН */}
                    {currentEyeId === 'byakugan_3' && (
                      <g className={isSpinning ? 'animate-spin' : ''} style={{ transformOrigin: `${CX}px ${CY}px`, animationDuration: '16s' }}>
                        <circle cx={CX} cy={CY} r="70" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.9" />
                        <circle cx={CX} cy={CY} r="52" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="12 4" opacity="0.85" />
                        <circle cx={CX} cy={CY} r="34" fill="none" stroke="#93c5fd" strokeWidth="1.8" opacity="0.9" />

                        {/* 8 священных триграмм Багуа */}
                        <g stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" opacity="0.95">
                          {/* ☰ Цянь (Север) */}
                          <g transform={`translate(${CX}, ${CY - 65})`}>
                            <line x1="-8" y1="-4" x2="8" y2="-4" /><line x1="-8" y1="0" x2="8" y2="0" /><line x1="-8" y1="4" x2="8" y2="4" />
                          </g>
                          {/* ☷ Кунь (Юг) */}
                          <g transform={`translate(${CX}, ${CY + 65})`}>
                            <line x1="-8" y1="-4" x2="-2" y2="-4" /><line x1="2" y1="-4" x2="8" y2="-4" />
                            <line x1="-8" y1="0" x2="-2" y2="0" /><line x1="2" y1="0" x2="8" y2="0" />
                            <line x1="-8" y1="4" x2="-2" y2="4" /><line x1="2" y1="4" x2="8" y2="4" />
                          </g>
                          {/* ☲ Ли (Восток) */}
                          <g transform={`translate(${CX + 65}, ${CY})`}>
                            <line x1="-8" y1="-4" x2="8" y2="-4" />
                            <line x1="-8" y1="0" x2="-2" y2="0" /><line x1="2" y1="0" x2="8" y2="0" />
                            <line x1="-8" y1="4" x2="8" y2="4" />
                          </g>
                          {/* ☵ Кань (Запад) */}
                          <g transform={`translate(${CX - 65}, ${CY})`}>
                            <line x1="-8" y1="-4" x2="-2" y2="-4" /><line x1="2" y1="-4" x2="8" y2="-4" />
                            <line x1="-8" y1="0" x2="8" y2="0" />
                            <line x1="-8" y1="4" x2="-2" y2="4" /><line x1="2" y1="4" x2="8" y2="4" />
                          </g>
                        </g>

                        {/* Центральный символ Тайцзи (Инь-Ян) в ядре зрачка */}
                        <g transform={`translate(${CX}, ${CY})`}>
                          <circle cx="0" cy="0" r="16" fill="#f8fafc" stroke="#3b82f6" strokeWidth="1" />
                          <path d="M 0 -16 A 16 16 0 0 1 0 16 A 8 8 0 0 1 0 0 A 8 8 0 0 0 0 -16 Z" fill="#1e3a8a" />
                          <circle cx="0" cy="-8" r="2.5" fill="#f8fafc" />
                          <circle cx="0" cy="8" r="2.5" fill="#1e3a8a" />
                        </g>
                      </g>
                    )}

                    {/* ПРОБУЖДЁННЫЙ БЬЯКУГАН (ТЭНСЭЙГАН ХАМУРЫ) */}
                    {currentEyeId === 'byakugan_awakened' && (
                      <g>
                        <g className="animate-spin" style={{ transformOrigin: `${CX}px ${CY}px`, animationDuration: '20s' }}>
                          <polygon points={`${CX},${CY-74} ${CX+12},${CY-15} ${CX+74},${CY} ${CX+12},${CY+15} ${CX},${CY+74} ${CX-12},${CY+15} ${CX-74},${CY} ${CX-12},${CY-15}`} fill="#ffffff" opacity="0.65" filter="drop-shadow(0 0 8px #a5f3fc)" />
                        </g>
                        {/* 8-лепестковый цветок чакры */}
                        <g className={isSpinning ? 'animate-spin' : ''} style={{ transformOrigin: `${CX}px ${CY}px`, animationDuration: '8s' }}>
                          {Array.from({ length: 8 }).map((_, i) => (
                            <g key={i} transform={`translate(${CX}, ${CY}) rotate(${i * 45})`}>
                              <path d="M 0 0 C 8 -15, 12 -28, 0 -38 C -12 -28, -8 -15, 0 0 Z" fill="#ffffff" stroke="#0891b2" strokeWidth="1.2" opacity="0.9" />
                              <circle cx="0" cy="-24" r="2.5" fill="#06b6d4" />
                            </g>
                          ))}
                        </g>
                      </g>
                    )}
                  </g>
                )}

                {/* ======================================================== */}
                {/* 2. РИННЕГАН (ШЕСТЬ ПУТЕЙ & КАНОНИЧНЫЙ САСКЕ 6 ТОМОЭ)     */}
                {/* ======================================================== */}
                {familyKey === 'Rinnegan' && (
                  <g>
                    {/* 6 идеальных концентрических колец Шести Путей */}
                    <circle cx={CX} cy={CY} r="74" fill="none" stroke={selectedRinnePattern === 'kaguya' && currentEyeId === 'rinnegan_awakened' ? '#450a0a' : '#2e1065'} strokeWidth="2.8" />
                    <circle cx={CX} cy={CY} r="60" fill="none" stroke={selectedRinnePattern === 'kaguya' && currentEyeId === 'rinnegan_awakened' ? '#7f1d1d' : '#3b0764'} strokeWidth="2.8" />
                    <circle cx={CX} cy={CY} r="47" fill="none" stroke={selectedRinnePattern === 'kaguya' && currentEyeId === 'rinnegan_awakened' ? '#450a0a' : '#2e1065'} strokeWidth="2.8" />
                    <circle cx={CX} cy={CY} r="34" fill="none" stroke={selectedRinnePattern === 'kaguya' && currentEyeId === 'rinnegan_awakened' ? '#7f1d1d' : '#3b0764'} strokeWidth="2.8" />
                    <circle cx={CX} cy={CY} r="21" fill="none" stroke={selectedRinnePattern === 'kaguya' && currentEyeId === 'rinnegan_awakened' ? '#450a0a' : '#2e1065'} strokeWidth="2.8" />

                    {/* ПРОБУЖДЁННАЯ ФОРМА: САСКЕ (6 ТОМОЭ) VS КАГУЯ (9 ТОМОЭ) */}
                    {currentEyeId === 'rinnegan_awakened' && (
                      <g 
                        className={isSpinning ? 'animate-spin' : ''} 
                        style={{ transformOrigin: `${CX}px ${CY}px`, animationDuration: isSpinning ? '3s' : '9s' }}
                      >
                        {/* САСКЕ: РОВНО 6 ТОМОЭ НА 2 КОЛЬЦАХ */}
                        {selectedRinnePattern === 'sasuke' && (
                          <g>
                            {/* Кольцо 1 (радиус 34): 3 томоэ (0°, 120°, 240°) */}
                            <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -34) scale(0.72)"><use href="#rinnegan-tomoe-sasuke" /></g></g>
                            <g transform={`translate(${CX}, ${CY}) rotate(120)`}><g transform="translate(0, -34) scale(0.72)"><use href="#rinnegan-tomoe-sasuke" /></g></g>
                            <g transform={`translate(${CX}, ${CY}) rotate(240)`}><g transform="translate(0, -34) scale(0.72)"><use href="#rinnegan-tomoe-sasuke" /></g></g>

                            {/* Кольцо 2 (радиус 60): 3 томоэ (60°, 180°, 300°) */}
                            <g transform={`translate(${CX}, ${CY}) rotate(60)`}><g transform="translate(0, -60) scale(0.72)"><use href="#rinnegan-tomoe-sasuke" /></g></g>
                            <g transform={`translate(${CX}, ${CY}) rotate(180)`}><g transform="translate(0, -60) scale(0.72)"><use href="#rinnegan-tomoe-sasuke" /></g></g>
                            <g transform={`translate(${CX}, ${CY}) rotate(300)`}><g transform="translate(0, -60) scale(0.72)"><use href="#rinnegan-tomoe-sasuke" /></g></g>
                          </g>
                        )}

                        {/* КАГУЯ / МАДАРА: РОВНО 9 ТОМОЭ НА 3 КОЛЬЦАХ */}
                        {selectedRinnePattern === 'kaguya' && (
                          <g>
                            <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -34) scale(0.68)"><use href="#tomoe-symbol" /></g></g>
                            <g transform={`translate(${CX}, ${CY}) rotate(120)`}><g transform="translate(0, -34) scale(0.68)"><use href="#tomoe-symbol" /></g></g>
                            <g transform={`translate(${CX}, ${CY}) rotate(240)`}><g transform="translate(0, -34) scale(0.68)"><use href="#tomoe-symbol" /></g></g>

                            <g transform={`translate(${CX}, ${CY}) rotate(60)`}><g transform="translate(0, -47) scale(0.68)"><use href="#tomoe-symbol" /></g></g>
                            <g transform={`translate(${CX}, ${CY}) rotate(180)`}><g transform="translate(0, -47) scale(0.68)"><use href="#tomoe-symbol" /></g></g>
                            <g transform={`translate(${CX}, ${CY}) rotate(300)`}><g transform="translate(0, -47) scale(0.68)"><use href="#tomoe-symbol" /></g></g>

                            <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -60) scale(0.68)"><use href="#tomoe-symbol" /></g></g>
                            <g transform={`translate(${CX}, ${CY}) rotate(120)`}><g transform="translate(0, -60) scale(0.68)"><use href="#tomoe-symbol" /></g></g>
                            <g transform={`translate(${CX}, ${CY}) rotate(240)`}><g transform="translate(0, -60) scale(0.68)"><use href="#tomoe-symbol" /></g></g>
                          </g>
                        )}
                      </g>
                    )}
                  </g>
                )}

                {/* ======================================================== */}
                {/* 3. КИНГАН (1, 2, 3 КОЛЬЦА И ПЕЧАТЬ РАЗРУШЕНИЯ)           */}
                {/* ======================================================== */}
                {familyKey === 'Kingan' && (
                  <g>
                    <line x1={CX - 74} y1={CY} x2={CX + 74} y2={CY} stroke="#fef08a" strokeWidth="1" strokeDasharray="4 4" opacity="0.75" />
                    <line x1={CX} y1={CY - 74} x2={CX} y2={CY + 74} stroke="#fef08a" strokeWidth="1" strokeDasharray="4 4" opacity="0.75" />

                    <g className={isSpinning ? 'animate-spin' : ''} style={{ transformOrigin: `${CX}px ${CY}px`, animationDuration: '9s' }}>
                      {(currentEyeId === 'kingan_1' || currentEyeId === 'kingan_2' || currentEyeId === 'kingan_3' || currentEyeId === 'kingan_awakened') && (
                        <circle cx={CX} cy={CY} r="32" fill="none" stroke="#fef08a" strokeWidth="2.5" strokeDasharray="18 10" />
                      )}
                      {(currentEyeId === 'kingan_2' || currentEyeId === 'kingan_3' || currentEyeId === 'kingan_awakened') && (
                        <circle cx={CX} cy={CY} r="50" fill="none" stroke="#fde047" strokeWidth="2.5" strokeDasharray="14 8" />
                      )}
                      {(currentEyeId === 'kingan_3' || currentEyeId === 'kingan_awakened') && (
                        <circle cx={CX} cy={CY} r="68" fill="none" stroke="#facc15" strokeWidth="2.5" strokeDasharray="26 12" />
                      )}

                      {currentEyeId === 'kingan_awakened' && (
                        <g stroke="#ffffff" strokeWidth="2.5">
                          <polygon points={`${CX},${CY-70} ${CX+20},${CY-20} ${CX+70},${CY} ${CX+20},${CY+20} ${CX},${CY+70} ${CX-20},${CY+20} ${CX-70},${CY} ${CX-20},${CY-20}`} fill="none" filter="drop-shadow(0 0 8px #fef08a)" />
                        </g>
                      )}
                    </g>
                  </g>
                )}

                {/* ======================================================== */}
                {/* 4. АОЙГАН (1, 2, 3 КАПЛИ И ГЛУБИННАЯ БЕЗДНА)             */}
                {/* ======================================================== */}
                {familyKey === 'Aoigan' && (
                  <g>
                    <circle cx={CX} cy={CY} r="66" fill="none" stroke="#083344" strokeWidth="2.5" opacity="0.7" />
                    <circle cx={CX} cy={CY} r="46" fill="none" stroke="#0891b2" strokeWidth="1.8" strokeDasharray="8 6" />

                    <g className={isSpinning ? 'animate-spin' : ''} style={{ transformOrigin: `${CX}px ${CY}px`, animationDuration: isSpinning ? '2.4s' : '7s' }}>
                      {currentEyeId === 'aoigan_1' && (
                        <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g></g>
                      )}
                      {currentEyeId === 'aoigan_2' && (
                        <>
                          <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g></g>
                          <g transform={`translate(${CX}, ${CY}) rotate(180)`}><g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g></g>
                        </>
                      )}
                      {currentEyeId === 'aoigan_3' && (
                        <>
                          <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g></g>
                          <g transform={`translate(${CX}, ${CY}) rotate(120)`}><g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g></g>
                          <g transform={`translate(${CX}, ${CY}) rotate(240)`}><g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g></g>
                        </>
                      )}
                      {currentEyeId === 'aoigan_awakened' && (
                        <>
                          <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g></g>
                          <g transform={`translate(${CX}, ${CY}) rotate(120)`}><g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g></g>
                          <g transform={`translate(${CX}, ${CY}) rotate(240)`}><g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g></g>
                          <circle cx={CX} cy={CY} r="60" fill="none" stroke="#22d3ee" strokeWidth="3" strokeDasharray="24 10" filter="drop-shadow(0 0 6px #67e8f9)" />
                        </>
                      )}
                    </g>
                  </g>
                )}

                {/* ======================================================== */}
                {/* 5. ИКАДЗУТИГАН (1, 2, 3 РАЗРЯДА И БОЖЕСТВЕННАЯ МОЛНИЯ)   */}
                {/* ======================================================== */}
                {familyKey === 'Ikadzutigan' && (
                  <g>
                    <circle cx={CX} cy={CY} r="64" fill="none" stroke="#075985" strokeWidth="2" strokeDasharray="6 6" opacity="0.8" />
                    <g className={isSpinning ? 'animate-spin' : ''} style={{ transformOrigin: `${CX}px ${CY}px`, animationDuration: isSpinning ? '1.8s' : '5s' }}>
                      {currentEyeId === 'ikadzutigan_1' && (
                        <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g></g>
                      )}
                      {currentEyeId === 'ikadzutigan_2' && (
                        <>
                          <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g></g>
                          <g transform={`translate(${CX}, ${CY}) rotate(180)`}><g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g></g>
                        </>
                      )}
                      {currentEyeId === 'ikadzutigan_3' && (
                        <>
                          <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g></g>
                          <g transform={`translate(${CX}, ${CY}) rotate(120)`}><g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g></g>
                          <g transform={`translate(${CX}, ${CY}) rotate(240)`}><g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g></g>
                        </>
                      )}
                      {currentEyeId === 'ikadzutigan_awakened' && (
                        <>
                          <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g></g>
                          <g transform={`translate(${CX}, ${CY}) rotate(120)`}><g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g></g>
                          <g transform={`translate(${CX}, ${CY}) rotate(240)`}><g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g></g>
                          <path d={`M ${CX-40} ${CY-40} L ${CX} ${CY-72} L ${CX+40} ${CY-40} L ${CX+72} ${CY} L ${CX+40} ${CY+40} L ${CX} ${CY+72} L ${CX-40} ${CY+40} L ${CX-72} ${CY} Z`} fill="none" stroke="#ffffff" strokeWidth="2.5" filter="drop-shadow(0 0 10px #7dd3fc)" />
                        </>
                      )}
                    </g>
                  </g>
                )}

                {/* ======================================================== */}
                {/* 6. ШАРИНГАН (1, 2, 3 ТОМОЭ И ВМШ С 5 КАНОНИЧНЫМИ УЗОРАМИ) */}
                {/* ======================================================== */}
                {familyKey === 'Sharingan' && (
                  <g>
                    {/* Тонкое черное кольцо вращения томоэ */}
                    <circle cx={CX} cy={CY} r="48" fill="none" stroke="#09090b" strokeWidth="2.5" opacity="0.9" />

                    <g className={isSpinning ? 'animate-spin' : ''} style={{ transformOrigin: `${CX}px ${CY}px`, animationDuration: isSpinning ? '1.8s' : '6s' }}>
                      {/* 1 ТОМОЭ */}
                      {currentEyeId === 'sharingan_1' && (
                        <g transform={`translate(${CX}, ${CY}) rotate(0)`}>
                          <g transform="translate(0, -48)"><use href="#tomoe-symbol" /></g>
                        </g>
                      )}

                      {/* 2 ТОМОЭ */}
                      {currentEyeId === 'sharingan_2' && (
                        <>
                          <g transform={`translate(${CX}, ${CY}) rotate(0)`}>
                            <g transform="translate(0, -48)"><use href="#tomoe-symbol" /></g>
                          </g>
                          <g transform={`translate(${CX}, ${CY}) rotate(180)`}>
                            <g transform="translate(0, -48)"><use href="#tomoe-symbol" /></g>
                          </g>
                        </>
                      )}

                      {/* 3 ТОМОЭ: РОВНО 3 ТОМОЭ ПОД 0°, 120°, 240° */}
                      {currentEyeId === 'sharingan_3' && (
                        <>
                          <g transform={`translate(${CX}, ${CY}) rotate(0)`}>
                            <g transform="translate(0, -48)"><use href="#tomoe-symbol" /></g>
                          </g>
                          <g transform={`translate(${CX}, ${CY}) rotate(120)`}>
                            <g transform="translate(0, -48)"><use href="#tomoe-symbol" /></g>
                          </g>
                          <g transform={`translate(${CX}, ${CY}) rotate(240)`}>
                            <g transform="translate(0, -48)"><use href="#tomoe-symbol" /></g>
                          </g>
                        </>
                      )}

                      {/* ВЕЧНЫЙ МАНГЁКЁ ШАРИНГАН (ВМШ): 5 КАНОНИЧНЫХ ДЕТАЛИЗИРОВАННЫХ УЗОРОВ */}
                      {currentEyeId === 'mangekyo' && (
                        <g>
                          {/* Форма 1: САСКЕ (ЭТАЛОН: 6 серповидных лезвий с фаской + двойные кольца) */}
                          {selectedPattern === 'sasuke' && (
                            <g>
                              {/* Двойные концентрические нити печати «Цветок Жизни» */}
                              <circle cx={CX} cy={CY} r="44" fill="none" stroke="#ff3355" strokeWidth="1.2" opacity="0.9" />
                              <circle cx={CX} cy={CY} r="28" fill="none" stroke="#ff3355" strokeWidth="1" opacity="0.75" />

                              {/* 6 серповидных лезвий с объемной светотеневой фаской */}
                              {[0, 60, 120, 180, 240, 300].map(deg => (
                                <g key={`scythe-${deg}`} transform={`translate(${CX}, ${CY}) rotate(${deg})`}>
                                  {/* Теневая грань (обсидиановый клинок) */}
                                  <path 
                                    d="M 0 0 C 12 -10, 30 -18, 50 -14 C 42 -36, 20 -50, -4 -58 C 2 -38, 6 -18, 0 0 Z" 
                                    fill="#09090b" 
                                    stroke="#450a0a" 
                                    strokeWidth="1.4"
                                    filter="drop-shadow(0 0 4px rgba(0,0,0,0.9))"
                                  />
                                  {/* Световая фаска (металлическая режущая кромка) */}
                                  <path 
                                    d="M 0 0 C 8 -8, 24 -14, 46 -12 C 34 -30, 16 -42, -4 -58" 
                                    fill="none" 
                                    stroke="url(#blade-steel)" 
                                    strokeWidth="1.8" 
                                    strokeLinecap="round" 
                                  />
                                  {/* Руническая точка чакры на лезвии */}
                                  <circle cx="22" cy="-28" r="2.2" fill="#ff1744" filter="drop-shadow(0 0 3px #ffffff)" />
                                </g>
                              ))}

                              {/* Внутренний сияющий шестиугольник */}
                              <polygon 
                                points={`${CX},${CY-44} ${CX+38},${CY-22} ${CX+38},${CY+22} ${CX},${CY+44} ${CX-38},${CY+22} ${CX-38},${CY-22}`} 
                                fill="none" 
                                stroke="#ff4d6d" 
                                strokeWidth="1.5" 
                                opacity="0.8" 
                              />
                            </g>
                          )}

                          {/* Форма 2: ИТАЧИ (Каноничный 3-лопастной изогнутый сюрикен со скошенной сталью) */}
                          {selectedPattern === 'itachi' && (
                            <g>
                              {[0, 120, 240].map(deg => (
                                <g key={deg} transform={`translate(${CX}, ${CY}) rotate(${deg})`}>
                                  <path 
                                    d="M 0 0 C 22 -20, 50 -26, 38 -56 C 20 -42, 5 -20, 0 0 Z" 
                                    fill="url(#blade-steel)" 
                                    stroke="#09090b" 
                                    strokeWidth="1.8"
                                    filter="drop-shadow(0 0 6px rgba(0,0,0,0.9))"
                                  />
                                  <path d="M 0 0 C 14 -14, 30 -18, 22 -38" stroke="#ffffff" strokeWidth="1.2" fill="none" opacity="0.85" />
                                  <circle cx="30" cy="-40" r="4.5" fill="#09090b" stroke="#ef4444" strokeWidth="1" />
                                </g>
                              ))}
                            </g>
                          )}

                          {/* Форма 3: МАДАРА (Каноничный ВМШ: 3 непрерывные петли + лезвия Изуны) */}
                          {selectedPattern === 'madara' && (
                            <g>
                              <circle cx={CX} cy={CY} r="54" fill="none" stroke="#09090b" strokeWidth="7" />
                              {[0, 120, 240].map(deg => (
                                <g key={`loop-${deg}`} transform={`translate(${CX}, ${CY}) rotate(${deg})`}>
                                  <circle cx="0" cy="-35" r="14" fill="#ef4444" stroke="#09090b" strokeWidth="6" />
                                  <path d="M 0 0 L 0 -22" stroke="#09090b" strokeWidth="8" strokeLinecap="round" />
                                </g>
                              ))}
                              {[60, 180, 300].map(deg => (
                                <g key={`izuna-${deg}`} transform={`translate(${CX}, ${CY}) rotate(${deg})`}>
                                  <polygon points="0,0 8,-28 0,-62 -8,-28" fill="#09090b" stroke="#7f1d1d" strokeWidth="1.2" />
                                  <line x1="0" y1="0" x2="0" y2="-56" stroke="url(#blade-steel)" strokeWidth="1.4" />
                                </g>
                              ))}
                            </g>
                          )}

                          {/* Форма 4: КАМУИ (Пространственный вихрь Обито / Какаши) */}
                          {selectedPattern === 'kamui' && (
                            <g>
                              {[0, 120, 240].map(deg => (
                                <g key={deg} transform={`translate(${CX}, ${CY}) rotate(${deg})`}>
                                  <path 
                                    d="M 0 0 C 30 -6, 56 -28, 52 -60 C 32 -44, 12 -26, 0 0 Z" 
                                    fill="#09090b" 
                                    stroke="#7f1d1d" 
                                    strokeWidth="2" 
                                  />
                                  <path d="M 0 0 C 22 -4, 40 -18, 38 -44" stroke="#ef4444" strokeWidth="1.4" fill="none" opacity="0.9" />
                                  <circle cx="38" cy="-40" r="4.5" fill="#f87171" />
                                </g>
                              ))}
                              <circle cx={CX} cy={CY} r="8" fill="#000000" stroke="#ef4444" strokeWidth="1.5" />
                            </g>
                          )}

                          {/* Форма 5: ШИСУИ (Каноничный 4-лопастной сюрикен Котоамацуками) */}
                          {selectedPattern === 'shisui' && (
                            <g>
                              {[0, 90, 180, 270].map(deg => (
                                <g key={deg} transform={`translate(${CX}, ${CY}) rotate(${deg})`}>
                                  <path 
                                    d="M 0 0 C 16 -16, 42 -22, 34 -54 C 18 -38, 4 -16, 0 0 Z" 
                                    fill="#09090b" 
                                    stroke="#ef4444" 
                                    strokeWidth="1.6"
                                  />
                                  <line x1="0" y1="0" x2="28" y2="-38" stroke="url(#blade-steel)" strokeWidth="1.2" />
                                  <circle cx="26" cy="-36" r="3.8" fill="#ef4444" />
                                </g>
                              ))}
                            </g>
                          )}
                        </g>
                      )}
                    </g>
                  </g>
                )}

                {/* ======================================================== */}
                {/* 7. ТЕРМОЯДЕРНОЕ ФОТОННОЕ ЯДРО ЗРАЧКА (КАК В ЭТАЛОНЕ)     */}
                {/* ======================================================== */}
                <g transform={`translate(${CX}, ${CY})`}>
                  {/* Черная обсидиановая чаша зрачка */}
                  <circle cx="0" cy="0" r="16" fill="#07070a" stroke="#2a050b" strokeWidth="2" />
                  
                  {/* Багровая корона расплавленной плазмы */}
                  <circle 
                    cx="0" 
                    cy="0" 
                    r="11" 
                    fill={familyKey === 'Rinnegan' && selectedRinnePattern === 'sasuke' ? '#9333ea' : familyMeta.color} 
                    opacity="0.95" 
                    filter="url(#god-eye-bloom)" 
                  />

                  {/* Внутреннее раскаленное ядро */}
                  <circle 
                    cx="0" 
                    cy="0" 
                    r="6.5" 
                    fill={familyKey === 'Rinnegan' && selectedRinnePattern === 'sasuke' ? '#e9d5ff' : '#ff8597'} 
                  />

                  {/* БОЖЕСТВЕННЫЙ БЕЛЫЙ ФОТОННЫЙ ЦЕНТР (СИНГУЛЯРНОСТЬ) */}
                  <circle cx="0" cy="0" r="3" fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff)" />
                </g>

                {/* ======================================================== */}
                {/* 8. ТЕНЬ ВЕРХНЕГО ВЕКА (AMBIENT OCCLUSION НА СКЛЕРУ И РАДУЖКУ) */}
                {/* ======================================================== */}
                <rect x="20" y="80" width="300" height="90" fill="url(#lid-ambient-shadow)" pointerEvents="none" />

              </g> {/* КОНЕЦ АНАТОМИЧЕСКОГО CLIP-PATH */}

              {/* ======================================================== */}
              {/* 9. АНАТОМИЧЕСКАЯ ОПРАВА ВЕКА, РЕСНИЦЫ И СЛЁЗНЫЙ КАНАЛ     */}
              {/* ======================================================== */}
              
              {/* Слёзный канал (Canthus medialis в левом углу) */}
              <path 
                d="M 24 160 C 20 162, 16 160, 14 156 C 16 151, 20 154, 24 160 Z" 
                fill="#831843" 
                stroke="#4c0519" 
                strokeWidth="1.2" 
              />
              <circle cx="18" cy="157" r="1.5" fill="#fbcfe8" opacity="0.8" />

              {/* Мощный контур верхнего и нижнего века */}
              <path 
                d="M 24 160 C 60 100, 130 84, 170 84 C 210 84, 275 100, 314 160 C 275 218, 210 236, 170 236 C 130 236, 60 218, 24 160 Z" 
                fill="none" 
                stroke="#09090b" 
                strokeWidth="4" 
                strokeLinecap="round" 
              />

              {/* Пучки хищных верхних ресниц */}
              <g fill="#09090b">
                <path d="M 50 142 Q 78 108 116 98 Q 98 105 68 128 Z" />
                <path d="M 106 100 Q 146 88 186 92 Q 156 97 126 108 Z" />
                <path d="M 176 92 Q 226 100 270 134 Q 238 114 196 100 Z" />
                <path d="M 260 130 Q 284 146 312 160 Q 290 152 268 138 Z" />
              </g>

              {/* Нижний ресничный край */}
              <g stroke="#09090b" strokeWidth="1.8" strokeLinecap="round">
                <line x1="80" y1="205" x2="74" y2="216" />
                <line x1="120" y1="223" x2="116" y2="236" />
                <line x1="170" y1="236" x2="170" y2="249" />
                <line x1="220" y1="223" x2="224" y2="236" />
                <line x1="260" y1="205" x2="266" y2="216" />
              </g>

              {/* ======================================================== */}
              {/* 10. ПРОБИВАЮЩАЯСЯ МОЛНИЯ ЧАКРЫ СКВОЗЬ НИЖНЕЕ ВЕКО         */}
              {/* ======================================================== */}
              <path 
                d="M 170 220 L 166 238 L 174 252 L 167 274 L 171 298" 
                fill="none" 
                stroke={familyMeta.lightningColor} 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                filter="url(#god-eye-bloom)" 
                style={{ animation: 'lightningFlicker 2.2s infinite ease-in-out' }}
              />

              {/* ======================================================== */}
              {/* 11. СФЕРИЧЕСКИЙ КИНЕМАТОГРАФИЧНЫЙ БЛИК РОГОВИЦЫ          */}
              {/* ======================================================== */}
              <g pointerEvents="none">
                {/* Главный блик света (сверху-слева) */}
                <ellipse cx={CX - 35} cy={CY - 40} rx="26" ry="14" fill="#ffffff" opacity="0.45" transform={`rotate(-32 ${CX - 35} ${CY - 40})`} />
                <circle cx={CX - 42} cy={CY - 45} r="6.5" fill="#ffffff" opacity="0.82" />
                {/* Вторичный влажный рефлекс (снизу-справа) */}
                <ellipse cx={CX + 38} cy={CY + 36} rx="16" ry="7" fill="#ffffff" opacity="0.22" transform={`rotate(-32 ${CX + 38} ${CY + 36})`} />
              </g>
            </svg>
          </div>
        </div>

        {/* ПЕРЕКЛЮЧАТЕЛЬ 5 УЗОРОВ ВМШ (ТОЛЬКО ДЛЯ ВЕЧНОГО МАНГЁКЁ) */}
        {currentEyeId === 'mangekyo' && (
          <div className="relative z-30 mb-2 flex flex-wrap items-center justify-center gap-1.5 bg-black/85 px-3 py-1.5 rounded-2xl border border-red-500/40 backdrop-blur-md shadow-xl">
            <span className="text-[10px] font-black text-red-400 mr-1 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              Каноничный узор ВМШ:
            </span>
            {[
              { id: 'sasuke', label: 'Саске (ВМШ)' },
              { id: 'itachi', label: 'Итачи' },
              { id: 'madara', label: 'Мадара (ВМШ)' },
              { id: 'kamui', label: 'Камуи' },
              { id: 'shisui', label: 'Шисуи' }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPattern(p.id);
                  triggerActivation('mangekyo', p.id);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedPattern === p.id 
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/50 scale-105' 
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* ПЕРЕКЛЮЧАТЕЛЬ ДЛЯ ПРОБУЖДЁННОГО РИННЕГАНА: САСКЕ (6 ТОМОЭ) ИЛИ КАГУЯ (9 ТОМОЭ) */}
        {currentEyeId === 'rinnegan_awakened' && (
          <div className="relative z-30 mb-2 flex items-center justify-center gap-1.5 bg-black/85 px-3.5 py-1.5 rounded-2xl border border-purple-500/40 backdrop-blur-md shadow-xl">
            <span className="text-[10px] font-black text-purple-400 mr-1 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Форма Пробуждения:
            </span>
            {[
              { id: 'sasuke', label: 'Риннеган Саске (6 томоэ)' },
              { id: 'kaguya', label: 'Ринне-Шаринган (9 томоэ)' }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedRinnePattern(p.id);
                  triggerActivation('rinnegan_awakened', p.id);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedRinnePattern === p.id 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/50 scale-105' 
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* ИНФО-КАРТОЧКА СТАДИИ (ХАРАКТЕРИСТИКИ, ПРЕДВИДЕНИЕ, УСИЛЕНИЕ) */}
        <div className="relative z-20 w-full max-w-lg bg-black/80 p-3 sm:p-4 rounded-2xl border border-white/15 backdrop-blur-md shadow-2xl text-left mt-1">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
            <div>
              <h3 className="text-base sm:text-lg font-black text-zinc-100 flex items-center gap-2">
                <span style={{ color: familyMeta.color }}>{dojutsuData?.icon || '👁️'}</span>
                <span>
                  {currentEyeId === 'rinnegan_awakened' 
                    ? (selectedRinnePattern === 'sasuke' ? 'Пробуждённый Риннеган Саске (6 томоэ)' : 'Ринне-Шаринган Кагуи (9 томоэ)')
                    : (dojutsuData?.name || familyMeta.name)}
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                {currentEyeId === 'rinnegan_awakened' && selectedRinnePattern === 'sasuke'
                  ? 'Каноничный левый глаз Саске Учиха от Мудреца Шести Путей. Ровно 6 томоэ на 2 кольцах. Техника мгновенной телепортации Аменотедзикара.'
                  : (currentEyeId === 'rinnegan_awakened' && selectedRinnePattern === 'kaguya'
                    ? 'Каноничное первородное алое око Кагуи Ооцуцуки и Мадары. Ровно 9 томоэ на 3 кольцах. Отражение на Луне для Бесконечного Цукуёми.'
                    : familyMeta.desc)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => triggerActivation(currentEyeId)}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-zinc-200 transition flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Повторить звук и 3D анимацию"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Звук 🎵</span>
            </button>
          </div>

          {/* 4 Боевых характеристики глаза */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs mb-2">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-zinc-400 block font-mono">ПРЕДВИДЕНИЕ</span>
              <span className="text-sm font-black text-cyan-300">+{dojutsuData.predvidenie || 0}%</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-zinc-400 block font-mono">ТОЧНОСТЬ</span>
              <span className="text-sm font-black text-emerald-300">+{dojutsuData.accuracy || 0}%</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-zinc-400 block font-mono">УСИЛЕНИЕ</span>
              <span className="text-sm font-black text-amber-300">+{dojutsuData.techniqueAmp || 0}%</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-zinc-400 block font-mono">РАСХОД</span>
              <span className="text-sm font-black text-rose-300">{(dojutsuData.upkeepNumber || 0).toLocaleString()} ед./ход</span>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed mb-3">
            {dojutsuData.desc}
          </p>

          {/* Панель: демонстрация сопернику */}
          <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleToggleAlwaysShow}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition cursor-pointer ${
                alwaysShowToOpponent 
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-sm' 
                  : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                alwaysShowToOpponent ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-zinc-500'
              }`}>
                {alwaysShowToOpponent && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <span>Показ сопернику в бою: {alwaysShowToOpponent ? 'ВКЛ' : 'ВЫКЛ'}</span>
            </button>

            {onShowToOpponent && (
              <button
                type="button"
                onClick={handleDemonstrate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-orange-600 hover:brightness-110 text-white font-black text-xs transition shadow-lg shadow-red-600/30 cursor-pointer active:scale-95"
              >
                <Eye className="w-4 h-4" />
                <span>Продемонстрировать сопернику</span>
              </button>
            )}

            {showDemonstrateNotice && (
              <div className="w-full text-center text-xs font-bold text-amber-300 animate-bounce mt-1">
                ⚡ Пробуждение ока отправлено на экран соперника!
              </div>
            )}
          </div>
        </div>

        {/* Кнопка закрытия */}
        <button
          type="button"
          onClick={onClose}
          className="mt-3 px-6 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white border border-white/20 text-xs font-bold transition cursor-pointer backdrop-blur-md"
        >
          Закрыть просмотр (Esc)
        </button>

      </div>
    </div>
  );
}
