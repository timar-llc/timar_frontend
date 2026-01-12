<template>
  <div class="transition-all duration-500 max-w-7xl mx-auto px-4">
    <!-- Заголовок проекта -->
    <div
      class="bg-card-bg rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700 shadow-lg"
    >
      <div
        class="flex items-start justify-between mobile:flex-col mobile:gap-4"
      >
        <div class="flex-1">
          <h1
            class="text-3xl font-bold text-gray-900 dark:text-white mb-3 mobile:text-2xl"
          >
            {{ project?.title || "Название проекта" }}
          </h1>
          <div class="flex items-center gap-4 flex-wrap">
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-user"
                class="w-5 h-5 text-gray-500 dark:text-gray-400"
              />
              <span class="text-sm text-gray-600 dark:text-gray-300">
                {{ project?.user?.firstName }} {{ project?.user?.lastName }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-calendar"
                class="w-5 h-5 text-gray-500 dark:text-gray-400"
              />
              <span class="text-sm text-gray-600 dark:text-gray-300">
                {{ formattedDate }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <!-- <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-bookmark"
            class="mobile:hidden"
          /> -->
          <UButton
            color="success"
            size="lg"
            class="mobile:w-full"
            v-if="user?.uuid !== project?.user?.uuid"
          >
            {{ t("project.contact") }}
          </UButton>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Основной контент -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Медиа секция -->
        <div
          class="bg-card-bg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div class="relative">
            <UCarousel
              v-slot="{ item }"
              v-if="projectImages.length > 0"
              :items="projectImages"
              arrows
              class="w-full"
              :ui="{ arrows: 'mobile:hidden items-center' }"
            >
              <img
                :src="item"
                alt="Project Screenshot"
                class="object-contain rounded-lg h-[500px] w-full bg-gray-100 dark:bg-gray-800"
              />
            </UCarousel>
            <div
              v-else
              class="flex items-center justify-center h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <UIcon
                name="i-lucide-image"
                class="w-16 h-16 text-gray-400 dark:text-gray-600"
              />
            </div>
          </div>
        </div>

        <!-- Табы -->
        <div
          class="bg-card-bg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <UTabs v-model="activeTab" :items="tabs" class="mb-6" />
          <USeparator class="mb-6" />

          <!-- Контент -->
          <div v-if="activeTab === 'overview'" class="space-y-8">
            <!-- Описание проекта -->
            <div>
              <h2
                class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <UIcon name="i-lucide-file-text" class="w-6 h-6 text-success" />
                {{ t("project.description") }}
              </h2>
              <p
                class="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
              >
                {{ project?.description || t("project.no_description") }}
              </p>
            </div>

            <!-- Технологии -->
            <div
              v-if="project?.technologies && project.technologies.length > 0"
            >
              <h2
                class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
              >
                <UIcon name="i-lucide-code" class="w-6 h-6 text-success" />
                {{ t("project.technologies") }}
              </h2>
              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="tech in project.technologies"
                  :key="tech"
                  color="success"
                  :variant="isDark ? 'outline' : 'solid'"
                  class="text-sm"
                >
                  {{ tech }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Боковая панель -->
      <div class="space-y-6">
        <!-- Информация о проекте -->
        <div
          class="bg-card-bg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {{ t("project.info") }}
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-4">
              <span
                class="text-sm text-gray-600 dark:text-gray-400 flex-shrink-0 w-32"
              >
                {{ t("project.price") }}
              </span>
              <span
                class="text-lg font-bold text-gray-900 dark:text-white text-right flex-1"
              >
                {{ formattedPrice }}
              </span>
            </div>
            <USeparator />
            <div class="flex items-center justify-between gap-4">
              <span
                class="text-sm text-gray-600 dark:text-gray-400 flex-shrink-0 w-32"
              >
                {{ t("project.duration") }}
              </span>
              <span
                class="text-lg font-bold text-gray-900 dark:text-white text-right flex-1"
              >
                {{ formattedDuration }}
              </span>
            </div>
            <USeparator />
            <div class="flex items-center justify-between gap-4">
              <span
                class="text-sm text-gray-600 dark:text-gray-400 flex-shrink-0 w-32"
              >
                {{ t("project.category") }}
              </span>
              <div class="flex-1 flex justify-end">
                <UBadge
                  v-if="project?.category"
                  color="success"
                  :variant="isDark ? 'outline' : 'solid'"
                  size="sm"
                >
                  {{ project.category.title }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>

        <!-- Автор проекта -->
        <div
          v-if="project?.user"
          class="bg-card-bg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {{ t("project.author") }}
          </h3>
          <div class="flex items-center gap-4">
            <UAvatar
              :src="project.user.avatarUrl || undefined"
              :alt="project.user.firstName + ' ' + project.user.lastName"
              class="w-16 h-16 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
            />
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900 dark:text-white">
                {{ project.user.firstName }} {{ project.user.lastName }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ project.user.specialization }}
              </p>
              <div class="flex items-center gap-1 mt-1">
                <UIcon name="i-lucide-star" class="w-4 h-4 text-yellow-500" />
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ project.user.rating || "0.0" }}
                </span>
              </div>
            </div>
          </div>
          <UButton
            color="success"
            variant="outline"
            class="w-full mt-4"
            :to="localePath(`/profile/${project.user.uuid}`)"
          >
            {{ t("project.view_profile") }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Отзывы -->
    <div
      v-if="activeTab === 'reviews'"
      class="bg-card-bg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg space-y-6"
    >
      <div class="flex-between mb-4 mobile:flex-col mobile:gap-4">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t("project.reviews.title") }}
        </h3>
        <UButton color="success" trailing-icon="i-lucide-plus">
          {{ t("project.reviews.add_review") }}
        </UButton>
      </div>
      <div
        class="flex bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 items-center gap-12 mobile:flex-col"
      >
        <div
          class="flex flex-col gap-3 w-1/12 mobile:w-full mobile:items-center"
        >
          <h2 class="text-5xl font-bold text-gray-900 dark:text-white">4.7</h2>
          <p class="text-gray-600 dark:text-gray-400">
            8 {{ t("project.reviews.review_count") }}
          </p>
        </div>
        <UProgress
          :model-value="4.7"
          :max="5"
          color="success"
          class="w-full mobile:w-1/2"
        />
      </div>
      <div class="flex flex-col gap-4 mt-4">
        <ProfileFeedbackCard />
        <ProfileFeedbackCard />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProjectApi } from "@/composables/api/useProjectApi";
