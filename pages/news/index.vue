<template>
  <div class="min-h-screen bg-gradient-content rounded-xl">
    <!-- Header -->
    <div class="relative bg-gradient-nav">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ t("index.news") }}
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-300">
            {{ t("index.news_subtitle") }}
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="pending" class="flex justify-center items-center py-20">
        <UIcon
          name="i-lucide-loader-2"
          class="w-8 h-8 animate-spin text-success"
        />
      </div>

      <div
        v-else-if="error"
        class="rounded-2xl p-8 bg-card-bg border border-red-100 dark:border-red-500/20 text-center"
      >
        <UIcon
          name="i-lucide-alert-circle"
          class="w-12 h-12 mx-auto mb-4 text-red-500 dark:text-red-400"
        />
        <p class="text-red-500 dark:text-red-400">
          {{ t("common.error_loading") || "Ошибка загрузки новостей" }}
        </p>
      </div>

      <div
        v-else-if="newsList.length === 0"
        class="rounded-2xl p-12 bg-card-bg border border-gray-100 dark:border-gray-500/20 text-center"
      >
        <UIcon
          name="i-lucide-newspaper"
          class="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500"
        />
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          {{ t("news.empty") }}
        </p>
      </div>

      <div v-else class="flex flex-col gap-6">
        <IndexNewsCard
          v-for="item in newsList"
          :key="item.uuid"
          :item="item"
          variant="small"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useNewsApi } from "@/composables/api/useNewsApi";
import type { INews } from "@/types/news.entity";

const { t } = useI18n();
const { getNews } = useNewsApi();

const {
  data: news,
  pending,
  error,
} = await useAsyncData("news", async () => {
  const response = await getNews();
  return response.data.value || [];
});

const newsList = computed(() => news.value || []);

// SEO Head
useHead({
  title: t("index.news"),
  meta: [
    {
      name: "description",
      content: t("index.news_subtitle"),
    },
  ],
});
</script>
