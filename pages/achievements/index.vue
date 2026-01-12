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
              {{ t("achievements.title") }}
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              {{ t("achievements.description") }}
            </p>
          </div>
          <div class="flex gap-3">
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              icon="i-lucide-refresh-cw"
              :loading="isRefreshing"
              @click="refreshAchievements"
              :ui="{
                base: 'bg-card-bg',
              }"
            >
              {{ t("common.refresh") }}
            </UButton>
            <NuxtLink
              :to="localePath(`/profile/${user.user.value?.uuid}/edit`)"
            >
              <UButton
                color="success"
                variant="solid"
                size="lg"
                trailing-icon="i-lucide-arrow-up-right"
                class="font-semibold"
              >
                {{ t("profile.edit_profile") }}
              </UButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div
          class="rounded-2xl p-6 shadow-sm border border-green-100 dark:border-green-500/20 bg-gradient-to-br from-green-50/90 to-white dark:from-green-500/10 dark:to-transparent"
        >
          <div class="flex items-center">
            <div
              class="p-3 bg-green-100/80 dark:bg-green-500/15 rounded-2xl flex justify-center"
            >
              <UIcon
                name="i-lucide-trophy"
                class="w-6 h-6 text-green-700 dark:text-green-400"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ t("achievements.total_achievements") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.total }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl p-6 shadow-sm border border-blue-100 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/90 to-white dark:from-blue-500/10 dark:to-transparent"
        >
          <div class="flex items-center">
            <div
              class="p-3 bg-blue-100/80 dark:bg-blue-500/15 rounded-2xl flex justify-center"
            >
              <UIcon
                name="i-lucide-star"
                class="w-6 h-6 text-blue-700 dark:text-blue-400"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ t("achievements.experience_points") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.xp }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl p-6 shadow-sm border border-purple-100 dark:border-purple-500/20 bg-gradient-to-br from-purple-50/90 to-white dark:from-purple-500/10 dark:to-transparent"
        >
          <div class="flex items-center">
            <div
              class="p-3 bg-purple-100/80 dark:bg-purple-500/15 rounded-2xl flex justify-center"
            >
              <UIcon
                name="i-lucide-crown"
                class="w-6 h-6 text-purple-700 dark:text-purple-400"
              />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ t("achievements.current_level") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats.level }}
              </p>
            </div>
          </div>
        </div>

        <!-- <div
          class="rounded-2xl p-6 shadow-sm border border-green-100 dark:border-green-500/20 bg-gradient-to-br from-green-50/90 to-white dark:from-green-500/10 dark:to-transparent flex flex-col justify-between"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ t("achievements.progress_to_next_level") }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {{ stats.progressLabel }}
              </p>
            </div>
            <span class="text-sm font-semibold text-success">
              {{ stats.progressPercent }}%
            </span>
          </div>
          <UProgress
            :value="stats.progressPercent"
            :max="100"
            color="success"
            class="mt-4"
          />
        </div> -->
      </div>

      <!-- Filters -->
      <div
        class="bg-card-bg rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8"
      >
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1">
            <UInput
              v-model="searchQuery"
              :placeholder="t('achievements.filters.search')"
              icon="i-lucide-search"
              color="neutral"
              size="lg"
            />
          </div>
          <USelect
            v-model="selectedRarity"
            :items="rarityOptions"
            :placeholder="t('achievements.filters.rarity')"
            size="lg"
            color="neutral"
            class="w-full lg:w-56"
            :ui="{
              base: 'bg-card-bg',
              content: 'bg-card-bg',
              item: 'bg-card-bg',
            }"
          />
          <USelect
            v-model="sortOption"
            :items="sortOptions"
            :placeholder="t('achievements.filters.sort')"
            size="lg"
            color="neutral"
            class="w-full lg:w-56"
            :ui="{
              base: 'bg-card-bg',
              content: 'bg-card-bg',
              item: 'bg-card-bg',
            }"
          />
          <UButton
            v-if="hasActiveFilters"
            color="neutral"
            variant="ghost"
            size="lg"
            icon="i-lucide-x"
            @click="clearFilters"
          >
            {{ t("common.clear_filters") }}
          </UButton>
        </div>
      </div>

      <!-- Achievements -->
      <div v-if="isRefreshing" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-success"
        ></div>
      </div>

      <div
        v-else-if="filteredAchievements.length === 0"
        class="text-center py-16"
      >
        <UIcon
          name="i-lucide-award"
          class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
        />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("achievements.empty.title") }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {{ t("achievements.empty.description") }}
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AchievementCard
          v-for="achievement in filteredAchievements"
          :key="achievement.uuid"
          :achievement="achievement"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { IAchievement } from "@/types/achievement.interface";
