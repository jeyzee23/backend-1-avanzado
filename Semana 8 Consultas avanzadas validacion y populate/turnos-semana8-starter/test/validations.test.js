import { test } from "node:test";
import assert from "node:assert/strict";
import { createServiceSchema, updateServiceSchema } from "../src/validations/service.validation.js";
import { createBookingSchema } from "../src/validations/booking.validation.js";
import { objectIdSchema, servicesQuerySchema } from "../src/validations/common.validation.js";

test("createService rechaza name vacío y duration no numérica", () => {
  const missingName = createServiceSchema.safeParse({
    name: "  ",
    description: "ok",
    duration: 30,
    price: 10,
    category: "salud",
  });
  assert.equal(missingName.success, false);

  const stringDuration = createServiceSchema.safeParse({
    name: "Consulta",
    description: "ok",
    duration: "30",
    price: 10,
    category: "salud",
  });
  assert.equal(stringDuration.success, false);
});

test("createService acepta un body válido y default available=true", () => {
  const parsed = createServiceSchema.parse({
    name: "Consulta",
    description: "Control",
    duration: 30,
    price: 0,
    category: "salud",
  });
  assert.equal(parsed.available, true);
  assert.equal(parsed.price, 0);
});

test("updateService exige al menos un campo", () => {
  const empty = updateServiceSchema.safeParse({});
  assert.equal(empty.success, false);
});

test("createBooking rechaza email inválido", () => {
  const parsed = createBookingSchema.safeParse({
    clientName: "Laura",
    clientEmail: "laura",
    date: "2026-09-10",
    time: "10:00",
  });
  assert.equal(parsed.success, false);
});

test("objectId rechaza ids de la semana 7 y acepta hex de 24", () => {
  assert.equal(objectIdSchema.safeParse("1").success, false);
  assert.equal(objectIdSchema.safeParse("abc").success, false);
  assert.equal(objectIdSchema.safeParse("65f1abc").success, false);
  assert.equal(objectIdSchema.safeParse("65f1abc65f1abc65f1abc65f").success, true);
});

test("available=false no se convierte en true", () => {
  const parsed = servicesQuerySchema.parse({ available: "false" });
  assert.equal(parsed.available, false);
});

test("paginación inválida o fuera de tope falla", () => {
  assert.equal(servicesQuerySchema.safeParse({ page: "0" }).success, false);
  assert.equal(servicesQuerySchema.safeParse({ page: "abc" }).success, false);
  assert.equal(servicesQuerySchema.safeParse({ limit: "100" }).success, false);
});

test("sort=desc de compatibilidad ordena por price", () => {
  const parsed = servicesQuerySchema.parse({ sort: "desc" });
  assert.equal(parsed.sortBy, "price");
  assert.equal(parsed.order, "desc");
});

test("sortBy y order de la consigna se conservan", () => {
  const parsed = servicesQuerySchema.parse({ sortBy: "duration", order: "asc", page: "2", limit: "5" });
  assert.equal(parsed.sortBy, "duration");
  assert.equal(parsed.order, "asc");
  assert.equal(parsed.page, 2);
  assert.equal(parsed.limit, 5);
});

test("query vacía aplica defaults de página", () => {
  const parsed = servicesQuerySchema.parse({});
  assert.equal(parsed.page, 1);
  assert.equal(parsed.limit, 10);
  assert.equal(parsed.sortBy, "price");
  assert.equal(parsed.order, "asc");
});
