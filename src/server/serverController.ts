import { WorldTypes } from "../enums";
import { logger } from "../logger/logger";
import { ChatAction } from "../types/chat";
import { JoinGameData } from "../types/games";
import { IWorld, JionWorldData } from "../types/worlds";
import { GameServer } from "./game/gameServer";
import playerController from "./players/players";
import { WorldServer } from "./world/worldServer";

class ServerController {
  private games: Map<string, GameServer>;
  private worlds: Map<string, WorldServer>;

  constructor() {
    this.games = new Map();
    this.worlds = new Map();
    logger.warning("Server Controller initialized");
  }

  public joinPlayerToWorld(data: JionWorldData, socketID: string) {
    console.log("joinPlayerToWorld", data.worldName, socketID);
    let world = this.worlds.get(data.worldName);
    let player = playerController.getPlayer(socketID);
    if (!player) {
      throw new Error(`Player with id ${socketID} not found`);
    }
    if (!world) {
      world = new WorldServer(data.worldName);
      this.worlds.set(data.worldName, world);
    }
    const instance = world.getAvailableInstance();
    const spawns = world.settings?.spawns;
    if (!spawns) {
      throw new Error("Spawns not found");
    }
    const spawn = spawns[Math.floor(Math.random() * spawns.length)];
    player.inWorld.name = world.name;
    player.inWorld.type = world.type;
    player.inWorld.instance = instance.id;
    player.position = {
      x: spawn.ubication[0],
      y: spawn.ubication[1],
      z: spawn.ubication[2],
    };
    player.rotation = { x: 0, y: 0, z: 0, w: 0 };
    player.modelUrl = data.modelUrl;
    instance.addPlayer(socketID);
  }

  public leavePlayer(socketID: string) {
    const player = playerController.getPlayer(socketID);
    const worldType = player.inWorld.type;

    switch (worldType) {
      case WorldTypes.world:
        this.leavePlayerFromWorld(socketID);
        break;
      case WorldTypes.game:
        this.leavePlayerFromGame(socketID);
        break;
      default:
        throw new Error("World type not found");
    }
  }

  public leavePlayerFromWorld(socketID: string) {
    const player = playerController.getPlayer(socketID);
    const world = this.worlds.get(player.inWorld.name);
    if (player && world) {
      world.getAvailableInstance().removePlayer(socketID);
      playerController.removePlayer(socketID);
    }
  }

  public joinPlayerToGame(playerID: string, data: JoinGameData) {
    let game = this.games.get(`${data.worldName}/${data.gameName}`);
    let player = playerController.getPlayer(playerID);
    if (!player) {
      throw new Error(`Player with id ${playerID} not found`);
    }
    if (!game) {
      game = new GameServer(`${data.worldName}/${data.gameName}`);
      this.games.set(`${data.worldName}/${data.gameName}`, game);
    }

    player.inWorld.name = game.name;
    player.inWorld.type = game.type;
    player.inWorld.instance = "";
    logger.info(`Player ${playerID} joined game ${game.name}`);
  }

  public async JoinGameInstance(playerID: string) {
    const player = playerController.getPlayer(playerID);
    const game = this.games.get(player.inWorld.name);
    if (player && game) {
      const instance = await game.getAvailableInstance();
      player.inWorld.instance = instance.id;
      instance.addPlayer(playerID);
    }
  }

  public leavePlayerFromGame(playerID: string) {
    const player = playerController.getPlayer(playerID);
    const game = this.games.get(player.inWorld.name);
    if (player && game) {
      try {
        game.getInstance(player.inWorld.instance).removePlayer(playerID);
      } catch (error: any) {
        logger.error(error.message);
      }
      playerController.removePlayer(playerID);
    }
  }

  public async finishAndStartGame(playerID: string) {
    const player = playerController.getPlayer(playerID);
    const game = this.games.get(player.inWorld.name);
    if (player && game) {
      const instance = await game.getInstance(player.inWorld.instance);
      if (instance) {
        instance.removePlayer(playerID);
      }
      this.JoinGameInstance(playerID);
    }
  }

  public async gameFinished(playerID: string) {
    const player = playerController.getPlayer(playerID);
    const game = this.games.get(player.inWorld.name);
    if (player && game) {
      const instance = await game.getInstance(player.inWorld.instance);
      if (instance) {
        player.inWorld.instance = "";
        player.inWorld.name = "";
        player.inWorld.type = null;
        logger.info(`Game finished for player ${playerID}`);
      }
    }
  }

  public gameNotifiaction(playerID: string, data: any) {
    const player = playerController.getPlayer(playerID);
    const game = this.games.get(player.inWorld.name);
    logger.info(`Notification from player ${playerID} - ${data.type}`);
    if (player && game) {
      const socket = player.getSocket();
      if (socket) {
        socket.to(player.inWorld.instance).emit("game-notification", data);
      }
    }
  }

  // public actions(playerID: string, data: any) {
  //   const player = playerController.getPlayer(playerID);
  //   if (player) {
  //     const socket = player.getSocket();
  //     logger.info(`Actions from player ${playerID} - ${data.message}`);
  //     if (socket) {
  //       socket
  //         .to(player.inWorld.instance)
  //         .emit(`player-chat-${player.sessionId}`, data);
  //     }
  //   }
  // }
}

const serverController = new ServerController();
export default serverController;
