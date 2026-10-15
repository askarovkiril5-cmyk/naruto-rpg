/**
 * jutsuVoiceData.js
 * Официальный каталог голосовых реплик и кандзи легендарных техник (Anime Voice Lines).
 * Содержит точные сопоставления техник, аутентичные японские иероглифы (Кандзи),
 * ромадзи выкрики, имена персонажей-авторов и цветовую палитру спецэффектов.
 */

export const JUTSU_VOICE_LIST = [
  // 1. ЧИДОРИ (Саске Учиха)
  {
    id: 57,
    key: 'chidori',
    jutsuName: 'Чидори',
    kanji: '『千鳥』',
    romaji: 'Chidori!',
    quote: '«Испытай силу тысячи щебечущих птиц... Чидори!»',
    character: 'Учиха Саске',
    element: 'LIGHTNING',
    badge: 'Райтон A-ранг',
    glowColor: '#00f5ff',
    badgeColor: 'bg-cyan-950/90 text-cyan-300 border-cyan-400/50',
    audioUrl: 'audio/voices/chidori.mp3',
    soundType: 'lightning_chirp'
  },
  // 2. РАЙКИРИ (Хатаке Какаши)
  {
    id: 58,
    key: 'raikiri',
    jutsuName: 'Райкири',
    kanji: '『雷切』',
    romaji: 'Raikiri!',
    quote: '«Клинок, рассекающий саму молнию... Райкири!»',
    character: 'Хатаке Какаши',
    element: 'LIGHTNING',
    badge: 'Райтон S-ранг',
    glowColor: '#38bdf8',
    badgeColor: 'bg-sky-950/90 text-sky-300 border-sky-400/50',
    audioUrl: 'audio/voices/raikiri.mp3',
    soundType: 'lightning_strike'
  },
  // 3. КИРИН (Учиха Саске)
  {
    id: 61,
    key: 'kirin',
    jutsuName: 'Кирин',
    kanji: '『麒麟』',
    romaji: 'Kirin!',
    quote: '«Исчезни вместе с раскатом грома... Кирин!»',
    character: 'Учиха Саске',
    element: 'LIGHTNING',
    badge: 'Райтон S-ранг',
    glowColor: '#00ffff',
    badgeColor: 'bg-teal-950/90 text-teal-300 border-teal-400/50',
    audioUrl: 'audio/voices/kirin.mp3',
    soundType: 'thunder_roar'
  },
  // 4. РАСЕНГАН (Узумаки Наруто)
  {
    id: 94,
    key: 'rasengan',
    jutsuName: 'Расенган',
    kanji: '『螺旋丸』',
    romaji: 'Rasengan!',
    quote: '«Вращающаяся сфера чистой чакры... Расенган!»',
    character: 'Узумаки Наруто',
    element: 'WIND',
    badge: 'Фуутон A-ранг',
    glowColor: '#00d4ff',
    badgeColor: 'bg-blue-950/90 text-blue-300 border-blue-400/50',
    audioUrl: 'audio/voices/rasengan.mp3',
    soundType: 'wind_vortex'
  },
  // 5. ОДАМА РАСЕНГАН (Узумаки Наруто)
  {
    id: 95,
    key: 'oodama_rasengan',
    jutsuName: 'Одама Расенган',
    kanji: '『大玉螺旋丸』',
    romaji: 'Oodama Rasengan!',
    quote: '«Исполинский Расенган сокрушительной силы!»',
    character: 'Узумаки Наруто',
    element: 'WIND',
    badge: 'Фуутон A-ранг',
    glowColor: '#0284c7',
    badgeColor: 'bg-blue-950/90 text-blue-200 border-blue-500/50',
    audioUrl: 'audio/voices/oodama_rasengan.mp3',
    soundType: 'wind_vortex_mega'
  },
  // 6. ТЕНЕВЫЕ КЛОНЫ (Узумаки Наруто)
  {
    id: 8,
    key: 'kage_bunshin',
    jutsuName: 'Кагэ Бунсин',
    kanji: '『影分身の術』',
    romaji: 'Kage Bunshin no Jutsu!',
    quote: '«Армия теневых клонов шиноби... В бой!»',
    character: 'Узумаки Наруто',
    element: 'BASIC',
    badge: 'Клонирование',
    glowColor: '#f59e0b',
    badgeColor: 'bg-amber-950/90 text-amber-300 border-amber-400/50',
    audioUrl: 'audio/voices/kage_bunshin.mp3',
    soundType: 'smoke_poof'
  },
  // 7. ВЕЛИКИЙ ОГНЕННЫЙ ШАР (Учиха)
  {
    id: 173,
    key: 'katon_gokakyu',
    jutsuName: 'Огненный шар',
    kanji: '『火遁・豪火球の術』',
    romaji: 'Katon: Gokakyu no Jutsu!',
    quote: '«Священное пламя клана Учиха... Гокакью!»',
    character: 'Учиха Саске / Итачи',
    element: 'FIRE',
    badge: 'Катон A-ранг',
    glowColor: '#ef4444',
    badgeColor: 'bg-red-950/90 text-red-300 border-red-500/50',
    audioUrl: 'audio/voices/katon_gokakyu.mp3',
    soundType: 'fire_roar'
  },
  // 8. ЦВЕТЫ ФЕНИКСА (Катон)
  {
    id: 36,
    key: 'katon_hosenka',
    jutsuName: 'Хосэнка (Цветы феникса)',
    kanji: '『火遁・鳳仙火の術』',
    romaji: 'Katon: Hosenka no Jutsu!',
    quote: '«Веер пылающих снарядов феникса!»',
    character: 'Учиха Саске',
    element: 'FIRE',
    badge: 'Катон B-ранг',
    glowColor: '#f97316',
    badgeColor: 'bg-orange-950/90 text-orange-300 border-orange-500/50',
    audioUrl: 'audio/voices/katon_hosenka.mp3',
    soundType: 'fire_bursts'
  },
  // 9. ВОДЯНОЙ ДРАКОН (Суйтон)
  {
    id: 83,
    key: 'suiton_suiryudan',
    jutsuName: 'Суйрюдан (Водяной дракон)',
    kanji: '『水遁・水龍弾の術』',
    romaji: 'Suiton: Suiryudan no Jutsu!',
    quote: '«Исполинский водяной дракон сокрушает преграды!»',
    character: 'Забуза Момочи / Тобирама',
    element: 'WATER',
    badge: 'Суйтон B-ранг',
    glowColor: '#06b6d4',
    badgeColor: 'bg-cyan-950/90 text-cyan-300 border-cyan-400/50',
    audioUrl: 'audio/voices/suiryudan.mp3',
    soundType: 'water_dragon'
  },
  // 10. АМАТЭРАСУ (Итачи Учиха)
  {
    id: 'eye_amaterasu',
    key: 'amaterasu',
    jutsuName: 'Аматерасу',
    kanji: '『天照』',
    romaji: 'Amaterasu...',
    quote: '«Неугасимое черное пламя, сжигающее сам огонь...»',
    character: 'Учиха Итачи / Саске',
    element: 'DOJUTSU',
    badge: 'Мангёкё S-ранг',
    glowColor: '#dc2626',
    badgeColor: 'bg-red-950/90 text-red-200 border-red-500/60 shadow-lg shadow-red-900/40',
    audioUrl: 'audio/voices/amaterasu.mp3',
    soundType: 'black_flame'
  },
  // 11. ЦУКУЁМИ (Итачи Учиха)
  {
    id: 'eye_tsukuyomi',
    key: 'tsukuyomi',
    jutsuName: 'Цукуёми',
    kanji: '『月読』',
    romaji: 'Tsukuyomi!',
    quote: '«В мире Цукуёми время, пространство и материя подвластны мне...»',
    character: 'Учиха Итачи',
    element: 'DOJUTSU',
    badge: 'Мангёкё S-ранг',
    glowColor: '#ef4444',
    badgeColor: 'bg-purple-950/90 text-purple-200 border-purple-500/60',
    audioUrl: 'audio/voices/tsukuyomi.mp3',
    soundType: 'hypnotic_pulse'
  },
  // 12. КАМУИ (Обито / Какаши)
  {
    id: 'eye_kamui',
    key: 'kamui',
    jutsuName: 'Камуи',
    kanji: '『神威』',
    romaji: 'Kamui!',
    quote: '«Пространственно-временное преломление реальности... Камуи!»',
    character: 'Хатаке Какаши / Обито',
    element: 'DOJUTSU',
    badge: 'Мангёкё A-ранг',
    glowColor: '#a855f7',
    badgeColor: 'bg-purple-950/90 text-purple-300 border-purple-400/50',
    audioUrl: 'audio/voices/kamui.mp3',
    soundType: 'space_vortex'
  },
  // 13. СУСАНОО (Мадара / Саске / Итачи)
  {
    id: 'eye_susanoo',
    key: 'susanoo',
    jutsuName: 'Сусаноо',
    kanji: '『須佐能乎』',
    romaji: 'Susanoo!',
    quote: '«Божественный колосс несокрушимой чакры... Сусаноо!»',
    character: 'Учиха Мадара / Саске',
    element: 'DOJUTSU',
    badge: 'Мангёкё S-ранг',
    glowColor: '#6366f1',
    badgeColor: 'bg-indigo-950/90 text-indigo-200 border-indigo-400/50',
    audioUrl: 'audio/voices/susanoo.mp3',
    soundType: 'divine_armor'
  },
  // 14. СИНРА ТЭНСЭЙ (Пейн)
  {
    id: 'eye_shinra_tensei',
    key: 'shinra_tensei',
    jutsuName: 'Синра Тэнсэй',
    kanji: '『神羅天征』',
    romaji: 'Shinra Tensei!',
    quote: '«Этот мир познает истинную боль... Божественное покорение!»',
    character: 'Пейн (Нагато)',
    element: 'RINNEGAN',
    badge: 'Риннеган S-ранг',
    glowColor: '#c084fc',
    badgeColor: 'bg-purple-950/90 text-purple-200 border-purple-400/60 shadow-lg shadow-purple-900/50',
    audioUrl: 'audio/voices/shinra_tensei.mp3',
    soundType: 'gravity_repulsion'
  },
  // 15. ТИБАКУ ТЭНСЭЙ (Пейн / Мадара)
  {
    id: 'eye_chibaku_tensei',
    key: 'chibaku_tensei',
    jutsuName: 'Тибаку Тэнсэй',
    kanji: '『地爆天星』',
    romaji: 'Chibaku Tensei!',
    quote: '«Гравитационная сингулярность шести путей... Тибаку Тэнсэй!»',
    character: 'Пейн / Учиха Мадара',
    element: 'RINNEGAN',
    badge: 'Риннеган S-ранг',
    glowColor: '#7e22ce',
    badgeColor: 'bg-violet-950/90 text-violet-200 border-violet-500/60',
    audioUrl: 'audio/voices/chibaku_tensei.mp3',
    soundType: 'gravity_core'
  },
  // 16. БЬЯКУГАН — 64 ЛАДОНИ БАГУА (Неджи Хьюга)
  {
    id: 'eye_64_palms',
    key: 'hakke_64',
    jutsuName: 'Хакке Рокудзюёнсё (64 ладони)',
    kanji: '『八卦六十四掌』',
    romaji: 'Hakke Rokujuyon Sho!',
    quote: '«Вы находитесь в моём поле Багуа... 64 удара по узлам Тэнкэцу!»',
    character: 'Неджи Хьюга',
    element: 'BYAKUGAN',
    badge: 'Бьякуган A-ранг',
    glowColor: '#38bdf8',
    badgeColor: 'bg-sky-950/90 text-sky-200 border-sky-400/50',
    audioUrl: 'audio/voices/hakke_64.mp3',
    soundType: 'tenketsu_combo'
  },
  // 17. ХАККЭ СЁ КАЙТЕН (Неджи Хьюга)
  {
    id: 'eye_kaiten',
    key: 'kaiten',
    jutsuName: 'Хаккэ Сё Кайтен (Небесный вихрь)',
    kanji: '『八卦掌回天』',
    romaji: 'Hakke Sho Kaiten!',
    quote: '«Абсолютная круговая защита чакры на 360 градусов!»',
    character: 'Неджи Хьюга',
    element: 'BYAKUGAN',
    badge: 'Бьякуган A-ранг',
    glowColor: '#e0f2fe',
    badgeColor: 'bg-blue-950/90 text-blue-200 border-blue-300/50',
    audioUrl: 'audio/voices/kaiten.mp3',
    soundType: 'chakra_dome'
  },
  // 18. ХАТИМОН ТОНКО: 8 ВРАТ (Рок Ли / Майт Гай)
  {
    id: 217,
    key: 'hachimon_kai',
    jutsuName: 'Открытие Врат (Хатимон Тонко)',
    kanji: '『八門遁甲・開』',
    romaji: 'Hachimon Tonkou: Kai!',
    quote: '«Снятие ограничителей тела... Ворота, Открыть!»',
    character: 'Рок Ли / Майт Гай',
    element: 'TAIJUTSU',
    badge: 'Тайдзюцу Режим',
    glowColor: '#22c55e',
    badgeColor: 'bg-emerald-950/90 text-emerald-300 border-emerald-400/50',
    audioUrl: 'audio/voices/hachimon_kai.mp3',
    soundType: 'body_release'
  }
];

