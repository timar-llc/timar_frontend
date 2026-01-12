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
                {{ $t("add_task.title") }}
              </h1>
              <p class="mt-2 text-gray-600 dark:text-gray-300">
                {{
                  $t("add_task.description") ||
                  "Создайте новую задачу для фрилансеров"
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CreateTaskBasicInfo />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

definePageMeta({
  middleware: "auth",
});

const router = useRouter();
const localePath = useLocalePath();
const { t } = useI18n();
</script>
