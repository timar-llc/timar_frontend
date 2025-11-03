export const useChatApi = () => {
  const { apiFetch } = useApi();

  // Получить список чатов
  const getChats = async () => {
    return await apiFetch("/chats", {
      method: "GET",
    });
  };

  // Получить чат по ID
  const getChatById = async (chatUuid: string | number) => {
    return await apiFetch(`/chats/${chatUuid}`, {
      method: "GET",
    });
  };

  // Создать новый чат
  const createChat = async (data: {
    recipient_id: string | number;
    message?: string;
  }) => {
    return await apiFetch("/chats", {
      method: "POST",
      body: data,
    });
  };

  // Получить сообщения чата
  const getChatMessages = async (
    chatId: string | number,
    params?: {
      page?: number;
      limit?: number;
    }
  ) => {
    return await apiFetch(`/chats/${chatId}/messages`, {
      method: "GET",
      params,
    });
  };

  // Отправить сообщение
  const sendMessage = async (
    chatId: string | number,
    data: {
      text: string;
      audioBlob?: Blob;
      duration?: number;
    }
  ) => {
    const formData = new FormData();
    formData.append("text", data.text);

    if (data.audioBlob) {
      formData.append("audio", data.audioBlob, "voice-message.webm");
      if (data.duration) {
        formData.append("duration", String(data.duration));
      }
    }

    return await apiFetch(`/chats/${chatId}/messages`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  // Удалить сообщение
  const deleteMessage = async (
    chatId: string | number,
    messageId: string | number
  ) => {
    return await apiFetch(`/chats/${chatId}/messages/${messageId}`, {
      method: "DELETE",
    });
  };

  // Пометить сообщения как прочитанные
  const markAsRead = async (chatId: string | number) => {
    return await apiFetch(`/chats/${chatId}/read`, {
      method: "POST",
    });
  };

  return {
    getChats,
    getChatById,
    createChat,
    getChatMessages,
    sendMessage,
    deleteMessage,
    markAsRead,
  };
};
