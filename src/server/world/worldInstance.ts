import { logger } from "../../logger/logger";
import { IWorldInstance } from "../../types/worlds";
import { v4 as uuidv4 } from "uuid";
import { Player } from "../players/player";
import playerController from "../players/players";
import { io } from "../io";

export class WorldInstance implements IWorldInstance {
  public id: string;
  public players: Map<string, Player>;

  constructor(worldName: string) {
    this.id = worldName + "_" + uuidv4().replace(/-/g, "").substring(0, 10);
    logger.info(`World ${worldName} instance ${this.id} created`);
    this.players = new Map();
  }

  public async addPlayer(playerId: string) {
    try {
      const player = playerController.getPlayer(playerId);
      if (!player) {
        throw new Error("Player not found");
      }
      const socket = io.sockets.sockets.get(player.sessionId);
      this.players.set(playerId, player);
      if (socket) {
        socket.join(this.id);
        const playersData = [];
        for (const player of this.players.values()) {
          const playerData = player.getTransferData();
          playersData.push(playerData);
        }
        socket.emit("world-players", playersData);
        io.sockets.to(this.id).emit("player-added", player);
        logger.info(`Player ${playerId} joined world ${this.id}`);
      }
    } catch (error) {
      throw error;
    }
  }

  public removePlayer(playerId: string) {
    this.players.delete(playerId);
    io.sockets.to(this.id).emit("player-left", playerId);
    logger.warning(`Player ${playerId} left world ${this.id}`);
  }
}
