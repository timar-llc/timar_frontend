<template>
  <div class="mt-16 flex flex-col">
    <h2 class="text-4xl mobile:text-2xl mobile:mx-auto">
      {{ t("index.faq.title") }}
    </h2>
    <div class="flex flex-col gap-4 mt-16">
      <UAccordion
        :items="faqItems"
        :ui="{ item: 'dark:border-white border-black' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";

const { t } = useI18n();

const faqItems = ref<AccordionItem[]>([
  {
    id: 1,
    label: t("index.faq.questions.q1"),
    content: t("index.faq.questions.a1"),
  },
  {
    id: 2,
    label: t("index.faq.questions.q2"),
    content: t("index.faq.questions.a2"),
  },
  {
    id: 3,
    label: t("index.faq.questions.q3"),
    content: t("index.faq.questions.a3"),
  },
  {
    id: 4,
    label: t("index.faq.questions.q4"),
    content: t("index.faq.questions.a4"),
  },
  {
    id: 5,
    label: t("index.faq.questions.q5"),
    content: t("index.faq.questions.a5"),
  },
  {
    id: 6,
    label: t("index.faq.questions.q6"),
    content: t("index.faq.questions.a6"),
  },
  {
    id: 7,
    label: t("index.faq.questions.q7"),
    content: t("index.faq.questions.a7"),
  },
  {
    id: 8,
    label: t("index.faq.questions.q8"),
    content: t("index.faq.questions.a8"),
  },
]);
</script>
