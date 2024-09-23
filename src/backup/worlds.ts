// import { WorldTypes } from "../enums";
// import { Player } from "../types/player";
// import { JionWorldData, World, WorldInstance } from "../types/worlds";
// import { players, inWorld, worlds, connections, io } from "./server";
// import { Socket } from "socket.io";
// import { v4 as uuidv4 } from "uuid";

// function createPlayer(socket: Socket): Player {
//   try {
//     const player: Player = {
//       id:
//         typeof socket.handshake.query.id === "string"
//           ? socket.handshake.query.id
//           : "",
//       sessionId: socket.id,
//       name:
//         typeof socket.handshake.query.name === "string"
//           ? socket.handshake.query.name
//           : "",
//       position: {
//         x: 0,
//         y: 0,
//         z: 0,
//       },
//       rotation: {
//         x: 0,
//         y: 0,
//         z: 0,
//         w: 0,
//       },
//       animation: "",
//       modelUrl: `${socket.handshake.query.modelUrl}`,
//     };
//     players.set(socket.id, player);
//     console.log(`Player ${player.name} connected! - ${socket.id}`);
//     return player;
//   } catch (error) {
//     throw error;
//   }
// }

// function init(socket: Socket) {
//   socket.join("general");
//   socket.join("notifications");
//   const player = createPlayer(socket);
//   connections.set(socket.id, player.id);
// }

// function createWorldInstance(worldName: string): WorldInstance {
//   try {
//     let world = worlds.get(worldName);
//     if (world) {
//       const instance: WorldInstance = {
//         players: [],
//         id: uuidv4().replace(/-/g, "").substring(0, 10),
//       };
//       world.instances.set(instance.id, instance);
//       return instance;
//     } else {
//       throw new Error("World not found");
//     }
//   } catch (error) {
//     throw error;
//   }
// }

// function createWorld(worldName: string): World {
//   try {
//     const world = {
//       instances: new Map(),
//       maxPlayers: Number(process.env.MAX_WORLDS_PLAYERS) || 50,
//       name: worldName,
//       type: WorldTypes.world,
//     };
//     worlds.set(worldName, world);
//     return world;
//   } catch (error) {
//     throw error;
//   }
// }

// function assignPlayerToWorld(data: JionWorldData, socket: Socket) {
//   try {
//     let world = worlds.get(data.worldName);
//     const player = players.get(socket.id);
//     if (!world) {
//       world = createWorld(data.worldName);
//     }
//     if (inWorld.get(socket.id)) removePlayerFromWorld(socket);

//     if (world && player) {
//       let lastInstance = Array.from(world.instances.values()).pop();
//       if (!lastInstance) {
//         lastInstance = createWorldInstance(data.worldName);
//       }
//       const count = Array.from(lastInstance.players).length;
//       if (count >= world.maxPlayers) {
//         lastInstance = createWorldInstance(data.worldName);
//       }
//       player.position = data.position;
//       player.rotation = data.rotation;
//       lastInstance.players.push(player);
//       const instanceName = `${data.worldName}-${lastInstance.id}`;
//       inWorld.set(socket.id, instanceName);
//       socket.join(instanceName);
//       socket.emit("world-players", lastInstance.players);
//       io.sockets.to(instanceName).emit("player-added", player);
//       console.log(
//         `Player ${player.name} joined world-instance ${instanceName}`
//       );
//     } else {
//       throw new Error("World or player not found");
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// function removePlayerFromWorld(socket: Socket) {
//   try {
//     const player = players.get(socket.id);
//     if (player) {
//       const instanceName = inWorld.get(socket.id);
//       if (instanceName) {
//         const worldName = instanceName.split("-")[0];
//         const world = worlds.get(worldName);
//         if (world) {
//           const instance = world.instances.get(instanceName.split("-")[1]);
//           if (instance) {
//             instance.players = instance.players.filter(
//               (p: Player) => p.id !== player.id
//             );
//             inWorld.delete(player.id);
//             socket.leave(instanceName);
//             io.sockets
//               .to(instanceName)
//               .emit("player-removed", player.sessionId);
//             if (instance.players.length === 0) {
//               world.instances.delete(instance.id);
//             }
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// function teleportPlayerToWorld(data: JionWorldData, socket: Socket) {
//   try {
//     removePlayerFromWorld(socket);
//     assignPlayerToWorld(data, socket);
//   } catch (error) {
//     console.error(error);
//   }
// }

// export {
//   init,
//   assignPlayerToWorld,
//   removePlayerFromWorld,
//   teleportPlayerToWorld,
// };
