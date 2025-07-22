<template>
  <div
    class="flex flex-col gap-4 justify-center bg-card-bg w-full items-center py-4 rounded-[8px] dark:border-1 border-[#484848]"
  >
    <h3 class="text-2xl font-bold text-green-lead">{{ value }}</h3>
    <h4 class="text-sm">
      {{ t(title) }}
      {{ title === "satisfied_clients_card" ? "%" : "" }}
      {{ title === "total_income_card" ? "₽" : "" }}
    </h4>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

defineProps<{
  title: string;
  value: string;
}>();
</script>
