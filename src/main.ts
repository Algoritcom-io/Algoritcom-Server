import { app, server } from "./server/server";
import "./server/namespaces/games";
import "./server/namespaces/worlds";

const port = app.get("port");

server.listen(port, () => {
  /* eslint-disable no-console */
  console.log("Server is running on http://localhost:" + app.get("port"));
  /* eslint-enable no-console */
});
