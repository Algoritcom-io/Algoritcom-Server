import { Vector3, Quaternion } from "three";

export interface Player {
  id: string;
  sessionId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  animation: string;
  name: string;
  modelUrl: string;
}
export interface PlayerMove {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  animation: string;
}
