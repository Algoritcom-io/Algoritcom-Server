import { NotificationTypes, SocialNotificationActions } from "../../enums";
import { logger } from "../../logger/logger";
import { Notification, SocialNotification } from "../../types/notification";
import { io } from "../io";
import playerController from "../players/players";

class NotificationController {
  public async sendNotification(
    socketId: string,
    notification: Notification<SocialNotification>
  ) {
    try {
      const player = await playerController.getPlayer(socketId);
      if (player) {
        const socket = player.getSocket();
        if (socket) {
          switch (notification.type) {
            case NotificationTypes.GENERAL:
              //   io.to("general").emit("notification", notification.data);
              break;
            case NotificationTypes.SOCIAL:
              if (notification.type) {
                const { action, payload } = notification.data;
                const destinatary = await playerController.getPlayerById(
                  payload.to
                );

                switch (action) {
                  case SocialNotificationActions.FRIEND_REQUEST_ACCEPTED:
                    break;
                  default:
                    break;
                }
                if (destinatary) {
                  io.to(destinatary.sessionId).emit(
                    "notification",
                    notification
                  );
                }
              }
              break;
            case NotificationTypes.WORLD:
            //   io.to(player.inWorld.instance).emit("notification", data.data);
            //   break;
            case NotificationTypes.GAME:
            //   io.to(player.inWorld.instance).emit("notification", data.data);
            //   break;
            default:
              break;
          }
        }
      }
    } catch (error: any) {
      logger.error(error?.message);
    }
  }
}
const notificationController = new NotificationController();
export default notificationController;
