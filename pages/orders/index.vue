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
              {{ t("orders.title") }}
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              {{ t("orders.description") }}
            </p>
          </div>
          <div class="flex gap-3">
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              icon="i-lucide-refresh-cw"
              :loading="isLoading"
              @click="loadOrders"
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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div
          class="rounded-2xl p-6 shadow-sm border border-blue-100 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/90 to-white dark:from-blue-500/10 dark:to-transparent"
        >
          <div class="flex items-center">
            <div
              class="p-3 bg-blue-100/80 dark:bg-blue-500/15 rounded-lg flex justify-center"
            >
              <UIcon
                name="i-lucide-briefcase"
                class="w-6 h-6 text-blue-700 dark:text-blue-400"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ t("orders.stats.total") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.total }}
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
                name="i-lucide-check-circle"
                class="w-6 h-6 text-green-700 dark:text-green-400"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ t("orders.stats.completed") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.completed }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl p-6 shadow-sm border border-amber-100 dark:border-amber-500/20 bg-gradient-to-br from-amber-50/90 to-white dark:from-amber-500/10 dark:to-transparent"
        >
          <div class="flex items-center">
            <div
              class="p-3 bg-amber-100/80 dark:bg-amber-500/15 rounded-lg flex justify-center"
            >
              <UIcon
                name="i-lucide-clock"
                class="w-6 h-6 text-amber-700 dark:text-amber-400"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ t("orders.stats.in_progress") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.inProgress }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl p-6 shadow-sm border border-rose-100 dark:border-rose-500/20 bg-gradient-to-br from-rose-50/90 to-white dark:from-rose-500/10 dark:to-transparent"
        >
          <div class="flex items-center">
            <div
              class="p-3 bg-rose-100/80 dark:bg-rose-500/15 rounded-lg flex justify-center"
            >
              <UIcon
                name="i-lucide-x-circle"
                class="w-6 h-6 text-rose-700 dark:text-rose-400"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ t("orders.stats.cancelled") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.cancelled }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs for Client/Freelancer -->
      <div class="mb-6">
        <UTabs
          v-model="activeTab"
          :items="tabItems"
          color="neutral"
          :ui="{
            trigger: 'text-sm',
            content: 'bg-white',
            list: 'bg-card-bg shadow-lg ',
          }"
          @update:model-value="handleTabChange"
        />
      </div>

      <!-- Filters -->
      <div
        class="bg-card-bg rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 min-w-fit">
            <UInput
              v-model="searchQuery"
              :placeholder="t('common.search')"
              icon="i-lucide-search"
              color="neutral"
              class="w-fit"
              size="lg"
            />
          </div>
          <USelect
            v-model="selectedStatus"
            :items="statusOptions"
            :placeholder="t('orders.filters.status')"
            size="lg"
            color="neutral"
            class="w-full sm:w-48 bg-card-bg"
          />
          <UButton
            v-if="searchQuery || selectedStatus"
            @click="clearFilters"
            color="neutral"
            variant="outline"
            class="bg-card-bg hover:bg-card-bg"
            size="lg"
            icon="i-lucide-x"
          >
            {{ t("common.clear_filters") }}
          </UButton>
        </div>
      </div>

      <!-- Orders Grid -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-success"
        ></div>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
        <UIcon
          name="i-lucide-briefcase"
          class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
        />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ t("orders.no_orders_found") }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ t("orders.no_orders_description") }}
        </p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="order in filteredOrders"
          :key="order.uuid"
          class="bg-card-bg rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
          @click="navigateToOrder(order.uuid)"
        >
          <!-- Order Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-1"
              >
                {{ order.title }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ t("orders.id") }}: #{{ order.uuid.slice(0, 8) }}
              </p>
            </div>
            <UBadge
              :color="getStatusColor(order.status)"
              variant="soft"
              size="sm"
            >
              {{ t(`orders.status.${order.status}`) }}
            </UBadge>
          </div>

          <!-- Order Description -->
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {{ order.description }}
          </p>

          <!-- Progress Bar -->
          <div v-if="order.progress !== undefined" class="mb-4">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-gray-600 dark:text-gray-400">
                {{ t("orders.progress") }}
              </span>
              <span class="text-xs font-medium text-gray-900 dark:text-white">
                {{ order.progress }}%
              </span>
            </div>
            <UProgress
              :value="order.progress"
              :max="100"
              color="success"
              class="h-2"
            />
          </div>

          <!-- Order Info -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {{ t("orders.budget") }}
              </p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(order.budget) }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {{ t("orders.deadline") }}
              </p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatDate(order.deadline) }}
              </p>
            </div>
          </div>

          <!-- User Info -->
          <div
            class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center gap-3">
              <UAvatar
                :src="order.freelancer?.avatarUrl!"
                :alt="order.freelancer?.firstName || t('orders.unknown')"
                size="sm"
                class="w-8 h-8 rounded-full object-cover"
              />
              <div class="flex flex-col">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ order.freelancer?.firstName }}
                  {{ order.freelancer?.lastName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ order.freelancer?.specialization }}
                </p>

                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{
                    activeTab === "client"
                      ? t("orders.freelancer")
                      : t("orders.client")
                  }}
                </p>
              </div>
            </div>
            <UIcon
              name="i-lucide-arrow-right"
              class="w-5 h-5 text-gray-400 dark:text-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import type { IOrder } from "@/types/order.interface";
