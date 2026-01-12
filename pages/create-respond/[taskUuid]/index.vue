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
import { ref } from "vue";
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
const isSubmitting = ref(false);

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
</script>
