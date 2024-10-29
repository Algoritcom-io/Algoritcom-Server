import axios from "axios";
import { WorldTypes } from "../../enums";
import { Settings } from "../../types/settings";
import { IWorld, IWorldInstance } from "../../types/worlds";
import { logger } from "../../logger/logger";
import { WorldInstance } from "./worldInstance";
import { Player } from "../players/player";

export class WorldServer implements IWorld {
  public name: string;
  public type: WorldTypes;
  public maxPlayers: number;
  public instances: Map<string, IWorldInstance>;
  public status: "initializing" | "ready" | "noSettings" | "error";
  public settings?: Settings;

  constructor(name: string) {
    this.name = name;
    this.maxPlayers = 1000;
    this.type = WorldTypes.world;
    this.instances = new Map();
    this.status = "initializing";
  }

  public async loadSettings() {
    try {
      const settings = await axios.get(
        `https://platform-public.s3.eu-west-3.amazonaws.com/worlds/${this.name}/settings.json`
      );
      this.settings = settings.data;
      this.status = "ready";
      logger.success(`Game ${this.name} ready`);
    } catch (error: any) {
      this.status = "noSettings";
      logger.error(`Game ${this.name} error: ${error.message}`);
    }
  }

  public createInstance(): WorldInstance {
    const instance = new WorldInstance(this.name);
    this.instances.set(instance.id, instance);
    return instance;
  }

  public getInstance(id: string): WorldInstance {
    const instance = this.instances.get(id);
    if (!instance) {
      throw new Error(`Instance with id ${id} not found`);
    }
    return instance as WorldInstance;
  }

  public getAvailableInstance(): IWorldInstance {
    let instance = Array.from(this.instances.values()).filter(
      (instance) => instance.players.size < this.maxPlayers
    )[0];
    if (!instance) {
      instance = this.createInstance();
    }
    return instance;
  }

  public async getAvailableSpawnPoint(
    players: Map<string, Player>
  ): Promise<{ x: number; y: number; z: number }> {
    const playersArray = Array.from(players.values());
    const spawns = this.settings?.spawns;
    if (!spawns) {
      return { x: 0, y: 0, z: 0 };
    }

    const findSpawnPoint = (
      index: number
    ): { x: number; y: number; z: number } => {
      if (index >= spawns.length) {
        const spawn = spawns[Math.floor(Math.random() * spawns.length)];
        return {
          x: spawn.ubication[0] + Math.random() * 2 - 1,
          y: spawn.ubication[1],
          z: spawn.ubication[2] + Math.random() * 2 - 1,
        };
      }

      const spawn = spawns[index];
      for (const player of playersArray) {
        const playerX = Number(player.position.x.toFixed(2));
        const playerZ = Number(player.position.z.toFixed(2));
        const spawnX = Number(spawn.ubication[0].toFixed(2));
        const spawnZ = Number(spawn.ubication[2].toFixed(2));
        if (playerX === spawnX && playerZ === spawnZ) {
          return findSpawnPoint(index + 1);
        }
      }

      return {
        x: spawn.ubication[0],
        y: spawn.ubication[1],
        z: spawn.ubication[2],
      };
    };

    return findSpawnPoint(0);
  }
}
