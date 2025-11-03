<template>
  <!-- Загрузка -->
  <div v-if="isLoading" class="flex justify-center items-center py-8">
    <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin" />
  </div>

  <!-- Основной контент -->
  <div
    v-if="profileData"
    class="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-xl"
  >
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <!-- Background Pattern -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-500/10 dark:from-green-500/5 dark:to-blue-600/5"
      ></div>
      <div
        class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.3)_1px,transparent_0)] bg-[length:20px_20px] dark:opacity-10"
      ></div>

      <div class="relative px-4 sm:px-6 lg:px-8 py-12">
        <div class="max-w-7xl mx-auto">
          <!-- Profile Header -->
          <div
            class="flex flex-col lg:flex-row gap-8 items-start lg:items-center"
          >
            <!-- Avatar Section -->
            <div class="flex-shrink-0 mobile:mx-auto">
              <div class="relative group">
                <div
                  class="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-75 group-hover:opacity-100 transition duration-300 blur-sm"
                ></div>
                <div class="relative">
                  <NuxtImg
                    :src="
                      profileData.avatarUrl ||
                      `https://i.pravatar.cc/150?u=${profileData.uuid}`
                    "
                    width="120"
                    height="120"
                    class="rounded-full ring-4 ring-white dark:ring-gray-900 shadow-xl"
                  />
                  <!-- Online Status -->
                  <div
                    v-if="profileData.isOnline"
                    class="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg"
                  >
                    <div
                      class="w-full h-full bg-green-500 rounded-full animate-pulse"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- User Info -->
            <div class="flex-1 min-w-0">
              <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <h1
                    class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    {{ profileData?.firstName }} {{ profileData?.lastName }}
                  </h1>
                  <p
                    class="text-lg text-gray-600 dark:text-gray-200 mb-2 italic"
                  >
                    {{
                      profileData?.specialization ||
                      $t("profile.default_specialization")
                    }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3">
                  <template v-if="isOwnProfile">
                    <NuxtLink
                      :to="localePath(`/profile/${profileData?.uuid}/edit`)"
                    >
                      <UButton
                        color="success"
                        variant="solid"
                        size="lg"
                        icon="i-lucide-edit-3"
                        class="shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {{ $t("profile.edit_profile") }}
                      </UButton>
                    </NuxtLink>
                  </template>
                  <!-- <template v-else>
                    <UButton
                      color="success"
                      variant="outline"
                      size="lg"
                      icon="i-lucide-message-circle"
                      class="shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Написать
                    </UButton>
                    <UButton
                      color="neutral"
                      variant="outline"
                      size="lg"
                      icon="i-lucide-heart"
                      class="shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Подписаться
                    </UButton>
                  </template> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Section -->
    <div class="px-4 sm:px-6 lg:px-8 py-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid mobile:grid-cols-1 grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            class="bg-card-bg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {{ $t("profile.statistics.total_projects") }}
                </p>
                <p class="text-3xl font-bold dark:text-success">
                  {{ stats.totalProjects }}
                </p>
              </div>
              <UIcon name="i-lucide-folder" class="w-8 h-8 dark:text-success" />
            </div>
          </div>

          <div
            class="bg-card-bg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {{ $t("profile.statistics.completed_projects") }}
                </p>
                <p class="text-3xl font-bold dark:text-success">
                  {{ stats.completedProjects }}
                </p>
              </div>
              <UIcon
                name="i-lucide-check-circle"
                class="w-8 h-8 dark:text-success"
              />
            </div>
          </div>

          <div
            class="bg-card-bg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {{ $t("profile.statistics.satisfied_clients") }} %
                </p>
                <p class="text-3xl font-bold dark:text-success">
                  {{ stats.satisfiedClients }}%
                </p>
              </div>
              <UIcon name="i-lucide-heart" class="w-8 h-8 dark:text-success" />
            </div>
          </div>

          <div
            class="bg-card-bg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {{ $t("profile.statistics.total_income") }} ₽
                </p>
                <p class="text-3xl font-bold dark:text-success">
                  {{ formatPrice(stats.totalIncome) }}
                </p>
              </div>
              <UIcon
                name="i-lucide-trending-up"
                class="w-8 h-8 dark:text-success"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="px-4 sm:px-6 lg:px-8 py-8">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Навыки и технологии
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="skillCategory in skillCategories"
            :key="skillCategory.name"
            class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800"
          >
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              {{ skillCategory.name }}
            </h3>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="skill in skillCategory.skills"
                :key="skill"
                :variant="!isDark ? 'solid' : 'soft'"
                size="sm"
                class="text-xs font-medium"
              >
                {{ skill }}
              </UBadge>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- Portfolio Section -->
    <div class="px-4 sm:px-6 lg:px-8 py-8">
      <div class="max-w-7xl mx-auto">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ $t("profile.portfolio_projects.title") }}
          </h2>
          <UTabs
            :items="items"
            v-model="selectedCategory"
            color="success"
            :ui="{
              trigger: 'text-sm',
              content: 'bg-white',
              list: 'bg-card-bg shadow-lg ',
            }"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <template v-for="project in filteredProjects" :key="project.uuid">
            <ProfileProjectCard
              v-if="
                selectedCategory === 'all' ||
                project.category?.parent?.title === selectedCategory
              "
              :project="project"
              @delete="handleDeleteProject"
            />
          </template>
        </div>
      </div>
    </div>

    <!-- Add Project Button -->
    <div v-if="isOwnProfile" class="px-4 sm:px-6 lg:px-8 py-8">
      <div class="max-w-7xl mx-auto">
        <NuxtLink :to="localePath('/create-project/main')">
          <UButton
            color="success"
            variant="solid"
            size="lg"
            class="w-full h-16 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-center justify-center"
            trailing-icon="i-lucide-plus"
          >
            {{ $t("profile.portfolio_projects.add_project") }}
          </UButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="px-4 sm:px-6 lg:px-8 py-8">
      <div class="max-w-7xl mx-auto">
        <div
          class="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800"
        >
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {{ $t("profile.reviews.title") }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileFeedbackCard />
            <ProfileFeedbackCard />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import type { IProject } from "@/types/project.interface";
import { useUserApi } from "@/composables/api/useUserApi";
import type { IUser } from "@/types/user.interface";
import { useProjectApi } from "@/composables/api/useProjectApi";
const { t } = useI18n();
definePageMeta({
  middleware: "auth",
});

const localePath = useLocalePath();
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});
const route = useRoute();
const { user } = useUser();
const { getUser } = useUserApi();

