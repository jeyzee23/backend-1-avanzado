import { ServiceModel } from "../models/service.model.js";

export class ServicesDAO {
  create(data) {
    return ServiceModel.create(data);
  }

  findById(id) {
    return ServiceModel.findById(id).lean();
  }

  findAll() {
    return ServiceModel.find().sort({ name: 1 }).lean();
  }

  async findPaginated(_filter, _options) {
    const items = await ServiceModel.find().lean();
    return { items, totalDocs: items.length };
  }

  updateById(id, data) {
    return ServiceModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async deleteById(id) {
    const deleted = await ServiceModel.findByIdAndDelete(id);
    return Boolean(deleted);
  }
}
