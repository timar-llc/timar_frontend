<template>
  <div
    class="flex max-w-[300px] w-full h-full rounded-4xl flex-col dark:text-white text-black p-4 light:border-1 light:border-gray-200 dark:bg-default"
  >
    <div class="flex flex-col">
      <p>dasd</p>
      <UTabs :items="types" class="w-full" color="neutral" />
      <p>{{ t("sidebar_complexity") }}</p>
      <UCheckboxGroup v-model="value" :items="items" color="neutral" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CheckboxGroupItem, CheckboxGroupValue, TabsItem } from "@nuxt/ui";

const { t } = useI18n();
const items = ref<CheckboxGroupItem[]>(["Hard", "Medium", "Easy"]);
const value = ref<CheckboxGroupValue[]>(["System"]);
const types = ref<TabsItem[]>([
  {
    label: "Вакансии",
  },
  {
    label: "Задачи",
  },
]);
</script>
