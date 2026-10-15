import React, { useState } from 'react';
import { 
  X, Swords, Search, Sparkles, Compass, Trash2, Plus, 
  Copy, Check, ArrowRight, Shield, Flame, BookOpen, Layers,
  Maximize2, PanelRight, ChevronDown, ChevronRight, Tag, Lock, Unlock,
  Zap, Activity, Eye, Volume2
} from 'lucide-react';
import { getJutsuDesc, getJutsuRange, getJutsuTags, getJutsuTacticalInfo } from '../utils/jutsuHelper';
import { getVoiceForJutsu } from '../data/jutsuVoiceData';
import { audioManager } from '../utils/audioManager';

export default function MyArsenalModal({ 
  isOpen, 
  onClose, 
  selectedJutsuIds = [], 
  allJutsu = [], 
  onRemoveJutsu,
  onClearArsenal,
  onOpenJutsuBook,
  onSelectActionToInput,
  clanAutoJutsu = [],
  isArsenalLocked = false,
  onConfirmArsenal,
  onUnlockArsenal,
  roomStatus = 'LOBBY',
  canUnlock = false,
  viewMode: controlledViewMode,
  onToggleViewMode: controlledOnToggleViewMode,
  gameVersion = '0.3.3',
  onCastVoice = null
}) {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [internalViewMode, setInternalViewMode] = useState(() => {
    return localStorage.getItem('naruto_arsenal_mode') || 'DRAWER'; // 'MODAL' | 'DRAWER'
  });

  const viewMode = controlledViewMode !== undefined ? controlledViewMode : internalViewMode;

  const toggleViewMode = (mode) => {
    if (controlledOnToggleViewMode) {
      controlledOnToggleViewMode(mode);
    } else {
      setInternalViewMode(mode);
    }
    try {
      localStorage.setItem('naruto_arsenal_mode', mode);
    } catch (e) {}
  };

  const toggleCategory = (catName) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  if (!isOpen) return null;

  // Находим полные объекты выбранных техник
  const safeSelectedIds = Array.isArray(selectedJutsuIds) ? selectedJutsuIds : [];
  const safeAllJutsu = Array.isArray(allJutsu) ? allJutsu : [];
  const chosenJutsu = safeAllJutsu.filter(j => j && safeSelectedIds.includes(j.id));

  // Фильтр по поиску внутри арсенала
  const filteredJutsu = chosenJutsu.filter(j => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const descText = getJutsuDesc(j, gameVersion).toLowerCase();
    return (
      j.name.toLowerCase().includes(q) ||
      j.id.toString() === q ||
      descText.includes(q) ||
      (j.desc && j.desc.toLowerCase().includes(q)) ||
      (j.category && j.category.toLowerCase().includes(q))
    );
  });

  // Группировка техник по категориям
  const groupedJutsu = filteredJutsu.reduce((acc, item) => {
    const cat = item.category || 'ПРОЧИЕ ТЕХНИКИ';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const getRankBadgeClass = (rank) => {
    switch (rank) {
      case 'S':
        return 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black shadow-lg shadow-red-600/40 border border-red-400';
      case 'A':
        return 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-zinc-950 font-black shadow-lg shadow-amber-500/40 border border-amber-300';
      case 'B':
        return 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white font-extrabold shadow-lg shadow-cyan-500/40 border border-cyan-300';
      case 'C':
        return 'bg-zinc-800 text-emerald-300 font-bold border border-emerald-500/40';
      case 'D':
        return 'bg-zinc-900 text-zinc-300 border border-zinc-700 font-bold';
      case 'Режим':
        return 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black border border-purple-400 shadow-md shadow-purple-600/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold';
    }
  };

  const handleUseJutsu = (jutsu) => {
    if (onSelectActionToInput) {
      onSelectActionToInput(`#${jutsu.id} ${jutsu.name}`);
    }
    setCopiedId(jutsu.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // КОНТЕНТ АРСЕНАЛА (СПИСОК ПО ГРУППАМ)
  const renderArsenalContent = () => (
    <div className="flex-1 overflow-y-auto pr-1 my-3 scrollbar-thin space-y-5">
      {filteredJutsu.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/40 border border-dashed border-white/10 rounded-3xl p-8">
          <BookOpen className="w-12 h-12 mx-auto text-amber-500/40 mb-3" />
          <h3 className="text-base sm:text-lg font-bold text-zinc-200">
            {chosenJutsu.length === 0 ? 'Ваш арсенал пока пуст' : 'Ничего не найдено'}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mt-1 mb-5">
            {chosenJutsu.length === 0
              ? 'Откройте Книгу Техник и отметьте галочками до 30 дзюцу, чтобы они появились здесь с подробными характеристиками.'
              : 'Попробуйте изменить поисковый запрос.'}
          </p>
          {chosenJutsu.length === 0 && onOpenJutsuBook && (
            <button
              onClick={() => {
                onClose();
                onOpenJutsuBook();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              Перейти к Книге 248 Техник
            </button>
          )}
        </div>
      ) : (
        Object.entries(groupedJutsu).map(([categoryName, items]) => {
          const isCollapsed = collapsedCategories[categoryName];
          return (
            <div key={categoryName} className="space-y-3">
              {/* ЗАГОЛОВОК ГРУППЫ */}
              <button
                type="button"
                onClick={() => toggleCategory(categoryName)}
                className="w-full flex items-center justify-between p-2.5 px-3.5 bg-gradient-to-r from-zinc-900/90 via-zinc-900/70 to-zinc-900/40 hover:from-zinc-800/90 border border-white/10 rounded-2xl cursor-pointer transition select-none shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-amber-400">
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                  <span className="font-black text-xs sm:text-sm text-amber-300 tracking-wider uppercase">
                    {categoryName}
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {items.length}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-medium">
                  {isCollapsed ? 'Развернуть' : 'Свернуть'}
                </span>
              </button>

              {/* СЕТКА ТЕХНИК ВНУТРИ ГРУППЫ */}
              {!isCollapsed && (
                <div className={`grid grid-cols-1 ${viewMode === 'MODAL' ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-3.5 pl-1 sm:pl-2`}>
                  {items.map((j) => {
                    const tactical = getJutsuTacticalInfo(j);
                    const voice = getVoiceForJutsu(j.id, j.name);
                    return (
                    <div
                      key={j.id}
                      className="group relative rounded-2xl p-4 bg-zinc-900/95 border border-white/15 hover:border-amber-400/60 shadow-xl hover:shadow-2xl transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        {/* Верх: Номер #ID, Ранг, Расход */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm sm:text-base font-black font-mono px-2.5 py-1 rounded-xl bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20">
                              #{j.id}
                            </span>
                            <span className={`text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-lg border ${getRankBadgeClass(j.rank)}`}>
                              {j.rank}
                            </span>
                          </div>

                          {j.cost && (
                            <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-xl border border-cyan-700/50 shadow-inner">
                              <span>⚡ {j.cost}</span>
                              <span className="text-[10px] text-cyan-400">чакры</span>
                            </div>
                          )}
                        </div>

                        {/* Название техники (крупно и четко) */}
                        <h4 className="text-sm sm:text-base font-black text-zinc-100 group-hover:text-amber-300 transition tracking-wide leading-snug mb-1.5">
                          {j.name}
                        </h4>

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

                        {/* Тактические бейджи (Реактивная мобильность, Контратака, Гендзюцу) */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                          {tactical.isReactiveCounter && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-950/90 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/20" title="Срабатывает автоматически как ответный удар при проверке реакции (Раздел 7)">
                              <Zap className="w-2.5 h-2.5 text-amber-400" />
                              [Р] Контратака (Авто)
                            </span>
                          )}
                          {tactical.isReactiveMobility && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20" title="Срабатывает автоматически для уклонения/отступления при проверке реакции (Раздел 7)">
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

                        {/* Требование к технике */}
                        {tactical.requirement && (
                          <div className="mb-2 text-[10px] font-medium text-amber-400/90 bg-amber-950/50 border border-amber-500/30 rounded-lg px-2 py-1 flex items-start gap-1.5">
                            <span className="shrink-0 text-amber-300">⚠️</span>
                            <span>{tactical.requirement}</span>
                          </div>
                        )}

                        {/* Описание техники (объемно, крупно и контрастно) */}
                        <p className="text-xs sm:text-sm text-zinc-200 font-medium leading-relaxed mb-3 bg-black/40 p-2.5 rounded-xl border border-white/5">
                          {getJutsuDesc(j, gameVersion) || j.desc || 'Описание эффекта техники.'}
                        </p>

                        {/* Дальность и теги */}
                        {getJutsuRange(j, gameVersion) && (
                          <div className="mb-3 text-xs flex items-center gap-1.5 text-zinc-300 font-mono">
                            <span className="text-amber-400 font-bold">Зона:</span>
                            <span className="bg-zinc-800 px-2 py-0.5 rounded-md text-zinc-200 border border-white/5">
                              {getJutsuRange(j, gameVersion)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Нижняя панель действий */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUseJutsu(j)}
                          className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                          title="Вставить в поле хода"
                        >
                          {copiedId === j.id ? (
                            <>
                              <Check className="w-4 h-4 text-zinc-950" />
                              <span>Вставлено!</span>
                            </>
                          ) : (
                            <>
                              <ArrowRight className="w-4 h-4" />
                              <span>Вставить в ход</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={isArsenalLocked}
                          onClick={() => !isArsenalLocked && onRemoveJutsu(j.id)}
                          className={`p-2 rounded-xl transition border ${
                            isArsenalLocked
                              ? 'text-zinc-600 border-transparent cursor-not-allowed opacity-40'
                              : 'text-zinc-400 hover:text-red-400 hover:bg-red-950/40 border-transparent hover:border-red-800/40 cursor-pointer'
                          }`}
                          title={isArsenalLocked ? 'Арсенал зафиксирован, удаление заблокировано' : 'Убрать технику из арсенала'}
                        >
                          {isArsenalLocked ? <Lock className="w-3.5 h-3.5" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  // ШАПКА АРСЕНАЛА (ОБЩАЯ ДЛЯ ОБОИХ РЕЖИМОВ)
  const renderHeader = () => (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 shrink-0">
          <Swords className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-black tracking-wide text-zinc-100">
              Мой Боевой Арсенал
            </h2>
            <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full border shadow-sm ${
              selectedJutsuIds.length === 30 
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' 
                : 'bg-amber-950 text-amber-300 border-amber-700/50'
            }`}>
              {selectedJutsuIds.length} / 30 техник
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border shadow-sm ${
              gameVersion === '0.3.3'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/50'
            }`}>
              {gameVersion === '0.3.3' ? '🎯 0.3.3 Тактическая' : '⚡ 0.3.2 Базовая'}
            </span>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg border bg-amber-950/90 text-amber-300 border-amber-500/60 shadow-sm flex items-center gap-1" title="Техники [Р] и [М] срабатывают автоматически по Разделу 7 при успешной проверке уклонения!">
              <Zap className="w-2.5 h-2.5 text-amber-400" />
              <span>Реактивных: {chosenJutsu.filter(j => { const t = getJutsuTacticalInfo(j); return t.isReactiveCounter || t.isReactiveMobility || t.isGenjutsuCounter; }).length} (Авто)</span>
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-400">
            Шпаргалка с полной детализацией ваших дзюцу. Реактивные техники [Р] и [М] активируются автоматически при успешной реакции!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* КНОПКА ПОДТВЕРЖДЕНИЯ АРСЕНАЛА */}
        {!isArsenalLocked ? (
          onConfirmArsenal && (
            <button
              type="button"
              onClick={onConfirmArsenal}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              title="Зафиксировать выбранный арсенал (после подтверждения менять техники нельзя)"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Подтвердить арсенал</span>
            </button>
          )
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="px-3 py-1 bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Зафиксирован 🔒</span>
            </span>
            {(canUnlock || roomStatus === 'LOBBY') && onUnlockArsenal && (
              <button
                type="button"
                onClick={onUnlockArsenal}
                className="px-2.5 py-1 text-zinc-300 hover:text-amber-300 bg-zinc-800/80 hover:bg-zinc-700/80 text-xs rounded-xl transition border border-white/10 hover:border-amber-500/40 cursor-pointer flex items-center gap-1 shadow-sm"
                title="Разблокировать арсенал для редактирования (доступно до отправки хода)"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Изменить</span>
              </button>
            )}
          </div>
        )}

        {/* КНОПКА ПЕРЕКЛЮЧЕНИЯ РЕЖИМА: ПО ЦЕНТРУ / СБОКУ */}
        <div className="flex items-center bg-zinc-900 border border-white/10 rounded-xl p-0.5 text-xs">
          <button
            type="button"
            onClick={() => toggleViewMode('MODAL')}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
              viewMode === 'MODAL' 
                ? 'bg-amber-500 text-zinc-950 shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Открыть по центру (окно)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">По центру</span>
          </button>
          <button
            type="button"
            onClick={() => toggleViewMode('DRAWER')}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
              viewMode === 'DRAWER' 
                ? 'bg-amber-500 text-zinc-950 shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Закрепить сбоку (панель)"
          >
            <PanelRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Сбоку</span>
          </button>
        </div>

        <button 
          onClick={onClose} 
          className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
          title="Закрыть арсенал"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // ПАНЕЛЬ ПОИСКА ВНУТРИ АРСЕНАЛА
  const renderSearchBar = () => (
    <div className="flex items-center gap-3 pt-3 pb-1 shrink-0 flex-wrap sm:flex-nowrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-zinc-400" />
        <input
          type="text"
          placeholder="Быстрый поиск по названию или номеру (#)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700/60 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-400"
        />
      </div>

      {onOpenJutsuBook && (
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenJutsuBook();
          }}
          className={`px-3 py-2 rounded-xl text-xs shrink-0 flex items-center gap-1.5 transition border cursor-pointer ${
            isArsenalLocked
              ? 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-zinc-200'
              : 'bg-zinc-800 hover:bg-zinc-700 text-amber-300 border-amber-500/30 font-bold'
          }`}
          title={isArsenalLocked ? 'Просмотр книги техник (арсенал зафиксирован)' : 'Добавить дзюцу в арсенал'}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isArsenalLocked ? 'Книга техник' : 'Добавить техники'}</span>
        </button>
      )}

      {selectedJutsuIds.length > 0 && onClearArsenal && !isArsenalLocked && (
        <button
          type="button"
          onClick={() => {
            if (confirm('Очистить весь выбранный арсенал из 30 техник?')) {
              onClearArsenal();
            }
          }}
          className="p-2 text-zinc-500 hover:text-red-400 rounded-xl transition border border-transparent hover:border-red-800/40 shrink-0 cursor-pointer"
          title="Очистить арсенал"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      {isArsenalLocked && (
        <div className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 shrink-0">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Сборка защищена</span>
        </div>
      )}
    </div>
  );

  // 1. РЕЖИМ БОКОВОЙ ПАНЕЛИ (DRAWER, КАК И ПРОФИЛЬ - НЕ ПЕРЕКРЫВАЕТ ВВОД)
  if (viewMode === 'DRAWER') {
    return (
      <aside className="relative z-20 w-full md:w-[380px] xl:w-[420px] shrink-0 h-full max-md:fixed max-md:left-0 max-md:top-0 max-md:bottom-0 max-md:w-full max-md:z-50 bg-zinc-950/98 border-r border-white/10 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300 backdrop-blur-2xl text-zinc-100 p-4 select-none">
        {renderHeader()}
        {renderSearchBar()}
        {renderArsenalContent()}
      </aside>
    );
  }

  // 2. РЕЖИМ ЦЕНТРАЛЬНОГО МОДАЛЬНОГО ОКНА (MODAL)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 select-none animate-fadeIn">
      <div className="w-full max-w-6xl rounded-3xl border border-white/10 bg-zinc-950/98 p-5 sm:p-6 shadow-2xl text-zinc-100 flex flex-col h-[90vh] overflow-hidden">
        {renderHeader()}
        {renderSearchBar()}
        {renderArsenalContent()}
      </div>
    </div>
  );
}
