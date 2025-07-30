<template>
  <div
    class="flex max-w-[300px] w-full h-full rounded-4xl flex-col dark:text-white text-black p-4 light:border-1 light:border-gray-200 dark:bg-default"
  >
    <div class="flex flex-col gap-6">
      <!-- Тип -->
      <div>
        <p class="font-medium mb-3">{{ t("feed.type.title") }}</p>
        <UTabs
          @update:model-value="onChange"
          :items="[
            { label: t('vacancies_title') },
            { label: t('tasks_title') },
          ]"
          class="w-full"
          color="neutral"
          :default-index="type === 'vacancies' ? 0 : 1"
        />
      </div>

      <!-- Сложность -->
      <div>
        <p class="font-medium mb-3">{{ t("feed.complexity.title") }}</p>
        <UCheckboxGroup
          v-model="complexityValue"
          :items="complexityItems"
          color="neutral"
          @update:model-value="onChangeComplexity"
        />
      </div>

      <!-- Категории -->
      <div>
        <p class="font-medium mb-3">{{ t("feed.categories.title") }}</p>
        <div class="space-y-2">
          <div
            v-for="category in categories"
            :key="category.id"
            class="space-y-1"
          >
            <!-- Основная категория -->
            <div class="flex items-center gap-2">
              <UCheckbox
                :model-value="isCategorySelected(category.id)"
                @update:model-value="
                  (checked: boolean | 'indeterminate') => toggleCategory(category.id, checked === true)
                "
                color="neutral"
              />
              <span class="text-sm font-medium">{{ category.name }}</span>
              <UButton
                v-if="
                  category.subcategories && category.subcategories.length > 0
                "
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-down"
                :class="{
                  'rotate-180': expandedCategories.includes(category.id),
                }"
                @click="toggleCategoryExpansion(category.id)"
              />
            </div>

            <!-- Подкатегории -->
            <div
              v-if="category.subcategories && category.subcategories.length > 0"
              :class="{ hidden: !expandedCategories.includes(category.id) }"
              class="ml-6 space-y-1"
            >
              <div
                v-for="subcategory in category.subcategories"
                :key="subcategory.id"
                class="flex items-center gap-2"
              >
                <UCheckbox
                  :model-value="
                    isSubcategorySelected(category.id, subcategory.id)
                  "
                  @update:model-value="
                    (checked: boolean | 'indeterminate') =>
                      toggleSubcategory(category.id, subcategory.id, checked === true)
                  "
                  color="neutral"
                />
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ subcategory.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Цена -->
      <div>
        <p class="font-medium mb-3">{{ t("feed.price_high.title") }}</p>
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
}>();

const emit = defineEmits<{
  "update:type": [value: "tasks" | "vacancies"];
  "update:complexity": [value: ("easy" | "medium" | "hard")[]];
  "update:categories": [value: ICategory[]];
}>();

// Состояние
const expandedCategories = ref<string[]>([]);
const selectedCategories = ref<Set<string>>(new Set());
const selectedSubcategories = ref<Map<string, Set<string>>>(new Map());

// Тип
const onChange = (value: string | number) => {
  const newType = value === 0 || value === "0" ? "tasks" : "vacancies";
  emit("update:type", newType);
};

const priceValue = ref<number[]>([1000, 100000]);
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
  { label: t("feed.complexity.easy"), value: "easy" },
  { label: t("feed.complexity.medium"), value: "medium" },
  { label: t("feed.complexity.hard"), value: "hard" },
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
  return selectedCategories.value.has(categoryId);
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

  emitCategoriesUpdate();
};

const emitCategoriesUpdate = () => {
  // Создаем объект с выбранными категориями и подкатегориями
  const selectedData = {
    categories: Array.from(selectedCategories.value),
    subcategories: Object.fromEntries(
      Array.from(selectedSubcategories.value.entries()).map(
        ([categoryId, subcategories]) => [categoryId, Array.from(subcategories)]
      )
    ),
  };

  // Здесь можно эмитить обновленные данные
  console.log("Selected categories:", selectedData);
};
</script>
