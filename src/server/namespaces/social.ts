import { io, users } from "../server";
import * as errors from "../errors.json";
import { Message } from "../../types/chat";

const social = io.of("/social");
const rooms = io.of("/social").adapter.rooms;

const userInWorld = new Map<string, string>();

social.on("connection", (socket: any) => {
  try {
    if (socket.handshake.query.id) {
      socket.join("global");
      socket.join("notifications");
      social
        .to("notifications")
        .emit("user-connected", socket.handshake.query.id);
      users.set(socket.handshake.query.id, socket.id);

      socket.on("channel-join", (channel: string) => {
        userInWorld.set(socket.id, channel);
        socket.join(channel);
      });

      socket.on("channel-leave", (channel: string) => {
        userInWorld.delete(socket.id);
        socket.leave(channel);
      });

      socket.on("teleport-to-world", (world: string) => {
        const oldWorld = userInWorld.get(socket.id);
        if (oldWorld) {
          socket.leave(oldWorld);
        }
        userInWorld.set(socket.id, world);
        socket.join(world);
      });

      socket.on("send-message", (message: Message, channel: string) => {
        if (channel) {
          social.to(channel).emit("receive-message", message);
        }
      });

      socket.on("send-direct-message", (message: Message, to: string) => {
        const toSocketId = users.get(to);
        if (toSocketId) {
          socket.to(toSocketId).emit("receive-direct-message", message);
        }
      });

      socket.on("disconnect", () => {
        const world = userInWorld.get(socket.id);
        social
          .to("notifications")
          .emit("user-disconnected", socket.handshake.query.id);
        if (world) {
          userInWorld.delete(socket.id);
          socket.leave(world);
          socket.leave("global");
          socket.leave("notifications");
        }
      });
    }
  } catch (e) {
    social.to(socket.id).emit("error", {
      code: 1000,
      message: errors[1000],
    });
    return;
  }
});

social.adapter.on("join-room", (room: any, id: string) => {
  console.log(`User ${id} joined room ${room}`);
});

social.adapter.on("leave-room", (room: any, id: string) => {
  console.log(`User ${id} left room ${room}`);
});
