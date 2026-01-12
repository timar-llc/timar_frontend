<template>
  <div class="flex flex-col items-center h-full mt-8 max-w-7xl w-full mx-auto">
    <h1 class="text-[40px] font-bold text-center mobile:text-[25px]">
      {{ currentTitle }}
    </h1>
    <p class="text-sm text-center mobile:text-xs">
      {{ currentDescription }}
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
    <UTabs
      :items="typeItems"
      v-model="activeType"
      class="w-full mt-5"
      color="neutral"
      :ui="{
        trigger: 'text-sm',
        content: 'bg-white',
        list: 'bg-card-bg shadow-lg ',
      }"
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
        v-model:minRating="minRating"
        v-model:maxRating="maxRating"
        v-model:specialization="specialization"
        v-model:skills="skills"
        :categories="categories"
        :isPriceChanging="isPriceChanging"
        :selectedCategorySlugs="categoryFilter"
        :mode="activeType"
      />
      <div class="flex flex-col gap-8 w-full">
        <div
          class="flex justify-between items-center mobile:flex-col mobile:gap-3"
        >
          <h3 class="font-bold text-3xl pl-3">
            {{
              activeType === "orders"
                ? formatPlural(totalTasks, "tasks")
                : formatPlural(totalFreelancers, "freelancers")
            }}
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
        <div
          v-else-if="activeType === 'orders' && tasks.length > 0"
          class="space-y-4"
        >
          <div v-for="task in tasks" :key="task.uuid" class="w-full">
            <FeedTaskCard :task="task" />
          </div>
        </div>

        <!-- Список исполнителей -->
        <div v-else-if="activeType === 'freelancers'" class="space-y-4">
          <div
            v-if="freelancers.length > 0"
            v-for="freelancer in freelancers"
            :key="freelancer.uuid"
            class="w-full"
          >
            <FeedFreelancerCard :freelancer="freelancer" />
          </div>
          <!-- Пустое состояние для исполнителей -->
          <div
            v-else
            class="flex flex-col items-center justify-center py-12 text-gray-500"
          >
            <UIcon name="i-lucide-search" class="w-12 h-12 mb-4" />
            <p class="text-lg">{{ t("feed.no_freelancers_found") }}</p>
            <p class="text-sm">{{ t("feed.try_different_filters") }}</p>
            <!-- Debug info -->
            <div class="mt-4 text-xs text-gray-400">
              <p>Active type: {{ activeType }}</p>
              <p>Freelancers count: {{ freelancers.length }}</p>
              <p>Is loading: {{ isLoading }}</p>
              <p>Total: {{ totalFreelancers }}</p>
            </div>
          </div>
        </div>

        <!-- Пустое состояние для задач -->
        <div
          v-else-if="activeType === 'orders' && tasks.length === 0"
          class="flex flex-col items-center justify-center py-12 text-gray-500"
        >
          <UIcon name="i-lucide-search" class="w-12 h-12 mb-4" />
          <p class="text-lg">{{ t("feed.no_tasks_found") }}</p>
          <p class="text-sm">{{ t("feed.try_different_filters") }}</p>
        </div>

        <UPagination
          v-if="totalPages > 0"
          v-model:page="page"
          :total="activeType === 'orders' ? totalTasks : totalFreelancers"
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
import { useUserApi } from "@/composables/api/useUserApi";
import type { ICategory } from "@/types/category.interface";
import type { ITask } from "@/types/task.interface";
import type { IUser } from "@/types/user.interface";
import FeedFreelancerCard from "@/components/feed/freelancer/card.vue";
import {
  shortenCategorySlugs,
  expandCategorySlugs,
} from "@/utils/categoryShortcuts";

const { getCategories } = useCategoriesApi();
const { getTasks } = useTaskApi();
const { getFreelancers } = useUserApi();
const { t } = useI18n();
const { formatPlural } = usePluralization();
const route = useRoute();
const router = useRouter();

const typeItems = computed(() => [
  { label: t("feed.tabs.orders"), value: "orders" },
  { label: t("feed.tabs.freelancers"), value: "freelancers" },
]);

const activeType = ref<"orders" | "freelancers">(
  (route.query.type as "orders" | "freelancers") || "orders"
);

// Dynamic title and description based on active tab
const currentTitle = computed(() => {
  return activeType.value === "orders"
    ? t("feed.titles.orders")
    : t("feed.titles.freelancers");
});

