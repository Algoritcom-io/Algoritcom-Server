import { logger } from "../logger/logger";
import playerController from "../server/players/players";
import { app } from "../server/server";

app.get("/worlds/:name", function (req, res) {
  const world = req.params.name;
  if (world) {
    const players = playerController.getPlayersInWorld(world);
    res.status(200).json(players);
  } else {
    res.status(400).send("Invalid world name");
  }
});
