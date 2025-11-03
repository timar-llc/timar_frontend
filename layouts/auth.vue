<template>
  <div class="flex flex-col relative h-[calc(100vh-50px)]">
    <img
      src="/png/earth.png"
      class="absolute top-20 left-3 object-cover dark:invert mobile:hidden"
      width="300"
      alt="Earth"
    />
    <slot />
    <img
      src="/png/girl.png"
      class="absolute bottom-20 right-12 object-cover dark:invert mobile:hidden"
      width="300"
      alt="Girl"
    />
  </div>
</template>
