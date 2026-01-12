<script setup lang="ts">
import ChatSidebar from "@/components/chat/sidebar.vue";
import ChatMessages from "@/components/chat/chat-messages.vue";
import OfferModal from "@/components/chat/offer-modal.vue";
import ChatInput from "@/components/chat/chat-input.vue";
import { useChatApi } from "@/composables/api/useChatApi";
import { useUser } from "@/composables/useUser";
import type { IChat } from "@/types/chat.interface";
import type { IMessage } from "@/types/message.interface";
import { useChatsStore } from "@/stores/chat/useChatsStore";
import { useChatSocket } from "@/composables/socket/useChatSocketIo";

const { t } = useI18n();
const route = useRoute();
const { getChatById, sendMessage: sendMessageApi } = useChatApi();
const { user } = useUser();
const chatsStore = useChatsStore();

// 1. Загрузка чата с API (первый раз)
const { data: chatData, refresh: refreshChat } = await getChatById(
  route.params.uuid as string
);

if (
  chatData.value &&
  typeof chatData.value === "object" &&
  "uuid" in chatData.value
) {
  const chatExists = chatsStore.chats.some(
    (c) => c.uuid === (chatData.value as IChat).uuid
  );
  if (!chatExists) {
    chatsStore.addChat(chatData.value as IChat);
  } else {
    chatsStore.updateChat(
      (chatData.value as IChat).uuid,
      chatData.value as IChat
    );
  }
}

// 3. chat теперь только из Pinia store
// Use storeToRefs for proper reactivity
const { chats } = storeToRefs(chatsStore);

const chat = computed(() =>
  chats.value.find((c) => c.uuid === route.params.uuid)
);

// 4. outUser из актуального chat
const outUser = computed(() => {
  if (!chat.value || !user.value) return null;
  return chat.value.user1?.uuid === user.value.uuid
    ? chat.value.user2
    : chat.value.user1;
});

</script>

<template>
  <div class="min-h-screen bg-gradient-content rounded-xl">
    <div class="relative bg-gradient-nav">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ t("chat.title") }}
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              {{ t("chat.placeholder") }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div
        class="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 min-h-[800px]"
      >
        <!-- Sidebar -->
        <ChatSidebar />

        <!-- Chat area -->
        <section
          v-if="chat && outUser"
          class="lg:col-span-8 xl:col-span-9 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden"
        >
          <!-- Chat Header -->
          <ChatHeader :out-user="outUser" :chat="chat" />

          <!-- Messages -->
          <ChatMessages :chat="chat" />

          <!-- Chat Input -->
          <ChatInput :chat="chat" />
        </section>

        <!-- Loading/Error state -->
        <section
          v-else
          class="lg:col-span-8 xl:col-span-9 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden"
        >
          <div class="flex-1 flex items-center justify-center p-6">
            <div class="text-center">
              <div
                class="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400"
              >
                <svg
                  class="animate-spin h-7 w-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">
                Загрузка чата...
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Offer Modal -->
    <OfferModal :chat="chat || null" />
  </div>
</template>

<style scoped>
.typing-dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0.6;
  animation: typing 1.4s infinite ease-in-out;
}
.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes typing {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  40% {
    transform: translateY(-4px);
    opacity: 1;
  }
}
</style>
