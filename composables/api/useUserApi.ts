export const useUserApi = () => {
  const { apiFetch } = useApi();

  // Получить профиль пользователя
  const getUserProfile = async (username: string) => {
    return await apiFetch(`/users/${username}`, {
      method: "GET",
    });
  };

  const getUser = async (uuid: string) => {
    return await apiFetch(`/users/${uuid}`, {
      method: "GET",
    });
  };

  const getCurrentUser = async () => {
    return await apiFetch("/users/me", {
      method: "GET",
    });
  };

  // Обновить профиль
  const updateProfile = async (data: {
    name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    country?: string;
    specialization?: string;
    about?: string;
    profile_photo?: File;
  }) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    return await apiFetch("/users/profile", {
      method: "PUT",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  // Получить статистику пользователя
  const getUserStats = async (userId: string) => {
    return await apiFetch(`/users/${userId}/stats`, {
      method: "GET",
    });
  };

  // Получить навыки пользователя
  const getUserSkills = async (userId: string) => {
    return await apiFetch(`/users/${userId}/skills`, {
      method: "GET",
    });
  };

  // Добавить навык
  const addSkill = async (skill: string) => {
    return await apiFetch("/users/skills", {
      method: "POST",
      body: { skill },
    });
  };

  // Удалить навык
  const deleteSkill = async (skillId: string | number) => {
    return await apiFetch(`/users/skills/${skillId}`, {
      method: "DELETE",
    });
  };

  // Получить достижения пользователя
  const getUserAchievements = async (userId: string) => {
    return await apiFetch(`/users/${userId}/achievements`, {
      method: "GET",
    });
  };

  return {
    getUserProfile,
    updateProfile,
    getUserStats,
    getUserSkills,
    addSkill,
    deleteSkill,
    getUserAchievements,
    getCurrentUser,
    getUser,
  };
};
