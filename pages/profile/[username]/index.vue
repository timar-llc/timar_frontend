<template>
  <div class="flex flex-col gap-4">
    <div
      class="flex gap-4 items-center justify-between w-full mobile:flex-col mobile:gap-2"
    >
      <div class="flex gap-4 items-center w-full">
        <NuxtImg
          src="https://i.pravatar.cc/150"
          width="100"
          height="100"
          class="rounded-full"
        />
        <div class="flex flex-col">
          <h1 class="text-xl font-bold">{{ $route.params.username }}</h1>
          <p class="text-sm text-gray-500">Web Developer</p>
        </div>
      </div>
      <div class="flex gap-4 items-center">
        <NuxtLink :to="localePath(`/profile/${$route.params.username}/edit`)">
          <UButton color="success" variant="subtle" class="w-full">
            <span class="text-sm">Редактировать</span>
          </UButton>
        </NuxtLink>
      </div>
    </div>
    <p class="text-sm text-gray-500">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam Lorem,
      ipsum dolor sit amet consectetur adipisicing elit. Dolor, reiciendis.
      Consequatur natus repudiandae qui sint non. Facilis repudiandae doloremque
      corporis!
    </p>
  </div>
  <div
    class="grid grid-cols-4 w-full justify-between gap-6 mobile:grid-cols-1 tablet:grid-cols-2 mt-4"
  >
    <ProfileStatisticCard title="total_project_card" value="100" />
    <ProfileStatisticCard title="completed_projects_card" value="100" />
    <ProfileStatisticCard title="satisfied_clients_card" value="100" />
    <ProfileStatisticCard title="total_income_card" value="100" />
  </div>
  <h2 class="text-2xl font-bold mt-4">
    {{ $t("skills_and_specialization.title") }}
  </h2>
  <div
    class="grid grid-cols-3 w-full justify-between gap-6 mobile:grid-cols-1 tablet:grid-cols-2 mt-4"
  >
    <ProfileSkillCard />
    <ProfileSkillCard />
    <ProfileSkillCard />
  </div>
  <div
    class="flex justify-between items-center mt-4 mobile:flex-col mobile:gap-3"
  >
    <h2 class="text-2xl font-bold">{{ $t("portfolio_projects.title") }}</h2>
    <UTabs
      :items="items"
      color="neutral"
      :ui="{
        trigger: 'text-sm',
      }"
    />
  </div>

  <div class="flex flex-col w-full gap-6 mt-4">
    <ProfileProjectCard />
    <ProfileProjectCard />
  </div>
  <NuxtLink :to="localePath('/add-project/main')">
    <UButton
      color="success"
      variant="solid"
      class="w-full mt-4 h-10 justify-center"
      trailing-icon="i-lucide-plus"
    >
      <span class="text-sm">Добавить проект</span>
    </UButton>
  </NuxtLink>
  <div
    class="flex flex-col bg-card-bg w-full mt-4 p-7 rounded-[8px] dark:border-1 border-[#484848]"
  >
    <h2 class="text-xl font-bold">Отзывы клиентов</h2>
    <div class="flex flex-col gap-4 mt-4">
      <ProfileFeedbackCard />
      <ProfileFeedbackCard />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const localePath = useLocalePath();

const items = ref<TabsItem[]>([
  {
    label: "Все",
  },
  {
    label: "Веб",
  },
  {
    label: "Мобильные",
  },
  {
    label: "Дизайн",
  },
]);
</script>
