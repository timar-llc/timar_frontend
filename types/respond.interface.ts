import type { ITask } from "./task.interface";
import type { IUser } from "./user.interface";

export interface IRespond {
  uuid: string;
  task?: ITask | null;
  user: IUser;
  price: number;
  duration: number;
  coverLetter: string;
  createdAt: Date;
  updatedAt: Date;
}
