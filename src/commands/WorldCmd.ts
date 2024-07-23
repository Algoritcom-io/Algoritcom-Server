import { Command } from "@colyseus/command";

import { AlgoritcomCity } from "../rooms/AlgoritcomCity";
import { Client } from "colyseus";
import { AxisData } from "../rooms/schema/PlayerState";

export class CmdMovement extends Command<
  AlgoritcomCity,
  { client: Client; direction: number }
> {
  validate(payload: any): boolean {
    let player = this.state.players.get(payload.client.sessionId);
    if (!player) return false;
    return true;
  }

  execute(payload: any) {
    let player = this.state.players.get(payload.client.sessionId);
    console.log("CmdMovement", payload.x, payload.y, payload.z);
    const newPosition = new AxisData();
    newPosition.x = payload.x;
    newPosition.y = payload.y;
    newPosition.z = payload.z;
    player.position = newPosition;

    // this.state.players.set(payload.client.sessionId, player);
    return;
  }
}
