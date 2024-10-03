import { app, httpServer, httpsServer } from "./server/server";  // Importa ambos servidores
import "./server/io";
import "./server/serverController";

const httpPort = 2567;   // Puerto HTTP
const httpsPort = 443; // Puerto HTTPS

// Levantamos el servidor HTTP
httpServer.listen(httpPort, () => {
  console.log(`Servidor HTTP corriendo en el puerto ${httpPort} y redirigiendo a HTTPS`);
});

// Levantamos el servidor HTTPS
httpsServer.listen(httpsPort, () => {
  console.log(`Servidor HTTPS corriendo en https://localhost:${httpsPort}`);
});
