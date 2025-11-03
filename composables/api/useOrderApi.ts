export const useOrderApi = () => {
  const { apiFetch } = useApi();

  // Получить список заказов
  const getOrders = async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
    sort?: string;
  }) => {
    return await apiFetch("/orders", {
      method: "GET",
      params,
    });
  };

  // Получить заказ по ID
  const getOrderById = async (id: string | number) => {
    return await apiFetch(`/orders/${id}`, {
      method: "GET",
    });
  };

  // Создать заказ
  const createOrder = async (data: {
    title: string;
    description: string;
    category: string;
    budget: number;
    deadline: number;
  }) => {
    return await apiFetch("/orders", {
      method: "POST",
      body: data,
    });
  };

  // Обновить заказ
  const updateOrder = async (id: string | number, data: Partial<any>) => {
    return await apiFetch(`/orders/${id}`, {
      method: "PUT",
      body: data,
    });
  };

  // Удалить заказ
  const deleteOrder = async (id: string | number) => {
    return await apiFetch(`/orders/${id}`, {
      method: "DELETE",
    });
  };

  // Получить отклики на заказ
  const getOrderrespondes = async (orderId: string | number) => {
    return await apiFetch(`/orders/${orderId}/respondes`, {
      method: "GET",
    });
  };

  // Откликнуться на заказ
  const respondToOrder = async (
    orderId: string | number,
    data: {
      message: string;
      proposed_price?: number;
      proposed_deadline?: number;
    }
  ) => {
    return await apiFetch(`/orders/${orderId}/respondes`, {
      method: "POST",
      body: data,
    });
  };

  // Принять отклик
  const acceptResponse = async (
    orderId: string | number,
    responseId: string | number
  ) => {
    return await apiFetch(`/orders/${orderId}/respondes/${responseId}/accept`, {
      method: "POST",
    });
  };

  // Отклонить отклик
  const rejectResponse = async (
    orderId: string | number,
    responseId: string | number
  ) => {
    return await apiFetch(`/orders/${orderId}/respondes/${responseId}/reject`, {
      method: "POST",
    });
  };

  return {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderrespondes,
    respondToOrder,
    acceptResponse,
    rejectResponse,
  };
};
