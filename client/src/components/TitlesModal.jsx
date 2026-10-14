import React, { useState } from 'react';
import { X, Award, Lock, Check, Sparkles, Shield, ChevronRight } from 'lucide-react';
import { TITLES_DATA, RANK_FILTER_TABS } from '../data/titlesData';

export default function TitlesModal({ 
  isOpen, 
  onClose, 
  userProfile, 
  activeTitleId, 
  unlockedTitleIds = ['first_step'], 
  onSelectTitle 
}) {
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const currentUnlocked = new Set(unlockedTitleIds || ['first_step']);

  const filteredTitles = TITLES_DATA.filter((title) => {
    const isUnlocked = currentUnlocked.has(title.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    if (filter === 'S') return title.rank === 'S' || title.rank === 'Mythic';
    return true;
  });

  const activeTitleObj = TITLES_DATA.find(t => t.id === activeTitleId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 select-none animate-fadeIn">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-950/98 p-4 sm:p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* ШАПКА */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl shadow-inner">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide text-zinc-100 uppercase">
                  Боевые Титулы Шиноби
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {currentUnlocked.size} из {TITLES_DATA.length} открыто
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Зарабатываются в честных PvP поединках с реальными людьми. Надетый титул виден всем игрокам!
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
            title="Закрыть окно титулов"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* БАННЕР ТЕКУЩЕГО ЭКИПИРОВАННОГО ТИТУЛА */}
        <div className="mt-3.5 bg-gradient-to-r from-amber-950/40 via-zinc-900/80 to-zinc-900/40 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 shrink-0 shadow-inner">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shrink-0">
              {activeTitleObj ? activeTitleObj.icon : '🥷'}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                Экипированный титул:
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-2 truncate">
                {activeTitleObj ? (
                  <>
                    <span style={{ color: activeTitleObj.color }}>{activeTitleObj.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/60 border border-white/10 text-zinc-300">
                      {activeTitleObj.rankLabel}
                    </span>
                  </>
                ) : (
                  <span className="text-zinc-500">Титул не выбран (отображается только никнейм)</span>
                )}
              </span>
            </div>
          </div>

          {activeTitleId && (
            <button
              type="button"
              onClick={() => onSelectTitle(null)}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-zinc-200 text-xs font-semibold transition cursor-pointer shrink-0"
              title="Снять титул"
            >
              Снять
            </button>
          )}
        </div>

        {/* ФИЛЬТРЫ */}
        <div className="mt-3 flex items-center gap-1.5 shrink-0 overflow-x-auto scrollbar-none pb-1">
          {RANK_FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                filter === tab.id
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                  : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:border-white/20 hover:text-zinc-200'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* СЕТКА ТИТУЛОВ */}
        <div className="mt-3 flex-1 overflow-y-auto pr-1 scrollbar-thin space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredTitles.map((item) => {
              const isUnlocked = currentUnlocked.has(item.id);
              const isEquipped = activeTitleId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition relative flex flex-col justify-between gap-3 ${
                    isEquipped
                      ? 'bg-gradient-to-br from-amber-950/60 via-zinc-900 to-zinc-900 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20'
                      : isUnlocked
                      ? 'bg-zinc-900/70 border-white/10 hover:border-white/25 hover:bg-zinc-900'
                      : 'bg-zinc-950/70 border-white/5 opacity-55 saturate-50'
                  }`}
                >
                  {/* Верхняя часть карточки */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Орнаментальный значок ранга */}
                        <div className={`w-9 h-9 rounded-xl p-[1px] bg-gradient-to-br ${item.ringColor} shadow-md shrink-0`}>
                          <div className="w-full h-full rounded-[10px] bg-zinc-950 flex items-center justify-center text-base">
                            {isUnlocked ? item.icon : <Lock className="w-4 h-4 text-zinc-500" />}
                          </div>
                        </div>

                        <div className="min-w-0">
                          <h4 
                            className="text-xs sm:text-sm font-black truncate leading-tight"
                            style={{ color: isUnlocked ? item.color : '#71717a' }}
                          >
                            {item.name}
                          </h4>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border inline-block mt-0.5 ${item.badgeBg}`}>
                            {item.rankLabel}
                          </span>
                        </div>
                      </div>

                      {/* Индикатор статуса */}
                      {isEquipped ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-md shadow-amber-400 animate-pulse shrink-0" />
                      ) : !isUnlocked ? (
                        <span className="p-1 rounded-lg bg-black/60 border border-white/5 text-zinc-500 shrink-0">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      ) : null}
                    </div>

                    {/* Описание подвига */}
                    <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>

                  {/* Нижняя часть: условие и кнопка */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-zinc-500 font-mono truncate">
                      {isUnlocked ? 'Условие выполнено ✓' : item.requirementText}
                    </span>

                    {isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => onSelectTitle(isEquipped ? null : item.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 ${
                          isEquipped
                            ? 'bg-amber-400 text-zinc-950 font-black shadow-md shadow-amber-400/30'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10'
                        }`}
                      >
                        {isEquipped ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Надето</span>
                          </>
                        ) : (
                          <span>Надеть</span>
                        )}
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Закрыто</span>
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ФУТЕР */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
          <span>Надевайте титулы, чтобы устрашать соперников перед боем!</span>
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
