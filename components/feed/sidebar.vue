<template>
  <div
    class="flex max-w-[300px] w-full mobile:max-w-full h-full rounded-2xl flex-col dark:text-white text-black p-4 light:border-1 light:border-gray-200 bg-card-bg"
  >
    <div class="flex flex-col gap-6">
      <!-- Тип -->
      <div v-if="props.mode !== 'freelancers'">
        <p class="font-medium mb-3">{{ t("feed.sidebar.type.title") }}</p>
        <div class="flex gap-2">
          <!-- Задачи - активная кнопка -->
          <UButton
            :color="type === 'tasks' ? 'success' : 'neutral'"
            variant="solid"
            class="flex-1"
            :ui="{ base: 'justify-center' }"
          >
            {{ t("feed.sidebar.type.tasks") }}
          </UButton>

          <!-- Вакансии - неактивная с "Скоро" -->
          <UButton
            color="neutral"
            variant="outline"
            class="flex-1 relative"
            :ui="{ base: 'justify-center' }"
            disabled
          >
            {{ t("feed.sidebar.type.vacancies") }}
            <span
              class="absolute -top-3 -right-1 bg-primary text-xs text-black-100 px-1.5 py-0.5 rounded-full"
            >
              {{ t("soon") }}
            </span>
          </UButton>
        </div>
      </div>

      <!-- Сложность (только для задач) -->
      <div v-if="props.mode !== 'freelancers'">
        <p class="font-medium mb-3">{{ t("feed.sidebar.complexity.title") }}</p>
        <UCheckboxGroup
          v-model="complexityValue"
          :items="complexityItems"
          :ui="{
            indicator: 'bg-success',
          }"
          color="success"
          @update:model-value="onChangeComplexity"
        />
      </div>

      <!-- Рейтинг (только для исполнителей) -->
      <div v-if="props.mode === 'freelancers'">
        <div class="flex items-center gap-2 mb-3">
          <p class="font-medium">{{ t("feed.sidebar.rating.title") }}</p>
        </div>
        <div class="flex-between items-center mb-3">
          <p>{{ ratingValue[0] }}</p>
          <p>{{ ratingValue[1] }}</p>
        </div>
        <USlider
          v-model="ratingValue"
          :min="0"
          :max="5"
          :step="0.1"
          color="success"
        />
      </div>

      <!-- Категории -->
      <div v-if="props.mode !== 'freelancers'">
        <p class="font-medium mb-3">{{ t("feed.sidebar.categories.title") }}</p>
        <div class="space-y-2">
          <div
            v-for="category in mainCategories"
            :key="category.uuid"
            class="space-y-1"
          >
            <!-- Основная категория -->
            <div class="flex items-center gap-2">
              <UCheckbox
                :model-value="isCategorySelected(category.uuid)"
                @update:model-value="
                  (checked: boolean | 'indeterminate') => toggleCategory(category.uuid, checked === true)
                "
                color="neutral"
              />
              <span
                class="text-sm font-medium cursor-pointer flex-1"
                @click="toggleCategoryExpansion(category.uuid)"
              >
                {{ category.title }}
              </span>
              <UButton
                v-if="
                  category.subcategories && category.subcategories.length > 0
                "
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                :class="{
                  'rotate-180': expandedCategories.includes(category.uuid),
                }"
                @click="toggleCategoryExpansion(category.uuid)"
              />
            </div>

            <!-- Подкатегории -->
            <div
              v-if="category.subcategories && category.subcategories.length > 0"
              :class="{ hidden: !expandedCategories.includes(category.uuid) }"
              class="ml-6 space-y-1"
            >
              <div
                v-for="subcategory in category.subcategories"
                :key="subcategory.uuid"
                class="flex items-center gap-2"
              >
                <UCheckbox
                  :model-value="
                    isSubcategorySelected(category.uuid, subcategory.uuid)
                  "
                  @update:model-value="
                    (checked: boolean | 'indeterminate') =>
                      toggleSubcategory(category.uuid, subcategory.uuid, checked === true)
                  "
                  color="neutral"
                />
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ subcategory.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Цена (только для задач) -->
      <div v-if="props.mode !== 'freelancers'">
        <div class="flex items-center gap-2 mb-3">
          <p class="font-medium">{{ t("feed.sidebar.price_high.title") }}</p>
          <UIcon
            v-if="isPriceChanging"
            name="i-lucide-loader-2"
            class="w-4 h-4 animate-spin text-success"
          />
        </div>
        <div class="flex-between items-center mb-3">
          <p>{{ priceValue[0] }}₽</p>
          <p>{{ priceValue[1] }}₽</p>
        </div>
        <USlider v-model="priceValue" :min="10" :max="100000" color="success" />
      </div>

      <!-- Специализация (только для исполнителей) -->
      <div v-if="props.mode === 'freelancers'">
        <p class="font-medium mb-3">
          {{ t("feed.sidebar.specialization.title") }}
        </p>
        <UInput
          :model-value="specializationValue"
          :placeholder="t('feed.sidebar.specialization.placeholder')"
          @update:model-value="emit('update:specialization', $event)"
          color="success"
        />
      </div>

      <!-- Стек технологий (только для исполнителей) -->
      <div v-if="props.mode === 'freelancers'">
        <p class="font-medium mb-3">{{ t("feed.sidebar.skills.title") }}</p>
        <UInput
          :model-value="skillsValue"
          :placeholder="t('feed.sidebar.skills.placeholder')"
          @update:model-value="onSkillsChange"
          color="success"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ t("feed.sidebar.skills.hint") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICategory } from "@/types/category.interface";
