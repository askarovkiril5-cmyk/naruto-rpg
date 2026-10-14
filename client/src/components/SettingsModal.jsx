import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Image, Sliders, Palette, RotateCcw, Maximize2, Minimize2, 
  Check, Trash2, Upload, Sparkles, Monitor, Sun, ExternalLink,
  Eye, CheckCircle2, AlertCircle, Volume2, VolumeX, Music, Play, Pause, Globe
} from 'lucide-react';
import { audioManager, AUDIO_TRACKS } from '../utils/audioManager';

export const DEFAULT_SETTINGS = {
  bgImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1920&auto=format&fit=crop',
  bgOverlayOpacity: 0.55,
  panelOpacity: 0.85,
  playerBubbleBg: '#1e3a8a',
  opponentBubbleBg: '#4c1d95',
  gmBubbleBg: '#18181b',
  gmBubbleText: '#fef08a',
};

// 8 готовых атмосферных фонов в стиле Наруто / Япония
export const PRESET_WALLPAPERS = [
  {
    id: 'valley_of_the_end',
    name: 'Долина Завершения',
    desc: 'Мадара против Хаширамы',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1920&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'konoha_sunset',
    name: 'Закат в Конохе',
    desc: 'Деревня Скрытого Листа',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1920&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'blood_moon',
    name: 'Кровавая Луна',
    desc: 'Вечное Цукуёми / Клан Учиха',
    url: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?q=80&w=1920&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'rain_village',
    name: 'Деревня Дождя',
    desc: 'Амегакуре / Башни Пейна',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1920&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'forest_of_death',
    name: 'Лес Смерти',
    desc: 'Древние деревья и водопад',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'fiery_dawn',
    name: 'Огненный Рассвет',
    desc: 'Эпичные облака шиноби',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'cyber_arena',
    name: 'Тёмная Арена',
    desc: 'Глубокий минималистичный фон',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'neon_shrine',
    name: 'Неоновые Врата Тории',
    desc: 'Ночной кибер-стиль',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop',
    preview: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop'
  }
];

// Очистка и нормализация URL изображения
export function cleanImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  let cleaned = url.trim();
  if (cleaned.startsWith('url(') && cleaned.endsWith(')')) {
    cleaned = cleaned.slice(4, -1).trim();
    if (
      (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'"))
    ) {
      cleaned = cleaned.slice(1, -1).trim();
    }
  }
  return cleaned;
}

// Сжатие пользовательского изображения через Canvas до разумного размера (~150-250KB)
// Это предотвращает QuotaExceededError в localStorage и гарантирует моментальную загрузку
function compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Выбранный файл не является изображением'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('Не удалось открыть изображение'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Не удалось создать canvas'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Применение CSS-переменных к документу
export function applyTheme(theme) {
  if (!theme || typeof theme !== 'object') return;
  const root = document.documentElement;
  const rawBg = theme.bgImage || DEFAULT_SETTINGS.bgImage;
  const cleanBg = cleanImageUrl(rawBg);

  root.style.setProperty('--app-bg-image', `url("${cleanBg}")`);
  root.style.setProperty('--bg-overlay-opacity', (theme.bgOverlayOpacity ?? DEFAULT_SETTINGS.bgOverlayOpacity).toString());
  root.style.setProperty('--panel-opacity', (theme.panelOpacity ?? DEFAULT_SETTINGS.panelOpacity).toString());
  root.style.setProperty('--player-bubble-bg', theme.playerBubbleBg || DEFAULT_SETTINGS.playerBubbleBg);
  root.style.setProperty('--opponent-bubble-bg', theme.opponentBubbleBg || DEFAULT_SETTINGS.opponentBubbleBg);
  root.style.setProperty('--gm-bubble-bg', theme.gmBubbleBg || DEFAULT_SETTINGS.gmBubbleBg);
  root.style.setProperty('--gm-bubble-text', theme.gmBubbleText || DEFAULT_SETTINGS.gmBubbleText);

  try {
    localStorage.setItem('naruto_custom_theme', JSON.stringify({
      ...theme,
      bgImage: cleanBg
    }));
  } catch (e) {
    console.warn('LocalStorage error while saving theme:', e);
  }
}

