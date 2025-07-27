<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">
            {{ $t("wallet.withdraw_funds.title") }}
          </h3>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            @click="closeModal"
          />
        </div>
      </template>

      <div class="space-y-4">
        <UFormField label="Сумма" name="withdraw_amount">
          <UInput
            v-model="amount"
            type="number"
            placeholder="Введите сумму"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Способ вывода" name="withdraw_method">
          <USelect
            v-model="selectedMethod"
            :items="withdrawMethods"
            placeholder="Выберите способ вывода"
          />
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="closeModal">
            Отмена
          </UButton>
          <UButton color="error" @click="handleSubmit"> Вывести </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submit: [amount: number, method: string];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const amount = ref("");
const selectedMethod = ref("");

const withdrawMethods = [
  { label: "Банковская карта", value: "card" },
  { label: "СБП", value: "sbp" },
];

const closeModal = () => {
  isOpen.value = false;
  amount.value = "";
  selectedMethod.value = "";
};

const handleSubmit = () => {
  if (amount.value && selectedMethod.value) {
    emit("submit", Number(amount.value), selectedMethod.value);
    closeModal();
  }
};
</script>
