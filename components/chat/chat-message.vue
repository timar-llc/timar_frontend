<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import type { IMessage, IMessageAttachment } from "@/types/message.interface";
import { formatMessageTime } from "@/utils/formatMessageTime";
import { useChatSocket } from "@/composables/socket/useChatSocketIo";

const props = defineProps<{
  message: IMessage;
  chatUuid: string;
  isOwn: boolean;
  containerRef?: HTMLElement | null;
}>();

const messageRef = ref<HTMLElement | null>(null);
const hasMarkedAsRead = ref(false);
const { handleMarkRead } = useChatSocket();
const runtimeConfig = useRuntimeConfig();

const attachments = computed(() => props.message.attachments || []);
const hasTextContent = computed(() => !!props.message.content?.trim());

const getAttachmentLabel = (attachment: IMessageAttachment) => {
  if (!attachment?.url) return "attachment";
  if (attachment.url.startsWith("data:")) {
    return "Вложение";
  }
  const cleanUrl = attachment.url.split("?")[0];
  try {
    const parsedUrl = new URL(cleanUrl);
    const filename = decodeURIComponent(
      parsedUrl.pathname.split("/").pop() || ""
    );
    return filename || "attachment";
  } catch {
    return cleanUrl.split("/").pop() || "attachment";
  }
};

const buildAbsoluteUrl = (rawUrl: string) => {
  if (!rawUrl) return "";
  if (rawUrl.startsWith("data:") || /^https?:\/\//i.test(rawUrl)) {
    return rawUrl;
  }
  const baseUrl = runtimeConfig.public.apiUrl?.replace(/\/$/, "") || "";
  const normalizedPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
  return `${baseUrl}${normalizedPath}`;
};

const getAttachmentSrc = (attachment: IMessageAttachment) => {
  return buildAbsoluteUrl(attachment?.url || "");
};

const getFilenameFromUrl = (attachment: IMessageAttachment) => {
  const label = getAttachmentLabel(attachment);
  return label.toLowerCase();
};

const isImageAttachment = (attachment: IMessageAttachment) => {
  if (attachment.type === "image") return true;
  return /\.(png|jpe?g|gif|webp|svg|heic|heif)$/i.test(
    getFilenameFromUrl(attachment)
  );
};

const isVideoAttachment = (attachment: IMessageAttachment) => {
  if (attachment.type === "video") return true;
  return /\.(mp4|mov|webm|mkv|avi|ogg)$/i.test(getFilenameFromUrl(attachment));
};

const isAudioAttachment = (attachment: IMessageAttachment) => {
  if (attachment.type === "audio") return true;
  return /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(getFilenameFromUrl(attachment));
};

const previewAttachment = ref<IMessageAttachment | null>(null);
const isPreviewOpen = ref(false);

const openAttachmentPreview = (attachment: IMessageAttachment) => {
  if (!isImageAttachment(attachment) && !isVideoAttachment(attachment)) {
    return;
  }
  previewAttachment.value = attachment;
  isPreviewOpen.value = true;
};

const closeAttachmentPreview = () => {
  isPreviewOpen.value = false;
  previewAttachment.value = null;
};

const status = computed<"sent" | "delivered" | "read" | null>(() => {
  if (!props.isOwn) return null;
  // Watch for changes in readedAt property
  const readedAt = props.message.readedAt;
  if (readedAt) {
    return "read";
  }
  return "sent";
});

const statusColorClass = computed(() => {
  if (!props.isOwn) return "";
  return status.value === "read" ? "text-black" : "text-black/50";
});

let observer: IntersectionObserver | null = null;

const setupObserver = () => {
  // Only track visibility for messages that are not own and not yet read
  if (props.isOwn || props.message.readedAt || hasMarkedAsRead.value) {
    return;
  }

  if (!messageRef.value) return;

  // Clean up existing observer if any
  if (observer && messageRef.value) {
    observer.unobserve(messageRef.value);
    observer.disconnect();
    observer = null;
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !props.isOwn &&
          !props.message.readedAt &&
          !hasMarkedAsRead.value
        ) {
          hasMarkedAsRead.value = true;
          handleMarkRead({
            chatUuid: props.chatUuid,
            timestamp: props.message.createdAt as unknown as string,
            messageUuid: props.message.uuid,
          });
          if (observer && messageRef.value) {
            observer.unobserve(messageRef.value);
            observer.disconnect();
            observer = null;
          }
        }
      });
    },
    {
      root: props.containerRef || null,
      rootMargin: "0px",
      threshold: 0.1, // Trigger when at least 10% of the message is visible
    }
  );

  observer.observe(messageRef.value);
};

// Watch for message read status changes
watch(
  () => props.message.readedAt,
  () => {
    if (props.message.readedAt && observer && messageRef.value) {
      observer.unobserve(messageRef.value);
      observer.disconnect();
      observer = null;
    }
  }
);

