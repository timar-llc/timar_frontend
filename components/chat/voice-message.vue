<template>
  <div class="flex items-center gap-3 min-w-[200px]">
    <!-- Кнопка воспроизведения -->
    <button
      @click="togglePlay"
      :disabled="isLoading"
      class="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
    >
      <UIcon
        v-if="isLoading"
        name="material-symbols:sync"
        class="text-white text-sm animate-spin"
      />
      <UIcon
        v-else
        :name="
          isPlaying ? 'material-symbols:pause' : 'material-symbols:play-arrow'
        "
        class="text-white text-sm"
      />
    </button>

    <!-- Волновая линия с возможностью перемотки -->
    <div class="flex-1 relative">
      <div
        class="flex items-center gap-1 h-4 cursor-pointer"
        @click="seekToPosition"
        ref="progressBar"
      >
        <div
          v-for="(bar, index) in waveformBars"
          :key="index"
          class="bg-black/20 rounded-full transition-all duration-200"
          :class="{
            'bg-black/40': index < currentBar,
          }"
          :style="{
            width: '2px',
            height: `${bar}px`,
          }"
        ></div>
      </div>
    </div>

    <!-- Время -->
    <div class="text-xs text-black/60 font-mono min-w-[40px] flex-shrink-0">
      {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  audioBlob: Blob;
  duration: number; // Длительность из записи
}

const props = defineProps<Props>();

const isPlaying = ref(false);
const isLoading = ref(false);
const currentTime = ref(0);
const audio = ref<HTMLAudioElement | null>(null);
const progressBar = ref<HTMLElement>();

// Используем переданную длительность или вычисляем из аудио
const duration = computed(() => {
  return props.duration || 0;
});

// Вычисляем процент прогресса
const progressPercentage = computed(() => {
  if (duration.value === 0) return 0;
  return (currentTime.value / duration.value) * 100;
});

// Генерируем случайные высоты для волновой линии
const waveformBars = computed(() => {
  const bars = [];
  for (let i = 0; i < 50; i++) {
    bars.push(Math.random() * 12 + 4); // Высота от 4 до 16px
  }
  return bars;
});

// Вычисляем текущую позицию в волновой линии
const currentBar = computed(() => {
  if (duration.value === 0) return 0;
  return Math.floor(
    (currentTime.value / duration.value) * waveformBars.value.length
  );
});

async function togglePlay() {
  if (isLoading.value) return;

  if (!audio.value) {
    await createAudio();
  }

  if (isPlaying.value) {
    pauseAudio();
  } else {
    playAudio();
  }
}

// Функция перемотки
function seekToPosition(event: MouseEvent) {
  if (!audio.value || !progressBar.value) return;

  const rect = progressBar.value.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percentage = clickX / rect.width;

  const newTime = percentage * duration.value;
  audio.value.currentTime = newTime;
  currentTime.value = newTime;
}

async function createAudio() {
  try {
    isLoading.value = true;

    // Проверяем размер файла
    if (props.audioBlob.size === 0) {
      throw new Error("Пустой аудио файл");
    }

    audio.value = new Audio(URL.createObjectURL(props.audioBlob));

    return new Promise<void>((resolve, reject) => {
      if (!audio.value) {
        reject(new Error("Не удалось создать аудио элемент"));
        return;
      }

      audio.value.addEventListener("loadedmetadata", () => {
        isLoading.value = false;
        resolve();
      });

      audio.value.addEventListener("error", () => {
        isLoading.value = false;
        reject(new Error("Ошибка загрузки аудио"));
      });

      audio.value.addEventListener("timeupdate", () => {
        currentTime.value = audio.value!.currentTime;
      });

      audio.value.addEventListener("ended", () => {
        isPlaying.value = false;
        currentTime.value = 0;
      });
    });
  } catch (error) {
    isLoading.value = false;
    console.error("Ошибка создания аудио:", error);
  }
}

function playAudio() {
  if (audio.value) {
    audio.value.play().catch((error) => {
      console.error("Ошибка воспроизведения:", error);
    });
    isPlaying.value = true;
  }
}

function pauseAudio() {
  if (audio.value) {
    audio.value.pause();
    isPlaying.value = false;
  }
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

// Очистка при размонтировании
onUnmounted(() => {
  if (audio.value) {
    audio.value.pause();
    audio.value = null;
  }
});
</script>
