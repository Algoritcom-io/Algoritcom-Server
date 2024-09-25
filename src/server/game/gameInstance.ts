import { IGameInstance } from "../../types/games";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../logger/logger";
import playerController from "../players/players";
import { io } from "../io";
import { Player } from "../players/player";
import { Items } from "../../types/settings";

export class GameInstance implements IGameInstance {
  public id: string;
  public players: Map<string, Player>;
  public gameStarted: boolean = false;
  public timer?: ReturnType<typeof setInterval>;
  public time = 60;
  public items?: Items[];
  public deleteInstance: (id: string) => void;

  constructor(
    gameName: string,
    deleteInstance: (id: string) => void,
    items?: Items[]
  ) {
    this.id = gameName + "_" + uuidv4().replace(/-/g, "").substring(0, 10);
    this.items = items;
    this.timer = this.startTimer();
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
        const playersData = [];
        for (const player of this.players.values()) {
          const playerData = player.getTransferData();
          playersData.push(playerData);
        }
        this.players.set(playerId, player);
        socket.emit("world-players", playersData);
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
    this.players.delete(playerId);
  }

  public startGame() {
    this.gameStarted = true;
    io.sockets.to(this.id).emit("game-start");
    logger.info(`Game ${this.id} started`);
  }

  public startTimer(): ReturnType<typeof setInterval> {
    return (this.timer = setInterval(() => {
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
    }, 1000));
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
    io.sockets.to(player.sessionId).emit("game-config", this.items);
  }
}
