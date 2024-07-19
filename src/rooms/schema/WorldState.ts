import { Schema, type, MapSchema } from "@colyseus/schema";
import { PlayerState } from "./PlayerState";

const MAX_PLAYER_COUNT = 100;

export class WorldState extends Schema {
  @type("string") name: string;
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}

export function generateRandomInteger(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1));
}
