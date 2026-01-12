<script setup lang="ts">
import { ref, computed, onBeforeUnmount, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useUser } from "@/composables/useUser";
import { useChatSocket } from "@/composables/socket/useChatSocketIo";
import { useChatsStore } from "@/stores/chat/useChatsStore";
import type { IChat } from "@/types/chat.interface";
import type { IMessage, IMessageAttachment } from "@/types/message.interface";

const props = defineProps<{
  chat: IChat | null;
}>();

const emit = defineEmits<{
  (e: "message-sent"): void;
}>();

const { t } = useI18n();
const toast = useToast();
const { user } = useUser();
const chatsStore = useChatsStore();
const { handleTyping, handleSendMessage } = useChatSocket();

// Message input
const messageText = ref("");
const isSending = ref(false);

const MAX_ATTACHMENTS = 3;
const MAX_FILE_SIZE_MB = 10;

const fileInputRef = ref<HTMLInputElement | null>(null);
const attachmentsQueue = ref<
  {
    id: string;
    file: File;
    previewUrl: string;
    type: IMessageAttachment["type"];
  }[]
>([]);

const clearAttachments = () => {
  attachmentsQueue.value.forEach((item) => {
    URL.revokeObjectURL(item.previewUrl);
  });
  attachmentsQueue.value = [];
};

const formatFileSize = (bytes: number) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024))
  );
  const value = bytes / Math.pow(1024, index);
  const formatted = value < 10 ? value.toFixed(1) : Math.round(value);
  return `${formatted} ${units[index]}`;
};

const canSendMessage = computed(() => {
  return (
    messageText.value.trim().length > 0 || attachmentsQueue.value.length > 0
  );
});

// Дебаунс для typing: false через 500мс без ввода
const typingTimeoutId = ref<number | null>(null);
const TYPING_IDLE_MS = 500;

