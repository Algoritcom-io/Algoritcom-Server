import { Server } from "socket.io";
import { http } from "./server";
import { logger } from "../logger/logger";
import playerController from "./players/players";
import serverController from "./serverController";
import { JionWorldData } from "../types/worlds";
import { IPlayerMove } from "../types/player";
import { JoinGameData } from "../types/games";

const io = new Server(http, {
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
      playerController.createPlayer(
        `${socket.handshake.query.id}`,
        `${socket.handshake.query.name}`,
        `${socket.handshake.query.modelUrl}`,
        socket.id
      );
    }
  }

  /* World functions */

  socket.on("world-join", (data: JionWorldData) => {
    serverController.joinPlayerToWorld(data, socket.id);
  });

  socket.on("world-leave", () => {
    serverController.leavePlayerFromWorld(socket.id);
  });

  socket.on("player-move", (data: IPlayerMove) => {
    playerController.move(data, socket.id);
  });

  /* Game functions */

  socket.on("game-join", (joinData: JoinGameData) => {
    serverController.joinPlayerToGame(socket.id, joinData);
  });

  socket.on("game-leave", () => {
    serverController.leavePlayerFromWorld(socket.id);
  });

  socket.on("game-player-ready", () => {
    serverController.JoinGameInstance(socket.id);
  });

  socket.on("game-message", (data: any) => {
    serverController.message(socket.id, data);
  });

  socket.on("end-game", () => {
    serverController.gameFinished(socket.id);
  });

  /* Disconnect */

  socket.on("disconnect", () => {
    socket.leave("general");
    socket.leave("notifications");
    logger.info(`Left general and notifications: ${socket.id}`);
    serverController.leavePlayer(socket.id);
  });
});

export { io };
