import { WorldTypes } from "../enums";
import { Player } from "./player";
import { Settings } from "./settings";

export interface IWorldInstance {
  id: string;
  players: Set<string, Player>;

  addPlayer(player: Player): void;
  removePlayer(player: Player): void;
}

export interface ISpace {
  name: string;
  maxPlayers: number;
  settings?: Settings;
  type: WorldTypes;
  status: "initializing" | "ready" | "noSettings" | "error";

  private loadSettings(): Promise<void>;
  createInstance(): IWorldInstance;
  getInstance(id: string): IWorldInstance;
  getAvailableInstance(): IWorldInstance;
}

export interface IWorld extends ISpace {
  instances: Map<string, IWorldInstance>;
}

export interface JionWorldData {
  worldName: string;
  modelUrl: string;
}