import { useAchievementsApi } from "@/composables/api/useAchievementApi";

const { t } = useI18n();
const localePath = useLocalePath();
const user = useUser();
const isRefreshing = ref(false);
const searchQuery = ref("");
const selectedRarity = ref<"all" | IAchievement["rarity"]>("all");
const sortOption = ref<"latest" | "oldest">("latest");

const { getAchievements } = useAchievementsApi();

const achievements = ref<IAchievement[]>([]);

const loadAchievements = async () => {
  const response = await getAchievements();

  console.log("Achievements API response (before refresh):", {
    data: response.data.value,
    error: response.error.value,
    pending: response.pending.value,
  });

  // Принудительно выполняем запрос, если он еще не выполнен
  if (response.pending.value) {
    await response.refresh();
  }

  // Обрабатываем разные варианты структуры ответа
  let achievementsData: IAchievement[] = [];
  const responseData = response.data.value as any;

  if (Array.isArray(responseData)) {
    achievementsData = responseData;
  } else if (responseData.items && Array.isArray(responseData.items)) {
    achievementsData = responseData.items;
  } else if (responseData.data && Array.isArray(responseData.data)) {
    achievementsData = responseData.data;
  } else {
    achievementsData = [];
  }

  achievementsData = achievementsData
    .filter((achievement) => achievement && achievement.uuid) // Фильтруем валидные достижения
    .map((achievement: any) => ({
      ...achievement,
      // Маппим receivedAt из API в recievedAt для интерфейса
      recievedAt: achievement.receivedAt
        ? new Date(achievement.receivedAt)
        : achievement.recievedAt
        ? new Date(achievement.recievedAt)
        : null, // null если не получено
      rarity: achievement.rarity || "common", // Дефолтное значение если отсутствует
    }));

  achievements.value = achievementsData;
  console.log("Loaded achievements:", {
    count: achievements.value.length,
    items: achievements.value,
  });
};

onMounted(() => {
  loadAchievements();
});

const stats = computed(() => {
  const total = achievements.value.filter(
    (achievement) => achievement.recievedAt !== null
  ).length;

  return {
    total,
    progressPercent: 0,
    progressLabel: "0/0",
    level: 0,
    xp: 0,
  };
});

const rarityOptions = computed(() => [
  { label: t("achievements.categories.all"), value: "all" },
  { label: t("achievements.categories.common"), value: "common" },
  { label: t("achievements.categories.rare"), value: "rare" },
  { label: t("achievements.categories.epic"), value: "epic" },
  { label: t("achievements.categories.legendary"), value: "legendary" },
]);

const sortOptions = computed(() => [
  { label: t("achievements.sort.latest"), value: "latest" },
  { label: t("achievements.sort.oldest"), value: "oldest" },
]);

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value.trim().length > 0 ||
    selectedRarity.value !== "all" ||
    sortOption.value !== "latest"
  );
});

const filteredAchievements = computed(() => {
  let list = [...achievements.value];

  if (selectedRarity.value !== "all") {
    list = list.filter((item) => item.rarity === selectedRarity.value);
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase();
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }

  list.sort((a, b) => {
    const dateA = a.recievedAt ? new Date(a.recievedAt).getTime() : 0;
    const dateB = b.recievedAt ? new Date(b.recievedAt).getTime() : 0;
    return sortOption.value === "latest" ? dateB - dateA : dateA - dateB;
  });

  return list;
});

const refreshAchievements = async () => {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  await loadAchievements();
  isRefreshing.value = false;
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedRarity.value = "all";
  sortOption.value = "latest";
};
</script>
