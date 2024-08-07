import { app, server } from "./server/server";

const port = app.get("port");

server.listen(port, () => {
  /* eslint-disable no-console */
  console.log("Server is running on http://localhost:" + app.get("port"));
  /* eslint-enable no-console */
});
