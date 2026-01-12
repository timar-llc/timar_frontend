<template>
  <div
    class="flex bg-card-bg px-6 py-6 items-center justify-between rounded-2xl border border-gray-200 dark:border-gray-800 relative overflow-hidden group hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer w-full"
    @click="$emit('click')"
  >
    <!-- Градиентный фон -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-blue-500/10 dark:from-purple-500/5 dark:via-pink-500/3 dark:to-blue-500/5 group-hover:opacity-100 opacity-0 transition-opacity duration-300"
    ></div>

    <!-- Контент -->
    <div class="flex items-center gap-4 relative z-10 flex-1">
      <!-- Иконка -->
      <div
        class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
      >
        <UIcon
          name="i-lucide-folder"
          class="w-6 h-6 text-purple-600 dark:text-purple-400"
        />
      </div>
      <!-- Название категории -->
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ category.title }}
      </h3>
    </div>

    <!-- Стрелка -->
    <UIcon
      name="i-lucide-chevron-right"
      class="w-5 h-5 text-gray-400 dark:text-gray-500 relative z-10 group-hover:text-gray-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
    />
  </div>
</template>

<script setup lang="ts">
import type { ICategory } from "@/types/category.interface";

defineProps<{
  category: ICategory;
}>();

defineEmits<{
  click: [];
}>();
</script>
