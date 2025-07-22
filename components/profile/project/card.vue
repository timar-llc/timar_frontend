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
      <img :src="item" width="320" height="320" class="rounded-lg" />
    </UCarousel>
    <div class="flex flex-col gap-2">
      <h3 class="text-xl font-bold text-default">E-commerce Platform</h3>
      <h4 class="text-sm text-muted">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis
        dolores animi enim sed harum suscipit consequuntur delectus voluptate
        dolor ad aliquid laudantium quaerat, nesciunt autem eum dolorum quo quae
        asperiores vitae itaque molestias cum error mollitia. Quam debitis
        consequuntur ut.
      </h4>
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
          <span class="text-sm">Подробнее</span>
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
  "https://picsum.photos/640/640?random=1",
  "/project.jpeg",
  "https://picsum.photos/640/640?random=2",
  "https://picsum.photos/640/640?random=3",
  "https://picsum.photos/640/640?random=4",
  "https://picsum.photos/640/640?random=5",
  "https://picsum.photos/640/640?random=6",
];
</script>
