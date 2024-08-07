"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("server/server");
const PORT = process.env.PORT || 80;
server_1.app.set("port", PORT);
server_1.server.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + server_1.app.get("port"));
});
//# sourceMappingURL=main.js.map