<template>
  <div class="flex flex-col gap-6">
    <h3 class="text-xl font-bold">
      {{ $t("skills_and_specialization.title") }}
    </h3>

    <div class="flex flex-col gap-4">

      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">Технологии</label>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="tech in selectedTechnologies"
            :key="tech"
            color="success"
            variant="outline"
            class="cursor-pointer"
            @click="removeTechnology(tech)"
          >
            {{ tech }}
          </UBadge>
        </div>
        <USelectMenu
          v-model="newTechnology"
          :items="availableTechnologies"
          placeholder="Добавить технологию"
          @update:model-value="addTechnology"
        />
      </div>

    
    </div>
  </div>
</template>

<script setup lang="ts">
const skills = ref("Vue.js, Nuxt.js, TypeScript, Tailwind CSS, Node.js");
const experience = ref("3-5 лет");
const englishLevel = ref("B2");
const newTechnology = ref("");

const selectedTechnologies = ref([
  "Vue.js",
  "Nuxt.js",
  "TypeScript",
  "Tailwind CSS",
]);

const availableTechnologies = [
  "React",
  "Angular",
  "Svelte",
  "Next.js",
  "Express.js",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "AWS",
];

const experienceOptions = [
  "Без опыта",
  "До 1 года",
  "1-3 года",
  "3-5 лет",
  "5-10 лет",
  "Более 10 лет",
];

const englishLevels = [
  "A1 - Начальный",
  "A2 - Элементарный",
  "B1 - Средний",
  "B2 - Выше среднего",
  "C1 - Продвинутый",
  "C2 - В совершенстве",
];

const addTechnology = (tech: string) => {
  if (tech && !selectedTechnologies.value.includes(tech)) {
    selectedTechnologies.value.push(tech);
  }
  newTechnology.value = "";
};

const removeTechnology = (tech: string) => {
  selectedTechnologies.value = selectedTechnologies.value.filter(
    (t) => t !== tech
  );
};
</script>
