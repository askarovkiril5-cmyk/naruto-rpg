import React, { useState } from 'react';
import { 
  X, Send, Megaphone, Crown, AlertCircle, CheckCircle2, ShieldAlert, Sparkles, Radio
} from 'lucide-react';
import { audioManager } from '../utils/audioManager';

export default function DeveloperAnnouncementModal({
  isOpen,
  onClose,
  backendUrl,
  socket,
  userProfile,
  developerEmail,
  developerName,
  onAnnouncementSent
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('village'); // 'village' | 'hokage' | 'battle'
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const userEmail = String(developerEmail || userProfile?.email || '').trim().toLowerCase();
  const isDev = userEmail === 'askarovkiril5@gmail.com';

  const handleBroadcast = async (e) => {
    e?.preventDefault();
    setStatusMessage('');
    setIsSuccess(false);

    if (!isDev) {
      setStatusMessage('Доступ запрещён: функция доступна исключительно Создателю игры (Кириллу)!');
      return;
    }

    if (!title.trim()) {
      setStatusMessage('Введите тему системного оповещения!');
      return;
    }
    if (!content.trim()) {
      setStatusMessage('Введите текст сообщения для игроков!');
      return;
    }

    try {
      setIsSending(true);
      audioManager.playSfx('gong');

      const payload = {
        title: title.trim(),
        category,
        content: content.trim(),
        senderName: '👑 Создатель игры (Кирилл)',
        senderEmail: userEmail
      };

      // 1. Отправляем через сокет для мгновенного броадкаста
      if (socket && socket.connected) {
        socket.emit('broadcast_system_announcement', payload, (res) => {
          if (res?.error) {
            setStatusMessage(res.error);
            setIsSending(false);
            return;
          }
        });
      }

      // 2. Также отправляем через REST API для надежного сохранения
      const res = await fetch(`${backendUrl}/api/system/announcement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.error) {
        setStatusMessage(data.error);
        setIsSending(false);
        return;
      }

      setIsSuccess(true);
      setStatusMessage('✅ Системное оповещение успешно доставлено всем шиноби Конохи в их «Почту Конохи»!');
      setTitle('');
      setContent('');

      if (onAnnouncementSent) {
        onAnnouncementSent(data.announcement);
      }

      setTimeout(() => {
        setIsSuccess(false);
        setStatusMessage('');
        onClose();
      }, 3500);

    } catch (err) {
      setStatusMessage('Ошибка отправки: ' + err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 select-none animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl border border-yellow-500/50 bg-zinc-950/98 p-4 sm:p-6 shadow-[0_0_50px_rgba(250,204,21,0.2)] text-zinc-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* ШАПКА ПАНЕЛИ СОЗДАТЕЛЯ */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/30 to-amber-600/20 border-2 border-yellow-400 flex items-center justify-center text-yellow-400 text-2xl shadow-[0_0_15px_rgba(250,204,21,0.4)]">
              <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide text-yellow-300 uppercase flex items-center gap-1.5">
                  <span>Панель Создателя: Оповещение Системой</span>
                </h2>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-yellow-500 text-black shadow-sm">
                  РАЗРАБОТЧИК
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Массовая рассылка официального свитка всем шиноби Конохи в онлайн и офлайн почту.
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer border border-white/5"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ТЕЛО МОДАЛКИ */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin">
          
          {!isDev ? (
            <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
              <span>
                Внимание! Эта панель доступна исключительно подтверждённому аккаунту Создателя игры (askarovkiril5@gmail.com).
              </span>
            </div>
          ) : (
            <form onSubmit={handleBroadcast} className="space-y-4">
              
              {/* Тип оповещения */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Категория важности свитка:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory('village')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      category === 'village'
                        ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-md shadow-rose-900/20'
                        : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>🔴 Вести деревни</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('hokage')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      category === 'hokage'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-900/20'
                        : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>🟢 Приказ Хокаге</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('battle')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      category === 'battle'
                        ? 'bg-amber-950/60 border-amber-500 text-amber-300 shadow-md shadow-amber-900/20'
                        : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>🟡 Боевое донесение</span>
                  </button>
                </div>
              </div>

              {/* Тема сообщения */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                  <span>Тема оповещения (заголовок свитка):</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Отобразится в списке писем</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например: Технические работы на боевом сервере через 10 минут..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition"
                />
              </div>

              {/* Текст обращения */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                  <span>Текст системного сообщения:</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Поддерживает переносы строк</span>
                </label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Уважаемые шиноби Конохи!&#10;&#10;Внимание: на сервере проводятся технические работы по обновлению баланса техник и внедрению новых додзюцу. Сервер будет перезапущен через 10 минут.&#10;&#10;С уважением, Создатель игры Кирилл."
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition resize-none font-sans leading-relaxed"
                />
              </div>

              {statusMessage && (
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  isSuccess 
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 font-bold' 
                    : 'bg-red-950/60 border-red-500/40 text-red-300'
                }`}>
                  {isSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Кнопка отправки */}
              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:brightness-110 disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider transition shadow-xl shadow-yellow-500/30 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <Megaphone className="w-4 h-4" />
                <span>{isSending ? 'Рассылка всем шиноби Конохи...' : '📢 Разослать оповещение всем шиноби Конохи'}</span>
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
