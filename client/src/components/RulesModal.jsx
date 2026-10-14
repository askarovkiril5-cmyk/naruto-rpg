import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { X, BookOpen, Search, Shield, Zap, Compass, Loader2 } from 'lucide-react';

import { getBackendUrl } from '../utils/config';

const FALLBACK_RULES = {
  '0.3.3': `# РЕГЛАМЕНТ 0.3.3 (ТАКТИЧЕСКАЯ ФИЗИКА)

## 1. СТРУКТУРА ХОДА
- Каждый раунд оба игрока заявляют от 1 до 3 скрытых действий.
- Действия раскрываются одновременно.
- ИИ рассчитывает время подлета, реакцию и расход чакры.

## 2. ДИСТАНЦИИ И ЗОНЫ
- **[К] Вплотную / Контактная:** 0–2 метра. Рукопашный бой, Дзюкэн, Расенган, Чидори.
- **[Б] Ближняя:** 3–10 метров. Рывки, быстрые техники средней зоны.
- **[С] Средняя:** 11–30 метров. Огненные шары, водяные драконы, метательное оружие.
- **[Д] Дальняя:** 31–60 метров. Масштабные залпы, Кирин, Сусаноо стрелы.
- **[О] Особая:** По полю зрения (Гендзюцу, Аматерасу, Камуи).
- **[Я] На себя:** Барьеры, покровы, исцеление, доспехи.

## 3. СКОРОСТИ ПОЛЕТА СТИХИЙ
- **Молния [Райтон]:** 80 м/с (Сверхбыстрая)
- **Ветер [Фуутон]:** 50 м/с
- **Огонь [Катон]:** 35 м/с
- **Вода [Суйтон]:** 30 м/с
- **Земля [Дотон]:** 25 м/с
- **Кунаи / Сюрикены:** 30 м/с

## 4. ПРАВИЛО УСТАЛОСТИ И ЧАКРЫ
- Если чакра падает до 0 — боец падает без сил.
- Базовое восстановление: +5 000 чакры за раунд.
- Пилюля Хёроган: +30 000 чакры один раз за бой (вторая смертельна).`,

  '0.3.2': `# РЕГЛАМЕНТ 0.3.2 (БАЗОВЫЙ КИНЕМАТОГРАФИЧНЫЙ)

## 1. СТРУКТУРА БОЯ
- Вы получаете случайного бойца с уникальным кланом, стихиями и запасом чакры.
- Вы выбираете 30 техник из книги техник в свой арсенал.
- Каждый раунд пишется по 1-3 действия.
- ИИ выступает справедливым Гейм-Мастером и судит столкновение на основе логики, силы техник и преимущества стихий.

## 2. ПРИОРИТЕТЫ
- Техника более высокого ранга (S > A > B > C > D) подавляет технику более низкого ранга при лобовом столкновении.
- Преимущество стихий: Огонь бьет Ветер, Ветер бьет Молнию, Молния бьет Землю, Земля бьет Воду, Вода бьет Огонь.`
};

