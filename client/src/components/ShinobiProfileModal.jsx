import React, { useState } from 'react';
import { 
  X, Award, Trophy, Swords, Bot, Shield, Sparkles, 
  Check, Lock, ChevronRight, User, Mail, Flame, ExternalLink, Zap
} from 'lucide-react';
import { TITLES_DATA } from '../data/titlesData';

export default function ShinobiProfileModal({
  isOpen,
  onClose,
  userProfile,
  playerName,
  currentAccount,
  activeTitleId,
  unlockedTitleIds = ['first_step'],
  onSelectTitle,
  onOpenLeaderboard,
  onOpenRanks
}) {
  const [activeTab, setActiveTab] = useState('STATS'); // 'STATS' | 'TITLES'

  if (!isOpen) return null;

  const pvpStats = userProfile?.stats?.pvp || {
    battlesPlayed: userProfile?.battlesPlayed || 0,
    battlesWon: userProfile?.battlesWon || 0,
    battlesLost: Math.max(0, (userProfile?.battlesPlayed || 0) - (userProfile?.battlesWon || 0)),
    winrate: userProfile?.battlesPlayed ? Math.round(((userProfile?.battlesWon || 0) / userProfile?.battlesPlayed) * 100) : 0
  };

  const aiStats = userProfile?.stats?.ai || {
    battlesPlayed: 0,
    battlesWon: 0,
    battlesLost: 0,
    winrate: 0
  };

  const level = userProfile?.level || 1;
  const rank = userProfile?.rank || { title: 'Генин', stage: 'Начальная', symbol: '忍', icon: '🥋', color: '#94a3b8' };
  const currentWinsInLevel = userProfile?.currentWinsInLevel || 0;
  const winsRequired = userProfile?.winsRequiredForNextLevel || 1;
  const progressPercent = userProfile?.progressPercent || 0;
  const activeTitle = userProfile?.activeTitle || (activeTitleId ? TITLES_DATA.find(t => t.id === activeTitleId)?.name : null);

  const unlockedCount = (unlockedTitleIds || []).length;
  const totalTitlesCount = TITLES_DATA.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 select-none animate-fadeIn">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-950/98 p-4 sm:p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* ШАПКА МОДАЛЬНОГО ОКНА */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/25 to-orange-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl shadow-inner relative">
              <span>{rank.icon || '🥋'}</span>
              <span className="absolute -bottom-1 -right-1 text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full bg-amber-500 text-zinc-950 border border-zinc-950">
                {level}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-wide text-zinc-100 uppercase">
                  {playerName || 'Шиноби Листа'}
                </h2>
                {activeTitle && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm animate-pulse">
                    🎖️ {activeTitle}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-2">
                <span>Ранг: <strong className="text-amber-300 font-bold">{rank.title}</strong></span>
                <span>•</span>
                <span>Ступень: {rank.stage || 'Начальная'}</span>
                <span>•</span>
                <span className="font-serif text-amber-400">Печать: «{rank.symbol || '忍'}»</span>
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer border border-white/5"
            title="Закрыть профиль"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ПЕРЕКЛЮЧАТЕЛЬ ВКЛАДОК */}
        <div className="flex items-center gap-2 my-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('STATS')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
              activeTab === 'STATS'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-white/5 hover:border-white/10'
            }`}
          >
            <Swords className="w-4 h-4 text-amber-400" />
            <span>Боевая Статистика & Винрейт</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TITLES')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
              activeTab === 'TITLES'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-white/5 hover:border-white/10'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Достижения & Титулы ({unlockedCount}/{totalTitlesCount})</span>
          </button>
        </div>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {activeTab === 'STATS' ? (
            <>
              {/* КАРТОЧКА ПРОГРЕССА РАНГА ШИНОБИ */}
              <div className="bg-gradient-to-br from-amber-950/40 via-zinc-900/90 to-zinc-950 border border-amber-500/30 rounded-2xl p-4 shadow-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                      Прогресс ранга ниндзя: {rank.title} (Ур. {level})
                    </span>
                  </div>
                  {onOpenRanks && (
                    <button
                      type="button"
                      onClick={() => { onClose(); onOpenRanks(); }}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 underline cursor-pointer"
                    >
                      <span>Таблица 100 рангов</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-300 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                  <span>Побед в текущем уровне:</span>
                  <span className="text-amber-300 font-bold">
                    {currentWinsInLevel} из {winsRequired} побед ({progressPercent}%)
                  </span>
                </div>
              </div>

              {/* РАЗДЕЛЬНЫЕ КАРТОЧКИ: PVP VS AI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. БЛОК PVP (ЖИВЫЕ ИГРОКИ) */}
                <div className="bg-zinc-900/70 border border-amber-500/40 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-amber-500/20 pb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Swords className="w-4 h-4 text-amber-400" />
                        Рейтинговые PvP Дуэли
                      </span>
                      <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-lg">
                        {pvpStats.winrate}% побед
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center font-mono my-3">
                      <div className="bg-zinc-950/80 rounded-xl p-2 border border-white/5">
                        <div className="text-[10px] text-zinc-500">Сыграно</div>
                        <div className="text-base font-black text-zinc-100">{pvpStats.battlesPlayed}</div>
                      </div>
                      <div className="bg-emerald-950/40 rounded-xl p-2 border border-emerald-500/20">
                        <div className="text-[10px] text-emerald-400">Победы 🏆</div>
                        <div className="text-base font-black text-emerald-300">{pvpStats.battlesWon}</div>
                      </div>
                      <div className="bg-rose-950/40 rounded-xl p-2 border border-rose-500/20">
                        <div className="text-[10px] text-rose-400">Поражения</div>
                        <div className="text-base font-black text-rose-300">{pvpStats.battlesLost}</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-amber-300/80 bg-amber-950/30 p-2 rounded-xl border border-amber-500/20 text-center italic mt-2">
                    ⚡ Только эти победы прокачивают ранг и открывают титулы шиноби!
                  </div>
                </div>

                {/* 2. БЛОК AI (ТРЕНИРОВОЧНЫЙ ПОЛИГОН) */}
                <div className="bg-zinc-900/70 border border-blue-500/30 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-blue-500/20 pb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                        <Bot className="w-4 h-4 text-blue-400" />
                        Тренировочный Полигон (ИИ)
                      </span>
                      <span className="text-xs font-mono font-black text-blue-400 bg-blue-950/70 border border-blue-500/40 px-2 py-0.5 rounded-lg">
                        {aiStats.winrate}% побед
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center font-mono my-3">
                      <div className="bg-zinc-950/80 rounded-xl p-2 border border-white/5">
                        <div className="text-[10px] text-zinc-500">Спарринги</div>
                        <div className="text-base font-black text-zinc-100">{aiStats.battlesPlayed}</div>
                      </div>
                      <div className="bg-blue-950/40 rounded-xl p-2 border border-blue-500/20">
                        <div className="text-[10px] text-blue-400">Победы</div>
                        <div className="text-base font-black text-blue-300">{aiStats.battlesWon}</div>
                      </div>
                      <div className="bg-zinc-950/80 rounded-xl p-2 border border-white/5">
                        <div className="text-[10px] text-zinc-500">Поражения</div>
                        <div className="text-base font-black text-zinc-400">{aiStats.battlesLost}</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-blue-300/80 bg-blue-950/30 p-2 rounded-xl border border-blue-500/20 text-center italic mt-2">
                    🤖 Отработка техник против ботов (Саске, Итачи, Минато). Не влияет на ранг.
                  </div>
                </div>
              </div>

              {/* БАННЕР ЗАЛА СЛАВЫ И АККАУНТА */}
              <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Trophy className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">Зал Славы Конохи</h4>
                    <p className="text-[11px] text-zinc-400">Сравните ваши победы и винрейт со всеми шиноби деревни и друзьями.</p>
                  </div>
                </div>

                {onOpenLeaderboard && (
                  <button
                    type="button"
                    onClick={() => { onClose(); onOpenLeaderboard(); }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-105 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Смотреть Топ Шиноби</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            /* ВКЛАДКА ДОСТИЖЕНИЙ И ТИТУЛОВ */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs px-1 text-zinc-400">
                <span>Боевые титулы мира шиноби:</span>
                <span className="text-amber-300 font-mono font-bold">
                  Открыто {unlockedCount} из {totalTitlesCount} титулов
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TITLES_DATA.map((t) => {
                  const isUnlocked = unlockedTitleIds.includes(t.id);
                  const isEquipped = activeTitleId === t.id;

                  return (
                    <div
                      key={t.id}
                      className={`p-3 rounded-2xl border transition relative flex flex-col justify-between ${
                        isUnlocked
                          ? 'bg-zinc-900/80 border-amber-500/30 hover:border-amber-400'
                          : 'bg-zinc-950/80 border-white/5 opacity-60 grayscale-[35%]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${t.badgeBg}`}>
                            {t.rank}-ранг
                          </span>

                          {isUnlocked ? (
                            isEquipped ? (
                              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                                <Check className="w-3 h-3 text-amber-400" /> Надет
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onSelectTitle && onSelectTitle(t.id)}
                                className="text-[10px] font-bold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-2.5 py-0.5 rounded-full border border-white/10 transition cursor-pointer"
                              >
                                Надеть
                              </button>
                            )
                          ) : (
                            <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-zinc-600" /> Закрыт
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                          <span>{t.icon}</span>
                          <span style={{ color: t.color }}>{t.name}</span>
                        </h4>

                        <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                          {t.desc}
                        </p>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-white/5 text-[10px] font-mono text-zinc-500 flex items-center justify-between">
                        <span>Условие:</span>
                        <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                          {t.requirementText}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
