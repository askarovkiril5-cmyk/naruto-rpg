import React, { useState, useEffect } from 'react';
import { 
  X, Scroll, Search, Flame, Droplets, Zap, Wind, Mountain, 
  Swords, Eye, Shield, Sparkles, Filter, Activity, Compass, Tag, Check, Plus, Minus,
  Lock, Unlock, FlaskConical, Crosshair, BookOpen, Volume2
} from 'lucide-react';
import defaultJutsuData from '../data/jutsuData.json';
import { getBackendUrl } from '../utils/config';
import { getJutsuDesc, getJutsuRange, getJutsuTags, matchJutsuCategory, getJutsuTacticalInfo } from '../utils/jutsuHelper';
import { getVoiceForJutsu } from '../data/jutsuVoiceData';
import { audioManager } from '../utils/audioManager';

// Цветовые и стилевые схемы для стихий
const ELEMENT_CONFIG = {
  FIRE: {
    badge: 'bg-red-950/80 text-red-300 border-red-500/50 shadow-sm shadow-red-500/20',
    cardBorder: 'hover:border-red-500/60 hover:shadow-red-500/20 hover:shadow-2xl',
    icon: Flame,
    color: 'text-red-400',
    glow: 'group-hover:text-red-400'
  },
  WATER: {
    badge: 'bg-blue-950/80 text-blue-300 border-blue-500/50 shadow-sm shadow-blue-500/20',
    cardBorder: 'hover:border-blue-500/60 hover:shadow-blue-500/20 hover:shadow-2xl',
    icon: Droplets,
    color: 'text-blue-400',
    glow: 'group-hover:text-blue-400'
  },
  LIGHTNING: {
    badge: 'bg-yellow-950/80 text-yellow-300 border-yellow-500/50 shadow-sm shadow-yellow-500/20',
    cardBorder: 'hover:border-yellow-400/60 hover:shadow-yellow-400/20 hover:shadow-2xl',
    icon: Zap,
    color: 'text-yellow-400',
    glow: 'group-hover:text-yellow-400'
  },
  WIND: {
    badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20',
    cardBorder: 'hover:border-emerald-500/60 hover:shadow-emerald-500/20 hover:shadow-2xl',
    icon: Wind,
    color: 'text-emerald-400',
    glow: 'group-hover:text-emerald-400'
  },
  EARTH: {
    badge: 'bg-amber-950/80 text-amber-300 border-amber-600/50 shadow-sm shadow-amber-600/20',
    cardBorder: 'hover:border-amber-600/60 hover:shadow-amber-600/20 hover:shadow-2xl',
    icon: Mountain,
    color: 'text-amber-500',
    glow: 'group-hover:text-amber-400'
  },
  GENJUTSU: {
    badge: 'bg-purple-950/80 text-purple-300 border-purple-500/50 shadow-sm shadow-purple-500/20',
    cardBorder: 'hover:border-purple-500/60 hover:shadow-purple-500/20 hover:shadow-2xl',
    icon: Eye,
    color: 'text-purple-400',
    glow: 'group-hover:text-purple-400'
  },
  TAIJUTSU: {
    badge: 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-sm shadow-rose-500/20',
    cardBorder: 'hover:border-rose-500/60 hover:shadow-rose-500/20 hover:shadow-2xl',
    icon: Swords,
    color: 'text-rose-400',
    glow: 'group-hover:text-rose-400'
  },
  SEAL: {
    badge: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/50 shadow-sm shadow-indigo-500/20',
    cardBorder: 'hover:border-indigo-500/60 hover:shadow-indigo-500/20 hover:shadow-2xl',
    icon: Shield,
    color: 'text-indigo-400',
    glow: 'group-hover:text-indigo-400'
  },
  POISON: {
    badge: 'bg-lime-950/80 text-lime-300 border-lime-500/50 shadow-sm shadow-lime-500/20',
    cardBorder: 'hover:border-lime-500/60 hover:shadow-lime-500/20 hover:shadow-2xl',
    icon: FlaskConical,
    color: 'text-lime-400',
    glow: 'group-hover:text-lime-400'
  },
  WEAPON: {
    badge: 'bg-slate-900/80 text-slate-300 border-slate-500/50 shadow-sm shadow-slate-500/20',
    cardBorder: 'hover:border-slate-400/60 hover:shadow-slate-400/20 hover:shadow-2xl',
    icon: Crosshair,
    color: 'text-slate-300',
    glow: 'group-hover:text-slate-200'
  },
  BASIC: {
    badge: 'bg-amber-950/80 text-amber-300 border-amber-600/50 shadow-sm shadow-amber-600/20',
    cardBorder: 'hover:border-amber-500/60 hover:shadow-amber-500/20 hover:shadow-2xl',
    icon: BookOpen,
    color: 'text-amber-400',
    glow: 'group-hover:text-amber-300'
  },
  DEFAULT: {
    badge: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/50 shadow-sm',
    cardBorder: 'hover:border-amber-500/50 hover:shadow-amber-500/10 hover:shadow-2xl',
    icon: Sparkles,
    color: 'text-amber-400',
    glow: 'group-hover:text-amber-400'
  }
};

