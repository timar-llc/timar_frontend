import type { IUser } from "./user.interface";
import type { IMessage } from "./message.interface";

export interface IChat {
  uuid: string;
  user1: IUser;
  user2: IUser;
  updatedAt: Date;
  createdAt: Date;
  messages: IMessage[];
}
