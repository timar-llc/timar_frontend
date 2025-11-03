<script setup lang="ts">
const { t } = useI18n();
import ChatSidebar from "@/components/chat/sidebar.vue";
// Process chats with outUser precomputed reactively
</script>
<template>
  <div class="min-h-screen bg-gradient-content rounded-xl">
    <div class="relative bg-gradient-nav">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ t("chat.title") }}
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              {{ t("chat.placeholder") }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div
        class="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 min-h-[800px]"
      >
        <!-- Sidebar -->
        <ChatSidebar />
        <!-- Placeholder area -->
        <section
          class="lg:col-span-8 xl:col-span-9 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden"
        >
          <div class="flex-1 flex items-center justify-center p-6">
            <div class="text-center">
              <div
                class="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-7 h-7"
                >
                  <path
                    d="M2.25 12a9.75 9.75 0 1 1 19.5 0 9.75 9.75 0 0 1-19.5 0Zm9.53-5.28a.75.75 0 0 0-1.06 1.06L12.44 10.5H7.5a.75.75 0 0 0 0 1.5h4.94l-1.72 2.72a.75.75 0 1 0 1.26.82l3-4.75a.75.75 0 0 0 0-.82l-3-4.75Z"
                  />
                </svg>
              </div>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">
                Выберите чат
              </p>
              <p class="text-sm text-gray-500 mt-1">
                Чтобы начать разговор, выберите чат в списке слева
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