import type { CheckboxGroupItem, CheckboxGroupValue } from "@nuxt/ui";

const { t } = useI18n();
const props = defineProps<{
  type: "tasks" | "vacancies";
  complexity: ("easy" | "medium" | "hard")[];
  categories: ICategory[];
  minPrice?: number;
  maxPrice?: number;
  isPriceChanging?: boolean;
  // Freelancer filters
  mode?: "orders" | "freelancers";
  minRating?: number;
  maxRating?: number;
  specialization?: string;
  skills?: string[];
  selectedCategorySlugs?: string;
}>();

const emit = defineEmits<{
  "update:type": [value: "tasks" | "vacancies"];
  "update:complexity": [value: ("easy" | "medium" | "hard")[]];
  "update:categories": [value: ICategory[]];
  "update:category": [value: string];
  "update:minPrice": [value: number];
  "update:maxPrice": [value: number];
  // Freelancer filters
  "update:minRating": [value: number];
  "update:maxRating": [value: number];
  "update:specialization": [value: string];
  "update:skills": [value: string[]];
}>();

// Состояние
const expandedCategories = ref<string[]>([]);
const selectedCategories = ref<Set<string>>(new Set());
const selectedSubcategories = ref<Map<string, Set<string>>>(new Map());
const isUpdatingFromUser = ref(false);

// Основные категории (только те, у которых есть подкатегории)
const mainCategories = computed(() => {
  return props.categories.filter(
    (category) => category.subcategories && category.subcategories.length > 0
  );
});

// Тип
const onChange = (value: string | number) => {
  const newType = value === 0 || value === "0" ? "tasks" : "vacancies";
  emit("update:type", newType);
};

const priceValue = ref<number[]>([
  props.minPrice || 10,
  props.maxPrice || 100000,
]);

// Rating value for freelancers
const ratingValue = ref<number[]>([props.minRating || 0, props.maxRating || 5]);

// Specialization value
const specializationValue = ref(props.specialization || "");

// Skills value
const skillsValue = ref((props.skills || []).join(", "));

// Отслеживаем изменения цены
watch(
  priceValue,
  (newValue) => {
    emit("update:minPrice", newValue[0]);
    emit("update:maxPrice", newValue[1]);
  },
  { deep: true }
);

// Синхронизируем с props
watch(
  () => [props.minPrice, props.maxPrice],
  ([minPrice, maxPrice]) => {
    if (minPrice !== undefined && maxPrice !== undefined) {
      priceValue.value = [minPrice, maxPrice];
    }
  },
  { deep: true }
);

// Отслеживаем изменения рейтинга
watch(
  ratingValue,
  (newValue) => {
    emit("update:minRating", newValue[0]);
    emit("update:maxRating", newValue[1]);
  },
  { deep: true }
);

// Синхронизируем рейтинг с props
watch(
  () => [props.minRating, props.maxRating],
  ([minRating, maxRating]) => {
    if (minRating !== undefined && maxRating !== undefined) {
      ratingValue.value = [minRating, maxRating];
    }
  },
  { deep: true }
);

// Синхронизируем специализацию
watch(
  () => props.specialization,
  (newValue) => {
    specializationValue.value = newValue || "";
  }
);

