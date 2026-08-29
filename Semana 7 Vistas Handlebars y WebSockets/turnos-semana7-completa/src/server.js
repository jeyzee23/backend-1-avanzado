import { createServer } from "node:http";
import app from "./app.js";
import { PORT } from "./config/env.config.js";
import { setupSocket } from "./config/socket.js";

// Express solo no alcanza: Socket.io necesita el servidor HTTP de Node
const httpServer = createServer(app);
setupSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
  console.log(`Vistas     → http://localhost:${PORT}/services`);
  console.log(`Tiempo real → http://localhost:${PORT}/realtime`);
});