function getElementConfig(category = '', name = '') {
  const upper = (category + ' ' + name).toUpperCase();
  if (upper.includes('ОГОНЬ') || upper.includes('КАТОН')) return ELEMENT_CONFIG.FIRE;
  if (upper.includes('ВОДА') || upper.includes('СУЙТОН')) return ELEMENT_CONFIG.WATER;
  if (upper.includes('МОЛНИЯ') || upper.includes('РАЙТОН')) return ELEMENT_CONFIG.LIGHTNING;
  if (upper.includes('ВЕТЕР') || upper.includes('ФУУТОН')) return ELEMENT_CONFIG.WIND;
  if (upper.includes('ЗЕМЛЯ') || upper.includes('ДОТОН')) return ELEMENT_CONFIG.EARTH;
  if (upper.includes('ГЕНДЗЮЦУ')) return ELEMENT_CONFIG.GENJUTSU;
  if (upper.includes('ТАЙДЗЮЦУ')) return ELEMENT_CONFIG.TAIJUTSU;
  if (upper.includes('ПЕЧАТИ') || upper.includes('БАРЬЕР')) return ELEMENT_CONFIG.SEAL;
  if (upper.includes('ЯД')) return ELEMENT_CONFIG.POISON;
  if (upper.includes('ОРУЖИ') || upper.includes('МЕТАНИЕ') || upper.includes('СЮРИКЕН') || upper.includes('КУНАЙ')) return ELEMENT_CONFIG.WEAPON;
  if (upper.includes('БАЗОВ')) return ELEMENT_CONFIG.BASIC;
  return ELEMENT_CONFIG.DEFAULT;
}

