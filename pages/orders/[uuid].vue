<template>
  <div class="min-h-screen bg-gradient-content rounded-xl">
    <!-- Header -->
    <div class="relative bg-gradient-nav">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center gap-4">
          <NuxtLink :to="localePath('/orders')">
            <UButton
              color="neutral"
              variant="outline"
              size="sm"
              icon="i-lucide-arrow-left"
            >
              {{ t("orders.back_to_orders") }}
            </UButton>
          </NuxtLink>
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ t("orders.order_details") }}
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              {{ t("orders.order_id") }}: #{{ orderUuid.slice(0, 8) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-success"
        ></div>
      </div>

      <!-- Error State -->
      <div v-else-if="orderError" class="text-center py-12">
        <UIcon
          name="i-lucide-alert-circle"
          class="w-16 h-16 text-red-500 mx-auto mb-4"
        />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ t("orders.not_found") }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          {{ t("orders.not_found_description") }}
        </p>
        <NuxtLink :to="localePath('/orders')">
          <UButton color="success" variant="solid" size="lg">
            {{ t("orders.back_to_orders") }}
          </UButton>
        </NuxtLink>
      </div>

      <!-- Order Content -->
      <div v-else-if="order" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Order Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Order Main Info -->
          <div
            class="rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50"
          >
            <div class="flex items-start justify-between mb-6">
              <div class="flex items-center">
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                >
                  {{ order.task?.title || t("orders.order") }}
                </h2>
              </div>
              <div
                v-if="order && deadline"
                class="flex items-center gap-3 px-4 py-2 rounded-lg border transition-colors"
                :class="
                  timeRemaining <= 0
                    ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-500/10 dark:to-rose-500/10 border-red-200 dark:border-red-500/20'
                    : timeRemaining < 24 * 60 * 60 * 1000
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border-amber-200 dark:border-amber-500/20'
                    : 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border-green-200 dark:border-green-500/20'
                "
              >
                <UIcon
                  name="i-lucide-timer"
                  :class="
                    timeRemaining <= 0
                      ? 'w-5 h-5 text-red-600 dark:text-red-400'
                      : timeRemaining < 24 * 60 * 60 * 1000
                      ? 'w-5 h-5 text-amber-600 dark:text-amber-400'
                      : 'w-5 h-5 text-green-600 dark:text-green-400'
                  "
                />
                <div class="flex flex-col">
                  <span
                    :class="
                      timeRemaining <= 0
                        ? 'text-xs font-medium text-red-700 dark:text-red-300'
                        : timeRemaining < 24 * 60 * 60 * 1000
                        ? 'text-xs font-medium text-amber-700 dark:text-amber-300'
                        : 'text-xs font-medium text-green-700 dark:text-green-300'
                    "
                  >
                    {{ t("orders.time_remaining") }}
                  </span>
                  <span
                    class="text-lg font-bold"
                    :class="
                      timeRemaining <= 0
                        ? 'text-red-600 dark:text-red-400'
                        : timeRemaining < 24 * 60 * 60 * 1000
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-green-600 dark:text-green-400'
                    "
                  >
                    {{ formatTimeRemaining(timeRemaining) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3 mb-4">
              <UBadge
                :color="getStatusColor(order.status) as any"
                variant="soft"
                size="md"
                class="font-semibold"
              >
                {{ t(`orders.status.${order.status}`) }}
              </UBadge>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(order.createdAt) }}
              </span>
            </div>

            <!-- Order Description -->
            <div
              v-if="order.task?.description"
              class="prose dark:prose-invert max-w-none mb-6"
            >
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ order.task.description }}
              </p>
            </div>

            <!-- Order Details Grid -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div
                class="rounded-xl p-4 bg-gradient-to-br from-green-50 to-white dark:from-green-500/10 dark:to-transparent border border-green-100 dark:border-green-500/20"
              >
                <div class="flex items-center gap-3 mb-2">
                  <div class="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg">
                    <UIcon
                      name="i-lucide-wallet"
                      class="w-5 h-5 text-green-600 dark:text-green-400"
                    />
                  </div>
                  <span
                    class="text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    {{ t("orders.price") }}
                  </span>
                </div>
                <p
                  class="text-2xl font-bold text-green-600 dark:text-green-400"
                >
                  {{ formatPrice(order.price) }} ₽
                </p>
              </div>

              <div
                class="rounded-xl p-4 bg-gradient-to-br from-blue-50 to-white dark:from-blue-500/10 dark:to-transparent border border-blue-100 dark:border-blue-500/20"
              >
                <div class="flex items-center gap-3 mb-2">
                  <div class="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                    <UIcon
                      name="i-lucide-calendar"
                      class="w-5 h-5 text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <span
                    class="text-sm font-medium text-gray-600 dark:text-gray-400"
                  >
                    {{ t("orders.deadline") }}
                  </span>
                </div>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {{ formatPlural(order.duration, "days") }}
                </p>
              </div>
            </div>

            <!-- Participants -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t("orders.participants") }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Client -->
                <div
                  class="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                >
                  <UAvatar
                    :src="order.client?.avatarUrl || undefined"
                    :alt="order.client?.firstName || 'Client'"
                    size="lg"
                    class="ring-2 ring-gray-300 dark:ring-gray-600"
                  />
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >
                      {{ t("orders.client") }}
                    </p>
                    <p
                      class="text-base font-semibold text-gray-900 dark:text-white truncate"
                    >
                      {{ order.client?.firstName }} {{ order.client?.lastName }}
                    </p>
                  </div>
                </div>

                <!-- Freelancer -->
                <div
                  class="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                >
                  <UAvatar
                    :src="order.freelancer?.avatarUrl || undefined"
                    :alt="order.freelancer?.firstName || 'Freelancer'"
                    size="lg"
                    class="ring-2 ring-success"
                  />
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >
                      {{ t("orders.freelancer") }}
                    </p>
                    <p
                      class="text-base font-semibold text-gray-900 dark:text-white truncate"
                    >
                      {{ order.freelancer?.firstName }}
                      {{ order.freelancer?.lastName }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div
              v-if="canManageOrder"
              class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <div class="flex flex-wrap gap-3">
                <!-- Кнопки для заказчика -->
                <template v-if="isClient">
                  <!-- В работе (disabled) -->
                  <UBadge
                    v-if="order.status === 'active'"
                    color="success"
                    variant="outline"
                    size="lg"
                    icon="i-lucide-clock"
                    class="font-semibold"
                    disabled
                  >
                    {{ t("orders.in_progress") }}
                  </UBadge>

                  <!-- Подтвердить заказ (когда на проверке) -->
                  <UButton
                    v-if="order.status === 'in_review'"
                    color="success"
                    size="lg"
                    icon="i-lucide-check-circle"
                    class="font-semibold"
                    @click="handleCompleteOrder"
                  >
                    {{ t("orders.complete") }}
                  </UButton>

                  <!-- Отправить на доработку (когда на проверке) -->
                  <UButton
                    v-if="order.status === 'in_review'"
                    color="warning"
                    variant="outline"
                    size="lg"
                    icon="i-lucide-rotate-cw"
                    class="font-semibold"
                    @click="handleSendForRevision"
                  >
                    {{ t("orders.send_for_revision") }}
                  </UButton>
                </template>

                <!-- Кнопки для исполнителя -->
                <template v-if="isFreelancer">
                  <!-- Таймер обратного отсчета (когда в работе) -->

                  <!-- Сдать работу (когда в работе) -->
                  <UButton
                    v-if="order.status === 'active'"
                    color="success"
                    size="lg"
                    icon="i-lucide-send"
                    class="font-semibold"
                    @click="handleSubmitWork"
                  >
                    {{ t("orders.submit_work") }}
                  </UButton>
                </template>

                <!-- Отменить заказ (для всех, кроме завершенных и отмененных) -->
                <UButton
                  v-if="
                    order.status !== 'completed' && order.status !== 'cancelled'
                  "
                  color="error"
                  variant="outline"
                  size="lg"
                  icon="i-lucide-x-circle"
                  class="font-semibold"
                  @click="handleCancelOrder"
                >
                  {{ t("orders.cancel") }}
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Chat -->
        <div class="lg:col-span-1">
          <section
            v-if="chat && outUser"
            class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden"
            style="height: calc(100vh - 200px); min-height: 600px"
          >
            <!-- Chat Header -->
            <ChatHeader :out-user="outUser" :chat="chat" />

            <!-- Messages -->
            <ChatMessages :chat="chat" />

            <!-- Chat Input -->
            <ChatInput :chat="chat" />
          </section>
          <div
            v-else
            class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center"
            style="height: calc(100vh - 200px); min-height: 600px"
          >
            <UIcon
              name="i-lucide-message-circle"
              class="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3"
            />
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t("orders.no_messages") }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Offer Modal -->
    <OfferModal :chat="chat || null" />
  </div>
