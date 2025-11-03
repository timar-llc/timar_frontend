export const useMessageApi = () => {
  const { apiFetch } = useApi();

  const getMessages = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }) => {
    return await apiFetch("/messages", {
      method: "GET",
      params,
    });
  };

  const sendOfferMessage = async (data: {
    chatUuid?: string;
    userUuid?: string;
    price: number;
    duration: number;
    content: string;
  }) => {
    return await apiFetch("/messages/offer", {
      method: "POST",
      body: data,
    });
  };

  return {
    getMessages,
    sendOfferMessage,
  };
};
