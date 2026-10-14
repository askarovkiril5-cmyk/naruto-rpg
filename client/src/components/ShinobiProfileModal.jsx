import React, { useState } from 'react';
import { 
  X, Award, Trophy, Swords, Bot, Shield, Sparkles, 
  Check, Lock, ChevronRight, User, Mail, Flame, ExternalLink, Zap,
  RefreshCw, LogIn, LogOut, CheckCircle2, AlertCircle, Cloud, Save
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
  onOpenRanks,
  onLinkEmail,
  onUnlinkEmail,
  onSyncAccount,
  selectedJutsuCount = 0,
  hasCustomNinja = false
}) {
  const [activeTab, setActiveTab] = useState('STATS'); // 'STATS' | 'TITLES' | 'ACCOUNT'
  const [inputEmail, setInputEmail] = useState('');
  const [syncStatus, setSyncStatus] = useState(null); // 'loading' | 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const linkedEmail = currentAccount?.email || userProfile?.email || null;

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
  const currentXpInLevel = userProfile?.currentXpInLevel ?? 0;
  const xpRequired = userProfile?.xpRequiredForNextLevel || 400;
  const totalXp = userProfile?.totalXp || 0;
  const progressPercent = userProfile?.progressPercent || 0;
  const activeTitle = userProfile?.activeTitle || (activeTitleId ? TITLES_DATA.find(t => t.id === activeTitleId)?.name : null);

  const unlockedCount = (unlockedTitleIds || []).length;
  const totalTitlesCount = TITLES_DATA.length;

  const handleManualSync = async () => {
    if (!onSyncAccount) return;
    setSyncStatus('loading');
    setStatusMessage('Синхронизация данных с облаком Конохи...');
    try {
      const res = await onSyncAccount();
      setSyncStatus('success');
      setStatusMessage('✅ Все данные аккаунта (победы, уровень, арсенал, титулы) успешно сохранены в облаке!');
      setTimeout(() => setSyncStatus(null), 4000);
    } catch (e) {
      setSyncStatus('error');
      setStatusMessage('Не удалось синхронизировать данные с сервером.');
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  const handleLinkSubmit = async (mode = 'save') => {
    if (!inputEmail.trim() || !inputEmail.includes('@')) {
      setSyncStatus('error');
      setStatusMessage('Пожалуйста, введите корректный адрес электронной почты.');
      setTimeout(() => setSyncStatus(null), 3000);
      return;
    }

    setSyncStatus('loading');
    setStatusMessage(mode === 'load' ? 'Поиск и загрузка аккаунта из облака...' : 'Привязка почты и сохранение аккаунта...');

    try {
      if (onLinkEmail) {
        const res = await onLinkEmail(inputEmail.trim(), mode);
        if (res && res.success) {
          setSyncStatus('success');
          setStatusMessage(mode === 'load' 
            ? '✅ Аккаунт найден! Все победы, ранг, арсенал и титулы успешно восстановлены.'
            : '✅ Почта успешно привязана! Все данные сохранены в облаке.');
          setInputEmail('');
          setTimeout(() => setSyncStatus(null), 4000);
        } else {
          setSyncStatus('error');
          setStatusMessage(res?.error || 'Ошибка при сохранении аккаунта.');
          setTimeout(() => setSyncStatus(null), 4000);
        }
      }
    } catch (err) {
      setSyncStatus('error');
      setStatusMessage('Ошибка связи с сервером: ' + err.message);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  const handleUnlink = () => {
    if (confirm('Вы уверены, что хотите отвязать текущую почту на этом устройстве? Все сохраненные данные останутся на сервере под этой почтой.')) {
      if (onUnlinkEmail) onUnlinkEmail();
      setSyncStatus('success');
      setStatusMessage('Почта успешно отвязана на этом устройстве.');
      setTimeout(() => setSyncStatus(null), 3000);
    }
  };

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
                {linkedEmail ? (
                  <span 
                    onClick={() => setActiveTab('ACCOUNT')}
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 cursor-pointer hover:bg-emerald-900/80 transition"
                    title={`Аккаунт привязан к ${linkedEmail}`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{linkedEmail}</span>
                  </span>
                ) : (
                  <span 
                    onClick={() => setActiveTab('ACCOUNT')}
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1 cursor-pointer hover:bg-amber-900/80 transition"
                    title="Нажмите, чтобы привязать почту и сохранить все данные"
                  >
                    <Mail className="w-3 h-3 text-amber-400" />
                    <span>Привязать почту</span>
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
            <span>Статистика & Винрейт</span>
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
            <span>Достижения ({unlockedCount}/{totalTitlesCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ACCOUNT')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
              activeTab === 'ACCOUNT'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-white/5 hover:border-white/10'
            }`}
          >
            <Cloud className="w-4 h-4 text-amber-400" />
            <span>Облако & Почта</span>
            {linkedEmail && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* СТАТУС-БАР ОПЕРАЦИЙ */}
        {syncStatus && (
          <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 animate-fadeIn ${
            syncStatus === 'success' 
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300' 
              : syncStatus === 'error'
              ? 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
              : 'bg-amber-950/80 border border-amber-500/50 text-amber-300'
          }`}>
            {syncStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {syncStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {syncStatus === 'loading' && <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />}
            <span>{statusMessage}</span>
          </div>
        )}

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {activeTab === 'STATS' && (
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
                  <span>Опыт до след. уровня (XP):</span>
                  <span className="text-amber-300 font-bold">
                    {currentXpInLevel.toLocaleString()} / {xpRequired.toLocaleString()} XP ({progressPercent}%)
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-0.5">
                  <span>Всего боевого опыта шиноби:</span>
                  <span className="text-zinc-300 font-semibold">{totalXp.toLocaleString()} XP</span>
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

              {/* БАННЕР ЗАЛА СЛАВЫ */}
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
          )}

          {activeTab === 'TITLES' && (
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

          {activeTab === 'ACCOUNT' && (
            /* ВКЛАДКА ОБЛАЧНОГО АККАУНТА И ПОЧТЫ */
            <div className="space-y-4">
              {linkedEmail ? (
                /* 1. ПОЧТА УЖЕ ПРИВЯЗАНА */
                <div className="space-y-4">
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-zinc-900 to-zinc-950 border border-emerald-500/40 shadow-xl space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-zinc-100">
                              Облачное сохранение активно
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/40">
                              ONLINE SYNC
                            </span>
                          </div>
                          <p className="text-xs font-mono text-emerald-300 font-bold mt-0.5 flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{linkedEmail}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleManualSync}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5 cursor-pointer"
                          title="Синхронизировать текущий прогресс с сервером прямо сейчас"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Сохранить всё сейчас</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleUnlink}
                          className="p-1.5 rounded-xl bg-zinc-800 hover:bg-rose-950 text-zinc-400 hover:text-rose-300 border border-white/10 transition cursor-pointer"
                          title="Отвязать почту на этом компьютере"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-3">
                      <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                        Что навсегда привязано к вашей почте в базе Конохи:
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                        <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-zinc-500 block">Уровень и Ранг:</span>
                          <span className="font-bold text-amber-300">Ур. {level} ({rank.title})</span>
                        </div>
                        <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-zinc-500 block">PvP Победы:</span>
                          <span className="font-bold text-emerald-300">{pvpStats.battlesWon} побед ({pvpStats.winrate}%)</span>
                        </div>
                        <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-zinc-500 block">Арсенал техник:</span>
                          <span className="font-bold text-cyan-300">{selectedJutsuCount}/30 техник</span>
                        </div>
                        <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-zinc-500 block">Досье шиноби:</span>
                          <span className="font-bold text-zinc-200">{hasCustomNinja ? 'Созданный боец' : 'Стандартное'}</span>
                        </div>
                        <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-zinc-500 block">Боевые титулы:</span>
                          <span className="font-bold text-amber-400">{unlockedCount} открыто</span>
                        </div>
                        <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-zinc-500 block">Модели ИИ:</span>
                          <span className="font-bold text-purple-300">Gemini 3.8 Flash VIP</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Смена аккаунта / вход под другой почтой */}
                  <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">
                    <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <LogIn className="w-4 h-4 text-cyan-400" />
                      <span>Войти под другой почтой или загрузить другой аккаунт:</span>
                    </h4>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="email"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        placeholder="Введите другую почту (например, kirill@gmail.com)..."
                        className="bg-black/80 border border-white/15 focus:border-cyan-400 px-3.5 py-2 rounded-xl text-xs font-mono text-zinc-100 placeholder-zinc-500 outline-none w-full flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleLinkSubmit('load')}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/30 shrink-0"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Загрузить данные из облака</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* 2. ПОЧТА ЕЩЕ НЕ ПРИВЯЗАНА (ГОСТЕВОЙ РЕЖИМ) */
                <div className="space-y-4">
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-950 border border-amber-500/40 shadow-xl space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md shrink-0">
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                          Гостевой профиль (Данные пока только в этом браузере)
                        </h3>
                        <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                          Привяжите вашу почту, чтобы все ваши победы, уровень, ранг, выбранный боевой арсенал 30 техник, кастомное досье и открытые титулы сохранялись на сервере навсегда.
                        </p>
                      </div>
                    </div>

                    <div className="bg-black/50 p-3 rounded-xl border border-white/5 space-y-2 text-xs">
                      <div className="font-bold text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Что даёт привязка почты:</span>
                      </div>
                      <ul className="space-y-1 text-zinc-300 text-[11px] list-disc list-inside">
                        <li><strong>100% сохранение побед и ранга:</strong> ваш прогресс не сотрется при очистке куки или смене браузера.</li>
                        <li><strong>Игра с любого ПК:</strong> просто введите почту на другом устройстве — и все 30 техник и титулы сразу загрузятся.</li>
                        <li><strong>Разблокировка VIP Gemini 3.8 Flash & 2.5 Pro:</strong> моментальный доступ к флагманским моделям ИИ-Ведущего.</li>
                      </ul>
                    </div>

                    {/* Поле ввода почты и кнопки */}
                    <div className="pt-2 space-y-2">
                      <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-amber-400" />
                        <span>Введите ваш Email для привязки:</span>
                      </label>
                      <input
                        type="email"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        placeholder="например, kirill@gmail.com..."
                        className="bg-black/80 border border-white/20 focus:border-amber-400 px-3.5 py-2.5 rounded-xl text-xs font-mono text-zinc-100 placeholder-zinc-500 outline-none w-full transition"
                      />

                      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleLinkSubmit('save')}
                          className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Привязать почту и сохранить текущий аккаунт</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleLinkSubmit('load')}
                          className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-xs border border-white/10 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
                        >
                          <LogIn className="w-4 h-4 text-cyan-400" />
                          <span>Войти по почте (Загрузить прогресс)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
