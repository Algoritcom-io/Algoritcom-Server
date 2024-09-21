import { WorldTypes } from "../enums";
import { Player } from "./player";
import { World } from "./worlds";

interface Spawn {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
}

export interface GameInstance {
  id: string;
  players: Set<string, Player>;
  inGame?: boolean;
  items?: any[];
}

export interface Game extends Pick<World, "maxPlayers" | "name" | "type"> {
  matchmaking: boolean;
  queue: Player[];
  instances: Map<string, GameInstance>;
  spawnPoints: Spawn[];
  timer: any;
  countdown: number;
  items?: any[];
}

export interface JionGameData {
  worldName: string;
  gameName: string;
}