watch(
  () => props.message.uuid,
  () => {
    if (isPreviewOpen.value) {
      closeAttachmentPreview();
    }
  }
);

onMounted(async () => {
  await nextTick();
  setupObserver();
});

onBeforeUnmount(() => {
  if (observer && messageRef.value) {
    observer.unobserve(messageRef.value);
    observer.disconnect();
    observer = null;
  }
});
</script>

<template>
  <div
    ref="messageRef"
    class="flex flex-col"
    :class="props.isOwn ? 'items-end' : 'items-start'"
  >
    <div
      class="max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm flex flex-col gap-2"
      :class="
        props.isOwn
          ? 'bg-success text-black rounded-br-md'
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-700'
      "
    >
      <div
        v-if="attachments.length"
        class="flex flex-col gap-3"
        :class="props.isOwn ? 'text-black' : 'text-gray-900 dark:text-gray-100'"
      >
        <div
          v-for="attachment in attachments"
          :key="attachment.uuid"
          class="relative rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5"
        >
          <a
            v-if="isImageAttachment(attachment)"
            :href="getAttachmentSrc(attachment)"
            target="_blank"
            rel="noopener noreferrer"
            :download="getAttachmentLabel(attachment)"
            class="absolute top-2 right-2 z-10 inline-flex items-center justify-center rounded-full bg-black/60 text-white p-1.5 hover:bg-black focus-visible:ring-2 focus-visible:ring-white/70 transition"
            @click.stop
          >
            <UIcon name="i-lucide-download" class="w-4 h-4" />
          </a>
          <img
            v-if="isImageAttachment(attachment)"
            :src="getAttachmentSrc(attachment)"
            alt="attachment"
            class="w-full max-h-72 object-cover cursor-zoom-in"
            @click="openAttachmentPreview(attachment)"
          />
          <video
            v-else-if="isVideoAttachment(attachment)"
            :src="getAttachmentSrc(attachment)"
            class="w-full max-h-72"
            playsinline
            muted
            poster=""
            @click.prevent.stop="openAttachmentPreview(attachment)"
          />
          <audio
            v-else-if="isAudioAttachment(attachment)"
            :src="getAttachmentSrc(attachment)"
            class="w-full"
            controls
          />
          <a
            v-else
            :href="getAttachmentSrc(attachment)"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 p-3 text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <span
              class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/10 dark:bg-white/10 text-base"
            >
              📎
            </span>
            <div class="flex flex-col">
              <span class="font-medium">
                {{ getAttachmentLabel(attachment) }}
              </span>
              <span class="text-xs text-black/60 dark:text-white/60">
                {{ attachment.type === "file" ? "Файл" : attachment.type }}
              </span>
            </div>
          </a>
        </div>
      </div>

      <p v-if="hasTextContent" class="whitespace-pre-line break-words text-sm">
        {{ props.message.content }}
      </p>
      <div
        class="flex items-center gap-1 text-[11px]"
        :class="
          props.isOwn
            ? 'justify-end text-black/70'
            : 'justify-end text-gray-500 dark:text-gray-400'
        "
      >
        <span>
          {{ formatMessageTime(props.message.createdAt) }}
        </span>
        <span
          v-if="props.isOwn"
          class="flex items-center"
          :class="statusColorClass"
        >
          <svg
            v-if="status === 'read'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="m4 12 4 4 6-8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="m11 15 2 2 6-8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="m5 13 4 4L19 7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              v-if="status === 'delivered'"
              d="m9 13 2 2 6-6"
              stroke-linecap="round"
              stroke-linejoin="round"
              opacity="0.6"
            />
          </svg>
        </span>
      </div>
    </div>
  </div>

  <UModal
    v-model:open="isPreviewOpen"
    :title="previewAttachment ? getAttachmentLabel(previewAttachment) : ''"
    @close="closeAttachmentPreview"
    :ui="{
      wrapper: 'sm:max-w-4xl',
      overlay: 'bg-black/80 backdrop-blur',
    }"
  >
    <template v-if="previewAttachment" #body>
      <div class="flex flex-col gap-4">
        <img
          v-if="isImageAttachment(previewAttachment)"
          :src="getAttachmentSrc(previewAttachment)"
          :alt="getAttachmentLabel(previewAttachment)"
          class="w-full max-h-[75vh] object-contain rounded-xl"
        />
        <video
          v-else-if="isVideoAttachment(previewAttachment)"
          :src="getAttachmentSrc(previewAttachment)"
          class="w-full max-h-[75vh] rounded-xl bg-black"
          controls
          autoplay
          playsinline
        />
      </div>
    </template>
  </UModal>
</template>
