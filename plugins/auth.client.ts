import { useUser } from "@/composables/useUser";

export default defineNuxtPlugin(async () => {
  const { init } = useUser();

  // Инициализируем пользователя при загрузке приложения
  await init();
});
