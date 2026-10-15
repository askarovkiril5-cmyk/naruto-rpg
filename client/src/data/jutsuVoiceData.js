/**
 * jutsuVoiceData.js
 * Официальный каталог боевых реплик сэйю (Anime Voice Lines) и чистых звуковых эффектов (Pure SFX).
 *
 * Принципы:
 * 1. Строгая каноничность: только легендарные техники имеют оригинальный голос сэйю.
 * 2. Никаких ложных повторений: исключены неточные совпадения подстрок (феникс, сюрикены клонов и т.д.).
 * 3. Разделение на голос (type: 'voice') и чистый звук эффекта (type: 'sfx').
 */

export const JUTSU_VOICE_LIST = [
  // ========================================================
  // 1. ЛЕГЕНДАРНЫЕ ГОЛОСОВЫЕ РЕПЛИКИ СЭЙЮ (ANIME VOICE LINES)
  // ========================================================
  {
    id: 57,
    key: 'chidori',
    type: 'voice',
    jutsuName: 'Чидори',
    kanji: '『千鳥』',
    romaji: 'Chidori!',
    quote: '«Испытай силу тысячи щебечущих птиц... Чидори!»',
    character: 'Учиха Саске (Нориаки Сугияма)',
    element: 'LIGHTNING',
    badge: 'Райтон A-ранг',
    glowColor: '#00f5ff',
    badgeColor: 'bg-cyan-950/90 text-cyan-300 border-cyan-400/50',
    audioUrl: 'audio/voices/chidori.mp3',
    soundType: 'lightning_chirp'
  },
  {
    id: 94,
    key: 'rasengan',
    type: 'voice',
    jutsuName: 'Расенган',
    kanji: '『螺旋丸』',
    romaji: 'Rasengan!',
    quote: '«Вращающаяся сфера чистой чакры... Расенган!»',
    character: 'Узумаки Наруто (Дзюнко Такэути)',
    element: 'WIND',
    badge: 'Фуутон A-ранг',
    glowColor: '#00d4ff',
    badgeColor: 'bg-blue-950/90 text-blue-300 border-blue-400/50',
    audioUrl: 'audio/voices/rasengan.mp3',
    soundType: 'wind_vortex'
  },
  {
    id: 8,
    key: 'kage_bunshin',
    type: 'voice',
    jutsuName: 'Кагэ Бунсин',
    kanji: '『影分身の術』',
    romaji: 'Kage Bunshin no Jutsu!',
    quote: '«Армия теневых клонов шиноби... В бой!»',
    character: 'Узумаки Наруто (Дзюнко Такэути)',
    element: 'BASIC',
    badge: 'Клонирование',
    glowColor: '#f59e0b',
    badgeColor: 'bg-amber-950/90 text-amber-300 border-amber-400/50',
    audioUrl: 'audio/voices/kage_bunshin.mp3',
    soundType: 'smoke_poof'
  },
  {
    id: 'eye_shinra_tensei',
    key: 'shinra_tensei',
    type: 'voice',
    jutsuName: 'Синра Тэнсэй',
    kanji: '『神羅天征』',
    romaji: 'Shinra Tensei!',
    quote: '«Познай же боль... Божественное Покорение!»',
    character: 'Пейн / Нагато (Кэнъю Хориути)',
    element: 'RINNEGAN',
    badge: 'Риннеган Додзюцу',
    glowColor: '#c084fc',
    badgeColor: 'bg-purple-950/90 text-purple-300 border-purple-400/50',
    audioUrl: 'audio/voices/shinra_tensei.mp3',
    soundType: 'gravity_repulsion'
  },
  {
    id: 'eye_amaterasu',
    key: 'amaterasu',
    type: 'voice',
    jutsuName: 'Аматэрасу',
    kanji: '『天照』',
    romaji: 'Amaterasu!',
    quote: '«Чёрное негасимое пламя преисподней... Аматэрасу!»',
    character: 'Учиха Итачи (Хидэо Исикава)',
    element: 'FIRE',
    badge: 'Мангёкё Шаринган',
    glowColor: '#ef4444',
    badgeColor: 'bg-red-950/90 text-red-300 border-red-500/50',
    audioUrl: 'audio/voices/amaterasu.mp3',
    soundType: 'black_fire'
  },
  {
    id: 'eye_kamui',
    key: 'kamui',
    type: 'voice',
    jutsuName: 'Камуи',
    kanji: '『神威』',
    romaji: 'Kamui!',
    quote: '«Искажение пространства и времени... Камуи!»',
    character: 'Хатаке Какаши (Кадзухико Иноуэ)',
    element: 'SPACE_TIME',
    badge: 'Мангёкё Шаринган',
    glowColor: '#818cf8',
    badgeColor: 'bg-indigo-950/90 text-indigo-300 border-indigo-400/50',
    audioUrl: 'audio/voices/kamui.mp3',
    soundType: 'dimension_warp'
  },

  // ========================================================
  // 2. ЧИСТЫЕ ЗВУКОВЫЕ ЭФФЕКТЫ (PURE SFX ONLY - БЕЗ ГОЛОСА)
  // ========================================================
  {
    id: 59,
    key: 'chidori_nagashi',
    type: 'sfx',
    jutsuName: 'Чидори Нагаси',
    sfxLabel: '⚡ Звук: Разряд Нагаси',
    kanji: '『千鳥流し』',
    romaji: 'Chidori Nagashi',
    quote: '«Электрический круговой разряд молнии по телу и земле»',
    character: 'Звуковой эффект Райтона',
    element: 'LIGHTNING',
    badge: 'Райтон SFX',
    glowColor: '#38bdf8',
    badgeColor: 'bg-sky-950/90 text-sky-300 border-sky-400/50',
    audioUrl: 'audio/voices/sfx_chidori_stream.mp3',
    soundType: 'lightning_stream'
  },
  {
    id: 173,
    key: 'katon_gokakyu',
    type: 'sfx',
    jutsuName: 'Учиха: сдвоенный огненный шар',
    sfxLabel: '🔥 Звук: Взрыв Пламени',
    kanji: '『豪火球』',
    romaji: 'Gokakyu',
    quote: '«Грозный гул и сокрушительный выброс пламени Катона»',
    character: 'Звуковой эффект Катона',
    element: 'FIRE',
    badge: 'Катон SFX',
    glowColor: '#f97316',
    badgeColor: 'bg-orange-950/90 text-orange-300 border-orange-400/50',
    audioUrl: 'audio/voices/sfx_fire_blast.mp3',
    soundType: 'fire_roar'
  },
  {
    id: 83,
    key: 'suiryudan',
    type: 'sfx',
    jutsuName: 'Суйрюдан (водяной дракон)',
    sfxLabel: '🌊 Звук: Всплеск Дракона',
    kanji: '『水龍弾』',
    romaji: 'Suiryudan',
    quote: '«Мощный водяной выброс и сокрушительный удар цунами»',
    character: 'Звуковой эффект Суйтона',
    element: 'WATER',
    badge: 'Суйтон SFX',
    glowColor: '#06b6d4',
    badgeColor: 'bg-cyan-950/90 text-cyan-300 border-cyan-400/50',
    audioUrl: 'audio/voices/sfx_water_dragon.mp3',
    soundType: 'water_surge'
  },
  {
    id: 'eye_kaiten',
    key: 'kaiten',
    type: 'sfx',
    jutsuName: 'Хаккэ Кайтен',
    sfxLabel: '🌀 Звук: Купол Кайтен',
    kanji: '『回天』',
    romaji: 'Kaiten',
    quote: '«Свист и вращение защитного купола чакры Бьякугана»',
    character: 'Звуковой эффект Дзюкена',
    element: 'TAIJUTSU',
    badge: 'Тайдзюцу SFX',
    glowColor: '#2dd4bf',
    badgeColor: 'bg-teal-950/90 text-teal-300 border-teal-400/50',
    audioUrl: 'audio/voices/sfx_kaiten_spin.mp3',
    soundType: 'chakra_shield'
  }
];

