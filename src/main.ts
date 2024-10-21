import { httpServer } from "./server/server"; // Importa ambos servidores
import "./server/io";
import "./server/serverController";

const httpPort = process.env.HTTP_PORT || 443;

// Levantamos el servidor HTTP
httpServer.listen(httpPort, () => {
  console.log(
    `Servidor HTTP corriendo en el puerto ${httpPort} y redirigiendo a HTTPS`
  );
});
