import { useChatsStore } from "@/stores/chat/useChatsStore";
import { useWebSocketIo } from "./useWebSocketIo";
import type { IMessage } from "@/types/message.interface";
import type { IChat } from "@/types/chat.interface";
import { useUser } from "@/composables/useUser";

export const useChatSocket = () => {
  const chatsStore = useChatsStore();
  const { socket, onConnect, onDisconnect, send, onMessage } = useWebSocketIo();
  const { user } = useUser();

  const handleSendMessage = (
    data: {
      chatUuid: string;
      messageUuid: string;
      content: string;
      senderUuid: string;
      replyToUuid?: string;
      metadata?: Record<string, any>;
      type: "text" | "offer" | "audio";
    },
    attachments: any[] | null
  ) => {
    send("message", {
      ...data,
      attachments,
    });
  };

  const appendMessageToChat = (chatUuid: string, message: IMessage) => {
    const chat =
      chatsStore.getChatById?.(chatUuid) ||
      chatsStore.chats.find((c) => c.uuid === chatUuid);

    if (!chat) return;

    const exists = (chat.messages || []).some(
      (msg) => msg.uuid === message.uuid
    );
    if (exists) return;

    const updatedChat: IChat = {
      ...chat,
      messages: [...(chat.messages || []), message],
      updatedAt: message.createdAt,
    };

    chatsStore.updateChat(chatUuid, updatedChat);
  };

  onMessage(
    "message_received",
    (
      incoming: IMessage & {
        chatUuid?: string;
        chatId?: string;
        senderUuid?: string;
        sender_id?: string;
      }
    ) => {
      if (!incoming) return;
      const senderUuid =
        incoming.sender?.uuid ||
        incoming.senderUuid ||
        incoming.sender_id ||
        (incoming.sender as any)?.id;

      if (senderUuid && senderUuid === user.value?.uuid) {
        return;
      }

      const chatUuid =
        incoming.chat?.uuid || incoming.chatUuid || incoming.chatId;
      if (!chatUuid) return;

      appendMessageToChat(chatUuid, incoming);
    }
  );

  const handleMessageRead = (data: {
    messageUuid?: string;
    chatUuid?: string;
    timestamp: string;
  }) => {
    console.log("[Socket] message_read received:", data);

    // Support both messageUuid and messageId for compatibility
    if (!data.messageUuid) return;

    // Find the chat that contains this message
    const chat = chatsStore.getChatById?.(data.chatUuid as string);
    if (!chat) {
      console.warn(
        `[Socket] message_read: chat not found for message ${data.messageUuid}`
      );
      return;
    }
    chatsStore.updateMessageReadStatus(
      chat.uuid,
      data.messageUuid,
      new Date(data.timestamp)
    );
  };

  // Handle message_status event

  // Also handle alternative event names that might be sent by the server
  onMessage(
    "message_read",
    (data: { messageUuid?: string; chatUuid?: string; timestamp: string }) => {
      console.log("[Socket] message_read received:", data);
      handleMessageRead({
        messageUuid: data.messageUuid,
        chatUuid: data.chatUuid,
        timestamp: data.timestamp,
      });
    }
  );

  const handleTyping = ({
    data,
  }: {
    data: { chatUuid: string; isTyping: boolean; userUuid: string };
  }) => {
    send("typing", data);
  };

  const handleMarkRead = (data: {
    chatUuid: string;
    messageUuid: string;
    timestamp: string;
  }) => {
    send("message_read", { ...data });
  };

  return {
    handleSendMessage,
    handleTyping,
    handleMarkRead,
    onMessage,
  };
};