// Инициализация темы при первой загрузке
export function initTheme() {
  try {
    const saved = localStorage.getItem('naruto_custom_theme');
    if (saved) {
      const parsed = JSON.parse(saved);
      applyTheme(parsed);
      return parsed;
    }
  } catch (e) {}
  applyTheme(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

export default function SettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('naruto_custom_theme');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [urlInput, setUrlInput] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Статус полноэкранного режима
  const [isFullscreen, setIsFullscreen] = useState(() => {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  });

  // Отслеживание изменений Fullscreen API (включая клавиши F11 и Esc)
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

function formatTime(sec) {
  if (isNaN(sec) || sec <= 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

  // Состояние аудио
  const [audioState, setAudioState] = useState({
    isPlaying: audioManager.isPlaying,
    currentMode: audioManager.currentMode,
    currentTrackId: audioManager.currentTrackId,
    volume: audioManager.volume,
    sfxVolume: audioManager.sfxVolume,
    isMuted: audioManager.isMuted,
    sfxEnabled: audioManager.sfxEnabled,
    currentTime: audioManager.currentTime || 0,
    duration: audioManager.duration || 0
  });

  useEffect(() => {
    return audioManager.subscribe((state) => {
      setAudioState({ ...state });
    });
  }, []);

  // Синхронизация urlInput при открытии окна
  useEffect(() => {
    if (isOpen) {
      if (settings.bgImage && !settings.bgImage.startsWith('data:')) {
        setUrlInput(settings.bgImage);
      } else {
        setUrlInput('');
      }
      setUploadError('');
      setSavedSuccess(false);
      setServerUrlInput(localStorage.getItem('naruto_server_ip') || '');
    }
  }, [isOpen, settings.bgImage]);

  const [serverUrlInput, setServerUrlInput] = useState('');
  const [serverUrlSuccess, setServerUrlSuccess] = useState(false);

  const handleSaveServerUrl = () => {
    const trimmed = serverUrlInput.trim();
    if (trimmed) {
      localStorage.setItem('naruto_server_ip', trimmed);
    } else {
      localStorage.removeItem('naruto_server_ip');
    }
    setServerUrlSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  // Применяем CSS при любом изменении settings
  useEffect(() => {
    applyTheme(settings);
  }, [settings]);

  if (!isOpen) return null;

  // Переключение полноэкранного режима
  const toggleFullscreen = async () => {
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

  // Загрузка локального файла с ПК
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingFile(true);
      setUploadError('');
      const compressedDataUrl = await compressImage(file, 1920, 1080, 0.82);
      setSettings(prev => ({
        ...prev,
        bgImage: compressedDataUrl
      }));
      setUrlInput('');
    } catch (err) {
      setUploadError(err.message || 'Ошибка обработки изображения');
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Применение ссылки на картинку из интернета
  const handleApplyUrl = (e) => {
    e?.preventDefault();
    const cleaned = cleanImageUrl(urlInput);
    if (!cleaned) return;

    setSettings(prev => ({
      ...prev,
      bgImage: cleaned
    }));
    setUploadError('');
  };

  // Выбор предустановленного фона
  const handleSelectPreset = (presetUrl) => {
    setSettings(prev => ({
      ...prev,
      bgImage: presetUrl
    }));
    setUrlInput(presetUrl);
    setUploadError('');
  };

  // Удаление локальной картинки / возврат к дефолту
  const handleResetToDefaultBg = () => {
    setSettings(prev => ({
      ...prev,
      bgImage: DEFAULT_SETTINGS.bgImage
    }));
    setUrlInput(DEFAULT_SETTINGS.bgImage);
    setUploadError('');
  };

  // Полный сброс всех настроек
  const handleResetAll = () => {
    if (confirm('Сбросить все настройки оформления к стандартным?')) {
      setSettings(DEFAULT_SETTINGS);
      setUrlInput(DEFAULT_SETTINGS.bgImage);
      setUploadError('');
      applyTheme(DEFAULT_SETTINGS);
    }
  };

  // Сохранение и закрытие
  const handleSaveAndClose = () => {
    applyTheme(settings);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 350);
  };

  const isLocalImageActive = settings.bgImage?.startsWith('data:');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 select-none animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-950/98 p-5 sm:p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* ШАПКА */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide text-zinc-100 flex items-center gap-2">
                Настройки оформления & Режим экрана
              </h2>
              <p className="text-[11px] text-zinc-400">
                Полноэкранный режим, фоновые изображения, прозрачность и цветовая палитра.
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
            title="Закрыть настройки"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ОСНОВНОЙ СКРОЛЛЯЩИЙСЯ КОНТЕНТ */}
        <div className="mt-4 space-y-6 overflow-y-auto pr-1.5 scrollbar-thin flex-1">
          
          {/* 1. ПОЛНОЭКРАННЫЙ РЕЖИМ (FULLSCREEN) */}
          <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-950/30 via-zinc-900/60 to-zinc-900/40 border border-amber-500/30 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wide">
                      Полноэкранный режим
                    </h3>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      isFullscreen 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50' 
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {isFullscreen ? 'АКТИВЕН' : 'В ОКНЕ'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Убирает адресную строку и вкладки браузера для полного погружения в бой. (Клавиша <kbd className="px-1.5 py-0.5 bg-black/60 rounded border border-white/10 font-mono text-[10px] text-amber-300">F11</kbd>).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleFullscreen}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg cursor-pointer shrink-0 ${
                  isFullscreen
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10'
                    : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 font-black shadow-amber-600/30'
                }`}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    <span>Выйти из полного экрана</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 text-zinc-950" />
                    <span>Во весь экран</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 1.5. СЕТЕВОЙ СЕРВЕР (ОНЛАЙН ДЛЯ ДРУЗЕЙ) */}
          <div className="rounded-2xl p-4 bg-gradient-to-r from-blue-950/30 via-zinc-900/60 to-zinc-900/40 border border-blue-500/30 shadow-inner space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-blue-300 uppercase tracking-wide flex items-center gap-2">
                  Сетевой сервер (Онлайн для друзей)
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Укажите публичный адрес сервера (например с Render, Railway или туннеля), чтобы играть с друзьями по сети без локального сервера.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="http://localhost:4000 или https://your-game.onrender.com"
                value={serverUrlInput}
                onChange={(e) => setServerUrlInput(e.target.value)}
                className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500/60 font-mono"
              />
              <button
                type="button"
                onClick={handleSaveServerUrl}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Применить адрес</span>
              </button>
            </div>
            {serverUrlSuccess && (
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> Адрес сервера сохранён! Перезагрузка страницы...
              </div>
            )}
          </div>

          {/* 2. ГОТОВЫЕ ФОНЫ В СТИЛЕ НАРУТО (ПРЕСЕТЫ В 1 КЛИК) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Готовые обои шиноби (выбор в 1 клик)
              </label>
              <span className="text-[11px] text-zinc-400">Нажмите на любой фон</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_WALLPAPERS.map((preset) => {
                const isActive = settings.bgImage === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`group relative rounded-xl overflow-hidden border text-left transition p-0 cursor-pointer aspect-video flex flex-col justify-end ${
                      isActive
                        ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img 
                      src={preset.preview} 
                      alt={preset.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    <div className="relative p-2 z-10">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-bold text-zinc-100 truncate">
                          {preset.name}
                        </span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 shadow-sm shadow-amber-400" />
                        )}
                      </div>
                      <span className="text-[9px] text-zinc-400 truncate block">
                        {preset.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. ЗАГРУЗКА СВОЕГО ИЗОБРАЖЕНИЯ (С ПК ИЛИ ПО ССЫЛКЕ) */}
          <div className="space-y-3 border-t border-white/10 pt-4">
            <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Image className="w-4 h-4 text-cyan-400" /> Своё изображение
            </label>

            {/* Карточка статуса локального изображения */}
            {isLocalImageActive && (
              <div className="bg-cyan-950/40 border border-cyan-500/40 rounded-xl p-3 flex items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-cyan-500/50 shrink-0 bg-black">
                    <img src={settings.bgImage} alt="Превью" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      Загружено фото с вашего компьютера
                    </span>
                    <span className="text-[10px] text-zinc-400 block truncate">
                      Автоматически оптимизировано для плавной работы без зависаний.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetToDefaultBg}
                  className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/40 text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
                  title="Удалить локальное фото и вернуть стандартный фон"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Сбросить</span>
                </button>
              </div>
            )}

            {/* Кнопка загрузки с ПК */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingFile}
                className="rounded-xl bg-zinc-900 hover:bg-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-200 transition border border-white/15 hover:border-amber-400/50 flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>{isProcessingFile ? 'Обработка и сжатие...' : '📁 Выбрать файл с компьютера'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="text-[11px] text-zinc-400">
                Поддерживаются любые форматы: JPG, PNG, WebP (любой размер).
              </span>
            </div>

            {uploadError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800/40">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Поле ввода прямой ссылки (URL) */}
            <form onSubmit={handleApplyUrl} className="flex gap-2 items-center pt-1">
              <input
                type="text"
                placeholder="Или вставьте прямую ссылку (URL) на картинку из интернета..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 rounded-xl bg-zinc-900 border border-zinc-700/70 px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-amber-500 transition shadow-inner"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-amber-300 border border-amber-500/30 transition cursor-pointer shrink-0"
              >
                Применить URL
              </button>
            </form>
          </div>

          {/* 4. ЗАТЕМНЕНИЕ ФОНА И ПРОЗРАЧНОСТЬ ИНТЕРФЕЙСА */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-4">
            
            {/* Затемнение обоев */}
            <div className="space-y-2 bg-zinc-900/50 p-3.5 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Затемнение фона
                </label>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {Math.round((settings.bgOverlayOpacity ?? 0.55) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.90"
                step="0.05"
                value={settings.bgOverlayOpacity ?? 0.55}
                onChange={(e) => setSettings({ ...settings, bgOverlayOpacity: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
              />
              <p className="text-[10px] text-zinc-400">
                Сделайте меньше, чтобы фон был ярче, или больше — для четкости текста.
              </p>
            </div>

            {/* Прозрачность окон */}
            <div className="space-y-2 bg-zinc-900/50 p-3.5 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Прозрачность панелей
                </label>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {Math.round((settings.panelOpacity ?? 0.85) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.20"
                max="0.98"
                step="0.02"
                value={settings.panelOpacity ?? 0.85}
                onChange={(e) => setSettings({ ...settings, panelOpacity: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
              />
              <p className="text-[10px] text-zinc-400">
                Степень прозрачности боевого чата, меню и информационных блоков.
              </p>
            </div>
          </div>

          {/* 5. ЗВУКОВАЯ АТМОСФЕРА И МУЗЫКА (SFX & SOUNDTRACK) */}
          <div className="rounded-2xl p-4 bg-gradient-to-r from-cyan-950/20 via-zinc-900/60 to-zinc-900/40 border border-cyan-500/30 shadow-inner space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-cyan-300 uppercase tracking-wide">
                      Звуковая атмосфера шиноби
                    </h3>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      audioState.isPlaying && !audioState.isMuted
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50' 
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {audioState.isPlaying && !audioState.isMuted ? 'ИГРАЕТ 🎵' : 'ВЫКЛЮЧЕНА'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Японский лоу-фай и сякухати в лобби, боевые барабаны тайко во время дуэли.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => audioManager.togglePlay()}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md ${
                    audioState.isPlaying && !audioState.isMuted
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10'
                  }`}
                >
                  {audioState.isPlaying && !audioState.isMuted ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Пауза</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Включить музыку</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Громкость музыки и SFX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-white/5">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-300 flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-cyan-400" /> Громкость музыки:
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {Math.round(audioState.volume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioState.volume}
                  onChange={(e) => audioManager.setVolume(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Звуковые эффекты (SFX):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      audioManager.playSfx('seal');
                    }}
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    Тест печати 닌
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioState.sfxVolume}
                  onChange={(e) => audioManager.setSfxVolume(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
              </div>
            </div>

            {/* Перемотка музыки (Timeline scrubber) */}
            <div className="space-y-2 pt-2 border-t border-white/5 bg-black/40 p-3 rounded-xl border border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-cyan-400" /> Перемотка саундтрека:
                </span>
                <span className="font-mono text-cyan-400 font-bold text-xs">
                  {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
                </span>
              </div>
              
              <input
                type="range"
                min="0"
                max={audioState.duration > 0 ? audioState.duration : 100}
                step="0.5"
                value={audioState.currentTime || 0}
                disabled={!audioState.duration || audioState.duration <= 0}
                onChange={(e) => audioManager.seek(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-zinc-800 rounded-lg disabled:opacity-40"
              />

              <div className="flex items-center justify-between text-xs pt-0.5">
                <button
                  type="button"
                  disabled={!audioState.duration}
                  onClick={() => audioManager.seek(Math.max(0, (audioState.currentTime || 0) - 10))}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <span>⏪ -10с</span>
                </button>
                <span className="text-[10px] text-zinc-400">
                  {audioState.isPlaying && !audioState.isMuted ? '🎵 Воспроизведение' : '⏸️ Пауза'}
                </span>
                <button
                  type="button"
                  disabled={!audioState.duration}
                  onClick={() => audioManager.seek(Math.min(audioState.duration || 0, (audioState.currentTime || 0) + 10))}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <span>+10с ⏩</span>
                </button>
              </div>
            </div>

            {/* Выбор трека */}
            <div className="space-y-2 pt-1 border-t border-white/5">
              <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                Выбор саундтрека:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AUDIO_TRACKS.map((t) => {
                  const isCurrent = audioState.currentTrackId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        audioManager.play(t.type, t.id);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? 'border-cyan-400 bg-cyan-950/50 shadow-sm'
                          : 'border-white/5 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold text-zinc-100 flex items-center gap-1.5 truncate">
                          <span>{t.icon}</span>
                          <span>{t.name}</span>
                        </span>
                        <span className="text-[10px] text-zinc-400 truncate block">
                          {t.desc}
                        </span>
                      </div>
                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 shadow-sm shadow-cyan-400 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 6. ЦВЕТА СООБЩЕНИЙ В ЧАТЕ */}
          <div className="space-y-2.5 border-t border-white/10 pt-4">
            <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" /> Цвета сообщений в боевом логе
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Мой ход */}
              <div className="bg-zinc-900/70 p-3 rounded-xl border border-white/5">
                <span className="text-[11px] text-zinc-300 block mb-1.5 font-semibold">Мой ход</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.playerBubbleBg}
                    onChange={(e) => setSettings({ ...settings, playerBubbleBg: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                  <span className="text-xs font-mono text-zinc-300">{settings.playerBubbleBg}</span>
                </div>
              </div>

              {/* Ход оппонента */}
              <div className="bg-zinc-900/70 p-3 rounded-xl border border-white/5">
                <span className="text-[11px] text-zinc-300 block mb-1.5 font-semibold">Ход противника</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.opponentBubbleBg}
                    onChange={(e) => setSettings({ ...settings, opponentBubbleBg: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                  <span className="text-xs font-mono text-zinc-300">{settings.opponentBubbleBg}</span>
                </div>
              </div>

              {/* ИИ Ведущий */}
              <div className="bg-zinc-900/70 p-3 rounded-xl border border-white/5">
                <span className="text-[11px] text-zinc-300 block mb-1.5 font-semibold">ИИ Мастер</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.gmBubbleBg}
                    onChange={(e) => setSettings({ ...settings, gmBubbleBg: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                  <span className="text-xs font-mono text-zinc-300">{settings.gmBubbleBg}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ФУТЕР */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-white/10 pt-4 shrink-0">
          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Сбросить всё по умолчанию
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 px-6 py-2.5 text-xs font-black text-zinc-950 shadow-lg shadow-amber-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-zinc-950" />
                  <span>Сохранено!</span>
                </>
              ) : (
                <span>Сохранить настройки</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
