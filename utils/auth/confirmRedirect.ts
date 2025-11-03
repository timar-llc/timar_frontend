/**
 * Утилита для редиректа на страницу подтверждения с сохранением типа операции
 */

export type ConfirmType = "loginByPhone" | "registerByPhone" | "resetPassword";

export const redirectToConfirm = (
  type: ConfirmType,
  phoneNumber?: string,
  email?: string,
  password?: string
) => {
  // Сохраняем данные в sessionStorage
  sessionStorage.setItem("confirmType", type);
  sessionStorage.setItem("phoneNumber", phoneNumber || "");
  sessionStorage.setItem("email", email || "");
  sessionStorage.setItem("password", password || "");

  // Редиректим на страницу подтверждения
  navigateTo("/confirm");
};

// Примеры использования:
// redirectToConfirm('loginByPhone', '+79991234567');
// redirectToConfirm('registerByPhone', '+79991234567');
// redirectToConfirm('resetPassword', '+79991234567');
