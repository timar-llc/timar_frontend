import type { INews } from "@/types/news.entity";

export const useNewsApi = () => {
  const { apiFetch } = useApi();
  const locale = useI18n().locale.value;

  const getNews = async (params?: { take?: number; skip?: number }) => {
    const result = await apiFetch<INews[]>(`/news`, {
      method: "GET",
      params,
    });
    return result;
  };

  const getNewsById = async (uuid: string) => {
    const result = await apiFetch<INews>(`/news/${uuid}`, {
      method: "GET",
    });
    return result;
  };

  return {
    getNews,
    getNewsById,
  };
};
