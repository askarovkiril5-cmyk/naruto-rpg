/**
 * audioManager.js
 * Комплексный звуковой движок боевой арены шиноби:
 * - Фоновый японский лоу-фай и эмбиент для лобби (сякухати, кото, колокольчики)
 * - Напряженная боевая тема с барабанами тайко для сражения
 * - Звуковые эффекты (SFX): складывание печатей, шаринган, гонг, клики
 * - Работает через Web Audio API: 100% автономно, без внешних лагов, кристально чистое звучание!
 */

// Японская пентатоническая гамма Инсэн (Insen Scale) в тональности Ре (D)
const INSEN_SCALE = [146.83, 155.56, 196.00, 220.00, 261.63, 293.66, 311.13, 392.00, 440.00, 523.25];

// Функция надежного разрешения путей к аудио (поддерживает Electron file://, Web, localhost и продакшн)
export function resolveAudioUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  const cleanPath = url.replace(/^\/+/, '');
  if (typeof window !== 'undefined' && window.location) {
    if (window.location.protocol === 'file:') {
      try {
        const baseHref = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
        return new URL(cleanPath, baseHref).href;
      } catch (e) {
        return './' + cleanPath;
      }
    } else {
      try {
        return new URL('/' + cleanPath, window.location.origin).href;
      } catch (e) {
        return '/' + cleanPath;
      }
    }
  }
  return '/' + cleanPath;
}

export const AUDIO_TRACKS = [
  {
    id: 'kaiju_abyss',
    type: 'battle',
    name: '👾 Кайдзю №8: Сезон 1 — Abyss (YUNGBLUD)',
    desc: 'Легендарный Опенинг 1 сезона Кайдзю №8 с мощным оригинальным вокалом!',
    icon: '👾',
    url: 'audio/kaiju_abyss.mp3',
    hasVocals: true
  },
  {
    id: 'kaiju_s2_opening',
    type: 'battle',
    name: '⚡ Кайдзю №8: Сезон 2 — You Can\'t Run From Yourself (AURORA)',
    desc: 'Официальный Опенинг 2 сезона Кайдзю №8 от AURORA!',
    icon: '⚡',
    url: 'audio/kaiju_s2_opening.mp3',
    hasVocals: true
  },
  {
    id: 'kaiju_s2_russian',
    type: 'battle',
    name: '🎙️ Кайдзю №8: Сезон 2 — Опенинг (Русский кавер)',
    desc: 'Превосходная русская кавер-версия опенинга 2 сезона Кайдзю №8 (MarieBibika)!',
    icon: '🇷🇺',
    url: 'audio/kaiju_s2_russian.mp3',
    hasVocals: true
  },
  {
    id: 'mha_the_day',
    type: 'battle',
    name: '💥 Моя Геройская Академия — THE DAY (Porno Graffitti)',
    desc: 'Легендарный Опенинг 1 Моей Геройской Академии с оригинальным вокалом!',
    icon: '⚡',
    url: 'audio/mha_the_day.mp3',
    hasVocals: true
  },
  {
    id: 'mha_you_say_run',
    type: 'battle',
    name: '🔥 Моя Геройская Академия — You Say Run (OST)',
    desc: 'Главный эпичный боевой саундтрек всех битв Академии!',
    icon: '💥',
    url: 'audio/mha_you_say_run.mp3',
    hasVocals: false
  },
  {
    id: 'bc_black_rover',
    type: 'battle',
    name: '🍀 Black Clover — Black Rover (Vickeblanka)',
    desc: 'Опенинг 3 Чёрного Клевера с вокалом! Взрывной рок-драйв',
    icon: '🍀',
    url: 'audio/black_rover.mp3',
    hasVocals: true
  },
  {
    id: 'bc_black_catcher',
    type: 'battle',
    name: '🗡️ Black Clover — Black Catcher (Vickeblanka)',
    desc: 'Опенинг 10 Чёрного Клевера с вокалом! Легендарный эпик',
    icon: '🗡️',
    url: 'audio/black_catcher.mp3',
    hasVocals: true
  },
  {
    id: 'naruto_diver',
    type: 'battle',
    name: '🍥 Naruto Shippuden — Diver (NICO)',
    desc: 'Опенинг 8 Наруто с вокалом (Diver)',
    icon: '🌊',
    url: 'audio/naruto_shippuden_diver.mp3',
    hasVocals: true
  }
];

