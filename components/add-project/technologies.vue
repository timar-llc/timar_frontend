<template>
  <div
    class="flex flex-col gap-4 mt-16 rounded-lg bg-card-bg p-4 dark:border-1 dark:border-[#484848]"
  >
    <h3 class="text-lg font-bold">
      {{ $t("add_project.technologies.title") }}
    </h3>
    <UFormField :label="$t('add_project.technologies.technologies')" required>
      <UInputTags
        v-model="inputTags"
        color="success"
        icon="i-lucide-tag"
        class="w-full"
        v-on:remove-tag="removeTag($event)"
        :placeholder="$t('add_project.technologies.enter_technologies')"
      />
    </UFormField>
    <p class="text-sm font-bold">
      {{ $t("add_project.technologies.popular_technologies") }}
    </p>
    <div class="flex flex-wrap gap-2">
      <UBadge
        v-for="tag in popularTechnologies"
        :key="tag"
        color="success"
        @click="addTag(tag)"
        class="cursor-pointer"
      >
        {{ tag }}
      </UBadge>
    </div>
    <div class="flex flex-col mt-7">
      <p class="text-sm font-bold">
        {{ $t("add_project.technologies.recommended_technologies") }}
      </p>
      <ul
        class="list-disc list-inside pl-4 text-sm text-gray-400 mt-2 marker:text-success gap-3 flex flex-col"
      >
        <li>{{ $t("add_project.technologies.first_recommendation") }}</li>
        <li>{{ $t("add_project.technologies.second_recommendation") }}</li>
        <li>{{ $t("add_project.technologies.third_recommendation") }}</li>
        <li>{{ $t("add_project.technologies.fourth_recommendation") }}</li>
        <li>{{ $t("add_project.technologies.fifth_recommendation") }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const popularTechnologies = ref(["Vue", "React", "Nuxt", "TypeScript"]);
const inputTags = ref<string[]>([]);

const addTag = (tag: string) => {
  if (!inputTags.value.includes(tag)) {
    inputTags.value = [...inputTags.value, tag]; // создаём новый массив!
    popularTechnologies.value = popularTechnologies.value.filter(
      (t) => t !== tag
    );
  }
};
const removeTag = (tag: string) => {
  inputTags.value = inputTags.value.filter((t) => t !== tag);
  if (!popularTechnologies.value.includes(tag)) {
    popularTechnologies.value.push(tag);
  }
};
</script>
