export const formatMessageTime = (time: Date | string) => {
  const messageTime = typeof time === "string" ? new Date(time) : time;

  // Проверяем валидность даты
  if (isNaN(messageTime.getTime())) {
    console.warn("Invalid date:", time);
    return "";
  }

  // В чатах всегда показываем только время
  return messageTime.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
