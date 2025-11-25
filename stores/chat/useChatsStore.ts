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
        // Use splice to ensure Vue reactivity
        // This creates a new array reference, triggering reactivity
        this.chats.splice(index, 1, updatedChat);
      } else {
        // If chat doesn't exist, add it
        this.chats.push(updatedChat);
      }
    },

    updateMessageReadStatus(
      chatUuid: string,
      messageUuid: string,
      readedAt: Date
    ) {
      const chat = this.getChatById?.(chatUuid);
      if (!chat || !chat.messages || chat.messages.length === 0) {
        console.warn(`[Store] Chat ${chatUuid} has no messages`);
        return false;
      }

      const messageIndex = chat!.messages.findIndex(
        (msg) => msg.uuid === messageUuid
      );
      if (messageIndex === -1) {
        console.warn(
          `[Store] Message ${messageUuid} not found in chat ${chatUuid}`
        );
        return false;
      }

      // Check if already read to avoid unnecessary updates
      const currentMessage = chat.messages[messageIndex];
      if (
        currentMessage.readedAt &&
        currentMessage.readedAt.getTime() === readedAt.getTime()
      ) {
        console.log(
          `[Store] Message ${messageUuid} already marked as read at same time`
        );
        return true;
      }

      // Update message with new reference to ensure Vue reactivity
      const updatedMessage = {
        ...currentMessage,
        readedAt: readedAt,
      };

      // Replace the message in the array, don't add it
      const updatedMessages = chat.messages!.map((msg, idx) => {
        if (idx === messageIndex) {
          return updatedMessage;
        }
        return msg;
      });

      this.updateChat(chatUuid, {
        ...chat,
        messages: updatedMessages,
        updatedAt: new Date(),
      });

      console.log(
        `[Store] Successfully updated message ${messageUuid} read status`
      );
      return true;
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
