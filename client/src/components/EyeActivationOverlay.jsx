import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, Eye, Zap, Flame, Sparkles, Volume2, Check, Moon, Shield, Award
} from 'lucide-react';
import { audioManager } from '../utils/audioManager';
import { DOJUTSU_OPTIONS, getDojutsuById } from '../data/dojutsuData';
import GlassSharinganOrb, { MANGEKYO_LIST } from './GlassSharinganOrb';

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
  initialPattern = null,
  autoDismissMs = 0
}) {
  const [currentEyeId, setCurrentEyeId] = useState(dojutsuId);
  // Для ВМШ: 8 каноничных узоров персонажей
  const [selectedPattern, setSelectedPattern] = useState(
    initialPattern && MANGEKYO_LIST.some(m => m.id === initialPattern) ? initialPattern : 'sasuke_ems'
  );
  // Для Пробуждённого Риннегана: 'sasuke' (6 томоэ Саске) | 'kaguya' (9 томоэ Кагуи / Мадары)
  const [selectedRinnePattern, setSelectedRinnePattern] = useState(
    initialPattern === 'kaguya' || initialPattern === 'rinne_sharingan' ? 'kaguya' : 'sasuke'
  );
  
  const [isSpinning, setIsSpinning] = useState(true);
  const [isSurging, setIsSurging] = useState(false);
  const [showDemonstrateNotice, setShowDemonstrateNotice] = useState(false);
  const [alwaysShowToOpponent, setAlwaysShowToOpponent] = useState(() => {
    return localStorage.getItem('naruto_always_show_eye_opponent') === 'true';
  });

  const containerRef = useRef(null);
  const spinTimerRef = useRef(null);
  const surgeTimerRef = useRef(null);

  const familyKey = resolveDojutsuFamily(currentEyeId);
  const familyMeta = DOJUTSU_FAMILIES_META[familyKey] || DOJUTSU_FAMILIES_META.Sharingan;
  const dojutsuData = getDojutsuById(currentEyeId) || DOJUTSU_OPTIONS.find(d => d.id === currentEyeId) || DOJUTSU_OPTIONS[3];

  const activePatternProp = useMemo(() => {
    if (familyKey === 'Sharingan') {
      if (currentEyeId === 'mangekyo') return selectedPattern;
      return currentEyeId; // 'sharingan_1', 'sharingan_2', 'sharingan_3'
    }
    if (familyKey === 'Rinnegan') {
      if (currentEyeId === 'rinnegan_awakened') {
        return selectedRinnePattern === 'kaguya' ? 'rinne_sharingan' : 'sasuke';
      }
      return 'rinnegan';
    }
    return currentEyeId;
  }, [currentEyeId, familyKey, selectedPattern, selectedRinnePattern]);

  // Звук и 3D импульс при смене формы или узора
  const triggerActivation = (eyeIdToPlay, subPat = null, customFamKey = null) => {
    if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
    if (surgeTimerRef.current) clearTimeout(surgeTimerRef.current);

    setIsSpinning(true);
    setIsSurging(true);
    
    const targetFamKey = customFamKey || resolveDojutsuFamily(eyeIdToPlay);
    const activePat = subPat !== null 
      ? subPat 
      : (targetFamKey === 'Rinnegan' 
          ? (selectedRinnePattern === 'kaguya' ? 'rinne_sharingan' : selectedRinnePattern) 
          : (targetFamKey === 'Sharingan' && eyeIdToPlay === 'mangekyo' ? selectedPattern : eyeIdToPlay));

    audioManager.playEyeSound(eyeIdToPlay, targetFamKey, activePat);

    spinTimerRef.current = setTimeout(() => setIsSpinning(false), 2400);
    surgeTimerRef.current = setTimeout(() => setIsSurging(false), 520);
  };

  // Синхронизация при открытии
  useEffect(() => {
    if (isOpen) {
      setCurrentEyeId(dojutsuId);
      if (initialPattern) {
        if (initialPattern === 'kaguya' || initialPattern === 'rinne_sharingan') {
          setSelectedRinnePattern('kaguya');
        } else if (MANGEKYO_LIST.some(m => m.id === initialPattern)) {
          setSelectedPattern(initialPattern);
        }
      }
      triggerActivation(dojutsuId, initialPattern);
    }
    return () => {
      if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
      if (surgeTimerRef.current) clearTimeout(surgeTimerRef.current);
    };
  }, [isOpen, dojutsuId, initialPattern]);

  useEffect(() => {
    if (!isOpen || autoDismissMs <= 0) return;
    const dismissTimer = setTimeout(() => {
      onClose?.();
    }, autoDismissMs);
    return () => clearTimeout(dismissTimer);
  }, [isOpen, autoDismissMs, onClose]);

  if (!isOpen) return null;

  // Смена семейства глаз (Шаринган, Бьякуган, Риннеган, Кинган, Аойган, Икадзутиган)
  const handleSelectFamily = (famKey) => {
    const meta = DOJUTSU_FAMILIES_META[famKey];
    if (!meta) return;
    const targetStage = meta.stages[meta.stages.length - 1].id;
    setCurrentEyeId(targetStage);
    triggerActivation(targetStage, null, famKey);
  };

  // Смена ступени внутри семейства
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
      const displayName = currentEyeId === 'mangekyo'
        ? activeMangekyo.name
        : (currentEyeId === 'rinnegan_awakened'
            ? (selectedRinnePattern === 'kaguya' ? 'Ринне-Шаринган (9 томоэ)' : 'Пробуждённый Риннеган Саске (6 томоэ)')
            : (dojutsuData?.name || familyMeta.name));

      onShowToOpponent({
        dojutsuId: currentEyeId,
        dojutsuName: displayName,
        pattern: activePatternProp,
        family: selectedRinnePattern === 'kaguya' && currentEyeId === 'rinnegan_awakened' ? 'Rinne_Sharingan' : familyKey
      });
      setShowDemonstrateNotice(true);
      setTimeout(() => setShowDemonstrateNotice(false), 2600);
    }
  };

  const isAwakened = currentEyeId.includes('awakened') || currentEyeId === 'mangekyo';
  const activeMangekyo = MANGEKYO_LIST.find(m => m.id === selectedPattern) || MANGEKYO_LIST[0];
  const isKaguyaRinne = currentEyeId === 'rinnegan_awakened' && selectedRinnePattern === 'kaguya';
  const activeThemeColor = isKaguyaRinne ? '#ef4444' : familyMeta.color;
  const activeBgAura = isKaguyaRinne ? 'rgba(239, 68, 68, 0.55)' : familyMeta.bgAura;
  const CX = 160;
  const CY = 160;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none animate-in fade-in duration-300"
      style={{ 
        background: `radial-gradient(circle at center, ${activeBgAura} 0%, rgba(6,7,10,0.97) 50%, #020305 100%)` 
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
          50% { transform: scale(1.08); opacity: 0.95; filter: drop-shadow(0 0 35px ${activeThemeColor}); }
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
          style={{ backgroundColor: activeThemeColor }}
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
            <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: activeThemeColor }} />
            <span>
              {opponentName 
                ? `👁️ ДЕМОНСТРАЦИЯ СОПЕРНИКА: ${opponentName}` 
                : (isKaguyaRinne ? '👁️ ПЕРВОРОДНОЕ ДОДЗЮЦУ: РИННЕ-ШАРИНГАН' : `👁️ ВЕЛИКОЕ ДОДЗЮЦУ: ${familyMeta.name.toUpperCase()}`)}
            </span>
            {isAwakened && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] animate-pulse font-black ${
                isKaguyaRinne 
                  ? 'bg-red-500/25 border border-red-400/50 text-red-300' 
                  : 'bg-amber-500/25 border border-amber-400/50 text-amber-300'
              }`}>
                {currentEyeId === 'rinnegan_awakened' 
                  ? (selectedRinnePattern === 'sasuke' ? 'САСКЕ (6 ТОМОЭ)' : 'КАГУЯ / МАДАРА (9 ТОМОЭ)') 
                  : 'ВЫСШАЯ ФОРМА'}
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
            color: activeThemeColor,
            transform: 'translateZ(-100px)'
          }}
        >
          {isKaguyaRinne ? '神樹' : familyMeta.kanji}
        </div>

        {/* ВЫБОР СЕМЕЙСТВА ДОДЗЮЦУ (6 ВЕЛИКИХ СЕМЕЙСТВ ГЛАЗ) */}
        <div className="relative z-30 mb-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-black/90 p-1.5 sm:p-2 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl max-w-full">
          {Object.entries(DOJUTSU_FAMILIES_META).map(([fKey, fData]) => {
            const isFamActive = familyKey === fKey;
            return (
              <button
                key={fKey}
                type="button"
                onClick={() => handleSelectFamily(fKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  isFamActive
                    ? 'text-white border scale-105 shadow-lg'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/10 border border-transparent'
                }`}
                style={{
                  backgroundColor: isFamActive ? `${fData.color}33` : 'rgba(255,255,255,0.04)',
                  borderColor: isFamActive ? fData.color : 'transparent',
                  boxShadow: isFamActive ? `0 0 15px ${fData.color}55` : 'none'
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: fData.color }} />
                <span>{fData.name}</span>
              </button>
            );
          })}
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
                  boxShadow: isSelected ? `0 0 20px ${activeThemeColor}66` : 'none',
                  borderColor: isSelected ? activeThemeColor : 'rgba(255,255,255,0.1)'
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
              backgroundColor: activeThemeColor,
              animation: 'coronaPulse 4s infinite ease-in-out',
              transform: 'translateZ(-45px)'
            }}
          />

          {/* 3D Двойное гироскопическое орбитальное кольцо чакры */}
          <div 
            className="absolute -inset-8 sm:-inset-12 rounded-full pointer-events-none border border-white/25 opacity-70"
            style={{
              animation: 'chakraOrbital1 16s linear infinite',
              boxShadow: `0 0 25px ${activeThemeColor}88`,
              borderColor: activeThemeColor
            }}
          />
          <div 
            className="absolute -inset-10 sm:-inset-14 rounded-full pointer-events-none border border-white/15 opacity-40"
            style={{
              animation: 'chakraOrbital2 22s linear infinite',
              borderColor: activeThemeColor
            }}
          />

          {/* СВЕРХДЕТАЛИЗИРОВАННЫЙ 3D СТЕКЛЯННЫЙ КРИСТАЛЛИЧЕСКИЙ ШАР (GLASS MARBLE ORB ПО ЭТАЛОНУ) */}
          <div className="w-64 h-64 sm:w-80 sm:h-80 relative flex items-center justify-center rounded-full shadow-[0_0_120px_rgba(0,0,0,0.98)]">
            <GlassSharinganOrb
              key={`${familyKey}_${currentEyeId}_${activePatternProp}`}
              pattern={activePatternProp}
              family={familyKey}
              stageId={currentEyeId}
              size={300}
              rotation={0}
              isSpinning={isSpinning}
            />
          </div>
        </div>

        {/* ПЕРЕКЛЮЧАТЕЛЬ ОФИЦИАЛЬНОЙ ТОП-5 ЭЛИТЫ МАНГЁКЁ (ПО АНИМЕ) */}
        {currentEyeId === 'mangekyo' && (
          <div className="relative z-30 mb-2 flex flex-wrap items-center justify-center gap-1.5 bg-black/90 p-2.5 rounded-2xl border border-red-500/40 backdrop-blur-md shadow-2xl max-w-xl">
            <span className="text-[10px] font-black text-red-400 w-full mb-1 uppercase tracking-wider flex items-center justify-center gap-1.5 sticky top-0 bg-black/90 py-0.5 z-10">
              <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              Официальный Мангёкё Шаринган (Канон Аниме):
            </span>
            {MANGEKYO_LIST.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPattern(p.id);
                  triggerActivation('mangekyo', p.id);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedPattern === p.id 
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-lg shadow-red-600/60 scale-105 border border-red-300/40' 
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
                }`}
                title={p.desc}
              >
                {p.name}
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
                    ? (p.id === 'kaguya'
                        ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md shadow-red-600/50 scale-105 border border-red-400/40'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/50 scale-105 border border-purple-400/40')
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
                  {currentEyeId === 'mangekyo'
                    ? activeMangekyo.name
                    : (currentEyeId === 'rinnegan_awakened' 
                        ? (selectedRinnePattern === 'sasuke' ? 'Пробуждённый Риннеган Саске (6 томоэ)' : 'Ринне-Шаринган Кагуи (9 томоэ)')
                        : (dojutsuData?.name || familyMeta.name))}
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                {currentEyeId === 'mangekyo'
                  ? `${activeMangekyo.owner}: ${activeMangekyo.desc}`
                  : (currentEyeId === 'rinnegan_awakened' && selectedRinnePattern === 'sasuke'
                    ? 'Каноничный левый глаз Саске Учиха от Мудреца Шести Путей. Ровно 6 томоэ на 2 кольцах. Техника мгновенной телепортации Аменотедзикара.'
                    : (currentEyeId === 'rinnegan_awakened' && selectedRinnePattern === 'kaguya'
                      ? 'Каноничное первородное алое око Кагуи Ооцуцуки и Мадары. Ровно 9 томоэ на 3 кольцах. Отражение на Луне для Бесконечного Цукуёми.'
                      : familyMeta.desc))}
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
