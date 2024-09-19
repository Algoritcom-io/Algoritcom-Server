import { Move, Player, Room } from "../../types";
import { io, players, playerRoom } from "../server";
import * as errors from "../errors.json";

const social = io.of("/social");
const rooms = io.of("/social").adapter.rooms;

const roomsData = new Map<string, Room>();

social.on("connection", (socket: any) => {
  socket.join("global");

  socket.on("world-join", (world: string) => {
    socket.join(world);
  });

  socket.on("world-leave", (world: string) => {
    socket.leave(world);
  });

  socket.on("send-message", (message: string) => {});

  socket.on("disconnect", () => {});

  try {
  } catch (e) {
    console.log(e);
  }
});
