import { Move, Player, PlayerRoom } from "../types/player";
import { Room } from "../types/room";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import customParser from "socket.io-msgpack-parser";
const PORT = process.env.PORT || 2567;

const app = express();
const server = createServer(app);
app.set("port", PORT);
app.set("trust proxy", true);

const players = new Map<string, Player>();
const playerRoom = new Map<string, PlayerRoom>();
const users = new Map<string, string>();

const io = new Server(server, {
  parser: customParser,
  cors: {
    origin: "*",
  },
});

export { io, app, server, users, players, playerRoom };
