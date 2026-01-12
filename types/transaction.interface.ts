import type { IUser } from "./user.interface";

export interface ITransaction {
  uuid: string;
  amount: number;
  type: "deposit" | "withdraw" | "achievement";
  status: "pending" | "completed" | "failed" | "processing";
  createdAt: Date;
  updatedAt: Date;
  failedAt?: Date;
  completedAt?: Date;
  paymentMethod: "card" | "crypto";
  user: IUser;
}
