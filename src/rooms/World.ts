import { Room, Client } from "@colyseus/core";
import { generateRandomInteger, WorldState } from "./schema/WorldState";
import { PlayerState } from "./schema/PlayerState";
import { Dispatcher } from "@colyseus/command";
import { CmdMovement } from "../commands/WorldCmd";
import { PlayerStatus } from "./enums/PlayerStatus";

export class World extends Room<WorldState> {
  dispatcher = new Dispatcher(this);

  constructor() {
    super();
    this.maxClients = 100;
  }

  onCreate(options: any) {
    this.setState(new WorldState());
    this.onMessage("movementData", this.handleCmdMovement.bind(this));
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    const player = new PlayerState(client.sessionId);
    player.sessionId = client.sessionId;
    player.status = PlayerStatus.CONNECTED;

    player.position.x = generateRandomInteger(-30, 30);
    player.position.y = 1.2;
    player.position.z = generateRandomInteger(-30, 30);

    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  handleCmdMovement(client: Client, message: any) {
    this.dispatcher.dispatch(new CmdMovement(), {
      client,
      ...message,
    });
  }
}
