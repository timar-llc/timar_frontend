<template>
  <Head>
    <Title>{{ t("sign_in") }} - Timarlance</Title>
  </Head>
  <NuxtLayout name="auth">
    <div class="flex flex-col items-center justify-center h-full">
      <h1 class="text-2xl font-bold">{{ t("sign_in") }}</h1>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 w-full items-center justify-around flex flex-col max-w-[300px]"
        @submit="onSubmit"
        :validate-on="[]"
      >
        <UTabs  :items="items" class="w-full  mt-4 " color="neutral" v-model="active" :ui="{ list: 'bg-card-bg' }" >
          <template #email>
            <UFormField label="Email" name="email" class="w-full max-w-[300px]">
              <UInput v-model="state.email" color="neutral" class="w-full bg-card-bg" placeholder="user@example.com"/>
            </UFormField>
            <UFormField
              :label="t('sign_in_password')"
              name="password"
              class="w-full max-w-[300px] mt-3"
            >
              <UInput
                v-model="state.password"
                placeholder="***"
                class="w-full bg-card-bg"
                color="neutral"
                :type="show ? 'text' : 'password'"
                :ui="{ trailing: 'pe-1' }"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="show ? 'Hide password' : 'Show password'"
                    :aria-pressed="show"
                    aria-controls="password"
                    @click="show = !show"
                  />
                </template>
              </UInput>
            </UFormField>
          </template>
          <template #phone>
            <UFormField
              :label="t('sign_in_phone')"
              name="phone"
              class="w-full max-w-[300px]"
            >
              <UButtonGroup class="w-full">
                <USelectMenu
                  v-model="number_code"
                  :items="number_codes"
                  class=""
                />
                <UInput
                  v-model="state.phone"
                  color="neutral"
                  class="w-full"
                </UInput>
              </UButtonGroup>
            </UFormField>
          </template>
        </UTabs>
        <div class="flex items-center">
          <NuxtLink :to="localePath('/reset-password')" class="text-green-lead text-sm opacity-50 hover:opacity-100 transition-all duration-300">
            {{ t("auth.login.reset_button") }}
          </NuxtLink>
        </div>

        <UButton
          type="submit"
          class="max-w-[300px] w-full flex justify-center transition-all hover:scale-95 duration-300 cursor-pointer"
          color="neutral"
          >{{ t("auth.login.button") }}</UButton
        >
      </UForm>
      <AuthSocialBlock />
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, TabsItem } from "@nuxt/ui";
import { useAuthApi } from "@/composables/api/useAuthApi";
import { redirectToConfirm } from "@/utils/auth/confirmRedirect";
import AuthSocialBlock from "@/components/auth/social-block.vue";
const { t } = useI18n();
const localePath = useLocalePath();

const number_codes = ["+7", "+1", "+44"];
const number_code = ref(number_codes[0]);
const items: TabsItem[] = [
  {
    key: "email",
    label: t("sign_in_email"),
    icon: "i-lucide-mail",
    slot: "email" as const,
    value: "email",
  },
  {
    key: "phone",
    label: t("sign_in_phone"),
    icon: "i-lucide-phone",
    slot: "phone" as const,
    value: "phone",
  },
];

const selectedTab = ref("email");
onMounted(() => {
  console.log(selectedTab.value, "selectedTab.value");
});

const active = computed({
  get() {
    return selectedTab.value;
  },
  set(value) {
    selectedTab.value = value;
  }
})



const emailSchema = z.object({
  email: z.string().email(t("auth.login.errors.email")),
  password: z.string().min(8, t("auth.login.errors.password_required")),
});

const phoneSchema = z.object({
  phone: z.string().min(10, t("auth.login.errors.phone_required")),
});

const schema = computed(() => {
  return selectedTab.value === "email" ? emailSchema : phoneSchema;
});


const show = ref(false);

const state = reactive({
  email: "",
  phone: "",
  password: "",
});
async function onSubmit(event: FormSubmitEvent<any>) {
  
  if (selectedTab.value === "email" && 'email' in event.data && event.data.email) {
    console.log('Processing email login');
    const { data, error } = await useAuthApi().login({ email: event.data.email, password: event.data.password });
    if (data.value && !error.value) {
      useCookie("access_token").value = data.value.accessToken;
      useCookie("refresh_token").value = data.value.refreshToken;
      await useUser().fetchUser();
      navigateTo(localePath("/"));
    } else {
      console.error(error.value);
    }

    
  } else if (selectedTab.value === "phone" && 'phone' in event.data && event.data.phone) {
    console.log('Processing phone login');
    const fullPhoneNumber = `${number_code.value}${event.data.phone}`;
    const { data, error } = await useAuthApi().loginByPhone({ phoneNumber: fullPhoneNumber });
    if (data.value && !error.value) {
      // Редиректим на страницу подтверждения
      sessionStorage.setItem("confirmType", "loginByPhone");
      sessionStorage.setItem("phoneNumber", fullPhoneNumber);
      sessionStorage.setItem("email", event.data.email || "");
      sessionStorage.setItem("password", event.data.password || "");
      navigateTo(localePath("/confirm"));
    } else {
      console.error(error.value);
    }

  } else {
    console.log('No valid data found for submission');
  }
}
</script>