// Синхронизируем навыки
watch(
  () => props.skills,
  (newValue) => {
    skillsValue.value = (newValue || []).join(", ");
  },
  { deep: true }
);

// Handle skills change
const onSkillsChange = (value: string) => {
  skillsValue.value = value;
  const skillsArray = value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  emit("update:skills", skillsArray);
};

// Сложность
const complexityValue = ref<CheckboxGroupValue[]>(
  props.complexity.map((c) => {
    if (c === "easy") return "easy";
    if (c === "medium") return "medium";
    if (c === "hard") return "hard";
    return "easy";
  })
);

const onChangeComplexity = (value: any[]) => {
  const complexityValues = value
    .filter((v) => typeof v === "string")
    .map((v) => {
      if (v === "easy") return "easy";
      if (v === "medium") return "medium";
      if (v === "hard") return "hard";
      return "easy";
    }) as ("easy" | "medium" | "hard")[];

  emit("update:complexity", complexityValues);
};

const complexityItems = ref<CheckboxGroupItem[]>([
  { label: t("feed.sidebar.complexity.easy"), value: "easy" },
  { label: t("feed.sidebar.complexity.medium"), value: "medium" },
  { label: t("feed.sidebar.complexity.hard"), value: "hard" },
]);

// Синхронизируем complexityValue с props.complexity
watch(
  () => props.complexity,
  (newComplexity) => {
    complexityValue.value = newComplexity.map((c) => {
      if (c === "easy") return "easy";
      if (c === "medium") return "medium";
      if (c === "hard") return "hard";
      return "easy";
    });
  },
  { immediate: true }
);

// Функция для получения текущих слагов из состояния
const getCurrentSlugsFromState = (): string => {
  // Находим выбранную главную категорию (может быть только одна)
  const selectedCategory = props.categories.find((category) =>
    selectedCategories.value.has(category.uuid)
  );

  if (!selectedCategory) {
    return "";
  }

  // Собираем все выбранные слаги: главная категория + выбранные подкатегории
  const allSlugs: string[] = [selectedCategory.slug];

  const subcategoriesSet = selectedSubcategories.value.get(
    selectedCategory.uuid
  );
  if (subcategoriesSet && selectedCategory.subcategories) {
    selectedCategory.subcategories.forEach((subcategory) => {
      if (subcategoriesSet.has(subcategory.uuid)) {
        allSlugs.push(subcategory.slug);
      }
    });
  }

  return allSlugs.join(",");
};

// Инициализация выбранных категорий из URL
const initializeCategoriesFromSlugs = () => {
  // Не инициализируем, если обновление идет от пользователя
  if (isUpdatingFromUser.value) {
    console.log("Skipping initialization - user is updating");
    return;
  }

  // Расшифровываем сокращенные слаги из URL
  const expandedSlugs = expandedCategorySlugs.value;

  // Проверяем, соответствует ли текущее состояние URL
  const currentSlugs = getCurrentSlugsFromState();
  const urlSlugs = expandedSlugs.trim();

  if (currentSlugs === urlSlugs) {
    console.log("Skipping initialization - state already matches URL:", {
      currentSlugs,
      urlSlugs,
    });
    return;
  }

  console.log(
    "Initializing from URL:",
    props.selectedCategorySlugs,
    "expanded:",
    expandedSlugs
  );

  // Если нет категорий в URL, очищаем состояние и выходим
  if (!expandedSlugs || expandedSlugs.trim() === "") {
    selectedCategories.value.clear();
    selectedSubcategories.value.clear();
    return;
  }

  // Парсим слаги из URL - первый slug это главная категория, остальные - выбранные подкатегории
  const slugs = expandedSlugs
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (slugs.length === 0) {
    selectedCategories.value.clear();
    selectedSubcategories.value.clear();
    return;
  }

  // Первый slug - главная категория
  const mainCategorySlug = slugs[0];
  const selectedSubcategorySlugs = slugs.slice(1); // Остальные - выбранные подкатегории

  // Очищаем текущее состояние
  selectedCategories.value.clear();
  selectedSubcategories.value.clear();

  // Находим категорию по slug
  const category = props.categories.find(
    (cat) => cat.slug === mainCategorySlug
  );

  if (category) {
    // Выбираем главную категорию
    selectedCategories.value.add(category.uuid);

    if (category.subcategories && category.subcategories.length > 0) {
      // Если в URL есть выбранные подкатегории, выбираем только их
      // Если в URL только главная категория, выбираем все подкатегории
      if (selectedSubcategorySlugs.length > 0) {
        const selectedSubcategoryUuids = new Set<string>();
        category.subcategories.forEach((subcategory) => {
          if (selectedSubcategorySlugs.includes(subcategory.slug)) {
            selectedSubcategoryUuids.add(subcategory.uuid);
          }
        });
        selectedSubcategories.value.set(
          category.uuid,
          selectedSubcategoryUuids
        );
      } else {
        // Если в URL только главная категория, выбираем все подкатегории
        selectedSubcategories.value.set(
          category.uuid,
          new Set(category.subcategories.map((sub) => sub.uuid))
        );
      }

      // Раскрываем категорию
      if (!expandedCategories.value.includes(category.uuid)) {
        expandedCategories.value.push(category.uuid);
      }
    }
  }
};

