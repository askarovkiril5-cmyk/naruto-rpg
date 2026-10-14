import React from 'react';
import { Scroll, Zap, Shield, Swords, Sparkles, Scale, Heart, Compass } from 'lucide-react';

/**
 * Парсер и компонент для красивого рендеринга сообщений ИИ-Ведущего:
 * - Каноничные карточки бойцов (таблица «Параметр | Значение», заголовок «🔴 КАРТОЧКА: Имя»)
 * - Блок статуса раунда («════ ТЕКУЩИЙ СТАТУС БОЙЦОВ ПОСЛЕ РАУНДА ════»)
 * - Обычный кинематографичный сюжет
 */

export default function NarrativeRenderer({ text, isOpening = false, isFighterCard = false }) {
  if (!text || typeof text !== 'string') return null;

  // 1. Проверяем, является ли сообщение Карточкой Бойца
  const isCard = isFighterCard || text.includes('КАРТОЧКА:');

  if (isCard) {
    return <FighterCardRenderer text={text} />;
  }

  // 2. Проверяем, содержит ли сообщение СТАТУС-БЛОК раунда
  const statusSplitIndex = text.indexOf('════ ТЕКУЩИЙ СТАТУС БОЙЦОВ ПОСЛЕ РАУНДА ════');
  if (statusSplitIndex !== -1) {
    const narrativePart = text.slice(0, statusSplitIndex).trim();
    const statusPart = text.slice(statusSplitIndex).trim();

    return (
      <div className="space-y-4">
        {narrativePart && (
          <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-serif text-zinc-200">
            {narrativePart}
          </div>
        )}
        <RoundStatusRenderer statusText={statusPart} />
      </div>
    );
  }

  // 3. Обычный кинематографичный текст
  return (
    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-serif text-zinc-200">
      {text}
    </div>
  );
}

/**
 * Рендерер каноничной карточки бойца в виде свитка ниндзя
 */
function FighterCardRenderer({ text }) {
  const isBlue = text.includes('🔵') || text.toLowerCase().includes('синие');
  const accentColor = isBlue ? 'blue' : 'rose';

  // Извлекаем имя бойца
  const titleMatch = text.match(/КАРТОЧКА:\s*([^\n\r#]+)/i);
  const fighterName = titleMatch ? titleMatch[1].trim() : 'Шиноби';

  // Парсим таблицы Markdown
  const lines = text.split('\n');
  const paramRows = [];
  const techRows = [];
  let isTechSection = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes('Врождённые техники') || trimmed.includes('| Техника |')) {
      isTechSection = true;
    }
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && !trimmed.includes(':---') && !trimmed.includes('| Параметр |')) {
      const parts = trimmed.split('|').map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        if (!isTechSection) {
          paramRows.push({ param: parts[0].replace(/\*\*/g, ''), value: parts[1] });
        } else if (parts.length >= 4) {
          techRows.push({ name: parts[0], rank: parts[1], cost: parts[2], effect: parts[3] });
        }
      }
    }
  }

  return (
    <div className={`my-2 rounded-2xl border ${isBlue ? 'border-blue-500/40 bg-zinc-950/95' : 'border-rose-500/40 bg-zinc-950/95'} p-4 sm:p-5 shadow-2xl space-y-4 backdrop-blur-md relative overflow-hidden`}>
      {/* Декоративный клановый фон */}
      <div className="absolute top-2 right-3 text-6xl opacity-5 select-none pointer-events-none">
        🍥
      </div>

      {/* Заголовок свитка */}
      <div className={`flex items-center justify-between border-b ${isBlue ? 'border-blue-500/30' : 'border-rose-500/30'} pb-3`}>
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{isBlue ? '🔵' : '🔴'}</span>
          <div>
            <span className={`text-[10px] font-mono font-bold tracking-widest uppercase block ${isBlue ? 'text-blue-400' : 'text-rose-400'}`}>
              📜 СВИТОК ПЕРСОНАЖА
            </span>
            <h4 className="text-sm sm:text-base font-black text-zinc-100 uppercase tracking-wide">
              {fighterName}
            </h4>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border font-mono ${
          isBlue ? 'bg-blue-950 text-blue-300 border-blue-500/40' : 'bg-rose-950 text-rose-300 border-rose-500/40'
        }`}>
          {isBlue ? 'Команда Синих' : 'Команда Красных'}
        </span>
      </div>

      {/* Таблица параметров бойца */}
      {paramRows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-mono text-zinc-400 uppercase">
                <th className="py-1.5 px-3 w-1/3">Параметр</th>
                <th className="py-1.5 px-3">Значение</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {paramRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition">
                  <td className="py-2 px-3 font-semibold text-zinc-300 text-[11px] whitespace-nowrap">
                    {row.param}
                  </td>
                  <td className="py-2 px-3 text-zinc-100 text-xs">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Таблица врожденных техник (сверх 30 слотов) */}
      {techRows.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-white/10">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
            ⚡ Врождённые техники сверх 30 слотов (глаза, клан, хвостатый):
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-mono text-zinc-400 uppercase">
                  <th className="py-1.5 px-2">Техника</th>
                  <th className="py-1.5 px-2">Ранг</th>
                  <th className="py-1.5 px-2">Расход</th>
                  <th className="py-1.5 px-2">Эффект</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {techRows.map((t, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition">
                    <td className="py-1.5 px-2 font-bold text-amber-300 text-xs whitespace-nowrap">
                      {t.name}
                    </td>
                    <td className="py-1.5 px-2 font-mono text-[10px] text-zinc-400">
                      {t.rank}
                    </td>
                    <td className="py-1.5 px-2 font-mono text-[10px] text-cyan-300 whitespace-nowrap">
                      {t.cost}
                    </td>
                    <td className="py-1.5 px-2 text-[11px] text-zinc-300">
                      {t.effect}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Рендерер каноничного статус-блока в конце раунда
 */
function RoundStatusRenderer({ statusText }) {
  const lines = statusText.split('\n').map(l => l.trim()).filter(Boolean);
  const fighterLines = lines.filter(l => l.includes('🥋'));
  const distanceLine = lines.find(l => l.includes('📏') || l.includes('Дистанция'));
  const whySoIndex = statusText.indexOf('⚖ Почему так');
  const whySoText = whySoIndex !== -1 ? statusText.slice(whySoIndex).trim() : null;

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-black/60 p-4 sm:p-5 shadow-2xl space-y-4 backdrop-blur-md">
      {/* Шапка блока */}
      <div className="flex items-center gap-2 border-b border-amber-500/30 pb-2.5">
        <span className="text-lg">📊</span>
        <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 font-mono">
          ТЕКУЩИЙ СТАТУС БОЙЦОВ ПОСЛЕ РАУНДА
        </h4>
      </div>

      {/* Список бойцов */}
      <div className="space-y-3 font-sans">
        {fighterLines.map((line, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1.5 text-xs text-zinc-200">
            <div className="font-bold text-zinc-100 flex items-center gap-1.5">
              <span>{line}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Дистанция */}
      {distanceLine && (
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/30 p-2.5 rounded-xl border border-cyan-500/20">
          <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{distanceLine}</span>
        </div>
      )}

      {/* Блок «⚖ Почему так» */}
      {whySoText && (
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 space-y-1 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
            <Scale className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Судейский расчет раунда:</span>
          </div>
          <p className="font-serif italic pl-1">
            {whySoText}
          </p>
        </div>
      )}
    </div>
  );
}
