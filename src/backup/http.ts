import { app } from "../server/server";

app.get("/", (_req: any, res: any) => {
  res.send("Hello World");
});
