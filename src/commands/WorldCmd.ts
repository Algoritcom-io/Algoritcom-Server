import { Command } from "@colyseus/command";

import { AlgoritcomCity } from "../rooms/AlgoritcomCity";
import { Client } from "colyseus";

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
    console.log("CmdMovement", payload);
    player.position.x = payload[0];
    player.position.y = payload[1];
    player.position.z = payload[2];

    this.state.players.set(payload.client.sessionId, player);
    return;
  }
}
