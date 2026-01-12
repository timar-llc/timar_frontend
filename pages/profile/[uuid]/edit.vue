<script setup lang="ts">
import { computed, ref, resolveComponent, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import type { IUser } from "@/types/user.interface";
import { useUserApi } from "@/composables/api/useUserApi";
import { useUser } from "@/composables/useUser";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { getUser } = useUserApi();
const { user: currentUser, fetchUser, logout } = useUser();

const user = ref<IUser | null>(currentUser.value || null);
const isLoading = ref(false);
const activeSection = ref("basic");
const profileCompleteness = computed(() =>
  Math.max(0, Math.min(100, Number(user.value?.profileCompleteness ?? 0)))
);
const normalizeUser = (raw: any): IUser => ({
  ...raw,
  lastOnlineAt: raw?.lastOnlineAt ? new Date(raw.lastOnlineAt) : null,
  createdAt: raw?.createdAt ? new Date(raw.createdAt) : new Date(),
  updatedAt: raw?.updatedAt ? new Date(raw.updatedAt) : new Date(),
});

const loadUser = async () => {
  const uuid = route.params.uuid ? String(route.params.uuid) : "";
  if (!uuid) {
    return;
  }

  isLoading.value = true;
  try {
    if (!currentUser.value) {
      await fetchUser();
    }

    if (currentUser.value && currentUser.value.uuid === uuid) {
      user.value = currentUser.value;
      return;
    }

    const { data, error } = await getUser(uuid);
    if (data.value && !error.value) {
      user.value = normalizeUser(data.value as IUser);
    } else {
      user.value = null;
    }
  } catch (err) {
    console.error("Failed to load user profile", err);
    user.value = null;
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => route.params.uuid,
  () => {
    loadUser();
  },
  { immediate: true }
);

// Синхронизация локального пользователя, если обновился currentUser (например, после сохранения профиля)
watch(
  () => currentUser.value,
  (val) => {
    const routeUuid = route.params.uuid ? String(route.params.uuid) : "";
    if (val && routeUuid && val.uuid === routeUuid) {
      user.value = val;
    }
  },
  { immediate: false }
);

const displayName = computed(() => {
  const first = user.value?.firstName?.trim() || "";
  const last = user.value?.lastName?.trim() || "";
  const full = `${first} ${last}`.trim();

  if (full) return full;
  if (user.value?.username) return user.value.username;
  return t("profile_settings_title");
});

const displaySpecialization = computed(
  () =>
    user.value?.specialization?.trim() ||
    t("profile.specialization_not_set", "—")
);

const navigationItems = computed(() => [
  { key: "basic", label: t("basic_information.title"), icon: "i-lucide-user", disabled: false },
  {
    key: "skills",
    label: t("skills_and_specialization.title"),
    icon: "i-lucide-briefcase",
    disabled: false,
  },
  {
    key: "notifications",
    label: t("notifications.title"),
    icon: "i-lucide-bell",
    disabled: true,
  },
  {
    key: "privacy",
    label: t("privacy.title"),
    icon: "i-lucide-shield",
    disabled: true,
  },
  {
    key: "security",
    label: t("common.header.security") || "Security",
    icon: "i-lucide-lock",
    disabled: true,
  },
  {
    key: "preferences",
    label: t("common.preferences") || "Preferences",
    icon: "i-lucide-settings",
    disabled: true,
  },
]);

const handleNavigationClick = (item: typeof navigationItems.value[0]) => {
  if (item.disabled) {
    return;
  }
  activeSection.value = item.key;
};

const handleLogout = async () => {
  await logout();
};

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

const handleUserUpdated = (updated: IUser) => {
  user.value = normalizeUser(updated);
};
</script>

<template>
  <div class="min-h-screen bg-gradient-content rounded-xl">
    <!-- Header -->
    <div class="relative bg-gradient-nav">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div class="flex items-center gap-3">
            <UButton
              icon="i-lucide-arrow-left"
              variant="outline"
              size="sm"
              color="neutral"
              class="rounded-full"
              @click="router.back()"
            />
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ t("profile_settings_title") }}
              </h1>
              <p class="mt-2 text-gray-600 dark:text-gray-300">
                {{ t("profile_settings_description") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Sidebar -->
        <div class="lg:col-span-4 space-y-4">
          <div
            class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/70 p-5 shadow-sm"
          >
            <div class="flex items-center gap-4">
              <div class="relative">
                <UAvatar
                  :src="user?.avatarUrl || undefined"
                  width="72"
                  height="72"
                  class="rounded-full ring-2 ring-success shadow-md"
                  size="xl"
                  :alt="displayName"
                />
              </div>
              <div class="flex flex-col gap-1 min-w-0">
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white truncate"
                >
                  {{ displayName }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ displaySpecialization }}
                </p>
              </div>
            </div>
            <div class="mt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <p class="text-gray-500 dark:text-gray-400">
                  {{ t("profile_fullness") }}
                </p>
                <p class="text-gray-900 dark:text-white font-semibold">
                  {{ user?.profileCompleteness }}%
                </p>
              </div>
              <UProgress
                v-model="profileCompleteness"
                v-if="user?.profileCompleteness"
              />
            </div>
          </div>

          <div
            class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/70 p-3 shadow-sm"
          >
            <div class="flex flex-col gap-2">
              <button
                v-for="item in navigationItems"
                :key="item.key"
                @click="handleNavigationClick(item)"
                :disabled="item.disabled"
                class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left"
                :class="[
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600'
                    : activeSection === item.key
                      ? 'bg-success text-black shadow-sm scale-[1.01]'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/70',
                ]"
              >
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="
                    item.disabled
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                      : activeSection === item.key
                        ? 'bg-black/10 text-black'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  "
                >
                  <UIcon :name="item.icon" class="w-5 h-5" />
                </div>
                <span class="font-medium truncate">{{ item.label }}</span>
              </button>
              <button
                @click="handleLogout"
                class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 mt-2"
              >
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400"
                >
                  <UIcon name="i-lucide-log-out" class="w-5 h-5" />
                </div>
                <span class="font-medium truncate">{{ t("common.header.logout") || "Выйти" }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Main content -->
        <div
          class="lg:col-span-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/70 p-6 shadow-sm"
        >
          <component
            :is="activeComponent"
            :user="user"
            @user-updated="handleUserUpdated"
          />
        </div>
      </div>
    </div>
  </div>
</template>
