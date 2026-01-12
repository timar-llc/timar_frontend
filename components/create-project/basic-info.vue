<template>
  <div
    class="flex flex-col gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/70 p-6 shadow-sm"
  >
    <UForm
      :state="state"
      :schema="schema"
      @submit="onSubmit"
      class="flex flex-col gap-4"
    >
      <UFormField
        :label="$t('add_project.basic_info.project_name') + '*'"
        name="title"
      >
        <UInput v-model="state.title" class="w-full" color="success" />
      </UFormField>
      <UFormField
        :label="$t('add_project.basic_info.project_category') + '*'"
        name="categoryUuid"
      >
        <USelect
          v-model="state.categoryUuid"
          :items="categoryOptions"
          :loading="isLoadingCategories"
          placeholder="Выберите категорию"
          class="w-full text-left"
        />
      </UFormField>
      <UFormField
        v-if="state.categoryUuid && subcategoryOptions.length > 0"
        :label="$t('add_project.basic_info.project_subcategory') + '*'"
        name="subcategoryUuid"
      >
        <USelect
          v-model="state.subcategoryUuid"
          :items="subcategoryOptions"
          placeholder="Выберите подкатегорию"
          class="w-full"
        />
      </UFormField>
      <UFormField
        :label="$t('add_project.basic_info.project_price') + '*'"
        name="price"
      >
        <UButtonGroup>
          <UInput v-model.number="state.price" type="number" />
          <USelect v-model="selectedCurrency" :items="currencies" />
        </UButtonGroup>
      </UFormField>
      <UFormField
        :label="$t('add_project.basic_info.project_duration') + '*'"
        name="duration"
      >
        <USelectMenu
          v-model="selectedDuration"
          :items="durationList"
          class="w-40"
        />
      </UFormField>
      <UFormField
        :label="$t('add_project.basic_info.project_description') + '*'"
        name="description"
      >
        <UTextarea v-model="state.description" class="w-full" />
      </UFormField>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { formatDuration, getDurationList } from "@/utils/formatDuration";
import { z } from "zod";
import { useCreateProjectState } from "@/composables/useCreateProjectState";
import { useCategoriesApi } from "@/composables/api/useCategoryApi";
import type { ICategory } from "@/types/category.interface";

const { t } = useI18n();
const { state } = useCreateProjectState();
const { getCategories } = useCategoriesApi();
const durationList = getDurationList(t);

const categories = ref<ICategory[]>([]);
const isLoadingCategories = ref(false);

// Load categories on mount
onMounted(async () => {
  isLoadingCategories.value = true;
  try {
    const response = await getCategories();
    if (response.data.value) {
      categories.value = response.data.value.filter(
        (cat) => cat.subcategories && cat.subcategories.length > 0
      );
    }
  } catch (error) {
    console.error("Error loading categories:", error);
  } finally {
    isLoadingCategories.value = false;
  }
});

const categoryOptions = computed(() =>
  categories.value.map((cat) => ({ label: cat.title, value: cat.uuid }))
);

const subcategories = computed(() => {
  const selectedCategory = categories.value.find(
    (cat) => cat.uuid === state.value.categoryUuid
  );
  return selectedCategory?.subcategories || [];
});

const subcategoryOptions = computed(() =>
  subcategories.value.map((sub) => ({ label: sub.title, value: sub.uuid }))
);

// Reset subcategory when category changes
watch(
  () => state.value.categoryUuid,
  () => {
    state.value.subcategoryUuid = undefined;
  }
);

const selectedCurrency = ref("RUB");

const currencies = [
  {
    label: "₽",
    value: "RUB",
  },
  {
    label: "$",
    value: "USD",
    disabled: true,
  },
];

// Duration handling
const selectedDuration = computed({
  get: () => {
    const found = durationList.find(
      (item) => item.value === state.value.duration
    );
    return found || durationList[0];
  },
  set: (value: { label: string; value: number }) => {
    state.value.duration = value.value;
  },
});

const schema = z
  .object({
    title: z.string().min(1),
    subcategoryUuid: z.string().min(1),
    price: z.number().min(1),
    duration: z.number().min(1),
    description: z.string().min(1),
  })
  .refine(
    (data) => {
      // Ensure subcategory is selected
      return !!state.value.subcategoryUuid;
    },
    {
      message: "Please select a subcategory",
      path: ["subcategoryUuid"],
    }
  );

const onSubmit = (values: any) => {
  console.log("Form submitted:", values);
};
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
:deep(input[type="number"])::-webkit-outer-spin-button,
:deep(input[type="number"])::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
:deep(input[type="number"]) {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
