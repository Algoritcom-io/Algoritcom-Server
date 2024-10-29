import playerController from "../server/players/players";
import { app } from "../server/server";

app.post("/players/friends", async (req, res) => {
  const friends = req.body.friends;
  if (friends) {
    console.log("friends en post", friends);
    const players = await playerController.getFriendsPresence(friends);
    console.log(players);
    res.status(200).json(players);
  } else {
    res.status(400).send("Invalid friends list");
  }
});
