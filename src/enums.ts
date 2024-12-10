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

export enum NotificationTypes {
  WORLD = "world",
  GAME = "game",
  GENERAL = "general",
  SOCIAL = "social",
}

export enum SocialNotificationActions {
  FRIEND_REQUEST = "friend_request",
  FRIEND_REQUEST_ACCEPTED = "friend_request_accepted",
  FRIEND_REQUEST_REJECTED = "friend_request_rejected",
  FRIEND_REQUEST_CANCELED = "friend_request_canceled",
  FRIEND_REMOVED = "friend_removed",
}
