import { useChatsStore } from "@/stores/chat/useChatsStore";
import { useWebSocketIo } from "./useWebSocketIo";
import type { IMessage } from "@/types/message.interface";

export const useChatSocket = () => {
  const chatsStore = useChatsStore();
  const { socket, onConnect, onDisconnect, send, onMessage } = useWebSocketIo();

  const handleMessage = (
    message: Partial<IMessage>,
    attachments: any[] | null
  ) => {
    send("message", {
      data: {
        chatUuid: message.chat?.uuid,
        content: message.content,
        senderUuid: message.sender?.uuid,
        replyToUuid: message.replyTo?.uuid,
        metadata: message.metadata ?? {},
        type: message.type,
        attachments,
      },
    });
  };
  const handleTyping = ({
    data,
  }: {
    data: { chatUuid: string; isTyping: boolean; userUuid: string };
  }) => {
    send("typing", data);
  };
  return {
    handleMessage,
    handleTyping,
    onMessage,
  };
};
