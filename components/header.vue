<template>
  <!-- Desktop Header -->
  <div
    class="flex gap-14 max-h-[51px] h-full items-center w-full mobile:hidden mb-6"
  >
    <NuxtLink :to="localePath('/')">
      <h2 class="text-2xl font-bold">{{ t("brand") }}</h2>
    </NuxtLink>
    <div class="flex justify-between w-full ml-[50px]">
      <div
        class="flex items-center font-bold text-sm w-full text-[14px] gap-[40px]"
      >
        <NuxtLink
          :to="localePath('/orders')"
          :class="{
            'dark:text-success ': $route.path === localePath('/orders'),
            'text-gray-900 dark:text-gray-300':
              $route.path !== localePath('/orders'),
          }"
          class="transition-colors duration-200 relative"
          >{{ t("common.header.orders") }}
          <span
            v-if="$route.path === localePath('/orders')"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-success rounded-full hidden dark:block"
          ></span>
        </NuxtLink>
        <NuxtLink
          :to="localePath('/achievements')"
          :class="{
            'dark:text-success': $route.path === localePath('/achievements'),
            'text-gray-900 dark:text-gray-300':
              $route.path !== localePath('/achievements'),
          }"
          class="transition-colors duration-200 relative"
          >{{ t("common.header.achievements") }}
          <span
            v-if="$route.path === localePath('/achievements')"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-success rounded-full hidden dark:block"
          ></span>
        </NuxtLink>
        <NuxtLink
          :to="localePath('/tasks')"
          :class="{
            'dark:text-success': $route.path === localePath('/tasks'),
            'text-gray-900 dark:text-gray-300':
              $route.path !== localePath('/tasks'),
          }"
          class="transition-colors duration-200 relative"
          >{{ t("common.header.tasks") }}
          <span
            v-if="$route.path === localePath('/tasks')"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-success rounded-full hidden dark:block"
          ></span>
        </NuxtLink>
        <NuxtLink
          :to="localePath('/chats')"
          :class="{
            'dark:text-success': $route.path.includes(localePath('/chats')),
            'text-gray-900 dark:text-gray-300': !$route.path.includes(
              localePath('/chats')
            ),
          }"
          class="transition-colors duration-200 relative"
          >{{ t("common.header.chats") }}
          <span
            v-if="$route.path.includes(localePath('/chats'))"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-success rounded-full hidden dark:block"
          ></span>
        </NuxtLink>
        <NuxtLink
          :to="localePath('/statistics')"
          :class="{
            'dark:text-success': $route.path === localePath('/statistics'),
            'text-gray-900 dark:text-gray-300':
              $route.path !== localePath('/statistics'),
          }"
          class="transition-colors duration-200 relative"
          >{{ t("common.header.statistics") }}
          <span
            v-if="$route.path === localePath('/statistics')"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-success rounded-full hidden dark:block"
          ></span>
        </NuxtLink>
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

        <!-- Блок баланса для авторизованных пользователей -->
        <div v-if="isAuthenticated" class="flex items-center gap-4 min-w-fit">
          <div
            @click="navigateTo(localePath('wallet'))"
            class="bg-gray-100 dark:bg-black rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-success transition-all"
          >
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-wallet" class="w-4 h-4" />
              <span
                class="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap"
              >
                ₽ {{ formatNumber(user?.totalBalance) }}
              </span>
            </div>
          </div>

          <!-- Блок уведомлений -->
          <div class="relative" v-if="isAuthenticated">
            <UButton
              variant="ghost"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-black-200 transition-colors duration-200 cursor-pointer"
              @click="toggleNotifications"
            >
              <UIcon
                name="i-lucide-bell"
                class="text-black dark:text-white w-4 h-4"
              />
              <!-- Badge для количества уведомлений -->
              <div
                v-if="unreadNotificationsCount > 0"
                class="absolute right-0 top-0 bg-red-500 text-white text-[10px] rounded-full w-[14px] h-[14px] flex items-center justify-center"
              >
                {{ unreadNotificationsCount }}
              </div>
            </UButton>

            <!-- Dropdown с уведомлениями -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-1"
            >
              <div
                v-if="showNotifications"
                class="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[500px] overflow-hidden flex flex-col"
              >
                <!-- Заголовок -->
                <div
                  class="p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
                >
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ t("common.header.notifications") }}
                    </h3>
                    <UButton
                      variant="ghost"
                      size="sm"
                      class="text-gray-600 dark:text-gray-400 hover:text-success dark:hover:text-success"
                      @click="markAllAsRead"
                    >
                      <UIcon name="i-lucide-check-circle-2" class="w-5 h-5" />
                    </UButton>
                  </div>
                </div>

                <!-- Список уведомлений -->
                <div class="flex-1 overflow-y-auto">
                  <div
                    v-if="isLoadingNotifications"
                    class="flex justify-center items-center py-8"
                  >
                    <UIcon
                      name="i-lucide-loader-2"
                      class="w-6 h-6 animate-spin text-success"
                    />
                  </div>
                  <div
                    v-else-if="notifications.length === 0"
                    class="p-8 text-center"
                  >
                    <div
                      class="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                    >
                      <UIcon
                        name="i-lucide-bell-off"
                        class="w-8 h-8 text-gray-400 dark:text-gray-500"
                      />
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ t("common.header.no_new_notifications") }}
                    </p>
                  </div>

                  <div
                    v-for="notification in notifications"
                    :key="notification.uuid"
                    class="group relative p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer"
                    :class="{
                      'bg-blue-50/50 dark:bg-blue-900/10': !notification.readedAt,
                    }"
                    @click="handleNotificationClick(notification)"
                  >
                    <!-- Индикатор непрочитанного -->
                    <div
                      v-if="!notification.readedAt"
                      class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"
                    ></div>

                    <div class="flex items-start gap-4 pl-2">
                      <div class="flex-shrink-0">
                        <div
                          class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-110"
                          :class="
                            notification.icon === 'success'
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                              : notification.icon === 'warning'
                              ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
                              : notification.icon === 'error'
                              ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white'
                              : 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white'
                          "
                        >
                          <UIcon
                            :name="getNotificationIcon(notification.icon)"
                            class="w-6 h-6"
                          />
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div
                          class="flex items-start justify-between gap-2 mb-1"
                        >
                          <p
                            class="text-sm font-bold text-gray-900 dark:text-white"
                          >
                            {{ notification.title }}
                          </p>
                          <div
                            v-if="!notification.readedAt"
                            class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5"
                          ></div>
                        </div>
                        <p
                          class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2"
                        >
                          {{ notification.description }}
                        </p>
                        <div class="flex items-center gap-2 mt-2">
                          <UIcon
                            name="i-lucide-clock"
                            class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500"
                          />
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            {{ formatTimeAgo(notification.createdAt) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div
                  class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                >
                  <UButton
                    variant="ghost"
                    color="success"
                    class="w-full justify-center font-semibold hover:bg-success/10"
                    @click="navigateToAllNotifications"
                  >
                    {{ t("common.header.show_all_notifications") }}
                    <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-2" />
                  </UButton>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <div class="flex items-center gap-2" v-if="!isAuthenticated">
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

        <!-- Блок профиля для авторизованных пользователей -->
        <div v-else class="flex items-center gap-2">
          <UDropdownMenu
            :items="userMenuItems"
            :ui="{
              content:
                'dark:bg-black bg-white border-black border-1 border-solid',
              itemLeadingIcon: 'text-black dark:text-white',
            }"
          >
            <UButton
              variant="ghost"
              class="flex items-center gap-3 p-2 rounded-lg dark:hover:bg-black-200 hover:text-white transition-colors duration-200 hover:bg-gray-100"
            >
              <UAvatar
                :src="
                  user?.avatarUrl || 'https://i.pravatar.cc/150?u=' + user?.uuid
                "
                :alt="user?.firstName || 'Пользователь'"
                size="sm"
                class="ring-2 ring-success"
              />
              <div class="flex flex-col items-start text-left">
                <span
                  class="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap"
                >
                  {{ user?.firstName || "Пользователь" }}
                  {{ user?.lastName || "" }}
                </span>
                <span
                  class="text-xs text-gray-400 dark:text-success whitespace-nowrap"
                >
                  Premium
                </span>
              </div>
              <UIcon
                name="i-lucide-chevron-down"
                class="w-4 h-4 text-gray-500"
              />
            </UButton>
          </UDropdownMenu>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Header -->
  <div
    class="flex items-center justify-between w-full p-4 mobile:flex hidden mb-6"
  >
    <NuxtLink :to="localePath('/')">
      <h2 class="text-xl font-bold">{{ t("brand") }}</h2>
    </NuxtLink>

    <div class="flex items-center gap-3">
      <!-- Theme Toggle -->
      <ClientOnly v-if="!colorMode?.forced">
        <UButton
          :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
          color="neutral"
          class="dark:hover:border-white border border-transparent border-solid transition-colors duration-300 bg-dark rounded-[12px] hover:bg-dark hover:border-black p-2 cursor-pointer"
          variant="ghost"
          @click="isDark = !isDark"
        />
        <template #fallback>
          <div class="size-8" />
        </template>
      </ClientOnly>

      <!-- Language Toggle -->
      <ClientOnly>
        <UDropdownMenu
          color="success"
          variant="ghost"
          :items="items"
          :ui="{
            content: 'dark:bg-black bg-white',
          }"
        >
          <UButton
            icon="material-symbols-light:language"
            color="neutral"
            class="dark:hover:border-white border border-transparent border-solid transition-colors duration-300 bg-dark rounded-[12px] hover:bg-dark hover:border-black p-2 cursor-pointer"
            variant="ghost"
          />
        </UDropdownMenu>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import type { DropdownMenuItem } from "@nuxt/ui";