const currentDescription = computed(() => {
  return activeType.value === "orders"
    ? t("feed.descriptions.orders")
    : t("feed.descriptions.freelancers");
});
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
// Расшифровываем сокращенные слаги из URL в полные
const categoryFilter = ref(
  route.query.categorySlugs
    ? expandCategorySlugs(route.query.categorySlugs as string)
    : ""
);
const minPrice = ref(Number(route.query.minPrice) || 10);
const maxPrice = ref(Number(route.query.maxPrice) || 100000);

// Данные
const categories = ref<ICategory[]>([]);
const tasks = ref<ITask[]>([]);
const freelancers = ref<IUser[]>([]);
const isLoading = ref(false);
const isLoadingCategories = ref(true);
const isPriceChanging = ref(false);
const totalTasks = ref(0);
const totalFreelancers = ref(0);

// Freelancer filters
const minRating = ref(Number(route.query.minRating) || 0);
const maxRating = ref(Number(route.query.maxRating) || 5);
const specialization = ref((route.query.specialization as string) || "");
const skills = ref<string[]>(
  route.query.skills ? (route.query.skills as string).split(",") : []
);

// Пагинация
const itemsPerPage = ref(10);

// Вычисляемое свойство для общего количества страниц

// Опции сортировки для задач
const taskSortItems = ref([
  { label: t("feed.filters.sort_by_low"), value: "priceAsc" },
  { label: t("feed.filters.sort_by_high"), value: "priceDesc" },
  { label: t("feed.filters.sort_by_new"), value: "createdAtDesc" },
  { label: t("feed.filters.sort_by_old"), value: "createdAtAsc" },
]);

// Опции сортировки для исполнителей
const freelancerSortItems = ref([
  { label: t("feed.filters.sort_by_rating_high"), value: "ratingDesc" },
  { label: t("feed.filters.sort_by_rating_low"), value: "ratingAsc" },
  { label: t("feed.filters.sort_by_new"), value: "createdAtDesc" },
  { label: t("feed.filters.sort_by_old"), value: "createdAtAsc" },
]);

const items = computed(() => {
  return activeType.value === "orders"
    ? taskSortItems.value
    : freelancerSortItems.value;
});

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
  // Добавляем categorySlugs только если он не пустой
  // Если categoryFilter пустой или содержит только пробелы, параметр не добавляется (удалится из URL)
  const categorySlugsValue = (categoryFilter.value || "").trim();
  if (categorySlugsValue !== "") {
    // Сокращаем все слаги для URL (главная + выбранные подкатегории)
    query.categorySlugs = shortenCategorySlugs(categorySlugsValue);
  }
  // Если categoryFilter пустой, явно не добавляем параметр - Vue Router удалит его из URL

  if (minPrice.value !== 10) query.minPrice = minPrice.value;
  if (maxPrice.value !== 100000) query.maxPrice = maxPrice.value;

  console.log(
    "Updating URL - categoryFilter:",
    categoryFilter.value,
    "categorySlugsValue:",
    categorySlugsValue,
    "query:",
    query
  );
  router.replace({ query });
};

// Функция загрузки исполнителей
const loadFreelancers = async () => {
  isLoading.value = true;

  try {
    const params: any = {
      take: String(itemsPerPage.value),
      skip: String((page.value - 1) * itemsPerPage.value),
    };

    if (search.value) params.search = search.value;
    if (minRating.value > 0) params.minRating = minRating.value;
    if (maxRating.value < 5) params.maxRating = maxRating.value;
    if (specialization.value) params.specialization = specialization.value;
    if (skills.value.length > 0) params.skills = skills.value.join(",");

    // Добавляем сортировку
    if (activeFilter.value) {
      params.orderBy = activeFilter.value;
    }

    console.log("[Feed] Freelancers API params:", params);
    const { data, error } = await getFreelancers(params);

    console.log("[Feed] Freelancers API response:", {
      data: data.value,
      error: error.value,
    });

    if (error.value) {
      console.error("[Feed] Error loading freelancers:", error.value);
      freelancers.value = [];
      totalFreelancers.value = 0;
      return;
    }

    if (data.value) {
      const responseData = data.value as any;
      console.log("[Feed] Response data structure:", responseData);

      let freelancersData = [];
      if (Array.isArray((data.value as any).items)) {
        freelancersData = (data.value as any).items;
        console.log(
          "[Feed] Found freelancers in items:",
          freelancersData.length
        );
      } else if (Array.isArray(responseData.data)) {
        freelancersData = responseData.data;
        console.log(
          "[Feed] Found freelancers in data:",
          freelancersData.length
        );
      } else if (Array.isArray(responseData.freelancers)) {
        freelancersData = responseData.freelancers;
        console.log(
          "[Feed] Found freelancers in freelancers:",
          freelancersData.length
        );
      } else if (Array.isArray(responseData.results)) {
        freelancersData = responseData.results;
        console.log(
          "[Feed] Found freelancers in results:",
          freelancersData.length
        );
      } else if (Array.isArray(data.value)) {
        freelancersData = data.value;
        console.log(
          "[Feed] Found freelancers as direct array:",
          freelancersData.length
        );
      } else {
        console.warn("[Feed] Unknown response structure:", responseData);
      }

      freelancers.value = freelancersData as IUser[];
      totalFreelancers.value =
        (data.value as any).total || freelancersData.length || 0;

      console.log("[Feed] Loaded freelancers:", {
        count: freelancers.value.length,
        total: totalFreelancers.value,
        items: freelancers.value,
      });
    } else {
      console.warn("[Feed] No data in response");
      freelancers.value = [];
      totalFreelancers.value = 0;
    }
  } catch (err) {
    freelancers.value = [];
    totalFreelancers.value = 0;
  } finally {
    isLoading.value = false;
  }
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
    if (categoryFilter.value && categoryFilter.value.trim() !== "") {
      // Передаем все выбранные слаги (главная категория + выбранные подкатегории)
      params.categorySlugs = categoryFilter.value;
    }

    if (complexityFilter.value.length < 3) {
      // Передаем сложности как строку с разделителями
      params.complexities = complexityFilter.value.join(",");
    }

    // Добавляем цену
    if (minPrice.value !== 10) params.minPrice = minPrice.value;
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
  const total =
    activeType.value === "orders" ? totalTasks.value : totalFreelancers.value;
  if (total === 0) return 0;
  return Math.max(1, Math.ceil(total / itemsPerPage.value));
});

