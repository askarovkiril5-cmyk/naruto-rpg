import React, { useRef, useState, useEffect } from 'react';

/**
 * Artifact3D.jsx
 * Кинематографичный 3D Parallax & Tilt Engine для наградных рамок и клановых гербов
 * по высшим стандартам Mobile Legends: Bang Bang (MLBB Masterpiece 3D).
 * 
 * Особенности:
 * - Настоящая 3D-перспектива (perspective: 1000px, preserve-3d)
 * - Интерактивный наклон за курсором мыши с физической инерцией (Smooth Lerp Physics)
 * - Автономное живое парение в покое (Lissajous Idle Floating Motion)
 * - Динамический хромированный блик (Dynamic Specular Flare Sweep)
 * - Многослойная глубина (Multi-plane Z-stacking)
 * - Динамическая обратная тень (Dynamic Inverse Shadow)
 */

export function Artifact3DStage({
  children,
  className = "",
  maxTilt = 16,
  perspective = 1000,
  scaleOnHover = 1.05,
  idleFloat = true,
  interactive = true,
  glare = true,
  glareColor = 'rgba(255, 255, 255, 0.45)',
  themeColor = null,
  onClick = null,
  style = {}
}) {
  const rootRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Внутреннее состояние анимации
  const stateRef = useRef({
    curRotX: 0,
    curRotY: 0,
    curScale: 1,
    tarRotX: 0,
    tarRotY: 0,
    tarScale: 1,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    tarGlareOpacity: 0,
    time: Math.random() * 100, // случайная фаза парения
    rafId: null
  });

  useEffect(() => {
    const s = stateRef.current;
    const damping = 0.085;
    const idleAmp = idleFloat ? 3.8 : 0;

    const loop = () => {
      s.time += 0.024;

      if (!isHovered) {
        if (idleFloat) {
          // Парение по фигуре Лиссажу
          const idleX = Math.sin(s.time * 1.4) * idleAmp;
          const idleY = Math.cos(s.time * 0.9) * (idleAmp * 0.75);
          s.curRotX += (idleX - s.curRotX) * 0.04;
          s.curRotY += (idleY - s.curRotY) * 0.04;
          // Плавное мягкое перемещение светового отблеска в покое
          s.glareX = 50 + Math.sin(s.time * 0.8) * 30;
          s.glareY = 50 + Math.cos(s.time * 0.7) * 30;
          s.glareOpacity += (0.15 - s.glareOpacity) * 0.05;
        } else {
          s.curRotX += (0 - s.curRotX) * damping;
          s.curRotY += (0 - s.curRotY) * damping;
          s.glareOpacity += (0 - s.glareOpacity) * damping;
        }
        s.curScale += (1 - s.curScale) * damping;
      } else {
        // Следование за курсором с инерцией
        s.curRotX += (s.tarRotX - s.curRotX) * damping;
        s.curRotY += (s.tarRotY - s.curRotY) * damping;
        s.curScale += (s.tarScale - s.curScale) * damping;
        s.glareOpacity += (s.tarGlareOpacity - s.glareOpacity) * 0.12;
      }

      if (rootRef.current) {
        rootRef.current.style.transform = `
          perspective(${perspective}px)
          rotateX(${s.curRotX.toFixed(2)}deg)
          rotateY(${s.curRotY.toFixed(2)}deg)
          scale3d(${s.curScale.toFixed(3)}, ${s.curScale.toFixed(3)}, 1)
        `;

        // Смещение обратной тени
        const shadowX = (-s.curRotY * 1.8).toFixed(1);
        const shadowY = (s.curRotX * 1.8 + 8).toFixed(1);
        const shadowColor = themeColor ? `${themeColor}40` : 'rgba(0, 0, 0, 0.6)';
        rootRef.current.style.filter = `drop-shadow(${shadowX}px ${shadowY}px 14px ${shadowColor})`;

        // CSS переменные для блика
        rootRef.current.style.setProperty('--glare-x', `${s.glareX.toFixed(1)}%`);
        rootRef.current.style.setProperty('--glare-y', `${s.glareY.toFixed(1)}%`);
        rootRef.current.style.setProperty('--glare-op', s.glareOpacity.toFixed(2));
      }

      s.rafId = requestAnimationFrame(loop);
    };

    s.rafId = requestAnimationFrame(loop);

    return () => {
      if (s.rafId) cancelAnimationFrame(s.rafId);
    };
  }, [isHovered, idleFloat, perspective, maxTilt, themeColor]);

  // Обработчики указателя мыши
  const handlePointerEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
    stateRef.current.tarScale = scaleOnHover;
    stateRef.current.tarGlareOpacity = 0.85;
  };

  const handlePointerMove = (e) => {
    if (!interactive || !rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const xNorm = ((e.clientX - rect.left) / rect.width) * 2 - 1; // [-1 .. 1]
    const yNorm = ((e.clientY - rect.top) / rect.height) * 2 - 1; // [-1 .. 1]

    stateRef.current.tarRotY = Math.max(-maxTilt, Math.min(maxTilt, xNorm * maxTilt));
    stateRef.current.tarRotX = Math.max(-maxTilt, Math.min(maxTilt, -yNorm * maxTilt));

    stateRef.current.glareX = ((xNorm + 1) * 0.5) * 100;
    stateRef.current.glareY = ((yNorm + 1) * 0.5) * 100;
  };

  const handlePointerLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    stateRef.current.tarScale = 1;
    stateRef.current.tarRotX = 0;
    stateRef.current.tarRotY = 0;
    stateRef.current.tarGlareOpacity = 0;
  };

  return (
    <div
      ref={rootRef}
      onClick={onClick}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative select-none will-change-transform ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        ...style
      }}
    >
      {children}

      {/* Динамический хромированный световой блик (Specular Flare) */}
      {glare && (
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 overflow-hidden"
          style={{
            transform: 'translateZ(45px)',
            opacity: 'var(--glare-op, 0)',
            background: `radial-gradient(circle 90px at var(--glare-x, 50%) var(--glare-y, 50%), ${glareColor} 0%, ${themeColor ? `${themeColor}25` : 'rgba(255,215,0,0.15)'} 40%, transparent 70%)`,
            mixBlendMode: 'color-dodge'
          }}
        />
      )}
    </div>
  );
}

