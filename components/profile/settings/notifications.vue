<template>
  <div class="flex flex-col gap-4">
    <h3 class="text-xl font-bold">{{ $t("notifications.title") }}</h3>
    <p class="text-sm text-gray-500">
      {{ $t("notifications.description") }}
    </p>

    <div class="flex gap-2">
      <p class="text-sm">
        {{ $t("notifications.email_messages") }}
      </p>
      <UCheckbox
        v-model="form.email_messages"
        color="success"
        @change="onSubmit"
      />
    </div>
    <div class="flex gap-2">
      <p class="text-sm">
        {{ $t("notifications.invoice_messages") }}
      </p>
      <UCheckbox
        v-model="form.invoice_messages"
        color="success"
        @change="onSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const form = ref({
  email_messages: false,
  invoice_messages: false,
});

const toast = useToast();
const onSubmit = () => {
  toast.add({
    title: "Success",
    description: "Notifications updated successfully",
    color: "success",
  });
};
</script>
