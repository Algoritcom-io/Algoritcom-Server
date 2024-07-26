import { Schema, type } from "@colyseus/schema";
import { PlayerStatus } from "../enums/PlayerStatus";

export class AxisData extends Schema {
  @type("number")
  x: number = 0;

  @type("number")
  y: number = 0;

  @type("number")
  z: number = 0;
}

export class AnimationData extends Schema {
  @type("boolean")
  name: string = "";

  @type("number")
  speed: number = 1;

  @type("boolean")
  loop: boolean = false;
}

export class PlayerState extends Schema {
  @type("string") sessionId = "";
  @type("string") name: string = "Unknown";
  @type("string") status: PlayerStatus = PlayerStatus.CONNECTING;
  @type(AnimationData) animation: AnimationData = new AnimationData();
  @type(AxisData) position: AxisData = new AxisData();
}
