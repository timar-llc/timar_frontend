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
        <UFormField :label="$t('basic_information.phone')" name="phone">
          <UInput
            v-model="form.phone"
            :placeholder="$t('basic_information.phone')"
            class="w-full"
            color="success"
            @blur="onSubmit"
          />
        </UFormField>

        <UFormField :label="$t('basic_information.country')" name="country">
          <UInput
            v-model="form.country"
            :placeholder="$t('basic_information.country')"
            class="w-full"
            color="success"
            @blur="onSubmit"
          />
        </UFormField>
      </div>

      <UFormField
        :label="$t('basic_information.specialization')"
        name="profession"
      >
        <UInput
          v-model="form.profession"
          :placeholder="$t('basic_information.specialization')"
          class="w-full"
          color="success"
          @blur="onSubmit"
        />
      </UFormField>

      <UFormField :label="$t('basic_information.about')" name="about">
        <UTextarea
          v-model="form.about"
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
          :src="avatarSrc"
          width="80"
          height="80"
          class="rounded-full"
          size="2xl"
        />
        <div class="flex flex-col gap-2">
          <UButton color="success" variant="solid" size="sm">
            {{ $t("basic_information.upload_photo") }}
          </UButton>
          <UButton color="error" variant="outline" size="sm">
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

<script setup lang="ts">
const form = ref({
  firstName: "Алексей",
  lastName: "Иванов",
  email: "alexey@example.com",
  phone: "+7 (999) 123-45-67",
  country: "Россия",
  profession: "Веб-разработчик",
  about:
    "Опытный веб-разработчик с 5-летним стажем работы с современными технологиями.",
});
const toast = useToast();
const onSubmit = () => {
  toast.add({
    title: "Success",
    description: "Profile updated successfully",
    color: "success",
  });
};

const avatarSrc = ref("https://i.pravatar.cc/150?u=a042581f4e29026024d");
</script>
