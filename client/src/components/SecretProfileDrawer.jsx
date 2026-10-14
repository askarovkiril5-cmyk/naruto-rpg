import React, { useState, useEffect } from 'react';
import { 
  X, ShieldAlert, Zap, Activity, EyeOff, Shield, Eye, 
  Flame, Sparkles, Scroll, Compass, BookOpen, Layers, ArrowRight, Check, RefreshCw,
  TrendingUp, TrendingDown, Maximize2, PanelRight, Minimize2, Swords, Heart, AlertCircle, Trophy
} from 'lucide-react';
import { getJutsuDesc, getJutsuRange, getJutsuTacticalInfo } from '../utils/jutsuHelper';
import { DOJUTSU_OPTIONS, getDojutsuById } from '../data/dojutsuData';

/**
 * Извлечение списка всех индивидуальных глаз персонажа
 * Поддерживает:
 * - profile.eye.activeEyes (массив от сервера)
 * - profile.dojutsuList (массив ID выбранных глаз в конструкторе)
 * - profile.dojutsu (строка со знаком "+" для мульти-глаз)
 * - profile.eye (одиночный объект)
 */
export function getCharacterEyes(profile) {
  if (!profile) return [];

  // 1. Массив активных глаз от сервера
  if (profile.eye?.activeEyes && Array.isArray(profile.eye.activeEyes) && profile.eye.activeEyes.length > 0) {
    const list = profile.eye.activeEyes.filter(e => e && e.id !== 'none' && e.name !== 'Без додзюцу');
    if (list.length > 0) return list;
  }

  // 2. Массив ID из конструктора (profile.dojutsuList)
  if (Array.isArray(profile.dojutsuList) && profile.dojutsuList.length > 0) {
    const validIds = profile.dojutsuList.filter(id => id && id !== 'auto' && id !== 'none');
    if (validIds.length > 0) {
      return validIds.map(id => getDojutsuById(id)).filter(Boolean);
    }
  }

  // 3. Строка с разделителем "+" (например, "Шаринган (3 томоэ) + Бьякуган (2 этап)")
  if (typeof profile.dojutsu === 'string' && profile.dojutsu.includes('+')) {
    const parts = profile.dojutsu.split('+').map(s => s.trim()).filter(Boolean);
    const resolved = parts.map(part => {
      return DOJUTSU_OPTIONS.find(opt => 
        opt.id === part || 
        opt.name.toLowerCase() === part.toLowerCase() ||
        part.toLowerCase().includes(opt.name.toLowerCase()) ||
        opt.name.toLowerCase().includes(part.toLowerCase())
      ) || getDojutsuById(part);
    }).filter(Boolean);
    if (resolved.length > 0) return resolved;
  }

  // 4. Одиночный объект глаза в profile.eye
  if (profile.eye && profile.eye.id !== 'none' && profile.eye.name !== 'Без додзюцу') {
    return [profile.eye];
  }

  return [];
}

/**
 * Расчет эффективных боевых статов с учетом включенного додзюцу,
 * покровов чакры/режимов и синергетического потолка (правила v0.3.3 & v0.3.2).
 */
