import { defineStore } from "pinia";
import type { INotification } from "@/types/notification.interface";

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    notifications: [] as INotification[],
    isLoading: false,
    error: null as string | null,
    lastLoaded: null as Date | null,
  }),

  getters: {
    unreadCount: (state) => {
      return state.notifications.filter((n) => !n.readedAt).length;
    },

    readCount: (state) => {
      return state.notifications.filter((n) => n.readedAt).length;
    },

    hasData: (state) => {
      return state.notifications.length > 0 && state.lastLoaded !== null;
    },

    isDataFresh: (state) => {
      if (!state.lastLoaded) return false;
      const now = new Date();
      const diffInMinutes =
        (now.getTime() - state.lastLoaded.getTime()) / (1000 * 60);
      return diffInMinutes < 5; // Данные считаются свежими 5 минут
    },
  },

  actions: {
    setNotifications(notifications: INotification[]) {
      this.notifications = notifications;
      this.lastLoaded = new Date();
      this.error = null;
    },

    addNotification(notification: INotification) {
      // Проверяем, нет ли уже такого уведомления
      const exists = this.notifications.find(
        (n) => n.uuid === notification.uuid
      );
      if (!exists) {
        // Добавляем в начало списка
        this.notifications.unshift(notification);
      }
    },

    updateNotification(
      uuid: string,
      updatedNotification: Partial<INotification>
    ) {
      const index = this.notifications.findIndex((n) => n.uuid === uuid);
      if (index !== -1) {
        this.notifications[index] = {
          ...this.notifications[index],
          ...updatedNotification,
        };
      }
    },

    markAsRead(uuid: string) {
      const notification = this.notifications.find((n) => n.uuid === uuid);
      if (notification) {
        notification.readedAt = new Date();
      }
    },

    markAllAsRead() {
      this.notifications.forEach((notification) => {
        notification.readedAt = new Date();
      });
    },

    setLoading(loading: boolean) {
      this.isLoading = loading;
    },

    setError(error: string | null) {
      this.error = error;
    },

    clearNotifications() {
      this.notifications = [];
      this.lastLoaded = null;
      this.error = null;
    },
  },
});
