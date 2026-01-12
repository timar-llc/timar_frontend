<template>
  <div
    class="dark:bg-black w-screen px-[46px] mobile:px-4 min-h-dvh text-black dark:text-white flex flex-col py-4 bg-white relative mobile:pb-20"
    :key="layoutKey"
  >
    <Header />
    <main class="flex-1 flex flex-col relative z-10">
      <slot />
    </main>
    <Footer />

    <!-- ChatCircle - фиксированная позиция справа внизу -->
    <div v-if="isAuthenticated">
    <div class="fixed bottom-10 right-10 z-10">
        <ChatCircle />
      </div>
      <ChatModal class="z-50" />
    </div>

    <!-- Mobile Bottom Navigation -->
    <MobileBottomNav />
  </div>
</template>

<script setup lang="ts">
// Добавляем ключ для принудительного пересоздания layout при смене авторизации
const { isAuthenticated } = useUser();
const layoutKey = computed(() => {
  // На сервере всегда возвращаем одинаковый ключ, чтобы избежать проблем с гидратацией
  if (process.server) {
    return "server";
  }
  return isAuthenticated.value ? "authenticated" : "guest";
});
</script>
