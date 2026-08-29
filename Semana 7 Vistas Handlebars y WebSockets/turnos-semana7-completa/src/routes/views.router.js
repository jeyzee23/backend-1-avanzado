import { Router } from "express";
import { ServiceManager } from "../managers/ServiceManager.js";
import { BookingManager } from "../managers/BookingManager.js";

const router = Router();
const serviceManager = new ServiceManager();
const bookingManager = new BookingManager();

router.get("/", async (req, res) => {
  const [services, bookings] = await Promise.all([
    serviceManager.getServices(),
    bookingManager.getBookings(),
  ]);

  res.render("home", {
    title: "Tablero",
    servicesCount: services.length,
    bookingsCount: bookings.length,
    availableCount: services.filter((service) => service.available).length,
  });
});

router.get("/services", async (req, res) => {
  const services = await serviceManager.getServices();
  res.render("services", {
    title: "Servicios",
    services,
  });
});

router.get("/services/:sid", async (req, res) => {
  const service = await serviceManager.getServiceById(Number(req.params.sid));

  if (!service) {
    return res.status(404).render("not-found", {
      title: "No encontrado",
      message: `No existe el servicio ${req.params.sid}`,
    });
  }

  res.render("service-detail", {
    title: service.name,
    service,
  });
});

router.get("/bookings", async (req, res) => {
  const bookings = await bookingManager.getBookings();
  res.render("bookings", {
    title: "Reservas",
    bookings,
  });
});

router.get("/bookings/:bid", async (req, res) => {
  const booking = await bookingManager.getBookingWithServices(Number(req.params.bid));

  if (!booking) {
    return res.status(404).render("not-found", {
      title: "No encontrado",
      message: `No existe la reserva ${req.params.bid}`,
    });
  }

  res.render("booking-detail", {
    title: `Reserva #${booking.id}`,
    booking,
  });
});

router.get("/realtime", async (req, res) => {
  const services = await serviceManager.getServices();
  res.render("realtime", {
    title: "Tiempo real",
    services,
  });
});

export default router;
