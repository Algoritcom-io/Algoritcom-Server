import { WorldTypes } from "../enums";

export interface IPlayer {
  id: string;
  sessionId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  animation: string;
  name: string;
  username: string;
  modelUrl: string;
  isGuest: boolean;
  inWorld: {
    name: string;
    instance: string;
    type: WorldTypes | null;
  };
}
export interface IPlayerMove {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  animation: string;
}
