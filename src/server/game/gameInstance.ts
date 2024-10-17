import { IGameInstance } from "../../types/games";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../logger/logger";
import playerController from "../players/players";
import { io } from "../io";
import { Player } from "../players/player";
import { Items, Spawn } from "../../types/settings";
import { cloneDeep } from "lodash";

export class GameInstance implements IGameInstance {
  public id: string;
  public players: Map<string, Player>;
  public gameStarted: boolean = false;
  public timer?: ReturnType<typeof setInterval>;
  public time = 60;
  public items?: Items[];
  public spawns?: Spawn[];
  public deleteInstance: (id: string) => void;

  constructor(
    gameName: string,
    deleteInstance: (id: string) => void,
    items?: Items[],
    spawns?: Spawn[]
  ) {
    this.id = gameName + "_" + uuidv4().replace(/-/g, "").substring(0, 10);
    this.items = items;
    this.spawns = cloneDeep(spawns);
    this.players = new Map();
    this.deleteInstance = deleteInstance;
    logger.info(`Game ${gameName} instance ${this.id} created`);
  }

  public addPlayer(playerId: string) {
    try {
      const player = playerController.getPlayer(playerId);
      if (!player) {
        throw new Error("Player not found");
      }
      const socket = io.sockets.sockets.get(player.sessionId);
      if (socket) {
        socket.join(this.id);
        this.players.set(playerId, player);
        const playersData = [];

        const players = Array.from(this.players.values());
        for (let i = 0; i < players.length; i++) {
          const player = players[i];
          const spawn = this.spawns ? this.spawns[i] : null;
          if (!player.initialPosition && spawn) {
            player.position = {
              x: spawn.ubication[0],
              y: spawn.ubication[1],
              z: spawn.ubication[2],
            };
            player.initialPosition = spawn;
          }
          playersData.push(player.getPlayerGameStart());
        }

        if (this.players.size > 1) {
          this.timer = this.startTimer();
        } else {
          logger.info(`Game ${this.id} waiting for players`);
          io.sockets.to(this.id).emit("game-waiting-for-players");
        }

        socket.emit(
          "world-players",
          playersData.filter((p) => p.sessionId !== playerId)
        );
        io.sockets.to(this.id).emit("player-added", player);
        this.sendInitalConfig(playerId);
        logger.info(`Player ${playerId} joined game ${this.id}`);
        logger.debug(`Game ${this.id} players: ${this.players.size}`);
      } else {
        throw new Error("Socket not found");
      }
    } catch (error) {
      throw error;
    }
  }

  public removePlayer(playerId: string) {
    const player = playerController.getPlayer(playerId);
    if (!player) {
      throw new Error("Player not found");
    }
    io.sockets.to(this.id).emit("player-left", playerId);
    const socket = io.sockets.sockets.get(player.sessionId);
    if (socket) {
      socket.leave(this.id);
      logger.warning(`Player ${playerId} left game ${this.id}`);
    }
    console.log("player size", this.players.size);
    console.log("game started", this.gameStarted);

    this.players.delete(playerId);

    if (this.gameStarted === false && this.players.size === 1) {
      logger.info(`Game ${this.id} waiting for players`);
      clearInterval(this.timer);
      io.sockets.to(this.id).emit("game-waiting-for-players");
    }

    if (this.players.size < 1) {
      this.endGame();
    }
  }

  public startGame() {
    this.gameStarted = true;
    clearInterval(this.timer);
    io.sockets.to(this.id).emit("game-start");
    logger.info(`Game ${this.id} started`);
  }

  public startTimer(): ReturnType<typeof setInterval> {
    return setInterval(() => {
      if (this.time > 0) {
        this.time--;
        logger.info(
          `Game ${this.id} start in ${this.time} seconds - ${this.players.size} players`
        );
        io.sockets.to(this.id).emit("game-start-tick", this.time);
        if (Array.from(this.players.values()).length < 1) {
          this.endGame();
        }
      } else if (this.time === 0) {
        this.startGame();
      }
    }, 1000);
  }

  public endGame() {
    this.gameStarted = false;
    io.sockets.to(this.id).emit("game-end");
    clearInterval(this.timer);
    io.socketsLeave(this.id);
    logger.warning(`Game ${this.id} ended`);
    this.deleteInstance(this.id);
  }

  public sendInitalConfig(playerId: string) {
    const player = playerController.getPlayer(playerId);
    if (!player) {
      throw new Error("Player not found");
    }
    const items = cloneDeep(this.items);

    io.sockets.to(player.sessionId).emit("game-config", items);
  }
}
