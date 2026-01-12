import type { IUser } from "./user.interface";
import type { ICategory } from "./category.interface";
import type { IRespond } from "./respond.interface";
import type { ITask } from "./task.interface";

export interface IOrder {
  uuid: string;
  price: number;
  duration: number;
  title: string;
  currency: string;
  status: "pending" | "active" | "in_review" | "completed" | "cancelled";
  client: IUser;
  freelancer: IUser;
  respond?: IRespond;
  task?: ITask;
  category?: ICategory;
  createdAt: Date;
  updatedAt: Date;
}
