import { MessageTypes, WritingAction } from "../../enums";
import { logger } from "../../logger/logger";
import { Message } from "../../types/chat";
import { io } from "../io";
import playerController from "../players/players";

class ChatController {
  public message(playerID: string, message: Message) {
    const player = playerController.getPlayer(playerID);
    if (player) {
      const socket = player.getSocket();
      logger.info(
        `Chat message from player ${playerID} - ${message.user.name}`
      );
      if (socket) {
        switch (message.type) {
          case MessageTypes.GENERAL:
            io.to("general").emit("chat-message", message);
            break;
          case MessageTypes.PRIVATE:
            io.to(player.sessionId).emit("private-message", message);
            break;
          case MessageTypes.WORLD:
            io.to(player.inWorld.instance).emit("chat-message", message);
            io.to(player.inWorld.instance).emit(
              `message-chat-${player.sessionId}`,
              message.content
            );
            break;
          case MessageTypes.GAME:
            io.to(player.inWorld.instance).emit("game-message", message);
            io.to(player.inWorld.instance).emit(
              `message-chat-${player.sessionId}`,
              message.content
            );
            break;
          default:
            break;
        }
      }
    }
  }

  public writing(playerID: string, action: WritingAction) {
    const player = playerController.getPlayer(playerID);
    if (player) {
      const socket = player.getSocket();
      logger.info(
        `Writing from player ${playerID} - ${action ? "start" : "end"}`
      );
      if (socket) {
        socket
          .to(player.inWorld.instance)
          .emit(`writing-chat-${player.sessionId}`, action);
      }
    }
  }
}
const chatController = new ChatController();
export default chatController;
