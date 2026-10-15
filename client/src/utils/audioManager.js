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
  // 4. ЗВУКИ АКТИВАЦИИ ДОДЗЮЦУ (ГЛАЗ ШИНОБИ)
  // ==========================================
  playEyeSound(family = 'sharingan') {
    if (!this.sfxEnabled) return;
    const ctx = this.initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fam = String(family || '').toLowerCase();

    if (fam.includes('rinne')) {
      // РИННЕГАН: Глубокий божественный гравитационный гул Шести Путей + космический колокол
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(82, now);
      subOsc.frequency.exponentialRampToValueAtTime(140, now + 0.4);
      subOsc.frequency.exponentialRampToValueAtTime(55, now + 1.2);
      subGain.gain.setValueAtTime(0.28, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
      subOsc.connect(subGain);
      subGain.connect(this.sfxGain);
      subOsc.start(now);
      subOsc.stop(now + 1.5);

      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'triangle';
      chimeOsc.frequency.setValueAtTime(528, now);
      chimeOsc.frequency.exponentialRampToValueAtTime(1056, now + 0.5);
      chimeGain.gain.setValueAtTime(0.18, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.sfxGain);
      chimeOsc.start(now);
      chimeOsc.stop(now + 1.2);

    } else if (fam.includes('byakugan')) {
      // БЬЯКУГАН: Кристальный фокус чакры тенкецу и свистящий импульс взгляда 360°
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(700, now);
      osc2.frequency.setValueAtTime(1400, now);
      osc1.frequency.exponentialRampToValueAtTime(1800, now + 0.35);
      osc2.frequency.exponentialRampToValueAtTime(2800, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.sfxGain);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.65);
      osc2.stop(now + 0.65);

    } else if (fam.includes('kingan')) {
      // КИНГАН: Золотой металлический звон клинка и струны разлома
      const pingOsc = ctx.createOscillator();
      const pingGain = ctx.createGain();
      pingOsc.type = 'sine';
      pingOsc.frequency.setValueAtTime(1320, now);
      pingOsc.frequency.exponentialRampToValueAtTime(987, now + 0.2);
      pingGain.gain.setValueAtTime(0.25, now);
      pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      pingOsc.connect(pingGain);
      pingGain.connect(this.sfxGain);
      pingOsc.start(now);
      pingOsc.stop(now + 0.85);

    } else if (fam.includes('aoigan')) {
      // АОЙГАН: Океанический водный вихрь и гидро-разгон
      const waterOsc = ctx.createOscillator();
      const waterGain = ctx.createGain();
      waterOsc.type = 'triangle';
      waterOsc.frequency.setValueAtTime(320, now);
      waterOsc.frequency.exponentialRampToValueAtTime(960, now + 0.25);
      waterOsc.frequency.exponentialRampToValueAtTime(440, now + 0.6);
      waterGain.gain.setValueAtTime(0.22, now);
      waterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      waterOsc.connect(waterGain);
      waterGain.connect(this.sfxGain);
      waterOsc.start(now);
      waterOsc.stop(now + 0.75);

    } else if (fam.includes('ikadzutigan')) {
      // ИКАДЗУТИГАН: Электрический щелчок, разряд молнии и статический шок
      const zapOsc = ctx.createOscillator();
      const zapGain = ctx.createGain();
      zapOsc.type = 'sawtooth';
      zapOsc.frequency.setValueAtTime(150, now);
      zapOsc.frequency.exponentialRampToValueAtTime(2400, now + 0.12);
      zapOsc.frequency.exponentialRampToValueAtTime(300, now + 0.4);
      zapGain.gain.setValueAtTime(0.24, now);
      zapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      zapOsc.connect(zapGain);
      zapGain.connect(this.sfxGain);
      zapOsc.start(now);
      zapOsc.stop(now + 0.55);

    } else {
      // ШАРИНГАН (ПО УМОЛЧАНИЮ): Классический звонкий свист вращения томоэ (Mangekyo/Sharingan)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Имитация вращающегося томоэ с модуляцией частоты (тремоло)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(14, now); // 14 Hz вращение
      lfoGain.gain.setValueAtTime(45, now);
      lfo.connect(osc1.frequency);
      lfo.start(now);

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(528, now); // Сольфеджио чакры
      osc2.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1174, now + 0.35);
      osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.35);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.sfxGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.8);
      osc2.stop(now + 0.8);
      lfo.stop(now + 0.8);
    }
  }
}

export const audioManager = new AudioManager();
