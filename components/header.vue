<template>
  <div
    class="flex gap-14 max-h-[51px] h-full items-center w-full mobile:hidden"
  >
    <NuxtLink :to="localePath('/')">
      <h2 class="text-2xl font-bold">{{ t("brand") }}</h2>
    </NuxtLink>
    <div class="flex justify-between w-full ml-[50px]">
      <div
        class="flex items-center font-bold text-sm w-full text-[11px] gap-[40px]"
      >
        <NuxtLink :to="localePath('/')">{{ t("header_home") }}</NuxtLink>
        <NuxtLink :to="localePath('/')">{{ t("header_home") }}</NuxtLink>
      </div>
      <div class="flex items-center gap-4">
        <ClientOnly v-if="!colorMode?.forced">
          <UButton
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            color="neutral"
            class="dark:hover:border-white border border-transparent border-solid transition-colors duration-300 bg-dark rounded-[12px] hover:bg-dark hover:border-black p-1 cursor-pointer"
            variant="ghost"
            @click="isDark = !isDark"
          />

          <template #fallback>
            <div class="size-8" />
          </template>
        </ClientOnly>
        <ClientOnly>
          <UDropdownMenu
            color="success"
            variant="ghost"
            @click="isDark = !isDark"
            :items="items"
            :ui="{
              content: 'dark:bg-black bg-white',
            }"
          >
            <UButton
              icon="material-symbols-light:language"
              color="neutral"
              class="dark:hover:border-white border border-transparent border-solid transition-colors duration-300 bg-dark rounded-[12px] hover:bg-dark hover:border-black p-1 cursor-pointer"
              variant="ghost"
            />
          </UDropdownMenu>
        </ClientOnly>
        <NuxtLink :to="localePath('/sign-in')">
          <UButton
            :label="t('header_login')"
            class="h-[30px] text-[11px] rounded-[22px] font-bold cursor-pointer px-4 bg-dark border border-transparent dark:hover:border-white border-solid transition-colors duration-300 hover:bg-dark hover:border-black"
            color="neutral"
            variant="outline"
          />
        </NuxtLink>
        <NuxtLink :to="localePath('/sign-up')">
          <UButton
            :label="t('header_signup')"
            class="h-[30px] text-[11px] rounded-[22px] font-bold cursor-pointer px-4 hover:opacity-75 transition-opacity duration-300"
            color="neutral"
            variant="solid"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
const { t, setLocale } = useI18n();
const localePath = useLocalePath();
const colorMode = useColorMode();
const items = ref<DropdownMenuItem[]>([
  {
    label: t("russian_language"),
    icon: "flagpack:ru",
    onClick: () => {
      setLocale("ru");
    },
  },
  {
    label: t("english_language"),
    icon: "flagpack:us",
    onClick: () => {
      setLocale("en");
    },
  },
]);
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});
</script>

<style>
.custom-outline-animate::before,
.custom-outline-animate::after {
  content: "";
  position: absolute;
  top: 0;
  height: 100%;
  width: 0;
  border-top: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transition: width 0.3s;
  pointer-events: none;
  border-radius: 22px;
}

.custom-outline-animate::before {
  left: 0;
  border-left: 2px solid #fff;
  border-right: none;
}

.custom-outline-animate::after {
  right: 0;
  border-right: 2px solid #fff;
  border-left: none;
}

.custom-outline-animate:hover::before,
.custom-outline-animate:hover::after {
  width: 50%;
}
</style>
