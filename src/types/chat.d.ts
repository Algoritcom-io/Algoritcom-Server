import {
  ChatActionTypes,
  MessageStatus,
  MessageTypes,
  WritingAction,
} from "../enums";

export interface User {
  id: string;
  name: string;
  pictureProfile: string;
  sessionId: string;
}

export interface Friend extends Pick<User, "id" | "name" | "sessionId"> {
  online: boolean;
}

export interface Chat {
  message?: string;
}

export interface ChatMessage {
  from?: string;
  to?: string;
  message: Message;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  status?: MessageStatus;
  type: MessageTypes;
}

export interface Presence {
  id: string;
  name: string;
  world: string;
  instance: string;
  status: boolean;
}

export interface Presences {
  [key: string]: Presence;
}
