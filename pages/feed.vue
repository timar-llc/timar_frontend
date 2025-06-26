<template>
  <div
    class="flex flex-col items-center h-full mt-8 max-w-[1200px] w-full mx-auto"
  >
    <h1 class="text-[40px] font-bold">{{ t("feed_title") }}</h1>
    <p class="text-sm">
      {{ t("feed_description") }}
    </p>
    <UInput
      icon="i-lucide-search"
      size="md"
      variant="outline"
      class="w-full mt-5"
      color="neutral"
      placeholder="Search..."
    />
    <div class="flex w-full mt-8 gap-5">
      <OrderFeedSidebar />
      <div class="flex flex-col gap-8 w-full">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-3xl pl-3">
            3127 {{ t("feed_orders_title") }}
          </h3>
          <USelect
            v-model="value"
            icon="material-symbols:sort-rounded"
            size="md"
            color="neutral"
            :items="items"
            class="w-64"
          />
        </div>
        <OrderFeedCard :order="{ complexity: 'easy' }" />
        <OrderFeedCard :order="{ complexity: 'hard' }" />
        <OrderFeedCard :order="{ complexity: 'medium' }" />
        <OrderFeedCard :order="{ complexity: 'hard' }" />
        <OrderFeedCard :order="{ complexity: 'medium' }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const items = ref([t("sort_by_low"), t("sort_by_high")]);
const value = ref(t("sort_by_low"));
</script>
