<template>
  <div
    class="relative rounded-2xl p-5 flex flex-col gap-5 border transition-all duration-300 hover:-translate-y-1 bg-white/80 dark:bg-white/5 backdrop-blur"
    :class="[
      rarityVariants[props.achievement.rarity],
      isReceived
        ? 'shadow-md hover:shadow-lg'
        : 'shadow-sm opacity-60 grayscale-[0.3] border-gray-300 dark:border-gray-600',
    ]"
  >
    <div class="absolute top-4 right-4 flex items-center gap-2">
      <!-- Индикатор "Не получено" -->
      <div
        v-if="!isReceived"
        class="bg-gray-500/80 dark:bg-gray-700/80 text-white text-xs px-2 py-1 rounded-full font-medium"
      >
        {{ $t("achievements.not_received") }}
      </div>
      <span
        class="inline-flex w-2.5 h-2.5 rounded-full"
        :class="
          isReceived
            ? rarityDots[props.achievement.rarity]
            : 'bg-gray-400 dark:bg-gray-600'
        "
      ></span>
    </div>

    <div class="flex gap-4 items-start">
      <div
        class="rounded-2xl p-4 text-3xl flex items-center justify-center shrink-0"
        :class="rarityIconWrap[props.achievement.rarity]"
      >
        <UIcon :name="props.achievement.icon" class="text-3xl" />
      </div>
      <div class="flex flex-col gap-1 min-w-0">
        <h2
          class="font-semibold text-lg text-gray-900 dark:text-white truncate"
        >
          {{ props.achievement.title }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 leading-snug">
          {{ props.achievement.description }}
        </p>
      </div>
    </div>

    <div class="flex items-center justify-between gap-3 text-sm">
      <UBadge
        :label="props.achievement.rarity"
        :color="rarityBadgeColors[props.achievement.rarity]"
        variant="outline"
        class="px-4 capitalize"
      />
      <p
        v-if="isReceived && props.achievement.recievedAt"
        class="text-gray-500 dark:text-gray-400"
      >
        {{ new Date(props.achievement.recievedAt).toLocaleDateString() }}
      </p>
      <p v-else class="text-gray-400 dark:text-gray-500 italic">
        {{ $t("achievements.not_received_yet") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAchievement } from "@/types/achievement.interface";

const props = defineProps<{
  achievement: IAchievement;
}>();

// Проверяем, получено ли достижение
const isReceived = computed(() => {
  return (
    props.achievement.recievedAt !== null &&
    props.achievement.recievedAt !== undefined
  );
});

const rarityBadgeColors: Record<
  IAchievement["rarity"],
  "success" | "secondary" | "error" | "warning"
> = {
  common: "success",
  rare: "secondary",
  epic: "error",
  legendary: "warning",
};

const rarityVariants: Record<IAchievement["rarity"], string> = {
  common:
    "border-green-100 dark:border-green-500/20 bg-gradient-to-br from-green-50/90 to-white dark:from-green-500/10 dark:to-transparent",
  rare: "border-blue-100 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/90 to-white dark:from-blue-500/10 dark:to-transparent",
  epic: "border-rose-100 dark:border-rose-500/20 bg-gradient-to-br from-rose-50/90 to-white dark:from-rose-500/10 dark:to-transparent",
  legendary:
    "border-amber-100 dark:border-amber-500/20 bg-gradient-to-br from-amber-50/90 to-white dark:from-amber-500/10 dark:to-transparent",
};

const rarityDots: Record<IAchievement["rarity"], string> = {
  common: "bg-green-500",
  rare: "bg-blue-500",
  epic: "bg-rose-500",
  legendary: "bg-amber-400",
};

const rarityIconWrap: Record<IAchievement["rarity"], string> = {
  common: "bg-green-100/80 text-green-700 dark:bg-green-500/15",
  rare: "bg-blue-100/80 text-blue-700 dark:bg-blue-500/15",
  epic: "bg-rose-100/80 text-rose-700 dark:bg-rose-500/15",
  legendary: "bg-amber-100/80 text-amber-700 dark:bg-amber-500/15",
};
</script>
