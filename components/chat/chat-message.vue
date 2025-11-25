<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import type { IMessage } from "@/types/message.interface";
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

console.log(props.message);
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
  return status.value === "read"
    ? "text-primary-500"
    : "text-gray-400 dark:text-gray-500";
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
      class="max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm flex flex-col gap-1"
      :class="
        props.isOwn
          ? 'bg-success text-black rounded-br-md'
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-700'
      "
    >
      <p class="whitespace-pre-line break-words text-sm">
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
</template>
