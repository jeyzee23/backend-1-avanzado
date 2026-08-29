import app from "./app.js";
import { PORT } from "./config/env.config.js";

// Socket.io no se cuelga de Express. Necesita createServer(app).
// Cuando lo armes: setupSocket(httpServer) y escuchá en httpServer, no en app.

app.listen(PORT, () => {
  console.log(`Starter en http://localhost:${PORT}`);
});
