<template>
  <Head>
    <Title>{{ t("auth.set_new_password.title") }} - Timarlance</Title>
  </Head>
  <NuxtLayout name="auth">
    <div class="flex flex-col items-center justify-center h-full">
      <h1 class="text-2xl font-bold">{{ t("auth.set_new_password.title") }}</h1>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 w-full items-center justify-around flex flex-col max-w-[300px]"
        @submit="onSubmit"
      >
        <UFormField
          :label="t('auth.set_new_password.password_label')"
          name="password"
          class="w-full max-w-[300px] mt-3"
        >
          <UInput
            v-model="state.password"
            placeholder="***"
            class="w-full"
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
        <UFormField
          :label="t('auth.set_new_password.password_label_again')"
          name="password_again"
          class="w-full max-w-[300px] mt-3"
        >
          <UInput
            v-model="state.password_again"
            placeholder="***"
            class="w-full"
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

        <UButton
          type="submit"
          class="max-w-[300px] w-full flex justify-center transition-all hover:scale-95 duration-300 cursor-pointer"
          color="neutral"
          >{{ t("auth.set_new_password.button") }}</UButton
        >
      </UForm>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { useAuthApi } from "@/composables/api/useAuthApi";

const { t } = useI18n();
const localePath = useLocalePath();
const schema = computed(() => {
  return z
    .object({
      password: z.string().min(8, t("auth.set_new_password.errors.password_required")),
      password_again: z.string().min(8, t("auth.set_new_password.errors.password_required")),
    })
    .refine(
      (data) => {
        return (
          data.password &&
          data.password_again &&
          data.password === data.password_again
        );
      },
      {
        message: t("auth.set_new_password.errors.password"),
        path: ["password"],
      }
    );
});

const show = ref(false);

const state = reactive({
  password: "",
  password_again: "",
});
async function onSubmit(event: FormSubmitEvent<any>) {
  const email = sessionStorage.getItem("email");
  const phoneNumber = sessionStorage.getItem("phoneNumber");

  const { data, error } = await useAuthApi().setNewPassword({
    email: email,
    phoneNumber: phoneNumber,
    password: event.data.password,
  });
  if (data.value && !error.value) {
    sessionStorage.removeItem("phoneNumber");
    sessionStorage.removeItem("email");
    navigateTo(localePath("/sign-in"));
  } else {
    console.error(error.value);
  }
}
</script>
