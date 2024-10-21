// server/server.ts
import express from "express";
import { createServer as createHttpServer, Server } from "node:http";
import { readFileSync } from "node:fs";
import { createServer as createHttpsServer } from "node:https";

const app = express();
app.set("trust proxy", true);

let httpServer: Server;

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  const privateKey = readFileSync(
    "/etc/letsencrypt/live/server.algoritcom.io/privkey.pem",
    "utf8"
  );
  const certificate = readFileSync(
    "/etc/letsencrypt/live/server.algoritcom.io/fullchain.pem",
    "utf8"
  );
  httpServer = createHttpsServer(
    {
      key: privateKey,
      cert: certificate,
    },
    app
  );
} else {
  httpServer = createHttpServer(app);
}

// Exportamos tanto app como los servidores
export { app, httpServer };
