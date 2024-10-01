import { WorldTypes } from "../../enums";
import { logger } from "../../logger/logger";
import { IPlayer } from "../../types/player";
import { Spawn } from "../../types/settings";
import { io } from "../io";

export class Player implements IPlayer {
  id: string;
  name: string;
  sessionId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  animation: string;
  modelUrl: string;
  inWorld: { name: string; instance: string; type: WorldTypes | null };
  initialPosition?: Spawn;

  constructor(id: string, name: string, sessionId: string, modelUrl: string) {
    this.id = id;
    this.name = name;
    this.sessionId = sessionId;
    this.position = { x: 0, y: 0, z: 0 };
    this.rotation = { x: 0, y: 0, z: 0, w: 0 };
    this.animation = "idle";
    this.modelUrl = modelUrl || "";
    this.inWorld = { name: "", instance: "", type: null };
  }

  public getTransferData() {
    return {
      id: this.id,
      name: this.name,
      sessionId: this.sessionId,
      position: this.position,
      rotation: this.rotation,
      animation: this.animation,
      modelUrl: this.modelUrl,
    };
  }

  public emitPlayerMoved() {
    const socket = io.sockets.sockets.get(this.sessionId);
    if (socket) {
      socket
        .to(this.inWorld.instance)
        .emit(`player-moved-${this.sessionId}`, this.getTransferData());
    }
  }

  public getSocket() {
    return io.sockets.sockets.get(this.sessionId);
  }

  public getPlayerGameStart() {
    return {
      id: this.id,
      name: this.name,
      sessionId: this.sessionId,
      position: this.position,
      rotation: this.rotation,
      animation: this.animation,
      modelUrl: this.modelUrl,
      initialPosition: this.initialPosition,
    };
  }
}
