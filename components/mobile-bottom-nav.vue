<template>
  <!-- Mobile Bottom Navigation -->
  <div
    class="mobile:flex hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800"
  >
    <div class="flex items-center justify-around w-full px-2 py-1">
      <!-- Home Tab -->
      <NuxtLink
        :to="localePath('/')"
        class="flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors duration-200"
        :class="
          isActive('/') ? 'text-success' : 'text-gray-500 dark:text-gray-400'
        "
      >
        <UIcon name="i-lucide-home" class="w-6 h-6 mb-1" />
        <span class="text-xs font-medium">{{ t("common.header.home") }}</span>
      </NuxtLink>

      <!-- Feed Tab -->
      <NuxtLink
        :to="localePath('/feed')"
        class="flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors duration-200"
        :class="
          isActive('/feed')
            ? 'text-success'
            : 'text-gray-500 dark:text-gray-400'
        "
      >
        <UIcon name="i-lucide-layout-grid" class="w-6 h-6 mb-1" />
        <span class="text-xs font-medium">{{ t("common.header.feed") }}</span>
      </NuxtLink>

      <!-- Messages Tab -->
      <NuxtLink
        :to="localePath('/messages')"
        class="flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors duration-200"
        :class="
          isActive('/messages')
            ? 'text-success'
            : 'text-gray-500 dark:text-gray-400'
        "
      >
        <UIcon name="i-lucide-message-circle" class="w-6 h-6 mb-1" />
        <span class="text-xs font-medium">{{
          t("common.header.messages")
        }}</span>
      </NuxtLink>

      <!-- Wallet Tab -->
      <NuxtLink
        :to="localePath('/wallet')"
        class="flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors duration-200"
        :class="
          isActive('/wallet')
            ? 'text-success'
            : 'text-gray-500 dark:text-gray-400'
        "
      >
        <UIcon name="i-lucide-wallet" class="w-6 h-6 mb-1" />
        <span class="text-xs font-medium">{{ t("common.header.wallet") }}</span>
      </NuxtLink>

      <!-- Profile Tab -->
      <button
        v-if="!isAuthenticated"
        @click="navigateToSignIn"
        class="flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors duration-200 text-gray-500 dark:text-gray-400"
      >
        <UIcon name="i-lucide-user" class="w-6 h-6 mb-1" />
        <span class="text-xs font-medium">{{
          t("common.header.sign_in")
        }}</span>
      </button>

      <!-- Profile Dropdown for authenticated users -->
      <UDropdownMenu
        v-else
        :items="profileMenuItems"
        :ui="{
          content:
            'dark:bg-gray-900 bg-white shadow-lg border border-gray-200 dark:border-gray-700 mb-2',
          item: 'hover:bg-gray-100 dark:hover:bg-gray-800',
        }"
        :popper="{ placement: 'top-end' }"
      >
        <button
          class="flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors duration-200"
          :class="
            isProfileActive
              ? 'text-success'
              : 'text-gray-500 dark:text-gray-400'
          "
        >
          <UAvatar
            :src="
              user?.avatarUrl || 'https://i.pravatar.cc/150?u=' + user?.uuid
            "
            :alt="user?.firstName || 'Пользователь'"
            size="xs"
            class="w-6 h-6 mb-1 ring-2 ring-success"
          />
          <span class="text-xs font-medium">{{
            t("common.header.profile")
          }}</span>
        </button>
      </UDropdownMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const { t } = useI18n();
const { isAuthenticated, user, logout } = useUser();
const localePath = useLocalePath();
const route = useRoute();

// Check if current route is active
const isActive = (path: string) => {
  const currentPath = route.path;
  if (path === "/") {
    return currentPath === "/";
  }
  return currentPath.includes(path);
};

// Check if profile section is active
const isProfileActive = computed(() => {
  return route.path.includes("/profile");
});

// Profile menu items
const profileMenuItems = ref<DropdownMenuItem[]>([
  {
    label: "Мой профиль",
    icon: "i-lucide-user",
    onClick: () => {
      navigateTo(
        localePath(`/profile/${user.value?.uuid}`)
      );
    },
  },
  {
    label: "Настройки",
    icon: "i-lucide-settings",
    onClick: () => {
      navigateTo(
        localePath(`/profile/${user.value?.uuid}/edit`)
      );
    },
  },
  {
    label: "Уведомления",
    icon: "i-lucide-bell",
    onClick: () => {
      console.log("Уведомления");
    },
  },
  {
    label: "Безопасность",
    icon: "i-lucide-shield",
    onClick: () => {
      console.log("Безопасность");
    },
  },
  {
    label: "Выйти",
    icon: "i-lucide-log-out",
    onClick: async () => {
      await logout();
    },
  },
]);

// Navigation methods
const navigateToSignIn = () => {
  navigateTo(localePath("/sign-in"));
};
</script>
