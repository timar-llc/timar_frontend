<template>
  <UModal
    v-model="isOpen"
    :title="$t('wallet.history.add_funds.title')"
    :close="{ onClick: () => emit('update:modelValue', false) }"
    :open="isOpen"
    :ui="{
      wrapper: 'sm:max-w-2xl',
      overlay: 'bg-black/80 backdrop-blur',
      content: 'bg-card-bg',
    }"
  >
    <template #body>
      <div class="space-y-6">
        <!-- Выбор суммы -->
        <div>
          <h4
            class="text-base font-semibold mb-4 text-gray-900 dark:text-white"
          >
            {{ $t("wallet.history.add_funds.amount") }}
          </h4>
          <div class="grid grid-cols-3 gap-3 mb-4">
            <UButton
              v-for="presetAmount in presetAmounts"
              :key="presetAmount"
              :variant="selectedAmount === presetAmount ? 'solid' : 'outline'"
              :color="selectedAmount === presetAmount ? 'success' : 'neutral'"
              :ui="{
                base: 'bg-card-bg',
              }"
              class="h-14 font-semibold transition-all duration-200 hover:scale-105"
              :class="
                selectedAmount === presetAmount
                  ? 'shadow-lg shadow-success/20 bg-success'
                  : 'bg-card-bg hover:bg-card-bg'
              "
              @click="selectAmount(presetAmount)"
            >
              {{ formatAmount(presetAmount) }} ₽
            </UButton>
          </div>
        </div>

        <!-- Другая сумма -->
        <UFormField
          :label="$t('wallet.history.add_funds.other_amount')"
          name="custom_amount"
          :error="amountError || undefined"
        >
          <UInput
            v-model="customAmount"
            type="number"
            :min="MIN_AMOUNT"
            :placeholder="MIN_AMOUNT.toString()"
            class="w-full h-12"
            size="lg"
            :color="amountError ? 'error' : 'primary'"
            @input="onCustomAmountInput"
          >
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 font-medium"
                >₽</span
              >
            </template>
          </UInput>
        </UFormField>
        <!-- Сообщение о минимальной сумме -->
        <div
          v-if="!amountError && finalAmount > 0"
          class="text-xs text-gray-500 dark:text-gray-400"
        >
          {{
            $t("wallet.history.add_funds.min_amount_info", { min: MIN_AMOUNT })
          }}
        </div>

        <!-- Способ оплаты -->
        <div>
          <h4
            class="text-base font-semibold mb-4 text-gray-900 dark:text-white"
          >
            {{ $t("wallet.history.add_funds.method") }}
          </h4>
          <div class="grid grid-cols-1 gap-3">
            <div
              v-for="method in paymentMethods"
              :key="method.value"
              class="relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md"
              :class="
                selectedMethod === method.value
                  ? 'border-success bg-green-50 dark:bg-green-500/10 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600'
              "
              @click="selectedMethod = method.value"
            >
              <div class="flex items-center gap-4">
                <div
                  :class="
                    selectedMethod === method.value
                      ? 'bg-success text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  "
                  class="p-3 rounded-lg transition-colors duration-200 flex"
                >
                  <UIcon :name="method.icon" class="w-6 h-6" />
                </div>
                <div>
                  <div
                    class="font-semibold text-gray-900 dark:text-white"
                    :class="
                      selectedMethod === method.value
                        ? 'text-green-700 dark:text-green-400'
                        : ''
                    "
                  >
                    {{ method.label }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {{ method.description }}
                  </div>
                </div>
              </div>
              <div
                v-if="selectedMethod === method.value"
                class="flex-shrink-0 w-5 h-5 rounded-full bg-success flex items-center justify-center"
              >
                <UIcon name="i-lucide-check" class="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>

        <!-- Итоговая информация -->
        <div
          class="rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-transparent border border-gray-200 dark:border-gray-700"
        >
          <h4 class="text-sm font-semibold mb-4 text-gray-900 dark:text-white">
            {{ $t("wallet.history.add_funds.summary.title") }}
          </h4>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t("wallet.history.add_funds.summary.title") }}
              </span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatAmount(finalAmount) }} ₽
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t("wallet.history.add_funds.summary.commission") }}
              </span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatAmount(finalAmount * 0.04) }} ₽
              </span>
            </div>
            <div class="h-px bg-gray-200 dark:bg-gray-700 my-3"></div>
            <div class="flex justify-between items-center">
              <span class="text-base font-bold text-gray-900 dark:text-white">
                {{ $t("wallet.history.add_funds.summary.total") }}
              </span>
              <span class="text-xl font-bold text-success">
                {{ formatAmount(amountWithCommission) }} ₽
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-3 w-full">
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          class="flex-1 font-semibold"
          @click="closeModal"
          :ui="{
            base: 'bg-card-bg',
          }"
        >
          {{ $t("wallet.history.add_funds.cancel") }}
        </UButton>
        <UButton
          color="success"
          size="lg"
          class="flex-1 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          :disabled="!canSubmit"
          @click="handleSubmit()"
        >
          {{ $t("wallet.history.add_funds.confirm") }}
          {{ formatAmount(amountWithCommission) }} ₽
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { usePaymentsApi } from "@/composables/api/usePaymentsApi";
const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
}>();

const { addFunds } = usePaymentsApi();
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

// Минимальная сумма пополнения
const MIN_AMOUNT = 500;

// Предустановленные суммы
const presetAmounts = [500, 1000, 2500, 5000, 10000, 25000, 50000];

// Способ оплаты
const selectedMethod = ref("card");

// Методы оплаты с иконками и описаниями
const paymentMethods = [
  {
    label: t("wallet.history.methods.card"),
    value: "card",
    icon: "i-lucide-credit-card",
    description: "Visa, MasterCard, МИР",
  },
  {
    label: t("wallet.history.methods.sbp"),
    value: "sbp",
    icon: "i-ph-bank-bold",
    description: "SBP",
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
  return finalAmount.value >= MIN_AMOUNT && selectedMethod.value;
});

const amountError = computed(() => {
  if (finalAmount.value > 0 && finalAmount.value < MIN_AMOUNT) {
    return t("wallet.history.add_funds.min_amount_error", { min: MIN_AMOUNT });
  }
  return null;
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
  selectedMethod.value = "card";
};
const amountWithCommission = computed(() => {
  return Number(finalAmount.value) + Number(finalAmount.value) * 0.04;
});

const handleSubmit = async () => {
  if (canSubmit.value) {
    const response = await addFunds({
      amount: Number(finalAmount.value),
      amountWithCommission: amountWithCommission.value,
      paymentMethod: selectedMethod.value as "card" | "sbp" | "crypto",
    });
    if (response.data.value) {
      await navigateTo(response.data.value, { external: true });
    } else {
      console.error(response.error.value);
    }
  }
};
</script>
