import { useNotificationsStore } from "@/stores/notifications/useNotificationsStore";
import { useWebSocketIo } from "./useWebSocketIo";

export const useNotificationSocket = () => {
  const { socket, onConnect, onDisconnect, send, onMessage } = useWebSocketIo();
  const notificationsStore = useNotificationsStore();

  onMessage("notification", (data: any) => {
    console.log("[Socket] notification received:", data);

    // Преобразуем данные уведомления
    const created =
      data.createdAt && !isNaN(new Date(data.createdAt).getTime())
        ? new Date(data.createdAt)
        : new Date();

    const notification = {
      id: data.uuid || data.id,
      uuid: data.uuid || data.id,
      title: data.title || "",
      message: data.message || data.description || "",
      type: data.type || "info",
      read: !!(data.read || data.readedAt),
      createdAt: created,
    };

    // Добавляем уведомление в store
    notificationsStore.addNotification(notification);

    // Показываем toast (только на клиенте)
    if (process.client) {
      const toast = useToast();
      const colorMap: Record<string, "error" | "success" | "info" | "warning"> =
        {
          error: "error",
          success: "success",
          warning: "warning",
          info: "info",
        };
      toast.add({
        title: notification.title,
        description: notification.message,
        color: colorMap[notification.type] || "info",
        timeout: 5000,
      });
    }
  });
};
