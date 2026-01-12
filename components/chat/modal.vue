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
      ref="modalElement"
      :style="{
        width: width + 'px',
        height: height + 'px',
        transform: `translate(${x}px, ${y}px)`,
        top: '0',
        left: '0',
      }"
      :class="[
        'fixed z-50 rounded-lg shadow-lg dark:border-1 border-[#484848] bg-card-bg flex flex-col modal-container',
        isDragging ? 'select-none dragging' : '',
        isResizing ? 'dragging' : '',
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
        <!-- Sidebar с чатами -->
        <div
          v-show="!isSmallWidth || currentView === 'chats'"
          class="w-64 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
        >
          <ChatSidebar :on-select-chat="handleSelectChat" />
        </div>

        <!-- Сам чат -->
        <div
          v-show="!isSmallWidth || currentView === 'chat'"
          :class="['flex flex-col', isSmallWidth ? 'w-full' : 'flex-1']"
        >
          <template v-if="selectedChat">
            <!-- Заголовок чата -->
            <ChatHeader
              :out-user="getOutUser(selectedChat) || null"
              :chat="selectedChat"
              :is-modal="true"
            />

            <!-- Сообщения -->
            <ChatMessages :chat="selectedChat" />

            <!-- Поле ввода -->
            <ChatInput :chat="selectedChat" />
          </template>
          <!-- Placeholder для выбора чата -->
          <div v-else class="flex-1 flex items-center justify-center p-6">
            <div class="text-center">
              <div
                class="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-7 h-7"
                >
                  <path
                    d="M2.25 12a9.75 9.75 0 1 1 19.5 0 9.75 9.75 0 0 1-19.5 0Zm9.53-5.28a.75.75 0 0 0-1.06 1.06L12.44 10.5H7.5a.75.75 0 0 0 0 1.5h4.94l-1.72 2.72a.75.75 0 1 0 1.26.82l3-4.75a.75.75 0 0 0 0-.82l-3-4.75Z"
                  />
                </svg>
              </div>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t("chat.select_chat") }}
              </p>
              <p class="text-sm text-gray-500 mt-1">
                {{ t("chat.select_chat") }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="resizer" @mousedown.prevent="startResize"></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useDraggable } from "@vueuse/core";
import { useChatModalStore } from "@/stores/chat/useChatModalStore";
import { useUser } from "@/composables/useUser";
import type { IChat } from "@/types/chat.interface";
import type { IMessage } from "@/types/message.interface";
import type { IUser } from "@/types/user.interface";
import ChatHeader from "@/components/chat/chat-header.vue";
import ChatMessages from "@/components/chat/chat-messages.vue";
import ChatInput from "@/components/chat/chat-input.vue";
import ChatSidebar from "@/components/chat/sidebar.vue";
import { useChatApi } from "@/composables/api/useChatApi";

const modalRef = ref<HTMLElement>();
const chatModalStore = useChatModalStore();
const { getChats, getChatById } = useChatApi();
const { user } = useUser();
const { t } = useI18n();

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

// Функция для получения собеседника для конкретного чата
const getOutUser = (chat: IChat) => {
  return chat?.user1?.uuid === user.value?.uuid ? chat?.user2 : chat?.user1;
};

// Позиция модального окна
const x = ref(process.client ? window.innerWidth - 650 : 0);
const y = ref(process.client ? window.innerHeight - 550 : 0);
const isDragging = ref(false);
const modalElement = ref<HTMLElement | null>(null);
let dragStartX = 0;
let dragStartY = 0;
let initialX = 0;
let initialY = 0;

// Обработка перетаскивания
function onHeaderMouseDown(e: MouseEvent) {
  if (justResized.value || isResizing.value) {
    e.stopPropagation();
    return;
  }

  // Разрешаем перетаскивание только если клик не на кнопках
  const target = e.target as HTMLElement;
  if (
    target.closest("button") ||
    target.closest('[role="button"]') ||
    target.closest("svg") ||
    target.closest("UIcon")
  ) {
    return;
  }

  isDragging.value = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  initialX = x.value;
  initialY = y.value;

  document.addEventListener("mousemove", onMouseMove, { passive: false });
  document.addEventListener("mouseup", onMouseUp);
  e.preventDefault();
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value) return;
  e.preventDefault();

  const deltaX = e.clientX - dragStartX;
  const deltaY = e.clientY - dragStartY;

  let newX = initialX + deltaX;
  let newY = initialY + deltaY;

  // Ограничиваем по горизонтали
  if (newX < 0) newX = 0;
  if (newX > window.innerWidth - width.value) {
    newX = window.innerWidth - width.value;
  }

  // Ограничиваем по вертикали
  if (newY < 0) newY = 0;
  if (newY > window.innerHeight - height.value) {
    newY = window.innerHeight - height.value;
  }

  // Обновляем напрямую через DOM для мгновенной реакции
  if (modalElement.value) {
    modalElement.value.style.transform = `translate(${newX}px, ${newY}px)`;
  }

  // Также обновляем реактивные переменные для синхронизации
  x.value = newX;
  y.value = newY;
}

function onMouseUp() {
  isDragging.value = false;
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
}

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

  document.addEventListener("mousemove", handleResize, { passive: false });
  document.addEventListener("mouseup", stopResize);
}

function handleResize(e: MouseEvent) {
  if (!isResizing.value) return;
  e.preventDefault();

  const newWidth = Math.max(300, startW + (e.clientX - startX));
  const newHeight = Math.max(200, startH + (e.clientY - startY));

  // Обновляем напрямую через DOM для мгновенной реакции
  if (modalElement.value) {
    modalElement.value.style.width = `${newWidth}px`;
    modalElement.value.style.height = `${newHeight}px`;
  }

  // Также обновляем реактивные переменные для синхронизации
  width.value = newWidth;
  height.value = newHeight;
}

function stopResize() {
  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);

  isResizing.value = false;
  justResized.value = true;
  requestAnimationFrame(() => {
    setTimeout(() => {
      justResized.value = false;
    }, 0);
  });
}

function toggleView() {
  currentView.value = currentView.value === "chats" ? "chat" : "chats";
}

function handleSelectChat(chat: IChat) {
  selectedChat.value = chat;
  if (isSmallWidth.value) {
    currentView.value = "chat";
  }
}

function selectChat(chat: IChat) {
  handleSelectChat(chat);
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

.modal-container.dragging {
  transition: none !important;
  will-change: transform;
}
</style>
