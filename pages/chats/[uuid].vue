<script setup lang="ts">
import ChatSidebar from "@/components/chat/sidebar.vue";
import { useChatApi } from "@/composables/api/useChatApi";
import { useUser } from "@/composables/useUser";
import { formatMessageTime } from "@/utils/formatMessageTime";
import { formatDateWithTranslations } from "@/utils/formatDateWithTranslations";
import { formatLastSeen } from "@/utils/formatDateWithTranslations";
import type { IChat } from "@/types/chat.interface";
import type { IMessage } from "@/types/message.interface";
import { useChatsStore } from "@/stores/chat/useChatsStore";
import { useChatSocket } from "@/composables/socket/useChatSocketIo";
import TypingIndicator from "@/components/chat/typing-indicator.vue";

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
const chat = computed(() =>
  chatsStore.chats.find((c) => c.uuid === route.params.uuid)
);
const selectedChat = computed(() => chat.value);

// 4. outUser из актуального chat
const outUser = computed(() => {
  if (!chat.value || !user.value) return null;
  return chat.value.user1?.uuid === user.value.uuid
    ? chat.value.user2
    : chat.value.user1;
});

// Typing indicator
const isTyping = ref(false);

// Message input
const messageText = ref("");
const isSending = ref(false);

// Scroll to bottom when new messages arrive
const messagesContainer = ref<HTMLElement>();

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

watch(
  () => chat.value?.messages?.length,
  () => {
    scrollToBottom();
  }
);
const { handleTyping, onMessage } = useChatSocket();

// Дебаунс для typing: false через 500мс без ввода
const typingTimeoutId = ref<number | null>(null);
const TYPING_IDLE_MS = 500;

const sendTypingTrue = () => {
  if (!selectedChat.value || !user.value) return;
  handleTyping({
    data: {
      chatUuid: selectedChat.value.uuid,
      isTyping: true,
      userUuid: user.value.uuid,
    },
  });
};

const scheduleTypingFalse = () => {
  if (typingTimeoutId.value) {
    clearTimeout(typingTimeoutId.value);
    typingTimeoutId.value = null;
  }
  typingTimeoutId.value = window.setTimeout(() => {
    if (!selectedChat.value || !user.value) return;
    handleTyping({
      data: {
        chatUuid: selectedChat.value.uuid,
        isTyping: false,
        userUuid: user.value.uuid,
      },
    });
    typingTimeoutId.value = null;
  }, TYPING_IDLE_MS);
};

const onTypingInput = () => {
  sendTypingTrue();
  scheduleTypingFalse();
};

const clearTypingTimer = () => {
  if (typingTimeoutId.value) {
    clearTimeout(typingTimeoutId.value);
    typingTimeoutId.value = null;
  }
};

onBeforeUnmount(() => {
  if (typingTimeoutId.value) clearTimeout(typingTimeoutId.value);
});

onMessage("user_typing", (data) => {
  if (
    data.chatUuid === selectedChat.value?.uuid &&
    data.userUuid !== user.value?.uuid
  ) {
    isTyping.value = data.isTyping;
  }
});
// Send message
const sendMessage = async () => {
  if (!messageText.value.trim() || !selectedChat.value || isSending.value)
    return;

  isSending.value = true;

  try {
    await sendMessageApi(selectedChat.value.uuid, {
      text: messageText.value.trim(),
    });
    messageText.value = "";
    await refreshChat();
    scrollToBottom();
  } catch (error) {
    console.error("Error sending message:", error);
  } finally {
    isSending.value = false;
  }
};

// Check if message is from current user
const isOwnMessage = (message: IMessage) => {
  return message.sender?.uuid === user.value?.uuid;
};

