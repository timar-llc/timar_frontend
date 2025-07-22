<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex justify-between">
      <h1 class="text-2xl font-bold">{{ $t("add_project.title") }}</h1>
      <span class="text-sm text-gray-400">
        {{ $t("add_project.step") }} {{ step + 1 }} {{ $t("add_project.of") }} 3
      </span>
    </div>
    <div class="flex justify-between w-full">
      <UStepper :items="items" v-model="step" color="success" class="w-full" />
      <div class="flex gap-2 h-10 items-center">
        <UButton
          color="success"
          variant="solid"
          :class="step == 0 ? 'bg-gray-400' : 'bg-success'"
          class="w-max"
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

const { t } = useI18n();
const step = ref(0);
const items: StepperItem[] = [
  {
    title: t("add_project.basic_info.title"),
    icon: "i-lucide-house",
  },
  {
    title: t("add_project.media.title"),
    icon: "i-lucide-truck",
  },
  {
    title: t("add_project.technologies.title"),
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
