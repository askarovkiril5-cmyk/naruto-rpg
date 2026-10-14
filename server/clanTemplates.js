/**
 * clanTemplates.js
 * Полная база каноничных кланов, описаний додзюцу, пассивных черт и автоматических клановых техник
 * в строгом соответствии с правилами тактической RPG по Наруто (Раздел 1 и Раздел 3).
 */

const { DOJUTSU_DATABASE, generateDojutsu, calculateEffectiveStats, resolveMultiDojutsu } = require('./dojutsuSystem');

const CLAN_TEMPLATES = [
  {
    clan: 'Учиха',
    tag: 'Тактик',
    description: 'Наследники Индры Ооцуцуки, одаренные Проклятием Ненависти. Мастера высших техник Огня, виртуозы сюрикендзюцу и обладатели Шарингана. Способны мгновенно просчитывать ходы врага и отражать иллюзии.',
    passives: [
      'Врожденный бонус +15% к мощи любых техник стихии Огня',
      'Пассивный иммунитет к базовым визуальным гендзюцу рангов D-C',
      'Возможность считывать траекторию ручных печатей оппонента'
    ],
    eye: {
      name: 'Шаринган (3 томоэ)',
      description: 'Глаз Прозрения и Глаз Гипноза на максимальной базовой ступени. Видит чакру в цвете, считывает сокращения мышц за мгновение до удара и позволяет накладывать парализующие гендзюцу прямым взглядом.',
      stage: '3 томоэ (Максимальная ступень)',
      bonuses: 'Предвидение +30%, Точность +20%, Усиление техник +15%',
      upkeep: '2 200 ед./ход'
    },
    baseSpeed: 24,
    baseReaction: 185,
    chakra: 650000,
    elements: ['Огонь', 'Молния'],
    autoJutsu: [
      {
        id: 'u1',
        name: 'Катон: Гокакью но Дзюцу (Огненный шар)',
        rank: 'C',
        cost: '4 000',
        range: '[С] Средняя (10–25м)',
        desc: 'Классическая техника клана Учиха. Выдох исполинского огненного шара высокой температуры, накрывающего зону перед собой.'
      },
      {
        id: 'u2',
        name: 'Гендзюцу: Шаринган',
        rank: 'B',
        cost: '8 000',
        range: '[Б] Ближняя (3–10м)',
        desc: 'Мгновенная оптическая иллюзия взглядом в глаза. Парализует или дезориентирует цель на 1 ход, нарушая баланс чакры.'
      },
      {
        id: 'u3',
        name: 'Шаринган: Зеркальное копирование',
        rank: 'A',
        cost: '12 000',
        range: '[Я] На себя',
        desc: 'Мгновенное копирование физического тайдзюцу или стихийной техники оппонента при совпадении стихийных элементов.'
      },
      {
        id: 'u4',
        name: 'Катон: Рюка но Дзюцу (Огонь дракона)',
        rank: 'B',
        cost: '10 000',
        range: '[С] Средняя (10–25м)',
        desc: 'Направленный струйный поток огня высокой концентрации, движущийся по натянутым проволокам или прямой траектории.'
      }
    ]
  },
  {
    clan: 'Хьюга',
    tag: 'Страж',
    description: 'Благороднейший древний клан Конохи, прямые потомки Хамуры Ооцуцуки. Обладатели всевидящего ока Бьякуган и закрытого стиля Мягкой Ладони (Дзюкен), поражающего внутренние органы и тенкецу.',
    passives: [
      'Круговой обзор на 360° (за исключением 1° слепой зоны у первого шейного позвонка)',
      'Видение циркуляции и узлов чакры сквозь любые физические препятствия и дым',
      'Способность испускать чакру из любой поры своего тела'
    ],
    eye: {
      name: 'Бьякуган (3 этап)',
      description: 'Белый глаз максимального раскрытия. Видит все 361 точку чакры (тенкецу) и мельчайшие микроканалы чакровой системы на дистанции до 1 км.',
      stage: '3 этап (Максимальная ступень)',
      bonuses: 'Предвидение +25%, Точность +25%, Абсолютное видение сквозь преграды',
      upkeep: '2 000 ед./ход'
    },
    baseSpeed: 23,
    baseReaction: 180,
    chakra: 620000,
    elements: ['Ветер', 'Вода'],
    autoJutsu: [
      {
        id: 'h1',
        name: 'Дзюкен: Удар мягкой ладони',
        rank: 'C',
        cost: '3 000',
        range: '[К] Контактная (<3м)',
        desc: 'Точечный укол концентрированной чакрой прямо в каналы врага, наносящий урон внутренним органам в обход внешней брони.'
      },
      {
        id: 'h2',
        name: 'Хаккэ Рокудзюён Сё (64 удара небес)',
        rank: 'A',
        cost: '25 000',
        range: '[К] Контактная (<3м)',
        desc: 'Виртуозная серия из 64 ударов в круге Багуа. Полностью блокирует циркуляцию чакры цели на 2 раунда боя.'
      },
      {
        id: 'h3',
        name: 'Хаккэ Сё Кайтен (Небесный вихрь)',
        rank: 'B',
        cost: '12 000',
        range: '[Я] Вокруг себя (360°)',
        desc: 'Выброс чакры из всех пор тела с резким круговым вращением. Абсолютная защита, отбивающая любые атаки до ранга A.'
      },
      {
        id: 'h4',
        name: 'Хаккэ Кусё (Воздушная ладонь)',
        rank: 'B',
        cost: '9 000',
        range: '[С] Средняя (до 15м)',
        desc: 'Дистанционный выброс вакуумного снаряда чакры высокой плотности, сбивающий с ног и отбрасывающий врага.'
      }
    ]
  },
  {
    clan: 'Удзумаки',
    tag: 'Ресурсный',
    description: 'Легендарный клан долгожителей из разрушенной Деревни Скрытого Водоворота. Отличаются алыми волосами, титаническим запасом жизненной силы, естественной регенерацией и непревзойденными фуиндзюцу.',
    passives: [
      'Колоссальный запас чакры (от 1 000 000+ единиц)',
      'Скидка 20% на расход чакры для всех техник запечатывания и барьеров',
      'Естественная пассивная регенерация средних повреждений каждый ход'
    ],
    eye: {
      name: 'Аура жизненной силы Водоворота',
      description: 'Чистейшая жизненная энергия предков. Позволяет выживать при фатальных повреждениях и мгновенно стабилизировать каналы чакры.',
      stage: 'Врожденное наследие крови',
      bonuses: 'Жизненный тонус +50%, Пассивный реген +15 000 чакры/ход',
      upkeep: 'Пассивно (0)'
    },
    baseSpeed: 22,
    baseReaction: 200,
    chakra: 1150000,
    elements: ['Вода', 'Ветер'],
    autoJutsu: [
      {
        id: 'uz1',
        name: 'Конго Фуса (Адамантиновые цепи)',
        rank: 'A',
        cost: '20 000',
        range: '[С] Средняя (до 25м)',
        desc: 'Материализация нерушимых золотых цепей чакры из спины. Сковывают тело, парализуют движения и подавляют чакру даже Биджу.'
      },
      {
        id: 'uz2',
        name: 'Укушение исцеления',
        rank: 'B',
        cost: '15 000',
        range: '[Я] На себя',
        desc: 'Ускоренная регенерация клеток, мгновенно затягивающая глубокие колотые, рваные и термические раны.'
      },
      {
        id: 'uz3',
        name: 'Печать подавления чакры',
        rank: 'B',
        cost: '10 000',
        range: '[К] Контактная (<3м)',
        desc: 'Контактное наложение формулы печати на плоть оппонента, безвозвратно сжигающее 50 000 единиц его текущей чакры.'
      }
    ]
  },
  {
    clan: 'Сенджу',
    tag: 'Основа',
    description: '«Клан тысячи рук», основатели Конохи и носители Тела Мудреца. Обладают невероятной физической стойкостью, огромной витальностью и доступом к уникальному Кеккей Генкай стихии Дерева (Мокутон).',
    passives: [
      '+25% к стойкости против физических и кинетических ударов',
      'Быстрое срастание переломов и заживление мышечных волокон',
      'Стихийный резонанс земли и воды, рождающий живую древесину'
    ],
    eye: {
      name: 'Тело Мудреца (Ян-чакра)',
      description: 'Абсолютная гармония физической и духовной энергии, позволяющая наделять чакру жизненной силой растений.',
      stage: 'Наследие Асуры',
      bonuses: 'Физическая сила +30%, Сокращение времени восстановления',
      upkeep: 'Пассивно (0)'
    },
    baseSpeed: 23,
    baseReaction: 195,
    chakra: 880000,
    elements: ['Земля', 'Вода'],
    autoJutsu: [
      {
        id: 's1',
        name: 'Мокутон: Мокудзёхэки (Древесный купол)',
        rank: 'B',
        cost: '10 000',
        range: '[Я] Вокруг себя',
        desc: 'Ряд переплетающихся прочных деревянных брусьев вырастает из земли, формируя полусферический защитный купол.'
      },
      {
        id: 's2',
        name: 'Мокутон: Дзюкай Котан (Рождение густого леса)',
        rank: 'S',
        cost: '60 000',
        range: '[О] Зона всей арены',
        desc: 'Превращает поле боя в бушующий массив гигантских деревьев. Корни и ветви связывают и лишают подвижности оппонента.'
      },
      {
        id: 's3',
        name: 'Мокутон: Моку Бунсин (Древесный клон)',
        rank: 'A',
        cost: '15 000',
        range: '[Б] Ближняя',
        desc: 'Клон из органической древесины. Способен применять техники, сливаться с растениями и неотличим даже для додзюцу.'
      }
    ]
  },
  {
    clan: 'Сабаку',
    tag: 'Бастион',
    description: 'Владыки песков Сунагакуре. Владеют особой духовной связью с минералами пустыни и уникальной автономной защитой песка, реагирующей на угрозы быстрее мысли шиноби.',
    passives: [
      'Песок реагирует автономно, блокируя входящие удары со слепых зон',
      '+20% к мощи техник на открытых песчаных аренах',
      'Возможность левитации на песчаном диске'
    ],
    eye: {
      name: 'Третий глаз песка (Дайсан но Мэ)',
      description: 'Сферическое парящее око из спрессованного песка, подключающееся оптическим чакровым нервом к мозгу хозяина.',
      stage: 'Разведывательное додзюцу',
      bonuses: 'Предвидение атак со спины +25%, Обзор через дым и туман',
      upkeep: '1 000 ед./ход'
    },
    baseSpeed: 21,
    baseReaction: 210,
    chakra: 720000,
    elements: ['Ветер', 'Земля'],
    autoJutsu: [
      {
        id: 'sb1',
        name: 'Суна но Мамори (Автономный щит песка)',
        rank: 'B',
        cost: '8 000',
        range: '[Я] Вокруг себя',
        desc: 'Стена из спрессованного песка мгновенно встает на пути атаки без складывания печатей, парируя удары до ранга B.'
      },
      {
        id: 'sb2',
        name: 'Сабаку Кью (Песчаный гроб)',
        rank: 'A',
        cost: '22 000',
        range: '[С] Средняя (до 20м)',
        desc: 'Потоки песка оплетают тело противника, плотно обездвиживая его и блокируя возможность складывать печати.'
      },
      {
        id: 'sb3',
        name: 'Сабаку Сосо (Песчаные похороны)',
        rank: 'A',
        cost: '25 000',
        range: '[С] Средняя',
        desc: 'Колоссальное сжатие песка после песчаного гроба. Размозжает броню и наносит тяжелые травмы.'
      },
      {
        id: 'sb4',
        name: 'Суна но Ёрой (Песчаная броня)',
        rank: 'B',
        cost: '10 000 + 4 000/ход',
        range: '[Я] На себя',
        desc: 'Тонкий монолитный слой песка, покрывающий кожу. Гасит кинетический урон, но слегка утяжеляет тело.'
      }
    ]
  },
  {
    clan: 'Сюнрай',
    tag: 'Скоростной',
    description: 'Клан «Мгновенной Молнии». Их нервная система и мышечные волокна модифицированы поколениями биоэлектрических тренировок, позволяя достигать запредельных скоростей передвижения.',
    passives: [
      'Рекордная базовая физическая скорость (до 33 м/с)',
      'Сверхбыстрое время нервной реакции (120–140 мс)',
      '+25% к дистанции уклонений и мгновенных рывков'
    ],
    eye: {
      name: 'Предел тела (3 уровень)',
      description: 'Биоэлектрический разгон синапсов головного мозга и двигательных нейронов до абсолютного анатомического лимита.',
      stage: '3 уровень',
      bonuses: 'Скорость +35%, Время нервной реакции −25мс',
      upkeep: '2 500 ед./ход'
    },
    baseSpeed: 31,
    baseReaction: 135,
    chakra: 590000,
    elements: ['Молния'],
    autoJutsu: [
      {
        id: 'sn1',
        name: 'Вспышка Сюнрай (Райко Сюнсин)',
        rank: 'A',
        cost: '16 000',
        range: '[М] [К] Рывок на 25м',
        desc: 'Сверхзвуковой спринт за спину противника на скорости ×2 от базовой с нанесением мгновенного колющего выпада.'
      },
      {
        id: 'sn2',
        name: 'Предел тела: Электрический импульс',
        rank: 'B',
        cost: '10 000/ход',
        range: '[Я] На себя',
        desc: 'Непрерывный электрический стимул мышц: повышает скорость бега и рывков на +30%.'
      },
      {
        id: 'sn3',
        name: 'Райдан (Импульсный удар)',
        rank: 'B',
        cost: '9 000',
        range: '[К] Контактная (<3м)',
        desc: 'Концентрированный разряд в солнечное сплетение, вызывающий спазм диафрагмы и потерю равновесия.'
      }
    ]
  },
  {
    clan: 'Кинган',
    tag: 'Аналитик',
    description: 'Клан Канэ — хранители «золотого ока». Глаза сияют золотом с концентрическими кольцами. Обладают даром структурного анализа: видят линии напряжений барьеров и слабые точки любой защиты.',
    passives: [
      'Аналитическое зрение: видит структурные дефекты любых печатей и щитов',
      'Защита врага ослабевает на 2 ступени ранга против ударов носителя Кингана',
      '+15% Точности при выцеливании жизненно важных центров'
    ],
    eye: {
      name: 'Додзюцу Кинган (3 кольца)',
      description: 'Три концентрических золотых кольца вокруг зрачка. Вскрывает уязвимости в защите противника (щит ранга B держит лишь как D).',
      stage: '3 кольца (Максимальная ступень)',
      bonuses: 'Предвидение +35%, Точность +20%, Снижение ранга вражеской брони на 2 ступени',
      upkeep: '2 200 ед./ход'
    },
    baseSpeed: 23,
    baseReaction: 200,
    chakra: 620000,
    elements: ['Земля'],
    autoJutsu: [
      {
        id: 'k1',
        name: 'Катати но Кайсэки (Анализ формы)',
        rank: 'C',
        cost: '4 000',
        range: '[Я] На себя',
        desc: 'Краткий визуальный осмотр стойки врага. Дает +10% Точности на следующую проводимую атаку.'
      },
      {
        id: 'k2',
        name: 'Кинбари (Золотая игла)',
        rank: 'B',
        cost: '9 000',
        range: '[К] Контактная (<3м)',
        desc: 'Точечный укол в скрытую слабость защиты. Отложенное разрушение брони проявляется через 1 раунд.'
      },
      {
        id: 'k3',
        name: 'Хакай Тэн (Разлом)',
        rank: 'A',
        cost: '20 000',
        range: '[К] Контактная (<3м)',
        desc: 'Мощнейший направленный удар в вычисленную структурную брешь барьера или брони оппонента.'
      }
    ]
  },
  {
    clan: 'Синкай',
    tag: 'Гибрид',
    description: 'Потомки прибрежных шиноби Страны Воды. Их кровь хранит приливную мощь океана, а в глазах мерцают лазурные капли Аойгана. Чувствуют чакру как течение водных глубин.',
    passives: [
      'Гибридное развитие: одновременное усиление телесных параметров и точности',
      '+20% к мощи техник на водоемах и при наличии источников воды',
      'Сенсорное восприятие вибраций влаги в воздухе'
    ],
    eye: {
      name: 'Додзюцу Аойган (3 капли)',
      description: 'Три лазурные капли на радужке. Синхронизирует мышечный тонус с течением чакры, обеспечивая взрывной прирост скорости и силы.',
      stage: '3 капли (Максимальная ступень)',
      bonuses: 'Скорость +30%, Усиление техник +25%, Предвидение +25%',
      upkeep: '2 200 ед./ход'
    },
    baseSpeed: 25,
    baseReaction: 190,
    chakra: 670000,
    elements: ['Вода'],
    autoJutsu: [
      {
        id: 'sk1',
        name: 'Мансю но Нами (Приливная волна)',
        rank: 'B',
        cost: '10 000',
        range: '[С] Средняя (до 20м)',
        desc: 'Короткий, но колоссальной силы гидроудар спрессованной чакрой, сбивающий цель с ног.'
      },
      {
        id: 'sk2',
        name: 'Кудзира но Хада (Кожа кита)',
        rank: 'C',
        cost: '6 000',
        range: '[Я] На себя',
        desc: 'Временное уплотнение кожного покрова водной пленкой чакры, поглощающее кинетический урон легких атак.'
      },
      {
        id: 'sk3',
        name: 'Синкай Дассю (Глубинный рывок)',
        rank: 'B',
        cost: '9 000',
        range: '[Я] [М] Рывок на 12м',
        desc: 'Резкий бросок вперед на скорости ×1.8 от текущей физической скорости по инерции водной чакры.'
      }
    ]
  },
  {
    clan: 'Тэнрай',
    tag: 'Стихийник',
    description: 'Потомки горных шиноби Страны Огня и Молний. Носители Икадзутигана («глаза громового молота»). Способны считывать нервные импульсы врага еще до сокращения его мышц.',
    passives: [
      'Врожденная защита от внезапности (всегда минимум 15% Предвидения даже со спины и без глаз)',
      'Сенсорика 10м (чувствует намерения и чакру сквозь дым и стены)',
      'Иммунитет к парализующим и шоковым эффектам техник стихии Молнии'
    ],
    eye: {
      name: 'Додзюцу Икадзутиган (3 разряда)',
      description: 'Голубые разряды статического электричества под кожей век. Считывает биоэлектрические импульсы нервной системы цели до движения тела.',
      stage: '3 разряда (Максимальная ступень)',
      bonuses: 'Предвидение +42%, Скорость +20%, Усиление техник Молнии +25%',
      upkeep: '2 200 ед./ход'
    },
    baseSpeed: 26,
    baseReaction: 175,
    chakra: 680000,
    elements: ['Молния'],
    autoJutsu: [
      {
        id: 'tr1',
        name: 'Синкэй Сасу (Нервный укол)',
        rank: 'C',
        cost: '5 000',
        range: '[К] Контактная (<3м)',
        desc: 'Легкий разряд в нервный узел оппонента при касании, замедляющий его реакцию на 30 миллисекунд.'
      },
      {
        id: 'tr2',
        name: 'Сэйдэн Кэккай (Статический барьер)',
        rank: 'B',
        cost: '9 000',
        range: '[Я] Вокруг себя',
        desc: 'Электростатическое поле вокруг тела, рассеивающее и заземляющее чужие электрические техники.'
      },
      {
        id: 'tr3',
        name: 'Хибана Хирацуки (Искровой всплеск)',
        rank: 'C',
        cost: '4 000',
        range: '[Б] Ближняя (до 8м)',
        desc: 'Светошумовая вспышка искр, дезориентирующая органы чувств противника в ближнем бою.'
      },
      {
        id: 'tr4',
        name: 'Райтэй но Тання (Кузница грома)',
        rank: 'B',
        cost: '12 000',
        range: '[К] Контактная (<3м)',
        desc: 'Удар оружием или кулаком: наносит урон ранга B и вызывает онемение мышц цели со снижением ее точности.'
      }
    ]
  }
];