import { useNotificationApi } from "@/composables/api/useNotificationApi";
import { usePluralization } from "@/composables/usePluralization";
import { formatNumber } from "@/utils/formatNumber";
import { useNotificationsStore } from "@/stores/notifications/useNotificationsStore";

const { t, setLocale } = useI18n();
const { isAuthenticated, user } = useUser();
const localePath = useLocalePath();
const colorMode = useColorMode();
const { getNotifications, updateNotification } = useNotificationApi();
const { formatTimeAgo } = usePluralization();
const notificationsStore = useNotificationsStore();
const items = computed<DropdownMenuItem[]>(() => [
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

// Меню пользователя
const { logout } = useUser();

// Состояние уведомлений
const showNotifications = ref(false);

// Computed для подсчета непрочитанных уведомлений
const unreadNotificationsCount = computed(() => {
  return notificationsStore.unreadCount;
});

// Получаем уведомления из store (первые 10 для dropdown)
const notifications = computed(() => {
  return notificationsStore.notifications.slice(0, 10);
});

const isLoadingNotifications = computed(() => {
  return notificationsStore.isLoading;
});

// Загрузка уведомлений
const loadNotifications = async () => {
  if (!isAuthenticated.value) return;

  notificationsStore.setLoading(true);
  try {
    const { data } = await getNotifications({
      take: 10,
      skip: 0,
    });

    const raw = data.value as any;
    let items: any[] = [];

    if (Array.isArray(raw)) {
      items = raw;
    } else if (raw?.items && Array.isArray(raw.items)) {
      items = raw.items;
    } else if (raw?.data && Array.isArray(raw.data)) {
      items = raw.data;
    } else {
      items = [];
    }

    const mappedNotifications = items.map((n) => {
      const created =
        n.createdAt && !isNaN(new Date(n.createdAt).getTime())
          ? new Date(n.createdAt)
          : new Date();

      return {
        uuid: n.uuid,
        title: n.title || "",
        description: n.description || "",
        slug: n.slug || "",
        user: n.user || null,
        icon: n.icon || "info",
        readedAt: n.readedAt || null,
        createdAt: created,
      };
    });

    notificationsStore.setNotifications(mappedNotifications);
  } catch (error) {
    console.error("Error loading notifications:", error);
    notificationsStore.setError("Failed to load notifications");
  } finally {
    notificationsStore.setLoading(false);
  }
};

// Методы для работы с уведомлениями
const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value;
  if (
    showNotifications.value &&
    notificationsStore.notifications.length === 0
  ) {
    await loadNotifications();
  }
};

const markAllAsRead = async () => {
  if (!isAuthenticated.value) return;

  try {
    const now = new Date();
    await Promise.allSettled(
      notificationsStore.notifications
        .filter((notification) => !notification.readedAt && notification.uuid)
        .map((notification) =>
          updateNotification(notification.uuid, now).catch(() => null)
        )
    );

    notificationsStore.markAllAsRead();
  } catch (error) {
    console.error("Error marking all as read:", error);
  }
};

const handleNotificationClick = async (notification: any) => {
  if (!notification.readedAt && notification.uuid) {
    try {
      await updateNotification(notification.uuid, new Date());
      notificationsStore.markAsRead(notification.uuid);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  // Закрываем dropdown после клика
  showNotifications.value = false;
};

const navigateToAllNotifications = () => {
  showNotifications.value = false;
  navigateTo(useLocalePath()("/notifications"));
};

const getNotificationIcon = (icon: string) => {
  switch (icon) {
    case "success":
      return "i-lucide-check-circle"
    case "warning":
      return "i-lucide-alert-triangle";
    case "error":
      return "i-lucide-x-circle"
    case "info":
      return "i-lucide-info"
    default:
      return "i-lucide-bell"
  }
};

// Закрытие dropdown при клике вне его
const closeNotificationsOnClickOutside = (event: any) => {
  if (showNotifications.value && !event.target.closest(".relative")) {
    showNotifications.value = false;
  }
};

// Загружаем уведомления при монтировании, если пользователь авторизован
watch(
  isAuthenticated,
  async (newVal) => {
    if (newVal) {
      await loadNotifications();
    } else {
      notificationsStore.clearNotifications();
    }
  },
  { immediate: true }
);

// Добавляем слушатель кликов
onMounted(() => {
  document.addEventListener("click", closeNotificationsOnClickOutside);
  if (isAuthenticated.value) {
    loadNotifications();
  }
});

onUnmounted(() => {
  document.removeEventListener("click", closeNotificationsOnClickOutside);
});

const userMenuItems = computed<DropdownMenuItem[]>(() => [
  {
    label: t("common.header.profile"),
    icon: "i-lucide-user",
    onClick: () => {
      navigateTo(localePath(`/profile/${user.value?.uuid}`));
    },
  },
  {
    label: t("common.header.settings"),
    icon: "i-lucide-settings",
    onClick: () => {
      navigateTo(localePath(`/profile/${user.value?.uuid}/edit`));
    },
  },
  {
    label: t("common.header.notifications"),
    icon: "i-lucide-bell",
    onClick: () => {
      // TODO: Добавить страницу уведомлений
      console.log("Уведомления");
    },
  },
  {
    label: t("common.header.security"),
    icon: "i-lucide-shield",
    onClick: () => {
      // TODO: Добавить страницу безопасности
      console.log("Безопасность");
    },
  },
  {
    label: t("common.header.wallet"),
    icon: "i-lucide-wallet",
    onClick: () => {
      navigateTo(localePath("/wallet"));
    },
  },
  {
    label: t("common.header.logout"),
    icon: "i-lucide-log-out",
    onClick: async () => {
      await logout();
    },
  },
]);

// Мобильное меню
const mobileMenuItems = computed<DropdownMenuItem[]>(() => {
  const baseItems: DropdownMenuItem[] = [
    {
      label: isDark.value
        ? t("common.header.light_theme")
        : t("common.header.dark_theme"),
      icon: isDark.value ? "i-lucide-sun" : "i-lucide-moon",
      onClick: () => {
        isDark.value = !isDark.value;
      },
    },
    {
      label: t("common.header.language"),
      icon: "material-symbols-light:language",
      children: items.value,
    },
  ];

  if (isAuthenticated.value) {
    // Добавляем элементы профиля
    baseItems.push(
      {
        label: t("common.header.profile"),
        icon: "i-lucide-user",
        onClick: () => {
          navigateTo(localePath(`/profile/${user.value?.uuid}`));
        },
      },
      {
        label: t("common.header.settings"),
        icon: "i-lucide-settings",
        onClick: () => {
          navigateTo(localePath(`/profile/${user.value?.uuid}/edit`));
        },
      },
      {
        label: t("common.header.notifications"),
        icon: "i-lucide-bell",
        onClick: () => {
          console.log("Уведомления");
        },
      },
      {
        label: t("common.header.security"),
        icon: "i-lucide-shield",
        onClick: () => {
          console.log("Безопасность");
        },
      },
      {
        label: t("common.header.wallet"),
        icon: "i-lucide-wallet",
        onClick: () => {
          navigateTo(localePath("/wallet"));
        },
      },
      {
        label: t("common.header.logout"),
        icon: "i-lucide-log-out",
        onClick: async () => {
          await logout();
        },
      }
    );
  } else {
    // Добавляем кнопки входа/регистрации
    baseItems.push(
      {
        label: t("common.header.sign_in"),
        icon: "i-lucide-log-in",
        onClick: () => {
          navigateTo(localePath("/sign-in"));
        },
      },
      {
        label: t("common.header.sign_up"),
        icon: "i-lucide-user-plus",
        onClick: () => {
          navigateTo(localePath("/sign-up"));
        },
      }
    );
  }

  return baseItems;
});
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
