<template>
  <div class="h-full">
    <!-- Task Header -->
    <div
      class="bg-card-bg rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 h-full"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4"
      >
        <div class="flex-1 min-w-0">
          <h1
            class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 break-words"
          >
            {{ props.task?.title || "Загрузка..." }}
          </h1>

          <div
            class="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4"
          >
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-clock" class="w-3 h-3" />
              <span>{{
                props.task?.createdAt
                  ? formatTimeAgo(props.task.createdAt)
                  : "Загрузка..."
              }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-eye" class="w-3 h-3" />
              <span>{{ formatPlural(props.task?.views || 0, "views") }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-users" class="w-3 h-3" />
              <span>{{ formatPlural(3, "respondes") }}</span>
            </div>
          </div>
          <div class="flex items-baseline gap-2 mb-4">
            <span
              class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
            >
              {{ formatPrice(props.task?.price || 0) }}
            </span>
            <span class="text-base sm:text-lg text-gray-500 dark:text-gray-400">
              {{ props.task?.currency || "RUB" }}
            </span>
          </div>
          <div class="flex flex-wrap gap-2 mb-4">
            <UBadge
              icon="i-lucide-clock"
              size="sm"
              color="info"
              variant="soft"
              class="text-xs"
            >
              {{ formatDuration(props.task.duration) }}
            </UBadge>
            <UBadge
              v-if="props.task.category"
              size="sm"
              color="success"
              variant="soft"
              class="text-xs"
            >
              {{ props.task.category.title }}
            </UBadge>
          </div>
        </div>
        <UBadge
          :color="complexityBadgeColor"
          variant="soft"
          size="sm"
          class="font-medium self-start sm:self-auto"
        >
          {{ t(`feed.sidebar.complexity.${props.task.complexity}`) }}
        </UBadge>
      </div>
      <div v-if="props.task.files && props.task.files.length > 0" class="mb-4">
        <div class="flex flex-wrap gap-2">
          <a
            v-for="file in props.task.files"
            :key="file.uuid"
            :href="file.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 px-2 sm:px-3 py-2 bg-gray-200 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 cursor-pointer group max-w-full"
          >
            <UIcon
              :name="getFileIcon(file.type)"
              class="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-200 flex-shrink-0"
            />
            <span
              class="text-xs text-gray-700 dark:text-gray-300 truncate group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200 min-w-0"
            >
              {{ getFileName(file.url) }}
            </span>
            <UIcon
              name="i-lucide-external-link"
              class="w-3 h-3 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
            />
          </a>
        </div>
      </div>

      <!-- Tags -->

      <!-- Task Description -->
      <div class="mb-6 sm:mb-8 overflow-hidden">
        <h3
          class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3"
        >
          {{ $t("add_respond.basic_info.description") }}
        </h3>
        <div class="max-w-full overflow-hidden">
          <p
            class="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed break-words whitespace-pre-wrap"
          >
            {{ props.task?.description || "Описание загружается..." }}
          </p>
        </div>
      </div>

      <!-- Key Requirements -->

      <!-- Response Statistics -->
      <!-- <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Статистика откликов
        </h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ respondes.total }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Всего откликов
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ respondes.pending }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              На рассмотрении
            </div>
          </div>
          <div class="text-center">
            <div
              class="text-2xl font-bold text-yellow-600 dark:text-yellow-400"
            >
              {{ respondes.favorites }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              В избранном
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ITask } from "@/types/task.interface";
import { getFileIcon, getFileName } from "@/utils/fileParse";
const { t } = useI18n();
const { formatPlural, formatTimeAgo } = usePluralization();
const props = defineProps<{
  task: ITask;
}>();
// Format price with spaces
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price);
};
// Computed properties
const complexityBadgeColor = computed(() => {
  switch (props.task.complexity) {
    case "easy":
      return "success";
    case "medium":
      return "warning";
    case "hard":
      return "error";
    default:
      return "info";
  }
});
const formatDuration = (days: number) => {
  return formatPlural(days, "days");
};
</script>
