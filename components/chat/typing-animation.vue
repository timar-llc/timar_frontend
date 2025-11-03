<template>
  <div class="flex items-center gap-1">
    <span class="text-xs text-gray-500 dark:text-gray-400">Печатает</span>
    <div class="flex items-center gap-1">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Компонент анимированного индикатора печати
</script>

<style scoped>
.typing-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #6b7280; /* gray-500 */
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dot:nth-child(2) {
  animation-delay: -0.16s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes typing {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Темная тема */
.dark .typing-dot {
  background-color: #9ca3af; /* gray-400 */
}
</style>
