<template>
  <div class="min-h-screen bg-gradient-content rounded-xl">
    <!-- Header -->
    <div class="relative bg-gradient-nav">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ $t("wallet.title") }}
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-300">
            {{ $t("wallet.description") }}
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Balance Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Total Balance -->
        <div
          class="rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50/90 to-white dark:from-gray-900/50 dark:to-transparent"
        >
          <div class="flex items-center justify-between mb-4">
            <div
              class="p-3 bg-gray-100/80 dark:bg-gray-800/50 rounded-lg flex justify-center items-center"
            >
              <UIcon
                name="i-lucide-wallet"
                class="w-5 h-5 text-gray-700 dark:text-gray-300"
              />
            </div>
          </div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {{ $t("wallet.total_balance.title") }}
          </p>
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {{ formatNumber(user?.totalBalance, 0) }} ₽
          </h3>
        </div>

        <!-- Available for Withdrawal -->
        <div
          class="rounded-2xl p-6 shadow-sm border border-green-100 dark:border-green-500/20 bg-gradient-to-br from-green-50/90 to-white dark:from-green-500/10 dark:to-transparent"
        >
          <div class="flex items-center justify-between mb-4">
            <div
              class="p-3 bg-green-100/80 dark:bg-green-500/15 rounded-lg flex justify-center items-center"
            >
              <UIcon
                name="i-lucide-circle-check"
                class="w-5 h-5 text-green-700 dark:text-green-400"
              />
            </div>
            <UIcon
              name="i-lucide-info"
              class="w-4 h-4 text-green-600 dark:text-green-400 cursor-help"
            />
          </div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {{ $t("wallet.withdraw.title") }}
          </p>
          <h3
            class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2"
          >
            {{ formatNumber(user?.availableBalance, 0) }} ₽
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-500">
            {{ $t("wallet.withdraw.description") }}
          </p>
        </div>

        <!-- Pending -->
        <div
          class="rounded-2xl p-6 shadow-sm border border-amber-100 dark:border-amber-500/20 bg-gradient-to-br from-amber-50/90 to-white dark:from-amber-500/10 dark:to-transparent"
        >
          <div class="flex items-center justify-between mb-4">
            <div
              class="p-3 bg-amber-100/80 dark:bg-amber-500/15 rounded-lg flex justify-center items-center"
            >
              <UIcon
                name="i-lucide-clock"
                class="w-5 h-5 text-amber-700 dark:text-amber-400"
              />
            </div>
          </div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {{ $t("wallet.pending.title") }}
          </p>
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {{ formatNumber(user?.pendingBalance, 0) }} ₽
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-500">
            {{ $t("wallet.pending.description") }}
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex mobile:flex-col gap-4 mb-6 w-full">
        <UButton
          icon="i-lucide-plus"
          variant="solid"
          color="success"
          class="h-12 font-semibold shadow-md hover:shadow-lg transition-all duration-200 w-full justify-center"
          @click="openAddFundsModal"
        >
          {{ $t("wallet.history.add_funds.title") }}
        </UButton>
        <UButton
          icon="i-lucide-arrow-down"
          variant="solid"
          color="error"
          class="h-12 font-semibold shadow-md hover:shadow-lg transition-all duration-200 w-full justify-center"
          @click="openWithdrawModal"
        >
          {{ $t("wallet.history.withdraw_funds.title") }}
        </UButton>
      </div>

      <!-- Transaction History -->
      <div
        class="rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50"
      >
        <div
          class="flex-between mb-6 mobile:flex-col mobile:items-start mobile:gap-4"
        >
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ $t("wallet.history.title") }}
          </h2>
          <UTabs
            :items="tabs"
            color="success"
            class="gap-2"
            v-model="selectedTab"
            :ui="{
              trigger: 'text-sm',
              content: 'bg-white',
              list: 'bg-card-bg shadow-lg ',
            }"
          />
        </div>
        <!-- Состояние загрузки -->
        <div
          v-if="isLoadingTransactions"
          class="flex items-center justify-center py-8"
        >
          <div class="text-gray-500 dark:text-gray-400">
            {{ $t("common.loading") }}
          </div>
        </div>

        <!-- Ошибка загрузки -->
        <div
          v-else-if="transactionsError"
          class="flex items-center justify-center py-8"
        >
          <div class="text-red-500 dark:text-red-400">
            {{ $t("common.error") || "Ошибка загрузки транзакций" }}
          </div>
        </div>

        <!-- Пустой список -->
        <div
          v-else-if="filteredTransactions.length === 0"
          class="flex items-center justify-center py-8"
        >
          <div class="text-gray-500 dark:text-gray-400">
            {{ $t("wallet.history.empty") || "Нет транзакций" }}
          </div>
        </div>

        <!-- Список транзакций -->
        <div v-else class="flex flex-col gap-3">
          <TransactionCard
            v-for="transaction in filteredTransactions"
            :key="transaction.uuid"
            :transaction="transaction"
          />
        </div>
      </div>
    </div>

    <!-- Модалки -->
    <AddFundsModal
      v-if="isAddFundsModalOpen"
      v-model="isAddFundsModalOpen"
      @submit="handleAddFunds"
    />
    <WithdrawFundsModal
      v-if="isWithdrawModalOpen"
      v-model="isWithdrawModalOpen"
      @submit="handleWithdraw"
    />
  </div>
