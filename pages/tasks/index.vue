<template>
  <div class="min-h-screen bg-gradient-content rounded-xl">
    <!-- Header -->
    <div class="relative bg-gradient-nav">
      <!-- Background Pattern -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ t("tasks.title") }}
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              {{ t("tasks.subtitle") }}
            </p>
          </div>
          <div class="flex gap-3">
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              icon="i-lucide-refresh-cw"
              :loading="isLoading"
              @click="loadTasks"
            >
              {{ t("common.refresh") }}
            </UButton>
            <NuxtLink :to="localePath('/create-task/main')">
              <UButton
                color="success"
                variant="solid"
                size="lg"
                trailing-icon="i-lucide-plus"
                class="font-semibold"
              >
                {{ t("tasks.create_task") }}
              </UButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div
          class="rounded-xl p-6 shadow-sm border border-blue-100 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/90 to-white dark:from-blue-500/10 dark:to-transparent"
        >
          <div class="flex items-center">
            <div
              class="p-3 bg-blue-100/80 dark:bg-blue-500/15 rounded-lg flex justify-center"
            >
              <UIcon
                name="i-lucide-file-text"
                class="w-6 h-6 text-blue-700 dark:text-blue-400"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ t("tasks.statistics.total") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.totalTasks }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="rounded-xl p-6 shadow-sm border border-green-100 dark:border-green-500/20 bg-gradient-to-br from-green-50/90 to-white dark:from-green-500/10 dark:to-transparent"
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
                {{ t("tasks.statistics.approved") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.approvedTasks }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="rounded-xl p-6 shadow-sm border border-amber-100 dark:border-amber-500/20 bg-gradient-to-br from-amber-50/90 to-white dark:from-amber-500/10 dark:to-transparent"
        >
          <div class="flex items-center">
            <div
              class="p-3 bg-amber-100/80 dark:bg-amber-500/15 rounded-lg flex justify-center"
            >
              <UIcon
                name="i-lucide-clock"
                class="w-5 h-5 text-amber-700 dark:text-amber-400"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ t("tasks.statistics.pending") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.pendingTasks }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="rounded-xl p-6 shadow-sm border border-purple-100 dark:border-purple-500/20 bg-gradient-to-br from-purple-50/90 to-white dark:from-purple-500/10 dark:to-transparent"
        >
          <div class="flex items-center">
            <div
              class="p-3 bg-purple-100/80 dark:bg-purple-500/15 rounded-lg flex justify-center"
            >
              <UIcon
                name="i-lucide-users"
                class="w-6 h-6 text-purple-700 dark:text-purple-400"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{
                  getPlural(stats.totalrespondes, "respondes")
                    .charAt(0)
                    .toUpperCase() +
                  getPlural(stats.totalrespondes, "respondes").slice(1)
                }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.totalrespondes }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div
        class="bg-card-bg rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8"
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
            :placeholder="t('common.task_statuses.title')"
            size="lg"
            :ui="{
              content: 'bg-card-bg hover:bg-card-bg',
              item: 'bg-card-bg hover:bg-card-bg',
            }"
            color="neutral"
            class="w-full sm:w-48 bg-card-bg"
          />
          <USelect
            v-model="selectedComplexity"
            :items="complexityOptions"
            :placeholder="t('common.complexity.title')"
            size="lg"
            :ui="{
              content: 'bg-card-bg hover:bg-card-bg',
              item: 'bg-card-bg hover:bg-card-bg',
            }"
            color="neutral"
            class="w-full sm:w-48 bg-card-bg"
          />
          <UButton
            v-if="searchQuery || selectedStatus || selectedComplexity"
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

      <!-- Tasks Grid -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-success"
        ></div>
      </div>

      <div v-else-if="filteredTasks.length === 0" class="text-center py-12">
        <UIcon
          name="i-lucide-file-text"
          class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
        />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ t("tasks.no_tasks_found") }}
        </h3>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TaskCard
          v-for="task in filteredTasks"
          :key="task.uuid"
          :task="task"
          @delete="handleDeleteTask"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import type { ITask } from "@/types/task.interface";
import { useTaskApi } from "@/composables/api/useTaskApi";
import { useUser } from "@/composables/useUser";
import type { SelectItem } from "@nuxt/ui";
import { usePluralization } from "@/composables/usePluralization";

definePageMeta({
  middleware: "auth",
});

const { t } = useI18n();
const { getPlural } = usePluralization();
const localePath = useLocalePath();
const { user } = useUser();
const { getTasks, deleteTask } = useTaskApi();
const { add } = useToast();

