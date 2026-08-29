import { Server } from "socket.io";
import { ServiceManager } from "../managers/ServiceManager.js";

const serviceManager = new ServiceManager();
let io = null;

export const setupSocket = (httpServer) => {
  io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    // Escuchar el alta que manda el browser, persistir con el manager,
    // emitir la lista nueva a todos.

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });

  return io;
};

// Los controllers llaman esto después de un POST/PUT/DELETE de la API.
export const emitServicesUpdated = async () => {};

export const emitBookingsUpdated = (booking) => {};
