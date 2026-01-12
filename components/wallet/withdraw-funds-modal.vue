<template>
  <UModal
    v-model="isOpen"
    :title="$t('wallet.history.withdraw_funds.title')"
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
        <!-- Доступно для вывода -->
        <div
          class="rounded-xl p-4 bg-gradient-to-br from-green-50 to-white dark:from-green-500/10 dark:to-transparent border border-green-200 dark:border-green-500/20"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg">
              <UIcon
                name="i-lucide-circle-check"
                class="w-5 h-5 text-green-600 dark:text-green-400"
              />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t("wallet.history.withdraw_funds.available") }}
              </p>
              <p class="text-xl font-bold text-green-600 dark:text-green-400">
                {{ formatNumber(user?.availableBalance, 0) }} ₽
              </p>
            </div>
          </div>
        </div>

        <!-- Выбор суммы -->
        <div>
          <h4
            class="text-base font-semibold mb-4 text-gray-900 dark:text-white"
          >
            {{ $t("wallet.history.withdraw_funds.amount") || "Сумма вывода" }}
          </h4>
          <div class="grid grid-cols-3 gap-3 mb-4">
            <UButton
              v-for="presetAmount in numericAmounts"
              :key="presetAmount"
              :variant="selectedAmount === presetAmount ? 'solid' : 'outline'"
              :color="selectedAmount === presetAmount ? 'success' : 'neutral'"
              class="h-14 font-semibold transition-all duration-200 hover:scale-105"
              :class="
                selectedAmount === presetAmount
                  ? 'shadow-lg shadow-success/20'
                  : ''
              "
              @click="selectAmount(presetAmount)"
            >
              {{ formatAmount(presetAmount) }} ₽
            </UButton>
            <UButton
              :variant="selectedAmount === 'all' ? 'solid' : 'outline'"
              :color="selectedAmount === 'all' ? 'success' : 'neutral'"
              class="h-14 font-semibold transition-all duration-200 hover:scale-105 col-span-3"
              :class="
                selectedAmount === 'all' ? 'shadow-lg shadow-success/20' : ''
              "
              @click="selectAllAmount"
            >
              {{ $t("wallet.history.withdraw_funds.all") }}
            </UButton>
          </div>
        </div>

        <!-- Другая сумма -->
        <UFormField
          :label="$t('wallet.history.withdraw_funds.other_amount')"
          name="custom_amount"
        >
          <UInput
            v-model="customAmount"
            type="number"
            placeholder="0"
            class="w-full h-12"
            size="lg"
            @input="onCustomAmountInput"
          >
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 font-medium"
                >₽</span
              >
            </template>
          </UInput>
        </UFormField>

        <!-- Способ вывода -->
        <div>
          <h4
            class="text-base font-semibold mb-4 text-gray-900 dark:text-white"
          >
            {{ $t("wallet.history.withdraw_funds.method") }}
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
                  class="p-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
            {{ $t("wallet.history.withdraw_funds.summary.title") }}
          </h4>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t("wallet.history.withdraw_funds.summary.title") }}
              </span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatAmount(finalAmount) }} ₽
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t("wallet.history.withdraw_funds.summary.commission") }}
              </span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                0 ₽
              </span>
            </div>
            <div class="h-px bg-gray-200 dark:bg-gray-700 my-3"></div>
            <div class="flex justify-between items-center">
              <span class="text-base font-bold text-gray-900 dark:text-white">
                {{ $t("wallet.history.withdraw_funds.summary.total") }}
              </span>
              <span class="text-xl font-bold text-success">
                {{ formatAmount(finalAmount) }} ₽
              </span>
            </div>
          </div>
        </div>

        <!-- Информация о времени обработки -->
        <div
          class="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20"
        >
          <div
            class="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex-shrink-0"
          >
            <UIcon
              name="i-lucide-clock"
              class="w-5 h-5 text-amber-600 dark:text-amber-400"
            />
          </div>
          <div class="flex flex-col">
            <h3
              class="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1"
            >
              {{ $t("wallet.history.withdraw_funds.pending_info.title") }}
            </h3>
            <p class="text-sm text-amber-700 dark:text-amber-300">
              {{ $t("wallet.history.withdraw_funds.pending_info.description") }}
            </p>
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
        >
          {{ $t("wallet.history.withdraw_funds.cancel") }}
        </UButton>
        <UButton
          color="success"
          size="lg"
          class="flex-1 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          :disabled="!canSubmit"
          @click="handleSubmit"
        >
          {{ $t("wallet.history.withdraw_funds.confirm") }}
          {{ formatAmount(finalAmount) }} ₽
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { formatNumber } from "@/utils/formatNumber";
import { useUser } from "@/composables/useUser";
const { t } = useI18n();

const { user } = useUser();
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
const selectedAmount = ref<number | string | null>(null);
const customAmount = ref("");

// Предустановленные суммы (только числа)
const numericAmounts = [1000, 5000, 10000, 25000, 50000];

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
  if (selectedAmount.value === "all") {
    return 13507.5; // Доступная сумма для вывода
  }
  return typeof selectedAmount.value === "number" ? selectedAmount.value : 0;
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

const selectAllAmount = () => {
  selectedAmount.value = "all";
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

const handleSubmit = () => {
  if (canSubmit.value) {
    emit("submit", finalAmount.value, selectedMethod.value);
    closeModal();
  }
};
</script>
