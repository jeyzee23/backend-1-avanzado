import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../src/app.js";
import { ServiceModel } from "../src/models/service.model.js";
import { BookingModel } from "../src/models/booking.model.js";

export const connectTestDb = async () => {
  const mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), { dbName: "turnos_test" });
  return mongo;
};

export const closeTestDb = async (mongo) => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
};

export const clearTestDb = async () => {
  await ServiceModel.deleteMany({});
  await BookingModel.deleteMany({});
};

export const buildTestApp = () => createApp();

export const sampleService = (overrides = {}) => ({
  name: "Consulta clínica",
  description: "Control general",
  duration: 30,
  price: 15000,
  category: "salud",
  available: true,
  ...overrides,
});
