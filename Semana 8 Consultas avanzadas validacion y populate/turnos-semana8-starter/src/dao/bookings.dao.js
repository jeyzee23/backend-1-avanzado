import { BookingModel } from "../models/booking.model.js";

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

  findByIdPopulated(id) {
    return this.findById(id);
  }

  updateById(id, data) {
    return BookingModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }
}
