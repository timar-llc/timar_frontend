<template>
  <div
    class="flex max-w-[300px] w-full h-full rounded-4xl flex-col dark:text-white text-black p-4 light:border-1 light:border-gray-200 dark:bg-default"
  >
    <div class="flex flex-col">
      <p>dasd</p>
      <UTabs
        @update:model-value="onChange"
        :items="[{ label: t('vacancies_title') }, { label: t('tasks_title') }]"
        class="w-full"
        color="neutral"
        :default-index="type === 'vacancies' ? 0 : 1"
      />
      <p>{{ t("sidebar_complexity") }}</p>
      <UCheckboxGroup
        v-model="value"
        :items="items"
        color="neutral"
        @update:model-value="onChangeComplexity"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CheckboxGroupItem, CheckboxGroupValue } from "@nuxt/ui";

const { t } = useI18n();
const props = defineProps<{
  type: "vacancies" | "tasks";
  complexity: ("easy" | "medium" | "hard")[];
}>();

const emit = defineEmits<{
  "update:type": [value: "vacancies" | "tasks"];
  "update:complexity": [value: ("easy" | "medium" | "hard")[]];
}>();

const onChange = (value: string | number) => {
  const newType = value === 0 || value === "0" ? "vacancies" : "tasks";
  emit("update:type", newType);
};

const onChangeComplexity = (value: any[]) => {
  const complexityValues = value
    .filter((v) => typeof v === "string")
    .map((v) => {
      if (v === "Easy") return "easy";
      if (v === "Medium") return "medium";
      if (v === "Hard") return "hard";
      return "easy";
    }) as ("easy" | "medium" | "hard")[];

  emit("update:complexity", complexityValues);
};

const items = ref<CheckboxGroupItem[]>(["Hard", "Medium", "Easy"]);
const value = ref<CheckboxGroupValue[]>(
  props.complexity.map((c) => {
    if (c === "easy") return "Easy";
    if (c === "medium") return "Medium";
    if (c === "hard") return "Hard";
    return "Easy";
  })
);

// Синхронизируем value с props.complexity
watch(
  () => props.complexity,
  (newComplexity) => {
    value.value = newComplexity.map((c) => {
      if (c === "easy") return "Easy";
      if (c === "medium") return "Medium";
      if (c === "hard") return "Hard";
      return "Easy";
    });
  },
  { immediate: true }
);
</script>
