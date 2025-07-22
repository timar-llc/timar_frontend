<template>
  <div class="flex items-start h-full mobile:justify-center flex-col">
    <div class="flex flex-col gap-2 mb-8">
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-arrow-left"
          variant="ghost"
          size="md"
          color="neutral"
          class="rounded-full border-1 border-white"
          @click="router.push(localePath(`/profile/${$route.params.username}`))"
        />
        <h2 class="text-2xl font-bold">
          {{ $t("profile_settings_title") }}
        </h2>
      </div>

      <p class="text-sm text-muted">
        {{ $t("profile_settings_description") }}
      </p>
    </div>

    <div class="flex w-full gap-8 mobile:flex-col">
      <div class="w-80 flex-shrink-0 mobile:w-full">
        <div class="flex flex-col gap-6">
          <div
            class="rounded-[8px] border border-muted p-6 flex flex-col gap-4 bg-card-bg"
          >
            <div class="flex gap-4 items-center">
              <UAvatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                width="60"
                height="60"
                class="rounded-full"
                size="xl"
              />
              <div class="flex flex-col">
                <h3 class="text-lg font-bold text-default">
                  {{ $route.params.username }}
                </h3>
                <p class="text-sm text-muted">Веб-разработчик</p>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex justify-between text-sm">
                <p class="text-muted">{{ $t("profile_fullness") }}</p>
                <p class="text-default">{{ profileFullness }}%</p>
              </div>
              <UProgress
                v-model="profileFullness"
                :max="100"
                :min="0"
                color="success"
              />
            </div>
          </div>

          <!-- Навигация -->
          <div class="flex flex-col gap-1">
            <span
              v-for="item in navigationItems"
              :key="item.key"
              @click="activeSection = item.key"
              class="flex gap-3 px-4 py-3 rounded-lg text-left transition-colors justify-start cursor-pointer"
              :class="[
                activeSection === item.key
                  ? 'bg-success text-black font-medium'
                  : 'text-muted hover:text-default hover:bg-card-bg',
              ]"
            >
              <UIcon :name="item.icon" class="w-5 h-5" />
              <span>{{ item.label }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Основной контент -->
      <div class="flex-1 bg-card-bg rounded-[8px] border border-muted p-6">
        <component :is="activeComponent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const activeSection = ref("basic");

const { t, locale } = useI18n();
const localePath = useLocalePath();

const navigationItems = [
  { key: "basic", label: t("basic_information.title"), icon: "i-lucide-user" },
  {
    key: "skills",
    label: t("skills_and_specialization.title"),
    icon: "i-lucide-briefcase",
  },
  {
    key: "notifications",
    label: t("notifications.title"),
    icon: "i-lucide-bell",
  },
  { key: "privacy", label: "Приватность", icon: "i-lucide-shield" },
  { key: "security", label: "Безопасность", icon: "i-lucide-lock" },
  { key: "preferences", label: "Предпочтения", icon: "i-lucide-settings" },
];

const activeComponent = computed(() => {
  switch (activeSection.value) {
    case "basic":
      return resolveComponent("ProfileSettingsBasicInfo");
    case "skills":
      return resolveComponent("ProfileSettingsSkills");
    case "notifications":
      return resolveComponent("ProfileSettingsNotifications");
    default:
      return resolveComponent("ProfileSettingsBasicInfo");
  }
});

const profileFullness = ref(50);
</script>
