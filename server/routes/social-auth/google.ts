import { IJwtResponse, ISocialAuthDto } from "~/types/common.interface";
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const config = useRuntimeConfig();

  // 1. Получаем токен от Google
  const tokenResponse = await $fetch<{ access_token: string }>(
    "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      body: {
        code: query.code as string,
        client_id: config.public.googleClientId,
        client_secret: config.public.googleClientSecret,
        redirect_uri: config.public.googleRedirectUri,
        grant_type: "authorization_code",
      },
    }
  );

  // 2. Получаем информацию о пользователе
  const userInfo: any = await $fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token as string}`,
      },
    }
  );
  const apiInfo: ISocialAuthDto = {
    id: userInfo.id,
    email: userInfo.email,
    firstName: userInfo.name,
    avatar: userInfo.picture,
  };
  const { accessToken, refreshToken } = await $fetch<IJwtResponse>(
    `${config.public.apiUrl}/auth/social-auth/?provider=google`,
    {
      method: "POST",
      body: apiInfo,
    }
  );
  if (accessToken && refreshToken) {
    setCookie(event, "access_token", accessToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 1,
      path: "/",
    });
    setCookie(event, "refresh_token", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    const fetchUser = await $fetch(`${config.public.apiUrl}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (fetchUser) {
      await sendRedirect(event, "/");
    } else {
      return createError({
        statusCode: 500,
        statusMessage: "Failed to google auth",
      });
    }
  }
});
