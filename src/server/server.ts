import { Move, Player, Room } from "../types";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import * as errors from "./errors.json";
import { playerEncode } from "./helpers";
import customParser from "socket.io-msgpack-parser";
const PORT = process.env.PORT || 2567;

const app = express();
const server = createServer(app);
app.set("port", PORT);
app.set("trust proxy", true);

const players = new Map<string, Player>();
const roomsData = new Map<string, Room>();
const playerRoom = new Map<string, string>();

const MAX_PLAYERS = Number(process.env.MAX_PLAYERS) || 50;

const io = new Server(server, {
  parser: customParser,
  cors: {
    origin: "*",
  },
});

const gameServer = io.of("/game");
const rooms = io.of("/game").adapter.rooms;

const createRoom = (roomName: string): Room => {
  const room: Room = {
    name: roomName,
    count: 1,
    max: MAX_PLAYERS,
  };
  roomsData.set(roomName, room);
  return room;
};

// gameServer.use((socket: any, next: any) => {
//   const token = socket.handshake.auth.token;
//   if (token === "secret") {
//     return next();
//   }
//   return next(new Error("authentication error"));
// });

gameServer.on("connection", (socket: any) => {
  try {
    const player: Player = {
      id: socket.handshake.query.id,
      sessionId: socket.id,
      name: socket.handshake.query.name,
      position: JSON.parse(socket.handshake.query.position),
      rotation: JSON.parse(socket.handshake.query.rotation),
      animation: socket.handshake.query.animation,
      modelUrl: socket.handshake.query.modelUrl,
    };

    console.log(`Player connected: ${player.name}`);
    players.set(socket.id, player);

    socket.on("world-join", (roomName: string) => {
      if (!roomName) {
        socket.emit("player-error", {
          code: 1000,
          message: errors[1000],
        });
        return;
      }

      let player = players.get(socket.id);
      let roomData = roomsData.get(roomName);

      if (!roomData) {
        roomData = createRoom(roomName);
      }

      if (player && roomData.count + 1 <= roomData.max) {
        roomData.count++;
        console.log(`Player ${player?.name} has joined the room ${roomName}`);
        socket.join(roomName);
        playerRoom.set(socket.id, roomName);
        socket.to(roomName).emit("player-joined", player);

        const playersInRoom = gameServer.adapter.rooms.get(roomName);
        if (playersInRoom) {
          const otherPlayers = Array.from(playersInRoom).filter(
            (id: string) => id !== socket.id
          );
          for (let id of otherPlayers) {
            const player = players.get(id);
            if (player) {
              console.log(
                `Player ${player.id} add to new user instance player ${socket.id}`
              );
              socket.emit("player-init", player);
            }
          }
        }
      } else {
        socket.emit("player-error", {
          code: 1002,
          message: errors[1002],
        });
      }
    });

    socket.on("world-leave", (roomName: string) => {
      if (roomName) {
        let player = players.get(socket.id);
        let room = rooms.get(roomName);
        if (room) {
          const roomData = roomsData.get(roomName);
          if (roomData) {
            roomData.count--;
            console.log(
              `Player ${player?.name} has left to the room ${roomName}`
            );
            socket.leave(roomName);
            playerRoom.delete(socket.id);
            socket.to(roomName).emit("player-leave", socket.id);
          }
        }
      }
    });

    socket.on("player-move", (data: Move) => {
      const room = playerRoom.get(socket.id);
      const player = players.get(socket.id);
      if (room && player) {
        player.animation = data.animation;
        player.position = data.position;
        player.rotation = data.rotation;
        console.log(
          `Player sessionId:${player.sessionId} - ${player.name} moved to ${data.position?.x} ${data.position?.y} ${data.position?.z} - animation: ${data.animation}`
        );
        socket.to(room).emit(`player-moved-${player.sessionId}`, player);
      }
    });

    socket.on("disconnect", function () {
      console.log(`User disconnected: ${socket.id}`);

      players.delete(socket.id);
      const roomName = playerRoom.get(socket.id);
      if (roomName) {
        const roomData = roomsData.get(roomName);
        if (roomData) {
          roomData.count--;
          playerRoom.delete(socket.id);
          socket.to(roomName).emit("player-disconnect", socket.id);
          socket.leaveAll();
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
});

gameServer.adapter.on("create-room", (room: any) => {
  console.log(`Room created: ${room}`);
});

gameServer.adapter.on("delete-room", (room: any) => {
  console.log(`Room deleted: ${room}`);
});

gameServer.adapter.on("join-room", (room: any, id: any) => {
  console.log(`Player ${id} joined room ${room}`);
});

gameServer.adapter.on("leave-room", (room: any, id: any) => {
  console.log(`Player ${id} left room ${room}`);
});

export { rooms, io, app, server };