// Helper function to check if two dates are on the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Prepare messages with date separators
const messagesWithSeparators = computed(() => {
  if (!chat.value?.messages || chat.value.messages.length === 0) {
    return [];
  }

  const result: Array<{
    type: "message" | "separator";
    data: IMessage | string;
  }> = [];

  chat.value?.messages.forEach((message, index) => {
    const messageDate = new Date(message.createdAt);

    // Check if we need to show a date separator
    if (index === 0) {
      // Always show separator before first message
      result.push({
        type: "separator",
        data: formatDateWithTranslations(messageDate, t),
      });
    } else {
      const previousMessageDate = new Date(
        chat.value!.messages[index - 1].createdAt
      );

      if (!isSameDay(messageDate, previousMessageDate)) {
        // Show separator if date changed
        result.push({
          type: "separator",
          data: formatDateWithTranslations(messageDate, t),
        });
      }
    }

    // Add the message
    result.push({
      type: "message",
      data: message,
    });
  });

  return result;
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
          <div
            class="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900"
          >
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div class="relative">
                <img
                  :src="outUser?.avatarUrl ?? ''"
                  :alt="outUser?.firstName || outUser?.lastName || 'User'"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <span
                  v-if="outUser?.isOnline"
                  class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-white dark:border-gray-900"
                />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-semibold text-gray-900 dark:text-white truncate">
                  {{ outUser?.firstName || outUser?.lastName || "User" }}
                </p>
                <TypingIndicator v-if="isTyping" />
                <p class="text-xs text-gray-500 flex items-center gap-1" v-else>
                  <span v-if="outUser?.isOnline && !isTyping">
                    {{ t("chat.status.online") || "В сети" }}
                  </span>

                  <span v-else>
                    <template v-if="outUser?.lastOnlineAt">
                      {{ formatLastSeen(outUser.lastOnlineAt, t) }}
                    </template>
                    <template v-else>
                      {{
                        formatLastSeen(
                          outUser?.updatedAt || outUser?.createdAt,
                          t
                        )
                      }}
                    </template>
                  </span>
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                :title="t('common.settings') || 'Настройки'"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.5 6.75A2.25 2.25 0 0 1 6.75 4.5H9a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 0-.75.75V9a.75.75 0 0 1-1.5 0V6.75Zm9-2.25a.75.75 0 0 1 .75-.75H17.25A2.25 2.25 0 0 1 19.5 6v2.25a.75.75 0 0 1-1.5 0V6a.75.75 0 0 0-.75-.75H14.25a.75.75 0 0 1-.75-.75Zm-9 12a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 0-.75.75V17.25a.75.75 0 0 1-1.5 0V16.5Zm13.5-.75a.75.75 0 0 1 .75.75v1.5A2.25 2.25 0 0 1 17.25 21h-2.25a.75.75 0 0 1 0-1.5h2.25a.75.75 0 0 0 .75-.75V16.5a.75.75 0 0 1 .75-.75Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div
            ref="messagesContainer"
            class="flex-1 overflow-y-scroll px-3 sm:px-6 py-4 space-y-3 bg-gray-50 dark:bg-gray-800/30 max-h-[calc(100vh-400px)]"
          >
            <template
              v-for="(item, index) in messagesWithSeparators"
              :key="index"
            >
              <!-- Date Separator -->
              <div
                v-if="item.type === 'separator'"
                class="flex justify-center my-4"
              >
                <span
                  class="px-3 py-1 rounded-full bg-gray-800 dark:bg-gray-700 text-white text-xs font-medium"
                >
                  {{ item.data }}
                </span>
              </div>

              <div
                v-else-if="item.type === 'message'"
                class="flex flex-col"
                :class="isOwnMessage(item.data as IMessage) ? 'items-end' : 'items-start'"
              >
                <div
                  class="max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm"
                  :class="
                    isOwnMessage(item.data as IMessage)
                      ? 'bg-success text-black rounded-br-md'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-700'
                  "
                >
                  <p class="whitespace-pre-line break-words text-sm">
                    {{ (item.data as IMessage).content }}
                  </p>
                </div>
                <div
                  class="mt-1 flex items-center gap-1.5"
                  :class="
                    isOwnMessage(item.data as IMessage) ? 'flex-row-reverse' : 'flex-row'"
                >
                  <span class="text-[11px] text-gray-500 dark:text-gray-400">
                    {{ formatMessageTime((item.data as IMessage).createdAt) }}
                  </span>
                </div>
              </div>
            </template>
          </div>

          <div
            class="px-3 sm:px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <div class="flex items-end gap-2">
              <button
                class="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                :title="t('common.attach') || 'Прикрепить'"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18.97 3.659a2.25 2.25 0 0 0-3.182 0l-10.94 10.94a3.75 3.75 0 1 0 5.304 5.303l7.693-7.693a.75.75 0 0 1 1.06 1.06l-7.693 7.693a5.25 5.25 0 1 1-7.424-7.424l10.939-10.94a3.75 3.75 0 1 1 5.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 0 1 5.91 15.66l7.81-7.81a.75.75 0 0 1 1.061 1.06l-7.81 7.81a.75.75 0 0 0 1.054 1.068L18.97 6.84a2.25 2.25 0 0 0 0-3.182Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <div class="flex-1">
                <div
                  class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all"
                >
                  <textarea
                    v-model="messageText"
                    rows="1"
                    :placeholder="
                      t('chat.placeholder') || 'Введите сообщение...'
                    "
                    class="w-full bg-transparent outline-none resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm max-h-32 overflow-y-auto"
                    @keydown.enter.exact.prevent="sendMessage"
                    @keydown.enter.shift.exact="messageText += '\n'"
                    @blur="
                      clearTypingTimer();
                      handleTyping({
                        data: {
                          chatUuid: selectedChat?.uuid!,
                          isTyping: false,
                          userUuid: user?.uuid!,
                        },
                      });
                    "
                    @input="onTypingInput"
                  />
                </div>
              </div>

              <button
                @click="sendMessage"
                :disabled="!messageText.trim() || isSending"
                class="p-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :title="t('common.send') || 'Отправить'"
              >
                <svg
                  v-if="!isSending"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
                  />
                </svg>
                <svg
                  v-else
                  class="animate-spin h-5 w-5"
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
              </button>
            </div>
          </div>
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
