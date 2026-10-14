import React, { useState, useEffect } from 'react';
import { 
  X, Scroll, Check, Trash2, Download, RefreshCw, 
  ExternalLink, Sparkles, AlertCircle, CheckCircle2, ChevronRight,
  Shield, Swords, Bell, Mail, ArrowDownToLine
} from 'lucide-react';
import { notificationManager } from '../utils/notificationManager';

export default function ShinobiMailModal({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState(() => notificationManager.getAll());
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'hokage' | 'battle' | 'village'
  const [selectedMailId, setSelectedMailId] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    return notificationManager.subscribe((list) => {
      setNotifications([...list]);
    });
  }, []);

  useEffect(() => {
    if (isOpen && notifications.length > 0 && !selectedMailId) {
      setSelectedMailId(notifications[0].id);
      notificationManager.markAsRead(notifications[0].id);
    }
  }, [isOpen, notifications, selectedMailId]);

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    return n.category === activeTab;
  });

  const selectedMail = notifications.find(n => n.id === selectedMailId) || filteredNotifications[0];

  const handleSelectMail = (item) => {
    setSelectedMailId(item.id);
    if (!item.read) {
      notificationManager.markAsRead(item.id);
    }
  };

  const handleMarkAllRead = () => {
    notificationManager.markAllAsRead();
  };

  const handleDeleteCurrent = (id, e) => {
    e?.stopPropagation();
    notificationManager.deleteNotification(id);
    if (selectedMailId === id) {
      setSelectedMailId(null);
    }
  };

  const handleDownloadUpdate = (updateData) => {
    setDownloadSuccess(true);
    // Инициируем скачивание ZIP-файла
    const link = document.createElement('a');
    link.href = updateData?.downloadUrl || '/Naruto_RPG_Игра_для_Друзей.zip';
    link.download = updateData?.archiveName || 'Naruto_RPG_Игра_для_Друзей.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
  };

  const handleReloadGame = () => {
    window.location.reload();
  };

  const getCategoryDetails = (cat) => {
    switch (cat) {
      case 'hokage':
        return {
          title: 'Приказ Хокаге',
          badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-emerald-500/20',
          borderClass: 'border-emerald-500/40 hover:border-emerald-500/80',
          activeBg: 'bg-gradient-to-r from-emerald-950/60 via-zinc-900/90 to-zinc-900/60',
          cardGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
          dotColor: 'bg-emerald-400',
          icon: '🟢',
          iconName: 'Резиденция Хокаге'
        };
      case 'battle':
        return {
          title: 'Боевые донесения',
          badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-amber-500/20',
          borderClass: 'border-amber-500/40 hover:border-amber-500/80',
          activeBg: 'bg-gradient-to-r from-amber-950/60 via-zinc-900/90 to-zinc-900/60',
          cardGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
          dotColor: 'bg-amber-400',
          icon: '🟡',
          iconName: 'Штаб тактики'
        };
      case 'village':
      default:
        return {
          title: 'Вести деревни',
          badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-rose-500/20',
          borderClass: 'border-rose-500/40 hover:border-rose-500/80',
          activeBg: 'bg-gradient-to-r from-rose-950/60 via-zinc-900/90 to-zinc-900/60',
          cardGlow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
          dotColor: 'bg-rose-400',
          icon: '🔴',
          iconName: 'Канцелярия Конохи'
        };
    }
  };

  // Форматирование даты и времени письма по местному часовому поясу игрока
  const formatNotificationLocalTime = (item) => {
    if (!item) return '';
    const ts = item.timestamp;
    if (!ts) return item.date || 'Сегодня';
    const d = new Date(ts);
    if (isNaN(d.getTime())) return item.date || 'Сегодня';

    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) {
      return `Сегодня, ${timeStr}`;
    } else if (isYesterday) {
      return `Вчера, ${timeStr}`;
    } else {
      return `${d.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' })}, ${timeStr}`;
    }
  };

  const unreadCount = notificationManager.getUnreadCount();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 select-none animate-fadeIn">
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-zinc-950/98 p-4 sm:p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* ШАПКА ОКНА */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl shadow-inner relative">
              <Scroll className="w-5 h-5 text-amber-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white font-mono text-[10px] font-black flex items-center justify-center border-2 border-zinc-950 animate-bounce">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide text-zinc-100 uppercase flex items-center gap-2">
                  Почтовая служба Конохи
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {notifications.length} писем
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Приказы Хокаге, боевые донесения, системные вести деревни и загрузка обновлений.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 text-xs font-semibold transition cursor-pointer"
                title="Отметить все письма прочитанными"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Прочитать все</span>
              </button>
            )}

            <button 
              type="button"
              onClick={onClose} 
              className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
              title="Закрыть почту"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ВКЛАДКИ КАТЕГОРИЙ С ПОДСВЕТКОЙ */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2 shrink-0 border-b border-white/10 pb-3">
          {/* Все */}
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
              activeTab === 'all'
                ? 'bg-zinc-800 text-zinc-100 border-white/30 shadow-sm'
                : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:border-white/20'
            }`}
          >
            Все ({notifications.length})
          </button>

          {/* 🟢 Приказ Хокаге */}
          <button
            type="button"
            onClick={() => setActiveTab('hokage')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'hokage'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-lg shadow-emerald-500/20'
                : 'bg-emerald-950/30 text-emerald-400/80 border-emerald-500/20 hover:border-emerald-500/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
            <span>Приказ Хокаге</span>
            <span className="text-[10px] opacity-75 font-mono">
              ({notifications.filter(n => n.category === 'hokage').length})
            </span>
          </button>

          {/* 🟡 Боевые донесения */}
          <button
            type="button"
            onClick={() => setActiveTab('battle')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'battle'
                ? 'bg-amber-950 text-amber-300 border-amber-500 shadow-lg shadow-amber-500/20'
                : 'bg-amber-950/30 text-amber-400/80 border-amber-500/20 hover:border-amber-500/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
            <span>Боевые донесения</span>
            <span className="text-[10px] opacity-75 font-mono">
              ({notifications.filter(n => n.category === 'battle').length})
            </span>
          </button>

          {/* 🔴 Вести деревни */}
          <button
            type="button"
            onClick={() => setActiveTab('village')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'village'
                ? 'bg-rose-950 text-rose-300 border-rose-500 shadow-lg shadow-rose-500/20'
                : 'bg-rose-950/30 text-rose-400/80 border-rose-500/20 hover:border-rose-500/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 shadow-sm shadow-rose-400" />
            <span>Вести деревни</span>
            <span className="text-[10px] opacity-75 font-mono">
              ({notifications.filter(n => n.category === 'village').length})
            </span>
          </button>
        </div>

        {/* ТЕЛО: ДВУХКОЛОНОЧНЫЙ ИНТЕРФЕЙС (СПИСОК СЛЕВА, СОДЕРЖИМОЕ СПРАВА) */}
        <div className="mt-3 flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 overflow-hidden min-h-0">
          
          {/* ЛЕВАЯ КОЛОНКА: СПИСОК ПИСЕМ */}
          <div className="md:col-span-5 flex flex-col overflow-hidden border border-white/10 rounded-2xl bg-black/40">
            <div className="p-2.5 border-b border-white/5 bg-zinc-900/40 text-[11px] font-bold text-zinc-400 flex justify-between items-center">
              <span>Входящие свитки ({filteredNotifications.length})</span>
              <span className="text-[10px] text-zinc-500">Нажмите для чтения</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin">
              {filteredNotifications.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-xs">
                  Нет писем в этой категории.
                </div>
              ) : (
                filteredNotifications.map((item) => {
                  const details = getCategoryDetails(item.category);
                  const isSelected = selectedMail?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectMail(item)}
                      className={`p-3 rounded-xl border transition cursor-pointer relative text-left ${details.cardGlow} ${
                        isSelected
                          ? `${details.activeBg} ${details.borderClass} ring-1 ring-white/20`
                          : `bg-zinc-900/60 border-white/5 hover:border-white/20 hover:bg-zinc-900`
                      }`}
                    >
                      {/* Верхняя строчка: значок категории и дата */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${details.badgeClass}`}>
                          <span>{details.icon}</span>
                          <span>{details.title}</span>
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {formatNotificationLocalTime(item)}
                        </span>
                      </div>

                      {/* Заголовок письма */}
                      <div className="flex items-start justify-between gap-1 mt-1">
                        <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${
                          item.read ? 'text-zinc-300' : 'text-zinc-100 font-black'
                        }`}>
                          {item.title}
                        </h4>
                        {!item.read && (
                          <span className={`w-2 h-2 rounded-full shrink-0 mt-1 shadow-sm ${details.dotColor} animate-pulse`} />
                        )}
                      </div>

                      {/* Отправитель */}
                      <div className="text-[10px] text-zinc-400 mt-1 flex items-center justify-between">
                        <span className="truncate">{item.sender}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА: ДЕТАЛЬНОЕ ЧТЕНИЕ ПИСЬМА */}
          <div className="md:col-span-7 flex flex-col overflow-hidden border border-white/10 rounded-2xl bg-zinc-900/40">
            {selectedMail ? (
              (() => {
                const details = getCategoryDetails(selectedMail.category);
                return (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    
                    {/* ШАПКА ВЫБРАННОГО ПИСЬМА */}
                    <div className={`p-4 border-b border-white/10 ${details.activeBg} shrink-0`}>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${details.badgeClass}`}>
                          <span>{details.icon}</span>
                          <span>{details.title}</span>
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">
                          {formatNotificationLocalTime(selectedMail)}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-black text-zinc-100 leading-snug">
                        {selectedMail.title}
                      </h3>

                      <div className="text-[11px] text-zinc-300 font-medium mt-1 flex items-center gap-1.5">
                        <span className="text-zinc-500">Отправитель:</span>
                        <span className="font-semibold text-zinc-200">{selectedMail.sender}</span>
                      </div>
                    </div>

                    {/* ТЕКСТ ПИСЬМА */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm text-zinc-200 leading-relaxed scrollbar-thin whitespace-pre-line font-sans">
                      {selectedMail.content}

                      {/* СПЕЦИАЛЬНЫЙ БЛОК АВТООБНОВЛЕНИЯ ИГРЫ (№2.1) */}
                      {selectedMail.updateData && (
                        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-rose-950/60 via-zinc-900 to-zinc-900 border border-rose-500/40 shadow-xl space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">📦</span>
                              <div>
                                <span className="text-xs font-black text-rose-300 uppercase tracking-wide block">
                                  Установочный пакет обновления v{selectedMail.updateData.version}
                                </span>
                                <span className="text-[10px] text-zinc-400 font-mono">
                                  {selectedMail.updateData.archiveName}
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50">
                              АКТУАЛЬНО
                            </span>
                          </div>

                          <p className="text-[11px] text-zinc-300 leading-normal">
                            Вы можете скачать чистый портативный ZIP-архив с обновлением для отправки друзьям или перезагрузить страницу игры для мгновенного применения патча.
                          </p>

                          <div className="flex flex-wrap items-center gap-2.5 pt-1">
                            <button
                              type="button"
                              onClick={() => handleDownloadUpdate(selectedMail.updateData)}
                              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30"
                            >
                              <ArrowDownToLine className="w-4 h-4" />
                              <span>📥 Скачать обновление (ZIP)</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleReloadGame}
                              className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer border border-white/10"
                              title="Перезагрузить клиент игры для применения изменений"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Применить патч</span>
                            </button>
                          </div>

                          {downloadSuccess && (
                            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-semibold">
                              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                              <span>Файл обновления успешно загружен в браузер!</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* НИЖНЯЯ ПАНЕЛЬ ДЕЙСТВИЙ */}
                    <div className="p-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCurrent(selectedMail.id, e)}
                        className="text-zinc-500 hover:text-rose-400 transition flex items-center gap-1 text-[11px] cursor-pointer"
                        title="Удалить это письмо"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Удалить письмо</span>
                      </button>

                      <span className="text-[10px] text-zinc-500 font-mono">
                        ID: {selectedMail.id}
                      </span>
                    </div>

                  </div>
                );
              })()
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500 space-y-2">
                <Scroll className="w-12 h-12 text-zinc-700 stroke-[1]" />
                <p className="text-xs">Выберите письмо из левой колонки для чтения.</p>
              </div>
            )}
          </div>

        </div>

        {/* ФУТЕР */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Приказ Хокаге
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Боевые донесения
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Вести деревни
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition cursor-pointer"
          >
            Закрыть почту
          </button>
        </div>

      </div>
    </div>
  );
}
