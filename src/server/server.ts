import express from "express";
import { createServer } from "node:http";

const PORT = process.env.PORT || 2567;
const app = express();
const http = createServer(app);
app.set("port", PORT);
app.set("trust proxy", true);

export { app, http };
