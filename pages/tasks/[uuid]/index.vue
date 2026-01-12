<template>
  <div class="min-h-screen bg-gradient-content rounded-2xl">
    <!-- Header -->
    <div class="shadow-sm bg-gradient-nav">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center gap-4">
          <NuxtLink :to="localePath('/tasks')">
            <UButton
              color="neutral"
              variant="outline"
              size="sm"
              icon="i-lucide-arrow-left"
            >
              {{ t("task.back_to_tasks") }}
            </UButton>
          </NuxtLink>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ task?.title || t("task.loading") }}
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              {{ t("task.task_details") }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div
      v-if="isLoading || taskPending"
      class="flex justify-center items-center py-12"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-success"
      ></div>
    </div>

    <div v-else-if="!task" class="text-center py-12">
      <UIcon
        name="i-lucide-file-x"
        class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
      />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ t("task.not_found") }}
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        {{ t("task.not_found_description") }}
      </p>
      <NuxtLink :to="localePath('/tasks')">
        <UButton color="success" variant="solid" size="lg">
          {{ t("task.back_to_tasks") }}
        </UButton>
      </NuxtLink>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Task Information - Full Width at Top -->
      <div class="mb-8">
        <div
          class="bg-card-bg rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {{ task.title }}
              </h2>
              <div
                class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4"
              >
                <span
                  >{{ t("task.published") }}
                  {{ formatTimeAgo(task.createdAt) }}</span
                >
                <span>•</span>
                <span
                  >{{ formatPlural(task.respondes?.length || 0, "respondes") }}
                </span>
              </div>
              <div class="flex flex-wrap gap-2 mb-4">
                <UBadge
                  v-if="task.category"
                  color="success"
                  :variant="!isDark ? 'solid' : 'soft'"
                  size="sm"
                >
                  {{ task.category.title }}
                </UBadge>
                <UBadge
                  :color="complexityBadgeColor"
                  :variant="!isDark ? 'solid' : 'soft'"
                  size="sm"
                >
                  {{ complexityLabel }}
                </UBadge>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold dark:text-success mb-1">
                {{ formatPrice(task.price) }} ₽
              </div>
            </div>
          </div>

          <div class="prose dark:prose-invert max-w-none">
            <p
              class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
            >
              {{ task.description }}
            </p>
          </div>

          <!-- Files -->
          <div
            v-if="task.files && task.files.length > 0"
            class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              {{ t("task.files") }}
            </h3>
            <div class="flex flex-wrap gap-2">
              <a
                v-for="file in task.files"
                :key="file.uuid"
                :href="file.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <UIcon
                  name="i-lucide-file"
                  class="w-4 h-4 text-gray-600 dark:text-gray-400"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  {{ getFileName(file.url) }}
                </span>
                <UIcon
                  name="i-lucide-external-link"
                  class="w-3 h-3 text-gray-400"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section - respondes and Customer Info -->
      <div class="flex gap-8 mobile:flex-col">
        <!-- Left Sidebar - respondes -->
        <div class="desktop:w-2/3 w-full" v-if="task.user?.uuid === user?.uuid">
          <div
            class="bg-card-bg rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-8"
          >
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ formatPlural(task.respondes?.length || 0, "respondes") }}
              </h3>
              <USelect
                v-model="respondesort"
                :items="respondesortOptions"
                size="sm"
                class="w-40 bg-card-bg"
                color="neutral"
                variant="outline"
                :ui="{
                  content: 'bg-card-bg w-fit',
                  arrow: 'text-white',
                  itemLeadingIcon: 'text-white',
                }"
              />
            </div>

            <!-- Response Cards -->
            <div class="space-y-4 max-h-96 overflow-y-auto">
              <div
                v-for="responde in task.respondes"
                :key="responde.uuid"
                class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
              >
                <div class="flex items-start gap-3 mb-3">
                  <UAvatar
                    :src="
                      responde.user.avatarUrl || 'https://i.pravatar.cc/150'
                    "
                    :alt="
                      responde.user.firstName + ' ' + responde.user.lastName
                    "
                    size="xl"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <NuxtLink
                        :to="localePath(`/profile/${responde.user.uuid}`)"
                      >
                        <h4
                          class="text-sm font-medium text-gray-900 dark:text-white truncate dark:hover:text-success hover:text-black-200"
                        >
                          {{
                            responde.user.firstName +
                            " " +
                            responde.user.lastName
                          }}
                        </h4>
                      </NuxtLink>
                    </div>
                    <div class="flex items-center gap-1 mb-2">
                      <UIcon
                        name="i-lucide-star"
                        class="w-3 h-3 text-yellow-500 fill-current"
                      />
                      <span class="text-xs text-gray-600 dark:text-gray-300">
                        {{ responde.user.rating }}
                      </span>
                    </div>
                  </div>
                </div>

                <p
                  class="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2"
                >
                  {{ responde.coverLetter }}
                </p>

                <div class="flex items-center justify-between mb-3">
                  <div class="text-sm font-semibold dark:text-success">
                    {{ responde.price }} за
                    {{ formatPlural(responde.duration, "days") }}
                  </div>
                  <div class="flex items-center gap-2">
                    <UButton
                      color="success"
                      :variant="isDark ? 'outline' : 'solid'"
                      size="xs"
                      icon="i-lucide-message-circle"
                    >
                      {{ t("task.write_message") }}
                    </UButton>
                    <UButton
                      color="success"
                      :variant="isDark ? 'outline' : 'solid'"
                      size="xs"
                      icon="i-lucide-handshake"
                      @click="handleMakeOffer(responde)"
                    >
                      {{ t("task.make_offer") }}
                    </UButton>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
                >
                  <span>{{ formatTimeAgo(responde.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div
          class="flex flex-col gap-8 w-full"
          :class="{
            'desktop:w-1/3': task.user?.uuid === user?.uuid,
            'desktop:w-full': task.user?.uuid !== user?.uuid,
          }"
        >
          <!-- Customer Info -->
          <div
            class="bg-card-bg rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              {{ t("task.about_customer") }}
            </h3>
            <div class="flex items-center gap-3 mb-4">
              <UAvatar
                :src="task.user?.avatarUrl || 'https://i.pravatar.cc/150'"
                :alt="task.user?.firstName || 'Customer'"
                size="xl"
              />
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {{ task.user?.firstName }} {{ task.user?.lastName }}
                </h4>
                <UBadge
                  color="success"
                  size="xs"
                  :variant="!isDark ? 'solid' : 'soft'"
                >
                  {{ t("task.verified_customer") }}
                </UBadge>
              </div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300"
                  >{{ t("task.rating") }}:</span
                >
                <span class="font-medium text-gray-900 dark:text-white"
                  >★{{ task.user?.rating }}</span
                >
              </div>

              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300"
                  >{{ t("task.registered_at") }}:</span
                >
                <span class="font-medium text-gray-900 dark:text-white">{{
                  formatDate(task.user?.createdAt!)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Task Details -->
          <div
            class="bg-card-bg rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              {{ t("task.task_details") }}
            </h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300"
                  >{{ t("task.project_type") }}:</span
                >
                <span class="font-medium text-gray-900 dark:text-white">{{
                  t("task.type_one_time")
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300"
                  >{{ t("task.project_complexity") }}:</span
                >
                <span class="font-medium text-gray-900 dark:text-white">{{
                  complexityLabel
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300"
                  >{{ t("task.project_duration") }}:</span
                >
                <span class="font-medium text-gray-900 dark:text-white">{{
                  formatDuration(task.duration)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Similar Tasks -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick, watch } from "vue";
import type { ITask } from "@/types/task.interface";
import { useTaskApi } from "@/composables/api/useTaskApi";
import { useMessageApi } from "@/composables/api/useMessageApi";
import { useChatModalStore } from "@/stores/chat/useChatModalStore";
import { getFileName } from "@/utils/fileParse";
definePageMeta({
  middleware: "auth",
});

const { t, locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const { getTaskById, deleteTask } = useTaskApi();
const { sendOfferMessage } = useMessageApi();
const chatModalStore = useChatModalStore();
const { add } = useToast();
const config = useRuntimeConfig();
const { user } = useUser();

const { formatPlural, formatTimeAgo } = usePluralization();
// State
const task = ref<ITask | null>(null);
const isLoading = ref(false);
const isDeleting = ref(false);
const respondesort = ref("newest");

// Mock respondes data
const mockrespondes = ref([
  {
    id: 1,
    name: "Александр Иванов",
    avatar: "https://i.pravatar.cc/150?u=alex",
    rating: "4.9",
    reviews: "127",
    badge: "ТОП фрилансер",
    badgeColor: "success",
    message:
      "Имею большой опыт в создании современных лендингов. Готов выполнить проект качественно и в срок.",
    price: "1,800",
    days: "7",
    timeAgo: "3 часа назад",
    location: "Москва",
  },
  {
    id: 2,
    name: "Мария Петрова",
    avatar: "https://i.pravatar.cc/150?u=maria",
    rating: "4.7",
    reviews: "89",
    badge: null,
    badgeColor: null,
    message:
      "Специализируюсь на высококонверсионных лендингах и UX/UI дизайне. Готова обсудить детали.",
    price: "1,600",
    days: "5",
    timeAgo: "5 часов назад",
    location: "СПб",
  },
  {
    id: 3,
    name: "Дмитрий Сидоров",
    avatar: "https://i.pravatar.cc/150?u=dmitry",
    rating: "4.8",
    reviews: "156",
    badge: "Проверенный",
    badgeColor: "success",
    message:
      "Более 8 лет опыта как Fullstack разработчик. Делаю акцент на качестве и SEO оптимизации.",
    price: "2,200",
    days: "10",
    timeAgo: "6 часов назад",
    location: "Москва",
  },
]);

// Response sort options
const respondesortOptions = [
  { label: t("task.filters.sort_by_new"), value: "newest" },
  { label: t("task.filters.sort_by_old"), value: "oldest" },
];

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});

// Format price with spaces
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price);
};

// Format duration
const formatDuration = (days: number) => {
  if (days === 1) return t("common.duration.day");
  if (days < 5) return t("common.duration.days_2_4");
  return t("common.duration.days_5_plus");
};

// Format date
const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Complexity badge color
const complexityBadgeColor = computed(() => {
  if (!task.value) return "neutral";
  switch (task.value.complexity) {
    case "easy":
      return "success";
    case "medium":
      return "warning";
    case "hard":
      return "error";
    default:
      return "neutral";
  }
});

// Complexity label
const complexityLabel = computed(() => {
  if (!task.value) return "";
  switch (task.value.complexity) {
    case "easy":
      return t("common.complexity.easy");
    case "medium":
      return t("common.complexity.medium");
    case "hard":
      return t("common.complexity.hard");
    default:
      return t("common.complexity.medium");
  }
});

// Альтернативная загрузка с использованием useLazyFetch
const {
  data: taskData,
  error: taskError,
  pending: taskPending,
  refresh: refreshTask,
} = await useLazyFetch(`/tasks/${route.params.uuid}`, {
  baseURL: config.public.apiUrl,
  query: {
    lang: locale.value,
  },
  headers: {
    Authorization: `Bearer ${useCookie("access_token").value}`,
  },
  server: false, // Загружаем только на клиенте
  key: `task-${route.params.uuid}`,
  transform: (data: any) => data as ITask,
});

// Синхронизируем данные
watch(taskData, (newData) => {
  if (newData) {
    task.value = newData;
    console.log("Task loaded via useLazyFetch:", newData);
  }
});

watch(taskError, (error) => {
  if (error) {
    console.error("Task loading error via useLazyFetch:", error);
  }
});

// Load task
const loadTask = async () => {
  // Проверяем, что мы на клиенте
  if (!process.client) {
    console.log("Skipping task load on server side");
    return;
  }

  const taskId = route.params.uuid as string;
  console.log("Loading task with ID:", taskId);
  console.log("Route params:", route.params);
  console.log("Route path:", route.path);
  console.log("Current locale:", locale.value);

  if (!taskId) {
    console.error("No task ID found in route params");
    return;
  }

  isLoading.value = true;
  try {
    console.log(
      "Making API request to:",
      `/tasks/${taskId}?lang=${locale.value}`
    );
    const { data, error } = await getTaskById(taskId);

    console.log("API response - data:", data.value);
    console.log("API response - error:", error.value);

    if (error.value) {
      console.error("Error loading task:", error.value);
      return;
    }

    if (data.value) {
      task.value = data.value as ITask;
      console.log("Task loaded successfully:", task.value);
    } else {
      console.warn("No data returned from API");
    }
  } catch (err) {
    console.error("Error loading task:", err);
  } finally {
    isLoading.value = false;
  }
};

// Handle delete
const confirmDelete = async () => {
  if (!task.value) return;

  isDeleting.value = true;
  try {
    await deleteTask(task.value.uuid);

    add({
      title: t("task.delete_success_title"),
      description: t("task.delete_success_message"),
      color: "success",
    });

    // Redirect to tasks list
    await navigateTo(localePath("/tasks"));
  } catch (error) {
    console.error("Error deleting task:", error);

    add({
      title: t("task.delete_error_title"),
      description: t("task.delete_error_message"),
      color: "error",
    });
  } finally {
    isDeleting.value = false;
  }
};

// Download file
const downloadFile = (file: any) => {
  // Implement file download logic
  window.open(file.url, "_blank");
};

// Load task on mount
onMounted(() => {
  // Небольшая задержка для обеспечения полной гидратации
  nextTick(() => {
    loadTask();
  });
});

// Также загружаем задачу при изменении route params
watch(
  () => route.params.uuid,
  (newUuid) => {
    if (newUuid && process.client) {
      console.log("Route UUID changed, reloading task:", newUuid);
      loadTask();
    }
  }
);

// Handle make offer
const handleMakeOffer = async (responde: any) => {
  if (!task.value || !user.value) return;

  try {
    // Отправляем сообщение с предложением через API (чат создастся автоматически)
    const { data: messageData, error: messageError } = await sendOfferMessage({
      userUuid: responde.user.uuid,
      price: responde.price,
      duration: responde.duration,
      content: `Здравствуйте! Мне понравился ваш отклик на проект "${task.value.title}". Готов предложить вам следующие условия:`,
    });

    if (messageError.value) {
      console.error("Error sending offer message:", messageError.value);
      add({
        title: "Ошибка",
        description: "Не удалось отправить предложение",
        color: "error",
      });
      return;
    }

    // Создаем объект чата для модального окна на основе ответа от API
    const newChat = {
      id: (messageData.value as any)?.chatId || Date.now(),
      name: `${responde.user.firstName} ${responde.user.lastName}`,
      lastMessage: "Индивидуальное предложение",
      time: new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      messages: [
        {
          id: Date.now(),
          text: `Здравствуйте! Мне понравился ваш отклик на проект "${task.value.title}". Готов предложить вам следующие условия:`,
          time: new Date().toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: true,
          type: "offer" as const,
          offerData: {
            price: responde.price,
            duration: responde.duration,
            payment: "50% предоплата",
            title: "Индивидуальное предложение",
            content: `Здравствуйте! Мне понравился ваш отклик на проект "${task.value.title}". Готов предложить вам следующие условия:`,
          },
        },
      ],
    };

    // Открываем модальное окно чата с созданным чатом
    chatModalStore.open(newChat);

    add({
      title: "Предложение отправлено",
      description: "Ваше предложение успешно отправлено",
      color: "success",
    });
  } catch (error) {
    console.error("Error in handleMakeOffer:", error);
    add({
      title: "Ошибка",
      description: "Произошла ошибка при отправке предложения",
      color: "error",
    });
  }
};
</script>
