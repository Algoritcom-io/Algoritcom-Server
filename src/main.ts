import { httpServer } from "./server/server"; // Importa ambos servidores
import "./server/io";
import "./server/serverController";
import { logger } from "./logger/logger";

const httpPort = process.env.HTTP_PORT || 443;

// Levantamos el servidor HTTP
httpServer.listen(httpPort, () => {
  logger.info(`Servidor HTTP corriendo en el puerto ${httpPort}`);
});
