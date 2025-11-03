<template>
    <Head>
      <Title>{{ t("auth.reset_password.title") }} - Timarlance</Title>
    </Head>
    <NuxtLayout name="auth">
      <div class="flex flex-col items-center justify-center h-full">
        <h1 class="text-2xl font-bold">{{ t("auth.reset_password.title") }}</h1>
  
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4 w-full items-center justify-around flex flex-col max-w-[300px]"
          @submit="onSubmit"
          :validate-on="[]"
        >
          <UTabs  :items="items" class="w-full  mt-4" color="neutral" v-model="active" >
            <template #email>
              <UFormField label="Email" name="email" class="w-full max-w-[300px]">
                <UInput v-model="state.email" color="neutral" class="w-full" placeholder="user@example.com"/>
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
            <NuxtLink :to="localePath('/sign-in')" class="text-green-lead text-sm opacity-50 hover:opacity-100 transition-all duration-300">
              {{ t("auth.login.button") }}
            </NuxtLink>
          </div>
  
          <UButton
            type="submit"
            class="max-w-[300px] w-full flex justify-center transition-all hover:scale-95 duration-300 cursor-pointer"
            color="neutral"
            >{{ t("auth.reset_password.button") }}</UButton
          >
        </UForm>
      </div>
    </NuxtLayout>
  </template>
  <script setup lang="ts">
  import * as z from "zod";
  import type { FormSubmitEvent, TabsItem } from "@nuxt/ui";
  import { useAuthApi } from "@/composables/api/useAuthApi";
  import { redirectToConfirm } from "@/utils/auth/confirmRedirect";
  
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
  
  const active = computed({
    get() {
      return selectedTab.value;
    },
    set(value) {
      selectedTab.value = value;
    }
  })
  
  
  
  const emailSchema = z.object({
    email: z.string().email(t("auth.reset_password.errors.email")),
  });

  const phoneSchema = z.object({
    phone: z.string().min(10, t("auth.reset_password.errors.phone_required")),
  });

  const schema = computed(() => {
    return selectedTab.value === "email" ? emailSchema : phoneSchema;
  });
  
  
  const state = reactive({
    email: "",
    phone: "",
  });
  const fullPhoneNumber = computed(() => {
    return `${number_code.value}${state.phone}`;
  });
  async function onSubmit(event: FormSubmitEvent<any>) {
    if (selectedTab.value === "email" && 'email' in event.data && event.data.email) {
      console.log('Processing email password reset');
      const { data, error } = await useAuthApi().resetPassword({ email: event.data.email });
      if (data.value && !error.value) {
        sessionStorage.setItem("confirmType", "resetPassword");
        sessionStorage.setItem("email", event.data.email);
        navigateTo(localePath("/confirm"));
      } else {
        console.error(error.value);
      }
    } else if (selectedTab.value === "phone" && 'phone' in event.data && event.data.phone) {
      console.log('Processing phone password reset');
      const { data, error } = await useAuthApi().resetPassword({ phoneNumber: fullPhoneNumber.value });
      if (data.value && !error.value) {
        sessionStorage.setItem("confirmType", "resetPassword");
        sessionStorage.setItem("phoneNumber", fullPhoneNumber.value);
        navigateTo(localePath("/confirm"));
      } else {
        console.error(error.value);
      }
    } else {
      console.log('No valid data found for password reset');
    }
  }
  </script>
  