<template>
  <UModal
    v-model="isOpen"
    :title="$t('wallet.history.add_funds.title')"
    :close="{ onClick: () => emit('update:modelValue', false) }"
    :open="isOpen"
    class="bg-card-bg"
  >
    <template #body>
      <div>
        <h4 class="text-md font-bold mb-3">
          {{ $t("wallet.history.add_funds.amount") }}
        </h4>
        <div class="grid grid-cols-3 gap-2 mb-4">
          <UButton
            v-for="presetAmount in presetAmounts"
            :key="presetAmount"
            :variant="selectedAmount === presetAmount ? 'solid' : 'outline'"
            :color="selectedAmount === presetAmount ? 'success' : 'neutral'"
            class="h-12 dark:border-1 dark:border-[#484848]"
            @click="selectAmount(presetAmount)"
          >
            {{ formatAmount(presetAmount) }} ₽
          </UButton>
        </div>
      </div>
      <UFormField
        :label="$t('wallet.history.add_funds.other_amount')"
        name="custom_amount"
      >
        <UInput
          v-model="customAmount"
          type="number"
          placeholder="0"
          class="w-full"
          @input="onCustomAmountInput"
        >
          <template #trailing>
            <span class="text-gray-500">₽</span>
          </template>
        </UInput>
      </UFormField>
      <div>
        <h4 class="text-md font-bold my-3">
          {{ $t("wallet.history.add_funds.method") }}
        </h4>
        <div class="space-y-2">
          <div
            v-for="method in paymentMethods"
            :key="method.value"
            class="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors"
            :class="
              selectedMethod === method.value
                ? 'border-success bg-success/10'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            "
            @click="selectedMethod = method.value"
          >
            <div class="flex items-center gap-3">
              <UIcon
                :name="method.icon"
                class="w-6 h-6"
                :class="
                  selectedMethod === method.value
                    ? 'text-success'
                    : 'text-gray-500'
                "
              />
              <div>
                <div class="font-medium">{{ method.label }}</div>
                <div class="text-sm text-gray-500">
                  {{ method.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col p-3">
        <div class="flex justify-between">
          <h4 class="text-sm font-medium mb-3">
            {{ $t("wallet.history.add_funds.summary.title") }}
          </h4>
          <p class="text-sm font-medium">{{ formatAmount(finalAmount) }} ₽</p>
        </div>
        <div class="flex justify-between">
          <h4 class="text-sm font-medium mb-3">
            {{ $t("wallet.history.add_funds.summary.commission") }}
          </h4>
          <p class="text-sm font-medium">0 ₽</p>
        </div>
        <USeparator class="my-3" />
        <div class="flex justify-between">
          <h4 class="text-sm font-bold mb-3">
            {{ $t("wallet.history.add_funds.summary.total") }}
          </h4>
          <p class="text-sm font-bold text-success">
            {{ formatAmount(finalAmount) }} ₽
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-center gap-2 w-full">
        <UButton
          color="error"
          variant="outline"
          class="w-full flex justify-center"
          @click="closeModal"
        >
          {{ $t("wallet.history.add_funds.cancel") }}
        </UButton>
        <UButton
          color="success"
          class="w-full flex justify-center"
          @click="handleSubmit"
          :disabled="!canSubmit"
        >
          {{ $t("wallet.history.add_funds.confirm") }}
          {{ formatAmount(finalAmount) }} ₽
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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

// Состояние для сумм
const selectedAmount = ref<number | null>(null);
const customAmount = ref("");

// Предустановленные суммы
const presetAmounts = [1000, 2500, 5000, 10000, 25000, 50000];

// Способ оплаты
const selectedMethod = ref("card");

// Методы оплаты с иконками и описаниями
const paymentMethods = [
  {
    label: t("wallet.history.methods.bank_card"),
    value: "card",
    icon: "i-lucide-credit-card",
    description: "Visa, MasterCard, МИР",
  },
  {
    label: t("wallet.history.methods.crypto"),
    value: "crypto",
    icon: "i-lucide-coins",
    description: "Bitcoin, Ethereum, USDT",
  },
];

// Вычисляемые свойства
const finalAmount = computed(() => {
  if (customAmount.value) {
    return Number(customAmount.value);
  }
  return selectedAmount.value || 0;
});

const canSubmit = computed(() => {
  return finalAmount.value > 0 && selectedMethod.value;
});

// Функции
const formatAmount = (amount: number) => {
  return amount.toLocaleString("ru-RU");
};

const selectAmount = (amount: number) => {
  selectedAmount.value = amount;
  customAmount.value = "";
};

const onCustomAmountInput = () => {
  selectedAmount.value = null;
};

const closeModal = () => {
  isOpen.value = false;
  selectedAmount.value = null;
  customAmount.value = "";
  selectedMethod.value = "";
};

const handleSubmit = () => {
  if (canSubmit.value) {
    emit("submit", finalAmount.value, selectedMethod.value);
    closeModal();
  }
};
</script>
