<template>
  <div class="flex flex-col gap-2">
    <h1 class="text-2xl font-bold mobile:text-lg">
      {{ $t("achievements.title") }}
    </h1>

    <p class="text-sm text-gray-400">
      {{ $t("achievements.description") }}
    </p>
    <div class="grid grid-cols-2 gap-4 mobile:grid-cols-1">
      <div
        class="rounded-lg bg-card-bg p-4 dark:border-1 dark:border-[#484848] flex flex-col h-fit"
      >
        <div class="flex flex-col gap-2 items-center justify-center h-fit">
          <h1 class="text-4xl font-bold text-success">6</h1>
          <h3 class="text-lg font-bold">
            {{ $t("achievements.total_achievements") }}
          </h3>
        </div>
      </div>
      <div
        class="rounded-lg bg-card-bg p-4 dark:border-1 dark:border-[#484848] flex flex-col h-fit"
      >
        <div class="flex flex-col gap-2 items-center justify-center h-fit">
          <h1 class="text-4xl font-bold text-success">100</h1>
          <h3 class="text-lg font-bold">
            {{ $t("achievements.experience_points") }}
          </h3>
        </div>
      </div>
      <div
        class="rounded-lg bg-card-bg p-4 dark:border-1 dark:border-[#484848] flex flex-col h-fit"
      >
        <div class="flex flex-col gap-2 items-center justify-center h-fit">
          <h1 class="text-4xl font-bold text-success">10</h1>
          <h3 class="text-lg font-bold">
            {{ $t("achievements.current_level") }}
          </h3>
        </div>
      </div>
      <div
        class="rounded-lg bg-card-bg p-4 dark:border-1 dark:border-[#484848] flex flex-col h-full"
      >
        <div class="flex flex-col gap-2">
          <h5 class="font-bold text-lg">
            {{ $t("achievements.progress_to_next_level") }}
          </h5>
          <UProgress
            v-model="value"
            class="relative"
            color="success"
            :max="100"
            status
            :ui="{
              status:
                'text-success font-bold absolute right-0 bottom-4 text-dark dark:text-success',
            }"
          />
          <p class="text-sm text-gray-400">2500/3000</p>
        </div>
      </div>
    </div>

    <UTabs
      :items="items"
      class="w-1/2 mt-10"
      color="success"
      :orientation="isMobile ? 'vertical' : 'horizontal'"
      @update:model-value="handleTabChange"
    />
    <div class="flex flex-col gap-4 mt-10">
      <AchievementCard
        v-for="achievement in filteredAchievements"
        :key="achievement.title + achievement.rarity + achievement.date"
        :achievement="achievement"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import { useI18n } from "vue-i18n";
import { useMediaQuery } from "@vueuse/core";

const isMobile = useMediaQuery("(max-width: 768px)");

const { t } = useI18n();
const achievements = ref<
  {
    title: string;
    description: string;
    icon: string;
    date: string;
    rarity: "Common" | "Rare" | "Epic" | "Legendary";
  }[]
>([
  {
    title: "Первый заказ",
    description:
      "Вы получили свой первый заказ на платформе TimarLance. Поздравляем!",
    icon: "fluent-emoji-flat:money-with-wings",
    date: "2025-01-01",
    rarity: "Legendary",
  },
  {
    title: "Первый заказ",
    description:
      "Вы получили свой первый заказ на платформе TimarLance. Поздравляем!",
    icon: "fluent-emoji-flat:money-with-wings",
    date: "2025-01-01",
    rarity: "Epic",
  },
]);

const value = ref(65);
const items = ref<TabsItem[]>([
  {
    label: `${t("achievements.categories.all")} ${achievements.value.length}`,
  },
  {
    label: `${t("achievements.categories.common")} ${
      achievements.value.filter((a) => a.rarity === "Common").length
    }`,
  },
  {
    label: `${t("achievements.categories.rare")} ${
      achievements.value.filter((a) => a.rarity === "Rare").length
    }`,
  },
  {
    label: `${t("achievements.categories.epic")} ${
      achievements.value.filter((a) => a.rarity === "Epic").length
    }`,
  },
  {
    label: `${t("achievements.categories.legendary")} ${
      achievements.value.filter((a) => a.rarity === "Legendary").length
    }`,
  },
]);
const selectedTab = ref(0); // индекс выбранной вкладки

const tabIndexToRarity: (null | "Common" | "Rare" | "Epic" | "Legendary")[] = [
  null, // 0: Все
  "Common", // 1: Обычные
  "Rare", // 2: Редкие
  "Epic", // 3: Эпические
  "Legendary", // 4: Легендарные
];

const filteredAchievements = computed(() => {
  const rarity = tabIndexToRarity[selectedTab.value];
  if (!rarity) return achievements.value;
  return achievements.value.filter((a) => a.rarity === rarity);
});

const handleTabChange = (payload: string | number) => {
  selectedTab.value = Number(payload);
};
</script>