/**
 * Frame3D
 * Специализированная 3D-рамка для аватара шиноби.
 */
export function Frame3D({
  frame,
  avatarContent,
  sizeClass = "w-16 h-16",
  extraBadge = null,
  interactive = true,
  idleFloat = true,
  maxTilt = 15,
  onClick = null,
  className = ""
}) {
  if (!frame) return null;

  return (
    <Artifact3DStage
      interactive={interactive}
      idleFloat={idleFloat}
      maxTilt={maxTilt}
      scaleOnHover={1.08}
      themeColor={frame.rarityColor}
      onClick={onClick}
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
    >
      {frame.renderFrame(avatarContent, sizeClass, extraBadge)}
    </Artifact3DStage>
  );
}

/**
 * ClanEmblem3D
 * Специализированный 3D-медальон герба клана (Kamon 3D Masterpiece).
 */
export function ClanEmblem3D({
  emblem,
  sizeClass = "w-20 h-20 sm:w-24 sm:h-24",
  interactive = true,
  idleFloat = true,
  maxTilt = 18,
  showKanjiBadge = true,
  onClick = null,
  className = ""
}) {
  if (!emblem) return null;

  return (
    <Artifact3DStage
      interactive={interactive}
      idleFloat={idleFloat}
      maxTilt={maxTilt}
      scaleOnHover={1.10}
      themeColor={emblem.themeColor}
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center shrink-0 ${className}`}
    >
      <div className="relative flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        {/* Фоновое стихийное свечение */}
        <div 
          className="absolute -inset-4 rounded-full blur-xl opacity-60 animate-pulse pointer-events-none"
          style={{ 
            backgroundColor: emblem.themeColor,
            transform: 'translateZ(-20px)'
          }}
        />

        {/* Корпус медальона */}
        <div 
          className="p-2 sm:p-2.5 rounded-3xl bg-black/85 border shadow-2xl relative transition-transform duration-300"
          style={{
            borderColor: `${emblem.themeColor}90`,
            boxShadow: `0 0 35px ${emblem.themeColor}50, inset 0 0 18px ${emblem.themeColor}35`,
            transform: 'translateZ(15px)'
          }}
        >
          {emblem.renderSvg(sizeClass)}
        </div>

        {/* Навесной золотой картуш с кандзи */}
        {showKanjiBadge && emblem.kanji && (
          <span 
            className="absolute -bottom-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-widest uppercase bg-black/95 border shadow-xl pointer-events-none"
            style={{
              borderColor: emblem.themeColor,
              color: emblem.themeColor,
              transform: 'translateZ(38px)',
              boxShadow: `0 4px 12px rgba(0,0,0,0.8), 0 0 10px ${emblem.themeColor}60`
            }}
          >
            {emblem.kanji}
          </span>
        )}
      </div>
    </Artifact3DStage>
  );
}
