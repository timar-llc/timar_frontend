<template>
  <div
    class="dark:bg-black w-full px-[46px] min-h-dvh text-black dark:text-white flex flex-col py-4 bg-white relative"
  >
    <Header />
    <main class="flex-1 flex flex-col relative z-10">
      <slot />
    </main>
    <Footer />

    <!-- ChatCircle - фиксированная позиция справа внизу -->
    <div class="fixed bottom-10 right-10 z-10">
      <ChatCircle />
    </div>
    <ChatModal class="z-50" />
  </div>
</template>

<script setup lang="ts"></script>
