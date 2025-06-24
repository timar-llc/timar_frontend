<template>
  <div class="flex flex-col items-center justify-center h-full">
    <h1 class="text-2xl font-bold">{{ t("sign_in") }}</h1>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4 w-full items-center justify-around flex flex-col"
      @submit="onSubmit"
    >
      <UTabs :items="items" class="w-full max-w-[300px] mt-4" color="neutral">
        <template #email>
          <UFormField label="Email" name="email" class="w-full max-w-[300px]">
            <UInput v-model="state.email" color="neutral" class="w-full" />
          </UFormField>
      <UFormField label="Password" name="password" class="w-full max-w-[300px]">
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
        </template>
        <template #phone>
          <UFormField label="Phone" name="phone" class="w-full max-w-[300px]">
            <UInput v-model="state.phone" color="neutral" class="w-full" />
          </UFormField>
        </template>
      </UTabs>


      <UButton
        type="submit"
        class="max-w-[300px] w-full flex justify-center transition-all hover:scale-95 duration-300 cursor-pointer"
        color="neutral"
        >{{ t("sign_in") }}</UButton
      >
    </UForm>
  </div>
</template>
<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, TabsItem } from "@nuxt/ui";

const { t } = useI18n();

const items = [
  {
    label: t("sign_in_email"),
    icon: "i-lucide-mail",
    slot: "email" as const,
  },
  {
    label: t("sign_in_phone"),
    icon: "i-lucide-phone",
    slot: "phone" as const,
  },
] satisfies TabsItem[];
const schema = z.object({
  email: z.string().email(t("no_valid_email")),
  phone: z.string().min(10, t("no_valid_phone")),
  password: z.string().min(8, t("password_min_length") as string),
});
type Schema = z.output<typeof schema>;

const show = ref(false);

const state = reactive<Partial<Schema>>({
  email: undefined,
  phone: undefined,
  password: undefined,
});
const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });
  console.log(event.data);
}
</script>