const sendTypingTrue = () => {
  if (!props.chat || !user.value) return;
  handleTyping({
    data: {
      chatUuid: props.chat.uuid,
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
    if (!props.chat || !user.value) return;
    handleTyping({
      data: {
        chatUuid: props.chat.uuid,
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
  clearAttachments();
});

// Send message
const appendMessageToStore = (message: IMessage) => {
  if (!props.chat) return;
  const currentChat = chatsStore.getChatById
    ? chatsStore.getChatById(props.chat.uuid)
    : chatsStore.chats.find((c) => c.uuid === props.chat?.uuid);

  if (!currentChat) return;

  // Check if message already exists to avoid duplicates
  const exists = (currentChat.messages || []).some(
    (msg) => msg.uuid === message.uuid
  );
  if (exists) {
    console.log(`[Chat] Message ${message.uuid} already exists, skipping`);
    return;
  }

  const updatedChat: IChat = {
    ...currentChat,
    messages: [...(currentChat.messages || []), message],
    updatedAt: message.createdAt,
  };

  chatsStore.updateChat(currentChat.uuid, updatedChat);
};

const generateMessageUuid = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const detectAttachmentType = (file: File): IMessageAttachment["type"] => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "file";
};

const openAttachmentDialog = () => {
  if (attachmentsQueue.value.length >= MAX_ATTACHMENTS) {
    toast.add({
      title: t("common.warning") || "Внимание",
      description:
        t("chat.attachments_limit") || "Достигнут лимит вложений (3)",
      color: "warning",
    });
    return;
  }
  fileInputRef.value?.click();
};

const handleAttachmentInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files?.length) return;
  addFilesToQueue(target.files);
  target.value = "";
};

const addFilesToQueue = (files: FileList | File[]) => {
  const fileArray = Array.from(files);
  fileArray.forEach((file) => {
    if (attachmentsQueue.value.length >= MAX_ATTACHMENTS) {
      toast.add({
        title: t("common.warning") || "Внимание",
        description:
          t("chat.attachments_limit") || "Достигнут лимит вложений (3)",
        color: "warning",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.add({
        title: t("common.warning") || "Внимание",
        description:
          t("chat.attachments_size_limit") ||
          `Файл ${file.name} превышает ${MAX_FILE_SIZE_MB} МБ`,
        color: "warning",
      });
      return;
    }

    const id = `${file.name}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    attachmentsQueue.value.push({
      id,
      file,
      previewUrl: URL.createObjectURL(file),
      type: detectAttachmentType(file),
    });
  });
};

const removeAttachment = (id: string) => {
  const index = attachmentsQueue.value.findIndex((item) => item.id === id);
  if (index === -1) return;
  URL.revokeObjectURL(attachmentsQueue.value[index].previewUrl);
  attachmentsQueue.value.splice(index, 1);
};

const fileToBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const dataUrlToBase64 = (dataUrl: string) => {
  const parts = dataUrl.split(",");
  return parts.length > 1 ? parts[1] : dataUrl;
};

const sendMessage = async () => {
  if (!props.chat || isSending.value) return;

  if (!canSendMessage.value) {
    toast.add({
      title: t("common.warning") || "Внимание",
      description:
        t("chat.message_required") ||
        "Введите текст сообщения или добавьте вложение",
      color: "warning",
    });
    return;
  }

  const text = messageText.value.trim();
  isSending.value = true;

  const messageUuid = generateMessageUuid();
  const timestamp = new Date();

  try {
    const attachmentPayload = await Promise.all(
      attachmentsQueue.value.map(async (attachment, index) => {
        const dataUrl = await fileToBase64(attachment.file);
        return {
          uuid: `${messageUuid}-att-${index}`,
          dataUrl,
          name: attachment.file.name,
          size: attachment.file.size,
          mimeType: attachment.file.type,
          type: attachment.type,
        };
      })
    );

    const optimisticMessage: IMessage = {
      uuid: messageUuid,
      chat: props.chat,
      sender: user.value || undefined,
      content: text,
      type: "text",
      metadata: {},
      attachments: attachmentPayload.map((attachment) => ({
        uuid: attachment.uuid,
        url: attachment.dataUrl,
        type: attachment.type,
        createdAt: timestamp,
        updatedAt: timestamp,
      })),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    appendMessageToStore(optimisticMessage);

    const socketAttachments = attachmentPayload.map((attachment) => ({
      filename: attachment.name,
      mimetype: attachment.mimeType,
      content: dataUrlToBase64(attachment.dataUrl),
    }));

    handleSendMessage(
      {
        messageUuid,
        chatUuid: props.chat.uuid,
        content: text,
        senderUuid: user.value?.uuid ?? "",
        type: "text",
        metadata: {},
      },
      socketAttachments
    );

    messageText.value = "";
    clearAttachments();
    emit("message-sent");
  } catch (error) {
    console.error("Error sending message:", error);
    toast.add({
      title: t("common.error") || "Ошибка",
      description:
        t("chat.send_error") ||
        "Не удалось отправить сообщение. Попробуйте снова.",
      color: "error",
    });
  } finally {
    isSending.value = false;
  }
};
</script>

<template>
  <div
    class="px-3 sm:px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
  >
    <div v-if="attachmentsQueue.length" class="flex flex-wrap gap-3 mb-3">
      <div
        v-for="attachment in attachmentsQueue"
        :key="attachment.id"
        class="flex flex-col w-28"
      >
        <div
          class="relative w-full h-24 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-800"
        >
          <img
            v-if="attachment.type === 'image'"
            :src="attachment.previewUrl"
            alt="attachment preview"
            class="object-cover w-full h-full"
          />
          <video
            v-else-if="attachment.type === 'video'"
            :src="attachment.previewUrl"
            class="object-cover w-full h-full"
            muted
            playsinline
          />
          <div
            v-else
            class="flex flex-col items-center justify-center text-xs text-gray-500 p-2 text-center"
          >
            <UIcon name="i-lucide-file" class="mb-1 text-lg" />
          </div>
          <UButton
            color="neutral"
            variant="soft"
            size="xs"
            class="!p-1 absolute top-1 right-1 rounded-full bg-black/60 text-white hover:bg-black"
            icon="i-lucide-x"
            @click="removeAttachment(attachment.id)"
            :title="t('common.delete') || 'Удалить'"
          />
        </div>
        <div class="mt-1 text-center px-1">
          <p class="text-xs text-gray-700 dark:text-gray-200 truncate">
            {{ attachment.file.name }}
          </p>
          <p class="text-[11px] text-gray-500 dark:text-gray-400">
            {{ formatFileSize(attachment.file.size) }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 justify-center">
      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
        @change="handleAttachmentInput"
      />
      <UButton
        class="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors mx-auto"
        :title="t('common.attach') || 'Прикрепить'"
        icon="i-lucide-paperclip"
        @click="openAttachmentDialog"
      />

      <div class="flex-1">
        <div
          class="rounded-2xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 transition-all"
        >
          <textarea
            v-model="messageText"
            rows="1"
            :placeholder="t('chat.placeholder') || 'Введите сообщение...'"
            class="w-full resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-sm overflow-y-auto border-success"
            color="success"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.exact="messageText += '\n'"
            @blur="
              clearTypingTimer();
              handleTyping({
                data: {
                  chatUuid: chat?.uuid!,
                  isTyping: false,
                  userUuid: user?.uuid!,
                },
              });
            "
            @input="onTypingInput"
          />
        </div>
      </div>

      <UButton
        @click="sendMessage"
        class="p-3 rounded-xl bg-success text-black hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :title="t('common.send') || 'Отправить'"
        :disabled="!canSendMessage || isSending"
        :icon="isSending ? 'i-lucide-loader-2' : 'i-lucide-send'"
      >
      </UButton>
    </div>
  </div>
</template>
