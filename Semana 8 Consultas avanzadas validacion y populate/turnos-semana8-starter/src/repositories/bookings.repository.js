import { BookingsDAO } from "../dao/bookings.dao.js";
import { asPublicBooking } from "../utils/serialize.js";

export class BookingsRepository {
  constructor(dao = new BookingsDAO()) {
    this.dao = dao;
  }

  async create(data) {
    const created = await this.dao.create(data);
    return asPublicBooking(created.toObject ? created.toObject() : created);
  }

  async list() {
    const items = await this.dao.findAll();
    return items.map(asPublicBooking);
  }

  async getById(id) {
    return asPublicBooking(await this.dao.findById(id));
  }

  async getByIdPopulated(id) {
    return asPublicBooking(await this.dao.findByIdPopulated(id));
  }

  async updateById(id, data) {
    return asPublicBooking(await this.dao.updateById(id, data));
  }
}
