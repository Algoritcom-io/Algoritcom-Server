import { Player, PlayerMove } from "../types/player";
import { JionWorldData, World } from "../types/worlds";
import { WorldTypes } from "../enums";
import express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "node:http";
import customParser from "socket.io-msgpack-parser";
import { Game, JionGameData } from "../types/games";
import {
  assignPlayerToWorld,
  init,
  removePlayerFromWorld,
  teleportPlayerToWorld,
} from "./worlds";
import { joinGame, playerReady } from "./games";
const PORT = process.env.PORT || 2567;

const app = express();
const server = createServer(app);
app.set("port", PORT);
app.set("trust proxy", true);

const players = new Map<string, Player>();

const connections = new Map<string, string>();
const inWorld = new Map<string, string>();
const worlds = new Map<string, World>();
const games = new Map<string, Game>();

const io = new Server(server, {
  // parser: customParser,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: Socket) => {
  try {
    if (socket.handshake.query.id) {
      init(socket);
    }

    socket.on("world-join", (data: JionWorldData) => {
      assignPlayerToWorld(data, socket);
    });

    socket.on("world-leave", () => {
      removePlayerFromWorld(socket);
    });

    socket.on("teleport-to-world", (data: JionWorldData) => {
      teleportPlayerToWorld(data, socket);
    });

    socket.on("player-move", (data: PlayerMove) => {
      const player = players.get(socket.id);
      if (player) {
        player.position.x = data.position.x;
        player.position.y = data.position.y;
        player.position.z = data.position.z;

        player.rotation.w = data.rotation.w;
        player.rotation.x = data.rotation.x;
        player.rotation.y = data.rotation.y;
        player.rotation.z = data.rotation.z;

        player.animation = data.animation;

        const wordlInstance = inWorld.get(socket.id);

        console.log(
          `Player: ${
            player.name
          }, World/Instance: ${wordlInstance}, Pos:[${player.position.x.toFixed(
            2
          )},${player.position.y.toFixed(2)},${player.position.z.toFixed(
            2
          )}], Rot:[${player.rotation.x.toFixed(2)},${player.rotation.y.toFixed(
            2
          )},${player.rotation.z.toFixed(2)},${player.rotation.w.toFixed(2)}]`
        );

        const instance = inWorld.get(socket.id);
        if (instance) {
          io.sockets.to(instance).emit(`player-moved-${socket.id}`, player);
        }
      }
    });

    socket.on("game-join", (data: JionGameData) => {
      joinGame(socket, data);
    });

    socket.on("game-player-ready", () => {
      console.log("Player ready");
      playerReady(socket);
    });

    socket.on("disconnect", () => {
      const player = players.get(socket.id);
      console.log(`Player ${player?.name} disconnected`);
      removePlayerFromWorld(socket);
      players.delete(socket.id);
    });

    socket.on("start-matchmaking", () => {});
  } catch (error) {
    console.error(error);
  }
});

io.sockets.adapter.on("create-room", (room: any) => {
  console.log(`Room created: ${room}`);
});

io.sockets.adapter.on("join-room", (room: any, id: any) => {
  console.log(`Player ${id} joined room ${room}`);
});

io.sockets.adapter.on("leave-room", (room: any, id: any) => {
  // console.log(`Player ${id} left room ${room}`);
});

export { io, app, server, connections, players, inWorld, worlds, games };
