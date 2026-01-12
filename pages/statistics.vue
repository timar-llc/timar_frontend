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
              {{ t("statistics.title") }}
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              {{ t("statistics.description") }}
            </p>
          </div>
          <div class="flex gap-3">
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              icon="i-lucide-refresh-cw"
              :loading="isLoading"
              class="hover:bg-card-bg"
              @click="loadStatistics"
              :ui="{
                base: 'bg-card-bg',
              }"
            >
              {{ t("common.refresh") }}
            </UButton>
            <USelect
              v-model="selectedPeriod"
              :items="periodOptions"
              size="lg"
              class="w-48"
              :ui="{
                base: 'bg-card-bg',
                content: 'bg-card-bg',
                item: 'bg-card-bg',
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
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
                {{ t("statistics.stats.total_orders") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.totalOrders }}
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
                {{ t("statistics.stats.completed_orders") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.completedOrders }}
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
                {{ t("statistics.stats.in_progress") }}
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
                {{ t("statistics.stats.failed_orders") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.failedOrders }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Orders Over Time Chart -->
        <div
          class="bg-card-bg rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ t("statistics.charts.orders_over_time") }}
          </h3>
          <div class="h-64">
            <LineChart
              v-if="chartData.ordersOverTime"
              :data="chartData.ordersOverTime"
              :options="lineChartOptions"
            />
            <div
              v-else
              class="flex items-center justify-center h-full text-gray-400"
            >
              {{ t("statistics.loading") }}
            </div>
          </div>
        </div>

        <!-- Orders Status Pie Chart -->
        <div
          class="bg-card-bg rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ t("statistics.charts.orders_by_status") }}
          </h3>
          <div class="h-64">
            <DoughnutChart
              v-if="chartData.ordersByStatus"
              :data="chartData.ordersByStatus"
              :options="doughnutChartOptions"
            />
            <div
              v-else
              class="flex items-center justify-center h-full text-gray-400"
            >
              {{ t("statistics.loading") }}
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Revenue Chart -->
      <div
        class="bg-card-bg rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ t("statistics.charts.monthly_revenue") }}
        </h3>
        <div class="h-80">
          <BarChart
            v-if="chartData.monthlyRevenue"
            :data="chartData.monthlyRevenue"
            :options="barChartOptions"
          />
          <div
            v-else
            class="flex items-center justify-center h-full text-gray-400"
          >
            {{ t("statistics.loading") }}
          </div>
        </div>
      </div>

      <!-- Additional Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="rounded-2xl p-6 shadow-sm border border-amber-100 dark:border-amber-500/20 bg-gradient-to-br from-amber-50/90 to-white dark:from-amber-500/10 dark:to-transparent"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ t("statistics.stats.average_rating") }}
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {{ stats.averageRating.toFixed(1) }}
              </p>
            </div>
            <div
              class="p-3 bg-amber-100/80 dark:bg-amber-500/15 rounded-lg flex justify-center"
            >
              <UIcon
                name="i-lucide-star"
                class="w-8 h-8 text-amber-700 dark:text-amber-400"
              />
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl p-6 shadow-sm border border-green-100 dark:border-green-500/20 bg-gradient-to-br from-green-50/90 to-white dark:from-green-500/10 dark:to-transparent"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ t("statistics.stats.total_revenue") }}
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {{ formatCurrency(stats.totalRevenue) }}
              </p>
            </div>
            <div
              class="p-3 bg-green-100/80 dark:bg-green-500/15 rounded-lg flex justify-center"
            >
              <UIcon
                name="i-lucide-wallet"
                class="w-8 h-8 text-green-700 dark:text-green-400"
              />
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl p-6 shadow-sm border border-blue-100 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/90 to-white dark:from-blue-500/10 dark:to-transparent"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ t("statistics.stats.completion_rate") }}
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {{ stats.completionRate }}%
              </p>
            </div>
            <div
              class="p-3 bg-blue-100/80 dark:bg-blue-500/15 rounded-lg flex justify-center"
            >
              <UIcon
                name="i-lucide-trending-up"
                class="w-8 h-8 text-blue-700 dark:text-blue-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line as LineChart } from "vue-chartjs";
