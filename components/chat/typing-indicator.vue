<template>
  <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
    <div class="flex space-x-1">
      <div
        class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style="animation-delay: 0ms"
      ></div>
      <div
        class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style="animation-delay: 150ms"
      ></div>
      <div
        class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style="animation-delay: 300ms"
      ></div>
    </div>
    <span> печатает... </span>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out both;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
