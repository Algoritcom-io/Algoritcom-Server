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
    const position = JSON.parse(payload.position);
    console.log(position);
    player.position.x = position.x;
    player.position.y = position.y;
    player.position.z = position.z;

    this.state.players.set(payload.client.sessionId, player);
    return;
  }
}
