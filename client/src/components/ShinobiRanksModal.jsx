import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Search, Shield, Sparkles, Filter, ChevronUp, Target } from 'lucide-react';
import { SHINOBI_RANKS_DATA, TIER_CATEGORIES } from '../data/shinobiRanksData';

// Компонент высокодетализированного символа шиноби
function ShinobiRankSymbol({ item }) {
  const { tier, kanji, icon, color } = item;

  // Стиль фона и обводки медальона в зависимости от ранга
  let ringGradient = 'from-zinc-400 to-zinc-600';
  let badgeBg = 'bg-zinc-900';
  let glowColor = 'rgba(148, 163, 184, 0.3)';

  switch (tier) {
    case 'academy':
    case 'genin':
      ringGradient = 'from-slate-400 via-zinc-300 to-slate-500';
      badgeBg = 'bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-950';
      glowColor = 'rgba(148, 163, 184, 0.4)';
      break;
    case 'chunin':
      ringGradient = 'from-emerald-400 via-teal-300 to-emerald-600';
      badgeBg = 'bg-gradient-to-br from-emerald-950 via-zinc-950 to-teal-950';
      glowColor = 'rgba(16, 185, 129, 0.45)';
      break;
    case 'tokubetsu':
      ringGradient = 'from-blue-400 via-sky-300 to-indigo-600';
      badgeBg = 'bg-gradient-to-br from-blue-950 via-zinc-950 to-sky-950';
      glowColor = 'rgba(59, 130, 246, 0.45)';
      break;
    case 'jonin':
      ringGradient = 'from-purple-400 via-violet-300 to-indigo-600';
      badgeBg = 'bg-gradient-to-br from-purple-950 via-zinc-950 to-violet-950';
      glowColor = 'rgba(139, 92, 246, 0.5)';
      break;
    case 'anbu':
      ringGradient = 'from-pink-400 via-rose-300 to-fuchsia-600';
      badgeBg = 'bg-gradient-to-br from-pink-950 via-zinc-950 to-rose-950';
      glowColor = 'rgba(236, 72, 153, 0.55)';
      break;
    case 'sannin':
      ringGradient = 'from-amber-300 via-yellow-200 to-orange-500';
      badgeBg = 'bg-gradient-to-br from-amber-950 via-zinc-950 to-orange-950';
      glowColor = 'rgba(245, 158, 11, 0.6)';
      break;
    case 'kage':
      ringGradient = 'from-red-400 via-rose-300 to-red-600';
      badgeBg = 'bg-gradient-to-br from-red-950 via-zinc-950 to-rose-950';
      glowColor = 'rgba(239, 68, 68, 0.65)';
      break;
    case 'legend':
      ringGradient = 'from-yellow-300 via-amber-200 to-orange-400';
      badgeBg = 'bg-gradient-to-br from-amber-900 via-zinc-950 to-yellow-950';
      glowColor = 'rgba(251, 191, 36, 0.85)';
      break;
    default:
      break;
  }

  return (
    <div 
      className="relative flex items-center justify-center w-11 h-11 shrink-0 group select-none"
      title={`${item.rank} (${kanji})`}
    >
      {/* Внешнее свечение чакры */}
      <div 
        className="absolute inset-0 rounded-xl opacity-60 group-hover:opacity-100 blur-sm transition-opacity"
        style={{ background: glowColor }}
      />

      {/* Металлический орнаментальный медальон */}
      <div className={`relative w-10 h-10 rounded-xl p-[1.5px] bg-gradient-to-br ${ringGradient} shadow-md`}>
        <div className={`w-full h-full rounded-[10px] ${badgeBg} flex items-center justify-center relative overflow-hidden border border-black/40`}>
          
          {/* Рельефный японский кандзи-иероглиф в центре */}
          <span 
            className="text-base font-black font-serif tracking-tighter drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
            style={{ color: color }}
          >
            {kanji}
          </span>

          {/* Миниатюрная эмблема-печать в нижнем углу */}
          <span className="absolute -bottom-0.5 -right-0.5 text-[9px] drop-shadow-md">
            {icon}
          </span>

          {/* Световой блик на металле */}
          <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

export default function ShinobiRanksModal({ isOpen, onClose, currentLevel = 1, currentRank = 'Генин' }) {
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const tableContainerRef = useRef(null);
  const currentRowRef = useRef(null);

  // Фильтрация списка
  const filteredData = useMemo(() => {
    return SHINOBI_RANKS_DATA.filter((item) => {
      // Фильтр по тиру
      if (selectedTier !== 'all') {
        if (selectedTier === 'genin') {
          if (item.tier !== 'genin' && item.tier !== 'academy') return false;
        } else if (item.tier !== selectedTier) {
          return false;
        }
      }

      // Поиск по тексту или номеру уровня
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const matchesLevel = item.level.toString() === query || `ур. ${item.level}`.includes(query) || `ур.${item.level}`.includes(query);
        const matchesRank = item.rank.toLowerCase().includes(query);
        const matchesKanji = item.kanji.toLowerCase().includes(query);
        return matchesLevel || matchesRank || matchesKanji;
      }

      return true;
    });
  }, [selectedTier, search]);

  // Переход к текущему уровню игрока
  const scrollToCurrentLevel = () => {
    setSelectedTier('all');
    setSearch('');
    setTimeout(() => {
      if (currentRowRef.current) {
        currentRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (currentRowRef.current) {
          currentRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 select-none animate-fadeIn">
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-zinc-950/98 p-4 sm:p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* ШАПКА */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl shadow-inner">
              ⛩️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide text-zinc-100 uppercase">
                  Таблица рангов шиноби
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  100 Уровней
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Официальная иерархия званий и боевых символов Конохи от Академиста до Бога Ниндзюцу.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollToCurrentLevel}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition cursor-pointer shadow-sm"
              title="Перейти к моему текущему уровню"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Мой уровень (Ур. {currentLevel})</span>
            </button>

            <button 
              type="button"
              onClick={onClose} 
              className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
              title="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* БАННЕР ТЕКУЩЕГО УРОВНЯ ИГРОКА */}
        <div className="mt-3.5 bg-gradient-to-r from-amber-950/40 via-zinc-900/80 to-zinc-900/40 border border-amber-500/30 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2.5 shrink-0 shadow-inner">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
              🥋
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                Ваш текущий статус шиноби:
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-2">
                <span>Уровень {currentLevel}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-200">{currentRank}</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToCurrentLevel}
            className="sm:hidden px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold cursor-pointer"
          >
            Найти меня (Ур. {currentLevel})
          </button>
        </div>

        {/* ПАНЕЛЬ ФИЛЬТРОВ И ПОИСКА */}
        <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          {/* Поиск */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Найти уровень (напр. 50), звание или иероглиф..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Быстрые фильтры по категориям */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
            {TIER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedTier(cat.id)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition shrink-0 cursor-pointer border ${
                  selectedTier === cat.id
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                    : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:border-white/20 hover:text-zinc-200'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* ТАБЛИЦА СТРОГО ИЗ 3 КОЛОНОК: УРОВЕНЬ | РАНГ ШИНОБИ | СИМВОЛ */}
        <div 
          ref={tableContainerRef}
          className="mt-3 flex-1 overflow-y-auto pr-1 scrollbar-thin border border-white/10 rounded-2xl bg-black/40"
        >
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-md border-b border-white/10 shadow-md">
              <tr className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold">
                <th className="py-3 px-4 w-28 sm:w-36 text-amber-400">Уровень</th>
                <th className="py-3 px-4">Ранг шиноби</th>
                <th className="py-3 px-4 w-28 sm:w-36 text-center text-cyan-400">Символ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-zinc-500 text-xs">
                    По вашему запросу ранги не найдены.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const isCurrent = item.level === currentLevel;
                  return (
                    <tr
                      key={item.level}
                      ref={isCurrent ? currentRowRef : null}
                      className={`transition duration-150 ${
                        isCurrent
                          ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-l-4 border-l-amber-400 font-bold'
                          : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      {/* КОЛОНКА 1: УРОВЕНЬ */}
                      <td className="py-3 px-4 align-middle">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-xs font-black px-2.5 py-1 rounded-lg border ${
                            isCurrent
                              ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/30'
                              : item.level === 100
                              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
                              : item.level >= 95
                              ? 'bg-red-500/20 text-red-300 border-red-500/40'
                              : item.level >= 90
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : 'bg-zinc-900 text-zinc-300 border-white/10'
                          }`}>
                            Ур. {item.level}
                          </span>
                          {isCurrent && (
                            <span className="hidden sm:inline text-[9px] font-bold text-amber-400 uppercase tracking-wider animate-pulse">
                              (Вы)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* КОЛОНКА 2: РАНГ ШИНОБИ */}
                      <td className="py-3 px-4 align-middle">
                        <div className="space-y-0.5">
                          <span 
                            className="font-bold text-xs sm:text-sm block"
                            style={{ color: item.color }}
                          >
                            {item.rank}
                          </span>
                        </div>
                      </td>

                      {/* КОЛОНКА 3: СИМВОЛ (ДЕТАЛИЗИРОВАННЫЙ ЗНАК) */}
                      <td className="py-2.5 px-4 align-middle text-center">
                        <div className="flex justify-center">
                          <ShinobiRankSymbol item={item} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ФУТЕР */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
          <span>Показано: {filteredData.length} из 100 уровней</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition cursor-pointer"
          >
            Закрыть
          </button>
        </div>

      </div>
    </div>
  );
}
