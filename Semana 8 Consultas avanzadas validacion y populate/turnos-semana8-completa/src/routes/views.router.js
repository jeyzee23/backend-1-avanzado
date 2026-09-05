import { Router } from "express";
import { ServicesService } from "../services/services.service.js";
import { BookingsService } from "../services/bookings.service.js";
import { servicesQuerySchema } from "../validations/common.validation.js";

const router = Router();
const servicesService = new ServicesService();
const bookingsService = new BookingsService();

const omitEmpty = (query = {}) => {
  const next = { ...query };
  for (const key of Object.keys(next)) {
    if (next[key] === "") delete next[key];
  }
  return next;
};

const toViewFilters = (query = {}) => ({
  category: query.category ?? "",
  available: query.available === undefined ? "" : String(query.available),
  sortBy: query.sortBy ?? "price",
  order: query.order ?? "asc",
  limit: query.limit ?? 10,
});

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

router.get("/services", async (req, res, next) => {
  try {
    const parsed = servicesQuerySchema.safeParse(omitEmpty(req.query));
    if (!parsed.success) {
      return res.status(400).render("services", {
        title: "Servicios",
        services: [],
        queryError: parsed.error.issues[0]?.message || "Query inválida",
        filters: toViewFilters(),
        totalDocs: 0,
        page: 1,
        totalPages: 0,
        hasPrevPage: false,
        hasNextPage: false,
      });
    }

    const result = await servicesService.list(parsed.data, { path: "/services" });
    res.render("services", {
      title: "Servicios",
      services: result.payload,
      filters: toViewFilters(parsed.data),
      filtersActive: Boolean(parsed.data.category || parsed.data.available !== undefined),
      totalDocs: result.totalDocs,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
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
