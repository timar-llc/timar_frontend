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
      v-model="search"
      placeholder="Search..."
    />
    <div class="flex w-full mt-8 gap-5">
      <OrderFeedSidebar
        v-model:type="typeFilter"
        v-model:complexity="complexityFilter"
      />
      <div class="flex flex-col gap-8 w-full">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-3xl pl-3">
            {{ filteredOrders.length }}
            {{
              typeFilter === "vacancies"
                ? t("vacancies_title")
                : t("tasks_title")
            }}
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
        <div v-for="order in filteredOrders" :key="order.id" class="w-full">
          <OrderFeedCard :order="{ complexity: order.complexity }" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const items = ref([t("sort_by_low"), t("sort_by_high")]);
const value = ref(t("sort_by_low"));
const orders = ref<
  Array<{ id: number; complexity: "easy" | "medium" | "hard" }>
>([
  { id: 1, complexity: "easy" },
  { id: 2, complexity: "medium" },
  { id: 3, complexity: "hard" },
  { id: 4, complexity: "easy" },
  { id: 5, complexity: "medium" },
  { id: 6, complexity: "hard" },
  { id: 7, complexity: "easy" },
  { id: 8, complexity: "medium" },
  { id: 9, complexity: "hard" },
  { id: 10, complexity: "easy" },
]);
const typeFilter = ref<"vacancies" | "tasks">("vacancies");
const complexityFilter = ref<("easy" | "medium" | "hard")[]>([
  "easy",
  "medium",
  "hard",
]);
const search = ref("");
const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    if (search.value) {
      return order.id.toString().includes(search.value);
    }
    if (typeFilter.value === "tasks") {
      return complexityFilter.value.includes(order.complexity);
    }
    return true;
  });
});
</script>
