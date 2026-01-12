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
        :label="$t('add_task.basic_info.task_name') + '*'"
        name="task_name"
      >
        <UInput v-model="state.task_name" class="w-full" color="success" />
      </UFormField>
      <UFormField
        :label="$t('add_task.basic_info.task_category') + '*'"
        name="task_category"
      >
        <USelect
          v-model="state.task_category"
          :items="categories.map((c) => ({ label: c.title, value: c.uuid }))"
          :placeholder="$t('add_task.category_help')"
          class="w-full text-left"
        />
      </UFormField>
      <UFormField
        v-if="state.task_category"
        :label="$t('add_task.basic_info.task_subcategory') + '*'"
        name="task_subcategory"
      >
        <USelect
          v-model="state.task_subcategory"
          :items="
            subcategories?.map((s) => ({ label: s.title, value: s.uuid }))
          "
          class="w-full"
        />
      </UFormField>
      <UFormField
        :label="$t('add_task.basic_info.task_budget') + '*'"
        name="task_budget"
      >
        <UButtonGroup>
          <UInput v-model.number="state.task_budget" type="number" />
          <USelect v-model="selectedCurrency" :items="currencies" />
        </UButtonGroup>
      </UFormField>
      <UFormField
        :label="$t('add_task.basic_info.task_deadline') + '*'"
        name="task_deadline"
      >
        <USelectMenu
          v-model="selectedDeadline"
          :items="deadlineList"
          class="w-40"
        />
      </UFormField>
      <UFormField
        :label="$t('add_task.basic_info.task_description') + '*'"
        name="task_description"
      >
        <UTextarea
          v-model="state.task_description"
          class="w-full whitespace-pre-wrap"
          :rows="6"
          :placeholder="$t('add_task.basic_info.task_description_placeholder')"
        />
      </UFormField>
      <UFormField
        :label="$t('add_task.requirements.attachments')"
        name="attachments"
      >
        <!-- Скрытый input для выбора файлов -->
        <input
          ref="fileInput"
          type="file"
          multiple
          class="hidden"
          @change="handleFileSelect"
        />

        <!-- Drag & Drop зона -->
        <div
          class="border-2 border-dashed rounded-lg p-4 text-center transition-colors duration-200 cursor-pointer"
          :class="
            isDragOver
              ? 'border-success bg-success/5 dark:bg-success/10'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          "
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
          @click="openFileDialog"
        >
          <UIcon
            name="material-symbols:upload"
            class="text-2xl mx-auto mb-2"
            :class="isDragOver ? 'text-success' : 'text-gray-400'"
          />
          <p
            class="text-sm mb-2"
            :class="isDragOver ? 'text-success' : 'text-gray-500'"
          >
            {{ $t("add_task.attachments_help") }}
          </p>
          <UButton variant="outline" size="sm" @click.stop="openFileDialog">
            {{ $t("add_task.attachments_select") }}
          </UButton>
        </div>

        <!-- Список загруженных файлов -->
        <div v-if="state.attachments.length > 0" class="mt-4 space-y-2">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ $t("add_task.loaded_files") }} ({{ state.attachments.length }})
          </h4>
          <div class="space-y-2">
            <div
              v-for="(file, index) in state.attachments"
              :key="index"
              class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-file" class="w-4 h-4 text-gray-500" />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ file.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ (file.size / 1024 / 1024).toFixed(2) }} MB
                  </p>
                </div>
              </div>
              <UButton
                variant="ghost"
                size="sm"
                color="error"
                @click="removeFile(index)"
              >
                <UIcon name="i-lucide-x" class="w-4 h-4" />
              </UButton>
            </div>
          </div>
        </div>
      </UFormField>
      <div class="flex justify-end items-center gap-4 pt-4">
        <!-- <UButton
          :disabled="!state.task_name.trim()"
          color="neutral"
          variant="outline"
          size="lg"
          class="transition-colors duration-200"
          @click="onSaveDraft"
        >
          {{ $t("add_task.basic_info.draft") }}
        </UButton> -->
        <UButton
          type="submit"
          color="success"
          variant="solid"
          size="lg"
          trailing-icon="i-lucide-check"
        >
          {{ $t("add_task.basic_info.submit") }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesApi } from "@/composables/api/useCategoryApi";
import type { ICategory } from "@/types/category.interface";
import { useTaskApi } from "@/composables/api/useTaskApi";
import { z } from "zod";
import { formatDuration, getDurationList } from "@/utils/formatDuration";
const { t } = useI18n();

const state = ref({
  task_name: "",
  task_category: "",
  task_subcategory: "",
  task_description: "",
  task_budget: 0,
  task_deadline: 1,
  attachments: [] as File[],
});

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

const deadlineList = getDurationList(t);

