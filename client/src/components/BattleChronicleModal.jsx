import React, { useState } from 'react';
import { X, Download, Copy, Check, Scroll, BookOpen, Share2 } from 'lucide-react';
import { generateBattleStory, downloadChronicleFile } from '../utils/chronicleGenerator';

export default function BattleChronicleModal({
  isOpen,
  onClose,
  messages,
  profile,
  battleMode,
  roomId,
  gameVersion,
  playerName
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const chronicleText = generateBattleStory({
    messages,
    profile,
    battleMode,
    roomId,
    gameVersion,
    playerName
  });

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(chronicleText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }).catch(() => {
        prompt('Скопируйте летопись боя:', chronicleText);
      });
    } else {
      prompt('Скопируйте летопись боя:', chronicleText);
    }
  };

  const handleDownload = () => {
    const filename = `Летопись_Боя_${roomId}_${Date.now()}.txt`;
    downloadChronicleFile(chronicleText, filename);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in select-text">
      <div className="glass-panel border border-amber-500/40 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden bg-zinc-950/95">
        
        {/* Шапка модалки */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-amber-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                Летопись боя шиноби
              </h2>
              <p className="text-xs text-zinc-400">
                Полная литературная хроника сражения для чтения, сохранения и отправки друзьям
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Панель быстрых действий */}
        <div className="px-5 py-3 border-b border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-zinc-400 font-mono">
            Комната: <b className="text-amber-400">{roomId}</b> • Раундов: <b className="text-zinc-200">{messages.filter(m => m?.type === 'gm').length}</b>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Скопировано! ✅' : 'Скопировать текст'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-600/20"
            >
              <Download className="w-4 h-4" />
              <span>Скачать файл (.txt)</span>
            </button>
          </div>
        </div>

        {/* Тело летописи (скроллируемый текст) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-950/80">
          <pre className="font-serif text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap bg-black/50 p-4 sm:p-5 rounded-xl border border-white/10 shadow-inner select-text">
            {chronicleText}
          </pre>
        </div>

        {/* Подвал */}
        <div className="p-4 border-t border-white/10 bg-black/60 flex items-center justify-between text-xs text-zinc-500">
          <span>Свиток боевой хроники сформирован автоматически ИИ-Ведущим Конохи.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold transition cursor-pointer"
          >
            Закрыть
          </button>
        </div>

      </div>
    </div>
  );
}
