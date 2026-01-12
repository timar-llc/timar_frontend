<template>
  <div class="min-h-screen bg-gradient-content rounded-xl">
    <!-- Header -->
    <div class="relative bg-gradient-nav">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div class="flex items-center gap-3">
            <UButton
              icon="i-lucide-arrow-left"
              variant="outline"
              size="sm"
              color="neutral"
              class="rounded-full"
              @click="router.back()"
            />
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ $t("add_project.title") }}
              </h1>
              <p class="mt-2 text-gray-600 dark:text-gray-300">
                {{ $t("add_project.step") }} {{ step + 1 }}
                {{ $t("add_project.of") }} 3
              </p>
            </div>
          </div>
          <!-- <div class="flex gap-3">
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              :disabled="step === 0 || isSubmitting"
              :loading="isSubmitting"
              @click="saveDraft"
            >
              {{ $t("add_project.save_draft") }}
            </UButton>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stepper -->
      <div class="mb-8">
        <UStepper
          :items="items"
          v-model="step"
          color="success"
          class="w-full"
        />
      </div>

      <!-- Component Content -->
      <div class="mb-8">
        <component :is="activeComponent" />
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between items-center gap-4">
        <UButton
          v-if="step > 0"
          color="neutral"
          variant="outline"
          size="lg"
          icon="i-lucide-arrow-left"
          @click="prevStep()"
        >
          {{ $t("common.back") || "Назад" }}
        </UButton>
        <div v-else></div>

        <UButton
          v-if="step < items.length - 1"
          color="success"
          variant="solid"
          size="lg"
          trailing-icon="i-lucide-arrow-right"
          @click="nextStep()"
        >
          {{ $t("add_project.next_step") || "Далее" }}
        </UButton>
        <UButton
          v-else
          color="success"
          variant="solid"
          size="lg"
          trailing-icon="i-lucide-check"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          @click="submitProject()"
        >
          {{ $t("add_project.submit") || "Отправить" }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import type { StepperItem } from "@nuxt/ui";
import { useCreateProjectState } from "@/composables/useCreateProjectState";
import { useProjectApi } from "@/composables/api/useProjectApi";

definePageMeta({
  middleware: "auth",
});

const router = useRouter();
const localePath = useLocalePath();
const { t } = useI18n();
const toast = useToast();
const { state, resetState } = useCreateProjectState();
const { createProject } = useProjectApi();

const step = ref(0);
const isSubmitting = ref(false);
const items: StepperItem[] = [
  {
    title: t("add_project.basic_info.title"),
    icon: "lucide:info",
  },
  {
    title: t("add_project.media.title"),
    icon: "lucide:image-plus",
  },
  {
    title: t("add_project.technologies.title"),
    icon: "lucide:code",
  },
];

const activeComponent = computed(() => {
  switch (step.value) {
    case 0:
      return resolveComponent("CreateProjectBasicInfo");
    case 1:
      return resolveComponent("CreateProjectMedia");
    case 2:
      return resolveComponent("CreateProjectTechnologies");
    default:
      return resolveComponent("CreateProjectBasicInfo");
  }
});

function validateStep(stepIndex: number): { valid: boolean; message?: string } {
  switch (stepIndex) {
    case 0: // Basic Info
      if (!state.value.title || !state.value.title.trim()) {
        return {
          valid: false,
          message:
            t("add_project.validation.title_required") ||
            "Project title is required",
        };
      }
      if (!state.value.categoryUuid) {
        return {
          valid: false,
          message:
            t("add_project.validation.category_required") ||
            "Category is required",
        };
      }
      if (!state.value.subcategoryUuid) {
        return {
          valid: false,
          message:
            t("add_project.validation.subcategory_required") ||
            "Subcategory is required",
        };
      }
      if (!state.value.description || !state.value.description.trim()) {
        return {
          valid: false,
          message:
            t("add_project.validation.description_required") ||
            "Description is required",
        };
      }
      if (!state.value.price || state.value.price <= 0) {
        return {
          valid: false,
          message:
            t("add_project.validation.price_required") ||
            "Price must be greater than 0",
        };
      }
      if (!state.value.duration || state.value.duration <= 0) {
        return {
          valid: false,
          message:
            t("add_project.validation.duration_required") ||
            "Duration is required",
        };
      }
      return { valid: true };

    case 1: // Media
      if (!state.value.media || state.value.media.length === 0) {
        return {
          valid: false,
          message:
            t("add_project.validation.media_required") ||
            "At least one media file is required",
        };
      }
      return { valid: true };

    case 2: // Technologies
      if (!state.value.technologies || state.value.technologies.length === 0) {
        return {
          valid: false,
          message:
            t("add_project.validation.technologies_required") ||
            "At least one technology is required",
        };
      }
      return { valid: true };

    default:
      return { valid: true };
  }
}

function validateCurrentStep(): { valid: boolean; message?: string } {
  return validateStep(step.value);
}

function nextStep() {
  const validation = validateCurrentStep();
  if (!validation.valid) {
    toast.add({
      title: t("common.error") || "Error",
      description: validation.message || "Please fill in all required fields",
      color: "error",
    });
    return;
  }

  if (step.value < items.length - 1) {
    step.value++;
  }
}

function prevStep() {
  if (step.value > 0) {
    step.value--;
  }
}

async function saveDraft() {
  if (!state.value.title || !state.value.subcategoryUuid) {
    toast.add({
      title: t("common.error") || "Error",
      description:
        t("add_project.validation.fill_basic_info") ||
        "Please fill in basic information",
      color: "error",
    });
    return;
  }

  isSubmitting.value = true;
  try {
    const { data, error } = await createProject({
      media: state.value.media,
      title: state.value.title,
      description: state.value.description,
      price: state.value.price,
      duration: state.value.duration,
      subcategoryUuid: state.value.subcategoryUuid!,
      technologies: state.value.technologies,
      isDraft: true,
    });

    if (error.value) {
      throw error.value;
    }

    toast.add({
      title: t("add_project.draft_saved") || "Draft saved",
      description:
        t("add_project.draft_saved_description") ||
        "Your project draft has been saved",
      color: "success",
    });
  } catch (error: any) {
    console.error("Error saving draft:", error);
    toast.add({
      title: t("common.error") || "Error",
      description:
        error?.message || t("add_project.save_error") || "Failed to save draft",
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
}

const { user } = useUser();
async function submitProject() {
  // Validate all steps
  const validation = validateCurrentStep();
  if (!validation.valid) {
    toast.add({
      title: t("common.error") || "Error",
      description: validation.message || "Please fill in all required fields",
      color: "error",
    });
    return;
  }

  // Validate all previous steps as well
  const allValidations = [
    validateStep(0),
    validateStep(1),
    validateStep(2),
  ].filter((v) => !v.valid);

  if (allValidations.length > 0) {
    toast.add({
      title: t("common.error") || "Error",
      description:
        t("add_project.validation.fill_all_fields") ||
        "Please fill in all required fields in all steps",
      color: "error",
    });
    return;
  }

  isSubmitting.value = true;
  try {
    const { data, error } = await createProject({
      media: state.value.media,
      title: state.value.title,
      description: state.value.description,
      price: state.value.price,
      duration: state.value.duration,
      subcategoryUuid: state.value.subcategoryUuid!,
      technologies: state.value.technologies,
      isDraft: false,
    });

    if (error.value) {
      throw error.value;
    }

    toast.add({
      title: t("add_project.success") || "Success",
      description:
        t("add_project.created_successfully") || "Project created successfully",
      color: "success",
    });

    // Reset state and navigate
    resetState();
    router.push(localePath(`/profile/${user.value?.uuid}`));
  } catch (error: any) {
    console.error("Error creating project:", error);
    toast.add({
      title: t("common.error") || "Error",
      description:
        error?.message ||
        t("add_project.create_error") ||
        "Failed to create project",
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
}

// Reset state when component is unmounted
onUnmounted(() => {
  // Don't reset on unmount, keep state for navigation back
  // resetState();
});
</script>
