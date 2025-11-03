import { defineStore } from "pinia";
import type { Chat } from "@/types/chat.interface";

export const useChatModalStore = defineStore("chatModal", {
  state: () => ({
    isModalOpen: false,
    selectedChat: null as Chat | null,
  }),

  getters: {
    isOpen: (state) => state.isModalOpen,
  },

  actions: {
    open(chat?: Chat | null) {
      this.isModalOpen = true;
      if (chat) {
        this.selectedChat = chat;
      }
    },

    close() {
      this.isModalOpen = false;
      this.selectedChat = null;
    },

    toggle() {
      this.isModalOpen = !this.isModalOpen;
    },

    setSelectedChat(chat: Chat | null) {
      this.selectedChat = chat;
    },
  },
});
