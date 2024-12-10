import { NotificationTypes, SocialNotificationActions } from "../enums";

export interface Notification<T = any> {
  type: NotificationTypes;
  data: T;
}

export interface SocialNotification {
  action: SocialNotificationActions;
  payload: any;
}
