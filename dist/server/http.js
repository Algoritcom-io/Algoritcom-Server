"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("server/server");
server_1.app.get("/", (_req, res) => {
    res.send("Hello World");
});
//# sourceMappingURL=http.js.map