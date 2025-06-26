<template>
  <div class="flex flex-col relative h-full">
    <NuxtPicture
      src="/png/earth.png"
      class="absolute top-20 left-3 object-cover dark:invert mobile:hidden"
      width="300px"
    />
    <slot />
    <NuxtPicture
      src="/png/girl.png"
      class="absolute bottom-20 right-12 object-cover dark:invert mobile:hidden"
      width="300px"
    />
  </div>
</template>
