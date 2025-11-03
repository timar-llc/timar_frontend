export interface IStatusOk {
  status: "OK";
}

export interface IJwtResponse {
  accessToken: string;
  refreshToken: string;
}

export type SocialProvider = "google" | "github" | "telegram";
export interface ISocialAuthDto {
  firstName?: string;
  id: string;
  username?: string;
  email?: string;
  avatar: string;
}

export interface IPagination<T> {
  total: number;
  page: number;
  items: T[];
}
