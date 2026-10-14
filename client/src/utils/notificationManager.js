/**
 * notificationManager.js
 * Почтовая служба Конохи (Свиток уведомлений):
 * - 🟢 «Приказ Хокаге» (зелёная подсветка)
 * - 🟡 «Боевые донесения» (жёлтая подсветка)
 * - 🔴 «Вести деревни» (красная подсветка, включая обновления игры и место загрузки)
 */

const STORAGE_KEY = 'naruto_shinobi_notifications';

// Начальные письма по умолчанию для нового игрока
const DEFAULT_NOTIFICATIONS = [
  {
    id: 'mail_update_110',
    category: 'village', // 🔴 Вести деревни
    title: 'Вести деревни: Вышло глобальное обновление v1.1.0 «Воля Огня»!',
    sender: 'Канцелярия Скрытого Листа',
    date: 'Сегодня',
    timestamp: Date.now(),
    read: false,
    content: `Шиноби Деревни Скрытого Листа! Доступно новое крупное обновление игры v1.1.0.

Что обновилось в этом патче:
• ⛩️ Таблица 100 рангов шиноби: добавлена полная роспись уровней от Студента Академии (1 ур.) до Бога Ниндзюцу (100 ур.) с высокодетализированными эмблемами и кандзи-печатями.
• 📜 Почтовая служба Конохи: уведомления со свитком, приказами Хокаге, боевыми донесениями и вестями деревни.
• 🎵 Плеер опенингов: добавлены режимы воспроизведения «Зациклить трек», «По кругу все» и «В разнобой (Shuffle)».
• 📥 Автообновление игры: возможность скачать свежий ZIP-архив игры прямо из этого письма.`,
    updateData: {
      version: '1.1.0',
      archiveName: 'Naruto_RPG_Игра_для_Друзей.zip',
      downloadUrl: '/download/Naruto_RPG_Игра_для_Друзей.zip'
    }
  },
  {
    id: 'mail_hokage_genin',
    category: 'hokage', // 🟢 Приказ Хокаге
    title: 'Приказ Хокаге: Присвоение звания и приветствие защитника Листа',
    sender: 'Совет Старейшин & Третий Хокаге',
    date: 'Сегодня',
    timestamp: Date.now() - 3600000,
    read: false,
    content: `Именем Совета Конохи и волей Третьего Хокаге!

Совет Конохи официально присвоил вам статус Защитника Деревни Скрытого Листа. Ваш начальный ранг — Генин (Ур. 1). 
Сражайтесь на Боевой Арене, изучайте 248 техник шиноби, одерживайте победы над соперниками в PvP дуэлях 1v1 и 2v2 и докажите Совету право носить жилет Чунина и звание Джонина!`
  },
  {
    id: 'mail_battle_report_first',
    category: 'battle', // 🟡 Боевые донесения
    title: 'Боевое донесение: Рапорт о боевом спарринге на Полигоне №7',
    sender: 'Штаб Тактического Анализа Конохи',
    date: 'Сегодня',
    timestamp: Date.now() - 7200000,
    read: false,
    content: `Рапорт наблюдателя штаба:
• Локация: Тренировочный полигон №7 Скрытого Листа.
• Итог: Успешное выполнение боевой задачи, отработка печатей и стихийных связок.
• Результат: Зачёт по боевой подготовке шиноби.
• Замечания Мастера: отличная концентрация чакры и молниеносная реакция при контратаках.`
  }
];

class NotificationManager {
  constructor() {
    this.listeners = new Set();
    this.notifications = this.loadNotifications();
  }

