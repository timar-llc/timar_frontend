<template>
  <div
    class="group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 w-full rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1"
  >
    <!-- Status Badge -->
    <div
      class="absolute top-4 right-4 z-10"
      v-if="
        props.project.status === 'pending' ||
        props.project.status === 'rejected'
      "
    >
      <UBadge
        :color="statusBadgeColor"
        variant="solid"
        size="sm"
        class="font-medium shadow-sm"
      >
        {{ statusLabel }}
      </UBadge>
    </div>

    <!-- Project Image -->
    <div
      class="relative h-48 sm:h-56 overflow-hidden cursor-pointer"
      @click="$router.push(localePath(`/project/${props.project.uuid}`))"
    >
      <UCarousel
        v-if="props.project.media && props.project.media.length > 0"
        v-slot="{ item }"
        :items="props.project.media.map((media) => media.url)"
        class="w-full h-full"
        :autoplay="true"
      >
        <NuxtLink
        >
          <img
            :src="item"
            :alt="props.project.title || 'Project image'"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </NuxtLink>
      </UCarousel>
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center"
      >
        <UIcon
          name="i-lucide-image"
          class="w-12 h-12 text-gray-400 dark:text-gray-500"
        />
      </div>

      <!-- Overlay gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
      ></div>
    </div>

    <!-- Project Content -->
    <div class="p-6">
      <!-- Title and Description -->
      <div class="mb-4">
        <NuxtLink
          :to="localePath(`/project/${props.project.uuid}`)"
          class="block group/link"
        >
          <h3
            class="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover/link:text-black/40 dark:group-hover/link:text-success transition-colors duration-200 line-clamp-1"
          >
            {{ props.project.title }}
          </h3>
          <p
            class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed"
          >
            {{ props.project.description }}
          </p>
        </NuxtLink>
      </div>

      <!-- Technologies -->
      <div class="mb-4">
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="tech in techArray"
            :key="tech"
            color="success"
            :variant="!isDark ? 'solid' : 'soft'"
            size="sm"
            class="text-xs font-medium"
          >
            {{ tech }}
          </UBadge>
          <UBadge
            v-if="techArray.length > 4"
            color="neutral"
            :variant="!isDark ? 'solid' : 'soft'"
            size="sm"
            class="text-xs font-medium"
          >
            +{{ props.project.technologies.length - 4 }}
          </UBadge>
        </div>
      </div>

      <!-- Price and Duration -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex flex-col">
          <span class="text-2xl font-bold dark:text-success">
            {{ formatPrice(props.project.price || 0) }} ₽
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatDuration(props.project.duration || 0) }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <UButton
          :to="localePath(`/project/${props.project.uuid}`)"
          color="success"
          variant="solid"
          size="sm"
          trailing-icon="i-lucide-arrow-right"
          class="flex-1 justify-center font-medium"
        >
          {{ t("profile.project_card.more") }}
        </UButton>
        <UButton
          v-if="isOwnProfile"
          color="error"
          variant="outline"
          size="sm"
          icon="i-lucide-trash-2"
          class="px-3"
          @click="confirmDelete"
        >
          <span class="sr-only">{{ t("profile.project_card.delete") }}</span>
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { IProject } from "@/types/project.interface";
import { useProjectApi } from "@/composables/api/useProjectApi";
const { t } = useI18n();
const props = defineProps<{
  project: IProject;
}>();

const { user } = useUser();
const route = useRoute();
const isOwnProfile = computed(() => {
  return user.value?.uuid === route.params.uuid;
});

const emit = defineEmits<{
  delete: [projectId: string];
}>();

const { add } = useToast();
const localePath = useLocalePath();
const { formatPlural, formatTimeAgo } = usePluralization();

// Delete state
const isDeleting = ref(false);

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});
const { deleteProject } = useProjectApi();
// Format price with spaces
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price);
};

// Format duration
const formatDuration = (days: number) => {
  return formatPlural(days, "days");
};
const techArray = computed(() => {
  if (props.project.technologies && props.project.technologies.length > 0) {
    return props.project.technologies;
  }
  return [];
});

// Status badge color
const statusBadgeColor = computed(() => {
  switch (props.project.status) {
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
  switch (props.project.status) {
    case "pending":
      return t("common.project_statuses.pending");
    case "approved":
      return t("common.project_statuses.approved");
    case "rejected":
      return t("common.project_statuses.rejected");
    default:
      return t("common.project_statuses.pending");
  }
});

// Handle delete confirmation
const confirmDelete = async () => {
  isDeleting.value = true;

  try {
    await deleteProject(props.project.uuid);

    // Emit delete event to parent to remove from list
    emit("delete", props.project.uuid);

    // Close modal

    // Show success message
    add({
      title: t("profile.project_card.delete_success_title"),
      description: t("profile.project_card.delete_success_message"),
      color: "success",
    });
  } catch (error) {
    console.error("Error deleting project:", error);

    // Show error message
    add({
      title: t("profile.project_card.delete_error_title"),
      description: t("profile.project_card.delete_error_message"),
      color: "error",
    });
  } finally {
    isDeleting.value = false;
  }
};
</script>
