<template>
  <div
    class="flex flex-col gap-4 rounded-lg bg-card-bg p-6 dark:border-1 dark:border-[#484848]"
  >
    <h3 class="text-lg font-bold">{{ $t("add_project.basic_info.title") }}</h3>
    <UForm
      :state="state"
      :schema="schema"
      @submit="onSubmit"
      class="flex flex-col gap-4"
    >
      <UFormField
        :label="$t('add_project.basic_info.project_name') + '*'"
        name="project_name"
      >
        <UInput v-model="state.project_name" class="w-full" color="success" />
      </UFormField>
      <UFormField
        :label="$t('add_project.basic_info.project_category') + '*'"
        name="project_category"
      >
        <USelect
          v-model="state.project_category"
          :items="categories.map((c) => ({ label: c.label, value: c.value }))"
          placeholder="Выберите категорию"
          class="w-full text-left"
        />
      </UFormField>
      <UFormField
        v-if="state.project_category"
        :label="$t('add_project.basic_info.project_subcategory') + '*'"
        name="project_subcategory"
      >
        <USelect
          v-model="state.project_subcategory"
          :items="
            subcategories.map((s) => ({ label: s.label, value: s.value }))
          "
          class="w-full"
        />
      </UFormField>
      <UFormField
        :label="$t('add_project.basic_info.project_price') + '*'"
        name="project_price"
      >
        <UButtonGroup>
          <UInput v-model="state.project_price" type="number"> </UInput>

          <USelectMenu :items="currencies" :default-value="currencies[0]" />
        </UButtonGroup>
      </UFormField>
      <UFormField
        :label="$t('add_project.basic_info.project_duration') + '*'"
        name="project_duration"
      >
        <USelectMenu
          :items="durationList"
          :default-value="durationList[0]"
          :label="formatDuration(t, state.project_duration)"
          class="w-40"
        />
      </UFormField>
      <UFormField
        :label="$t('add_project.basic_info.project_description') + '*'"
        name="project_description"
      >
        <UTextarea v-model="state.project_description" class="w-full" />
      </UFormField>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import {
  formatDuration,
  getDurationList,
} from "@/utils/project/formatDuration";
import { z } from "zod";
const { t } = useI18n();
const durationList = getDurationList(t);
const state = ref({
  project_name: "",
  project_category: "",
  project_subcategory: "",
  project_description: "",
  project_price: 0,
  project_duration: 1,
});

const currencies = [
  {
    label: "₽",
    value: "RUB",
  },
  {
    label: "$",
    value: "USD",
  },
];
const categories = [
  {
    label: "Разработка и IT",
    value: "dev",
    subcategories: [
      "Веб-разработка (Frontend / Backend / Fullstack)",
      "Мобильная разработка (iOS / Android / Flutter)",
      "Разработка игр",
      "DevOps и инфраструктура",
      "Тестирование и QA",
      "Сайты на конструкторах (Tilda, Wix, Webflow)",
      "CMS (WordPress, Joomla, Drupal и др.)",
      "Скрипты / автоматизация",
      "Боты и парсеры",
      "Telegram/VK/Discord боты",
      "AI/ML проекты",
      "Работа с API",
    ],
  },
  {
    label: "Дизайн и креатив",
    value: "design",
    subcategories: [
      "Веб-дизайн",
      "UI/UX-дизайн",
      "Дизайн мобильных приложений",
      "Графический дизайн",
      "Логотипы и брендинг",
      "Иллюстрации",
      "3D-дизайн и моделирование",
      "Презентации",
      "Motion-дизайн / Анимация",
      "Figma-дизайн",
    ],
  },
  // ... остальные категории по аналогии
];

const subcategories = computed(() => {
  const cat = categories.find((c) => c.value === state.value.project_category);
  return cat ? cat.subcategories.map((s) => ({ label: s, value: s })) : [];
});

const schema = z.object({
  project_name: z.string().min(1),
  project_category: z.string().min(1),
  project_subcategory: z.string().min(1),
  project_description: z.string().min(1),
  project_price: z.number().min(1),
  project_duration: z.number().min(1),
});
const onSubmit = (values: any) => {
  console.log(values);
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
}
</style>
