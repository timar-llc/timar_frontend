<template>
  <div
    @click="chatModalStore.toggle()"
    class="rounded-lg bg-success absolute bottom-0 right-0 flex items-center justify-center gap-2 px-4 py-2 cursor-pointer hover:scale-105 transition-all duration-200 relative"
  >
    <UIcon name="lucide:message-circle-plus" class="text-black" />
    <h3 class="text-black text-md font-medium">
      {{ $t("chat.title") }}
    </h3>
    <!-- Badge для количества непрочитанных сообщений -->
    <div
      v-if="totalUnreadCount > 0"
      class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]"
    >
      {{ totalUnreadCount > 99 ? "99+" : totalUnreadCount }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatModalStore } from "@/stores/chat/useChatModalStore";
import { useChatsStore } from "@/stores/chat/useChatsStore";
import { useUser } from "@/composables/useUser";
import type { IChat } from "@/types/chat.interface";
import type { IMessage } from "@/types/message.interface";

const chatModalStore = useChatModalStore();
const chatsStore = useChatsStore();
const { user } = useUser();

// Функция для подсчета непрочитанных сообщений в одном чате
const getUnreadMessagesCount = (chat: IChat): number => {
  if (!chat.messages) return 0;
  return chat.messages.filter(
    (m: IMessage) => !m.readedAt && m.sender?.uuid !== user.value?.uuid
  ).length;
};

// Общее количество непрочитанных сообщений по всем чатам
const totalUnreadCount = computed(() => {
  if (!chatsStore.chats || chatsStore.chats.length === 0) return 0;
  return chatsStore.chats.reduce((total, chat) => {
    return total + getUnreadMessagesCount(chat);
  }, 0);
});
</script>
