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
      'fixed z-50 rounded-lg shadow-lg dark:border-1 border-[#484848] bg-card-bg ',
    ]"
  >
    <!-- Заголовок -->
    <div
      class="flex justify-between items-center p-4 border-b border-gray-200 cursor-move"
      ref="modalRef"
      @mousedown="onHeaderMouseDown"
    >
      <h3 class="text-md font-medium">
        {{ $t("chat.title") }}
      </h3>
      <UIcon
        name="material-symbols:close"
        class="cursor-pointer hover:text-gray-600"
        @click="chatModalStore.toggle()"
      />
    </div>

    <!-- Контент -->
    <div class="p-4 h-full overflow-y-auto">
      <div class="text-gray-600 text-sm">
        {{ $t("chat.placeholder") }}
      </div>
    </div>
    <div class="resizer" @mousedown.prevent="startResize"></div>
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from "@vueuse/core";
import { useChatModalStore } from "@/stores/chat/useChatModalStore";

const modalRef = ref<HTMLElement>();
const chatModalStore = useChatModalStore();

const width = ref(300);
const height = ref(200);
const isResizing = ref(false);
const justResized = ref(false);
// Драггабл с ограничениями
const { x, y, style } = useDraggable(modalRef, {
  initialValue: {
    x: process.client ? window.innerWidth - 350 : 0,
    y: process.client ? window.innerHeight - 384 : 0,
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
  startX = e.clientX / 2;
  startY = e.clientY / 2;
  startW = width.value;
  startH = height.value;

  window.addEventListener("mousemove", handleResize);
  window.addEventListener("mouseup", stopResize);
}

function handleResize(e: MouseEvent) {
  if (!isResizing.value) return;
  width.value = Math.max(100, startW + (e.clientX / 2 - startX));
  height.value = Math.max(100, startH + (e.clientY / 2 - startY));
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
