<template>
  <div
    class="rounded-lg p-5 dark:border-1 dark:border-[#484848] flex flex-col h-fit relative"
  >
    <UChip standalone inset class="absolute top-4 right-4" color="success" />
    <div class="flex flex-col gap-5">
      <div class="flex gap-4 items-center">
        <UIcon :name="props.achievement.icon" class="p-7" />
        <div class="flex flex-col">
          <h2 class="font-bold text-lg">{{ props.achievement.title }}</h2>
          <p class="text-sm text-gray-400">
            {{ props.achievement.description }}
          </p>
        </div>
      </div>
      <div class="flex-between">
        <UBadge
          :label="props.achievement.rarity"
          :color="rarityColors[props.achievement.rarity]"
          class="text-sm px-6"
          variant="outline"
        />
        <p class="text-sm text-gray-400">{{ props.achievement.date }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAchievement } from "@/types/achievement.interface";

const props = defineProps<{
  achievement: IAchievement;
}>();
const rarityColors: Record<
  "Common" | "Rare" | "Epic" | "Legendary",
  "success" | "secondary" | "error" | "warning"
> = {
  Common: "success",
  Rare: "secondary",
  Epic: "error",
  Legendary: "warning",
};
</script>
