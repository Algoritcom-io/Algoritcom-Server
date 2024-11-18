const enum WorldTypes {
  "space" = "space",
  "world" = "world",
  "game" = "game",
}

export { WorldTypes };

export enum MessageStatus {
  SENDED = "sended",
  VIEWED = "viewed",
  DELETED = "deleted",
}

export enum MessageTypes {
  GENERAL = "general",
  WORLD = "world",
  GAME = "game",
  PRIVATE = "private",
}

export enum ChatActionTypes {
  SEND_MESSAGE = "send_message",
  DELETE_MESSAGE = "delete_message",
  EDIT_MESSAGE = "edit_message",
  VIEW_MESSAGE = "view_message",
  WRITE_MESSAGE = "write_message",
}

export enum WritingAction {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
