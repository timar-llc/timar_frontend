import type { IAchievement } from "@/types/achievement.interface";

export const useAchievementsApi = () => {
  const { apiFetch } = useApi();
  const { locale } = useI18n();
  // Получить список достижений
  const getAchievements = async () => {
    const result = await apiFetch<IAchievement[]>(
      `/achievements?lang=${locale.value}`,
      {
        method: "GET",
      }
    );
    return result;
  };

  return {
    getAchievements,
  };
};
