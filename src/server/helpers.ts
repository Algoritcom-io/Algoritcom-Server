import { Player } from "../types";

export function playerEncode(player: Player) {
  const data = {
    id: player.id,
    position: JSON.stringify(player.position),
    rotation: JSON.stringify(player.rotation),
    animation: player.animation,
    name: player.name,
    modelUrl: player.modelUrl,
  };

  return data;
}
