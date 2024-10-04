import { Server } from "socket.io";
import { httpsServer } from "./server";
import { logger } from "../logger/logger";
import playerController from "./players/players";
import serverController from "./serverController";
import { JionWorldData } from "../types/worlds";
import { IPlayerMove } from "../types/player";
import { JoinGameData } from "../types/games";

const io = new Server(httpsServer, {
  // parser: customParser,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  if (socket.handshake.query.id) {
    socket.join("general");
    socket.join("notifications");
    logger.info(`Joined general and notifications: ${socket.id}`);
    if (socket.handshake.query.id && socket.handshake.query.name) {
      try {
        playerController.createPlayer(
          `${socket.handshake.query.id}`,
          `${socket.handshake.query.name}`,
          `${socket.handshake.query.modelUrl}`,
          socket.id
        );
      } catch (error: any) {
        logger.error(error?.message);
      }
    }
  }

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

  socket.on("game-message", (data: any) => {
    try {
      serverController.message(socket.id, data);
    } catch (error: any) {
      logger.error(error?.message);
    }
  });

  socket.on("finish-restart", () => {
    serverController.gameFinished(socket.id);
  });

  socket.on("chat", (data: any) => {
    serverController.chat(socket.id, data);
  });

  /* Disconnect */

  socket.on("disconnect", () => {
    socket.leave("general");
    socket.leave("notifications");
    logger.info(`Left general and notifications: ${socket.id}`);
    try {
      serverController.leavePlayer(socket.id);
    } catch (error: any) {
      logger.error(error?.message);
    }
  });
});

export { io };