// Computed для расшифровки сокращенных слагов из URL
const expandedCategorySlugs = computed(() => {
  if (!props.selectedCategorySlugs) return "";
  return expandCategorySlugs(props.selectedCategorySlugs);
});

// Инициализируем категории при монтировании и изменении props
watch(
  () => props.selectedCategorySlugs,
  (newCategorySlugs, oldCategorySlugs) => {
    // Не инициализируем, если обновление идет от пользователя
    if (isUpdatingFromUser.value) {
      console.log("Watcher skipped - user is updating");
      return;
    }

    // Не переинициализируем, если новое значение пустое и состояние уже пустое
    const isStateEmpty =
      selectedCategories.value.size === 0 &&
      selectedSubcategories.value.size === 0;

    if (isStateEmpty && (!newCategorySlugs || newCategorySlugs.trim() === "")) {
      console.log("Watcher skipped - state is already empty and URL is empty");
      return;
    }

    // Не переинициализируем, если URL не изменился (это может быть из-за нашего же обновления)
    if (newCategorySlugs === oldCategorySlugs) {
      console.log("Watcher skipped - URL hasn't changed");
      return;
    }

    // Инициализируем только если категории загружены и selectedCategorySlugs изменился
    if (props.categories.length > 0) {
      // Проверяем, что это действительно изменение извне (не от нашего обновления)
      // Если старое значение было пустым, а новое - нет, это может быть инициализация из URL
      // Если новое значение пустое, а старое было не пустым, это может быть обновление от пользователя
      const wasEmpty = !oldCategorySlugs || oldCategorySlugs.trim() === "";
      const isEmpty = !newCategorySlugs || newCategorySlugs.trim() === "";

      // Если URL стал пустым, не переинициализируем (это обновление от пользователя)
      if (!wasEmpty && isEmpty) {
        console.log(
          "Watcher skipped - URL became empty (user cleared categories)"
        );
        return;
      }

      console.log(
        "Watcher triggered - initializing from URL:",
        newCategorySlugs
      );
      initializeCategoriesFromSlugs();
    }
  },
  { immediate: true }
);

// Отдельный watcher для категорий - инициализируем при первой загрузке
watch(
  () => props.categories,
  (newCategories) => {
    // Не инициализируем, если обновление идет от пользователя
    if (isUpdatingFromUser.value) {
      return;
    }

    // Инициализируем при первой загрузке категорий, если есть слаги в URL
    if (
      newCategories &&
      newCategories.length > 0 &&
      props.selectedCategorySlugs
    ) {
      initializeCategoriesFromSlugs();
    }
  },
  { immediate: true }
);

// Категории
const toggleCategoryExpansion = (categoryId: string) => {
  const index = expandedCategories.value.indexOf(categoryId);
  if (index > -1) {
    expandedCategories.value.splice(index, 1);
  } else {
    expandedCategories.value.push(categoryId);
  }
};

const isCategorySelected = (categoryId: string): boolean => {
  // Если главная категория явно выбрана
  if (selectedCategories.value.has(categoryId)) {
    return true;
  }

  // Проверяем, выбрана ли хотя бы одна подкатегория
  const category = props.categories.find((cat) => cat.uuid === categoryId);
  if (category && category.subcategories && category.subcategories.length > 0) {
    const subcategories = selectedSubcategories.value.get(categoryId);
    if (subcategories && subcategories.size > 0) {
      return true;
    }
  }

  return false;
};