// Deadline handling
const selectedDeadline = computed({
  get: () => {
    const found = deadlineList.find(
      (item) => item.value === state.value.task_deadline
    );
    return found || deadlineList[0];
  },
  set: (value: { label: string; value: number }) => {
    state.value.task_deadline = value.value;
  },
});

const { getCategories } = useCategoriesApi();
const { data } = await getCategories();
const { createTask } = useTaskApi();
const categories = computed(
  () =>
    data.value?.filter(
      (c) => c.subcategories && c.subcategories.length > 0
    ) as ICategory[]
);
console.log(state.value);
const { locale } = useI18n();

const subcategories = computed(() => {
  // Добавляем locale в зависимости, чтобы подкатегории обновлялись при смене языка
  const currentLocale = locale.value;
  const cat = categories.value.find((c) => c.uuid == state.value.task_category);
  console.log(
    `Subcategories updated for locale: ${currentLocale}, category: ${state.value.task_category}`
  );
  console.log("Found category:", cat);
  console.log("Subcategories:", cat?.subcategories);
  return cat?.subcategories;
});
console.log(subcategories.value);

// Состояние для drag & drop
const isDragOver = ref(false);
const fileInput = ref<HTMLInputElement>();

watch(
  () => state.value.task_category,
  () => {
    console.log("Category changed to:", state.value.task_category);
  }
);

// Отслеживаем изменение языка и сбрасываем подкатегорию
watch(
  () => locale.value,
  (newLocale, oldLocale) => {
    console.log(`Language changed from ${oldLocale} to ${newLocale}`);
    // Сбрасываем выбранную подкатегорию при смене языка
    state.value.task_subcategory = "";
  }
);

// Функции для обработки файлов
const handleFiles = (files: FileList | File[]) => {
  const fileArray = Array.from(files);
  state.value.attachments.push(...fileArray);
  console.log("Files added:", fileArray);
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  const files = event.dataTransfer?.files;
  if (files) {
    handleFiles(files);
  }
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files) {
    handleFiles(files);
  }
};

const openFileDialog = () => {
  fileInput.value?.click();
};

const removeFile = (index: number) => {
  state.value.attachments.splice(index, 1);
};

// Схема валидации для полной публикации задачи
const fullSchema = z.object({
  task_name: z
    .string()
    .min(1, { message: t("add_task.errors.task_name_required") }),
  task_category: z
    .string()
    .min(1, { message: t("add_task.errors.task_category_required") }),
  task_subcategory: z
    .string()
    .min(1, { message: t("add_task.errors.task_subcategory_required") }),
  task_description: z
    .string()
    .min(1, { message: t("add_task.errors.task_description_required") }),
  task_budget: z
    .number()
    .min(1, { message: t("add_task.errors.task_budget_required") }),
  task_deadline: z
    .number()
    .min(1, { message: t("add_task.errors.task_deadline_required") }),
});

// Схема валидации для черновика (только название обязательно)
const draftSchema = z.object({
  task_name: z
    .string()
    .min(1, { message: t("add_task.errors.task_name_required") }),
  task_category: z.string().optional(),
  task_subcategory: z.string().optional(),
  task_description: z.string().optional(),
  task_budget: z.number().optional(),
  task_deadline: z.number().optional(),
});

// Используем полную схему для основной формы
const schema = fullSchema;

const onSubmit = async (event: any) => {
  // Используем данные из state, а не из event
  const taskData = {
    categoryUuid: state.value.task_subcategory,
    title: state.value.task_name,
    description: state.value.task_description?.trim() || "", // Сохраняем переносы строк
    price: state.value.task_budget,
    duration: state.value.task_deadline,
    isDraft: false,
    files: state.value.attachments,
  };

  const { data, error } = await createTask(taskData);

  if (data.value && !error.value) {
    navigateTo("/feed");
  } else {
    console.error("Error creating task:", error.value);
  }
};

const onSaveDraft = async () => {
  // Валидируем только название для черновика
  const validation = draftSchema.safeParse(state.value);

  if (!validation.success) {
    console.error("Draft validation failed:", validation.error);
    return;
  }

  // Подготавливаем данные для черновика
  const draftData = {
    categoryUuid: state.value.task_subcategory || "",
    title: state.value.task_name,
    description: state.value.task_description?.trim() || "", // Сохраняем переносы строк
    price: state.value.task_budget || 0,
    duration: state.value.task_deadline || 1,
    isDraft: true,
    files: state.value.attachments,
  };

  console.log("Saving draft:", draftData);

  const { data, error } = await createTask(draftData);

  if (data.value && !error.value) {
    console.log("Draft saved successfully");
    // Можно показать уведомление или перенаправить
    navigateTo("/feed");
  } else {
    console.error("Error saving draft:", error.value);
  }
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
