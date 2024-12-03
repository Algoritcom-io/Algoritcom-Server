import { find, map } from "lodash";
import { logger } from "../../logger/logger";
import { IPlayerMove } from "../../types/player";
import { Player } from "./player";
import { Presence } from "../../types/chat";

class PlayerController {
  private players: Map<string, Player>;

  constructor() {
    this.players = new Map();
    logger.warning("Player Controller initialized");
  }

  public async createPlayer(
    id: string,
    name: string,
    username: string,
    sessionId: string,
    isGuest: boolean
  ): Promise<Player> {
    try {
      const oldPlayer = await this.getPlayerById(id);
      if (oldPlayer) {
        this.removePlayer(oldPlayer.sessionId);
      }
    } catch (error: any) {
      logger.error(error?.message);
    }

    const player = new Player(id, name, username, sessionId, isGuest);
    this.players.set(sessionId, player);
    logger.success(
      `Player ${name} created (sessionId: ${sessionId}) - isGuest: ${isGuest}`
    );
    return player;
  }

  public getPlayer(id: string): Player {
    const player = this.players.get(id);
    if (!player) {
      throw new Error(`Player with id ${id} not found`);
    }
    return player;
  }

  public async getPlayerById(id: string): Promise<Player> {
    const players = Array.from(this.players.values());
    const item = await find(players, (item) => item.id === id);
    if (item) {
      return item;
    }
    throw new Error(`Player with id ${id} not found`);
  }

  public async getPlayersInWorld(
    world: string
  ): Promise<Pick<Player, "id" | "name">[]> {
    const players = Array.from(this.players.values());
    const inWorld = players.filter((player) => player.inWorld.name === world);
    const result = await map(inWorld, (player) => {
      return {
        id: player.id,
        name: player.name,
        world: player.inWorld.name,
        instance: player.inWorld.instance,
        status: true,
      };
    });
    if (result) {
      return result;
    }
    return [];
  }

  public updatePlayer(id: string, data: Partial<Player>): Player {
    let player = this.players.get(id);
    if (!player) {
      throw new Error(`Player with id ${id} not found`);
    }
    Object.assign(player, data);
    this.players.set(id, player);
    return player;
  }

  public move(data: IPlayerMove, sessionId: string): void {
    const player = this.players.get(sessionId);
    if (player) {
      player.position.x = data.position.x;
      player.position.y = data.position.y;
      player.position.z = data.position.z;
      player.rotation.x = data.rotation.x;
      player.rotation.y = data.rotation.y;
      player.rotation.z = data.rotation.z;
      player.rotation.w = data.rotation.w;
      player.animation = data.animation;
      // logger.debug(
      //   `Player ${player.name} moved to [${data.position.x.toFixed(
      //     1
      //   )}, ${data.position.y.toFixed(1)}, ${data.position.z.toFixed(
      //     1
      //   )}] - animation: ${data.animation}`
      // );
      player.emitPlayerMoved();
    }
  }

  public removePlayer(id: string): void {
    this.players.delete(id);
    logger.warning(`Player ${id} removed`);
  }

  public async getFriendsPresence(friends: string[]): Promise<Presence[]> {
    const presences: Presence[] = [];
    if (friends.length > 0) {
      const players = Array.from(this.players.values());
      for (let i = 0; i < friends.length; i++) {
        const friend = friends[i];
        const player = await find(players, (item) => item.id === friend);
        if (player) {
          presences.push({
            id: player.id,
            name: player.name,
            world: player.inWorld.name,
            instance: player.inWorld.instance,
            status: true,
          });
        }
      }
    }
    return presences;
  }

  public async getWorldPresence(world: string): Promise<Presence[]> {
    const presences: Presence[] = [];
    const players = Array.from(this.players.values());
    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      if (player.inWorld.name === world) {
        presences.push({
          id: player.id,
          name: player.name,
          world: player.inWorld.name,
          instance: player.inWorld.instance,
          status: true,
        });
      }
    }
    return presences;
  }
}

const playerController = new PlayerController();
export default playerController;
