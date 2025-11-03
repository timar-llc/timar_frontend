export default defineNuxtRouteMiddleware(() => {
  const token = useCookie("access_token");

  // Если токен есть, перенаправляем на главную
  if (token.value) {
    return navigateTo("/");
  }
});
