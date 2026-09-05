import { Router } from "express";
import {
  getBookings,
  createBooking,
  getBookingById,
  addServiceToBooking,
} from "../controllers/bookings.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  bookingIdParamsSchema,
  bookingServiceParamsSchema,
} from "../validations/common.validation.js";
import {
  addServiceBodySchema,
  createBookingSchema,
} from "../validations/booking.validation.js";

const router = Router();

router.get("/", getBookings);
router.post("/", validate(createBookingSchema, "body"), createBooking);
router.get("/:bid", validate(bookingIdParamsSchema, "params"), getBookingById);
router.post(
  "/:bid/services/:sid",
  validate(bookingServiceParamsSchema, "params"),
  validate(addServiceBodySchema, "body"),
  addServiceToBooking
);

export default router;
