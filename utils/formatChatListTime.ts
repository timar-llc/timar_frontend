export const formatChatListTime = (time: Date, t: (key: string) => string) => {
  const now = new Date();
  const messageTime = new Date(time);

  // Разница в миллисекундах
  const diffInMs = now.getTime() - messageTime.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365);

  // Если сообщение меньше суток назад - показываем только время
  if (diffInHours < 24) {
    return messageTime.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Если сообщение больше года назад - показываем полную дату
  if (diffInYears >= 1) {
    return messageTime.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Если сообщение больше суток, но меньше года - показываем дату без года с переводами
  const month = messageTime.getMonth();
  const day = messageTime.getDate();

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
  return `${day} ${monthName}`;
};
