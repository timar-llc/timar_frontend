<template>
  <div class="relative emoji-picker">
    <button
      @click="togglePicker"
      type="button"
      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      :class="{ 'bg-gray-100 dark:bg-gray-700': isOpen }"
    >
      😊
    </button>

    <!-- Эмодзи панель -->
    <div
      v-if="isOpen"
      class="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-10"
    >
      <!-- Список эмодзи -->
      <div class="flex gap-2">
        <button
          v-for="emoji in emojis"
          :key="emoji"
          @click="selectEmoji(emoji)"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-lg transition-colors"
        >
          {{ emoji }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false);

const emit = defineEmits<{
  selectEmoji: [emoji: string];
}>();

// 10 базовых эмодзи
const emojis = ["😀", "😍", "😂", "😎", "🤔", "👍", "❤️", "🎉", "🔥", "✨"];

function togglePicker() {
  isOpen.value = !isOpen.value;
}

function selectEmoji(emoji: string) {
  emit("selectEmoji", emoji);
  isOpen.value = false;
}

// Закрытие пикера при клике вне его
onMounted(() => {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".emoji-picker")) {
      isOpen.value = false;
    }
  });
});
</script>

<style scoped>
.emoji-picker {
  position: relative;
}
</style>
