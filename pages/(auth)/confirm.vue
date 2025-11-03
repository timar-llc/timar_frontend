<script setup lang="ts">
import { useAuthApi } from "@/composables/api/useAuthApi";
const { t } = useI18n();
const localePath = useLocalePath();

// Получаем данные из sessionStorage
const confirmType = ref("");
const phoneNumber = ref("");
const email = ref("");
const password = ref("");
const isError = ref(false);
const isShaking = ref(false);
const timeLeft = ref(60);
const isTimerActive = ref(true);

// Запускаем таймер при монтировании компонента
onMounted(() => {
  confirmType.value = sessionStorage.getItem("confirmType") || "";
  phoneNumber.value = sessionStorage.getItem("phoneNumber") || "";
  email.value = sessionStorage.getItem("email") || "";
  password.value = sessionStorage.getItem("password") || "";
  // Запускаем таймер
  startTimer();
});

const startTimer = () => {
  isTimerActive.value = true;
  timeLeft.value = 60;

  const timer = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      clearInterval(timer);
      isTimerActive.value = false;
    }
  }, 1000);
};

const resendCode = async () => {
  if (confirmType.value === "loginByPhone" && phoneNumber.value) {
    const { data, error } = await useAuthApi().loginByPhone({
      phoneNumber: phoneNumber.value,
    });
    if (data.value && !error.value) {
      startTimer();
    } else {
      console.error(error.value);
    }
  } else if (confirmType.value === "registerByPhone" && phoneNumber.value) {
    // Здесь должен быть API для регистрации по телефону
    // const { data, error } = await useAuthApi().registerByPhone({ phoneNumber: phoneNumber.value });
    console.log("Register by phone resend");
  } else if (confirmType.value === "resetPassword" && phoneNumber.value) {
    // Здесь должен быть API для сброса пароля
    // const { data, error } = await useAuthApi().resetPasswordByPhone({ phoneNumber: phoneNumber.value });
    console.log("Reset password resend");
  }
};

const onComplete = async (event: any) => {
  if (confirmType.value === "loginByPhone" && phoneNumber.value) {
    const { data, error } = await useAuthApi().confirmPhoneLogin({
      phoneNumber: phoneNumber.value,
      code: state.code.join(""),
    });
    if (data.value && !error.value) {
      // Очищаем sessionStorage после успешной авторизации
      sessionStorage.removeItem("confirmType");
      sessionStorage.removeItem("phoneNumber");
      useCookie("access_token").value = data.value.accessToken;
      useCookie("refresh_token").value = data.value.refreshToken;
      await useUser().fetchUser();
      navigateTo(localePath("/"));
    } else {
      showError();
    }
  } else if (
    confirmType.value === "register" &&
    password.value &&
    (email.value || phoneNumber.value)
  ) {
    // Здесь должен быть API для подтверждения регистрации
    const { data, error } = await useAuthApi().confirm(
      {
        email: email.value,
        phoneNumber: phoneNumber.value,
        code: state.code.join(""),
      },
      "register"
    );
    if (data.value && !error.value) {
      // Очищаем sessionStorage после успешной регистрации
      sessionStorage.removeItem("confirmType");
      sessionStorage.removeItem("phoneNumber");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("password");
      await useUser().fetchUser();
      navigateTo(localePath("/"));
    } else {
      showError();
    }
    console.log("Confirm registration");
  } else if (
    confirmType.value === "resetPassword" &&
    (email.value || phoneNumber.value)
  ) {
    // Здесь должен быть API для подтверждения сброса пароля
    const { data, error } = await useAuthApi().confirm(
      {
        email: email.value,
        phoneNumber: phoneNumber.value,
        code: state.code.join(""),
      },
      "reset-password"
    );
    if (data.value && !error.value) {
      // Очищаем sessionStorage после успешной сброса пароля
      sessionStorage.removeItem("confirmType");
      sessionStorage.removeItem("password");
      navigateTo(localePath("/set-new-password"));
    } else {
      showError();
    }
    console.log("Confirm password reset");
  }
};

const showError = () => {
  // Показываем ошибку и анимацию тряски
  isError.value = true;
  isShaking.value = true;

  // Очищаем код
  state.code = [];

  // Убираем анимацию тряски через 500ms
  setTimeout(() => {
    isShaking.value = false;
  }, 500);

  // Убираем красный цвет через 3 секунды
  setTimeout(() => {
    isError.value = false;
  }, 3000);
};

const state = reactive({
  code: [],
});
</script>

<template>
  <NuxtLayout name="auth">
    <div class="flex flex-col items-center justify-center my-auto gap-10">
      <h1 class="text-2xl font-bold">{{ t("auth.confirm.title") }}</h1>

      <div
        :class="[
          'transition-all duration-300',
          isShaking ? 'animate-shake' : '',
          //   isError ? 'ring-2 ring-red-500' : '',
        ]"
      >
        <UPinInput
          v-model="state.code"
          type="number"
          otp
          length="6"
          size="xl"
          :color="isError ? 'error' : 'primary'"
          v-on:complete="onComplete"
        />
      </div>

      <p
        v-if="isError"
        class="text-red-500 text-sm text-center animate-fade-in"
      >
        {{ t("auth.confirm.errors.code") }}
      </p>

      <!-- Таймер или кнопка повторной отправки -->
      <div class="text-center">
        <p v-if="isTimerActive" class="text-gray-500 text-sm">
          {{ t("auth.confirm.resend_code_timer", { time: timeLeft }) }}
        </p>
        <UButton
          v-else
          @click="resendCode"
          color="primary"
          variant="outline"
          size="sm"
        >
          {{ t("auth.confirm.resend_code") }}
        </UButton>
      </div>
    </div>
  </NuxtLayout>
</template>
