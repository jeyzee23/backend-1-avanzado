import { z } from "zod";
import { objectIdSchema } from "./common.validation.js";

const bookingServiceItemSchema = z.object({
  service: objectIdSchema,
  quantity: z
    .number({ invalid_type_error: "quantity debe ser numérico" })
    .int()
    .positive("quantity debe ser mayor a 0")
    .optional()
    .default(1),
});

export const createBookingSchema = z.object({
  clientName: z.string().trim().min(1, "clientName es obligatorio"),
  clientEmail: z.string().trim().email("clientEmail debe ser un email válido"),
  date: z.string().trim().min(1, "date es obligatorio"),
  time: z.string().trim().min(1, "time es obligatorio"),
  status: z.enum(["pending", "confirmed", "cancelled"]).optional().default("pending"),
  services: z.array(bookingServiceItemSchema).optional().default([]),
});

export const addServiceBodySchema = z
  .object({
    quantity: z
      .number({ invalid_type_error: "quantity debe ser numérico" })
      .int()
      .positive("quantity debe ser mayor a 0")
      .optional(),
  })
  .optional()
  .default({});
