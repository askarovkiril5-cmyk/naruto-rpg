import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Users, Trophy, MessageSquare, Search, UserPlus, 
  Send, Swords, Check, Trash2, Shield, Sparkles, ExternalLink,
  Award, Circle, Flame
} from 'lucide-react';

export default function FriendsModal({ 
  isOpen, 
  onClose, 
  userProfile, 
  playerName, 
  backendUrl, 
  socket,
  onJoinRoom 
}) {
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'friends' | 'search'
  const [leaderboardFilter, setLeaderboardFilter] = useState('global'); // 'global' | 'friends'
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Друзья
  const [friendsList, setFriendsList] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Поиск друзей
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addFriendSuccess, setAddFriendSuccess] = useState('');

  // Личные сообщения
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  // Список онлайн пользователей
  const [onlineIdentifiers, setOnlineIdentifiers] = useState([]);

  const myIdentifier = userProfile?.email || userProfile?.name || playerName || 'shinobi';

  // 1. Загрузка Зала Славы
  const fetchLeaderboard = async (filterType) => {
    try {
      setLoadingLeaderboard(true);
      const url = `${backendUrl}/api/leaderboard?filter=${filterType}&user=${encodeURIComponent(myIdentifier)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.warn('Leaderboard fetch error:', e);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  // 2. Загрузка списка друзей
  const fetchFriends = async () => {
    try {
      setLoadingFriends(true);
      const res = await fetch(`${backendUrl}/api/friends/${encodeURIComponent(myIdentifier)}`);
      if (res.ok) {
        const data = await res.json();
        setFriendsList(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.warn('Friends fetch error:', e);
    } finally {
      setLoadingFriends(false);
    }
  };

  // 3. Загрузка истории личных сообщений
  const fetchMessages = async (friendId) => {
    if (!friendId) return;
    try {
      const res = await fetch(`${backendUrl}/api/messages/${encodeURIComponent(myIdentifier)}/${encodeURIComponent(friendId)}`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.warn('Messages fetch error:', e);
    }
  };

  // Socket слушатели для сообщений и онлайн-статуса
  useEffect(() => {
    if (!socket) return;

    // Регистрация себя в сети
    socket.emit('register_shinobi', { identifier: myIdentifier });

    const handleReceiveMsg = (msg) => {
      if (selectedFriend && (msg.from === selectedFriend.identifier || msg.to === selectedFriend.identifier)) {
        setChatMessages(prev => [...prev, msg]);
      }
    };

    const handleMsgSent = (msg) => {
      setChatMessages(prev => [...prev, msg]);
    };

    const handleOnlineUpdate = (list) => {
      setOnlineIdentifiers(Array.isArray(list) ? list : []);
    };

    socket.on('receive_direct_message', handleReceiveMsg);
    socket.on('direct_message_sent', handleMsgSent);
    socket.on('online_users_updated', handleOnlineUpdate);

    return () => {
      socket.off('receive_direct_message', handleReceiveMsg);
      socket.off('direct_message_sent', handleMsgSent);
      socket.off('online_users_updated', handleOnlineUpdate);
    };
  }, [socket, myIdentifier, selectedFriend]);

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard(leaderboardFilter);
      fetchFriends();
    }
  }, [isOpen, leaderboardFilter]);

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages(selectedFriend.identifier);
    }
  }, [selectedFriend]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!isOpen) return null;

  // Поиск игроков по почте или имени
  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      setIsSearching(true);
      const res = await fetch(`${backendUrl}/api/users/search?q=${encodeURIComponent(searchQuery)}&exclude=${encodeURIComponent(myIdentifier)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.warn('Search error:', e);
    } finally {
      setIsSearching(false);
    }
  };

  // Добавление в друзья
  const handleAddFriend = async (friendKey) => {
    try {
      const res = await fetch(`${backendUrl}/api/friends/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userKey: myIdentifier, friendKey })
      });
      if (res.ok) {
        setAddFriendSuccess(friendKey);
        fetchFriends();
        setTimeout(() => setAddFriendSuccess(''), 3000);
      }
    } catch (e) {
      console.warn('Add friend error:', e);
    }
  };

  // Удаление из друзей
  const handleRemoveFriend = async (friendKey, e) => {
    e?.stopPropagation();
    if (!confirm('Удалить этого шиноби из друзей?')) return;
    try {
      await fetch(`${backendUrl}/api/friends/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userKey: myIdentifier, friendKey })
      });
      fetchFriends();
      if (selectedFriend?.identifier === friendKey) {
        setSelectedFriend(null);
      }
    } catch (e) {}
  };

  // Отправка личного сообщения
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || !selectedFriend) return;

    if (socket) {
      socket.emit('send_direct_message', {
        from: myIdentifier,
        to: selectedFriend.identifier,
        text: chatInput.trim()
      });
    }
    setChatInput('');
  };

  // Бросить вызов на дуэль прямо в чате
  const handleSendDuelInvite = () => {
    if (!selectedFriend) return;
    const duelRoomId = 'KONOHA-' + Math.floor(100 + Math.random() * 900);
    const invitePayload = {
      from: myIdentifier,
      to: selectedFriend.identifier,
      text: `⚔️ Бросаю вам вызов на честную дуэль шиноби! Комната: ${duelRoomId}`,
      inviteData: {
        roomId: duelRoomId,
        challenger: playerName || myIdentifier
      }
    };

    if (socket) {
      socket.emit('send_direct_message', invitePayload);
    }

    if (onJoinRoom) {
      onJoinRoom(duelRoomId);
      onClose();
    }
  };

  const isUserOnline = (id) => {
    if (!id) return false;
    return onlineIdentifiers.includes(String(id).trim().toLowerCase());
  };

  // Форматирование времени личного сообщения по местному часовому поясу игрока
  const formatDirectMsgTime = (msg) => {
    if (msg?.timestamp) {
      const d = new Date(msg.timestamp);
      if (!isNaN(d.getTime())) {
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return isToday ? timeStr : `${d.toLocaleDateString([], { day: '2-digit', month: '2-digit' })} ${timeStr}`;
      }
    }
    return msg?.time || '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 select-none animate-fadeIn">
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-zinc-950/98 p-4 sm:p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* ШАПКА */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl shadow-inner">
              <Users className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide text-zinc-100 uppercase">
                  Штаб Друзей & Зал Славы Конохи
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Онлайн сеть
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Зал Славы по честным PvP дуэлям, поиск друзей по почте и секретные боевые депеши.
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ГЛАВНЫЕ ВКЛАДКИ РАЗДЕЛА */}
        <div className="mt-3.5 flex items-center gap-2 shrink-0 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              activeTab === 'leaderboard'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:border-white/20 hover:text-zinc-200'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Зал Славы (Рейтинг)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('friends')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              activeTab === 'friends'
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/60 shadow-sm'
                : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:border-white/20 hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>Мои Друзья & Чат ({friendsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              activeTab === 'search'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-sm'
                : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:border-white/20 hover:text-zinc-200'
            }`}
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>Поиск по Почте</span>
          </button>
        </div>

        {/* 1. ВКЛАДКА: ЗАЛ СЛАВЫ (РЕЙТИНГ) */}
        {activeTab === 'leaderboard' && (
          <div className="mt-3 flex-1 flex flex-col overflow-hidden min-h-0">
            {/* Переключатель: Вся Коноха vs Друзья */}
            <div className="flex items-center justify-between gap-2 mb-3 shrink-0">
              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setLeaderboardFilter('global')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    leaderboardFilter === 'global'
                      ? 'bg-zinc-800 text-amber-300 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  ⛩️ Вся Коноха
                </button>
                <button
                  type="button"
                  onClick={() => setLeaderboardFilter('friends')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    leaderboardFilter === 'friends'
                      ? 'bg-zinc-800 text-blue-300 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  👥 Только Друзья
                </button>
              </div>

              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                * Уровень и рейтинг учитывают строго PvP поединки
              </span>
            </div>

            {/* Карточка личной статистики шиноби в Зале Славы */}
            <div className="bg-gradient-to-r from-amber-950/50 via-zinc-900 to-zinc-950 border border-amber-500/40 rounded-xl p-3 flex items-center justify-between gap-2 flex-wrap text-xs shadow-lg">
              <div className="flex items-center gap-2.5">
                <span className="text-xl p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30">
                  {userProfile?.rank?.icon || '🥋'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-amber-300 uppercase tracking-wide">Ваш профиль: {playerName || 'Шиноби'}</span>
                    {userProfile?.activeTitle && (
                      <span className="text-[10px] text-amber-300 font-bold px-2 py-0.2 rounded-full bg-amber-500/20 border border-amber-500/40">
                        🎖️ {userProfile.activeTitle}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    Ранг: <strong className="text-amber-400">{userProfile?.rank?.title || 'Генин'} (Уровень {userProfile?.level || 1})</strong> • Печать: {userProfile?.rank?.symbol || '忍'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="bg-zinc-950/70 px-2.5 py-1 rounded-lg border border-white/5">
                  <span className="text-zinc-400 text-[10px] block">⚔️ PvP Победы</span>
                  <span className="text-emerald-400 font-black text-sm">{userProfile?.stats?.pvp?.battlesWon || userProfile?.battlesWon || 0}</span>
                </div>
                <div className="bg-zinc-950/70 px-2.5 py-1 rounded-lg border border-white/5">
                  <span className="text-zinc-400 text-[10px] block">% Винрейт</span>
                  <span className="text-amber-300 font-black text-sm">{userProfile?.stats?.pvp?.winrate || 0}%</span>
                </div>
                <div className="bg-zinc-950/70 px-2.5 py-1 rounded-lg border border-white/5 hidden sm:block">
                  <span className="text-zinc-400 text-[10px] block">🤖 ИИ Спарринги</span>
                  <span className="text-blue-300 font-black text-sm">{userProfile?.stats?.ai?.battlesPlayed || 0}</span>
                </div>
              </div>
            </div>

            {/* Таблица Зала Славы */}
            <div className="flex-1 overflow-y-auto scrollbar-thin border border-white/10 rounded-2xl bg-black/40">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-md border-b border-white/10">
                  <tr className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold">
                    <th className="py-3 px-3 w-16 text-center text-amber-400">Место</th>
                    <th className="py-3 px-3">Шиноби & Титул</th>
                    <th className="py-3 px-3 text-center">Ранг & Уровень</th>
                    <th className="py-3 px-3 text-center">PvP Дуэли</th>
                    <th className="py-3 px-3 text-center text-emerald-400">Винрейт (% побед)</th>
                    <th className="py-3 px-3 text-center text-zinc-500">ИИ Спарринги</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {loadingLeaderboard ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-zinc-500 text-xs">
                        Свитки Зала Славы загружаются...
                      </td>
                    </tr>
                  ) : leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-zinc-500 text-xs">
                        Нет записей в этой категории. Сыграйте первый PvP бой!
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((item, idx) => {
                      const isMe = item.identifier === myIdentifier.toLowerCase();
                      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
                      return (
                        <tr
                          key={item.identifier || idx}
                          className={`transition ${
                            isMe ? 'bg-amber-500/15 border-l-4 border-l-amber-400 font-semibold' : 'hover:bg-white/[0.03]'
                          }`}
                        >
                          <td className="py-3 px-3 text-center text-sm font-black font-mono">
                            {medal}
                          </td>

                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{item.rank?.icon || '🥷'}</span>
                              <div className="min-w-0">
                                <span className="font-bold text-zinc-100 flex items-center gap-1.5 truncate">
                                  <span>{item.name}</span>
                                  {isMe && (
                                    <span className="text-[9px] bg-amber-500/30 text-amber-300 px-1 rounded font-mono font-bold">ВЫ</span>
                                  )}
                                </span>
                                {item.activeTitle && (
                                  <span className="text-[10px] text-amber-400 font-mono block truncate">
                                    {item.activeTitle}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-lg bg-zinc-900 border border-white/10 font-mono font-bold text-[11px] text-zinc-200">
                              Ур. {item.level} ({item.rank?.title || 'Генин'})
                            </span>
                            {item.totalXp > 0 && (
                              <span className="block text-[9px] font-mono text-amber-400/80 mt-0.5">
                                {item.totalXp.toLocaleString()} XP
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3 text-center font-mono">
                            <span className="text-zinc-200">{item.pvp?.battlesWon || 0}</span>
                            <span className="text-zinc-500"> / </span>
                            <span className="text-zinc-400">{item.pvp?.battlesPlayed || 0}</span>
                          </td>

                          <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">
                            {item.pvp?.winrate || 0}%
                          </td>

                          <td className="py-3 px-3 text-center font-mono text-zinc-400 text-[11px]">
                            {item.ai?.battlesWon || 0} из {item.ai?.battlesPlayed || 0}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. ВКЛАДКА: ДРУЗЬЯ И ЛИЧНЫЕ ЧАТЫ */}
        {activeTab === 'friends' && (
          <div className="mt-3 flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 overflow-hidden min-h-0">
            {/* Левая колонка: список друзей */}
            <div className="md:col-span-5 flex flex-col overflow-hidden border border-white/10 rounded-2xl bg-black/40">
              <div className="p-2.5 border-b border-white/5 bg-zinc-900/40 text-[11px] font-bold text-zinc-400 flex justify-between items-center">
                <span>Список друзей ({friendsList.length})</span>
                <span className="text-[10px] text-zinc-500">Нажмите для чата</span>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
                {friendsList.length === 0 ? (
                  <div className="p-6 text-center text-zinc-500 text-xs space-y-2">
                    <p>Список друзей пока пуст.</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('search')}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold transition cursor-pointer"
                    >
                      + Найти друзей по почте
                    </button>
                  </div>
                ) : (
                  friendsList.map((f) => {
                    const isSelected = selectedFriend?.identifier === f.identifier;
                    const online = isUserOnline(f.identifier);
                    return (
                      <div
                        key={f.identifier}
                        onClick={() => setSelectedFriend(f)}
                        className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-blue-950/60 border-blue-500/60 shadow-md ring-1 ring-blue-500/30'
                            : 'bg-zinc-900/60 border-white/5 hover:bg-zinc-900 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative shrink-0">
                            <span className="text-xl">{f.rank?.icon || '🥷'}</span>
                            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-black ${
                              online ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-zinc-600'
                            }`} />
                          </div>

                          <div className="min-w-0">
                            <span className="text-xs font-bold text-zinc-100 block truncate">
                              {f.name}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono block truncate">
                              Ур. {f.level} • {f.pvpStats?.winrate || 0}% побед
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleRemoveFriend(f.identifier, e)}
                          className="p-1 rounded-lg text-zinc-600 hover:text-rose-400 transition cursor-pointer"
                          title="Удалить из друзей"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Правая колонка: окно личного чата */}
            <div className="md:col-span-7 flex flex-col overflow-hidden border border-white/10 rounded-2xl bg-zinc-900/40">
              {selectedFriend ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Шапка чата с другом */}
                  <div className="p-3 border-b border-white/10 bg-black/40 flex items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{selectedFriend.rank?.icon || '🥷'}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-zinc-100">{selectedFriend.name}</span>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                            isUserOnline(selectedFriend.identifier)
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}>
                            {isUserOnline(selectedFriend.identifier) ? 'В СЕТИ' : 'ОФЛАЙН'}
                          </span>
                        </div>
                        <span className="text-[10px] text-amber-400 font-mono">
                          {selectedFriend.activeTitle || 'Шиноби Листа'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendDuelInvite}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-600/30"
                      title="Отправить вызов на дуэль 1 на 1"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span>Вызвать на бой</span>
                    </button>
                  </div>

                  {/* Сообщения диалога */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
                    {chatMessages.length === 0 ? (
                      <div className="p-8 text-center text-zinc-500 text-xs">
                        Здесь пока нет сообщений. Напишите другу или бросьте вызов на бой!
                      </div>
                    ) : (
                      chatMessages.map((m) => {
                        const isMine = m.from === myIdentifier.toLowerCase();
                        return (
                          <div
                            key={m.id}
                            className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                          >
                            <span className="text-[9px] text-zinc-500 font-mono mb-0.5">
                              {isMine ? 'Вы' : selectedFriend.name} • {formatDirectMsgTime(m)}
                            </span>

                            <div
                              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-md ${
                                isMine
                                  ? 'bg-blue-600 text-white rounded-br-none'
                                  : 'bg-zinc-800 text-zinc-100 rounded-bl-none border border-white/10'
                              }`}
                            >
                              {m.text}

                              {/* Интерактивная карточка вызова на дуэль */}
                              {m.inviteData?.roomId && (
                                <div className="mt-2 p-2.5 rounded-xl bg-black/60 border border-amber-500/50 space-y-2">
                                  <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                                    <Swords className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Дуэль: {m.inviteData.roomId}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onJoinRoom) {
                                        onJoinRoom(m.inviteData.roomId);
                                        onClose();
                                      }
                                    }}
                                    className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition cursor-pointer text-center"
                                  >
                                    Войти на Арену ⚔️
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Поле ввода сообщения */}
                  <form onSubmit={handleSendMessage} className="p-2.5 border-t border-white/10 bg-black/60 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Написать сообщение шиноби..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-zinc-200 outline-none focus:border-blue-500 transition"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500 space-y-2">
                  <MessageSquare className="w-10 h-10 text-zinc-700" />
                  <p className="text-xs">Выберите друга из списка слева, чтобы открыть диалог.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. ВКЛАДКА: ПОИСК ПО ПОЧТЕ И ДОБАВЛЕНИЕ ДРУЗЕЙ */}
        {activeTab === 'search' && (
          <div className="mt-3 flex-1 flex flex-col overflow-hidden min-h-0 space-y-3">
            {/* Форма поиска */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Введите почту друга (напр. friend@gmail.com) или имя..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500 transition"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isSearching ? 'Поиск...' : 'Найти'}</span>
              </button>
            </form>

            {/* Результаты поиска */}
            <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin border border-white/10 rounded-2xl bg-black/40 p-3 space-y-2">
              {searchResults.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  {searchQuery ? 'Шиноби с такой почтой или именем не найдены.' : 'Введите почту друга выше и нажмите «Найти».'}
                </div>
              ) : (
                searchResults.map((item) => {
                  const alreadyFriend = friendsList.some(f => f.identifier === item.identifier);
                  const isAddedJustNow = addFriendSuccess === item.identifier;

                  return (
                    <div
                      key={item.identifier}
                      className="p-3 rounded-xl bg-zinc-900/70 border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl shrink-0">
                          {item.rank?.icon || '🥷'}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-zinc-100 flex items-center gap-2 truncate">
                            <span>{item.name}</span>
                            {item.email && (
                              <span className="text-[10px] text-zinc-500 font-mono">({item.email})</span>
                            )}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
                            Ур. {item.level} ({item.rank?.title || 'Генин'}) • {item.pvpStats?.winrate || 0}% побед
                          </span>
                        </div>
                      </div>

                      {alreadyFriend || isAddedJustNow ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-xs font-bold flex items-center gap-1 shrink-0">
                          <Check className="w-3.5 h-3.5" />
                          <span>В друзьях</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddFriend(item.identifier)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Добавить</span>
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ФУТЕР */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
          <span>Сражайтесь с друзьями и поднимайтесь на вершину Зала Славы Конохи!</span>
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
