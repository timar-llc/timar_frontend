import { defineStore } from "pinia";
import type { IChat } from "@/types/chat.interface";

export const useChatsStore = defineStore("chats", {
  state: () => ({
    chats: [] as IChat[],
    isLoading: false,
    error: null as string | null,
    lastLoaded: null as Date | null,
  }),

  getters: {
    getChatById: (state) => (uuid: string) => {
      return state.chats.find((chat) => chat.uuid === uuid);
    },

    hasData: (state) => {
      return state.chats.length > 0 && state.lastLoaded !== null;
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
    setChats(chats: IChat[]) {
      this.chats = chats;
      this.lastLoaded = new Date();
      this.error = null;
    },

    updateChat(chatUuid: string, updatedChat: IChat) {
      const index = this.chats.findIndex((chat) => chat.uuid === chatUuid);
      if (index !== -1) {
        this.chats[index] = updatedChat;
      }
    },

    addChat(chat: IChat) {
      this.chats.unshift(chat);
    },

    setLoading(loading: boolean) {
      this.isLoading = loading;
    },

    setError(error: string | null) {
      this.error = error;
    },

    clearChats() {
      this.chats = [];
      this.lastLoaded = null;
      this.error = null;
    },
  },
});
