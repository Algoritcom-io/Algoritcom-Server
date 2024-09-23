import { app, http } from "./server/server";
import "./server/io";
import "./server/serverController";

const port = app.get("port");

http.listen(port, () => {
  /* eslint-disable no-console */
  console.log("Server is running on http://localhost:" + app.get("port"));
  /* eslint-enable no-console */
});
