<template>
  <div
    class="flex flex-col gap-4 justify-center w-full p-6 rounded-[8px] dark:border-1 border-[#484848] bg-card-bg"
  >
    <h3 class="text-sm font-bold">Frontend</h3>
    <div class="flex gap-2 flex-wrap">
      <UBadge
        v-for="tech in techs"
        :key="tech"
        color="success"
        :variant="isDark ? 'outline' : 'solid'"
        class="text-sm rounded-[15px]"
      >
        {{ tech }}
      </UBadge>
    </div>
  </div>
</template>
<script setup lang="ts">
const techs = ref<string[]>([
  "Vue.js",
  "Nuxt.js",
  "Tailwind CSS",
  "TypeScript",
]);
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});
</script>
