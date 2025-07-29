<template>
  <div class="flex flex-col">
    <IndexIntroBar class="mt-[40px]" />
    <div
      class="grid grid-cols-4 gap-4 mt-16 self-center mobile:grid-cols-1 tablet:grid-cols-2"
    >
      <IndexCategoryCard
        v-for="category in categories"
        :key="category.id"
        :category="category"
        class="last:col-span-4 last:text-center mobile:last:col-span-1 tablet:last:col-span-2"
      />
    </div>
    <div
      class="bg-card-bg py-7 rounded-lg mt-16 flex flex-col items-center px-4"
    >
      <h2 class="text-4xl mobile:text-2xl mobile:mx-auto mobile:text-center">
        {{ t("index.title") }}
      </h2>
      <UInput
        v-model="search"
        :placeholder="t('index.search_title_freelancer')"
        color="success"
        autocomplete="on"
        trailing-icon="i-lucide-search"
        :ui="{ base: 'dark:bg-black' }"
        class="w-full max-w-2xl bg-none mt-6"
      />
      <div
        class="flex mt-16 justify-between w-full max-w-6xl mobile:flex-col mobile:gap-8"
      >
        <div class="flex flex-col items-center gap-2">
          <div class="flex items-center gap-2">
            <h1 class="text-4xl font-bold mobile:text-2xl mobile:font-medium">
              8M
            </h1>
            <UIcon name="i-lucide-plus" class="w-6 h-6 text-success" />
          </div>

          <h3 class="text-md">
            {{ t("index.order_stats") }}
          </h3>
        </div>
        <div class="flex flex-col items-center gap-2">
          <div class="flex items-center gap-2">
            <h1 class="text-4xl font-bold mobile:text-2xl mobile:font-medium">
              8M
            </h1>
            <UIcon name="i-lucide-plus" class="w-6 h-6 text-success" />
          </div>

          <h3 class="text-md">
            {{ t("index.freelancers_stats") }}
          </h3>
        </div>
        <div class="flex flex-col items-center gap-2">
          <div class="flex items-center gap-2">
            <h1 class="text-4xl font-bold mobile:text-2xl mobile:font-medium">
              150K
            </h1>
            <UIcon name="i-lucide-plus" class="w-6 h-6 text-success" />
          </div>

          <h3 class="text-md">
            {{ t("index.money_stats") }}
          </h3>
        </div>
        <div class="flex flex-col items-center gap-2">
          <div class="flex items-center gap-2">
            <h1 class="text-4xl font-bold mobile:text-2xl mobile:font-medium">
              24/7
            </h1>
          </div>

          <h3 class="text-md">
            {{ t("index.support") }}
          </h3>
        </div>
      </div>
    </div>
    <IndexFaq />
    <h2 class="text-4xl mobile:text-2xl mobile:mx-auto mobile:text-center mt-16">
      {{ t("index.news") }}
    </h2>
    <div
      class="grid grid-cols-2 mobile:grid-cols-1 gap-4 mt-16 w-full max-w-5xl mx-auto"
    >
      <IndexNewsCard v-for="item in news" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCategories } from "@/utils/category/getCategories";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import type { INews } from "@/types/news.entity";

const search = ref("");
const news = ref<INews[]>([
  {
    id: 1,
    title: "News 1",
    description: "Description 1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "News 2",
    description: "Description 2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: "News 3",
    description: "Description 3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    title: "News 4",
    description: "Description 4",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);
const categories = getCategories();
const { t } = useI18n();
</script>
