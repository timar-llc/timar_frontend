import { defineStore } from "pinia";

export const useChatModalStore = defineStore("chatModal", {
  state: () => ({
    isModalOpen: false,
  }),

  getters: {
    isOpen: (state) => state.isModalOpen,
  },

  actions: {
    open() {
      this.isModalOpen = true;
    },

    close() {
      this.isModalOpen = false;
    },

    toggle() {
      this.isModalOpen = !this.isModalOpen;
    },
  },
});
