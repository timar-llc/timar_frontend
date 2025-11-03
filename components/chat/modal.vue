<template>
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to"
  >
    <div
      v-if="chatModalStore.isOpen"
      :style="{
        width: width + 'px',
        height: height + 'px',
        top: y + 'px',
        left: x + 'px',
      }"
      :class="[
        'fixed z-50 rounded-lg shadow-lg dark:border-1 border-[#484848] bg-card-bg flex flex-col modal-container',
      ]"
    >
      <!-- Заголовок -->
      <div
        class="flex justify-between items-center p-4 border-b border-gray-200 cursor-move"
        ref="modalRef"
        @mousedown="onHeaderMouseDown"
      >
        <div class="flex"></div>
        <div class="flex items-center gap-2">
          <!-- Переключатель для маленьких экранов -->
          <button
            v-if="isSmallWidth"
            @click="toggleView"
            class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
            :title="
              currentView === 'chats' ? 'Показать чат' : 'Показать список чатов'
            "
          >
            <UIcon
              :name="
                currentView === 'chats'
                  ? 'material-symbols:chat'
                  : 'material-symbols:list'
              "
              class="text-sm"
            />
          </button>
          <UIcon
            name="material-symbols:close"
            class="cursor-pointer hover:text-gray-600"
            @click="chatModalStore.toggle()"
          />
        </div>
      </div>

      <!-- Контент -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Список чатов -->
        <ChatList
          v-show="!isSmallWidth || currentView === 'chats'"
          :chats="chats"
          :selected-chat="selectedChat"
          :is-small-width="isSmallWidth"
          @select-chat="selectChat"
          @add-chat="addChat"
        />

        <!-- Сам чат -->
        <div
          v-show="!isSmallWidth || currentView === 'chat'"
          :class="['flex flex-col', isSmallWidth ? 'w-full' : 'flex-1']"
        >
          <!-- Заголовок чата -->
          <ChatHeader
            :selected-chat="selectedChat"
            @go-to-chat="goToChatPage"
          />

          <!-- Сообщения -->
          <ChatMessages :selected-chat="selectedChat" />

          <!-- Поле ввода -->
          <ChatInput
            :selected-chat="selectedChat"
            @send-message="sendMessage"
            @voice-message="handleVoiceMessage"
          />
        </div>
      </div>

      <div class="resizer" @mousedown.prevent="startResize"></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useDraggable } from "@vueuse/core";
import { useChatModalStore } from "@/stores/chat/useChatModalStore";
import { useChatApi } from "@/composables/api/useChatApi";
import { useUser } from "@/composables/useUser";
import type { IChat } from "@/types/chat.interface";
import type { IMessage } from "@/types/message.interface";
import { formatMessageTime } from "@/utils/formatMessageTime";
import type { IUser } from "@/types/user.interface";

const modalRef = ref<HTMLElement>();
const chatModalStore = useChatModalStore();
const { getChats, getChatById } = useChatApi();
const { user } = useUser();

const width = ref(600);
const height = ref(500);
const isResizing = ref(false);
const justResized = ref(false);
const currentView = ref<"chats" | "chat">("chats");
const selectedChat = computed({
  get: () => chatModalStore.selectedChat,
  set: (value) => chatModalStore.setSelectedChat(value),
});

// Определяем маленькую ширину
const isSmallWidth = computed(() => width.value < 500);

// Загрузка чатов
const chats = ref<IChat[]>([]);

// Функция для получения собеседника для конкретного чата
const getOutUser = (chat: IChat) => {
  return chat?.user1?.uuid === user.value?.uuid ? chat?.user2 : chat?.user1;
};

// Функция загрузки сообщений для каждого чата
const loadMessagesForAllChats = async (chatsToLoad: IChat[]) => {
  const promises = chatsToLoad.map(async (chat) => {
    try {
      const { data, error } = await getChatById(chat.uuid);
      if (error.value) {
        console.error(`Error loading chat ${chat.uuid}:`, error.value);
        return;
      }
      if (data.value) {
        // Обновляем чат с полными данными включая сообщения
        const fullChat = data.value as IChat;
        // Находим индекс чата в реактивном массиве и обновляем его
        const chatIndex = chats.value.findIndex(
          (c: IChat) => c.uuid === chat.uuid
        );
        if (chatIndex !== -1) {
          // Преобразуем сообщения в правильный формат
          const transformedMessages = (fullChat.messages || []).map(
            (msg: IMessage) => ({
              uuid: msg.uuid || Date.now(),
              content: msg.content || "",
              createdAt: new Date(msg.createdAt || Date.now()),
              metadata: msg.metadata
                ? {
                    price: msg.metadata.price || 0,
                    duration: msg.metadata.duration || 0,
                    payment: "50% предоплата",
                    title: "Индивидуальное предложение",
                  }
                : undefined,
              attachments: msg.attachments || [],
            })
          );

          chats.value[chatIndex].messages = transformedMessages as unknown as IMessage[];
          console.log(
            `Messages loaded for chat ${chat.uuid}:`,
            transformedMessages
          );
        }
      }
    } catch (err) {
      console.error(`Error loading chat ${chat.uuid}:`, err);
    }
  });

  await Promise.all(promises);
};