import { useOrderApi } from "@/composables/api/useOrderApi";
import { useUser } from "@/composables/useUser";
import type { SelectItem } from "@nuxt/ui";

definePageMeta({
  middleware: "auth",
});

const { t } = useI18n();
const localePath = useLocalePath();
const { user, fetchUser } = useUser();
const { getOrders } = useOrderApi();

// State
const orders = ref<IOrder[]>([]);
const isLoading = ref(false);
const activeTab = ref<"client" | "freelancer">("client");
const searchQuery = ref("");
const selectedStatus = ref<string>("all");

// Tab items
const tabItems = computed(() => [
  {
    label: `${t("orders.tabs.as_client")} (${clientOrders.value.length})`,
    value: "client",
  },
  {
    label: `${t("orders.tabs.as_freelancer")} (${
      freelancerOrders.value.length
    })`,
    value: "freelancer",
  },
]);

// Filter options
const statusOptions = computed<SelectItem[]>(() => [
  { label: t("orders.filters.all"), value: "all" },
  { label: t("orders.status.pending"), value: "pending" },
  { label: t("orders.status.in_progress"), value: "in_progress" },
  { label: t("orders.status.completed"), value: "completed" },
  { label: t("orders.status.cancelled"), value: "cancelled" },
]);

// Separate orders by role
const clientOrders = computed(() => {
  if (!user.value?.uuid) return [];
  return orders.value.filter(
    (order) => order.client?.uuid === user.value?.uuid
  );
});

const freelancerOrders = computed(() => {
  if (!user.value?.uuid) return [];
  return orders.value.filter(
    (order) => order.freelancer?.uuid === user.value?.uuid
  );
});

// Current orders based on active tab
const currentOrders = computed(() => {
  return activeTab.value === "client"
    ? clientOrders.value
    : freelancerOrders.value;
});

// Stats
const stats = computed(() => {
  const current = currentOrders.value;
  return {
    total: current.length,
    completed: current.filter((o) => o.status === "completed").length,
    inProgress: current.filter((o) => o.status === "in_progress").length,
    cancelled: current.filter((o) => o.status === "cancelled").length,
  };
});

// Filtered orders
const filteredOrders = computed(() => {
  let filtered = currentOrders.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.title?.toLowerCase().includes(query) ||
        order.description?.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (selectedStatus.value && selectedStatus.value !== "all") {
    filtered = filtered.filter(
      (order) => order.status === selectedStatus.value
    );
  }

  return filtered;
});

// Load orders
const loadOrders = async () => {
  // Ensure user is loaded first
  if (!user.value?.uuid) {
    await fetchUser();
    if (!user.value?.uuid) {
      isLoading.value = false;
      return;
    }
  }

  isLoading.value = true;
  try {
    const { data, error } = await getOrders();

    if (error.value) {
      console.error("Error loading orders:", error.value);
      isLoading.value = false;
      return;
    }

    const responseData = data.value as any;
    let ordersData = [];

    if (responseData?.data) {
      ordersData = responseData.data;
    } else if (Array.isArray(responseData)) {
      ordersData = responseData;
    } else if (responseData?.orders) {
      ordersData = responseData.orders;
    }

    orders.value = (ordersData || []).map((order: any) => ({
      ...order,
      // Map price to budget if budget is not provided
      budget: order.budget ?? order.price,
      // Map duration to deadline if deadline is not provided
      deadline: order.deadline
        ? new Date(order.deadline)
        : order.duration
        ? new Date(Date.now() + order.duration * 24 * 60 * 60 * 1000)
        : new Date(),
      // Map active to in_progress for status
      status:
        order.status === "active"
          ? "in_progress"
          : (order.status as IOrder["status"]),
      // Ensure progress is a number
      progress: order.progress ?? 0,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
    }));
  } catch (err) {
    console.error("Error loading orders:", err);
  } finally {
    isLoading.value = false;
  }
};

// Handle tab change
const handleTabChange = (value: string | number) => {
  activeTab.value = value as "client" | "freelancer";
  // Reset filters when switching tabs
  searchQuery.value = "";
  selectedStatus.value = "all";
};

// Clear filters
const clearFilters = () => {
  searchQuery.value = "";
  selectedStatus.value = "all" as string;
};

// Navigate to order
const navigateToOrder = (uuid: string) => {
  navigateTo(localePath(`/orders/${uuid}`));
};

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

// Get status color
const getStatusColor = (
  status: IOrder["status"]
): "success" | "warning" | "error" | "neutral" => {
  switch (status) {
    case "completed":
      return "success";
    case "active":
      return "warning";
    case "cancelled":
      return "error";
    default:
      return "neutral";
  }
};

// Watch for user loading and load orders when user is available
watch(
  () => user.value?.uuid,
  (uuid) => {
    if (uuid && orders.value.length === 0) {
      loadOrders();
    }
  },
  { immediate: true }
);

// Load orders on mount
onMounted(async () => {
  // Ensure user is loaded
  if (!user.value?.uuid) {
    await fetchUser();
  }
  // Load orders if user is available
  if (user.value?.uuid) {
    await loadOrders();
  }
});
</script>
