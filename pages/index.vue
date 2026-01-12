<template>
  <img
    :src="pencilImage"
    class="absolute top-[-20px] left-[-100px] object-cover dark:invert mobile:hidden"
    width="300"
    alt="Earth"
  />
  <img
    :src="handsImage"
    class="absolute top-0 right-[-40px] object-cover dark:invert mobile:hidden"
    width="280"
    alt="Hands"
  />
  <div class="flex flex-col relative">
    <IndexIntroBar class="mt-[40px]" />
    <div
      class="grid grid-cols-3 gap-4 mt-16 self-center mobile:grid-cols-1 tablet:grid-cols-2"
    >
      <IndexCategoryCard
        v-for="category in categories"
        :key="category.uuid"
        :category="category"
        class="last:col-span-3 last:text-center mobile:last:col-span-1 tablet:last:col-span-2"
        @click="navigateToCategory(category)"
      />
    </div>
    <div
      class="bg-card-bg py-7 rounded-lg mt-40 flex flex-col items-center px-4"
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
    <h2
      class="text-4xl mobile:text-2xl mobile:mx-auto mobile:text-center mt-16"
    >
      {{ t("index.news") }}
    </h2>
    <div
      class="grid grid-cols-2 mobile:grid-cols-1 gap-6 mt-16 w-full max-w-5xl mx-auto"
    >
      <IndexNewsCard
        v-for="item in news"
        :key="item.uuid"
        :item="item"
        variant="large"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesApi } from "@/composables/api/useCategoryApi";
const { getCategories } = useCategoriesApi();
import { useI18n } from "vue-i18n";
import { ref, computed } from "vue";
import type { INews } from "@/types/news.entity";
import type { ICategory } from "@/types/category.interface";
import { useNewsApi } from "@/composables/api/useNewsApi";
import { shortenCategorySlugs } from "@/utils/categoryShortcuts";

const pencilImage = "/png/pencil.png";
const handsImage = "/png/hands.png";

const search = ref("");
const { getNews } = useNewsApi();
const news = ref<INews[]>([]);
const { data } = await getNews({ take: 4 });
if (data.value) {
  news.value = data.value;
}
const categories = ref<ICategory[]>([]);
try {
  const { data } = await getCategories();
  if (data.value) {
    categories.value = data.value.filter(
      (category) => category.subcategories && category.subcategories.length > 0
    ) as ICategory[];
  }
} catch (err) {
  console.error("Error fetching categories:", err);
}
const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();

// SEO Head
const seoTitle = computed(() => t("index.seo.title"));
const seoDescription = computed(() => t("index.seo.description"));
const seoKeywords = computed(() => t("index.seo.keywords"));
const seoImage = computed(() => t("index.seo.image"));

useHead({
  title: seoTitle,
  meta: [
    { name: "description", content: seoDescription },
    { name: "keywords", content: seoKeywords },
    { property: "og:title", content: seoTitle },
    { property: "og:description", content: seoDescription },
    { property: "og:image", content: seoImage },
    { property: "og:url", content: "https://timarlance.com" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "TimarLance" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: seoTitle },
    { name: "twitter:description", content: seoDescription },
    { name: "twitter:image", content: seoImage },
    { name: "twitter:url", content: "https://timarlance.com" },
    { name: "twitter:site", content: "TimarLance" },
    { name: "twitter:creator", content: "TimarLance" },
  ],
  link: [{ rel: "canonical", href: "https://timarlance.com" }],
});

const navigateToCategory = (category: ICategory) => {
  // Используем только slug главной категории
  // Все подкатегории будут автоматически включены
  const shortSlug = shortenCategorySlugs(category.slug);

  router.push({
    path: localePath("/feed"),
    query: {
      type: "orders",
      categorySlugs: shortSlug,
    },
  });
};
</script>
