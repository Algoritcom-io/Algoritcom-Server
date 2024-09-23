import { logger } from "../../logger/logger";
import { IPlayer, IPlayerMove } from "../../types/player";
import { Player } from "./player";

class PlayerController {
  private players: Map<string, Player>;

  constructor() {
    this.players = new Map();
    logger.warning("Player Controller initialized");
  }

  public createPlayer(id: string, name: string, sessionId: string): IPlayer {
    const player = new Player(id, name, sessionId);
    this.players.set(sessionId, player);
    logger.success(`Player ${name} created (sessionId: ${sessionId})`);
    return player;
  }

  public getPlayer(id: string): Player {
    const player = this.players.get(id);
    if (!player) {
      throw new Error(`Player with id ${id} not found`);
    }
    return player;
  }

  public updatePlayer(id: string, player: Player): Player {
    this.players.set(id, player);
    return player;
  }

  public move(data: IPlayerMove, sessionId: string): void {
    const player = this.players.get(sessionId);
    if (player) {
      player.position.x = data.position.x;
      player.position.y = data.position.y;
      player.position.z = data.position.z;
      player.rotation.x = data.rotation.x;
      player.rotation.y = data.rotation.y;
      player.rotation.z = data.rotation.z;
      player.rotation.w = data.rotation.w;
      player.animation = data.animation;
      logger.debug(
        `Player ${player.name} moved to [${data.position.x.toFixed(
          1
        )}, ${data.position.y.toFixed(1)}, ${data.position.z.toFixed(
          1
        )}] - animation: ${data.animation}`
      );
      player.emitPlayerMoved();
    }
  }

  public removePlayer(id: string): void {
    this.players.delete(id);
    logger.warning(`Player ${id} removed`);
  }
}

const playerController = new PlayerController();
export default playerController;
