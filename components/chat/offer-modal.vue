<template>
  <UModal
    :title="t('chat.offer_modal.title') || 'Новое предложение'"
    v-model:open="isOpen"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField
          :label="t('chat.offer_modal.title_label') || 'Заголовок *'"
          name="title"
        >
          <UInput
            v-model="form.title"
            :placeholder="
              t('chat.offer_modal.title_placeholder') ||
              'Введите заголовок предложения'
            "
            color="success"
            class="w-full"
          />
        </UFormField>

        <UFormField
          :label="t('chat.offer_modal.description_label') || 'Описание *'"
          name="description"
        >
          <UTextarea
            v-model="form.description"
            :placeholder="
              t('chat.offer_modal.description_placeholder') ||
              'Опишите условия предложения'
            "
            :rows="4"
            class="w-full"
            color="success"
          />
        </UFormField>

        <UFormField
          :label="t('chat.offer_modal.budget_label') || 'Бюджет *'"
          name="budget"
        >
          <UInput
            v-model="form.budget"
            type="number"
            placeholder="0"
            color="success"
            class="w-full"
          >
            <template #trailing>
              <span class="text-gray-500">₽</span>
            </template>
          </UInput>
        </UFormField>

        <UFormField
          :label="t('chat.offer_modal.duration_label') || 'Срок выполнения *'"
          name="duration"
        >
          <USelectMenu
            :items="durationList"
            :model-value="
              durationList.find((d) => d.value === form.duration) ||
              durationList[0]
            "
            :label="formatDuration(t, form.duration)"
            class="w-full"
            @update:model-value="
              (val: { label: string; value: number } | null) => {
                if (val) {
                  form.duration = val.value;
                }
              }
            "
          />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton color="neutral" variant="outline" @click="closeModal">
          {{ t("common.cancel") || "Отмена" }}
        </UButton>
        <UButton
          color="success"
          @click="handleSubmit"
          :disabled="
            !form.title ||
            !form.description ||
            !form.budget ||
            !form.duration ||
            isSending ||
            hasAcceptedOwnOffer
          "
          :loading="isSending"
        >
          {{ t("chat.offer_modal.submit") || "Отправить" }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { formatDuration, getDurationList } from "@/utils/formatDuration";
import { useChatsStore } from "@/stores/chat/useChatsStore";
import { useChatSocket } from "@/composables/socket/useChatSocketIo";
import { useUser } from "@/composables/useUser";
import { storeToRefs } from "pinia";
import type { IChat } from "@/types/chat.interface";
import type { IMessage } from "@/types/message.interface";

const props = defineProps<{
  chat: IChat | null;
}>();

const emit = defineEmits<{
  (e: "message-sent"): void;
}>();

const { t } = useI18n();
const toast = useToast();
const chatsStore = useChatsStore();
const { user } = useUser();
const { handleSendMessage } = useChatSocket();
const { isOfferModalOpen } = storeToRefs(chatsStore);

// Check if user has already accepted their own offer
const hasAcceptedOwnOffer = computed(() => {
  if (!props.chat?.messages || !user.value?.uuid) {
    return false;
  }

  return props.chat.messages.some(
    (message) =>
      message.type === "offer" &&
      message.offerAccepted === true &&
      message.sender?.uuid === user.value?.uuid
  );
});

const isOpen = computed({
  get: () => isOfferModalOpen.value,
  set: (value) => {
    if (value) {
      chatsStore.openOfferModal();
    } else {
      chatsStore.closeOfferModal();
    }
  },
});

const form = ref<{
  title: string;
  description: string;
  budget: string;
  duration: number;
}>({
  title: "",
  description: "",
  budget: "",
  duration: 1,
});

const isSending = ref(false);
const durationList = getDurationList(t);

const generateMessageUuid = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const closeModal = () => {
  isOpen.value = false;
  resetForm();
};

const resetForm = () => {
  form.value = {
    title: "",
    description: "",
    budget: "",
    duration: 1,
  };
};

const handleSubmit = async () => {
  if (
    !form.value.title ||
    !form.value.description ||
    !form.value.budget ||
    !form.value.duration ||
    isSending.value ||
    hasAcceptedOwnOffer.value ||
    !props.chat ||
    !user.value
  ) {
    if (hasAcceptedOwnOffer.value) {
      toast.add({
        title: t("common.warning") || "Внимание",
        description:
          t("chat.offer_already_accepted") ||
          "У вас уже есть принятое предложение в этом чате",
        color: "warning",
      });
    }
    return;
  }

  isSending.value = true;
  const messageUuid = generateMessageUuid();
  const timestamp = new Date();

  const offerMessage: IMessage = {
    uuid: messageUuid,
    chat: props.chat,
    sender: user.value || undefined,
    content: form.value.title,
    type: "offer",
    metadata: {
      title: form.value.title,
      description: form.value.description,
      price: Number(form.value.budget),
      duration: form.value.duration,
    },
    attachments: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  try {
    // Append message to store
    const currentChat = chatsStore.getChatById
      ? chatsStore.getChatById(props.chat.uuid)
      : chatsStore.chats.find((c) => c.uuid === props.chat?.uuid);

    if (currentChat) {
      const updatedChat: IChat = {
        ...currentChat,
        messages: [...(currentChat.messages || []), offerMessage],
        updatedAt: timestamp,
      };
      chatsStore.updateChat(currentChat.uuid, updatedChat);
    }

    // Send via socket
    handleSendMessage(
      {
        messageUuid: messageUuid,
        chatUuid: props.chat.uuid,
        content: form.value.title,
        senderUuid: user.value.uuid,
        type: "offer",
        metadata: offerMessage.metadata,
      },
      null
    );

    closeModal();
    emit("message-sent");
  } catch (error) {
    console.error("Error sending offer message:", error);
    toast.add({
      title: t("common.error") || "Ошибка",
      description: t("chat.send_error") || "Не удалось отправить предложение",
      color: "error",
    });
  } finally {
    isSending.value = false;
  }
};

// Reset form when modal closes
watch(isOpen, (newValue) => {
  if (!newValue) {
    resetForm();
  }
});
</script>
