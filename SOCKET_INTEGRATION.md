# Socket.IO Integration для чата

## Обзор

Полная интеграция Socket.IO для системы чата с поддержкой:

- Отправка и получение сообщений в реальном времени
- Индикатор печати (typing indicator)
- Статус онлайн/оффлайн пользователей
- Статусы сообщений (отправлено, доставлено, прочитано)
- Автоматическое переподключение
- Обработка ошибок

## Структура файлов

### Композаблы

#### `useSocket.ts`

Базовый композабл для работы с Socket.IO:

- Управление соединением
- Обработка событий подключения/отключения
- Переподключение при потере соединения
- Отправка и получение сообщений
- Управление комнатами чатов
- Индикаторы печати и статуса

#### `useChatSocket.ts`

Высокоуровневый композабл для чата:

- Интеграция с store чатов
- Конвертация сообщений между форматами
- Управление состоянием печати
- Автоматическая обработка входящих сообщений

### Компоненты

#### `ChatInput.vue`

- Поддержка статуса подключения
- Индикатор печати
- Отправка текстовых и голосовых сообщений

#### `ChatMessages.vue`

- Отображение индикатора печати
- Поддержка статуса подключения

#### `ChatHeader.vue`

- Индикатор статуса подключения
- Статус онлайн пользователей

#### `TypingIndicator.vue`

- Анимированный индикатор печати
- Поддержка множественных пользователей

## События Socket.IO

### Исходящие события

#### `join_chat`

```typescript
{
  chatUuid: string;
}
```

#### `leave_chat`

```typescript
{
  chatUuid: string;
}
```

#### `send_message`

```typescript
{
  id: string
  chatUuid: string
  content: string
  senderUuid: string
  messageType: "text" | "offer" | "voice"
  createdAt: string
  metadata?: any
  status: "sending" | "sent" | "delivered" | "read"
}
```

#### `typing`

```typescript
{
  chatUuid: string;
  isTyping: boolean;
}
```

#### `mark_read`

```typescript
{
  messageId: string;
  timestamp: string;
}
```

#### `mark_chat_read`

```typescript
{
  chatUuid: string;
  timestamp: string;
}
```

### Входящие события

#### `message_received`

```typescript
{
  id: string
  chatUuid: string
  content: string
  senderUuid: string
  messageType: "text" | "offer" | "voice"
  createdAt: string
  metadata?: any
}
```

#### `user_typing`

```typescript
{
  chatUuid: string
  userUuid: string
  isTyping: boolean
  userName?: string
}
```

#### `user_online_status`

```typescript
{
  userUuid: string
  isOnline: boolean
  lastSeen?: string
}
```

#### `message_status`

```typescript
{
  messageId: string;
  status: "sent" | "delivered" | "read";
  timestamp: string;
}
```

#### `chat_event`

```typescript
{
  chatUuid: string
  event: "user_joined" | "user_left" | "chat_updated"
  data?: any
}
```

## Конфигурация

### Nuxt Config

```typescript
runtimeConfig: {
  public: {
    socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL || "http://localhost:3000";
  }
}
```

### Environment Variables

```bash
NUXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

## Использование

### Инициализация

```typescript
const {
  connectToChat,
  disconnectFromChat,
  sendMessage,
  sendTyping,
  getTypingUsers,
  isConnected,
} = useChatSocket();

// Инициализация при монтировании компонента
onMounted(async () => {
  connectToChat();
});
```

### Получение токена

```typescript
// Функция автоматически получает токен из кук или localStorage
const { getAuthToken } = useWebSocket();

const token = getAuthToken();
if (token) {
  console.log("Token found:", token);
} else {
  console.error("No auth token available");
}
```

### Отправка сообщения

```typescript
const sendMessage = (text: string) => {
  const message: Message = {
    id: Date.now(),
    text: text,
    time: new Date().toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isOwn: true,
    type: "text",
    createdAt: new Date(),
  };

  socketSendMessage(chatUuid, message);
};
```

### Индикатор печати

```typescript
const handleTyping = () => {
  sendTyping(chatUuid);
};

const stopTyping = () => {
  sendStopTyping(chatUuid);
};
```

### Получение пользователей, которые печатают

```typescript
const typingUsers = getTypingUsers(chatUuid);
console.log("Users typing:", typingUsers);
```

## Состояние подключения

### Статусы

- `connecting` - Подключение
- `connected` - Подключено
- `disconnected` - Отключено

### Автоматическое переподключение

- Максимум 5 попыток
- Задержка между попытками: 1-5 секунд
- Экспоненциальная задержка

## Обработка ошибок

### Типы ошибок

- Ошибки подключения
- Ошибки отправки сообщений
- Ошибки переподключения
- Ошибки аутентификации

### Логирование

Все ошибки логируются в консоль с соответствующими сообщениями.

## Производительность

### Оптимизации

- Оптимистичные обновления UI
- Дебаунсинг индикатора печати (1 секунда)
- Автоматическая очистка таймеров
- Управление памятью при отключении

### Мониторинг

- Отслеживание попыток переподключения
- Статус соединения в реальном времени
- Логирование всех событий

## Безопасность

### Аутентификация

- Получение токена `access_token` из кук (приоритет) или localStorage
- Передача токена в URL параметре WebSocket соединения
- Валидация на сервере
- Автоматическое отключение при неверном токене

### Валидация

- Проверка типов сообщений
- Валидация UUID чатов
- Санитизация контента

## Тестирование

### Unit тесты

- Тестирование композаблов
- Тестирование обработчиков событий
- Тестирование конвертации сообщений

### Integration тесты

- Тестирование полного цикла сообщений
- Тестирование переподключения
- Тестирование индикаторов

## Развертывание

### Требования

- Node.js 18+
- Socket.IO сервер
- HTTPS для продакшена

### Настройка сервера

```javascript
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3002",
    methods: ["GET", "POST"],
  },
});
```

## Мониторинг и отладка

### Логи

- Все события логируются в консоль
- Различные уровни логирования
- Структурированные логи

### DevTools

- Socket.IO DevTools расширение
- Vue DevTools для состояния
- Network tab для WebSocket трафика

## Будущие улучшения

### Планируемые функции

- Групповые чаты
- Файловые вложения
- Push уведомления
- Шифрование сообщений
- Голосовые/видео звонки

### Оптимизации

- Виртуализация сообщений
- Ленивая загрузка истории
- Сжатие сообщений
- Кэширование
