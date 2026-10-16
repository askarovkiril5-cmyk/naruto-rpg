import React, { useState, useRef } from 'react';
import { 
  X, Check, Lock, Upload, Image, Sparkles, Award, Shield, RefreshCw
} from 'lucide-react';
import { 
  PLAYER_FRAMES, 
  getPlayerFrameById, 
  isDeveloperAccount 
} from '../data/playerFramesData';
import { Frame3D } from './common/Artifact3D';
import { audioManager } from '../utils/audioManager';

export default function AvatarFrameSelectorModal({
  isOpen,
  onClose,
  currentAvatar,
  currentFrameId,
  userProfile,
  onSaveCustomization,
  onSaveProfile
}) {
  const initialAvatar = currentAvatar || userProfile?.avatar || '🍥';
  const initialFrameId = currentFrameId || userProfile?.frameId || 'frame_academy';
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar);
  const [selectedFrameId, setSelectedFrameId] = useState(initialFrameId);
  const [customImageError, setCustomImageError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const isDev = isDeveloperAccount(userProfile?.email);
  const activeFrame = getPlayerFrameById(selectedFrameId, userProfile);

  // Обработка загрузки файла с картинкой
  const handleFileUpload = (e) => {
    setCustomImageError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setCustomImageError('Пожалуйста, выберите файл изображения (PNG, JPG, WebP)!');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setCustomImageError('Файл слишком большой! Максимальный размер: 8 МБ.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Оптимизируем размер через canvas до 256x256 для идеальной скорости и сохранения
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Квадратный кроп по центру
        const minSide = Math.min(img.width, img.height);
        const startX = (img.width - minSide) / 2;
        const startY = (img.height - minSide) / 2;

        ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/webp', 0.88);

        setSelectedAvatar(dataUrl);
        audioManager.playSfx('seal');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    audioManager.playSfx('lock');
    const saveFn = onSaveCustomization || onSaveProfile;
    if (saveFn) {
      saveFn({
        avatar: selectedAvatar,
        frameId: selectedFrameId
      });
    }
    onClose();
  };

  // Рендеринг содержимого аватара (эмодзи или картинка)
  const renderAvatarContent = (av) => {
    if (!av) return <span className="text-2xl">🍥</span>;
    if (av.startsWith('data:') || av.startsWith('http://') || av.startsWith('https://')) {
      return (
        <img 
          src={av} 
          alt="Avatar" 
          className="w-full h-full object-cover rounded-xl"
        />
      );
    }
    return <span className="text-2xl sm:text-3xl">{av}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 select-none animate-fadeIn">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-950/98 p-4 sm:p-6 shadow-2xl text-zinc-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* ШАПКА */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide text-zinc-100 uppercase">
                  Кастомизация Профиля Шиноби
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Аватар & Рамка
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Выберите личную аватарку, загрузите своё фото или наденьте наградную боевую рамку за PvP победы.
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
        <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin">
          
          {/* БЛОК ЖИВОГО ПРЕДПРОСМОТРА */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              {/* Живой 3D-рендер рамки с аватаром */}
              <Frame3D
                frame={activeFrame}
                avatarContent={renderAvatarContent(selectedAvatar)}
                sizeClass="w-20 h-20 sm:w-22 sm:h-22"
                interactive={true}
                idleFloat={true}
                maxTilt={18}
              />

              <div>
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">
                  ТЕКУЩИЙ ОБЛИК В БОЮ:
                </span>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>{userProfile?.name || 'Шиноби Листа'}</span>
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                    style={{ borderColor: activeFrame.rarityColor, color: activeFrame.rarityColor, backgroundColor: `${activeFrame.rarityColor}15` }}
                  >
                    Рамка: {activeFrame.name}
                  </span>
                  {selectedAvatar.startsWith('data:') && (
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full">
                      Своя картинка
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-cyan-600/30 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Загрузить свою картинку (ПК)</span>
              </button>

              {selectedAvatar?.startsWith('data:') && (
                <button
                  type="button"
                  onClick={() => {
                    audioManager.playSfx('click');
                    setSelectedAvatar('🍥');
                  }}
                  className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer"
                  title="Сбросить загруженную картинку"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Сбросить</span>
                </button>
              )}
            </div>
          </div>

          {customImageError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300">
              {customImageError}
            </div>
          )}

          {/* 2. ВЫБОР РАМОК ЗА ДОСТИЖЕНИЯ (11 РАМОК) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-zinc-300 uppercase font-mono flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Наградные рамки за боевые достижения:</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">
                11 уровней престижа
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {PLAYER_FRAMES.map((frame) => {
                const isUnlocked = frame.checkUnlocked(userProfile);
                const isEquipped = selectedFrameId === frame.id;
                const isCreatorFrame = Boolean(frame.isCreatorExclusive);

                return (
                  <div
                    key={frame.id}
                    className={`p-3.5 rounded-2xl border transition relative flex items-center gap-3.5 ${
                      isEquipped
                        ? 'bg-gradient-to-r from-zinc-900 via-amber-950/30 to-zinc-900 border-amber-400 ring-1 ring-amber-400/50 shadow-lg'
                        : isUnlocked
                        ? 'bg-zinc-900/70 border-white/10 hover:border-white/25 hover:bg-zinc-900'
                        : 'bg-zinc-950/80 border-white/5 opacity-60'
                    }`}
                  >
                    {/* Превью 3D-рамки с текущим выбранным аватаром */}
                    <div className="shrink-0">
                      <Frame3D
                        frame={frame}
                        avatarContent={renderAvatarContent(selectedAvatar)}
                        sizeClass="w-12 h-12"
                        interactive={true}
                        idleFloat={isEquipped}
                        maxTilt={14}
                      />
                    </div>

                    {/* Описание рамки и кнопка */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-black text-white truncate">
                          {frame.name}
                        </h4>
                        {isCreatorFrame ? (
                          <span className="text-[8px] font-mono font-black uppercase px-1.5 py-0.2 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                            Творец
                          </span>
                        ) : (
                          <span 
                            className="text-[9px] font-bold px-1.5 py-0.2 rounded"
                            style={{ color: frame.rarityColor }}
                          >
                            {frame.rarity}
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1 font-mono">
                        {frame.requirementText}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className={`text-[9px] font-mono ${isUnlocked ? 'text-emerald-400 font-bold' : 'text-zinc-500'}`}>
                          {frame.progressText(userProfile)}
                        </span>

                        {isUnlocked ? (
                          isEquipped ? (
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                              <Check className="w-3 h-3 text-amber-400" /> Надето
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                audioManager.playSfx('click');
                                setSelectedFrameId(frame.id);
                              }}
                              className="text-[10px] font-bold text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-2.5 py-0.5 rounded-full border border-white/10 transition cursor-pointer"
                            >
                              Надеть
                            </button>
                          )
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-zinc-600" /> Закрыто
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ФУТЕР С КНОПКОЙ СОХРАНЕНИЯ */}
        <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-zinc-400 font-mono">
            Облик сохранится на сервере и будет виден соперникам в дуэлях
          </span>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-black text-xs transition shadow-lg shadow-amber-600/30 cursor-pointer active:scale-95"
          >
            Сохранить облик шиноби
          </button>
        </div>

      </div>
    </div>
  );
}
