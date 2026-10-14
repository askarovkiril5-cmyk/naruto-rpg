import React, { useState, useEffect } from 'react';
import { 
  X, User, Sparkles, Zap, Shield, Heart, Eye, Swords, 
  Flame, Wind, Droplets, Mountain, Compass, Check, RotateCcw, Save, Layers, AlertTriangle
} from 'lucide-react';
import { DOJUTSU_OPTIONS, getDojutsuById } from '../data/dojutsuData';

// 9 Каноничных кланов по Разделу 1 и Разделу 3 регламента игры
export const CLAN_OPTIONS = [
  {
    id: 'Учиха',
    name: 'Клан Учиха',
    category: 'Коноха',
    badge: '👁️ Шаринган & Катон',
    desc: 'Мастера высшего огня, проклятие ненависти и трехтомоэвный Шаринган для чтения движений.',
    icon: '🔥',
    defaultElements: ['Огонь', 'Молния'],
    stats: { chakra: '650 000', speed: '24-26 м/с', perk: 'Предвидение +30%, Гокакью' }
  },
  {
    id: 'Хьюга',
    name: 'Клан Хьюга',
    category: 'Коноха',
    badge: '⚪ Бьякуган & Дзюкен',
    desc: 'Всевидящее око 360°, стиль Мягкой Ладони по 361 точке тенкецу и абсолютный щит Кайтен.',
    icon: '🥋',
    defaultElements: ['Ветер', 'Вода'],
    stats: { chakra: '620 000', speed: '23-25 м/с', perk: 'Блокировка чакры, 64 удара' }
  },
  {
    id: 'Узумаки',
    name: 'Клан Узумаки',
    category: 'Коноха',
    badge: '🌀 Титаническая Чакра',
    desc: 'Колоссальный запас чакры (1.15 млн+), Адамантиновые цепи и пассивная регенерация ран (+11k/ход).',
    icon: '🍥',
    defaultElements: ['Вода', 'Ветер'],
    stats: { chakra: '1 150 000', speed: '22-24 м/с', perk: 'Цепи Конго Фуса, реген 11 000/ход' }
  },
  {
    id: 'Сенджу',
    name: 'Клан Сенджу',
    category: 'Коноха',
    badge: '🌳 Тело Мудреца & Мокутон',
    desc: 'Наследники Асуры с феноменальной живучестью и Кеккей Генкай древесных техник (Мокутон).',
    icon: '🌳',
    defaultElements: ['Земля', 'Вода'],
    stats: { chakra: '880 000', speed: '23-25 м/с', perk: 'Древесный купол, Лес Мудреца' }
  },
  {
    id: 'Сабаку',
    name: 'Клан Сабаку',
    category: 'Сунагакуре',
    badge: '🏜️ Автономный Песок',
    desc: 'Песок реагирует автономно на угрозы со слепых зон, создавая Песчаный гроб и монолитный щит.',
    icon: '🏜️',
    defaultElements: ['Ветер', 'Земля'],
    stats: { chakra: '720 000', speed: '21-23 м/с', perk: 'Щит песка, Песчаный гроб' }
  },
  {
    id: 'Сюнрай',
    name: 'Клан Сюнрай',
    category: 'Скоростной',
    badge: '⚡ Мгновенная Молния',
    desc: 'Биоэлектрический разгон нервов. Рекордные скорости бега и рывков до 33+ м/с без додзюцу.',
    icon: '⚡',
    defaultElements: ['Молния'],
    stats: { chakra: '590 000', speed: '31-33 м/с', perk: 'Реакция 135мс, рывок на 25м' }
  },
  {
    id: 'Кинган',
    name: 'Клан Кинган',
    category: 'Аналитик',
    badge: '⚜️ Золотое око (3 кольца)',
    desc: 'Видят «швы мира» и структурные трещины любой защиты. Снижают ранг вражеской брони на 2 ступени.',
    icon: '⚜️',
    defaultElements: ['Земля'],
    stats: { chakra: '620 000', speed: '23-25 м/с', perk: 'Снижение брони цели на 2 ранга' }
  },
  {
    id: 'Синкай',
    name: 'Клан Синкай',
    category: 'Гибрид',
    badge: '🌊 Аойган (3 капли)',
    desc: 'Потомки владык глубин. Додзюцу Аойган дает взрывной прирост скорости (+30%), предвидения и водной мощи.',
    icon: '🌊',
    defaultElements: ['Вода'],
    stats: { chakra: '670 000', speed: '25-27 м/с', perk: 'Скорость +30%, Приливная волна' }
  },
  {
    id: 'Тэнрай',
    name: 'Клан Тэнрай',
    category: 'Стихийник',
    badge: '⚡ Икадзутиган & Чёрная Молния',
    desc: 'Считывают нервные импульсы оппонента до движения мышц. Врожденная защита от внезапности 15% и Чёрная Молния.',
    icon: '🌩️',
    defaultElements: ['Молния'],
    stats: { chakra: '680 000', speed: '26-28 м/с', perk: 'Чтение нервов, иммунитет к шоку' }
  }
];

