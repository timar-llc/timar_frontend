import type { IUser } from "./user.interface";

export interface INotification {
  uuid: string;
  title: string;
  description: string;
  slug: string;
  user: IUser;
  icon: "info" | "success" | "warning" | "error";
  readedAt: Date | null;
  createdAt: Date;
}
