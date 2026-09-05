import { Router } from "express";
import { ServicesService } from "../services/services.service.js";
import { BookingsService } from "../services/bookings.service.js";

const router = Router();
const servicesService = new ServicesService();
const bookingsService = new BookingsService();

router.get("/", async (_req, res, next) => {
  try {
    const [services, bookings] = await Promise.all([
      servicesService.listAll(),
      bookingsService.list(),
    ]);

    res.render("home", {
      title: "Tablero",
      servicesCount: services.length,
      bookingsCount: bookings.length,
      availableCount: services.filter((service) => service.available).length,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/services", async (_req, res, next) => {
  try {
    const services = await servicesService.listAll();
    res.render("services", {
      title: "Servicios",
      services,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/services/:sid", async (req, res, next) => {
  try {
    const service = await servicesService.getById(req.params.sid);
    res.render("service-detail", {
      title: service.name,
      service,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).render("not-found", {
        title: "No encontrado",
        message: `No existe el servicio ${req.params.sid}`,
      });
    }
    next(error);
  }
});

router.get("/bookings", async (_req, res, next) => {
  try {
    const bookings = await bookingsService.list();
    res.render("bookings", {
      title: "Reservas",
      bookings,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/bookings/:bid", async (req, res, next) => {
  try {
    const booking = await bookingsService.getById(req.params.bid, { populate: true });
    res.render("booking-detail", {
      title: `Reserva de ${booking.clientName}`,
      booking,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).render("not-found", {
        title: "No encontrado",
        message: `No existe la reserva ${req.params.bid}`,
      });
    }
    next(error);
  }
});

router.get("/realtime", async (_req, res, next) => {
  try {
    const services = await servicesService.listAll();
    res.render("realtime", {
      title: "Tiempo real",
      services,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