export const ELEMENT_OPTIONS = [
  { id: 'Огонь', name: 'Огонь (Катон)', icon: '🔥', desc: 'Разрушительная термическая мощь и взрывы' },
  { id: 'Ветер', name: 'Ветер (Футон)', icon: '🌪️', desc: 'Режущие воздушные лезвия и разгон пламени' },
  { id: 'Молния', name: 'Молния (Райтон)', icon: '⚡', desc: 'Высокая пробиваемость и шоковый паралич' },
  { id: 'Земля', name: 'Земля (Дотон)', icon: '🪨', desc: 'Несокрушимые стены, барьеры и уплотнение' },
  { id: 'Вода', name: 'Вода (Суйтон)', icon: '💧', desc: 'Гидроудары, водяные стены и пластичность' }
];

export const ARCHETYPE_OPTIONS = [
  {
    id: 'taijutsu',
    name: '⚡ Тайдзюцу-рашер',
    title: 'Скорость 35+ м/с & Ближний бой',
    desc: 'Сверхзвуковые рывки, время реакции 120 мс, серия ударов Вихря Конохи и пробитие легких щитов.',
    badge: 'Спринтер [К]'
  },
  {
    id: 'genjutsu',
    name: '🌀 Гендзюцу-стратег',
    title: 'Иллюзии & Контроль разума',
    desc: 'Иммунитет к чужим базовым иллюзиям, техника Храма иллюзорного сна (Неханка) и сбивание чакры.',
    badge: 'Иллюзионист'
  },
  {
    id: 'ninjutsu',
    name: '💥 Ниндзюцу-артиллерия',
    title: '+180 000 Чакры & Стихийный калибр',
    desc: '+20% к радиусу поражения стихий, резонанс и мощнейшая техника «Стихийный разлом катаклизма» [Д].',
    badge: 'Артиллерия [Д]'
  },
  {
    id: 'medical',
    name: '💚 Ирьёнин (Ниндзя-медик)',
    title: 'Исцеление команды 2v2 & Скальпель',
    desc: 'Способность восстанавливать здоровье и передавать чакру союзнику, Скальпель чакры для обхода брони.',
    badge: 'Поддержка 2v2'
  }
];

export const SPECIAL_TRAIT_OPTIONS = [
  {
    id: 'none',
    name: 'Чистокровный шиноби',
    badge: 'Классика',
    icon: '🥋',
    desc: 'Чистое боевое мастерство своего клана без посторонних мутаций и паразитов.'
  },
  {
    id: 'jinchuriki',
    name: 'Джинчурики Хвостатого',
    badge: '+300k чакры & Покров',
    icon: '🔥',
    desc: 'Запечатанный Биджу: плотный багровый покров 3-х хвостов (+40% скорости) и Бидзюу-дама [S].'
  },
  {
    id: 'sage',
    name: 'Сендзюцу Мудреца',
    badge: 'Природная чакра',
    icon: '🐸',
    desc: 'Врожденная гармония с природой: мгновенный вход в Режим Мудреца, удары Кавазу Кумите и сенсорика 1 км.'
  },
  {
    id: 'hyoton',
    name: 'Кеккей Генкай: Хётон (Лёд)',
    badge: 'Стихия Льда',
    icon: '❄️',
    desc: 'Синтез Воды и Ветра: нерушимые Ледяные зеркала демонов Макё Хёсё и шквал ледяных шипов.'
  },
  {
    id: 'yoton',
    name: 'Кеккей Генкай: Ётон (Лава)',
    badge: 'Стихия Лавы',
    icon: '🌋',
    desc: 'Синтез Земли и Огня: поток бурлящей лавы, прожигающий любые преграды, и Лавовый щит.'
  },
  {
    id: 'shoton',
    name: 'Кеккей Генкай: Сётон (Кристалл)',
    badge: 'Стихия Кристалла',
    icon: '💎',
    desc: 'Кристаллизация материи и вражеских техник в розовый нефрит, призыв Кристального дракона [A].'
  },
  {
    id: 'jiton',
    name: 'Кеккей Генкай: Дзитон (Магнетизм)',
    badge: 'Железный песок',
    icon: '🧲',
    desc: 'Магнитный контроль железного песка Сатэцу: смертоносные иглы и падающая монолитная глыба [A].'
  },
  {
    id: 'curse_mark',
    name: 'Проклятая печать Орочимару',
    badge: 'Дзюин Уровень 2',
    icon: '🟣',
    desc: 'Метка перерождения: темная трансформация плоти, кожистые крылья, полет и взрывные +40% Скорости.'
  }
];

