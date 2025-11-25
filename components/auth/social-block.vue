<script setup lang="ts">
import { useAuthApi } from "@/composables/api/useAuthApi";
import type { ISocialAuthDto } from "@/types/common.interface";

const { t } = useI18n();
const localePath = useLocalePath();
const googleRedirect = () => {
  console.log(
    "Google redirect",
    useRuntimeConfig().public.googleClientId,
    useRuntimeConfig().public.googleRedirectUri
  );
  const clientId = useRuntimeConfig().public.googleClientId;
  const redirectUri = useRuntimeConfig().public.googleRedirectUri;

  const responseType = "code";
  const scope = "profile email";
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
};

const githubRedirect = () => {
  console.log(
    "Github redirect",
    useRuntimeConfig().public.githubClientId,
    useRuntimeConfig().public.githubRedirectUri
  );
  const clientId = useRuntimeConfig().public.githubClientId;
  const redirectUri = useRuntimeConfig().public.githubRedirectUri;
  const responseType = "code";


  const scope = "user:email";
  const allowSignup = "true";
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&allow_signup=${allowSignup}`;
};

const telegramRedirect = () => {
  const botToken = useRuntimeConfig().public.telegramBotToken;
  (window as any).Telegram.Login.auth(
    {
      bot_id: botToken,
      request_access: true,
    },
    async (data: any) => {
      const { data: socialData, error } = await useAuthApi().socialAuth({
        provider: "telegram",
        data: {
          avatar: data.photo_url,
          id: data.id,
          username: data.name,
          firstName: data.first_name,
        },
      });
      if (socialData.value && !error.value) {
        useCookie("access_token").value = socialData.value.accessToken;
        useCookie("refresh_token").value = socialData.value.refreshToken;
        navigateTo(localePath("/"));
      } else {
        console.error(error.value);
      }
    }

    // (data: any) => console.log(data),
  );
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center w-full max-w-[280px] mt-4"
  >
    <UButton
      color="neutral"
      variant="outline"
      icon="mdi:google"
      @click="googleRedirect"
      class="mt-4 w-full justify-center flex transition-all hover:scale-95 duration-300 cursor-pointer bg-card-bg"
      >{{ t("sign_with_google") }}</UButton
    >
    <UButton
      color="neutral"
      variant="outline"
      icon="mdi:github"
      @click="githubRedirect"
      class="mt-4 w-full justify-center flex transition-all hover:scale-95 duration-300 cursor-pointer bg-card-bg"
      >{{ t("sign_with_github") }}</UButton
    >
    <UButton
      color="neutral"
      variant="outline"
      icon="mdi:telegram"
      @click="telegramRedirect"
      class="mt-4 w-full justify-center flex transition-all hover:scale-95 duration-300 cursor-pointer bg-card-bg"
      >{{ t("sign_with_telegram") }}</UButton
    >
  </div>
</template>
