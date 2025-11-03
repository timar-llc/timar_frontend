<template>
  <div class="flex flex-col gap-4 w-full relative">
    <div class="flex justify-between">
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-arrow-left"
          variant="ghost"
          size="md"
          color="neutral"
          class="rounded-full border-1 border-white"
          @click="router.back()"
        />
        <h1 class="text-2xl font-bold mobile:text-sm">
          {{ $t("add_task.title") }}
        </h1>
      </div>
    </div>
    <CreateTaskBasicInfo />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const localePath = useLocalePath();

const { t } = useI18n();
</script>
