<template>
  <div
    ref="dropZoneRef"
    class="flex flex-col gap-4 mt-16 rounded-lg bg-card-bg p-4 dark:border-1 dark:border-[#484848] cursor-pointer hover:opacity-85 transition-all hover:transition-all"
    @dragover.prevent
    @click="openFileDialog"
  >
    <div class="flex dark:bg-black w-fit rounded-lg p-4 mx-auto bg-success">
      <UIcon name="i-lucide-file" class="p-4" />
    </div>
    <h4 class="text-center">
      {{ $t("add_project.media.drop_zone_title") }}
    </h4>
    <p class="text-center text-sm text-gray-400">
      {{ $t("add_project.media.drop_zone_description") }}
    </p>
    <div class="flex mx-auto gap-4">
      <div class="flex items-center gap-1">
        <UIcon name="material-symbols:image" class="text-xl" />
        <p class="text-sm text-gray-400">JPG, PNG, GIF, WebP</p>
      </div>
      <div class="flex items-center gap-1">
        <UIcon name="material-symbols:drive-file-move" class="text-xl" />
        <p class="text-sm text-gray-400">
          {{ $t("add_project.media.drop_zone_constraints") }}
        </p>
      </div>
    </div>
    <input
      ref="fileInputRef"
      type="file"
      class="hidden"
      multiple
      accept="image/jpeg,image/png,image/gif,image/webp"
      @change="onFileChange"
    />
  </div>
  <div
    class="mt-4 bg-card-bg p-4 rounded-lg dark:border-1 dark:border-[#484848]"
    v-if="filePreviews.length > 0"
  >
    <div class="flex-between">
      <h3 class="text-lg font-bold">
        {{ $t("add_project.media.uploaded_files") }}
      </h3>
      <div class="flex items-center gap-1">
        <UIcon name="material-symbols:info-outline" class="text-xl" />
        <p class="text-[12px] text-gray-400">
          {{ $t("add_project.media.tip_first_file") }}
        </p>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-4 mt-2 mobile:grid-cols-1">
      <div
        v-for="(item, index) in filePreviews"
        :key="item.file.name + item.file.size"
        class="flex flex-col items-center justify-center"
      >
        <div class="flex flex-col gap-2">
          <div class="flex-between">
            <UBadge v-if="index === 0" color="success" class="text-xs">
              {{ $t("add_project.media.main_photo") }}
            </UBadge>
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="solid"
              size="xs"
              @click="onDeleteFile(index)"
            >
              {{ $t("add_project.media.delete_file") }}
            </UButton>
          </div>
          <img
            :src="item.url"
            class="rounded-lg cursor-grab active:cursor-grabbing w-[300px] h-[300px] object-contain border-1 p-2 dark:border-[#484848]"
            width="300"
            height="300"
            alt="preview"
            draggable="true"
            @dragstart="onDragStart(index)"
            @dragover.prevent
            @drop="onDrop(index)"
          />
        </div>
        <h1 class="text-sm text-gray-400">{{ item.file.name }}</h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useDropZone } from "@vueuse/core";

const dropZoneRef = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);
const draggingIndex = ref<number | null>(null);

const openFileDialog = () => {
  fileInputRef.value?.click();
};

const onDeleteFile = (index: number) => {
  files.value.splice(index, 1);
};

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files) {
    files.value = [...files.value, ...Array.from(input.files)];
    input.value = "";
  }
};

// Drag&drop сортировка внутри grid
const onDragStart = (index: number) => {
  draggingIndex.value = index;
};
const onDrop = (index: number) => {
  if (draggingIndex.value === null || draggingIndex.value === index) return;
  const updated = [...files.value];
  const [moved] = updated.splice(draggingIndex.value, 1);
  updated.splice(index, 0, moved);
  files.value = updated;
  draggingIndex.value = null;
};

const toast = useToast();

// Drag&drop из проводника
const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const onFilesDrop = (droppedFiles: File[] | null) => {
  if (droppedFiles) {
    const filtered = Array.from(droppedFiles).filter((file) =>
      allowedTypes.includes(file.type),
    );
    files.value = [...files.value, ...filtered];
    // Можно добавить уведомление, если были отброшены неподходящие файлы
    if (filtered.length < droppedFiles.length) {
      // Например, через toast
      toast.add({
        title: "Ошибка",
        description:
          "Некоторые файлы не были добавлены: только JPG, PNG, GIF, WebP",
        color: "error",
      });
    }
  }
};
useDropZone(dropZoneRef, {
  onDrop: onFilesDrop,
  multiple: true,
  preventDefaultForUnhandled: false,
});

const filePreviews = computed(() =>
  files.value.map((file) => ({
    file,
    url: URL.createObjectURL(file),
  })),
);
</script>
