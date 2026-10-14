import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  Send, Loader2, Play, Users, Swords, Crown, Sparkles, 
  ChevronDown, Compass, Zap, Shield, User, Backpack,
  Volume2, VolumeX, Bot, Music, Copy, Check, Share2, Plus, 
  ArrowRightLeft, ShieldAlert, UserPlus, Users2, BookOpen, Lock, Unlock
} from 'lucide-react';
import TopMenu from './components/TopMenu';
import SettingsModal, { initTheme } from './components/SettingsModal';
import RulesModal from './components/RulesModal';
import JutsuBookModal from './components/JutsuBookModal';
import MyArsenalModal from './components/MyArsenalModal';
import SecretProfileDrawer from './components/SecretProfileDrawer';
import CharacterCreatorModal from './components/CharacterCreatorModal';
import BattleChronicleModal from './components/BattleChronicleModal';
import AiModelModal from './components/AiModelModal';
import ShinobiRanksModal from './components/ShinobiRanksModal';
import ShinobiMailModal from './components/ShinobiMailModal';
import NarrativeRenderer from './components/NarrativeRenderer';
import defaultJutsuData from './data/jutsuData.json';
import { audioManager, AUDIO_TRACKS } from './utils/audioManager';
import { notificationManager } from './utils/notificationManager';

export const CANONICAL_BOTS = [
  {
    id: 'sasuke',
    name: 'Учиха Саске',
    title: 'Последний гений Учиха',
    avatar: '⚡',
    badge: 'Чидори & Шаринган',
    desc: 'Молниеносные рывки с Чидори, фехтование мечом Кусанаги и Огненный шар.'
  },
  {
    id: 'itachi',
    name: 'Учиха Итачи',
    title: 'Теневой гений Учиха',
    avatar: '👁️',
    badge: 'Аматерасу & Цукуёми',
    desc: 'Мастер иллюзий, вороньи клоны, черный несгораемый огонь и Сусаноо.'
  },
  {
    id: 'minato',
    name: 'Намикадзе Минато',
    title: 'Жёлтая Молния Конохи',
    avatar: '⚡',
    badge: 'Бог Грома (34 м/с)',
    desc: 'Сверхзвуковые броски кунаев, телепортация за спину и сокрушительный Расенган.'
  },
  {
    id: 'naruto',
    name: 'Узумаки Наруто',
    title: 'Режим Отшельника',
    avatar: '🍥',
    badge: 'Расенсюрикен & Клоны',
    desc: 'Колоссальный запас чакры (1.8 млн), армия теневых клонов и Сеннин Мод.'
  },
  {
    id: 'kakashi',
    name: 'Хатаке Какаши',
    title: 'Копирующий Ниндзя',
    avatar: '🐕',
    badge: 'Райкири & Камуи',
    desc: 'Стена грязи, призыв 8 псов, пространственное искажение Камуи и Райкири.'
  },
  {
    id: 'random',
    name: 'Случайный шиноби',
    title: 'Испытание судьбы',
    avatar: '🎲',
    badge: 'Случайный выбор',
    desc: 'ИИ случайным образом выберет одного из легендарных шиноби для дуэли.'
  }
];

