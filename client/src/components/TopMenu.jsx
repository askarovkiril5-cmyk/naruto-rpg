import React from 'react';
import { 
  BookOpen, Scroll, UserCheck, Settings, Swords, ShieldAlert, 
  Maximize2, Minimize2, UserPlus, FileText, Bot, Award, Mail, Users, Trophy, Crown 
} from 'lucide-react';

export default function TopMenu({ 
  onOpenRules, 
  onOpenJutsu, 
  onOpenArsenal, 
  onToggleProfile, 
  onOpenCreator,
  onOpenChronicle,
  onOpenSettings,
  onOpenAiModel,
  onOpenRanks,
  onOpenMail,
  onOpenTitles,
  onOpenFriends,
  onOpenPersonalProfile,
  activeTitle,
  unreadMailCount = 0,
  activeModel,
  userProfile,
  hasProfile,
  hasMessages = false,
  arsenalCount = 0,
  isProfileOpen = false,
  isArsenalOpen = false,
  onToggleFullscreen,
  isFullscreen = false
}) {
  return (
    <aside className="shrink-0 p-3 z-30 flex flex-col select-none">
      <div className="glass-panel border border-white/10 rounded-2xl p-2.5 flex flex-col gap-2 shadow-2xl backdrop-blur-md w-16 sm:w-44 transition-all duration-300">
        
        {/* Карточка уровня и ранга шиноби (открывает Личный Профиль, победы и винрейт) */}
        <div 
          onClick={onOpenPersonalProfile || onOpenRanks}
          title={`Шиноби: ${userProfile?.rank?.title || 'Генин'} (Ур. ${userProfile?.level || 1}). Нажмите, чтобы открыть ваш Личный Профиль, победы, винрейт и достижения!`}
          className="cursor-pointer p-2 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-amber-950/30 border border-amber-500/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition group shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-400 font-mono flex items-center gap-1">
              <span className="group-hover:scale-125 transition-transform">{userProfile?.rank?.icon || '🥋'}</span>
              <span className="hidden sm:inline truncate max-w-[85px] group-hover:text-amber-200">{userProfile?.rank?.title || 'Генин'}</span>
            </span>
            <span className="text-[10px] font-mono font-black px-1.5 py-0.2 rounded bg-amber-500/25 text-amber-300 border border-amber-500/30 group-hover:bg-amber-400 group-hover:text-zinc-950 transition">
              Ур.{userProfile?.level || 1}
            </span>
          </div>

          {activeTitle && (
            <div className="hidden sm:block text-[9px] text-amber-300/90 font-mono truncate mt-0.5 font-bold">
              {activeTitle}
            </div>
          )}

          {/* PvP победы прогресс-бар */}
          <div className="w-full bg-zinc-900/90 rounded-full h-1.5 mt-1.5 overflow-hidden border border-white/10">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${userProfile?.progressPercent || 0}%` }}
            />
          </div>
          <div className="hidden sm:flex justify-between items-center text-[8px] text-zinc-400 font-mono mt-1">
            <span>PVP ПОБЕДЫ</span>
            <span>{userProfile?.currentWinsInLevel || 0}/{userProfile?.winsRequiredForNextLevel || 1}</span>
          </div>
        </div>

        {/* 1. Правила (сверху) */}
        <button
          type="button"
          onClick={onOpenRules}
          title="Правила игры"
          className="w-full flex items-center justify-center sm:justify-start gap-2.5 px-2.5 py-2.5 rounded-xl hover:bg-white/10 text-zinc-300 hover:text-amber-400 transition cursor-pointer group"
        >
          <BookOpen className="w-5 h-5 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold hidden sm:inline text-zinc-200 group-hover:text-amber-300">
            Правила
          </span>
        </button>

        {/* 2. Книга техник (248) */}
        <button
          type="button"
          onClick={onOpenJutsu}
          title="Книга 248 техник шиноби"
          className="w-full flex items-center justify-center sm:justify-start gap-2.5 px-2.5 py-2.5 rounded-xl hover:bg-white/10 text-zinc-300 hover:text-cyan-400 transition cursor-pointer group"
        >
          <Scroll className="w-5 h-5 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold hidden sm:inline text-zinc-200 group-hover:text-cyan-300">
            Книга Техник
          </span>
        </button>

        {/* 3. Мой Арсенал (Шпаргалка 30 техник) */}
        <button
          type="button"
          onClick={onOpenArsenal}
          title="Мой Арсенал (Выбранные техники для боя)"
          className={`w-full flex items-center justify-between gap-1.5 px-2.5 py-2.5 rounded-xl transition cursor-pointer group ${
            isArsenalOpen 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm' 
              : 'hover:bg-white/10 text-zinc-300 hover:text-amber-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Swords className="w-5 h-5 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold hidden sm:inline text-zinc-200 group-hover:text-amber-300">
              Мой Арсенал
            </span>
          </div>
          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${
            arsenalCount === 30
              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
              : arsenalCount > 0
              ? 'bg-amber-950 text-amber-300 border-amber-600/50'
              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
          }`}>
            {arsenalCount}
          </span>
        </button>

        {/* 4. Конструктор своего шиноби */}
        <button
          type="button"
          onClick={onOpenCreator}
          title="Конструктор шиноби (Клан, стихии, боевой архетип)"
          className="w-full flex items-center justify-center sm:justify-start gap-2.5 px-2.5 py-2.5 rounded-xl hover:bg-white/10 text-zinc-300 hover:text-amber-400 transition cursor-pointer group"
        >
          <UserPlus className="w-5 h-5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold hidden sm:inline text-zinc-200 group-hover:text-amber-300">
            Мой Шиноби
          </span>
        </button>

        {/* 5. Мой Профиль (Личная статистика и достижения / Секретное досье боя) */}
        <button
          type="button"
          onClick={hasProfile ? onToggleProfile : (onOpenPersonalProfile || onToggleProfile)}
          title="Мой Профиль (Личные победы, винрейт, титулы и боевые характеристики)"
          className={`w-full flex items-center justify-between gap-1.5 px-2.5 py-2.5 rounded-xl transition cursor-pointer group ${
            isProfileOpen 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm' 
              : 'hover:bg-white/10 text-zinc-300 hover:text-emerald-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold hidden sm:inline text-zinc-200 group-hover:text-emerald-300">
              Мой Профиль
            </span>
          </div>
          {hasProfile && (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-md shadow-emerald-400/80 shrink-0" />
          )}
        </button>

        {/* 6. Летопись боя */}
        <button
          type="button"
          onClick={onOpenChronicle}
          title="Летопись боя (Связанная история поединка, чтение и экспорт)"
          className="w-full flex items-center justify-center sm:justify-start gap-2.5 px-2.5 py-2.5 rounded-xl hover:bg-white/10 text-zinc-300 hover:text-amber-400 transition cursor-pointer group"
        >
          <FileText className="w-5 h-5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold hidden sm:inline text-zinc-200 group-hover:text-amber-300">
            Летопись боя
          </span>
        </button>

        {/* 6.5. Свиток уведомлений (Почта Конохи с цыферкой) */}
        <button
          type="button"
          onClick={onOpenMail}
          title={unreadMailCount > 0 ? `Почтовая служба Конохи: ${unreadMailCount} новых свитков!` : "Почта Конохи (Приказы Хокаге, донесения и вести деревни)"}
          className={`w-full flex items-center justify-between gap-1.5 px-2.5 py-2.5 rounded-xl transition cursor-pointer group ${
            unreadMailCount > 0
              ? 'bg-gradient-to-r from-rose-950/70 to-zinc-900 border border-rose-500/50 shadow-md shadow-rose-950/40 text-rose-300'
              : 'hover:bg-white/10 text-zinc-300 hover:text-amber-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Scroll className="w-5 h-5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              {unreadMailCount > 0 && (
                <span className="sm:hidden absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <span className="text-xs font-semibold hidden sm:inline text-zinc-200 group-hover:text-amber-300">
              Почта Конохи
            </span>
          </div>
          {unreadMailCount > 0 && (
            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full bg-rose-600 text-white shadow-md shadow-rose-600/60 animate-bounce">
              {unreadMailCount}
            </span>
          )}
        </button>

        {/* 6.8. Таблица рангов шиноби (100 уровней) */}
        <button
          type="button"
          onClick={onOpenRanks}
          title="Таблица 100 рангов и ступеней шиноби"
          className="w-full flex items-center justify-center sm:justify-start gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/10 text-zinc-300 hover:text-amber-400 transition cursor-pointer group"
        >
          <Crown className="w-5 h-5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold hidden sm:inline text-zinc-200 group-hover:text-amber-300">
            Ранги Шиноби
          </span>
        </button>

        {/* 6.9. Боевые Титулы (Достижения) */}
        <button
          type="button"
          onClick={onOpenTitles}
          title="Боевые титулы шиноби (Достижения)"
          className="w-full flex items-center justify-center sm:justify-start gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/10 text-zinc-300 hover:text-amber-400 transition cursor-pointer group"
        >
          <Award className="w-5 h-5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold hidden sm:inline text-zinc-200 group-hover:text-amber-300">
            Титулы
          </span>
        </button>

        {/* 6.95. Штаб Друзей & Зал Славы Конохи */}
        <button
          type="button"
          onClick={onOpenFriends}
          title="Штаб Друзей, личные чаты и Зал Славы (Таблица лидеров)"
          className="w-full flex items-center justify-center sm:justify-start gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/10 text-zinc-300 hover:text-cyan-400 transition cursor-pointer group"
        >
          <Trophy className="w-5 h-5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold hidden sm:inline text-zinc-200 group-hover:text-cyan-300">
            Друзья & Топ
          </span>
        </button>

        {/* 7. ИИ-Ведущий & Выбор модели Gemini */}
        <button
          type="button"
          onClick={onOpenAiModel}
          title={`ИИ-Ведущий: ${activeModel || 'Gemini 2.5 Pro'}`}
          className="w-full flex items-center justify-between gap-1 px-2.5 py-2 rounded-xl hover:bg-white/10 text-zinc-300 hover:text-amber-400 transition cursor-pointer group bg-zinc-900/40 border border-white/5"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Bot className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold hidden sm:inline text-zinc-200 group-hover:text-amber-300 truncate">
              {activeModel ? activeModel.replace('gemini-', 'Gemini ') : 'ИИ Модель'}
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden sm:block shrink-0" />
        </button>

        {/* Разделитель */}
        <div className="h-[1px] w-full bg-white/10 my-1" />

        {/* 8. Настройки оформления */}
        <button
          type="button"
          onClick={onOpenSettings}
          title="Настройки темы и оформления"
          className="w-full flex items-center justify-center sm:justify-start gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-amber-400 transition cursor-pointer group"
        >
          <Settings className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 shrink-0 group-hover:rotate-45 transition-transform" />
          <span className="text-xs font-medium hidden sm:inline text-zinc-400 group-hover:text-zinc-200">
            Настройки
          </span>
        </button>

        {/* 6. Быстрый полный экран */}
        {onToggleFullscreen && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            title={isFullscreen ? "Выйти из полноэкранного режима (F11)" : "На весь экран (F11)"}
            className={`w-full flex items-center justify-center sm:justify-start gap-2.5 px-2.5 py-2 rounded-xl transition cursor-pointer group ${
              isFullscreen
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'hover:bg-white/10 text-zinc-400 hover:text-amber-400'
            }`}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
            ) : (
              <Maximize2 className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-xs font-medium hidden sm:inline group-hover:text-zinc-200">
              {isFullscreen ? "В окно" : "Весь экран"}
            </span>
          </button>
        )}

      </div>
    </aside>
  );
}
