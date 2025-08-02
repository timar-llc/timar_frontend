<template>
  <div
    class="flex flex-col gap-4 mt-16 rounded-lg bg-card-bg p-6 dark:border-1 dark:border-[#484848]"
  >
    <h3 class="text-lg font-bold">{{ $t("add_task.basic_info.title") }}</h3>
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
          :items="categories.map((c) => ({ label: c.label, value: c.value }))"
          placeholder="Выберите категорию"
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
            subcategories.map((s) => ({ label: s.label, value: s.value }))
          "
          class="w-full"
        />
      </UFormField>
      <UFormField
        :label="$t('add_task.basic_info.task_budget') + '*'"
        name="task_budget"
      >
        <UButtonGroup>
          <UInput v-model="state.task_budget" type="number"> </UInput>
          <USelectMenu :items="currencies" :default-value="currencies[0]" />
        </UButtonGroup>
      </UFormField>
      <UFormField
        :label="$t('add_task.basic_info.task_deadline') + '*'"
        name="task_deadline"
      >
        <USelectMenu
          :items="deadlineList"
          :default-value="deadlineList[0]"
          :label="formatDeadline(t, state.task_deadline)"
          class="w-40"
        />
      </UFormField>
      <UFormField
        :label="$t('add_task.basic_info.task_description') + '*'"
        name="task_description"
      >
        <UTextarea v-model="state.task_description" class="w-full" />
      </UFormField>
      <UFormField
        :label="$t('add_task.requirements.attachments')"
        name="attachments"
      >
        <div
          class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center"
        >
          <UIcon
            name="material-symbols:upload"
            class="text-2xl mx-auto mb-2 text-gray-400"
          />
          <p class="text-sm text-gray-500 mb-2">
            Перетащите файлы сюда или кликните для выбора
          </p>
          <UButton variant="outline" size="sm"> Выбрать файлы </UButton>
        </div>
      </UFormField>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
const { t } = useI18n();

const state = ref({
  task_name: "",
  task_category: "",
  task_subcategory: "",
  task_description: "",
  task_budget: 0,
  task_deadline: 1,
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

const deadlineList = [
  { label: "1 день", value: 1 },
  { label: "2-3 дня", value: 3 },
  { label: "Неделя", value: 7 },
  { label: "2 недели", value: 14 },
  { label: "Месяц", value: 30 },
  { label: "2 месяца", value: 60 },
  { label: "3 месяца", value: 90 },
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
  {
    label: "Тексты и переводы",
    value: "content",
    subcategories: [
      "Копирайтинг",
      "Рерайтинг",
      "SEO-тексты",
      "Технические тексты",
      "Переводы",
      "Редактирование",
      "Сценарии",
      "Стихи и проза",
    ],
  },
  {
    label: "Маркетинг и реклама",
    value: "marketing",
    subcategories: [
      "SMM",
      "Контекстная реклама",
      "Таргетированная реклама",
      "Email-маркетинг",
      "SEO-продвижение",
      "PR и связи с общественностью",
      "Аналитика и отчеты",
      "Стратегия маркетинга",
    ],
  },
  {
    label: "Администрирование",
    value: "admin",
    subcategories: [
      "Виртуальный помощник",
      "Обработка данных",
      "Ввод данных",
      "Исследования",
      "Планирование",
      "Координация проектов",
      "Техническая поддержка",
      "Модерация",
    ],
  },
];

const subcategories = computed(() => {
  const cat = categories.find((c) => c.value === state.value.task_category);
  return cat ? cat.subcategories.map((s) => ({ label: s, value: s })) : [];
});

const formatDeadline = (t: any, days: number) => {
  const deadline = deadlineList.find((d) => d.value === days);
  return deadline ? deadline.label : "Выберите срок";
};

const schema = z.object({
  task_name: z.string().min(1),
  task_category: z.string().min(1),
  task_subcategory: z.string().min(1),
  task_description: z.string().min(1),
  task_budget: z.number().min(1),
  task_deadline: z.number().min(1),
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
