import React, { useState, useEffect } from 'react';
import { X, Eye, Zap, Flame, Sparkles, Send, Volume2, Check } from 'lucide-react';
import { audioManager } from '../utils/audioManager';
import { DOJUTSU_OPTIONS, getDojutsuById } from '../data/dojutsuData';

/**
 * EyeActivationOverlay.jsx
 * Высокодетализированная кинематографичная анимация пробуждения Додзюцу (Глаз)
 * по центру экрана с реалистичным векторным прокрутом, аутентичным звуком и эффектами.
 * Поддерживает демонстрацию сопернику через сокеты и предпросмотр любого глаза из правил 0.3.2/0.3.3.
 */

export default function EyeActivationOverlay({
  isOpen,
  onClose,
  dojutsuId = 'mangekyo',
  opponentName = null, // Если это демонстрация от соперника
  onShowToOpponent = null, // Callback для отправки демонстрации сопернику
  autoDismissMs = 0 // 0 = только по клику, >0 = автозакрытие
}) {
  const [selectedPattern, setSelectedPattern] = useState('itachi'); // Для Мангёкё: 'itachi' | 'sasuke' | 'madara' | 'kamui'
  const [isSpinning, setIsSpinning] = useState(true);
  const [showDemonstrateNotice, setShowDemonstrateNotice] = useState(false);
  const [alwaysShowToOpponent, setAlwaysShowToOpponent] = useState(() => {
    return localStorage.getItem('naruto_always_show_eye_opponent') === 'true';
  });

  const dojutsu = getDojutsuById(dojutsuId) || DOJUTSU_OPTIONS[3]; // По умолчанию Шаринган
  const family = dojutsu.family || 'Sharingan';

  // Сохранение настройки показа сопернику
  const handleToggleAlwaysShow = () => {
    const next = !alwaysShowToOpponent;
    setAlwaysShowToOpponent(next);
    try {
      localStorage.setItem('naruto_always_show_eye_opponent', next ? 'true' : 'false');
    } catch (e) {}
  };

  // Звуковой эффект и анимация при открытии
  useEffect(() => {
    if (!isOpen) return;

    setIsSpinning(true);
    audioManager.playEyeSound(family);

    // Смена скорости вращения после начального рывка
    const spinTimer = setTimeout(() => {
      setIsSpinning(false);
    }, 2800);

    let dismissTimer = null;
    if (autoDismissMs > 0) {
      dismissTimer = setTimeout(() => {
        onClose?.();
      }, autoDismissMs);
    }

    return () => {
      clearTimeout(spinTimer);
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [isOpen, dojutsuId, selectedPattern, family, autoDismissMs, onClose]);

  if (!isOpen) return null;

  // Отправка демонстрации сопернику
  const handleDemonstrate = () => {
    if (onShowToOpponent) {
      onShowToOpponent({
        dojutsuId: dojutsu.id,
        dojutsuName: dojutsu.name,
        pattern: selectedPattern
      });
      setShowDemonstrateNotice(true);
      setTimeout(() => setShowDemonstrateNotice(false), 2500);
    }
  };

  // Цветовая палитра и японские кандзи для семейства глаз
  const getTheme = () => {
    switch (family) {
      case 'Rinnegan':
        return {
          kanji: '輪廻眼',
          title: 'РИННЕГАН',
          color: '#a855f7',
          vignette: 'radial-gradient(circle at center, rgba(88,28,135,0.7) 0%, rgba(30,10,50,0.92) 50%, rgba(9,9,11,0.98) 100%)',
          irisBg: 'radial-gradient(circle, #c084fc 0%, #7e22ce 55%, #3b0764 100%)',
          ringColor: '#d8b4fe',
          glowClass: 'shadow-[0_0_80px_rgba(168,85,247,0.8)]'
        };
      case 'Byakugan':
        return {
          kanji: '白眼',
          title: 'БЬЯКУГАН',
          color: '#e2e8f0',
          vignette: 'radial-gradient(circle at center, rgba(148,163,184,0.45) 0%, rgba(30,41,59,0.9) 55%, rgba(9,9,11,0.98) 100%)',
          irisBg: 'radial-gradient(circle, #ffffff 0%, #e2e8f0 45%, #cbd5e1 80%, #94a3b8 100%)',
          ringColor: '#93c5fd',
          glowClass: 'shadow-[0_0_80px_rgba(255,255,255,0.85)]'
        };
      case 'Kingan':
        return {
          kanji: '金眼',
          title: 'КИНГАН',
          color: '#facc15',
          vignette: 'radial-gradient(circle at center, rgba(202,138,4,0.6) 0%, rgba(66,32,6,0.9) 55%, rgba(9,9,11,0.98) 100%)',
          irisBg: 'radial-gradient(circle, #fef08a 0%, #eab308 50%, #854d0e 100%)',
          ringColor: '#fef9c3',
          glowClass: 'shadow-[0_0_80px_rgba(250,204,21,0.8)]'
        };
      case 'Aoigan':
        return {
          kanji: '青眼',
          title: 'АОЙГАН',
          color: '#06b6d4',
          vignette: 'radial-gradient(circle at center, rgba(6,182,212,0.6) 0%, rgba(4,47,46,0.9) 55%, rgba(9,9,11,0.98) 100%)',
          irisBg: 'radial-gradient(circle, #a5f3fc 0%, #06b6d4 50%, #164e63 100%)',
          ringColor: '#67e8f9',
          glowClass: 'shadow-[0_0_80px_rgba(6,182,212,0.8)]'
        };
      case 'Ikadzutigan':
        return {
          kanji: '雷眼',
          title: 'ИКАДЗУТИГАН',
          color: '#38bdf8',
          vignette: 'radial-gradient(circle at center, rgba(56,189,248,0.65) 0%, rgba(8,47,73,0.9) 55%, rgba(9,9,11,0.98) 100%)',
          irisBg: 'radial-gradient(circle, #bae6fd 0%, #0284c7 50%, #032b43 100%)',
          ringColor: '#7dd3fc',
          glowClass: 'shadow-[0_0_80px_rgba(56,189,248,0.85)]'
        };
      case 'Sharingan':
      default:
        return {
          kanji: dojutsuId === 'mangekyo' ? '万華鏡写輪眼' : '写輪眼',
          title: dojutsuId === 'mangekyo' ? 'ВЕЧНЫЙ МАНГЁКЁ' : 'ШАРИНГАН',
          color: '#ef4444',
          vignette: 'radial-gradient(circle at center, rgba(185,28,28,0.65) 0%, rgba(69,10,10,0.92) 55%, rgba(9,9,11,0.98) 100%)',
          irisBg: 'radial-gradient(circle, #ef4444 0%, #dc2626 45%, #991b1b 75%, #450a0a 100%)',
          ringColor: '#18181b',
          glowClass: 'shadow-[0_0_85px_rgba(239,68,68,0.85)]'
        };
    }
  };

  const theme = getTheme();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none animate-in fade-in duration-300"
      style={{ background: theme.vignette }}
    >
      {/* Декоративные частицы чакры на заднем плане */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: theme.color + '20' }} />
      </div>

      {/* Верхняя панель: статус и кнопка закрытия */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-xs font-mono font-bold text-zinc-200 backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: theme.color }} />
            <span>{opponentName ? `👁️ ВЗГЛЯД ОППОНЕНТА (${opponentName})` : '👁️ ПРОБУЖДЕНИЕ ДОДЗЮЦУ'}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2.5 rounded-full bg-black/70 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/20 transition cursor-pointer backdrop-blur-md shadow-lg"
          title="Закрыть демонстрацию"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* ЦЕНТРАЛЬНЫЙ БЛОК: ГЛАЗ И АНИМАЦИЯ */}
      <div className="relative flex flex-col items-center max-w-xl w-full z-10 text-center">
        
        {/* Кандзи на фоне */}
        <div 
          className="text-7xl sm:text-9xl font-black font-serif opacity-15 tracking-widest absolute -top-16 sm:-top-24 pointer-events-none transition-all duration-700"
          style={{ color: theme.color }}
        >
          {theme.kanji}
        </div>

        {/* Глазное полотно (Векторный глаз) */}
        <div className={`relative my-4 sm:my-6 rounded-full p-2 border-2 border-white/20 bg-black/70 backdrop-blur-md ${theme.glowClass} transition-all duration-700`}>
          
          {/* Световые кольца вокруг глаза */}
          <div 
            className="absolute -inset-3 rounded-full opacity-60 animate-spin-slow pointer-events-none"
            style={{ 
              border: `2px dashed ${theme.color}`,
              animationDuration: isSpinning ? '4s' : '18s' 
            }}
          />

          {/* SVG Глаз Шиноби */}
          <div className="w-48 h-48 sm:w-64 sm:h-64 relative flex items-center justify-center overflow-hidden rounded-full shadow-inner">
            <svg 
              viewBox="0 0 200 200" 
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Радиальный градиент радужки */}
                <radialGradient id="eye-iris-grad" cx="50%" cy="50%" r="50%">
                  {family === 'Sharingan' && (
                    <>
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#dc2626" />
                      <stop offset="85%" stopColor="#7f1d1d" />
                      <stop offset="100%" stopColor="#2b0505" />
                    </>
                  )}
                  {family === 'Rinnegan' && (
                    <>
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="50%" stopColor="#9333ea" />
                      <stop offset="85%" stopColor="#581c87" />
                      <stop offset="100%" stopColor="#1e0538" />
                    </>
                  )}
                  {family === 'Byakugan' && (
                    <>
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="55%" stopColor="#e2e8f0" />
                      <stop offset="85%" stopColor="#cbd5e1" />
                      <stop offset="100%" stopColor="#64748b" />
                    </>
                  )}
                  {family === 'Kingan' && (
                    <>
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="50%" stopColor="#eab308" />
                      <stop offset="85%" stopColor="#854d0e" />
                      <stop offset="100%" stopColor="#2e1a03" />
                    </>
                  )}
                  {family === 'Aoigan' && (
                    <>
                      <stop offset="0%" stopColor="#a5f3fc" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="85%" stopColor="#0e7490" />
                      <stop offset="100%" stopColor="#042838" />
                    </>
                  )}
                  {family === 'Ikadzutigan' && (
                    <>
                      <stop offset="0%" stopColor="#e0f2fe" />
                      <stop offset="50%" stopColor="#0284c7" />
                      <stop offset="85%" stopColor="#0369a1" />
                      <stop offset="100%" stopColor="#082f49" />
                    </>
                  )}
                </radialGradient>

                {/* Одиночное томоэ Шарингана */}
                <g id="single-tomoe">
                  <circle cx="0" cy="0" r="8" fill="#09090b" stroke="#18181b" strokeWidth="0.5" />
                  <path d="M-6 0 C-6 -10 4 -12 7 -22 C6 -14 3 -8 0 -5 Z" fill="#09090b" />
                  <circle cx="0" cy="0" r="2.5" fill="#27272a" />
                </g>

                {/* Капля Аойгана */}
                <g id="aoigan-drop">
                  <path d="M0 -18 C8 -10 10 0 0 10 C-10 0 -8 -10 0 -18 Z" fill="#083344" stroke="#a5f3fc" strokeWidth="1" />
                  <circle cx="0" cy="2" r="2.5" fill="#67e8f9" />
                </g>

                {/* Разряд Икадзутигана */}
                <g id="lightning-bolt">
                  <path d="M0 -22 L-5 -6 L2 -6 L-4 18 L6 0 L0 0 Z" fill="#082f49" stroke="#7dd3fc" strokeWidth="1.2" />
                  <circle cx="0" cy="0" r="2" fill="#ffffff" />
                </g>
              </defs>

              {/* Белок глаза / основа */}
              <circle cx="100" cy="100" r="96" fill="#09090b" />
              
              {/* Радужка глаза */}
              <circle cx="100" cy="100" r="90" fill="url(#eye-iris-grad)" stroke="#18181b" strokeWidth="3" />

              {/* ======================================================== */}
              {/* СПЕЦИФИЧЕСКИЕ СЛОИ ДЛЯ КАЖДОГО ГЛАЗА И ЕГО СТУПЕНИ       */}
              {/* ======================================================== */}

              {/* 1. БЬЯКУГАН (Круговой обзор 360°, вены чакры, Багуа) */}
              {family === 'Byakugan' && (
                <g>
                  {/* Чакровые вены по контуру */}
                  <g stroke="#93c5fd" strokeWidth="1.2" opacity="0.6" strokeLinecap="round">
                    <path d="M10 100 Q40 85 70 95" />
                    <path d="M190 100 Q160 85 130 95" />
                    <path d="M100 10 Q85 40 95 70" />
                    <path d="M100 190 Q85 160 95 130" />
                    <path d="M25 35 Q55 55 80 80" />
                    <path d="M175 35 Q145 55 120 80" />
                    <path d="M25 165 Q55 145 80 120" />
                    <path d="M175 165 Q145 145 120 120" />
                  </g>

                  {/* Оптические кольца фокусировки тенкецу */}
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
                  <circle cx="100" cy="100" r="50" fill="none" stroke="#cbd5e1" strokeWidth="2" opacity="0.9" />
                  
                  {/* Стадия 3 и Пробужденный: священная сетка поля Багуа 360° */}
                  {(dojutsuId === 'byakugan_3' || dojutsuId === 'byakugan_awakened') && (
                    <g 
                      stroke="#60a5fa" 
                      strokeWidth="1" 
                      opacity="0.85" 
                      className={isSpinning ? 'animate-spin' : ''}
                      style={{ transformOrigin: '100px 100px', animationDuration: '10s' }}
                    >
                      <line x1="100" y1="20" x2="100" y2="180" />
                      <line x1="20" y1="100" x2="180" y2="100" />
                      <line x1="42" y1="42" x2="158" y2="158" />
                      <line x1="158" y1="42" x2="42" y2="158" />
                      <circle cx="100" cy="100" r="30" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
                    </g>
                  )}

                  {/* Пробуждённый («Всеведущий взор»): лучи Небесного Бьякугана */}
                  {dojutsuId === 'byakugan_awakened' && (
                    <g className="animate-pulse">
                      <polygon points="100,25 110,85 175,100 110,115 100,175 90,115 25,100 90,85" fill="#ffffff" opacity="0.45" />
                    </g>
                  )}

                  {/* Мягкий центр зрачка */}
                  <circle cx="100" cy="100" r="24" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" opacity="0.9" />
                  <circle cx="100" cy="100" r="10" fill="#e2e8f0" />
                </g>
              )}

              {/* 2. РИННЕГАН (Концентрические фиолетовые кольца Шести Путей & Ринне-Шаринган) */}
              {family === 'Rinnegan' && (
                <g>
                  {/* 6 концентрических колец Шести Путей */}
                  <circle cx="100" cy="100" r="82" fill="none" stroke="#2e1065" strokeWidth="2.5" />
                  <circle cx="100" cy="100" r="68" fill="none" stroke="#3b0764" strokeWidth="2.5" />
                  <circle cx="100" cy="100" r="54" fill="none" stroke="#2e1065" strokeWidth="2.5" />
                  <circle cx="100" cy="100" r="40" fill="none" stroke="#3b0764" strokeWidth="2.5" />
                  <circle cx="100" cy="100" r="26" fill="none" stroke="#2e1065" strokeWidth="2.5" />

                  {/* Пробужденная форма: Ринне-Шаринган с 9 томоэ */}
                  {dojutsuId === 'rinnegan_awakened' && (
                    <g 
                      className={isSpinning ? 'animate-spin' : ''}
                      style={{ transformOrigin: '100px 100px', animationDuration: '6s' }}
                    >
                      {/* Внутренние 3 томоэ на радиусе 40 */}
                      <g transform="translate(100, 100) rotate(0)"><g transform="translate(0, -40) scale(0.65)"><use href="#single-tomoe" /></g></g>
                      <g transform="translate(100, 100) rotate(120)"><g transform="translate(0, -40) scale(0.65)"><use href="#single-tomoe" /></g></g>
                      <g transform="translate(100, 100) rotate(240)"><g transform="translate(0, -40) scale(0.65)"><use href="#single-tomoe" /></g></g>
                      {/* Внешние 6 томоэ на радиусе 68 */}
                      <g transform="translate(100, 100) rotate(30)"><g transform="translate(0, -68) scale(0.65)"><use href="#single-tomoe" /></g></g>
                      <g transform="translate(100, 100) rotate(90)"><g transform="translate(0, -68) scale(0.65)"><use href="#single-tomoe" /></g></g>
                      <g transform="translate(100, 100) rotate(150)"><g transform="translate(0, -68) scale(0.65)"><use href="#single-tomoe" /></g></g>
                      <g transform="translate(100, 100) rotate(210)"><g transform="translate(0, -68) scale(0.65)"><use href="#single-tomoe" /></g></g>
                      <g transform="translate(100, 100) rotate(270)"><g transform="translate(0, -68) scale(0.65)"><use href="#single-tomoe" /></g></g>
                      <g transform="translate(100, 100) rotate(330)"><g transform="translate(0, -68) scale(0.65)"><use href="#single-tomoe" /></g></g>
                    </g>
                  )}

                  {/* Центральный темный зрачок */}
                  <circle cx="100" cy="100" r="12" fill="#09090b" stroke="#581c87" strokeWidth="1.5" />
                </g>
              )}

              {/* 3. КИНГАН (Золотые кольца анализа и разломов) */}
              {family === 'Kingan' && (
                <g>
                  {/* Тонкие линии анализа уязвимостей */}
                  <line x1="20" y1="100" x2="180" y2="100" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
                  <line x1="100" y1="20" x2="100" y2="180" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />

                  {/* Вращающиеся золотые кольца */}
                  <g 
                    className={isSpinning ? 'animate-spin' : ''}
                    style={{ transformOrigin: '100px 100px', animationDuration: '8s' }}
                  >
                    {/* 1 кольцо */}
                    <circle cx="100" cy="100" r="38" fill="none" stroke="#713f12" strokeWidth="4" />
                    <circle cx="100" cy="100" r="38" fill="none" stroke="#fef08a" strokeWidth="2" strokeDasharray="20 10" />

                    {/* 2 кольца */}
                    {(dojutsuId === 'kingan_2' || dojutsuId === 'kingan_3' || dojutsuId === 'kingan_awakened') && (
                      <>
                        <circle cx="100" cy="100" r="58" fill="none" stroke="#713f12" strokeWidth="4" />
                        <circle cx="100" cy="100" r="58" fill="none" stroke="#fde047" strokeWidth="2" strokeDasharray="14 10" />
                      </>
                    )}

                    {/* 3 кольца */}
                    {(dojutsuId === 'kingan_3' || dojutsuId === 'kingan_awakened') && (
                      <>
                        <circle cx="100" cy="100" r="76" fill="none" stroke="#713f12" strokeWidth="4" />
                        <circle cx="100" cy="100" r="76" fill="none" stroke="#facc15" strokeWidth="2" strokeDasharray="30 15" />
                      </>
                    )}

                    {/* Пробуждённая «Печать разрушения» */}
                    {dojutsuId === 'kingan_awakened' && (
                      <g stroke="#ffffff" strokeWidth="2">
                        <polygon points="100,20 120,80 180,100 120,120 100,180 80,120 20,100 80,80" fill="none" opacity="0.8" />
                      </g>
                    )}
                  </g>

                  {/* Центральный золотой кристаллический зрачок */}
                  <circle cx="100" cy="100" r="14" fill="#422006" stroke="#fde047" strokeWidth="2.5" />
                  <circle cx="100" cy="100" r="5" fill="#ffffff" />
                </g>
              )}

              {/* 4. АОЙГАН (Лазурные капли глубинного ускорения Синкай) */}
              {family === 'Aoigan' && (
                <g>
                  {/* Водные вихревые круги */}
                  <circle cx="100" cy="100" r="72" fill="none" stroke="#164e63" strokeWidth="2" opacity="0.6" />
                  <circle cx="100" cy="100" r="52" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeDasharray="8 6" />

                  {/* Вращающиеся капли */}
                  <g 
                    className={isSpinning ? 'animate-spin' : ''}
                    style={{ transformOrigin: '100px 100px', animationDuration: isSpinning ? '2.5s' : '7s' }}
                  >
                    {/* 1 капля */}
                    <g transform="translate(100, 100) rotate(0)">
                      <g transform="translate(0, -50)"><use href="#aoigan-drop" /></g>
                    </g>

                    {/* 2 капли */}
                    {(dojutsuId === 'aoigan_2' || dojutsuId === 'aoigan_3' || dojutsuId === 'aoigan_awakened') && (
                      <g transform="translate(100, 100) rotate(180)">
                        <g transform="translate(0, -50)"><use href="#aoigan-drop" /></g>
                      </g>
                    )}

                    {/* 3 капли */}
                    {(dojutsuId === 'aoigan_3' || dojutsuId === 'aoigan_awakened') && (
                      <>
                        <g transform="translate(100, 100) rotate(120)">
                          <g transform="translate(0, -50)"><use href="#aoigan-drop" /></g>
                        </g>
                        <g transform="translate(100, 100) rotate(240)">
                          <g transform="translate(0, -50)"><use href="#aoigan-drop" /></g>
                        </g>
                      </>
                    )}

                    {/* Пробуждённый («Гёрин но Ёрой» / «Глубинная Бездна») */}
                    {dojutsuId === 'aoigan_awakened' && (
                      <circle cx="100" cy="100" r="66" fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeDasharray="25 10" />
                    )}
                  </g>

                  {/* Центральный зрачок-водоворот */}
                  <circle cx="100" cy="100" r="14" fill="#042f2e" stroke="#22d3ee" strokeWidth="2.5" />
                  <circle cx="100" cy="100" r="5" fill="#a5f3fc" />
                </g>
              )}

              {/* 5. ИКАДЗУТИГАН (Громовые разряды Тэнрай) */}
              {family === 'Ikadzutigan' && (
                <g>
                  {/* Статическое поле */}
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#0369a1" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.7" />

                  {/* Вращающиеся электрические разряды */}
                  <g 
                    className={isSpinning ? 'animate-spin' : ''}
                    style={{ transformOrigin: '100px 100px', animationDuration: isSpinning ? '2s' : '5s' }}
                  >
                    {/* 1 разряд */}
                    <g transform="translate(100, 100) rotate(0)">
                      <g transform="translate(0, -50)"><use href="#lightning-bolt" /></g>
                    </g>

                    {/* 2 разряда */}
                    {(dojutsuId === 'ikadzutigan_2' || dojutsuId === 'ikadzutigan_3' || dojutsuId === 'ikadzutigan_awakened') && (
                      <g transform="translate(100, 100) rotate(180)">
                        <g transform="translate(0, -50)"><use href="#lightning-bolt" /></g>
                      </g>
                    )}

                    {/* 3 разряда */}
                    {(dojutsuId === 'ikadzutigan_3' || dojutsuId === 'ikadzutigan_awakened') && (
                      <>
                        <g transform="translate(100, 100) rotate(120)">
                          <g transform="translate(0, -50)"><use href="#lightning-bolt" /></g>
                        </g>
                        <g transform="translate(100, 100) rotate(240)">
                          <g transform="translate(0, -50)"><use href="#lightning-bolt" /></g>
                        </g>
                      </>
                    )}

                    {/* Пробуждённый («Божественная Молния» / Чёрная Молния) */}
                    {dojutsuId === 'ikadzutigan_awakened' && (
                      <g stroke="#ffffff" strokeWidth="1.5">
                        <path d="M60 60 L100 10 L140 60 L190 100 L140 140 L100 190 L60 140 L10 100 Z" fill="none" opacity="0.6" />
                      </g>
                    )}
                  </g>

                  {/* Зрачок с ядром высокого напряжения */}
                  <circle cx="100" cy="100" r="14" fill="#082f49" stroke="#7dd3fc" strokeWidth="2.5" />
                  <circle cx="100" cy="100" r="5" fill="#ffffff" />
                </g>
              )}

              {/* 6. ШАРИНГАН (1, 2, 3 томоэ и формы ВМШ: Итачи, Саске, Мадара, Камуи) */}
              {family === 'Sharingan' && (
                <g>
                  {/* Тонкое черное кольцо вращения томоэ */}
                  <circle cx="100" cy="100" r="54" fill="none" stroke="#09090b" strokeWidth="2.5" opacity="0.85" />

                  {/* ВРАЩАЮЩАЯСЯ ГРУППА УЗОРОВ ШАРИНГАНА */}
                  <g 
                    className={isSpinning ? 'animate-spin' : ''}
                    style={{ 
                      transformOrigin: '100px 100px', 
                      animationDuration: isSpinning ? '1.8s' : '6s' 
                    }}
                  >
                    {/* 1 томоэ */}
                    {dojutsuId === 'sharingan_1' && (
                      <g transform="translate(100, 100) rotate(0)">
                        <g transform="translate(0, -54)"><use href="#single-tomoe" /></g>
                      </g>
                    )}

                    {/* 2 томоэ */}
                    {dojutsuId === 'sharingan_2' && (
                      <>
                        <g transform="translate(100, 100) rotate(0)">
                          <g transform="translate(0, -54)"><use href="#single-tomoe" /></g>
                        </g>
                        <g transform="translate(100, 100) rotate(180)">
                          <g transform="translate(0, -54)"><use href="#single-tomoe" /></g>
                        </g>
                      </>
                    )}

                    {/* 3 томоэ */}
                    {dojutsuId === 'sharingan_3' && (
                      <>
                        <g transform="translate(100, 100) rotate(0)">
                          <g transform="translate(0, -54)"><use href="#single-tomoe" /></g>
                        </g>
                        <g transform="translate(100, 100) rotate(120)">
                          <g transform="translate(0, -54)"><use href="#single-tomoe" /></g>
                        </g>
                        <g transform="translate(100, 100) rotate(240)">
                          <g transform="translate(0, -54)"><use href="#single-tomoe" /></g>
                        </g>
                      </>
                    )}

                    {/* ВЕЧНЫЙ МАНГЁКЁ ШАРИНГАН (ВМШ) */}
                    {dojutsuId === 'mangekyo' && (
                      <g>
                        {/* Форма 1: ИТАЧИ (Трехлопастной сюрикен с закрученными лезвиями) */}
                        {selectedPattern === 'itachi' && (
                          <g fill="#09090b" stroke="#18181b" strokeWidth="1">
                            <path d="M100 100 C100 60 70 40 50 48 C75 75 88 88 100 100 Z" />
                            <path d="M100 100 C135 75 160 85 160 110 C125 110 110 105 100 100 Z" />
                            <path d="M100 100 C95 140 70 160 50 150 C70 125 85 115 100 100 Z" />
                          </g>
                        )}

                        {/* Форма 2: САСКЕ (Шестиконечная прямая звезда / цветок Вечного Мангёкё) */}
                        {selectedPattern === 'sasuke' && (
                          <g fill="#09090b" stroke="#09090b" strokeWidth="1.5">
                            {/* Три пересекающихся эллипса под углом 60 градусов */}
                            <ellipse cx="100" cy="100" rx="14" ry="68" transform="rotate(0 100 100)" />
                            <ellipse cx="100" cy="100" rx="14" ry="68" transform="rotate(60 100 100)" />
                            <ellipse cx="100" cy="100" rx="14" ry="68" transform="rotate(120 100 100)" />
                            {/* Внутренние алые лепестки */}
                            <circle cx="100" cy="100" r="26" fill="#ef4444" />
                          </g>
                        )}

                        {/* Форма 3: МАДАРА (Соединенные массивные дуги томоэ с внешним кольцом) */}
                        {selectedPattern === 'madara' && (
                          <g fill="#09090b">
                            {/* Соединительное кольцо лезвий Мадары */}
                            <circle cx="100" cy="100" r="62" fill="none" stroke="#09090b" strokeWidth="8" />
                            {/* Три мощных соединительных лезвия к зрачку */}
                            <path d="M100 100 L92 38 L108 38 Z" />
                            <path d="M100 100 L44 130 L58 140 Z" />
                            <path d="M100 100 L156 130 L142 140 Z" />
                          </g>
                        )}

                        {/* Форма 4: КАМУИ (Обито / Какаши: Треугольная закрученная воронка) */}
                        {selectedPattern === 'kamui' && (
                          <g fill="#09090b" stroke="#18181b" strokeWidth="1">
                            <path d="M100 100 C90 60 70 30 50 20 C70 50 90 80 100 100 Z" />
                            <path d="M100 100 C130 90 170 90 185 85 C150 110 120 110 100 100 Z" />
                            <path d="M100 100 C100 135 90 175 75 190 C85 155 90 125 100 100 Z" />
                          </g>
                        )}
                      </g>
                    )}
                  </g>

                  {/* Центральный черный зрачок */}
                  <circle cx="100" cy="100" r="16" fill="#09090b" stroke="#18181b" strokeWidth="2" />
                  <circle cx="100" cy="100" r="4" fill="#27272a" />
                </g>
              )}

              {/* Блик света в глазу (придает глубину и жизнь) */}
              <circle cx="75" cy="75" r="7" fill="#ffffff" opacity="0.45" />
              <circle cx="71" cy="71" r="2.5" fill="#ffffff" opacity="0.8" />
            </svg>
          </div>
        </div>

        {/* НАЗВАНИЕ И ХАРАКТЕРИСТИКИ АКТИВИРОВАННОГО ОКА */}
        <div className="bg-black/80 border border-white/20 rounded-2xl p-4 sm:p-5 backdrop-blur-xl w-full shadow-2xl">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
            <div className="text-left">
              <span className="text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-400 block">
                {theme.title}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{dojutsu.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20 font-mono text-zinc-300">
                  {dojutsu.badge}
                </span>
              </h2>
            </div>

            {/* Звуковой индикатор */}
            <button
              type="button"
              onClick={() => audioManager.playEyeSound(family)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition cursor-pointer border border-white/10"
              title="Повторить звук активации"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Переключатель форм для Мангёкё Шарингана */}
          {dojutsuId === 'mangekyo' && (
            <div className="mb-3 p-2 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-between gap-1 flex-wrap">
              <span className="text-[11px] font-bold text-red-300">Узор ВМШ:</span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'itachi', label: 'Итачи' },
                  { id: 'sasuke', label: 'Саске' },
                  { id: 'madara', label: 'Мадара' },
                  { id: 'kamui', label: 'Камуи' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPattern(p.id);
                      setIsSpinning(true);
                      audioManager.playEyeSound(family);
                      setTimeout(() => setIsSpinning(false), 2000);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      selectedPattern === p.id 
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/50' 
                        : 'bg-black/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Боевые характеристики глаза */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs mb-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-zinc-400 block font-mono">ПРЕДВИДЕНИЕ</span>
              <span className="text-sm font-black text-cyan-300">+{dojutsu.predvidenie || 0}%</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-zinc-400 block font-mono">ТОЧНОСТЬ</span>
              <span className="text-sm font-black text-emerald-300">+{dojutsu.accuracy || 0}%</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-zinc-400 block font-mono">УСИЛЕНИЕ</span>
              <span className="text-sm font-black text-amber-300">+{dojutsu.techniqueAmp || 0}%</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-zinc-400 block font-mono">РАСХОД</span>
              <span className="text-sm font-black text-rose-300">{(dojutsu.upkeepNumber || 0).toLocaleString()} ед./ход</span>
            </div>
          </div>

          <p className="text-xs text-zinc-300 text-left line-clamp-2 leading-relaxed">
            {dojutsu.desc}
          </p>

          {/* Панель взаимодействия: Демонстрация сопернику */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
            
            {/* Тумблер: Всегда показывать сопернику */}
            <button
              type="button"
              onClick={handleToggleAlwaysShow}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition cursor-pointer ${
                alwaysShowToOpponent 
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-sm' 
                  : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                alwaysShowToOpponent ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-zinc-500'
              }`}>
                {alwaysShowToOpponent && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
              <span>Показывать сопернику в бою: {alwaysShowToOpponent ? 'ВКЛ' : 'ВЫКЛ'}</span>
            </button>

            {/* Кнопка отправки демонстрации сопернику прямо сейчас */}
            {onShowToOpponent && (
              <button
                type="button"
                onClick={handleDemonstrate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs transition shadow-lg shadow-red-600/30 cursor-pointer active:scale-95"
              >
                <Eye className="w-4 h-4" />
                <span>Продемонстрировать сопернику</span>
              </button>
            )}

            {showDemonstrateNotice && (
              <div className="w-full text-center text-xs font-bold text-amber-300 animate-bounce mt-1">
                ⚡ Пробуждение ока отправлено на экран соперника!
              </div>
            )}
          </div>
        </div>

        {/* Кнопка быстрого закрытия снизу */}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white border border-white/20 text-xs font-bold transition cursor-pointer backdrop-blur-md"
        >
          Закрыть просмотр (Esc)
        </button>

      </div>
    </div>
  );
}
