<template>
  <footer class="border-t border-gray-200 dark:border-gray-800 mt-16">
    <div class="mx-auto px-4 py-12">
      <!-- Основной контент футера -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
        <!-- Логотип и описание -->
        <div class="lg:col-span-2">
          <div class="flex items-center gap-2 mb-4">
            <h3 class="text-2xl font-bold">
              {{ $t("brand") }}
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            {{ $t("footer.description") }}
          </p>

          <!-- Социальные сети -->
          <div class="flex gap-4">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-simple-icons-telegram"
              class="hover:scale-110 transition-transform"
            />
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-simple-icons-vk"
              class="hover:scale-110 transition-transform"
            />
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-simple-icons-youtube"
              class="hover:scale-110 transition-transform"
            />
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-simple-icons-github"
              class="hover:scale-110 transition-transform"
            />
          </div>
        </div>

        <!-- Компания -->
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t("footer.company.title") }}
          </h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/about"
                class="text-gray-600 dark:text-gray-400 hover:text-success transition-colors"
              >
                {{ $t("footer.company.about") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/careers"
                class="text-gray-600 dark:text-gray-400 hover:text-success transition-colors"
              >
                {{ $t("footer.company.careers") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/press"
                class="text-gray-600 dark:text-gray-400 hover:text-success transition-colors"
              >
                {{ $t("footer.company.press") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/contact"
                class="text-gray-600 dark:text-gray-400 hover:text-success transition-colors"
              >
                {{ $t("footer.company.contact") }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Платформа -->
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t("footer.platform.title") }}
          </h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/how-it-works"
                class="text-gray-600 dark:text-gray-400 hover:text-success transition-colors"
              >
                {{ $t("footer.platform.how_it_works") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/categories"
                class="text-gray-600 dark:text-gray-400 hover:text-success transition-colors"
              >
                {{ $t("footer.platform.categories") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/pricing"
                class="text-gray-600 dark:text-gray-400 hover:text-success transition-colors"
              >
                {{ $t("footer.platform.pricing") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/api"
                class="text-gray-600 dark:text-gray-400 hover:text-success transition-colors"
              >
                {{ $t("footer.platform.api") }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Поддержка -->
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t("footer.support.title") }}
          </h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/help"
                class="text-gray-600 dark:text-gray-400 hover:text-success transition-colors"
              >
                {{ $t("footer.support.help_center") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/support"
                class="text-gray-600 dark:text-gray-400 hover:text-success transition-colors"
              >
                {{ $t("footer.support.contact_support") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/community"
                class="text-gray-600 dark:text-gray-400 hover:text-success transition-colors"
              >
                {{ $t("footer.support.community") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/status"
                class="text-gray-600 dark:text-gray-400 hover:text-success transition-colors"
              >
                {{ $t("footer.support.status") }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Правовая информация -->
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t("footer.legal.title") }}
          </h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/terms"
                class="text-gray-600 dark:text-gray-400 hover:text-success transition-colors"
              >
                {{ $t("footer.legal.terms") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/privacy"
                class="text-gray-600 dark:text-gray-400 hover:text-success transition-colors"
              >
                {{ $t("footer.legal.privacy") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/cookies"
                class="text-gray-600 dark:text-gray-400 hover:text-success transition-colors"
              >
                {{ $t("footer.legal.cookies") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/security"
                class="text-gray-600 dark:text-gray-400 hover:text-success transition-colors"
              >
                {{ $t("footer.legal.security") }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Подписка на новости -->
      <div class="border-t border-gray-200 dark:border-gray-800 pt-8 mb-8">
        <div class="max-w-md">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
            {{ $t("footer.newsletter.title") }}
          </h4>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ $t("footer.newsletter.description") }}
          </p>
          <div class="flex gap-2">
            <UInput
              v-model="email"
              :placeholder="$t('footer.newsletter.placeholder')"
              class="flex-1"
            />
            <UButton color="success" @click="subscribeNewsletter">
              {{ $t("footer.newsletter.subscribe") }}
            </UButton>
          </div>
        </div>
      </div>

      <!-- Нижняя часть футера -->
      <div class="border-t border-gray-200 dark:border-gray-800 pt-8">
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div
            class="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-600 dark:text-gray-400"
          >
            <span>{{ $t("footer.copyright") }}</span>
            <span>{{ $t("footer.made_with") }}</span>
          </div>

          <!-- Языки -->
          <div class="flex items-center gap-4">
            <UButton
              v-for="loc in availableLocales"
              :key="loc.code"
              :color="locale === loc.code ? 'success' : 'neutral'"
              variant="ghost"
              size="sm"
              @click="changeLocale(loc.code)"
            >
              {{ loc.name }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t, locale, setLocale } = useI18n();

const email = ref("");

const availableLocales = computed(() => [
  { code: "ru", name: t("russian_language") },
  { code: "en", name: t("english_language") },
]);

const changeLocale = (newLocale: string) => {
  setLocale(newLocale);
  console.log("Переключение языка с", locale.value, "на", newLocale);
  locale.value = newLocale;
};

const subscribeNewsletter = () => {
  if (email.value) {
    // Логика подписки на новости
    console.log("Подписка на новости:", email.value);
    email.value = "";
  }
};
</script>
