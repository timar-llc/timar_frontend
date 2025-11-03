import { useAuthApi } from "./api/useAuthApi";
import type { IUser } from "@/types/user.interface";
import { useUserApi } from "./api/useUserApi";

export const useUser = () => {
  const user = useState<IUser | null>("user", () => null);
  const loading = useState<boolean>("user_loading", () => false);
  const accessToken = useCookie("access_token");
  const refreshToken = useCookie("refresh_token");
  const { getCurrentUser } = useUserApi();

  // Загрузить данные пользователя
  const fetchUser = async () => {
    if (!accessToken.value) {
      user.value = null;
      return;
    }

    // Если пользователь уже загружен, не загружаем повторно
    if (user.value) {
      return;
    }

    loading.value = true;
    try {
      const { data, error } = await getCurrentUser();
      if (data.value && !error.value) {
        user.value = data.value as IUser;
      } else {
        user.value = null;
        // Если ошибка авторизации, удаляем токен
        if (error.value) {
          accessToken.value = null;
          refreshToken.value = null;
        }
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      user.value = null;
      accessToken.value = null;
      refreshToken.value = null;
    } finally {
      loading.value = false;
    }
  };

  // Войти
  const login = async (credentials: { email: string; password: string }) => {
    const { login: loginApi } = useAuthApi();
    const { data, error } = await loginApi(credentials);

    if (data.value && !error.value) {
      const response = data.value as any;
      accessToken.value = response.access_token;

      // Сохраняем refresh token если он есть
      if (response.refresh_token) {
        refreshToken.value = response.refresh_token;
      }

      await fetchUser();
      return { success: true, data: response };
    }

    return { success: false, error: error.value };
  };

  // Зарегистрироваться
  const register = async (credentials: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) => {
    const { register: registerApi } = useAuthApi();
    const { data, error } = await registerApi(credentials);

    if (data.value && !error.value) {
      const response = data.value as any;
      accessToken.value = response.access_token;

      // Сохраняем refresh token если он есть
      if (response.refresh_token) {
        refreshToken.value = response.refresh_token;
      }

      await fetchUser();
      return { success: true, data: response };
    }

    return { success: false, error: error.value };
  };

  // Выйти
  const logout = async () => {
    const { logout: logoutApi } = useAuthApi();
    await logoutApi();
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
    await navigateTo("/sign-in", { replace: true });
  };

  // Проверить авторизацию
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);

  // Инициализация при монтировании
  const init = async () => {
    // Проверяем, что мы на клиенте
    if (process.client) {
      console.log("Initializing user data on client...");
      console.log("Access token from cookie:", accessToken.value);

      if (accessToken.value && !user.value) {
        console.log("Token found, fetching user data...");
        await fetchUser();
      } else if (!accessToken.value) {
        console.log("No access token found");
        user.value = null;
      }

      console.log("User data after init:", user.value);
    } else {
      console.log("Init called on server, skipping...");
    }
  };

  return {
    user: readonly(user) as Ref<IUser | null>,
    loading: readonly(loading),
    isAuthenticated,
    fetchUser,
    login,
    register,
    logout,
    init,
  };
};