export default function CharacterCreatorModal({
  isOpen,
  onClose,
  initialData = null,
  onSave
}) {
  const [ninjaName, setNinjaName] = useState('Учиха Саске');
  const [lineageMode, setLineageMode] = useState('pure'); // 'pure' (1), 'mixed' (2), 'triple' (3)
  const [selectedClans, setSelectedClans] = useState(['Учиха']);
  const [selectedElements, setSelectedElements] = useState(['Огонь', 'Молния']);
  const [selectedArchetype, setSelectedArchetype] = useState('taijutsu');
  // Список выбранных глаз (любое количество глаз своих кланов)
  const [selectedDojutsuList, setSelectedDojutsuList] = useState(['auto']);
  const [dojutsuFilter, setDojutsuFilter] = useState('CLAN'); // 'CLAN' (Глаза моих кланов) | 'ALL' | 'SHARINGAN' | etc.
  const [eyeNotice, setEyeNotice] = useState(null);
  const [selectedTrait, setSelectedTrait] = useState('none');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('naruto_custom_ninja');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setNinjaName(parsed.name);
        if (Array.isArray(parsed.clans) && parsed.clans.length > 0) {
          setSelectedClans(parsed.clans.filter(c => CLAN_OPTIONS.some(opt => opt.id === c)));
          setLineageMode(parsed.clans.length === 1 ? 'pure' : parsed.clans.length === 2 ? 'mixed' : 'triple');
        } else if (parsed.clan) {
          const split = String(parsed.clan).split(/[+,\/]+/).map(c => c.trim()).filter(c => CLAN_OPTIONS.some(opt => opt.id === c));
          setSelectedClans(split.length > 0 ? split : ['Учиха']);
          setLineageMode(split.length <= 1 ? 'pure' : split.length === 2 ? 'mixed' : 'triple');
        }
        if (Array.isArray(parsed.elements) && parsed.elements.length > 0) setSelectedElements(parsed.elements);
        if (parsed.archetype) setSelectedArchetype(parsed.archetype);
        
        // Загрузка глаз (массив или строка)
        if (Array.isArray(parsed.dojutsuList) && parsed.dojutsuList.length > 0) {
          setSelectedDojutsuList(parsed.dojutsuList);
        } else if (parsed.dojutsu) {
          const splitEyes = String(parsed.dojutsu).split('+').map(s => s.trim()).filter(Boolean);
          setSelectedDojutsuList(splitEyes.length > 0 ? splitEyes : [parsed.dojutsu]);
        }
        if (parsed.specialTrait) setSelectedTrait(parsed.specialTrait);
      } else if (initialData) {
        if (initialData.name) setNinjaName(initialData.name);
        if (initialData.clan) {
          const split = String(initialData.clan).split(/[+,\/]+/).map(c => c.trim()).filter(c => CLAN_OPTIONS.some(opt => opt.id === c));
          setSelectedClans(split.length > 0 ? split : ['Учиха']);
          setLineageMode(split.length <= 1 ? 'pure' : split.length === 2 ? 'mixed' : 'triple');
        }
      }
    } catch (e) {}
  }, [isOpen, initialData]);

  const maxClansAllowed = lineageMode === 'pure' ? 1 : lineageMode === 'mixed' ? 2 : 3;

  // Определение родных стихий выбранных кланов
  const nativeClanElements = Array.from(new Set(
    selectedClans.flatMap(cId => {
      const clan = CLAN_OPTIONS.find(c => c.id === cId);
      return clan ? clan.defaultElements : [];
    })
  ));

  // Удобный выбор стихий (1-3 стихии, переключение без раздражающих сбросов)
  const toggleElement = (elId) => {
    if (selectedElements.includes(elId)) {
      if (selectedElements.length === 1) return; // Минимум 1 стихия
      setSelectedElements(prev => prev.filter(e => e !== elId));
    } else {
      if (selectedElements.length >= 3) {
        // Заменяем последнюю
        setSelectedElements(prev => [prev[0], prev[1], elId]);
      } else {
        setSelectedElements(prev => [...prev, elId]);
      }
    }
  };

  const handleResetToNativeElements = () => {
    if (nativeClanElements.length > 0) {
      setSelectedElements(nativeClanElements.slice(0, 3));
    }
  };

  const handleSelectClan = (clanObj) => {
    if (lineageMode === 'pure') {
      setSelectedClans([clanObj.id]);
      if (clanObj.defaultElements && clanObj.defaultElements.length > 0) {
        setSelectedElements(clanObj.defaultElements);
      }
      return;
    }

    if (selectedClans.includes(clanObj.id)) {
      if (selectedClans.length === 1) return; // Минимум один клан
      setSelectedClans(prev => prev.filter(c => c !== clanObj.id));
    } else {
      if (selectedClans.length >= maxClansAllowed) {
        // Заменяем последний
        setSelectedClans(prev => [...prev.slice(0, maxClansAllowed - 1), clanObj.id]);
      } else {
        setSelectedClans(prev => [...prev, clanObj.id]);
      }
    }
  };

  const handleSetMode = (mode) => {
    setLineageMode(mode);
    const limit = mode === 'pure' ? 1 : mode === 'mixed' ? 2 : 3;
    if (selectedClans.length > limit) {
      setSelectedClans(prev => prev.slice(0, limit));
    }
  };

  // Каноничный случайный бросок родословной (Шаг А 55/40/5% и Шаг Б из 9 кланов)
  const handleRollCanonicalLineage = () => {
    const CANONICAL_9 = ['Хьюга', 'Учиха', 'Узумаки', 'Сенджу', 'Сабаку', 'Сюнрай', 'Кинган', 'Синкай', 'Тэнрай'];
    const roll = Math.random() * 100;
    let count = 1;
    let mode = 'pure';
    if (roll < 55) {
      count = 1;
      mode = 'pure';
    } else if (roll < 95) {
      count = 2;
      mode = 'mixed';
    } else {
      count = 3;
      mode = 'triple';
    }

    const shuffled = [...CANONICAL_9].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, count);
    setLineageMode(mode);
    setSelectedClans(picked);

    // Подбираем стихии
    const primary = CLAN_OPTIONS.find(c => c.id === picked[0]);
    if (primary && primary.defaultElements) {
      setSelectedElements(primary.defaultElements);
    }
  };

  // =========================================================================
  // ЛОГИКА ВЫБОРА ГЛАЗ (ДОДЗЮЦУ): СВОБОДНЫЙ ВЫБОР ЛЮБОГО КОЛИЧЕСТВА ГЛАЗ СВОИХ КЛАНОВ
  // =========================================================================
  const isClanUchiha = selectedClans.some(c => c.includes('Учиха'));
  const isClanHyuga = selectedClans.some(c => c.includes('Хьюга'));
  const isClanKingan = selectedClans.some(c => c.includes('Кинган'));
  const isClanShinkai = selectedClans.some(c => c.includes('Синкай'));
  const isClanTenrai = selectedClans.some(c => c.includes('Тэнрай'));
  const isClanSenjuOrUzumaki = selectedClans.some(c => c.includes('Сенджу') || c.includes('Узумаки'));

  // Проверка принадлежности глаза к выбранным кланам («главное что с твоего клана»)
  const isEyeAllowed = (eye) => {
    if (!eye) return false;
    if (eye.id === 'auto' || eye.id === 'none' || eye.family === 'Auto' || eye.family === 'None') return true;
    switch (eye.family) {
      case 'Sharingan':
        return isClanUchiha;
      case 'Byakugan':
        return isClanHyuga;
      case 'Kingan':
        return isClanKingan;
      case 'Aoigan':
        return isClanShinkai;
      case 'Ikadzutigan':
        return isClanTenrai;
      case 'Rinnegan':
        return isClanUchiha || (isClanUchiha && isClanSenjuOrUzumaki);
      default:
        return false;
    }
  };

  const getRequiredClanName = (eye) => {
    switch (eye?.family) {
      case 'Sharingan': return 'Учиха';
      case 'Byakugan': return 'Хьюга';
      case 'Kingan': return 'Кинган';
      case 'Aoigan': return 'Синкай';
      case 'Ikadzutigan': return 'Тэнрай';
      case 'Rinnegan': return 'Учиха';
      default: return null;
    }
  };

  // Автоматическая синхронизация: при смене кланов очищаем глаза, не принадлежащие новым кланам
  useEffect(() => {
    if (!isOpen) return;
    setSelectedDojutsuList(prev => {
      if (prev.length === 1 && (prev[0] === 'auto' || prev[0] === 'none')) return prev;
      const valid = prev.filter(id => {
        const eyeObj = getDojutsuById(id);
        return isEyeAllowed(eyeObj);
      });
      return valid.length > 0 ? valid : ['auto'];
    });
  }, [selectedClans, isOpen]);

  // Клик по глазу: выбор СКОЛЬКО УГОДНО глаз своего клана!
  const handleToggleDojutsu = (eyeObj) => {
    const id = eyeObj.id;

    // Режим Auto или None сбрасывает в одиночный вариант
    if (id === 'auto') {
      setSelectedDojutsuList(['auto']);
      setEyeNotice(null);
      return;
    }
    if (id === 'none') {
      setSelectedDojutsuList(['none']);
      setEyeNotice(null);
      return;
    }

    // Проверка клана: «главное что с твоего клана»
    if (!isEyeAllowed(eyeObj)) {
      const req = getRequiredClanName(eyeObj);
      setEyeNotice(`⛔ «${eyeObj.name}» доступен только клану ${req}! Выберите ${req} в родословной.`);
      setTimeout(() => setEyeNotice(null), 4000);
      return;
    }

    // Если кликаем по разрешённому глазу своего клана:
    // 1. Убираем 'auto' и 'none' если они были выбраны
    let currentList = selectedDojutsuList.filter(x => x !== 'auto' && x !== 'none');

    if (currentList.includes(id)) {
      // Снимаем выбор
      currentList = currentList.filter(x => x !== id);
      if (currentList.length === 0) {
        currentList = ['none'];
      }
    } else {
      // Добавляем выбор: СКОЛЬКО ХОЧЕШЬ ГЛАЗ (без искусственного лимита в 2)!
      currentList = [...currentList, id];
    }

    setSelectedDojutsuList(currentList);
  };

  // Получаем объекты выбранных глаз
  const currentDojutsuObjs = selectedDojutsuList.map(id => getDojutsuById(id));
  const currentDojutsuTitle = currentDojutsuObjs.map(d => d.name).join(' + ');

  // Расчет комбинированных статов выбранных глаз
  let combinedPredvidenie = 0;
  let combinedUpkeep = 0;
  let combinedSpeedBonus = 0;
  currentDojutsuObjs.forEach(d => {
    if (d.stats) {
      const predNum = parseInt((d.stats.predvidenie || '0').replace(/\D/g, ''), 10) || 0;
      if (predNum > combinedPredvidenie) combinedPredvidenie = predNum; // По правилам берется максимальное предвидение

      const upkeepNum = parseInt((d.stats.upkeep || '0').replace(/\D/g, ''), 10) || 0;
      combinedUpkeep += upkeepNum; // Поддержка складывается

      const speedNum = parseInt((d.stats.speed || '0').replace(/\D/g, ''), 10) || 0;
      if (speedNum > combinedSpeedBonus) combinedSpeedBonus = speedNum; // По правилам бонусы скорости глаз НЕ суммируются (берется наибольший)
    }
  });

  const hasShunraiOrTenrai = selectedClans.some(c => c.includes('Сюнрай') || c.includes('Тэнрай'));
  const hasSynergyPenalty = hasShunraiOrTenrai && combinedPredvidenie > 0;
  const effectivePredvidenie = hasSynergyPenalty ? Math.round(combinedPredvidenie * 0.7) : combinedPredvidenie;

  const handleSave = () => {
    const customNinja = {
      name: ninjaName.trim() || 'Шиноби',
      clan: selectedClans.join(' + '),
      clans: selectedClans,
      lineageMode,
      elements: selectedElements,
      archetype: selectedArchetype,
      dojutsu: selectedDojutsuList.join(' + '),
      dojutsuList: selectedDojutsuList,
      specialTrait: selectedTrait === 'none' ? null : selectedTrait
    };

    try {
      localStorage.setItem('naruto_custom_ninja', JSON.stringify(customNinja));
      localStorage.setItem('naruto_player_name', customNinja.name);
    } catch (e) {}

    if (onSave) {
      onSave(customNinja);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const currentClanObjs = selectedClans.map(id => CLAN_OPTIONS.find(c => c.id === id) || CLAN_OPTIONS[0]);
  const currentClanTitle = currentClanObjs.map(c => c.name).join(' + ');
  const currentArchObj = ARCHETYPE_OPTIONS.find(a => a.id === selectedArchetype) || ARCHETYPE_OPTIONS[0];
  const currentTraitObj = SPECIAL_TRAIT_OPTIONS.find(t => t.id === selectedTrait) || SPECIAL_TRAIT_OPTIONS[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="glass-panel border border-amber-500/40 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden bg-zinc-950/98">
        
        {/* Шапка */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-amber-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl">
              🥷
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                Конструктор своего шиноби
              </h2>
              <p className="text-xs text-zinc-400">
                Каноничные 9 кланов и парный выбор глаз (Раздел 1 и 3 правил): 1 клан (55%), пара (40%) или тройная смесь (5%)!
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

        {/* Тело скролла */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* 1. Имя бойца */}
          <div className="space-y-2 bg-black/50 p-4 rounded-xl border border-white/10">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" /> Имя и позывной вашего шиноби:
            </label>
            <input
              type="text"
              value={ninjaName}
              onChange={(e) => setNinjaName(e.target.value)}
              placeholder="Введите имя (напр. Учиха Саске, Неджи, Кирилл)..."
              className="w-full bg-zinc-900 border border-white/15 focus:border-amber-400 px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-100 placeholder-zinc-500 outline-none transition"
            />
          </div>

          {/* 2. Выбор Клана и Родословной (9 Каноничных кланов) */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" /> 9 Каноничных Кланов & Родословная:
              </label>

              {/* Переключатель чистоты родословной (Шаг А правил: 55% / 40% / 5%) */}
              <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => handleSetMode('pure')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    lineageMode === 'pure'
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  Один клан (55%)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetMode('mixed')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    lineageMode === 'mixed'
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  Смесь (2 клана, 40%)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetMode('triple')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    lineageMode === 'triple'
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  Тройная смесь (5%)
                </button>
                <button
                  type="button"
                  onClick={handleRollCanonicalLineage}
                  title="Случайный бросок по каноничным вероятностям Раздела 1"
                  className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white/10 hover:bg-white/20 text-amber-300 transition cursor-pointer flex items-center gap-1"
                >
                  🎲 Ролл
                </button>
              </div>
            </div>

            {/* Выбранные кланы бейдж */}
            <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs">
              <span className="text-zinc-300 flex items-center gap-2">
                <span className="text-amber-400 font-bold">Родословная:</span>
                <b className="text-amber-200">{selectedClans.join(' + ')}</b>
              </span>
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                Выбрано: {selectedClans.length} / {maxClansAllowed}
              </span>
            </div>

            {/* Сетка 9 кланов */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {CLAN_OPTIONS.map((clan) => {
                const isSelected = selectedClans.includes(clan.id);
                const orderIndex = selectedClans.indexOf(clan.id);
                return (
                  <button
                    key={clan.id}
                    type="button"
                    onClick={() => handleSelectClan(clan)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/20 shadow-md shadow-amber-500/20 ring-1 ring-amber-500/50'
                        : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xl group-hover:scale-110 transition-transform">{clan.icon}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black shadow-sm animate-pulse">
                            ✓ #{orderIndex + 1}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-black block ${isSelected ? 'text-amber-300' : 'text-zinc-100'}`}>
                        {clan.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 block line-clamp-2 mt-1 leading-snug">
                        {clan.desc}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-zinc-400">
                      <span>ЧАКРА: <b className="text-zinc-200">{clan.stats.chakra}</b></span>
                      <span className="text-amber-400 font-bold">{clan.badge}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Стихии чакры шиноби */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" /> Стихии чакры (1-3 стихии):
              </label>

              {nativeClanElements.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetToNativeElements}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Родные стихии клана ({nativeClanElements.join(', ')})</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {ELEMENT_OPTIONS.map((el) => {
                const isSelected = selectedElements.includes(el.id);
                const isNative = nativeClanElements.includes(el.id);
                return (
                  <button
                    key={el.id}
                    type="button"
                    onClick={() => toggleElement(el.id)}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center cursor-pointer relative ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-md ring-1 ring-amber-500/40'
                        : 'border-white/10 bg-black/40 text-zinc-300 hover:border-white/20 hover:bg-zinc-900/60'
                    }`}
                  >
                    <span className="text-2xl mb-1">{el.icon}</span>
                    <span className="text-xs font-bold block">{el.name}</span>
                    {isNative && (
                      <span className="mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                        Родная
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Боевой архетип */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Боевой архетип шиноби:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {ARCHETYPE_OPTIONS.map((arch) => {
                const isSelected = selectedArchetype === arch.id;
                return (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => setSelectedArchetype(arch.id)}
                    className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/20 text-zinc-100 shadow-md ring-1 ring-amber-500/40'
                        : 'border-white/10 bg-black/40 text-zinc-400 hover:border-white/20 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div>
                      <span className={`text-xs font-black block mb-1 ${isSelected ? 'text-amber-300' : 'text-zinc-200'}`}>
                        {arch.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 block leading-snug">
                        {arch.desc}
                      </span>
                    </div>
                    <span className="mt-2.5 text-[9px] font-mono text-amber-400 font-bold block border-t border-white/5 pt-1">
                      {arch.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Додзюцу (Глаза шиноби): Свободный выбор глаз своих кланов */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" /> Додзюцу (Глаза) шиноби — выбор глаз своих кланов:
              </label>
              
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono text-cyan-300 font-bold">
                  {currentDojutsuTitle}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-bold">
                  {selectedDojutsuList.includes('auto')
                    ? '🎲 Авто-ролл'
                    : selectedDojutsuList.includes('none')
                      ? '🥋 Без глаз'
                      : `Выбрано глаз: ${selectedDojutsuList.length}`}
                </span>
              </div>
            </div>

            {/* Всплывающее предупреждение при клике на чужой глаз */}
            {eyeNotice && (
              <div className="p-3 rounded-xl bg-red-950/85 border border-red-500/50 text-red-200 text-xs font-bold flex items-center justify-between gap-2 animate-bounce shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <span>{eyeNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEyeNotice(null)}
                  className="p-1 hover:bg-white/10 rounded cursor-pointer text-red-300"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Фильтры додзюцу: Приоритет своим кланам! */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              <button
                type="button"
                onClick={() => setDojutsuFilter('CLAN')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  dojutsuFilter === 'CLAN'
                    ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                    : 'bg-zinc-900/80 text-cyan-400 hover:text-cyan-200 border border-cyan-500/20'
                }`}
              >
                <span>🌟 Глаза моих кланов ({selectedClans.join(', ')})</span>
              </button>

              <button
                type="button"
                onClick={() => setDojutsuFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                  dojutsuFilter === 'ALL'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-white/5'
                }`}
              >
                Все глаза мира
              </button>

              {isClanUchiha && (
                <button
                  type="button"
                  onClick={() => setDojutsuFilter('SHARINGAN')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                    dojutsuFilter === 'SHARINGAN' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-zinc-900/80 text-zinc-400 border border-white/5'
                  }`}
                >
                  Шаринган & ВМШ
                </button>
              )}

              {isClanHyuga && (
                <button
                  type="button"
                  onClick={() => setDojutsuFilter('BYAKUGAN')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                    dojutsuFilter === 'BYAKUGAN' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-zinc-900/80 text-zinc-400 border border-white/5'
                  }`}
                >
                  Бьякуган
                </button>
              )}

              {isClanKingan && (
                <button
                  type="button"
                  onClick={() => setDojutsuFilter('KINGAN')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                    dojutsuFilter === 'KINGAN' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-zinc-900/80 text-zinc-400 border border-white/5'
                  }`}
                >
                  Кинган
                </button>
              )}

              {isClanShinkai && (
                <button
                  type="button"
                  onClick={() => setDojutsuFilter('AOIGAN')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                    dojutsuFilter === 'AOIGAN' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-zinc-900/80 text-zinc-400 border border-white/5'
                  }`}
                >
                  Аойган
                </button>
              )}

              {isClanTenrai && (
                <button
                  type="button"
                  onClick={() => setDojutsuFilter('IKADZUTIGAN')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                    dojutsuFilter === 'IKADZUTIGAN' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-zinc-900/80 text-zinc-400 border border-white/5'
                  }`}
                >
                  Икадзутиган
                </button>
              )}

              <button
                type="button"
                onClick={() => setDojutsuFilter('NONE')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                  dojutsuFilter === 'NONE' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-zinc-900/80 text-zinc-400 border border-white/5'
                }`}
              >
                Авто / Без глаз
              </button>
            </div>

            {/* Панель сводки характеристик выбранных глаз */}
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3 font-mono text-[11px] flex-wrap">
                <span>Предвидение: <b className="text-cyan-300">+{effectivePredvidenie}%</b> {hasSynergyPenalty && <span className="text-amber-400">(потолок Сюнрай/Тэнрай ×0.7)</span>}</span>
                <span>• Поддержка: <b className="text-amber-300">{combinedUpkeep.toLocaleString()} ед./ход</b></span>
                {combinedSpeedBonus > 0 && <span>• Скорость: <b className="text-emerald-300">+{combinedSpeedBonus}%</b></span>}
              </div>
              <span className="text-[10px] text-zinc-400">
                Выбирайте сколько угодно глаз из своих кланов ({selectedClans.join(', ')}). Бонусы характеристик (скорость, предвидение) берутся по сильнейшему глазу, расход суммируется!
              </span>
            </div>

            {/* Карточки додзюцу */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
              {DOJUTSU_OPTIONS.filter(d => {
                if (dojutsuFilter === 'CLAN') {
                  if (d.id === 'auto' || d.id === 'none') return true;
                  return isEyeAllowed(d);
                }
                if (dojutsuFilter === 'SHARINGAN') return d.family === 'Sharingan';
                if (dojutsuFilter === 'BYAKUGAN') return d.family === 'Byakugan';
                if (dojutsuFilter === 'KINGAN') return d.family === 'Kingan';
                if (dojutsuFilter === 'AOIGAN') return d.family === 'Aoigan';
                if (dojutsuFilter === 'IKADZUTIGAN') return d.family === 'Ikadzutigan';
                if (dojutsuFilter === 'RINNEGAN') return d.family === 'Rinnegan';
                if (dojutsuFilter === 'NONE') return d.family === 'Auto' || d.family === 'None';
                return true;
              }).map((dojutsu) => {
                const isSelected = selectedDojutsuList.includes(dojutsu.id);
                const eyeIndex = selectedDojutsuList.indexOf(dojutsu.id);
                const allowed = isEyeAllowed(dojutsu);
                const reqClan = getRequiredClanName(dojutsu);

                return (
                  <button
                    key={dojutsu.id}
                    type="button"
                    onClick={() => handleToggleDojutsu(dojutsu)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/60 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                        : allowed
                          ? 'border-white/10 bg-black/40 hover:border-cyan-500/40 hover:bg-zinc-900/60'
                          : 'border-white/5 bg-zinc-950/40 opacity-55 hover:opacity-85'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5 gap-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xl group-hover:scale-110 transition-transform shrink-0">{dojutsu.icon}</span>
                          <span className={`text-xs font-black truncate ${isSelected ? 'text-cyan-300' : allowed ? 'text-zinc-100' : 'text-zinc-400'}`}>
                            {dojutsu.name}
                          </span>
                        </div>
                        {isSelected ? (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-black text-[9px] font-black shadow-sm shrink-0">
                            {dojutsu.id === 'auto' || dojutsu.id === 'none' ? '✓ Активно' : `✓ Глаз #${eyeIndex + 1}`}
                          </span>
                        ) : !allowed && reqClan ? (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-white/10 text-zinc-400 text-[8px] font-mono shrink-0">
                            🔒 Клан {reqClan}
                          </span>
                        ) : null}
                      </div>
                      <span className="text-[10px] text-zinc-400 block line-clamp-2 mt-1 leading-snug">
                        {dojutsu.desc}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-1.5 border-t border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
                        <span>ПРЕДВИДЕНИЕ: <b className="text-cyan-300">{dojutsu.stats.predvidenie}</b></span>
                        <span>РАСХОД: <b className="text-amber-400">{dojutsu.stats.upkeep}</b></span>
                      </div>
                      {dojutsu.stats.speed && dojutsu.stats.speed !== '0 м/с' && (
                        <div className="text-[9px] font-mono text-emerald-400 font-bold">
                          ⚡ Скорость: {dojutsu.stats.speed}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Особый дар / Кеккей Генкай */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Особый дар или Кеккей Генкай:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {SPECIAL_TRAIT_OPTIONS.map((trait) => {
                const isSelected = selectedTrait === trait.id;
                return (
                  <button
                    key={trait.id}
                    type="button"
                    onClick={() => setSelectedTrait(trait.id)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-purple-500 bg-purple-950/40 text-zinc-100 shadow-md ring-1 ring-purple-500/40'
                        : 'border-white/10 bg-black/40 text-zinc-400 hover:border-white/20 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{trait.icon}</span>
                        <span className={`text-xs font-bold block ${isSelected ? 'text-purple-300' : 'text-zinc-200'}`}>
                          {trait.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 block line-clamp-2 mt-1 leading-snug">
                        {trait.desc}
                      </span>
                    </div>

                    <div className="mt-2 pt-1 border-t border-white/5 text-[9px] font-mono text-purple-400 font-bold">
                      {trait.badge}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 7. Итоговая сводка билда */}
          <div className="bg-gradient-to-r from-amber-950/30 via-black to-cyan-950/30 border border-white/15 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-zinc-200 flex items-center gap-2 flex-wrap">
                <span>🥷 Итоговый билд:</span>
                <span className="text-amber-400 font-black">{ninjaName || 'Шиноби'}</span>
                <span className="text-zinc-500">|</span>
                <span className="text-cyan-300">{currentClanTitle}</span>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono">
                Стихии: <b className="text-zinc-200">{selectedElements.join(', ')}</b> • Архетип: <b className="text-amber-300">{currentArchObj.name}</b> • Глаза: <b className="text-cyan-300">{currentDojutsuTitle}</b> • Дар: <b className="text-purple-300">{currentTraitObj.name}</b>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={handleSave}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-lg ${
                  savedSuccess
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                }`}
              >
                {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{savedSuccess ? 'Досье сохранено! ✅' : 'Сохранить досье шиноби'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
