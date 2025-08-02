<template>
  <div
    class="flex flex-col gap-4 mt-16 rounded-lg bg-card-bg p-6 dark:border-1 dark:border-[#484848]"
  >
    <h3 class="text-lg font-bold">{{ $t("add_task.requirements.title") }}</h3>
    <UForm
      :state="state"
      :schema="schema"
      @submit="onSubmit"
      class="flex flex-col gap-4"
    >
      <UFormField
        :label="$t('add_task.requirements.task_requirements') + '*'"
        name="task_requirements"
      >
        <UTextarea
          v-model="state.task_requirements"
          class="w-full"
          placeholder="Опишите подробно требования к задаче..."
        />
      </UFormField>

      <UFormField
        :label="$t('add_task.requirements.additional_info')"
        name="additional_info"
      >
        <UTextarea
          v-model="state.additional_info"
          class="w-full"
          placeholder="Дополнительная информация, файлы, ссылки..."
        />
      </UFormField>

      <UFormField
        :label="$t('add_task.requirements.contact_preference')"
        name="contact_preference"
      >
        <USelect
          v-model="state.contact_preference"
          :items="contactPreferences"
          placeholder="Выберите предпочтительный способ связи"
          class="w-full"
        />
      </UFormField>

      <UFormField
        :label="$t('add_task.requirements.urgency_level')"
        name="urgency_level"
      >
        <USelect
          v-model="state.urgency_level"
          :items="urgencyLevels"
          placeholder="Выберите срочность"
          class="w-full"
        />
      </UFormField>

   
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
const { t } = useI18n();

const state = ref({
  task_requirements: "",
  additional_info: "",
  contact_preference: "",
  urgency_level: "",
  attachments: [],
});

const contactPreferences = [
  { label: "Чат в приложении", value: "chat" },
  { label: "Email", value: "email" },
  { label: "Телефон", value: "phone" },
  { label: "Telegram", value: "telegram" },
  { label: "WhatsApp", value: "whatsapp" },
];

const urgencyLevels = [
  { label: "Не срочно", value: "low" },
  { label: "Обычная срочность", value: "normal" },
  { label: "Срочно", value: "high" },
  { label: "Очень срочно", value: "urgent" },
];

const schema = z.object({
  task_requirements: z
    .string()
    .min(10, "Требования должны содержать минимум 10 символов"),
  additional_info: z.string().optional(),
  contact_preference: z.string().optional(),
  urgency_level: z.string().optional(),
  attachments: z.array(z.any()).optional(),
});

const onSubmit = (values: any) => {
  console.log("Task requirements submitted:", values);
};
</script>
