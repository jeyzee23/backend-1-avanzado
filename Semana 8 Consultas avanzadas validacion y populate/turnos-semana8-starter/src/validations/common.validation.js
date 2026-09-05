import { z } from "zod";
import { applySortCompatibility, DEFAULT_LIMIT, MAX_LIMIT } from "../utils/service-query.js";

export const objectIdSchema = z.string();

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

export const servicesQuerySchema = z
  .object({
  })
  .transform((query) => {
    const compatible = applySortCompatibility(query);
    return {
      ...compatible,
      sortBy: compatible.sortBy ?? "price",
      order: compatible.order ?? "asc",
      page: compatible.page ?? 1,
      limit: compatible.limit ?? DEFAULT_LIMIT,
    };
  });
