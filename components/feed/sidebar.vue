<template>
  <div
    class="flex max-w-[300px] w-full mobile:max-w-full h-full rounded-2xl flex-col dark:text-white text-black p-4 light:border-1 light:border-gray-200 bg-card-bg"
  >
    <div class="flex flex-col gap-6">
      <!-- Тип -->
      <div>
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

      <!-- Сложность -->
      <div>
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

      <!-- Категории -->
      <div>
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

      <!-- Цена -->
      <div>
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
}>();

const emit = defineEmits<{
  "update:type": [value: "tasks" | "vacancies"];
  "update:complexity": [value: ("easy" | "medium" | "hard")[]];
  "update:categories": [value: ICategory[]];
  "update:category": [value: string];
  "update:minPrice": [value: number];
  "update:maxPrice": [value: number];
}>();

// Состояние
const expandedCategories = ref<string[]>([]);
const selectedCategories = ref<Set<string>>(new Set());
const selectedSubcategories = ref<Map<string, Set<string>>>(new Map());

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
  if (checked) {
    selectedCategories.value.add(categoryId);
    // Автоматически выбираем все подкатегории
    const category = props.categories.find((cat) => cat.uuid === categoryId);
    if (
      category &&
      category.subcategories &&
      category.subcategories.length > 0
    ) {
      selectedSubcategories.value.set(
        categoryId,
        new Set(category.subcategories.map((sub) => sub.uuid))
      );
    }
    toggleCategoryExpansion(categoryId);
  } else {
    selectedCategories.value.delete(categoryId);
    selectedSubcategories.value.delete(categoryId);
    toggleCategoryExpansion(categoryId);
  }

  emitCategoriesUpdate();
};

const toggleSubcategory = (
  categoryId: string,
  subcategoryId: string,
  checked: boolean
) => {
  if (!selectedSubcategories.value.has(categoryId)) {
    selectedSubcategories.value.set(categoryId, new Set());
  }

  const subcategories = selectedSubcategories.value.get(categoryId)!;

  if (checked) {
    subcategories.add(subcategoryId);
  } else {
    subcategories.delete(subcategoryId);
  }

  // Проверяем состояние подкатегорий
  const category = props.categories.find((cat) => cat.uuid === categoryId);
  if (category && category.subcategories) {
    const allSubcategoryIds = category.subcategories.map((sub) => sub.uuid);
    const selectedSubcategoryIds = Array.from(subcategories);

    // Если все подкатегории выбраны, выбираем главную категорию
    if (allSubcategoryIds.every((id) => selectedSubcategoryIds.includes(id))) {
      selectedCategories.value.add(categoryId);
    } else if (selectedSubcategoryIds.length === 0) {
      // Если не выбрана ни одна подкатегория, снимаем галочку с главной категории
      selectedCategories.value.delete(categoryId);
    }
    // Если выбраны только некоторые подкатегории, оставляем главную категорию как есть
  }

  emitCategoriesUpdate();
};

const emitCategoriesUpdate = () => {
  // Собираем все выбранные слаги (категории + подкатегории)
  const allSelectedSlugs: string[] = [];

  // Добавляем выбранные основные категории
  selectedCategories.value.forEach((categoryUuid) => {
    const category = props.categories.find((cat) => cat.uuid === categoryUuid);
    if (category) {
      allSelectedSlugs.push(category.slug);
    }
  });

  // Добавляем выбранные подкатегории
  selectedSubcategories.value.forEach((subcategories, categoryUuid) => {
    const category = props.categories.find((cat) => cat.uuid === categoryUuid);
    if (category && category.subcategories) {
      subcategories.forEach((subcategoryUuid) => {
        const subcategory = category.subcategories!.find(
          (sub) => sub.uuid === subcategoryUuid
        );
        if (subcategory) {
          allSelectedSlugs.push(subcategory.slug);
        }
      });
    }
  });

  // Эмитим все выбранные слаги как строку с разделителями
  const categorySlugs = allSelectedSlugs.join(",");
  emit("update:category", categorySlugs);

  console.log("Selected category slugs:", categorySlugs);
};
</script>