// Определяем, это собственный профиль или чужой
const profileUuid = route.params.uuid as string;
const isOwnProfile = computed(() => {
  return user.value?.uuid === profileUuid;
});

// Состояние для данных профиля
const profileData = ref<IUser | null>(null);
const isLoading = ref(false);

// Mock statistics data
const stats = ref({
  totalProjects: 12,
  completedProjects: 8,
  satisfiedClients: 95,
  totalIncome: 450000,
});

// Mock skills data
const skillCategories = ref([
  {
    name: "Frontend",
    skills: [
      "Vue.js",
      "Nuxt.js",
      "Tailwind CSS",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
    ],
  },
  {
    name: "Backend",
    skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Redis", "Docker"],
  },
  {
    name: "Design",
    skills: ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Sketch"],
  },
]);

// Format price with spaces
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price);
};

const fetchProfileData = async (uuid: string) => {
  console.log("Fetching profile data for UUID:", uuid);

  // Всегда начинаем с загрузки
  isLoading.value = true;

  try {
    // ВАЖНО: На сервере user.value может быть null, поэтому всегда загружаем через API
    // но сначала проверяем, может это текущий пользователь
    if (user.value?.uuid === uuid) {
      console.log("Using current user data");
      profileData.value = user.value;
      isLoading.value = false;
      return;
    }

    // Для всех остальных случаев загружаем через API
    console.log("Loading profile data from API");
    const { data, error } = await getUser(uuid);

    if (error.value) {
      console.error("Error fetching profile:", error.value);
      throw error.value;
    }

    if (data.value) {
      console.log("Data loaded:", data.value);
      profileData.value = data.value as IUser;
    } else {
      console.error("No data received from API");
      throw new Error("No profile data received");
    }
  } catch (err) {
    console.error("Error in fetchProfileData:", err);
    // Можно показать ошибку пользователю
    throw createError({
      statusCode: 404,
      statusMessage: "Profile not found",
    });
  } finally {
    isLoading.value = false;
  }
};
// Используем useAsyncData для правильной работы с SSR
const { data: profileDataAsync, error: profileError } = await useAsyncData(
  `profile-${profileUuid}`,
  () => fetchProfileData(profileUuid),
  {
    server: true, // Загружаем на сервере
    watch: [() => profileUuid], // Перезагружаем при изменении UUID
  }
);
if (profileDataAsync.value) {
  profileData.value = profileDataAsync.value;
}

// Если есть ошибка - выбрасываем её
if (profileError.value) {
  throw profileError.value;
}

const projects = ref<IProject[]>([]);
const allProjects = ref<IProject[]>([]);
const selectedCategory = ref<string>("all");

const fetchProjects = async () => {
  const { data, error: getProjectsError } = await useProjectApi().getProjects({
    userUuid: profileUuid,
  });
  if (getProjectsError.value) {
    console.error("Ошибка загрузки проектов:", getProjectsError.value);
  }
  allProjects.value = data.value as IProject[];
  projects.value = allProjects.value;

  // Debug: log categories
  console.log("Загруженные проекты:", allProjects.value);
  console.log(
    "Категории проектов:",
    allProjects.value.map((p) => p.category?.parent?.title)
  );
};

// Фильтрация проектов по категории и статусу
const filteredProjects = computed(() => {
  let filtered = allProjects.value;

  // Фильтр по статусу: владелец видит все, остальные только approved
  if (!isOwnProfile.value) {
    filtered = filtered.filter((project) => project.status === "approved");
  }

  // Фильтр по категории
  if (selectedCategory.value !== "all") {
    filtered = filtered.filter(
      (project) => project.category?.parent?.title === selectedCategory.value
    );
  }

  return filtered;
});

fetchProjects();

// Handle project deletion
const handleDeleteProject = async (projectId: string) => {
  allProjects.value = allProjects.value.filter(
    (project) => project.uuid !== projectId
  );

  // Show success message
};

const items = computed<TabsItem[]>(() => {
  return [
    {
      label: t("profile.all"),
      value: "all",
    },
    ...(Array.from(
      new Set(
        allProjects.value.map((project) => project.category?.parent?.title!)
      )
    ).map((category) => ({
      label: category,
      value: category,
    })) as TabsItem[]),
  ];
});
</script>
