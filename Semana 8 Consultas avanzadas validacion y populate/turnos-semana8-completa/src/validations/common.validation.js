import { z } from "zod";
import { applySortCompatibility, DEFAULT_LIMIT, MAX_LIMIT } from "../utils/service-query.js";

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

const availableQuerySchema = z
  .enum(["true", "false"], {
    errorMap: () => ({ message: "available debe ser true o false" }),
  })
  .transform((value) => value === "true");

export const servicesQuerySchema = z
  .object({
    category: z.string().trim().min(1).optional(),
    available: availableQuerySchema.optional(),
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