</template>

<script setup lang="ts">
import type { IOrder } from "@/types/order.interface";
import { useOrderApi } from "@/composables/api/useOrderApi";
import { useUser } from "@/composables/useUser";
import { usePluralization } from "@/composables/usePluralization";
import { useChatsStore } from "@/stores/chat/useChatsStore";
import { useChatApi } from "@/composables/api/useChatApi";
import type { IChat } from "@/types/chat.interface";
import type { IMessage } from "@/types/message.interface";
import { storeToRefs } from "pinia";
import { watch, onBeforeUnmount } from "vue";
import ChatHeader from "@/components/chat/chat-header.vue";
import ChatMessages from "@/components/chat/chat-messages.vue";
import ChatInput from "@/components/chat/chat-input.vue";
import OfferModal from "@/components/chat/offer-modal.vue";

definePageMeta({
  middleware: "auth",
});

const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const { user } = useUser();
const { formatPlural } = usePluralization();
const { getOrderById, updateOrder } = useOrderApi();
const toast = useToast();
const chatsStore = useChatsStore();
const { getChatByParticipantsIds, createChat, getChatMessages } = useChatApi();

// Load chats if store is empty
const { getChats } = useChatApi();
try {
  const { data: chatsData } = await getChats();
  if (chatsData.value && !chatsStore.chats.length) {
    chatsStore.setChats(chatsData.value as IChat[]);
  }
} catch (error) {
  console.error("Error loading chats:", error);
  // Continue without chats if loading fails
}

