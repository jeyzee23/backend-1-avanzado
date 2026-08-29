import { Router } from "express";
import { ServiceManager } from "../managers/ServiceManager.js";
import { BookingManager } from "../managers/BookingManager.js";

const router = Router();
const serviceManager = new ServiceManager();
const bookingManager = new BookingManager();

// Este router SOLO renderiza HTML. La API queda en /api/*.
// Hoy todavía responde JSON para que veas que los datos ya están.

router.get("/", async (req, res) => {
  const services = await serviceManager.getServices();
  const bookings = await bookingManager.getBookings();
  const availableCount = services.filter((service) => service.available).length;

  res.json({
    hint: "Renderizar vista home",
    servicesCount: services.length,
    availableCount,
    bookingsCount: bookings.length,
  });
});

router.get("/services", async (req, res) => {
  const services = await serviceManager.getServices();
  res.json({ hint: "Renderizar vista services", services });
});

router.get("/services/:sid", async (req, res) => {
  const service = await serviceManager.getServiceById(Number(req.params.sid));
  if (!service) {
    return res.status(404).json({ message: "Servicio no encontrado" });
  }
  res.json({ hint: "Renderizar vista service-detail", service });
});

router.get("/bookings", async (req, res) => {
  const bookings = await bookingManager.getBookings();
  res.json({ hint: "Renderizar vista bookings", bookings });
});

router.get("/bookings/:bid", async (req, res) => {
  const booking = await bookingManager.getBookingWithServices(Number(req.params.bid));
  if (!booking) {
    return res.status(404).json({ message: "Reserva no encontrada" });
  }
  res.json({ hint: "Renderizar vista booking-detail", booking });
});

router.get("/realtime", async (req, res) => {
  const services = await serviceManager.getServices();
  res.json({ hint: "Renderizar vista realtime", services });
});

export default router;
