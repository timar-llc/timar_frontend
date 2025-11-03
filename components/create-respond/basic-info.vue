<template>
  <div
    class="flex flex-col gap-4 rounded-2xl bg-card-bg p-6 dark:border-1 dark:border-[#484848]"
  >
    <h3 class="text-lg font-bold">{{ $t("add_respond.basic_info.title") }}</h3>
    <UForm
      :state="state"
      :schema="schema"
      @submit="onSubmit"
      class="flex flex-col gap-4"
    >
      <UFormField
        :label="$t('add_respond.basic_info.price') + '*'"
        name="price"
      >
        <UButtonGroup>
          <UInput v-model="state.price" type="number"> </UInput>
          <USelectMenu :items="currencies" :default-value="currencies[0]" />
        </UButtonGroup>
      </UFormField>
      <UFormField
        :label="$t('add_respond.basic_info.duration') + '*'"
        name="duration"
      >
        <USelectMenu
          :items="durationList"
          :default-value="durationList[0]"
          :label="formatDuration(t, state.duration)"
          class="w-40"
        />
      </UFormField>
      <UFormField
        :label="$t('add_respond.basic_info.cover_letter') + '*'"
        name="cover_letter"
      >
        <UTextarea v-model="state.cover_letter" class="w-full" />
      </UFormField>

      <UButton type="submit" color="success" class="w-full justify-center">{{
        $t("add_respond.basic_info.submit")
      }}</UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesApi } from "@/composables/api/useCategoryApi";
import type { ICategory } from "@/types/category.interface";
import { useRespondApi } from "@/composables/api/useRespondApi";
import { z } from "zod";
import { formatDuration, getDurationList } from "@/utils/formatDuration";
import type { ITask } from "@/types/task.interface";
const { t } = useI18n();

const props = defineProps<{
  task: ITask;
}>();

const state = ref({
  price: 0,
  duration: 1,
  cover_letter: "",
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

const durationList = getDurationList(t);

const { createRespond } = useRespondApi();

// Схема валидации для полной публикации задачи
const fullSchema = z.object({
  price: z.number().min(1, { message: t("add_respond.errors.price_required") }),
  duration: z
    .number()
    .min(1, { message: t("add_respond.errors.duration_required") }),
  cover_letter: z
    .string()
    .min(1, { message: t("add_respond.errors.cover_letter_required") }),
});

// Используем полную схему для основной формы
const schema = fullSchema;

const onSubmit = async (event: any) => {
  // Используем данные из state, а не из event
  const { data, error } = await createRespond({
    taskUuid: props.task.uuid,
    duration: state.value.duration,
    price: Number(state.value.price),
    coverLetter: state.value.cover_letter,
  });

  if (data.value && !error.value) {
    navigateTo("/feed");
  } else {
    console.error("Error creating task:", error.value);
  }
};
</script>