import { Doughnut as DoughnutChart } from "vue-chartjs";
import { Bar as BarChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

definePageMeta({
  middleware: "auth",
});

const { t } = useI18n();
const isLoading = ref(false);
const selectedPeriod = ref("month");

const periodOptions = computed(() => [
  { label: t("statistics.periods.week"), value: "week" },
  { label: t("statistics.periods.month"), value: "month" },
  { label: t("statistics.periods.quarter"), value: "quarter" },
  { label: t("statistics.periods.year"), value: "year" },
]);

// Mock data - replace with actual API calls
const stats = ref({
  totalOrders: 42,
  completedOrders: 28,
  inProgress: 8,
  failedOrders: 6,
  averageRating: 4.7,
  totalRevenue: 125000,
  completionRate: 67,
});

const chartData = ref({
  ordersOverTime: null as any,
  ordersByStatus: null as any,
  monthlyRevenue: null as any,
});

const loadStatistics = async () => {
  isLoading.value = true;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate mock data based on period
    const labels = generateLabels(selectedPeriod.value);

    // Orders over time (Line chart)
    chartData.value.ordersOverTime = {
      labels,
      datasets: [
        {
          label: t("statistics.charts.completed"),
          data: generateRandomData(labels.length, 5, 15),
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          tension: 0.4,
        },
        {
          label: t("statistics.charts.failed"),
          data: generateRandomData(labels.length, 0, 5),
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          tension: 0.4,
        },
      ],
    };

    // Orders by status (Doughnut chart)
    chartData.value.ordersByStatus = {
      labels: [
        t("statistics.status.completed"),
        t("statistics.status.in_progress"),
        t("statistics.status.failed"),
      ],
      datasets: [
        {
          data: [
            stats.value.completedOrders,
            stats.value.inProgress,
            stats.value.failedOrders,
          ],
          backgroundColor: [
            "rgba(34, 197, 94, 0.8)",
            "rgba(234, 179, 8, 0.8)",
            "rgba(239, 68, 68, 0.8)",
          ],
          borderColor: [
            "rgb(34, 197, 94)",
            "rgb(234, 179, 8)",
            "rgb(239, 68, 68)",
          ],
          borderWidth: 2,
        },
      ],
    };

    // Monthly revenue (Bar chart)
    chartData.value.monthlyRevenue = {
      labels: labels,
      datasets: [
        {
          label: t("statistics.charts.revenue"),
          data: generateRandomData(labels.length, 10000, 25000),
          backgroundColor: "rgba(34, 197, 94, 0.8)",
          borderColor: "rgb(34, 197, 94)",
          borderWidth: 1,
        },
      ],
    };
  } catch (error) {
    console.error("Error loading statistics:", error);
  } finally {
    isLoading.value = false;
  }
};

const generateLabels = (period: string): string[] => {
  const now = new Date();
  const labels: string[] = [];

  if (period === "week") {
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      labels.push(
        date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })
      );
    }
  } else if (period === "month") {
    for (let i = 3; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      labels.push(
        date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" })
      );
    }
  } else if (period === "quarter") {
    for (let i = 3; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i * 3);
      labels.push(
        `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`
      );
    }
  } else {
    // year
    for (let i = 3; i >= 0; i--) {
      const date = new Date(now);
      date.setFullYear(date.getFullYear() - i);
      labels.push(date.getFullYear().toString());
    }
  }

  return labels;
};

const generateRandomData = (
  length: number,
  min: number,
  max: number
): number[] => {
  return Array.from(
    { length },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Chart options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value: any) {
          return formatCurrency(value);
        },
      },
    },
  },
};

watch(selectedPeriod, () => {
  loadStatistics();
});

onMounted(() => {
  loadStatistics();
});
</script>