/**
 * Строгий поиск звукового сопровождения по точному ID техники или каноничному названию.
 * Полностью исключает ложные срабатывания и повторяющиеся кнопки на других техниках.
 */
export function getVoiceForJutsu(jutsuId, jutsuName = '') {
  if (!jutsuId && !jutsuName) return null;

  // 1. Точное прямое совпадение по ID
  const numId = Number(jutsuId);
  const byId = JUTSU_VOICE_LIST.find(v => v.id === jutsuId || (numId && v.id === numId));
  if (byId) return byId;

  // 2. Строгое сопоставление по точному названию техники (без частичных подстрок!)
  const raw = String(jutsuName || jutsuId || '').toLowerCase().trim();

  // Чидори (Саске) - только основная каноничная техника #57
  if (raw === 'чидори' || raw === 'chidori') {
    return JUTSU_VOICE_LIST.find(v => v.key === 'chidori');
  }

  // Расенган (Наруто) - только основная каноничная техника #94
  if (raw === 'расенган' || raw === 'rasengan') {
    return JUTSU_VOICE_LIST.find(v => v.key === 'rasengan');
  }

  // Кагэ Бунсин (Наруто) - только теневые клоны #8
  if (raw === 'кагэ бунсин (теневые клоны)' || raw === 'кагэ бунсин' || raw === 'kage bunshin' || raw === 'kage bunshin no jutsu') {
    return JUTSU_VOICE_LIST.find(v => v.key === 'kage_bunshin');
  }

  // Синра Тэнсэй (Пейн)
  if (raw === 'синра тэнсэй' || raw === 'шинра тенсей' || raw === 'shinra tensei') {
    return JUTSU_VOICE_LIST.find(v => v.key === 'shinra_tensei');
  }

  // Аматэрасу (Итачи / Саске)
  if (raw === 'аматэрасу' || raw === 'аматерасу' || raw === 'amaterasu') {
    return JUTSU_VOICE_LIST.find(v => v.key === 'amaterasu');
  }

  // Камуи (Какаши / Обито)
  if (raw === 'камуи' || raw === 'kamui') {
    return JUTSU_VOICE_LIST.find(v => v.key === 'kamui');
  }

  // Чидори Нагаси (SFX Only) #59
  if (raw === 'чидори нагаси' || raw === 'чидори нагаши' || raw === 'chidori nagashi') {
    return JUTSU_VOICE_LIST.find(v => v.key === 'chidori_nagashi');
  }

  // Огненный шар (SFX Only) #173
  if (raw === 'учиха: сдвоенный огненный шар' || raw === 'сдвоенный огненный шар' || raw === 'огненный шар' || raw === 'гокакью') {
    return JUTSU_VOICE_LIST.find(v => v.key === 'katon_gokakyu');
  }

  // Суйрюдан (SFX Only) #83
  if (raw === 'суйрюдан (водяной дракон)' || raw === 'суйрюдан' || raw === 'водяной дракон' || raw === 'suiryudan') {
    return JUTSU_VOICE_LIST.find(v => v.key === 'suiryudan');
  }

  // Кайтен (SFX Only)
  if (raw === 'хаккэ кайтен' || raw === 'небесный вихрь' || raw === 'кайтен' || raw === 'kaiten') {
    return JUTSU_VOICE_LIST.find(v => v.key === 'kaiten');
  }

  // Никаких других техник!
  return null;
}