// Use storeToRefs for reactivity
const { chats } = storeToRefs(chatsStore);

// Order state - must be declared before watch
const order = ref<IOrder | null>(null);
const isLoading = ref(true);
const orderError = ref<any>(null);

// Other user (client or freelancer) - must be declared before watch
const otherUser = computed(() => {
  if (!order.value || !user.value) return null;
  return order.value.client?.uuid === user.value.uuid
    ? order.value.freelancer
    : order.value.client;
});

// Find or create chat between order participants
const loadOrCreateChat = async () => {
  if (!order.value || !user.value || !otherUser.value) {
    return;
  }

  const userUuid = user.value.uuid;
  const otherUserUuid = otherUser.value.uuid;

  // Try to find existing chat in store first
  let foundChat = chats.value.find(
    (c) =>
      (c.user1?.uuid === userUuid && c.user2?.uuid === otherUserUuid) ||
      (c.user1?.uuid === otherUserUuid && c.user2?.uuid === userUuid)
  );

  if (foundChat) {
    // Load messages if not loaded
    if (!foundChat.messages || foundChat.messages.length === 0) {
      try {
        const { data: messagesData, error: messagesError } =
          await getChatMessages(foundChat.uuid);
        if (messagesError.value) {
          console.error("Error loading messages:", messagesError.value);
          // Set empty messages array if loading fails
          foundChat.messages = [];
        } else if (messagesData.value) {
          const messages = Array.isArray(messagesData.value)
            ? messagesData.value
            : (messagesData.value as any)?.data || [];
          const updatedChat: IChat = {
            ...foundChat,
            messages: messages as IMessage[],
          };
          chatsStore.updateChat(foundChat.uuid, updatedChat);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        // Set empty messages array if loading fails
        foundChat.messages = [];
      }
    }
    return;
  }

  // Try to find via API
  try {
    const { data: chatData, error: chatError } = await getChatByParticipantsIds(
      [userUuid, otherUserUuid]
    );

    if (chatError.value) {
      console.error("Error finding chat by participants:", chatError.value);
      // Continue to create new chat
    } else if (
      chatData.value &&
      typeof chatData.value === "object" &&
      "uuid" in chatData.value
    ) {
      foundChat = chatData.value as IChat;
      // Load messages
      try {
        const { data: messagesData, error: messagesError } =
          await getChatMessages(foundChat.uuid);
        if (messagesError.value) {
          console.error("Error loading messages:", messagesError.value);
          foundChat.messages = [];
        } else if (messagesData.value) {
          const messages = Array.isArray(messagesData.value)
            ? messagesData.value
            : (messagesData.value as any)?.data || [];
          foundChat.messages = messages as IMessage[];
        } else {
          foundChat.messages = [];
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        foundChat.messages = [];
      }
      chatsStore.addChat(foundChat);
      return;
    }
  } catch (error) {
    console.error("Error finding chat:", error);
    // Continue to create new chat
  }

  // Create new chat if not found
  try {
    const { data: newChatData, error: createError } = await createChat({
      recipient_id: otherUserUuid,
    });

    if (createError.value) {
      console.error("Error creating chat:", createError.value);
      // Don't throw, just log the error
    } else if (
      newChatData.value &&
      typeof newChatData.value === "object" &&
      "uuid" in newChatData.value
    ) {
      const newChat = newChatData.value as IChat;
      newChat.messages = [];
      chatsStore.addChat(newChat);
    }
  } catch (error) {
    console.error("Error creating chat:", error);
    // Don't throw, just log the error - page should still work without chat
  }
};

// Watch for order and user to load/create chat
watch(
  [() => order.value, () => user.value, () => otherUser.value],
  () => {
    if (order.value && user.value && otherUser.value) {
      loadOrCreateChat();
    }
  },
  { immediate: true }
);

// Get chat from store
const chat = computed(() => {
  if (!order.value || !user.value || !otherUser.value) {
    return null;
  }

  const userUuid = user.value.uuid;
  const otherUserUuid = otherUser.value.uuid;

  return (
    chats.value.find(
      (c) =>
        (c.user1?.uuid === userUuid && c.user2?.uuid === otherUserUuid) ||
        (c.user1?.uuid === otherUserUuid && c.user2?.uuid === userUuid)
    ) || null
  );
});

const outUser = computed(() => {
  if (!chat.value || !user.value) return null;
  return chat.value.user1?.uuid === user.value.uuid
    ? chat.value.user2
    : chat.value.user1;
});

const orderUuid = computed(() => route.params.uuid as string);

// Load order data
const loadOrder = async () => {
  isLoading.value = true;
  orderError.value = null;
  try {
    const { data, error } = await getOrderById(orderUuid.value);
    if (error.value) {
      orderError.value = error.value;
      order.value = null;
    } else {
      const orderData = data.value as IOrder | null;
      if (orderData) {
        // Ensure dates are Date objects
        if (orderData.createdAt && typeof orderData.createdAt === "string") {
          orderData.createdAt = new Date(orderData.createdAt) as any;
        }
        if (orderData.updatedAt && typeof orderData.updatedAt === "string") {
          orderData.updatedAt = new Date(orderData.updatedAt) as any;
        }
      }
      order.value = orderData;
    }
  } catch (err) {
    orderError.value = err;
    order.value = null;
  } finally {
    isLoading.value = false;
  }
};

// Load order on mount
await loadOrder();

const refreshOrder = () => loadOrder();

// Check if user can manage order
const canManageOrder = computed(() => {
  if (!order.value || !user.value) return false;
  return (
    order.value.client?.uuid === user.value.uuid ||
    order.value.freelancer?.uuid === user.value.uuid
  );
});

// Check user role
const isClient = computed(() => {
  if (!order.value || !user.value) return false;
  return order.value.client?.uuid === user.value.uuid;
});

const isFreelancer = computed(() => {
  if (!order.value || !user.value) return false;
  return order.value.freelancer?.uuid === user.value.uuid;
});

// Calculate deadline
const deadline = computed(() => {
  if (!order.value || !order.value.createdAt || !order.value.duration) {
    return null;
  }
  try {
    // Handle both Date objects and strings
    let createdAt: Date;
    if (order.value.createdAt instanceof Date) {
      createdAt = order.value.createdAt;
    } else if (typeof order.value.createdAt === "string") {
      createdAt = new Date(order.value.createdAt);
    } else {
      console.error("Invalid createdAt type:", typeof order.value.createdAt);
      return null;
    }

    if (isNaN(createdAt.getTime())) {
      console.error("Invalid createdAt date:", order.value.createdAt);
      return null;
    }

    const deadlineDate = new Date(
      createdAt.getTime() + order.value.duration * 24 * 60 * 60 * 1000
    );

    if (isNaN(deadlineDate.getTime())) {
      console.error("Invalid deadline date calculated");
      return null;
    }

    return deadlineDate;
  } catch (error) {
    console.error("Error calculating deadline:", error, order.value);
    return null;
  }
});

// Time remaining timer
const timeRemaining = ref(0);
let timerInterval: ReturnType<typeof setInterval> | null = null;

const updateTimeRemaining = () => {
  if (!deadline.value) {
    timeRemaining.value = 0;
    return;
  }
  try {
    const now = new Date();
    const diff = deadline.value.getTime() - now.getTime();
    timeRemaining.value = Math.max(0, diff);
  } catch (error) {
    console.error("Error updating time remaining:", error);
    timeRemaining.value = 0;
  }
};

// Format time remaining
const formatTimeRemaining = (ms: number) => {
  if (ms <= 0) {
    return `${t("orders.time_expired") || "Время заказа истекло!"}`;
  }

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  if (days > 0) {
    return `${days}д ${remainingHours}ч ${remainingMinutes}м ${remainingSeconds}с`;
  } else if (remainingHours > 0) {
    return `${remainingHours}ч ${remainingMinutes}м ${remainingSeconds}с`;
  } else if (remainingMinutes > 0) {
    return `${remainingMinutes}м ${remainingSeconds}с`;
  } else {
    return `${remainingSeconds}с`;
  }
};

// Start timer
const startTimer = () => {
  // Only run on client side
  if (process.server) return;

  if (timerInterval) {
    clearInterval(timerInterval);
  }
  updateTimeRemaining();
  timerInterval = setInterval(() => {
    updateTimeRemaining();
  }, 1000);
};

// Stop timer
const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

// Watch for order changes to start/stop timer
watch(
  [() => order.value, () => isFreelancer.value, () => deadline.value],
  () => {
    // Only run on client side
    if (process.server) return;

    if (
      order.value &&
      isFreelancer.value &&
      order.value.status === "active" &&
      deadline.value
    ) {
      // Update immediately when order loads
      updateTimeRemaining();
      startTimer();
    } else {
      stopTimer();
      // Reset to 0 if conditions not met
      if (!order.value || !deadline.value) {
        timeRemaining.value = 0;
      }
    }
  },
  { immediate: true }
);

// Cleanup on unmount
onBeforeUnmount(() => {
  stopTimer();
});

// Format functions
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price);
};