// State
const tasks = ref<ITask[]>([]);
const isLoading = ref(false);
const searchQuery = ref("");
const selectedStatus = ref<string>("all");
const selectedComplexity = ref<string>("all");

// Filter options
const statusOptions = ref<SelectItem[]>([
  { label: t("common.task_statuses.title"), value: "all" },
  { label: t("common.task_statuses.pending"), value: "pending" },
  { label: t("common.task_statuses.approved"), value: "approved" },
  { label: t("common.task_statuses.rejected"), value: "rejected" },
]);

const complexityOptions = ref<SelectItem[]>([
  { label: t("common.complexity.title"), value: "all" },
  { label: t("common.complexity.easy"), value: "easy" },
  { label: t("common.complexity.medium"), value: "medium" },
  { label: t("common.complexity.hard"), value: "hard" },
]);

// Stats
const stats = computed(() => {
  const totalTasks = tasks.value.length;
  const approvedTasks = tasks.value.filter(
    (task) => task.status === "approved"
  ).length;
  const pendingTasks = tasks.value.filter(
    (task) => task.status === "pending"
  ).length;
  const totalrespondes = tasks.value.reduce(
    (sum, task) => sum + (task.respondes?.length || 0),
    0
  );

  return {
    totalTasks,
    approvedTasks,
    pendingTasks,
    totalrespondes,
  };
});

// Filtered tasks
const filteredTasks = computed(() => {
  let filtered = tasks.value;

  console.log("Filtering tasks:", {
    totalTasks: tasks.value.length,
    searchQuery: searchQuery.value,
    selectedStatus: selectedStatus.value,
    selectedComplexity: selectedComplexity.value,
    tasks: tasks.value.map((t) => ({
      title: t.title,
      status: t.status,
      complexity: t.complexity,
    })),
  });

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (task) =>
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (selectedStatus.value && selectedStatus.value !== "all") {
    filtered = filtered.filter((task) => task.status === selectedStatus.value);
  }

  // Complexity filter
  if (selectedComplexity.value && selectedComplexity.value !== "all") {
    filtered = filtered.filter(
      (task) => task.complexity === selectedComplexity.value
    );
  }

  console.log("Filtered result:", filtered.length);
  return filtered;
});

// Load tasks
const loadTasks = async () => {
  if (!user.value?.uuid) {
    console.log("No user UUID found");
    return;
  }

  isLoading.value = true;

  try {
    console.log("Loading tasks for user:", user.value.uuid);

    // First try with my: true parameter
    let { data, error } = await getTasks({
      my: true,
    });

    console.log("API response with my: true:", {
      data: data.value,
      error: error.value,
    });

    // If no data or error, try without my parameter
    if (error.value || !data.value || (data.value as any)?.data?.length === 0) {
      console.log("Trying without my parameter...");
      const result = await getTasks({});
      data = result.data;
      error = result.error;
      console.log("API response without my:", {
        data: data.value,
        error: error.value,
      });
    }

    if (error.value) {
      console.error("Error loading tasks:", error.value);
      add({
        title: t("tasks.load_error_title"),
        description: t("tasks.load_error_message"),
        color: "error",
      });
      return;
    }

    const responseData = data.value as any;
    console.log("Response data structure:", responseData);

    // Try different possible data structures
    let tasksData = [];
    if (responseData?.data) {
      tasksData = responseData.data;
    } else if (Array.isArray(responseData)) {
      tasksData = responseData;
    } else if (responseData?.tasks) {
      tasksData = responseData.tasks;
    }

    console.log("Extracted tasks:", tasksData);

    // If we got tasks without my parameter, filter by current user
    if (tasksData.length > 0 && !tasksData[0].user) {
      console.log("Filtering tasks by current user");
      tasksData = tasksData.filter(
        (task: ITask) => task.user?.uuid === user.value?.uuid
      );
    }

    tasks.value = tasksData || [];
  } catch (err) {
    console.error("Error loading tasks:", err);
    add({
      title: t("tasks.load_error_title"),
      description: t("tasks.load_error_message"),
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

// Handle task deletion
const handleDeleteTask = async (taskId: string) => {
  tasks.value = tasks.value.filter((task) => task.uuid !== taskId);
};

// Clear all filters
const clearFilters = () => {
  searchQuery.value = "";
  selectedStatus.value = "";
  selectedComplexity.value = "";
};

// Load tasks on mount
onMounted(() => {
  loadTasks();
});
</script>
