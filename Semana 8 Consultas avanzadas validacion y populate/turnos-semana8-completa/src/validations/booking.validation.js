import { z } from "zod";
import { objectIdSchema } from "./common.validation.js";

// Un ítem del array services al crear la reserva: { service: ObjectId, quantity }.
// Zod solo chequea el formato del id. Si ese servicio no existe, el 404 lo tira el service.
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
  // "laura" → 400. "laura@example.com" → ok. Existencia del cliente no se valida.
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
