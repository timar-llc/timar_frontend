<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useUser } from "@/composables/useUser";
import type { IChat } from "@/types/chat.interface";
import type { IMessage } from "@/types/message.interface";
import ChatMessage from "@/components/chat/chat-message.vue";
import OfferMessage from "@/components/chat/offer-message.vue";
import { formatDateWithTranslations } from "@/utils/formatDateWithTranslations";

const props = defineProps<{
  chat: IChat | null;
}>();

const emit = defineEmits<{
  (e: "scroll-to-bottom"): void;
}>();

const { t } = useI18n();
const { user } = useUser();

const messagesContainer = ref<HTMLElement>();

// Check if message is from current user
const isOwnMessage = (message: IMessage) => {
  return message.sender?.uuid === user.value?.uuid;
};

// Определяем роли на основе отправителя предложения
// Тот, кто отправил предложение = клиент (clientUuid)
// Второй участник чата = фрилансер (freelancerUuid)
const getOfferRoles = (message: IMessage) => {
  if (!message || !props.chat || !message.sender?.uuid) {
    return {
      clientUuid: "",
      freelancerUuid: "",
    };
  }

  const offerSenderUuid = message.sender.uuid;
  const user1Uuid = props.chat.user1?.uuid;
  const user2Uuid = props.chat.user2?.uuid;

  // Отправитель предложения = клиент
  const clientUuid = offerSenderUuid;

  // Второй участник = фрилансер
  const freelancerUuid = offerSenderUuid === user1Uuid ? user2Uuid : user1Uuid;

  return {
    clientUuid: clientUuid || "",
    freelancerUuid: freelancerUuid || "",
  };
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
  if (!props.chat?.messages || props.chat.messages.length === 0) {
    return [];
  }

  const result: Array<{
    type: "message" | "separator";
    data: IMessage | string;
  }> = [];

  props.chat.messages.forEach((message, index) => {
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
        props.chat!.messages[index - 1].createdAt
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

// Scroll to bottom when new messages arrive
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

watch(
  () => props.chat?.messages?.length,
  () => {
    scrollToBottom();
    emit("scroll-to-bottom");
  }
);
</script>

<template>
  <div
    ref="messagesContainer"
    class="flex-1 overflow-y-scroll px-3 sm:px-6 py-4 space-y-3 bg-gray-50 dark:bg-gray-800/30 max-h-[calc(100vh-400px)]"
  >
    <template
      v-for="(item, index) in messagesWithSeparators"
      :key="item.type === 'message' ? (item.data as IMessage).uuid : `separator-${index}`"
    >
      <!-- Date Separator -->
      <div v-if="item.type === 'separator'" class="flex justify-center my-4">
        <span
          class="px-3 py-1 rounded-full bg-gray-800 dark:bg-gray-700 text-white text-xs font-medium"
        >
          {{ item.data }}
        </span>
      </div>

      <!-- Offer message -->
      <OfferMessage
        v-else-if="
          item.type === 'message' &&
          (item.data as IMessage).type === 'offer'
        "
        :client-uuid="getOfferRoles(item.data as IMessage).clientUuid"
        :freelancer-uuid="getOfferRoles(item.data as IMessage).freelancerUuid"
        :message="item.data as IMessage"
        :chat-uuid="chat?.uuid as string"
        :is-own="isOwnMessage(item.data as IMessage)"
        :container-ref="messagesContainer"
      />

      <!-- Text message (default) -->
      <ChatMessage
        v-else-if="item.type === 'message'"
        :message="item.data as IMessage"
        :chat-uuid="chat?.uuid as string"
        :is-own="isOwnMessage(item.data as IMessage)"
        :container-ref="messagesContainer"
      />
    </template>
  </div>
</template>
