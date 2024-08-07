import { Vector3, Quaternion } from "three";

interface Player {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  animation: string;
  name: string;
  modelUrl: string;
}

interface Room {
  name: string;
  count: number;
  max: number;
}

interface Move {
  room: string;
  position: Vector3;
  rotation: Quaternion;
  animation: string;
}

interface Server {
  rooms: Map<string, Room>;
}
