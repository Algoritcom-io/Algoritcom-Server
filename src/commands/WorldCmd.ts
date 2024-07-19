import { Command } from "@colyseus/command";
import { WorldState } from "../rooms/schema/WorldState";
import { PlayerState } from "../rooms/schema/PlayerState";
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
    console.log(
      "Player moved",
      player.sessionId,
      payload.x,
      payload.y,
      payload.z
    );
    player.position.x = payload.x;
    player.position.y = payload.y;
    player.position.z = payload.z;

    this.state.players.set(payload.client.sessionId, player);
    return;
  }
}
