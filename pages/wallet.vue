<template>
  <div>
    <h1 class="text-2xl font-bold mobile:text-sm">
      {{ $t("wallet.title") }}
    </h1>
    <div class="flex mobile:flex-col gap-4 mt-4">
      <div
        class="rounded-lg p-4 flex flex-col gap-2 dark:border-1 dark:border-[#484848] w-full bg-card-bg dark:bg-black"
      >
        <div class="flex flex-col w-full">
          <p class="text-sm">
            {{ $t("wallet.total_balance.title") }}
          </p>
          <h3 class="text-3xl font-bold mt-4">15 847,50 $</h3>
          <p class="text-sm text-gray-400 mt-2">
            {{ $t("wallet.total_balance.last_update") }} 12:00
          </p>
        </div>
      </div>
      <div
        class="rounded-lg p-4 flex flex-col gap-2 dark:border-1 dark:border-[#484848] w-full bg-card-bg dark:bg-black"
      >
        <div class="flex flex-col w-full">
          <div class="flex-between">
            <p class="text-sm">
              {{ $t("wallet.withdraw.title") }}
            </p>
            <UIcon name="i-lucide-info" class="text-success" />
          </div>

          <h3 class="text-3xl font-bold mt-4 text-success">13 507,50 $</h3>
          <p class="text-sm text-gray-400 mt-2">
            {{ $t("wallet.withdraw.description") }}
          </p>
        </div>
      </div>
      <div
        class="rounded-lg p-4 flex flex-col gap-2 dark:border-1 dark:border-[#484848] w-full bg-card-bg dark:bg-black"
      >
        <div class="flex flex-col w-full">
          <p class="text-sm">
            {{ $t("wallet.pending.title") }}
          </p>
          <h3 class="text-3xl font-bold mt-4">2 340,00 $</h3>
          <p class="text-sm text-gray-400 mt-2">
            {{ $t("wallet.pending.description") }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex mt-4 gap-4 h-12">
      <UButton
        icon="i-lucide-plus"
        variant="solid"
        color="success"
        class="w-full flex justify-center items-center"
        @click="openAddFundsModal"
      >
        {{ $t("wallet.history.add_funds.title") }}
      </UButton>
      <UButton
        icon="i-lucide-arrow-down"
        variant="outline"
        color="error"
        class="w-full flex justify-center items-center"
        @click="openWithdrawModal"
      >
        {{ $t("wallet.history.withdraw_funds.title") }}
      </UButton>
    </div>
    <div
      class="mt-4 dark:border-1 dark:border-[#484848] rounded-lg p-6 bg-card-bg dark:bg-black"
    >
      <div class="flex-between">
        <h2 class="text-lg font-bold">
          {{ $t("wallet.history.title") }}
        </h2>
        <UTabs
          :items="tabs"
          color="success"
          class="gap-3"
          v-model="selectedTab"
        />
      </div>
      <div class="mt-4 flex flex-col gap-4">
        <TransactionCard
          v-for="transaction in filteredTransactions"
          :key="transaction.id"
          :transaction="transaction"
        />
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

const { t } = useI18n();

const transactions = ref<ITransaction[]>([
  {
    id: "1",
    amount: 100.45,
    type: "income",
    status: "completed",
    createdAt: "2025-01-01",
    method: "bank_card",
  },
  {
    id: "2",
    amount: 5000.45,
    type: "withdraw",
    status: "failed",
    createdAt: "2025-01-01",
    method: "bank_card",
  },
  {
    id: "3",
    amount: 100.45,
    type: "withdraw",
    status: "pending",
    createdAt: "2025-01-01",
    method: "bank_card",
  },
]);

const filteredTransactions = computed(() => {
  const type = selectedTab.value;
  if (type === "all") return transactions.value;
  return transactions.value.filter((t) => t.type === type);
});

const selectedTab = ref("all");
const tabs = [
  {
    label: t("wallet.history.types.all"),
    value: "all",
  },
  {
    label: t("wallet.history.types.income"),
    value: "income",
  },
  {
    label: t("wallet.history.types.withdraw"),
    value: "withdraw",
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