export function getEffectiveStats(profile, isEyeActive) {
  if (!profile) return { speed: 24, reaction: 185, upkeep: 0, speedBonusText: null, reactionBonusText: null, predvideniePercent: 0 };
  
  const baseSpeed = Number(profile.baseSpeed || profile.speed) || 24;
  const baseReaction = Number(profile.baseReaction || profile.reaction) || 185;
  const clan = (profile.clan || '').toLowerCase();
  const hasSynergyPenalty = clan.includes('сюнрай') || clan.includes('тэнрай') || clan.includes('тенрай');

  const characterEyes = getCharacterEyes(profile);

  // Проверяем активные режимы и покровы на шиноби (из боя или конструктора)
  const activeModesStr = String(profile.activeModes || profile.modes || '').toLowerCase();
  let modeSpeedBonusPct = 0;
  let modeDescriptions = [];

  if (activeModesStr.includes('райтон') || activeModesStr.includes('#216') || activeModesStr.includes('ёрой')) {
    modeSpeedBonusPct += 30;
    modeDescriptions.push('Райтон но Ёрой (+30%)');
  }
  if (activeModesStr.includes('покров чакры') || activeModesStr.includes('#214')) {
    modeSpeedBonusPct += 20;
    modeDescriptions.push('Покров чакры (+20%)');
  }
  if (activeModesStr.includes('врата') || activeModesStr.includes('#217') || activeModesStr.includes('хатимон')) {
    modeSpeedBonusPct += 25;
    modeDescriptions.push('Хатимон Тонко (+25%)');
  }
  if (activeModesStr.includes('плащ') || activeModesStr.includes('#223')) {
    modeSpeedBonusPct += 25;
    modeDescriptions.push('Плащ ветра (+25%)');
  }
  if (activeModesStr.includes('джинчурики') || activeModesStr.includes('биджу')) {
    modeSpeedBonusPct += 40;
    modeDescriptions.push('Покров Биджу (+40%)');
  }
  if (activeModesStr.includes('проклятая печать')) {
    modeSpeedBonusPct += 40;
    modeDescriptions.push('Дзюин (+40%)');
  }

  // Если глаза выключены или у шиноби нет додзюцу
  if (!isEyeActive || characterEyes.length === 0) {
    const passiveTenrai = (clan.includes('тэнрай') || clan.includes('тенрай')) ? 15 : 0;
    const effectiveReaction = Math.max(20, Math.round(baseReaction * (1 - passiveTenrai / 100)));
    const effectiveSpeed = Math.round(baseSpeed * (1 + modeSpeedBonusPct / 100));
    const speedDiff = effectiveSpeed - baseSpeed;

    return {
      speed: effectiveSpeed,
      reaction: effectiveReaction,
      speedBonusText: speedDiff > 0 ? `+${speedDiff} м/с (${modeDescriptions.join(', ')})` : null,
      reactionBonusText: passiveTenrai > 0 ? `−${baseReaction - effectiveReaction} мс (15% пассивка Тэнрай)` : null,
      upkeep: 0,
      predvideniePercent: passiveTenrai,
      activeModesText: modeDescriptions.length > 0 ? modeDescriptions.join(' • ') : null
    };
  }

  // Расчет параметров нескольких активных глаз
  let maxPredvidenie = 0;
  let maxEyeSpeedBonusPct = 0;
  let sumUpkeep = 0;

  characterEyes.forEach(eyeObj => {
    const eyeId = (eyeObj.id || '').toLowerCase();
    const eyeName = (eyeObj.name || '').toLowerCase();

    let eyePred = Number(eyeObj.predvidenie || eyeObj.rawPredvidenie) || 0;
    let eyeSpeed = Number(eyeObj.speedBonusPercent) || 0;
    let eyeUpkeep = Number(eyeObj.upkeepNumber) || 0;

    // Резервный расчет по каталогу
    if (eyePred === 0) {
      if (eyeId.includes('rinnegan_awakened') || eyeName.includes('ринне-шаринган')) eyePred = 80;
      else if (eyeId.includes('mangekyo') || eyeName.includes('мангёкё') || eyeName.includes('вмш')) eyePred = 65;
      else if (eyeId.includes('rinnegan') || eyeName.includes('риннеган')) eyePred = 55;
      else if (eyeId.includes('byakugan_awakened') || eyeName.includes('всеведущ')) eyePred = 55;
      else if (eyeId.includes('ikadzutigan_awakened')) eyePred = 55;
      else if (eyeId.includes('kingan_awakened')) eyePred = 45;
      else if (eyeId === 'sharingan_3' || eyeName.includes('3 томоэ')) eyePred = 45;
      else if (eyeId.includes('ikadzutigan_3') || eyeName.includes('3 разряда')) eyePred = 42;
      else if (eyeId.includes('byakugan') || eyeName.includes('бьякуган')) eyePred = 35;
      else if (eyeId.includes('kingan_3') || eyeName.includes('3 кольца')) eyePred = 35;
      else if (eyeId.includes('aoigan_awakened')) eyePred = 35;
      else if (eyeId.includes('ikadzutigan_2') || eyeName.includes('2 разряда')) eyePred = 32;
      else if (eyeId === 'sharingan_2' || eyeName.includes('2 томоэ')) eyePred = 30;
      else if (eyeId.includes('kingan_2') || eyeName.includes('2 кольца')) eyePred = 25;
      else if (eyeId.includes('aoigan_3') || eyeName.includes('3 капли')) eyePred = 25;
      else if (eyeId.includes('ikadzutigan_1') || eyeName.includes('1 разряд')) eyePred = 20;
      else if (eyeId.includes('aoigan_2') || eyeName.includes('2 капли')) eyePred = 18;
      else if (eyeId.includes('kingan_1') || eyeName.includes('1 кольцо')) eyePred = 15;
      else if (eyeId === 'sharingan_1' || eyeName.includes('1 томоэ')) eyePred = 15;
      else if (eyeId.includes('aoigan_1') || eyeName.includes('1 капля')) eyePred = 10;
    }

    if (eyeSpeed === 0) {
      if (eyeId.includes('aoigan_awakened')) eyeSpeed = 45;
      else if (eyeId.includes('aoigan_3') || eyeName.includes('3 капли')) eyeSpeed = 30;
      else if (eyeId.includes('ikadzutigan_awakened')) eyeSpeed = 28;
      else if (eyeId.includes('aoigan_2') || eyeName.includes('2 капли')) eyeSpeed = 20;
      else if (eyeId.includes('ikadzutigan_3') || eyeName.includes('3 разряда')) eyeSpeed = 20;
      else if (eyeId.includes('ikadzutigan_2') || eyeName.includes('2 разряда')) eyeSpeed = 14;
      else if (eyeId.includes('aoigan_1') || eyeName.includes('1 капля')) eyeSpeed = 10;
      else if (eyeId.includes('ikadzutigan_1') || eyeName.includes('1 разряд')) eyeSpeed = 8;
    }

    if (eyeUpkeep === 0) {
      if (typeof eyeObj.upkeep === 'string') {
        eyeUpkeep = parseInt(eyeObj.upkeep.replace(/\D/g, ''), 10) || 0;
      }
      if (eyeUpkeep === 0) {
        if (eyeId.includes('rinnegan_awakened')) eyeUpkeep = 12000;
        else if (eyeId.includes('rinnegan')) eyeUpkeep = 8000;
        else if (eyeId.includes('byakugan_awakened')) eyeUpkeep = 6000;
        else if (eyeId.includes('mangekyo')) eyeUpkeep = 4000;
        else if (eyeId.includes('awakened')) eyeUpkeep = 5000;
        else if (eyeId.includes('3')) eyeUpkeep = 2200;
        else if (eyeId.includes('2')) eyeUpkeep = 1700;
        else if (eyeId.includes('1')) eyeUpkeep = 1200;
        else eyeUpkeep = 1500;
      }
    }

    if (eyePred > maxPredvidenie) maxPredvidenie = eyePred;
    if (eyeSpeed > maxEyeSpeedBonusPct) maxEyeSpeedBonusPct = eyeSpeed;
    sumUpkeep += eyeUpkeep;
  });

  // Синергетический штраф x0.7 для Сюнрай/Тэнрай (потолок предвидения)
  let effectivePredvidenie = maxPredvidenie;
  if (hasSynergyPenalty) {
    effectivePredvidenie = Math.min(90, Math.round(maxPredvidenie * 0.7));
  } else {
    effectivePredvidenie = Math.min(90, maxPredvidenie);
  }

  // Расчет скорости: базовая * (1 + (бонусы глаз + покровы) / 100)
  // По правилам бонусы скорости глаз НЕ суммируются (берется наибольший среди активных глаз)
  const totalSpeedBonusPct = maxEyeSpeedBonusPct + modeSpeedBonusPct;
  const effectiveSpeed = Math.round(baseSpeed * (1 + totalSpeedBonusPct / 100));
  const speedDiff = effectiveSpeed - baseSpeed;

  // Расчет реакции в мс: baseReaction * (1 - effectivePredvidenie / 100)
  const effectiveReaction = Math.max(20, Math.round(baseReaction * (1 - effectivePredvidenie / 100)));
  const reactionDiff = baseReaction - effectiveReaction;

  let speedBonusParts = [];
  if (maxEyeSpeedBonusPct > 0) speedBonusParts.push(`+${maxEyeSpeedBonusPct}% от глаз (макс.)`);
  if (modeSpeedBonusPct > 0) speedBonusParts.push(modeDescriptions.join(', '));

  return {
    speed: effectiveSpeed,
    reaction: effectiveReaction,
    speedBonusText: speedDiff > 0 ? `+${speedDiff} м/с (${speedBonusParts.join(', ')})` : null,
    reactionBonusText: `−${reactionDiff} мс (${effectivePredvidenie}% предвидения${hasSynergyPenalty ? ', син. потолок ×0.7' : ''})`,
    predvideniePercent: effectivePredvidenie,
    upkeep: sumUpkeep,
    activeModesText: modeDescriptions.length > 0 ? modeDescriptions.join(' • ') : null
  };
}

