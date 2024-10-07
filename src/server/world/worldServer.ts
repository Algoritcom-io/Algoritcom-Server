import axios from "axios";
import { WorldTypes } from "../../enums";
import { Settings } from "../../types/settings";
import { IWorld, IWorldInstance } from "../../types/worlds";
import { logger } from "../../logger/logger";
import { WorldInstance } from "./worldInstance";

export class WorldServer implements IWorld {
  public name: string;
  public type: WorldTypes;
  public maxPlayers: number;
  public instances: Map<string, IWorldInstance>;
  public status: "initializing" | "ready" | "error";
  public settings?: Settings;

  constructor(name: string) {
    this.name = name;
    this.maxPlayers = 1000;
    this.type = WorldTypes.world;
    this.instances = new Map();
    this.status = "initializing";
    this.loadSettings();
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
      this.status = "error";
      logger.error(`Game ${this.name} error: ${error.message}`);
      throw error;
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
}
