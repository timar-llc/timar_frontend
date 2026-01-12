<template>
  <div class="min-h-screen bg-gradient-content rounded-xl">
    <!-- Header -->
    <div class="relative bg-gradient-nav">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ t("notifications.title") }}
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              {{ t("notifications.description") }}
            </p>
          </div>
          <div class="flex gap-3">
            <UButton
              v-if="unreadCount > 0"
              color="success"
              variant="outline"
              size="lg"
              icon="i-lucide-check-check"
              @click="markAllAsRead"
            >
              {{ t("notifications.mark_all_read") }}
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              icon="i-lucide-refresh-cw"
              :loading="isLoading"
              @click="loadNotifications"
            >
              {{ t("common.refresh") }}
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          class="rounded-2xl p-6 shadow-sm border border-blue-100 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/90 to-white dark:from-blue-500/10 dark:to-transparent"
        >
          <div class="flex items-center">
            <div
              class="p-3 bg-blue-100/80 dark:bg-blue-500/15 rounded-lg flex justify-center"
            >
              <UIcon
                name="i-lucide-bell"
                class="w-6 h-6 text-blue-700 dark:text-blue-400"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ t("notifications.stats.total") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ notifications.length }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl p-6 shadow-sm border border-green-100 dark:border-green-500/20 bg-gradient-to-br from-green-50/90 to-white dark:from-green-500/10 dark:to-transparent"
        >
          <div class="flex items-center">
            <div
              class="p-3 bg-green-100/80 dark:bg-green-500/15 rounded-lg flex justify-center"
            >
              <UIcon
                name="i-lucide-bell-ring"
                class="w-6 h-6 text-green-700 dark:text-green-400"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ t("notifications.stats.unread") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ unreadCount }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50/90 to-white dark:from-gray-900/50 dark:to-transparent"
        >
          <div class="flex items-center">
            <div
              class="p-3 bg-gray-100/80 dark:bg-gray-800/50 rounded-lg flex justify-center"
            >
              <UIcon
                name="i-lucide-check-circle-2"
                class="w-6 h-6 text-gray-700 dark:text-gray-300"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ t("notifications.stats.read") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ readCount }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6">
        <UTabs
          :items="filterTabs"
          v-model="activeFilter"
          color="success"
          class="w-full"
          :ui="{
            trigger: 'text-sm',
            content: 'bg-white',
            list: 'bg-card-bg shadow-lg ',
          }"
        />
      </div>

      <!-- Notifications List -->
      <div
        class="rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 overflow-hidden"
      >
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-success"
          ></div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="filteredNotifications.length === 0"
          class="flex flex-col items-center justify-center py-16 px-6"
        >
          <div
            class="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mb-6 flex items-center justify-center"
          >
            <UIcon
              name="i-lucide-bell-off"
              class="w-10 h-10 text-gray-400 dark:text-gray-500"
            />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ t("notifications.empty.title") }}
          </h3>
          <p
            class="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md"
          >
            {{ t("notifications.empty.description") }}
          </p>
        </div>

        <!-- Notifications -->
        <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
          <div
            v-for="notification in filteredNotifications"
            :key="notification.uuid"
            class="group relative p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer"
            :class="{
              'bg-blue-50/30 dark:bg-blue-900/10': !notification.readedAt,
            }"
            @click="handleNotificationClick(notification)"
          >
            <!-- Индикатор непрочитанного -->
            <div
              v-if="!notification.readedAt"
              class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"
            ></div>

            <div class="flex items-start gap-4 pl-2">
              <!-- Icon -->
              <div class="flex-shrink-0">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-110"
                  :class="
                    notification.icon === 'success'
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                      : notification.icon === 'warning'
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
                      : notification.icon === 'error'
                      ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white'
                      : 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white'
                  " 
                >
                  <UIcon
                    :name="getNotificationIcon(notification.icon)"
                    class="w-6 h-6"
                  />
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3 mb-2">
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-base font-bold text-gray-900 dark:text-white mb-1"
                    >
                      {{ notification.title }}
                    </p>
                    <p
                      class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
                    >
                      {{ notification.description }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <div
                      v-if="!notification.readedAt"
                      class="w-2.5 h-2.5 bg-blue-500 rounded-full"
                    ></div>
                  </div>
                </div>

                <div class="flex items-center gap-4 mt-3">
                  <div class="flex items-center gap-1.5">
                    <UIcon
                      name="i-lucide-clock"
                      class="w-4 h-4 text-gray-400 dark:text-gray-500"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatTimeAgo(notification.createdAt) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6 flex justify-center">
        <UPagination
          v-model:page="currentPage"
          :total="totalNotifications"
          :page-size="itemsPerPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { usePluralization } from "@/composables/usePluralization";
import { useNotificationApi } from "@/composables/api/useNotificationApi";
import { useNotificationsStore } from "@/stores/notifications/useNotificationsStore";

definePageMeta({
  middleware: "auth",
});

const { t } = useI18n();
const { formatTimeAgo } = usePluralization();
const toast = useToast();
const { getNotifications, updateNotification } = useNotificationApi();
const notificationsStore = useNotificationsStore();

// State
const activeFilter = ref<"all" | "unread" | "read">("all");
const currentPage = ref(1);
const itemsPerPage = 10;

// Используем данные из store
const notifications = computed(() => notificationsStore.notifications);
const isLoading = computed(() => notificationsStore.isLoading);

// Filter tabs
const filterTabs = computed(() => [
  {
    label: `${t("notifications.filters.all")} (${notifications.value.length})`,
    value: "all",
  },
  {
    label: `${t("notifications.filters.unread")} (${unreadCount.value})`,
    value: "unread",
  },
  {
    label: `${t("notifications.filters.read")} (${readCount.value})`,
    value: "read",
  },
]);

// Computed
const unreadCount = computed(() => notificationsStore.unreadCount);
const readCount = computed(() => notificationsStore.readCount);

const filteredNotifications = computed(() => {
  let filtered = notifications.value;

  // Filter by read status
  if (activeFilter.value === "unread") {
    filtered = filtered.filter((n) => !n.readedAt);
  } else if (activeFilter.value === "read") {
    filtered = filtered.filter((n) => n.readedAt);
  }

  // Sort by date (newest first)
  filtered = filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filtered.slice(start, end);
});

const totalNotifications = computed(() => {
  if (activeFilter.value === "unread") {
    return unreadCount.value;
  } else if (activeFilter.value === "read") {
    return readCount.value;
  }
  return notifications.value.length;
});

const totalPages = computed(() => {
  return Math.ceil(totalNotifications.value / itemsPerPage);
});

// Methods
const loadNotifications = async () => {
  notificationsStore.setLoading(true);
  try {
    const { data } = await getNotifications({
      take: 100,
      skip: 0,
    });

    const raw = data.value as any;
    let items: any[] = [];

    if (Array.isArray(raw)) {
      items = raw;
    } else if (raw?.items && Array.isArray(raw.items)) {
      items = raw.items;
    } else if (raw?.data && Array.isArray(raw.data)) {
      items = raw.data;
    } else {
      items = [];
    }

    const mappedNotifications = items.map((n) => {
      const created =
        n.createdAt && !isNaN(new Date(n.createdAt).getTime())
          ? new Date(n.createdAt)
          : new Date();

      return {
        uuid: n.uuid,
        title: n.title || "",
        description: n.description || "",
        slug: n.slug || "",
        user: n.user || null,
        icon: n.icon || "info",
        readedAt: n.readedAt || null,
        createdAt: created,
      };
    });

    notificationsStore.setNotifications(mappedNotifications);
  } catch (error) {
    console.error("Error loading notifications:", error);
    notificationsStore.setError("Failed to load notifications");
    toast.add({
      title: t("common.error"),
      description: t("notifications.load_error"),
      color: "error",
    });
  } finally {
    notificationsStore.setLoading(false);
  }
};

const markAllAsRead = async () => {
  try {
    const now = new Date();

    // Параллельно отправляем запросы, но не блокируем UI, если что-то упадет
    await Promise.allSettled(
      notificationsStore.notifications
        .filter((notification) => !notification.readedAt && notification.uuid)
        .map((notification) =>
          updateNotification(notification.uuid, now).catch(() => null)
        )
    );

    notificationsStore.markAllAsRead();

    toast.add({
      title: t("notifications.success"),
      description: t("notifications.marked_all_read"),
      color: "success",
    });
  } catch (error) {
    console.error("Error marking all as read:", error);
    toast.add({
      title: t("common.error"),
      description: t("notifications.mark_all_read_error"),
      color: "error",
    });
  }
};

const handleNotificationClick = async (notification: any) => {
  if (!notification.readedAt) {
    try {
      if (notification.uuid) {
        await updateNotification(notification.uuid, new Date());
      }
      notificationsStore.markAsRead(notification.uuid);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  // TODO: Add navigation logic based on notification type
  console.log("Notification clicked:", notification);
};

const handleDeleteNotification = async (notification: any) => {
  try {
    const index = notifications.value.findIndex(
      (n) => n.uuid === notification.uuid
    );
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }

    toast.add({
      title: t("notifications.success"),
      description: t("notifications.deleted"),
      color: "success",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    toast.add({
      title: t("common.error"),
      description: t("notifications.delete_error"),
      color: "error",
    });
  }
};

const getNotificationIcon = (icon: string) => {
  switch (icon) {
    case "success":
      return "i-lucide-check-circle";
    case "warning":
      return "i-lucide-alert-triangle"
    case "error":
      return "i-lucide-x-circle"
    case "info":
      return "i-lucide-info"
    default:
      return "i-lucide-bell"
  }
};

const getNotificationBadgeColor = (icon: string) => {
  switch (icon) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "error":
      return "error";
    case "info":
      return "info";
    default:
      return "neutral";
  }
};

// Load notifications on mount
await loadNotifications();
</script>
