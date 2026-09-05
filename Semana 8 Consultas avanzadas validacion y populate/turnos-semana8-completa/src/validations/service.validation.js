import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().trim().min(1, "name es obligatorio"),
  description: z.string().trim().min(1, "description es obligatorio"),
  duration: z
    .number({ invalid_type_error: "duration debe ser numérico" })
    .int("duration debe ser un entero")
    .positive("duration debe ser mayor a 0"),
  price: z
    .number({ invalid_type_error: "price debe ser numérico" })
    .nonnegative("price no puede ser negativo"),
  category: z.string().trim().min(1, "category es obligatorio"),
  available: z.boolean().optional().default(true),
});

export const updateServiceSchema = z
  .object({
    name: z.string().trim().min(1, "name no puede estar vacío").optional(),
    description: z.string().trim().min(1, "description no puede estar vacío").optional(),
    duration: z
      .number({ invalid_type_error: "duration debe ser numérico" })
      .int()
      .positive("duration debe ser mayor a 0")
      .optional(),
    price: z
      .number({ invalid_type_error: "price debe ser numérico" })
      .nonnegative("price no puede ser negativo")
      .optional(),
    category: z.string().trim().min(1, "category no puede estar vacío").optional(),
    available: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debés enviar al menos un campo para actualizar",
  });