export default function SecretProfileDrawer({ 
  profile, 
  isOpen, 
  onClose, 
  onSelectActionToInput, 
  onRequestCard,
  gameVersion = '0.3.3',
  userProfile,
  currentAccount,
  onOpenPersonalProfile
}) {
  const [activeSection, setActiveSection] = useState('ALL'); // 'ALL' | 'STATS' | 'CLAN' | 'EYE_0' | 'EYE_1'... | 'JUTSU'
  const [isEyeActive, setIsEyeActive] = useState(() => {
    return localStorage.getItem('naruto_eye_active') !== 'false';
  });
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('naruto_profile_view_mode') || 'DRAWER'; // 'DRAWER' | 'FULLSCREEN'
  });

  const toggleViewMode = () => {
    const nextMode = viewMode === 'DRAWER' ? 'FULLSCREEN' : 'DRAWER';
    setViewMode(nextMode);
    try {
      localStorage.setItem('naruto_profile_view_mode', nextMode);
    } catch (e) {}
  };

  useEffect(() => {
    try {
      localStorage.setItem('naruto_eye_active', isEyeActive ? 'true' : 'false');
    } catch (e) {}
  }, [isEyeActive]);

  if (!isOpen) return null;

  const characterEyes = getCharacterEyes(profile);
  const effectiveStats = getEffectiveStats(profile, isEyeActive);

  const chakraRegen = Number(profile?.chakraRegen) || (
    profile?.clan?.includes('Удзумаки') || profile?.clan?.includes('Узумаки') ? 11000 : (profile?.clan?.includes('Сенджу') ? 8000 : 5000)
  );
  const currentChakra = Number(profile?.chakra) || 0;
  const maxChakra = Number(profile?.maxChakra) || currentChakra || 1;
  const baseSpeedVal = Number(profile?.baseSpeed || profile?.speed) || 24;
  const baseReactionVal = Number(profile?.baseReaction || profile?.reaction) || 185;
  const eyeUpkeepVal = Number(effectiveStats.upkeep) || 0;

  // Стиль бейджей рангов
  const getRankBadgeClass = (rank) => {
    switch (rank) {
      case 'S':
        return 'bg-gradient-to-r from-red-600 to-rose-700 text-white font-black border border-red-500/50 shadow-sm shadow-red-500/30';
      case 'A':
        return 'bg-gradient-to-r from-amber-500 to-yellow-600 text-zinc-950 font-black border border-amber-300';
      case 'B':
        return 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-extrabold border border-cyan-400/40';
      case 'C':
        return 'bg-zinc-800 text-zinc-200 border border-zinc-600 font-bold';
      case 'D':
        return 'bg-zinc-900 text-zinc-400 border border-zinc-700';
      default:
        return 'bg-zinc-800 text-zinc-300 border border-zinc-700';
    }
  };

  // Построение списка вкладок: У КАЖДОГО ГЛАЗА ОТДЕЛЬНАЯ ВКЛАДКА!
  const tabs = [
    { id: 'ALL', label: 'Всё сразу', color: 'bg-amber-500 text-zinc-950' },
    { id: 'STATS', label: 'Статы & Чакра', color: 'bg-cyan-600 text-white' },
    { id: 'CLAN', label: 'Клан & Пассивки', color: 'bg-cyan-600 text-white' },
  ];

  if (characterEyes.length > 0) {
    characterEyes.forEach((eye, index) => {
      const eyeIcon = eye.icon || '👁️';
      const eyeShortName = eye.name || `Глаз ${index + 1}`;
      tabs.push({
        id: `EYE_${index}`,
        label: `${eyeIcon} ${eyeShortName}`,
        color: 'bg-rose-700 text-white'
      });
    });
  } else {
    tabs.push({
      id: 'EYE_NONE',
      label: '👁️ Додзюцу',
      color: 'bg-zinc-700 text-white'
    });
  }

  tabs.push({
    id: 'JUTSU',
    label: `Авто-Дзюцу (${profile?.autoJutsu ? profile.autoJutsu.length : 0})`,
    color: 'bg-amber-600 text-white'
  });

  // Шапка профиля
  const renderHeader = (isModal) => (
    <div className="p-4 sm:p-5 border-b border-white/10 shrink-0 bg-gradient-to-r from-amber-950/30 via-zinc-900 to-amber-950/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-amber-400 text-xs tracking-wider uppercase flex items-center gap-2">
              Секретный профиль шиноби
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-800/40 font-bold">
                TOP SECRET
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              Личные данные персонажа: клан, глаза (отдельные вкладки), чакра, покровы и бесплатные дзюцу.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Кнопка переключения вида: На весь экран / Сбоку */}
          <button
            type="button"
            onClick={toggleViewMode}
            className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-cyan-300 transition cursor-pointer flex items-center gap-1 text-xs"
            title={viewMode === 'DRAWER' ? 'Развернуть на весь экран' : 'Свернуть в боковую панель (сбоку)'}
          >
            {viewMode === 'DRAWER' ? <Maximize2 className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
            <span className="hidden sm:inline text-[11px] font-mono text-zinc-400">
              {viewMode === 'DRAWER' ? 'На весь экран' : 'Сбоку'}
            </span>
          </button>

          {onRequestCard && (
            <button 
              type="button"
              onClick={onRequestCard} 
              className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-amber-400 transition cursor-pointer"
              title="Обновить карточку шиноби"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {onOpenPersonalProfile && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPersonalProfile();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-sm"
              title="Открыть персональный профиль: победы, винрейт и боевые титулы"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Винрейт & Титулы</span>
            </button>
          )}

          <button 
            type="button"
            onClick={onClose} 
            className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
            title="Закрыть профиль"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Быстрые фильтры по секциям: отдельная вкладка для каждого глаза! */}
      {profile && (
        <div className="flex gap-1.5 mt-3.5 overflow-x-auto pb-0.5 text-xs scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                activeSection === tab.id
                  ? `${tab.color} shadow-sm`
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Секция 1: Статы, Чакра и Активные режимы
  const renderStatsSection = () => (
    <div className="space-y-3">
      {/* Ранг, титул и раздельная статистика аккаунта шиноби (PvP vs ИИ) */}
      <div className="bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-zinc-900 border border-amber-500/40 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 shadow-md">
              {userProfile?.rank?.icon || '🥋'}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wide text-amber-300">
                  {userProfile?.rank?.title || 'Генин'}
                </span>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30">
                  Уровень {userProfile?.level || 1}
                </span>
                {userProfile?.activeTitle && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-500/40 shadow-sm animate-pulse">
                    🎖️ {userProfile.activeTitle}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Ступень: {userProfile?.rank?.stage || 'Начальная'} • Печать: {userProfile?.rank?.symbol || '忍'}
              </p>
            </div>
          </div>
          {currentAccount?.email && (
            <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-md whitespace-nowrap">
              Google Связан
            </span>
          )}
        </div>

        {/* Прогресс-бар побед до следующего уровня (БЕЗ XP!) */}
        <div className="space-y-1">
          <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/5">
            <div 
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-300 h-full rounded-full transition-all duration-700" 
              style={{ width: `${userProfile?.progressPercent || 0}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-zinc-400">
            <span>Прогресс до след. ранга:</span>
            <span className="text-amber-300 font-bold">
              {userProfile?.currentWinsInLevel || 0} / {userProfile?.winsRequiredForNextLevel || 1} побед в PvP ({userProfile?.progressPercent || 0}%)
            </span>
          </div>
        </div>

        {/* Раздельные карточки PvP (Люди) и AI (Полигон) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-white/10">
          {/* PvP Блок */}
          <div className="bg-zinc-950/70 border border-amber-500/30 rounded-xl p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                ⚔️ PvP (Живые люди)
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded">
                {userProfile?.stats?.pvp?.winrate || 0}% побед
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center font-mono">
              <div className="bg-zinc-900/60 rounded p-1">
                <div className="text-[9px] text-zinc-500">Бои</div>
                <div className="text-xs font-bold text-zinc-200">{userProfile?.stats?.pvp?.battlesPlayed || 0}</div>
              </div>
              <div className="bg-zinc-900/60 rounded p-1">
                <div className="text-[9px] text-emerald-500">Победы</div>
                <div className="text-xs font-bold text-emerald-300">{userProfile?.stats?.pvp?.battlesWon || 0}</div>
              </div>
              <div className="bg-zinc-900/60 rounded p-1">
                <div className="text-[9px] text-rose-500">Поражения</div>
                <div className="text-xs font-bold text-rose-300">{userProfile?.stats?.pvp?.battlesLost || 0}</div>
              </div>
            </div>
            <div className="text-[8px] text-zinc-500 mt-1 italic text-center">
              *Только эти победы повышают ранг и уровень
            </div>
          </div>

          {/* AI Блок */}
          <div className="bg-zinc-950/70 border border-blue-500/30 rounded-xl p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1">
                🤖 Спарринги с ИИ
              </span>
              <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/50 px-1.5 py-0.5 rounded">
                {userProfile?.stats?.ai?.winrate || 0}% побед
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center font-mono">
              <div className="bg-zinc-900/60 rounded p-1">
                <div className="text-[9px] text-zinc-500">Спарринги</div>
                <div className="text-xs font-bold text-zinc-200">{userProfile?.stats?.ai?.battlesPlayed || 0}</div>
              </div>
              <div className="bg-zinc-900/60 rounded p-1">
                <div className="text-[9px] text-blue-400">Победы</div>
                <div className="text-xs font-bold text-blue-300">{userProfile?.stats?.ai?.battlesWon || 0}</div>
              </div>
              <div className="bg-zinc-900/60 rounded p-1">
                <div className="text-[9px] text-zinc-500">Поражения</div>
                <div className="text-xs font-bold text-zinc-400">{userProfile?.stats?.ai?.battlesLost || 0}</div>
              </div>
            </div>
            <div className="text-[8px] text-zinc-500 mt-1 italic text-center">
              *Тренировочный полигон (не влияет на ранг)
            </div>
          </div>
        </div>
      </div>

      {/* Имя и Стихии */}
      <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 shadow-lg">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block mb-1">
          Личность шиноби
        </span>
        <div className="flex items-center justify-between">
          <p className="text-base sm:text-lg font-bold text-zinc-100">{profile.name}</p>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-lg">
            {profile.clan}
          </span>
        </div>

        {profile.elements && profile.elements.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            <span className="text-[10px] text-zinc-400 font-mono">Стихии:</span>
            {profile.elements.map(el => (
              <span key={el} className="text-[10px] font-bold bg-black/60 border border-white/10 px-2 py-0.5 rounded-md text-amber-300">
                {el}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Шкала Чакры */}
      <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 shadow-lg space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-cyan-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Резерв чакры:
          </span>
          <span className="font-mono font-bold text-zinc-200">
            {currentChakra.toLocaleString('ru-RU')} <span className="text-zinc-500 font-normal">/ {maxChakra.toLocaleString('ru-RU')}</span>
          </span>
        </div>

        <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden border border-white/10 p-0.5">
          <div 
            className="bg-gradient-to-r from-cyan-600 via-sky-400 to-blue-500 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${Math.min(100, Math.max(0, (currentChakra / maxChakra) * 100))}%` }}
          />
        </div>

        {/* Регенерация и расход */}
        <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-zinc-400 border-t border-white/5">
          <span className="text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +{chakraRegen.toLocaleString('ru-RU')} в ход
          </span>
          {isEyeActive && eyeUpkeepVal > 0 && (
            <span className="text-amber-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> −{eyeUpkeepVal.toLocaleString('ru-RU')} глаз/ход
            </span>
          )}
        </div>
      </div>

      {/* Скорость и Реакция (Обновляются в реальном времени при режимах и глазах) */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-3 shadow-lg">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
            Скорость бега
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-amber-400">{effectiveStats.speed}</span>
            <span className="text-xs text-zinc-400 font-mono">м/с</span>
          </div>
          {effectiveStats.speedBonusText ? (
            <span className="text-[10px] font-mono text-emerald-400 font-bold block mt-0.5 leading-tight">
              {effectiveStats.speedBonusText}
            </span>
          ) : (
            <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">Базовая: {baseSpeedVal} м/с</span>
          )}
        </div>

        <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-3 shadow-lg">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
            Время реакции
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-cyan-400">{effectiveStats.reaction}</span>
            <span className="text-xs text-zinc-400 font-mono">мс</span>
          </div>
          {effectiveStats.reactionBonusText ? (
            <span className="text-[10px] font-mono text-cyan-300 font-bold block mt-0.5 leading-tight">
              {effectiveStats.reactionBonusText}
            </span>
          ) : (
            <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">Базовая: {baseReactionVal} мс</span>
          )}
        </div>
      </div>

      {/* Статус ранений и Активные покровы / Режимы */}
      <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-3.5 shadow-lg space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> Физическое состояние:
          </span>
          <span className="font-semibold text-rose-300 text-[11px]">
            {profile.wounds || 'В идеальной боевой форме'}
          </span>
        </div>

        {(profile.activeModes || effectiveStats.activeModesText) && (
          <div className="pt-2 border-t border-white/5 flex items-start gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-snug">
              <span className="text-zinc-400 font-mono">Активные покровы: </span>
              <span className="font-bold text-amber-300">{profile.activeModes || effectiveStats.activeModesText}</span>
            </div>
          </div>
        )}

        {profile.totalChakraSpent > 0 && (
          <div className="pt-1.5 border-t border-white/5 text-[10px] font-mono text-zinc-500 flex justify-between">
            <span>Всего потрачено чакры за бой:</span>
            <span className="text-amber-400 font-bold">{profile.totalChakraSpent.toLocaleString('ru-RU')} ед.</span>
          </div>
        )}
      </div>
    </div>
  );

  // Секция 2: Клан и Пассивки
  const renderClanSection = () => (
    <div className="space-y-3">
      <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 shadow-lg space-y-2.5">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" /> Наследие клана: {profile.clan}
          </h4>
          <span className="text-[10px] font-mono text-zinc-400">{profile.clanTag}</span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
          {profile.clanDescription || 'Древний каноничный клан шиноби с уникальным контролем чакры и боевыми традициями.'}
        </p>

        {profile.passives && profile.passives.length > 0 && (
          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block mb-1.5">
              Врожденные пассивные черты:
            </span>
            <ul className="space-y-1.5">
              {profile.passives.map((p, idx) => (
                <li key={idx} className="text-xs text-amber-200/90 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  // Секция: ОТДЕЛЬНАЯ ВКЛАДКА ДЛЯ КОНКРЕТНОГО ГЛАЗА (Задача 1)
  const renderSingleEyeSection = (eyeObj, index, totalEyes) => {
    if (!eyeObj) return null;

    const eyeId = (eyeObj.id || '').toLowerCase();
    const eyeName = eyeObj.name || 'Додзюцу';
    const stageName = eyeObj.stage || eyeObj.stageName || eyeObj.badge || 'Пробужденная ступень';
    const eyeDesc = eyeObj.description || eyeObj.desc || 'Могущественное додзюцу с уникальным восприятием поля боя.';
    const eyeBonuses = eyeObj.bonuses || `Предвидение +${eyeObj.predvidenie || 0}%, Точность +${eyeObj.accuracy || 0}%${eyeObj.speedBonusPercent ? `, Скорость +${eyeObj.speedBonusPercent}%` : ''}`;
    const eyeUpkeep = eyeObj.upkeep || (eyeObj.upkeepNumber ? `${eyeObj.upkeepNumber.toLocaleString()} ед./ход` : '1 500 ед./ход');
    const eyePassives = eyeObj.passives || [];
    const eyeJutsu = eyeObj.jutsu || [];

    return (
      <div className="space-y-3">
        {/* Карточка конкретного глаза */}
        <div className="bg-zinc-900/90 border border-rose-500/30 rounded-2xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">{eyeObj.icon || '👁️'}</span>
              <div>
                <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                  {eyeName}
                </h4>
                {totalEyes > 1 && (
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Слот глаза {index + 1} из {totalEyes}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40 font-bold">
              {stageName}
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {eyeDesc}
          </p>

          {/* Параметры глаза */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs">
            <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-zinc-500 block">Бонусы ступени:</span>
              <span className="font-semibold text-rose-300 text-[11px]">{eyeBonuses}</span>
            </div>
            <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-zinc-500 block">Расход на поддержку:</span>
              <span className="font-mono font-bold text-amber-400 text-[11px]">{eyeUpkeep}</span>
            </div>
          </div>

          {/* Пассивные способности конкретного глаза */}
          {eyePassives.length > 0 && (
            <div className="pt-2 border-t border-white/5">
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block mb-1.5">
                Пассивные свойства глаза:
              </span>
              <ul className="space-y-1">
                {eyePassives.map((p, pIdx) => (
                  <li key={pIdx} className="text-xs text-zinc-300 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Синергия при нескольких глазах */}
          {totalEyes > 1 && (
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300/90 leading-snug">
              <b className="text-amber-400">⚡ Синергия глаз:</b> Все выбранные глаза активны одновременно! По правилам бонусы характеристик (скорость, предвидение, точность) берутся по сильнейшему глазу (не суммируются между собой), расход чакры суммируется, техники всех глаз доступны сразу.
            </div>
          )}

          {/* Кнопка активации / деактивации */}
          <div className="p-3 rounded-2xl bg-black/70 border border-rose-500/40 flex items-center justify-between gap-3 shadow-inner mt-2">
            <div className="flex items-center gap-2.5">
              <span className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                isEyeActive 
                  ? 'bg-emerald-400 shadow-lg shadow-emerald-400/80 animate-pulse' 
                  : 'bg-zinc-600'
              }`} />
              <div>
                <span className="text-xs font-bold text-zinc-100 block">
                  Статус: <b className={isEyeActive ? 'text-emerald-400' : 'text-zinc-400'}>{isEyeActive ? 'АКТИВЕН (ВКЛ)' : 'ДЕАКТИВИРОВАН (ВЫКЛ)'}</b>
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {isEyeActive ? `Расход: ${eyeUpkeep} в раунд` : 'Чакра не расходуется'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = !isEyeActive;
                setIsEyeActive(next);
                if (onSelectActionToInput) {
                  onSelectActionToInput(next ? `[Глаза: АКТИВИРОВАНЫ] ${eyeName}` : `[Глаза: ДЕАКТИВИРОВАНЫ] ${eyeName}`);
                }
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs transition shadow-md cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isEyeActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border border-emerald-400 shadow-emerald-500/30'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{isEyeActive ? 'ВЫКЛЮЧИТЬ' : 'ВКЛЮЧИТЬ'}</span>
            </button>
          </div>
        </div>

        {/* Уникальные техники конкретно ЭТОГО глаза */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Scroll className="w-3.5 h-3.5" /> Техники глаза: {eyeName}
            </h5>
            <span className="text-[10px] font-mono text-zinc-400">
              {eyeJutsu.length} дзюцу
            </span>
          </div>

          {eyeJutsu.length > 0 ? (
            eyeJutsu.map(jutsu => (
              <div 
                key={jutsu.id || jutsu.name}
                className="bg-zinc-900/90 hover:bg-zinc-900 border border-white/10 hover:border-rose-500/40 rounded-2xl p-3.5 shadow-lg transition duration-200"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${getRankBadgeClass(jutsu.rank)}`}>
                      {jutsu.rank}-ранг
                    </span>
                    <h6 className="text-xs font-bold text-zinc-100">{jutsu.name}</h6>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 bg-black/50 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <Sparkles className="w-3 h-3" />
                    <span>{jutsu.cost}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-2">
                  {jutsu.desc}
                </p>

                <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2">
                  {jutsu.range ? (
                    <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-300">
                      <Compass className="w-3 h-3 text-cyan-400" />
                      <span>{jutsu.range}</span>
                    </div>
                  ) : <div />}

                  {onSelectActionToInput && (
                    <button
                      type="button"
                      onClick={() => onSelectActionToInput(jutsu.name)}
                      className="py-1 px-3 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold rounded-xl text-xs transition border border-rose-500/40 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowRight className="w-3 h-3" />
                      <span>Вставить в ход</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 bg-zinc-900/60 rounded-xl text-center text-xs text-zinc-500">
              Пассивное восприятие без активных дзюцу
            </div>
          )}
        </div>
      </div>
    );
  };

  // Секция при отсутствии додзюцу
  const renderNoEyeSection = () => (
    <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-6 text-center space-y-2">
      <EyeOff className="w-8 h-8 text-zinc-500 mx-auto" />
      <h4 className="text-xs font-bold text-zinc-300">Обычные глаза (Без додзюцу)</h4>
      <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
        Чистая природная чакра без затрат на поддержку глаз в раунд. Персонаж всецело полагается на стихии, тайдзюцу или клановые техники.
      </p>
    </div>
  );

  // Секция 3: Бесплатные клановые техники (Авто-Дзюцу)
  const renderJutsuSection = () => (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Scroll className="w-3.5 h-3.5" /> Бесплатные клановые техники
        </h4>
        <span className="text-[10px] font-mono text-zinc-400">
          Сверх 30 слотов арсенала: {profile?.autoJutsu ? profile.autoJutsu.length : 0} дзюцу
        </span>
      </div>

      <div className="space-y-2">
        {profile?.autoJutsu && profile.autoJutsu.length > 0 ? (
          profile.autoJutsu.map((jutsu) => (
            <div 
              key={jutsu.id || jutsu.name}
              className="bg-zinc-900/90 hover:bg-zinc-900 border border-white/10 hover:border-amber-500/40 rounded-2xl p-3.5 shadow-lg transition duration-200"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${getRankBadgeClass(jutsu.rank)}`}>
                    {jutsu.rank}-ранг
                  </span>
                  <h5 className="text-xs font-bold text-zinc-100">{jutsu.name}</h5>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 bg-black/50 px-2 py-0.5 rounded-md border border-amber-500/20">
                  <Sparkles className="w-3 h-3" />
                  <span>{jutsu.cost}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-2">
                {jutsu.desc}
              </p>

              <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2">
                {jutsu.range ? (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-300">
                    <Compass className="w-3 h-3 text-cyan-400" />
                    <span>{jutsu.range}</span>
                  </div>
                ) : <div />}

                {onSelectActionToInput && (
                  <button
                    type="button"
                    onClick={() => onSelectActionToInput(jutsu.name)}
                    className="py-1 px-3 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-zinc-950 font-bold rounded-xl text-xs transition border border-amber-500/40 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3" />
                    <span>Вставить в ход</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 bg-zinc-900/60 rounded-xl text-center text-xs text-zinc-500">
            Нет активных автоматических клановых техник
          </div>
        )}
      </div>
    </div>
  );

  // Тело профиля: адаптируется под модальный режим (сетка колонок) или боковой режим (колонка)
  const renderBody = (isModal) => {
    if (!profile) {
      return (
        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center text-zinc-400 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <p className="font-bold text-zinc-200 text-sm">Карточка шиноби еще не загружена</p>
            <p className="text-xs text-zinc-400 mt-1 max-w-[320px] mx-auto">
              Нажмите кнопку ниже, чтобы запросить карточку персонажа от сервера.
            </p>
          </div>
          {onRequestCard && (
            <button
              type="button"
              onClick={onRequestCard}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-zinc-950 font-black text-xs shadow-lg shadow-amber-600/30 transition cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>🎲 Запросить / Сгенерировать карточку</span>
            </button>
          )}
        </div>
      );
    }

    if (isModal) {
      // Полноэкранный режим: при activeSection === 'ALL' отображаем колонки
      if (activeSection === 'ALL') {
        return (
          <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>{renderStatsSection()}</div>
              <div>{renderClanSection()}</div>
              <div>
                {characterEyes.length > 0 ? (
                  characterEyes.map((eye, idx) => (
                    <div key={idx} className="mb-4">
                      {renderSingleEyeSection(eye, idx, characterEyes.length)}
                    </div>
                  ))
                ) : (
                  renderNoEyeSection()
                )}
              </div>
              <div className="lg:col-span-3">
                {renderJutsuSection()}
              </div>
            </div>
          </div>
        );
      }

      // Отдельная выбранная вкладка в модальном окне
      return (
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin max-w-3xl mx-auto w-full">
          {activeSection === 'STATS' && renderStatsSection()}
          {activeSection === 'CLAN' && renderClanSection()}
          {activeSection.startsWith('EYE_') && (
            activeSection === 'EYE_NONE' ? (
              renderNoEyeSection()
            ) : (
              (() => {
                const eyeIdx = parseInt(activeSection.replace('EYE_', ''), 10);
                const targetEye = characterEyes[eyeIdx];
                return targetEye ? renderSingleEyeSection(targetEye, eyeIdx, characterEyes.length) : renderNoEyeSection();
              })()
            )
          )}
          {activeSection === 'JUTSU' && renderJutsuSection()}
        </div>
      );
    }

    // Боковой режим (Drawer / Сбоку)
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {(activeSection === 'ALL' || activeSection === 'STATS') && renderStatsSection()}
        {(activeSection === 'ALL' || activeSection === 'CLAN') && renderClanSection()}
        {activeSection === 'ALL' && (
          characterEyes.length > 0 ? (
            characterEyes.map((eye, idx) => (
              <div key={idx}>
                {renderSingleEyeSection(eye, idx, characterEyes.length)}
              </div>
            ))
          ) : (
            renderNoEyeSection()
          )
        )}
        {activeSection.startsWith('EYE_') && (
          activeSection === 'EYE_NONE' ? (
            renderNoEyeSection()
          ) : (
            (() => {
              const eyeIdx = parseInt(activeSection.replace('EYE_', ''), 10);
              const targetEye = characterEyes[eyeIdx];
              return targetEye ? renderSingleEyeSection(targetEye, eyeIdx, characterEyes.length) : renderNoEyeSection();
            })()
          )
        )}
        {(activeSection === 'ALL' || activeSection === 'JUTSU') && renderJutsuSection()}
      </div>
    );
  };

  const renderFooter = () => (
    <div className="p-3.5 border-t border-white/10 shrink-0 bg-black/60">
      <div className="rounded-xl bg-amber-950/30 border border-amber-500/20 p-2.5 text-[11px] text-amber-300 flex items-start gap-2.5">
        <EyeOff className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
        <p className="leading-snug">
          <b>Абсолютная тайна шиноби:</b> Ваши клановые пассивки, отдельные додзюцу и точный остаток чакры скрыты от оппонента и известны только вам и ИИ Ведущему!
        </p>
      </div>
    </div>
  );

  // 1. РЕЖИМ НА ВЕСЬ ЭКРАН (FULLSCREEN / MODAL)
  if (viewMode === 'FULLSCREEN') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in select-none">
        <div className="w-full max-w-6xl h-[92vh] rounded-3xl bg-zinc-950/98 border border-amber-500/30 shadow-2xl flex flex-col overflow-hidden text-zinc-100">
          {renderHeader(true)}
          {renderBody(true)}
          {renderFooter()}
        </div>
      </div>
    );
  }

  // 2. РЕЖИМ БОКОВОЙ ПАНЕЛИ (DRAWER / СБОКУ)
  return (
    <aside className="relative z-20 w-full md:w-[380px] xl:w-[420px] shrink-0 h-full max-md:fixed max-md:right-0 max-md:top-0 max-md:bottom-0 max-md:z-50 bg-zinc-950/98 border-l border-white/10 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 backdrop-blur-2xl text-zinc-100 select-none">
      {renderHeader(false)}
      {renderBody(false)}
      {renderFooter()}
    </aside>
  );
}
