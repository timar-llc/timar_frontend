<template>
  <div
    @click="chatModalStore.toggle()"
    class="rounded-lg bg-success absolute bottom-0 right-0 flex items-center justify-center gap-2 px-4 py-2 cursor-pointer hover:scale-105 transition-all duration-200"
  >
    <UIcon name="lucide:message-circle-plus" class="text-black" />
    <h3 class="text-black text-md font-medium">
      {{ $t("chat.title") }}
    </h3>
  </div>
</template>

<script setup lang="ts">
import { useChatModalStore } from "@/stores/chat/useChatModalStore";

const chatModalStore = useChatModalStore();

const handleClick = () => {
  console.log("ChatCircle clicked, current state:", chatModalStore.isOpen);
  chatModalStore.toggle();
  console.log("After toggle, new state:", chatModalStore.isOpen);
};
</script>
