import { BookingsService } from "../services/bookings.service.js";
import { emitBookingsUpdated } from "../config/socket.js";

const bookingsService = new BookingsService();

export const getBookings = async (_req, res, next) => {
  try {
    const bookings = await bookingsService.list();
    res.status(200).json({ status: "success", payload: bookings });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingsService.getById(req.validatedParams.bid, { populate: true });
    res.status(200).json({ status: "success", payload: booking });
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingsService.create(req.validatedBody);
    emitBookingsUpdated(booking);
    res.status(201).json({ status: "success", payload: booking });
  } catch (error) {
    next(error);
  }
};

export const addServiceToBooking = async (req, res, next) => {
  try {
    const quantity = req.validatedBody?.quantity || 1;
    const booking = await bookingsService.addService(
      req.validatedParams.bid,
      req.validatedParams.sid,
      quantity
    );
    emitBookingsUpdated(booking);
    res.status(200).json({ status: "success", payload: booking });
  } catch (error) {
    next(error);
  }
};
