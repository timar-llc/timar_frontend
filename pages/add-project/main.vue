<template>
  <div class="flex flex-col gap-4 w-full relative">
    <div class="flex justify-between">
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-arrow-left"
          variant="ghost"
          size="md"
          color="neutral"
          class="rounded-full border-1 border-white"
          @click="router.push(localePath(`/profile/${$route.params.username}`))"
        />
        <h1 class="text-2xl font-bold mobile:text-sm">
          {{ $t("add_project.title") }}
        </h1>
      </div>
      <span class="text-sm text-gray-400">
        {{ $t("add_project.step") }} {{ step + 1 }} {{ $t("add_project.of") }} 3
      </span>
    </div>
    <div class="flex">
      <UStepper
        :items="items"
        v-model="step"
        color="success"
        class="w-full absolute right-0 left-0 top-10 mt-2 mobile:mt-6"
        :ui="{ title: 'mobile:hidden' }"
      >
      </UStepper>
      <div
        class="flex gap-2 h-10 absolute right-0 top-10 mt-2 mobile:static mobile:mt-32 mobile:mx-auto tablet:static tablet:mt-32 tablet:mx-auto"
      >
        <UButton
          color="success"
          variant="solid"
          :class="step == 0 ? 'bg-gray-400' : 'bg-success'"
          class="w-fit"
          :disabled="step === 0"
          >{{ $t("add_project.save_draft") }}</UButton
        >
      </div>
    </div>
    <component :is="activeComponent" />
    <div class="flex justify-end">
      <UButton
        color="success"
        variant="solid"
        class="px-7"
        :class="step === 0 ? 'bg-gray-400 opacity-45' : 'bg-success'"
        trailing-icon="i-lucide-arrow-right"
      >
        {{ $t("add_project.next_step") }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";
import { getDurationList } from "@/utils/project/formatDuration";
import { useRouter } from "vue-router";

const router = useRouter();
const localePath = useLocalePath();

const { t } = useI18n();
const step = ref(0);
const items: StepperItem[] = [
  {
    title: t("add_project.basic_info.title"),
    icon: "lucide:info",
  },
  {
    title: t("add_project.media.title"),
    icon: "lucide:image-plus",
  },
  {
    title: t("add_project.technologies.title"),
    icon: "lucide:code",
  },
];
const activeComponent = computed(() => {
  switch (step.value) {
    case 0:
      return resolveComponent("AddProjectBasicInfo");
    case 1:
      return resolveComponent("AddProjectMedia");
    case 2:
      return resolveComponent("AddProjectTechnologies");
  }
});
</script>
