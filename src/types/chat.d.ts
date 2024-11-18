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

export interface Chat {
  message?: string;
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

export interface ChatAction {
  type: ChatActionTypes;
  message?: Message;
  action?: WritingAction;
}
