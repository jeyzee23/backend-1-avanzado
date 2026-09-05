import { BookingModel } from "../models/booking.model.js";

// path: el campo ref adentro del array. select: qué campos del servicio traer (sin seedKey).
const SERVICE_POPULATE = {
  path: "services.service",
  select: "name description duration price category available",
};

export class BookingsDAO {
  create(data) {
    return BookingModel.create(data);
  }

  findAll() {
    return BookingModel.find().sort({ createdAt: -1 }).lean();
  }

  findById(id) {
    return BookingModel.findById(id).lean();
  }

  // Solo el detalle hidrata. El listado (findAll) sigue con ObjectIds.
  // La reserva guarda { service: ObjectId, quantity }; populate rellena name/price al LEER.
  findByIdPopulated(id) {
    return BookingModel.findById(id).populate(SERVICE_POPULATE).lean();
  }

  updateById(id, data) {
    return BookingModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }
}
