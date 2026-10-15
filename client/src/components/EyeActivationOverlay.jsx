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
    secondaryColor: '#ff2a4b',
    coreColor: '#ffffff',
    bgAura: 'rgba(239, 68, 68, 0.65)',
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
    secondaryColor: '#38bdf8',
    coreColor: '#ffffff',
    bgAura: 'rgba(147, 197, 253, 0.65)',
    desc: 'Священное всевидящее око клана Хьюга. Круговой обзор 360°, видение 361 узла Тэнкэцу и поле Багуа 64 ладоней.',
    stages: [
      { id: 'byakugan_1', label: '1 этап (Базовый)', stageNum: 1, badge: 'Обзор 360°', desc: '1 фокусное кольцо. Первичные пульсирующие узлы, круговой обзор 360°.' },
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
    secondaryColor: '#e9d5ff',
    coreColor: '#ffffff',
    bgAura: 'rgba(192, 132, 252, 0.65)',
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
    secondaryColor: '#fef08a',
    coreColor: '#ffffff',
    bgAura: 'rgba(250, 204, 21, 0.65)',
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
    secondaryColor: '#67e8f9',
    coreColor: '#ffffff',
    bgAura: 'rgba(6, 182, 212, 0.65)',
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
    secondaryColor: '#bae6fd',
    coreColor: '#ffffff',
    bgAura: 'rgba(56, 189, 248, 0.65)',
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
  // Для ВМШ: 'itachi' | 'sasuke' | 'madara' | 'kamui' | 'shisui' (по умолчанию 'itachi' - как на эталоне Кирилла)
  const [selectedPattern, setSelectedPattern] = useState('itachi');
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
  const CX = 160;
  const CY = 160;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none animate-in fade-in duration-300"
      style={{ 
        background: `radial-gradient(circle at center, ${familyMeta.bgAura} 0%, rgba(6,7,10,0.97) 50%, #020305 100%)` 
      }}
    >
      {/* CSS-стили кинематографичного 3D-парения и органических эффектов */}
      <style>{`
        @keyframes eyeFloat3D {
          0%, 100% {
            transform: translateZ(0px) rotateX(2deg) rotateY(-1.5deg);
          }
          50% {
            transform: translateZ(28px) rotateX(-1.8deg) rotateY(2deg);
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
        @keyframes coronaPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.08); opacity: 0.95; filter: drop-shadow(0 0 35px ${familyMeta.color}); }
        }
        @keyframes starGlintTwinkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.85; }
          50% { transform: scale(1.35) rotate(45deg); opacity: 1; filter: drop-shadow(0 0 8px #ffffff); }
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full blur-[140px] opacity-45 transition-all duration-700"
          style={{ backgroundColor: familyMeta.color }}
        />
        {isAwakened && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] animate-pulse" />
        )}

        {/* Парящие угли чакры (Embers VFX) */}
        {Array.from({ length: 14 }).map((_, i) => {
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
                boxShadow: `0 0 10px ${familyMeta.color}`,
                animation: `emberDrift ${3 + (i % 3)}s infinite ease-out ${i * 0.35}s`,
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

      {/* ГЛАВНЫЙ 3D КОНТЕЙНЕР (Чистый мистический зрачок-артефакт) */}
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
            transform: 'translateZ(-100px)'
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

        {/* 3D СФЕРА ЗРАЧКА С АВТОНОМНЫМ КИНЕМАТОГРАФИЧНЫМ ПАРЕНИЕМ */}
        <div 
          className="relative my-2 sm:my-3 flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: isSurging ? 'translateZ(55px) scale(1.14)' : 'translateZ(0px) scale(1)',
            animation: isSurging ? 'none' : 'eyeFloat3D 6.5s ease-in-out infinite',
            transition: isSurging ? 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.6s ease-out'
          }}
        >
          {/* Внешняя плазменная корона чакры (Chakra Corona) */}
          <div 
            className="absolute -inset-8 sm:-inset-12 rounded-full opacity-70 blur-2xl transition-all duration-700 pointer-events-none"
            style={{ 
              backgroundColor: familyMeta.color,
              animation: 'coronaPulse 4s infinite ease-in-out',
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

          {/* SVG КИНЕМАТОГРАФИЧНЫЙ ЗРАЧОК / РАДУЖКА (ЧИСТЫЙ АРТЕФАКТ БЕЗ ВЕК И БЕЛКОВ) */}
          <div className="w-60 h-60 sm:w-76 sm:h-76 relative flex items-center justify-center rounded-full shadow-[0_0_95px_rgba(0,0,0,0.95)]">
            <svg 
              viewBox="0 0 320 320" 
              className="w-full h-full overflow-visible drop-shadow-[0_20px_50px_rgba(0,0,0,0.98)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* 1. HDR-СВЕЧЕНИЕ НЕОНОВЫХ ФАСОК И ЯДРА */}
                <filter id="chakra-neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur1" />
                  <feGaussianBlur in="SourceGraphic" stdDeviation="6.5" result="blur2" />
                  <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur3" />
                  <feMerge>
                    <feMergeNode in="blur3" />
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* 2. ТЕНЬ ПАРЕНИЯ ЛЕЗВИЙ НАД МАГМОЙ РАДУЖКИ (ПАРАЛЛАКС И ОБЪЁМ) */}
                <filter id="blade-floating-shadow" x="-40%" y="-40%" width="180%" height="180%">
                  <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#000000" floodOpacity="0.95" />
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#2a0208" floodOpacity="0.8" />
                </filter>

                {/* 3. ОБЪЁМНЫЙ РУБИНОВЫЙ КРИСТАЛЛИЧЕСКИЙ КУПОЛ (SUBSURFACE SCATTERING) */}
                <radialGradient id="ruby-crystal-dome" cx="44%" cy="40%" r="62%">
                  {familyKey === 'Sharingan' && (
                    <>
                      <stop offset="0%" stopColor="#ff5252" />
                      <stop offset="28%" stopColor="#ef4444" />
                      <stop offset="65%" stopColor="#991b1b" />
                      <stop offset="86%" stopColor="#450a0a" />
                      <stop offset="100%" stopColor="#140204" />
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
                          <stop offset="35%" stopColor="#f8fafc" />
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
                        <>
                          <stop offset="0%" stopColor="#ff5252" />
                          <stop offset="35%" stopColor="#dc2626" />
                          <stop offset="70%" stopColor="#991b1b" />
                          <stop offset="92%" stopColor="#450a0a" />
                          <stop offset="100%" stopColor="#1a0303" />
                        </>
                      ) : (
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

                {/* 4. ТЕЛО ОБСИДИАНОВОГО КЛИНКА */}
                <linearGradient id="obsidian-blade" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#27272a" />
                  <stop offset="35%" stopColor="#18181b" />
                  <stop offset="70%" stopColor="#09090b" />
                  <stop offset="100%" stopColor="#000000" />
                </linearGradient>

                {/* 5. РАСКАЛЁННОЕ ЯНТАРНО-БЕЛОЕ ЯДРО СИНГУЛЯРНОСТИ */}
                <radialGradient id="fusion-core-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#fef08a" />
                  <stop offset="65%" stopColor="#f59e0b" />
                  <stop offset="85%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#450a0a" />
                </radialGradient>

                {/* Металлический градиент лезвий ВМШ */}
                <linearGradient id="blade-steel" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#d4d4d8" />
                  <stop offset="60%" stopColor="#71717a" />
                  <stop offset="85%" stopColor="#27272a" />
                  <stop offset="100%" stopColor="#09090b" />
                </linearGradient>

                {/* Одиночное каноничное томоэ Шарингана */}
                <g id="tomoe-symbol">
                  <circle cx="0" cy="0" r="10" fill="url(#obsidian-blade)" stroke="#ff2a4b" strokeWidth="1.2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.9))" />
                  <path d="M -8 0 C -8 -13, 5 -18, 10 -28 C 7.5 -18, 3 -10, 0 -6.5 Z" fill="#09090b" stroke="#ffffff" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="3.2" fill="#ffffff" filter="drop-shadow(0 0 4px #ff1744)" />
                </g>

                {/* Томоэ Риннегана Саске с фиолетовой неоновой фаской */}
                <g id="rinnegan-tomoe-sasuke">
                  <circle cx="0" cy="0" r="9" fill="#0b0314" stroke="#a855f7" strokeWidth="1.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.95))" />
                  <path d="M -7.5 0 C -7.5 -11, 4.5 -15, 9.5 -24 C 7 -15, 2.5 -8.5, 0 -5.5 Z" fill="#0b0314" stroke="#e9d5ff" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="3" fill="#ffffff" filter="drop-shadow(0 0 5px #c084fc)" />
                </g>

                {/* Водная капля Аойгана */}
                <g id="aoigan-single-drop">
                  <path d="M 0 -26 C 12 -14, 14 0, 0 14 C -14 0, -12 -14, 0 -26 Z" fill="#083344" stroke="#67e8f9" strokeWidth="1.8" filter="url(#chakra-neon-glow)" />
                  <circle cx="0" cy="3" r="3.5" fill="#ffffff" />
                </g>

                {/* Разряд молнии Икадзутигана */}
                <g id="lightning-bolt-single">
                  <path d="M 0 -30 L -9 -9 L 2 -9 L -6 24 L 9 -3 L 0 -3 Z" fill="#0c4a6e" stroke="#ffffff" strokeWidth="1.8" strokeLinejoin="round" filter="url(#chakra-neon-glow)" />
                  <circle cx="0" cy="0" r="3" fill="#ffffff" />
                </g>
              </defs>

              {/* ======================================================== */}
              {/* ВНЕШНЯЯ ЛИМБАЛЬНАЯ ОГНЕННАЯ КАЙМА И ЦИФЕРБЛАТ            */}
              {/* ======================================================== */}
              <circle cx={CX} cy={CY} r="118" fill="none" stroke={familyMeta.color} strokeWidth="1.6" opacity="0.6" strokeDasharray="4 8" className="animate-spin" style={{ animationDuration: '30s', transformOrigin: `${CX}px ${CY}px` }} />
              <circle cx={CX} cy={CY} r="114" fill="none" stroke={familyMeta.secondaryColor} strokeWidth="2.5" opacity="0.85" filter="url(#chakra-neon-glow)" />

              {/* [Layer 1] БАЗОВЫЙ 3D-КУПОЛ РУБИНОВОГО КРИСТАЛЛА */}
              <circle 
                cx={CX} 
                cy={CY} 
                r="110" 
                fill="url(#ruby-crystal-dome)" 
                stroke="#09090b" 
                strokeWidth="4" 
              />

              {/* [Layer 2] КРИСТАЛЛИЧЕСКИЕ ВОЛОКНА РАДУЖКИ (64 РАДИАЛЬНЫХ СТРУНЫ) */}
              <g opacity="0.4" stroke="#ffffff" strokeLinecap="round">
                {Array.from({ length: 64 }).map((_, i) => {
                  const angle = (i * 5.625 * Math.PI) / 180;
                  const r1 = 26 + (i % 3) * 6;
                  const r2 = 106 - (i % 2) * 5;
                  return (
                    <line
                      key={i}
                      x1={CX + Math.cos(angle) * r1}
                      y1={CY + Math.sin(angle) * r1}
                      x2={CX + Math.cos(angle) * r2}
                      y2={CY + Math.sin(angle) * r2}
                      strokeWidth={i % 4 === 0 ? 1.2 : 0.55}
                      stroke={i % 4 === 0 ? "#ffffff" : familyMeta.secondaryColor}
                    />
                  );
                })}
              </g>

              {/* ВНУТРЕННИЕ ТОНКИЕ КООРДИНАТНЫЕ КОЛЬЦА ФУИНДЗЮЦУ */}
              <circle cx={CX} cy={CY} r="94" fill="none" stroke={familyMeta.secondaryColor} strokeWidth="0.8" opacity="0.5" strokeDasharray="6 4" />
              <circle cx={CX} cy={CY} r="50" fill="none" stroke={familyMeta.secondaryColor} strokeWidth="0.8" opacity="0.4" />

              {/* [Layer 3] ВНУТРЕННИЕ МИКРОДУГИ И МОЛНИИ ЧАКРЫ В ТОЛЩЕ РАДУЖКИ */}
              <g opacity="0.75" filter="url(#chakra-neon-glow)">
                <path d="M 115 135 Q 132 155 128 178 Q 146 188 156 172" fill="none" stroke="#ffffff" strokeWidth="0.9" />
                <path d="M 205 125 Q 188 145 192 168 Q 180 185 170 195" fill="none" stroke={familyMeta.secondaryColor} strokeWidth="0.8" />
              </g>

              {/* ======================================================== */}
              {/* ВРАЩАЮЩАЯСЯ СИСТЕМА ЛЕЗВИЙ С ЭФФЕКТОМ ПАРЕНИЯ И НЕОНА     */}
              {/* ======================================================== */}
              <g 
                className={isSpinning ? 'animate-spin' : ''} 
                style={{ transformOrigin: `${CX}px ${CY}px`, animationDuration: isSpinning ? '2s' : '9s' }}
              >
                
                {/* 1. БЬЯКУГАН (ТРИГРАММЫ, УЗЛЫ ТЭНКЭЦУ, ИНЬ-ЯН, ТЭНСЭЙГАН) */}
                {familyKey === 'Byakugan' && (
                  <g>
                    {currentEyeId === 'byakugan_1' && (
                      <g>
                        <circle cx={CX} cy={CY} r="74" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="8 6" filter="url(#chakra-neon-glow)" />
                        <line x1={CX} y1={CY - 96} x2={CX} y2={CY - 74} stroke="#ffffff" strokeWidth="2.5" />
                        <line x1={CX} y1={CY + 74} x2={CX} y2={CY + 96} stroke="#ffffff" strokeWidth="2.5" />
                        <line x1={CX - 96} y1={CY} x2={CX - 74} y2={CY} stroke="#ffffff" strokeWidth="2.5" />
                        <line x1={CX + 74} y1={CY} x2={CX + 96} y2={CY} stroke="#ffffff" strokeWidth="2.5" />
                      </g>
                    )}

                    {currentEyeId === 'byakugan_2' && (
                      <g>
                        <circle cx={CX} cy={CY} r="82" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="10 5" opacity="0.85" />
                        <circle cx={CX} cy={CY} r="54" fill="none" stroke="#ffffff" strokeWidth="1.8" opacity="0.9" filter="url(#chakra-neon-glow)" />
                        {Array.from({ length: 16 }).map((_, i) => {
                          const angle = (i * 22.5 * Math.PI) / 180;
                          const cx = CX + Math.cos(angle) * 54;
                          const cy = CY + Math.sin(angle) * 54;
                          return (
                            <g key={i}>
                              <circle cx={cx} cy={cy} r="3.6" fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff)" />
                              <circle cx={cx} cy={cy} r="1.8" fill="#0284c7" />
                            </g>
                          );
                        })}
                      </g>
                    )}

                    {currentEyeId === 'byakugan_3' && (
                      <g>
                        <circle cx={CX} cy={CY} r="88" fill="none" stroke="#38bdf8" strokeWidth="2.5" opacity="0.9" />
                        <circle cx={CX} cy={CY} r="64" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="12 4" filter="url(#chakra-neon-glow)" />
                        <circle cx={CX} cy={CY} r="42" fill="none" stroke="#93c5fd" strokeWidth="2" opacity="0.9" />

                        {/* 8 Триграмм Багуа */}
                        <g stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" filter="drop-shadow(0 0 3px #38bdf8)">
                          <g transform={`translate(${CX}, ${CY - 74})`}>
                            <line x1="-10" y1="-5" x2="10" y2="-5" /><line x1="-10" y1="0" x2="10" y2="0" /><line x1="-10" y1="5" x2="10" y2="5" />
                          </g>
                          <g transform={`translate(${CX}, ${CY + 74})`}>
                            <line x1="-10" y1="-5" x2="-2" y2="-5" /><line x1="2" y1="-5" x2="10" y2="-5" />
                            <line x1="-10" y1="0" x2="-2" y2="0" /><line x1="2" y1="0" x2="10" y2="0" />
                            <line x1="-10" y1="5" x2="-2" y2="5" /><line x1="2" y1="5" x2="10" y2="5" />
                          </g>
                          <g transform={`translate(${CX + 74}, ${CY})`}>
                            <line x1="-10" y1="-5" x2="10" y2="-5" />
                            <line x1="-10" y1="0" x2="-2" y2="0" /><line x1="2" y1="0" x2="10" y2="0" />
                            <line x1="-10" y1="5" x2="10" y2="5" />
                          </g>
                          <g transform={`translate(${CX - 74}, ${CY})`}>
                            <line x1="-10" y1="-5" x2="-2" y2="-5" /><line x1="2" y1="-5" x2="10" y2="-5" />
                            <line x1="-10" y1="0" x2="10" y2="0" />
                            <line x1="-10" y1="5" x2="-2" y2="5" /><line x1="2" y1="5" x2="10" y2="5" />
                          </g>
                        </g>

                        {/* Инь-Ян Тайцзи */}
                        <g transform={`translate(${CX}, ${CY})`}>
                          <circle cx="0" cy="0" r="20" fill="#f8fafc" stroke="#38bdf8" strokeWidth="1.5" />
                          <path d="M 0 -20 A 20 20 0 0 1 0 20 A 10 10 0 0 1 0 0 A 10 10 0 0 0 0 -20 Z" fill="#0369a1" />
                          <circle cx="0" cy="-10" r="3.5" fill="#f8fafc" />
                          <circle cx="0" cy="10" r="3.5" fill="#0369a1" />
                        </g>
                      </g>
                    )}

                    {currentEyeId === 'byakugan_awakened' && (
                      <g>
                        <polygon points={`${CX},${CY-100} ${CX+16},${CY-20} ${CX+100},${CY} ${CX+16},${CY+20} ${CX},${CY+100} ${CX-16},${CY+20} ${CX-100},${CY} ${CX-16},${CY-20}`} fill="#ffffff" opacity="0.8" filter="drop-shadow(0 0 12px #a5f3fc)" />
                        {Array.from({ length: 8 }).map((_, i) => (
                          <g key={i} transform={`translate(${CX}, ${CY}) rotate(${i * 45})`}>
                            <path d="M 0 0 C 12 -20, 16 -40, 0 -55 C -16 -40, -12 -20, 0 0 Z" fill="#ffffff" stroke="#0891b2" strokeWidth="1.5" opacity="0.95" filter="url(#chakra-neon-glow)" />
                            <circle cx="0" cy="-35" r="3.5" fill="#06b6d4" />
                          </g>
                        ))}
                      </g>
                    )}
                  </g>
                )}

                {/* 2. РИННЕГАН (ШЕСТЬ ПУТЕЙ, САСКЕ 6 ТОМОЭ И КАГУЯ 9 ТОМОЭ) */}
                {familyKey === 'Rinnegan' && (
                  <g>
                    <circle cx={CX} cy={CY} r="96" fill="none" stroke={selectedRinnePattern === 'kaguya' && currentEyeId === 'rinnegan_awakened' ? '#450a0a' : '#2e1065'} strokeWidth="3" />
                    <circle cx={CX} cy={CY} r="78" fill="none" stroke={selectedRinnePattern === 'kaguya' && currentEyeId === 'rinnegan_awakened' ? '#7f1d1d' : '#3b0764'} strokeWidth="3" />
                    <circle cx={CX} cy={CY} r="60" fill="none" stroke={selectedRinnePattern === 'kaguya' && currentEyeId === 'rinnegan_awakened' ? '#450a0a' : '#2e1065'} strokeWidth="3" />
                    <circle cx={CX} cy={CY} r="44" fill="none" stroke={selectedRinnePattern === 'kaguya' && currentEyeId === 'rinnegan_awakened' ? '#7f1d1d' : '#3b0764'} strokeWidth="3" />
                    <circle cx={CX} cy={CY} r="28" fill="none" stroke={selectedRinnePattern === 'kaguya' && currentEyeId === 'rinnegan_awakened' ? '#450a0a' : '#2e1065'} strokeWidth="3" />

                    {currentEyeId === 'rinnegan_awakened' && selectedRinnePattern === 'sasuke' && (
                      <g>
                        {/* 3 томоэ на внутреннем кольце (радиус 44) под 0°, 120°, 240° */}
                        <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -44) scale(0.85)"><use href="#rinnegan-tomoe-sasuke" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(120)`}><g transform="translate(0, -44) scale(0.85)"><use href="#rinnegan-tomoe-sasuke" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(240)`}><g transform="translate(0, -44) scale(0.85)"><use href="#rinnegan-tomoe-sasuke" /></g></g>

                        {/* 3 томоэ на внешнем кольце (радиус 78) под 60°, 180°, 300° */}
                        <g transform={`translate(${CX}, ${CY}) rotate(60)`}><g transform="translate(0, -78) scale(0.85)"><use href="#rinnegan-tomoe-sasuke" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(180)`}><g transform="translate(0, -78) scale(0.85)"><use href="#rinnegan-tomoe-sasuke" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(300)`}><g transform="translate(0, -78) scale(0.85)"><use href="#rinnegan-tomoe-sasuke" /></g></g>
                      </g>
                    )}

                    {currentEyeId === 'rinnegan_awakened' && selectedRinnePattern === 'kaguya' && (
                      <g>
                        <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -44) scale(0.8)"><use href="#tomoe-symbol" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(120)`}><g transform="translate(0, -44) scale(0.8)"><use href="#tomoe-symbol" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(240)`}><g transform="translate(0, -44) scale(0.8)"><use href="#tomoe-symbol" /></g></g>

                        <g transform={`translate(${CX}, ${CY}) rotate(60)`}><g transform="translate(0, -60) scale(0.8)"><use href="#tomoe-symbol" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(180)`}><g transform="translate(0, -60) scale(0.8)"><use href="#tomoe-symbol" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(300)`}><g transform="translate(0, -60) scale(0.8)"><use href="#tomoe-symbol" /></g></g>

                        <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -78) scale(0.8)"><use href="#tomoe-symbol" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(120)`}><g transform="translate(0, -78) scale(0.8)"><use href="#tomoe-symbol" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(240)`}><g transform="translate(0, -78) scale(0.8)"><use href="#tomoe-symbol" /></g></g>
                      </g>
                    )}
                  </g>
                )}

                {/* 3. КИНГАН, АОЙГАН, ИКАДЗУТИГАН */}
                {familyKey === 'Kingan' && (
                  <g>
                    {(currentEyeId === 'kingan_1' || currentEyeId === 'kingan_2' || currentEyeId === 'kingan_3' || currentEyeId === 'kingan_awakened') && (
                      <circle cx={CX} cy={CY} r="40" fill="none" stroke="#fef08a" strokeWidth="3" strokeDasharray="18 10" filter="url(#chakra-neon-glow)" />
                    )}
                    {(currentEyeId === 'kingan_2' || currentEyeId === 'kingan_3' || currentEyeId === 'kingan_awakened') && (
                      <circle cx={CX} cy={CY} r="65" fill="none" stroke="#fde047" strokeWidth="3" strokeDasharray="14 8" filter="url(#chakra-neon-glow)" />
                    )}
                    {(currentEyeId === 'kingan_3' || currentEyeId === 'kingan_awakened') && (
                      <circle cx={CX} cy={CY} r="90" fill="none" stroke="#facc15" strokeWidth="3" strokeDasharray="26 12" filter="url(#chakra-neon-glow)" />
                    )}
                    {currentEyeId === 'kingan_awakened' && (
                      <polygon points={`${CX},${CY-90} ${CX+25},${CY-25} ${CX+90},${CY} ${CX+25},${CY+25} ${CX},${CY+90} ${CX-25},${CY+25} ${CX-90},${CY} ${CX-25},${CY-25}`} fill="none" stroke="#ffffff" strokeWidth="3" filter="drop-shadow(0 0 10px #fef08a)" />
                    )}
                  </g>
                )}

                {familyKey === 'Aoigan' && (
                  <g>
                    <circle cx={CX} cy={CY} r="85" fill="none" stroke="#083344" strokeWidth="3" opacity="0.8" />
                    <circle cx={CX} cy={CY} r="60" fill="none" stroke="#0891b2" strokeWidth="2.2" strokeDasharray="8 6" />
                    {currentEyeId === 'aoigan_1' && <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -60)"><use href="#aoigan-single-drop" /></g></g>}
                    {currentEyeId === 'aoigan_2' && (
                      <>
                        <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -60)"><use href="#aoigan-single-drop" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(180)`}><g transform="translate(0, -60)"><use href="#aoigan-single-drop" /></g></g>
                      </>
                    )}
                    {(currentEyeId === 'aoigan_3' || currentEyeId === 'aoigan_awakened') && (
                      <>
                        <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -60)"><use href="#aoigan-single-drop" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(120)`}><g transform="translate(0, -60)"><use href="#aoigan-single-drop" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(240)`}><g transform="translate(0, -60)"><use href="#aoigan-single-drop" /></g></g>
                      </>
                    )}
                    {currentEyeId === 'aoigan_awakened' && (
                      <circle cx={CX} cy={CY} r="80" fill="none" stroke="#22d3ee" strokeWidth="3.5" strokeDasharray="28 12" filter="url(#chakra-neon-glow)" />
                    )}
                  </g>
                )}

                {familyKey === 'Ikadzutigan' && (
                  <g>
                    <circle cx={CX} cy={CY} r="84" fill="none" stroke="#075985" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.8" />
                    {currentEyeId === 'ikadzutigan_1' && <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -60)"><use href="#lightning-bolt-single" /></g></g>}
                    {currentEyeId === 'ikadzutigan_2' && (
                      <>
                        <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -60)"><use href="#lightning-bolt-single" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(180)`}><g transform="translate(0, -60)"><use href="#lightning-bolt-single" /></g></g>
                      </>
                    )}
                    {(currentEyeId === 'ikadzutigan_3' || currentEyeId === 'ikadzutigan_awakened') && (
                      <>
                        <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -60)"><use href="#lightning-bolt-single" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(120)`}><g transform="translate(0, -60)"><use href="#lightning-bolt-single" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(240)`}><g transform="translate(0, -60)"><use href="#lightning-bolt-single" /></g></g>
                      </>
                    )}
                    {currentEyeId === 'ikadzutigan_awakened' && (
                      <path d={`M ${CX-50} ${CY-50} L ${CX} ${CY-95} L ${CX+50} ${CY-50} L ${CX+95} ${CY} L ${CX+50} ${CY+50} L ${CX} ${CY+95} L ${CX-50} ${CY+50} L ${CX-95} ${CY} Z`} fill="none" stroke="#ffffff" strokeWidth="3" filter="drop-shadow(0 0 12px #7dd3fc)" />
                    )}
                  </g>
                )}

                {/* 4. ШАРИНГАН (1, 2, 3 ТОМОЭ И ВМШ) */}
                {familyKey === 'Sharingan' && (
                  <g>
                    <circle cx={CX} cy={CY} r="64" fill="none" stroke="#09090b" strokeWidth="3" opacity="0.9" />

                    {/* 1, 2, 3 ТОМОЭ */}
                    {currentEyeId === 'sharingan_1' && (
                      <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -64)"><use href="#tomoe-symbol" /></g></g>
                    )}
                    {currentEyeId === 'sharingan_2' && (
                      <>
                        <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -64)"><use href="#tomoe-symbol" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(180)`}><g transform="translate(0, -64)"><use href="#tomoe-symbol" /></g></g>
                      </>
                    )}
                    {currentEyeId === 'sharingan_3' && (
                      <>
                        <g transform={`translate(${CX}, ${CY}) rotate(0)`}><g transform="translate(0, -64)"><use href="#tomoe-symbol" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(120)`}><g transform="translate(0, -64)"><use href="#tomoe-symbol" /></g></g>
                        <g transform={`translate(${CX}, ${CY}) rotate(240)`}><g transform="translate(0, -64)"><use href="#tomoe-symbol" /></g></g>
                      </>
                    )}

                    {/* ВМШ: 5 СВЕРХДЕТАЛИЗИРОВАННЫХ УЗОРОВ С НЕОНОВЫМИ ФАСКАМИ И ТЕНЬЮ ПАРЕНИЯ */}
                    {currentEyeId === 'mangekyo' && (
                      <g>
                        
                        {/* ФОРМА 1: ИТАЧИ (В ТОЧНОСТИ КАК НА НОВОМ ЭТАЛОНЕ КИРИЛЛА!) */}
                        {selectedPattern === 'itachi' && (
                          <g>
                            {[0, 120, 240].map((deg) => (
                              <g key={deg} transform={`translate(${CX}, ${CY}) rotate(${deg})`}>
                                {/* Тень парения (Drop Shadow над светящимся дном) */}
                                <path
                                  d="M 0 0 C 35 -30, 80 -40, 60 -88 C 30 -66, 8 -30, 0 0 Z"
                                  fill="black"
                                  filter="url(#blade-floating-shadow)"
                                />
                                {/* Тело обсидианового клинка */}
                                <path
                                  d="M 0 0 C 35 -30, 80 -40, 60 -88 C 30 -66, 8 -30, 0 0 Z"
                                  fill="url(#obsidian-blade)"
                                  stroke="#1c0306"
                                  strokeWidth="1.5"
                                />
                                {/* Внутренний кровавый рельеф в клинке */}
                                <path
                                  d="M 0 0 C 22 -20, 52 -28, 42 -62"
                                  fill="none"
                                  stroke="#b91c1c"
                                  strokeWidth="2.5"
                                  opacity="0.85"
                                />
                                {/* Огненная неоновая фаска (бело-коралловый светящийся контур) */}
                                <path
                                  d="M 60 -88 C 30 -66, 8 -30, 0 0"
                                  fill="none"
                                  stroke="#ffffff"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  filter="url(#chakra-neon-glow)"
                                />
                                <path
                                  d="M 0 0 C 35 -30, 80 -40, 60 -88"
                                  fill="none"
                                  stroke="#ff3b5c"
                                  strokeWidth="1.4"
                                  opacity="0.9"
                                />
                                <circle cx="50" cy="-64" r="5" fill="#09090b" stroke="#ef4444" strokeWidth="1.5" />
                                <circle cx="50" cy="-64" r="2.2" fill="#ffffff" filter="drop-shadow(0 0 4px #ff1f44)" />
                              </g>
                            ))}
                          </g>
                        )}

                        {/* ФОРМА 2: САСКЕ (ВМШ СЛИЯНИЕ — 6 КЛИНКОВ + ПРЯМЫЕ ЛУЧИ + ДВОЙНЫЕ КОЛЬЦА) */}
                        {selectedPattern === 'sasuke' && (
                          <g>
                            <circle cx={CX} cy={CY} r="60" fill="none" stroke="#ff3355" strokeWidth="1.4" opacity="0.9" filter="url(#chakra-neon-glow)" />
                            <circle cx={CX} cy={CY} r="38" fill="none" stroke="#ff3355" strokeWidth="1" opacity="0.75" />

                            {[0, 60, 120, 180, 240, 300].map(deg => (
                              <g key={`scythe-${deg}`} transform={`translate(${CX}, ${CY}) rotate(${deg})`}>
                                <path 
                                  d="M 0 0 C 14 -12, 34 -22, 58 -16 C 50 -42, 24 -60, -6 -70 C 4 -46, 8 -22, 0 0 Z" 
                                  fill="black" 
                                  filter="url(#blade-floating-shadow)"
                                />
                                <path 
                                  d="M 0 0 C 14 -12, 34 -22, 58 -16 C 50 -42, 24 -60, -6 -70 C 4 -46, 8 -22, 0 0 Z" 
                                  fill="url(#obsidian-blade)" 
                                  stroke="#3b0208" 
                                  strokeWidth="1.5"
                                />
                                {/* Неоновое лезвие */}
                                <path 
                                  d="M 0 0 C 10 -10, 28 -18, 52 -14 C 40 -36, 18 -52, -6 -70" 
                                  fill="none" 
                                  stroke="#ffffff" 
                                  strokeWidth="1.8" 
                                  strokeLinecap="round" 
                                  filter="url(#chakra-neon-glow)"
                                />
                                <circle cx="28" cy="-35" r="2.6" fill="#ff1744" filter="drop-shadow(0 0 3px #ffffff)" />
                              </g>
                            ))}
                          </g>
                        )}

                        {/* ФОРМА 3: МАДАРА (ВМШ — 3 ПЕТЛИ + ЛЕЗВИЯ ИЗУНЫ) */}
                        {selectedPattern === 'madara' && (
                          <g>
                            <circle cx={CX} cy={CY} r="74" fill="none" stroke="#09090b" strokeWidth="9" filter="url(#blade-floating-shadow)" />
                            <circle cx={CX} cy={CY} r="74" fill="none" stroke="#ffffff" strokeWidth="1.8" opacity="0.8" filter="url(#chakra-neon-glow)" />
                            {[0, 120, 240].map(deg => (
                              <g key={`loop-${deg}`} transform={`translate(${CX}, ${CY}) rotate(${deg})`}>
                                <circle cx="0" cy="-48" r="18" fill="#ef4444" stroke="#09090b" strokeWidth="8" filter="url(#blade-floating-shadow)" />
                                <circle cx="0" cy="-48" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" filter="url(#chakra-neon-glow)" />
                                <path d="M 0 0 L 0 -30" stroke="#09090b" strokeWidth="10" strokeLinecap="round" />
                              </g>
                            ))}
                            {[60, 180, 300].map(deg => (
                              <g key={`izuna-${deg}`} transform={`translate(${CX}, ${CY}) rotate(${deg})`}>
                                <polygon points="0,0 10,-38 0,-85 -10,-38" fill="url(#obsidian-blade)" stroke="#450a0a" strokeWidth="1.4" filter="url(#blade-floating-shadow)" />
                                <line x1="0" y1="0" x2="0" y2="-80" stroke="#ffffff" strokeWidth="1.6" filter="url(#chakra-neon-glow)" />
                              </g>
                            ))}
                          </g>
                        )}

                        {/* ФОРМА 4: КАМУИ (ПРОСТРАНСТВЕННЫЙ ВИХРЬ ОБИТО / КАКАШИ) */}
                        {selectedPattern === 'kamui' && (
                          <g>
                            {[0, 120, 240].map(deg => (
                              <g key={deg} transform={`translate(${CX}, ${CY}) rotate(${deg})`}>
                                <path 
                                  d="M 0 0 C 42 -8, 78 -38, 72 -84 C 44 -62, 16 -36, 0 0 Z" 
                                  fill="black" 
                                  filter="url(#blade-floating-shadow)"
                                />
                                <path 
                                  d="M 0 0 C 42 -8, 78 -38, 72 -84 C 44 -62, 16 -36, 0 0 Z" 
                                  fill="url(#obsidian-blade)" 
                                  stroke="#3b0208" 
                                  strokeWidth="2" 
                                />
                                <path 
                                  d="M 0 0 C 30 -6, 56 -26, 54 -62" 
                                  stroke="#ffffff" 
                                  strokeWidth="1.8" 
                                  fill="none" 
                                  filter="url(#chakra-neon-glow)"
                                />
                                <circle cx="54" cy="-56" r="6" fill="#f87171" filter="drop-shadow(0 0 5px #ff1744)" />
                              </g>
                            ))}
                          </g>
                        )}

                        {/* ФОРМА 5: ШИСУИ (КОТОАМАЦУКАМИ) */}
                        {selectedPattern === 'shisui' && (
                          <g>
                            {[0, 90, 180, 270].map(deg => (
                              <g key={deg} transform={`translate(${CX}, ${CY}) rotate(${deg})`}>
                                <path 
                                  d="M 0 0 C 22 -22, 58 -30, 48 -76 C 24 -54, 6 -22, 0 0 Z" 
                                  fill="black" 
                                  filter="url(#blade-floating-shadow)"
                                />
                                <path 
                                  d="M 0 0 C 22 -22, 58 -30, 48 -76 C 24 -54, 6 -22, 0 0 Z" 
                                  fill="url(#obsidian-blade)" 
                                  stroke="#450a0a" 
                                  strokeWidth="1.8"
                                />
                                <line x1="0" y1="0" x2="38" y2="-54" stroke="#ffffff" strokeWidth="1.6" filter="url(#chakra-neon-glow)" />
                                <circle cx="36" cy="-50" r="5" fill="#ef4444" filter="drop-shadow(0 0 5px #ffffff)" />
                              </g>
                            ))}
                          </g>
                        )}

                        {/* [Layer 8A] ОСПЕПИТЕЛЬНЫЙ СПЕКУЛЯРНЫЙ БЛИК-ЗВЕЗДА (STAR GLINT НА КЛИНКЕ КАК В ЭТАЛОНЕ) */}
                        <g transform={`translate(${CX + 35}, ${CY - 58})`} pointerEvents="none" style={{ animation: 'starGlintTwinkle 3.2s infinite ease-in-out' }}>
                          <polygon points="0,-16 2.5,-3 16,0 2.5,3 0,16 -2.5,3 -16,0 -2.5,-3" fill="#ffffff" filter="drop-shadow(0 0 8px #ffffff)" />
                          <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
                          <circle cx="0" cy="0" r="8" fill="#ff4d6d" opacity="0.6" filter="url(#chakra-neon-glow)" />
                        </g>

                      </g>
                    )}
                  </g>
                )}

              </g>

              {/* ======================================================== */}
              {/* [Layer 7] ТЕРМОЯДЕРНОЕ ЯНТАРНО-БЕЛОЕ ЯДРО В ЭПИЦЕНТРЕ   */}
              {/* ======================================================== */}
              <g transform={`translate(${CX}, ${CY})`} pointerEvents="none">
                <circle cx="0" cy="0" r="22" fill="#09090b" stroke="#7f1d1d" strokeWidth="3" />
                <circle cx="0" cy="0" r="16" fill="url(#fusion-core-grad)" filter="url(#chakra-neon-glow)" />
                <circle cx="0" cy="0" r="7" fill="#ffffff" filter="drop-shadow(0 0 8px #ffffff)" />
              </g>

              {/* ======================================================== */}
              {/* [Layer 8B] СПЕКУЛЯРНЫЙ БЛИК КРИСТАЛЬНОГО КУПОЛА РОГОВИЦЫ */}
              {/* ======================================================== */}
              <g pointerEvents="none">
                <path
                  d={`M ${CX - 55} ${CY - 75} C ${CX - 25} ${CY - 95}, ${CX + 25} ${CY - 95}, ${CX + 55} ${CY - 75} C ${CX + 30} ${CY - 84}, ${CX - 30} ${CY - 84}, ${CX - 55} ${CY - 75} Z`}
                  fill="#ffffff"
                  opacity="0.5"
                  filter="drop-shadow(0 0 4px #ffffff)"
                />
                <circle cx={CX - 42} cy={CY - 62} r="6.5" fill="#ffffff" opacity="0.75" />
                <ellipse cx={CX + 45} cy={CY + 65} rx="28" ry="7" fill="#ffffff" opacity="0.22" transform={`rotate(-25 ${CX + 45} ${CY + 65})`} />
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
              { id: 'itachi', label: 'Итачи (Эталон)' },
              { id: 'sasuke', label: 'Саске (ВМШ)' },
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
        <div className="relative z-20 w-full max-w-lg bg-black/85 p-3 sm:p-4 rounded-2xl border border-white/15 backdrop-blur-md shadow-2xl text-left mt-1">
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