/**
 * Быстрый поиск голосовой линии по ID техники или названию
 */
export function getVoiceForJutsu(jutsuId, jutsuName = '') {
  if (!jutsuId && !jutsuName) return null;

  // 1. Точное совпадение по ID
  const numId = Number(jutsuId);
  const byId = JUTSU_VOICE_LIST.find(v => v.id === jutsuId || (numId && v.id === numId));
  if (byId) return byId;

  // 2. Поиск по нормализованному названию
  const raw = String(jutsuName || jutsuId || '').toLowerCase().trim();
  
  if (raw.includes('чидори') || raw.includes('chidori')) return JUTSU_VOICE_LIST.find(v => v.key === 'chidori');
  if (raw.includes('райкири') || raw.includes('raikiri')) return JUTSU_VOICE_LIST.find(v => v.key === 'raikiri');
  if (raw.includes('кирин') || raw.includes('kirin')) return JUTSU_VOICE_LIST.find(v => v.key === 'kirin');
  if (raw.includes('одама') || raw.includes('oodama')) return JUTSU_VOICE_LIST.find(v => v.key === 'oodama_rasengan');
  if (raw.includes('расенган') || raw.includes('rasengan')) return JUTSU_VOICE_LIST.find(v => v.key === 'rasengan');
  if (raw.includes('кагэ бунсин') || raw.includes('теневые клон') || raw.includes('bunshin')) return JUTSU_VOICE_LIST.find(v => v.key === 'kage_bunshin');
  if (raw.includes('огненный шар') || raw.includes('гокакью') || raw.includes('gokakyu')) return JUTSU_VOICE_LIST.find(v => v.key === 'katon_gokakyu');
  if (raw.includes('хосэнка') || raw.includes('феникс') || raw.includes('hosenka')) return JUTSU_VOICE_LIST.find(v => v.key === 'katon_hosenka');
  if (raw.includes('суйрюдан') || raw.includes('водяной дракон')) return JUTSU_VOICE_LIST.find(v => v.key === 'suiton_suiryudan');
  
  if (raw.includes('аматерас') || raw.includes('amaterasu')) return JUTSU_VOICE_LIST.find(v => v.key === 'amaterasu');
  if (raw.includes('цукуё') || raw.includes('tsukuyomi')) return JUTSU_VOICE_LIST.find(v => v.key === 'tsukuyomi');
  if (raw.includes('камуи') || raw.includes('kamui')) return JUTSU_VOICE_LIST.find(v => v.key === 'kamui');
  if (raw.includes('сусано') || raw.includes('susanoo')) return JUTSU_VOICE_LIST.find(v => v.key === 'susanoo');
  if (raw.includes('синра') || raw.includes('shinra')) return JUTSU_VOICE_LIST.find(v => v.key === 'shinra_tensei');
  if (raw.includes('тибаку') || raw.includes('chibaku')) return JUTSU_VOICE_LIST.find(v => v.key === 'chibaku_tensei');
  if (raw.includes('64 ладон') || raw.includes('рокудзюён')) return JUTSU_VOICE_LIST.find(v => v.key === 'hakke_64');
  if (raw.includes('кайтен') || raw.includes('небесный вихрь')) return JUTSU_VOICE_LIST.find(v => v.key === 'kaiten');
  if (raw.includes('врат') || raw.includes('хатимон') || raw.includes('hachimon')) return JUTSU_VOICE_LIST.find(v => v.key === 'hachimon_kai');

  return null;
}
