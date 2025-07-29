<template>
  <div
    class="dark:bg-black w-full px-[46px] min-h-dvh text-black dark:text-white flex flex-col py-4 bg-white"
  >
    <Header />
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
    <Footer />
  </div>
</template>
