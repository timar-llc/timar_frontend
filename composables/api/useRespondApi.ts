export const useRespondApi = () => {
  const { apiFetch } = useApi();

  const createRespond = async (data: {
    taskUuid: string;
    duration: number;
    price: number;
    coverLetter: string;
  }) => {
    return await apiFetch("/respondes", {
      method: "POST",
      body: data,
    });
  };
  const getResponds = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }) => {
    return await apiFetch("/respondes", {
      method: "GET",
      params,
    });
  };
  return {
    getResponds,
    createRespond,
  };
};
