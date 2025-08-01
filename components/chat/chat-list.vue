<template>
  <div
    :class="[
      'border-r border-gray-200 dark:border-gray-700',
      isSmallWidth ? 'w-full' : 'w-1/3 min-w-[200px]',
    ]"
  >
    <div class="p-3 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <h4 class="font-medium text-sm">Чаты</h4>
        <button
          class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          @click="$emit('addChat')"
        >
          <UIcon name="material-symbols:add" class="text-sm" />
        </button>
      </div>
    </div>
    <div class="overflow-y-auto h-full">
      <!-- Список чатов -->
      <TransitionGroup name="chat-list" tag="div" appear>
        <div
          v-for="chat in chats"
          :key="chat.id"
          @click="$emit('selectChat', chat)"
          :class="[
            'p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 transition-all duration-200',
            selectedChat?.id === chat.id
              ? 'bg-blue-50 dark:bg-blue-900/20'
              : '',
          ]"
        >
          <div class="flex items-center gap-3">
            <!-- Аватар с индикатором онлайн статуса -->
            <div class="relative">
              <div
                class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center"
              >
                <span class="text-sm font-medium">{{
                  getInitials(chat.name)
                }}</span>
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <div class="font-medium text-sm truncate flex-1">
                  {{ chat.name }}
                </div>
                <div class="text-xs text-gray-400 ml-2">
                  {{ formatTime(chat.time) }}
                </div>
              </div>

              <div
                class="text-xs text-gray-500 truncate flex items-center gap-1 mt-1"
              >
                <!-- Иконка для голосового сообщения -->
                <UIcon
                  v-if="isVoiceMessage(chat.lastMessage)"
                  name="material-symbols:mic"
                  class="text-xs"
                />
                <!-- Иконка для прочитанного сообщения -->

                <UIcon
                  v-else-if="chat.lastMessage"
                  name="material-symbols:done"
                  class="text-xs text-gray-400"
                />
                {{ getDisplayMessage(chat.lastMessage) }}
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Пустое состояние -->
      <div
        v-if="chats.length === 0"
        class="flex flex-col items-center justify-center h-64 text-gray-500"
      >
        <UIcon name="material-symbols:chat" class="text-4xl mb-2" />
        <p class="text-sm">Нет активных чатов</p>
        <p class="text-xs mt-1">Начните новый чат</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Chat } from "@/types/chat.interface";

interface Props {
  chats: Chat[];
  selectedChat: Chat | null;
  isSmallWidth: boolean;
}

defineProps<Props>();
defineEmits<{
  selectChat: [chat: Chat];
  addChat: [];
}>();

// Проверяем, является ли сообщение голосовым
function isVoiceMessage(message: string): boolean {
  return message === "🎤 Голосовое сообщение";
}

// Получаем отображаемый текст сообщения
function getDisplayMessage(message: string): string {
  if (isVoiceMessage(message)) {
    return "Голосовое сообщение";
  }
  return message;
}

// Получаем инициалы из имени
function getInitials(name: string): string {
  const words = name.trim().split(" ");
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

// Форматируем время
function formatTime(time: string): string {
  // Если время уже в формате "HH:MM", просто возвращаем его
  if (/^\d{1,2}:\d{2}$/.test(time)) {
    return time;
  }

  // Пытаемся создать Date из строки
  const messageTime = new Date(time);

  // Проверяем, что дата валидна
  if (isNaN(messageTime.getTime())) {
    return time; // Возвращаем исходную строку, если не удалось распарсить
  }

  const now = new Date();
  const diffInHours =
    (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return messageTime.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInHours < 48) {
    return "Вчера";
  } else {
    return messageTime.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
    });
  }
}
</script>

<style scoped>
.chat-list-enter-active,
.chat-list-leave-active {
  transition: all 0.3s ease;
}

.chat-list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.chat-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.chat-list-move {
  transition: transform 0.3s ease;
}
</style>
