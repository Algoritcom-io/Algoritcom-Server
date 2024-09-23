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

export interface PlayerRoom {
  namespace: string;
  name: string;
}

export interface Move {
  room: string;
  position: Vector3;
  rotation: Quaternion;
  animation: string;
}
