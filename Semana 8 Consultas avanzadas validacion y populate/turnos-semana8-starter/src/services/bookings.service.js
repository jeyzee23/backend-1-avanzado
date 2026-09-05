import { BookingsRepository } from "../repositories/bookings.repository.js";
import { ServicesRepository } from "../repositories/services.repository.js";
import { HttpError } from "../utils/http-error.js";

export class BookingsService {
  constructor(
    bookingsRepository = new BookingsRepository(),
    servicesRepository = new ServicesRepository()
  ) {
    this.bookingsRepository = bookingsRepository;
    this.servicesRepository = servicesRepository;
  }

  list() {
    return this.bookingsRepository.list();
  }

  async getById(id, { populate = false } = {}) {
    const booking = populate
      ? await this.bookingsRepository.getByIdPopulated(id)
      : await this.bookingsRepository.getById(id);

    if (!booking) {
      throw new HttpError(404, "Reserva no encontrada");
    }

    return booking;
  }

  async create(data) {
    const services = await this.#normalizeServiceItems(data.services || []);

    return this.bookingsRepository.create({
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      date: data.date,
      time: data.time,
      status: data.status || "pending",
      services,
    });
  }

  async addService(bookingId, serviceId, quantity = 1) {
    const booking = await this.bookingsRepository.getById(bookingId);
    if (!booking) {
      throw new HttpError(404, "Reserva no encontrada");
    }

    const service = await this.#requireAvailableService(serviceId);
    const nextServices = this.#upsertServiceItem(booking.services, service.id, quantity);

    await this.bookingsRepository.updateById(bookingId, { services: nextServices });
    return this.bookingsRepository.getByIdPopulated(bookingId);
  }

  async #normalizeServiceItems(items) {
    const normalized = [];

    for (const item of items) {
      const service = await this.#requireAvailableService(item.service);
      const existing = normalized.find((entry) => entry.service === service.id);

      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        normalized.push({
          service: service.id,
          quantity: item.quantity || 1,
        });
      }
    }

    return normalized;
  }

  async #requireAvailableService(serviceId) {
    const service = await this.servicesRepository.getById(serviceId);
    if (!service) {
      throw new HttpError(404, "Servicio no encontrado");
    }
    if (!service.available) {
      throw new HttpError(400, "El servicio no está disponible");
    }
    return service;
  }

  #upsertServiceItem(services, serviceId, quantity) {
    const next = services.map((item) => ({
      service: typeof item.service === "object" ? item.service.id : item.service,
      quantity: item.quantity,
    }));

    const existing = next.find((item) => item.service === serviceId);
    if (existing) {
      existing.quantity += quantity;
      return next;
    }

    next.push({ service: serviceId, quantity });
    return next;
  }
}