export default function JutsuBookModal({ 
  isOpen, 
  onClose,
  selectedJutsuIds = [],
  onToggleSelectJutsu,
  onOpenArsenal,
  isArsenalLocked = false,
  onConfirmArsenal,
  onUnlockArsenal,
  roomStatus = 'LOBBY',
  canUnlock = false,
  gameVersion = '0.3.3',
  onCastVoice = null
}) {
  const [jutsuList, setJutsuList] = useState(defaultJutsuData || []);
  const [search, setSearch] = useState('');
  const [selectedRank, setSelectedRank] = useState('Все');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  // Синхронизация с сервером
  useEffect(() => {
    fetch(`${getBackendUrl()}/api/jutsu`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setJutsuList(data);
        }
      })
      .catch(() => {
        console.debug('Используется локальная база данных 248 техник');
      });
  }, [isOpen]);

  if (!isOpen) return null;

  // Фильтры по рангам
  const rankFilters = ['Все', 'S', 'A', 'B', 'C', 'D', 'Режим'];

  // Категории и стихии
  const categoryFilters = [
    { label: '⭐ Все техники', value: 'Все' },
    { label: '🔊 С озвучкой (Voice Lines)', value: 'VOICE_ONLY' },
    { label: '📜 Базовые (№1-10)', value: 'БАЗОВ' },
    { label: '👊 Тайдзюцу (№11-26)', value: 'ТАЙДЗЮЦУ' },
    { label: '🗡️ Оружие и метание', value: 'ОРУЖИ' },
    { label: '🧪 Яды (№153-158)', value: 'ЯДЫ' },
    { label: '🔥 Огонь (Катон)', value: 'ОГОНЬ' },
    { label: '💧 Вода (Суйтон)', value: 'ВОДА' },
    { label: '⚡ Молния (Райтон)', value: 'МОЛНИЯ' },
    { label: '🌪️ Ветер (Фуутон)', value: 'ВЕТЕР' },
    { label: '⛰️ Земля (Дотон)', value: 'ЗЕМЛЯ' },
    { label: '🌀 Расенган', value: 'РАСЕНГАН' },
    { label: '👁️ Гендзюцу', value: 'ГЕНДЗЮЦУ' },
    { label: '🛡️ Печати и барьеры', value: 'ПЕЧАТИ' },
    { label: '🎎 Марионетки', value: 'МАРИОНЕТК' },
    { label: '🐸 Призывы', value: 'ПРИЗЫВ' },
    { label: '💊 Медицина', value: 'МЕДИЦИН' },
    { label: '🩸 Клановые', value: 'КЛАН' },
    { label: '✨ Кеккей Генкай', value: 'КЕККЕЙ' },
    { label: '🧭 Тактические', value: 'ТАКТИЧ' },
    { label: '💨 Мобильность', value: 'МОБИЛЬНОСТЬ' },
    { label: '👑 Режимы и покровы', value: 'Режим' },
    { label: '⚡ Контратаки', value: 'КОНТРАТАК' },
  ];

  const safeSelectedIds = Array.isArray(selectedJutsuIds) ? selectedJutsuIds : [];
  const safeJutsuList = Array.isArray(jutsuList) ? jutsuList : [];

  // Фильтрация техник
  const filteredJutsu = safeJutsuList.filter(item => {
    if (!item) return false;
    const textQuery = search.toLowerCase().trim();

    // Если включен фильтр "Только выбранные"
    if (showOnlySelected && !safeSelectedIds.includes(item.id)) {
      return false;
    }

    // Поиск по номеру, названию, версионному описанию и тегам
    const itemDesc = getJutsuDesc(item, gameVersion).toLowerCase();
    const itemTags = getJutsuTags(item, gameVersion);
    const matchesSearch = !textQuery ||
      (item.name && item.name.toLowerCase().includes(textQuery)) ||
      itemDesc.includes(textQuery) ||
      (item.desc && item.desc.toLowerCase().includes(textQuery)) ||
      (item.id && item.id.toString() === textQuery) ||
      (itemTags && itemTags.some(t => t.toLowerCase().includes(textQuery)));

    // Фильтр по рангу
    const matchesRank = 
      selectedRank === 'Все' || 
      (item.rank && item.rank.toLowerCase() === selectedRank.toLowerCase());

    // Точный фильтр по стихии / категории (исключает ложное совпадение "разряд" с "яды")
    let matchesCat = true;
    if (selectedCategory === 'VOICE_ONLY') {
      matchesCat = Boolean(getVoiceForJutsu(item.id, item.name));
    } else {
      matchesCat = matchJutsuCategory(item, selectedCategory);
    }

    return matchesSearch && matchesRank && matchesCat;
  });

  // Получить стилизацию бейджа ранга
  const getRankBadgeClass = (rank) => {
    switch (rank) {
      case 'S':
        return 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black shadow-lg shadow-red-600/40 border border-red-400';
      case 'A':
        return 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-zinc-950 font-black shadow-lg shadow-amber-500/40 border border-amber-300';
      case 'B':
        return 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white font-extrabold shadow-lg shadow-cyan-500/40 border border-cyan-300';
      case 'C':
        return 'bg-zinc-800 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm';
      case 'D':
        return 'bg-zinc-900 text-zinc-400 border border-zinc-700 font-medium';
      case 'Режим':
        return 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black border border-purple-400 shadow-md shadow-purple-600/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border border-zinc-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 select-none animate-fadeIn">
      <div className="w-full max-w-7xl rounded-3xl border border-white/10 bg-zinc-950/98 p-5 sm:p-6 shadow-2xl text-zinc-100 flex flex-col h-[92vh] overflow-hidden">
        
        {/* ВЕРХНЯЯ ШАПКА */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold tracking-wide text-zinc-100 flex items-center gap-2">
                  Книга 248 техник шиноби
                </h2>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/50 shadow-sm">
                  {jutsuList.length} дзюцу
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border shadow-sm ${
                  gameVersion === '0.3.3'
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                    : 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                }`}>
                  {gameVersion === '0.3.3' ? '🎯 Регламент 0.3.3 (Тактический)' : '⚡ Регламент 0.3.2 (Базовый)'}
                </span>

                {/* ИНДИКАТОР ВЫБОРА 30 ТЕХНИК */}
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-bold border transition ${
                  selectedJutsuIds.length === 30
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60 shadow-md shadow-emerald-500/20'
                    : selectedJutsuIds.length > 0
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                    : 'bg-zinc-900 text-zinc-400 border-white/10'
                }`}>
                  <Swords className="w-3.5 h-3.5" />
                  <span>В арсенале: <b>{selectedJutsuIds.length} / 30</b></span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Крупные номера техник (<b>#1–#248</b>). Отмечайте дзюцу в ваш персональный пул из 30 слотов на бой!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isArsenalLocked ? (
              <div className="flex items-center gap-1.5">
                <span className="px-3 py-1.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 font-bold text-xs flex items-center gap-1.5 shadow-sm">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Зафиксирован</span>
                </span>
                {(canUnlock || roomStatus === 'LOBBY') && onUnlockArsenal && (
                  <button
                    onClick={onUnlockArsenal}
                    className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1 transition cursor-pointer"
                    title="Разблокировать арсенал для редактирования (доступно до отправки хода)"
                  >
                    <Unlock className="w-3 h-3" />
                    <span className="hidden sm:inline">Изменить</span>
                  </button>
                )}
              </div>
            ) : (
              onConfirmArsenal && (
                <button
                  onClick={onConfirmArsenal}
                  disabled={selectedJutsuIds.length === 0}
                  className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition cursor-pointer"
                  title="Подтвердить выбранные техники и заблокировать арсенал перед боем"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Подтвердить техники ({selectedJutsuIds.length}/30)</span>
                </button>
              )
            )}

            {onOpenArsenal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenArsenal();
                }}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <Swords className="w-4 h-4" />
                <span className="hidden sm:inline">Открыть Арсенал ({selectedJutsuIds.length})</span>
              </button>
            )}

            <button 
              onClick={onClose} 
              className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
              title="Закрыть книгу"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Предупреждение о блокировке арсенала */}
        {isArsenalLocked && (
          <div className="bg-red-950/40 border border-red-500/40 rounded-xl px-4 py-2 mt-2 flex items-center justify-between text-xs text-red-200 shrink-0">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                {roomStatus === 'BATTLE' 
                  ? 'Бой уже идёт! Арсенал из техник строго зафиксирован на всю битву.' 
                  : 'Арсенал подтверждён и зафиксирован. Во время боя менять техники запрещено.'}
              </span>
            </div>
            {roomStatus === 'LOBBY' && onUnlockArsenal && (
              <button
                onClick={onUnlockArsenal}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline ml-2 cursor-pointer shrink-0"
              >
                Изменить техники
              </button>
            )}
          </div>
        )}

        {/* ПАНЕЛЬ УПРАВЛЕНИЯ: ПОИСК И ФИЛЬТРЫ */}
        <div className="flex flex-col gap-3 py-3.5 border-b border-white/5 shrink-0">
          
          {/* Строка поиска и переключатель "Только выбранные" */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="Поиск по номеру (напр. 45), названию («Гокакю»), описанию или тегу..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-zinc-900 border border-zinc-700/60 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Фильтр: Только выбранные в 30 слотов */}
            <button
              onClick={() => setShowOnlySelected(!showOnlySelected)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shrink-0 ${
                showOnlySelected
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/30'
                  : 'bg-zinc-900 text-zinc-300 border-white/10 hover:border-amber-500/40'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Мой выбор ({selectedJutsuIds.length}/30)</span>
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900 px-3.5 py-2.5 rounded-xl border border-white/10 font-mono">
              <span className="text-zinc-500">Найдено:</span>
              <b className="text-amber-400 font-bold">{filteredJutsu.length}</b>
            </div>
          </div>

          {/* Фильтры: Ранги + Стихии */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
            
            {/* Ранги (S, A, B, C, D) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3 text-amber-500" /> Ранг:
              </span>
              {rankFilters.map((rank) => (
                <button
                  key={rank}
                  onClick={() => setSelectedRank(rank)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition shrink-0 ${
                    selectedRank === rank
                      ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/30'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-white/5'
                  }`}
                >
                  {rank === 'Все' ? 'Все ранги' : `${rank}${rank.length === 1 ? '-ранг' : ''}`}
                </button>
              ))}
            </div>

            {/* Стихии и категории */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
                <Tag className="w-3 h-3 text-cyan-400" /> Стихия:
              </span>
              {categoryFilters.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition shrink-0 whitespace-nowrap ${
                    selectedCategory === cat.value
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* СЕТКА КАРТОЧЕК ТЕХНИК (GRID) С КРУПНЫМИ НОМЕРАМИ И КНОПКОЙ ВЫБОРА */}
        <div className="flex-1 overflow-y-auto pr-1 my-3 scrollbar-thin">
          {filteredJutsu.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pb-4">
              {filteredJutsu.map((j) => {
                const isSelected = safeSelectedIds.includes(j.id);
                const elemConfig = getElementConfig(j.category, j.name);
                const ElemIcon = elemConfig.icon;
                const tactical = getJutsuTacticalInfo(j);
                const voice = getVoiceForJutsu(j.id, j.name);

                return (
                  <div
                    key={j.id}
                    className={`group relative rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.01] cursor-default ${
                      isSelected
                        ? 'bg-zinc-900/95 border-2 border-amber-500 shadow-amber-500/20'
                        : `bg-zinc-900/70 border border-white/10 hover:bg-zinc-900/95 ${elemConfig.cardBorder}`
                    }`}
                  >
                    {/* Верхняя строка карточки: КРУПНЫЙ НОМЕР #ID, Ранг и Стоимость */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {/* 7. ТОЧНАЯ И КРУПНАЯ НУМЕРАЦИЯ ТЕХНИКИ */}
                          <span className={`text-sm font-black font-mono px-2.5 py-1 rounded-lg border shadow-inner ${
                            isSelected
                              ? 'bg-amber-500 text-zinc-950 border-amber-300'
                              : 'bg-black/80 text-amber-400 border-amber-500/40'
                          }`}>
                            #{j.id}
                          </span>

                          {j.rank && (
                            <span className={`text-[10px] uppercase px-2 py-0.5 rounded-md ${getRankBadgeClass(j.rank)}`}>
                              {j.rank}-ранг
                            </span>
                          )}

                          {isSelected && (
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                              В арсенале ✓
                            </span>
                          )}
                        </div>

                        {/* Расход чакры */}
                        <div className="flex items-center gap-1 bg-black/60 border border-amber-500/30 px-2.5 py-0.5 rounded-lg text-right shadow-inner">
                          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                          <span className="text-xs font-mono font-bold text-amber-300">
                            {j.cost || '0'}
                          </span>
                        </div>
                      </div>

                      {/* КРУПНОЕ НАЗВАНИЕ С НОМЕРОМ */}
                      <h3 className={`text-sm font-bold text-zinc-100 transition-colors duration-200 mb-1.5 leading-snug ${elemConfig.glow}`}>
                        #{j.id} {j.name}
                      </h3>

                      {/* 🔊 ОРИГИНАЛЬНЫЙ БОЕВОЙ ВЫКРИК ИЛИ ЗВУКОВОЙ ЭФФЕКТ ТЕХНИКИ */}
                      {voice && (
                        <div className="mb-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onCastVoice) {
                                onCastVoice(voice);
                              } else {
                                audioManager.playJutsuVoice(voice);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer shadow-md hover:scale-[1.03] active:scale-95 bg-black/80 hover:bg-black group/vbtn"
                            style={{ borderColor: `${voice.glowColor}80`, color: voice.glowColor }}
                            title={voice.type === 'sfx' ? voice.quote : `Оригинальный крик техники: ${voice.romaji} (${voice.kanji})`}
                          >
                            {voice.type === 'sfx' ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 group-hover/vbtn:scale-110 transition-transform" />
                                <span className="font-extrabold tracking-wide">{voice.sfxLabel || voice.jutsuName}</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 group-hover/vbtn:scale-110 transition-transform" />
                                <span className="font-extrabold tracking-wide">{voice.kanji}</span>
                                <span className="text-zinc-300 font-mono text-[10px]">{voice.romaji}</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Категория / Стихия и Реактивные тактические бейджи */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                        {j.category && (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${elemConfig.badge}`}>
                            <ElemIcon className="w-3 h-3" />
                            {j.category}
                          </span>
                        )}
                        {tactical.isReactiveCounter && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-950/90 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/20" title="Срабатывает автоматически при проверке уклонения/реакции (Раздел 7)">
                            <Zap className="w-2.5 h-2.5 text-amber-400" />
                            [Р] Контратака (Авто)
                          </span>
                        )}
                        {tactical.isReactiveMobility && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20" title="Срабатывает автоматически для уклонения/отступления при достаточной реакции (Раздел 7)">
                            <Activity className="w-2.5 h-2.5 text-cyan-400" />
                            [М] Мобильность (Авто)
                          </span>
                        )}
                        {tactical.isGenjutsuCounter && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-purple-950/90 text-purple-300 border border-purple-500/50 shadow-sm shadow-purple-500/20" title="Автоматическое снятие иллюзии (Раздел 7)">
                            <Eye className="w-2.5 h-2.5 text-purple-400" />
                            [Г] Снятие гендзюцу
                          </span>
                        )}
                      </div>

                      {/* Требование к технике (Раздел 6 правил) */}
                      {tactical.requirement && (
                        <div className="mb-2 text-[10px] font-medium text-amber-400/90 bg-amber-950/50 border border-amber-500/30 rounded-lg px-2 py-1 flex items-start gap-1.5">
                          <span className="shrink-0 text-amber-300">⚠️</span>
                          <span>{tactical.requirement}</span>
                        </div>
                      )}

                      {/* Описание техники */}
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-3 min-h-[2.5rem]">
                        {getJutsuDesc(j, gameVersion)}
                      </p>
                    </div>

                    {/* Подвал карточки: Дистанция и Кнопка добавления в 30 слотов */}
                    <div className="pt-2.5 border-t border-white/5 flex flex-col gap-2">
                      {/* Дистанция */}
                      {getJutsuRange(j, gameVersion) && (
                        <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-300">
                          <Compass className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="truncate">{getJutsuRange(j, gameVersion)}</span>
                        </div>
                      )}

                      {/* КНОПКА ВЫБОРА В АРСЕНАЛ (8) */}
                      {onToggleSelectJutsu && (
                        <button
                          onClick={() => {
                            if (!isArsenalLocked) onToggleSelectJutsu(j.id);
                          }}
                          disabled={isArsenalLocked}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm ${
                            isArsenalLocked
                              ? isSelected
                                ? 'bg-zinc-800 text-amber-300/80 border border-amber-500/30 opacity-80 cursor-not-allowed'
                                : 'bg-zinc-900 text-zinc-600 border border-white/5 opacity-50 cursor-not-allowed'
                              : isSelected
                              ? 'bg-amber-500/20 hover:bg-red-950/80 text-amber-300 hover:text-red-300 border border-amber-500/40 hover:border-red-500/40 cursor-pointer'
                              : 'bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200 border border-white/10 cursor-pointer'
                          }`}
                        >
                          {isArsenalLocked ? (
                            isSelected ? (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>В арсенале (зафиксировано)</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>Арсенал зафиксирован</span>
                              </>
                            )
                          ) : isSelected ? (
                            <>
                              <Minus className="w-3.5 h-3.5" />
                              <span>Убрать из арсенала</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Выбрать в арсенал ({selectedJutsuIds.length}/30)</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500 space-y-2">
              <Scroll className="w-12 h-12 text-zinc-700 mb-2 stroke-[1.5]" />
              <p className="text-sm font-medium text-zinc-400">Техники по заданным критериям не найдены</p>
              <p className="text-xs text-zinc-600">Измените запрос в поиске или сбросьте фильтры стихий и рангов.</p>
              <button
                onClick={() => { 
                  setSearch(''); 
                  setSelectedRank('Все'); 
                  setSelectedCategory('Все'); 
                  setShowOnlySelected(false);
                }}
                className="mt-3 px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 rounded-xl transition cursor-pointer"
              >
                Сбросить все фильтры
              </button>
            </div>
          )}
        </div>

        {/* НИЖНИЙ ФУТЕР */}
        <div className="border-t border-white/10 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400 shrink-0">
          <div className="flex items-center gap-2">
            <span>Отображается:</span>
            <b className="text-zinc-200 font-mono">{filteredJutsu.length}</b>
            <span>из</span>
            <b className="text-amber-400 font-mono">{jutsuList.length}</b>
            <span>дзюцу</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-zinc-500 hidden md:inline">
              Выбрано техник в боевой арсенал: <b className="text-amber-300 font-mono">{selectedJutsuIds.length}/30</b>
            </span>

            {!isArsenalLocked && onConfirmArsenal && (
              <button
                onClick={onConfirmArsenal}
                disabled={selectedJutsuIds.length === 0}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Подтвердить арсенал ({selectedJutsuIds.length}/30)</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 text-zinc-100 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Закрыть свиток
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
