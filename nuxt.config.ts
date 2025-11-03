// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8081",
      socketUrl: process.env.NUXT_PUBLIC_SOCKET_URL || "http://localhost:8081",
      googleRedirectUri:
        process.env.GOOGLE_REDIRECT_URI || "http://localhost:3002/auth/google/",
      googleClientId:
        process.env.GOOGLE_CLIENT_ID || "your_google_client_id_here",
      googleClientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "your_google_client_secret_here",
      githubRedirectUri:
        process.env.GITHUB_REDIRECT_URI || "http://localhost:3002/auth/github/",
      githubClientId:
        process.env.GITHUB_CLIENT_ID || "your_github_client_id_here",
      githubClientSecret:
        process.env.GITHUB_CLIENT_SECRET || "your_github_client_secret_here",
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
    },
  },
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  css: ["@/assets/css/main.css"],
  devServer: {
    port: 3002,
  },

  modules: [
    "@nuxt/image",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ["4ca304aa923604.lhr.life"],
    },
  },
  i18n: {
    defaultLocale: "ru",
    locales: [
      { code: "ru", name: "Russian", file: "ru.json" },
      { code: "en", name: "English", file: "en.json" },
    ],
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
});
