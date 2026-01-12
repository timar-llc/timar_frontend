export const useNotificationApi = () => {
  const { apiFetch } = useApi();
  const locale = useI18n().locale.value;

  const getNotifications = async (params?: {
    take?: number;
    skip?: number;
  }) => {
    return await apiFetch(`/notifications?lang=${locale}`, {
      method: "GET",
      params,
    });
  };

  const updateNotification = async (uuid: string, readedAt: Date) => {
    return await apiFetch(`/notifications/${uuid}`, {
      method: "PATCH",
      body: { readedAt },
    });
  };

  return {
    getNotifications,
    updateNotification,
  };
};