  loadNotifications() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[NotificationManager] Error reading storage:', e);
    }
    // Если пусто — сохраняем начальные
    this.saveNotifications(DEFAULT_NOTIFICATIONS);
    return DEFAULT_NOTIFICATIONS;
  }

  saveNotifications(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('[NotificationManager] Error saving storage:', e);
    }
  }

  subscribe(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.notifications));
  }

  getAll() {
    return this.notifications;
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(id) {
    let changed = false;
    this.notifications = this.notifications.map(n => {
      if (n.id === id && !n.read) {
        changed = true;
        return { ...n, read: true };
      }
      return n;
    });
    if (changed) {
      this.saveNotifications(this.notifications);
      this.notify();
    }
  }

  markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.saveNotifications(this.notifications);
    this.notify();
  }

  deleteNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications(this.notifications);
    this.notify();
  }

  clearAll() {
    this.notifications = [];
    this.saveNotifications(this.notifications);
    this.notify();
  }

  // Добавить новое уведомление
  addNotification({ category, title, sender, content, updateData = null }) {
    const newMail = {
      id: 'mail_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
      category: category || 'village',
      title: title || 'Новое сообщение',
      sender: sender || 'Почтовая служба Конохи',
      date: 'Сегодня, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      read: false,
      content: content || '',
      updateData: updateData || null
    };

    this.notifications = [newMail, ...this.notifications];
    this.saveNotifications(this.notifications);
    this.notify();
    return newMail;
  }

  // Быстрый метод: добавить боевое донесение
  addBattleReport({ opponentName, resultText, isPvp = true, isWinner = false, roundCount = 1, level, rankTitle, xpGain, totalXp }) {
    const battleTypeStr = isPvp ? '⚔️ Рейтинговая PvP дуэль (живой соперник)' : '🤖 Тренировочный спарринг (Полигон с ИИ)';
    const xpStr = xpGain ? `• Начислено опыта: +${xpGain} XP` : '';
    const progressNote = isPvp 
      ? (isWinner ? `• Прогресс шиноби: Зачислена победа в послужной список! Текущий уровень: ${level || 1} (${rankTitle || 'Генин'}).` : `• Прогресс шиноби: Боевой опыт получен. Уровень: ${level || 1} (${rankTitle || 'Генин'}).`)
      : '• Примечание: Тренировочный опыт зачислен в общий резерв шиноби.';

    return this.addNotification({
      category: 'battle', // 🟡 Жёлтая подсветка
      title: `Боевое донесение: Поединок против ${opponentName || 'противника'}`,
      sender: 'Судейская Коллегия Шиноби',
      content: `Итоги завершённого сражения:
• Тип дуэли: ${battleTypeStr}
• Результат: ${resultText || 'Дуэль завершена'}
• Пройдено раундов: ${roundCount || 1}
${xpStr ? xpStr + '\n' : ''}${progressNote}

Все протоколы дуэли сохранены в Летописи боя.`
    });
  }

  // Быстрый метод: добавить приказ Хокаге (повышение ранга)
  addHokagePromotion({ newRank, level }) {
    return this.addNotification({
      category: 'hokage', // 🟢 Зелёная подсветка
      title: `Приказ Хокаге: Совет Конохи присвоил вам ранг «${newRank}»!`,
      sender: 'Резиденция Хокаге Конохи',
      content: `Приказ Хокаге №${Math.floor(100 + Math.random() * 900)}:
Совет Конохи и Хокаге рассмотрели ваши боевые заслуги в PvP и объявляют о присвоении вам ранга «${newRank}» (Уровень ${level})!

Деревня гордится вашими победами. Продолжайте нести Волю Огня!`
    });
  }

  // Быстрый метод: добавить приказ Хокаге о получении титула
  addTitleUnlockedNotification({ titleName, titleRank, description }) {
    return this.addNotification({
      category: 'hokage', // 🟢 Зелёная подсветка
      title: `Приказ Хокаге: Вам присвоен Боевой Титул «${titleName}» [Ранг ${titleRank}]!`,
      sender: 'Резиденция Хокаге & Зал Славы',
      content: `Решением Совета Конохи за выдающиеся боевые достижения вам дарован почётный титул шиноби:
      
«${titleName}» (Ранг ${titleRank})
Заслуга: ${description}

Вы можете экипировать этот титул в окне «Титулы», и он будет гордо сиять рядом с вашим именем во всех дуэлях и таблице лидеров!`
    });
  }
}

export const notificationManager = new NotificationManager();
