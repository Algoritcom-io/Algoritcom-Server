// server/server.ts
import express from "express";
import { createServer as createHttpServer } from "node:http";
import { readFileSync } from "node:fs";
import { createServer as createHttpsServer } from "node:https";

const app = express();
app.set("trust proxy", true);

// Puerto HTTP y HTTPS
const httpPort = 2567;
const httpsPort = 443;

// Lectura de certificados
const privateKey = readFileSync('/etc/letsencrypt/live/server.algoritcom.io/privkey.pem', 'utf8');
const certificate = readFileSync('/etc/letsencrypt/live/server.algoritcom.io/fullchain.pem', 'utf8');

// Servidor HTTP (redirige tráfico a HTTPS)
const httpServer = createHttpServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
});

// Servidor HTTPS
const httpsServer = createHttpsServer({
  key: privateKey,
  cert: certificate,
}, app);

// Exportamos tanto app como los servidores
export { app, httpServer, httpsServer };
