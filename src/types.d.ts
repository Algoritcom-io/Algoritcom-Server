import { Vector3, Quaternion } from "three";

interface Player {
  id: string;
  sessionId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  animation: string;
  name: string;
  modelUrl: string;
}

interface Room {
  namespace: string;
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

interface PlayerRoom {
  namespace: string;
  name: string;
}
