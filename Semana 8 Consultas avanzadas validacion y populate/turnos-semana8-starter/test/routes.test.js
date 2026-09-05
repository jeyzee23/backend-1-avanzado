import { after, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";
import {
  buildTestApp,
  clearTestDb,
  closeTestDb,
  connectTestDb,
  sampleService,
} from "./helpers.js";
import { ServiceModel } from "../src/models/service.model.js";
import { BookingModel } from "../src/models/booking.model.js";

const app = buildTestApp();
let mongo;

before(async () => {
  mongo = await connectTestDb();
});

after(async () => {
  await closeTestDb(mongo);
});

beforeEach(async () => {
  await clearTestDb();
});

const createService = (body) => request(app).post("/api/services").send(body);

test("GET /health responde ok", async () => {
  const response = await request(app).get("/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
});

test("POST /api/services inválido responde 400 y no toca Mongo", async () => {
  const response = await createService({
    name: "",
    description: "x",
    duration: 30,
    price: 10,
    category: "salud",
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.status, "error");
  assert.ok(Array.isArray(response.body.details));
  assert.equal(await ServiceModel.countDocuments(), 0);
});

test("POST /api/services válido crea y GET por id lo devuelve", async () => {
  const created = await createService(sampleService());
  assert.equal(created.status, 201);
  assert.equal(created.body.payload.name, "Consulta clínica");

  const fetched = await request(app).get(`/api/services/${created.body.payload.id}`);
  assert.equal(fetched.status, 200);
  assert.equal(fetched.body.payload.category, "salud");
});

test("GET /api/services filtra category y available=false", async () => {
  await ServiceModel.create([
    sampleService({ name: "A", category: "salud", available: true, price: 10 }),
    sampleService({ name: "B", category: "salud", available: false, price: 20 }),
    sampleService({ name: "C", category: "estetica", available: false, price: 30 }),
  ]);

  const hidden = await request(app).get("/api/services").query({ available: "false" });
  assert.equal(hidden.status, 200);
  assert.equal(hidden.body.totalDocs, 2);
  assert.equal(hidden.body.payload.every((item) => item.available === false), true);

  const combo = await request(app)
    .get("/api/services")
    .query({ category: "salud", available: "false" });
  assert.equal(combo.body.totalDocs, 1);
  assert.equal(combo.body.payload[0].name, "B");
});

test("GET /api/services pagina con metadata del count filtrado", async () => {
  await ServiceModel.create(
    Array.from({ length: 7 }, (_, index) =>
      sampleService({
        name: `Salud ${index + 1}`,
        category: "salud",
        price: (index + 1) * 1000,
      })
    )
  );
  await ServiceModel.create(sampleService({ name: "Otro", category: "estetica", price: 1 }));

  const response = await request(app).get("/api/services").query({
    category: "salud",
    page: 2,
    limit: 3,
    sortBy: "price",
    order: "asc",
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.totalDocs, 7);
  assert.equal(response.body.totalPages, 3);
  assert.equal(response.body.page, 2);
  assert.equal(response.body.limit, 3);
  assert.equal(response.body.payload.length, 3);
  assert.equal(response.body.payload[0].price, 4000);
  assert.equal(response.body.hasPrevPage, true);
  assert.equal(response.body.hasNextPage, true);
  assert.match(response.body.nextLink, /page=3/);
});

test("GET /api/services con page=0 o limit alto responde 400", async () => {
  const page = await request(app).get("/api/services").query({ page: 0 });
  const limit = await request(app).get("/api/services").query({ limit: 100 });
  assert.equal(page.status, 400);
  assert.equal(limit.status, 400);
});

test("params inválidos son 400; ObjectId inexistente es 404", async () => {
  const bad = await request(app).get("/api/services/1");
  const missing = await request(app).get("/api/services/65f1abc65f1abc65f1abc65f");
  assert.equal(bad.status, 400);
  assert.equal(missing.status, 404);
});

test("POST /api/bookings con email inválido es 400 y no persiste", async () => {
  const response = await request(app).post("/api/bookings").send({
    clientName: "Laura",
    clientEmail: "laura",
    date: "2026-09-10",
    time: "10:00",
  });

  assert.equal(response.status, 400);
  assert.equal(await BookingModel.countDocuments(), 0);
});

test("detalle de reserva usa populate y select de campos", async () => {
  const service = await ServiceModel.create(sampleService({ name: "Yoga" }));
  const booking = await BookingModel.create({
    clientName: "Laura Pérez",
    clientEmail: "laura@example.com",
    date: "2026-09-10",
    time: "10:00",
    status: "confirmed",
    services: [{ service: service._id, quantity: 2 }],
  });

  const response = await request(app).get(`/api/bookings/${booking._id}`);
  assert.equal(response.status, 200);
  assert.equal(response.body.payload.services[0].quantity, 2);
  assert.equal(response.body.payload.services[0].service.name, "Yoga");
  assert.equal(response.body.payload.services[0].service.price, 15000);
  assert.equal(response.body.payload.services[0].service.seedKey, undefined);
});

test("agregar servicio incrementa quantity; inexistente 404; no disponible 400; id inválido 400", async () => {
  const available = await ServiceModel.create(sampleService({ name: "Disponible" }));
  const hidden = await ServiceModel.create(
    sampleService({ name: "Oculto", available: false, category: "bienestar" })
  );
  const booking = await request(app).post("/api/bookings").send({
    clientName: "Martín Soto",
    clientEmail: "martin@example.com",
    date: "2026-09-12",
    time: "16:30",
  });
  const bid = booking.body.payload.id;

  const invalid = await request(app).post(`/api/bookings/${bid}/services/1`);
  assert.equal(invalid.status, 400);

  const missing = await request(app).post(
    `/api/bookings/${bid}/services/65f1abc65f1abc65f1abc65f`
  );
  assert.equal(missing.status, 404);

  const unavailable = await request(app).post(`/api/bookings/${bid}/services/${hidden._id}`);
  assert.equal(unavailable.status, 400);

  const first = await request(app).post(`/api/bookings/${bid}/services/${available._id}`);
  const second = await request(app).post(`/api/bookings/${bid}/services/${available._id}`);
  assert.equal(first.status, 200);
  assert.equal(second.body.payload.services[0].quantity, 2);
  assert.equal(second.body.payload.services[0].service.name, "Disponible");
});

test("listado de reservas no exige populate; vistas home responden", async () => {
  const service = await ServiceModel.create(sampleService());
  await BookingModel.create({
    clientName: "Laura",
    clientEmail: "laura@example.com",
    date: "2026-09-10",
    time: "10:00",
    services: [{ service: service._id, quantity: 1 }],
  });

  const list = await request(app).get("/api/bookings");
  assert.equal(list.status, 200);
  assert.equal(typeof list.body.payload[0].services[0].service, "string");

  const home = await request(app).get("/");
  assert.equal(home.status, 200);
  assert.match(home.text, /Sistema de turnos/);
});
