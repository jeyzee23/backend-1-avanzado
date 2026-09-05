import { env } from "../config/env.config.js";
import { connectMongo, disconnectMongo } from "../config/mongo.js";
import { ServiceModel } from "../models/service.model.js";
import { BookingModel } from "../models/booking.model.js";
import { SEED_BOOKINGS, SEED_PREFIX, SEED_SERVICES } from "./seed-data.js";

export const upsertClassSeed = async () => {
  for (const service of SEED_SERVICES) {
    await ServiceModel.updateOne(
      { seedKey: service.seedKey },
      { $set: service },
      { upsert: true }
    );
  }

  const seededServices = await ServiceModel.find({
    seedKey: { $in: SEED_SERVICES.map((service) => service.seedKey) },
  }).select("+seedKey");

  const serviceIdByKey = new Map(
    seededServices.map((service) => [service.seedKey, service._id])
  );

  for (const booking of SEED_BOOKINGS) {
    const services = booking.serviceKeys.map((seedKey) => {
      const serviceId = serviceIdByKey.get(seedKey);
      if (!serviceId) {
        throw new Error(`No se encontró el servicio de clase ${seedKey}`);
      }
      return { service: serviceId, quantity: 1 };
    });

    await BookingModel.updateOne(
      { seedKey: booking.seedKey },
      {
        $set: {
          seedKey: booking.seedKey,
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          date: booking.date,
          time: booking.time,
          status: booking.status,
          services,
        },
      },
      { upsert: true }
    );
  }

  return {
    services: SEED_SERVICES.length,
    bookings: SEED_BOOKINGS.length,
  };
};

const isMain = process.argv[1] && process.argv[1].replaceAll("\\", "/").endsWith("/seed.js");

if (isMain) {
  try {
    await connectMongo();
    const result = await upsertClassSeed();
    console.log(
      `Semilla ${SEED_PREFIX} lista: ${result.services} servicios y ${result.bookings} reservas de clase (idempotente, sin borrar el resto).`
    );
    console.log(`Base usada: ${env.MONGO_DB_NAME}`);
    await disconnectMongo();
  } catch (error) {
    console.error("No se pudo sembrar:", error.message);
    await disconnectMongo().catch(() => {});
    process.exit(1);
  }
}
