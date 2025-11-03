<template>
  <div
    class="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-4 max-w-md"
  >
    <!-- Заголовок предложения -->
    <div class="flex items-center gap-2 mb-3">
      <UIcon name="i-lucide-handshake" class="w-5 h-5" />
      <span class="font-semibold text-lg">{{ message.content }}</span>
      <UBadge color="success" variant="solid" size="xs" class="ml-auto">
        {{ t("chat.offer") }}
      </UBadge>
    </div>

    <!-- Содержание предложения -->
    <p class="text-sm mb-4 leading-relaxed">
      {{ message.content }}
    </p>

    <!-- Детали предложения -->
    <div class="space-y-2 mb-4">
      <div class="flex justify-between items-center">
        <span class="text-sm opacity-90">{{ t("chat.budget") }}:</span>
        <span class="font-semibold">{{ formatPrice(message.metadata?.price as number) }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm opacity-90">{{ t("chat.term") }}:</span>
        <span class="font-semibold">{{
          formatPlural(message.metadata?.duration as number, "days")
        }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm opacity-90">{{ t("chat.payment") }}:</span>
        <span class="font-semibold">{{ message.metadata?.payment }}</span>
      </div>
    </div>

    <!-- Кнопки действий -->
    <div class="flex gap-2">
      <UButton
        color="success"
        variant="solid"
        size="sm"
        class="flex-1"
        @click="handleAcceptOffer"
      >
        {{ t("chat.accept_offer") }}
      </UButton>
      <UButton
        color="neutral"
        variant="outline"
        size="sm"
        class="flex-1 text-white border-white hover:bg-white hover:text-green-700"
        @click="handleDiscussTerms"
      >
        {{ t("chat.discuss_terms") }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IMessage } from "@/types/message.interface";

interface Props {
  message: IMessage;
}

const props = defineProps<Props>();
const { t } = useI18n();
const { formatPlural } = usePluralization();

// Format price with spaces
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
};

const handleAcceptOffer = () => {
  // TODO: Implement accept offer logic
  console.log("Accept offer:", props.message);
};

const handleDiscussTerms = () => {
  // TODO: Implement discuss terms logic
  console.log("Discuss terms:", props.message);
};
</script>
