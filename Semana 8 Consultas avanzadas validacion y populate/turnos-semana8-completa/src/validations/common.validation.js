import { z } from "zod";
import { applySortCompatibility, DEFAULT_LIMIT, MAX_LIMIT } from "../utils/service-query.js";

// Zod = formato del request. No pregunta si el doc existe en Mongo.
// "/api/services/1" → 400. Un ObjectId de 24 hex que no está en la base → 404 del service.
export const objectIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "El id debe ser un ObjectId de 24 caracteres hexadecimales");

export const serviceIdParamsSchema = z.object({
  sid: objectIdSchema,
});

export const bookingIdParamsSchema = z.object({
  bid: objectIdSchema,
});

export const bookingServiceParamsSchema = z.object({
  bid: objectIdSchema,
  sid: objectIdSchema,
});

// En la URL todo es string: available=false.
// z.coerce.boolean() rompería esto: Boolean("false") === true.
// Por eso: solo acepta "true"|"false" y después lo pasa a boolean real.
const availableQuerySchema = z
  .enum(["true", "false"], {
    errorMap: () => ({ message: "available debe ser true o false" }),
  })
  .transform((value) => value === "true");

// Query de GET /api/services. page=0 o limit=100 → 400, no llega a Mongo.
export const servicesQuerySchema = z
  .object({
    category: z.string().trim().min(1).optional(),
    available: availableQuerySchema.optional(),
    // coerce: "?page=2" llega como string "2" y lo convierte a number 2.
    page: z.coerce
      .number({ invalid_type_error: "page debe ser un número entero" })
      .int("page debe ser un entero")
      .min(1, "page debe ser mayor o igual a 1")
      .default(1),
    limit: z.coerce
      .number({ invalid_type_error: "limit debe ser un número entero" })
      .int("limit debe ser un entero")
      .min(1, "limit debe ser mayor o igual a 1")
      .max(MAX_LIMIT, `limit no puede ser mayor a ${MAX_LIMIT}`)
      .default(DEFAULT_LIMIT),
    sortBy: z.enum(["price", "duration", "name"], {
      errorMap: () => ({ message: "sortBy debe ser price, duration o name" }),
    }).optional(),
    order: z.enum(["asc", "desc"], {
      errorMap: () => ({ message: "order debe ser asc o desc" }),
    }).optional(),
    sort: z.enum(["asc", "desc"], {
      errorMap: () => ({ message: "sort debe ser asc o desc" }),
    }).optional(),
  })
  .transform((query) => {
    const compatible = applySortCompatibility(query);
    return {
      ...compatible,
      sortBy: compatible.sortBy ?? "price",
      order: compatible.order ?? "asc",
    };
  });
