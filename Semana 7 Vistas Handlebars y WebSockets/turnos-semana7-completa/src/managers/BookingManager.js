import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { ServiceManager } from "./ServiceManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BookingManager {
  constructor(filePath = path.join(__dirname, "../data/bookings.json")) {
    this.path = filePath;
    this.serviceManager = new ServiceManager();
  }

  async readBookings() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log("Error al leer bookings.json:", error.message);
      return [];
    }
  }

  async writeBookings(bookings) {
    await fs.writeFile(this.path, JSON.stringify(bookings, null, 2));
  }

  async getBookings() {
    return this.readBookings();
  }

  async getBookingById(id) {
    const bookings = await this.readBookings();
    return bookings.find((booking) => booking.id === Number(id)) || null;
  }

  // La reserva guarda ids. Esta función “hidrata” el nombre para la vista.
  // En la Semana 8 esto lo hace populate de Mongoose.
  async getBookingWithServices(id) {
    const booking = await this.getBookingById(id);
    if (!booking) return null;

    const services = await Promise.all(
      booking.services.map(async (item) => {
        const service = await this.serviceManager.getServiceById(item.service);
        return {
          service: item.service,
          quantity: item.quantity,
          name: service?.name ?? `Servicio #${item.service}`,
          price: service?.price ?? 0,
        };
      })
    );

    return { ...booking, services };
  }

  async createBooking(bookingData = {}) {
    const bookings = await this.readBookings();
    const id = bookings.length > 0 ? bookings[bookings.length - 1].id + 1 : 1;

    const newBooking = {
      id,
      clientName: bookingData.clientName || "Cliente",
      clientEmail: bookingData.clientEmail || "",
      date: bookingData.date || null,
      time: bookingData.time || null,
      status: bookingData.status || "pending",
      services: [],
    };

    bookings.push(newBooking);
    await this.writeBookings(bookings);
    return newBooking;
  }

  async addServiceToBooking(bookingId, serviceId) {
    const bookings = await this.readBookings();
    const bookingIndex = bookings.findIndex(
      (booking) => booking.id === Number(bookingId)
    );

    if (bookingIndex === -1) {
      throw new Error("Reserva no encontrada");
    }

    const service = await this.serviceManager.getServiceById(serviceId);
    if (!service) {
      throw new Error(`No existe un servicio con id ${serviceId}`);
    }

    const booking = bookings[bookingIndex];
    const existing = booking.services.find(
      (item) => item.service === Number(serviceId)
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      booking.services.push({
        service: Number(serviceId),
        quantity: 1,
      });
    }

    await this.writeBookings(bookings);
    return booking;
  }
}
