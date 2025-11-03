<template>
  <div class="flex flex-col items-center h-full mt-8 max-w-7xl w-full mx-auto">
    <h1 class="text-[40px] font-bold text-center mobile:text-[25px]">
      {{ t("feed_title") }}
    </h1>
    <p class="text-sm text-center mobile:text-xs">
      {{ t("feed_description") }}
    </p>
    <UInput
      icon="i-lucide-search"
      size="md"
      variant="outline"
      class="w-full mt-5"
      color="neutral"
      v-model="search"
      :placeholder="t('feed.search_placeholder')"
    />
    <div class="flex w-full mt-8 gap-5 mobile:flex-col">
      <!-- Загрузка сайдбара -->
      <div
        v-if="isLoadingCategories"
        class="flex max-w-[300px] w-full h-96 rounded-4xl flex-col items-center justify-center bg-card-bg"
      >
        <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin mb-2" />
        <span class="text-sm text-gray-500">{{ t("feed.loading") }}</span>
      </div>

      <FeedSidebar
        v-else
        v-model:type="typeFilter"
        v-model:complexity="complexityFilter"
        v-model:category="categoryFilter"
        v-model:minPrice="minPrice"
        v-model:maxPrice="maxPrice"
        :categories="categories"
        :isPriceChanging="isPriceChanging"
        :selectedCategorySlugs="categoryFilter"
      />
      <div class="flex flex-col gap-8 w-full">
        <div
          class="flex justify-between items-center mobile:flex-col mobile:gap-3"
        >
          <h3 class="font-bold text-3xl pl-3">
            {{ formatPlural(totalTasks, "tasks") }}
          </h3>
          <USelect
            v-model="activeFilter"
            icon="material-symbols:sort-rounded"
            size="md"
            :items="items"
            color="neutral"
            class="w-fit bg-card-bg"
            :ui="{
              content: 'bg-card-bg w-fit',
              arrow: 'text-white',
              itemLeadingIcon: 'text-white',
            }"
          />
        </div>

        <!-- Загрузка -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin" />
          <span class="ml-2">{{ t("feed.loading") }}</span>
        </div>

        <!-- Список задач -->
        <div v-else-if="tasks.length > 0" class="space-y-4">
          <div v-for="task in tasks" :key="task.uuid" class="w-full">
            <FeedTaskCard :task="task" />
          </div>
        </div>

        <!-- Пустое состояние -->
        <div
          v-else
          class="flex flex-col items-center justify-center py-12 text-gray-500"
        >
          <UIcon name="i-lucide-search" class="w-12 h-12 mb-4" />
          <p class="text-lg">{{ t("feed.no_tasks_found") }}</p>
          <p class="text-sm">{{ t("feed.try_different_filters") }}</p>
        </div>

        <UPagination
          v-if="totalPages > 0"
          v-model:page="page"
          :total="totalTasks"
          :page-size="itemsPerPage"
          class="mx-auto"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesApi } from "@/composables/api/useCategoryApi";
import { useTaskApi } from "@/composables/api/useTaskApi";
import type { ICategory } from "@/types/category.interface";
import type { ITask } from "@/types/task.interface";

const { getCategories } = useCategoriesApi();
const { getTasks } = useTaskApi();
const { t } = useI18n();
const { formatPlural } = usePluralization();
const route = useRoute();
const router = useRouter();

// Параметры из URL
const search = ref((route.query.search as string) || "");
const page = ref(Number(route.query.page) || 1);
const typeFilter = ref<"vacancies" | "tasks">("tasks"); // Всегда показываем только задачи
const complexityFilter = ref<("easy" | "medium" | "hard")[]>(
  route.query.complexities
    ? ((route.query.complexities as string).split(",") as (
        | "easy"
        | "medium"
        | "hard"
      )[])
    : ["easy", "medium", "hard"]
);
const categoryFilter = ref((route.query.categorySlugs as string) || "");
const minPrice = ref(Number(route.query.minPrice) || 10);
const maxPrice = ref(Number(route.query.maxPrice) || 100000);

// Данные
const categories = ref<ICategory[]>([]);
const tasks = ref<ITask[]>([]);
const isLoading = ref(false);
const isLoadingCategories = ref(true);
const isPriceChanging = ref(false);
const totalTasks = ref(0);

// Пагинация
const itemsPerPage = ref(10);

// Вычисляемое свойство для общего количества страниц

// Опции сортировки
const items = ref([
  { label: t("feed.filters.sort_by_low"), value: "priceAsc" },
  { label: t("feed.filters.sort_by_high"), value: "priceDesc" },
  { label: t("feed.filters.sort_by_new"), value: "createdAtDesc" },
  { label: t("feed.filters.sort_by_old"), value: "createdAtAsc" },
]);
const activeFilter = ref<string>(items.value[0].value);

// Категории будут загружены в onMounted

// Функция обновления URL
const updateURL = () => {
  const query: Record<string, any> = {};

  if (search.value) query.search = search.value;
  if (page.value > 1) query.page = page.value;
  if (activeFilter.value !== t("feed.filters.sort_by_low"))
    query.sort = activeFilter.value;
  // Не добавляем type в URL, так как всегда показываем задачи
  if (complexityFilter.value.length < 3)
    query.complexities = complexityFilter.value.join(",");
  if (categoryFilter.value) query.categorySlugs = categoryFilter.value;
  if (minPrice.value !== 1000) query.minPrice = minPrice.value;
  if (maxPrice.value !== 100000) query.maxPrice = maxPrice.value;

  router.replace({ query });
};