export default function RulesModal({ isOpen, onClose, currentVersion = '0.3.3' }) {
  const [activeVersion, setActiveVersion] = useState(currentVersion);
  const [availableVersions, setAvailableVersions] = useState([
    { version: '0.3.3', title: '0.3.3 Тактическая' },
    { version: '0.3.2', title: '0.3.2 Базовая' }
  ]);
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Загрузка доступных версий с бэкенда
  useEffect(() => {
    if (!isOpen) return;
    const backendUrl = getBackendUrl();
    fetch(`${backendUrl}/api/rules/versions`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAvailableVersions(data);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  // Загрузка Markdown файла правил с бэкенда
  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    const backendUrl = getBackendUrl();
    fetch(`${backendUrl}/api/rules/${activeVersion}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.content) {
          setMarkdownContent(data.content);
        } else {
          setMarkdownContent('# Правила не найдены на сервере.');
        }
      })
      .catch(err => {
        console.warn('Ошибка загрузки правил с бэкенда, загружаем локальную копию:', err);
        setMarkdownContent(FALLBACK_RULES[activeVersion] || '# Ошибка загрузки правил.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isOpen, activeVersion]);

  if (!isOpen) return null;

  // Фильтрация контента, если введен поисковый запрос
  const displayContent = searchQuery.trim()
    ? markdownContent
        .split('\n\n')
        .filter(block => block.toLowerCase().includes(searchQuery.toLowerCase()))
        .join('\n\n') || `### Ничего не найдено по запросу «${searchQuery}»`
    : markdownContent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 select-none animate-fadeIn">
      <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-zinc-950/98 p-5 sm:p-6 shadow-2xl text-zinc-100 flex flex-col h-[90vh] overflow-hidden">
        
        {/* ВЕРХНЯЯ ШАПКА */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-wide flex items-center gap-2">
                Регламент и Правила Игры (System Prompt)
              </h2>
              <p className="text-xs text-zinc-400">
                Полные официальные инструкции ИИ-Ведущего: боевая физика, расчет таймингов, баллистика и формулы столкновений.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
            title="Закрыть правила"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ПЕРЕКЛЮЧАТЕЛЬ ВЕРСИЙ И ПОИСК */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-3.5 border-b border-white/5 shrink-0">
          
          {/* Кнопки переключения версий (динамический список) */}
          <div className="flex gap-1.5 p-1 bg-zinc-900/90 rounded-2xl border border-white/10 overflow-x-auto scrollbar-none">
            {availableVersions.map(v => (
              <button
                key={v.version}
                onClick={() => setActiveVersion(v.version)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeVersion === v.version
                    ? 'bg-amber-500 text-zinc-950 shadow-sm shadow-amber-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{v.title || `Версия ${v.version}`}</span>
              </button>
            ))}
          </div>

          {/* Быстрый поиск по тексту правил */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Поиск по правилам (напр. «Шаринган», «уклон»)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-zinc-900 border border-zinc-700/60 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300 text-xs p-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ОБЛАСТЬ РЕНДЕРА MARKDOWN */}
        <div className="flex-1 overflow-y-auto pr-3 my-3 scrollbar-thin">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-28 text-zinc-500 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-xs">Загрузка Markdown файла правил...</p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none text-zinc-200 text-xs sm:text-sm leading-relaxed">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-lg sm:text-xl font-black text-amber-400 mt-6 mb-3 border-b border-amber-500/20 pb-2 uppercase tracking-wide flex items-center gap-2" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-base sm:text-lg font-bold text-cyan-300 mt-5 mb-2.5 pt-2 border-t border-white/5" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-sm sm:text-base font-semibold text-zinc-100 mt-4 mb-2 text-amber-200/90" {...props} />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-200 mt-3 mb-1.5" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 mb-3 font-sans" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="text-amber-300 font-bold font-sans" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="text-cyan-200 italic font-sans" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside space-y-1.5 my-2.5 pl-2 text-zinc-300 text-xs sm:text-sm" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside space-y-1.5 my-2.5 pl-2 text-zinc-300 text-xs sm:text-sm" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="leading-relaxed" {...props} />
                  ),
                  code: ({ node, inline, ...props }) => (
                    inline ? (
                      <code className="bg-zinc-900 border border-white/10 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-xs" {...props} />
                    ) : (
                      <code className="block bg-zinc-900/90 border border-white/10 p-3 rounded-xl overflow-x-auto text-xs text-cyan-200 font-mono my-2.5" {...props} />
                    )
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-amber-500/60 bg-amber-950/20 p-3 rounded-r-xl my-3 text-zinc-300 text-xs italic" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-3 border border-white/10 rounded-xl">
                      <table className="w-full text-left text-xs text-zinc-300 border-collapse" {...props} />
                    </div>
                  ),
                  th: ({ node, ...props }) => (
                    <th className="border-b border-white/10 bg-zinc-900 p-2.5 text-amber-400 font-bold" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="border-b border-white/5 p-2.5 text-zinc-300" {...props} />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr className="my-5 border-white/10" {...props} />
                  )
                }}
              >
                {displayContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* НИЖНИЙ ПОДВАЛ */}
        <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <span className="font-mono text-[11px] text-zinc-500">
            Активный файл: {activeVersion === '0.3.2' ? 'Naruto_GM_Prompt_v0_3_2_Base.md' : 'Naruto_GM_Prompt_v0_3_3_Tactical.md'}
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Закрыть правила
          </button>
        </div>

      </div>
    </div>
  );
}
