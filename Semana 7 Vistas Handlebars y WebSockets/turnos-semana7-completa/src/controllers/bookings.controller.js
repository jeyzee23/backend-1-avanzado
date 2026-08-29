import { BookingManager } from "../managers/BookingManager.js";
import { emitBookingsUpdated } from "../config/socket.js";

const bookingManager = new BookingManager();

export const getBookings = async (req, res) => {
  try {
    const bookings = await bookingManager.getBookings();
    res.status(200).json({ status: "success", payload: bookings });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener las reservas" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const booking = await bookingManager.createBooking(req.body);
    emitBookingsUpdated(booking);
    res.status(201).json({ status: "success", payload: booking });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { bid } = req.params;
    const booking = await bookingManager.getBookingById(Number(bid));

    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Reserva no encontrada",
      });
    }

    res.status(200).json({ status: "success", payload: booking });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener la reserva" });
  }
};

export const addServiceToBooking = async (req, res) => {
  try {
    const { bid, sid } = req.params;
    const booking = await bookingManager.addServiceToBooking(Number(bid), Number(sid));
    emitBookingsUpdated(booking);
    const statusCode = 200;
    res.status(statusCode).json({ status: "success", payload: booking });
  } catch (error) {
    const statusCode = error.message.includes("no encontrada") ? 404 : 400;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};
