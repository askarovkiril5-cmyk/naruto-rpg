import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Eye, Zap, Flame, Sparkles, Send, Volume2, Check, 
  RefreshCw, Layers, Compass, Shield, Maximize2, Award, ChevronRight
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
    bgAura: 'rgba(192, 132, 252, 0.55)',
    desc: 'Око Мудреца Шести Путей. Полный контроль гравитации, притяжения, отталкивания и поглощения чакры.',
    stages: [
      { id: 'rinnegan', label: 'Шесть Путей', stageNum: 3, badge: 'Гравитация', desc: '6 концентрических фиолетовых колец Шести Путей. Синра Тэнсэй и Тибаку Тэнсэй.' },
      { id: 'rinnegan_awakened', label: 'Ринне-Шаринган', stageNum: 'awakened', badge: '9 Томоэ Бога', desc: 'Пробуждённая форма прародителей чакры. Алое око с 6 кругами и ровно 9 томоэ (3+6).' }
    ]
  },
  Kingan: {
    family: 'Kingan',
    name: 'Кинган',
    kanji: '金眼',
    color: '#facc15',
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
  const [selectedPattern, setSelectedPattern] = useState('itachi'); // Для ВМШ: 'itachi' | 'sasuke' | 'madara' | 'kamui'
  const [isSpinning, setIsSpinning] = useState(true);
  const [isSurging, setIsSurging] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
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

  // Звук и 3D импульс при смене формы или открытии
  const triggerActivation = (eyeIdToPlay) => {
    setIsSpinning(true);
    setIsSurging(true);
    audioManager.playEyeSound(eyeIdToPlay, familyKey);

    const spinTimer = setTimeout(() => setIsSpinning(false), 2400);
    const surgeTimer = setTimeout(() => setIsSurging(false), 500);

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

  // Интерактивное 3D слежение за курсором
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseTilt({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y))
    });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

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
      onShowToOpponent({
        dojutsuId: currentEyeId,
        dojutsuName: dojutsuData?.name || familyMeta.name,
        pattern: selectedPattern,
        family: familyKey
      });
      setShowDemonstrateNotice(true);
      setTimeout(() => setShowDemonstrateNotice(false), 2600);
    }
  };

  const isAwakened = currentEyeId.includes('awakened') || currentEyeId === 'mangekyo';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none animate-in fade-in duration-300"
      style={{ 
        background: `radial-gradient(circle at center, ${familyMeta.bgAura} 0%, rgba(10,12,18,0.96) 55%, #050608 100%)` 
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Атмосферные частицы и световые столбы */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-35 transition-all duration-700"
          style={{ backgroundColor: familyMeta.color }}
        />
        {isAwakened && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] animate-pulse" />
        )}
      </div>

      {/* Верхняя шапка: Заголовок и кнопка закрытия */}
      <div className="absolute top-3 inset-x-3 sm:inset-x-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-black/75 border border-white/20 text-xs font-mono font-bold text-zinc-100 backdrop-blur-md flex items-center gap-2.5 shadow-2xl">
            <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: familyMeta.color }} />
            <span>{opponentName ? `👁️ ДЕМОНСТРАЦИЯ СОПЕРНИКА: ${opponentName}` : `👁️ ВЕЛИКОЕ ДОДЗЮЦУ: ${familyMeta.name.toUpperCase()}`}</span>
            {isAwakened && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/50 text-[10px] text-amber-300 animate-pulse">
                ВЫСШАЯ ФОРМА
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

      {/* ГЛАВНЫЙ 3D КОНТЕЙНЕР */}
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
            transform: `translateZ(-80px) rotateY(${mouseTilt.x * 10}deg)`
          }}
        >
          {familyMeta.kanji}
        </div>

        {/* ПЕРЕКЛЮЧАТЕЛЬ СТУПЕНЕЙ ГЛАЗА (1, 2, 3 и Пробуждённая) */}
        <div className="relative z-30 mb-3 flex flex-wrap items-center justify-center gap-1.5 bg-black/75 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md shadow-2xl max-w-full">
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

        {/* 3D СФЕРА ГЛАЗНОГО ЯБЛОКА */}
        <div 
          className="relative my-2 sm:my-3 flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${mouseTilt.x * 18}deg) rotateX(${-mouseTilt.y * 18}deg) scale(${isSurging ? 1.12 : 1})`,
            transition: isSurging ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.12s ease-out'
          }}
        >
          {/* Внешний объемный ореол ауры (Back 3D layer) */}
          <div 
            className="absolute -inset-6 sm:-inset-10 rounded-full opacity-60 blur-2xl transition-all duration-700 pointer-events-none"
            style={{ 
              backgroundColor: familyMeta.color,
              transform: 'translateZ(-40px)'
            }}
          />

          {/* 3D Гироскопическое орбитальное кольцо чакры */}
          <div 
            className="absolute -inset-8 sm:-inset-12 rounded-full pointer-events-none border border-white/25 opacity-70 transition-transform"
            style={{
              transform: 'translateZ(30px) rotateX(65deg) rotateY(15deg)',
              boxShadow: `0 0 25px ${familyMeta.color}88`,
              borderColor: familyMeta.color
            }}
          />

          {/* SVG КИНЕМАТОГРАФИЧНЫЙ ГЛАЗ (viewBox: 320 x 320 с анатомическими венами) */}
          <div className="w-56 h-56 sm:w-72 sm:h-72 relative flex items-center justify-center rounded-full shadow-[0_0_90px_rgba(0,0,0,0.9)]">
            <svg 
              viewBox="0 0 320 320" 
              className="w-full h-full overflow-visible drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* 3D Сферический радиальный градиент глазного яблока (свет падает сверху-слева) */}
                <radialGradient id="eyeball-3d-sphere" cx="40%" cy="38%" r="62%">
                  <stop offset="0%" stopColor="#27272a" />
                  <stop offset="50%" stopColor="#18181b" />
                  <stop offset="85%" stopColor="#09090b" />
                  <stop offset="100%" stopColor="#000000" />
                </radialGradient>

                {/* Радиальный градиент радужки */}
                <radialGradient id="iris-3d-gradient" cx="42%" cy="40%" r="58%">
                  {familyKey === 'Sharingan' && (
                    <>
                      <stop offset="0%" stopColor="#f87171" />
                      <stop offset="35%" stopColor="#ef4444" />
                      <stop offset="70%" stopColor="#b91c1c" />
                      <stop offset="90%" stopColor="#450a0a" />
                      <stop offset="100%" stopColor="#180404" />
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
                          <stop offset="45%" stopColor="#f1f5f9" />
                          <stop offset="75%" stopColor="#cbd5e1" />
                          <stop offset="90%" stopColor="#94a3b8" />
                          <stop offset="100%" stopColor="#475569" />
                        </>
                      )}
                    </>
                  )}
                  {familyKey === 'Rinnegan' && (
                    <>
                      {currentEyeId === 'rinnegan_awakened' ? (
                        <>
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="40%" stopColor="#dc2626" />
                          <stop offset="75%" stopColor="#991b1b" />
                          <stop offset="95%" stopColor="#450a0a" />
                          <stop offset="100%" stopColor="#1c0303" />
                        </>
                      ) : (
                        <>
                          <stop offset="0%" stopColor="#e9d5ff" />
                          <stop offset="35%" stopColor="#c084fc" />
                          <stop offset="70%" stopColor="#7e22ce" />
                          <stop offset="90%" stopColor="#3b0764" />
                          <stop offset="100%" stopColor="#1e0538" />
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

                {/* Металлический градиент лезвий ВМШ */}
                <linearGradient id="blade-steel" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f4f4f5" />
                  <stop offset="40%" stopColor="#71717a" />
                  <stop offset="75%" stopColor="#18181b" />
                  <stop offset="100%" stopColor="#09090b" />
                </linearGradient>

                {/* Одиночное томоэ Шарингана */}
                <g id="tomoe-symbol">
                  <circle cx="0" cy="0" r="9" fill="#09090b" stroke="#18181b" strokeWidth="0.8" />
                  <path d="M -7 0 C -7 -12, 5 -14, 9 -25 C 7 -16, 3 -9, 0 -6 Z" fill="#09090b" />
                  <circle cx="0" cy="0" r="3" fill="#27272a" />
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
                <g className="animate-pulse" style={{ animationDuration: '2s' }}>
                  {/* Левая ветвь виска */}
                  <g stroke="#93c5fd" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9" filter="drop-shadow(0 0 6px #60a5fa)">
                    <path d="M 74 160 C 45 145, 25 130, 2 115" />
                    <path d="M 52 148 C 32 165, 18 190, 4 215" strokeWidth="2.2" />
                    <path d="M 78 145 C 50 115, 32 80, 16 45" strokeWidth="2.5" />
                    <path d="M 78 175 C 50 205, 32 240, 14 275" strokeWidth="2.5" />
                  </g>
                  {/* Правая ветвь виска */}
                  <g stroke="#93c5fd" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9" filter="drop-shadow(0 0 6px #60a5fa)">
                    <path d="M 246 160 C 275 145, 295 130, 318 115" />
                    <path d="M 268 148 C 288 165, 302 190, 316 215" strokeWidth="2.2" />
                    <path d="M 242 145 C 270 115, 288 80, 304 45" strokeWidth="2.5" />
                    <path d="M 242 175 C 270 205, 288 240, 306 275" strokeWidth="2.5" />
                  </g>
                  {/* Верхняя и нижняя глазницы */}
                  <g stroke="#bfdbfe" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.75">
                    <path d="M 160 74 C 140 45, 115 25, 95 6" />
                    <path d="M 175 74 C 195 45, 225 25, 245 8" />
                    <path d="M 160 246 C 140 275, 115 295, 95 314" />
                    <path d="M 175 246 C 195 275, 225 295, 245 312" />
                  </g>
                </g>
              )}

              {/* БЕЛОК ГЛАЗА (3D ОБЪЕМНАЯ СФЕРА) */}
              <circle cx="160" cy="160" r="86" fill="url(#eyeball-3d-sphere)" stroke="#27272a" strokeWidth="3" />
              
              {/* РАДУЖКА ГЛАЗА */}
              <circle 
                cx="160" 
                cy="160" 
                r="78" 
                fill="url(#iris-3d-gradient)" 
                stroke="#09090b" 
                strokeWidth="2.5"
                filter="drop-shadow(0 4px 10px rgba(0,0,0,0.7))"
              />

              {/* ======================================================== */}
              {/* 1. БЬЯКУГАН (ПОЛНЫЙ РЕМЕЙК: ВОЛОКНА, ТЭНКЭЦУ, БАГУА 360°) */}
              {/* ======================================================== */}
              {familyKey === 'Byakugan' && (
                <g>
                  {/* Кристаллические радиальные волокна перламутровой радужки (36 лучей) */}
                  <g stroke="#ffffff" strokeWidth="0.8" opacity="0.45" strokeLinecap="round">
                    {Array.from({ length: 36 }).map((_, i) => {
                      const angle = (i * 10 * Math.PI) / 180;
                      const x1 = 160 + Math.cos(angle) * 22;
                      const y1 = 160 + Math.sin(angle) * 22;
                      const x2 = 160 + Math.cos(angle) * 75;
                      const y2 = 160 + Math.sin(angle) * 75;
                      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
                    })}
                  </g>

                  {/* 1 СТУПЕНЬ: Базовое кольцо фокуса и круговой дальномер 360° */}
                  {currentEyeId === 'byakugan_1' && (
                    <g>
                      <circle cx="160" cy="160" r="62" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.85" />
                      <line x1="160" y1="84" x2="160" y2="100" stroke="#93c5fd" strokeWidth="2" />
                      <line x1="160" y1="220" x2="160" y2="236" stroke="#93c5fd" strokeWidth="2" />
                      <line x1="84" y1="160" x2="100" y2="160" stroke="#93c5fd" strokeWidth="2" />
                      <line x1="220" y1="160" x2="236" y2="160" stroke="#93c5fd" strokeWidth="2" />
                    </g>
                  )}

                  {/* 2 СТУПЕНЬ: 2 кольца глубины + 16 сияющих узлов Тэнкэцу */}
                  {currentEyeId === 'byakugan_2' && (
                    <g>
                      <circle cx="160" cy="160" r="64" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeDasharray="10 5" opacity="0.8" />
                      <circle cx="160" cy="160" r="44" fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.9" />
                      {/* Кольцо светящихся точек Тэнкэцу */}
                      <g className={isSpinning ? 'animate-spin' : ''} style={{ transformOrigin: '160px 160px', animationDuration: '14s' }}>
                        {Array.from({ length: 16 }).map((_, i) => {
                          const angle = (i * 22.5 * Math.PI) / 180;
                          const cx = 160 + Math.cos(angle) * 44;
                          const cy = 160 + Math.sin(angle) * 44;
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

                  {/* 3 СТУПЕНЬ: РОВНО 3 КОЛЬЦА БАГУА + 8 ТРИГРАММ + ТАЙЦЗИ ИНЬ-ЯН (64 ЛАДОНИ) */}
                  {currentEyeId === 'byakugan_3' && (
                    <g className={isSpinning ? 'animate-spin' : ''} style={{ transformOrigin: '160px 160px', animationDuration: '16s' }}>
                      {/* Ровно 3 священных кольца Багуа */}
                      <circle cx="160" cy="160" r="70" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.9" />
                      <circle cx="160" cy="160" r="52" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="12 4" opacity="0.85" />
                      <circle cx="160" cy="160" r="34" fill="none" stroke="#93c5fd" strokeWidth="1.8" opacity="0.9" />

                      {/* 8 священных триграмм Багуа по кругу */}
                      <g stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" opacity="0.95">
                        {/* ☰ Цянь (Север / Верх) */}
                        <g transform="translate(160, 95)">
                          <line x1="-8" y1="-4" x2="8" y2="-4" />
                          <line x1="-8" y1="0" x2="8" y2="0" />
                          <line x1="-8" y1="4" x2="8" y2="4" />
                        </g>
                        {/* ☷ Кунь (Юг / Низ) */}
                        <g transform="translate(160, 225)">
                          <line x1="-8" y1="-4" x2="-2" y2="-4" /><line x1="2" y1="-4" x2="8" y2="-4" />
                          <line x1="-8" y1="0" x2="-2" y2="0" /><line x1="2" y1="0" x2="8" y2="0" />
                          <line x1="-8" y1="4" x2="-2" y2="4" /><line x1="2" y1="4" x2="8" y2="4" />
                        </g>
                        {/* ☲ Ли (Восток / Право) */}
                        <g transform="translate(225, 160)">
                          <line x1="-8" y1="-4" x2="8" y2="-4" />
                          <line x1="-8" y1="0" x2="-2" y2="0" /><line x1="2" y1="0" x2="8" y2="0" />
                          <line x1="-8" y1="4" x2="8" y2="4" />
                        </g>
                        {/* ☵ Кань (Запад / Лево) */}
                        <g transform="translate(95, 160)">
                          <line x1="-8" y1="-4" x2="-2" y2="-4" /><line x1="2" y1="-4" x2="8" y2="-4" />
                          <line x1="-8" y1="0" x2="8" y2="0" />
                          <line x1="-8" y1="4" x2="-2" y2="4" /><line x1="2" y1="4" x2="8" y2="4" />
                        </g>
                      </g>

                      {/* Центральный символ Тайцзи (Инь-Ян) в ядре зрачка */}
                      <g transform="translate(160, 160)">
                        <circle cx="0" cy="0" r="16" fill="#f8fafc" stroke="#3b82f6" strokeWidth="1" />
                        <path d="M 0 -16 A 16 16 0 0 1 0 16 A 8 8 0 0 1 0 0 A 8 8 0 0 0 0 -16 Z" fill="#1e3a8a" />
                        <circle cx="0" cy="-8" r="2.5" fill="#f8fafc" />
                        <circle cx="0" cy="8" r="2.5" fill="#1e3a8a" />
                      </g>
                    </g>
                  )}

                  {/* ПРОБУЖДЁННЫЙ БЬЯКУГАН («ВСЕВЕДУЩИЙ ВЗОР» / ТЭНСЭЙГАН) */}
                  {currentEyeId === 'byakugan_awakened' && (
                    <g>
                      {/* Космические сияющие лучи Хамуры Ооцуцуки */}
                      <g className="animate-spin" style={{ transformOrigin: '160px 160px', animationDuration: '20s' }}>
                        <polygon points="160,86 172,145 234,160 172,175 160,234 148,175 86,160 148,145" fill="#ffffff" opacity="0.65" filter="drop-shadow(0 0 8px #a5f3fc)" />
                        <polygon points="160,105 168,148 215,160 168,172 160,215 152,172 105,160 152,148" fill="#67e8f9" opacity="0.45" />
                      </g>

                      {/* 8-лепестковый цветок чакры Тэнсэйгана */}
                      <g className={isSpinning ? 'animate-spin' : ''} style={{ transformOrigin: '160px 160px', animationDuration: '8s' }}>
                        {Array.from({ length: 8 }).map((_, i) => (
                          <g key={i} transform={`translate(160, 160) rotate(${i * 45})`}>
                            <path d="M 0 0 C 8 -15, 12 -28, 0 -38 C -12 -28, -8 -15, 0 0 Z" fill="#ffffff" stroke="#0891b2" strokeWidth="1.2" opacity="0.9" />
                            <circle cx="0" cy="-24" r="2.5" fill="#06b6d4" />
                          </g>
                        ))}
                      </g>

                      {/* Пульсирующее ядро чистой чакры */}
                      <circle cx="160" cy="160" r="14" fill="#ffffff" filter="drop-shadow(0 0 10px #ffffff)" />
                      <circle cx="160" cy="160" r="6" fill="#0891b2" />
                    </g>
                  )}

                  {/* Чистый жемчужный призрак зрачка (для 1 и 2 ступеней) */}
                  {(currentEyeId === 'byakugan_1' || currentEyeId === 'byakugan_2') && (
                    <g>
                      <circle cx="160" cy="160" r="22" fill="#ffffff" opacity="0.85" stroke="#cbd5e1" strokeWidth="1.5" />
                      <circle cx="160" cy="160" r="9" fill="#e2e8f0" opacity="0.9" />
                    </g>
                  )}
                </g>
              )}

              {/* ======================================================== */}
              {/* 2. РИННЕГАН (ШЕСТЬ ПУТЕЙ & РИННЕ-ШАРИНГАН С 9 ТОМОЭ)     */}
              {/* ======================================================== */}
              {familyKey === 'Rinnegan' && (
                <g>
                  {/* 6 идеальных концентрических колец Шести Путей */}
                  <circle cx="160" cy="160" r="72" fill="none" stroke="#2e1065" strokeWidth="2.8" />
                  <circle cx="160" cy="160" r="59" fill="none" stroke="#3b0764" strokeWidth="2.8" />
                  <circle cx="160" cy="160" r="46" fill="none" stroke="#2e1065" strokeWidth="2.8" />
                  <circle cx="160" cy="160" r="33" fill="none" stroke="#3b0764" strokeWidth="2.8" />
                  <circle cx="160" cy="160" r="20" fill="none" stroke="#2e1065" strokeWidth="2.8" />

                  {/* ПРОБУЖДЁННЫЙ РИННЕ-ШАРИНГАН: РОВНО 9 ТОМОЭ (3 внутренних + 6 внешних) */}
                  {currentEyeId === 'rinnegan_awakened' && (
                    <g 
                      className={isSpinning ? 'animate-spin' : ''} 
                      style={{ transformOrigin: '160px 160px', animationDuration: '6s' }}
                    >
                      {/* Внутренние 3 томоэ (0°, 120°, 240°) на радиусе 33 */}
                      <g transform="translate(160, 160) rotate(0)"><g transform="translate(0, -33) scale(0.65)"><use href="#tomoe-symbol" /></g></g>
                      <g transform="translate(160, 160) rotate(120)"><g transform="translate(0, -33) scale(0.65)"><use href="#tomoe-symbol" /></g></g>
                      <g transform="translate(160, 160) rotate(240)"><g transform="translate(0, -33) scale(0.65)"><use href="#tomoe-symbol" /></g></g>
                      {/* Внешние 6 томоэ (30°, 90°, 150°, 210°, 270°, 330°) на радиусе 59 */}
                      <g transform="translate(160, 160) rotate(30)"><g transform="translate(0, -59) scale(0.65)"><use href="#tomoe-symbol" /></g></g>
                      <g transform="translate(160, 160) rotate(90)"><g transform="translate(0, -59) scale(0.65)"><use href="#tomoe-symbol" /></g></g>
                      <g transform="translate(160, 160) rotate(150)"><g transform="translate(0, -59) scale(0.65)"><use href="#tomoe-symbol" /></g></g>
                      <g transform="translate(160, 160) rotate(210)"><g transform="translate(0, -59) scale(0.65)"><use href="#tomoe-symbol" /></g></g>
                      <g transform="translate(160, 160) rotate(270)"><g transform="translate(0, -59) scale(0.65)"><use href="#tomoe-symbol" /></g></g>
                      <g transform="translate(160, 160) rotate(330)"><g transform="translate(0, -59) scale(0.65)"><use href="#tomoe-symbol" /></g></g>
                    </g>
                  )}

                  {/* Центральный темный зрачок */}
                  <circle cx="160" cy="160" r="10" fill="#09090b" stroke="#7e22ce" strokeWidth="2" />
                </g>
              )}

              {/* ======================================================== */}
              {/* 3. КИНГАН (1, 2, 3 КОЛЬЦА И ПЕЧАТЬ РАЗРУШЕНИЯ)           */}
              {/* ======================================================== */}
              {familyKey === 'Kingan' && (
                <g>
                  {/* Тонкие перекрестные лазерные прицелы */}
                  <line x1="86" y1="160" x2="234" y2="160" stroke="#fef08a" strokeWidth="1" strokeDasharray="4 4" opacity="0.75" />
                  <line x1="160" y1="86" x2="160" y2="234" stroke="#fef08a" strokeWidth="1" strokeDasharray="4 4" opacity="0.75" />

                  <g className={isSpinning ? 'animate-spin' : ''} style={{ transformOrigin: '160px 160px', animationDuration: '9s' }}>
                    {/* 1 КОЛЬЦО */}
                    {(currentEyeId === 'kingan_1' || currentEyeId === 'kingan_2' || currentEyeId === 'kingan_3' || currentEyeId === 'kingan_awakened') && (
                      <g>
                        <circle cx="160" cy="160" r="32" fill="none" stroke="#713f12" strokeWidth="4" />
                        <circle cx="160" cy="160" r="32" fill="none" stroke="#fef08a" strokeWidth="2" strokeDasharray="18 10" />
                      </g>
                    )}

                    {/* 2 КОЛЬЦО */}
                    {(currentEyeId === 'kingan_2' || currentEyeId === 'kingan_3' || currentEyeId === 'kingan_awakened') && (
                      <g>
                        <circle cx="160" cy="160" r="50" fill="none" stroke="#713f12" strokeWidth="4" />
                        <circle cx="160" cy="160" r="50" fill="none" stroke="#fde047" strokeWidth="2" strokeDasharray="14 8" />
                      </g>
                    )}

                    {/* 3 КОЛЬЦО: РОВНО 3 КОНЦЕНТРИЧЕСКИХ ЗОЛОТЫХ КОЛЬЦА */}
                    {(currentEyeId === 'kingan_3' || currentEyeId === 'kingan_awakened') && (
                      <g>
                        <circle cx="160" cy="160" r="68" fill="none" stroke="#713f12" strokeWidth="4" />
                        <circle cx="160" cy="160" r="68" fill="none" stroke="#facc15" strokeWidth="2" strokeDasharray="26 12" />
                      </g>
                    )}

                    {/* ПРОБУЖДЁННАЯ «ПЕЧАТЬ РАЗРУШЕНИЯ»: Октагональный кристалл и 4 лазера */}
                    {currentEyeId === 'kingan_awakened' && (
                      <g stroke="#ffffff" strokeWidth="2.5">
                        <polygon points="160,90 180,140 230,160 180,180 160,230 140,180 90,160 140,140" fill="none" filter="drop-shadow(0 0 8px #fef08a)" />
                        <polygon points="160,105 174,146 215,160 174,174 160,215 146,174 105,160 146,146" fill="none" stroke="#fef08a" strokeWidth="1.5" />
                      </g>
                    )}
                  </g>

                  {/* Золотой кристаллический зрачок */}
                  <circle cx="160" cy="160" r="12" fill="#422006" stroke="#fde047" strokeWidth="2.5" />
                  <circle cx="160" cy="160" r="4" fill="#ffffff" />
                </g>
              )}

              {/* ======================================================== */}
              {/* 4. АОЙГАН (1, 2, 3 КАПЛИ И ГЛУБИННАЯ БЕЗДНА)             */}
              {/* ======================================================== */}
              {familyKey === 'Aoigan' && (
                <g>
                  {/* Водоворотные кольца */}
                  <circle cx="160" cy="160" r="66" fill="none" stroke="#083344" strokeWidth="2.5" opacity="0.7" />
                  <circle cx="160" cy="160" r="46" fill="none" stroke="#0891b2" strokeWidth="1.8" strokeDasharray="8 6" />

                  {/* ВРАЩАЮЩАЯСЯ ГРУППА КАПЕЛЬ: СТРОГОЕ ЧИСЛО ЭЛЕМЕНТОВ */}
                  <g 
                    className={isSpinning ? 'animate-spin' : ''} 
                    style={{ transformOrigin: '160px 160px', animationDuration: isSpinning ? '2.4s' : '7s' }}
                  >
                    {/* 1 КАПЛЯ (СТУПЕНЬ 1: РОВНО 1 КАПЛЯ) */}
                    {currentEyeId === 'aoigan_1' && (
                      <g transform="translate(160, 160) rotate(0)">
                        <g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g>
                      </g>
                    )}

                    {/* 2 КАПЛИ (СТУПЕНЬ 2: РОВНО 2 КАПЛИ ПОД 0° И 180°) */}
                    {currentEyeId === 'aoigan_2' && (
                      <>
                        <g transform="translate(160, 160) rotate(0)">
                          <g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g>
                        </g>
                        <g transform="translate(160, 160) rotate(180)">
                          <g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g>
                        </g>
                      </>
                    )}

                    {/* 3 КАПЛИ (СТУПЕНЬ 3: РОВНО 3 КАПЛИ ПОД 0°, 120°, 240° - БЕЗ 4-Й!) */}
                    {currentEyeId === 'aoigan_3' && (
                      <>
                        <g transform="translate(160, 160) rotate(0)">
                          <g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g>
                        </g>
                        <g transform="translate(160, 160) rotate(120)">
                          <g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g>
                        </g>
                        <g transform="translate(160, 160) rotate(240)">
                          <g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g>
                        </g>
                      </>
                    )}

                    {/* ПРОБУЖДЁННАЯ «ГЛУБИННАЯ БЕЗДНА» (ГЁРИН НО ЁРОЙ): 3 капли + броня глубин */}
                    {currentEyeId === 'aoigan_awakened' && (
                      <>
                        <g transform="translate(160, 160) rotate(0)">
                          <g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g>
                        </g>
                        <g transform="translate(160, 160) rotate(120)">
                          <g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g>
                        </g>
                        <g transform="translate(160, 160) rotate(240)">
                          <g transform="translate(0, -46)"><use href="#aoigan-single-drop" /></g>
                        </g>
                        {/* Водный драконий щит высокого давления */}
                        <circle cx="160" cy="160" r="60" fill="none" stroke="#22d3ee" strokeWidth="3" strokeDasharray="24 10" filter="drop-shadow(0 0 6px #67e8f9)" />
                      </>
                    )}
                  </g>

                  {/* Зрачок-водоворот */}
                  <circle cx="160" cy="160" r="12" fill="#042f2e" stroke="#22d3ee" strokeWidth="2.5" />
                  <circle cx="160" cy="160" r="4" fill="#a5f3fc" />
                </g>
              )}

              {/* ======================================================== */}
              {/* 5. ИКАДЗУТИГАН (1, 2, 3 РАЗРЯДА И БОЖЕСТВЕННАЯ МОЛНИЯ)   */}
              {/* ======================================================== */}
              {familyKey === 'Ikadzutigan' && (
                <g>
                  {/* Статический контур Тесла */}
                  <circle cx="160" cy="160" r="64" fill="none" stroke="#075985" strokeWidth="2" strokeDasharray="6 6" opacity="0.8" />

                  {/* ВРАЩАЮЩАЯСЯ ГРУППА МОЛНИЙ: СТРОГОЕ ЧИСЛО ЭЛЕМЕНТОВ */}
                  <g 
                    className={isSpinning ? 'animate-spin' : ''} 
                    style={{ transformOrigin: '160px 160px', animationDuration: isSpinning ? '1.8s' : '5s' }}
                  >
                    {/* 1 РАЗРЯД (СТУПЕНЬ 1: РОВНО 1 РАЗРЯД) */}
                    {currentEyeId === 'ikadzutigan_1' && (
                      <g transform="translate(160, 160) rotate(0)">
                        <g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g>
                      </g>
                    )}

                    {/* 2 РАЗРЯДА (СТУПЕНЬ 2: РОВНО 2 РАЗРЯДА ПОД 0° И 180°) */}
                    {currentEyeId === 'ikadzutigan_2' && (
                      <>
                        <g transform="translate(160, 160) rotate(0)">
                          <g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g>
                        </g>
                        <g transform="translate(160, 160) rotate(180)">
                          <g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g>
                        </g>
                      </>
                    )}

                    {/* 3 РАЗРЯДА (СТУПЕНЬ 3: РОВНО 3 РАЗРЯДА ПОД 0°, 120°, 240° - БЕЗ 4-ГО!) */}
                    {currentEyeId === 'ikadzutigan_3' && (
                      <>
                        <g transform="translate(160, 160) rotate(0)">
                          <g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g>
                        </g>
                        <g transform="translate(160, 160) rotate(120)">
                          <g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g>
                        </g>
                        <g transform="translate(160, 160) rotate(240)">
                          <g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g>
                        </g>
                      </>
                    )}

                    {/* ПРОБУЖДЁННАЯ «БОЖЕСТВЕННАЯ МОЛНИЯ» (КУРОРАЙТОН): 3 разряда + Черная Молния */}
                    {currentEyeId === 'ikadzutigan_awakened' && (
                      <>
                        <g transform="translate(160, 160) rotate(0)">
                          <g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g>
                        </g>
                        <g transform="translate(160, 160) rotate(120)">
                          <g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g>
                        </g>
                        <g transform="translate(160, 160) rotate(240)">
                          <g transform="translate(0, -46)"><use href="#lightning-bolt-single" /></g>
                        </g>
                        {/* Звездный плазменный октаэдр Райдзина */}
                        <path 
                          d="M 120 120 L 160 88 L 200 120 L 232 160 L 200 200 L 160 232 L 120 200 L 88 160 Z" 
                          fill="none" 
                          stroke="#ffffff" 
                          strokeWidth="2.5" 
                          filter="drop-shadow(0 0 10px #7dd3fc)"
                        />
                      </>
                    )}
                  </g>

                  {/* Плазменное ядро */}
                  <circle cx="160" cy="160" r="12" fill="#082f49" stroke="#7dd3fc" strokeWidth="2.5" />
                  <circle cx="160" cy="160" r="4" fill="#ffffff" />
                </g>
              )}

              {/* ======================================================== */}
              {/* 6. ШАРИНГАН (1, 2, 3 ТОМОЭ И ВМШ С 4 УЗОРАМИ)            */}
              {/* ======================================================== */}
              {familyKey === 'Sharingan' && (
                <g>
                  {/* Тонкое черное кольцо вращения томоэ */}
                  <circle cx="160" cy="160" r="48" fill="none" stroke="#09090b" strokeWidth="2.5" opacity="0.9" />

                  {/* ВРАЩАЮЩАЯСЯ ГРУППА ТОМОЭ */}
                  <g 
                    className={isSpinning ? 'animate-spin' : ''} 
                    style={{ transformOrigin: '160px 160px', animationDuration: isSpinning ? '1.8s' : '6s' }}
                  >
                    {/* 1 ТОМОЭ */}
                    {currentEyeId === 'sharingan_1' && (
                      <g transform="translate(160, 160) rotate(0)">
                        <g transform="translate(0, -48)"><use href="#tomoe-symbol" /></g>
                      </g>
                    )}

                    {/* 2 ТОМОЭ */}
                    {currentEyeId === 'sharingan_2' && (
                      <>
                        <g transform="translate(160, 160) rotate(0)">
                          <g transform="translate(0, -48)"><use href="#tomoe-symbol" /></g>
                        </g>
                        <g transform="translate(160, 160) rotate(180)">
                          <g transform="translate(0, -48)"><use href="#tomoe-symbol" /></g>
                        </g>
                      </>
                    )}

                    {/* 3 ТОМОЭ: РОВНО 3 ТОМОЭ ПОД 0°, 120°, 240° */}
                    {currentEyeId === 'sharingan_3' && (
                      <>
                        <g transform="translate(160, 160) rotate(0)">
                          <g transform="translate(0, -48)"><use href="#tomoe-symbol" /></g>
                        </g>
                        <g transform="translate(160, 160) rotate(120)">
                          <g transform="translate(0, -48)"><use href="#tomoe-symbol" /></g>
                        </g>
                        <g transform="translate(160, 160) rotate(240)">
                          <g transform="translate(0, -48)"><use href="#tomoe-symbol" /></g>
                        </g>
                      </>
                    )}

                    {/* ВЕЧНЫЙ МАНГЁКЁ ШАРИНГАН (ВМШ): 4 ЛЕГЕНДАРНЫХ УЗОРА */}
                    {currentEyeId === 'mangekyo' && (
                      <g>
                        {/* Форма 1: ИТАЧИ (Изогнутый трехлопастной сюрикен) */}
                        {selectedPattern === 'itachi' && (
                          <g>
                            <circle cx="160" cy="160" r="16" fill="#09090b" />
                            {[0, 120, 240].map(deg => (
                              <g key={deg} transform={`translate(160, 160) rotate(${deg})`}>
                                <path 
                                  d="M 0 0 C 20 -20, 48 -25, 36 -54 C 20 -40, 5 -20, 0 0 Z" 
                                  fill="url(#blade-steel)" 
                                  stroke="#09090b" 
                                  strokeWidth="1.5"
                                  filter="drop-shadow(0 0 5px rgba(0,0,0,0.9))"
                                />
                                <circle cx="28" cy="-38" r="4" fill="#09090b" />
                              </g>
                            ))}
                          </g>
                        )}

                        {/* Форма 2: САСКЕ (Шестиконечная звезда черного пламени) */}
                        {selectedPattern === 'sasuke' && (
                          <g>
                            <circle cx="160" cy="160" r="18" fill="#09090b" />
                            {[0, 60, 120, 180, 240, 300].map(deg => (
                              <g key={deg} transform={`translate(160, 160) rotate(${deg})`}>
                                <polygon points="0,0 8,-22 0,-54 -8,-22" fill="#09090b" stroke="#ef4444" strokeWidth="1.2" />
                              </g>
                            ))}
                            <polygon points="160,116 198,160 160,204 122,160" fill="none" stroke="#fca5a5" strokeWidth="2.5" />
                          </g>
                        )}

                        {/* Форма 3: МАДАРА (Переплетенные клинки бесконечности) */}
                        {selectedPattern === 'madara' && (
                          <g>
                            <circle cx="160" cy="160" r="18" fill="#09090b" />
                            <circle cx="160" cy="160" r="50" fill="none" stroke="#09090b" strokeWidth="7" />
                            {[0, 120, 240].map(deg => (
                              <g key={deg} transform={`translate(160, 160) rotate(${deg})`}>
                                <path d="M 0 0 C 15 -15, 32 -35, 0 -58 C -32 -35, -15 -15, 0 0 Z" fill="#09090b" />
                                <circle cx="0" cy="-50" r="6" fill="#ef4444" stroke="#09090b" strokeWidth="2" />
                              </g>
                            ))}
                          </g>
                        )}

                        {/* Форма 4: КАМУИ (Пространственный треугольный вихрь Обито-Какаши) */}
                        {selectedPattern === 'kamui' && (
                          <g>
                            <circle cx="160" cy="160" r="16" fill="#09090b" />
                            {[0, 120, 240].map(deg => (
                              <g key={deg} transform={`translate(160, 160) rotate(${deg})`}>
                                <path 
                                  d="M 0 0 C 28 -8, 52 -28, 48 -58 C 30 -42, 12 -25, 0 0 Z" 
                                  fill="#09090b" 
                                  stroke="#7f1d1d" 
                                  strokeWidth="1.8" 
                                />
                                <circle cx="34" cy="-38" r="5" fill="#f87171" />
                              </g>
                            ))}
                          </g>
                        )}
                      </g>
                    )}
                  </g>

                  {/* Центральный черный зрачок Шарингана */}
                  <circle cx="160" cy="160" r="11" fill="#09090b" stroke="#7f1d1d" strokeWidth="2" />
                </g>
              )}

              {/* ======================================================== */}
              {/* СФЕРИЧЕСКИЙ 3D БЛИК РОГОВИЦЫ (SPECULAR GLASS HIGHLIGHT)   */}
              {/* ======================================================== */}
              <g pointerEvents="none" style={{ transform: `translate(${mouseTilt.x * -8}px, ${mouseTilt.y * -8}px)` }}>
                {/* Главный блик света (сверху-слева) */}
                <ellipse cx="125" cy="120" rx="28" ry="16" fill="#ffffff" opacity="0.45" transform="rotate(-32 125 120)" />
                <circle cx="118" cy="115" r="7" fill="#ffffff" opacity="0.75" />
                {/* Вторичный рассеянный влажный рефлекс (снизу-справа) */}
                <ellipse cx="195" cy="195" rx="18" ry="8" fill="#ffffff" opacity="0.22" transform="rotate(-32 195 195)" />
              </g>
            </svg>
          </div>
        </div>

        {/* ПЕРЕКЛЮЧАТЕЛЬ 4 УЗОРОВ ВМШ (ТОЛЬКО ДЛЯ ВЕЧНОГО МАНГЁКЁ) */}
        {currentEyeId === 'mangekyo' && (
          <div className="relative z-30 mb-2 flex items-center justify-center gap-1.5 bg-black/80 px-3 py-1.5 rounded-xl border border-red-500/40 backdrop-blur-md">
            <span className="text-[10px] font-bold text-red-400 mr-1 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              Узор ВМШ:
            </span>
            {[
              { id: 'itachi', label: 'Итачи' },
              { id: 'sasuke', label: 'Саске' },
              { id: 'madara', label: 'Мадара' },
              { id: 'kamui', label: 'Камуи' }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPattern(p.id);
                  triggerActivation('mangekyo');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedPattern === p.id 
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/50 scale-105' 
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
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
                <span>{dojutsuData?.name || familyMeta.name}</span>
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                {familyMeta.desc}
              </p>
            </div>
            <button
              type="button"
              onClick={() => triggerActivation(currentEyeId)}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-zinc-200 transition flex items-center gap-1.5 cursor-pointer"
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
