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
          :to="localePath('/')"
          :class="{ 'text-success': $route.path === localePath('/orders') }"
          >{{ t("common.header.orders") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/')"
          :class="{
            'text-success': $route.path === localePath('/achievements'),
          }"
          >{{ t("common.header.achievements") }}</NuxtLink
        >
        <NuxtLink
          :to="localePath('/tasks')"
          :class="{ 'text-success': $route.path === localePath('/tasks') }"
          >{{ t("common.header.tasks") }}</NuxtLink
        >
        <NuxtLink
          :to="localePath('/chats')"
          :class="{
            'text-success': $route.path.includes(localePath('/chats')),
          }"
          >{{ t("common.header.chats") }}</NuxtLink
        >
        <NuxtLink
          :to="localePath('/')"
          :class="{ 'text-success': $route.path === localePath('/statistics') }"
          >{{ t("common.header.statistics") }}</NuxtLink
        >
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
                $ {{ "13,543" }}
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
                class="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-black-200 rounded-lg shadow-lg border border-gray-200 dark:border-black-200 z-50 max-h-96 overflow-y-auto hover:bg-gray-100 dark:hover:bg-black-200"
              >
                <!-- Заголовок -->
                <div class="p-4 border-b border-gray-200 dark:border-black-200">
                  <div class="flex items-center justify-between">
                    <h3
                      class="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      {{ t("common.header.notifications") }}
                    </h3>
                    <UButton variant="ghost" size="sm" @click="markAllAsRead">
                      <UIcon name="i-lucide-check" class="w-4 h-4" />
                    </UButton>
                  </div>
                </div>

                <!-- Список уведомлений -->
                <div class="max-h-64 overflow-y-auto">
                  <div
                    v-if="notifications.length === 0"
                    class="p-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    {{ t("common.header.no_new_notifications") }}
                  </div>

                  <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                    :class="{
                      'bg-blue-50 dark:bg-blue-900/20': !notification.read,
                    }"
                    @click="handleNotificationClick(notification)"
                  >
                    <div class="flex items-start gap-3">
                      <div class="flex-shrink-0">
                        <div
                          class="w-8 h-8 rounded-full flex items-center justify-center"
                          :class="
                            notification.type === 'success'
                              ? 'bg-green-100 text-green-600'
                              : notification.type === 'warning'
                              ? 'bg-yellow-100 text-yellow-600'
                              : notification.type === 'error'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-blue-100 text-blue-600'
                          "
                        >
                          <UIcon
                            :name="getNotificationIcon(notification.type)"
                            class="w-4 h-4"
                          />
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p
                          class="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {{ notification.title }}
                        </p>
                        <p
                          class="text-sm text-gray-600 dark:text-gray-400 mt-1"
                        >
                          {{ notification.message }}
                        </p>
                        <p
                          class="text-xs text-gray-500 dark:text-gray-500 mt-2"
                        >
                          {{ formatTime(notification.createdAt) }}
                        </p>
                      </div>
                      <div v-if="!notification.read" class="flex-shrink-0">
                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="p-4 border-t border-gray-200 dark:border-gray-700">
                  <UButton
                    variant="ghost"
                    class="w-full justify-center"
                    @click="navigateToAllNotifications"
                  >
                    {{ t("common.header.show_all_notifications") }}
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
import type { DropdownMenuItem } from "@nuxt/ui";
const { t, setLocale } = useI18n();
const { isAuthenticated, user } = useUser();
const localePath = useLocalePath();
const colorMode = useColorMode();
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

// Моковые данные уведомлений
const notifications = ref([
  {
    id: 1,
    title: "Новый заказ",
    message: "Вы получили новый заказ на разработку сайта",
    type: "success",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 минут назад
  },
  {
    id: 2,
    title: "Оплата получена",
    message: "Ваш платеж в размере $500 был успешно обработан",
    type: "success",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 часа назад
  },
  {
    id: 3,
    title: "Срок проекта",
    message: "До завершения проекта 'E-commerce' осталось 3 дня",
    type: "warning",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 день назад
  },
  {
    id: 4,
    title: "Системное уведомление",
    message: "Обновление системы запланировано на завтра",
    type: "info",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 дня назад
  },
]);

// Computed для подсчета непрочитанных уведомлений
const unreadNotificationsCount = computed(() => {
  return notifications.value.filter((n) => !n.read).length;
});

// Методы для работы с уведомлениями
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const markAllAsRead = () => {
  notifications.value.forEach((notification) => {
    notification.read = true;
  });
};

const handleNotificationClick = (notification: any) => {
  notification.read = true;
  // TODO: Добавить логику для обработки клика по уведомлению
  console.log("Клик по уведомлению:", notification);
};

const navigateToAllNotifications = () => {
  showNotifications.value = false;
  // TODO: Добавить страницу всех уведомлений
  console.log("Переход к странице уведомлений");
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return "i-lucide-check-circle";
    case "warning":
      return "i-lucide-alert-triangle";
    case "error":
      return "i-lucide-x-circle";
    case "info":
      return "i-lucide-info";
    default:
      return "i-lucide-bell";
  }
};

const formatTime = (date: any) => {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes} мин назад`;
  } else if (hours < 24) {
    return `${hours} ч назад`;
  } else {
    return `${days} дн назад`;
  }
};

// Закрытие dropdown при клике вне его
const closeNotificationsOnClickOutside = (event: any) => {
  if (showNotifications.value && !event.target.closest(".relative")) {
    showNotifications.value = false;
  }
};

// Добавляем слушатель кликов
onMounted(() => {
  document.addEventListener("click", closeNotificationsOnClickOutside);
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