const isSubcategorySelected = (
  categoryId: string,
  subcategoryId: string
): boolean => {
  const subcategories = selectedSubcategories.value.get(categoryId);
  return subcategories ? subcategories.has(subcategoryId) : false;
};

const toggleCategory = (categoryId: string, checked: boolean) => {
  const category = props.categories.find((cat) => cat.uuid === categoryId);
  if (!category) return;

  isUpdatingFromUser.value = true;

  if (checked) {
    // Очищаем все предыдущие выборы (только одна главная категория может быть активна)
    selectedCategories.value.clear();
    selectedSubcategories.value.clear();

    // Устанавливаем галочку на новую родительскую категорию
    selectedCategories.value.add(categoryId);

    // Автоматически выбираем все дочерние категории
    if (category.subcategories && category.subcategories.length > 0) {
      selectedSubcategories.value.set(
        categoryId,
        new Set(category.subcategories.map((sub) => sub.uuid))
      );
    }

    // Раскрываем категорию
    if (!expandedCategories.value.includes(categoryId)) {
      expandedCategories.value.push(categoryId);
    }
  } else {
    // Снимаем галочку с родительской категории
    selectedCategories.value.delete(categoryId);

    // Удаляем все дочерние категории
    selectedSubcategories.value.delete(categoryId);
  }

  // Обновляем URL
  emitCategoriesUpdate();

  // Сбрасываем флаг после задержки, чтобы дать время URL обновиться
  nextTick(() => {
    setTimeout(() => {
      isUpdatingFromUser.value = false;
      console.log("isUpdatingFromUser reset to false");
    }, 800);
  });
};

const toggleSubcategory = (
  categoryId: string,
  subcategoryId: string,
  checked: boolean
) => {
  const category = props.categories.find((cat) => cat.uuid === categoryId);
  if (!category || !category.subcategories) return;

  isUpdatingFromUser.value = true;

  // Если главная категория не выбрана, выбираем её автоматически
  if (!selectedCategories.value.has(categoryId)) {
    // Очищаем все предыдущие выборы (только одна главная категория может быть активна)
    selectedCategories.value.clear();
    selectedSubcategories.value.clear();

    // Выбираем главную категорию
    selectedCategories.value.add(categoryId);

    // Инициализируем Set для подкатегорий
    if (!selectedSubcategories.value.has(categoryId)) {
      selectedSubcategories.value.set(categoryId, new Set());
    }
  }

  // Получаем Set подкатегорий для этой категории
  if (!selectedSubcategories.value.has(categoryId)) {
    selectedSubcategories.value.set(categoryId, new Set());
  }
  const subcategories = selectedSubcategories.value.get(categoryId)!;

  if (checked) {
    // Добавляем дочернюю категорию
    subcategories.add(subcategoryId);
  } else {
    // Удаляем дочернюю категорию
    subcategories.delete(subcategoryId);
  }

  // Обновляем URL (все равно будет только главная категория)
  emitCategoriesUpdate();

  // Сбрасываем флаг после задержки
  nextTick(() => {
    setTimeout(() => {
      isUpdatingFromUser.value = false;
      console.log("isUpdatingFromUser reset to false");
    }, 800);
  });
};

const emitCategoriesUpdate = () => {
  // Находим выбранную главную категорию (может быть только одна)
  const selectedCategory = props.categories.find((category) =>
    selectedCategories.value.has(category.uuid)
  );

  if (!selectedCategory) {
    emit("update:category", "");
    return;
  }

  const subcategoriesSet = selectedSubcategories.value.get(
    selectedCategory.uuid
  );

  // Всегда собираем все выбранные слаги: главная категория + все выбранные подкатегории
  const allSlugs: string[] = [selectedCategory.slug];

  if (subcategoriesSet && selectedCategory.subcategories) {
    selectedCategory.subcategories.forEach((subcategory) => {
      if (subcategoriesSet.has(subcategory.uuid)) {
        allSlugs.push(subcategory.slug);
      }
    });
  }

  // Эмитим все выбранные слаги (главная + выбранные подкатегории)
  const categorySlugs = allSlugs.join(",");

  console.log("emitCategoriesUpdate:", {
    selectedCategories: Array.from(selectedCategories.value),
    selectedCategory: selectedCategory?.slug,
    selectedSubcategories: subcategoriesSet ? Array.from(subcategoriesSet) : [],
    categorySlugs,
    isEmpty: categorySlugs === "",
  });

  emit("update:category", categorySlugs);
};
</script>