// Debounced функция для загрузки задач
const debouncedLoadTasks = useDebounceFn(async () => {
  isPriceChanging.value = true;
  updateURL();
  await loadTasks();
  isPriceChanging.value = false;
}, 500);

// Загружаем данные при изменении типа
watch(
  activeType,
  (newType, oldType) => {
    console.log("[Feed] Active type changed:", { newType, oldType });
    page.value = 1;
    if (newType === "orders") {
      loadTasks();
    } else {
      console.log("[Feed] Loading freelancers...");
      loadFreelancers();
    }
  },
  { immediate: false }
);

// Загружаем задачи при изменении фильтров
watch(
  [search, page, activeFilter, typeFilter, complexityFilter, categoryFilter],
  (newValues, oldValues) => {
    if (activeType.value !== "orders") return;
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
        console.log("Filters changed, resetting page:", {
          oldCategoryFilter,
          newCategoryFilter,
          categoryFilter: categoryFilter.value,
        });
        if (page.value > 1) {
          page.value = 1;
          return; // Не вызываем loadTasks здесь, так как изменение page.value вызовет watcher снова
        }
      }
    }

    console.log(
      "Loading tasks with activeFilter:",
      activeFilter.value,
      "categoryFilter:",
      categoryFilter.value
    );
    updateURL();
    loadTasks();
  },
  { deep: true }
);

// Отдельный watcher для цены с debounce
watch(
  [minPrice, maxPrice],
  () => {
    if (activeType.value === "orders") {
      debouncedLoadTasks();
    }
  },
  { deep: true }
);

// Watcher для фильтров исполнителей
watch(
  [search, page, activeFilter, minRating, maxRating, specialization, skills],
  (newValues, oldValues) => {
    if (activeType.value !== "freelancers") return;

    if (oldValues) {
      const [
        oldSearch,
        oldPage,
        oldActiveFilter,
        oldMinRating,
        oldMaxRating,
        oldSpecialization,
        oldSkills,
      ] = oldValues;
      const [
        newSearch,
        newPage,
        newActiveFilter,
        newMinRating,
        newMaxRating,
        newSpecialization,
        newSkills,
      ] = newValues;

      if (
        oldSearch !== newSearch ||
        oldActiveFilter !== newActiveFilter ||
        oldMinRating !== newMinRating ||
        oldMaxRating !== newMaxRating ||
        oldSpecialization !== newSpecialization ||
        JSON.stringify(oldSkills) !== JSON.stringify(newSkills)
      ) {
        if (page.value > 1) {
          page.value = 1;
          return;
        }
      }
    }

    updateURL();
    loadFreelancers();
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

  // Загружаем данные в зависимости от активного типа
  try {
    console.log("[Feed] onMounted, activeType:", activeType.value);
    if (activeType.value === "orders") {
      await loadTasks();
    } else {
      console.log("[Feed] onMounted, loading freelancers");
      await loadFreelancers();
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
});
</script>