const formatDate = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "warning",
    active: "success",
    in_review: "amber",
    completed: "success",
    cancelled: "error",
  };
  return colors[status] || "neutral";
};

// Order actions
const handleCompleteOrder = async () => {
  if (!order.value) return;
  try {
    await updateOrder(order.value.uuid, { status: "completed" });
    await refreshOrder();
    toast.add({
      title: t("orders.success"),
      description: t("orders.completed_success"),
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: t("common.error"),
      description: t("orders.complete_error"),
      color: "error",
    });
  }
};

// Submit work (freelancer)
const handleSubmitWork = async () => {
  if (!order.value) return;
  try {
    await updateOrder(order.value.uuid, { status: "in_review" });
    await refreshOrder();
    toast.add({
      title: t("orders.success"),
      description: t("orders.submitted_success"),
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: t("common.error"),
      description: t("orders.submit_error"),
      color: "error",
    });
  }
};

// Send for revision (client)
const handleSendForRevision = async () => {
  if (!order.value) return;
  if (!confirm(t("orders.revision_confirm"))) return;
  try {
    await updateOrder(order.value.uuid, { status: "active" });
    await refreshOrder();
    toast.add({
      title: t("orders.success"),
      description: t("orders.revision_success"),
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: t("common.error"),
      description: t("orders.revision_error"),
      color: "error",
    });
  }
};

const handleCancelOrder = async () => {
  if (!order.value) return;
  if (!confirm(t("orders.cancel_confirm"))) return;
  try {
    await updateOrder(order.value.uuid, { status: "cancelled" });
    await refreshOrder();
    toast.add({
      title: t("orders.success"),
      description: t("orders.cancelled_success"),
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: t("common.error"),
      description: t("orders.cancel_error"),
      color: "error",
    });
  }
};
</script>
