<template>
  <div class="p-3 border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Аватар пользователя -->
        <div class="relative" v-if="props.selectedChat?.name">
          <div
            class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center"
          >
            <span class="text-sm font-medium">{{
              getInitials(props.selectedChat?.name || "")
            }}</span>
          </div>
        </div>

        <div>
          <div class="font-medium text-sm">
            {{ props.selectedChat?.name || "Выберите чат" }}
          </div>
        </div>
      </div>

      <!-- Кнопки действий -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Chat } from "@/types/chat.interface";

interface Props {
  selectedChat: Chat | null;
}

const props = defineProps<Props>();

// Получаем инициалы из имени
function getInitials(name: string): string {
  if (!name) return "";
  const words = name.trim().split(" ");
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

// Форматируем время последней активности
function formatLastActivity(time: string): string {
  const now = new Date();
  const lastActivity = new Date(time);
  const diffInMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

  if (diffInMinutes < 1) {
    return "только что";
  } else if (diffInMinutes < 60) {
    return `${Math.floor(diffInMinutes)} мин назад`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} ч назад`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} дн назад`;
  }
}
</script>
