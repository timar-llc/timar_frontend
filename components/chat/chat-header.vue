<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useUser } from "@/composables/useUser";
import { useChatSocket } from "@/composables/socket/useChatSocketIo";
import { useChatsStore } from "@/stores/chat/useChatsStore";
import type { IUser } from "@/types/user.interface";
import type { IChat } from "@/types/chat.interface";
import TypingIndicator from "@/components/chat/typing-indicator.vue";
import { formatLastSeen } from "@/utils/formatDateWithTranslations";

const props = defineProps<{
  outUser: IUser;
  chat: IChat | null;
  isModal: boolean;
}>();

const { t } = useI18n();
const { user } = useUser();
const { onMessage } = useChatSocket();
const chatsStore = useChatsStore();
const pathname = useRoute().path;
// Typing indicator
const isTyping = ref(false);

// Listen for typing events
onMessage("user_typing", (data) => {
  if (
    data.chatUuid === props.chat?.uuid &&
    data.userUuid !== user.value?.uuid
  ) {
    isTyping.value = data.isTyping;
  }
});

const handleOpenOfferModal = () => {
  chatsStore.openOfferModal();
};
</script>
<template>
  <!-- Chat Header -->
  <div
    class="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray dark:border-gray-800 bg-white dark:bg-gray-900"
  >
    <div class="flex items-center gap-3 min-w-0 flex-1">
      <div class="relative">
        <img
          :src="props.outUser?.avatarUrl ?? ''"
          :alt="props.outUser?.firstName || props.outUser?.lastName || 'User'"
          class="w-10 h-10 rounded-full object-cover"
        />
        <span
          v-if="props.outUser?.isOnline"
          class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-white dark:border-gray-900"
        />
      </div>
      <div class="min-w-0 flex-1">
        <p class="font-semibold text-gray-900 dark:text-white truncate">
          {{ props.outUser?.firstName || props.outUser?.lastName || "User" }}
        </p>
        <TypingIndicator v-if="isTyping" />
        <p class="text-xs text-gray-500 flex items-center gap-1" v-else>
          <span v-if="props.outUser?.isOnline && !isTyping">
            {{ t("chat.status.online") || "В сети" }}
          </span>

          <span v-else>
            <template v-if="props.outUser?.lastOnlineAt">
              {{ formatLastSeen(props.outUser.lastOnlineAt, t) }}
            </template>
            <template v-else>
              {{
                formatLastSeen(
                  props.outUser?.updatedAt || props.outUser?.createdAt,
                  t
                )
              }}
            </template>
          </span>
        </p>
      </div>
    </div>
    <UButton
      v-if="!pathname.includes('/orders') && !props.isModal"
      trailing-icon="i-lucide-plus"
      variant="solid"
      color="success"
      class="p-2 rounded-lg hover:opacity-80 transition-colors"
      @click="handleOpenOfferModal"
      >Новое предложение</UButton
    >
  </div>
</template>
