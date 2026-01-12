export const useUserApi = () => {
  const { apiFetch } = useApi();

  // Получить профиль пользователя
  const getUserProfile = async (username: string) => {
    return await apiFetch(`/users/${username}`, {
      method: "GET",
    });
  };

  const getUser = async (uuid: string, withStats: boolean = false) => {
    return await apiFetch(`/users/${uuid}`, {
      params: {
        withStats: withStats,
      },
      method: "GET",
    });
  };

  const getCurrentUser = async () => {
    return await apiFetch("/users/me", {
      method: "GET",
    });
  };

  // Обновить профиль
  const updateUser = async (data: {
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    specialization?: string | null;
    cv?: string | null;
    email?: string | null;
    username?: string | null;
    technologies?: string[] | null;
  }) => {
    return await apiFetch("/users/me", {
      method: "PATCH",
      body: data,
    });
  };

  const updateUserAvatar = async (avatar: File | null) => {
    const formData = new FormData();
    if (avatar) {
      formData.append("avatar", avatar);
    } else {
      // For deletion, send empty or null value
      formData.append("avatar", "");
    }

    return await apiFetch("/users/avatar", {
      method: "POST",
      body: formData,
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

  // Получить список исполнителей
  const getFreelancers = async (params?: {
    take?: string;
    skip?: string;
    search?: string;
    minRating?: number;
    maxRating?: number;
    specialization?: string;
    skills?: string;
    orderBy?: "ratingDesc" | "ratingAsc" | "createdAtDesc" | "createdAtAsc";
  }) => {
    return await apiFetch("/users/freelancers", {
      method: "GET",
      params,
    });
  };

  return {
    getUserProfile,
    updateUser,
    updateUserAvatar,
    getUserStats,
    getUserSkills,
    addSkill,
    deleteSkill,
    getUserAchievements,
    getCurrentUser,
    getUser,
    getFreelancers,
  };
};
