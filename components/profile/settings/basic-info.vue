<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import type { IUser } from "@/types/user.interface";
import { useUserApi } from "@/composables/api/useUserApi";
import { useUser } from "@/composables/useUser";
const emit = defineEmits<{
  (e: "user-updated", user: IUser): void;
}>();

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  specialization: "",
  cv: "",
});
const { updateUser, updateUserAvatar } = useUserApi();
const { user } = useUser();
// Get direct access to user state to bypass readonly
const userState = useState<IUser | null>("user", () => null);

const applyUserToForm = (u: IUser | null) => {
  if (!u) return;
  // Preserve null values as empty strings for form inputs
  form.value.firstName = u.firstName ?? "";
  form.value.lastName = u.lastName ?? "";
  form.value.email = u.email ?? "";
  form.value.phoneNumber = u.phoneNumber ?? "";
  form.value.specialization = u.specialization ?? "";
  form.value.cv = u.cv ?? "";
};

watch(
  () => user.value,
  (val) => applyUserToForm(val || null),
  { immediate: true }
);

const toast = useToast();

const fileInputRef = ref<HTMLInputElement | null>(null);
const avatarUpdateKey = ref(0);

const displayName = computed(() => {
  const first = form.value.firstName.trim();
  const last = form.value.lastName.trim();
  const full = `${first} ${last}`.trim();
  return full || user.value?.username || "User";
});

// Watch for avatar URL changes to trigger reactive update
watch(
  () => user.value?.avatarUrl,
  () => {
    avatarUpdateKey.value = Date.now();
  }
);

// Also watch the entire user object to catch any updates
watch(
  () => user.value,
  (newUser, oldUser) => {
    if (newUser?.avatarUrl !== oldUser?.avatarUrl) {
      avatarUpdateKey.value = Date.now();
    }
  },
  { deep: true }
);

const buildPayload = () => {
  // Send all fields, converting empty strings to null to clear them on server
  return {
    firstName: form.value.firstName.trim() || null,
    lastName: form.value.lastName.trim() || null,
    email: form.value.email.trim() || null,
    phoneNumber: form.value.phoneNumber.trim() || null,
    specialization: form.value.specialization.trim() || null,
    cv: form.value.cv.trim() || null,
  };
};

const handleUploadAvatar = () => {
  fileInputRef.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const { data, error } = await updateUserAvatar(file);
    if (data.value && !error.value) {
      const updated = data.value as IUser;
      // Update global user state directly - this will trigger reactive updates everywhere
      userState.value = { ...updated } as any;
      // Update cache busting key to force image reload
      avatarUpdateKey.value = Date.now();
      emit("user-updated", updated);
      toast.add({
        title: "Success",
        description: "Avatar updated successfully",
        color: "success",
      });
    } else {
      toast.add({
        title: "Error",
        description: "Failed to update avatar",
        color: "error",
      });
    }
  } catch (err) {
    console.error("Failed to update avatar", err);
    toast.add({
      title: "Error",
      description: "Failed to update avatar",
      color: "error",
    });
  } finally {
    // Reset input to allow selecting the same file again
    if (target) target.value = "";
  }
};

const handleDeleteAvatar = async () => {
  try {
    const { data, error } = await updateUserAvatar(null);
    if (data.value && !error.value) {
      const updated = data.value as IUser;
      // Update global user state directly - this will trigger reactive updates everywhere
      userState.value = { ...updated } as any;
      // Update cache busting key to force image reload
      avatarUpdateKey.value = Date.now();
      emit("user-updated", updated);
      toast.add({
        title: "Success",
        description: "Avatar deleted successfully",
        color: "success",
      });
    } else {
      toast.add({
        title: "Error",
        description: "Failed to delete avatar",
        color: "error",
      });
    }
  } catch (err) {
    console.error("Failed to delete avatar", err);
    toast.add({
      title: "Error",
      description: "Failed to delete avatar",
      color: "error",
    });
  }
};

