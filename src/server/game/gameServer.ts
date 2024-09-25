import { WorldTypes } from "../../enums";
import { IGame } from "../../types/games";
import { Settings } from "../../types/settings";
import axios from "axios";
import { GameInstance } from "./gameInstance";
import { logger } from "../../logger/logger";

export class GameServer implements IGame {
  public name: string;
  public type: WorldTypes;
  public maxPlayers: number;
  public settings?: Settings;
  public instances: Map<string, GameInstance>;
  public status: "initializing" | "ready" | "error";

  constructor(name: string) {
    console.log(name);
    this.name = name;
    this.maxPlayers = Number(process.env.MAX_GAMES_PLAYERS) || 8;
    this.type = WorldTypes.game;
    this.instances = new Map();
    this.status = "initializing";
    logger.info(`Game ${this.name} initializing`);
    this.loadSettings();
  }

  public async loadSettings() {
    try {
      const settings = await axios.get(
        `${process.env.BACKEND_URL}/games/${this.name}/settings.json`
      );
      this.settings = settings.data;
      this.status = "ready";
      logger.success(`Game ${this.name} ready`);
    } catch (error: any) {
      console.log(error.message);
      this.status = "error";
      logger.error(`Game ${this.name} error`);
      throw error;
    }
  }

  public createInstance(): GameInstance {
    const instance = new GameInstance(
      this.name,
      this.deleteInstance.bind(this),
      this.settings?.items
    );
    this.instances.set(instance.id, instance);
    return instance;
  }

  public getInstance(id: string): GameInstance {
    const instance = this.instances.get(id);
    if (!instance) {
      throw new Error(`Instance with id ${id} not found`);
    }
    return instance as GameInstance;
  }

  public getAvailableInstance(): GameInstance {
    let instance = Array.from(this.instances.values()).filter(
      (instance) => !instance.gameStarted
    )[0];
    if (!instance) {
      instance = this.createInstance();
    }
    return instance;
  }

  public deleteInstance(id: string) {
    this.instances.delete(id);
    logger.info(`Game ${this.name} instance ${id} deleted`);
  }
}
