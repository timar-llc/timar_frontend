<template>
  <div class="bg-card-bg rounded-lg p-4 dark:border-1 dark:border-[#484848]">
    <div class="flex items-center gap-2">
      <UIcon
        :name="
          props.transaction.type === 'income'
            ? 'i-lucide-arrow-up'
            : 'i-lucide-arrow-down'
        "
        :class="
          props.transaction.type === 'income' ? 'text-success' : 'text-error'
        "
        class="p-4"
      />
      <div class="flex-between w-full">
        <div class="flex flex-col">
          <p class="text-sm">
            {{
              props.transaction.type === "income"
                ? t("wallet.history.types.income")
                : t("wallet.history.types.withdraw")
            }}
          </p>
          <p class="text-sm text-gray-500">
            {{ t("wallet.history.methods." + props.transaction.method) }} -
            {{ props.transaction.createdAt }}
          </p>
        </div>
        <div class="flex flex-col items-end">
          <h4 class="text-lg font-bold">
            {{ props.transaction.type === "income" ? "+" : "-" }}
            {{ props.transaction.amount.toFixed(2) }}
          </h4>
          <div class="flex items-center gap-4">
            <UChip
              :color="
                props.transaction.status === 'pending'
                  ? 'warning'
                  : props.transaction.status === 'completed'
                  ? 'success'
                  : 'error'
              "
            />
            <p class="text-sm text-gray-500">
              {{ t("wallet.history.statuses." + props.transaction.status) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ITransaction } from "@/types/transaction.interface";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{ transaction: ITransaction }>();
</script>