export const ROOM_PREFIXES = ['KONOHA', 'CHIDORI', 'SHINOBI', 'RASENGAN', 'AMATERASU', 'HOKAGE', 'RAIKIRI', 'SUSANOO'];
export const generateRandomRoomCode = () => {
  const prefix = ROOM_PREFIXES[Math.floor(Math.random() * ROOM_PREFIXES.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${num}`;
};

const getBackendUrl = () => {
  if (import.meta.env?.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  const custom = typeof window !== 'undefined' ? localStorage.getItem('naruto_server_ip') : null;
  if (custom) return custom.startsWith('http') ? custom : `http://${custom}:4000`;
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return window.location.origin;
    }
  }
  return 'http://localhost:4000';
};
const BACKEND_URL = getBackendUrl();
export default function App() {
  const [socket, setSocket] = useState(null);
  
  // Комната и статус (с поддержкой URL параметра ?room=...)
  const [roomId, setRoomId] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('room');
      if (r && r.trim()) return r.trim().toUpperCase();
    }
    return 'KONOHA-777';
  });
  // Режим битвы: '1v1' | '2v2'
  const [battleMode, setBattleMode] = useState('1v1');
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [myTeam, setMyTeam] = useState('blue');
  const [playersList, setPlayersList] = useState([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [autoFillBots, setAutoFillBots] = useState(true);

  // Кастомное досье созданного шиноби (Клан, стихии, боевой архетип)
  const [customNinja, setCustomNinja] = useState(() => {
    try {
      const saved = localStorage.getItem('naruto_custom_ninja');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Уникальный ID шиноби в браузере (гарантирует сохранение слота и карточки при F5)
  const [playerId] = useState(() => {
    let id = localStorage.getItem('naruto_player_id');
    if (!id) {
      id = 'shinobi_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem('naruto_player_id', id);
    }
    return id;
  });
  // 9. Ввод имени персонажа: сохраняем и читаем из localStorage (по умолчанию Вова и Кирилл)
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('naruto_player_name') || 'Вова';
  });
  const [isAiModelOpen, setIsAiModelOpen] = useState(false);
  const [activeModel, setActiveModel] = useState(() => {
    return localStorage.getItem('naruto_active_model') || 'gemini-2.5-pro';
  });
  const [currentAccount, setCurrentAccount] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('naruto_google_accounts') || '[]');
      return saved[0] || null;
    } catch {
      return null;
    }
  });
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('naruto_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      level: 1,
      currentXp: 0,
      nextLevelXp: 400,
      totalXp: 0,
      progressPercent: 0,
      rank: { title: 'Генин', icon: '🥋', color: '#94a3b8' },
      battlesPlayed: 0,
      battlesWon: 0,
      googleConnected: false
    };
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isHost, setIsHost] = useState(true);
  const [gameVersion, setGameVersion] = useState(() => {
    const v = localStorage.getItem('naruto_game_version');
    return (v === '0.3.2' || v === '0.3.3') ? v : '0.3.3';
  });
  const [roomStatus, setRoomStatus] = useState(() => {
    const s = localStorage.getItem('naruto_room_status');
    return (s === 'LOBBY' || s === 'BATTLE' || s === 'FINISHED') ? s : 'LOBBY';
  });
  const [playerCount, setPlayerCount] = useState(1);
  const [roundNumber, setRoundNumber] = useState(() => {
    const r = localStorage.getItem('naruto_round_number');
    const parsed = r ? parseInt(r, 10) : 1;
    return isNaN(parsed) ? 1 : parsed;
  });

  // Секретный профиль (выдается сервером только при старте дуэли)
  const [profile, setProfile] = useState(() => {
    try {
      const savedStatus = localStorage.getItem('naruto_room_status');
      if (savedStatus !== 'BATTLE') return null;
      const p = localStorage.getItem('naruto_character_profile');
      if (!p) return null;
      const parsed = JSON.parse(p);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  });

  // 8. Пул выбранных 30 техник бойца (Арсенал)
  const [selectedJutsuIds, setSelectedJutsuIds] = useState(() => {
    try {
      const saved = localStorage.getItem('naruto_selected_jutsu');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  // Фиксация боевого арсенала (подтверждение техник перед дуэлью)
  const [isArsenalLocked, setIsArsenalLocked] = useState(() => {
    return localStorage.getItem('naruto_arsenal_locked') === 'true';
  });

  // Ход боя и Чат (сохраняется при F5)
  const [messages, setMessages] = useState(() => {
    try {
      const m = localStorage.getItem('naruto_chat_messages');
      const parsed = m ? JSON.parse(m) : [];
      return Array.isArray(parsed) ? parsed.filter(item => item && typeof item === 'object') : [];
    } catch {
      return [];
    }
  });
  const [inputText, setInputText] = useState('');
  const [isActionLocked, setIsActionLocked] = useState(false);

  // Арсенал считается заблокированным ТОЛЬКО если:
  // 1) Игрок сам подтвердил выбор (isArsenalLocked), ИЛИ
  // 2) В бою уже отправлен скрытый ход в раунде 1 (isActionLocked), ИЛИ
  // 3) Бой уже перешел во 2-й раунд или дальше (roundNumber > 1)
  const effectiveArsenalLocked = isArsenalLocked || (roomStatus === 'BATTLE' && (roundNumber > 1 || isActionLocked));

  // Возможность разблокировать/редактировать арсенал (в лобби или в раунде 1 до отправки хода)
  const canUnlockArsenal = roomStatus === 'LOBBY' || (roomStatus === 'BATTLE' && roundNumber === 1 && !isActionLocked);

  // Модальные окна
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isJutsuOpen, setIsJutsuOpen] = useState(false);
  const [isArsenalOpen, setIsArsenalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isChronicleOpen, setIsChronicleOpen] = useState(false);
  const [isRanksOpen, setIsRanksOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [unreadMailCount, setUnreadMailCount] = useState(() => notificationManager.getUnreadCount());

  useEffect(() => {
    return notificationManager.subscribe(() => {
      setUnreadMailCount(notificationManager.getUnreadCount());
    });
  }, []);

  const [arsenalViewMode, setArsenalViewMode] = useState(() => {
    try {
      return localStorage.getItem('naruto_arsenal_mode') || 'DRAWER';
    } catch (e) {
      return 'DRAWER';
    }
  });

  const handleToggleArsenalMode = (mode) => {
    setArsenalViewMode(mode);
    try {
      localStorage.setItem('naruto_arsenal_mode', mode);
    } catch (e) {}
  };

  const chatEndRef = useRef(null);

  // Инициализация кастомного фона и темы
  useEffect(() => {
    initTheme();
  }, []);

  // Статус и переключение полноэкранного режима
  const [isFullscreen, setIsFullscreen] = useState(() => {
    return !!(typeof document !== 'undefined' && (document.fullscreenElement || document.webkitFullscreenElement));
  });

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  // Переключение полноэкранного режима
  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
    }
  };

  // Состояние тренировочных дуэлей с ИИ-ботами
  const [selectedBotId, setSelectedBotId] = useState('sasuke');
  const [activeBotInfo, setActiveBotInfo] = useState(null);
  const [activeLobbyTab, setActiveLobbyTab] = useState('pvp'); // 'pvp' | 'bot'

  // Состояние звука и подписка на audioManager
  const [audioState, setAudioState] = useState({
    isPlaying: audioManager.isPlaying,
    currentMode: audioManager.currentMode,
    currentTrackId: audioManager.currentTrackId,
    volume: audioManager.volume,
    isMuted: audioManager.isMuted
  });

  useEffect(() => {
    return audioManager.subscribe((state) => {
      setAudioState({ ...state });
    });
  }, []);

  const handleStartBotBattle = (botId) => {
    if (!socket) return;
    const chosenBot = CANONICAL_BOTS.find(b => b.id === botId) || CANONICAL_BOTS[0];
    setActiveBotInfo(chosenBot);
    audioManager.playSfx('gong');
    audioManager.play('battle');
    socket.emit('start_bot_battle', {
      roomId,
      botId,
      playerName: playerName || 'Шиноби',
      playerId,
      gameVersion,
      customNinja
    });
  };

  const handleReturnToLobby = () => {
    if (socket) {
      socket.emit('reset_to_lobby', { roomId });
    }
    setRoomStatus('LOBBY');
    setIsActionLocked(false);
    setActiveBotInfo(null);
    setProfile(null);
    setIsArsenalLocked(false);
    try {
      localStorage.removeItem('naruto_character_profile');
      localStorage.setItem('naruto_room_status', 'LOBBY');
      localStorage.removeItem('naruto_arsenal_locked');
    } catch (e) {}
    audioManager.play('lobby');
  };

  const toggleAudio = () => {
    if (audioState.isPlaying && !audioState.isMuted) {
      audioManager.stop();
    } else {
      audioManager.play(roomStatus === 'BATTLE' ? 'battle' : 'lobby');
    }
  };

  // Подключение к Socket.io
  useEffect(() => {
    const s = io(BACKEND_URL, {
      transports: ['websocket', 'polling']
    });

    s.on('connect', () => {
      setIsConnected(true);
      s.emit('join_battle', { roomId, playerName, playerId, team: myTeam, customNinja });
    });

    s.on('joined_room_info', (data) => {
      setIsHost(data.isHost);
      setGameVersion(data.gameVersion);
      setRoomStatus(data.status);
      setPlayerCount(data.playerCount);
      if (data.battleMode) setBattleMode(data.battleMode);
      if (data.maxPlayers) setMaxPlayers(data.maxPlayers);
      if (data.playersList) setPlayersList(data.playersList);
      if (data.team) setMyTeam(data.team);
    });

    s.on('room_state_update', (data) => {
      setGameVersion(data.gameVersion);
      setPlayerCount(data.playerCount);
      setRoomStatus(data.status);
      if (data.activeModel) setActiveModel(data.activeModel);
      if (data.battleMode) setBattleMode(data.battleMode);
      if (data.maxPlayers) setMaxPlayers(data.maxPlayers);
      if (data.playersList) setPlayersList(data.playersList);
    });

    s.on('ai_model_updated', ({ activeModel: m }) => {
      if (m) {
        setActiveModel(m);
        try { localStorage.setItem('naruto_active_model', m); } catch (e) {}
      }
    });

    s.on('team_updated', ({ playerId: pId, team }) => {
      if (pId === playerId) {
        setMyTeam(team);
      }
    });

    s.on('version_changed', ({ version }) => {
      setGameVersion(version);
    });

    // Системные сообщения в чат
    s.on('system_message', ({ text }) => {
      addMessage({
        id: Math.random().toString(),
        type: 'system',
        text,
        time: getCurrentTime()
      });
    });

    // Фаза 1: Получение секретной карточки персонажа
    s.on('private_character_assigned', (charData) => {
      setProfile(charData);
      try {
        localStorage.setItem('naruto_character_profile', JSON.stringify(charData));
      } catch (e) {}
      setIsProfileOpen(true);
    });

    s.on('battle_started', ({ gameVersion: ver, roundNumber: round, isBotBattle, botName, botTitle, botAvatar }) => {
      setRoomStatus('BATTLE');
      setGameVersion(ver);
      setRoundNumber(round || 1);
      setIsActionLocked(false);
      // При старте битвы арсенал открыт для настройки перед раундом 1
      setIsArsenalLocked(false);
      try {
        localStorage.removeItem('naruto_arsenal_locked');
      } catch (e) {}
      if (isBotBattle) {
        const found = CANONICAL_BOTS.find(b => b.name === botName || b.title === botTitle);
        setActiveBotInfo(found || { name: botName || 'ИИ-Бот', title: botTitle || 'Шиноби', avatar: botAvatar || '🤖' });
      } else {
        setActiveBotInfo(null);
      }
      audioManager.play('battle');
      audioManager.playSfx('gong');
    });

    // Фаза 2: Блокировка хода
    s.on('action_locked', () => {
      setIsActionLocked(true);
      audioManager.playSfx('lock');
    });

    // Фаза 3: Раскрытие ходов игроков (с поддержкой 1v1 и 2v2)
    s.on('actions_revealed', ({ revealed }) => {
      audioManager.playSfx('seal');
      revealed.forEach((item) => {
        const isMine = item.senderId === s.id || item.senderId === playerId;
        addMessage({
          id: Math.random().toString(),
          type: isMine ? 'player' : 'opponent',
          authorName: isMine ? 'Вы' : item.authorName,
          text: item.text,
          team: item.team,
          time: getCurrentTime()
        });
      });
    });

    // Фаза 3: Литературный вердикт или вступительное описание ИИ Мастера
    s.on('gm_round_narrative', ({ roundNumber: rNum, narrative, whySo, isOpening, isFighterCard, fighterName, team }) => {
      let authorName = `ИИ Ведущий (Раунд ${rNum})`;
      if (isFighterCard) {
        authorName = `📜 Свиток шиноби: ${fighterName || 'Боец'}`;
      } else if (isOpening) {
        authorName = 'Гейм-Мастер (Арена боя и открытие)';
      }
      addMessage({
        id: Math.random().toString(),
        type: 'gm',
        authorName,
        text: narrative + (whySo ? `\n\n${whySo}` : ''),
        isOpening: !!isOpening,
        isFighterCard: !!isFighterCard,
        team,
        time: getCurrentTime()
      });
    });

    // Обновление секретных параметров (только своих!)
    s.on('private_profile_update', (updatedProfile) => {
      setProfile(updatedProfile);
      try {
        localStorage.setItem('naruto_character_profile', JSON.stringify(updatedProfile));
      } catch (e) {}
    });

    s.on('next_round_ready', ({ roundNumber: nextRound }) => {
      setRoundNumber(nextRound);
      setIsActionLocked(false);
      setInputText('');
    });

    s.on('battle_finished', ({ winner, text, xpReports }) => {
      setRoomStatus('FINISHED');
      setIsActionLocked(true);
      addMessage({
        id: Math.random().toString(),
        type: 'system',
        text: `🏆 ${text}`,
        time: getCurrentTime()
      });
      if (Array.isArray(xpReports) && xpReports.length > 0) {
        const myXp = xpReports.find(r => r.name === playerName);
        if (myXp && myXp.profile) {
          const oldRankTitle = userProfile?.rank?.title;
          setUserProfile(myXp.profile);
          try {
            localStorage.setItem('naruto_user_profile', JSON.stringify(myXp.profile));
          } catch {}
          addMessage({
            id: Math.random().toString(),
            type: 'system',
            text: `✨ Получено +${myXp.xpGain} XP! Уровень: ${myXp.level} (${myXp.rank?.title})`,
            time: getCurrentTime()
          });

          // 🟡 «Боевые донесения» (жёлтая подсветка)
          notificationManager.addBattleReport({
            opponentName: winner === playerName ? 'соперника' : (winner || 'противника'),
            resultText: text,
            xpGain: myXp.xpGain,
            roundCount: roundNumber
          });

          // 🟢 «Приказ Хокаге» при повышении ранга (зелёная подсветка)
          if (myXp.leveledUp || (myXp.rank?.title && myXp.rank?.title !== oldRankTitle)) {
            notificationManager.addHokagePromotion({
              newRank: myXp.rank?.title || 'Чунин',
              level: myXp.level
            });
          }
        }
      } else {
        // Донесение даже при быстром исходе
        notificationManager.addBattleReport({
          opponentName: 'соперника',
          resultText: text,
          xpGain: 100,
          roundCount: roundNumber
        });
      }
    });

    s.on('account_xp_awarded', (xpRes) => {
      if (xpRes?.profile) {
        setUserProfile(xpRes.profile);
        try {
          localStorage.setItem('naruto_user_profile', JSON.stringify(xpRes.profile));
        } catch {}
      }
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Сохранение профиля в localStorage при любых изменениях
  useEffect(() => {
    try {
      if (profile) {
        localStorage.setItem('naruto_character_profile', JSON.stringify(profile));
      }
    } catch (e) {}
  }, [profile]);

  // Сохранение истории чата в localStorage
  useEffect(() => {
    try {
      localStorage.setItem('naruto_chat_messages', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  // Сохранение статуса комнаты и раунда
  useEffect(() => {
    try {
      localStorage.setItem('naruto_room_status', roomStatus);
      localStorage.setItem('naruto_round_number', roundNumber.toString());
      localStorage.setItem('naruto_game_version', gameVersion);
    } catch (e) {}
  }, [roomStatus, roundNumber, gameVersion]);

  // 9. ОБНОВЛЕНИЕ ИМЕНИ БОЙЦА
  const handleNameChange = (newName) => {
    setPlayerName(newName);
    try {
      localStorage.setItem('naruto_player_name', newName);
    } catch (e) {}
  };

  const commitPlayerName = (nameToCommit) => {
    const finalName = (nameToCommit !== undefined ? nameToCommit : playerName).trim();
    if (!finalName) return;
    if (socket) {
      socket.emit('update_player_name', { roomId, playerName: finalName, playerId });
    }
  };

  // 8. ДОБАВЛЕНИЕ / УДАЛЕНИЕ ТЕХНИКИ ИЗ АРСЕНАЛА 30 СЛОТОВ
  const toggleSelectJutsu = (jutsuId) => {
    if (effectiveArsenalLocked) {
      alert('🔒 Боевой арсенал зафиксирован на эту дуэль! Во время боя изменять техники запрещено правилами.');
      return;
    }
    setSelectedJutsuIds((prev) => {
      let next;
      if (prev.includes(jutsuId)) {
        next = prev.filter(id => id !== jutsuId);
      } else {
        if (prev.length >= 30) {
          alert('В боевой арсенал можно взять максимум 30 техник! Удалите одну технику перед добавлением новой.');
          return prev;
        }
        next = [...prev, jutsuId];
      }
      try {
        localStorage.setItem('naruto_selected_jutsu', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const clearArsenal = () => {
    if (effectiveArsenalLocked) {
      alert('🔒 Боевой арсенал зафиксирован на эту дуэль! Во время боя изменять техники запрещено правилами.');
      return;
    }
    setSelectedJutsuIds([]);
    try {
      localStorage.removeItem('naruto_selected_jutsu');
    } catch (e) {}
  };

  // Подтверждение и блокировка арсенала техник
  const handleConfirmArsenal = () => {
    if (selectedJutsuIds.length === 0) {
      alert('Сначала выберите техники в боевой арсенал из Книги техник (до 30 дзюцу)!');
      return;
    }
    setIsArsenalLocked(true);
    try {
      localStorage.setItem('naruto_arsenal_locked', 'true');
    } catch (e) {}

    if (socket) {
      socket.emit('confirm_arsenal', {
        roomId,
        playerId,
        selectedJutsuIds,
        jutsuCount: selectedJutsuIds.length
      });
    }
  };

  // Разблокировка арсенала (доступна в лобби и в раунде 1 до отправки скрытого действия)
  const handleUnlockArsenal = () => {
    if (roomStatus === 'BATTLE' && (roundNumber > 1 || isActionLocked)) {
      alert('⚠️ Во время активного боя изменять состав арсенала строго запрещено регламентом дуэли!');
      return;
    }
    setIsArsenalLocked(false);
    try {
      localStorage.setItem('naruto_arsenal_locked', 'false');
    } catch (e) {}
  };

  const handleSelectActionToInput = (actionText) => {
    setInputText(prev => prev ? `${prev}, ${actionText}` : actionText);
  };

  // Ручной запрос карточки персонажа с сервера
  const handleRequestCard = () => {
    if (socket) {
      socket.emit('request_character_card', { roomId, playerId });
    }
  };

  // ПЕРЕКЛЮЧЕНИЕ ВЕРСИИ ИГРЫ
  const changeVersion = (newVer) => {
    setGameVersion(newVer);
    if (socket) {
      socket.emit('set_game_version', { roomId, version: newVer });
    }
  };

  // СОХРАНЕНИЕ КАСТОМНОГО ДОСЬЕ ШИНОБИ (КЛАН, СТИХИИ, АРХЕТИП)
  const handleSaveCustomNinja = (ninjaData) => {
    setCustomNinja(ninjaData);
    if (ninjaData.name) {
      setPlayerName(ninjaData.name);
    }
    if (socket) {
      socket.emit('update_custom_ninja', { roomId, playerId, customNinja: ninjaData });
      if (ninjaData.name) {
        socket.emit('update_player_name', { roomId, playerName: ninjaData.name, playerId });
      }
    }
  };

  // СОЗДАНИЕ НОВОЙ КОМНАТЫ
  const handleCreateRoom = (customCode) => {
    const newCode = customCode || generateRandomRoomCode();
    setRoomId(newCode);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('room', newCode);
      window.history.pushState({}, '', url.toString());
    }
    if (socket) {
      socket.emit('join_battle', { roomId: newCode, playerName, playerId, team: myTeam, customNinja });
    }
  };

  // КОПИРОВАНИЕ ПРЯМОЙ ССЫЛКИ ДЛЯ ДРУГА
  const handleCopyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/?room=${encodeURIComponent(roomId)}`;
    const copySuccess = () => {
      setCopiedLink(true);
      audioManager.playSfx('seal');
      setTimeout(() => setCopiedLink(false), 2500);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(inviteUrl)
        .then(copySuccess)
        .catch(() => {
          prompt('Скопируйте прямую ссылку для друга:', inviteUrl);
        });
    } else {
      prompt('Скопируйте прямую ссылку для друга:', inviteUrl);
    }
  };

  // ВХОД В КОМНАТУ ПО КОДУ
  const handleJoinByCode = (e) => {
    if (e) e.preventDefault();
    const trimmed = joinCodeInput.trim().toUpperCase();
    if (!trimmed) return;
    setRoomId(trimmed);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('room', trimmed);
      window.history.pushState({}, '', url.toString());
    }
    if (socket) {
      socket.emit('join_battle', { roomId: trimmed, playerName, playerId, team: myTeam, customNinja });
    }
    setJoinCodeInput('');
  };

  // ПЕРЕКЛЮЧЕНИЕ КОМАНДЫ (СИНИЕ / КРАСНЫЕ)
  const handleSwitchTeam = (targetTeam) => {
    const nextTeam = targetTeam || (myTeam === 'blue' ? 'red' : 'blue');
    setMyTeam(nextTeam);
    if (socket) {
      socket.emit('switch_team', { roomId, playerId, team: nextTeam });
    }
  };

  // ПЕРЕКЛЮЧЕНИЕ РЕЖИМА БОЯ (1v1 vs 2v2)
  const handleSetBattleMode = (mode) => {
    setBattleMode(mode);
    if (socket) {
      socket.emit('set_battle_mode', { roomId, mode });
    }
  };

  // Старт дуэли или командного боя 2на2
  const handleStartBattle = () => {
    if (socket) {
      socket.emit('update_player_name', { roomId, playerName, playerId });
      socket.emit('start_battle', { roomId, autoFillBots });
    }
  };

  // Отправка скрытого действия
  const handleSendAction = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isActionLocked || !socket || roomStatus !== 'BATTLE') return;

    // При отправке хода арсенал окончательно фиксируется на этот бой
    if (!isArsenalLocked) {
      setIsArsenalLocked(true);
      try {
        localStorage.setItem('naruto_arsenal_locked', 'true');
      } catch (e) {}
      socket.emit('confirm_arsenal', {
        roomId,
        playerId,
        selectedJutsuIds,
        jutsuCount: selectedJutsuIds.length
      });
    }

    socket.emit('submit_hidden_action', {
      roomId,
      playerId,
      actionText: inputText.trim()
    });

    setInputText('');
  };

  const handleSelectModel = (modelId) => {
    setActiveModel(modelId);
    try {
      localStorage.setItem('naruto_active_model', modelId);
    } catch (e) {}
    if (socket) {
      const customKey = localStorage.getItem('naruto_custom_gemini_key') || undefined;
      socket.emit('change_ai_model', { roomId, modelId, apiKey: customKey });
    }
  };

  // Синхронизация профиля и уровня с сервером при смене аккаунта или имени
  useEffect(() => {
    const identifier = currentAccount?.email || playerName || 'Вова';
    fetch(`${BACKEND_URL}/api/user/profile/${encodeURIComponent(identifier)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.level) {
          setUserProfile(data);
          try {
            localStorage.setItem('naruto_user_profile', JSON.stringify(data));
          } catch {}
        }
      })
      .catch(() => {});
  }, [currentAccount, playerName]);

  const handleSelectAccount = (account) => {
    setCurrentAccount(account);
    if (account?.name) {
      setPlayerName(account.name);
      try {
        localStorage.setItem('naruto_player_name', account.name);
      } catch (e) {}
    }
    // Если подключена почта — автоматически активируем флагманскую модель Gemini 3.8 Flash!
    if (account?.email) {
      handleSelectModel('gemini-3.8-flash');
      // Сохраняем связь на сервере
      fetch(`${BACKEND_URL}/api/user/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: account.email,
          name: account.name || playerName,
          googleConnected: true
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data?.profile) setUserProfile(data.profile);
      })
      .catch(() => {});
    }
  };

  return (
    <div 
      className="relative flex h-screen w-screen overflow-hidden select-none bg-cover bg-center font-sans"
      style={{ backgroundImage: 'var(--app-bg-image)' }}
    >
      {/* Затемняющий слой для контраста (настраивается в настройках) */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
        style={{ opacity: 'var(--bg-overlay-opacity, 0.55)' }}
      />

      {/* Верхнее меню слева: вертикальные иконки сверху вниз */}
      <TopMenu
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenJutsu={() => setIsJutsuOpen(true)}
        onOpenArsenal={() => setIsArsenalOpen(prev => !prev)}
        onOpenCreator={() => setIsCreatorOpen(true)}
        onToggleProfile={() => setIsProfileOpen(prev => !prev)}
        onOpenChronicle={() => setIsChronicleOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAiModel={() => setIsAiModelOpen(true)}
        onOpenRanks={() => setIsRanksOpen(true)}
        onOpenMail={() => setIsMailOpen(true)}
        unreadMailCount={unreadMailCount}
        activeModel={activeModel}
        userProfile={userProfile}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        hasProfile={!!profile}
        hasMessages={messages.length > 0}
        arsenalCount={selectedJutsuIds.length}
        isProfileOpen={isProfileOpen}
        isArsenalOpen={isArsenalOpen}
      />

      {/* БОКОВОЙ АРСЕНАЛ (если открыт и в режиме боковой панели DRAWER - не перекрывает чат и поле ввода) */}
      {isArsenalOpen && arsenalViewMode === 'DRAWER' && (
        <MyArsenalModal
          isOpen={true}
          viewMode="DRAWER"
          gameVersion={gameVersion}
          onToggleViewMode={handleToggleArsenalMode}
          onClose={() => setIsArsenalOpen(false)}
          selectedJutsuIds={selectedJutsuIds}
          allJutsu={defaultJutsuData}
          onRemoveJutsu={(id) => toggleSelectJutsu(id)}
          onClearArsenal={clearArsenal}
          onOpenJutsuBook={() => {
            setIsArsenalOpen(false);
            setIsJutsuOpen(true);
          }}
          onSelectActionToInput={handleSelectActionToInput}
          clanAutoJutsu={profile?.autoJutsu || []}
          isArsenalLocked={effectiveArsenalLocked}
          canUnlock={canUnlockArsenal}
          onConfirmArsenal={handleConfirmArsenal}
          onUnlockArsenal={handleUnlockArsenal}
          roomStatus={roomStatus}
        />
      )}

      {/* ЦЕНТРАЛЬНАЯ ЗОНА: Главный экран, Арена и Battle Log (автоматически сжимается без наложения) */}
      <main className="relative z-10 flex flex-col flex-1 min-w-0 max-w-5xl mx-auto my-3 px-2 sm:px-4 h-[calc(100vh-1.5rem)]">
        
        {/* 1. ГЛАВНАЯ ШАПКА С СЕЛЕКТОРОМ ВЕРСИИ НА САМОМ ВИДНОМ МЕСТЕ */}
        {/* 1. ГЛАВНАЯ ШАПКА */}
        <header className="glass-panel border border-white/10 rounded-t-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 shadow-lg shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
            <h1 className="text-sm font-bold tracking-wider uppercase text-zinc-100 flex items-center gap-2">
              <Swords className="w-4 h-4 text-amber-500" />
              {roomStatus === 'LOBBY' 
                ? 'Главное Меню Шиноби' 
                : (battleMode === '2v2' ? '👥 Командный бой 2 на 2' : '🗡️ Боевая Арена Шиноби')}
            </h1>
            {roomStatus === 'BATTLE' && battleMode === '2v2' && (
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border shadow-sm ${
                myTeam === 'blue' 
                  ? 'bg-blue-950/80 border-blue-500/60 text-blue-300' 
                  : 'bg-red-950/80 border-red-500/60 text-red-300'
              }`}>
                {myTeam === 'blue' ? '🔵 Вы: Команда Синих' : '🔴 Вы: Команда Красных'}
              </span>
            )}
            {activeBotInfo && roomStatus === 'BATTLE' && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/70 border border-red-500/40 text-[11px] font-bold text-red-300">
                <span>{activeBotInfo.avatar}</span>
                <span>vs {activeBotInfo.name}</span>
              </span>
            )}
            {roomStatus === 'BATTLE' && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Раунд {roundNumber}
              </span>
            )}
          </div>

          {/* СЕЛЕКТОР ВЕРСИИ */}
          <div className="flex items-center gap-2 bg-black/80 border border-amber-500/50 rounded-xl px-3 py-1.5 shadow-inner">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Версия:
            </span>
            <div className="relative">
              <select
                disabled={roomStatus === 'BATTLE'}
                value={gameVersion}
                onChange={(e) => changeVersion(e.target.value)}
                className="appearance-none bg-zinc-900 text-zinc-100 font-bold text-xs rounded-lg pl-3 pr-8 py-1.5 border border-amber-500/40 outline-none focus:border-amber-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 transition"
              >
                <option value="0.3.2">0.3.2 Базовая</option>
                <option value="0.3.3">0.3.3 Тактическая</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400 absolute right-2.5 top-2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-zinc-400">
            {/* Кнопка быстрого звука */}
            <button
              type="button"
              onClick={toggleAudio}
              title={audioState.isPlaying && !audioState.isMuted ? 'Выключить музыку' : 'Включить опенинг (Black Clover / Наруто)'}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                audioState.isPlaying && !audioState.isMuted
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-amber-500/10'
                  : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20'
              }`}
            >
              {audioState.isPlaying && !audioState.isMuted ? (
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
              )}
              <span className="hidden sm:inline text-[11px]">
                {audioState.isPlaying && !audioState.isMuted ? 'Музыка 🎵' : 'Звук'}
              </span>
            </button>

            {roomStatus === 'BATTLE' && (
              <button
                type="button"
                onClick={handleReturnToLobby}
                title="Завершить дуэль и выйти в Главное Меню"
                className="px-2.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-red-950/60 border border-white/10 hover:border-red-500/50 text-[11px] font-bold text-zinc-300 hover:text-red-300 transition flex items-center gap-1 cursor-pointer"
              >
                <span>🏠 Главное Меню</span>
              </button>
            )}

            <span className="flex items-center gap-1 font-mono">
              <Users className="w-3.5 h-3.5 text-cyan-400" /> {playerCount}/{maxPlayers}
            </span>
            <span className="text-zinc-600">|</span>
            <div className="font-mono text-zinc-300 flex items-center gap-1.5 bg-zinc-900/80 px-2 py-1 rounded-lg border border-white/10">
              <span className="text-zinc-400 text-[11px]">Комната:</span>
              <b className="text-amber-400">{roomId}</b>
              <button
                type="button"
                onClick={handleCopyInviteLink}
                title="Скопировать ссылку для приглашения друга"
                className="text-zinc-400 hover:text-amber-300 p-0.5 rounded transition cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </header>

        {/* 2. ТЕЛО ЭКРАНА: ГЛАВНОЕ МЕНЮ ИЛИ БОЕВАЯ АРЕНА */}
        {roomStatus === 'LOBBY' ? (
          /* ========================================================= */
          /* КРАСИВОЕ ОТДЕЛЬНОЕ ГЛАВНОЕ МЕНЮ (ПОЛНОЦЕННЫЙ ЭКРАН ВЫБОРА) */
          /* ========================================================= */
          <div className="glass-panel border-x border-b border-white/10 flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 rounded-b-2xl">
            {/* 1. HERO БАННЕР С ПРИВЕТСТВИЕМ И ИМЕНЕМ БОЙЦА */}
            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-amber-950/40 via-zinc-900/80 to-cyan-950/40 border border-amber-500/30 shadow-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⛩️</span>
                    <h2 className="text-base sm:text-xl font-black uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                      Боевая Арена Конохи
                    </h2>
                  </div>
                  <p className="text-xs text-zinc-400 max-w-xl">
                    Тактическая ролевая арена шиноби. Выберите режим битвы, подготовьте свой боевой арсенал из 30 дзюцу и нажмите «Начать дуэль»!
                  </p>
                </div>

                {/* Быстрая плашка вашего бойца */}
                <div className="bg-black/60 border border-white/10 rounded-xl p-3 flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-lg">
                    {customNinja?.clan ? '🥷' : '👤'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                      <span>{playerName || 'Шиноби'}</span>
                      {customNinja?.clan && (
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700/40 font-bold">
                          {customNinja.clan}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                      {customNinja 
                        ? `${customNinja.elements?.join('+')} • ${customNinja.archetype || 'Универсал'}`
                        : (profile ? `${profile.clan} • ${profile.speed || 28} м/с` : 'Досье можно настроить перед боем 🥷')}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatorOpen(true)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-sm"
                      title="Настроить клан, стихии и додзюцу"
                    >
                      <span>✏️ Досье</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsArsenalOpen(true)}
                      className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-sm"
                      title="Выбрать до 30 техник в боевой арсенал"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span>Арсенал ({selectedJutsuIds.length}/30)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Поле ввода имени */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5 shrink-0">
                  <User className="w-3.5 h-3.5" /> Имя вашего бойца:
                </label>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={() => commitPlayerName()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        commitPlayerName();
                      }
                    }}
                    placeholder="Введите имя бойца (напр. Учиха Саске)..."
                    className="bg-black/80 border border-white/15 focus:border-amber-400 px-3.5 py-1.5 rounded-xl text-xs font-bold text-zinc-100 placeholder-zinc-500 outline-none w-full sm:w-72 transition"
                  />
                </div>
              </div>
            </div>

            {/* 2. ВКЛАДКИ РЕЖИМОВ: PVP С ДРУГОМ vs СОЛО-ТРЕНИРОВКА С БОТОМ */}
            <div className="flex items-center gap-2 p-1 bg-black/60 border border-white/10 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setActiveLobbyTab('pvp');
                  audioManager.playSfx('click');
                }}
                className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                  activeLobbyTab === 'pvp'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-600/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>👥 Дуэль с другом (PvP онлайн)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveLobbyTab('bot');
                  audioManager.playSfx('click');
                }}
                className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                  activeLobbyTab === 'bot'
                    ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-600/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>🤖 Тренировка с ИИ-ботом (Соло)</span>
              </button>
            </div>

            {/* 3. КОНТЕНТ ВКЛАДКИ PVP: С ДРУГОМ (С КОМНАТАМИ И РЕЖИМОМ 2НА2) */}
            {activeLobbyTab === 'pvp' && (
              <div className="space-y-4 bg-gradient-to-b from-amber-950/20 to-black/40 border border-amber-500/20 rounded-2xl p-4 sm:p-5 shadow-xl">
                
                {/* 3.1. УПРАВЛЕНИЕ КОМНАТОЙ И ПРИГЛАШЕНИЕ ДРУГА */}
                <div className="bg-black/60 border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5" /> Комната битвы шиноби:
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-base sm:text-lg font-mono font-black text-zinc-100 bg-amber-500/15 border border-amber-500/40 px-3 py-1 rounded-xl">
                          {roomId}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">
                          ({playerCount}/{maxPlayers} бойцов в лобби)
                        </span>
                      </div>
                    </div>

                    {/* Кнопки: Скопировать ссылку и Создать новую комнату */}
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleCopyInviteLink}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                          copiedLink
                            ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-1 ring-emerald-400'
                            : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                        }`}
                      >
                        {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedLink ? 'Ссылка скопирована! ✅' : 'Скопировать ссылку для друга 📋'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCreateRoom()}
                        title="Сгенерировать новый уникальный код комнаты"
                        className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 hover:border-amber-400/50 text-xs font-bold text-zinc-200 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-amber-400" />
                        <span>Новая комната</span>
                      </button>
                    </div>
                  </div>

                  {/* Ввод кода комнаты вручную */}
                  <form onSubmit={handleJoinByCode} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <span className="text-[11px] text-zinc-400 shrink-0 font-medium">
                      Или войти в существующую комнату по коду:
                    </span>
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={joinCodeInput}
                        onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                        placeholder="Напр. KONOHA-520 или CHIDORI-318..."
                        className="flex-1 bg-black/80 border border-white/15 focus:border-amber-400 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-zinc-100 placeholder-zinc-500 outline-none transition"
                      />
                      <button
                        type="submit"
                        disabled={!joinCodeInput.trim()}
                        className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-bold text-zinc-200 transition cursor-pointer"
                      >
                        Войти
                      </button>
                    </div>
                  </form>
                  <p className="text-[10px] text-zinc-500">
                    💡 Приглашенный друг просто переходит по отправленной ссылке и сразу подключается в этот же лобби без ошибок.
                  </p>
                </div>

                {/* 3.2. ВЫБОР ФОРМАТА БИТВЫ: 1v1 ИЛИ 2v2 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    Формат сражения:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSetBattleMode('1v1')}
                      className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between cursor-pointer ${
                        battleMode === '1v1'
                          ? 'border-amber-500 bg-amber-500/15 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/40'
                          : 'border-white/10 bg-black/40 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-zinc-100 flex items-center gap-1.5">
                          <Swords className="w-4 h-4 text-amber-400" /> 🗡️ 1 на 1 (Одиночная дуэль)
                        </span>
                        {battleMode === '1v1' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-black">
                            АКТИВЕН
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-snug">
                        Классическое противостояние двух шиноби. Прямой поединок умов и скрытых техник один на один.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetBattleMode('2v2')}
                      className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between cursor-pointer ${
                        battleMode === '2v2'
                          ? 'border-cyan-400 bg-cyan-500/20 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                          : 'border-white/10 bg-black/40 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-zinc-100 flex items-center gap-1.5">
                          <Users2 className="w-4 h-4 text-cyan-400" /> 👥 2 на 2 (Командный бой 4 шиноби)
                        </span>
                        {battleMode === '2v2' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-400 text-black">
                            АКТИВЕН
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-snug">
                        Командный бой 4 бойцов: связки стихий (Ветер + Огонь), взаимное прикрытие, спасение союзника и командные тактики!
                      </p>
                    </button>
                  </div>
                </div>

                {/* 3.3. КОМАНДНАЯ СЕТКА (В РЕЖИМЕ 2v2) */}
                {battleMode === '2v2' && (
                  <div className="space-y-3 bg-black/60 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-cyan-400" /> Составы команд (4 слота шиноби):
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        Ваша команда: <b className={myTeam === 'blue' ? 'text-blue-400' : 'text-red-400'}>
                          {myTeam === 'blue' ? '🔵 Синие' : '🔴 Красные'}
                        </b>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* КОМАНДА СИНИХ */}
                      <div className="bg-blue-950/30 border border-blue-500/40 rounded-xl p-3 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
                          <span className="font-bold text-xs text-blue-300 flex items-center gap-1.5">
                            🔵 Команда Синих (Лист)
                          </span>
                          {myTeam === 'blue' ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-black">
                              ВЫ ЗДЕСЬ
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSwitchTeam('blue')}
                              className="px-2.5 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition cursor-pointer"
                            >
                              Вступить ➜
                            </button>
                          )}
                        </div>

                        {/* Слоты Синих */}
                        <div className="space-y-1.5 text-xs">
                          {(() => {
                            const bluePlayers = playersList.filter(p => p.team === 'blue');
                            // Если список пуст, но я синий, показываем себя
                            const displayed = bluePlayers.length > 0 ? bluePlayers : (myTeam === 'blue' ? [{ id: playerId, name: playerName, isHost: true }] : []);
                            return (
                              <>
                                <div className="bg-black/40 border border-blue-500/20 rounded-lg p-2 flex items-center justify-between">
                                  <span className="text-zinc-200 font-medium flex items-center gap-1.5">
                                    <span>🥋</span>
                                    <span>{displayed[0]?.name || (myTeam === 'blue' ? playerName : 'Слот 1 (Ожидание шиноби)')}</span>
                                    {(displayed[0]?.id === playerId || (myTeam === 'blue' && !displayed[0])) && (
                                      <span className="text-[9px] bg-blue-500/30 text-blue-300 px-1.5 py-0.2 rounded font-bold">ВЫ</span>
                                    )}
                                  </span>
                                  <span className="text-[10px] font-mono text-zinc-400">Слот #1</span>
                                </div>

                                <div className="bg-black/40 border border-blue-500/20 rounded-lg p-2 flex items-center justify-between">
                                  <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                                    <span>🥋</span>
                                    <span>
                                      {displayed[1]?.name || (autoFillBots ? '🤖 Союзник ИИ-Бот (или друг)' : 'Свободный слот союзника')}
                                    </span>
                                    {displayed[1]?.id === playerId && (
                                      <span className="text-[9px] bg-blue-500/30 text-blue-300 px-1.5 py-0.2 rounded font-bold">ВЫ</span>
                                    )}
                                  </span>
                                  <span className="text-[10px] font-mono text-zinc-400">Слот #2</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      {/* КОМАНДА КРАСНЫХ */}
                      <div className="bg-red-950/30 border border-red-500/40 rounded-xl p-3 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
                          <span className="font-bold text-xs text-red-300 flex items-center gap-1.5">
                            🔴 Команда Красных (Соперники)
                          </span>
                          {myTeam === 'red' ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-black">
                              ВЫ ЗДЕСЬ
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSwitchTeam('red')}
                              className="px-2.5 py-0.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold transition cursor-pointer"
                            >
                              Вступить ➜
                            </button>
                          )}
                        </div>

                        {/* Слоты Красных */}
                        <div className="space-y-1.5 text-xs">
                          {(() => {
                            const redPlayers = playersList.filter(p => p.team === 'red');
                            const displayed = redPlayers.length > 0 ? redPlayers : (myTeam === 'red' ? [{ id: playerId, name: playerName, isHost: true }] : []);
                            return (
                              <>
                                <div className="bg-black/40 border border-red-500/20 rounded-lg p-2 flex items-center justify-between">
                                  <span className="text-zinc-200 font-medium flex items-center gap-1.5">
                                    <span>🥷</span>
                                    <span>
                                      {displayed[0]?.name || (myTeam === 'red' ? playerName : (autoFillBots ? '🤖 Враг ИИ-Бот (или друг)' : 'Слот соперника #1'))}
                                    </span>
                                    {(displayed[0]?.id === playerId || (myTeam === 'red' && !displayed[0])) && (
                                      <span className="text-[9px] bg-red-500/30 text-red-300 px-1.5 py-0.2 rounded font-bold">ВЫ</span>
                                    )}
                                  </span>
                                  <span className="text-[10px] font-mono text-zinc-400">Слот #3</span>
                                </div>

                                <div className="bg-black/40 border border-red-500/20 rounded-lg p-2 flex items-center justify-between">
                                  <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                                    <span>🥷</span>
                                    <span>
                                      {displayed[1]?.name || (autoFillBots ? '🤖 Враг ИИ-Бот (или друг)' : 'Слот соперника #2')}
                                    </span>
                                    {displayed[1]?.id === playerId && (
                                      <span className="text-[9px] bg-red-500/30 text-red-300 px-1.5 py-0.2 rounded font-bold">ВЫ</span>
                                    )}
                                  </span>
                                  <span className="text-[10px] font-mono text-zinc-400">Слот #4</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Галочка дополнения ботами для Кооператива */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                        <input
                          type="checkbox"
                          checked={autoFillBots}
                          onChange={(e) => setAutoFillBots(e.target.checked)}
                          className="w-4 h-4 rounded text-amber-500 bg-zinc-900 border-white/20 focus:ring-amber-500 cursor-pointer"
                        />
                        <span className="font-semibold text-zinc-200">
                          Автоматически заполнять свободные слоты легендарными шиноби (Кооператив)
                        </span>
                      </label>
                      <span className="text-[10px] text-amber-400 font-mono hidden sm:inline">
                        (Саске, Итачи, Какаши, Минато)
                      </span>
                    </div>
                  </div>
                )}

                {/* 3.4. ВЫБОР ВЕРСИИ ДЛЯ БИТВЫ */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    Регламент судейства ИИ-Ведущего:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => changeVersion('0.3.2')}
                      className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                        gameVersion === '0.3.2'
                          ? 'border-amber-500 bg-amber-500/15 shadow-md shadow-amber-500/10'
                          : 'border-white/10 bg-black/40 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-zinc-100 flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-amber-400" /> 0.3.2 Базовая
                        </span>
                        {gameVersion === '0.3.2' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-black">
                            ВЫБРАНА
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-snug">
                        Прямое столкновение техник без жестких дистанций в метрах. Чистая динамика и расход чакры.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => changeVersion('0.3.3')}
                      className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                        gameVersion === '0.3.3'
                          ? 'border-cyan-500 bg-cyan-500/15 shadow-md shadow-cyan-500/10'
                          : 'border-white/10 bg-black/40 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-zinc-100 flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-cyan-400" /> 0.3.3 Тактическая
                        </span>
                        {gameVersion === '0.3.3' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500 text-black">
                            ВЫБРАНА
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-snug">
                        Точные зоны дистанций [К], [Б], [С], [Д], [О], [Я]. Скорости полета техник и баллистика в метрах.
                      </p>
                    </button>
                  </div>
                </div>

                {/* 3.5. БОЛЬШАЯ КНОПКА СТАРТА */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleStartBattle}
                    className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white font-extrabold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-600/30 transition cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>
                      {battleMode === '2v2' 
                        ? 'НАЧАТЬ КОМАНДНЫЙ БОЙ 2 НА 2 (4 ШИНОБИ)' 
                        : 'НАЧАТЬ ДУЭЛЬ (ПЕРЕЙТИ НА БОЕВУЮ АРЕНУ)'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* 4. КОНТЕНТ ВКЛАДКИ СОЛО-БОТА */}
            {activeLobbyTab === 'bot' && (
              <div className="space-y-4 bg-gradient-to-b from-cyan-950/20 to-black/40 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2 uppercase tracking-wide">
                      <Bot className="w-4 h-4 text-cyan-400" /> Соло-тренировка против Легенд Конохи
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Выберите каноничного оппонента. ИИ сам сделает за него скрытый ход в раунде.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                    АВТОНОМНЫЙ РЕЖИМ
                  </span>
                </div>

                {/* Сетка каноничных ботов */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
                  {CANONICAL_BOTS.map((bot) => {
                    const isSelected = selectedBotId === bot.id;
                    return (
                      <button
                        key={bot.id}
                        type="button"
                        onClick={() => {
                          setSelectedBotId(bot.id);
                          audioManager.playSfx('click');
                        }}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer relative overflow-hidden group ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-500/20 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                            : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-zinc-900/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xl group-hover:scale-110 transition-transform">{bot.avatar}</span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 animate-pulse" />
                          )}
                        </div>
                        <div>
                          <span className={`text-xs font-bold block truncate ${isSelected ? 'text-cyan-200' : 'text-zinc-200'}`}>
                            {bot.name}
                          </span>
                          <span className="text-[10px] text-zinc-400 block truncate font-mono">
                            {bot.title}
                          </span>
                        </div>
                        <div className="mt-2 pt-1 border-t border-white/5">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-800/80 text-amber-300 block truncate text-center">
                            {bot.badge}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Детальная плашка выбранного противника */}
                {(() => {
                  const current = CANONICAL_BOTS.find(b => b.id === selectedBotId) || CANONICAL_BOTS[0];
                  return (
                    <div className="bg-black/60 border border-white/10 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2.5 rounded-xl bg-zinc-900 border border-white/10 shadow-inner">
                          {current.avatar}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-100 text-sm">{current.name}</span>
                            <span className="text-zinc-500">|</span>
                            <span className="text-amber-400 font-semibold">{current.title}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                            {current.desc}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 self-end sm:self-center">
                        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1.5 rounded-xl border border-cyan-700/50 block shadow-inner font-bold">
                          {current.badge}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Большая кнопка старта Соло */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleStartBotBattle(selectedBotId)}
                    className="w-full bg-gradient-to-r from-cyan-600 via-cyan-500 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-extrabold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-600/30 transition cursor-pointer"
                  >
                    <Swords className="w-5 h-5" />
                    <span>СРАЗИТЬСЯ: {CANONICAL_BOTS.find(b => b.id === selectedBotId)?.name.toUpperCase() || 'ИИ-БОТ'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 5. МУЗЫКАЛЬНЫЙ САУНДТРЕК ШИНОБИ (С ВОКАЛОМ / BLACK CLOVER) */}
            <div className="bg-black/50 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg shrink-0">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-200">
                      Саундтрек: {AUDIO_TRACKS.find(t => t.id === audioState.currentTrackId)?.name || 'Black Rover'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                      С ВОКАЛОМ 🔥
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Опенинги Чёрного Клевера и Наруто с вокалом играют во время сражений.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm ${
                    audioState.isPlaying && !audioState.isMuted
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/10'
                  }`}
                >
                  {audioState.isPlaying && !audioState.isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{audioState.isPlaying && !audioState.isMuted ? 'Пауза' : 'Включить трек'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 text-xs font-semibold transition cursor-pointer"
                >
                  Выбрать песню
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* БОЕВАЯ АРЕНА (РЕЖИМ BATTLE / FINISHED): ЧАТ + ПОЛЕ ВВОДА */
          /* ========================================================= */
          <div className="flex flex-col flex-1 min-h-0">
            {/* ФАЗА ПОДГОТОВКИ К РАУНДУ 1: ВЫБОР И ПОДТВЕРЖДЕНИЕ 30 ТЕХНИК */}
            {roomStatus === 'BATTLE' && roundNumber === 1 && (
              <div className="bg-gradient-to-r from-amber-950/70 via-zinc-900/90 to-cyan-950/70 border-x border-b border-amber-500/40 px-4 py-2.5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🥋</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs uppercase tracking-wider text-amber-300">
                        Подготовка к Раунду 1:
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        effectiveArsenalLocked
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 shadow-sm'
                          : 'bg-amber-950 text-amber-300 border-amber-500/50 animate-pulse'
                      }`}>
                        {effectiveArsenalLocked ? 'Арсенал зафиксирован 🔒' : `Выбрано: ${selectedJutsuIds.length}/30 техник ⏳`}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-tight">
                      {effectiveArsenalLocked
                        ? 'Боевой арсенал утвержден. Введите ваше скрытое действие в поле ниже!'
                        : 'Вы можете свободно выбирать и менять до 30 дзюцу до отправки первого хода!'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setIsJutsuOpen(true)}
                    className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-xs font-bold border border-white/10 hover:border-amber-400/40 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Книга 248 техник</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsArsenalOpen(true)}
                    className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-xs font-bold border border-white/10 hover:border-cyan-400/40 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Swords className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Арсенал ({selectedJutsuIds.length}/30)</span>
                  </button>

                  {!effectiveArsenalLocked ? (
                    <button
                      type="button"
                      onClick={handleConfirmArsenal}
                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Подтвердить</span>
                    </button>
                  ) : (
                    canUnlockArsenal && (
                      <button
                        type="button"
                        onClick={handleUnlockArsenal}
                        className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-300 rounded-xl text-xs font-semibold border border-white/10 transition flex items-center gap-1 cursor-pointer"
                        title="Изменить техники до отправки хода"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Изменить</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* ОКНО ЧАТА: BATTLE LOG */}
            <div className="glass-panel border-x border-white/10 flex-1 overflow-y-auto p-5 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-16 text-zinc-500 text-xs space-y-2">
                  <Sparkles className="w-6 h-6 mx-auto text-amber-500/50" />
                  <p className="font-bold text-zinc-300">Дуэль началась. Арена сформирована.</p>
                  <p className="text-[11px] text-zinc-500">
                    Опишите ваше первое скрытое действие в поле внизу и нажмите «Отправить».
                  </p>
                </div>
              )}

              {/* Рендер сообщений */}
              {messages.filter(m => m && typeof m === 'object').map((m, idx) => {
                const msgKey = m.id || `msg_${idx}`;
                if (m.type === 'system') {
                  return (
                    <div key={msgKey} className="flex justify-center my-2">
                      <span className="text-[11px] px-3.5 py-1 rounded-full bg-zinc-900/80 text-zinc-400 border border-white/5 font-mono">
                        {m.text}
                      </span>
                    </div>
                  );
                }
                if (m.type === 'gm') {
                  return (
                    <div 
                      key={msgKey} 
                      className="rounded-2xl p-4 sm:p-5 border border-amber-500/30 shadow-2xl transition"
                      style={{
                        backgroundColor: 'var(--gm-bubble-bg)',
                        color: 'var(--gm-bubble-text)'
                      }}
                    >
                      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2 mb-2.5">
                        <span className="font-bold text-xs tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
                          📜 {m.authorName || 'ИИ Ведущий'}
                        </span>
                        <span className="text-[10px] text-zinc-400">{m.time}</span>
                      </div>
                      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-serif">
                        <NarrativeRenderer 
                          text={m.text} 
                          isOpening={m.isOpening} 
                          isFighterCard={m.isFighterCard} 
                        />
                      </div>
                    </div>
                  );
                }

                const isMine = m.type === 'player';
                return (
                  <div key={msgKey} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className="text-[10px] text-zinc-400 mb-1 px-1 flex items-center gap-1.5">
                      {m.team && (
                        <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                          m.team === 'blue' 
                            ? 'bg-blue-900/60 text-blue-300 border border-blue-500/30' 
                            : 'bg-red-900/60 text-red-300 border border-red-500/30'
                        }`}>
                          {m.team === 'blue' ? '🔵 Синие' : '🔴 Красные'}
                        </span>
                      )}
                      <span>{m.authorName || (isMine ? 'Вы' : 'Оппонент')} • {m.time}</span>
                    </div>
                    <div
                      className="max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-md leading-relaxed"
                      style={{
                        backgroundColor: isMine ? 'var(--player-bubble-bg)' : 'var(--opponent-bubble-bg)',
                        color: isMine ? 'var(--player-bubble-text)' : 'var(--opponent-bubble-text)'
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}

              {/* БАННЕР ЗАВЕРШЕНИЯ ДУЭЛИ И ССЫЛКА НА ЛЕТОПИСЬ */}
              {roomStatus === 'FINISHED' && (
                <div className="bg-gradient-to-r from-amber-950/60 via-zinc-900/90 to-amber-950/60 border border-amber-500/40 rounded-2xl p-4 sm:p-5 my-4 text-center space-y-2.5 shadow-2xl backdrop-blur-md">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 text-2xl shadow-inner">
                    🏆
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-amber-300 uppercase tracking-wider">
                    Сражение завершено!
                  </h4>
                  <p className="text-xs text-zinc-300 max-w-lg mx-auto leading-relaxed">
                    Все скрытые действия, столкновения стихий и судейские вердикты объединены в полную литературную летопись боя.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsChronicleOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-600/30"
                    >
                      <span>📜 Открыть Летопись Боя</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleReturnToLobby}
                      className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/10"
                    >
                      <span>🏠 Выйти в Главное Меню</span>
                    </button>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* ИНДИКАТОР ОЖИДАНИЯ СКРЫТОГО ХОДА */}
            {isActionLocked && (
              <div className="bg-amber-950/80 border-x border-amber-500/40 py-2.5 px-4 flex items-center justify-center gap-2 text-xs text-amber-300 backdrop-blur-md">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Ваше действие отправлено в тайне. Ожидаем выбор соперника для резолва раунда...</span>
              </div>
            )}

            {/* ПОЛЕ ВВОДА ДЕЙСТВИЙ (ПОЯВЛЯЕТСЯ ТОЛЬКО ПОСЛЕ СТАРТА ДУЭЛИ) */}
            <form 
              onSubmit={handleSendAction}
              className="glass-panel border border-white/10 rounded-b-2xl p-3 flex items-center gap-2.5"
            >
              <input
                type="text"
                disabled={isActionLocked}
                placeholder={
                  isActionLocked
                    ? "Ход отправлен в тайне. Ожидайте описания раунда..."
                    : "Опишите ваше скрытое действие (напр.: Складываю печати Чидори и совершаю диагональный рывок)..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500/70 disabled:opacity-50 transition"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isActionLocked}
                className="bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-600/20 transition cursor-pointer"
              >
                <span>Отправить</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ВЫДВИЖНАЯ ПАНЕЛЬ: Мой секретный профиль */}
      <SecretProfileDrawer
        profile={profile}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSelectActionToInput={handleSelectActionToInput}
        onRequestCard={handleRequestCard}
        selectedJutsuIds={selectedJutsuIds}
        allJutsuList={defaultJutsuData}
        gameVersion={gameVersion}
        userProfile={userProfile}
        currentAccount={currentAccount}
      />

      {/* МОДАЛЬНЫЕ ОКНА */}
      <RulesModal 
        isOpen={isRulesOpen} 
        onClose={() => setIsRulesOpen(false)} 
        currentVersion={gameVersion}
      />

      <JutsuBookModal 
        isOpen={isJutsuOpen} 
        onClose={() => setIsJutsuOpen(false)} 
        gameVersion={gameVersion}
        selectedJutsuIds={selectedJutsuIds}
        onToggleSelectJutsu={toggleSelectJutsu}
        onOpenArsenal={() => {
          setIsJutsuOpen(false);
          setIsArsenalOpen(true);
        }}
        isArsenalLocked={effectiveArsenalLocked}
        canUnlock={canUnlockArsenal}
        onConfirmArsenal={handleConfirmArsenal}
        onUnlockArsenal={handleUnlockArsenal}
        roomStatus={roomStatus}
      />

      {/* 8. МОДАЛЬНОЕ ОКНО: Мой Боевой Арсенал (по центру, только когда выбран режим MODAL) */}
      {isArsenalOpen && arsenalViewMode === 'MODAL' && (
        <MyArsenalModal
          isOpen={true}
          viewMode="MODAL"
          gameVersion={gameVersion}
          onToggleViewMode={handleToggleArsenalMode}
          onClose={() => setIsArsenalOpen(false)}
          selectedJutsuIds={selectedJutsuIds}
          allJutsu={defaultJutsuData}
          onRemoveJutsu={(id) => toggleSelectJutsu(id)}
          onClearArsenal={clearArsenal}
          onOpenJutsuBook={() => {
            setIsArsenalOpen(false);
            setIsJutsuOpen(true);
          }}
          onSelectActionToInput={handleSelectActionToInput}
          clanAutoJutsu={profile?.autoJutsu || []}
          isArsenalLocked={effectiveArsenalLocked}
          canUnlock={canUnlockArsenal}
          onConfirmArsenal={handleConfirmArsenal}
          onUnlockArsenal={handleUnlockArsenal}
          roomStatus={roomStatus}
        />
      )}

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* 9. МОДАЛЬНОЕ ОКНО: Конструктор своего шиноби */}
      <CharacterCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        initialData={{ name: playerName, clan: customNinja?.clan || profile?.clan }}
        onSave={handleSaveCustomNinja}
      />

      {/* 10. МОДАЛЬНОЕ ОКНО: Летопись боя шиноби (Чтение и экспорт фанфика) */}
      <BattleChronicleModal
        isOpen={isChronicleOpen}
        onClose={() => setIsChronicleOpen(false)}
        messages={messages}
        profile={profile}
        battleMode={battleMode}
        roomId={roomId}
        gameVersion={gameVersion}
        playerName={playerName}
      />

      {/* 11. МОДАЛЬНОЕ ОКНО: Выбор модели ИИ & Google аккаунты */}
      <AiModelModal
        isOpen={isAiModelOpen}
        onClose={() => setIsAiModelOpen(false)}
        activeModel={activeModel}
        onSelectModel={handleSelectModel}
        backendUrl={BACKEND_URL}
        currentAccount={currentAccount}
        onSelectAccount={handleSelectAccount}
        userProfile={userProfile}
      />

      {/* 12. МОДАЛЬНОЕ ОКНО: Таблица 100 рангов шиноби */}
      <ShinobiRanksModal
        isOpen={isRanksOpen}
        onClose={() => setIsRanksOpen(false)}
        currentLevel={userProfile?.level || 1}
        currentRank={userProfile?.rank?.title || 'Генин'}
      />

      {/* 13. МОДАЛЬНОЕ ОКНО: Почтовая служба Конохи (Свиток уведомлений) */}
      <ShinobiMailModal
        isOpen={isMailOpen}
        onClose={() => setIsMailOpen(false)}
      />
    </div>
  );
}
