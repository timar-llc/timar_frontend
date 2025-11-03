import type {
  IJwtResponse,
  ISocialAuthDto,
  IStatusOk,
  SocialProvider,
} from "@/types/common.interface";

export const useAuthApi = () => {
  const { apiFetch } = useApi();

  // Вход
  const login = async (data: { email: string; password: string }) => {
    return await apiFetch<IJwtResponse>("/auth/login", {
      method: "POST",
      body: data,
    });
  };

  const refreshToken = async (refresh_token: string) => {
    return await apiFetch("/auth/refresh", {
      method: "POST",
      body: { refresh_token },
    });
  };

  const loginByPhone = async (data: { phoneNumber: string }) => {
    return await apiFetch<IStatusOk>("/auth/login/phone", {
      method: "POST",
      body: data,
    });
  };

  const confirmPhoneLogin = async (data: {
    phoneNumber: string;
    code: string;
  }) => {
    return await apiFetch<IJwtResponse>("/auth/login/phone/code", {
      method: "POST",
      body: data,
    });
  }; // Регистрация
  const register = async (data: {
    email?: string;
    password: string;
    phoneNumber?: string;
  }) => {
    return await apiFetch<IStatusOk>("/auth/register", {
      method: "POST",
      body: data,
    });
  };

  const confirm = async (
    data: { email?: string; code: string; phoneNumber?: string },
    type: "register" | "reset-password"
  ) => {
    return await apiFetch<IStatusOk>(`/auth/confirm/?type=${type}`, {
      method: "POST",
      body: data,
    });
  };
  const resetPassword = async (data: {
    email?: string;
    phoneNumber?: string;
  }) => {
    return await apiFetch<IStatusOk>("/auth/reset-password", {
      method: "POST",
      body: data,
    });
  };

  const setNewPassword = async (data: {
    email?: string | null;
    phoneNumber?: string | null;
    password: string;
  }) => {
    return await apiFetch<IStatusOk>("/auth/set-new-password", {
      method: "POST",
      body: data,
    });
  };

  const logout = async () => {
    useCookie("access_token").value = null;
    useCookie("refresh_token").value = null;
    navigateTo("/sign-in");
  };

  const socialAuth = async (data: {
    provider: SocialProvider;
    data: ISocialAuthDto;
  }) => {
    return await apiFetch<IJwtResponse>(
      `/auth/social-auth/?provider=${data.provider}`,
      {
        method: "POST",
        body: data.data,
      }
    );
  };

  // Сброс пароля

  // Обновить токен

  return {
    login,
    loginByPhone,
    confirmPhoneLogin,
    register,
    confirm,
    resetPassword,
    setNewPassword,
    socialAuth,
    logout,
    refreshToken,
  };
};