const onSubmit = async () => {
  const payload = buildPayload();
  const { data, error } = await updateUser(payload);
  if (data.value && !error.value) {
    const updated = data.value as IUser;
    applyUserToForm(updated);
    user.value = updated as any;
    emit("user-updated", updated);
    toast.add({
      title: "Success",
      description: "Profile updated successfully",
      color: "success",
    });
  } else {
    toast.add({
      title: "Error",
      description: "Failed to update profile",
      color: "error",
    });
  }
};
</script>

<template>
  <div class="flex flex-col gap-6 w-full">
    <div class="flex flex-col gap-4 w-full">
      <h3 class="text-xl font-bold">{{ $t("basic_information.title") }}</h3>

      <div class="grid grid-cols-2 gap-4 mobile:grid-cols-1">
        <UFormField :label="$t('basic_information.name')" name="firstName">
          <UInput
            v-model="form.firstName"
            :placeholder="$t('basic_information.name')"
            class="w-full"
            color="success"
            @blur="onSubmit"
          />
        </UFormField>

        <UFormField :label="$t('basic_information.last_name')" name="lastName">
          <UInput
            v-model="form.lastName"
            :placeholder="$t('basic_information.last_name')"
            class="w-full"
            color="success"
            @blur="onSubmit"
          />
        </UFormField>
      </div>

      <UFormField :label="$t('basic_information.email')" name="email">
        <UInput
          v-model="form.email"
          type="email"
          :placeholder="$t('basic_information.email')"
          class="w-full"
          color="success"
          @blur="onSubmit"
        />
      </UFormField>

      <div class="grid grid-cols-2 gap-4 mobile:grid-cols-1">
        <UFormField :label="$t('basic_information.phone')" name="phoneNumber">
          <UInput
            v-model="form.phoneNumber"
            :placeholder="$t('basic_information.phone')"
            class="w-full"
            color="success"
            @blur="onSubmit"
          />
        </UFormField>

        <!-- <UFormField :label="$t('basic_information.country')" name="country">
          <UInput
            v-model="form.country"
            :placeholder="$t('basic_information.country')"
            class="w-full"
            color="success"
            @blur="onSubmit"
          />
        </UFormField> -->
      </div>

      <UFormField
        :label="$t('basic_information.specialization')"
        name="specialization"
      >
        <UInput
          v-model="form.specialization"
          :placeholder="$t('basic_information.specialization')"
          class="w-full"
          color="success"
          @blur="onSubmit"
        />
      </UFormField>

      <UFormField :label="$t('basic_information.about')" name="cv">
        <UTextarea
          v-model="form.cv"
          :placeholder="$t('basic_information.about')"
          class="w-full"
          color="success"
          @blur="onSubmit"
        />
      </UFormField>
    </div>

    <div class="flex flex-col gap-4">
      <h3 class="text-xl font-bold">
        {{ $t("basic_information.profile_photo") }}
      </h3>

      <div class="flex items-center gap-4">
        <UAvatar
          :key="`avatar-${avatarUpdateKey}`"
          :src="
            user?.avatarUrl
              ? `${user.avatarUrl}?t=${avatarUpdateKey}`
              : undefined
          "
          width="80"
          :alt="displayName"
          height="80"
          class="rounded-full"
          size="2xl"
        />
        <div class="flex flex-col gap-2">
          <input
            ref="fileInputRef"
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            class="hidden"
            @change="handleFileChange"
          />
          <UButton
            color="success"
            variant="solid"
            size="sm"
            @click="handleUploadAvatar"
          >
            {{ $t("basic_information.upload_photo") }}
          </UButton>
          <UButton
            color="error"
            variant="outline"
            size="sm"
            @click="handleDeleteAvatar"
          >
            {{ $t("basic_information.delete_photo") }}
          </UButton>
        </div>
      </div>

      <p class="text-sm text-muted">
        {{ $t("basic_information.recommended_size") }}: 400х400px,
        {{ $t("basic_information.format") }} JPG, PNG.
      </p>
    </div>
  </div>
</template>
