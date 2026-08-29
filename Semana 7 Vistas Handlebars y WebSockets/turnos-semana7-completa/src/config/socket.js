import { Server } from "socket.io";
import { ServiceManager } from "../managers/ServiceManager.js";

const serviceManager = new ServiceManager();
let io = null;

export const setupSocket = (httpServer) => {
  io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    // El browser manda un servicio nuevo desde /realtime
    socket.on("createService", async (payload) => {
      try {
        await serviceManager.addService(payload);
        const services = await serviceManager.getServices();
        io.emit("servicesUpdated", services);
      } catch (error) {
        socket.emit("serviceError", { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });

  return io;
};

export const emitServicesUpdated = async () => {
  if (!io) return;
  const services = await serviceManager.getServices();
  io.emit("servicesUpdated", services);
};

export const emitBookingsUpdated = (booking) => {
  if (!io) return;
  io.emit("bookingsUpdated", booking);
};
