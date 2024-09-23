import { WorldTypes } from "../enums";
import { Player } from "./player";
import { Settings } from "./settings";
import { ISpace, IWorld } from "./worlds";

export interface IGameInstance {
  id: string;
  players: Set<string, Player>;
  gameStarted: boolean;
  timer?: ReturnType<typeof setTimeout>;
  items?: any[];
}

export interface IGame extends ISpace {
  instances: Map<string, IGameInstance>;
}

export interface JoinGameData {
  worldName: string;
  gameName: string;
}
