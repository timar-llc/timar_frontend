<template>
  <div
    v-if="selectedChat"
    class="p-3 border-t border-gray-200 dark:border-gray-700"
  >
    <div class="flex gap-2">
      <div class="flex-1 relative">
        <input
          v-model="messageText"
          @keyup.enter="sendMessage"
          type="text"
          :placeholder="isRecording ? '' : 'Введите сообщение...'"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-success"
          :disabled="isRecording"
        />
        <!-- Таймер записи -->
        <div
          v-if="isRecording"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 font-mono text-sm"
        >
          {{ formatTime(recordingTime) }}
        </div>
      </div>

      <EmojiPicker @select-emoji="addEmoji" />

      <!-- Кнопка удаления записи -->
      <button
        v-if="isRecording"
        @click="cancelRecording"
        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
      >
        <UIcon name="material-symbols:delete" class="text-sm" />
      </button>

      <!-- Адаптивная кнопка отправки -->
      <button
        @click="handleSendButtonClick"
        class="px-4 py-2 rounded-lg transition-all duration-200 bg-success text-black hover:bg-success/80"
      >
        <UIcon :name="getSendButtonIcon()" class="text-sm" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Chat } from "@/types/chat.interface";
import EmojiPicker from "./emoji-picker.vue";

interface Props {
  selectedChat: Chat | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  sendMessage: [text: string];
  voiceMessage: [audioBlob: Blob, duration: number];
}>();

const messageText = ref("");
const isRecording = ref(false);
const recordingTime = ref(0);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const isCancelled = ref(false);
let recordingInterval: NodeJS.Timeout | null = null;

function handleSendButtonClick() {
  if (messageText.value.trim()) {
    sendMessage();
  } else if (!isRecording.value) {
    startRecording();
  } else {
    stopRecording();
  }
}

function sendMessage() {
  if (!messageText.value.trim() || !props.selectedChat) return;

  emit("sendMessage", messageText.value);
  messageText.value = "";
}

function addEmoji(emoji: string) {
  messageText.value += emoji;
}

function getSendButtonIcon(): string {
  if (isRecording.value) {
    return "material-symbols:send";
  }
  return messageText.value.trim()
    ? "material-symbols:send"
    : "material-symbols:mic";
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Проверяем поддерживаемые форматы
    const mimeType = MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : MediaRecorder.isTypeSupported("audio/mp4")
      ? "audio/mp4"
      : "audio/wav";

    console.log("Using MIME type:", mimeType);

    mediaRecorder.value = new MediaRecorder(stream);
    audioChunks.value = [];

    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data);
    };
    recordingInterval = setInterval(() => {
      recordingTime.value++;
    }, 1000);

    mediaRecorder.value.onstop = () => {
      // Отправляем голосовое сообщение только если запись не была отменена
      if (audioChunks.value.length > 0 && !isCancelled.value) {
        const audioBlob = new Blob(audioChunks.value, { type: "audio/wav" });
        console.log("Recording time:", recordingTime.value);
        emit("voiceMessage", audioBlob, recordingTime.value);
      }
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.value.start();
    isRecording.value = true;
    isCancelled.value = false;
    recordingTime.value = 0;

    // Запускаем таймер
  } catch (error) {
    console.error("Ошибка доступа к микрофону:", error);
    alert("Не удалось получить доступ к микрофону");
  }
}

function stopRecording() {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();
    isRecording.value = false;
    if (recordingInterval) {
      clearInterval(recordingInterval);
      recordingInterval = null;
    }
  }
}

function cancelRecording() {
  if (mediaRecorder.value && isRecording.value) {
    // Устанавливаем флаг отмены
    isCancelled.value = true;

    // Останавливаем запись
    mediaRecorder.value.stop();
    isRecording.value = false;
    if (recordingInterval) {
      clearInterval(recordingInterval);
      recordingInterval = null;
    }
    // Очищаем данные записи
    audioChunks.value = [];

    // Останавливаем все треки микрофона
    if (mediaRecorder.value.stream) {
      mediaRecorder.value.stream.getTracks().forEach((track) => track.stop());
    }
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

// Очистка при размонтировании
onUnmounted(() => {
  if (recordingInterval) {
    clearInterval(recordingInterval);
  }
});
</script>
