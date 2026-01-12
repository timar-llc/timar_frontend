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
    attachments: Array<{
      filename: string;
      mimetype: string;
      content: string;
    }> | null
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
  const handleOrderProcess = (data: {
    offerMessageUuid: string;
    chatUuid?: string;
    chatId?: string;
    orderAccepted: boolean;
    clientUuid: string;
    freelancerUuid: string;
    price: number;
    duration: number;
  }) => {
    console.log("[Socket] order_processing received:", data);
    console.log("[Socket] Current user:", user.value?.uuid);
    console.log("[Socket] Client UUID:", data.clientUuid);
    console.log("[Socket] Freelancer UUID:", data.freelancerUuid);

    // Try to get chatUuid from different possible fields
    const chatUuid = data.chatUuid || data.chatId;

    if (!chatUuid) {
      // If chatUuid is not provided, try to find chat by message
      console.warn(
        `[Socket] chatUuid not provided in order_processing event, trying to find chat by message`
      );
      const allChats = chatsStore.chats;
      for (const chat of allChats) {
        if (chat.messages?.some((msg) => msg.uuid === data.offerMessageUuid)) {
          console.log(
            `[Socket] Found chat ${chat.uuid} by message ${data.offerMessageUuid}`
          );
          const result = chatsStore.updateOfferStatus(
            chat.uuid,
            data.offerMessageUuid,
            data.orderAccepted
          );
          if (result) {
            console.log(
              `[Socket] Successfully updated offer status for message ${data.offerMessageUuid}`
            );
          } else {
            console.error(
              `[Socket] Failed to update offer status for message ${data.offerMessageUuid}`
            );
          }
          return;
        }
      }
      console.error(
        `[Socket] Could not find chat for message ${data.offerMessageUuid}`
      );
      return;
    }

    const result = chatsStore.updateOfferStatus(
      chatUuid,
      data.offerMessageUuid,
      data.orderAccepted
    );

    if (data.orderAccepted) {
      const accepted = chatsStore.markOffersAfterAccept(
        chatUuid,
        data.offerMessageUuid
      );
      if (!accepted) {
        console.error(
          `[Socket] Failed to mark offers after accepting message ${data.offerMessageUuid}`
        );
      }
    } else {
      if (result) {
        console.log(
          `[Socket] Successfully updated offer status for message ${data.offerMessageUuid}`
        );
      } else {
        console.error(
          `[Socket] Failed to update offer status for message ${data.offerMessageUuid}`
        );
      }
    }
  };
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
  onMessage(
    "order_processing",
    (data: {
      offerMessageUuid: string;
      chatUuid?: string;
      chatId?: string;
      orderAccepted: boolean;
      clientUuid: string;
      freelancerUuid: string;
      price: number;
      duration: number;
    }) => {
      console.log("[Socket] order_processing received:", data);
      handleOrderProcess(data);
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

  const handleOrderProcessing = (data: {
    offerMessageUuid: string;
    chatUuid: string;
    content: string;
    orderAccepted: boolean;
    clientUuid: string;
    freelancerUuid: string;
    price: number;
    duration: number;
  }) => {
    send("order_processing", { ...data });
  };

  return {
    handleSendMessage,
    handleTyping,
    handleMarkRead,
    handleOrderProcessing,
    onMessage,
  };
};