// Функция загрузки задач
const loadTasks = async () => {
  isLoading.value = true;

  try {
    const params: any = {
      take: String(itemsPerPage.value),
      skip: String((page.value - 1) * itemsPerPage.value),
    };

    if (search.value) params.search = search.value;

    // Параметры для API
    if (categoryFilter.value) {
      // Передаем слаги категорий как есть
      params.categorySlugs = categoryFilter.value;
    }

    if (complexityFilter.value.length < 3) {
      // Передаем сложности как строку с разделителями
      params.complexities = complexityFilter.value.join(",");
    }

    // Добавляем цену
    if (minPrice.value !== 1000) params.minPrice = minPrice.value;
    if (maxPrice.value !== 100000) params.maxPrice = maxPrice.value;

    // Добавляем сортировку
    if (activeFilter.value) {
      params.orderBy = activeFilter.value;
    }

    console.log("API params:", params);
    const { data, error } = await getTasks(params);

    if (data.value && !error.value) {
      // Проверяем все возможные поля, где могут быть задачи
      const responseData = data.value as any;

      // Пробуем найти задачи в разных полях
      let tasksData = [];
      if (Array.isArray(data.value.items)) {
        tasksData = data.value.items;
      } else if (Array.isArray(responseData.data)) {
        tasksData = responseData.data;
      } else if (Array.isArray(responseData.tasks)) {
        tasksData = responseData.tasks;
      } else if (Array.isArray(responseData.results)) {
        tasksData = responseData.results;
      }

      tasks.value = tasksData as ITask[];
      totalTasks.value = data.value.total || 0;

      console.log("Pagination debug:", {
        totalTasks: totalTasks.value,
        itemsPerPage: itemsPerPage.value,
        totalPages: Math.ceil(totalTasks.value / itemsPerPage.value),
        currentPage: page.value,
        tasksLength: tasks.value.length,
      });
    } else {
      tasks.value = [];
      totalTasks.value = 0;
    }
  } catch (err) {
    tasks.value = [];
    totalTasks.value = 0;
  } finally {
    isLoading.value = false;
  }
};
const totalPages = computed(() => {
  if (totalTasks.value === 0) return 0;
  return Math.max(1, Math.ceil(totalTasks.value / itemsPerPage.value));
});

// Debounced функция для загрузки задач
const debouncedLoadTasks = useDebounceFn(async () => {
  isPriceChanging.value = true;
  updateURL();
  await loadTasks();
  isPriceChanging.value = false;
}, 500);

// Загружаем задачи при изменении фильтров
watch(
  [search, page, activeFilter, typeFilter, complexityFilter, categoryFilter],
  (newValues, oldValues) => {
    console.log("Filter change:", { newValues, oldValues });

    // Сбрасываем страницу при изменении фильтров (кроме самой страницы)
    if (oldValues) {
      const [
        oldSearch,
        oldPage,
        oldActiveFilter,
        oldTypeFilter,
        oldComplexityFilter,
        oldCategoryFilter,
      ] = oldValues;
      const [
        newSearch,
        newPage,
        newActiveFilter,
        newTypeFilter,
        newComplexityFilter,
        newCategoryFilter,
      ] = newValues;

      // Если изменились фильтры (но не страница), сбрасываем страницу
      if (
        oldSearch !== newSearch ||
        oldActiveFilter !== newActiveFilter ||
        oldTypeFilter !== newTypeFilter ||
        oldComplexityFilter !== newComplexityFilter ||
        oldCategoryFilter !== newCategoryFilter
      ) {
        if (page.value > 1) {
          page.value = 1;
          return; // Не вызываем loadTasks здесь, так как изменение page.value вызовет watcher снова
        }
      }
    }

    console.log("Loading tasks with activeFilter:", activeFilter.value);
    updateURL();
    loadTasks();
  },
  { deep: true }
);

// Отдельный watcher для цены с debounce
watch(
  [minPrice, maxPrice],
  () => {
    debouncedLoadTasks();
  },
  { deep: true }
);

// Загружаем данные при монтировании
onMounted(async () => {
  console.log("onMounted started");
  try {
    // Загружаем категории
    console.log("Loading categories...");
    console.log("About to call getCategories()");
    const categoriesResponse = await getCategories();
    console.log("getCategories() returned:", categoriesResponse);
    console.log("Categories response:", categoriesResponse);

    // Ждем завершения запроса с таймаутом
    let attempts = 0;
    const maxAttempts = 20; // 2 секунды максимум

    while (categoriesResponse.pending.value && attempts < maxAttempts) {
      console.log(`Waiting for categories... attempt ${attempts + 1}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    console.log(
      "Categories after waiting - data:",
      categoriesResponse.data.value
    );
    console.log(
      "Categories after waiting - error:",
      categoriesResponse.error.value
    );
    console.log(
      "Categories after waiting - pending:",
      categoriesResponse.pending.value
    );

    if (categoriesResponse.data.value && !categoriesResponse.error.value) {
      categories.value = categoriesResponse.data.value as ICategory[];
      console.log("Categories loaded successfully:", categories.value);
    } else {
      console.error("Categories API error:", categoriesResponse.error.value);
      categories.value = [];
    }
  } catch (error) {
    console.error("Error loading categories:", error);
    categories.value = [];
  } finally {
    isLoadingCategories.value = false;
  }

  // Загружаем задачи
  try {
    await loadTasks();
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
});
</script>
