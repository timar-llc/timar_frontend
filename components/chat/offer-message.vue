<template>
  <div
    ref="messageRef"
    class="flex flex-col gap-2"
    :class="isOwn ? 'items-end' : 'items-start'"
  >
    <!-- Основной блок предложения -->
    <div
      class="bg-success text-black rounded-2xl p-4 max-w-md shadow-sm"
      style="
        background: linear-gradient(
          135deg,
          #9eff00 0%,
          #8eef00 50%,
          #7edf00 100%
        );
      "
    >
      <!-- Содержание предложения -->
      <p
        v-if="message.metadata?.description || message.content"
        class="text-sm mb-4 leading-relaxed"
      >
        {{ message.metadata?.description || message.content }}
      </p>

      <!-- Детали предложения -->
      <div
        class="space-y-2.5 mb-4 p-3 rounded-lg"
        style="background: rgba(255, 255, 255, 0.25)"
      >
        <div class="flex justify-between items-center">
          <span class="text-sm">{{ t("chat.budget") }}:</span>
          <span
            class="font-semibold text-base px-2.5 py-1 rounded"
            style="background: rgba(255, 255, 255, 0.4)"
            >{{ formatPrice(message.metadata?.price as number) }}</span
          >
        </div>
        <div class="h-px" style="background: rgba(0, 0, 0, 0.1)"></div>
        <div class="flex justify-between items-center">
          <span class="text-sm">{{ t("chat.term") }}:</span>
          <span
            class="font-semibold text-base px-2.5 py-1 rounded"
            style="background: rgba(255, 255, 255, 0.4)"
            >{{
              formatPlural(message.metadata?.duration as number, "days")
            }}</span
          >
        </div>
      </div>

      <!-- Кнопки действий (только для фрилансера, когда предложение еще не обработано) -->
      <div v-if="!isOwn && isOfferPending" class="flex gap-2">
        <UButton
          color="success"
          variant="solid"
          size="sm"
          class="flex-1 bg-black text-white hover:bg-black/90 font-medium"
          @click="handleAcceptOffer"
        >
          {{ t("chat.accept_offer") }}
        </UButton>
        <UButton
          color="error"
          variant="solid"
          size="sm"
          class="flex-1 bg-transparent text-black border border-black/20 hover:bg-black/5 font-medium"
          @click="handleRejectOffer"
        >
          {{ t("chat.reject_offer") }}
        </UButton>
      </div>
    </div>

    <!-- Статус предложения -->
    <div
      v-if="!isOfferPending"
      class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl max-w-md shadow-sm border"
      :class="
        message.offerAccepted === true
          ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50'
          : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50'
      "
    >
      <UIcon
        :name="
          message.offerAccepted === true
            ? 'i-lucide-check-circle'
            : 'i-lucide-x-circle'
        "
        class="w-4 h-4"
      />
      <span class="text-sm font-semibold">
        {{
          message.offerAccepted === true
            ? t("chat.offer_accepted")
            : t("chat.offer_rejected")
        }}
      </span>
    </div>

    <!-- Ожидает ответа (только для заказчика) -->
    <div
      v-if="isOwn && isOfferPending"
      class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 max-w-md shadow-sm border border-amber-200 dark:border-amber-800/50"
    >
      <UIcon name="i-lucide-clock" class="w-4 h-4" />
      <span class="text-sm font-semibold">{{
        t("chat.awaiting_response")
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import { useChatSocket } from "@/composables/socket/useChatSocketIo";
import { useChatsStore } from "@/stores/chat/useChatsStore";
import type { IMessage } from "@/types/message.interface";

interface Props {
  message: IMessage;
  isOwn: boolean;
  chatUuid: string;
  freelancerUuid: string;
  clientUuid: string;
  containerRef?: HTMLElement | null;
}

const props = defineProps<Props>();
const { t } = useI18n();
const { formatPlural } = usePluralization();
const { handleOrderProcessing: handleOrderProcessingSocket, handleMarkRead } =
  useChatSocket();
const chatsStore = useChatsStore();

const messageRef = ref<HTMLElement | null>(null);
const hasMarkedAsRead = ref(false);

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

// Check if offer is pending (not accepted or rejected)
const isOfferPending = computed(() => {
  const status = props.message.offerAccepted;
  // Debug log to understand the issue
  if (process.dev) {
    console.log("[OfferMessage] Debug:", {
      messageUuid: props.message.uuid,
      isOwn: props.isOwn,
      offerAccepted: status,
      isPending: status === undefined || status === null,
    });
  }
  return status === undefined || status === null;
});

// Format price with spaces
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
};

const handleAcceptOffer = () => {
  if (!props.message.metadata) return;
  chatsStore.markOffersAfterAccept(props.chatUuid, props.message.uuid);
  // Send event to server - server will broadcast to all participants
  handleOrderProcessingSocket({
    offerMessageUuid: props.message.uuid,
    chatUuid: props.chatUuid,
    content: props.message.content || "",
    clientUuid: props.clientUuid,
    freelancerUuid: props.freelancerUuid,
    price: props.message.metadata.price,
    duration: props.message.metadata.duration,
    orderAccepted: true,
  });
};

const handleRejectOffer = () => {
  if (!props.message.metadata) return;
  // Send event to server - server will broadcast to all participants
  handleOrderProcessingSocket({
    offerMessageUuid: props.message.uuid,
    chatUuid: props.chatUuid,
    content: props.message.content || "",
    clientUuid: props.clientUuid,
    freelancerUuid: props.freelancerUuid,
    price: props.message.metadata.price,
    duration: props.message.metadata.duration,
    orderAccepted: false,
  });
};
</script>