// Загружаем чаты при открытии модалки
const loadChats = async () => {
  try {
    const { data, error } = await getChats();
    if (error.value) {
      console.error("Error loading chats:", error.value);
      return;
    }
    if (data.value) {
      chats.value = data.value as IChat[];
      console.log("Chats loaded in modal:", data.value);

      // Загружаем сообщения для всех чатов
      await loadMessagesForAllChats(data.value as IChat[]);
    }
  } catch (err) {
    console.error("Error loading chats:", err);
  }
};

// Загружаем чаты при открытии модалки
watch(
  () => chatModalStore.isOpen,
  (isOpen) => {
    if (isOpen) {
      loadChats();
    }
  },
  { immediate: true }
);

// Драггабл с ограничениями
const { x, y, style } = useDraggable(modalRef, {
  initialValue: {
    x: process.client ? window.innerWidth - 650 : 0,
    y: process.client ? window.innerHeight - 550 : 0,
  },

  axis: "both",
  exact: true,
  disabled: computed(() => isResizing.value),

  onMove: ({ x, y }) => {
    // Ограничиваем по горизонтали
    if (x < 0) x = 0;
    if (x > window.innerWidth - width.value)
      x = window.innerWidth - width.value;

    // Ограничиваем по вертикали
    if (y < 0) y = 0;
    if (y > window.innerHeight - height.value)
      y = window.innerHeight - height.value;

    return { x, y };
  },
});

let startX = 0,
  startY = 0,
  startW = 0,
  startH = 0;

function startResize(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();

  isResizing.value = true;
  startX = e.clientX;
  startY = e.clientY;
  startW = width.value;
  startH = height.value;

  window.addEventListener("mousemove", handleResize);
  window.addEventListener("mouseup", stopResize);
}

function handleResize(e: MouseEvent) {
  if (!isResizing.value) return;
  width.value = Math.max(300, startW + (e.clientX - startX));
  height.value = Math.max(200, startH + (e.clientY - startY));
}

function stopResize() {
  window.removeEventListener("mousemove", handleResize);
  window.removeEventListener("mouseup", stopResize);

  isResizing.value = false;
  justResized.value = true;
  requestAnimationFrame(() => {
    setTimeout(() => {
      justResized.value = false;
    }, 0);
  });
}

function onHeaderMouseDown(e: MouseEvent) {
  if (justResized.value) {
    e.stopPropagation();
    return;
  }
  // Драггабл сам обработает событие
}

function toggleView() {
  currentView.value = currentView.value === "chats" ? "chat" : "chats";
}

function selectChat(chat: IChat) {
  selectedChat.value = chat;
  if (isSmallWidth.value) {
    currentView.value = "chat";
  }
}

function addChat() {
  // Логика добавления нового чата
  console.log("Добавить новый чат");
}

function goToChatPage() {
  if (selectedChat.value) {
    // Закрываем модальное окно
    chatModalStore.close();
    // Переходим на страницу чата
    navigateTo(useLocalePath()(`/chats/${selectedChat.value.uuid}`));
  }
}

function sendMessage(text: string) {
  if (!text.trim() || !selectedChat.value) return;

  const message: IMessage = {
    uuid: Date.now().toString(),
    content: text,
    sender: user.value as IUser,
    type: "text" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    readedAt: new Date(),
    deliveredAt: new Date(),
    attachments: [],
    metadata: {},
  };

  selectedChat.value.messages.push(message);
}

function handleVoiceMessage(audioBlob: Blob, duration: number) {
  if (!selectedChat.value) return;

  // Создаем голосовое сообщение
  const message: IMessage = {
    uuid: Date.now().toString(),
    content: "",
    sender: user.value as IUser,
    type: "audio" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    readedAt: new Date(),
    deliveredAt: new Date(),
    attachments: [],
    metadata: {},
  };

  selectedChat.value.messages.push(message);
}
</script>

<style scoped>
.resizer {
  position: absolute;
  width: 16px;
  height: 16px;
  right: 0;
  bottom: 0;
  background: #888;
  cursor: se-resize;
  z-index: 10;
  border-radius: 2px;
}

/* Плавные переходы для модального окна */
.modal-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.modal-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
