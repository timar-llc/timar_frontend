<template>
  <div
    class="group w-full overflow-hidden relative rounded-2xl cursor-pointer border-2 border-gray-200 dark:border-gray-700 dark:bg-gradient-to-br from-black-300 to-black-800 bg-card-bg hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1"
    :class="[borderColor]"
  >
    <!-- Main Content -->
    <div class="p-6">
      <!-- Header with User Info -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="relative">
            <NuxtImg
              :src="
                props.task.user?.avatarUrl ||
                'https://i.pravatar.cc/150?u=a042581f4e29026024d'
              "
              width="48"
              height="48"
              class="rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
            />
            <div
              v-if="props.task.user?.isOnline"
              class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 bg-success"
            ></div>
          </div>
          <div class="flex flex-col">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">
              {{ props.task.user?.firstName || "Пользователь" }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ props.task.user?.specialization }}
            </p>
          </div>
        </div>

        <!-- Complexity Badge -->
        <UBadge
          :color="complexityBadgeColor"
          variant="soft"
          size="sm"
          class="font-medium"
        >
          {{ complexityLabel }}
        </UBadge>
      </div>

      <!-- Task Title and Description -->
      <div class="mb-4">
        <h2
          class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1"
        >
          {{ props.task.title }}
        </h2>
        <div class="relative">
          <div
            ref="descriptionRef"
            class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 whitespace-pre-wrap"
            :class="{
              'line-clamp-2': !isDescriptionExpanded,
              'line-clamp-none': isDescriptionExpanded,
            }"
          >
            {{ props.task.description }}
          </div>
          <button
            v-if="shouldShowExpandButton"
            @click="toggleDescription"
            class="text-xs dark:text-success font-medium mt-1 transition-colors duration-200 justify-end"
          >
            {{ isDescriptionExpanded ? "Свернуть" : "Показать полностью" }}
          </button>
        </div>
      </div>

      <!-- Media Files -->
      <div v-if="props.task.files && props.task.files.length > 0" class="mb-4">
        <div class="flex flex-wrap gap-2">
          <a
            v-for="file in props.task.files"
            :key="file.uuid"
            :href="file.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 cursor-pointer group"
          >
            <UIcon
              :name="getFileIcon(file.type)"
              class="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-200"
            />
            <span
              class="text-xs text-gray-700 dark:text-gray-300 truncate group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200"
            >
              {{ getFileName(file.url) }}
            </span>
            <UIcon
              name="i-lucide-external-link"
              class="w-3 h-3 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />
          </a>
        </div>
      </div>

      <!-- Tags -->
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

      <!-- Price and Action -->
      <div class="flex items-center justify-between">
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatPrice(props.task.price) }}
            {{ props.task.currency || "RUB" }}
          </span>
        </div>

        <UButton
          color="primary"
          size="sm"
          v-if="props.task.user?.uuid !== user?.uuid"
          class="group-hover:scale-105 transition-transform duration-200"
          @click="navigateTo(localePath(`/create-respond/${props.task.uuid}`))"
        >
          Откликнуться
          <UIcon name="i-lucide-arrow-right" class="ml-1" />
        </UButton>
      </div>
    </div>

    <!-- Footer with additional info -->
    <div
      class="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600"
    >
      <div
        class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
      >
        <div class="flex items-center gap-1">
          <UIcon name="i-lucide-eye" class="w-3 h-3" />
          <span>{{ formatPlural(props.task.views, "views") }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="i-lucide-users" class="w-3 h-3" />
          <span>{{ formatPlural(3, "respondes") }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="i-lucide-clock" class="w-3 h-3" />
          <span>{{ formatTimeAgo(props.task.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch, onMounted } from "vue";
import type { ITask } from "@/types/task.interface";
import { getFileIcon, getFileName } from "@/utils/fileParse";
const { t } = useI18n();
const { user } = useUser();
const localePath = useLocalePath();
const { formatPlural, formatTimeAgo: formatTimeAgoPlural } = usePluralization();
const props = defineProps<{
  task: ITask;
}>();

// State for description expansion
const isDescriptionExpanded = ref(false);
const shouldShowExpandButton = ref(false);
const descriptionRef = ref<HTMLElement | null>(null);

// Border color based on complexity
const borderColor = computed(() => {
  switch (props.task.complexity) {
    case "easy":
      return "border-green-200 dark:border-green-800";
    case "medium":
      return "border-yellow-200 dark:border-yellow-800";
    case "hard":
      return "border-red-200 dark:border-red-800";
    default:
      return "border-blue-200 dark:border-blue-800";
  }
});

// Complexity badge color
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

// Complexity label
const complexityLabel = computed(() => {
  switch (props.task.complexity) {
    case "easy":
      return t("feed.sidebar.complexity.easy");
    case "medium":
      return t("feed.sidebar.complexity.medium");
    case "hard":
      return t("feed.sidebar.complexity.hard");
    default:
      return t("feed.sidebar.complexity.easy");
  }
});

// Format price with spaces
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price);
};

// Format duration using pluralization
const formatDuration = (days: number) => {
  return formatPlural(days, "days");
};

// Use the pluralized time ago function
const formatTimeAgo = formatTimeAgoPlural;

// Check if description needs expand button
const checkDescriptionHeight = () => {
  nextTick(() => {
    if (descriptionRef.value) {
      const element = descriptionRef.value;
      const lineHeight = parseInt(getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * 2; // 2 lines
      shouldShowExpandButton.value = element.scrollHeight > maxHeight;
    }
  });
};

// Toggle description expansion
const toggleDescription = () => {
  isDescriptionExpanded.value = !isDescriptionExpanded.value;
};

// Watch for description changes
watch(
  () => props.task.description,
  () => {
    isDescriptionExpanded.value = false;
    checkDescriptionHeight();
  },
  { immediate: true }
);

// Check height on mount
onMounted(() => {
  checkDescriptionHeight();
});
</script>
