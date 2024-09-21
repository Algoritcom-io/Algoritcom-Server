import { WorldTypes } from "../enums";
import { Player } from "./player";

export interface WorldInstance {
  id: string;
  players: Set<string, Player>;
}

export interface World {
  name: string;
  maxPlayers: number;
  instances: Map<string, WorldInstance>;
  type: WorldTypes;
}

export interface JionWorldData {
  worldName: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
}