const NINJA_NAMES = [
  'Саске', 'Неджи', 'Итачи', 'Гаара', 'Шикамару', 'Какаши', 'Тобирама', 'Минато', 'Шин', 'Райден', 'Кеншин', 'Дзюго', 'Шино', 'Киба', 'Хината'
];

// 9 Каноничных кланов из Раздела 1 и Раздела 3 правил
const CANONICAL_CLAN_NAMES = [
  'Хьюга', 'Учиха', 'Удзумаки', 'Сенджу', 'Сабаку', 'Сюнрай', 'Кинган', 'Синкай', 'Тэнрай'
];

/**
 * Каноническая генерация родословной шиноби по Разделу 1 правил:
 * Шаг А — сколько кланов в родословной:
 *   1 клан (чистый) — 55%
 *   2 клана (смешанный) — 40%
 *   3 клана (тройная смесь) — 5%
 * Шаг Б — равновероятный выбор из 9 каноничных кланов.
 */
function rollLineageClans() {
  const rollStepA = Math.random() * 100;
  let count = 1;
  if (rollStepA < 55) {
    count = 1;
  } else if (rollStepA < 95) {
    count = 2;
  } else {
    count = 3;
  }

  // Перемешиваем список 9 кланов
  const shuffled = [...CANONICAL_CLAN_NAMES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Вспомогательный поиск шаблона клана
 */
function findClanTemplate(clanName) {
  const clean = (clanName || '').trim().toLowerCase();
  return CLAN_TEMPLATES.find(t => 
    t.clan.toLowerCase() === clean ||
    (clean.includes('узумаки') && t.clan.toLowerCase().includes('удзумаки')) ||
    (clean.includes('удзумаки') && t.clan.toLowerCase().includes('узумаки')) ||
    (clean.includes('тэнрай') && t.clan.toLowerCase().includes('тенрай')) ||
    (clean.includes('тенрай') && t.clan.toLowerCase().includes('тэнрай'))
  ) || CLAN_TEMPLATES[0];
}

/**
 * Генерация персонажа с полной поддержкой смешения кланов и глаз
 * (Чистая кровь 55%, Смесь 2 кланов 40%, Тройная смесь 5%) по Разделам 1 и 3 правил.
 */
function generateCharacter(customName, customNinja = null) {
  // 1. ОПРЕДЕЛЕНИЕ КЛАНОВ В РОДОСЛОВНОЙ
  let clans = [];
  if (customNinja) {
    if (Array.isArray(customNinja.clans) && customNinja.clans.length > 0) {
      clans = customNinja.clans.map(c => c.trim()).filter(Boolean);
    } else if (customNinja.clan) {
      clans = String(customNinja.clan).split(/[+,\/]+/).map(c => c.trim()).filter(Boolean);
    }
  }

  // Если кланы не заданы игроком — бросаем каноничную родословную (55% / 40% / 5%)
  if (!clans || clans.length === 0) {
    clans = rollLineageClans();
  }

  const isMixed = clans.length > 1;
  const isTriple = clans.length >= 3;
  const clanTemplates = clans.map(c => findClanTemplate(c));
  const primaryTemplate = clanTemplates[0] || CLAN_TEMPLATES[0];

  // 2. ИМЯ И ПОЗЫВНОЙ
  const clanTitle = clans.join(' + ');
  const combinedTag = clanTemplates.map(t => t.tag).join(' / ');
  const name = customName && customName.trim()
    ? customName.trim()
    : `${NINJA_NAMES[Math.floor(Math.random() * NINJA_NAMES.length)]} (${clanTitle})`;

  // 3. ЧАКРА И РЕГЕНЕРАЦИЯ (Раздел 1)
  // - Родословная БЕЗ Удзумаки: 300 000–1 050 000, реген +5 000/ход
  // - Смешанная родословная С Удзумаки (или Сенджу): 420 000–1 150 000, реген +8 000/ход (+ живучесть)
  // - Чистый Удзумаки: 500 000–1 250 000, реген +11 000/ход
  const hasUzumaki = clans.some(c => c.toLowerCase().includes('удзумаки') || c.toLowerCase().includes('узумаки'));
  const hasSenju = clans.some(c => c.toLowerCase().includes('сенджу'));
  const isPureUzumaki = hasUzumaki && clans.length === 1;

  let minChakra = 300000;
  let maxChakra = 1050000;
  let chakraRegen = 5000;

  if (isPureUzumaki) {
    minChakra = 500000;
    maxChakra = 1250000;
    chakraRegen = 11000;
  } else if (hasUzumaki) {
    minChakra = 420000;
    maxChakra = 1150000;
    chakraRegen = 8000;
  } else if (hasSenju) {
    minChakra = 420000;
    maxChakra = 1150000;
    chakraRegen = 5000; // У Сенджу реген ран пассивный, чакра по порогу смеси
  }

  // Округляем до 5 000 по правилам
  const chakraSteps = Math.floor((maxChakra - minChakra) / 5000);
  let chakraPool = minChakra + Math.floor(Math.random() * (chakraSteps + 1)) * 5000;

  // 4. ПАССИВНЫЕ ЧЕРТЫ И ТЕХНИКИ КЛАНОВ (суммируются все кланы родословной)
  const passives = [];
  const autoJutsu = [];

  // Добавляем описание родословной
  let lineageDescription = isMixed 
    ? `Смешанное наследие крови [${clanTitle}]. Объединяет дары и тайные техники нескольких великих кланов.`
    : primaryTemplate.description;

  // Сбор уникальных пассивок и клановых техник от каждого клана
  clanTemplates.forEach(t => {
    (t.passives || []).forEach(p => {
      if (!passives.includes(p)) passives.push(p);
    });
    (t.autoJutsu || []).forEach(j => {
      if (!autoJutsu.some(aj => aj.id === j.id || aj.name === j.name)) {
        autoJutsu.push(j);
      }
    });
  });

  // Удзумаки: проверка пробуждения «Вечная спираль» (30% при чакре >= 1.1M чистый / >= 1.0M смесь)
  let hasEternalSpiral = false;
  if (hasUzumaki) {
    const spiralThreshold = isPureUzumaki ? 1100000 : 1000000;
    if (chakraPool >= spiralThreshold && Math.random() * 100 < 30) {
      hasEternalSpiral = true;
      if (isPureUzumaki) {
        chakraRegen += 5000; // итого 16 000/ход
        passives.push('🌀 Пробуждение Удзумаки «Вечная спираль» (+16 000 чакры/ход реген)');
      } else {
        chakraRegen += 2500; // итого 10 500/ход
        passives.push('🌀 Пробуждение Удзумаки «Вечная спираль» (смесь: +10 500 чакры/ход реген)');
      }
      autoJutsu.push({
        id: 'uz_spiral_chains',
        name: '«Цепи бесконечности» (Конго Фуса Эйэн)',
        rank: 'S',
        cost: '45 000',
        range: '[С] Средняя (до 25м)',
        desc: 'Высшая версия золотых цепей. Держат цель 4 раунда вместо 2, каждая попытка вырваться наносит урон.'
      });
      autoJutsu.push({
        id: 'uz_ancestral_heal',
        name: '«Родовая регенерация»',
        rank: 'S',
        cost: '80 000',
        range: '[Я] На себя',
        desc: 'Раз за бой мгновенно излечивает ЛЮБУЮ рану, включая критическую.'
      });
    }
  }

  // Сенджу: пассивное затягивание ран каждый ход без затрат чакры
  if (hasSenju && !passives.some(p => p.includes('Сенджу: Пассивная регенерация'))) {
    passives.push('🌳 Сенджу: Пассивная регенерация (каждый раунд автоматически затягивает лёгкие ранения и снимает усталость без затрат чакры)');
  }

  // Сабаку: пассивная Абсолютная защита
  const hasSabaku = clans.some(c => c.toLowerCase().includes('сабаку'));
  if (hasSabaku && !passives.some(p => p.includes('Абсолютная защита'))) {
    passives.push('🛡️ Сабаку: Пассивная Абсолютная защита (автоматически блокирует одну атаку D-B ранга за раунд за 5 000 чакры; пробивается скоростью >25 м/с или A/S рангом)');
  }

  // 5. ФИЗИЧЕСКАЯ СКОРОСТЬ И РЕАКЦИЯ (Раздел 1 и Раздел 3)
  const hasShunrai = clans.some(c => c.toLowerCase().includes('сюнрай'));
  const hasTenrai = clans.some(c => c.toLowerCase().includes('тэнрай') || c.toLowerCase().includes('тенрай'));

  let baseSpeed = 22;
  let baseReaction = 220;
  let hasLimitOfBody = false;
  let shunraiLevel = 0;

  if (hasShunrai) {
    // Клан Сюнрай: ступени тела 1–3 (30% / 30% / 40%)
    const sRoll = Math.random() * 100;
    let sSpeed = 25;
    let sReaction = 170;
    if (sRoll >= 60) {
      shunraiLevel = 3;
      sSpeed = 30 + Math.floor(Math.random() * 3); // 30–32 м/с
      sReaction = 120 + Math.floor(Math.random() * 21); // 120–140 мс
      // Пробуждение «Предел тела» 35%
      if (Math.random() * 100 < 35) {
        hasLimitOfBody = true;
      }
    } else if (sRoll >= 30) {
      shunraiLevel = 2;
      sSpeed = 27 + Math.floor(Math.random() * 4); // 27–30 м/с
      sReaction = 140 + Math.floor(Math.random() * 21); // 140–160 мс
    } else {
      shunraiLevel = 1;
      sSpeed = 24 + Math.floor(Math.random() * 4); // 24–27 м/с
      sReaction = 160 + Math.floor(Math.random() * 21); // 160–180 мс
    }

    if (clans.length === 1) {
      // Чистый Сюнрай
      if (hasLimitOfBody) {
        baseSpeed = 34 + Math.floor(Math.random() * 5); // 34–38 м/с
        baseReaction = 80 + Math.floor(Math.random() * 31); // 80–110 мс
        passives.push('⚡ Пробуждение Сюнрай «Предел тела» (Скорость 34-38 м/с, Реакция 80-110 мс)');
        autoJutsu.push({
          id: 'sn_zero_reaction',
          name: '«Абсолютный ноль реакции» (Дзэттай Рэй Ханнō)',
          rank: 'S',
          cost: '60 000',
          range: '[Я] На себя',
          desc: 'На 1 раунд боец получает ДОПОЛНИТЕЛЬНОЕ действие, срабатывающее раньше действий противника! После — откат: следующий раунд -25% ко всем параметрам.'
        });
      } else {
        baseSpeed = sSpeed;
        baseReaction = sReaction;
      }
    } else {
      // Сюнрай в смеси (Раздел 3): среднее между ступенью Сюнрая и обычным броском 18–26 м/с / 180–260 мс
      const normSpeed = 18 + Math.floor(Math.random() * 9); // 18-26
      const normReaction = 180 + Math.floor(Math.random() * 81); // 180-260

      if (hasLimitOfBody) {
        const awakenSpeed = 34 + Math.floor(Math.random() * 5);
        const awakenReact = 80 + Math.floor(Math.random() * 31);
        baseSpeed = Math.round((awakenSpeed + normSpeed) / 2); // ~26-32 м/с
        baseReaction = Math.round((awakenReact + normReaction) / 2); // ~130-185 мс
        passives.push('⚡ Пробуждение Сюнрай «Предел тела» (в смеси: Скорость ~28 м/с, Реакция ~155 мс)');
        autoJutsu.push({
          id: 'sn_zero_reaction',
          name: '«Абсолютный ноль реакции» (Дзэттай Рэй Ханнō)',
          rank: 'S',
          cost: '60 000',
          range: '[Я] На себя',
          desc: 'На 1 раунд боец получает ДОПОЛНИТЕЛЬНОЕ действие раньше противника!'
        });
      } else {
        baseSpeed = Math.round((sSpeed + normSpeed) / 2);
        baseReaction = Math.round((sReaction + normReaction) / 2);
      }
    }
  } else if (hasTenrai) {
    // Клан Тэнрай: чистый 21–29 м/с / 150–220 мс; в смеси 19–27 м/с / 165–235 мс
    if (clans.length === 1) {
      baseSpeed = 21 + Math.floor(Math.random() * 9);
      baseReaction = 150 + Math.floor(Math.random() * 71);
    } else {
      baseSpeed = 19 + Math.floor(Math.random() * 9);
      baseReaction = 165 + Math.floor(Math.random() * 71);
    }
  } else {
    // Обычный бросок: 18–26 м/с / 180–260 мс
    baseSpeed = 18 + Math.floor(Math.random() * 9);
    baseReaction = 180 + Math.floor(Math.random() * 81);
  }

  // 6. СТИХИИ (Раздел 1)
  // Тэнрай гарантированно имеет Молнию (+ 40% шанс на 2-ю стихию)
  let elements = (customNinja && Array.isArray(customNinja.elements) && customNinja.elements.length > 0)
    ? [...customNinja.elements]
    : [];

  if (elements.length === 0) {
    const ALL_ELEMENTS = ['Огонь', 'Ветер', 'Молния', 'Земля', 'Вода'];
    if (hasTenrai) {
      elements.push('Молния');
      if (Math.random() * 100 < 40) {
        const others = ALL_ELEMENTS.filter(e => e !== 'Молния');
        elements.push(others[Math.floor(Math.random() * others.length)]);
      }
    } else {
      const elRoll = Math.random() * 100;
      let elCount = 1;
      if (elRoll < 60) elCount = 1;
      else if (elRoll < 95) elCount = 2;
      else elCount = 3;

      const shuffledEl = [...ALL_ELEMENTS].sort(() => Math.random() - 0.5);
      elements = shuffledEl.slice(0, elCount);
    }
  }

  // 7. БОЕВОЙ АРХЕТИП (если выбран)
  let archetypeTitle = 'Универсал';
  if (customNinja && customNinja.archetype) {
    const arch = customNinja.archetype;
    if (arch === 'taijutsu' || arch === 'Тайдзюцу-рашер') {
      archetypeTitle = '⚡ Тайдзюцу-рашер';
      baseSpeed = Math.max(34, baseSpeed + 8);
      baseReaction = Math.max(115, baseReaction - 40);
      passives.push('Сверхзвуковой разгон: рывки и уклонения на скорости 35+ м/с');
      passives.push('Физическое доминирование: приемы тайдзюцу игнорируют легкие барьеры');
      autoJutsu.push({
        id: 'arch_tai1',
        name: 'Коноха Сэппу (Вихрь Конохи)',
        rank: 'B',
        cost: '6 000',
        range: '[К] Контактная (<3м)',
        desc: 'Молниеносная серия сокрушительных нижних и верхних вертушек на предельной скорости.'
      });
    } else if (arch === 'genjutsu' || arch === 'Гендзюцу-стратег') {
      archetypeTitle = '🌀 Гендзюцу-стратег';
      passives.push('Мастер обмана чувств: чужие иллюзии ранга C-B рассеиваются автоматически');
      autoJutsu.push({
        id: 'arch_gen1',
        name: 'Неханка но Дзюцу (Храм иллюзорного сна)',
        rank: 'A',
        cost: '14 000',
        range: '[С] Средняя (до 20м)',
        desc: 'Иллюзорный дождь из белых перьев: вводит всех противников в оцепенение и сбивает фокус чакры.'
      });
    } else if (arch === 'ninjutsu' || arch === 'Ниндзюцу-артиллерия') {
      archetypeTitle = '💥 Ниндзюцу-артиллерия';
      chakraPool += 180000;
      passives.push('Титанический калибр: +20% к радиусу поражения любых стихийных техник');
      autoJutsu.push({
        id: 'arch_nin1',
        name: 'Стихийный разлом (Удар катаклизма)',
        rank: 'A',
        cost: '20 000',
        range: '[Д] Дальняя (до 35м)',
        desc: 'Массированный выброс стихийной мощи, сминающий ландшафт и укрытия противника.'
      });
    } else if (arch === 'medical' || arch === 'Ирьёнин' || arch === 'Ниндзя-медик') {
      archetypeTitle = '💚 Ирьёнин (Ниндзя-медик)';
      chakraRegen += 4000;
      passives.push('Мистическая ладонь: исцеление ранений и передача чакры союзнику');
      autoJutsu.push({
        id: 'arch_med1',
        name: 'Сёсэн Дзюцу (Мистическая ладонь исцеления)',
        rank: 'A',
        cost: '12 000',
        range: '[К] Контактная (<3м)',
        desc: 'Мгновенно затягивает раны себе или союзнику по команде.'
      });
    }
  }

  // 8. ХВОСТАТЫЙ (Раздел 1)
  let tails = 0;
  if (customNinja && customNinja.specialTrait === 'jinchuriki') {
    tails = 3;
  } else if (!customNinja) {
    // Случайный бросок по шансам (1 хвост 5%, 2 3.5%, 3 2.5%, 4 1.5%, 5 1%, 6 0.6%, 7 0.3%, 8 0.2%, 9 0.1%)
    const jRoll = Math.random() * 100;
    if (jRoll < 0.1) tails = 9;
    else if (jRoll < 0.3) tails = 8;
    else if (jRoll < 0.6) tails = 7;
    else if (jRoll < 1.2) tails = 6;
    else if (jRoll < 2.2) tails = 5;
    else if (jRoll < 3.7) tails = 4;
    else if (jRoll < 6.2) tails = 3;
    else if (jRoll < 9.7) tails = 2;
    else if (jRoll < 14.7) tails = 1;
  }

  if (tails > 0) {
    chakraPool += tails * 100000;
    passives.push(`🔥 Джинчурики (${tails} хвост.): Покров чакры Биджу + ускоренная регенерация ран`);
    autoJutsu.push({
      id: 'bijuu_cloak',
      name: `Покров Хвостатого (${tails} хвост.)`,
      rank: 'A',
      cost: tails <= 2 ? '10 000/ход' : tails <= 4 ? '20 000/ход' : tails <= 7 ? '35 000/ход' : '50 000/ход',
      range: '[Я] На себя',
      desc: `Покров едкой чакры: Скорость +${tails <= 2 ? '20' : tails <= 4 ? '40' : tails <= 7 ? '65' : '90'}%, Усиление +${tails <= 2 ? '10' : tails <= 4 ? '25' : tails <= 7 ? '40' : '60'}%. Быстрое затягивание ран.`
    });
    if (tails >= 3) {
      autoJutsu.push({
        id: 'bijuu_dama',
        name: 'Бидзюу-дама (Шар хвостатого зверя)',
        rank: 'S',
        cost: tails >= 7 ? '150 000' : '100 000',
        range: '[Д] Дальняя (до 40м)',
        desc: 'Сверхплотный шар сжатой положительной и отрицательной чакры. Сметает ландшафт и любые барьеры.'
      });
    }
    if (tails >= 8) {
      autoJutsu.push({
        id: 'full_bijuu_mode',
        name: 'Полный Бидзюу (Трансформация)',
        rank: 'S',
        cost: '80 000/ход',
        range: '[Я] На себя',
        desc: 'Полное воплощение колоссального Зверя. Физическая сила ×2, удары сокрушительной мощи.'
      });
    }
  }

  // 9. КЕККЕЙ ГЕНКАЙ (25% шанс по Разделу 1)
  let kekkeiGenkaiTrait = customNinja?.specialTrait;
  if (!kekkeiGenkaiTrait && Math.random() * 100 < 25) {
    const kkgOptions = ['hyoton', 'yoton', 'shoton', 'jiton'];
    kekkeiGenkaiTrait = kkgOptions[Math.floor(Math.random() * kkgOptions.length)];
  }

  if (kekkeiGenkaiTrait === 'hyoton') {
    passives.push('❄️ Кеккей Генкай Хётон (Стихия Льда)');
    if (!elements.includes('Лед')) elements.push('Лед');
    autoJutsu.push({
      id: 'kkg_ice1',
      name: 'Хётон: Макё Хёсё (Ледяные зеркала демонов)',
      rank: 'A',
      cost: '30 000',
      range: '[С] Средняя (до 25м)',
      desc: 'Купол ледяных зеркал, перемещение между отражениями со сверхзвуковой скоростью.'
    });
    autoJutsu.push({
      id: 'kkg_ice2',
      name: 'Хётон: Ледяные шипы',
      rank: 'B',
      cost: '15 000',
      range: '[С] Средняя',
      desc: 'Шквал ледяных копий и игл.'
    });
  } else if (kekkeiGenkaiTrait === 'yoton') {
    passives.push('🌋 Кеккей Генкай Ётон (Стихия Лавы)');
    if (!elements.includes('Лава')) elements.push('Лава');
    autoJutsu.push({
      id: 'kkg_lava1',
      name: 'Ётон: Расплавляющая лава',
      rank: 'A',
      cost: '35 000',
      range: '[С] Средняя',
      desc: 'Поток вулканической лавы, прожигающий доспехи и преграды.'
    });
    autoJutsu.push({
      id: 'kkg_lava2',
      name: 'Ётон: Лавовый щит',
      rank: 'B',
      cost: '12 000',
      range: '[Я] Вокруг себя',
      desc: 'Щит из магматического камня, отражает атаки до ранга B.'
    });
  } else if (kekkeiGenkaiTrait === 'shoton') {
    passives.push('💎 Кеккей Генкай Сётон (Стихия Кристалла)');
    if (!elements.includes('Кристалл')) elements.push('Кристалл');
    autoJutsu.push({
      id: 'kkg_crys1',
      name: 'Сётон: Кристаллизация',
      rank: 'B',
      cost: '15 000',
      range: '[Б] Ближняя',
      desc: 'Мгновенная кристаллизация материи и техник в нефрит.'
    });
    autoJutsu.push({
      id: 'kkg_crys2',
      name: 'Сётон: Кристальный дракон',
      rank: 'A',
      cost: '28 000',
      range: '[Д] Дальняя',
      desc: 'Исполинский дракон из сплошного кристалла.'
    });
  } else if (kekkeiGenkaiTrait === 'jiton') {
    passives.push('🧲 Кеккей Генкай Дзитон (Стихия Магнетизма)');
    if (!elements.includes('Магнетизм')) elements.push('Магнетизм');
    autoJutsu.push({
      id: 'kkg_mag1',
      name: 'Дзитон: Снаряды железного песка',
      rank: 'B',
      cost: '14 000',
      range: '[С] Средняя',
      desc: 'Залп намагниченных игл и шипов из железного песка.'
    });
    autoJutsu.push({
      id: 'kkg_mag2',
      name: 'Дзитон: Железная глыба Сатэцу',
      rank: 'A',
      cost: '26 000',
      range: '[Д] Дальняя',
      desc: 'Спрессованный монолитный блок из железного песка.'
    });
  }

  // 10. СЕНДЗЮЦУ (3% независимый шанс)
  let hasSenjutsu = customNinja?.specialTrait === 'sage';
  if (!hasSenjutsu && Math.random() * 100 < 3) {
    hasSenjutsu = true;
  }
  if (hasSenjutsu) {
    passives.push('🐸 Врожденное Сендзюцу: мгновенный вход в Режим Мудреца, расход 10 000/ход, без лимита 5 ходов, +15% к усилению техник');
  }

  // 11. КАНОНИЧЕСКАЯ ОБРАБОТКА И СОВМЕЩЕНИЕ ГЛАЗ (ДОДЗЮЦУ)
  // В чистом клане: положенный глаз (100%)
  // В смешанном (2 или 3 клана): каждый глаз пробуждается независимо по 70%
  // При нескольких глазах: ВСЕ активны одновременно!
  let dojutsuObj = null;
  const requestedEyeInput = customNinja?.dojutsuList || customNinja?.dojutsu;
  const isNoneRequested = requestedEyeInput === 'none' ||
    (Array.isArray(requestedEyeInput) && requestedEyeInput.length === 1 && requestedEyeInput[0] === 'none');
  const isAutoRequested = !requestedEyeInput || requestedEyeInput === 'auto' ||
    (Array.isArray(requestedEyeInput) && requestedEyeInput.length === 1 && requestedEyeInput[0] === 'auto');

  if (isNoneRequested) {
    dojutsuObj = DOJUTSU_DATABASE.none;
  } else if (!isAutoRequested) {
    dojutsuObj = resolveMultiDojutsu(requestedEyeInput) || generateDojutsu(clans, false, requestedEyeInput, isMixed);
  } else {
    dojutsuObj = generateDojutsu(clans, false, null, isMixed);
  }

  // Добавляем все техники глаз сверх 30 слотов
  if (dojutsuObj && Array.isArray(dojutsuObj.jutsu)) {
    dojutsuObj.jutsu.forEach(j => {
      if (!autoJutsu.some(existing => existing.id === j.id || existing.name === j.name)) {
        autoJutsu.push(j);
      }
    });
  }

  // Добавляем все пассивки глаз
  if (dojutsuObj && Array.isArray(dojutsuObj.passives)) {
    dojutsuObj.passives.forEach(p => {
      if (!passives.includes(p)) {
        passives.push(`👁️ ${p}`);
      }
    });
  }

  // 12. РАСЧЕТ ЭФФЕКТИВНЫХ БОЕВЫХ СТАТОВ
  // Учитывает синергетический потолок (Shunrai / Tenrai + Dojutsu -> ×0.7) и потолок 90%
  const effective = calculateEffectiveStats(
    { baseSpeed, baseReaction, clan: clanTitle, clans },
    dojutsuObj,
    true
  );

  let eyeData = null;
  if (dojutsuObj && dojutsuObj.id !== 'none') {
    eyeData = {
      id: dojutsuObj.id,
      name: dojutsuObj.name,
      family: dojutsuObj.family,
      stage: dojutsuObj.stageName || dojutsuObj.name,
      description: dojutsuObj.description,
      predvidenie: effective.predvidenie,
      rawPredvidenie: dojutsuObj.predvidenie,
      accuracy: dojutsuObj.accuracy,
      techniqueAmp: dojutsuObj.techniqueAmp || dojutsuObj.lightningAmp || 0,
      speedBonusPercent: dojutsuObj.speedBonusPercent || 0,
      bonuses: `Предвидение +${effective.predvidenie}%, Точность +${dojutsuObj.accuracy}%, Усиление +${dojutsuObj.techniqueAmp || dojutsuObj.lightningAmp || 0}%${dojutsuObj.speedBonusPercent ? `, Скорость +${dojutsuObj.speedBonusPercent}%` : ''}`,
      upkeep: `${dojutsuObj.upkeep.toLocaleString()} ед./ход`,
      upkeepNumber: dojutsuObj.upkeep,
      passives: dojutsuObj.passives || [],
      jutsu: dojutsuObj.jutsu || [],
      activeEyes: dojutsuObj.activeEyes || [dojutsuObj],
      isMultiEye: !!dojutsuObj.isMultiEye
    };
  }

  return {
    name,
    clan: clanTitle,
    clans,
    clanTag: combinedTag,
    archetype: archetypeTitle,
    clanDescription: lineageDescription,
    passives,
    eye: eyeData,
    kekkeiGenkai: eyeData ? eyeData.name : 'Нет додзюцу',
    chakra: chakraPool,
    maxChakra: chakraPool,
    chakraRegen,
    speed: effective.speed,
    baseSpeed,
    reaction: effective.reaction,
    baseReaction,
    predvidenie: effective.predvidenie,
    elements,
    tails,
    hasSenjutsu,
    kekkeiGenkaiTrait,
    hasEternalSpiral,
    hasLimitOfBody,
    shunraiLevel,
    wounds: 'Без ранений (Идеальная форма)',
    activeModes: eyeData ? `Глаза: ${eyeData.name} (АКТИВНЫ)` : 'Базовое состояние',
    isEyeActive: !!eyeData,
    autoJutsu
  };
}

/**
 * Подсчет веса силы бойца по шкале Раздела 1.5 Балансировщика силы
 */
function calculatePowerWeight(character) {
  let weight = 0;
  // Чакра: +1 за каждые полные 150 000 сверх базовых 300 000
  const baseChakraWithoutTails = (character.chakra || 300000) - (character.tails || 0) * 100000;
  if (baseChakraWithoutTails > 300000) {
    weight += Math.floor((baseChakraWithoutTails - 300000) / 150000);
  }
  // +1 за каждую стихию предрасположенности
  weight += (character.elements || []).length;
  // +1 за каждый хвост хвостатого
  weight += (character.tails || 0);

  const clans = Array.isArray(character.clans) ? character.clans : [character.clan || ''];
  const isMixed = clans.length > 1;
  const clanFactor = isMixed ? 0.5 : 1.0;

  if (clans.some(c => c.toLowerCase().includes('сенджу'))) {
    weight += Math.ceil(4 * clanFactor);
  }
  if (clans.some(c => c.toLowerCase().includes('сабаку'))) {
    weight += Math.ceil(3 * clanFactor);
  }
  if (clans.some(c => c.toLowerCase().includes('удзумаки') || c.toLowerCase().includes('узумаки'))) {
    if (character.hasEternalSpiral) {
      weight += Math.ceil(6 * clanFactor);
    } else {
      weight += Math.ceil(3 * clanFactor);
    }
  }
  if (clans.some(c => c.toLowerCase().includes('сюнрай'))) {
    if (character.hasLimitOfBody) {
      weight += Math.ceil(6 * clanFactor);
    } else {
      const lvl = character.shunraiLevel || 2;
      const w = lvl === 1 ? 2 : lvl === 2 ? 3 : 4;
      weight += Math.ceil(w * clanFactor);
    }
  }

  // Веса додзюцу (в смеси вес полный)
  const eye = character.eye;
  if (eye) {
    const eyeList = eye.activeEyes || (eye.id !== 'none' ? [eye] : []);
    eyeList.forEach(e => {
      const eid = e.id || '';
      if (eid === 'rinnegan_awakened') weight += 9;
      else if (eid === 'rinnegan') weight += 6;
      else if (eid === 'mangekyo') weight += 9;
      else if (eid === 'sharingan_3') weight += 3;
      else if (eid === 'sharingan_2') weight += 2;
      else if (eid === 'sharingan_1') weight += 1;
      else if (eid === 'byakugan_awakened') weight += 7;
      else if (eid === 'byakugan_3') weight += 5;
      else if (eid === 'byakugan_2') weight += 4;
      else if (eid === 'byakugan_1') weight += 3;
      else if (eid === 'kingan_awakened') weight += 5;
      else if (eid === 'kingan_3') weight += 4;
      else if (eid === 'kingan_2') weight += 3;
      else if (eid === 'kingan_1') weight += 2;
      else if (eid === 'aoigan_awakened') weight += 6;
      else if (eid === 'aoigan_3') weight += 4;
      else if (eid === 'aoigan_2') weight += 3;
      else if (eid === 'aoigan_1') weight += 2;
      else if (eid === 'ikadzutigan_awakened') weight += 8;
      else if (eid === 'ikadzutigan_3') weight += 6;
      else if (eid === 'ikadzutigan_2') weight += 5;
      else if (eid === 'ikadzutigan_1') weight += 4;
    });
  }

  if (character.hasSenjutsu) weight += 4;
  if (character.kekkeiGenkaiTrait) weight += 3;

  return weight;
}

/**
 * Балансировщик силы по Разделу 1.5 правил
 * Выравнивает бойцов до разницы весов <= 3
 */
function balanceCharacters(char1, char2) {
  let w1 = calculatePowerWeight(char1);
  let w2 = calculatePowerWeight(char2);
  let diff = Math.abs(w1 - w2);
  let iterations = 0;

  while (diff >= 4 && iterations < 3) {
    iterations++;
    const weaker = w1 < w2 ? char1 : char2;

    if (diff >= 7 && (!weaker.eye || !weaker.eye.id.includes('rinnegan'))) {
      weaker.chakra += 150000;
      weaker.maxChakra = weaker.chakra;
      const rinne = DOJUTSU_DATABASE.rinnegan;
      if (!weaker.eye || weaker.eye.id === 'none') {
        weaker.eye = { ...rinne };
      }
      (rinne.jutsu || []).forEach(j => {
        if (!weaker.autoJutsu.some(aj => aj.id === j.id)) weaker.autoJutsu.push(j);
      });
    } else {
      weaker.chakra += 150000;
      weaker.maxChakra = weaker.chakra;
    }

    w1 = calculatePowerWeight(char1);
    w2 = calculatePowerWeight(char2);
    diff = Math.abs(w1 - w2);
  }

  char1.powerWeight = w1;
  char2.powerWeight = w2;
  return { char1, char2 };
}

module.exports = {
  CLAN_TEMPLATES,
  CANONICAL_CLAN_NAMES,
  rollLineageClans,
  generateCharacter,
  calculatePowerWeight,
  balanceCharacters
};
