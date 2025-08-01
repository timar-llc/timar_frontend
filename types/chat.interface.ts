export interface Message {
  id: number;
  text: string;
  time: string;
  isOwn: boolean;
  audioBlob?: Blob;
  duration?: number; // Длительность голосового сообщения в секундах
}

export interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  messages: Message[];
}
