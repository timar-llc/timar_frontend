<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
import { useWebSocketIo } from "./composables/socket/useWebSocketIo";

// Добавляем Telegram скрипт
useHead({
  script: [
    {
      src: "https://telegram.org/js/telegram-widget.js",
      async: true,
    },
  ],
});

// Инициализируем пользователя при загрузке приложения
const { init, isAuthenticated, user } = useUser();
const { connect, disconnect } = useWebSocketIo();

// Инициализируем только на клиенте
onMounted(async () => {
  console.log("App mounted, initializing user...");
  await init();
  connect();
});
onUnmounted(() => {
  disconnect();
});

// Принудительно очищаем DOM при смене авторизации (только на клиенте)
if (process.client) {
  watch(isAuthenticated, (newValue, oldValue) => {
    if (oldValue !== undefined && newValue !== oldValue) {
      console.log("Auth state changed, forcing DOM refresh");
      nextTick(() => {
        // Принудительно обновляем страницу при смене авторизации
        if (!newValue) {
          window.location.reload();
        }
      });
    }
  });
}
</script>
