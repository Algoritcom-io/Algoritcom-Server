import { MessageTypes, WritingAction } from "../../enums";
import { logger } from "../../logger/logger";
import { ChatMessage, Friend, Message, Presence } from "../../types/chat";
import { io } from "../io";
import playerController from "../players/players";

class ChatController {
  public async message(playerID: string, data: ChatMessage) {
    try {
      const player = await playerController.getPlayer(playerID);

      console.log(data);
      if (player) {
        const socket = player.getSocket();
        logger.info(
          `Chat message from player ${playerID} - ${data.message?.user?.name}`
        );
        if (socket) {
          switch (data.message.type) {
            case MessageTypes.GENERAL:
              io.to("general").emit("chat-message", data.message);
              break;
            case MessageTypes.PRIVATE:
              if (data.to) {
                const destinatary = await playerController.getPlayerById(
                  data.to
                );
                logger.info(`Private message to ${destinatary.name}`);
                io.to(destinatary.sessionId).emit(
                  "private-message",
                  data.message
                );
              }
              break;
            case MessageTypes.WORLD:
              io.to(player.inWorld.instance).emit("chat-message", data.message);
              io.to(player.inWorld.instance).emit(
                `message-chat-${player.sessionId}`,
                data.message.content
              );
              break;
            case MessageTypes.GAME:
              io.to(player.inWorld.instance).emit("game-message", data.message);
              io.to(player.inWorld.instance).emit(
                `message-chat-${player.sessionId}`,
                data.message.content
              );
              break;
            default:
              break;
          }
        }
      }
    } catch (error: any) {
      logger.error(error?.message);
    }
  }

  public writing(playerID: string, action: WritingAction) {
    try {
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
    } catch (error: any) {
      logger.error(error?.message);
    }
  }
}
const chatController = new ChatController();
export default chatController;
