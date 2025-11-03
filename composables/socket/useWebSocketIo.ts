import { ref, onUnmounted } from "vue";
import { io, type Socket } from "socket.io-client";
import { useChatsStore } from "@/stores/chat/useChatsStore";
import { useUser } from "@/composables/useUser";

export const useWebSocketIo = (() => {
  let singleton: {
    isConnected: Ref<boolean>;
    socket: Ref<Socket | null>;
    onConnect: (callback: (...args: any[]) => void) => void;
    onDisconnect: (callback: (...args: any[]) => void) => void;
    connect: () => void;
    disconnect: () => void;
    send: (event: string, data: any) => void;
    onMessage: (event: string, callback: (...args: any[]) => void) => void;
  };

  return () => {
    if (singleton) return singleton;

    const { user } = useUser();
    const isConnected = ref(false);
    const socket = ref<Socket | null>(null);
    // типизация callback
    const eventListeners: {
      event: string;
      callback: (...args: any[]) => void;
    }[] = [];

    const onMessage = (event: string, callback: (...args: any[]) => void) => {
      eventListeners.push({ event, callback });
      if (socket.value) {
        socket.value.on(event, callback);
      }
    };
    const onConnect = (callback: (...args: any[]) => void) => {
      return onMessage("connect", callback);
    };
    const onDisconnect = (callback: (...args: any[]) => void) => {
      return onMessage("disconnect", callback);
    };

    const connect = () => {
      try {
        const token = useCookie("access_token").value;
        const config = useRuntimeConfig();
        const socketUrl = config.public.socketUrl || "http://localhost:8081";
        const fullUrl = `${socketUrl}/ws`;

        socket.value = io(fullUrl, {
          auth: { token },
          transports: ["websocket", "polling"],
          timeout: 20000,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          autoConnect: false,
        });

        onConnect(() => {
          console.log("[Socket] Connected to WebSocket");
          isConnected.value = true;
          eventListeners.forEach(({ event, callback }) => {
            socket.value?.on(event, callback);
          });
        });

        onDisconnect((reason) => {
          console.log("[Socket] Disconnected:", reason);
          isConnected.value = false;
        });

        // Явный connect после установки обработчиков
        socket.value.connect();
      } catch (error) {
        console.error("Failed to connect to WebSocket:", error);
      }
    };

    const disconnect = () => {
      socket.value?.disconnect();
      isConnected.value = false;
      if (user.value) user.value.isOnline = false;
    };

    onMessage("user_online_status", (data) => {
      console.log("[Socket] User online status received:", data);
      const chatsStore = useChatsStore();
      chatsStore.chats.forEach((chat) => {
        if (chat.user1?.uuid === data.userUuid)
          chat.user1.isOnline = data.isOnline;
        if (chat.user2?.uuid === data.userUuid)
          chat.user2.isOnline = data.isOnline;
      });
      if (user.value && data.userUuid === user.value.uuid) {
        user.value.isOnline = data.isOnline;
        console.log("[Socket] Updated self user online status:", data.isOnline);
      }
    });

    singleton = {
      isConnected,
      socket: readonly(socket) as Ref<Socket | null>,
      onConnect,
      onDisconnect,
      connect,
      disconnect,
      send: (event: string, data: any) => {
        if (!socket.value || !socket.value.connected) {
          console.warn("[Socket] emit skipped (not connected):", event);
          return;
        }
        socket.value.emit(event, data);
      },
      onMessage,
    };

    onUnmounted(disconnect);
    return singleton;
  };
})();
