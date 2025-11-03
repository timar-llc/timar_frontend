import type { UseFetchOptions } from "nuxt/app";

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiUrl;

  const apiFetch = async <T>(url: string, options: UseFetchOptions<T> = {}) => {
    const token = useCookie("access_token");
    const refreshTokenCookie = useCookie("refresh_token");
    let isRefreshing = false;

    // Определяем, нужно ли устанавливать Content-Type
    const isFormData = options.body instanceof FormData;

    const defaults = {
      baseURL: baseURL as string,
      headers: {
        // Устанавливаем Content-Type только если это не FormData
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      },
      onRequest() {
        // Можно добавить логирование или обработку перед запросом
        console.log("API Request:", url);
      },
      async onResponseError({ response }: { response: any }) {
        // Обработка ошибок
        console.error("API Error:", response.status, response._data);

        if (
          response.status === 401 &&
          !isRefreshing &&
          refreshTokenCookie.value
        ) {
          isRefreshing = true;

          try {
            // Пытаемся обновить токен
            const { data, error } = await useFetch("/auth/refresh", {
              baseURL: baseURL as string,
              method: "POST",
              body: { refresh_token: refreshTokenCookie.value },
            });

            if (data.value && !error.value) {
              const response = data.value as any;
              token.value = response.access_token;

              if (response.refresh_token) {
                refreshTokenCookie.value = response.refresh_token;
              }

              // Повторяем исходный запрос с новым токеном
              isRefreshing = false;
              return;
            }
          } catch (err) {
            console.error("Refresh token error:", err);
          }

          // Если обновление не удалось, очищаем токены и перенаправляем
          isRefreshing = false;
          token.value = null;
          refreshTokenCookie.value = null;
          navigateTo("/sign-in");
        } else if (response.status === 401) {
          // Если нет refresh токена, сразу перенаправляем
          token.value = null;
          refreshTokenCookie.value = null;
          navigateTo("/sign-in");
        }
      },
    };

    return useFetch<T>(url, {
      ...defaults,
      ...options,
      headers: {
        ...defaults.headers,
        ...(options.headers || {}),
      },
    } as any);
  };

  return {
    apiFetch,
  };
};
