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
    player.position.x = payload.x;
    player.position.y = payload.y;
    player.position.z = payload.z;

    this.state.players.set(payload.client.sessionId, player);
    return;
  }
}
