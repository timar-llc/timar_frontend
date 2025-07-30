<template>
  <div
    class="flex gap-4 justify-start bg-card-bg w-full rounded-[8px] border border-muted p-6 mobile:flex-col tablet:flex-col"
  >
    <UCarousel
      v-slot="{ item }"
      :items="items"
      class="w-full max-w-xs mx-auto"
      :autoplay="true"
    >
      <NuxtLink :to="localePath(`/project/${props.project.id}`)">
        <img :src="item" width="320" height="320" class="rounded-lg" />
      </NuxtLink>
    </UCarousel>
    <div class="flex flex-col gap-2">
      <NuxtLink
        :to="localePath(`/project/${props.project.id}`)"
        class="hover:opacity-75 hover:text-success"
      >
        <h3 class="text-xl font-bold text-default">
          {{ props.project.title }}
        </h3>
        <h4 class="text-sm text-muted">
          {{ props.project.description }}
        </h4>
      </NuxtLink>
      <div class="flex gap-2">
        <UBadge
          color="success"
          :variant="isDark ? 'outline' : 'solid'"
          class="text-sm"
        >
          Vue.js
        </UBadge>
        <UBadge
          color="success"
          :variant="isDark ? 'outline' : 'solid'"
          class="text-sm"
        >
          Nuxt.js
        </UBadge>
        <UBadge
          color="success"
          :variant="isDark ? 'outline' : 'solid'"
          class="text-sm"
        >
          Tailwind CSS
        </UBadge>
        <UBadge
          color="success"
          :variant="isDark ? 'outline' : 'solid'"
          class="text-sm"
        >
          TypeScript
        </UBadge>
      </div>
    </div>
    <div class="flex flex-col gap-2 justify-between">
      <div class="flex flex-col">
        <h2 class="text-2xl font-bold text-green-lead">5,000$</h2>
        <p class="text-sm text-muted">3 month</p>
      </div>
      <div class="flex flex-col gap-3">
        <UButton
          color="neutral"
          variant="solid"
          trailing-icon="i-lucide-arrow-right"
          class="hover:opacity-80 cursor-pointer"
        >
          <NuxtLink :to="localePath(`/project/${props.project.id}`)">
            <span class="text-sm">Подробнее</span>
          </NuxtLink>
        </UButton>
        <UButton
          color="error"
          variant="outline"
          trailing-icon="i-lucide-trash"
          class="hover:opacity-80 cursor-pointer w-full justify-center"
        >
          Удалить
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IProject } from "@/types/project.interface";

const props = defineProps<{
  project: IProject;
}>();

const localePath = useLocalePath();
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});
const items = [
  "/project.jpeg",
  "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1642&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/34/BA1yLjNnQCI1yisIZGEi_2013-07-16_1922_IMG_9873.jpg?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1194&q=80",
];
</script>