</template>
<script setup lang="ts">
import type { ITransaction } from "@/types/transaction.interface";
import { useI18n } from "vue-i18n";
import AddFundsModal from "@/components/wallet/add-funds-modal.vue";
import WithdrawFundsModal from "@/components/wallet/withdraw-funds-modal.vue";
import { useTransactionApi } from "@/composables/api/useTransactionApi";
import { useUser } from "@/composables/useUser";
import { formatNumber } from "@/utils/formatNumber";

const { t } = useI18n();
const { getTransactions } = useTransactionApi();
const { user } = useUser();

// Загрузка транзакций из API
const {
  data: transactionsData,
  pending: isLoadingTransactions,
  error: transactionsError,
  refresh: refreshTransactions,
} = await useAsyncData("wallet-transactions", async () => {
  const response = await getTransactions({ take: 100, skip: 0 });
  return response.data.value;
});

// Обработка данных транзакций
const transactions = computed<ITransaction[]>(() => {
  if (!transactionsData.value) return [];

  const raw = transactionsData.value as any;
  let items: any[] = [];

  // Обрабатываем различные форматы ответа API
  if (Array.isArray(raw)) {
    items = raw;
  } else if (raw?.items && Array.isArray(raw.items)) {
    items = raw.items;
  } else if (raw?.data && Array.isArray(raw.data)) {
    items = raw.data;
  } else {
    items = [];
  }

  // Преобразуем данные в нужный формат
  return items.map((item: any) => {
    const createdAt =
      item.createdAt && !isNaN(new Date(item.createdAt).getTime())
        ? new Date(item.createdAt)
        : new Date();

    const updatedAt =
      item.updatedAt && !isNaN(new Date(item.updatedAt).getTime())
        ? new Date(item.updatedAt)
        : createdAt;

    // Маппинг типа для совместимости с компонентом TransactionCard
    let mappedType: "deposit" | "withdrawal" | "achievement" = item.type;
    if (item.type === "deposit") {
      mappedType = "deposit";
    }

    // Маппинг метода оплаты для совместимости с компонентом
    const paymentMethod = item.paymentMethod || item.method || "card";
    const method = paymentMethod === "card" ? "bank_card" : paymentMethod;

    // Преобразуем amount в число
    const amount =
      typeof item.amount === "string"
        ? parseFloat(item.amount) || 0
        : typeof item.amount === "number"
        ? item.amount
        : 0;

    // Создаем объект транзакции с дополнительными полями для совместимости
    // Для компонента TransactionCard нужно type === "income" для депозитов
    const transactionType = mappedType === "deposit" ? "deposit" : mappedType;

    const transaction = {
      uuid: item.uuid || item.id,
      amount,
      type: mappedType, // Сохраняем оригинальный тип для фильтрации
      status: item.status || "pending",
      createdAt,
      updatedAt,
      failedAt: item.failedAt ? new Date(item.failedAt) : undefined,
      completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
      paymentMethod: paymentMethod as "card" | "crypto",
      method, // Для совместимости с TransactionCard (ожидает "bank_card" или "crypto")
      user: item.user,
    } as ITransaction & { method?: string };

    // Перезаписываем type для совместимости с компонентом TransactionCard
    // но сохраняем оригинальный тип в _originalType для фильтрации
    (transaction as any)._originalType = mappedType;
    (transaction as any).type = transactionType;

    return transaction;
  });
});

const filteredTransactions = computed(() => {
  const type = selectedTab.value;
  if (type === "all") return transactions.value;

  // Фильтруем по оригинальному типу (_originalType), так как type перезаписан для компонента
  if (type === "deposit") {
    return transactions.value.filter((t: any) => t._originalType === "deposit");
  }
  if (type === "withdrawal") {
    return transactions.value.filter(
      (t: any) => t._originalType === "withdrawal"
    );
  }

  return transactions.value;
});

const selectedTab = ref("all");
const tabs = [
  {
    label: t("wallet.history.types.all"),
    value: "all",
  },
  {
    label: t("wallet.history.types.income"),
    value: "deposit",
  },
  {
    label: t("wallet.history.types.withdraw"),
    value: "withdrawal",
  },
];

// Состояние модалок
const isAddFundsModalOpen = ref(false);
const isWithdrawModalOpen = ref(false);

// Обработчики
const handleAddFunds = (amount: number, method: string) => {
  console.log("Пополнение:", amount, method);
  // Логика пополнения
};

const handleWithdraw = (amount: number, method: string) => {
  console.log("Вывод:", amount, method);
  // Логика вывода
};

// Добавим логирование для отладки
const openAddFundsModal = () => {
  console.log("Открываем модалку пополнения");
  isAddFundsModalOpen.value = true;
};

const openWithdrawModal = () => {
  console.log("Открываем модалку вывода");
  isWithdrawModalOpen.value = true;
};
</script>
