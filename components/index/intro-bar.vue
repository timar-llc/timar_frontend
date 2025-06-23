<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-[52px] font-bold">{{ t("intro_bar_title") }}</h1>
    <p class="text-sm">
      {{ t("intro_bar_description") }}
    </p>
    <UButton
      :label="t('intro_bar_button')"
      icon="material-symbols-light:adjust-outline"
      class="glow-button mt-[40px] text-[20px] text-black animate-bounce rotate-[-6deg]"
      size="xl"
      color="neutral"
      variant="solid"
    />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>

<style>
.glow-button {
  transform: rotate(-12deg); /* наклон */
  background: radial-gradient(circle at 100% 100%, #fdfefe, #fdfefe);
  padding: 10px;
  border-radius: 50px;
  box-shadow: 0 0 40px #adff8c66; /* общее свечение вокруг кнопки */
  transition: box-shadow 0.3s ease-in-out;
}

.glow-button:hover {
  box-shadow: 0 0 60px #adff8c, 0 0 20px #adff8c;
}

.glow-button button {
  font-size: 24px;
  padding: 15px 30px;
  border: none;
  border-radius: 50px;
  background: #f0f6ec;
  cursor: pointer;
  color: #000;
  font-weight: 600;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.glow-button button:hover {
  transform: scale(0.45);
}
.glow-button::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 140%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, #aaff99 0%, transparent 60%);
  filter: blur(40px);
  z-index: 0;
  opacity: 0.8;
}
</style>
