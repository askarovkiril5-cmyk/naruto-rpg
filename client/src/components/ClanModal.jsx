import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Shield, Users, Trophy, MessageSquare, Plus, Send, 
  Sparkles, Check, Trash2, LogOut, Crown, UserPlus, Flame,
  Award, ChevronRight, AlertCircle, Edit3
} from 'lucide-react';
import { CLAN_EMBLEMS, getClanEmblemById } from '../data/clanEmblemsData';
import { audioManager } from '../utils/audioManager';
import { notificationManager } from '../utils/notificationManager';

export default function ClanModal({ 
  isOpen, 
  onClose, 
  userProfile, 
  playerName, 
  backendUrl, 
  socket 
}) {
  const [activeTab, setActiveTab] = useState('members'); // 'members' | 'chat' | 'top' | 'create' | 'settings'
  const [myClan, setMyClan] = useState(null);
  const [loadingClan, setLoadingClan] = useState(false);
  const [clanLeaderboard, setClanLeaderboard] = useState([]);
  const [loadingTop, setLoadingTop] = useState(false);

  // Создание клана
  const [newClanName, setNewClanName] = useState('');
  const [newClanMotto, setNewClanMotto] = useState('');
  const [selectedEmblemId, setSelectedEmblemId] = useState('emblem_uchiha');
  const [createError, setCreateError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Приглашение участника
  const [inviteInput, setInviteInput] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [inviteError, setInviteError] = useState('');

  // Чат клана
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const myIdentifier = userProfile?.email || userProfile?.name || playerName || 'shinobi';

  // 1. Загрузка клана пользователя
  const fetchMyClan = async () => {
    try {
      setLoadingClan(true);
      const res = await fetch(`${backendUrl}/api/clans/my/${encodeURIComponent(myIdentifier)}`);
      if (res.ok) {
        const data = await res.json();
        setMyClan(data.clan || null);
        if (data.clan) {
          setChatMessages(data.clan.chat || []);
        }
      }
    } catch (e) {
      console.warn('[ClanModal] Error fetching my clan:', e);
    } finally {
      setLoadingClan(false);
    }
  };

  // 2. Загрузка топа кланов
  const fetchClanLeaderboard = async () => {
    try {
      setLoadingTop(true);
      const res = await fetch(`${backendUrl}/api/clans/leaderboard`);
      if (res.ok) {
        const data = await res.json();
        setClanLeaderboard(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.warn('[ClanModal] Error fetching leaderboard:', e);
    } finally {
      setLoadingTop(false);
    }
  };

  // Первичная загрузка при открытии
  useEffect(() => {
    if (!isOpen) return;
    fetchMyClan();
    fetchClanLeaderboard();
  }, [isOpen, myIdentifier]);

  // Socket слушатели для закрытого чата и обновления клана
  useEffect(() => {
    if (!socket || !myClan?.id) return;

    // Входим в сокет-комнату клана
    socket.emit('join_clan_room', { clanId: myClan.id });

    const handleNewMessage = (msg) => {
      setChatMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    };

    const handleClanUpdated = (updatedClan) => {
      setMyClan(updatedClan);
      fetchClanLeaderboard();
    };

    const handleClanDisbanded = () => {
      setMyClan(null);
      setActiveTab('create');
      fetchClanLeaderboard();
    };

    socket.on('clan_message_received', handleNewMessage);
    socket.on('clan_updated', handleClanUpdated);
    socket.on('clan_disbanded', handleClanDisbanded);

    return () => {
      socket.emit('leave_clan_room', { clanId: myClan.id });
      socket.off('clan_message_received', handleNewMessage);
      socket.off('clan_updated', handleClanUpdated);
      socket.off('clan_disbanded', handleClanDisbanded);
    };
  }, [socket, myClan?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeTab]);

  if (!isOpen) return null;

  const isLeader = myClan && String(myClan.leaderKey).toLowerCase() === String(myIdentifier).toLowerCase();
  const currentEmblem = getClanEmblemById(myClan ? myClan.emblemId : selectedEmblemId);

  // 1. Создание клана
  const handleCreateClan = async (e) => {
    e?.preventDefault();
    setCreateError('');
    if (!newClanName.trim()) {
      setCreateError('Введите название вашего клана!');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`${backendUrl}/api/clans/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newClanName.trim(),
          leaderKey: myIdentifier,
          leaderName: userProfile?.name || playerName,
          motto: newClanMotto.trim(),
          emblemId: selectedEmblemId
        })
      });

      const data = await res.json();
      if (data.error) {
        setCreateError(data.error);
        return;
      }

      audioManager.playSfx('gong');
      setMyClan(data.clan);
      setActiveTab('members');
      fetchClanLeaderboard();
    } catch (err) {
      setCreateError('Ошибка связи с сервером при создании клана.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Отправка приглашения
  const handleSendInvite = async () => {
    setInviteError('');
    setInviteSuccess('');
    if (!inviteInput.trim()) {
      setInviteError('Укажите имя или почту шиноби для приглашения!');
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/clans/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clanId: myClan.id,
          fromKey: myIdentifier,
          toKey: inviteInput.trim()
        })
      });
      const data = await res.json();
      if (data.error) {
        setInviteError(data.error);
        return;
      }

      setInviteSuccess(`Свиток-приглашение в клан «${myClan.name}» успешно отправлен шиноби ${inviteInput}!`);
      setInviteInput('');
      setTimeout(() => setInviteSuccess(''), 4000);
    } catch (err) {
      setInviteError('Ошибка при отправке свитка приглашения.');
    }
  };

  // 3. Отправка сообщения в чат клана
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || !myClan) return;

    const text = chatInput.trim();
    setChatInput('');

    try {
      if (socket) {
        socket.emit('send_clan_message', {
          clanId: myClan.id,
          fromKey: myIdentifier,
          fromName: userProfile?.name || playerName,
          text
        });
      } else {
        await fetch(`${backendUrl}/api/clans/${myClan.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fromKey: myIdentifier,
            fromName: userProfile?.name || playerName,
            text
          })
        });
      }
    } catch (err) {
      console.warn('Clan message send error:', err);
    }
  };

  // 4. Покинуть клан
  const handleLeaveClan = async () => {
    if (!confirm('Вы уверены, что хотите покинуть клан?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/clans/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clanId: myClan.id, userKey: myIdentifier })
      });
      const data = await res.json();
      if (data.success) {
        setMyClan(null);
        setActiveTab('top');
        fetchClanLeaderboard();
      }
    } catch (e) {
      console.warn('Leave clan error:', e);
    }
  };

  // 5. Распустить клан (только лидер)
  const handleDisbandClan = async () => {
    if (!confirm('ВНИМАНИЕ! Вы точно хотите распустить клан? Все соклановцы будут исключены, клан удален из Зала Славы.')) return;
    try {
      const res = await fetch(`${backendUrl}/api/clans/disband`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clanId: myClan.id, userKey: myIdentifier })
      });
      const data = await res.json();
      if (data.success) {
        setMyClan(null);
        setActiveTab('create');
        fetchClanLeaderboard();
      }
    } catch (e) {
      console.warn('Disband clan error:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-4xl h-[90vh] rounded-3xl bg-zinc-950/98 border border-amber-500/30 shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        
        {/* ШАПКА КЛАНА */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div 
              className="p-1.5 sm:p-2 rounded-2xl bg-black/80 border shadow-2xl transition-all duration-300 transform hover:scale-105 shrink-0"
              style={{
                borderColor: `${currentEmblem.themeColor}80`,
                boxShadow: `0 0 25px ${currentEmblem.themeColor}40, inset 0 0 12px ${currentEmblem.themeColor}20`
              }}
            >
              {currentEmblem.renderSvg("w-12 h-12 sm:w-14 sm:h-14")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  {myClan ? '🏯 Мой Клан Конохи' : '🏯 Клановая Система Конохи'}
                </span>
                {myClan && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {isLeader ? '👑 Вы Глава Клана' : '🛡️ Соклановец'}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{myClan ? myClan.name : 'Великие Кланы Мира Шиноби'}</span>
              </h2>
              {myClan?.motto && (
                <p className="text-xs text-zinc-400 italic font-serif">
                  «{myClan.motto}»
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* НАВИГАЦИОННЫЕ ВКЛАДКИ */}
        <div className="flex items-center gap-2 p-2.5 sm:px-5 border-b border-white/5 bg-zinc-950/80 overflow-x-auto scrollbar-none shrink-0">
          {myClan ? (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('members')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'members'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Соклановцы ({myClan.memberCount || 1})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Чат Клана</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('top'); fetchClanLeaderboard(); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'top'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Топ Кланов Конохи</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'create'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Основать Клан</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('top'); fetchClanLeaderboard(); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'top'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Топ Кланов Конохи</span>
              </button>
            </>
          )}
        </div>

        {/* ТЕЛО МОДАЛЬНОГО ОКНА */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
          
          {/* ВКЛАДКА 1: СПИСОК СОКЛАНОВЦЕВ (MEMBERS) */}
          {activeTab === 'members' && myClan && (
            <div className="space-y-5">
              
              {/* Императорское Знамя Клана */}
              <div 
                className="p-4 sm:p-5 rounded-3xl border relative overflow-hidden transition-all duration-300 flex flex-col sm:flex-row items-center gap-4"
                style={{
                  background: `radial-gradient(circle at 15% 50%, ${currentEmblem.themeColor}25 0%, rgba(15, 15, 20, 0.95) 75%)`,
                  borderColor: `${currentEmblem.themeColor}70`,
                  boxShadow: `0 0 35px ${currentEmblem.themeColor}20, inset 0 0 20px ${currentEmblem.themeColor}15`
                }}
              >
                <div className="relative shrink-0 flex items-center justify-center">
                  <div 
                    className="absolute -inset-3 rounded-full blur-xl opacity-60 animate-pulse pointer-events-none"
                    style={{ backgroundColor: currentEmblem.themeColor }}
                  />
                  <div 
                    className="p-3 rounded-3xl bg-black/85 border shadow-2xl relative transition-transform duration-300 transform hover:scale-105"
                    style={{
                      borderColor: `${currentEmblem.themeColor}90`,
                      boxShadow: `0 0 30px ${currentEmblem.themeColor}50, inset 0 0 15px ${currentEmblem.themeColor}30`
                    }}
                  >
                    {currentEmblem.renderSvg("w-20 h-20 sm:w-24 sm:h-24")}
                  </div>
                  <span 
                    className="absolute -bottom-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-widest uppercase bg-black/90 border shadow-lg"
                    style={{
                      borderColor: currentEmblem.themeColor,
                      color: currentEmblem.themeColor
                    }}
                  >
                    {currentEmblem.kanji}
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-base sm:text-xl font-black text-white">
                      {myClan.name}
                    </h3>
                    {currentEmblem.elementBadge && (
                      <span 
                        className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-black/70 border shadow-sm"
                        style={{
                          borderColor: `${currentEmblem.themeColor}70`,
                          color: '#fef08a'
                        }}
                      >
                        {currentEmblem.elementBadge}
                      </span>
                    )}
                  </div>
                  {myClan.motto ? (
                    <p className="text-xs sm:text-sm text-amber-200/90 italic font-serif leading-relaxed">
                      «{myClan.motto}»
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-400 italic font-serif">
                      «{currentEmblem.defaultMotto}»
                    </p>
                  )}
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-sans line-clamp-2">
                    {currentEmblem.desc}
                  </p>
                </div>
              </div>

              {/* Статистическая плашка клана */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 text-center">
                  <span className="text-[10px] font-mono text-zinc-400 block">СУММАРНЫЙ ОПЫТ (XP)</span>
                  <span className="text-base sm:text-lg font-black text-amber-400">
                    {(myClan.totalClanXp || 0).toLocaleString()} XP
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 text-center">
                  <span className="text-[10px] font-mono text-zinc-400 block">PVP ПОБЕДЫ</span>
                  <span className="text-base sm:text-lg font-black text-emerald-400">
                    {myClan.totalPvpWins || 0}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 text-center">
                  <span className="text-[10px] font-mono text-zinc-400 block">СОСТАВ КЛАНА</span>
                  <span className="text-base sm:text-lg font-black text-cyan-300">
                    {myClan.memberCount || 1} шиноби
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 text-center">
                  <span className="text-[10px] font-mono text-zinc-400 block">СРЕДНИЙ УРОВЕНЬ</span>
                  <span className="text-base sm:text-lg font-black text-purple-300">
                    Ур. {myClan.avgLevel || 1}
                  </span>
                </div>
              </div>

              {/* Блок приглашения друзей в клан */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-amber-400" />
                    <span>Пригласить друга в Клан по почте</span>
                  </h4>
                  <span className="text-[10px] text-zinc-400">
                    Отправка официального свитка Конохи
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                    placeholder="Введите имя шиноби или email друга..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleSendInvite}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition shadow-md shadow-amber-600/30 cursor-pointer shrink-0"
                  >
                    Отправить свиток
                  </button>
                </div>

                {inviteSuccess && (
                  <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-fade-in">
                    <Check className="w-4 h-4" />
                    <span>{inviteSuccess}</span>
                  </div>
                )}
                {inviteError && (
                  <div className="text-xs text-rose-400 font-bold flex items-center gap-1.5 animate-fade-in">
                    <AlertCircle className="w-4 h-4" />
                    <span>{inviteError}</span>
                  </div>
                )}
              </div>

              {/* Список участников */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-zinc-300 uppercase font-mono">
                    Братья по оружию ({myClan.membersDetails?.length || 1})
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Сумма XP соклановцев двигает клан в мировом топе
                  </span>
                </div>

                <div className="space-y-2">
                  {(myClan.membersDetails || []).map((member, index) => {
                    const isMemLeader = member.identifier === myClan.leaderKey;
                    return (
                      <div
                        key={member.identifier}
                        className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                          isMemLeader 
                            ? 'bg-amber-950/20 border-amber-500/40 shadow-sm' 
                            : 'bg-zinc-900/70 border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-7 h-7 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-amber-400 shrink-0">
                            #{index + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-white truncate">
                                {member.name}
                              </span>
                              {isMemLeader && (
                                <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold shrink-0">
                                  👑 Глава
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-2 mt-0.5">
                              <span>Ур. {member.level}</span>
                              <span>•</span>
                              <span>{member.rank?.title || 'Генин'}</span>
                              {member.activeTitle && (
                                <>
                                  <span>•</span>
                                  <span className="text-amber-300 truncate">«{member.activeTitle}»</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-black text-amber-400 block">
                            {(member.totalXp || 0).toLocaleString()} XP
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {member.pvpStats?.battlesWon || 0} побед ({member.pvpStats?.winrate || 0}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Управление кланом: выход или роспуск */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
                <span className="text-[11px] text-zinc-400">
                  Дата основания: {new Date(myClan.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLeaveClan}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Покинуть Клан</span>
                  </button>

                  {isLeader && (
                    <button
                      type="button"
                      onClick={handleDisbandClan}
                      className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Распустить Клан</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ВКЛАДКА 2: ЗАКРЫТЫЙ ЧАТ КЛАНА (CHAT) */}
          {activeTab === 'chat' && myClan && (
            <div className="flex flex-col h-[65vh]">
              <div className="flex-1 overflow-y-auto space-y-2.5 p-3 rounded-2xl bg-black/40 border border-white/10 scrollbar-thin">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 text-xs p-6">
                    <MessageSquare className="w-10 h-10 mb-2 opacity-30 text-amber-400" />
                    <span>Закрытый чат клана пока пуст. Отправьте первое сообщение соклановцам!</span>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isSystem = msg.fromKey === 'system';
                    const isMine = String(msg.fromKey).toLowerCase() === String(myIdentifier).toLowerCase();

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-center text-xs text-amber-300">
                          {msg.text}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-zinc-400">
                          <span className="font-bold text-zinc-300">{msg.fromName}</span>
                          <span>•</span>
                          <span className="font-mono">{msg.time}</span>
                        </div>
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                            isMine
                              ? 'bg-amber-600 text-white rounded-tr-none shadow-md shadow-amber-600/20'
                              : 'bg-zinc-900 border border-white/10 text-zinc-200 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Написать соклановцам..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold text-xs transition shadow-md shadow-amber-600/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Отправить</span>
                </button>
              </form>
            </div>
          )}

          {/* ВКЛАДКА 3: ТОП КЛАНОВ КОНОХИ (LEADERBOARD) */}
          {activeTab === 'top' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Зал Славы Кланов Деревни Скрытого Листа</span>
                  </h3>
                  <span className="text-[11px] text-zinc-400">
                    Рейтинг определяется суммарным боевым опытом (PvP XP) всех участников клана
                  </span>
                </div>
                <button
                  type="button"
                  onClick={fetchClanLeaderboard}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 text-xs font-mono transition cursor-pointer"
                >
                  Обновить ↻
                </button>
              </div>

              {loadingTop ? (
                <div className="p-12 text-center text-zinc-400 text-xs">
                  Загрузка летописи кланов Конохи...
                </div>
              ) : clanLeaderboard.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 text-xs">
                  В Конохе пока не зарегистрировано ни одного клана. Будьте первыми и заложите основу новой эпохи!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {clanLeaderboard.map((clan, idx) => {
                    const emblem = getClanEmblemById(clan.emblemId);
                    const isMyClanInTop = myClan && myClan.id === clan.id;
                    const isPodium = idx < 3;

                    return (
                      <div
                        key={clan.id}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                          isMyClanInTop
                            ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/50 shadow-lg shadow-amber-500/10'
                            : isPodium
                              ? 'bg-gradient-to-r from-zinc-900/90 to-zinc-950 border-amber-500/30'
                              : 'bg-zinc-900/60 border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Медаль или номер */}
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black font-mono shrink-0 text-sm">
                            {idx === 0 && <span className="text-2xl" title="1 Место: Великий Клан">🥇</span>}
                            {idx === 1 && <span className="text-2xl" title="2 Место">🥈</span>}
                            {idx === 2 && <span className="text-2xl" title="3 Место">🥉</span>}
                            {idx > 2 && <span className="text-zinc-400">#{clan.rankPosition}</span>}
                          </div>

                          {/* Герб */}
                          <div 
                            className="p-1.5 rounded-2xl bg-black/80 border shrink-0 transition-transform hover:scale-105 shadow-md"
                            style={{
                              borderColor: `${emblem.themeColor}70`,
                              boxShadow: `0 0 15px ${emblem.themeColor}30`
                            }}
                          >
                            {emblem.renderSvg("w-9 h-9 sm:w-11 sm:h-11")}
                          </div>

                          {/* Данные клана */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-black text-white truncate">
                                {clan.name}
                              </h4>
                              {isMyClanInTop && (
                                <span className="text-[9px] font-mono font-bold px-2 py-0.2 rounded-full bg-amber-500 text-black shrink-0">
                                  Ваш Клан
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 italic line-clamp-1 font-serif">
                              «{clan.motto}»
                            </p>
                            <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-2 mt-0.5">
                              <span>Глава: <b className="text-zinc-300">{clan.leaderName}</b></span>
                              <span>•</span>
                              <span>Состав: {clan.memberCount} шиноби</span>
                            </div>
                          </div>
                        </div>

                        {/* Опыт и победы */}
                        <div className="text-right shrink-0">
                          <span className="text-xs sm:text-sm font-black font-mono text-amber-400 block">
                            {(clan.totalClanXp || 0).toLocaleString()} XP
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {clan.totalPvpWins || 0} побед
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ВКЛАДКА 4: ОСНОВАТЬ СОБСТВЕННЫЙ КЛАН (CREATE) */}
          {activeTab === 'create' && !myClan && (
            <form onSubmit={handleCreateClan} className="max-w-2xl mx-auto space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Основание Нового Клана Конохи
                </h3>
                <p className="text-xs text-zinc-400">
                  Выберите герб, укажите девиз и соберите лучших шиноби под вашим знаменем!
                </p>
              </div>

              {/* Название клана */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 block">
                  Название клана:
                </label>
                <input
                  type="text"
                  value={newClanName}
                  onChange={(e) => setNewClanName(e.target.value)}
                  placeholder="Например: Клан Учиха, Возрождённый Удзумаки или Клан Небесного Огня..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Боевой девиз */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 block">
                  Боевой девиз / клятва клана:
                </label>
                <input
                  type="text"
                  value={newClanMotto}
                  onChange={(e) => setNewClanMotto(e.target.value)}
                  placeholder="Например: Тот, кто отступит, не увидит рассвета пламени!"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Выбор герба из 18 императорских 3D медальонов */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                  <span>Выбор священного герба клана (Камон 3D):</span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">{CLAN_EMBLEMS.length} императорских медальонов</span>
                </label>

                {/* Императорский Пьедестал Выбранного Герба (Master Crest Showcase) */}
                <div 
                  className="p-4 rounded-3xl border relative overflow-hidden transition-all duration-500 flex flex-col sm:flex-row items-center gap-4"
                  style={{
                    background: `radial-gradient(circle at 18% 50%, ${currentEmblem.themeColor}22 0%, rgba(9, 9, 11, 0.95) 70%)`,
                    borderColor: `${currentEmblem.themeColor}70`,
                    boxShadow: `0 0 35px ${currentEmblem.themeColor}20, inset 0 0 20px ${currentEmblem.themeColor}15`
                  }}
                >
                  <div className="relative shrink-0 flex items-center justify-center">
                    <div 
                      className="absolute -inset-3 rounded-full blur-xl opacity-60 animate-pulse pointer-events-none"
                      style={{ backgroundColor: currentEmblem.themeColor }}
                    />
                    <div 
                      className="p-2.5 sm:p-3 rounded-3xl bg-black/85 border shadow-2xl relative transition-transform duration-300 transform hover:scale-105"
                      style={{
                        borderColor: `${currentEmblem.themeColor}90`,
                        boxShadow: `0 0 30px ${currentEmblem.themeColor}50, inset 0 0 15px ${currentEmblem.themeColor}30`
                      }}
                    >
                      {currentEmblem.renderSvg("w-18 h-18 sm:w-22 sm:h-22")}
                    </div>
                    <span 
                      className="absolute -bottom-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-widest uppercase bg-black/90 border shadow-lg"
                      style={{
                        borderColor: currentEmblem.themeColor,
                        color: currentEmblem.themeColor
                      }}
                    >
                      {currentEmblem.kanji}
                    </span>
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h4 className="text-sm sm:text-base font-black text-white">
                        {currentEmblem.name}
                      </h4>
                      {currentEmblem.elementBadge && (
                        <span 
                          className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-black/70 border shadow-sm"
                          style={{
                            borderColor: `${currentEmblem.themeColor}70`,
                            color: '#fef08a'
                          }}
                        >
                          {currentEmblem.elementBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {currentEmblem.desc}
                    </p>
                    {currentEmblem.defaultMotto && (
                      <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-amber-300/90 font-serif italic">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>«{currentEmblem.defaultMotto}»</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            audioManager.playSfx('click');
                            setNewClanMotto(currentEmblem.defaultMotto);
                          }}
                          className="text-[10px] font-mono text-amber-400 hover:text-amber-200 underline cursor-pointer not-italic transition-colors"
                        >
                          [Вставить девиз]
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                  {CLAN_EMBLEMS.map((emblem) => {
                    const isSelected = selectedEmblemId === emblem.id;
                    return (
                      <div
                        key={emblem.id}
                        onClick={() => {
                          audioManager.playSfx('click');
                          setSelectedEmblemId(emblem.id);
                        }}
                        className={`p-2.5 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-between gap-1.5 relative group ${
                          isSelected
                            ? 'bg-amber-950/50 border-amber-500 ring-2 ring-amber-400/60 shadow-xl scale-[1.02]'
                            : 'bg-zinc-900/60 border-white/5 hover:border-white/20 hover:bg-zinc-900/90 hover:scale-[1.02]'
                        }`}
                        style={isSelected ? {
                          borderColor: emblem.themeColor,
                          boxShadow: `0 0 25px ${emblem.themeColor}35, inset 0 0 10px ${emblem.themeColor}20`
                        } : undefined}
                      >
                        <div 
                          className="p-1.5 rounded-2xl bg-black/70 border transition-transform duration-300 group-hover:scale-110 shadow-inner"
                          style={{ borderColor: `${emblem.themeColor}40` }}
                        >
                          {emblem.renderSvg("w-12 h-12")}
                        </div>
                        <div className="w-full">
                          <span className="text-[11px] font-black text-white block truncate group-hover:text-amber-300 transition-colors">
                            {emblem.name.replace(/Герб\s+/i, '')}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-serif font-bold">
                            {emblem.kanji}
                          </span>
                        </div>
                        {isSelected && (
                          <span 
                            className="w-2.5 h-2.5 rounded-full absolute top-2 right-2 shadow-md animate-pulse"
                            style={{ backgroundColor: emblem.themeColor, boxShadow: `0 0 10px ${emblem.themeColor}` }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {createError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{createError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-black text-xs transition shadow-lg shadow-amber-600/30 cursor-pointer active:scale-[0.99]"
              >
                {isSubmitting ? 'Основание клана в Конохе...' : '🏯 Основать Клан и записать в Летопись'}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
