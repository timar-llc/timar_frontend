import type { ICategory } from "./category.interface";
import type { IRespond } from "./respond.interface";
import type { IUser } from "./user.interface";

export interface ITask {
  uuid: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  isDraft: boolean;
  status: "pending" | "approved" | "rejected";
  views: number;
  currency: string;
  files: ITaskFile[];
  category?: ICategory;
  user?: IUser;
  respondes?: IRespond[];

  respondesCount: number;

  complexity: "easy" | "medium" | "hard";
  createdAt: Date;
  updatedAt: Date;
  endedAt: Date;
}

export interface ITaskFile {
  uuid: string;
  url: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}
