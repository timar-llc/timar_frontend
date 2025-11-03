<template>
  <div
    class="flex bg-card-bg px-4 py-4 items-center justify-between rounded-lg relative overflow-hidden group hover:scale-105 transition-transform duration-200 cursor-pointer w-full"
  >
    <!-- Градиентный фон -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-transparent animate-pulse opacity-100 transition-opacity duration-300"
    ></div>

    <!-- Контент -->
    <div class="flex items-center gap-3 relative z-10">
      <!-- Название категории -->
      <h3 class="text-lg font-medium text-white">{{ props.category.title }}</h3>
    </div>

    <!-- Стрелка -->
    <UIcon
      name="i-lucide-chevron-right"
      class="w-4 h-4 text-white relative z-10"
    />
  </div>
</template>

<script setup lang="ts">
import type { ICategory } from "@/types/category.interface";

const props = defineProps<{
  category: ICategory;
}>();
</script>
