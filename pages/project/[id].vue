<template>
  <div class="transition-all duration-500">
    <!-- Хлебные крошки -->
    <UBreadcrumb :items="items" class="mb-6" />

    <!-- Медиа секция -->
    <div class="relative mb-8 transition-all duration-300">
      <div class="flex justify-center">
        <div class="relative">
          <UCarousel
            v-slot="{ item }"
            v-if="activeTab === 'overview'"
            :items="images"
            arrows
            class="max-w-2xl"
            :ui="{ arrows: 'mobile:hidden items-center' }"
          >
            <img
              :src="item"
              alt="Project Screenshot"
              class="object-contain rounded-lg h-[400px] w-full"
            />
          </UCarousel>

          <!-- Иконки справа -->
        </div>
        <div class="absolute top-4 right-4 flex gap-3 z-10">
          <button class="text-white hover:text-gray-300">
            <UIcon name="i-lucide-bookmark" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Табы -->
    <UTabs v-model="activeTab" :items="tabs" class="mb-8 w-fit" />
    <USeparator class="mb-8" />

    <!-- Контент -->
    <div v-if="activeTab === 'overview'" class="space-y-8">
      <!-- Описание проекта -->
      <div>
        <h2 class="text-2xl font-bold text-white mb-4">Описание проекта</h2>
        <p class="text-gray-400 text-sm">
          Требуется разработка современного мобильного приложения для iOS и
          Android с использованием React Native. Приложение должно включать
          систему авторизации, профили пользователей, чат-функционал и
          интеграцию с платежными системами. Ожидается создание интуитивно
          понятного интерфейса с современным дизайном, оптимизированного для
          различных размеров экранов. Приложение должно работать стабильно и
          быстро, с возможностью масштабирования в будущем.
        </p>
      </div>

      <!-- Технические требования -->
      <div class="flex flex-col gap-4 mt-10">
        <h2 class="text-2xl font-bold text-white mb-4">Технологии</h2>

        <div class="flex flex-wrap gap-2">
          <!-- Frontend -->
          <UBadge
            color="success"
            :variant="isDark ? 'outline' : 'solid'"
            class="text-sm"
          >
            Nuxt.js
          </UBadge>
          <UBadge
            color="success"
            :variant="isDark ? 'outline' : 'solid'"
            class="text-sm"
          >
            Vue.js
          </UBadge>
          <UBadge
            color="success"
            :variant="isDark ? 'outline' : 'solid'"
            class="text-sm"
          >
            Tailwind CSS
          </UBadge>
          <UBadge
            color="success"
            :variant="isDark ? 'outline' : 'solid'"
            class="text-sm"
          >
            TypeScript
          </UBadge>
        </div>
      </div>
    </div>

    <!-- Отзывы -->
    <div v-if="activeTab === 'reviews'" class="space-y-6">
      <div class="flex-between mb-4 mobile:flex-col mobile:gap-4">
        <h3 class="text-2xl font-bold text-white">
          {{ t("project.reviews.title") }}
        </h3>
        <UButton color="success" trailing-icon="i-lucide-plus">
          {{ t("project.reviews.add_review") }}
        </UButton>
      </div>
      <div
        class="flex bg-card-bg rounded-lg p-8 items-center gap-12 mobile:flex-col"
      >
        <div
          class="flex flex-col gap-3 w-1/12 mobile:w-full mobile:items-center"
        >
          <h2 class="text-5xl font-bold">4.7</h2>
          <p class="text-gray-400">8 {{ t("project.reviews.review_count") }}</p>
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
import { getCategories } from "@/utils/category/getCategories";
import type { BreadcrumbItem } from "@nuxt/ui";

const isDark = computed(() => useColorMode().value === "dark");

const route = useRoute();
const id = route.params.id;
const localePath = useLocalePath();

const activeTab = ref("overview");
const { t } = useI18n();

const tabs = [
  { value: "overview", label: t("project.tabs.overview") },
  { value: "reviews", label: t("project.tabs.reviews") },
];
const images = [
  "/project.jpeg",
  "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1642&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/34/BA1yLjNnQCI1yisIZGEi_2013-07-16_1922_IMG_9873.jpg?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1194&q=80",
];

const items = ref<BreadcrumbItem[]>([
  {
    label: getCategories()[0].name,
    to: localePath("/"),
    icon: "i-lucide-box",
  },
  {
    label: getCategories()[0].subcategories?.[0]?.name,
    to: localePath("/"),
    icon: "i-lucide-box",
  },
  {
    label: `Project ${id}`,
    to: localePath(`/project/${id}`),
  },
]);
</script>
