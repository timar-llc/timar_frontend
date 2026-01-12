<template>
  <NuxtLink :to="localePath(`/news/${props.item.uuid}`)">
    <!-- Большая карточка для главной страницы -->
    <div
      v-if="props.variant === 'large'"
      class="flex flex-col h-full w-full transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-card-bg rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-500/20 shadow-sm hover:shadow-md"
    >
      <div
        class="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800"
      >
        <NuxtImg
          v-if="props.item.imageUrl"
          :src="props.item.imageUrl"
          class="object-cover w-full h-full"
          width="500"
          height="375"
          loading="lazy"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
        >
          <UIcon
            name="i-lucide-newspaper"
            class="w-16 h-16 text-gray-400 dark:text-gray-500"
          />
        </div>
      </div>
      <div class="flex flex-col gap-3 p-5 flex-1">
        <h3
          class="text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight"
        >
          {{ props.item.title }}
        </h3>
        <p
          class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed flex-1"
        >
          {{ props.item.description }}
        </p>
        <div
          class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
        >
          <UIcon name="i-lucide-calendar" class="w-4 h-4" />
          <span>{{ formattedDate }}</span>
        </div>
      </div>
    </div>

    <!-- Маленькая горизонтальная карточка для страницы новостей -->
    <div
      v-else
      class="flex flex-row h-[200px] w-full transition-all duration-300 hover:scale-[1.01] cursor-pointer bg-card-bg rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-500/20 shadow-sm hover:shadow-md"
    >
      <div
        class="relative w-[200px] h-full flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800"
      >
        <NuxtImg
          v-if="props.item.imageUrl"
          :src="props.item.imageUrl"
          class="object-cover w-full h-full"
          width="200"
          height="200"
          loading="lazy"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
        >
          <UIcon
            name="i-lucide-newspaper"
            class="w-12 h-12 text-gray-400 dark:text-gray-500"
          />
        </div>
      </div>
      <div class="flex flex-col gap-3 p-5 flex-1 min-w-0 justify-between">
        <div class="flex flex-col gap-3 flex-1">
          <h3
            class="text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight"
          >
            {{ props.item.title }}
          </h3>
          <p
            class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed"
          >
            {{ props.item.description }}
          </p>
        </div>
        <div
          class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
        >
          <UIcon name="i-lucide-calendar" class="w-4 h-4" />
          <span>{{ formattedDate }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { INews } from "@/types/news.entity";

interface Props {
  item: INews;
  variant?: "large" | "small";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "small",
});

const { t } = useI18n();
const localePath = useLocalePath();

const formattedDate = computed(() => {
  if (!props.item.createdAt) return "";
  const date =
    typeof props.item.createdAt === "string"
      ? new Date(props.item.createdAt)
      : props.item.createdAt;
  if (isNaN(date.getTime())) return "";

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
});
</script>
