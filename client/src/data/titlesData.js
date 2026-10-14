/**
 * titlesData.js
 * Коллекция Боевых Титулов (Достижений) мира шиноби:
 * - Без XP и без урона!
 * - Привязаны к тактике, раундам и победам над живыми игроками (PvP)
 * - Закрытые титулы отображаются с замочком и затемнением
 */

export const TITLES_DATA = [
  {
    id: 'first_step',
    name: '«Первый шаг ниндзя»',
    rank: 'D',
    rankLabel: 'D-ранг',
    desc: 'Вступить в свой самый первый поединок против живого человека на Арене.',
    requirementText: 'Сыграть 1 бой в PvP',
    icon: '🍃',
    color: '#94a3b8',
    ringColor: 'from-slate-400 to-zinc-500',
    badgeBg: 'bg-slate-950/80 border-slate-500/40 text-slate-300',
    unlockCheck: (profile) => (profile?.stats?.pvp?.battlesPlayed || 0) >= 1
  },
  {
    id: 'shadow_strategist',
    name: '«Теневой стратег»',
    rank: 'C',
    rankLabel: 'C-ранг',
    desc: 'Перехитрить живого соперника и одержать чистую тактическую победу всего за 2 раунда.',
    requirementText: 'Победа в PvP за 2 раунда',
    icon: '♟️',
    color: '#3b82f6',
    ringColor: 'from-blue-400 to-indigo-600',
    badgeBg: 'bg-blue-950/80 border-blue-500/40 text-blue-300',
    unlockCheck: (profile, ctx) => Boolean(ctx?.isPvp && ctx?.isWinner && ctx?.rounds <= 2)
  },
  {
    id: 'mist_ghost',
    name: '«Призрак Тумана»',
    rank: 'C',
    rankLabel: 'C-ранг',
    desc: 'Выиграть дуэль у реального игрока всухую, предугадав и парировав все его контрвыпады.',
    requirementText: 'Безупречная победа в PvP',
    icon: '🗡️',
    color: '#14b8a6',
    ringColor: 'from-teal-400 to-emerald-600',
    badgeBg: 'bg-teal-950/80 border-teal-500/40 text-teal-300',
    unlockCheck: (profile, ctx) => Boolean(ctx?.isPvp && ctx?.isWinner && ctx?.flawless)
  },
  {
    id: 'seal_master',
    name: '«Мастер печатей»',
    rank: 'B',
    rankLabel: 'B-ранг',
    desc: 'Продемонстрировать виртуозный арсенал, успешно разыграв 8 и более разных техник в одном PvP бою.',
    requirementText: '8+ разных техник в 1 матче',
    icon: '📜',
    color: '#10b981',
    ringColor: 'from-emerald-400 to-teal-500',
    badgeBg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
    unlockCheck: (profile, ctx) => Boolean(ctx?.isPvp && ctx?.uniqueJutsuCount >= 8)
  },
  {
    id: 'yellow_flash',
    name: '«Жёлтая Молния»',
    rank: 'B',
    rankLabel: 'B-ранг',
    desc: 'Превзойти оппонента в скорости и захватить инициативу первого хода во всех раундах дуэли подряд.',
    requirementText: 'Инициатива во всех раундах',
    icon: '⚡',
    color: '#f59e0b',
    ringColor: 'from-amber-400 to-yellow-500',
    badgeBg: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
    unlockCheck: (profile, ctx) => Boolean(ctx?.isPvp && ctx?.alwaysInitiative)
  },
  {
    id: 'brothers_in_arms',
    name: '«Братья по оружию»',
    rank: 'B',
    rankLabel: 'B-ранг',
    desc: 'Одержать командную победу в режиме 2 на 2, сражаясь бок о бок с боевым товарищем.',
    requirementText: 'Победа в командном PvP 2v2',
    icon: '👥',
    color: '#6366f1',
    ringColor: 'from-indigo-400 to-purple-600',
    badgeBg: 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300',
    unlockCheck: (profile, ctx) => Boolean(ctx?.battleMode === '2v2' && ctx?.isWinner)
  },
  {
    id: 'will_of_fire',
    name: '«Воля Огня»',
    rank: 'A',
    rankLabel: 'A-ранг',
    desc: 'Совершить легендарный тактический камбэк: вырвать победу в затяжном финальном раунде (раунд 3 и выше).',
    requirementText: 'Камбэк в решающем раунде',
    icon: '🔥',
    color: '#f97316',
    ringColor: 'from-orange-400 to-red-600',
    badgeBg: 'bg-orange-950/80 border-orange-500/40 text-orange-300',
    unlockCheck: (profile, ctx) => Boolean(ctx?.isPvp && ctx?.isWinner && ctx?.rounds >= 3)
  },
  {
    id: 'cold_blooded',
    name: '«Хладнокровный»',
    rank: 'A',
    rankLabel: 'A-ранг',
    desc: 'Одержать несокрушимую серию из 5 побед подряд над живыми соперниками в PvP.',
    requirementText: 'Серия из 5 побед подряд в PvP',
    icon: '🩸',
    color: '#e11d48',
    ringColor: 'from-rose-500 to-red-700',
    badgeBg: 'bg-rose-950/80 border-rose-500/40 text-rose-300',
    unlockCheck: (profile) => (profile?.stats?.pvp?.battlesWon || 0) >= 5 && (profile?.stats?.pvp?.winrate || 0) >= 65
  },
  {
    id: 'friends_bane',
    name: '«Гроза друзей»',
    rank: 'A',
    rankLabel: 'A-ранг',
    desc: 'Одержать победу в поединках против 3 разных друзей из списка ваших контактов Конохи.',
    requirementText: 'Победить 3 друзей из списка',
    icon: '🤝',
    color: '#84cc16',
    ringColor: 'from-lime-400 to-emerald-600',
    badgeBg: 'bg-lime-950/80 border-lime-500/40 text-lime-300',
    unlockCheck: (profile, ctx) => Boolean((profile?.defeatedFriendsCount || 0) >= 3)
  },
  {
    id: 'illusion_lord',
    name: '«Повелитель Иллюзий»',
    rank: 'S',
    rankLabel: 'S-ранг',
    desc: 'Запутать разум реального противника и завершить дуэль, используя только техники Гендзюцу и психологический обман.',
    requirementText: 'Победа через Гендзюцу',
    icon: '👁️',
    color: '#a855f7',
    ringColor: 'from-purple-400 via-fuchsia-500 to-indigo-600',
    badgeBg: 'bg-purple-950/80 border-purple-500/40 text-purple-300',
    unlockCheck: (profile, ctx) => Boolean(ctx?.isPvp && ctx?.isWinner && ctx?.usedGenjutsu)
  },
  {
    id: 'leaf_hero',
    name: '«Герой Конохи»',
    rank: 'S',
    rankLabel: 'S-ранг',
    desc: 'Заслужить безоговорочное признание деревни: одержать 25 побед над людьми на Боевой Арене.',
    requirementText: '25 побед в PvP',
    icon: '🏯',
    color: '#eab308',
    ringColor: 'from-yellow-400 via-amber-400 to-orange-500',
    badgeBg: 'bg-yellow-950/80 border-yellow-500/40 text-yellow-300',
    unlockCheck: (profile) => (profile?.stats?.pvp?.battlesWon || 0) >= 25
  },
  {
    id: 'shinobi_god',
    name: '«Бог Ниндзюцу»',
    rank: 'Mythic',
    rankLabel: 'Легендарный',
    desc: 'Достичь наивысшего 100-го уровня шиноби в честных поединках с реальными людьми. Легенда всех поколений!',
    requirementText: 'Достичь 100 уровня в PvP',
    icon: '👑',
    color: '#fbbf24',
    ringColor: 'from-amber-300 via-yellow-200 to-amber-500',
    badgeBg: 'bg-amber-950/90 border-amber-400/60 text-amber-200 shadow-lg shadow-amber-500/30',
    unlockCheck: (profile) => (profile?.level || 1) >= 100
  }
];

export const RANK_FILTER_TABS = [
  { id: 'all', title: 'Все титулы' },
  { id: 'unlocked', title: 'Открытые ✓' },
  { id: 'locked', title: 'Закрытые 🔒' },
  { id: 'S', title: 'S и Mythic 👑' }
];
