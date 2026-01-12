<template>
  <div
    class="group w-full overflow-hidden relative rounded-2xl cursor-pointer border-2 border-gray-200 dark:border-gray-700 dark:bg-gradient-to-br from-black-300 to-black-800 bg-card-bg hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1 flex"
  >
    <!-- Avatar Section - Left Side -->
    <div class="relative flex-shrink-0 flex items-center justify-center p-6">
      <div class="relative group">
        <div
          class="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-75 group-hover:opacity-100 transition duration-300 blur-sm"
        ></div>
        <div class="relative">
          <NuxtImg
            :src="
              props.freelancer.avatarUrl ||
              'https://i.pravatar.cc/150?u=' + props.freelancer.uuid
            "
            width="120"
            height="120"
            class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-white dark:ring-gray-900 shadow-xl"
            :alt="fullName"
          />
          <!-- Online Status -->
          <div
            v-if="props.freelancer.isOnline"
            class="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg"
          >
            <div
              class="w-full h-full bg-green-500 rounded-full animate-pulse"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content - Right Side -->
    <div class="flex-1 flex flex-col p-6">
      <!-- Header with User Info -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex flex-col flex-1">
          <NuxtLink
            :to="localePath(`/profile/${props.freelancer.uuid}`)"
            class="group/link"
          >
            <h3
              class="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover/link:text-success transition-colors duration-200"
            >
              {{ fullName }}
            </h3>
          </NuxtLink>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{
              props.freelancer.specialization ||
              t("feed.freelancer.no_specialization")
            }}
          </p>
          <div
            v-if="
              props.freelancer.technologies &&
              props.freelancer.technologies.length > 0
            "
            class="flex flex-wrap gap-1 mt-1"
          >
            <UBadge
              v-for="tech in props.freelancer.technologies"
              :key="tech"
              color="success"
              :variant="isDark ? 'outline' : 'solid'"
              size="xs"
              class="text-[10px]"
            >
              #{{ tech }}
            </UBadge>
          </div>
        </div>

        <!-- Rating Badge -->
        <div class="flex items-center gap-1 flex-shrink-0 ml-4">
          <UIcon
            name="i-lucide-star"
            class="w-5 h-5 text-yellow-500 fill-yellow-500"
          />
          <span class="text-base font-bold text-gray-900 dark:text-white">
            {{ formatRating(props.freelancer.rating ?? 0) }}
          </span>
        </div>
      </div>

      <!-- Description -->
      <div v-if="props.freelancer.cv" class="mb-4">
        <div class="relative">
          <div
            ref="descriptionRef"
            class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 whitespace-pre-wrap"
            :class="{
              'line-clamp-2': !isDescriptionExpanded,
              'line-clamp-none': isDescriptionExpanded,
            }"
          >
            {{ props.freelancer.cv }}
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

      <!-- Stats -->
      <div
        class="flex items-center gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400"
      >
        <div class="flex items-center gap-1">
          <UIcon name="i-lucide-check-circle" class="w-3 h-3" />
          <span
            >{{ profileCompleteness }}%
            {{ t("feed.freelancer.profile_complete") }}</span
          >
        </div>
        <div
          v-if="props.freelancer.lastOnlineAt"
          class="flex items-center gap-1"
        >
          <UIcon name="i-lucide-clock" class="w-3 h-3" />
          <span>{{ formatLastSeen(props.freelancer.lastOnlineAt) }}</span>
        </div>
      </div>

      <!-- Action Button -->
      <div class="flex items-center justify-end mt-auto">
        <UButton
          :to="localePath(`/profile/${props.freelancer.uuid}`)"
          color="success"
          size="sm"
          trailing-icon="i-lucide-arrow-right"
          class="group-hover:scale-105 transition-transform duration-200"
        >
          {{ t("feed.freelancer.view_profile") }}
        </UButton>
      </div>

      <!-- Footer with additional info -->
      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div
          class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
        >
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-star" class="w-3 h-3" />
            <span>{{ formatRating(props.freelancer.rating ?? 0) }}</span>
          </div>
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-user" class="w-3 h-3" />
            <span>{{ t("feed.freelancer.freelancer") }}</span>
          </div>
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-clock" class="w-3 h-3" />
            <span>{{ formatTimeAgo(props.freelancer.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch, onMounted } from "vue";
import type { IUser } from "@/types/user.interface";

const { t } = useI18n();
const localePath = useLocalePath();
const { formatTimeAgo: formatTimeAgoPlural } = usePluralization();

const props = defineProps<{
  freelancer: IUser;
  skills?: string[];
}>();

// State for description expansion
const isDescriptionExpanded = ref(false);
const shouldShowExpandButton = ref(false);
const descriptionRef = ref<HTMLElement | null>(null);

// Full name
const fullName = computed(() => {
  if (props.freelancer.firstName && props.freelancer.lastName) {
    return `${props.freelancer.firstName} ${props.freelancer.lastName}`;
  }
  return (
    props.freelancer.firstName ||
    props.freelancer.username ||
    t("feed.freelancer.user")
  );
});

// Format rating
const formatRating = (rating: number | null | undefined) => {
  const numRating = typeof rating === "number" ? rating : Number(rating) || 0;
  return numRating.toFixed(1);
};

// Profile completeness
const profileCompleteness = computed(() => {
  return props.freelancer.profileCompleteness || 0;
});

// Format last seen
const formatLastSeen = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return t("feed.freelancer.just_now");
  if (minutes < 60) return `${minutes} ${t("feed.freelancer.minutes_ago")}`;
  if (hours < 24) return `${hours} ${t("feed.freelancer.hours_ago")}`;
  return `${days} ${t("feed.freelancer.days_ago")}`;
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
  () => props.freelancer.cv,
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

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});
</script>
