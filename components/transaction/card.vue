<template>
  <div
    class="group relative rounded-2xl p-5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 overflow-hidden"
  >
    <!-- Декоративный градиент -->
    <div
      :class="
        props.transaction.status === 'processing' ||
        props.transaction.status === 'pending'
          ? 'bg-gradient-to-r from-amber-500/10 to-transparent'
          : props.transaction.type === 'deposit'
          ? 'bg-gradient-to-r from-green-500/10 to-transparent'
          : 'bg-gradient-to-r from-red-500/10 to-transparent'
      "
      class="absolute top-0 left-0 right-0 h-1"
    ></div>

    <div class="flex items-center gap-4">
      <!-- Иконка с градиентом -->
      <div
        :class="
          props.transaction.status === 'processing' ||
          props.transaction.status === 'pending'
            ? 'bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg shadow-amber-500/20'
            : props.transaction.type === 'deposit'
            ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20'
            : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/20'
        "
        class="p-4 rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 flex justify-center items-center"
      >
        <UIcon
          :name="
            props.transaction.status === 'processing' ||
            props.transaction.status === 'pending'
              ? 'i-lucide-clock'
              : props.transaction.type === 'deposit'
              ? 'i-lucide-arrow-up'
              : 'i-lucide-arrow-down'
          "
          class="w-6 h-6 text-white"
        />
      </div>

      <div class="flex-between w-full min-w-0">
        <div class="flex flex-col min-w-0 flex-1">
          <div class="flex items-center gap-2 mb-1">
            <p class="text-base font-bold text-gray-900 dark:text-white">
              {{
                props.transaction.type === "deposit"
                  ? t("wallet.history.types.income")
                  : t("wallet.history.types.withdraw")
              }}
            </p>
            <div
              :class="
                props.transaction.status === 'pending' ||
                props.transaction.status === 'processing'
                  ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                  : props.transaction.status === 'completed'
                  ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
              "
              class="px-2 py-0.5 rounded-full text-xs font-semibold"
            >
              {{ t("wallet.history.statuses." + props.transaction.status) }}
            </div>
          </div>
          <div
            class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
          >
            <UIcon
              :name="
                props.transaction.paymentMethod === 'card'
                  ? 'i-lucide-credit-card'
                  : props.transaction.paymentMethod === 'crypto'
                  ? 'i-lucide-bitcoin'
                  : 'i-lucide-building-2'
              "
              class="w-3.5 h-3.5"
            />
            <span>
              {{
                t("wallet.history.methods." + props.transaction.paymentMethod)
              }}
              •
              {{ formatDate(props.transaction.createdAt) }}
            </span>
          </div>
        </div>

        <div class="flex flex-col items-end ml-4 flex-shrink-0">
          <h4
            :class="
              props.transaction.status === 'processing' ||
              props.transaction.status === 'pending'
                ? 'text-amber-600 dark:text-amber-400'
                : props.transaction.type === 'deposit'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            "
            class="text-2xl font-bold"
          >
            {{ props.transaction.type === "deposit" ? "+" : "-" }}
            {{ formatNumber(props.transaction.amount, 0) }} ₽
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ITransaction } from "@/types/transaction.interface";
import { useI18n } from "vue-i18n";
import { formatNumber } from "@/utils/formatNumber";

const { t } = useI18n();

// Расширенный тип для совместимости с данными из wallet.vue
const props = defineProps<{ transaction: ITransaction }>();

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};
</script>
