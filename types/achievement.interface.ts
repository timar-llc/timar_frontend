import type { IUser } from "./user.interface";

export interface IAchievement {
  uuid: string;
  title: string;
  description: string;
  slug: string;
  user: IUser;
  icon: string;
  recievedAt: Date | null;
  rarity: "common" | "rare" | "epic" | "legendary";
}
