<template>
  <div class="min-h-screen bg-gradient-content rounded-xl">
    <!-- Header -->
    <div class="relative bg-gradient-nav">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <NuxtLink
          @click="router.back()"
          class="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        >
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          {{ t("common.back") }}
        </NuxtLink>
        <div v-if="pending" class="flex items-center gap-3">
          <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin" />
          <span class="text-gray-600 dark:text-gray-400">{{
            t("common.loading")
          }}</span>
        </div>
        <div v-else-if="error || !news">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ t("news.not_found") }}
          </h1>
        </div>
        <div v-else>
          <div
            class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2"
          >
            <UIcon name="i-lucide-calendar" class="w-4 h-4" />
            <span>{{ formattedDate }}</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ news.title }}
          </h1>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div
      v-if="!pending && !error && news"
      class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Основной контент -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Изображение -->
          <div
            class="bg-card-bg rounded-2xl p-6 border border-gray-100 dark:border-gray-500/20 shadow-sm"
          >
            <div class="relative">
              <NuxtImg
                v-if="news.imageUrl"
                :src="news.imageUrl"
                :alt="news.title"
                class="object-cover rounded-lg w-full h-auto max-h-[600px] bg-gray-100 dark:bg-gray-800"
                loading="lazy"
              />
              <div
                v-else
                class="flex items-center justify-center h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg"
              >
                <UIcon
                  name="i-lucide-image"
                  class="w-16 h-16 text-gray-400 dark:text-gray-600"
                />
              </div>
            </div>
          </div>

          <!-- Описание -->
          <div
            class="bg-card-bg rounded-2xl p-6 border border-gray-100 dark:border-gray-500/20 shadow-sm"
          >
            <h2
              class="text-xl font-semibold text-gray-900 dark:text-white mb-4"
            >
              {{ t("news.description") }}
            </h2>
            <div
              class="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
              v-html="news.description"
            ></div>
            <p
              v-if="!news.description"
              class="text-gray-500 dark:text-gray-400 italic"
            >
              {{ t("news.no_description") }}
            </p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Информация -->
          <div
            class="bg-card-bg rounded-2xl p-6 border border-gray-100 dark:border-gray-500/20 shadow-sm"
          >
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              {{ t("news.info") }}
            </h3>
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-lucide-calendar"
                  class="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0"
                />
                <div class="flex-1">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ t("news.published_at") }}
                  </p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formattedDate }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useNewsApi } from "@/composables/api/useNewsApi";
import type { INews } from "@/types/news.entity";

const route = useRoute();
const router = useRouter();
const uuid = route.params.id as string;
const { t } = useI18n();

const { getNewsById } = useNewsApi();

const { data, pending, error } = await useAsyncData(
  `news-${uuid}`,
  async () => {
    const response = await getNewsById(uuid);
    return response.data.value;
  }
);

if (error.value) {
  console.error("Error loading news:", error.value);
  throw createError({
    statusCode: 404,
    statusMessage: t("news.not_found"),
  });
}

const news = computed(() => data.value as INews | null);

const formattedDate = computed(() => {
  if (!news.value?.createdAt) return "";
  const date =
    typeof news.value.createdAt === "string"
      ? new Date(news.value.createdAt)
      : news.value.createdAt;
  if (isNaN(date.getTime())) return "";

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
});

// SEO Head
useHead({
  title: news.value?.title || t("index.news"),
  meta: [
    {
      name: "description",
      content: news.value?.description || t("index.news_subtitle"),
    },
  ],
});
</script>