import type { IProject } from "@/types/project.interface";
import { formatDuration as formatDurationUtil } from "@/utils/formatDuration";
import type { IUser } from "@/types/user.interface";

interface IProjectWithUser extends IProject {
  user?: IUser;
}

const route = useRoute();
const id = route.params.id;
const isDark = computed(() => useColorMode().value === "dark");
const { user } = useUser();
const { data, error: getProjectError } = await useAsyncData(
  "project",
  async () => {
    const response = await useProjectApi().getProjectById(id as string);
    // Извлекаем только данные, а не весь объект с методами
    return response.data.value;
  }
);
if (getProjectError.value) {
  console.error("Error loading project:", getProjectError.value);
  navigateTo("/404");
}
const project = computed(() => data.value as IProjectWithUser);
const localePath = useLocalePath();

const activeTab = ref("overview");
const { t } = useI18n();

const tabs = [
  { value: "overview", label: t("project.tabs.overview") },
  { value: "reviews", label: t("project.tabs.reviews") },
];

// Получаем изображения из проекта или используем дефолтные
const projectImages = computed<string[]>(() => {
  if (project.value?.media && project.value.media.length > 0) {
    return project.value.media
      .map((m) => m.url)
      .filter((url): url is string => !!url);
  }
  return [
    "/project.jpeg",
    "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  ];
});

// Форматирование функций
const formattedPrice = computed(() => {
  if (!project.value?.price) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(project.value.price);
});

const formattedDuration = computed(() => {
  if (!project.value?.duration) return "—";
  return formatDurationUtil(t, project.value.duration);
});

const formattedDate = computed(() => {
  if (!project.value?.createdAt) return "—";
  return new Date(project.value.createdAt).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});
</script>
