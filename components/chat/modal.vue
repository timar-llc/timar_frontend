<template>
  <div
    v-if="chatModalStore.isOpen"
    :style="{
      width: width + 'px',
      height: height + 'px',
      top: y + 'px',
      left: x + 'px',
    }"
    :class="[
      'fixed z-50 rounded-lg shadow-lg dark:border-1 border-[#484848] bg-card-bg flex flex-col',
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
        <ChatHeader :selected-chat="selectedChat" />

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
</template>

<script setup lang="ts">
import { useDraggable } from "@vueuse/core";
import { useChatModalStore } from "@/stores/chat/useChatModalStore";
import type { Chat, Message } from "@/types/chat.interface";

const modalRef = ref<HTMLElement>();
const chatModalStore = useChatModalStore();

const width = ref(600);
const height = ref(500);
const isResizing = ref(false);
const justResized = ref(false);
const currentView = ref<"chats" | "chat">("chats");
const selectedChat = ref<Chat | null>(null);

// Определяем маленькую ширину
const isSmallWidth = computed(() => width.value < 500);

// Моковые данные для чатов
const chats = ref<Chat[]>([
  {
    id: 1,
    name: "Сергей Горденко",
    lastMessage: "Я щас бабуле позвоню ",
    time: "14:30",
    messages: [
      {
        id: 1,
        text: "Привет, а я не дам тебе кофе!",
        time: "14:30",
        isOwn: false,
      },
      {
        id: 2,
        text: "Ну и пошел ты нахуй!",
        time: "14:32",
        isOwn: true,
      },
      {
        id: 3,
        text: "Я щас бабуле позвоню ",
        time: "14:35",
        isOwn: false,
      },
    ],
  },
  {
    id: 2,
    name: "Миша Антипов",
    lastMessage: "Миш, мне похуй",
    time: "12:15",
    messages: [
      {
        id: 2,
        text: "Я вытирал газелисту ногой седушку",
        time: "12:16",
        isOwn: false,
      },
      {
        id: 2,
        text: "Миш, мне похуй",
        time: "12:16",
        isOwn: true,
      },
    ],
  },
  {
    id: 3,
    name: "Иван Козлов",
    lastMessage: "Встреча в 15:00",
    time: "10:45",
    messages: [
      { id: 1, text: "Встреча в 15:00", time: "10:45", isOwn: false },
      { id: 2, text: "Понял, буду готов", time: "10:50", isOwn: true },
    ],
  },
]);

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

function selectChat(chat: Chat) {
  selectedChat.value = chat;
  if (isSmallWidth.value) {
    currentView.value = "chat";
  }
}

function addChat() {
  // Логика добавления нового чата
  console.log("Добавить новый чат");
}

function sendMessage(text: string) {
  if (!text.trim() || !selectedChat.value) return;

  const message: Message = {
    id: Date.now(),
    text: text,
    time: new Date().toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isOwn: true,
  };

  selectedChat.value.messages.push(message);
  selectedChat.value.lastMessage = text;
  selectedChat.value.time = message.time;
}

function handleVoiceMessage(audioBlob: Blob, duration: number) {
  if (!selectedChat.value) return;

  // Создаем голосовое сообщение
  const message: Message = {
    id: Date.now(),
    text: "", // Пустой текст для голосовых сообщений
    time: new Date().toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isOwn: true,
    audioBlob: audioBlob, // Добавляем аудио данные
    duration: duration, // Добавляем длительность записи
  };

  selectedChat.value.messages.push(message);
  selectedChat.value.lastMessage = "🎤 Голосовое сообщение";
  selectedChat.value.time = message.time;
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
</style>
