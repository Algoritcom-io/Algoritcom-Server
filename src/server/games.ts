import axios from "axios";
import { WorldTypes } from "../enums";
import { Game, JionGameData } from "../types/games";
import { io, players, inWorld, games } from "./server";
import { v4 as uuidv4 } from "uuid";

// Socket Events

// matchmaking-started
// matchmaking-tick
// game-start

async function createGame(data: JionGameData) {
  try {
    const name = `${data.worldName}-${data.gameName}`;
    const game: Game = {
      name: name,
      matchmaking: true,
      queue: [],
      instances: new Map(),
      maxPlayers: Number(process.env.MAX_GAMES_PLAYERS) || 8,
      spawnPoints: [],
      timer: null,
      countdown: 0,

      type: WorldTypes.game,
    };
    const settings = await axios.get(
      `${process.env.NEXT_PUBLIC_BUCKET_REVAMP_URL}/games/${data.worldName}/${data.gameName}/settings.json`
    );

    settings.data.spawns.forEach((spawn: any) => {
      game.spawnPoints.push({
        position: {
          x: spawn.ubication[0],
          y: spawn.ubication[1],
          z: spawn.ubication[2],
        },
        rotation: { x: 0, y: 0, z: 0, w: 0 },
      });
    });

    games.set(name, game);
    console.log(`Game ${game.name} created`);
    return game;
  } catch (error) {
    throw error;
  }
}

export async function joinGame(socket: any, data: JionGameData) {
  try {
    const name = `${data.worldName}-${data.gameName}`;
    const inWorldName = inWorld.get(socket.id);
    if (inWorldName) {
      inWorld.delete(socket.id);
      socket.leave(`lobby-${inWorldName}`);
    }
    const player = players.get(socket.id);
    let game = games.get(name);
    if (!game) {
      game = await createGame(data);
    }
    if (player && game) {
      socket.join(name);
      inWorld.set(socket.id, name);
      console.log(`Player ${player.name} joined game ${name} lobby`);
      // startMatchMaking(game);
    } else {
      throw new Error("Player or game not found");
    }
  } catch (error) {
    throw error;
  }
}

export function playerReady(socket: any) {
  try {
    const player = players.get(socket.id);
    const gameName = inWorld.get(socket.id);
    console.log(player, gameName);
    if (player && gameName) {
      const game = games.get(gameName);
      if (game) {
        console.log(game);
        game.queue.push(player);
        console.log(`Player ${player.name} is ready for game ${game.name}`);
        startMatchMaking(game);
      }
    }
  } catch (error) {
    throw error;
  }
}

function startMatchMaking(game: Game) {
  try {
    game.matchmaking = true;
    console.log(`Matchmaking started for game ${game.name}`);
    io.to(`lobby-${game.name}`).emit("matchmaking-started");
    game.countdown = 10;
    game.timer = setInterval(() => {
      checkMatchMakingInterval(game);
    }, 1000);
  } catch (error) {
    throw error;
  }
}

function checkMatchMakingInterval(game: Game) {
  try {
    const lobby = io.sockets.adapter.rooms.get(`lobby-${game.name}`);
    if (!lobby || lobby.size === 0) {
      clearInterval(game.timer);
      game.matchmaking = false;
      console.log(`Matchmaking ended for game ${game.name}`);
      return;
    }
    game.countdown = game.countdown - 1;
    if (game.countdown <= 0) {
      // Start game
      console.log(`Matchmaking ended for game ${game.name}`);
      startGame(game);
      game.countdown = 10;
    } else {
      if (game.queue.length >= game.maxPlayers) {
      }
      console.log(`Matchmaking tick for game ${game.name} - ${game.countdown}`);
      io.to(`lobby-${game.name}`).emit("matchmaking-tick", game.countdown);
    }
  } catch (error) {
    throw error;
  }
}

function startGame(game: Game) {
  try {
    const instance = {
      players: new Set(),
      id: uuidv4().replace(/-/g, "").substring(0, 10),
    };
    game.instances.set(instance.id, instance);
    const players = game.queue.slice(0, game.maxPlayers - 1);

    game.instances.set(instance.id, instance);

    if (players.length > 0) {
      players.forEach((player) => {
        instance.players.add(player);
        game.queue = game.queue.filter((p) => p.id !== player.id);
        const socket = io.sockets.sockets.get(player.sessionId);
        if (socket) {
          socket.leave(`lobby-${game.name}`);
          socket.join(`${game.name}-${instance.id}`);
          inWorld.set(player.sessionId, `${game.name}-${instance.id}`);
        }
        io.sockets.to(`${game.name}-${instance.id}`).emit("game-start");
      });
    }
    // io.to(`lobby-${game.name}`).emit("game-start", instance);
  } catch (error) {
    throw error;
  }
}

// function startMatchMakingWithTimeout(socket: any) {
//   const interval = setInterval(() => {
//     try {
//       // const player = players.get(socket.id);
//       // const gameName = inWorld.get(socket.id);
//       // if (player && gameName) {
//       //   const game = games.get(gameName);
//       //   if (game) {
//       //     if (game.queue.length >= game.maxPlayers) {
//       //       clearInterval(interval);
//       //       const instance = {
//       //         players: new Set(),
//       //         id: uuidv4().replace(/-/g, "").substring(0, 10),
//       //       };
//       //       const players = game.queue.slice(0, game.maxPlayers - 1);
//       //       players.forEach((player) => {
//       //         instance.players.add(player);
//       //         game.queue = game.queue.filter((p) => p.id !== player.id);
//       //       });
//       //       game.instances.set(instance.id, instance);
//       //       io.to(`lobby-${game.name}`).emit("game-start", instance);
//       //     }
//       //   }
//       // }
//     } catch (error) {
//       clearInterval(interval);
//       throw error;
//     }
//   }, 1000);

//   setTimeout(() => {
//     clearInterval(interval);
//     try {
//       // const player = players.get(socket.id);
//       // const gameName = inWorld.get(socket.id);
//       // if (player && gameName) {
//       //   const game = games.get(gameName);
//       //   if (game && game.queue.length > 0) {
//       //     const instance = {
//       //       players: new Set(),
//       //       id: uuidv4().replace(/-/g, "").substring(0, 10),
//       //     };
//       //     game.queue.forEach((player) => {
//       //       instance.players.add(player);
//       //     });
//       //     game.instances.set(instance.id, instance);
//       //     game.queue = [];
//       //     io.to(`lobby-${game.name}`).emit("game-start", instance);
//       //   }
//       // }
//     } catch (error) {
//       throw error;
//     }
//   }, 60000);
// }

// const player = players.get(socket.id);
// const gameName = inWorld.get(socket.id);
// if (player && gameName) {
//   const game = games.get(gameName);
//   if (game) {
//     if (game.queue.length >= game.maxPlayers) {
//       const instance = {
//         players: new Set(),
//         id: uuidv4().replace(/-/g, "").substring(0, 10),
//       };
//       game.queue.forEach((player) => {
//         instance.players.add(player);
//       });
//       game.instances.set(instance.id, instance);
//       game.queue = [];
//       io.to(`lobby-${game.name}`).emit("game-start", instance);
//     }
//   }
// }
