<template>
  <div
    class="py-8 flex gap-6 mx-auto min-h-screen tablet:flex-col mobile:flex-col w-full"
  >
    <!-- Left Section - Task Details -->
    <TaskDetails
      :task="task"
      class="w-2/3 tablet:w-full mobile:w-full h-full"
    />

    <!-- Right Section - Response Form -->
    <ResponseForm
      :is-submitting="isSubmitting"
      :task="task"
      @submit="handleSubmit"
      class="w-1/3 tablet:w-full mobile:w-full h-full"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { ITask } from "@/types/task.interface";
import TaskDetails from "@/components/create-respond/responde-info.vue";
import ResponseForm from "@/components/create-respond/basic-info.vue";
import { useTaskApi } from "@/composables/api/useTaskApi";

const { taskUuid } = useRoute().params;

const { getTaskById } = useTaskApi();
const { data, error } = await getTaskById(taskUuid as string);
if (error.value) {
  console.error("Error loading task:", error.value);
  navigateTo("/404");
}
const task = data.value as ITask;

// Task data
const isLoading = ref(true);
const isSubmitting = ref(false);

// Mock data for demonstration
const taskTags = ref(["React Native", "Node.js", "MongoDB", "UI/UX Design"]);
const keyRequirements = ref([
  "Кроссплатформенная разработка (iOS/Android)",
  "Интеграция с картами и геолокацией",
  "Система оплаты и уведомлений",
  "Административная панель",
  "API для интеграции с ресторанами",
]);

const respondes = ref({
  total: 23,
  pending: 5,
  favorites: 2,
});

// Methods
const loadTask = async () => {
  try {
    isLoading.value = true;
    // TODO: Load task data from API
    // For now, using mock data
    task.value = {
      uuid: taskUuid as string,
      title: "Разработка мобильного приложения для доставки еды",
      description:
        "Необходимо разработать мобильное приложение для доставки еды с функционалом для клиентов (заказ, отслеживание, оплата) и курьеров (получение заказов, навигация, отчетность).",
      price: 150000,
      currency: "RUB",
      duration: 30,
      complexity: "medium",
      views: 47,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      updatedAt: new Date(),
      endedAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isDraft: false,
      status: "pending",
      files: [],
      category: undefined,
      user: undefined,
    } as ITask;
  } catch (error) {
    console.error("Error loading task:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async (data: {
  price: string;
  completionTime: string;
  coverLetter: string;
  files: File[];
}) => {
  try {
    isSubmitting.value = true;
    // TODO: Submit response to API
    console.log("Submitting response:", {
      taskUuid,
      ...data,
    });

    // Show success message
    // Redirect to task page or show success notification
  } catch (error) {
    console.error("Error submitting response:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadTask();
});
</script>
