<template>
  <NuxtLink :to="localePath(`/news/${props.item.id}`)">
    <div
      class="flex flex-col gap-2 w-full transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      <NuxtImg
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        class="w-full h-full object-cover"
        width="100"
        height="100"
      />
      <h3 class="text-sm font-bold uppercase">{{ props.item.title }}</h3>
      <p class="text-sm">{{ props.item.description }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { INews } from "@/types/news.entity";

const props = defineProps<{
  item: INews;
}>();

const localePath = useLocalePath();
</script>
