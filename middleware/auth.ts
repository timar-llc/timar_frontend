export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie("access_token");
    const { user } = useUser();
    const router = useRouter();

    console.log("Auth middleware - Token:", !!token.value);
    console.log("Auth middleware - User:", !!user.value);

    // Если нет токена, редиректим на вход
    if (!token.value) {
      console.log("No token found, redirecting to sign-in");
      // Очищаем состояние пользователя перед редиректом
      return router.push("/sign-in");
    }

    // Если есть токен, но нет данных пользователя, загружаем их
    if (token.value && !user.value) {
      console.log("Token found but no user data, fetching user...");
      const { fetchUser } = useUser();
      fetchUser().then(() => {
        console.log("User data loaded");
      });
    }

    console.log("Token found, allowing access");
});

  // На сервере просто разрешаем доступ, проверка будет на клиенте
