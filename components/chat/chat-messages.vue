<template>
  <div ref="messagesContainer" class="flex-1 overflow-y-auto p-3">
    <div v-if="selectedChat" class="space-y-3">
      <TransitionGroup
        name="message"
        tag="div"
        appear
        class="flex flex-col gap-2"
      >
        <div
          v-for="message in selectedChat.messages"
          :key="message.id"
          :class="['flex', message.isOwn ? 'justify-end' : 'justify-start']"
        >
          <UContextMenu :items="getContextMenuItems(message)">
            <div
              :class="[
                'max-w-[70%] p-3 rounded-lg transition-all duration-200',
                message.isOwn ? 'bg-success text-black' : 'bg-accented',
              ]"
            >
              <!-- Текстовое сообщение -->
              <div v-if="message.text && !message.audioBlob" class="text-sm">
                {{ message.text }}
              </div>

              <!-- Голосовое сообщение -->
              <div v-if="message.audioBlob" class="min-w-[200px]">
                <VoiceMessage
                  :audio-blob="message.audioBlob"
                  :duration="message.duration || 0"
                />
              </div>

              <div class="text-xs opacity-70 mt-1 flex items-center gap-1">
                {{ message.time }}
                <!-- Статус доставки -->
                <UIcon
                  v-if="message.isOwn"
                  name="material-symbols:done-all"
                  :class="['text-xs', 'text-blue-500']"
                />
              </div>
            </div>
          </UContextMenu>
        </div>
      </TransitionGroup>

      <!-- Индикатор печати -->
      <TypingIndicator
        :is-typing="isTyping"
        :typing-text="`${selectedChat.name} печатает...`"
      />
    </div>

    <div v-else class="flex items-center justify-center h-full text-gray-500">
      <div class="text-center">
        <UIcon name="material-symbols:chat" class="text-4xl mb-2 opacity-50" />
        <div class="text-sm">Выберите чат для начала общения</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Chat } from "@/types/chat.interface";
import VoiceMessage from "./voice-message.vue";
import type { ContextMenuItem } from "@nuxt/ui";

interface Props {
  selectedChat: Chat | null;
  isTyping?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isTyping: false,
});

// Функция для получения элементов контекстного меню для конкретного сообщения
function getContextMenuItems(message: any): ContextMenuItem[] {
  return [
    {
      label: "Удалить сообщение",
      icon: "material-symbols:delete",
      action: () => {
        console.log("Удалить сообщение:", message.id);
        // Здесь можно добавить логику удаления сообщения
      },
    },
    {
      label: "Копировать",
      icon: "material-symbols:content-copy",
      action: () => {
        if (message.text) {
          navigator.clipboard.writeText(message.text);
        }
      },
    },
  ];
}
const messagesContainer = ref<HTMLElement>();

// Автоматическая прокрутка в конец
function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

// Прокрутка при изменении сообщений
watch(
  () => props.selectedChat?.messages,
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  },
  { deep: true }
);

// Прокрутка при смене чата
watch(
  () => props.selectedChat,
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  }
);

// Прокрутка при монтировании
onMounted(() => {
  nextTick(() => {
    scrollToBottom();
  });
});
</script>

<style scoped>
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.message-move {
  transition: transform 0.3s ease;
}
</style>
