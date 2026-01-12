<script setup lang="ts">
import { computed, ref } from "vue";
import type { IUser } from "@/types/user.interface";
import { useUserApi } from "@/composables/api/useUserApi";
import { useUser } from "@/composables/useUser";

const emit = defineEmits<{
  (e: "user-updated", user: IUser): void;
}>();

const { updateUser } = useUserApi();
const { user } = useUser();
const userState = useState<IUser | null>("user", () => null);
const toast = useToast();

const newTechnology = ref("");
const isAdding = ref(false);

const selectedTechnologies = computed(() => {
  return user.value?.technologies || [];
});

const availableTechnologies = [
  "React",
  "Angular",
  "Svelte",
  "Next.js",
  "Express.js",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "AWS",
  "Vue.js",
  "Nuxt.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Python",
  "Java",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
];

// Filter and search technologies for autocomplete
const filteredTechnologies = computed(() => {
  if (!newTechnology.value) {
    return availableTechnologies
      .filter((tech) => !selectedTechnologies.value.includes(tech))
      .map((tech) => ({ label: tech, value: tech }));
  }
  const search = newTechnology.value.toLowerCase();
  return availableTechnologies
    .filter(
      (tech) =>
        !selectedTechnologies.value.includes(tech) &&
        tech.toLowerCase().includes(search)
    )
    .map((tech) => ({ label: tech, value: tech }));
});

const addTechnology = async (tech?: string) => {
  const techValue = tech || newTechnology.value.trim();
  if (!techValue) return;

  // Check if technology already exists
  if (selectedTechnologies.value.includes(techValue)) {
    toast.add({
      title: "Warning",
      description: "This technology is already added",
      color: "warning",
    });
    newTechnology.value = "";
    return;
  }

  isAdding.value = true;
  try {
    const { data, error } = await updateUser({
      technologies: [...selectedTechnologies.value, techValue],
    });
    if (data.value && !error.value) {
      const updated = data.value as IUser;
      // Update global user state
      userState.value = { ...updated } as any;
      emit("user-updated", updated);
      toast.add({
        title: "Success",
        description: "Technology added successfully",
        color: "success",
      });
      newTechnology.value = "";
    } else {
      toast.add({
        title: "Error",
        description: "Failed to add technology",
        color: "error",
      });
    }
  } catch (err) {
    console.error("Failed to add technology", err);
    toast.add({
      title: "Error",
      description: "Failed to add technology",
      color: "error",
    });
  } finally {
    isAdding.value = false;
  }
};

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});
const removeTechnology = async (tech: string) => {
  try {
    const updatedTechs = selectedTechnologies.value.filter((t) => t !== tech);
    const { data, error } = await updateUser({
      technologies: updatedTechs.length > 0 ? updatedTechs : null,
    });
    if (data.value && !error.value) {
      const updated = data.value as IUser;
      // Update global user state
      userState.value = { ...updated } as any;
      emit("user-updated", updated);
      toast.add({
        title: "Success",
        description: "Technology removed successfully",
        color: "success",
      });
    } else {
      toast.add({
        title: "Error",
        description: "Failed to remove technology",
        color: "error",
      });
    }
  } catch (err) {
    console.error("Failed to remove technology", err);
    toast.add({
      title: "Error",
      description: "Failed to remove technology",
      color: "error",
    });
  }
};
</script>

<template>
  <div class="flex flex-col gap-6">
    <h3 class="text-xl font-bold">
      {{ $t("skills_and_specialization.title") }}
    </h3>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">Технологии</label>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="tech in selectedTechnologies"
            :key="tech"
            color="success"
            :variant="isDark ? 'outline' : 'solid'"
            class="cursor-pointer"
            @click="removeTechnology(tech)"
          >
            #{{ tech }}
          </UBadge>
        </div>
        <div class="flex gap-2">
          <UInput
            v-model="newTechnology"
            placeholder="Введите название технологии"
            color="success"
            class="flex-1"
            @keydown.enter="addTechnology()"
          />
          <UButton
            color="success"
            :loading="isAdding"
            :disabled="!newTechnology.trim()"
            @click="addTechnology()"
          >
            Добавить
          </UButton>
        </div>
        <div v-if="filteredTechnologies.length > 0" class="flex flex-col gap-2">
          <p class="text-xs text-gray-500">Популярные технологии:</p>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="tech in filteredTechnologies.slice(0, 10)"
              :key="tech.value"
              color="success"
              :variant="isDark ? 'outline' : 'solid'"
              class="cursor-pointer hover:opacity-80"
              @click="addTechnology(tech.value)"
            >
              {{ tech.label }}
            </UBadge>
          </div>
        </div>
        <p class="text-xs text-gray-500">
          Введите название технологии или выберите из популярных. Нажмите Enter
          или кнопку "Добавить" для добавления.
        </p>
      </div>
    </div>
  </div>
</template>
