import type { IChat } from "./chat.interface";
import type { IUser } from "./user.interface";

export interface IMessage {
  uuid: string;
  chat?: IChat;
  sender?: IUser;
  replyTo?: IMessage;
  content?: string;
  offerAccepted?: boolean;
  attachments?: IMessageAttachment[];
  type?: "text" | "offer" | "audio"; // Тип сообщения
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  readedAt?: Date;
}

export interface IMessageAttachment {
  uuid: string;
  url: string;
  message?: IMessage;
  type: "image" | "video" | "audio" | "file";
  createdAt: Date;
  updatedAt: Date;
}