class AudioManager {
  constructor() {
    this.ctx = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.masterGain = null;
    this.htmlAudio = null;

    // Состояние
    this.isPlaying = false;
    this.currentMode = 'battle';
    this.currentTrackId = 'mha_the_day'; // По умолчанию Моя Геройская Академия!
    this.playbackMode = 'repeat-all'; // 'repeat-one' | 'repeat-all' | 'shuffle'
    this.volume = 0.50;
    this.sfxVolume = 0.55;
    this.isMuted = false;
    this.sfxEnabled = true;
    this.currentTime = 0;
    this.duration = 0;

    // Таймеры процедурного генератора
    this.loopTimer = null;
    this.activeNodes = [];

    // Слушатели изменений для React-компонентов
    this.listeners = new Set();

    // Загрузка сохраненных настроек
    try {
      const savedVol = localStorage.getItem('naruto_music_volume');
      if (savedVol !== null) this.volume = parseFloat(savedVol);

      const savedSfxVol = localStorage.getItem('naruto_sfx_volume');
      if (savedSfxVol !== null) this.sfxVolume = parseFloat(savedSfxVol);

      const savedMute = localStorage.getItem('naruto_music_muted');
      if (savedMute !== null) this.isMuted = savedMute === 'true';

      const savedSfx = localStorage.getItem('naruto_sfx_enabled');
      if (savedSfx !== null) this.sfxEnabled = savedSfx !== 'false';

      const savedTrack = localStorage.getItem('naruto_current_track');
      if (savedTrack && AUDIO_TRACKS.some(t => t.id === savedTrack)) {
        this.currentTrackId = savedTrack;
      }

      const savedMode = localStorage.getItem('naruto_playback_mode');
      if (savedMode && ['repeat-one', 'repeat-all', 'shuffle'].includes(savedMode)) {
        this.playbackMode = savedMode;
      }
    } catch (e) {}
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb({
      isPlaying: this.isPlaying,
      currentMode: this.currentMode,
      currentTrackId: this.currentTrackId,
      playbackMode: this.playbackMode,
      volume: this.volume,
      sfxVolume: this.sfxVolume,
      isMuted: this.isMuted,
      sfxEnabled: this.sfxEnabled,
      currentTime: this.currentTime,
      duration: this.duration
    }));
  }

  initAudioContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      this.ctx = new AudioContextClass();

      // Мастер-шина
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);

      // Шина музыки
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.isMuted ? 0 : this.volume;
      this.musicGain.connect(this.masterGain);

      // Шина звуковых эффектов
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxEnabled ? this.sfxVolume : 0;
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  // Включение / выключение воспроизведения
  togglePlay() {
    if (this.isPlaying && !this.isMuted) {
      this.stop();
    } else {
      if (this.isMuted) this.setMuted(false);
      if (this.volume <= 0.05) this.setVolume(0.5);
      this.play(this.currentMode);
    }
  }

  // Запуск музыки
  play(mode = 'lobby', trackId = null) {
    this.initAudioContext();

    // Всегда снимаем заглушение и гарантируем слышимую громкость (65%)
    this.isMuted = false;
    try { localStorage.setItem('naruto_music_muted', 'false'); } catch (e) {}
    if (typeof this.volume !== 'number' || isNaN(this.volume) || this.volume <= 0.05) {
      this.volume = 0.65;
      try { localStorage.setItem('naruto_music_volume', '0.65'); } catch (e) {}
    }

    this.currentMode = mode;
    if (trackId) {
      this.currentTrackId = trackId;
      try { localStorage.setItem('naruto_current_track', trackId); } catch (e) {}
    } else {
      // Автоматический выбор трека под текущий режим
      if (mode === 'battle') {
        if (!this.currentTrackId || this.currentTrackId === 'lobby_konoha' || this.currentTrackId === 'lobby_temple') {
          this.currentTrackId = 'bc_black_rover';
        }
      } else if (mode === 'lobby') {
        if (!this.currentTrackId) {
          this.currentTrackId = 'bc_black_catcher';
        }
      }
    }

    this.stopSynthesizer();
    if (this.htmlAudio) {
      try { this.htmlAudio.pause(); this.htmlAudio = null; } catch (e) {}
    }

    this.isPlaying = true;

    const trackObj = AUDIO_TRACKS.find(t => t.id === this.currentTrackId) || AUDIO_TRACKS[0];

    // Если у трека есть MP3-файл (Black Clover / Naruto / MHA с вокалом)
    if (trackObj && trackObj.url) {
      try {
        const resolvedUrl = resolveAudioUrl(trackObj.url);
        const audio = new Audio(resolvedUrl);
        audio.preload = 'auto';
        audio.loop = (this.playbackMode === 'repeat-one');
        audio.volume = this.isMuted ? 0 : this.volume;
        audio.muted = this.isMuted;
        audio.ontimeupdate = () => {
          this.currentTime = audio.currentTime || 0;
          this.duration = audio.duration || 0;
          this.notify();
        };
        audio.onloadedmetadata = () => {
          this.duration = audio.duration || 0;
          this.notify();
        };
        audio.onended = () => {
          this.handleTrackEnded();
        };
        audio.onerror = (e) => {
          console.warn('[Audio] Error loading audio track:', resolvedUrl, audio.error);
          if (!audio._retried) {
            audio._retried = true;
            // Попытка альтернативного относительного пути
            audio.src = './' + trackObj.url.replace(/^\/+/, '');
            audio.load();
            audio.play().catch(() => this.startBattleSynth());
            return;
          }
          this.startBattleSynth();
        };

        this.htmlAudio = audio;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn('[Audio] HTML5 audio play error:', err);
            // Если браузер заблокировал автовоспроизведение до первого клика — снимем блокировку при первом клике/нажатии
            if (err.name === 'NotAllowedError') {
              const onFirstGesture = () => {
                if (this.isPlaying && this.htmlAudio && this.htmlAudio.paused) {
                  this.htmlAudio.play().catch(() => {});
                }
                window.removeEventListener('click', onFirstGesture);
                window.removeEventListener('keydown', onFirstGesture);
                window.removeEventListener('touchstart', onFirstGesture);
              };
              window.addEventListener('click', onFirstGesture, { once: true, passive: true });
              window.addEventListener('keydown', onFirstGesture, { once: true, passive: true });
              window.addEventListener('touchstart', onFirstGesture, { once: true, passive: true });
            }
          });
        }
      } catch (err) {
        console.warn('[Audio] Failed to initialize Audio element:', err);
      }
    } else {
      this.startBattleSynth();
    }

    this.notify();
  }

  // Обработка окончания трека по выбранному режиму
  handleTrackEnded() {
    if (this.playbackMode === 'repeat-one') {
      if (this.htmlAudio) {
        this.htmlAudio.currentTime = 0;
        this.htmlAudio.play().catch(() => {});
      }
    } else if (this.playbackMode === 'shuffle') {
      this.playNextTrack(true);
    } else {
      // 'repeat-all'
      this.playNextTrack(false);
    }
  }

  // Смена режима воспроизведения ('repeat-one' | 'repeat-all' | 'shuffle')
  setPlaybackMode(mode) {
    if (!['repeat-one', 'repeat-all', 'shuffle'].includes(mode)) return;
    this.playbackMode = mode;
    if (this.htmlAudio) {
      this.htmlAudio.loop = (mode === 'repeat-one');
    }
    try {
      localStorage.setItem('naruto_playback_mode', mode);
    } catch (e) {}
    this.notify();
  }

  // Следующий трек (с учётом режима или принудительно)
  playNextTrack(forceShuffle = null) {
    const shouldShuffle = forceShuffle !== null ? forceShuffle : (this.playbackMode === 'shuffle');
    const currentIndex = AUDIO_TRACKS.findIndex(t => t.id === this.currentTrackId);
    let nextTrack = null;

    if (shouldShuffle) {
      if (AUDIO_TRACKS.length <= 1) {
        nextTrack = AUDIO_TRACKS[0];
      } else {
        const available = AUDIO_TRACKS.filter(t => t.id !== this.currentTrackId);
        nextTrack = available[Math.floor(Math.random() * available.length)];
      }
    } else {
      const nextIdx = (currentIndex + 1) % AUDIO_TRACKS.length;
      nextTrack = AUDIO_TRACKS[nextIdx];
    }

    if (nextTrack) {
      this.play(this.currentMode, nextTrack.id);
    }
  }

  // Предыдущий трек
  playPrevTrack() {
    // Если трек играет дольше 3 секунд, сбрасываем в начало этого же трека
    if (this.htmlAudio && this.htmlAudio.currentTime > 3) {
      this.htmlAudio.currentTime = 0;
      this.currentTime = 0;
      this.notify();
      return;
    }

    const currentIndex = AUDIO_TRACKS.findIndex(t => t.id === this.currentTrackId);
    const prevIdx = (currentIndex - 1 + AUDIO_TRACKS.length) % AUDIO_TRACKS.length;
    const prevTrack = AUDIO_TRACKS[prevIdx];
    if (prevTrack) {
      this.play(this.currentMode, prevTrack.id);
    }
  }

  // Перемотка музыки на указанную секунду
  seek(seconds) {
    if (this.htmlAudio) {
      const target = Math.max(0, Math.min(this.htmlAudio.duration || 0, seconds));
      this.htmlAudio.currentTime = target;
      this.currentTime = target;
      this.notify();
    }
  }

  // Остановка музыки
  stop() {
    this.stopSynthesizer();
    if (this.htmlAudio) {
      try {
        this.htmlAudio.pause();
        this.htmlAudio.currentTime = 0;
      } catch (e) {}
      this.htmlAudio = null;
    }
    this.currentTime = 0;
    this.isPlaying = false;
    this.notify();
  }

  stopSynthesizer() {
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    this.activeNodes.forEach(node => {
      try { node.stop(); node.disconnect(); } catch (e) {}
    });
    this.activeNodes = [];
  }

  // Установка громкости музыки
  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.musicGain) {
      this.musicGain.gain.value = this.isMuted ? 0 : this.volume;
    }
    if (this.htmlAudio) {
      this.htmlAudio.volume = this.isMuted ? 0 : this.volume;
    }
    try { localStorage.setItem('naruto_music_volume', this.volume.toString()); } catch (e) {}
    this.notify();
  }

  // Мутирование
  setMuted(muted) {
    this.isMuted = muted;
    if (this.musicGain) {
      this.musicGain.gain.value = this.isMuted ? 0 : this.volume;
    }
    if (this.htmlAudio) {
      this.htmlAudio.volume = this.isMuted ? 0 : this.volume;
      this.htmlAudio.muted = this.isMuted;
    }
    try { localStorage.setItem('naruto_music_muted', this.isMuted ? 'true' : 'false'); } catch (e) {}
    this.notify();
  }

  // Включение / выключение SFX
  setSfxEnabled(enabled) {
    this.sfxEnabled = enabled;
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.sfxEnabled ? this.sfxVolume : 0;
    }
    try { localStorage.setItem('naruto_sfx_enabled', this.sfxEnabled ? 'true' : 'false'); } catch (e) {}
    this.notify();
  }

  setSfxVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    if (this.sfxGain && this.sfxEnabled) {
      this.sfxGain.gain.value = this.sfxVolume;
    }
    try { localStorage.setItem('naruto_sfx_volume', this.sfxVolume.toString()); } catch (e) {}
    this.notify();
  }

  // ==========================================
  // 1. ПРОЦЕДУРНЫЙ ЭМБИЕНТ ДЛЯ ЛОББИ (ЯПОНИЯ)
  // ==========================================
  startLobbySynth() {
    const ctx = this.ctx;
    if (!ctx) return;

    // Базовый мягкий дрон (гул святилища)
    const droneOsc = ctx.createOscillator();
    const droneGain = ctx.createGain();
    const droneFilter = ctx.createBiquadFilter();

    droneOsc.type = 'triangle';
    droneOsc.frequency.setValueAtTime(146.83, ctx.currentTime); // Ре (D3)

    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(420, ctx.currentTime);

    droneGain.gain.setValueAtTime(0.08, ctx.currentTime);

    droneOsc.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(this.musicGain);

    droneOsc.start();
    this.activeNodes.push(droneOsc);

    // Функция проигрывания одной ноты сякухати/кото с мягкой атакой
    const playZenNote = () => {
      if (!this.isPlaying || this.currentMode !== 'lobby') return;
      const noteFreq = INSEN_SCALE[Math.floor(Math.random() * INSEN_SCALE.length)];

      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);

      // Легкое естественное вибрато флейты
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.setValueAtTime(4.5, ctx.currentTime);
      vibratoGain.gain.setValueAtTime(2.5, ctx.currentTime);
      vibrato.connect(osc.frequency);
      vibrato.start();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(noteFreq * 1.5, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      // Плавное нарастание и затухание (дыхание сякухати)
      const now = ctx.currentTime;
      const duration = 2.5 + Math.random() * 1.5;
      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.exponentialRampToValueAtTime(0.12, now + 0.6);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
      vibrato.stop(now + duration + 0.1);
    };

    // Звон кристального колокольчика (фурин)
    const playWindChime = () => {
      if (!this.isPlaying || this.currentMode !== 'lobby') return;
      const now = ctx.currentTime;
      const chimeFreq = 1200 + Math.random() * 800;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(chimeFreq, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 2.0);
    };

    // Запускаем первую ноту
    playZenNote();

    // Циклический вызов нот каждые 2.8 - 4.5 сек
    let step = 0;
    this.loopTimer = setInterval(() => {
      playZenNote();
      step++;
      if (step % 3 === 0) {
        setTimeout(playWindChime, 600);
      }
    }, 3200);
  }

  // ==========================================
  // 2. ПРОЦЕДУРНЫЙ БОЕВОЙ РИТМ (ТАЙКО & РОК)
  // ==========================================
  startBattleSynth() {
    const ctx = this.ctx;
    if (!ctx) return;

    // Удар боевого барабана Тайко (глубокий sub-bass и резонанс мембраны)
    const playTaikoStrike = (accent = false) => {
      if (!this.isPlaying || this.currentMode !== 'battle') return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Резкий спад высоты тона, имитирующий натянутую кожу тайко
      osc.frequency.setValueAtTime(accent ? 160 : 120, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.35);

      gain.gain.setValueAtTime(accent ? 0.35 : 0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (accent ? 0.6 : 0.4));

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 0.7);
    };

    // Металлический обод барабана / щелчок палочки
    const playRimSnap = () => {
      if (!this.isPlaying || this.currentMode !== 'battle') return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 0.1);
    };

    // Напряженный боевой рифф
    const playBattlePluck = (freq) => {
      if (!this.isPlaying || this.currentMode !== 'battle') return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 0.3);
    };

    let beat = 0;
    const battleNotes = [146.83, 174.61, 220.00, 261.63, 146.83, 196.00];

    // Боевой тайминг: 130 BPM (~460ms шаг)
    this.loopTimer = setInterval(() => {
      const isDownbeat = (beat % 4 === 0);
      playTaikoStrike(isDownbeat);

      if (beat % 2 === 1) {
        setTimeout(playRimSnap, 120);
      }

      if (beat % 2 === 0) {
        const note = battleNotes[(beat / 2) % battleNotes.length];
        playBattlePluck(note);
      }

      beat++;
    }, 460);
  }

  // ==========================================
  // 3. ЗВУКОВЫЕ ЭФФЕКТЫ (SFX)
  // ==========================================
  playSfx(type) {
    if (!this.sfxEnabled) return;
    const ctx = this.initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (type) {
      // Клик по интерфейсу / кнопкам
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1100, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.04);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.06);
        break;
      }

      // Складывание печатей / свист техники нинпо
      case 'seal': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.16);
        break;
      }

      // Активация глаз (Шаринган / Бьякуган / Риннеган)
      case 'eye': {
        this.playEyeSound('sharingan');
        break;
      }

      // Удар боевого гонга (старт дуэли)
      case 'gong': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 1.2);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 1.8);
        break;
      }

      // Щелчок фиксации хода
      case 'lock': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.setValueAtTime(950, now + 0.03);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.09);
        break;
      }

      default:
        break;
    }
  }

  // ==========================================
  // ==========================================
  // 4. ЗВУКИ АКТИВАЦИИ ДОДЗЮЦУ (УНИКАЛЬНЫЙ ЗВУК ДЛЯ КАЖДОЙ ФОРМЫ)
  // ==========================================
  playEyeSound(eyeId = 'sharingan_3', family = null) {
    if (!this.sfxEnabled) return;
    const ctx = this.initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const id = String(eyeId || '').toLowerCase();
    const fam = String(family || '').toLowerCase();

    // 1. БЬЯКУГАН (Вены висков, тенкецу, Багуа и Тэнсэйган)
    if (id.includes('byakugan') || fam.includes('byakugan')) {
      if (id.includes('awakened')) {
        // Пробуждённый («Всеведущий взор» / Тэнсэйган): сияющий космический аккорд высшей чакры
        const bell1 = ctx.createOscillator();
        const bell2 = ctx.createOscillator();
        const bell3 = ctx.createOscillator();
        const bellGain = ctx.createGain();
        bell1.type = 'sine';
        bell2.type = 'triangle';
        bell3.type = 'sine';
        bell1.frequency.setValueAtTime(880, now);
        bell2.frequency.setValueAtTime(1760, now);
        bell3.frequency.setValueAtTime(2640, now);
        bell1.frequency.exponentialRampToValueAtTime(1320, now + 0.6);
        bell2.frequency.exponentialRampToValueAtTime(2640, now + 0.6);
        bell3.frequency.exponentialRampToValueAtTime(3520, now + 0.6);
        bellGain.gain.setValueAtTime(0.3, now);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
        bell1.connect(bellGain); bell2.connect(bellGain); bell3.connect(bellGain);
        bellGain.connect(this.sfxGain);
        bell1.start(now); bell2.start(now); bell3.start(now);
        bell1.stop(now + 1.7); bell2.stop(now + 1.7); bell3.stop(now + 1.7);
      } else if (id.includes('3')) {
        // Бьякуган 3 этап (Багуа 360°): глубокий храмовый колокол поля Багуа 64 ладоней
        const gongOsc = ctx.createOscillator();
        const gongGain = ctx.createGain();
        gongOsc.type = 'triangle';
        gongOsc.frequency.setValueAtTime(330, now);
        gongOsc.frequency.exponentialRampToValueAtTime(220, now + 0.9);
        gongGain.gain.setValueAtTime(0.28, now);
        gongGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
        gongOsc.connect(gongGain); gongGain.connect(this.sfxGain);
        gongOsc.start(now); gongOsc.stop(now + 1.15);

        const snapOsc = ctx.createOscillator();
        const snapGain = ctx.createGain();
        snapOsc.type = 'sine';
        snapOsc.frequency.setValueAtTime(1200, now);
        snapOsc.frequency.exponentialRampToValueAtTime(2400, now + 0.2);
        snapGain.gain.setValueAtTime(0.2, now);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        snapOsc.connect(snapGain); snapGain.connect(this.sfxGain);
        snapOsc.start(now); snapOsc.stop(now + 0.45);
      } else if (id.includes('2')) {
        // Бьякуган 2 этап (Тэнкецу): двойной звонкий импульс проявления узлов чакры
        [0, 0.12].forEach((offset, idx) => {
          const t = now + offset;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(900 + idx * 300, t);
          osc.frequency.exponentialRampToValueAtTime(1600 + idx * 400, t + 0.25);
          gain.gain.setValueAtTime(0.22, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          osc.connect(gain); gain.connect(this.sfxGain);
          osc.start(t); osc.stop(t + 0.38);
        });
      } else {
        // Бьякуган 1 этап (Базовый): характерный каноничный звук вздутия вен (глухой стук пульса + щелчок)
        const veinOsc = ctx.createOscillator();
        const veinGain = ctx.createGain();
        veinOsc.type = 'sine';
        veinOsc.frequency.setValueAtTime(65, now);
        veinOsc.frequency.exponentialRampToValueAtTime(45, now + 0.25);
        veinGain.gain.setValueAtTime(0.35, now);
        veinGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        veinOsc.connect(veinGain); veinGain.connect(this.sfxGain);
        veinOsc.start(now); veinOsc.stop(now + 0.45);

        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(1100, now);
        clickOsc.frequency.exponentialRampToValueAtTime(1900, now + 0.2);
        clickGain.gain.setValueAtTime(0.18, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        clickOsc.connect(clickGain); clickGain.connect(this.sfxGain);
        clickOsc.start(now); clickOsc.stop(now + 0.38);
      }
      return;
    }

    // 2. РИННЕГАН
    if (id.includes('rinne') || fam.includes('rinne')) {
      if (id.includes('awakened')) {
        // Пробуждённый Ринне-Шаринган: космический разлом пространства (саб-бас + 9 вспышек)
        const tearOsc = ctx.createOscillator();
        const tearGain = ctx.createGain();
        tearOsc.type = 'sawtooth';
        tearOsc.frequency.setValueAtTime(42, now);
        tearOsc.frequency.exponentialRampToValueAtTime(110, now + 0.5);
        tearOsc.frequency.exponentialRampToValueAtTime(35, now + 1.4);
        tearGain.gain.setValueAtTime(0.3, now);
        tearGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        tearOsc.connect(tearGain); tearGain.connect(this.sfxGain);
        tearOsc.start(now); tearOsc.stop(now + 1.55);

        const flareOsc = ctx.createOscillator();
        const flareGain = ctx.createGain();
        flareOsc.type = 'sine';
        flareOsc.frequency.setValueAtTime(660, now);
        flareOsc.frequency.exponentialRampToValueAtTime(1980, now + 0.4);
        flareGain.gain.setValueAtTime(0.25, now);
        flareGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
        flareOsc.connect(flareGain); flareGain.connect(this.sfxGain);
        flareOsc.start(now); flareOsc.stop(now + 1.05);
      } else {
        // Риннеган (Шесть Путей): низкий гравитационный гул Пейна
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(80, now);
        subOsc.frequency.exponentialRampToValueAtTime(130, now + 0.4);
        subOsc.frequency.exponentialRampToValueAtTime(55, now + 1.2);
        subGain.gain.setValueAtTime(0.28, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
        subOsc.connect(subGain); subGain.connect(this.sfxGain);
        subOsc.start(now); subOsc.stop(now + 1.35);

        const chimeOsc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chimeOsc.type = 'triangle';
        chimeOsc.frequency.setValueAtTime(528, now);
        chimeOsc.frequency.exponentialRampToValueAtTime(1056, now + 0.5);
        chimeGain.gain.setValueAtTime(0.18, now);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
        chimeOsc.connect(chimeGain); chimeGain.connect(this.sfxGain);
        chimeOsc.start(now); chimeOsc.stop(now + 1.05);
      }
      return;
    }

    // 3. КИНГАН
    if (id.includes('kingan') || fam.includes('kingan')) {
      if (id.includes('awakened')) {
        // Пробуждённая «Печать разрушения»: лазерный рассекающий свист + золотой звон
        const beamOsc = ctx.createOscillator();
        const beamGain = ctx.createGain();
        beamOsc.type = 'sawtooth';
        beamOsc.frequency.setValueAtTime(2800, now);
        beamOsc.frequency.exponentialRampToValueAtTime(620, now + 0.45);
        beamGain.gain.setValueAtTime(0.25, now);
        beamGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        beamOsc.connect(beamGain); beamGain.connect(this.sfxGain);
        beamOsc.start(now); beamOsc.stop(now + 0.85);
      } else {
        const rings = id.includes('3') ? 3 : (id.includes('2') ? 2 : 1);
        for (let i = 0; i < rings; i++) {
          const t = now + i * 0.1;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1320 + i * 330, t);
          osc.frequency.exponentialRampToValueAtTime(987 + i * 220, t + 0.3);
          gain.gain.setValueAtTime(0.24, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
          osc.connect(gain); gain.connect(this.sfxGain);
          osc.start(t); osc.stop(t + 0.65);
        }
      }
      return;
    }

    // 4. АОЙГАН
    if (id.includes('aoigan') || fam.includes('aoigan')) {
      if (id.includes('awakened')) {
        // Пробуждённая «Глубинная Бездна»: океанический водоворот цунами
        const deepOsc = ctx.createOscillator();
        const deepGain = ctx.createGain();
        deepOsc.type = 'triangle';
        deepOsc.frequency.setValueAtTime(110, now);
        deepOsc.frequency.exponentialRampToValueAtTime(380, now + 0.35);
        deepOsc.frequency.exponentialRampToValueAtTime(140, now + 0.9);
        deepGain.gain.setValueAtTime(0.3, now);
        deepGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        deepOsc.connect(deepGain); deepGain.connect(this.sfxGain);
        deepOsc.start(now); deepOsc.stop(now + 1.25);
      } else {
        const drops = id.includes('3') ? 3 : (id.includes('2') ? 2 : 1);
        for (let i = 0; i < drops; i++) {
          const t = now + i * 0.12;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400 + i * 150, t);
          osc.frequency.exponentialRampToValueAtTime(1100 + i * 200, t + 0.2);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
          osc.connect(gain); gain.connect(this.sfxGain);
          osc.start(t); osc.stop(t + 0.5);
        }
      }
      return;
    }

    // 5. ИКАДЗУТИГАН
    if (id.includes('ikadzutigan') || fam.includes('ikadzutigan')) {
      if (id.includes('awakened')) {
        // Пробуждённая «Божественная Молния»: раскат черной молнии Курорайтон
        const thundOsc = ctx.createOscillator();
        const thundGain = ctx.createGain();
        thundOsc.type = 'sawtooth';
        thundOsc.frequency.setValueAtTime(120, now);
        thundOsc.frequency.exponentialRampToValueAtTime(3200, now + 0.08);
        thundOsc.frequency.exponentialRampToValueAtTime(60, now + 0.6);
        thundGain.gain.setValueAtTime(0.32, now);
        thundGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        thundOsc.connect(thundGain); thundGain.connect(this.sfxGain);
        thundOsc.start(now); thundOsc.stop(now + 0.95);
      } else {
        const bolts = id.includes('3') ? 3 : (id.includes('2') ? 2 : 1);
        for (let i = 0; i < bolts; i++) {
          const t = now + i * 0.09;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200 + i * 300, t);
          osc.frequency.exponentialRampToValueAtTime(2200 + i * 400, t + 0.1);
          gain.gain.setValueAtTime(0.22, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
          osc.connect(gain); gain.connect(this.sfxGain);
          osc.start(t); osc.stop(t + 0.35);
        }
      }
      return;
    }

    // 6. ШАРИНГАН & ВМШ
    if (id.includes('mangekyo')) {
      // Вечный Мангёкё Шаринган: эпичный многослойный вихрь Мангёкё с пламенем Аматерасу
      const sub = ctx.createOscillator();
      const subG = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(85, now);
      sub.frequency.exponentialRampToValueAtTime(140, now + 0.35);
      sub.frequency.exponentialRampToValueAtTime(50, now + 1.1);
      subG.gain.setValueAtTime(0.3, now);
      subG.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
      sub.connect(subG); subG.connect(this.sfxGain);
      sub.start(now); sub.stop(now + 1.35);

      const whistle = ctx.createOscillator();
      const whistG = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoG = ctx.createGain();
      lfo.frequency.setValueAtTime(18, now); // Быстрое вращение
      lfoG.gain.setValueAtTime(60, now);
      lfo.connect(whistle.frequency);
      lfo.start(now);
      whistle.type = 'sine';
      whistle.frequency.setValueAtTime(650, now);
      whistle.frequency.exponentialRampToValueAtTime(1480, now + 0.4);
      whistG.gain.setValueAtTime(0.26, now);
      whistG.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
      whistle.connect(whistG); whistG.connect(this.sfxGain);
      whistle.start(now); whistle.stop(now + 1.0); lfo.stop(now + 1.0);
    } else {
      // Шаринган 1, 2, 3 томоэ
      const tomoeCount = id.includes('1') ? 1 : (id.includes('2') ? 2 : 3);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoG = ctx.createGain();
      
      lfo.frequency.setValueAtTime(8 + tomoeCount * 4, now);
      lfoG.gain.setValueAtTime(25 + tomoeCount * 12, now);
      lfo.connect(osc.frequency);
      lfo.start(now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520 + tomoeCount * 80, now);
      osc.frequency.exponentialRampToValueAtTime(1100 + tomoeCount * 220, now + 0.3);
      gain.gain.setValueAtTime(0.22 + tomoeCount * 0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6 + tomoeCount * 0.1);
      osc.connect(gain); gain.connect(this.sfxGain);
      osc.start(now); osc.stop(now + 0.75 + tomoeCount * 0.1); lfo.stop(now + 0.75 + tomoeCount * 0.1);
    }
  }
}

export const audioManager = new AudioManager();
