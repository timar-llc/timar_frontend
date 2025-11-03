<template>
  <div
    class="group relative bg-card-bg rounded-2xl border-1 border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1"
  >
    <!-- Status Badge -->
    <div
      class="absolute top-4 right-4 z-10"
      v-if="props.task.status === 'pending' || props.task.status === 'rejected'"
    >
      <UBadge
        :color="statusBadgeColor"
        :variant="!isDark ? 'solid' : 'soft'"
        size="sm"
        class="font-medium shadow-sm"
      >
        {{ statusLabel }}
      </UBadge>
    </div>

    <!-- Task Content -->
    <div class="p-6">
      <!-- Title and Description -->
      <div class="mb-4">
        <NuxtLink
          :to="localePath(`/tasks/${props.task.uuid}`)"
          class="block group/link"
        >
          <h3
            class="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover/link:text-success transition-colors duration-200 line-clamp-2"
          >
            {{ props.task.title }}
          </h3>
        </NuxtLink>
        <div class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <p
            :class="isDescriptionExpanded ? '' : 'line-clamp-3'"
            ref="descriptionRef"
          >
            {{ props.task.description }}
          </p>
          <button
            v-if="shouldShowExpandButton"
            @click.stop="toggleDescription"
            class="text-success transition-colors duration-200 font-medium mt-1"
          >
            {{
              isDescriptionExpanded
                ? t("common.show_less")
                : t("common.show_more")
            }}
          </button>
        </div>
      </div>

      <!-- Category and Complexity -->
      <div class="mb-4">
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-if="props.task.category"
            color="success"
            :variant="!isDark ? 'solid' : 'soft'"
            size="sm"
            class="text-xs font-medium"
          >
            {{ props.task.category.title }}
          </UBadge>
          <UBadge
            :color="complexityBadgeColor"
            :variant="!isDark ? 'solid' : 'soft'"
            size="sm"
            class="text-xs font-medium"
          >
            {{ complexityLabel }}
          </UBadge>
          <UBadge
            icon="i-lucide-clock"
            size="sm"
            color="info"
            variant="soft"
            class="text-xs"
          >
            {{ formatDuration(props.task.duration || 0) }}
          </UBadge>
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
      <!-- Price and Duration -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex flex-col">
          <span class="text-2xl font-bold dark:text-success">
            {{ formatPrice(props.task.price || 0) }} {{ props.task.currency }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <UButton
          :to="localePath(`/tasks/${props.task.uuid}`)"
          color="success"
          :variant="isDark ? 'outline' : 'solid'"
          size="sm"
          trailing-icon="i-lucide-arrow-right"
          class="flex-1 justify-center font-medium"
        >
          {{ t("task.view_details") }}
        </UButton>
        <UButton
          color="error"
          variant="outline"
          size="sm"
          icon="i-lucide-trash-2"
          class="px-3"
          :loading="isDeleting"
          @click="confirmDelete"
        >
          <span class="sr-only">{{ t("task.delete") }}</span>
        </UButton>
      </div>

      <!-- Created Date -->
      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div
          class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
        >
          <span
            >{{ t("task.created") }}:
            {{ formatDate(props.task.createdAt) }}</span
          >
          <span v-if="props.task.endedAt">
            {{ t("task.ends") }}: {{ formatDate(props.task.endedAt) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, onMounted } from "vue";
import type { ITask, ITaskFile } from "@/types/task.interface";
import { useTaskApi } from "@/composables/api/useTaskApi";
import { getFileIcon, getFileName } from "@/utils/fileParse";
const { t } = useI18n();
const props = defineProps<{
  task: ITask;
}>();

const emit = defineEmits<{
  delete: [taskId: string];
}>();

const { deleteTask } = useTaskApi();
const { add } = useToast();
const localePath = useLocalePath();
const { formatPlural } = usePluralization();
// Delete state
const isDeleting = ref(false);

// Description expand state
const isDescriptionExpanded = ref(false);
const descriptionRef = ref<HTMLElement>();
const shouldShowExpandButton = ref(false);

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});

// Format price with spaces
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price);
};

// Format duration

const formatDuration = (days: number) => {
  return formatPlural(days, "days");
};

// Format date
const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Status badge color
const statusBadgeColor = computed(() => {
  switch (props.task.status) {
    case "pending":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "error";
    default:
      return "neutral";
  }
});

// Status label
const statusLabel = computed(() => {
  switch (props.task.status) {
    case "pending":
      return t("common.task_statuses.pending");
    case "approved":
      return t("common.task_statuses.approved");
    case "rejected":
      return t("common.task_statuses.rejected");
    default:
      return t("common.task_statuses.pending");
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
      return "neutral";
  }
});

// Complexity label
const complexityLabel = computed(() => {
  switch (props.task.complexity) {
    case "easy":
      return t("common.complexity.easy");
    case "medium":
      return t("common.complexity.medium");
    case "hard":
      return t("common.complexity.hard");
    default:
      return t("common.complexity.medium");
  }
});

// Complexity border class

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

// Toggle description expansion
const toggleDescription = () => {
  isDescriptionExpanded.value = !isDescriptionExpanded.value;
};

// Check if description needs expand button
const checkDescriptionHeight = async () => {
  await nextTick();
  if (descriptionRef.value) {
    const lineHeight = 20; // Approximate line height for text-sm
    const maxHeight = lineHeight * 3; // 3 lines
    shouldShowExpandButton.value =
      descriptionRef.value.scrollHeight > maxHeight;
  }
};

// Handle delete
const confirmDelete = async () => {
  isDeleting.value = true;

  try {
    // Emit delete event to parent to remove from list
    await deleteTask(props.task.uuid);
    emit("delete", props.task.uuid);

    // Show success message
    add({
      title: t("task.delete_success_title"),
      description: t("task.delete_success_message"),
      color: "success",
    });
  } catch (error) {
    console.error("Error deleting task:", error);

    // Show error message
    add({
      title: t("task.delete_error_title"),
      description: t("task.delete_error_message"),
      color: "error",
    });
  } finally {
    isDeleting.value = false;
  }
};

// Check description height on mount
onMounted(() => {
  checkDescriptionHeight();
});
</script>
