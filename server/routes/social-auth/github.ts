import { IJwtResponse, ISocialAuthDto } from "~/types/common.interface";
export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const config = useRuntimeConfig();

  const tokenResponse = await $fetch<{ access_token: string }>(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: {
        client_id: config.public.githubClientId,
        client_secret: config.public.githubClientSecret,
        code: query.code as string,
        redirect_uri: config.public.githubRedirectUri,
      },
    }
  );

  // 2. Получаем информацию о пользователе
  const userInfo: any = await $fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenResponse.access_token}`,
      "User-Agent": "TimarLance",
    },
  });

  let userEmail = userInfo.email;

  if (!userEmail) {
    const userEmails: any = await $fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
        "User-Agent": "TimarLance",
      },
    });

    // Берем основной email или первый подтвержденный
    const primaryEmail = userEmails.find((email: any) => email.primary);
    const verifiedEmail = userEmails.find((email: any) => email.verified);

    userEmail =
      primaryEmail?.email || verifiedEmail?.email || userEmails[0]?.email;
  }

  const apiInfo: ISocialAuthDto = {
    id: userInfo.id,
    email: userEmail,
    firstName: userInfo.name,
    username: userInfo.login,
    avatar: userInfo.avatar_url,
  };
  const { accessToken, refreshToken } = await $fetch<IJwtResponse>(
    `${config.public.apiUrl}/auth/social-auth/?provider=github`,
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
