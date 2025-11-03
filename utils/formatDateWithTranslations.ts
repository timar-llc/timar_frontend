export const formatDateWithTranslations = (
  date: Date,
  t: (key: string) => string
) => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  // Вычисляем разницу в годах
  const diffInYears =
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365);

  // Проверяем, является ли дата сегодняшней
  if (date.toDateString() === now.toDateString()) {
    return t("common.days.today");
  }

  // Проверяем, является ли дата вчерашней
  if (date.toDateString() === yesterday.toDateString()) {
    return t("common.days.yesterday");
  }

  // Получаем месяц и день
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();

  // Массив названий месяцев для перевода
  const monthKeys = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const monthName = t(`common.months.${monthKeys[month]}`);

  // Если сообщение больше года назад - показываем с годом
  if (diffInYears >= 1) {
    return `${day} ${monthName} ${year}`;
  }

  // Для других дат показываем без года
  return `${day} ${monthName}`;
};

export const formatLastSeen = (
  date: Date | string,
  t: (key: string, params?: Record<string, any>) => string
) => {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return "";
  }
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffH = Math.floor(diffMin / 60);
  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();
  const monthKeys = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const monthName = t(`common.months.${monthKeys[month]}`);

  if (diffMin < 1) {
    return t("chat.lastSeen.justNow"); // "только что"
  }
  if (diffMin < 60) {
    return t("chat.lastSeen.minutesAgo", { count: diffMin });
  }
  if (diffH < 24) {
    return t("chat.lastSeen.hoursAgo", { count: diffH });
  }
  // > суток -> дата с месяцем
  return t("chat.lastSeen.date", { date: `${day} ${monthName} ${year}` });
};
