import React, { useState, useEffect } from 'react';
import { 
  Bot, Key, Sparkles, Check, AlertCircle, RefreshCw, 
  ExternalLink, LogIn, UserCheck, Shield, Plus, Trash2, X, Lock, Unlock, Flame, Award
} from 'lucide-react';

export default function AiModelModal({
  isOpen,
  onClose,
  activeModel,
  onSelectModel,
  backendUrl = 'http://localhost:4000',
  currentAccount,
  onSelectAccount,
  userProfile
}) {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('naruto_custom_gemini_key') || '';
  });
  const [savedAccounts, setSavedAccounts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('naruto_google_accounts') || '[]');
    } catch (e) {
      return [];
    }
  });
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  const [models, setModels] = useState([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [saveKeySuccess, setSaveKeySuccess] = useState(false);

  // Проверка: подключен ли аккаунт с Google-почтой
  const hasGoogleAccount = Boolean(
    (savedAccounts && savedAccounts.length > 0) || 
    (currentAccount && currentAccount.email) || 
    userProfile?.googleConnected
  );

  // Загрузка списка моделей при открытии
  useEffect(() => {
    if (isOpen) {
      loadModels(apiKey);
    }
  }, [isOpen]);

  const loadModels = async (keyToUse) => {
    setIsLoadingModels(true);
    setLoadError(null);
    try {
      const res = await fetch(`${backendUrl}/api/gemini/models`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyToUse || undefined })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data.models) && data.models.length > 0) {
        setModels(data.models);
      } else {
        throw new Error('Пустой список моделей');
      }
    } catch (err) {
      console.warn('Ошибка загрузки моделей Gemini:', err.message);
      setLoadError('Не удалось загрузить живой список моделей. Используется проверенный каталог.');
      // Фолбэк каталог с Gemini 3.8 Flash
      setModels([
        {
          id: 'gemini-3.8-flash',
          displayName: 'Gemini 3.8 Flash (Preview)',
          badge: '⚡ VIP: Сверхскорость нового поколения',
          description: 'Ультра-быстрая флагманская модель нового поколения. Мгновенная генерация кинематографичных раундов и точнейший учет всех 248 техник.',
          tier: 'NEXT_GEN',
          requiresGoogle: true,
          isDefault: true
        },
        {
          id: 'gemini-2.5-pro',
          displayName: 'Gemini 2.5 Pro',
          badge: '🧠 VIP: Глубокий расчет (Флагман)',
          description: 'Глубокий тактический интеллект, точная физика дистанций 0.3.3 и детальное обоснование «⚖ Почему так»',
          tier: 'PRO',
          requiresGoogle: true
        },
        {
          id: 'gemini-2.0-flash',
          displayName: 'Gemini 2.0 Flash',
          badge: '⚡ Сверхбыстрая 2.0',
          description: 'Новейшее поколение сверхбыстрых моделей Google для динамичных дуэлей',
          tier: 'FLASH_2',
          requiresGoogle: false
        },
        {
          id: 'gemini-1.5-pro',
          displayName: 'Gemini 1.5 Pro',
          badge: '🎯 Глубокий анализ',
          description: 'Максимальное контекстное окно, идеальное соблюдение 248 техник и баланса кланов',
          tier: 'PRO',
          requiresGoogle: false
        },
        {
          id: 'gemini-1.5-flash',
          displayName: 'Gemini 1.5 Flash',
          badge: '💨 Базовая 1.5',
          description: 'Экономная и стабильная модель для базовых боев',
          tier: 'FLASH_1',
          requiresGoogle: false
        }
      ]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleSaveKey = () => {
    const clean = apiKey.trim();
    if (clean) {
      localStorage.setItem('naruto_custom_gemini_key', clean);
    } else {
      localStorage.removeItem('naruto_custom_gemini_key');
    }
    setSaveKeySuccess(true);
    setTimeout(() => setSaveKeySuccess(false), 2000);
    loadModels(clean);
  };

  const handleAddAccount = (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    const account = {
      id: `acc_${Date.now()}`,
      email: newEmail.trim(),
      name: newName.trim() || newEmail.split('@')[0],
      avatar: '🍥'
    };
    const updated = [...savedAccounts, account];
    setSavedAccounts(updated);
    localStorage.setItem('naruto_google_accounts', JSON.stringify(updated));
    if (onSelectAccount) onSelectAccount(account);
    setNewEmail('');
    setNewName('');
    setIsAddingAccount(false);
  };

  const handleRemoveAccount = (id) => {
    const updated = savedAccounts.filter(a => a.id !== id);
    setSavedAccounts(updated);
    localStorage.setItem('naruto_google_accounts', JSON.stringify(updated));
  };

  const handleModelClick = (m) => {
    if (m.requiresGoogle && !hasGoogleAccount) {
      setIsAddingAccount(true);
      return;
    }
    if (onSelectModel) {
      onSelectModel(m.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto scrollbar-thin text-zinc-100 space-y-6">
        
        {/* Шапка модального окна */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-300 tracking-wider uppercase">
                ИИ-Ведущий & Уровень Шиноби
              </h3>
              <p className="text-xs text-zinc-400">
                Выбор модели Gemini (3.8 Flash, 2.5 Pro) и система прогрессии аккаунта
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 0. КАРТОЧКА УРОВНЯ И РАНГА ШИНОБИ */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-zinc-900 border border-amber-500/40 shadow-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 shadow-md">
                {userProfile?.rank?.icon || '🥋'}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-amber-300 tracking-wide uppercase">
                    {userProfile?.rank?.title || 'Генин'}
                  </h4>
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-200 border border-amber-500/40">
                    Уровень {userProfile?.level || 1}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Сражений: {userProfile?.battlesPlayed || 0} | Побед: {userProfile?.battlesWon || 0}
                </p>
              </div>
            </div>

            {/* Статус Google аккаунта */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold font-mono">
              {hasGoogleAccount ? (
                <div className="flex items-center gap-1.5 text-emerald-400 border-emerald-500/40 bg-emerald-950/40 px-2 py-0.5 rounded-lg border">
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Google VIP: 3.8 Flash & 2.5 Pro активны</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-400 border-amber-500/40 bg-amber-950/40 px-2 py-0.5 rounded-lg border">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Базовый ранг (Почта не привязана)</span>
                </div>
              )}
            </div>
          </div>

          {/* Шкала опыта */}
          <div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-300 mb-1">
              <span>Прогресс ранга</span>
              <span>Победы: {userProfile?.currentWinsInLevel || 0} / {userProfile?.winsRequiredForNextLevel || 1} ({userProfile?.progressPercent || 0}%)</span>
            </div>
            <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-white/10">
              <div 
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-300 h-full rounded-full transition-all duration-700"
                style={{ width: `${userProfile?.progressPercent || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* 1. Блок авторизации Google */}
        <div className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌐</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                Привязанные Google-аккаунты:
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingAccount(!isAddingAccount)}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingAccount ? 'Отмена' : 'Подключить почту'}</span>
            </button>
          </div>

          {/* Список сохраненных аккаунтов */}
          {savedAccounts.length > 0 ? (
            <div className="space-y-2">
              {savedAccounts.map((acc) => {
                const isActive = (currentAccount?.email === acc.email);
                return (
                  <div
                    key={acc.id}
                    onClick={() => onSelectAccount && onSelectAccount(acc)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                      isActive
                        ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-200'
                        : 'border-white/5 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-900 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{acc.avatar || '🍥'}</span>
                      <div>
                        <div className="text-xs font-bold flex items-center gap-2">
                          <span>{acc.name}</span>
                          {isActive && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                              Активен
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          {acc.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAccount(acc.id);
                        }}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-white/5 transition"
                        title="Удалить профиль"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-3 text-center text-xs text-zinc-500 border border-dashed border-white/10 rounded-xl">
              Пока нет подключенных аккаунтов. Подключите Google-почту, чтобы разблокировать Gemini 3.8 Flash!
            </div>
          )}

          {/* Форма добавления аккаунта */}
          {isAddingAccount && (
            <form onSubmit={handleAddAccount} className="p-3.5 rounded-xl bg-zinc-900/80 border border-amber-500/30 space-y-3 animate-fade-in">
              <div className="text-xs font-bold text-amber-300">
                Подключение Google-почты для разблокировки моделей Gemini 3.8 Flash и 2.5 Pro:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500 transition"
                />
                <input
                  type="text"
                  placeholder="Имя шиноби (напр. Вова)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500 transition"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Подключить и разблокировать 3.8 Flash</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 2. Блок персонального Gemini API ключа */}
        <div className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/10">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              Персональный Gemini API Key:
            </label>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Получить бесплатно в AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex gap-2">
            <input
              type="password"
              placeholder="AIzaSy... (оставьте пустым для серверного ключа)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500 transition"
            />
            <button
              type="button"
              onClick={handleSaveKey}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shrink-0"
            >
              {saveKeySuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{saveKeySuccess ? 'Сохранено!' : 'Применить'}</span>
            </button>
          </div>
        </div>

        {/* 3. Выбор модели ИИ-Ведущего */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Каталог моделей ИИ-Ведущего:
            </label>
            <button
              type="button"
              onClick={() => loadModels(apiKey)}
              disabled={isLoadingModels}
              className="text-[11px] text-zinc-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingModels ? 'animate-spin text-amber-400' : ''}`} />
              <span>Обновить список</span>
            </button>
          </div>

          {loadError && (
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{loadError}</span>
            </div>
          )}

          {/* Карточки моделей */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {models.map((m) => {
              const isSelected = (activeModel || 'gemini-3.8-flash') === m.id;
              const isLocked = Boolean(m.requiresGoogle && !hasGoogleAccount);

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleModelClick(m)}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/20 text-zinc-100 shadow-lg ring-1 ring-amber-500/50'
                      : isLocked
                      ? 'border-white/5 bg-zinc-950/70 text-zinc-500 hover:border-amber-500/30'
                      : 'border-white/10 bg-black/40 text-zinc-400 hover:border-white/20 hover:bg-zinc-900/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-black flex items-center gap-1.5 ${isSelected ? 'text-amber-300' : isLocked ? 'text-zinc-500' : 'text-zinc-200'}`}>
                        {isLocked ? <Lock className="w-3.5 h-3.5 text-zinc-600 shrink-0" /> : null}
                        <span>{m.displayName}</span>
                      </span>

                      {isSelected ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Ведущий</span>
                        </span>
                      ) : isLocked ? (
                        <span className="text-[9px] font-mono text-zinc-500 px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800">
                          🔒 Нужна почта
                        </span>
                      ) : m.badge ? (
                        <span className="text-[9px] font-mono text-amber-400/90 px-1.5 py-0.2 rounded bg-amber-950/40 border border-amber-800/30">
                          {m.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className={`text-[11px] leading-snug line-clamp-2 ${isLocked ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      {m.description}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-1.5 text-[9px] font-mono text-zinc-500">
                    <span className="truncate">ID: {m.id}</span>
                    {isLocked && (
                      <span className="text-amber-400 font-semibold hover:underline">
                        Подключить почту →
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Футер */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-zinc-400 text-[11px]">
            ⚡ Текущий ведущий: <b className="text-amber-300">{activeModel || 'gemini-3.8-flash'}</b>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold transition cursor-pointer"
          >
            Готово
          </button>
        </div>

      </div>
    </div>
  );
}
