import { Server } from "socket.io";
import { httpServer } from "./server";
import { logger } from "../logger/logger";
import playerController from "./players/players";
import serverController from "./serverController";
import { JionWorldData } from "../types/worlds";
import { IPlayerMove } from "../types/player";
import { JoinGameData } from "../types/games";
import chatController from "./chat/chatController";
import { WritingAction } from "../enums";
import { ChatMessage, Message } from "../types/chat";

const io = new Server(httpServer, {
  // parser: customParser,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  if (socket.handshake.query.id) {
    const isGuest = `${socket.handshake.query.isGuest}` === "true";
    socket.join("general");
    socket.join("presence");
    socket.join("notifications");

    if (socket.handshake.query.id && socket.handshake.query.name) {
      try {
        playerController.createPlayer(
          `${socket.handshake.query.id}`,
          `${socket.handshake.query.name}`,
          socket.id,
          isGuest
        );
        socket.to("presence").emit("presence:join", {
          id: socket.handshake.query.id,
          world: "",
          instance: "",
          status: true,
        });
        logger.info(`Joined general and notifications: ${socket.id}`);
      } catch (error: any) {
        logger.error(error?.message);
      }
    }
  }

  // Presence functions
  socket.on("presence:friends", (friends: string[]) => {
    try {
      serverController.sendFriendPresence(socket.id, friends);
    } catch (error: any) {
      logger.error(error?.message);
    }
  });

  socket.on("presence:world", (world: string) => {
    try {
      serverController.sendWorldPresence(socket.id, world);
    } catch (error: any) {
      logger.error(error?.message);
    }
  });

  /* World functions */

  socket.on("world-join", (data: JionWorldData) => {
    try {
      serverController.joinPlayerToWorld(data, socket.id);
    } catch (error: any) {
      logger.error(error?.message);
    }
  });

  socket.on("world-leave", () => {
    try {
      serverController.leavePlayerFromWorld(socket.id);
    } catch (error: any) {
      logger.error(error?.message);
    }
  });

  socket.on("player-move", (data: IPlayerMove) => {
    try {
      playerController.move(data, socket.id);
    } catch (error: any) {
      logger.error(error?.message);
    }
  });

  /* Game functions */

  socket.on("game-join", (joinData: JoinGameData) => {
    try {
      serverController.joinPlayerToGame(socket.id, joinData);
    } catch (error: any) {
      logger.error(error?.message);
    }
  });

  socket.on("game-leave", () => {
    try {
      serverController.leavePlayerFromWorld(socket.id);
    } catch (error: any) {
      logger.error(error?.message);
    }
  });

  socket.on("game-player-ready", () => {
    try {
      serverController.JoinGameInstance(socket.id);
    } catch (error: any) {
      logger.error(error?.message);
    }
  });

  socket.on("game-notification", (data: any) => {
    try {
      serverController.gameNotifiaction(socket.id, data);
    } catch (error: any) {
      logger.error(error?.message);
    }
  });

  socket.on("finish-restart", () => {
    serverController.gameFinished(socket.id);
  });

  socket.on("chat-message", (data: ChatMessage) => {
    chatController.message(socket.id, data);
  });

  socket.on("chat-writing", (data: WritingAction) => {
    chatController.writing(socket.id, data);
  });

  /* Disconnect */

  socket.on("disconnect", () => {
    try {
      serverController.leavePlayer(socket.id);
    } catch (error: any) {
      logger.error(error?.message);
    }
  });
});

export { io };
