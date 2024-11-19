import playerController from "../server/players/players";
import { app } from "../server/server";

app.post("/players/friends", async (req, res) => {
  const friends = req.body.friends;
  if (friends) {
    const players = await playerController.getFriendsPresence(friends);
    res.status(200).json(players);
  } else {
    res.status(400).send("Invalid friends list");
  }
});
